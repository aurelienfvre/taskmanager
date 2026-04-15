import TaskApp from "@/components/tasks/TaskApp";

// Vue "dashboard" : header compact + TaskApp. La sidebar et le footer sont
// gérés par AppShell ; cette vue se concentre sur le contenu principal.
export default function DashboardView({ email }) {
  // Email affiché tel quel (tronqué) : dériver un prénom via split casse sur
  // les points et les +tag.
  const identifiant = typeof email === "string" && email !== "" ? email : "vous";

  return (
    <section className="mx-auto w-full max-w-4xl px-6 pt-10 pb-12 lg:px-10">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Bon retour,{" "}
          <span className="inline-block max-w-[240px] truncate align-bottom">
            {identifiant}
          </span>
        </h1>
        <p className="text-sm text-zinc-500">
          Reprenez là où vous vous étiez arrêté.
        </p>
      </header>
      <TaskApp />
    </section>
  );
}
