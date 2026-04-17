const ROLES_OPTIONS = [
  { value: "viewer", label: "Lecteur" },
  { value: "editor", label: "Éditeur" },
  { value: "admin", label: "Admin" },
];

export default function SharedListMemberForm({
  email,
  roleAjout,
  erreur,
  membreEnCours,
  onEmailChange,
  onRoleChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row" aria-label="Ajouter un membre" noValidate>
      <label htmlFor="membre-email" className="sr-only">Email du membre</label>
      <input
        id="membre-email"
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="email@exemple.com"
        disabled={membreEnCours}
        className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        aria-invalid={erreur !== ""}
      />
      <label htmlFor="membre-role" className="sr-only">Rôle</label>
      <select
        id="membre-role"
        value={roleAjout}
        onChange={onRoleChange}
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
  );
}
