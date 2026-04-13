// Pied de page du site
export default function SiteFooter() {
  const liens = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Contact" },
  ];

  return (
    <footer className="w-full bg-slate-100 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 text-sm tracking-wide text-slate-700 md:flex-row">
        <div className="text-lg font-bold">QuietArchitect</div>

        <nav aria-label="Liens du pied de page">
          <ul className="flex gap-8">
            {liens.map((lien) => (
              <li key={lien.label}>
                <a
                  href={lien.href}
                  className="opacity-80 transition-all hover:text-blue-900 hover:opacity-100"
                >
                  {lien.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p>© 2024 QuietArchitect. Built for focus.</p>
      </div>
    </footer>
  );
}
