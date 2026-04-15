import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Retourne la référence à la sous-collection tasks d'un utilisateur
const getTasksCollection = (userId) =>
  collection(db, "users", userId, "tasks");

// Récupère toutes les tâches d'un utilisateur, triées par ordre manuel
// (champ `order`) avec fallback sur createdAt.
export async function getUserTasks(userId) {
  try {
    const q = query(getTasksCollection(userId), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    throw error;
  }
}

// Ajoute une nouvelle tâche. Le champ `order` est positionné en fin de
// liste (Date.now) pour que les nouvelles tâches apparaissent en bas sans
// nécessiter un count préalable.
export async function addTask(userId, task) {
  try {
    const docRef = await addDoc(getTasksCollection(userId), {
      title: task.title,
      description: task.description ?? null,
      priority: task.priority ?? "medium",
      completed: false,
      order: task.order ?? Date.now(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche :", error);
    throw error;
  }
}

// Met à jour partiellement une tâche existante
export async function updateTask(userId, taskId, updates) {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error);
    throw error;
  }
}

// Supprime une tâche existante
export async function deleteTask(userId, taskId) {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    throw error;
  }
}

// Persiste un nouvel ordre des tâches en un seul batch pour éviter les
// incohérences visuelles si une écriture échouait au milieu.
export async function reorderTasks(userId, orderedIds) {
  try {
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      batch.update(doc(db, "users", userId, "tasks", id), { order: index });
    });
    await batch.commit();
  } catch (error) {
    console.error("Erreur lors du réordonnancement des tâches :", error);
    throw error;
  }
}

// Écoute en temps réel les changements de tâches et retourne la fonction
// de désabonnement à appeler au démontage du composant.
// onError (optionnel) permet à l'appelant de réagir à une erreur du listener
// (ex. afficher un message d'erreur à l'utilisateur).
export function subscribeToTasks(userId, callback, onError) {
  try {
    const q = query(getTasksCollection(userId), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const tasks = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        callback(tasks);
      },
      (error) => {
        console.error("Erreur lors de l'écoute des tâches :", error);
        if (typeof onError === "function") {
          onError(error);
        }
      },
    );
  } catch (error) {
    console.error("Erreur lors de l'abonnement aux tâches :", error);
    throw error;
  }
}
