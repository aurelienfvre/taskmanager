// État vide de la liste : variante filtrée vs. vide initiale. Extrait pour
// éviter la duplication quasi-identique du conteneur dans TaskList.
export default function TaskListEmpty({ isFiltre }) {
  const contenu = isFiltre
    ? {
        icone: "search_off",
        titre: "Aucune tâche ne correspond",
        message:
          "Essayez d'affiner votre recherche ou de modifier les filtres appliqués.",
      }
    : {
        icone: "draw",
        titre: "Aucune tâche pour le moment",
        message:
          "Votre file éditoriale est vide. Profitez de ce moment pour réfléchir, explorer de nouvelles idées ou simplement respirer.",
      };

  return (
    <section>
      <header className="mb-8 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
          Current Focus
        </h2>
      </header>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <span
            className="material-symbols-outlined text-3xl text-zinc-300"
            aria-hidden="true"
          >
            {contenu.icone}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-bold text-zinc-900">{contenu.titre}</h3>
        <p className="max-w-xs text-center text-sm leading-relaxed text-zinc-500">
          {contenu.message}
        </p>
        {!isFiltre && (
          <button
            type="button"
            className="mt-8 cursor-pointer border-b-2 border-zinc-900 pb-1 text-sm font-bold transition-all hover:border-zinc-400 hover:text-zinc-600"
          >
            Créer une tâche
          </button>
        )}
      </div>
    </section>
  );
}
