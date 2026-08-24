"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpVerification from "@/components/auth/OtpVerification";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // État OTP
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pré-remplissage via URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) setEmail(emailParam);
      if (params.get("sent") === "true") setCodeSent(true);
      if (params.get("error") === "auth_failed") {
        setErrorMessage("La connexion a échoué ou le lien a expiré. Veuillez réessayer.");
      }
    }
  }, []);

  // 1. Envoi du Code OTP par Email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
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

      setCodeSent(true);
    } catch (err: any) {
      console.error("OTP send error:", err);
      setErrorMessage(err.message || "Erreur lors de l'envoi du code. Vérifiez votre adresse email.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Connexion par Mot de passe (Secours)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Password login error:", err);
      setErrorMessage(err.message || "Identifiants incorrects. Vérifiez votre mot de passe.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <div className="w-full">
        {/* Titre & Sous-titre éditorial */}
        <div className="mb-8 text-left">
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1C1C1C] tracking-tight leading-tight mb-2">
            Bon retour parmi{" "}
            <span className="font-serif italic font-normal text-[#64635F]">
              nous
            </span>
          </h1>
          <p className="text-[14px] text-[#64635F]">
            Accédez à vos loyers, quittances et locataires en toute simplicité.
          </p>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-[6px] bg-red-50 border border-red-200 text-[#C92A2A] text-[13px] flex items-start gap-2">
            <span className="font-bold">!</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* CAS 1 : Connexion OTP par Email (Par défaut) */}
        {!usePassword ? (
          <div>
            {!codeSent ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                    Votre adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C9A95]">
                      <EnvelopeIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.bj"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] text-[#1C1C1C] placeholder-[#9C9A95] focus:outline-none focus:border-[#1C1C1C] transition shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-2.5 px-4 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[13px] font-semibold rounded-[6px] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? "Envoi..." : "Continuer"}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUsePassword(true);
                      setErrorMessage(null);
                    }}
                    className="text-[12px] font-medium text-[#64635F] hover:text-[#1C1C1C] transition-colors"
                  >
                    Utiliser un mot de passe
                  </button>
                </div>
              </form>
            ) : (
              <OtpVerification
                email={email}
                length={6}
                onSuccess={() => {
                  window.location.href = "/dashboard";
                }}
                onChangeEmail={() => {
                  setCodeSent(false);
                }}
                onFallbackPassword={() => {
                  setUsePassword(true);
                  setCodeSent(false);
                }}
              />
            )}
          </div>
        ) : (
          /* CAS 2 : Connexion Mot de Passe */
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C9A95]">
                  <EnvelopeIcon className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] text-[#1C1C1C] placeholder-[#9C9A95] focus:outline-none focus:border-[#1C1C1C] transition shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-semibold text-[#1C1C1C]">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUsePassword(false);
                    setCodeSent(false);
                  }}
                  className="text-[12px] font-medium text-[#64635F] hover:text-[#1C1C1C] transition-colors"
                >
                  Connexion sans mot de passe
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C9A95]">
                  <LockClosedIcon className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] text-[#1C1C1C] placeholder-[#9C9A95] focus:outline-none focus:border-[#1C1C1C] transition shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9C9A95] hover:text-[#1C1C1C]"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#E8E5E0] text-[#1C1C1C] focus:ring-0 focus:outline-none cursor-pointer"
              />
              <label htmlFor="remember" className="text-[13px] text-[#64635F] cursor-pointer">
                Maintenir ma session active
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[13px] font-semibold rounded-[6px] transition shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] mt-2 disabled:opacity-60"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setUsePassword(false);
                  setErrorMessage(null);
                }}
                className="text-[12px] font-medium text-[#64635F] hover:text-[#1C1C1C] transition-colors"
              >
                ← Revenir au code par email
              </button>
            </div>
          </form>
        )}

        {/* Switch vers Inscription */}
        <p className="text-center text-[13px] text-[#64635F] mt-8 pt-4 border-t border-[#E8E5E0]">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="font-bold text-[#1C1C1C] hover:underline ml-1"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
