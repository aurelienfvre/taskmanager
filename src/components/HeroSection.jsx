// Section hero : badge version, titre, sous-titre et CTA
export default function HeroSection() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-8 py-24 text-center md:py-48">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
        <span className="h-2 w-2 rounded-full bg-zinc-400" aria-hidden="true" />
        v2.0 is now live
      </div>

      <h1 className="mb-6 max-w-4xl text-6xl font-bold tracking-tighter text-zinc-900 md:text-8xl">
        TaskManager
      </h1>
      <p className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-zinc-500 md:text-2xl">
        Gérez vos tâches efficacement. Une approche minimaliste pour une
        productivité maximale, sans le superflu.
      </p>

      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-10 py-4 text-lg font-medium text-zinc-50 transition-all duration-200 hover:bg-zinc-800 active:scale-95"
        >
          Commencer
        </button>
        <p className="text-sm font-light tracking-wide text-zinc-600">
          No credit card required
        </p>
      </div>
    </section>
  );
}
