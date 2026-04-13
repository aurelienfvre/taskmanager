"use client";

import { useState } from "react";
import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import ProductPreview from "@/components/ProductPreview";
import FeaturesBento from "@/components/FeaturesBento";
import SocialProof from "@/components/SocialProof";
import CtaSection from "@/components/CtaSection";
import TaskList from "@/components/TaskList";
import SiteFooter from "@/components/SiteFooter";

// Tâches de démonstration affichées au premier rendu
const TACHES_INITIALES = [
  {
    id: 1,
    title: "Finaliser la stratégie de marque Q4",
    description:
      "Revoir les decks finaux et aligner les assets visuels pour le lancement éditorial.",
    priority: "haute",
    completed: false,
  },
  {
    id: 2,
    title: "Point hebdomadaire avec l'équipe design",
    description:
      "Discuter de la transition vers les nouveaux tokens du design system.",
    priority: "moyenne",
    completed: true,
  },
  {
    id: 3,
    title: "Commander de l'encre d'archive pour le studio",
    priority: "basse",
    completed: false,
  },
];

// Page d'accueil de TaskManager
export default function Home() {
  const [tasks, setTasks] = useState(TACHES_INITIALES);

  // Inverse le statut completed d'une tâche via son id
  const handleToggle = (id) => {
    setTasks((tachesActuelles) =>
      tachesActuelles.map((tache) =>
        tache.id === id ? { ...tache, completed: !tache.completed } : tache,
      ),
    );
  };

  // Retire une tâche du tableau via son id
  const handleDelete = (id) => {
    setTasks((tachesActuelles) =>
      tachesActuelles.filter((tache) => tache.id !== id),
    );
  };

  return (
    <>
      <TopNavBar />
      <main className="pt-32">
        <HeroSection />
        <ProductPreview />
        <FeaturesBento />
        <SocialProof />

        {/* Section interactive : liste de tâches gérée via useState */}
        <section className="mx-auto max-w-5xl px-6 py-24 lg:px-12">
          <header className="mb-16">
            <h2 className="mb-4 text-5xl font-bold tracking-tighter text-zinc-900">
              Vos tâches
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
              Une démonstration interactive : cochez une tâche pour la marquer
              comme terminée ou supprimez-la pour la retirer de la liste.
            </p>
          </header>

          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </section>

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
