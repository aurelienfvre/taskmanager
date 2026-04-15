"use client";

import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

// Barre d'outils regroupant recherche, filtres et tri. Composant purement
// contrôlé : toutes les valeurs et callbacks sont fournies par le parent.
export default function TaskToolbar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="mt-8 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-xs">
        <SearchBar
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FilterBar currentFilter={filter} onFilterChange={onFilterChange} />

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
            onChange={(e) => onSortChange(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="priority">Priorité</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>
    </div>
  );
}
