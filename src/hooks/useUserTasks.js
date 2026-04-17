"use client";

import useTasksSubscription from "./useTasksSubscription";
import useTaskMutations from "./useTaskMutations";

// Hook de composition : l'abonnement temps-réel vit dans useTasksSubscription,
// les mutations dans useTaskMutations. Les consommateurs gardent la même API.
export default function useUserTasks(uid) {
  const { tasks, setTasks, loading, erreur, tasksRef } = useTasksSubscription(uid);
  const {
    toggleTask,
    deleteTask,
    addTask,
    reorderTasks,
    updateTaskPriority,
    ajoutEnCours,
  } = useTaskMutations(uid, tasksRef, setTasks);

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
