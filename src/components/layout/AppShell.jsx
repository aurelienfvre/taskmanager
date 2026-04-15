"use client";

import { useAuth } from "@/contexts/AuthContext";
import TopNavBar from "./TopNavBar";
import Sidebar from "./Sidebar";
import SiteFooter from "./SiteFooter";

// Enveloppe le layout racine : bifurque entre visiteur (TopNavBar horizontale
// + landing) et utilisateur connecté (sidebar verticale + contenu + footer
// sticky via flex-1). Centralise le footer pour éviter les doublons.
export default function AppShell({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-600">Chargement…</p>
      </div>
    );
  }

  if (user === null || user === undefined) {
    // TopNavBar est `fixed z-50` → spacer `pt-16` pour que le contenu ne
    // passe pas sous le header sur les pages visiteur (landing, /login,
    // /signup). Hauteur réelle du header ≈ 64 px (`py-4 + text-xl`).
    return (
      <div className="flex min-h-screen flex-col">
        <TopNavBar />
        <div className="flex-1 pt-16">{children}</div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fallback mobile : la sidebar est masquée, on garde un header
          horizontal compact pour conserver une navigation. Le TopNavBar est
          fixed → spacer `pt-20` côté mobile pour décaler le contenu. */}
      <div className="md:hidden">
        <TopNavBar />
      </div>
      {/* Sidebar `fixed` hors flux → on décale le contenu avec `md:ml-64`
          pour qu'elle reste visible pendant le scroll de la zone centrale. */}
      <Sidebar />
      <div className="flex min-h-screen flex-col pt-16 md:ml-64 md:pt-0">
        <main className="flex flex-1 flex-col">
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
