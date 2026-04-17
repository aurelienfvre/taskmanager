"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";

// Wrapper sortable autour de TaskItem : isole la logique dnd-kit pour
// garder TaskItem pur et réutilisable en mode non-draggable.
// `canDrag` permet de désactiver le drag pour les rôles viewer.
export default function SortableTaskItem({ task, onToggle, onDelete, onChangePriority, canDrag = true }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !canDrag });

  // Entorse assumée : Tailwind ne peut pas exprimer un transform dynamique runtime
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-stretch">
      {canDrag && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Déplacer la tâche "${task.title}". Espace pour saisir, flèches pour déplacer, Espace pour déposer.`}
          className="flex cursor-grab touch-none items-center px-2 text-zinc-400 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 active:cursor-grabbing"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            drag_indicator
          </span>
        </button>
      )}
      <div className="flex-1">
        <TaskItem
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={onToggle}
          onDelete={onDelete}
          onChangePriority={onChangePriority}
        />
      </div>
    </li>
  );
}
