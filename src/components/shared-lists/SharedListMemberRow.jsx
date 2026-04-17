const ROLES_OPTIONS = [
  { value: "viewer", label: "Lecteur" },
  { value: "editor", label: "Éditeur" },
  { value: "admin", label: "Admin" },
];

export default function SharedListMemberRow({
  mail,
  ownerEmail,
  targetUid,
  roleCourant,
  peutGerer,
  membreEnCours,
  onRemoveMember,
  onChangeRole,
}) {
  const estOwner = mail === ownerEmail;
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-700">
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
}
