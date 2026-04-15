"use client";

import { useState } from "react";

// Formulaire inline d'ajout rapide. Gère son propre champ texte pour éviter
// de faire remonter chaque frappe dans le composant parent.
export default function AddTaskForm({ onAdd, ajoutEnCours }) {
  const [nouvelleTache, setNouvelleTache] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const titre = nouvelleTache.trim();
    if (titre === "" || ajoutEnCours) return;
    await onAdd(titre);
    setNouvelleTache("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      aria-label="Ajouter une nouvelle tâche"
    >
      <label htmlFor="nouvelle-tache" className="sr-only">
        Titre de la nouvelle tâche
      </label>
      <input
        id="nouvelle-tache"
        type="text"
        value={nouvelleTache}
        onChange={(event) => setNouvelleTache(event.target.value)}
        placeholder="Nouvelle tâche…"
        disabled={ajoutEnCours}
        className="w-full flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={nouvelleTache.trim() === "" || ajoutEnCours}
        className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Ajouter
      </button>
    </form>
  );
}
