// Aperçu visuel du tableau de bord (grille bento asymétrique)
export default function DashboardPreview() {
  return (
    <div className="mx-auto mt-24 grid w-full max-w-7xl grid-cols-1 items-start gap-6 md:grid-cols-12">
      {/* Carte principale : liste de tâches simulée */}
      <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:col-span-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="h-10 w-48 rounded-lg bg-slate-200" aria-hidden="true" />
          <div className="flex gap-2" aria-hidden="true">
            <div className="h-8 w-8 rounded-full bg-slate-100" />
            <div className="h-8 w-8 rounded-full bg-slate-100" />
          </div>
        </header>

        <ul className="space-y-4">
          <li className="flex h-16 items-center gap-4 rounded-xl bg-blue-100/50 px-6">
            <span className="h-6 w-6 rounded border-2 border-blue-700" aria-hidden="true" />
            <span className="h-4 w-1/3 rounded bg-blue-700/20" aria-hidden="true" />
          </li>
          <li className="flex h-16 items-center gap-4 rounded-xl bg-slate-100 px-6 opacity-60">
            <span className="h-6 w-6 rounded border-2 border-slate-400" aria-hidden="true" />
            <span className="h-4 w-1/2 rounded bg-slate-400/40" aria-hidden="true" />
          </li>
          <li className="flex h-16 items-center gap-4 rounded-xl bg-slate-100 px-6 opacity-40">
            <span className="h-6 w-6 rounded border-2 border-slate-400" aria-hidden="true" />
            <span className="h-4 w-1/4 rounded bg-slate-400/40" aria-hidden="true" />
          </li>
        </ul>
      </article>

      {/* Colonne droite : deux cartes mises en avant */}
      <div className="space-y-6 md:col-span-4">
        <article className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl bg-blue-100 p-8">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxBHw9FjDIbUoWRBJiJcMbcNQ-7mybnEYpZklIDkxj-9_YztLpYHIpWZ9Re9qHsmnlOxKItroz4q58KH2ykPBdD4jkM7n5Wkx4tLN086iHoofiZg3IiQUnQMmAvWyEc5ElgJtEFyIQFre4xb9lgnz904QF17Zb61oRmuuXsCXLPqjw_-cuapRXJeaiQL796vRhd2Y3LbLPnWLIjm8xmg_NXE2KuxMjy4NMZlOjRsSa1HLzb9knPd7y8poGzCr324_VKXzcc3m5vLMX"
            alt="Bureau minimaliste avec un carnet et un stylo, baigné de lumière matinale"
            className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
          />
          <h3 className="relative z-10 text-2xl font-bold text-blue-950">Peak Flow</h3>
          <p className="relative z-10 text-blue-950/80">
            Optimisé pour les sessions de travail profond.
          </p>
        </article>

        <article className="rounded-2xl bg-orange-100 p-8">
          <span
            className="material-symbols-outlined mb-4 text-4xl text-orange-700"
            aria-hidden="true"
          >
            bolt
          </span>
          <h3 className="text-xl font-bold text-orange-900">Instant Sync</h3>
          <p className="text-orange-900/80">Chaque idée capturée, partout.</p>
        </article>
      </div>
    </div>
  );
}
