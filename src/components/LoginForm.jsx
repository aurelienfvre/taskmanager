"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Formulaire de connexion par email + mot de passe
export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      // Message générique : ne pas révéler si l'email existe (sécurité)
      setError("Email ou mot de passe incorrect.");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-sm flex-col gap-6"
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">
          Connexion
        </h1>
        <p className="text-sm text-zinc-600">
          Accédez à votre tableau de bord TaskManager.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-zinc-700"
        >
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Connexion…" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Pas encore de compte ?{" "}
        <Link
          href="/signup"
          className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
        >
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
