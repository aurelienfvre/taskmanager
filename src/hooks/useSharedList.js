"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  addSharedTask,
  deleteSharedTask,
  subscribeToSharedTasks,
  subscribeToSharedList,
  updateSharedTask,
  addMemberToList,
  removeMemberFromList,
  updateMemberRole,
  linkCurrentUserToList,
  getUserRole,
  canEdit,
  canManageMembers,
} from "@/services/sharedListService";

// Hook qui encapsule l'abonnement temps réel à une liste partagée :
// - tâches (avec notif toast pour les ajouts d'autres membres),
// - doc de liste (pour suivre les changements de rôles en direct).
export default function useSharedList(listId) {
  const { user } = useAuth();
  const uid = user?.uid;
  const userEmail = user?.email;

  const [list, setList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [ajoutEnCours, setAjoutEnCours] = useState(false);
  const [membreEnCours, setMembreEnCours] = useState(false);
  const idsEnMutation = useRef(new Set());
  // Flag : ignorer le snapshot initial pour ne pas toaster les tâches
  // existantes au chargement.
  const isInitialLoad = useRef(true);

  // Résolution email→uid au premier accès (membre invité par email).
  useEffect(() => {
    if (!listId || !uid || !userEmail) return;
    linkCurrentUserToList(listId, uid, userEmail);
  }, [listId, uid, userEmail]);

  useEffect(() => {
    if (!listId) return;
    const unsub = subscribeToSharedList(
      listId,
      (l) => setList(l),
      () => setErreur("Impossible de charger la liste."),
    );
    return () => unsub();
  }, [listId]);

  useEffect(() => {
    if (!listId) return;
    setLoading(true);
    setErreur(null);
    isInitialLoad.current = true;
    const unsub = subscribeToSharedTasks(
      listId,
      (t, changes) => {
        setErreur(null);
        setTasks(t);
        setLoading(false);
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          return;
        }
        changes
          .filter((c) => c.type === "added" && c.doc.addedBy && c.doc.addedBy !== uid)
          .forEach((c) => {
            const qui = c.doc.addedByEmail ?? "un autre membre";
            toast(`Nouvelle tâche ajoutée par ${qui}`);
          });
      },
      () => { setLoading(false); setErreur("Impossible de charger les tâches partagées."); },
    );
    return () => { if (typeof unsub === "function") unsub(); };
  }, [listId, uid]);

  const role = useMemo(() => getUserRole(list, uid), [list, uid]);
  const peutEditer = canEdit(role);
  const peutGererMembres = canManageMembers(role);

  const toggleTask = useCallback(async (id) => {
    if (!peutEditer) { toast.error("Lecture seule"); return; }
    if (idsEnMutation.current.has(id)) return;
    const tache = tasks.find((t) => t.id === id);
    if (!tache) return;
    idsEnMutation.current.add(id);
    try {
      await updateSharedTask(listId, id, { completed: !tache.completed }, uid);
    } catch (e) {
      console.error("Impossible de basculer la tâche partagée :", e);
      toast.error("Impossible de mettre à jour la tâche");
    } finally {
      idsEnMutation.current.delete(id);
    }
  }, [listId, tasks, uid, peutEditer]);

  const deleteTask = useCallback(async (id) => {
    if (!peutEditer) { toast.error("Lecture seule"); return; }
    if (idsEnMutation.current.has(id)) return;
    idsEnMutation.current.add(id);
    try {
      await deleteSharedTask(listId, id, uid);
      toast.success("Tâche supprimée");
    } catch (e) {
      console.error("Impossible de supprimer la tâche partagée :", e);
      toast.error("Impossible de supprimer la tâche");
    } finally {
      idsEnMutation.current.delete(id);
    }
  }, [listId, uid, peutEditer]);

  const addTask = useCallback(async (titre, priorite = "medium") => {
    if (!peutEditer) { toast.error("Lecture seule"); return; }
    if (ajoutEnCours) return;
    const t = titre.trim();
    if (t === "") return;
    const p = ["high", "medium", "low"].includes(priorite) ? priorite : "medium";
    setAjoutEnCours(true);
    try {
      await addSharedTask(listId, { title: t, priority: p }, uid, userEmail);
      toast.success("Tâche ajoutée");
    } catch (e) {
      console.error("Impossible d'ajouter la tâche partagée :", e);
      toast.error("Impossible d'ajouter la tâche");
    } finally {
      setAjoutEnCours(false);
    }
  }, [listId, ajoutEnCours, uid, userEmail, peutEditer]);

  const addMember = useCallback(async (email, nouveauRole) => {
    if (membreEnCours) return;
    setMembreEnCours(true);
    try { await addMemberToList(listId, email, uid, nouveauRole); }
    finally { setMembreEnCours(false); }
  }, [listId, membreEnCours, uid]);

  const removeMember = useCallback(async (email) => {
    if (membreEnCours) return;
    setMembreEnCours(true);
    try { await removeMemberFromList(listId, email, uid); }
    finally { setMembreEnCours(false); }
  }, [listId, membreEnCours, uid]);

  const changeMemberRole = useCallback(async (targetUid, nouveauRole) => {
    if (membreEnCours) return;
    setMembreEnCours(true);
    try { await updateMemberRole(listId, targetUid, nouveauRole, uid); }
    finally { setMembreEnCours(false); }
  }, [listId, membreEnCours, uid]);

  return {
    list,
    tasks, loading, erreur, ajoutEnCours, membreEnCours,
    role, peutEditer, peutGererMembres,
    toggleTask, deleteTask, addTask,
    addMember, removeMember, changeMemberRole,
  };
}
