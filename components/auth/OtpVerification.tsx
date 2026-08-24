"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
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
        if (isSupabaseConfigured()) {
          const supabase = createClient();
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: cleanToken,
            type: "email",
          });

          if (error) {
            throw error;
          }

          if (data.session) {
            setIsSuccess(true);
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                window.location.href = "/dashboard";
              }
            }, 800);
            return;
          }
        }

        // Mode prototype local
        setIsSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
      } catch (err: any) {
        console.error("Erreur vérification OTP:", err);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setErrorMessage(
          err.message || "Code incorrect ou expiré. Veuillez vérifier et réessayer."
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

  // Gestion des touches du clavier
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

  // Gestion du Paste global (support 6 et 8 chiffres)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteData) return;

    const targetLength = pasteData.length === 6 ? 6 : length;
    const nextDigits = Array(length).fill("");
    pasteData.slice(0, length).split("").forEach((char, i) => {
      if (i < length) nextDigits[i] = char;
    });
    setDigits(nextDigits);

    if (pasteData.length >= targetLength) {
      verifyCode(pasteData.slice(0, targetLength));
    } else {
      const focusIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Renvoyer un code OTP
  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    setResending(true);
    setErrorMessage(null);
    setResendSuccess(false);

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

      setCountdown(60);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 4000);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error("Erreur renvoi OTP:", err);
      setErrorMessage(err.message || "Impossible de renvoyer le code pour le moment.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Badge statut email */}
      <div className="flex items-center justify-between p-3.5 bg-white border border-[#E8E5E0] rounded-[8px] shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] flex items-center justify-center flex-shrink-0">
            <EnvelopeIcon className="w-4 h-4 text-[#1C1C1C]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-[#9C9A95] uppercase tracking-wider">
              Code envoyé à
            </div>
            <div className="text-[13px] font-bold text-[#1C1C1C] truncate">
              {email}
            </div>
          </div>
        </div>

        {onChangeEmail && (
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-[12px] font-semibold text-[#64635F] hover:text-[#1C1C1C] hover:underline px-2 py-1 flex-shrink-0 transition-colors"
          >
            Modifier
          </button>
        )}
      </div>

      {/* Messages d'erreur et de succès */}
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-[6px] bg-red-50 border border-red-200 text-[#C92A2A] text-[13px] flex items-start gap-2"
          >
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {resendSuccess && !errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-[6px] bg-[#E6F5EF] border border-[#087F5B]/30 text-[#087F5B] text-[13px] flex items-center gap-2"
          >
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span>Un nouveau code a été envoyé avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone des carrés OTP (8 chiffres) */}
      <div onPaste={handlePaste} className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-[#1C1C1C]">
            Saisissez le code de sécurité ({length} chiffres)
          </label>
          <span className="text-[11px] text-[#9C9A95] flex items-center gap-1">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#087F5B]" />
            Resend SMTP
          </span>
        </div>

        <motion.div
          animate={
            isShaking
              ? {
                  x: [-8, 8, -6, 6, -3, 3, 0],
                  transition: { duration: 0.4 },
                }
              : {}
          }
          className={`grid gap-1.5 sm:gap-2 ${length === 8 ? "grid-cols-8" : "grid-cols-6"}`}
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
                className={`w-full h-11 sm:h-13 text-center text-[18px] sm:text-[20px] font-mono font-bold rounded-[6px] sm:rounded-[8px] border transition-all duration-150 outline-none select-all ${
                  isSuccess
                    ? "bg-[#E6F5EF] border-[#087F5B] text-[#087F5B]"
                    : digit
                    ? "bg-white border-[#1C1C1C] text-[#1C1C1C] shadow-xs ring-1 ring-[#1C1C1C]/10"
                    : "bg-white border-[#E8E5E0] text-[#1C1C1C] focus:border-[#1C1C1C] focus:ring-2 focus:ring-[#1C1C1C]/5 shadow-xs"
                } disabled:opacity-75`}
              />
              {!digit && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#9C9A95] opacity-30 text-base">
                  •
                </span>
              )}
            </div>
          ))}
        </motion.div>

        <p className="text-[12px] text-[#9C9A95] text-center pt-0.5">
          Vous pouvez aussi cliquer directement sur le bouton dans votre email.
        </p>
      </div>

      {/* Bouton de validation (Primary - Deep Black) */}
      <button
        type="button"
        onClick={() => verifyCode(digits.join(""))}
        disabled={isLoading || isSuccess || digits.some((d) => d === "")}
        className="w-full py-3 px-4 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[13px] font-semibold rounded-[8px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSuccess ? (
          <span className="inline-flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-[#51CF66]" />
            Succès...
          </span>
        ) : isLoading ? (
          <span className="inline-flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            Vérification...
          </span>
        ) : (
          <>
            <span>Continuer</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      {/* Actions secondaires : Renvoi et secours mot de passe */}
      <div className="pt-2 flex flex-col items-center gap-2.5 text-center border-t border-[#F0EDE8]">
        {countdown > 0 ? (
          <span className="text-[12px] text-[#9C9A95]">
            Renvoyer dans{" "}
            <strong className="text-[#1C1C1C] font-mono">{countdown}s</strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1C1C1C] hover:text-[#087F5B] transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
            <span>Renvoyer le code</span>
          </button>
        )}

        {onFallbackPassword && (
          <button
            type="button"
            onClick={onFallbackPassword}
            className="text-[12px] font-medium text-[#64635F] hover:text-[#1C1C1C] hover:underline transition-colors"
          >
            Utiliser un mot de passe
          </button>
        )}
      </div>
    </div>
  );
}
