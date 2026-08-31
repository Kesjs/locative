"use client";

import { Download, QrCode, ShieldCheck } from "lucide-react";
import { formatFcfa } from "./landing-data";

interface ReceiptSlipProps {
  compact?: boolean;
  showDownload?: boolean;
  tenant?: string;
  property?: string;
  period?: string;
  method?: string;
  amountFcfa?: number;
  reference?: string;
}

export default function ReceiptSlip({
  compact = false,
  showDownload = false,
  tenant = "Koudjo Dossou",
  property = "Villa Fidjrossè Plage",
  period = "Septembre 2026",
  method = "MTN MoMo",
  amountFcfa = 350000,
  reference = "LOK-2026-0891",
}: ReceiptSlipProps) {
  return (
    <div className={`receipt-slip ${compact ? "receipt-slip-compact" : ""}`}>
      <div className="flex items-start justify-between gap-4 border-b border-border-default pb-3">
        <div>
          <p className="font-serif text-[20px] leading-none text-text-primary">Lokka.</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            Quittance officielle
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-success-strong">
          <ShieldCheck aria-hidden="true" size={15} />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Payé</span>
        </div>
      </div>

      <dl className={`grid gap-x-5 gap-y-3 text-[12px] ${compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
        <div>
          <dt className="text-text-muted">Locataire</dt>
          <dd className="mt-0.5 font-semibold text-text-primary">{tenant}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Bien</dt>
          <dd className="mt-0.5 font-semibold text-text-primary">{property}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Période</dt>
          <dd className="mt-0.5 font-semibold text-text-primary">{period}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Règlement</dt>
          <dd className="mt-0.5 font-semibold text-text-primary">{method}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-text-muted">Montant</dt>
          <dd className="tabular-nums mt-0.5 text-[18px] font-semibold tracking-tight text-text-primary">
            {formatFcfa(amountFcfa)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-border-default pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Référence</p>
          <p className="mt-1 font-mono text-[12px] font-semibold text-text-primary">{reference}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center border border-border-strong bg-white text-text-primary" aria-label="QR code de vérification">
          <QrCode aria-hidden="true" size={34} strokeWidth={1.5} />
        </div>
      </div>

      {showDownload ? (
        <button type="button" className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-text-primary underline underline-offset-4 hover:text-success-strong">
          <Download aria-hidden="true" size={14} />
          Télécharger le PDF
        </button>
      ) : null}
    </div>
  );
}
