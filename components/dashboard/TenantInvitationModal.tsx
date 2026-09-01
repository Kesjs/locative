"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  XMarkIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  EyeIcon,
  PencilSquareIcon,
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

  // Editable Form Fields for Live Customization
  const [recipientEmail, setRecipientEmail] = useState(tenantData.tenantEmail || "");
  const [recipientName, setRecipientName] = useState(tenantData.tenantName || "");
  const [emailSubject, setEmailSubject] = useState(
    `Votre Espace Locataire Lokka est prêt — ${tenantData.propertyTitle}`
  );
  const [customMessage, setCustomMessage] = useState(
    "Voici vos identifiants d'accès à votre espace locataire pour télécharger vos quittances certifiées et suivre vos paiements de loyer en toute simplicité."
  );

  if (!isOpen) return null;

  const portalUrl = typeof window !== "undefined" ? `${window.location.origin}/locataire` : "https://lokka.bj/locataire";
  const formattedRent = Number(tenantData.rentAmount).toLocaleString("fr-FR");
  const depositAmount = Number(tenantData.rentAmount) * Number(tenantData.depositMonths || 3);
  const formattedDeposit = depositAmount.toLocaleString("fr-FR");

  const whatsappMessage = `*LOKKA BÉNIN — Votre Espace Locataire est prêt !* 🇧🇯\n\nBonjour *${recipientName}*,\nVotre bailleur *${tenantData.ownerName}* vous a activé votre accès pour *${tenantData.propertyTitle}*.\n\n• *Loyer mensuel :* ${formattedRent} FCFA\n• *Caution légale (Loi 2022-30) :* ${formattedDeposit} FCFA (${tenantData.depositMonths} mois)\n${customMessage ? `\n💬 *Note :* "${customMessage}"\n` : ""}\n👉 *Lien d'accès immédiat :* ${portalUrl}\n\n_Connectez-vous pour télécharger vos quittances PDF officielles et payer votre loyer par MTN MoMo / Moov Money._`;

  const handleSendEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes("@")) {
      toast.error("Veuillez saisir une adresse email valide.");
      return;
    }
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/send-tenant-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tenantData,
          tenantName: recipientName,
          tenantEmail: recipientEmail,
          customMessage,
          subject: emailSubject,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSent(true);
        toast.success(`Email d'invitation envoyé avec succès à ${recipientEmail} via Resend !`);
        setTimeout(() => setEmailSent(false), 5000);
      } else {
        toast.error(data.error || "Erreur lors de l'envoi de l'email.");
      }
    } catch (err) {
      console.error("Erreur envoi invitation:", err);
      toast.error("Erreur de connexion au serveur d'email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyWhatsapp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWhatsapp(true);
    toast.success("Message WhatsApp copié dans le presse-papiers !");
    setTimeout(() => setCopiedWhatsapp(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = (tenantData.tenantPhone || "").replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-card-foreground my-8">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              <ShieldCheckIcon className="h-4 w-4" />
              Invitation Espace Locataire · Resend & WhatsApp
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
              <span>Email Personnalisé & Aperçu Live</span>
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

          <a
            href="/locataire"
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-primary font-bold hover:underline inline-flex items-center gap-1.5 self-end sm:self-auto"
          >
            <span>Tester l&apos;Espace Locataire</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LIVE EMAIL CUSTOMIZER & LIVE PREVIEW                               */}
        {/* ========================================================================= */}
        {activeTab === "email" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Colonne Gauche : Personnalisation de l'Email */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
                <PencilSquareIcon className="w-4 h-4 text-primary" />
                <span>Personnaliser l&apos;email</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Email du destinataire
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="ex: koudjo.dossou@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Nom du locataire
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nom complet"
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
                    Message / Note personnelle
                  </label>
                  <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3" /> Visible dans le mail
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Ajoutez une note personnelle ou instruction..."
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none leading-relaxed"
                />
              </div>

              {/* Bouton d'Envoi Direct Resend */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSendingEmail || !recipientEmail}
                  onClick={handleSendEmail}
                  className="w-full py-3 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>{isSendingEmail ? "Expédition en cours..." : "Envoyer en 1 clic via Resend"}</span>
                </button>
              </div>

              {emailSent && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-[12px] text-success font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckIcon className="h-4 w-4 stroke-[2.5]" />
                  <span>Email transmis en direct via Resend au locataire !</span>
                </div>
              )}
            </div>

            {/* Colonne Droite : Live Preview Responsive */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-muted-foreground flex items-center gap-1.5">
                  <EyeIcon className="w-4 h-4 text-primary" />
                  Aperçu en direct (Boîte de réception)
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">Modèle Lokka HTML</span>
              </div>

              <div className="flex-1 border border-border rounded-xl bg-[#FAF9F6] p-5 text-[12.5px] space-y-3.5 shadow-inner overflow-y-auto max-h-[380px]">
                {/* Email Header Mock */}
                <div className="flex items-center justify-between border-b border-[#E8E5E0] pb-3">
                  <div>
                    <span className="font-extrabold text-[15px] text-[#0F172A] tracking-tight">LOKKA BÉNIN</span>
                    <span className="text-[10.5px] text-[#64635F] font-bold block">
                      Espace Locataire · Loi 2022-30
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F5EF] text-[#087F5B]">
                    Certifié 🇧🇯
                  </span>
                </div>

                <div className="text-[11px] text-[#64635F] bg-white p-2.5 rounded-md border border-[#E8E5E0]">
                  <strong>Objet :</strong> {emailSubject}
                </div>

                <p className="text-[#0F172A] font-bold text-[13.5px]">
                  Bonjour {recipientName || "Locataire"},
                </p>

                <p className="text-[#64635F] leading-relaxed text-[12px]">
                  Votre bailleur <strong>{tenantData.ownerName}</strong> vous a activé un accès sécurisé à votre <strong>Portail Locataire Lokka</strong> pour le logement :
                </p>

                {/* Box Logement */}
                <div className="p-3.5 bg-white border border-[#E8E5E0] rounded-lg space-y-1.5 shadow-2xs">
                  <p className="font-bold text-[13.5px] text-[#0F172A] m-0">{tenantData.propertyTitle}</p>
                  <p className="text-[11.5px] text-[#64635F] m-0">📍 {tenantData.propertyAddress}</p>
                  <div className="border-t border-dashed border-[#E8E5E0] pt-2 mt-2 space-y-1 text-[11.5px] text-[#0F172A]">
                    <div>• Loyer mensuel : <strong>{formattedRent} FCFA</strong></div>
                    <div>• Caution consignée : <strong>{formattedDeposit} FCFA ({tenantData.depositMonths} mois max)</strong></div>
                  </div>
                </div>

                {/* Note Personnalisée Live */}
                {customMessage && (
                  <div className="bg-[#F8F6F0] border-l-3 border-[#087F5B] p-3 rounded text-[11.5px] italic text-[#1C1C1C]">
                    &quot;{customMessage}&quot;
                    <div className="not-italic font-bold text-[10px] text-[#64635F] mt-1">
                      — Note de votre bailleur {tenantData.ownerName}
                    </div>
                  </div>
                )}

                {/* Bouton CTA */}
                <div className="text-center py-2">
                  <span className="inline-block bg-[#0F172A] text-white px-5 py-2 rounded-md text-[11.5px] font-bold shadow-xs">
                    Accéder à mon Espace Locataire →
                  </span>
                </div>

                <div className="text-[10px] text-[#64635F] text-center bg-[#E6F5EF] p-2 rounded text-[#087F5B]">
                  🔒 Connexion par code OTP 6 chiffres envoyé sur votre email/téléphone (sans mot de passe).
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WHATSAPP MESSAGE                                                   */}
        {/* ========================================================================= */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[13px] font-bold text-foreground">
                  Message WhatsApp personnalisé prêt à être transmis :
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyWhatsapp}
                    className="py-1.5 px-3 bg-muted hover:bg-muted/80 text-foreground text-[12px] font-bold rounded-lg border border-border flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                    <span>{copiedWhatsapp ? "Copié !" : "Copier"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                    <span>Ouvrir WhatsApp</span>
                  </button>
                </div>
              </div>

              <pre className="whitespace-pre-wrap font-sans text-[12.5px] text-card-foreground bg-card p-4 rounded-lg border border-border leading-relaxed">
                {whatsappMessage}
              </pre>
            </div>

            <div className="text-[12px] text-muted-foreground bg-card p-3 rounded-lg border border-border">
              💡 <em>Conseil :</em> Cliquez sur <strong>« Ouvrir WhatsApp »</strong> pour ouvrir directement la discussion avec le locataire sur son numéro béninois (+229).
            </div>
          </div>
        )}

        {/* Footer Actions */}
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
