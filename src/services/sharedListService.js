// Service Firestore des listes partagées.
//
// Modèle de données (nouveau) :
//   sharedLists/{listId} {
//     name, ownerId, ownerEmail, createdAt,
//     roles: { [uid]: 'admin' | 'editor' | 'viewer' },
//     memberIds: string[]  // miroir des clés de `roles` pour pouvoir
//                          // filtrer avec array-contains (Firestore ne
//                          // supporte pas `where` sur les clés d'une map)
//     memberEmails: string[] // idem pour la lecture rapide UI
//     emailToUid: { [email]: uid } // correspondance email→uid
//   }
//
// Anciens docs : `members` (array d'uids) sans `roles`. Les fonctions de
// lecture gèrent ce fallback pour ne pas casser les listes existantes.

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const listsCol = () => collection(db, "sharedLists");
const tasksCol = (listId) => collection(db, "sharedLists", listId, "tasks");
const listDoc = (listId) => doc(db, "sharedLists", listId);
const taskDoc = (listId, taskId) =>
  doc(db, "sharedLists", listId, "tasks", taskId);

export const ROLES = { ADMIN: "admin", EDITOR: "editor", VIEWER: "viewer" };

// Récupère le rôle d'un utilisateur sur une liste. Fallback vers 'editor'
// pour les anciens docs sans map `roles` (comportement historique où tous
// les membres pouvaient éditer).
export function getUserRole(list, uid) {
  if (!list || !uid) return null;
  if (list.ownerId === uid) return ROLES.ADMIN;
  if (list.roles && list.roles[uid]) return list.roles[uid];
  if (Array.isArray(list.members) && list.members.includes(uid)) {
    return ROLES.EDITOR;
  }
  return null;
}

export const canEdit = (role) =>
  role === ROLES.ADMIN || role === ROLES.EDITOR;
export const canManageMembers = (role) => role === ROLES.ADMIN;

async function chargerListe(listId) {
  const snap = await getDoc(listDoc(listId));
  if (!snap.exists()) throw new Error("Liste introuvable.");
  return { id: snap.id, ...snap.data() };
}

function assertPeutEditer(list, uid) {
  if (!canEdit(getUserRole(list, uid))) {
    throw new Error("Accès refusé : vous n'avez pas les droits d'édition.");
  }
}

function assertPeutGererMembres(list, uid) {
  if (!canManageMembers(getUserRole(list, uid))) {
    throw new Error("Accès refusé : seuls les admins peuvent gérer les membres.");
  }
}

export async function createSharedList(userId, userEmail, name) {
  try {
    const ref = await addDoc(listsCol(), {
      name: name.trim(),
      ownerId: userId,
      ownerEmail: userEmail,
      roles: { [userId]: ROLES.ADMIN },
      memberIds: [userId],
      memberEmails: [userEmail],
      emailToUid: { [userEmail]: userId },
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("Erreur lors de la création de la liste partagée :", error);
    throw error;
  }
}

// Requête double : nouveaux docs via memberIds, anciens via members.
// `array-contains` n'acceptant qu'un champ, on cumule les résultats.
const listsQueryByUid = (uid) =>
  query(listsCol(), where("memberIds", "array-contains", uid));
const listsQueryLegacy = (uid) =>
  query(listsCol(), where("members", "array-contains", uid));

const trierListesParDate = (listes) =>
  [...listes].sort((a, b) => {
    const sa = a.createdAt?.seconds ?? Infinity;
    const sb = b.createdAt?.seconds ?? Infinity;
    return sb - sa;
  });

function fusionnerSansDoublon(a, b) {
  const vus = new Map();
  [...a, ...b].forEach((l) => vus.set(l.id, l));
  return Array.from(vus.values());
}

export async function getUserSharedLists(uid) {
  try {
    const [snap1, snap2] = await Promise.all([
      getDocs(listsQueryByUid(uid)),
      getDocs(listsQueryLegacy(uid)).catch(() => ({ docs: [] })),
    ]);
    const a = snap1.docs.map((d) => ({ id: d.id, ...d.data() }));
    const b = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
    return trierListesParDate(fusionnerSansDoublon(a, b));
  } catch (error) {
    console.error("Erreur lors de la récupération des listes partagées :", error);
    throw error;
  }
}

// Abonnement temps-réel : deux listeners combinés via un état mémorisé.
export function subscribeToSharedLists(uid, callback, onError) {
  let listeA = [];
  let listeB = [];
  const emit = () =>
    callback(trierListesParDate(fusionnerSansDoublon(listeA, listeB)));

  const unsub1 = onSnapshot(
    listsQueryByUid(uid),
    (snap) => {
      listeA = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      emit();
    },
    (error) => {
      console.error("Erreur lors de l'écoute des listes partagées :", error);
      if (typeof onError === "function") onError(error);
    },
  );

  let unsub2 = () => {};
  try {
    unsub2 = onSnapshot(
      listsQueryLegacy(uid),
      (snap) => {
        listeB = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        emit();
      },
      () => {},
    );
  } catch {
    // Ignore : les anciens docs sont optionnels
  }

  return () => {
    unsub1();
    unsub2();
  };
}

// Ajoute un membre par email. Comme il n'y a pas de collection `users`
// pour résoudre email→uid, on stocke seulement l'email ; l'uid sera
// renseigné au premier accès du membre via `linkCurrentUserToList`.
// Par défaut, nouveau membre = viewer (moins de risque).
export async function addMemberToList(listId, email, uid, role = ROLES.VIEWER) {
  try {
    const list = await chargerListe(listId);
    assertPeutGererMembres(list, uid);
    const emailNet = email.trim().toLowerCase();
    const nouveauxEmails = Array.from(new Set([...(list.memberEmails ?? []), emailNet]));
    await updateDoc(listDoc(listId), {
      memberEmails: nouveauxEmails,
      [`pendingRoles.${emailNet.replace(/\./g, "_")}`]: role,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du membre :", error);
    throw error;
  }
}

// Lie l'utilisateur courant à la liste quand il ouvre une liste pour la
// première fois (résolution email→uid). Idempotent.
export async function linkCurrentUserToList(listId, uid, email) {
  try {
    const list = await chargerListe(listId);
    const dejaLie = list.memberIds?.includes(uid) ?? false;
    if (dejaLie) return;
    if (!list.memberEmails?.includes(email)) return;
    const cle = email.replace(/\./g, "_");
    const rolePending = list.pendingRoles?.[cle] ?? ROLES.VIEWER;
    await updateDoc(listDoc(listId), {
      memberIds: Array.from(new Set([...(list.memberIds ?? []), uid])),
      [`roles.${uid}`]: rolePending,
      [`emailToUid.${email}`]: uid,
    });
  } catch (error) {
    console.error("Erreur lors de la liaison du membre :", error);
  }
}

export async function updateMemberRole(listId, targetUid, nouveauRole, currentUid) {
  try {
    const list = await chargerListe(listId);
    assertPeutGererMembres(list, currentUid);
    if (targetUid === list.ownerId) {
      throw new Error("Impossible de changer le rôle du propriétaire.");
    }
    if (!Object.values(ROLES).includes(nouveauRole)) {
      throw new Error("Rôle invalide.");
    }
    await updateDoc(listDoc(listId), { [`roles.${targetUid}`]: nouveauRole });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle :", error);
    throw error;
  }
}

export async function removeMemberFromList(listId, email, currentUid) {
  try {
    const list = await chargerListe(listId);
    assertPeutGererMembres(list, currentUid);
    if (email === list.ownerEmail) {
      throw new Error("Impossible de retirer le propriétaire.");
    }
    const targetUid = list.emailToUid?.[email] ?? null;
    const nouveauxEmails = (list.memberEmails ?? []).filter((e) => e !== email);
    const nouveauxIds = targetUid
      ? (list.memberIds ?? []).filter((u) => u !== targetUid)
      : (list.memberIds ?? []);
    const nouveauxRoles = { ...(list.roles ?? {}) };
    if (targetUid) delete nouveauxRoles[targetUid];
    const nouveauEmailToUid = { ...(list.emailToUid ?? {}) };
    delete nouveauEmailToUid[email];
    await updateDoc(listDoc(listId), {
      memberEmails: nouveauxEmails,
      memberIds: nouveauxIds,
      roles: nouveauxRoles,
      emailToUid: nouveauEmailToUid,
    });
  } catch (error) {
    console.error("Erreur lors du retrait du membre :", error);
    throw error;
  }
}

export async function deleteSharedList(listId, userId) {
  try {
    const list = await chargerListe(listId);
    if (list.ownerId !== userId) {
      throw new Error("Seul le propriétaire peut supprimer la liste.");
    }
    await deleteDoc(listDoc(listId));
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste partagée :", error);
    throw error;
  }
}

const tasksQuery = (listId) =>
  query(tasksCol(listId), orderBy("createdAt", "desc"));

export async function getSharedListTasks(listId) {
  try {
    const snap = await getDocs(tasksQuery(listId));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches partagées :", error);
    throw error;
  }
}

export async function addSharedTask(listId, task, uid, userEmail) {
  try {
    const list = await chargerListe(listId);
    assertPeutEditer(list, uid);
    const ref = await addDoc(tasksCol(listId), {
      title: task.title,
      priority: task.priority ?? "medium",
      completed: false,
      addedBy: uid,
      addedByEmail: userEmail ?? null,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche partagée :", error);
    throw error;
  }
}

export async function updateSharedTask(listId, taskId, updates, uid) {
  try {
    const list = await chargerListe(listId);
    assertPeutEditer(list, uid);
    await updateDoc(taskDoc(listId, taskId), updates);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche partagée :", error);
    throw error;
  }
}

export async function deleteSharedTask(listId, taskId, uid) {
  try {
    const list = await chargerListe(listId);
    assertPeutEditer(list, uid);
    await deleteDoc(taskDoc(listId, taskId));
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche partagée :", error);
    throw error;
  }
}

export function subscribeToSharedTasks(listId, callback, onError) {
  try {
    return onSnapshot(
      tasksQuery(listId),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const changes = snap
          .docChanges()
          .map((c) => ({ type: c.type, doc: { id: c.doc.id, ...c.doc.data() } }));
        callback(docs, changes);
      },
      (error) => {
        console.error("Erreur lors de l'écoute des tâches partagées :", error);
        if (typeof onError === "function") onError(error);
      },
    );
  } catch (error) {
    console.error("Erreur lors de l'abonnement aux tâches partagées :", error);
    throw error;
  }
}

// Abonnement au doc de liste pour réagir aux changements de rôles/membres
export function subscribeToSharedList(listId, callback, onError) {
  return onSnapshot(
    listDoc(listId),
    (snap) => {
      if (!snap.exists()) {
        if (typeof onError === "function") onError(new Error("Liste introuvable."));
        return;
      }
      callback({ id: snap.id, ...snap.data() });
    },
    (error) => {
      console.error("Erreur lors de l'écoute de la liste :", error);
      if (typeof onError === "function") onError(error);
    },
  );
}
