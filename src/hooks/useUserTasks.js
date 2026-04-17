"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addTask as addTaskService,
  deleteTask as deleteTaskService,
  reorderTasks as reorderTasksService,
  subscribeToTasks,
  updateTask,
} from "@/services/taskService";
import { toast } from "sonner";

// Hook centralisant toute la logique Firestore : abonnement temps réel,
// état local et mutations protégées contre les doubles-clics.
export default function useUserTasks(uid) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [ajoutEnCours, setAjoutEnCours] = useState(false);
  const idsEnMutation = useRef(new Set());
  const ajoutEnCoursRef = useRef(false);
  const tasksRef = useRef([]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

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
      const tache = tasksRef.current.find((t) => t.id === id);
      if (!tache) return;
      idsEnMutation.current.add(id);
      try {
        await updateTask(uid, id, { completed: !tache.completed });
      } catch (error) {
        console.error("Impossible de basculer la tâche :", error);
        toast.error("Impossible de mettre à jour la tâche");
      } finally {
        idsEnMutation.current.delete(id);
      }
    },
    [uid],
  );

  const deleteTask = useCallback(
    async (id) => {
      if (!uid) return;
      if (idsEnMutation.current.has(id)) return;
      idsEnMutation.current.add(id);
      try {
        await deleteTaskService(uid, id);
        toast.success("Tâche supprimée");
      } catch (error) {
        console.error("Impossible de supprimer la tâche :", error);
        toast.error("Impossible de supprimer la tâche");
      } finally {
        idsEnMutation.current.delete(id);
      }
    },
    [uid],
  );

  const addTask = useCallback(
    async (titre, priorite = "medium") => {
      if (!uid) return false;
      if (ajoutEnCoursRef.current) return false;
      if (typeof titre !== "string") return false;
      const titreNettoye = titre.trim();
      if (titreNettoye === "") return false;
      const prioriteValide = ["high", "medium", "low"].includes(priorite) ? priorite : "medium";
      ajoutEnCoursRef.current = true;
      setAjoutEnCours(true);
      try {
        await addTaskService(uid, { title: titreNettoye, priority: prioriteValide });
        toast.success("Tâche ajoutée");
        return true;
      } catch (error) {
        console.error("Impossible d'ajouter la tâche :", error);
        toast.error("Impossible d'ajouter la tâche");
        return false;
      } finally {
        ajoutEnCoursRef.current = false;
        setAjoutEnCours(false);
      }
    },
    [uid],
  );

  // Réordonnancement optimiste : on met d'abord à jour l'UI puis Firestore.
  // En cas d'échec, on se contente d'un toast ; le prochain snapshot
  // ré-alignera l'état local sur la vérité serveur.
  const reorderTasks = useCallback(
    async (orderedIds) => {
      if (!uid) return;
      const idToTask = new Map(tasksRef.current.map((t) => [t.id, t]));
      const optimistes = orderedIds
        .map((id, index) => {
          const t = idToTask.get(id);
          return t ? { ...t, order: index } : null;
        })
        .filter(Boolean);
      setTasks(optimistes);
      try {
        await reorderTasksService(uid, orderedIds);
      } catch (error) {
        console.error("Impossible de réordonner les tâches :", error);
        toast.error("Impossible de sauvegarder le nouvel ordre");
      }
    },
    [uid],
  );

  // Change la priorité d'une tâche (cycle depuis le badge cliquable).
  // Valide la valeur côté client pour éviter une écriture Firestore inutile.
  const updateTaskPriority = useCallback(
    async (id, priorite) => {
      if (!uid) return;
      if (!["high", "medium", "low"].includes(priorite)) return;
      const cleMutation = `priority-${id}`;
      if (idsEnMutation.current.has(cleMutation)) return;
      idsEnMutation.current.add(cleMutation);
      try {
        await updateTask(uid, id, { priority: priorite });
      } catch (error) {
        console.error("Impossible de changer la priorité :", error);
        toast.error("Impossible de changer la priorité");
      } finally {
        idsEnMutation.current.delete(cleMutation);
      }
    },
    [uid],
  );

  return {
    tasks,
    loading,
    erreur,
    toggleTask,
    deleteTask,
    addTask,
    reorderTasks,
    updateTaskPriority,
    ajoutEnCours,
  };
}
