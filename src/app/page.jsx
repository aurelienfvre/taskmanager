import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import FeatureSpotlight from "@/components/FeatureSpotlight";
import CtaSection from "@/components/CtaSection";
import SiteFooter from "@/components/SiteFooter";

// Page d'accueil de TaskManager
export default function Home() {
  return (
    <>
      <TopNavBar />
      <main>
        <HeroSection />
        <FeatureSpotlight />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
