"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.from("leads_waitlist").insert([
          {
            email,
            source: "landing_cta",
            profile_type: "bailleur",
            city: "Cotonou",
          },
        ]);

        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
            shouldCreateUser: true,
          },
        });
      }
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
      }, 1000);
    } catch (err) {
      console.error("Erreur enregistrement lead:", err);
      window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E8E5E0]">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden p-8 sm:p-16 lg:p-20 text-center rounded-[12px] bg-[#1C1C1C] text-white shadow-2xl"
        >
          {/* Architectural Lines */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-6">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Passez à la vitesse supérieure</span>
            </span>

            <h2 className="heading-2 mb-6 text-white text-[clamp(2.25rem,5vw,3.75rem)] leading-tight tracking-tight">
              Prêt à simplifier votre <br />
              gestion locative au Bénin ?
            </h2>

            <p className="text-[15px] sm:text-[17px] opacity-80 leading-relaxed mb-10 max-w-xl mx-auto">
              Rejoignez les bailleurs, agences et investisseurs de la diaspora qui ont digitalisé leurs baux, automatisé leurs quittances et créé leur site vitrine.
            </p>

            <div className="flex justify-center">
              {isSuccess ? (
                <div className="flex items-center gap-3 bg-white/10 border border-white/20 text-white px-6 py-4 rounded-[6px] text-sm font-medium">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                  <span>Demande enregistrée ! Redirection vers votre espace...</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-stretch bg-white border border-[#E8E5E0] rounded-[8px] p-1.5 max-w-md w-full shadow-lg gap-2 sm:gap-0 focus-within:ring-2 focus-within:ring-[#1C1C1C]"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="flex-1 bg-transparent px-4 py-3 text-[15px] text-[#1C1C1C] placeholder-[#9C9A95] outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 bg-[#1C1C1C] hover:bg-[#333333] text-white px-6 py-3 font-semibold text-[14px] rounded-[6px] transition-all duration-200 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? "Connexion..." : "Démarrer"}{" "}
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>

            <p className="mt-4 text-[12px] opacity-60">
              Inscription gratuite · Sans carte bancaire · Activation en 2 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
