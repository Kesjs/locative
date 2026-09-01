"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, LockKeyhole, QrCode, ReceiptText } from "lucide-react";
import { PAYMENT_PROOF_STEPS } from "./landing-data";
import ReceiptSlip from "./ReceiptSlip";

export default function PaymentProof() {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  return (
    <section id="fonctionnement" data-proof-section className="landing-section bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[380px]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9D6B3C]">Le fil de preuve</p>
            <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#18181B]">
              Un règlement,
              <span className="mt-1 block font-serif font-normal italic text-[#52525B]">trois traces fiables.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-[#3F3F46]">
              Le même paiement alimente votre suivi, votre quittance certifiée et l&apos;espace du locataire. Aucun outil tiers à réconcilier.
            </p>
            <button
              type="button"
              onClick={() => setIsReceiptOpen((current) => !current)}
              aria-expanded={isReceiptOpen}
              aria-controls="proof-receipt-detail"
              className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#9D6B3C] pb-1 text-[13px] font-semibold text-[#18181B] transition-all hover:text-[#9D6B3C] hover:border-[#9D6B3C] cursor-pointer"
            >
              <span>{isReceiptOpen ? "Masquer la quittance" : "Voir la quittance officielle"}</span>
              <ArrowRight aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative grid border-y border-[#E8E3DC] sm:grid-cols-3">
              <span data-dashboard-line className="landing-proof-line absolute left-0 right-0 top-0 hidden h-px bg-[#9D6B3C] sm:block" aria-hidden="true" />
              {PAYMENT_PROOF_STEPS.map((step, index) => (
                <div key={step.number} data-proof-step className={`relative py-6 sm:px-6 sm:py-7 ${index < PAYMENT_PROOF_STEPS.length - 1 ? "border-b border-[#E8E3DC] sm:border-b-0 sm:border-r" : ""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#FAF9F6] border border-[#E8E3DC] text-[11px] font-bold text-[#18181B]">{step.number}</span>
                    {index === 0 ? <CheckCircle2 aria-hidden="true" size={18} className="text-[#15803D]" /> : index === 1 ? <QrCode aria-hidden="true" size={18} className="text-[#9D6B3C]" /> : <LockKeyhole aria-hidden="true" size={18} className="text-[#71717A]" />}
                  </div>
                  <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9D6B3C]">{step.label}</p>
                  <h3 className="mt-2 text-[15px] font-bold text-[#18181B]">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#52525B]">{step.description}</p>
                </div>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {isReceiptOpen ? (
                <motion.div id="proof-receipt-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="overflow-hidden">
                  <div className="grid gap-6 border-b border-[#E8E3DC] bg-[#FAF9F6] p-5 sm:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)] sm:p-7">
                    <div>
                      <div className="flex items-center gap-2 text-[12px] font-bold text-[#18181B]"><ReceiptText aria-hidden="true" size={16} className="text-[#15803D]" /> Quittance LOK-2026-0891</div>
                      <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-[#3F3F46]">Koudjo Dossou retrouve le document certifié depuis son portail OTP sécurisé. Le QR code unique permet de vérifier la validité de la quittance sans recréer de reçu papier.</p>
                      <div className="mt-5 flex flex-wrap gap-4 text-[12px] font-semibold text-[#18181B]"><span className="inline-flex items-center gap-1.5"><QrCode aria-hidden="true" size={14} className="text-[#9D6B3C]" /> QR vérifiable</span><span className="inline-flex items-center gap-1.5"><Download aria-hidden="true" size={14} className="text-[#9D6B3C]" /> PDF officiel téléchargeable</span></div>
                    </div>
                    <ReceiptSlip compact showDownload />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
