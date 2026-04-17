"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import useAccountActions from "@/hooks/useAccountActions";

// Actions d'auth de la navbar. Extrait dans un composant dédié pour garder
// TopNavBar sous la limite de 100 lignes.
export default function NavAuthActions() {
  const { user, loading } = useAuth();
  const {
    handleLogout,
    handleDelete,
    deconnexionEnCours,
    suppressionEnCours,
  } = useAccountActions();

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
          className="rounded-md text-sm font-medium text-zinc-600 transition-colors duration-200 ease-in-out hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          Se connecter
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-all duration-200 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          Commencer
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[160px] truncate text-sm text-zinc-600 sm:inline" title={user.email ?? ""}>
        {user.email ?? "Compte"}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={deconnexionEnCours || suppressionEnCours}
        className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-all duration-200 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
