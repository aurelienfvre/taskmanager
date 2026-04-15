"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Actions d'auth de la navbar. Extrait dans un composant dédié pour garder
// TopNavBar sous la limite de 100 lignes.
export default function NavAuthActions() {
  const { user, loading, logout, deleteAccount } = useAuth();
  const [deconnexionEnCours, setDeconnexionEnCours] = useState(false);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  // Placeholder de même gabarit pour éviter le layout shift pendant le check
  // initial d'authentification.
  if (loading) {
    return <div aria-hidden="true" className="h-9 w-48" />;
  }

  if (user === null) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-600 transition-colors duration-200 ease-in-out hover:text-zinc-900"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-all duration-200 hover:bg-zinc-800"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    if (deconnexionEnCours) return;
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
    if (suppressionEnCours) return;
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

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[160px] truncate text-sm text-zinc-600 sm:inline" title={user.email ?? ""}>
        {user.email ?? "Compte"}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={deconnexionEnCours || suppressionEnCours}
        className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deconnexionEnCours ? "Déconnexion…" : "Se déconnecter"}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deconnexionEnCours || suppressionEnCours}
        className="cursor-pointer rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Supprimer définitivement mon compte"
      >
        {suppressionEnCours ? "Suppression…" : "Supprimer"}
      </button>
    </div>
  );
}
