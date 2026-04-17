import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

// Barre d'outils regroupant recherche, filtres et tri sur une seule ligne.
// `items-center` + `h-10` sur chaque enfant garantit un alignement propre.
export default function TaskToolbar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-[200px] flex-1">
        <SearchBar
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <FilterBar currentFilter={filter} onFilterChange={onFilterChange} />

      {/* Label masqué : les options "Priorité / Date" parlent d'elles-mêmes */}
      <label htmlFor="sort-order" className="sr-only">
        Trier les tâches
      </label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
        className="select-chevron h-10 cursor-pointer rounded-lg border border-zinc-300 bg-white pl-3 pr-9 text-sm text-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-zinc-900"
      >
        <option value="manuel">Manuel</option>
        <option value="priority">Priorité</option>
        <option value="date">Date</option>
      </select>
    </div>
  );
}
