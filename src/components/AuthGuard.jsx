"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Empêche le rendu des enfants tant que l'utilisateur n'est pas authentifié
export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Tant que Firebase n'a pas répondu OU qu'on est en train de rediriger,
  // on ne rend jamais le contenu protégé. Le libellé distingue les deux cas
  // pour ne pas afficher "Vérification…" pendant un logout/redirect.
  if (loading || !user) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-white"
      >
        <span className="text-sm font-medium text-zinc-700">
          {loading
            ? "Vérification de votre session…"
            : "Redirection vers la connexion…"}
        </span>
      </div>
    );
  }

  return children;
}
