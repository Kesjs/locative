"use client";

import { motion } from "framer-motion";
import {
  PlusIcon,
  DocumentPlusIcon,
  ChatBubbleLeftRightIcon,
  BuildingOffice2Icon,
  ArrowDownTrayIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface QuickActionDockProps {
  onAddPayment: () => void;
  onWhatsAppReminder: () => void;
  onExportReport: () => void;
  accountType?: string;
}

export function QuickActionDock({
  onAddPayment,
  onWhatsAppReminder,
  onExportReport,
  accountType = "bailleur",
}: QuickActionDockProps) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-md border border-[#E8E5E0] rounded-[12px] p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
      {/* Title / Badge */}
      <div className="flex items-center gap-2 px-2">
        <div className="h-7 w-7 rounded-[6px] bg-[#0F172A] flex items-center justify-center text-white shadow-xs">
          <SparklesIcon className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[12px] font-bold text-[#0F172A] block leading-tight">
            Actions Rapides
          </span>
          <span className="text-[10px] text-[#64635F]">
            Gagnez du temps au quotidien
          </span>
        </div>
      </div>

      {/* Action Buttons Group */}
      <div className="flex items-center flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onAddPayment}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-[#F5F5DC] hover:text-[#0F172A] hover:border-[#E8E5E0] border border-transparent text-white text-[12px] font-semibold rounded-[6px] transition-colors shadow-xs cursor-pointer"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span>Enregistrer un Loyer</span>
        </motion.button>

        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="/dashboard/biens"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#F3F2EE] border border-[#E8E5E0] text-[#0F172A] text-[12px] font-semibold rounded-[6px] transition-colors shadow-2xs cursor-pointer"
        >
          <BuildingOffice2Icon className="h-3.5 w-3.5 text-[#64635F]" />
          <span>Ajouter un Bien</span>
        </motion.a>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onWhatsAppReminder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#F3F2EE] border border-[#E8E5E0] text-[#0F172A] text-[12px] font-semibold rounded-[6px] transition-colors shadow-2xs cursor-pointer"
        >
          <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 text-[#25D366]" />
          <span>Relance WhatsApp</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#F3F2EE] border border-[#E8E5E0] text-[#0F172A] text-[12px] font-semibold rounded-[6px] transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowDownTrayIcon className="h-3.5 w-3.5 text-[#64635F]" />
          <span>{accountType === "agence" ? "Relevé CRG" : "Bilan Fiscal TFU"}</span>
        </motion.button>
      </div>
    </div>
  );
}
