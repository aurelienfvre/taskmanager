"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PasswordField from "./PasswordField";

// Formulaire d'inscription par email + mot de passe
export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(email, password);
      router.replace("/");
    } catch (err) {
      // Message explicite si l'email est déjà pris, sinon générique
      setError(
        err?.code === "auth/email-already-in-use"
          ? "Cet email est déjà utilisé."
          : "Impossible de créer le compte. Vérifiez vos informations.",
      );
    } finally {
      // finally : si router.replace throw après un signup réussi, on ne
      // doit pas rester coincé en "submitting"
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-sm flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">
          Créer un compte
        </h1>
        <p className="text-sm text-zinc-600">Rejoignez TaskManager en quelques secondes.</p>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor="signup-email" className="text-sm font-medium text-zinc-700">Email</label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      <PasswordField id="signup-password" label="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
      <PasswordField id="signup-password-confirm" label="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required minLength={6} />

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Création…" : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
