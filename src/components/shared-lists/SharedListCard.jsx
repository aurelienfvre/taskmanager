"use client";

// Carte récapitulative d'une liste partagée. Boutons ouvrir/supprimer ;
// suppression réservée au propriétaire.
export default function SharedListCard({ list, currentUserId, onOpen, onDelete }) {
  const estProprietaire = list.ownerId === currentUserId;
  const nbMembres = list.memberEmails?.length ?? 0;

  const handleDelete = async () => {
    // Confirmation simple : pas de modal custom vu la taille du projet
    if (!window.confirm(`Supprimer la liste « ${list.name} » ?`)) return;
    try {
      await onDelete(list.id);
    } catch (error) {
      console.error("Impossible de supprimer la liste :", error);
    }
  };

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <header className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
          {list.name}
        </h3>
        {estProprietaire && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
            Propriétaire
          </span>
        )}
      </header>

      <p className="text-sm text-zinc-600">
        {nbMembres} membre{nbMembres > 1 ? "s" : ""}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpen(list.id)}
          className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          aria-label={`Ouvrir la liste ${list.name}`}
        >
          Ouvrir
        </button>
        {estProprietaire && (
          <button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Supprimer la liste ${list.name}`}
          >
            Supprimer
          </button>
        )}
      </div>
    </article>
  );
}
