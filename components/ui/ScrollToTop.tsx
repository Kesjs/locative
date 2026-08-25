"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Dimensions pour le cercle de progression SVG
  const size = 44;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Revenir en haut de page"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-white text-[#1C1C1C] border border-[#E8E5E0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] group cursor-pointer"
          style={{ width: size, height: size }}
        >
          {/* Indicateur circulaire de progression du scroll */}
          <svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            width={size}
            height={size}
          >
            {/* Anneau de fond */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#E8E5E0"
              strokeWidth={strokeWidth}
              className="opacity-40"
            />
            {/* Anneau de progression (Noir avec halo doré) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#1C1C1C"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-150 group-hover:stroke-[#C5A880]"
            />
          </svg>

          {/* Icône flèche avec micro-animation */}
          <ArrowUpIcon className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
