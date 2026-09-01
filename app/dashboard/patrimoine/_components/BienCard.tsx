"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";
import type { Bien } from "@/lib/hooks/useBiens";

const STATUT_STYLES: Record<Bien["statut"], string> = {
  loué: "bg-success/10 text-success",
  vacant: "bg-warning/10 text-warning",
  travaux: "bg-muted text-muted-foreground",
};

export function BienCard({ bien, onClick }: { bien: Bien; onClick: () => void }) {
  const image = bien.photo_principale || bien.photos?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="bg-card border border-border rounded-xl overflow-hidden shadow-xs cursor-pointer hover:border-primary/40 hover:shadow-card-hover transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        <img
          src={image}
          alt={bien.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-sm ${STATUT_STYLES[bien.statut]}`}>
          {bien.statut}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[14px] text-card-foreground truncate">{bien.nom}</h3>
        <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
          <MapPinIcon className="w-3.5 h-3.5 shrink-0" /> {bien.ville}
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-[15px] font-extrabold text-card-foreground">
            {bien.loyer_mensuel?.toLocaleString("fr-FR") || 0}
            <span className="text-[11px] font-semibold text-muted-foreground ml-1">FCFA / mois</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
