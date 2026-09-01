"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function StripeAuthLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative inline-flex items-center gap-2.5 p-1.5 -ml-1.5 rounded-xl transition-all duration-200 hover:bg-slate-100 border border-transparent select-none cursor-pointer"
    >
      {/* Icon Box with Morphing Animation */}
      <div className="relative w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-95 shadow-xs">
        <AnimatePresence mode="wait" initial={false}>
          {!isHovered ? (
            <motion.div
              key="logo-monogram"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21h18M5 21V7l8-4v18M13 10l6 3v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 10h.01M9 14h.01M9 18h.01M17 17h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="back-arrow"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center text-white"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text with Smooth Transition */}
      <div className="relative h-6 flex items-center overflow-hidden pr-1">
        <AnimatePresence mode="wait" initial={false}>
          {!isHovered ? (
            <motion.span
              key="logo-text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="font-serif text-[22px] font-bold text-slate-900 tracking-tight"
            >
              LOKKA.
            </motion.span>
          ) : (
            <motion.span
              key="back-text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="text-[13px] font-semibold text-slate-900 flex items-center gap-1 tracking-tight"
            >
              Retour au site
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}
