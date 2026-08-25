"use client";

import { useState } from "react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  CheckCircleIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    receiptNo: string;
    date: string;
    month: string;
    tenantName: string;
    propertyTitle: string;
    propertyAddress: string;
    amountFcfa: number;
    amountEuros?: number;
    channel: string;
    ownerName: string;
    depositMonths?: number;
  };
}

export default function ReceiptModal({ isOpen, onClose, receiptData }: ReceiptModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E5E0] rounded-[12px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-[#1C1C1C] my-8">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E5E0] mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-0.5 rounded-full">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-[#1C1C1C]" />
              Document Officiel Certifié
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-[6px] border border-[#E8E5E0] text-[#64635F] hover:text-[#1C1C1C] hover:bg-[#FAF9F6] transition cursor-pointer"
              title="Imprimer"
            >
              <PrinterIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[6px] border border-[#E8E5E0] text-[#64635F] hover:text-[#1C1C1C] hover:bg-[#FAF9F6] transition cursor-pointer"
              title="Fermer"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div id="printable-receipt" className="border border-[#1C1C1C] rounded-[8px] p-6 sm:p-8 bg-[#FAF9F6] space-y-6">
          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E5E0] pb-4">
            <div>
              <div className="text-[20px] font-extrabold tracking-tight text-[#1C1C1C]">
                QUITTANCE DE LOYER
              </div>
              <div className="text-[12px] font-mono text-[#64635F]">
                N° de série : <strong>{receiptData.receiptNo}</strong>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[13px] font-bold text-[#1C1C1C]">LOKKA BÉNIN</div>
              <div className="text-[11px] text-[#64635F]">Régime Loi n° 2022-30</div>
              <div className="text-[11px] text-[#1C1C1C] font-semibold">République du Bénin 🇧🇯</div>
            </div>
          </div>

          {/* Parties & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div className="p-3 bg-white border border-[#E8E5E0] rounded-[6px]">
              <span className="text-[11px] font-bold uppercase text-[#9C9A95] block mb-1">
                Bailleur / Gestionnaire Mandant
              </span>
              <div className="font-bold text-[#1C1C1C]">{receiptData.ownerName}</div>
              <div className="text-[12px] text-[#64635F]">Cotonou, République du Bénin</div>
            </div>

            <div className="p-3 bg-white border border-[#E8E5E0] rounded-[6px]">
              <span className="text-[11px] font-bold uppercase text-[#9C9A95] block mb-1">
                Locataire Bénéficiaire
              </span>
              <div className="font-bold text-[#1C1C1C]">{receiptData.tenantName}</div>
              <div className="text-[12px] text-[#64635F]">{receiptData.propertyTitle}</div>
            </div>
          </div>

          {/* Property & Period */}
          <div className="p-3 bg-white border border-[#E8E5E0] rounded-[6px] space-y-1 text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#64635F]">Adresse du logement :</span>
              <span className="font-semibold text-[#1C1C1C]">{receiptData.propertyAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64635F]">Période concernée :</span>
              <span className="font-bold text-[#1C1C1C]">{receiptData.month}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64635F]">Mode de règlement :</span>
              <span className="font-semibold text-[#1C1C1C] uppercase">{receiptData.channel}</span>
            </div>
          </div>

          {/* Amount Paid Box */}
          <div className="bg-[#1C1C1C] text-white p-4 rounded-[6px] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-white/70 block uppercase font-medium">Montant Total Réglé</span>
              <span className="text-[22px] font-extrabold text-white">
                {receiptData.amountFcfa.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-[#1C1C1C] bg-white px-2.5 py-1 rounded">
                PAYÉ EN INTÉGRALITÉ ✓
              </span>
              {receiptData.amountEuros && (
                <span className="text-[11px] text-white/60 block mt-1">
                  ≈ {receiptData.amountEuros} €
                </span>
              )}
            </div>
          </div>

          {/* Legal mentions and QR Code */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-[#64635F] border-t border-[#E8E5E0]">
            <div className="space-y-0.5">
              <div>Certificat horodaté le : <strong>{receiptData.date}</strong></div>
              <div>Conforme aux dispositions des baux à usage d&apos;habitation (Loi 2022-30 Bénin).</div>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-[#E8E5E0] p-1.5 rounded">
              <QrCodeIcon className="h-7 w-7 text-[#1C1C1C]" />
              <div className="text-[9px] font-mono leading-tight text-[#1C1C1C]">
                AUTHENTIFIÉ<br />PAR LOKKA
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary py-2.5 px-4 text-[13px] cursor-pointer"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="btn-primary py-2.5 px-6 text-[13px] inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>{isDownloading ? "Génération PDF..." : "Télécharger la Quittance PDF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
