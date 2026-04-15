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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Retourne la référence à la sous-collection tasks d'un utilisateur
const getTasksCollection = (userId) =>
  collection(db, "users", userId, "tasks");

// Récupère toutes les tâches d'un utilisateur, triées par date décroissante
export async function getUserTasks(userId) {
  try {
    const q = query(getTasksCollection(userId), orderBy("createdAt", "desc"));
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

// Ajoute une nouvelle tâche avec les valeurs par défaut forcées
export async function addTask(userId, task) {
  try {
    const docRef = await addDoc(getTasksCollection(userId), {
      ...task,
      completed: false,
      priority: "medium",
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

// Écoute en temps réel les changements de tâches et retourne la fonction
// de désabonnement à appeler au démontage du composant.
// onError (optionnel) permet à l'appelant de réagir à une erreur du listener
// (ex. afficher un message d'erreur à l'utilisateur).
export function subscribeToTasks(userId, callback, onError) {
  try {
    const q = query(getTasksCollection(userId), orderBy("createdAt", "desc"));
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
