"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  XMarkIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  EyeIcon,
  PencilSquareIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

interface ShowcaseEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyData: {
    title: string;
    address: string;
    type: string;
    rentAmount: number;
    chargesAmount?: number;
    photoUrl?: string;
    features?: string[];
    visitFee?: number;
    showcaseSlug?: string;
  };
}

export function ShowcaseEmailModal({
  isOpen,
  onClose,
  propertyData,
}: ShowcaseEmailModalProps) {
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp">("email");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  // Form states for Live customization
  const [recipientEmail, setRecipientEmail] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [emailSubject, setEmailSubject] = useState(
    `Découvrez ce bien disponible : ${propertyData.title} (${propertyData.address})`
  );
  const [customMessage, setCustomMessage] = useState(
    "Je vous invite à consulter cette fiche de logement qui pourrait correspondre à votre recherche. Vous pouvez réserver un créneau de visite directement en ligne."
  );

  if (!isOpen) return null;

  const showcaseUrl = typeof window !== "undefined"
    ? `${window.location.origin}/p/${propertyData.showcaseSlug || "patrimoine-lokka"}`
    : `https://lokka.bj/p/${propertyData.showcaseSlug || "patrimoine-lokka"}`;

  const formattedRent = Number(propertyData.rentAmount).toLocaleString("fr-FR");
  const formattedCharges = Number(propertyData.chargesAmount || 0).toLocaleString("fr-FR");

  const whatsappMessage = `*LOKKA BÉNIN — Logement disponible à la location* 🏠\n\nBonjour ${prospectName ? `*${prospectName}*` : ""},\nDécouvrez ce bien disponible :\n\n• *${propertyData.title}* (${propertyData.type})\n• *Adresse :* ${propertyData.address}\n• *Loyer :* ${formattedRent} FCFA / mois ${propertyData.chargesAmount ? `(+ ${formattedCharges} FCFA charges)` : ""}\n${propertyData.visitFee ? `• *Frais de visite :* ${propertyData.visitFee.toLocaleString("fr-FR")} FCFA\n` : ""}${customMessage ? `\n💬 *Note :* "${customMessage}"\n` : ""}\n👉 *Voir la fiche photos & Réserver une visite :* ${showcaseUrl}`;

  const handleSendEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes("@")) {
      toast.error("Veuillez renseigner une adresse email valide.");
      return;
    }
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/send-showcase-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          prospectName,
          ownerName: "Votre bailleur Lokka",
          propertyTitle: propertyData.title,
          propertyAddress: propertyData.address,
          propertyType: propertyData.type,
          rentAmountFcfa: propertyData.rentAmount,
          chargesAmountFcfa: propertyData.chargesAmount || 0,
          photoUrl: propertyData.photoUrl,
          features: propertyData.features || [],
          visitFeeFcfa: propertyData.visitFee,
          customMessage,
          showcaseUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSent(true);
        toast.success(`Fiche vitrine envoyée avec succès à ${recipientEmail} via Resend !`);
        setTimeout(() => setEmailSent(false), 5000);
      } else {
        toast.error(data.error || "Erreur lors de l'envoi de l'email.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau lors de l'envoi.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyWhatsapp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWhatsapp(true);
    toast.success("Message copié dans le presse-papiers !");
    setTimeout(() => setCopiedWhatsapp(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-card-foreground my-8">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <BuildingOffice2Icon className="h-4 w-4" />
              Partage Vitrine & Invitation Visite · Resend & WhatsApp
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="inline-flex bg-muted p-1 rounded-lg border border-border gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 text-[12px] font-bold rounded-md transition flex items-center gap-2 cursor-pointer ${
                activeTab === "email"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <EnvelopeIcon className="h-4 w-4 text-primary" />
              <span>Email Fiche Vitrine & Aperçu Live</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className={`px-4 py-2 text-[12px] font-bold rounded-md transition flex items-center gap-2 cursor-pointer ${
                activeTab === "whatsapp"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-emerald-600" />
              <span>Message WhatsApp</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EMAIL WITH LIVE PREVIEW                                            */}
        {/* ========================================================================= */}
        {activeTab === "email" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Formulaire de personnalisation */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
                <PencilSquareIcon className="w-4 h-4 text-primary" />
                <span>Personnaliser l&apos;email prospect</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Email du prospect / contact
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="ex: prospect@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Nom du prospect (optionnel)
                </label>
                <input
                  type="text"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  placeholder="ex: M. Koffi"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Objet du mail
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                    Message personnel / Consignes de visite
                  </label>
                  <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3" /> Visible dans le mail
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Ajoutez une note personnelle..."
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none leading-relaxed"
                />
              </div>

              {/* Bouton d'envoi 1-clic */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSendingEmail || !recipientEmail}
                  onClick={handleSendEmail}
                  className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>{isSendingEmail ? "Expédition Resend..." : "Envoyer la Fiche en 1 clic"}</span>
                </button>
              </div>

              {emailSent && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-[12px] text-success font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckIcon className="h-4 w-4 stroke-[2.5]" />
                  <span>Fiche envoyée au prospect via Resend !</span>
                </div>
              )}
            </div>

            {/* Live Preview Responsive */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-muted-foreground flex items-center gap-1.5">
                  <EyeIcon className="w-4 h-4 text-primary" />
                  Aperçu en direct (Boîte de réception)
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">Modèle Vitrine Lokka</span>
              </div>

              <div className="flex-1 border border-border rounded-xl bg-[#FAF9F6] p-5 text-[12.5px] space-y-3 shadow-inner overflow-y-auto max-h-[380px]">
                <div className="flex items-center justify-between border-b border-[#E8E5E0] pb-2.5">
                  <div>
                    <span className="font-extrabold text-[15px] text-[#0F172A] tracking-tight">LOKKA BÉNIN</span>
                    <span className="text-[10.5px] text-[#64635F] font-bold block">
                      Opportunité Immobilière 🇧🇯
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F5EF] text-[#087F5B]">
                    Disponible
                  </span>
                </div>

                <div className="text-[11px] text-[#64635F] bg-white p-2 rounded border border-[#E8E5E0]">
                  <strong>Objet :</strong> {emailSubject}
                </div>

                <p className="text-[#0F172A] font-bold text-[13px]">
                  Bonjour {prospectName || "Madame, Monsieur"},
                </p>

                {propertyData.photoUrl && (
                  <div className="rounded-lg overflow-hidden h-32 w-full bg-muted">
                    <img src={propertyData.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-3.5 bg-white border border-[#E8E5E0] rounded-lg space-y-1 shadow-2xs">
                  <div className="text-[11px] font-bold text-[#087F5B] uppercase">{propertyData.type}</div>
                  <p className="font-bold text-[14px] text-[#0F172A] m-0">{propertyData.title}</p>
                  <p className="text-[11.5px] text-[#64635F] m-0">📍 {propertyData.address}</p>
                  <div className="border-t border-dashed border-[#E8E5E0] pt-2 mt-2 text-[12px] text-[#0F172A]">
                    • Loyer : <strong className="text-[#087F5B]">{formattedRent} FCFA</strong> / mois
                  </div>
                </div>

                {customMessage && (
                  <div className="bg-[#F8F6F0] border-l-3 border-[#087F5B] p-2.5 rounded text-[11.5px] italic text-[#1C1C1C]">
                    &quot;{customMessage}&quot;
                  </div>
                )}

                <div className="text-center py-1.5">
                  <span className="inline-block bg-[#087F5B] text-white px-5 py-2 rounded-md text-[11.5px] font-bold shadow-xs">
                    Voir l&apos;Annonce &amp; Réserver une Visite →
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WHATSAPP                                                           */}
        {/* ========================================================================= */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-foreground">Texte prêt pour WhatsApp :</span>
                <button
                  type="button"
                  onClick={handleCopyWhatsapp}
                  className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  <span>{copiedWhatsapp ? "Copié !" : "Copier le message"}</span>
                </button>
              </div>

              <pre className="whitespace-pre-wrap font-sans text-[12.5px] text-card-foreground bg-card p-4 rounded-lg border border-border leading-relaxed">
                {whatsappMessage}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground rounded-lg transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
