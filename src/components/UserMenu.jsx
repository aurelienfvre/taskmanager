"use client";

import { useAuth } from "@/contexts/AuthContext";
import useAccountActions from "@/hooks/useAccountActions";

// Menu utilisateur réutilisable : déconnexion + suppression de compte.
// La suppression demande confirmation explicite car irréversible.
export default function UserMenu() {
  const { user } = useAuth();
  const {
    handleLogout,
    handleDelete,
    deconnexionEnCours,
    suppressionEnCours,
  } = useAccountActions();

  return (
    <div>
      <p className="mb-2 truncate text-xs text-zinc-500" title={user?.email ?? ""}>
        {user?.email ?? "Compte"}
      </p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleLogout}
          disabled={deconnexionEnCours || suppressionEnCours}
          className="w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deconnexionEnCours ? "Déconnexion…" : "Se déconnecter"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deconnexionEnCours || suppressionEnCours}
          className="w-full cursor-pointer rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Supprimer définitivement mon compte"
        >
          {suppressionEnCours ? "Suppression…" : "Supprimer mon compte"}
        </button>
      </div>
    </div>
  );
}
