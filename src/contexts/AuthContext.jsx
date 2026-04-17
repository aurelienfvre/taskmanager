"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { deleteAccountData } from "@/services/accountService";

const AuthContext = createContext(null);

// Provider qui expose l'utilisateur courant et les actions d'authentification
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Tant que le premier check n'est pas terminé, on évite tout rendu protégé
  const [loading, setLoading] = useState(true);

  const ensureUserDirectoryDoc = async (utilisateur) => {
    if (!utilisateur?.uid || !utilisateur?.email) return;
    const emailNormalise = utilisateur.email.trim().toLowerCase();
    const payload = {
      email: utilisateur.email,
      emailLower: emailNormalise,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", utilisateur.uid), payload, { merge: true });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (utilisateur) => {
      setUser(utilisateur);
      setLoading(false);
      if (utilisateur) {
        ensureUserDirectoryDoc(utilisateur).catch((error) => {
          console.error("Impossible de synchroniser le profil utilisateur :", error);
        });
      }
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password) => {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserDirectoryDoc(credentials.user);
    return credentials;
  };

  // Force le nettoyage de l'état local même si signOut échoue (réseau coupé,
  // token déjà invalidé).
  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
    }
  };

  const deleteAccount = async () => {
    await deleteAccountData();
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
