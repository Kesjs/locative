"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import ReceiptModal from "@/components/dashboard/ReceiptModal";
import {
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  DocumentCheckIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function TenantPortalPage() {
  const [tenantName, setTenantName] = useState("Koudjo Dossou");
  const [propertyTitle, setPropertyTitle] = useState("Villa 4P — Fidjrossè Calvaire");
  const [propertyAddress, setPropertyAddress] = useState("Lot 450 Fidjrossè Calvaire, Cotonou");
  const [rentAmount, setRentAmount] = useState(250000);
  const [ownerName, setOwnerName] = useState("M. Dossou Mensah");
  const [paymentChannel, setPaymentChannel] = useState("MTN MoMo");

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Payment simulation state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Incident form state
  const [incidentCategory, setIncidentCategory] = useState("plomberie");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentSent, setIncidentSent] = useState(false);

  useEffect(() => {
    try {
      const savedOnboarding = localStorage.getItem("lokka_onboarding_data");
      if (savedOnboarding) {
        const ob = JSON.parse(savedOnboarding);
        if (ob.tenant?.name) setTenantName(ob.tenant.name);
        if (ob.property?.title) setPropertyTitle(ob.property.title);
        if (ob.property?.address) setPropertyAddress(ob.property.address);
        if (ob.property?.rent) setRentAmount(Number(ob.property.rent));
        if (ob.userName) setOwnerName(ob.userName);
        if (ob.paymentChannel) setPaymentChannel(ob.paymentChannel === "moov" ? "Moov Money" : "MTN MoMo");
      }
    } catch (_) {}
  }, []);

  const pastReceipts = [
    {
      receiptNo: "LOK-2026-0891",
      month: "Septembre 2026",
      date: "02/09/2026",
      amount: rentAmount,
      channel: paymentChannel,
      status: "Acquitté",
    },
    {
      receiptNo: "LOK-2026-0740",
      month: "Août 2026",
      date: "03/08/2026",
      amount: rentAmount,
      channel: paymentChannel,
      status: "Acquitté",
    },
    {
      receiptNo: "LOK-2026-0612",
      month: "Juillet 2026",
      date: "01/07/2026",
      amount: rentAmount,
      channel: paymentChannel,
      status: "Acquitté",
    },
  ];

  const handleOpenReceipt = (r: any) => {
    setSelectedReceipt({
      receiptNo: r.receiptNo,
      date: r.date,
      month: r.month,
      tenantName,
      propertyTitle,
      propertyAddress,
      amountFcfa: r.amount,
      channel: r.channel,
      ownerName,
    });
    setIsReceiptModalOpen(true);
  };

  const handleSimulatePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const handleSendIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDescription) return;
    setIncidentSent(true);
    setTimeout(() => {
      setIncidentSent(false);
      setIncidentDescription("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1C] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E8E5E0] sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" variant="dark" />
            <span className="text-[12px] font-bold text-[#1C1C1C] bg-[#E6F5EF] px-2.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Espace Locataire Sécurisé
            </span>
          </div>

          <div className="flex items-center gap-4 text-[13px]">
            <span className="font-semibold text-[#1C1C1C]">{tenantName}</span>
            <Link
              href="/auth/login"
              className="text-[#64635F] hover:text-[#1C1C1C] font-medium"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </header>

      {/* Main Tenant Portal Content */}
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* Welcome Hero Banner */}
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] bg-[#E6F5EF] px-2.5 py-0.5 rounded-full mb-2">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Bail Conforme Loi n° 2022-30 · République du Bénin 🇧🇯
            </div>
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#1C1C1C] tracking-tight">
              Bonjour, {tenantName}
            </h1>
            <p className="text-[14px] text-[#64635F] mt-1">
              Retrouvez l&apos;ensemble de vos quittances officielles, payez votre loyer et consultez les détails de votre bail.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FAF9F6] border border-[#E8E5E0] p-4 rounded-[8px]">
            <div>
              <span className="text-[11px] text-[#64635F] block uppercase font-medium">Bailleur / Contact</span>
              <span className="text-[14px] font-bold text-[#1C1C1C] block">{ownerName}</span>
              <span className="text-[12px] text-[#1C1C1C] font-semibold">📍 {propertyAddress}</span>
            </div>
          </div>
        </div>

        {/* Current Month Payment Action Card */}
        <div className="bg-[#1C1C1C] text-white rounded-[12px] p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6F5EF] block mb-1">
                Échéance du mois en cours · Octobre 2026
              </span>
              <div className="text-[28px] sm:text-[32px] font-extrabold text-white">
                {rentAmount.toLocaleString("fr-FR")} <span className="text-[16px] font-normal text-white/70">FCFA</span>
              </div>
              <div className="text-[12px] text-white/70 mt-1 flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-[#E6F5EF]" />
                <span>Exigible avant le 05 du mois via MTN MoMo ou Moov Money</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {paymentSuccess ? (
                <div className="inline-flex items-center gap-2 bg-[#1C1C1C] text-white px-5 py-3 rounded-[6px] text-[13px] font-bold">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Paiement validé ! Quittance générée.</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isPaying}
                  onClick={handleSimulatePayment}
                  className="bg-[#1C1C1C] hover:bg-[#076b4d] text-white px-6 py-3 rounded-[6px] text-[13px] font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  <span>{isPaying ? "Traitement MoMo..." : `Payer ${rentAmount.toLocaleString("fr-FR")} FCFA par MoMo`}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two Columns Grid: Receipts & Incident Report */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (7 cols): Past PDF Receipts */}
          <div className="lg:col-span-7 bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E0]">
              <div>
                <h3 className="text-[17px] font-bold text-[#1C1C1C]">
                  Mes Quittances de Loyer Certifiées
                </h3>
                <p className="text-[12px] text-[#64635F]">
                  Téléchargeables avec valeur probante et QR Code officiel
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1C1C1C] bg-[#E6F5EF] px-2.5 py-1 rounded-full">
                À jour ✓
              </span>
            </div>

            <div className="space-y-3">
              {pastReceipts.map((r, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] flex items-center justify-between gap-3 hover:bg-white hover:border-[#1C1C1C] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#1C1C1C]">{r.month}</span>
                      <span className="text-[10px] font-bold text-[#1C1C1C] bg-[#E6F5EF] px-1.5 py-0.2 rounded">
                        {r.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64635F] mt-0.5">
                      N° {r.receiptNo} · Réglé le {r.date} par {r.channel}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(r)}
                    className="btn-primary py-2 px-3 text-[12px] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                    <span>Quittance PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Incident & Lease Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Caution & Legal Check Card */}
            <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#1C1C1C]">
                <ShieldCheckIcon className="h-5 w-5" />
                <h4 className="text-[15px] font-bold text-[#1C1C1C]">
                  Caution &amp; Dépôt de Garantie
                </h4>
              </div>
              <p className="text-[12px] text-[#64635F]">
                Votre caution est strictement sécurisée conformément à l&apos;Article 10 de la <strong>Loi n° 2022-30</strong> :
              </p>
              <div className="p-3 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] flex items-center justify-between text-[13px]">
                <span className="text-[#64635F]">Caution déposée (3 mois) :</span>
                <span className="font-bold text-[#1C1C1C]">
                  {(rentAmount * 3).toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>

            {/* Signalement de Panne / Incident */}
            <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <WrenchScrewdriverIcon className="h-5 w-5 text-[#1C1C1C]" />
                <h4 className="text-[15px] font-bold text-[#1C1C1C]">
                  Signaler une panne ou un incident
                </h4>
              </div>

              {incidentSent ? (
                <div className="p-3 bg-[#E6F5EF] border border-[#1C1C1C]/30 rounded-[6px] text-[12px] text-[#1C1C1C] font-semibold flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Demande transmise au propriétaire avec succès !</span>
                </div>
              ) : (
                <form onSubmit={handleSendIncident} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64635F] mb-1">
                      Catégorie d&apos;intervention
                    </label>
                    <select
                      value={incidentCategory}
                      onChange={(e) => setIncidentCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    >
                      <option value="plomberie">💧 Plomberie / Fuite d&apos;eau SONEB</option>
                      <option value="electricite">⚡ Électricité / Compteur SBEE</option>
                      <option value="climatisation">❄️ Climatisation</option>
                      <option value="serrurerie">🔑 Serrurerie / Portes</option>
                      <option value="autre">Autre problème</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64635F] mb-1">
                      Description du problème
                    </label>
                    <textarea
                      rows={2}
                      value={incidentDescription}
                      onChange={(e) => setIncidentDescription(e.target.value)}
                      placeholder="Expliquez brièvement le souci constaté..."
                      className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[12px] font-semibold rounded-[6px] transition cursor-pointer"
                  >
                    Envoyer au bailleur
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          receiptData={selectedReceipt}
        />
      )}

      {/* Footer minimal */}
      <footer className="bg-white border-t border-[#E8E5E0] py-4 text-center text-[12px] text-[#9C9A95]">
        Lokka © 2026 · Espace Locataire Conforme à la Loi n° 2022-30 de la République du Bénin 🇧🇯
      </footer>
    </div>
  );
}
