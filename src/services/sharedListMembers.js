// Gestion des membres d'une liste partagée (ajout, retrait, rôle).
import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { chargerListe, listDoc, ROLES } from "./sharedListsCrud";
import { assertPeutGererMembres } from "./sharedListRoles";

export async function addMemberToList(listId, email, uid, role = ROLES.VIEWER, currentUserEmail) {
  try {
    const list = await chargerListe(listId);
    assertPeutGererMembres(list, uid, currentUserEmail);
    const emailNet = email.trim().toLowerCase();
    const uidMembre = list.emailToUid?.[emailNet] ?? null;
    const payload = {
      memberEmails: arrayUnion(emailNet),
      emailRoles: { ...(list.emailRoles ?? {}), [emailNet]: role },
      emailToUid: { ...(list.emailToUid ?? {}) },
      roles: uidMembre
        ? { ...(list.roles ?? {}), [uidMembre]: role }
        : { ...(list.roles ?? {}) },
    };
    if (uidMembre) payload.memberIds = arrayUnion(uidMembre);
    await updateDoc(listDoc(listId), payload);
  } catch (error) {
    console.error("Erreur lors de l'ajout du membre :", error);
    throw error;
  }
}

// Idempotent : lie l'uid courant à la liste (résolution email→uid).
export async function linkCurrentUserToList(listId, uid, email) {
  try {
    const list = await chargerListe(listId);
    if (list.memberIds?.includes(uid)) return;
    const emailNet = email.trim().toLowerCase();
    if (!list.memberEmails?.includes(emailNet)) return;
    const rolePending = list.emailRoles?.[emailNet] ?? ROLES.EDITOR;
    await updateDoc(listDoc(listId), {
      memberIds: arrayUnion(uid),
      [`roles.${uid}`]: rolePending,
      [`emailToUid.${emailNet}`]: uid,
    });
  } catch (error) {
    console.error("Erreur lors de la liaison du membre :", error);
  }
}

export async function updateMemberRole(listId, targetUid, nouveauRole, currentUid, currentUserEmail) {
  try {
    const list = await chargerListe(listId);
    assertPeutGererMembres(list, currentUid, currentUserEmail);
    if (targetUid === list.ownerId) throw new Error("Impossible de changer le rôle du propriétaire.");
    if (!Object.values(ROLES).includes(nouveauRole)) throw new Error("Rôle invalide.");
    const emailLie = Object.keys(list.emailToUid ?? {}).find((e) => list.emailToUid[e] === targetUid);
    const payload = { [`roles.${targetUid}`]: nouveauRole };
    if (emailLie) payload.emailRoles = { ...(list.emailRoles ?? {}), [emailLie]: nouveauRole };
    await updateDoc(listDoc(listId), payload);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle :", error);
    throw error;
  }
}

export async function removeMemberFromList(listId, email, currentUid, currentUserEmail) {
  try {
    const list = await chargerListe(listId);
    assertPeutGererMembres(list, currentUid, currentUserEmail);
    const emailNet = email.trim().toLowerCase();
    if (emailNet === list.ownerEmail) throw new Error("Impossible de retirer le propriétaire.");
    const targetUid = list.emailToUid?.[emailNet] ?? null;
    const roles = { ...(list.roles ?? {}) };
    if (targetUid) delete roles[targetUid];
    const emailToUid = { ...(list.emailToUid ?? {}) };
    delete emailToUid[emailNet];
    const emailRoles = { ...(list.emailRoles ?? {}) };
    delete emailRoles[emailNet];
    const payload = {
      memberEmails: arrayRemove(emailNet),
      roles, emailRoles, emailToUid,
    };
    if (targetUid) payload.memberIds = arrayRemove(targetUid);
    await updateDoc(listDoc(listId), payload);
  } catch (error) {
    console.error("Erreur lors du retrait du membre :", error);
    throw error;
  }
}
