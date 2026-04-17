"use client";

import { useEffect, useRef, useState } from "react";
import { libellesPriorite, optionsPriorite } from "./taskItemPriority";

export default function TaskItemPriorityControl({ id, title, priority, className, onChangePriority }) {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const menuRef = useRef(null);
  const boutonRef = useRef(null);
  const libelle = libellesPriorite[priority] ?? priority;

  useEffect(() => {
    if (!menuOuvert) return undefined;
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOuvert(false);
        boutonRef.current?.focus();
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOuvert(false);
        boutonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOuvert]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={boutonRef}
        type="button"
        onClick={() => setMenuOuvert((ouvert) => !ouvert)}
        aria-label={`Changer la priorité de la tâche "${title}" (actuelle : ${libelle})`}
        aria-expanded={menuOuvert}
        aria-haspopup="menu"
        aria-controls={menuOuvert ? `menu-priorite-${id}` : undefined}
        className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-zinc-900 ${className}`}
      >
        {libelle}
      </button>
      {menuOuvert && (
        <div
          id={`menu-priorite-${id}`}
          role="menu"
          aria-label={`Choix de priorité pour "${title}"`}
          className="absolute left-0 top-8 z-20 flex min-w-[108px] flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          {optionsPriorite.map((option) => (
            <button
              key={option.key}
              type="button"
              role="menuitemradio"
              aria-checked={option.key === priority}
              onClick={() => {
                onChangePriority(id, option.key);
                setMenuOuvert(false);
                boutonRef.current?.focus();
              }}
              aria-label={`Définir la priorité sur ${option.labelComplet}`}
              className="w-full cursor-pointer rounded-md px-1.5 py-1 text-left transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${option.className}`}>
                {option.labelCourt}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
