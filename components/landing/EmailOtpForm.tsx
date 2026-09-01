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
        className={`relative flex flex-col gap-2 rounded-xl p-2 transition-all sm:flex-row sm:items-center ${
          dark
            ? "border border-white/20 bg-zinc-900/90 shadow-xl backdrop-blur-md focus-within:border-[#9D6B3C] focus-within:ring-2 focus-within:ring-[#9D6B3C]/30"
            : "border-2 border-[#18181B] bg-white shadow-[0_12px_36px_rgba(24,24,27,0.08)] focus-within:border-[#9D6B3C] focus-within:ring-4 focus-within:ring-[#9D6B3C]/15"
        }`}
      >
        <div className="flex flex-1 items-center gap-3 px-3">
          <Mail
            size={20}
            className={`shrink-0 ${dark ? "text-white/70" : "text-[#18181B]"}`}
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
            className={`h-11 w-full bg-transparent text-[15px] font-semibold outline-none ${
              dark
                ? "text-white placeholder:text-white/50"
                : "text-[#18181B] placeholder:text-[#71717A]"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-bold text-white transition-all duration-200 shadow-md cursor-pointer disabled:cursor-wait disabled:opacity-75 ${
            dark
              ? "bg-[#9D6B3C] hover:bg-[#85572E]"
              : "bg-[#18181B] hover:bg-[#9D6B3C]"
          }`}
        >
          <span>{isSubmitting ? "Envoi du code…" : isSuccess ? "Code envoyé" : buttonLabel}</span>
          {isSuccess ? (
            <CheckCircle2 aria-hidden="true" size={16} className="text-white" />
          ) : (
            <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </div>

      <p
        id={feedbackId}
        aria-live="polite"
        className={`mt-2.5 text-center text-[12px] font-medium leading-relaxed sm:text-left ${
          isSuccess
            ? "text-[#15803D] font-bold"
            : status === "error"
            ? "text-[#E11D48] font-bold"
            : dark
            ? "text-white/70"
            : "text-[#52525B]"
        }`}
      >
        {feedback}
      </p>
    </form>
  );
}
