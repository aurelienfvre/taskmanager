// Sidebar de l'aperçu produit, extraite pour alléger ProductPreview.
const NAVIGATION_ITEMS = [
  { icone: "today", label: "Today", actif: true },
  { icone: "calendar_month", label: "Upcoming", actif: false },
  { icone: "star", label: "Important", actif: false },
];

export default function ProductPreviewSidebar() {
  return (
    <aside className="hidden w-64 border-r border-zinc-100 p-6 md:block">
      <div className="space-y-6">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            folder
          </span>
          Workspace
        </div>

        <ul className="space-y-3">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center gap-2 rounded p-2 text-sm ${
                  item.actif ? "bg-zinc-50 text-zinc-900" : "text-zinc-600"
                }`}
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  {item.icone}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
