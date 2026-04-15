"use client";

import { useAuth } from "@/contexts/AuthContext";
import LandingView from "@/components/landing/LandingView";
import DashboardView from "@/components/dashboard/DashboardView";

// Page d'accueil : AppShell gère déjà le loading et la bifurcation sidebar/
// TopNavBar. Ici on choisit juste quel contenu afficher (landing / dashboard).
export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user === null) return <LandingView />;
  return <DashboardView email={user.email} />;
}
