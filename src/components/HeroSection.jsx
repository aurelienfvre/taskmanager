import DashboardPreview from "./DashboardPreview";

// Section hero : titre principal, sous-titre, CTA et aperçu du dashboard
export default function HeroSection() {
  return (
    <section className="relative flex min-h-[819px] flex-col items-center justify-center overflow-hidden px-8 pb-32 pt-20 text-center">
      {/* Halos décoratifs en arrière-plan */}
      <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-blue-200 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-100 blur-[100px]" />
      </div>

      <h1 className="mb-6 max-w-5xl text-[clamp(3.5rem,10vw,6rem)] font-black leading-[0.9] tracking-tight text-blue-900">
        TaskManager
      </h1>
      <p className="mb-12 max-w-2xl text-xl font-medium tracking-wide text-slate-700 md:text-2xl">
        Gérez vos tâches efficacement
      </p>

      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 px-12 py-5 text-xl font-bold text-white shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 active:scale-95"
        >
          Commencer
        </button>

        <div className="flex items-center gap-2 font-medium text-slate-500">
          <span className="material-symbols-outlined text-lg" aria-hidden="true">
            verified_user
          </span>
          <span className="text-sm uppercase tracking-widest">
            Focus-first architecture
          </span>
        </div>
      </div>

      <DashboardPreview />
    </section>
  );
}
