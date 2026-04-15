// Clés en anglais pour correspondre directement aux valeurs stockées dans
// Firestore : on peut indexer avec `tache.priority` sans mapping intermédiaire.
export const ORDRE_PRIORITE = { high: 1, medium: 2, low: 3 };

// Fonction pure : prend les tâches brutes + options UI et retourne la liste
// filtrée puis triée. Isolée pour pouvoir être testée sans React.
export function filtrerEtTrierTaches(tasks, { searchQuery, filter, sortOrder }) {
  const requete = searchQuery.toLowerCase();

  const filtrees = tasks.filter((tache) => {
    const correspondRecherche = (tache.title ?? "").toLowerCase().includes(requete);
    if (!correspondRecherche) return false;
    if (filter === "actives") return !tache.completed;
    if (filter === "completees") return tache.completed;
    return true;
  });

  // Mode "manuel" : on conserve l'ordre Firestore (déjà trié par `order` asc)
  // pour que le drag & drop reste stable après un drop.
  if (sortOrder === "manuel") return filtrees;

  return [...filtrees].sort((a, b) => {
    if (sortOrder === "priority") {
      return (
        (ORDRE_PRIORITE[a.priority] ?? 99) - (ORDRE_PRIORITE[b.priority] ?? 99)
      );
    }
    // Latency compensation Firestore : serverTimestamp() renvoie null dans le
    // snapshot local immédiat avant le round-trip serveur. On force ces tâches
    // fraîchement créées en tête de liste tant que le timestamp n'est pas confirmé.
    const secondesA = a.createdAt?.seconds ?? Infinity;
    const secondesB = b.createdAt?.seconds ?? Infinity;
    return secondesB - secondesA;
  });
}
