import { deleteUser } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Suppression par lots (writeBatch limite à 500 écritures). On reste
// sous 500 pour laisser de la marge à d'éventuelles sous-opérations.
async function supprimerParLots(references, tailleLot = 450) {
  for (let index = 0; index < references.length; index += tailleLot) {
    const batch = writeBatch(db);
    references.slice(index, index + tailleLot).forEach((refDoc) => {
      batch.delete(refDoc);
    });
    await batch.commit();
  }
}

// Suppression complète du compte.
// On vérifie d'abord que l'utilisateur n'est pas owner d'une liste partagée.
// Ensuite on nettoie Firestore puis on supprime le compte Auth.
export async function deleteAccountData() {
  const courant = auth.currentUser;
  if (!courant) throw new Error("Aucun utilisateur connecté.");
  const uid = courant.uid;
  const emailNormalise = courant.email?.trim().toLowerCase() ?? null;

  const ownedListsSnap = await getDocs(
    query(collection(db, "sharedLists"), where("ownerId", "==", uid), limit(1)),
  );
  if (!ownedListsSnap.empty) {
    throw new Error(
      "Vous possédez encore au moins une liste partagée. Supprimez-la ou transférez sa gestion avant de supprimer votre compte.",
    );
  }

  const taches = await getDocs(collection(db, "users", uid, "tasks")).catch(
    () => null,
  );
  if (taches && !taches.empty) {
    await supprimerParLots(taches.docs.map((d) => d.ref));
  }

  const listesMembre = await getDocs(
    query(collection(db, "sharedLists"), where("memberIds", "array-contains", uid)),
  ).catch(() => null);
  if (listesMembre) {
    await Promise.all(
      listesMembre.docs.map(async (listeDoc) => {
        const data = listeDoc.data() ?? {};
        const memberIds = (data.memberIds ?? []).filter((idMembre) => idMembre !== uid);
        const roles = { ...(data.roles ?? {}) };
        delete roles[uid];
        const emailToUid = { ...(data.emailToUid ?? {}) };
        let memberEmails = data.memberEmails ?? [];
        let emailRoles = { ...(data.emailRoles ?? {}) };
        if (emailNormalise) {
          memberEmails = memberEmails.filter((email) => email !== emailNormalise);
          delete emailRoles[emailNormalise];
          delete emailToUid[emailNormalise];
        }
        try {
          await updateDoc(listeDoc.ref, {
            memberIds,
            memberEmails,
            roles,
            emailRoles,
            emailToUid,
          });
        } catch {
          // Best-effort: le compte est déjà supprimé côté Auth.
        }
      }),
    );
  }

  try {
    await deleteDoc(doc(db, "users", uid));
  } catch {
    // Le doc user n'existe pas forcément — on ignore cette erreur
  }

  await deleteUser(courant);
}
