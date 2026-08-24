"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircleIcon,
  ChartBarSquareIcon,
  DocumentDuplicateIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

const BRAND = "#1C1C1C";
const BRAND_SOFT = "#F5F5DC";

// Bento Card Component with Glow Effect on Hover
interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
  delay: number;
  children?: React.ReactNode;
}

function BentoCard({ title, description, className = "", delay, children }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[8px] bg-white border border-[#E8E5E0] transition-all duration-300 hover:border-[#1C1C1C] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex flex-col ${className}`}
    >
      {/* Magic UI Glow Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[8px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(28,28,28,0.04), transparent 40%)`,
        }}
      />

      <div className="flex-1 p-8 z-10 flex flex-col justify-between">
        <div className="mb-8">
          <h3 className="heading-3 mb-3">{title}</h3>
          <p className="body-text text-[16px]">{description}</p>
        </div>
        <div className="relative w-full">{children}</div>
      </div>
    </motion.div>
  );
}

// Simulated Live Notification Feed
function NotificationFeed() {
  const notifications = [
    { name: "S. Gbenou", amount: "150 000 FCFA", time: "À l'instant", type: "MTN MoMo" },
    { name: "J. Doe", amount: "85 000 FCFA", time: "Il y a 5 min", type: "Moov Money" },
    { name: "A. Kone", amount: "200 000 FCFA", time: "Il y a 1h", type: "Virement" },
    { name: "F. Diallo", amount: "120 000 FCFA", time: "Il y a 2h", type: "Orange Money" },
  ];

  return (
    <div className="relative h-64 w-full overflow-hidden mask-image-bottom">
      <motion.div
        animate={{ y: [0, -220] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 12,
          ease: "linear",
        }}
        className="flex flex-col gap-3"
      >
        {[...notifications, ...notifications, ...notifications].map((notif, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-md border border-[#E8E5E0] bg-[#FAF9F6] p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5DC]">
              <BellAlertIcon className="h-5 w-5 text-[#087F5B]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#1C1C1C]">
                {notif.amount} reçu
              </p>
              <p className="text-[12px] text-[#64635F]">
                {notif.name} via {notif.type}
              </p>
            </div>
            <div className="text-[11px] font-medium text-[#9C9A95]">
              {notif.time}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Features() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      {/* Background Architectural Grid (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1C1C1C 1px, transparent 1px), linear-gradient(90deg, #1C1C1C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container relative z-10 mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
        >
          <div className="section-label mb-4">L'Expérience Lokka</div>
          <h2 className="heading-2 mb-6">
            Votre tranquillité d'esprit, automatisée
          </h2>
          <p className="body-text text-lg">
            Ne perdez plus votre temps à chasser les loyers ou à rédiger de la paperasse. 
            Lokka transforme la gestion locative en une expérience fluide et invisible.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2 md:gap-6">
          
          {/* Main Card: Automated Collection */}
          <BentoCard
            title="Zéro loyer oublié."
            description="Laissez vos locataires payer de manière autonome via MTN ou Moov Money. L'argent arrive, le système se met à jour. Vous n'avez plus rien à faire."
            className="md:col-span-2 md:row-span-2"
            delay={0.1}
          >
            <div className="mt-8 rounded-lg border border-[#E8E5E0] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-[#E8E5E0] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1C]">
                    <CheckCircleIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-[#1C1C1C]">Statut des collectes</div>
                    <div className="text-[12px] text-[#087F5B]">100% à jour ce mois-ci</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-semibold text-[#1C1C1C]">1 250 000 F</div>
                  <div className="text-[12px] text-[#64635F]">Total encaissé</div>
                </div>
              </div>
              
              <NotificationFeed />
            </div>
          </BentoCard>

          {/* Secondary Card 1: Documents */}
          <BentoCard
            title="Ne rédigez plus jamais de quittances."
            description="Les contrats, les états des lieux et les quittances sont générés et archivés instantanément après chaque paiement."
            className="md:col-span-1 md:row-span-1 bg-[#F3F1ED] border-none"
            delay={0.2}
          >
            <div className="relative mt-4 flex justify-end">
              <div className="absolute right-8 top-0 h-24 w-32 rounded-md border border-[#E8E5E0] bg-white shadow-sm rotate-6 opacity-60"></div>
              <div className="relative z-10 flex h-24 w-32 flex-col items-center justify-center rounded-md border border-[#1C1C1C] bg-white shadow-md -rotate-3 transition-transform duration-300 group-hover:rotate-0">
                <DocumentDuplicateIcon className="mb-2 h-8 w-8 text-[#1C1C1C]" />
                <div className="text-[10px] font-medium uppercase tracking-widest text-[#1C1C1C]">Quittance</div>
              </div>
            </div>
          </BentoCard>

          {/* Secondary Card 2: Analytics */}
          <BentoCard
            title="Une vue claire sur votre rentabilité."
            description="Fini les tableurs Excel complexes. Visualisez vos revenus et taux d'occupation en un clin d'œil."
            className="md:col-span-1 md:row-span-1"
            delay={0.3}
          >
            <div className="mt-4 flex h-24 items-end gap-2 px-2">
              {[40, 60, 45, 80, 55, 100, 85].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  className={`w-full rounded-t-sm ${i === 5 ? 'bg-[#1C1C1C]' : 'bg-[#E8E5E0]'}`}
                />
              ))}
            </div>
          </BentoCard>

        </div>
      </div>
      
      {/* CSS for mask image */}
      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-bottom {
          mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
        }
      `}} />
    </section>
  );
}