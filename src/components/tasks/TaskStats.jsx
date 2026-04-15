// Affiche trois compteurs : total, tâches complétées et tâches actives
export default function TaskStats({ tasks }) {
  const total = tasks.length;
  const completees = tasks.filter((tache) => tache.completed).length;
  const actives = total - completees;

  const stats = [
    { label: "Total", valeur: total },
    { label: "Complétées", valeur: completees },
    { label: "Actives", valeur: actives },
  ];

  return (
    <ul
      aria-label="Statistiques des tâches"
      className="grid grid-cols-3 gap-4"
    >
      {stats.map((stat) => (
        <li
          key={stat.label}
          className="flex flex-col gap-1 rounded-2xl bg-white p-6 ring-1 ring-zinc-200"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {stat.label}
          </span>
          <span className="text-4xl font-bold tracking-tighter text-zinc-900">
            {stat.valeur}
          </span>
        </li>
      ))}
    </ul>
  );
}