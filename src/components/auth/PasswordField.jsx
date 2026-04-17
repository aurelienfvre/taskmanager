"use client";

import { useState } from "react";

// Champ mot de passe réutilisable avec toggle d'affichage. Encapsule label,
// input et bouton visibility pour garder les formulaires d'auth courts.
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  required = false,
  minLength,
  ariaInvalid,
  ariaDescribedBy,
}) {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((prev) => !prev);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-11 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={
            visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded-r-lg"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </div>
  );
}
