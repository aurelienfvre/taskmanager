import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import ProductPreview from "@/components/ProductPreview";
import FeaturesBento from "@/components/FeaturesBento";
import SocialProof from "@/components/SocialProof";
import CtaSection from "@/components/CtaSection";
import TaskApp from "@/components/TaskApp";
import SiteFooter from "@/components/SiteFooter";

// Page d'accueil — Server Component
// Les sections statiques sont rendues en HTML au build (pas de JS client).
// Seul TaskApp est un Client Component (gère l'état des tâches).
export default function Home() {
  return (
    <>
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
    </>
  );
}
