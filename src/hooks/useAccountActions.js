"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Regroupe les actions compte (déconnexion / suppression) partagées
// entre NavAuthActions et UserMenu pour éviter la duplication.
export default function useAccountActions() {
  const { logout, deleteAccount } = useAuth();
  const [deconnexionEnCours, setDeconnexionEnCours] = useState(false);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const handleLogout = async () => {
    if (deconnexionEnCours || suppressionEnCours) return;
    setDeconnexionEnCours(true);
    try {
      await logout();
    } catch (error) {
      console.error("Impossible de se déconnecter :", error);
      toast.error("Impossible de se déconnecter");
    } finally {
      setDeconnexionEnCours(false);
    }
  };

  const handleDelete = async () => {
    if (deconnexionEnCours || suppressionEnCours) return;
    const confirme = window.confirm(
      "Supprimer votre compte ? Toutes vos tâches seront perdues et cette action est irréversible.",
    );
    if (!confirme) return;
    setSuppressionEnCours(true);
    try {
      await deleteAccount();
      toast.success("Compte supprimé");
    } catch (error) {
      console.error("Impossible de supprimer le compte :", error);
      if (error?.code === "auth/requires-recent-login") {
        toast.error("Reconnectez-vous puis réessayez la suppression.");
      } else {
        toast.error("Impossible de supprimer le compte");
      }
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return {
    handleLogout,
    handleDelete,
    deconnexionEnCours,
    suppressionEnCours,
    isDeleting: suppressionEnCours,
  };
}
