"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import NavAuthActions from "./NavAuthActions";

// Barre de navigation fixée en haut. Quand l'utilisateur est connecté, on
// remplace les liens marketing par les liens applicatifs.
export default function TopNavBar() {
  const { user } = useAuth();

  const liensMarketing = [
    { href: "#", label: "Features" },
    { href: "#", label: "Pricing" },
    { href: "#", label: "About" },
  ];

  const liensApp = [
    { href: "/", label: "Mes tâches" },
    { href: "/shared", label: "Listes partagées" },
  ];

  const liens = user !== null && user !== undefined ? liensApp : liensMarketing;

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 tracking-tight"
      >
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-zinc-900"
        >
          TaskManager
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {liens.map((lien) => (
            <li key={lien.label}>
              <Link
                href={lien.href}
                className="text-zinc-600 transition-colors duration-200 ease-in-out hover:text-zinc-900"
              >
                {lien.label}
              </Link>
            </li>
          ))}
        </ul>

        <NavAuthActions />
      </nav>
    </header>
  );
}
