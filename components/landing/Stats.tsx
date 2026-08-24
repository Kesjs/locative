"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "100", suffix: "+", label: "Bailleurs & Gestionnaires" },
  { value: "450", suffix: "+", label: "Logements sous gestion" },
  { value: "98.2", suffix: "%", label: "Taux de recouvrement MoMo" },
  { value: "100", suffix: "%", label: "Conforme Loi 2022-30" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24" style={{ backgroundColor: "#FAF9F6", borderTop: "1px solid #E8E5E0" }}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center p-8 rounded-[8px] bg-white transition-transform hover:-translate-y-1"
              style={{ border: "1px solid #E8E5E0", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
            >
              <div 
                className="heading-2 mb-2 flex items-baseline"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "#1C1C1C", lineHeight: 1 }}
              >
                {stat.value}
                <span style={{ color: "#087F5B", fontSize: "0.6em", fontFamily: "Inter, sans-serif", fontWeight: 600, marginLeft: 4 }}>
                  {stat.suffix}
                </span>
              </div>
              <div className="text-[13px] font-medium text-[#64635F] text-center uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
