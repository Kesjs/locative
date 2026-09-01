"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { handleError } from "@/lib/errors";
import type { FormStatus } from "./types";

interface EmailOtpFormProps {
  source: "hero_landing" | "landing_cta";
  buttonLabel: string;
  dark?: boolean;
  className?: string;
  helperText?: string;
}

export default function EmailOtpForm({
  source,
  buttonLabel,
  dark = false,
  className = "",
  helperText = "Essai gratuit 14 jours · Sans carte bancaire · Activation en 2 minutes.",
}: EmailOtpFormProps) {
  const inputId = useId();
  const feedbackId = `${inputId}-feedback`;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState(helperText);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === "submitting") return;

    setStatus("submitting");
    setFeedback("Un code de connexion sécurisé va vous être envoyé...");

    try {
      if (!isSupabaseConfigured()) {
        const message = handleError(
          new Error("Configuration Supabase manquante"),
          "Service momentanément indisponible. Réessayez dans un instant.",
          `${source}:otp`
        );
        setStatus("error");
        setFeedback(message);
        return;
      }

      const supabase = createClient();
      const { error: leadError } = await supabase.from("leads_waitlist").insert([
        {
          email: email.trim(),
          source,
          profile_type: "bailleur",
          city: "Cotonou",
        },
      ]);
      if (leadError) throw leadError;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;

      setStatus("success");
      setFeedback(`Code envoyé à ${email.trim()}. Vérifiez votre boîte de réception.`);
      window.setTimeout(() => {
        window.location.href = `/auth/verify?email=${encodeURIComponent(email.trim())}`;
      }, 800);
    } catch (error) {
      const message = handleError(
        error,
        "Impossible d'envoyer le code. Vérifiez votre email et réessayez.",
        `${source}:otp`
      );
      setStatus("error");
      setFeedback(message);
    }
  };

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div
        className={`relative flex flex-col gap-2 rounded-xl p-1.5 transition-all sm:flex-row sm:items-center ${
          dark
            ? "border border-slate-700 bg-slate-900/90 shadow-xl backdrop-blur-md focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
            : "border border-slate-200 bg-white shadow-md shadow-slate-900/5 focus-within:border-emerald-600 focus-within:ring-3 focus-within:ring-emerald-500/15"
        }`}
      >
        <div className="flex flex-1 items-center gap-2.5 px-3">
          <Mail
            size={18}
            className={`shrink-0 ${dark ? "text-slate-400" : "text-slate-400"}`}
          />
          <input
            id={inputId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Entrez votre adresse email..."
            required
            aria-describedby={feedbackId}
            className={`h-10 w-full bg-transparent text-[14.5px] font-medium outline-none ${
              dark
                ? "text-white placeholder:text-slate-400"
                : "text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 text-[13.5px] font-semibold text-white transition-all duration-200 shadow-sm cursor-pointer disabled:cursor-wait disabled:opacity-75 shrink-0"
        >
          <span>{isSubmitting ? "Envoi du code…" : isSuccess ? "Code envoyé" : buttonLabel}</span>
          {isSuccess ? (
            <CheckCircle2 aria-hidden="true" size={15} className="text-white" />
          ) : (
            <ArrowRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </div>

      <p
        id={feedbackId}
        aria-live="polite"
        className={`mt-2.5 text-center text-[11.5px] font-medium leading-relaxed sm:text-left ${
          isSuccess
            ? "text-emerald-400 font-semibold"
            : status === "error"
            ? "text-rose-400 font-semibold"
            : dark
            ? "text-slate-400"
            : "text-slate-500"
        }`}
      >
        {feedback}
      </p>
    </form>
  );
}
