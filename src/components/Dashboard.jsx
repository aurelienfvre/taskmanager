import TaskStats from "./TaskStats";
import ProgressBar from "./ProgressBar";

// Tableau de bord combinant les statistiques et la barre de progression
export default function Dashboard({ tasks = [] }) {
  const total = tasks.length;

  // Cas vide : aucune statistique à afficher, on invite à créer une tâche
  if (total === 0) {
    return (
      <section
        aria-label="Tableau de bord"
        className="mb-8 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center"
      >
        <h3 className="mb-2 text-base font-bold text-zinc-900">
          Aucune statistique à afficher
        </h3>
        <p className="text-sm text-zinc-600">
          Ajoutez votre première tâche pour suivre votre progression.
        </p>
      </section>
    );
  }

  const completees = tasks.filter((tache) => tache.completed).length;
  const pourcentage = (completees / total) * 100;

  return (
    <section
      aria-label="Tableau de bord"
      className="mb-8 flex flex-col gap-6 rounded-2xl bg-zinc-50 p-6"
    >
      <TaskStats tasks={tasks} />
      <ProgressBar
        percentage={pourcentage}
        label={`${completees} sur ${total} tâches terminées`}
      />
    </section>
  );
}
