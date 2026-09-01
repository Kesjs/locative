"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, LockKeyhole, QrCode, ReceiptText } from "lucide-react";
import { PAYMENT_PROOF_STEPS } from "./landing-data";
import ReceiptSlip from "./ReceiptSlip";

export default function PaymentProof() {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  return (
    <section id="fonctionnement" data-proof-section className="landing-section bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[380px]"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Le fil de preuve</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Un règlement,
              <span className="block font-serif font-normal italic text-slate-600 text-[0.95em] mt-1">trois traces fiables.</span>
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600">
              Le même paiement alimente votre suivi, votre quittance certifiée et l&apos;espace du locataire. Aucun outil tiers à réconcilier.
            </p>
            <button
              type="button"
              onClick={() => setIsReceiptOpen((current) => !current)}
              aria-expanded={isReceiptOpen}
              aria-controls="proof-receipt-detail"
              className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
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
            <div className="relative grid border-y border-slate-200 sm:grid-cols-3">
              <span data-dashboard-line className="landing-proof-line absolute left-0 right-0 top-0 hidden h-px bg-emerald-600 sm:block" aria-hidden="true" />
              {PAYMENT_PROOF_STEPS.map((step, index) => (
                <div key={step.number} data-proof-step className={`relative py-6 sm:px-6 sm:py-7 ${index < PAYMENT_PROOF_STEPS.length - 1 ? "border-b border-slate-100 sm:border-b-0 sm:border-r" : ""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">{step.number}</span>
                    {index === 0 ? <CheckCircle2 aria-hidden="true" size={18} className="text-emerald-600" /> : index === 1 ? <QrCode aria-hidden="true" size={18} className="text-emerald-600" /> : <LockKeyhole aria-hidden="true" size={18} className="text-slate-400" />}
                  </div>
                  <p className="mt-5 text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">{step.label}</p>
                  <h3 className="mt-1.5 text-[15px] font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {isReceiptOpen ? (
                <motion.div id="proof-receipt-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="overflow-hidden">
                  <div className="grid gap-6 border-b border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)] sm:p-7">
                    <div>
                      <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900"><ReceiptText aria-hidden="true" size={16} className="text-emerald-600" /> Quittance LOK-2026-0891</div>
                      <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-slate-600">Koudjo Dossou retrouve le document certifié depuis son portail OTP sécurisé. Le QR code unique permet de vérifier la validité de la quittance sans recréer de reçu papier.</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-[12px] font-semibold text-slate-800"><span className="inline-flex items-center gap-1.5"><QrCode aria-hidden="true" size={14} className="text-emerald-600" /> QR vérifiable</span><span className="inline-flex items-center gap-1.5"><Download aria-hidden="true" size={14} className="text-emerald-600" /> PDF officiel téléchargeable</span></div>
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
