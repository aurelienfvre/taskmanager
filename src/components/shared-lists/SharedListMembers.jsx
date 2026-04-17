"use client";

import { useState } from "react";
import SharedListMemberForm from "./SharedListMemberForm";
import SharedListMemberRow from "./SharedListMemberRow";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    } catch (error) {
      setErreur(error?.message ?? "Impossible d'ajouter ce membre.");
    }
  };

  const membres = list?.memberEmails ?? [];
  const roles = list?.roles ?? {};
  const emailRoles = list?.emailRoles ?? {};
  const emailToUid = list?.emailToUid ?? {};

  // Rôle affiché pour un email — owner a toujours admin.
  const roleDe = (mail) => {
    if (mail === ownerEmail) return "admin";
    const u = emailToUid[mail];
    if (u && roles[u]) return roles[u];
    if (emailRoles[mail]) return emailRoles[mail];
    return "viewer";
  };

  return (
    <section aria-label="Membres de la liste" className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
        Membres ({membres.length})
      </h3>

      <ul className="mb-4 flex flex-col gap-2">
        {membres.length === 0 && <li className="text-sm text-zinc-500">Aucun membre.</li>}
        {membres.map((mail) => {
          const roleCourant = roleDe(mail);
          const targetUid = emailToUid[mail] ?? null;
          return (
            <SharedListMemberRow
              key={mail}
              mail={mail}
              ownerEmail={ownerEmail}
              targetUid={targetUid}
              roleCourant={roleCourant}
              peutGerer={peutGerer}
              membreEnCours={membreEnCours}
              onRemoveMember={onRemoveMember}
              onChangeRole={onChangeRole}
            />
          );
        })}
      </ul>

      {peutGerer && (
        <SharedListMemberForm
          email={email}
          roleAjout={roleAjout}
          erreur={erreur}
          membreEnCours={membreEnCours}
          onSubmit={handleAdd}
          onEmailChange={(e) => { setEmail(e.target.value); if (erreur) setErreur(""); }}
          onRoleChange={(e) => setRoleAjout(e.target.value)}
        />
      )}
      {erreur !== "" && <p role="alert" className="mt-2 text-sm text-red-600">{erreur}</p>}
    </section>
  );
}
