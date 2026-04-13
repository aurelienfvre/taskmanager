// Composant représentant une tâche unique dans une liste
export default function TaskItem({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onDelete,
}) {
  // Styles du badge selon la priorité (palette monochrome de la maquette)
  const stylesPriorite = {
    haute: "bg-zinc-900 text-white",
    moyenne: "bg-zinc-200 text-zinc-600",
    basse: "bg-zinc-100 text-zinc-500",
  };

  const classeBadge = stylesPriorite[priority] ?? "bg-zinc-100 text-zinc-500";

  return (
    <article className="group flex items-start gap-4 rounded-2xl bg-white p-5 transition-all duration-200 hover:ring-1 hover:ring-zinc-200">
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
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classeBadge}`}
          >
            {priority}
          </span>
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

      {/* Bouton supprimer — révélé au survol */}
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
    </article>
  );
}
