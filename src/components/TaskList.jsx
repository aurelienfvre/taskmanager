import TaskItem from "./TaskItem";
import TaskListEmpty from "./TaskListEmpty";

// Liste de tâches : affiche les TaskItem ou un état vide adapté.
// isFiltre : true si une recherche ou un filtre est actif.
export default function TaskList({ tasks, onToggle, onDelete, isFiltre = false }) {
  if (tasks.length === 0) {
    return <TaskListEmpty isFiltre={isFiltre} />;
  }

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
