"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";

// Navigation latérale affichée uniquement aux utilisateurs connectés.
// Icônes Material Symbols pour rester cohérent avec le reste de l'app.
const LIENS = [
  { href: "/", label: "Mes tâches", icone: "checklist" },
  { href: "/shared", label: "Listes partagées", icone: "groups" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navigation latérale"
      className="fixed left-0 top-0 z-40 hidden h-screen w-64 shrink-0 border-r border-zinc-200 bg-white md:flex md:flex-col"
    >
      <div className="border-b border-zinc-200 px-6 py-5">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900"
        >
          TaskManager
        </Link>
      </div>

      <nav aria-label="Navigation applicative" className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {LIENS.map(({ href, label, icone }) => {
            const estActif = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={estActif ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    estActif
                      ? "bg-zinc-100 text-zinc-900 font-medium"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-xl"
                  >
                    {icone}
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-zinc-200 px-4 py-4">
        <UserMenu />
      </div>
    </aside>
  );
}
