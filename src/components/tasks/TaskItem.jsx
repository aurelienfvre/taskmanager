// Cycle des priorités utilisé par le badge cliquable : high → medium → low → high.
const CYCLE_PRIORITE = { high: "medium", medium: "low", low: "high" };

// Composant représentant une tâche unique dans une liste
export default function TaskItem({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onDelete,
  onChangePriority,
}) {
  // Styles du badge selon la priorité (palette monochrome de la maquette).
  // Clés EN pour rester alignées avec Firestore et le tri.
  const stylesPriorite = {
    high: "bg-zinc-900 text-white",
    medium: "bg-zinc-200 text-zinc-600",
    low: "bg-zinc-100 text-zinc-500",
  };

  // Libellés FR visibles pour l'utilisateur, séparés des clés techniques
  const libellesPriorite = {
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
  };

  const classeBadge = stylesPriorite[priority] ?? "bg-zinc-100 text-zinc-500";
  const libelleBadge = libellesPriorite[priority] ?? priority;

  return (
    <article className="group flex items-start gap-4 bg-white p-4 transition-colors hover:bg-zinc-50">
      {/* Case à cocher */}
      <div className="pt-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          aria-label={
            completed
              ? `Marquer la tâche "${title}" comme non terminée`
              : `Marquer la tâche "${title}" comme terminée`
          }
          className="h-5 w-5 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
        />
      </div>

      {/* Contenu : titre + badge + description */}
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-3">
          <h3
            className={`text-base font-semibold ${
              completed ? "text-zinc-400 line-through" : "text-zinc-900"
            }`}
          >
            {title}
          </h3>
          {typeof onChangePriority === "function" ? (
            <button
              type="button"
              onClick={() =>
                onChangePriority(id, CYCLE_PRIORITE[priority] ?? "medium")
              }
              aria-label={`Changer la priorité de la tâche "${title}" (actuelle : ${libelleBadge})`}
              className={`cursor-pointer rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-zinc-900 ${classeBadge}`}
            >
              {libelleBadge}
            </button>
          ) : (
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classeBadge}`}
            >
              {libelleBadge}
            </span>
          )}
        </div>
        {description && (
          <p
            className={`max-w-2xl text-sm leading-relaxed ${
              completed ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {/* Bouton supprimer — révélé au survol, masqué si onDelete absent (viewer) */}
      {typeof onDelete === "function" && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          aria-label={`Supprimer la tâche "${title}"`}
          className="cursor-pointer rounded-md p-2 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            delete
          </span>
        </button>
      )}
    </article>
  );
}
