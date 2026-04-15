import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import ProductPreview from "@/components/ProductPreview";
import FeaturesBento from "@/components/FeaturesBento";
import SocialProof from "@/components/SocialProof";
import CtaSection from "@/components/CtaSection";
import TaskApp from "@/components/TaskApp";
import SiteFooter from "@/components/SiteFooter";
import AuthGuard from "@/components/AuthGuard";

// Page d'accueil — protégée par AuthGuard (redirige vers /login si non connecté)
export default function Home() {
  return (
    <AuthGuard>
      <TopNavBar />
      <main className="pt-32">
        <HeroSection />
        <ProductPreview />
        <FeaturesBento />
        <SocialProof />
        <TaskApp />
        <CtaSection />
      </main>
      <SiteFooter />
    </AuthGuard>
  );
}
