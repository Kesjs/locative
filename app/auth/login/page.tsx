"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpVerification from "@/components/auth/OtpVerification";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getPostAuthRedirect } from "@/lib/supabase/postAuthRedirect";
import {
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");

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
      if (!isSupabaseConfigured()) {
        throw new Error("Configuration Supabase manquante. Contactez le support.");
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setCodeSent(true);
    } catch (err: any) {
      console.error("OTP send error:", err);
      setErrorMessage(err.message || "Erreur lors de l'envoi du code. Vérifiez votre adresse email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <div className="w-full">
        {/* Titre & Sous-titre éditorial */}
        <div className="mb-8 text-left">
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1C1C1C] tracking-tight leading-tight mb-2">
            Bon retour sur{" "}
            <span className="font-serif italic font-normal text-[#1C1C1C]">
              Lokka
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

        {/* Connexion OTP par Email */}
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
                className="w-full py-2.5 px-4 bg-[#1C1C1C] hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0] border border-transparent text-white text-[13px] font-semibold rounded-[6px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? "Envoi..." : "Continuer"}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <OtpVerification
              email={email}
              length={6}
              onSuccess={async () => {
                const redirectTo = await getPostAuthRedirect(email);
                window.location.href = redirectTo;
              }}
              onChangeEmail={() => {
                setCodeSent(false);
              }}
            />
          )}
        </div>

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
