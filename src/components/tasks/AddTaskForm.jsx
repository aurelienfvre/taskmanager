"use client";

import { useState } from "react";

// Formulaire inline d'ajout rapide. Gère son propre état pour éviter de
// remonter chaque frappe dans le parent.
export default function AddTaskForm({ onAdd, ajoutEnCours }) {
  const [nouvelleTache, setNouvelleTache] = useState("");
  const [priorite, setPriorite] = useState("medium");
  const [erreur, setErreur] = useState("");

  const handleChange = (event) => {
    setNouvelleTache(event.target.value);
    if (erreur !== "") setErreur("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (ajoutEnCours) return;
    const titre = nouvelleTache.trim();
    if (titre === "") {
      setErreur("Le titre ne peut pas être vide.");
      return;
    }
    await onAdd(titre, priorite);
    setNouvelleTache("");
    setPriorite("medium");
    setErreur("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
      aria-label="Ajouter une nouvelle tâche"
      noValidate
    >
      {/* Input group : champs et bouton joints sans gap pour former une
          seule zone de saisie visuelle (pattern "segmented input"). */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        <label htmlFor="nouvelle-tache" className="sr-only">
          Titre de la nouvelle tâche
        </label>
        <input
          id="nouvelle-tache"
          type="text"
          value={nouvelleTache}
          onChange={handleChange}
          placeholder="Nouvelle tâche…"
          disabled={ajoutEnCours}
          aria-invalid={erreur !== ""}
          aria-describedby={erreur !== "" ? "nouvelle-tache-erreur" : undefined}
          className="h-10 w-full flex-1 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 transition focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-r-none"
        />
        <label htmlFor="nouvelle-tache-priorite" className="sr-only">
          Priorité
        </label>
        <select
          id="nouvelle-tache-priorite"
          value={priorite}
          onChange={(event) => setPriorite(event.target.value)}
          disabled={ajoutEnCours}
          className="select-chevron h-10 cursor-pointer rounded-lg border border-zinc-300 bg-white pl-3 pr-9 text-sm text-zinc-900 transition focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-none sm:border-l-0"
        >
          <option value="high">Haute</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
        </select>
        <button
          type="submit"
          disabled={ajoutEnCours}
          className="h-10 cursor-pointer rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-l-none"
        >
          Ajouter
        </button>
      </div>
      {erreur !== "" && (
        <p
          id="nouvelle-tache-erreur"
          role="alert"
          className="text-sm text-red-600"
        >
          {erreur}
        </p>
      )}
    </form>
  );
}
