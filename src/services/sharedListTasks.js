// CRUD et abonnement aux tâches d'une liste partagée.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { chargerListe } from "./sharedListsCrud";
import { assertPeutEditer } from "./sharedListRoles";

const tasksCol = (listId) => collection(db, "sharedLists", listId, "tasks");
const taskDoc = (listId, taskId) => doc(db, "sharedLists", listId, "tasks", taskId);
const tasksQuery = (listId) => query(tasksCol(listId), orderBy("createdAt", "desc"));

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
    assertPeutEditer(list, uid, userEmail);
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

export async function updateSharedTask(listId, taskId, updates, uid, userEmail) {
  try {
    const list = await chargerListe(listId);
    assertPeutEditer(list, uid, userEmail);
    await updateDoc(taskDoc(listId, taskId), updates);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche partagée :", error);
    throw error;
  }
}

export async function deleteSharedTask(listId, taskId, uid, userEmail) {
  try {
    const list = await chargerListe(listId);
    assertPeutEditer(list, uid, userEmail);
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
