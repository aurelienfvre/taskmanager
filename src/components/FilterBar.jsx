// Composant barre de filtres pour les tâches

// Définition des filtres disponibles
const FILTRES = [
  { valeur: "toutes", label: "Toutes" },
  { valeur: "actives", label: "Actives" },
  { valeur: "completees", label: "Complétées" },
];

export default function FilterBar({ currentFilter, onFilterChange }) {
  return (
    <nav aria-label="Filtres de tâches" className="flex gap-2">
      {FILTRES.map(({ valeur, label }) => {
        // Le bouton est actif si sa valeur correspond au filtre courant
        const estActif = currentFilter === valeur;

        return (
          <button
            key={valeur}
            type="button"
            onClick={() => onFilterChange(valeur)}
            aria-pressed={estActif}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              estActif
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
