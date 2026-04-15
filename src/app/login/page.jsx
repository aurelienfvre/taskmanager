import LoginForm from "@/components/LoginForm";
import GuestGuard from "@/components/GuestGuard";

// Page de connexion — protégée par GuestGuard (redirige vers / si déjà connecté)
export default function LoginPage() {
  return (
    <GuestGuard>
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
        <LoginForm />
      </main>
    </GuestGuard>
  );
}
