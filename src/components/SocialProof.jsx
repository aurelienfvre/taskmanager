// Bandeau de preuve sociale : logos des entreprises
export default function SocialProof() {
  const marques = ["APPLE", "STRIPE", "LINEAR", "NOTION", "VERCEL"];

  return (
    <section
      aria-label="Ils nous font confiance"
      className="mx-auto max-w-7xl border-t border-zinc-100 px-8 py-24 text-center"
    >
      <h2 className="mb-12 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Adopté par les leaders
      </h2>
      <ul className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
        {marques.map((marque) => (
          <li
            key={marque}
            className="text-2xl font-bold tracking-tighter"
          >
            {marque}
          </li>
        ))}
      </ul>
    </section>
  );
}
