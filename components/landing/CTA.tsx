"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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
            emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    <section ref={sectionRef} className="py-24" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden p-10 sm:p-20 text-center rounded-[8px]"
          style={{ backgroundColor: "#1C1C1C", color: "#FFFFFF" }}
        >
          {/* Subtle architectural lines inside the black box */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2
              className="heading-2 mb-6"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Prêt à simplifier votre
              <br />
              gestion locative au Bénin ?
            </h2>
            <p className="text-[16px] sm:text-[18px] opacity-80 leading-relaxed mb-10 max-w-xl mx-auto">
              Rejoignez les bailleurs et gestionnaires à Cotonou, Calavi et dans la diaspora qui ont choisi la sérénité.
              Créez votre compte gratuitement.
            </p>

            <div className="flex justify-center">
              {isSuccess ? (
                <div className="flex items-center gap-3 bg-[#087F5B]/20 border border-[#087F5B] text-[#51CF66] px-6 py-4 rounded-[6px] text-sm font-medium">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Demande enregistrée ! Redirection vers votre espace...</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex items-stretch bg-white border border-[#E8E5E0] rounded-[6px] p-1.5 max-w-md w-full shadow-lg focus-within:ring-2 focus-within:ring-[#087F5B]"
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: "#1C1C1C",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "0 24px",
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: 4,
                      cursor: isSubmitting ? "wait" : "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    className="hover:bg-[#333333] group disabled:opacity-75"
                  >
                    {isSubmitting ? "Connexion..." : "Démarrer"}{" "}
                    <ArrowRightIcon
                      style={{ width: 14, height: 14 }}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

