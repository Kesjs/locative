"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpVerification from "@/components/auth/OtpVerification";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getPostAuthRedirect } from "@/lib/supabase/postAuthRedirect";
import { getErrorMessage, logError } from "@/lib/errors";
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
      logError(err, "login:sendCode");
      setErrorMessage(
        getErrorMessage(err, "Erreur lors de l'envoi du code. Vérifiez votre adresse email.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <div className="w-full">
        {/* Titre & Sous-titre éditorial */}
        <div className="mb-8 text-left">
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#18181B] tracking-tight leading-tight mb-2">
            Bon retour sur{" "}
            <span className="font-serif italic font-normal text-[#18181B]">
              Lokka
            </span>
          </h1>
          <p className="text-[14px] text-[#52525B]">
            Accédez à vos loyers, quittances et locataires en toute simplicité.
          </p>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-[#E11D48] text-[13px] font-semibold flex items-start gap-2">
            <span className="font-bold">!</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Connexion OTP par Email */}
        <div>
          {!codeSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-bold text-[#18181B] mb-1.5">
                  Votre adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                    <EnvelopeIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="nom@exemple.bj"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 h-12 bg-white border border-[#E8E3DC] rounded-xl text-[14px] font-medium text-[#18181B] placeholder-[#71717A] focus:outline-none focus:border-[#9D6B3C] focus:ring-4 focus:ring-[#9D6B3C]/15 transition shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-12 px-4 bg-[#18181B] hover:bg-[#9D6B3C] border border-transparent text-white text-[13.5px] font-bold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? "Envoi du code..." : "Continuer"}
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
        <p className="text-center text-[13px] text-[#52525B] mt-8 pt-4 border-t border-[#E8E3DC]">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="font-bold text-[#18181B] hover:text-[#9D6B3C] transition-colors ml-1"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
