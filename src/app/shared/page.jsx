"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToSharedLists, createSharedList, deleteSharedList } from "@/services/sharedListService";
import CreateListForm from "@/components/shared-lists/CreateListForm";
import SharedListsGrid from "@/components/shared-lists/SharedListsGrid";
import SharedListView from "@/components/shared-lists/SharedListView";

function SharedPageContent() {
  const { user } = useAuth();
  const [listes, setListes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [erreurAction, setErreurAction] = useState(null);
  const [creationEnCours, setCreationEnCours] = useState(false);
  const [listeOuverteId, setListeOuverteId] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const unsub = subscribeToSharedLists(
      user.uid,
      (l) => { setErreur(null); setListes(l); setLoading(false); },
      () => { setErreur("Impossible de charger les listes partagées."); setLoading(false); },
    );
    return () => { if (typeof unsub === "function") unsub(); };
  }, [user?.uid]);

  // Garde anti-drift : si la liste ouverte disparaît (supprimée par un
  // autre utilisateur ou par nous-même), on revient à la grille.
  useEffect(() => {
    if (listeOuverteId === null) return;
    const existeEncore = listes.some((l) => l.id === listeOuverteId);
    if (!existeEncore) setListeOuverteId(null);
  }, [listes, listeOuverteId]);

  const handleCreate = async (nom) => {
    setCreationEnCours(true);
    try { await createSharedList(user.uid, user.email, nom); }
    finally { setCreationEnCours(false); }
  };

  // handleDelete : seul le propriétaire est autorisé — on affiche l'erreur
  // retournée par le service au lieu d'un alert() bloquant.
  const handleDelete = async (listId) => {
    setErreurAction(null);
    try { await deleteSharedList(listId, user.uid); }
    catch (error) {
      setErreurAction(error?.message ?? "Impossible de supprimer la liste.");
    }
  };

  const listeOuverte = listes.find((l) => l.id === listeOuverteId) ?? null;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-10 pb-16 lg:px-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">
          Listes partagées
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Collaborez sur des tâches avec d&apos;autres utilisateurs.
        </p>
      </header>

      {listeOuverte !== null ? (
        <SharedListView list={listeOuverte} onBack={() => setListeOuverteId(null)} />
      ) : (
        <>
          <div className="mb-8">
            <CreateListForm onCreate={handleCreate} creationEnCours={creationEnCours} />
          </div>
          {erreur !== null && <p role="alert" className="mb-4 text-sm text-red-600">{erreur}</p>}
          {erreurAction !== null && <p role="alert" className="mb-4 text-sm text-red-600">{erreurAction}</p>}
          {loading ? (
            <p role="status" className="text-sm text-zinc-600">Chargement…</p>
          ) : (
            <SharedListsGrid listes={listes} currentUserId={user.uid} onOpen={setListeOuverteId} onDelete={handleDelete} />
          )}
        </>
      )}
    </section>
  );
}

export default function SharedPage() {
  return (
    <AuthGuard>
      <SharedPageContent />
    </AuthGuard>
  );
}
