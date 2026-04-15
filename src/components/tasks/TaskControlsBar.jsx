"use client";

import AddTaskForm from "./AddTaskForm";
import TaskToolbar from "./TaskToolbar";

// Regroupe le formulaire d'ajout et la toolbar (search/filtres/tri) dans un
// même conteneur visuel pour que l'utilisateur comprenne qu'il s'agit d'une
// seule "zone de contrôle" de sa liste.
export default function TaskControlsBar({
  onAdd,
  ajoutEnCours,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <section
      aria-label="Contrôles de la liste"
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4"
    >
      <AddTaskForm onAdd={onAdd} ajoutEnCours={ajoutEnCours} />
      <div className="border-t border-zinc-100 pt-3">
        <TaskToolbar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filter={filter}
          onFilterChange={onFilterChange}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
        />
      </div>
    </section>
  );
}
