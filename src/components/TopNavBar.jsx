// Barre de navigation fixée en haut de la page
export default function TopNavBar() {
  const liens = [
    { href: "#", label: "Features" },
    { href: "#", label: "Pricing" },
    { href: "#", label: "About" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 tracking-tight"
      >
        <div className="text-xl font-bold tracking-tighter text-zinc-900">
          TaskManager
        </div>

        <ul className="hidden items-center gap-8 md:flex">
          {liens.map((lien) => (
            <li key={lien.label}>
              <a
                href={lien.href}
                className="text-zinc-500 transition-colors duration-200 ease-in-out hover:text-zinc-900"
              >
                {lien.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-sm font-medium text-zinc-500 transition-colors duration-200 ease-in-out hover:text-zinc-900"
          >
            Sign In
          </button>
          <button
            type="button"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-all duration-200 hover:bg-zinc-800"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}
