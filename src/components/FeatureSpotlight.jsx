// Section mettant en avant les fonctionnalités clés
export default function FeatureSpotlight() {
  const fonctionnalites = [
    {
      icone: "layers",
      titre: "Hierarchie Intuitive",
      description:
        "Naviguez dans vos tâches les plus complexes sans jamais perdre le fil conducteur.",
    },
    {
      icone: "filter_center_focus",
      titre: "Mode Focus",
      description:
        "Une interface qui s'efface pour laisser place à votre créativité et votre exécution.",
    },
  ];

  return (
    <section className="bg-slate-100 py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid items-center gap-24 md:grid-cols-2">
          {/* Colonne texte */}
          <div>
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-blue-900">
              Mindful Design
            </span>
            <h2 className="mb-8 text-5xl font-black leading-tight text-slate-900">
              L&apos;architecture du calme dans vos projets.
            </h2>

            <ul className="space-y-8">
              {fonctionnalites.map((fonctionnalite) => (
                <li key={fonctionnalite.titre} className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <span
                      className="material-symbols-outlined text-blue-900"
                      aria-hidden="true"
                    >
                      {fonctionnalite.icone}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">{fonctionnalite.titre}</h3>
                    <p className="text-slate-700">{fonctionnalite.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne visuelle : image + citation flottante */}
          <div className="relative">
            <div className="aspect-[4/5] rotate-2 overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjh18eJwLe_OLCdA17hHNLnhAgV8bV97gR5NyeFJyBozqN3XpZfTF2lEDNxo6oS53cw_gnvAXtn5pKLS3MMnv5l2Z2LKqR2WwFamubjHCdqi9aaIfoN77kAdOCILN09qRtTjGhm06tE3GHQhuGmj4aRBUclc4KkOjMTtql51_HxvqgOoKAmOCHgen2hhpIuIdnznX0SR8NO4P8C4NXjwSVttH5DfIrf3P15syKH_c1AelgWeOabq11cmCpGFtps7gbULEHVzTOKhmb"
                alt="Intérieur de bureau d'architecte moderne avec grandes baies vitrées au crépuscule"
                className="h-full w-full object-cover"
              />
            </div>

            <figure className="absolute -bottom-8 -left-8 max-w-xs -rotate-2 rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-xl">
              <blockquote className="mb-2 text-lg font-bold italic text-blue-900">
                « La simplicité est la sophistication suprême. »
              </blockquote>
              <figcaption className="text-sm font-medium opacity-60">
                — QuietArchitect Team
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
