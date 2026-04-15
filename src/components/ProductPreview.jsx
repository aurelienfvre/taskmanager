import ProductPreviewSidebar from "./ProductPreviewSidebar";

const TACHES = [
  { titre: "Finaliser la proposition client", heure: "14:00", fait: false },
  { titre: "Revue trimestrielle de l'équipe", heure: "16:30", fait: false },
  { titre: "Configuration de TaskManager", heure: "Done", fait: true },
];

// Aperçu statique de l'interface produit : sidebar + liste des tâches du jour
export default function ProductPreview() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-12">
      <div className="overflow-hidden rounded-2xl bg-zinc-100 p-4 md:p-8">
        <div className="overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm">
          <div className="flex border-b border-zinc-100">
            <ProductPreviewSidebar />

            <div className="flex-1 p-8">
              <header className="mb-12 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Today&apos;s Focus
                </h2>
                <button
                  type="button"
                  aria-label="Plus d'options"
                  className="cursor-pointer text-zinc-500"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    more_horiz
                  </span>
                </button>
              </header>

              <ul className="space-y-1">
                {TACHES.map((tache) => (
                  <li
                    key={tache.titre}
                    className="flex items-center gap-4 border-b border-zinc-50 px-2 py-4 transition-colors hover:bg-zinc-50"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                        tache.fait ? "border-zinc-900 bg-zinc-900" : "border-zinc-200"
                      }`}
                    >
                      {tache.fait && (
                        <span className="material-symbols-outlined text-[12px] text-white">
                          check
                        </span>
                      )}
                    </span>
                    <span
                      className={`flex-1 ${
                        tache.fait ? "text-zinc-500 line-through" : "text-zinc-900"
                      }`}
                    >
                      {tache.titre}
                    </span>
                    <span className="text-xs text-zinc-500" aria-hidden="true">
                      {tache.heure}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
