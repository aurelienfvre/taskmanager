"use client";

import { useState } from "react";

// Formulaire d'ajout d'une liste partagée. État local pour éviter de
// remonter chaque frappe dans la page parente.
export default function CreateListForm({ onCreate, creationEnCours }) {
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (creationEnCours) return;
    const valeur = nom.trim();
    if (valeur === "") {
      setErreur("Le nom ne peut pas être vide.");
      return;
    }
    try {
      await onCreate(valeur);
      setNom("");
      setErreur("");
    } catch {
      setErreur("Impossible de créer la liste.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row" aria-label="Créer une liste partagée" noValidate>
      <label htmlFor="nouvelle-liste" className="sr-only">Nom de la liste</label>
      <input
        id="nouvelle-liste"
        type="text"
        value={nom}
        onChange={(e) => { setNom(e.target.value); if (erreur) setErreur(""); }}
        placeholder="Nom de la nouvelle liste…"
        disabled={creationEnCours}
        aria-invalid={erreur !== ""}
        className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={creationEnCours}
        className="h-10 cursor-pointer rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Créer
      </button>
      {erreur !== "" && (
        <p role="alert" className="text-sm text-red-600 sm:ml-4 sm:self-center">{erreur}</p>
      )}
    </form>
  );
}
