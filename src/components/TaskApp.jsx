"use client";

import { useState } from "react";
import TaskList from "./TaskList";
import Dashboard from "./Dashboard";
import AddTaskForm from "./AddTaskForm";
import TaskToolbar from "./TaskToolbar";
import { useAuth } from "@/contexts/AuthContext";
import useUserTasks from "@/hooks/useUserTasks";
import { filtrerEtTrierTaches } from "@/lib/taskFilters";

// Section interactive de gestion des tâches (Client Component)
export default function TaskApp() {
  const { user } = useAuth();
  const { tasks, loading, erreur, toggleTask, deleteTask, addTask, ajoutEnCours } =
    useUserTasks(user?.uid);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("toutes");
  const [sortOrder, setSortOrder] = useState("priority");

  const tachesTriees = filtrerEtTrierTaches(tasks, {
    searchQuery,
    filter,
    sortOrder,
  });
  const isFiltre = searchQuery !== "" || filter !== "toutes";

  return (
    <section
      aria-label="Gestionnaire de tâches"
      className="mx-auto max-w-5xl px-6 py-24 lg:px-12"
    >
      <header className="mb-16">
        <h2 className="mb-4 text-5xl font-bold tracking-tighter text-zinc-900">
          Vos tâches
        </h2>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
          Ajoutez, cochez ou supprimez vos tâches. Les changements sont
          synchronisés en temps réel avec votre compte.
        </p>
      </header>

      <Dashboard tasks={tasks} />

      <AddTaskForm onAdd={addTask} ajoutEnCours={ajoutEnCours} />

      <TaskToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Priorité d'affichage : erreur > chargement > liste */}
      {erreur ? (
        <p role="alert" className="py-12 text-center text-sm text-red-600">
          {erreur}
        </p>
      ) : loading ? (
        <p
          role="status"
          aria-live="polite"
          className="py-12 text-center text-sm text-zinc-500"
        >
          Chargement de vos tâches…
        </p>
      ) : (
        <TaskList
          tasks={tachesTriees}
          onToggle={toggleTask}
          onDelete={deleteTask}
          isFiltre={isFiltre}
        />
      )}
    </section>
  );
}
