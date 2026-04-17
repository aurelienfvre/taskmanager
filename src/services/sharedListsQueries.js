// Requêtes et helpers partagés pour les abonnements/lectures de listes.
import { getDocs, onSnapshot, query, where } from "firebase/firestore";
import { listsCol } from "./sharedListsCrud";

export const listsQueryByUid = (uid) =>
  query(listsCol(), where("memberIds", "array-contains", uid));
export const listsQueryByEmail = (email) =>
  query(listsCol(), where("memberEmails", "array-contains", email));
export const listsQueryLegacy = (uid) =>
  query(listsCol(), where("members", "array-contains", uid));

export const trierListesParDate = (listes) =>
  [...listes].sort(
    (a, b) => (b.createdAt?.seconds ?? Infinity) - (a.createdAt?.seconds ?? Infinity),
  );

export function fusionnerSansDoublon(a, b) {
  const vus = new Map();
  [...a, ...b].forEach((l) => vus.set(l.id, l));
  return Array.from(vus.values());
}

const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

// Abonnement temps-réel : trois listeners combinés via un état mémorisé.
export function subscribeToSharedLists(uid, email, callback, onError) {
  const emailNormalise = email?.trim().toLowerCase();
  let a = [], b = [], c = [];
  const emit = () =>
    callback(trierListesParDate(fusionnerSansDoublon(fusionnerSansDoublon(a, b), c)));
  const u1 = onSnapshot(
    listsQueryByUid(uid),
    (s) => { a = mapDocs(s); emit(); },
    (error) => {
      console.error("Erreur lors de l'écoute des listes partagées :", error);
      if (typeof onError === "function") onError(error);
    },
  );
  let u2 = () => {};
  try {
    u2 = onSnapshot(listsQueryLegacy(uid), (s) => { b = mapDocs(s); emit(); }, () => {});
  } catch {
    // Les anciens docs sont optionnels.
  }
  let u3 = () => {};
  if (emailNormalise) {
    try {
      u3 = onSnapshot(listsQueryByEmail(emailNormalise), (s) => { c = mapDocs(s); emit(); }, () => {});
    } catch {
      // Requête email facultative en fallback.
    }
  }
  return () => { u1(); u2(); u3(); };
}

export async function getUserSharedLists(uid, email) {
  try {
    const emailNormalise = email?.trim().toLowerCase();
    const [snap1, snap2] = await Promise.all([
      getDocs(listsQueryByUid(uid)),
      getDocs(listsQueryLegacy(uid)).catch(() => ({ docs: [] })),
    ]);
    const snapEmail = emailNormalise
      ? await getDocs(listsQueryByEmail(emailNormalise)).catch(() => ({ docs: [] }))
      : { docs: [] };
    return trierListesParDate(
      fusionnerSansDoublon(
        fusionnerSansDoublon(mapDocs(snap1), mapDocs(snap2)),
        mapDocs(snapEmail),
      ),
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des listes partagées :", error);
    throw error;
  }
}
