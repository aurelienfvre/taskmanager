"use client";

import SharedListCard from "./SharedListCard";

// Grille responsive des listes partagées + état vide. Extrait de la page
// pour garder src/app/shared/page.jsx sous la limite de 100 lignes.
export default function SharedListsGrid({ listes, currentUserId, onOpen, onDelete }) {
  if (listes.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-600">
        Aucune liste partagée pour le moment. Créez-en une pour commencer.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {listes.map((liste) => (
        <li key={liste.id}>
          <SharedListCard
            list={liste}
            currentUserId={currentUserId}
            onOpen={onOpen}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
