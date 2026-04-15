"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Garde inverse : redirige vers / si l'utilisateur est DÉJÀ connecté.
// Utilisé sur /login et /signup pour éviter qu'un user authentifié
// puisse afficher un formulaire de connexion sans intérêt.
export default function GuestGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  // Pendant la vérification ou pendant la redirection, on n'affiche pas le formulaire
  if (loading || user) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-zinc-50"
      >
        <span className="text-sm font-medium text-zinc-700">
          {loading
            ? "Vérification de votre session…"
            : "Redirection vers l'accueil…"}
        </span>
      </div>
    );
  }

  return children;
}
