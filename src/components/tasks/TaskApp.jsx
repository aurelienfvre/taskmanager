"use client";

import { useState } from "react";
import TaskList from "./TaskList";
import Dashboard from "@/components/dashboard/Dashboard";
import TaskControlsBar from "./TaskControlsBar";
import { useAuth } from "@/contexts/AuthContext";
import useUserTasks from "@/hooks/useUserTasks";
import { filtrerEtTrierTaches } from "@/lib/taskFilters";

// Section interactive de gestion des tâches (Client Component).
// Plus de gros header marketing : le DashboardView porte déjà le titre.
export default function TaskApp() {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    erreur,
    toggleTask,
    deleteTask,
    addTask,
    reorderTasks,
    updateTaskPriority,
    ajoutEnCours,
  } = useUserTasks(user?.uid);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("toutes");
  // "manuel" par défaut pour que le D&D soit stable : tout autre tri
  // réécrirait l'ordre visuel juste après un drop.
  const [sortOrder, setSortOrder] = useState("manuel");

  const tachesTriees = filtrerEtTrierTaches(tasks, {
    searchQuery,
    filter,
    sortOrder,
  });
  const isFiltre = searchQuery !== "" || filter !== "toutes";

  return (
    <section
      aria-label="Gestionnaire de tâches"
      className="flex flex-col gap-6"
    >
      <Dashboard tasks={tasks} />

      <TaskControlsBar
        onAdd={addTask}
        ajoutEnCours={ajoutEnCours}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Priorité d'affichage : erreur > chargement > liste */}
      {erreur ? (
        <p role="alert" className="py-8 text-center text-sm text-red-600">
          {erreur}
        </p>
      ) : loading ? (
        <p
          role="status"
          aria-live="polite"
          className="py-8 text-center text-sm text-zinc-500"
        >
          Chargement de vos tâches…
        </p>
      ) : (
        <TaskList
          tasks={tachesTriees}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onAdd={addTask}
          onReorder={reorderTasks}
          onChangePriority={updateTaskPriority}
          canDrag={sortOrder === "manuel"}
          isFiltre={isFiltre}
        />
      )}
    </section>
  );
}
