// Grille bento présentant les fonctionnalités principales
export default function FeaturesBento() {
  const petitesFonctionnalites = [
    {
      icone: "sync",
      titre: "Synchronisation",
      description:
        "Synchronisez vos tâches sur tous vos appareils en temps réel sans effort.",
    },
    {
      icone: "group",
      titre: "Collaboration",
      description:
        "Partagez des projets et assignez des tâches à votre équipe en un clic.",
    },
    {
      icone: "analytics",
      titre: "Analytique",
      description:
        "Visualisez votre productivité avec des rapports hebdomadaires détaillés.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Fonctionnalité principale (large) */}
        <article className="flex aspect-video flex-col justify-between rounded-2xl bg-zinc-100 p-12 md:col-span-2 md:aspect-auto">
          <div>
            <span
              className="material-symbols-outlined mb-6 text-4xl text-zinc-900"
              aria-hidden="true"
            >
              bolt
            </span>
            <h3 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900">
              Vitesse Instantanée
            </h3>
            <p className="max-w-md text-zinc-500">
              Conçu pour la rapidité. Des raccourcis clavier pour tout, aucun
              temps de chargement, juste du travail accompli.
            </p>
          </div>
          <div className="mt-8">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIAUHh9owuzsGGdOCD4qIVRLdlwtaeQVd4WKzyDIergoymn7m0LQIPVBb0CTw_lsG8bM2FTH7J8OaCHyiiU9VUD4yaSjCn9oc2FoIK-JcNlbfykiHRszkhmMJv09DtRebdaIi4ZsMM7Zz27pjfU794kZem6mPsXDBr8kbzCTzu4fglSZDl7vi4tHRhP08NG3eHxDqPrLyQt-7EKQVT4oAeE0Jegriy8TV4x4IGdoWz_f45cacCFsoPBv_1JsJSadCDf3zgqAVfPMPF"
              alt="Code propre affiché sur un écran dans un espace de travail monochrome"
              className="rounded-lg border border-zinc-200 shadow-sm"
            />
          </div>
        </article>

        {/* Fonctionnalité mise en avant (fond sombre) */}
        <article className="flex flex-col justify-between rounded-2xl bg-zinc-900 p-12 text-zinc-50">
          <div>
            <span
              className="material-symbols-outlined mb-6 text-4xl"
              aria-hidden="true"
            >
              security
            </span>
            <h3 className="mb-4 text-3xl font-bold tracking-tight">
              Confidentialité Totale
            </h3>
            <p className="text-zinc-400">
              Vos données vous appartiennent. Chiffrement de bout en bout par
              défaut.
            </p>
          </div>
          <div className="mt-8 flex gap-2" aria-hidden="true">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-700">
              <div className="h-full w-3/4 bg-white" />
            </div>
          </div>
        </article>

        {/* Fonctionnalités secondaires */}
        {petitesFonctionnalites.map((fonctionnalite) => (
          <article
            key={fonctionnalite.titre}
            className="flex flex-col gap-4 rounded-2xl bg-zinc-100 p-8"
          >
            <span
              className="material-symbols-outlined text-zinc-900"
              aria-hidden="true"
            >
              {fonctionnalite.icone}
            </span>
            <h4 className="text-xl font-bold text-zinc-900">
              {fonctionnalite.titre}
            </h4>
            <p className="text-sm text-zinc-500">{fonctionnalite.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
