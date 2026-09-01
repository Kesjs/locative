"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getErrorMessage, logError } from "@/lib/errors";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface OtpVerificationProps {
  email: string;
  length?: 6 | 8;
  onSuccess?: () => void;
  onChangeEmail?: () => void;
  onFallbackPassword?: () => void;
}

export default function OtpVerification({
  email,
  length = 6,
  onSuccess,
  onChangeEmail,
  onFallbackPassword,
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus initial sur le 1er input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Compte à rebours de 60s pour le renvoi
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Validation du code OTP (6 ou 8 chiffres)
  const verifyCode = useCallback(
    async (codeToVerify: string) => {
      const cleanToken = codeToVerify.trim();
      if (cleanToken.length < 6 || isLoading || isSuccess) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (!isSupabaseConfigured()) {
          throw new Error(
            "Configuration Supabase manquante. Contactez le support."
          );
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: cleanToken,
          type: "email",
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          throw new Error("Code incorrect ou expiré. Veuillez vérifier et réessayer.");
        }

        setIsSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
      } catch (err: any) {
        logError(err, "otp:verify");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setErrorMessage(
          getErrorMessage(err, "Code incorrect ou expiré. Veuillez vérifier et réessayer.")
        );
        // Réinitialiser les champs et refocaliser
        setDigits(Array(length).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } finally {
        setIsLoading(false);
      }
    },
    [email, isLoading, isSuccess, onSuccess, length]
  );

  // Gestion du changement dans chaque champ
  const handleChange = (index: number, val: string) => {
    // Si l'utilisateur colle ou tape une chaîne complète (ex: 6 ou 8 chiffres)
    if (val.length > 1) {
      const cleaned = val.replace(/\D/g, "").slice(0, length);
      if (cleaned.length > 0) {
        const nextDigits = [...digits];
        cleaned.split("").forEach((char, i) => {
          if (index + i < length) {
            nextDigits[index + i] = char;
          }
        });
        setDigits(nextDigits);
        const nextFocus = Math.min(index + cleaned.length, length - 1);
        inputRefs.current[nextFocus]?.focus();

        if (nextDigits.every((d) => d !== "")) {
          verifyCode(nextDigits.join(""));
        }
        return;
      }
    }

    const singleDigit = val.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = singleDigit;
    setDigits(nextDigits);

    if (singleDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-soumission dès que toutes les cases sont remplies
    if (singleDigit && index === length - 1 && nextDigits.every((d) => d !== "")) {
      verifyCode(nextDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Renvoi du code OTP
  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser: true,
          },
        });
        if (error) throw error;
      }

      setResendSuccess(true);
      setCountdown(60);
      setDigits(Array(length).fill(""));
      setTimeout(() => setResendSuccess(false), 4000);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      logError(err, "otp:resend");
      setErrorMessage(getErrorMessage(err, "Impossible de renvoyer le code. Veuillez patienter."));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Email Info & Change Button */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E8E3DC] text-[13px] shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <EnvelopeIcon className="w-4 h-4 text-[#9D6B3C] flex-shrink-0" />
          <span className="font-bold text-[#18181B] truncate">{email}</span>
        </div>
        {onChangeEmail && (
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-[12px] font-bold text-[#18181B] hover:text-[#9D6B3C] px-2 py-0.5 rounded transition-colors flex-shrink-0 ml-2 cursor-pointer"
          >
            Modifier
          </button>
        )}
      </div>

      {/* Messages Feedback */}
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#E11D48] text-[13px] font-semibold flex items-center gap-2"
          >
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0 text-[#E11D48]" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {resendSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[#15803D] text-[13px] font-semibold flex items-center gap-2"
          >
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0 text-[#15803D]" />
            <span>Un nouveau code a été envoyé avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inputs Pin Code 6 Chiffres */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[12.5px] font-bold text-[#18181B]">
            Code de sécurité ({length} chiffres)
          </label>
          <span className="text-[11px] text-[#52525B] flex items-center gap-1 font-semibold bg-[#F6EFE7]/60 border border-[#E8E3DC] px-2.5 py-0.5 rounded-full">
            <EnvelopeIcon className="w-3 h-3 text-[#9D6B3C]" />
            <span>Par Email</span>
          </span>
        </div>

        <motion.div
          animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-6 gap-2 sm:gap-2.5"
        >
          {digits.map((digit, index) => (
            <div key={index} className="relative">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={length}
                value={digit}
                disabled={isLoading || isSuccess}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-full h-12 sm:h-14 text-center text-[19px] sm:text-[22px] font-mono font-extrabold rounded-xl border transition-all duration-150 outline-none select-all ${
                  isSuccess
                    ? "bg-emerald-50 border-[#15803D] text-[#15803D]"
                    : digit
                    ? "bg-white border-[#18181B] text-[#18181B] shadow-xs ring-2 ring-[#18181B]/10"
                    : "bg-white border-[#E8E3DC] text-[#18181B] focus:border-[#9D6B3C] focus:ring-4 focus:ring-[#9D6B3C]/15 shadow-2xs"
                } disabled:opacity-75`}
              />
              {!digit && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#71717A] opacity-25 text-base">
                  •
                </span>
              )}
            </div>
          ))}
        </motion.div>

        <p className="text-[12px] text-[#71717A] text-center pt-0.5">
          Vous pouvez aussi cliquer directement sur le lien sécurisé reçu par email.
        </p>
      </div>

      {/* Bouton de validation */}
      <button
        type="button"
        onClick={() => verifyCode(digits.join(""))}
        disabled={isLoading || isSuccess || digits.some((d) => d === "")}
        className="w-full h-12 px-5 bg-[#18181B] hover:bg-[#9D6B3C] text-white text-[13.5px] font-bold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSuccess ? (
          <span className="inline-flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-white" />
            Connexion réussie...
          </span>
        ) : isLoading ? (
          <span className="inline-flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4 animate-spin text-white" />
            Vérification...
          </span>
        ) : (
          <>
            <span>Confirmer &amp; Accéder à mon espace</span>
            <ArrowRightIcon className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Actions secondaires : Renvoi */}
      <div className="pt-2 flex flex-col items-center gap-2.5 text-center border-t border-[#E8E3DC]">
        {countdown > 0 ? (
          <span className="text-[12px] text-[#71717A]">
            Renvoyer un nouveau code dans{" "}
            <strong className="text-[#18181B] font-mono">{countdown}s</strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#18181B] hover:text-[#9D6B3C] px-2 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
            <span>Renvoyer le code OTP</span>
          </button>
        )}
      </div>
    </div>
  );
}
