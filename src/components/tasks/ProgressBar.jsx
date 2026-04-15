import { useId } from "react";

// Barre de progression accessible basée sur un pourcentage (0 à 100)
export default function ProgressBar({ percentage, label }) {
  // Id stable pour lier le label visible à la barre via aria-labelledby
  const labelId = useId();

  // Borne le pourcentage dans [0, 100] pour éviter un remplissage aberrant
  const valeurBornee = Math.max(0, Math.min(100, percentage ?? 0));
  const valeurArrondie = Math.round(valeurBornee);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span id={labelId} className="text-sm font-medium text-zinc-700">
          {label}
        </span>
        {/* Redondant avec aria-valuenow : masqué aux lecteurs d'écran */}
        <span
          aria-hidden="true"
          className="text-sm font-bold text-zinc-900"
        >
          {valeurArrondie}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={valeurArrondie}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-zinc-200"
      >
        {/* Entorse assumée à la règle "Tailwind only" : Tailwind ne peut pas
            exprimer une largeur continue dynamique sans interpolation runtime */}
        <div
          style={{ width: `${valeurBornee}%` }}
          className="h-full rounded-full bg-zinc-900 transition-all duration-300"
        />
      </div>
    </div>
  );
}
