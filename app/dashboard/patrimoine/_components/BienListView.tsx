"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Bien } from "@/lib/hooks/useBiens";

const STATUT_STYLES: Record<Bien["statut"], string> = {
  loué: "bg-success/10 text-success",
  vacant: "bg-warning/10 text-warning",
  travaux: "bg-muted text-muted-foreground",
};

export function BienListView({ biens, onSelect }: { biens: Bien[]; onSelect: (bien: Bien) => void }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[11px] uppercase text-muted-foreground font-bold">
              <th className="text-left px-4 py-3">Bien</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Ville</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
              <th className="text-right px-4 py-3">Loyer</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Locataire</th>
            </tr>
          </thead>
          <tbody>
            {biens.map((bien, i) => (
              <motion.tr
                key={bien.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
                onClick={() => onSelect(bien)}
                className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-card-foreground">
                  <div className="flex items-center gap-3">
                    <img
                      src={bien.photo_principale || bien.photos?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80"}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <span className="truncate max-w-[160px]">{bien.nom}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{bien.ville}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{bien.type}</td>
                <td className="px-4 py-3 text-right font-bold text-card-foreground whitespace-nowrap">
                  {bien.loyer_mensuel?.toLocaleString("fr-FR") || 0}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUT_STYLES[bien.statut]}`}>{bien.statut}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell truncate max-w-[140px]">
                  {bien.locataire_nom || "—"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
