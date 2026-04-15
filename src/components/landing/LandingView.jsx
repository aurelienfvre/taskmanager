import HeroSection from "./HeroSection";
import ProductPreview from "./ProductPreview";
import FeaturesBento from "./FeaturesBento";
import SocialProof from "./SocialProof";
import CtaSection from "./CtaSection";

// Vue marketing pour visiteurs non connectés. La TopNavBar et le footer
// sont rendus par AppShell — on ne les duplique pas ici.
export default function LandingView() {
  return (
    <div className="pt-32">
      <HeroSection />
      <ProductPreview />
      <FeaturesBento />
      <SocialProof />
      <CtaSection />
    </div>
  );
}
