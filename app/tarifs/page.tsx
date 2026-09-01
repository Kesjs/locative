"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAF9] pt-12 sm:pt-16">
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
