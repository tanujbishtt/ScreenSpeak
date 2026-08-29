import HeroSection from "../components/landing/hero";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <Features />
    </div>
  );
}