"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addTask as addTaskService,
  deleteTask as deleteTaskService,
  subscribeToTasks,
  updateTask,
} from "@/services/taskService";

// Hook centralisant toute la logique Firestore : abonnement temps réel,
// état local et mutations protégées contre les doubles-clics.
export default function useUserTasks(uid) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [ajoutEnCours, setAjoutEnCours] = useState(false);
  // useRef plutôt qu'un state : les verrous ne doivent pas déclencher de
  // re-render et doivent être lus de façon synchrone par les handlers.
  const idsEnMutation = useRef(new Set());

  useEffect(() => {
    if (!uid) {
      setTasks([]);
      setLoading(false);
      setErreur(null);
      return;
    }

    setLoading(true);
    setErreur(null);
    const unsubscribe = subscribeToTasks(
      uid,
      (tachesRecues) => {
        setTasks(tachesRecues);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setErreur("Impossible de charger vos tâches. Réessayez plus tard.");
      },
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [uid]);

  const toggleTask = useCallback(
    async (id) => {
      if (!uid) return;
      if (idsEnMutation.current.has(id)) return;
      const tache = tasks.find((t) => t.id === id);
      if (!tache) return;
      idsEnMutation.current.add(id);
      try {
        await updateTask(uid, id, { completed: !tache.completed });
      } catch (error) {
        console.error("Impossible de basculer la tâche :", error);
      } finally {
        idsEnMutation.current.delete(id);
      }
    },
    [uid, tasks],
  );

  const deleteTask = useCallback(
    async (id) => {
      if (!uid) return;
      if (idsEnMutation.current.has(id)) return;
      idsEnMutation.current.add(id);
      try {
        await deleteTaskService(uid, id);
      } catch (error) {
        console.error("Impossible de supprimer la tâche :", error);
      } finally {
        idsEnMutation.current.delete(id);
      }
    },
    [uid],
  );

  const addTask = useCallback(
    async (titre) => {
      if (!uid) return;
      if (ajoutEnCours) return;
      const titreNettoye = titre.trim();
      if (titreNettoye === "") return;
      setAjoutEnCours(true);
      try {
        await addTaskService(uid, { title: titreNettoye });
      } catch (error) {
        console.error("Impossible d'ajouter la tâche :", error);
      } finally {
        setAjoutEnCours(false);
      }
    },
    [uid, ajoutEnCours],
  );

  return { tasks, loading, erreur, toggleTask, deleteTask, addTask, ajoutEnCours };
}
