"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Megaphone,
  Globe,
  MessageSquare,
  Calendar,
  FileText,
  Sparkles,
  Clock,
  Bell,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from "lucide-react";

export default function AnnoncesPage() {
  const [isNotified, setIsNotified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNotifyMe = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsNotified(true);
      toast.success("C'est noté ! Vous serez alerté en avant-première lors de l'ouverture du module Annonces.");
    }, 600);
  };

  const upcomingFeatures = [
    {
      icon: Globe,
      title: "Mini-Site Vitrine Personnalisé",
      description: "Une page web publique élégante (ex: lokka.bj/p/votre-nom) présentant l'ensemble de vos logements disponibles avec photos, loyers et caractéristiques.",
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-900/50",
    },
    {
      icon: MessageSquare,
      title: "Diffusion WhatsApp & Réseaux Sociaux",
      description: "Partagez vos fiches de location en 1 clic sur WhatsApp, Facebook et par email avec des messages pré-formatés et attractifs.",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
    },
    {
      icon: Calendar,
      title: "Prise de Rendez-vous de Visite",
      description: "Permettez aux candidats locataires de réserver un créneau de visite en ligne avec qualification préalable de leur profil.",
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-900/50",
    },
    {
      icon: FileText,
      title: "Affiches & Flyers PDF Instantanés",
      description: "Génération automatique d'affiches « À Louer » au format PDF prêtes à imprimer ou à afficher sur vos portails et façades.",
      color: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-900/50",
    },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* ─── BANNIÈRE PRINCIPALE : BIENTÔT DISPONIBLE ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-amber-200/80 dark:border-amber-800/60 bg-gradient-to-br from-amber-500/5 via-background to-orange-500/5 p-6 sm:p-10 shadow-xs"
      >
        {/* Glow décoratif */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80 shadow-2xs">
                <Clock className="w-3.5 h-3.5" />
                Module en préparation
              </span>
              <span className="text-[12px] font-medium text-muted-foreground">
                Arrivée prévue dans la prochaine version
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <Megaphone className="w-7 h-7 text-amber-500" />
              Annonces &amp; Vitrine Publique
            </h1>

            <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed">
              Nous finalisons la suite marketing pour vous permettre de diffuser vos logements vacants,
              générer votre mini-site vitrine et attirer des locataires qualifiés sans frais d'agence.
            </p>
          </div>

          {/* Action CTA Box */}
          <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            {!isNotified ? (
              <button
                type="button"
                onClick={handleNotifyMe}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[13.5px] shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-[0.98] disabled:opacity-60"
              >
                <Bell className="w-4 h-4" />
                <span>{loading ? "Enregistrement..." : "M'avertir du lancement"}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[13px] font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Vous serez prévenu(e) en priorité !</span>
              </div>
            )}

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-muted border border-border text-foreground font-semibold text-[13px] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ─── APERÇU DES FONCTIONNALITÉS EN COURS DE DÉVELOPPEMENT ─── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-[17px] font-bold text-foreground">Ce qui arrive dans ce module</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-5 rounded-xl border bg-card/60 backdrop-blur-xs shadow-2xs space-y-2.5 transition-all hover:border-border hover:shadow-xs ${feat.borderColor}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-card-foreground">{feat.title}</h3>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── APERÇU DE LA VITRINE EN CHIFFRES / VISUEL ─── */}
      <div className="p-6 rounded-2xl border border-dashed border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="text-[14px] font-bold text-foreground">Vous avez des logements disponibles dès maintenant ?</h4>
          <p className="text-[12.5px] text-muted-foreground">
            En attendant l&apos;ouverture de la vitrine, vous pouvez déjà enregistrer vos biens et vos baux dans l&apos;onglet Logements.
          </p>
        </div>
        <Link
          href="/dashboard/patrimoine"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted border border-border text-[13px] font-bold text-foreground transition shadow-2xs shrink-0"
        >
          <Share2 className="w-3.5 h-3.5 text-primary" />
          <span>Gérer mes logements</span>
        </Link>
      </div>
    </div>
  );
}
