"use client";

import { useState } from "react";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES_OPTIONS = [
  { value: "viewer", label: "Lecteur" },
  { value: "editor", label: "Éditeur" },
  { value: "admin", label: "Admin" },
];

// Section membres d'une liste partagée. `peutGerer` conditionne l'affichage
// du formulaire et des boutons Retirer/changer de rôle.
export default function SharedListMembers({
  list,
  ownerEmail,
  onAddMember,
  onRemoveMember,
  onChangeRole,
  membreEnCours,
  peutGerer = false,
}) {
  const [email, setEmail] = useState("");
  const [roleAjout, setRoleAjout] = useState("viewer");
  const [erreur, setErreur] = useState("");

  const handleAdd = async (event) => {
    event.preventDefault();
    const valeur = email.trim().toLowerCase();
    if (valeur === "") { setErreur("L'email ne peut pas être vide."); return; }
    if (!REGEX_EMAIL.test(valeur)) { setErreur("Format d'email invalide."); return; }
    try {
      await onAddMember(valeur, roleAjout);
      setEmail(""); setRoleAjout("viewer"); setErreur("");
    } catch {
      setErreur("Impossible d'ajouter ce membre.");
    }
  };

  const membres = list?.memberEmails ?? [];
  const roles = list?.roles ?? {};
  const emailToUid = list?.emailToUid ?? {};

  // Rôle affiché pour un email — owner a toujours admin.
  const roleDe = (mail) => {
    if (mail === ownerEmail) return "admin";
    const u = emailToUid[mail];
    return (u && roles[u]) ? roles[u] : "viewer";
  };

  return (
    <section aria-label="Membres de la liste" className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
        Membres ({membres.length})
      </h3>

      <ul className="mb-4 flex flex-col gap-2">
        {membres.length === 0 && <li className="text-sm text-zinc-500">Aucun membre.</li>}
        {membres.map((mail) => {
          const estOwner = mail === ownerEmail;
          const roleCourant = roleDe(mail);
          const targetUid = emailToUid[mail] ?? null;
          return (
            <li key={mail} className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-700">
              <span className="truncate">{mail}{estOwner && " (propriétaire)"}</span>
              <div className="flex items-center gap-2">
                {peutGerer && !estOwner && targetUid && typeof onChangeRole === "function" ? (
                  <label className="sr-only" htmlFor={`role-${mail}`}>Rôle de {mail}</label>
                ) : null}
                {peutGerer && !estOwner && targetUid && typeof onChangeRole === "function" ? (
                  <select
                    id={`role-${mail}`}
                    value={roleCourant}
                    onChange={(e) => onChangeRole(targetUid, e.target.value)}
                    disabled={membreEnCours}
                    className="h-8 cursor-pointer rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {ROLES_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    {ROLES_OPTIONS.find((r) => r.value === roleCourant)?.label ?? roleCourant}
                  </span>
                )}
                {peutGerer && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(mail)}
                    disabled={estOwner || membreEnCours}
                    className="cursor-pointer rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Retirer ${mail}`}
                  >
                    Retirer
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {peutGerer && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row" aria-label="Ajouter un membre" noValidate>
          <label htmlFor="membre-email" className="sr-only">Email du membre</label>
          <input
            id="membre-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (erreur) setErreur(""); }}
            placeholder="email@exemple.com"
            disabled={membreEnCours}
            className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <label htmlFor="membre-role" className="sr-only">Rôle</label>
          <select
            id="membre-role"
            value={roleAjout}
            onChange={(e) => setRoleAjout(e.target.value)}
            disabled={membreEnCours}
            className="h-10 cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ROLES_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <button
            type="submit"
            disabled={membreEnCours}
            className="h-10 cursor-pointer rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ajouter
          </button>
        </form>
      )}
      {erreur !== "" && <p role="alert" className="mt-2 text-sm text-red-600">{erreur}</p>}
    </section>
  );
}
