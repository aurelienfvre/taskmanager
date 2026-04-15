"use client";

import useSharedList from "@/hooks/useSharedList";
import TaskList from "@/components/tasks/TaskList";
import AddTaskForm from "@/components/tasks/AddTaskForm";
import SharedListMembers from "./SharedListMembers";

// Libellés FR des rôles pour l'affichage
const LIBELLES_ROLES = { admin: "Admin", editor: "Éditeur", viewer: "Lecteur" };

// Vue détaillée d'une liste partagée. Les permissions (éditer, gérer
// les membres) sont déduites du rôle courant via useSharedList.
export default function SharedListView({ list: listInitiale, onBack }) {
  const {
    list, tasks, loading, erreur, ajoutEnCours, membreEnCours,
    role, peutEditer, peutGererMembres,
    toggleTask, deleteTask, addTask, addMember, removeMember, changeMemberRole,
  } = useSharedList(listInitiale.id);

  // Utilise les données temps-réel quand dispo, fallback sur la prop initiale
  const listCourante = list ?? listInitiale;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-sm font-medium text-zinc-600 transition hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            aria-label="Retour à la liste des listes partagées"
          >
            ← Retour
          </button>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {listCourante.name}
          </h2>
        </div>
        {role !== null && (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-700">
            {LIBELLES_ROLES[role] ?? role}
          </span>
        )}
      </header>

      <SharedListMembers
        list={listCourante}
        ownerEmail={listCourante.ownerEmail}
        onAddMember={addMember}
        onRemoveMember={removeMember}
        onChangeRole={changeMemberRole}
        membreEnCours={membreEnCours}
        peutGerer={peutGererMembres}
      />

      <section aria-label="Tâches de la liste partagée" className="rounded-xl border border-zinc-200 bg-white p-5">
        {erreur !== null && (
          <p role="alert" className="mb-4 text-sm text-red-600">{erreur}</p>
        )}
        {loading ? (
          <p className="text-sm text-zinc-600" role="status">Chargement des tâches…</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={peutEditer ? deleteTask : null}
            canDrag={false}
          />
        )}
        {peutEditer && <AddTaskForm onAdd={addTask} ajoutEnCours={ajoutEnCours} />}
        {!peutEditer && (
          <p className="mt-4 text-sm text-zinc-500">
            Vous avez un accès en lecture seule sur cette liste.
          </p>
        )}
      </section>
    </section>
  );
}
