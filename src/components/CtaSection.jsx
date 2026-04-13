// Section d'appel à l'action en fin de page
export default function CtaSection() {
  return (
    <section className="bg-slate-50 py-32 text-center">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-blue-900 px-8 py-20 text-white">
        <div
          className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-700 blur-[80px]"
          aria-hidden="true"
        />

        <h2 className="relative z-10 mb-8 text-4xl font-black md:text-5xl">
          Prêt à transformer votre workflow ?
        </h2>

        <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            className="rounded-xl bg-white px-10 py-4 font-bold text-blue-900 transition-all hover:bg-slate-100"
          >
            Commencer maintenant
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/20 bg-blue-700 px-10 py-4 font-bold text-white transition-all hover:bg-blue-700/80"
          >
            Voir la démo
          </button>
        </div>
      </div>
    </section>
  );
}
