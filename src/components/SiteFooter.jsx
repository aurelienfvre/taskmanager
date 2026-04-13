// Pied de page du site
export default function SiteFooter() {
  const liens = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Contact" },
  ];

  return (
    <footer className="w-full bg-zinc-50 px-8 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-zinc-500">
          © 2024 TaskManager. All rights reserved.
        </p>

        <nav aria-label="Liens du pied de page">
          <ul className="flex gap-8">
            {liens.map((lien) => (
              <li key={lien.label}>
                <a
                  href={lien.href}
                  className="text-sm text-zinc-500 underline underline-offset-4 duration-200 ease-in-out hover:text-zinc-900"
                >
                  {lien.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
