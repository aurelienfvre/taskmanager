// CRUD des documents `sharedLists`. Les requêtes d'index/listing sont
// dans sharedListsQueries.js pour garder ce fichier sous 100 lignes.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const ROLES = { ADMIN: "admin", EDITOR: "editor", VIEWER: "viewer" };

export const listsCol = () => collection(db, "sharedLists");
export const listDoc = (listId) => doc(db, "sharedLists", listId);

export async function chargerListe(listId) {
  const snap = await getDoc(listDoc(listId));
  if (!snap.exists()) throw new Error("Liste introuvable.");
  return { id: snap.id, ...snap.data() };
}

export async function createSharedList(userId, userEmail, name) {
  try {
    const emailNormalise = userEmail.trim().toLowerCase();
    const ref = await addDoc(listsCol(), {
      name: name.trim(),
      ownerId: userId,
      ownerEmail: emailNormalise,
      roles: { [userId]: ROLES.ADMIN },
      emailRoles: { [emailNormalise]: ROLES.ADMIN },
      memberIds: [userId],
      memberEmails: [emailNormalise],
      emailToUid: { [emailNormalise]: userId },
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("Erreur lors de la création de la liste partagée :", error);
    throw error;
  }
}

const TAILLE_LOT = 450;

export async function deleteSharedList(listId, userId) {
  try {
    const list = await chargerListe(listId);
    if (list.ownerId !== userId) {
      throw new Error("Seul le propriétaire peut supprimer la liste.");
    }
    const tasksSnap = await getDocs(collection(db, "sharedLists", listId, "tasks"));
    if (!tasksSnap.empty) {
      for (let i = 0; i < tasksSnap.docs.length; i += TAILLE_LOT) {
        const batch = writeBatch(db);
        tasksSnap.docs.slice(i, i + TAILLE_LOT).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    }
    await deleteDoc(listDoc(listId));
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste partagée :", error);
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
