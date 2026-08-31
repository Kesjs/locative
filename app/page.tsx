import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PaymentProof from "@/components/landing/PaymentProof";
import ControlRoom from "@/components/landing/ControlRoom";
import RoleViews from "@/components/landing/RoleViews";
import VacancyShowcase from "@/components/landing/VacancyShowcase";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import LandingMotion from "@/components/landing/LandingMotion";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function Home() {
  return (
    <LandingMotion>
      <Navbar />
      <main>
        <Hero />
        <PaymentProof />
        <ControlRoom />
        <RoleViews />
        <VacancyShowcase />
        <Stats />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </LandingMotion>
  );
}
