import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import ProductPreview from "@/components/ProductPreview";
import FeaturesBento from "@/components/FeaturesBento";
import SocialProof from "@/components/SocialProof";
import CtaSection from "@/components/CtaSection";
import SiteFooter from "@/components/SiteFooter";

// Page d'accueil de TaskManager
export default function Home() {
  return (
    <>
      <TopNavBar />
      <main className="pt-32">
        <HeroSection />
        <ProductPreview />
        <FeaturesBento />
        <SocialProof />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
