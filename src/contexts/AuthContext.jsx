"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

// Provider qui expose l'utilisateur courant et les actions d'authentification
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Tant que le premier check n'est pas terminé, on évite tout rendu protégé
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (utilisateur) => {
      setUser(utilisateur);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Force le nettoyage de l'état local même si signOut échoue (réseau coupé,
  // token déjà invalidé).
  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
    }
  };

  // Suppression complète du compte : tâches, doc user, puis compte Auth.
  // L'ordre compte : si `deleteUser` échoue (requires-recent-login) on
  // laisse les données, l'utilisateur pourra ré-essayer après relogin.
  // À l'inverse, si on supprimait le compte en premier, les règles
  // Firestore rejetteraient ensuite les deletes sur les sous-collections.
  const deleteAccount = async () => {
    const courant = auth.currentUser;
    if (!courant) throw new Error("Aucun utilisateur connecté.");
    const uid = courant.uid;

    const tasksSnap = await getDocs(collection(db, "users", uid, "tasks"));
    if (!tasksSnap.empty) {
      const batch = writeBatch(db);
      tasksSnap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    try {
      await deleteDoc(doc(db, "users", uid));
    } catch {
      // Le doc user n'existe pas forcément — on ignore cette erreur
    }
    await deleteUser(courant);
    setUser(null);
  };

  const value = { user, loading, login, signup, logout, deleteAccount };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook d'accès au contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}
