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
      className="group relative inline-flex items-center gap-3 p-1.5 -ml-1.5 rounded-[10px] transition-colors duration-200 hover:bg-white hover:shadow-xs hover:border hover:border-[#E8E5E0] border border-transparent select-none"
    >
      {/* Icon Box with Morphing Animation */}
      <div className="relative w-8 h-8 rounded-[8px] bg-[#1C1C1C] flex items-center justify-center overflow-hidden flex-shrink-0 transition-transform duration-200 group-hover:scale-95 shadow-sm">
        <AnimatePresence mode="wait" initial={false}>
          {!isHovered ? (
            <motion.div
              key="logo-monogram"
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M195 87.5 L277 87.5 L231 237.5 L369 237.5 L323 372.5 L141.5 372.5 L180 252.5 L276.5 252.5 L230.5 317.5 L197.5 317.5 L217 252.5 M195 87.5"
                  stroke="#FFFFFF"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="back-arrow"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
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
              className="font-serif text-[20px] font-bold text-[#1C1C1C] tracking-tight"
              style={{ fontFamily: "'Instrument Serif', 'Georgia', serif" }}
            >
              Lokka.
            </motion.span>
          ) : (
            <motion.span
              key="back-text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="text-[13px] font-semibold text-[#1C1C1C] flex items-center gap-1 tracking-tight"
            >
              Retour à l&apos;accueil
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}
