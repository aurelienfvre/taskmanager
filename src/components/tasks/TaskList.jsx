"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskItem from "./SortableTaskItem";
import TaskListEmpty from "./TaskListEmpty";

// Liste de tâches triable par drag & drop.
// - `onReorder(orderedIds)` déclenché quand l'utilisateur lâche la tâche.
//   S'il n'est pas fourni, le D&D reste activé visuellement mais ne
//   persiste rien (utile pour les listes filtrées où l'ordre n'a pas
//   de sens applicatif).
// - `canDrag` : désactive totalement la poignée pour les rôles viewer.
export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onReorder,
  onAdd,
  onChangePriority,
  canDrag = true,
  isFiltre = false,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (tasks.length === 0) {
    return <TaskListEmpty isFiltre={isFiltre} onAdd={onAdd} />;
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const nouvelOrdre = arrayMove(tasks, oldIndex, newIndex).map((t) => t.id);
    if (typeof onReorder === "function") onReorder(nouvelOrdre);
  };

  return (
    <section aria-label="Liste des tâches" className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Mes tâches ({tasks.length})
      </h2>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
            {tasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onChangePriority={onChangePriority}
                canDrag={canDrag && !isFiltre}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}
