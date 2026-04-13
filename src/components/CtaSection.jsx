// Section d'appel à l'action finale
export default function CtaSection() {
  return (
    <section className="bg-zinc-50 py-32">
      <div className="mx-auto max-w-3xl px-8 text-center">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900">
          Prêt à transformer votre flux de travail ?
        </h2>
        <p className="mb-12 text-lg text-zinc-500">
          Rejoignez plus de 50 000 professionnels qui utilisent TaskManager pour
          rester concentrés.
        </p>

        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <button
            type="button"
            className="rounded-lg bg-zinc-900 px-8 py-4 font-medium text-zinc-50 transition-all hover:bg-zinc-800"
          >
            Commencer gratuitement
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white px-8 py-4 font-medium text-zinc-900 transition-all hover:bg-zinc-50"
          >
            Contacter l&apos;équipe
          </button>
        </div>
      </div>
    </section>
  );
}
