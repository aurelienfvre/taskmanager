import SignupForm from "@/components/auth/SignupForm";
import GuestGuard from "@/components/auth/GuestGuard";

// Page d'inscription — protégée par GuestGuard (redirige vers / si déjà connecté)
export default function SignupPage() {
  return (
    <GuestGuard>
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
        <SignupForm />
      </main>
    </GuestGuard>
  );
}
