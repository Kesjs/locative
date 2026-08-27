"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import ReceiptModal from "@/components/dashboard/ReceiptModal";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const initialRents = [
  {
    id: 1,
    tenant: "Koudjo Dossou",
    avatar: "https://i.pravatar.cc/40?img=12",
    property: "Villa 4P — Fidjrossè Plage",
    city: "Cotonou",
    amount: 350000,
    channel: "mtn",
    method: "MTN MoMo (Ref #84920)",
    status: "Payé le 02/09",
    type: "success",
    receiptNo: "LOK-2026-0891",
  },
  {
    id: 2,
    tenant: "Bérénice Agossou",
    avatar: "https://i.pravatar.cc/40?img=68",
    property: "Studio Meublé — Haie Vive",
    city: "Cotonou",
    amount: 120000,
    channel: "moov",
    method: "Moov Money (Ref #10394)",
    status: "Payé le 01/09",
    type: "success",
    receiptNo: "LOK-2026-0890",
  },
  {
    id: 3,
    tenant: "Rachidi Saka",
    avatar: "https://i.pravatar.cc/40?img=47",
    property: "Appartement F3 — Arconville",
    city: "Calavi",
    amount: 180000,
    channel: "especes",
    method: "Espèces (En attente)",
    status: "Retard (+5j)",
    type: "danger",
    receiptNo: "LOK-2026-0872",
  },
  {
    id: 4,
    tenant: "Estelle Houndété",
    avatar: "https://i.pravatar.cc/40?img=33",
    property: "Duplex Standing — Cadjehoun",
    city: "Cotonou",
    amount: 450000,
    channel: "virement",
    method: "Virement BOA (Ref #99231)",
    status: "Payé le 01/09",
    type: "success",
    receiptNo: "LOK-2026-0865",
  },
];

export default function RentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "late">("all");
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const filteredRents = initialRents.filter((r) => {
    const matchSearch =
      r.tenant.toLowerCase().includes(search.toLowerCase()) ||
      r.property.toLowerCase().includes(search.toLowerCase()) ||
      r.method.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "paid") return r.type === "success";
    if (filter === "late") return r.type === "danger";
    return true;
  });

  const handleOpenReceipt = (r: any) => {
    setSelectedReceipt({
      receiptNo: r.receiptNo,
      date: "02 Septembre 2026",
      month: "Septembre 2026",
      tenantName: r.tenant,
      propertyTitle: r.property,
      propertyAddress: `${r.property}, ${r.city}`,
      amountFcfa: r.amount,
      amountEuros: Math.round(r.amount / 655.957),
      channel: r.method,
      ownerName: "Bailleur Lokka",
    });
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-10">
      <Header
        title="Loyers & Encaissements"
        subtitle="Suivi des règlements Mobile Money, relances et quittances certifiées."
      />

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#64635F] font-medium mb-1">
              Loyers encaissés (Mois en cours)
            </div>
            <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={4850000} />
              <span className="text-[14px] font-semibold text-[#64635F]">FCFA</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-[#FAF9F6] h-2 rounded-full overflow-hidden border border-[#E8E5E0] mb-2">
              <div className="bg-[#1C1C1C] h-full rounded-full" style={{ width: "96.5%" }} />
            </div>
            <div className="text-[11px] text-[#1C1C1C] font-semibold">
              96.5% du total attendu encaissé
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#64635F] font-medium mb-1">
              Règlement en retard
            </div>
            <div className="text-[26px] font-extrabold text-[#C92A2A] tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={180000} className="text-[#C92A2A]" />
              <span className="text-[14px] font-semibold text-[#64635F]">FCFA</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[#F0EDE8] flex items-center justify-between text-[11px]">
            <span className="text-[#C92A2A] font-semibold">1 locataire (+5 jours)</span>
            <span className="text-[#64635F]">Rachidi Saka</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#64635F] font-medium mb-1">
              Prochaine échéance
            </div>
            <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-2">
              01 Oct 2026
            </div>
          </div>
          <div className="pt-2 border-t border-[#F0EDE8] text-[11px] text-[#64635F]">
            Rappels WhatsApp automatiques programmés à J-3
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#E8E5E0] rounded-[12px] overflow-hidden shadow-xs">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-[#E8E5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6]/50">
          <div className="flex items-center gap-3">
            <h3 className="text-[16px] font-bold text-[#1C1C1C]">
              Échéancier de Septembre 2026
            </h3>
            <span className="text-[11px] font-semibold text-[#64635F] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-0.5 rounded-full">
              {filteredRents.length} règlements
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Buttons */}
            <div className="inline-flex rounded-[6px] bg-[#FAF9F6] border border-[#E8E5E0] p-0.5">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition cursor-pointer ${
                  filter === "all"
                    ? "bg-[#1C1C1C] text-white shadow-xs"
                    : "text-[#64635F] hover:text-[#1C1C1C]"
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setFilter("paid")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition cursor-pointer ${
                  filter === "paid"
                    ? "bg-[#1C1C1C] text-white shadow-xs"
                    : "text-[#64635F] hover:text-[#1C1C1C]"
                }`}
              >
                Payés
              </button>
              <button
                type="button"
                onClick={() => setFilter("late")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition cursor-pointer ${
                  filter === "late"
                    ? "bg-[#1C1C1C] text-white shadow-xs"
                    : "text-[#64635F] hover:text-[#1C1C1C]"
                }`}
              >
                Retards
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9C9A95]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1 text-[12px] bg-white border border-[#E8E5E0] rounded-[6px] text-[#1C1C1C] placeholder-[#9C9A95] focus:outline-none focus:border-[#1C1C1C] w-[160px]"
              />
            </div>

            {/* Export Journal */}
            <button
              type="button"
              onClick={() => alert("Export du journal des encaissements en cours de téléchargement...")}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#FAF9F6] border border-[#E8E5E0] text-[12px] font-semibold text-[#1C1C1C] rounded-[6px] shadow-2xs transition cursor-pointer"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5 text-[#64635F]" />
              <span>Journal PDF</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E8E5E0] text-[#64635F] text-[11px] font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Locataire</th>
                <th className="px-5 py-3">Bien</th>
                <th className="px-5 py-3">Montant</th>
                <th className="px-5 py-3">Mode de paiement</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Quittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5E0]">
              {filteredRents.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-[#1C1C1C]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={row.avatar}
                        alt={row.tenant}
                        className="h-7 w-7 rounded-full object-cover border border-[#E8E5E0]"
                      />
                      <span>{row.tenant}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#64635F]">{row.property}</td>
                  <td className="px-5 py-3.5 font-bold text-[#1C1C1C]">
                    {row.amount.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="px-5 py-3.5 text-[#64635F]">{row.method}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        row.type === "success"
                          ? "bg-[#F3F2EE] text-[#1C1C1C] border border-[#E8E5E0]"
                          : "bg-[#FFF5F5] text-[#C92A2A] border border-red-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenReceipt(row)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#1C1C1C] hover:bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] transition cursor-pointer"
                    >
                      <DocumentTextIcon className="h-3.5 w-3.5 text-[#64635F]" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certified Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          receiptData={selectedReceipt}
        />
      )}
    </div>
  );
}
