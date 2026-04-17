export const stylesPriorite = {
  high: "bg-zinc-900 text-white",
  medium: "bg-zinc-200 text-zinc-700",
  low: "bg-zinc-100 text-zinc-600",
};

export const libellesPriorite = {
  high: "Urgente",
  medium: "Moyenne",
  low: "Basse",
};

export const optionsPriorite = [
  { key: "high", labelCourt: "Urgente", labelComplet: "Urgente", className: stylesPriorite.high },
  { key: "medium", labelCourt: "Moyenne", labelComplet: "Moyenne", className: stylesPriorite.medium },
  { key: "low", labelCourt: "Basse", labelComplet: "Basse", className: stylesPriorite.low },
];
