"use client";

import { useState } from "react";
import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import ProductPreview from "@/components/ProductPreview";
import FeaturesBento from "@/components/FeaturesBento";
import SocialProof from "@/components/SocialProof";
import CtaSection from "@/components/CtaSection";
import TaskList from "@/components/TaskList";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
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
    date: "2024-04-01",
  },
  {
    id: 2,
    title: "Point hebdomadaire avec l'équipe design",
    description:
      "Discuter de la transition vers les nouveaux tokens du design system.",
    priority: "moyenne",
    completed: true,
    date: "2024-04-03",
  },
  {
    id: 3,
    title: "Commander de l'encre d'archive pour le studio",
    priority: "basse",
    completed: false,
    date: "2024-04-05",
  },
];

// Ordre numérique des niveaux de priorité (plus petit = plus urgent)
const ORDRE_PRIORITE = { haute: 1, moyenne: 2, basse: 3 };

// Page d'accueil de TaskManager
export default function Home() {
  const [tasks, setTasks] = useState(TACHES_INITIALES);

  // State de recherche textuelle (filtre sur le titre)
  const [searchQuery, setSearchQuery] = useState("");

  // State du filtre de statut : "toutes" | "actives" | "completees"
  const [filter, setFilter] = useState("toutes");

  // State du tri : "priority" | "date"
  const [sortOrder, setSortOrder] = useState("priority");

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

  // --- Logique de filtrage et de tri ---

  // 1. Filtre par titre (recherche insensible à la casse)
  const tachesFiltreesParRecherche = tasks.filter((tache) =>
    tache.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 2. Filtre par statut
  const tachesFiltreesParStatut = tachesFiltreesParRecherche.filter((tache) => {
    if (filter === "actives") return !tache.completed;
    if (filter === "completees") return tache.completed;
    return true; // "toutes"
  });

  // 3. Tri par priorité ou par date (sans muter le tableau source)
  const tachesTriees = [...tachesFiltreesParStatut].sort((a, b) => {
    if (sortOrder === "priority") {
      return (
        (ORDRE_PRIORITE[a.priority] ?? 99) -
        (ORDRE_PRIORITE[b.priority] ?? 99)
      );
    }
    // Tri par date croissante (tâches sans date repoussées en fin)
    return (a.date ?? "9999") < (b.date ?? "9999") ? -1 : 1;
  });

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

          {/* Barre d'outils : recherche, filtres, tri */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Recherche textuelle */}
            <div className="w-full sm:max-w-xs">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filtres par statut */}
              <FilterBar currentFilter={filter} onFilterChange={setFilter} />

              {/* Sélecteur de tri */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-order"
                  className="text-sm font-medium text-zinc-500"
                >
                  Trier par
                </label>
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="priority">Priorité</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>
          </div>

          <TaskList
            tasks={tachesTriees}
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
