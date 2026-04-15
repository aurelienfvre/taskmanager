import ProgressBar from "@/components/tasks/ProgressBar";

// Vue compacte inline : une ligne de stats + barre de progression fine.
// On évite les trois grosses cards qui volaient trop d'espace vertical.
export default function Dashboard({ tasks = [] }) {
  const total = tasks.length;

  // Cas vide : pas de stats à afficher, on donne juste un indice textuel léger
  if (total === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Aucune tâche pour l&apos;instant. Ajoutez-en une ci-dessous pour commencer.
      </p>
    );
  }

  const completees = tasks.filter((tache) => tache.completed).length;
  const actives = total - completees;
  const pourcentage = (completees / total) * 100;

  const STATS = [
    { label: "tâches", valeur: total },
    { label: "terminées", valeur: completees },
    { label: "actives", valeur: actives },
  ];

  return (
    <section aria-label="Tableau de bord" className="flex flex-col gap-2">
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
        {STATS.map((stat, index) => (
          <li key={stat.label} className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold text-zinc-900">
              {stat.valeur}
            </span>
            <span className="text-zinc-500">{stat.label}</span>
            {/* Séparateur visuel entre items, masqué au lecteur d'écran */}
            {index < STATS.length - 1 && (
              <span aria-hidden="true" className="ml-4 text-zinc-300">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
      <ProgressBar
        percentage={pourcentage}
        label={`${completees} sur ${total} tâches terminées`}
      />
    </section>
  );
}
