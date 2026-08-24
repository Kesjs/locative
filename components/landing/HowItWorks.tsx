"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  UserPlusIcon,
  PaperAirplaneIcon,
  DevicePhoneMobileIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: UserPlusIcon,
    title: "Inscription & Choix du profil",
    description: "Créez votre compte en 30 secondes et sélectionnez votre statut (Propriétaire indépendant, Gestionnaire ou Agence).",
  },
  {
    icon: PaperAirplaneIcon,
    title: "Biens & Invitations locataires",
    description: "Renseignez vos logements en FCFA et envoyez un lien d'accès sécurisé à vos locataires par WhatsApp ou Email.",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Paiement Mobile Money",
    description: "À chaque échéance, vos locataires paient directement depuis leur téléphone via MTN MoMo ou Moov Money.",
  },
  {
    icon: DocumentCheckIcon,
    title: "Suivi & Quittances automatiques",
    description: "Suivez vos encaissements en temps réel sur votre tableau de bord et téléchargez vos quittances certifiées.",
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
      {/* Background Architectural Grid (Subtle) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#1C1C1C 1px, transparent 1px), linear-gradient(90deg, #1C1C1C 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
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
          <div className="section-label mb-4 text-[#087F5B]">Fonctionnement</div>
          <h2 className="heading-2 mb-4 text-[#1C1C1C]">
            Simple, clair et sans friction
          </h2>
          <p className="body-text text-lg text-[#64635F]">
            Quatre étapes transparentes pour digitaliser votre gestion locative au Bénin.
          </p>
        </motion.div>

        {/* Stepper horizontal */}
        <div className="relative grid grid-cols-1 gap-12 sm:grid-cols-4 sm:gap-8">
          {/* Ligne de connexion (desktop uniquement) */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            className="absolute top-8 hidden h-px w-full origin-left sm:block"
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
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center sm:items-start sm:text-left group"
              >
                {/* Icon Container */}
                <div
                  className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-[8px] bg-white transition-all duration-300 group-hover:-translate-y-1 border border-[#1C1C1C] shadow-[4px_4px_0px_rgba(28,28,28,0.08)]"
                >
                  <Icon className="h-6 w-6 text-[#1C1C1C]" />
                </div>

                <span
                  className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#087F5B]"
                >
                  Étape 0{i + 1}
                </span>
                <h3 className="mb-2 text-[18px] font-semibold text-[#1C1C1C]">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[#64635F]">
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