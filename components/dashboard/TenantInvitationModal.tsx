"use client";

import { useState } from "react";
import {
  XMarkIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

interface TenantInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantData: {
    tenantName: string;
    tenantEmail?: string;
    tenantPhone?: string;
    ownerName: string;
    propertyTitle: string;
    propertyAddress: string;
    rentAmount: number;
    depositMonths: number;
  };
}

export default function TenantInvitationModal({
  isOpen,
  onClose,
  tenantData,
}: TenantInvitationModalProps) {
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp">("email");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [customEmail, setCustomEmail] = useState(tenantData.tenantEmail || "");

  if (!isOpen) return null;

  const portalUrl = typeof window !== "undefined" ? `${window.location.origin}/locataire` : "https://codeo-ui.com/locataire";
  const formattedRent = Number(tenantData.rentAmount).toLocaleString("fr-FR");
  const depositAmount = Number(tenantData.rentAmount) * Number(tenantData.depositMonths || 3);
  const formattedDeposit = depositAmount.toLocaleString("fr-FR");

  const whatsappMessage = `*LOKKA BÉNIN — Votre Espace Locataire est prêt !* 🇧🇯\n\nBonjour *${tenantData.tenantName}*,\nVotre bailleur *${tenantData.ownerName}* vous a activé votre accès pour *${tenantData.propertyTitle}*.\n\n• *Loyer mensuel :* ${formattedRent} FCFA\n• *Caution légale (Loi 2022-30) :* ${formattedDeposit} FCFA (${tenantData.depositMonths} mois)\n\n👉 *Lien d'accès immédiat :* ${portalUrl}\n\n_Connectez-vous pour télécharger vos quittances PDF officielles et payer votre loyer par MTN MoMo / Moov Money._`;

  const handleSendEmail = async () => {
    if (!customEmail) return;
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/send-tenant-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tenantData,
          tenantEmail: customEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 4000);
      }
    } catch (err) {
      console.error("Erreur envoi invitation:", err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyWhatsapp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E5E0] rounded-[12px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-[#1C1C1C] my-8">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E5E0] mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-0.5 rounded-full">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Invitation &amp; Accès Espace Locataire
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[6px] border border-[#E8E5E0] text-[#64635F] hover:text-[#1C1C1C] hover:bg-[#FAF9F6] transition cursor-pointer"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher: Email vs WhatsApp */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="inline-flex bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`px-3.5 py-1.5 text-[12px] font-bold rounded-[4px] transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "email"
                  ? "bg-[#1C1C1C] text-white shadow-xs"
                  : "text-[#64635F] hover:text-[#1C1C1C]"
              }`}
            >
              <EnvelopeIcon className="h-3.5 w-3.5" />
              <span>Email d&apos;invitation</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className={`px-3.5 py-1.5 text-[12px] font-bold rounded-[4px] transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "whatsapp"
                  ? "bg-[#1C1C1C] text-white shadow-xs"
                  : "text-[#64635F] hover:text-[#1C1C1C]"
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
              <span>Message WhatsApp</span>
            </button>
          </div>

          <a
            href="/locataire"
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-[#1C1C1C] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Voir l&apos;Espace Locataire</span>
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EMAIL PREVIEW & SEND VIA RESEND                                    */}
        {/* ========================================================================= */}
        {activeTab === "email" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Email du locataire (ex: locataire@gmail.com)"
                className="flex-1 px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
              />
              <button
                type="button"
                disabled={isSendingEmail || !customEmail}
                onClick={handleSendEmail}
                className="btn-primary py-2 px-4 text-[13px] inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <PaperAirplaneIcon className="h-3.5 w-3.5" />
                <span>{isSendingEmail ? "Envoi Resend..." : "Envoyer l'Email"}</span>
              </button>
            </div>

            {emailSent && (
              <div className="p-3 bg-[#F3F2EE] border border-[#E8E5E0] rounded-[6px] text-[12px] text-[#1C1C1C] font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckIcon className="h-4 w-4 stroke-[2.5]" />
                <span>Email d&apos;invitation envoyé avec succès au locataire via Resend !</span>
              </div>
            )}

            {/* Email Visual Preview Card */}
            <div className="border border-[#E8E5E0] rounded-[8px] bg-[#FAF9F6] p-6 text-[13px] space-y-4 max-h-[320px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E8E5E0] pb-3">
                <div>
                  <span className="font-extrabold text-[16px] text-[#1C1C1C]">LOKKA BÉNIN</span>
                  <span className="text-[11px] text-[#64635F] font-bold block">
                    Portail Locataire Sécurisé · Loi n° 2022-30
                  </span>
                </div>
                <span className="text-[11px] text-[#64635F]">Modèle officiel</span>
              </div>

              <p className="text-[#1C1C1C] font-semibold">
                Bonjour {tenantData.tenantName},
              </p>

              <p className="text-[#64635F] leading-relaxed">
                Votre bailleur / gestionnaire <strong>{tenantData.ownerName}</strong> vous a activé un accès sécurisé à votre portail locataire Lokka pour le logement : <strong>{tenantData.propertyTitle}</strong>.
              </p>

              <div className="p-3 bg-white border border-[#E8E5E0] rounded-[6px] space-y-1">
                <div>• Loyer mensuel : <strong>{formattedRent} FCFA</strong></div>
                <div>• Caution déposée : <strong>{formattedDeposit} FCFA ({tenantData.depositMonths} mois)</strong></div>
                <div>• Échéance de paiement : <strong>Avant le 5 du mois</strong></div>
              </div>

              <div className="text-center py-2">
                <span className="inline-block bg-[#1C1C1C] text-white px-5 py-2.5 rounded-[6px] text-[12px] font-bold shadow-xs">
                  Accéder à mon Espace Locataire →
                </span>
              </div>

              <div className="text-[11px] text-[#64635F] text-center">
                🔒 Connexion par code OTP 6 chiffres envoyé sur votre email/téléphone (aucun mot de passe requis).
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WHATSAPP MESSAGE PREVIEW & COPY                                    */}
        {/* ========================================================================= */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="p-4 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1C1C1C]">
                  Texte prêt à coller sur WhatsApp :
                </span>
                <button
                  type="button"
                  onClick={handleCopyWhatsapp}
                  className="py-1.5 px-3 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[12px] font-bold rounded flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <CheckIcon className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{copiedWhatsapp ? "Copié !" : "Copier le message"}</span>
                </button>
              </div>

              <pre className="whitespace-pre-wrap font-sans text-[13px] text-[#1C1C1C] bg-white p-3.5 rounded border border-[#E8E5E0] leading-relaxed">
                {whatsappMessage}
              </pre>
            </div>

            <div className="text-[11px] text-[#64635F]">
              💡 <em>Astuce :</em> Envoyez ce message directement au locataire sur son numéro WhatsApp (+229). Il pourra cliquer sur le lien pour payer par MoMo et télécharger ses quittances PDF certifiées.
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-[#E8E5E0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary py-2 px-5 text-[13px] cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
