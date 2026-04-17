"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeToTasks } from "@/services/taskService";

// Abonnement Firestore temps-réel aux tâches privées de l'utilisateur.
// Isolé pour garder useUserTasks sous la limite de 100 lignes.
export default function useTasksSubscription(uid) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
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

  return { tasks, setTasks, loading, erreur, tasksRef };
}
