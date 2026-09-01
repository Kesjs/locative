"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  UserPlusIcon,
  HomeModernIcon,
  BanknotesIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: UserPlusIcon,
    number: "01",
    title: "Inscription & Choix de profil",
    description:
      "Créez votre compte en 30 secondes (Email + OTP) et sélectionnez votre rôle : Propriétaire Bailleur, Agence Immobilière ou Diaspora.",
  },
  {
    icon: HomeModernIcon,
    number: "02",
    title: "1er Bien & Bail Loi 2022-30",
    description:
      "Ajoutez votre premier logement en FCFA. Le système valide automatiquement le plafond de caution à 3 mois maximum.",
  },
  {
    icon: BanknotesIcon,
    number: "03",
    title: "Encaissement & Quittance Web",
    description:
      "Validez les règlements Mobile Money MTN/Moov. La quittance PDF certifiée est générée instantanément pour vous et votre locataire.",
  },
  {
    icon: GlobeAltIcon,
    number: "04",
    title: "Votre Site Vitrine en 1 Clic",
    description:
      "Activez votre mini-site public pour trouver des locataires sans payer une agence web et recevez des demandes de visite directes.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E8E5E0] relative overflow-hidden"
    >
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <div className="section-label mb-3 text-[#0F172A]">Fonctionnement</div>
          <h2 className="heading-2 mb-4 text-[#0F172A]">
            Du premier bien au premier encaissement
          </h2>
          <p className="body-text text-base sm:text-lg text-[#64635F]">
            Un parcours limpide et automatisé pour transformer votre gestion locative au Bénin.
          </p>
        </motion.div>

        {/* Stepper Horizontal Grid */}
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Ligne de connexion desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            className="absolute top-8 hidden h-px w-full origin-left lg:block"
            style={{
              left: "12.5%",
              width: "75%",
              backgroundColor: "#E8E5E0",
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center sm:items-start sm:text-left group bg-white border border-[#E8E5E0] rounded-[10px] p-6 shadow-2xs hover:border-[#0F172A] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon Box */}
                <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#0F172A] text-white shadow-xs">
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <span className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#0F172A]">
                  Étape {step.number}
                </span>
                <h3 className="mb-2 text-[17px] font-bold text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#64635F]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}