// Composant barre de filtres pour les tâches

const FILTRES = [
  { valeur: "toutes", label: "Toutes" },
  { valeur: "actives", label: "Actives" },
  { valeur: "completees", label: "Complétées" },
];

export default function FilterBar({ currentFilter, onFilterChange }) {
  return (
    <nav aria-label="Filtres de tâches" className="flex gap-2">
      {FILTRES.map(({ valeur, label }) => {
        const estActif = currentFilter === valeur;

        return (
          <button
            key={valeur}
            type="button"
            onClick={() => onFilterChange(valeur)}
            aria-pressed={estActif}
            className={`h-10 cursor-pointer rounded-full px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 ${
              estActif
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
