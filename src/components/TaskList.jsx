import TaskItem from "./TaskItem";

// Liste de tâches : affiche les TaskItem ou un message si la liste est vide
export default function TaskList({ tasks, onToggle, onDelete }) {
  const estVide = tasks.length === 0;

  // État vide : carte illustrée avec invite à créer une tâche
  if (estVide) {
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
              draw
            </span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-zinc-900">
            Aucune tâche pour le moment
          </h3>
          <p className="max-w-xs text-center text-sm leading-relaxed text-zinc-500">
            Votre file éditoriale est vide. Profitez de ce moment pour réfléchir,
            explorer de nouvelles idées ou simplement respirer.
          </p>
          <button
            type="button"
            className="mt-8 cursor-pointer border-b-2 border-zinc-900 pb-1 text-sm font-bold transition-all hover:border-zinc-400 hover:text-zinc-600"
          >
            Créer une tâche
          </button>
        </div>
      </section>
    );
  }

  // État normal : en-tête avec compteur puis liste des tâches
  return (
    <section>
      <header className="mb-8 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
          Current Focus
        </h2>
        <span className="text-xs font-medium text-zinc-400">
          {tasks.length} ACTIVE {tasks.length > 1 ? "TASKS" : "TASK"}
        </span>
      </header>

      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem
              id={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              completed={task.completed}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
