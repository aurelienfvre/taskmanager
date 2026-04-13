// Barre de navigation en haut de la page
export default function TopNavBar() {
  const liens = [
    { href: "#", label: "Projects" },
    { href: "#", label: "Workflow" },
    { href: "#", label: "Focus" },
    { href: "#", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6"
      >
        <div className="text-2xl font-black tracking-tighter text-blue-900">
          QuietArchitect
        </div>

        <ul className="hidden items-center gap-8 text-lg font-medium md:flex">
          {liens.map((lien) => (
            <li key={lien.label}>
              <a
                href={lien.href}
                className="text-slate-700 transition-colors duration-200 hover:text-blue-700"
              >
                {lien.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-xl bg-blue-900 px-6 py-2.5 font-medium text-white transition-all hover:opacity-90 active:scale-95"
        >
          Get Started
        </button>
      </nav>
    </header>
  );
}
