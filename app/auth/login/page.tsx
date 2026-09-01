"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpVerification from "@/components/auth/OtpVerification";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
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
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
            Bon retour sur{" "}
            <span className="font-serif italic font-normal text-emerald-700">
              Lokka
            </span>
          </h1>
          <p className="text-[14px] text-slate-600">
            Accédez à vos loyers, quittances et locataires en toute simplicité.
          </p>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[13px] font-medium flex items-start gap-2">
            <span className="font-bold">!</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Connexion OTP par Email ou Google */}
        <div>
          {!codeSent ? (
            <div className="space-y-4">
              {/* Google Social Login */}
              <GoogleAuthButton
                label="Continuer avec Google"
                onError={(msg) => setErrorMessage(msg)}
              />

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200/80 w-full" />
                <span className="bg-[#F8FAF9] px-3 text-[11.5px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                  ou avec votre email
                </span>
                <div className="border-t border-slate-200/80 w-full" />
              </div>

              {/* Email Form avec champs Émeraude */}
              <form onSubmit={handleSendCode} className="space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-900 mb-1.5">
                    Votre adresse email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <EnvelopeIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.bj"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 h-12 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-12 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[13.5px] font-semibold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? "Envoi du code..." : "Continuer avec un code OTP"}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
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
        <p className="text-center text-[13px] text-slate-500 mt-7 pt-4 border-t border-slate-200/80">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors ml-1"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
