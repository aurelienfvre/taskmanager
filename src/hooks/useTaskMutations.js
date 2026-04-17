"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
  addTask as addTaskService,
  deleteTask as deleteTaskService,
  reorderTasks as reorderTasksService,
  updateTask,
} from "@/services/taskService";

const PRIORITES_VALIDES = ["high", "medium", "low"];

// Mutations Firestore (toggle/delete/add/reorder/priority) avec garde-fous
// anti-double-clic. Découplé de la souscription pour respecter la limite
// de 100 lignes par fichier.
export default function useTaskMutations(uid, tasksRef, setTasks) {
  const [ajoutEnCours, setAjoutEnCours] = useState(false);
  const ajoutEnCoursRef = useRef(false);
  const idsEnMutation = useRef(new Set());

  const toggleTask = useCallback(async (id) => {
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
  }, [uid, tasksRef]);

  const deleteTask = useCallback(async (id) => {
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
  }, [uid]);

  const addTask = useCallback(async (titre, priorite = "medium") => {
    if (!uid) return false;
    if (ajoutEnCoursRef.current) return false;
    if (typeof titre !== "string") return false;
    const titreNettoye = titre.trim();
    if (titreNettoye === "") return false;
    const prioriteValide = PRIORITES_VALIDES.includes(priorite) ? priorite : "medium";
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
  }, [uid]);

  // Réordonnancement optimiste : on met d'abord à jour l'UI puis Firestore.
  // En cas d'échec, le prochain snapshot ré-aligne l'état local.
  const reorderTasks = useCallback(async (orderedIds) => {
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
  }, [uid, tasksRef, setTasks]);

  const updateTaskPriority = useCallback(async (id, priorite) => {
    if (!uid) return;
    if (!PRIORITES_VALIDES.includes(priorite)) return;
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
  }, [uid]);

  return { toggleTask, deleteTask, addTask, reorderTasks, updateTaskPriority, ajoutEnCours };
}
