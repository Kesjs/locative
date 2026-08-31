"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
    setFeedback("Un code de connexion va être envoyé à cette adresse.");

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
    <form onSubmit={handleSubmit} className={`landing-email-form ${dark ? "landing-email-form-dark" : ""} ${className}`}>
      <label htmlFor={inputId} className="mb-2 block text-[12px] font-semibold">
        Adresse email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Votre adresse email"
          required
          aria-describedby={feedbackId}
          className="min-h-[46px] min-w-0 flex-1 rounded-sm border border-border-strong bg-white px-3.5 text-[14px] text-text-primary outline-none placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-sm bg-brand-primary px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-75"
        >
          {isSubmitting ? "Envoi du code…" : isSuccess ? "Code envoyé" : buttonLabel}
          {isSuccess ? <CheckCircle2 aria-hidden="true" size={16} /> : <ArrowRight aria-hidden="true" size={16} />}
        </button>
      </div>
      <p
        id={feedbackId}
        aria-live="polite"
        className={`mt-3 text-[12px] leading-relaxed ${isSuccess ? "text-success-strong" : status === "error" ? "text-danger" : dark ? "text-white/60" : "text-text-muted"}`}
      >
        {feedback}
      </p>
    </form>
  );
}
