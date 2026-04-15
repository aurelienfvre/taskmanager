import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

// Police principale du projet
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "TaskManager - Gestion de tâches",
  description:
    "TaskManager vous aide à organiser, prioriser et accomplir vos tâches au quotidien. Une approche minimaliste pour une productivité maximale.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Préconnexion aux serveurs Google Fonts pour réduire la latence */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Icônes Material Symbols Outlined */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full font-[var(--font-inter)]">
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
