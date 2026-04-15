// Composant barre de recherche avec icône loupe et bouton d'effacement

export default function SearchBar({ value, onChange }) {
  // Efface la valeur en envoyant un événement synthétique vide
  function handleClear() {
    onChange({ target: { value: "" } });
  }

  return (
    <div className="relative flex items-center w-full">
      {/* Label accessible masqué visuellement */}
      <label htmlFor="search-task" className="sr-only">
        Rechercher une tâche
      </label>

      {/* Icône loupe (positionnée à gauche de l'input) */}
      <span
        aria-hidden="true"
        className="absolute left-3 text-zinc-500 pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </span>

      {/* Champ de saisie */}
      <input
        id="search-task"
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Rechercher une tâche..."
        className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-10 text-sm text-zinc-800 placeholder-zinc-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900"
      />

      {/* Bouton d'effacement — visible uniquement si une valeur est saisie */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Effacer la recherche"
          className="absolute right-3 cursor-pointer text-zinc-500 transition hover:text-zinc-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
