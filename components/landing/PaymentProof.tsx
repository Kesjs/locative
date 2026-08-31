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
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div data-landing-reveal className="max-w-[360px]">
            <p className="landing-label">Le fil de preuve</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">
              Un règlement,
              <span className="mt-1 block font-serif font-normal italic text-text-secondary">trois traces fiables.</span>
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-text-secondary">
              Le même paiement alimente votre suivi, votre quittance et l&apos;espace du locataire. Pas trois outils à réconcilier.
            </p>
            <button
              type="button"
              onClick={() => setIsReceiptOpen((current) => !current)}
              aria-expanded={isReceiptOpen}
              aria-controls="proof-receipt-detail"
              className="mt-6 inline-flex items-center gap-2 border-b border-brand-primary pb-1 text-[12px] font-semibold text-text-primary hover:border-success-strong hover:text-success-strong"
            >
              {isReceiptOpen ? "Masquer la quittance" : "Voir la quittance"}
              <ArrowRight aria-hidden="true" size={14} />
            </button>
          </div>

          <div data-landing-reveal>
            <div className="relative grid border-y border-border-default sm:grid-cols-3">
              <span data-dashboard-line className="landing-proof-line absolute left-0 right-0 top-0 hidden h-px bg-brand-primary sm:block" aria-hidden="true" />
              {PAYMENT_PROOF_STEPS.map((step, index) => (
                <div key={step.number} data-proof-step className={`relative py-6 sm:px-6 sm:py-7 ${index < PAYMENT_PROOF_STEPS.length - 1 ? "border-b border-border-default sm:border-b-0 sm:border-r" : ""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center border border-border-strong text-[11px] font-semibold text-text-primary">{step.number}</span>
                    {index === 0 ? <CheckCircle2 aria-hidden="true" size={17} className="text-success-strong" /> : index === 1 ? <QrCode aria-hidden="true" size={17} className="text-success-strong" /> : <LockKeyhole aria-hidden="true" size={17} className="text-text-secondary" />}
                  </div>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.12em] text-success-strong">{step.label}</p>
                  <h3 className="mt-2 text-[14px] font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{step.description}</p>
                </div>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {isReceiptOpen ? (
                <motion.div id="proof-receipt-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                  <div className="grid gap-6 border-b border-border-default bg-bg-canvas p-5 sm:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)] sm:p-7">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-text-primary"><ReceiptText aria-hidden="true" size={15} className="text-success-strong" /> Quittance LOK-2026-0891</div>
                      <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-text-secondary">Koudjo Dossou retrouve le document officiel depuis son portail OTP. Le QR code permet de vérifier la référence sans recréer de reçu papier.</p>
                      <div className="mt-5 flex flex-wrap gap-4 text-[11px] font-semibold text-text-secondary"><span className="inline-flex items-center gap-1.5"><QrCode aria-hidden="true" size={14} /> QR vérifiable</span><span className="inline-flex items-center gap-1.5"><Download aria-hidden="true" size={14} /> PDF téléchargeable</span></div>
                    </div>
                    <ReceiptSlip compact showDownload />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
