"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  // token déjà invalidé). Note : si signOut réussit, onAuthStateChanged émettra
  // aussi setUser(null) — c'est idempotent. Si signOut échoue, le token Firebase
  // peut rester valide côté serveur et un refresh restaurerait la session ;
  // l'utilisateur peut alors retenter manuellement.
  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
    }
  };

  const value = { user, loading, login, signup, logout };

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
