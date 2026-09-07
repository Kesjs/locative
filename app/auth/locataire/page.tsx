"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import StripeAuthLogo from "@/components/auth/StripeAuthLogo";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import OtpVerification from "@/components/auth/OtpVerification";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { EnvelopeIcon, ArrowRightIcon, HomeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

function LocataireLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Connexion directe par mot de passe (Reçu dans l'email d'invitation)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Configuration Supabase manquante.");
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          throw new Error("Adresse email ou mot de passe incorrect. Veuillez vérifier les identifiants reçus par courriel.");
        }
        if (error.message.toLowerCase().includes("email not confirmed")) {
          throw new Error("Votre compte n'a pas encore été activé. Veuillez vérifier votre boîte de réception.");
        }
        throw error;
      }

      if (data?.user) {
        // Le rôle locataire est déterminé par profiles.role en base, pas par le localStorage.
        router.push("/locataire");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion. Veuillez vérifier vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion par code magique (OTP)
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Configuration Supabase manquante.");
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/auth/callback" : undefined,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setCodeSent(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de l'envoi du code. Vérifiez votre adresse email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto my-auto">
      <div className="mb-6 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
          Bienvenue chez vous.
        </h1>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          Accédez à vos quittances certifiées, réglez votre loyer par MoMo et suivez votre bail.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px] font-medium flex items-start gap-2 animate-in fade-in">
          <span className="font-bold shrink-0 mt-0.5">!</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Onglets de sélection du mode de connexion */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/70 rounded-xl mb-4 text-[12.5px] font-bold">
        <button
          type="button"
          onClick={() => {
            setAuthMode("password");
            setErrorMessage(null);
          }}
          className={cn(
            "py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
            authMode === "password"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <LockClosedIcon className="w-3.5 h-3.5" />
          <span>Mot de passe</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode("otp");
            setErrorMessage(null);
          }}
          className={cn(
            "py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
            authMode === "otp"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Code temporaire</span>
        </button>
      </div>

      {authMode === "password" ? (
        /* Formulaire A : Mot de passe reçu par courriel */
        <form onSubmit={handlePasswordLogin} className="space-y-3.5">
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12.5px] font-semibold text-slate-900">
                Mot de passe (ou mot de passe provisoire)
              </label>
              <button
                type="button"
                onClick={() => setAuthMode("otp")}
                className="text-[11.5px] font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Code oublié ?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                <LockClosedIcon className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 h-12 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-12 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[13.5px] font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? "Vérification en cours..." : "Se connecter à mon espace"}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>
      ) : !codeSent ? (
        /* Formulaire B : Demande de code OTP */
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
            className="w-full h-12 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[13.5px] font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? "Envoi du code..." : "Recevoir mon code d'accès"}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <OtpVerification
          email={email}
          length={6}
          onSuccess={() => {
            router.push("/locataire");
          }}
          onChangeEmail={() => setCodeSent(false)}
        />
      )}

      {/* Séparateur Google */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-200/80 w-full" />
        <span className="bg-[#F8FAF9] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
          ou
        </span>
        <div className="border-t border-slate-200/80 w-full" />
      </div>

      <GoogleAuthButton label="Accéder avec Google" />

      <p className="text-center text-[13px] text-slate-500 mt-7 pt-4 border-t border-slate-200/80">
        Besoin d&apos;aide ?{" "}
        <Link href="/" className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors ml-1">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}

export default function LocataireLoginPage() {
  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAF9]">
      {/* COLONNE GAUCHE : Formulaire Locataire */}
      <div className="h-full lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10">
        <div className="flex items-center justify-between mb-8">
          <StripeAuthLogo />
          <span className="text-[11.5px] font-bold px-3 py-1 bg-emerald-100/70 text-emerald-800 border border-emerald-200/60 rounded-full uppercase tracking-wider">
            Portail Locataire
          </span>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-400">Chargement du portail...</div>}>
          <LocataireLoginForm />
        </Suspense>

        <footer className="pt-6 flex flex-col items-start gap-2 text-[12px] text-slate-500">
          <span>© 2026 Lokka. Fait pour le Bénin 🇧🇯 · Loi n° 2022-30</span>
        </footer>
      </div>

      {/* COLONNE DROITE : Visuel Locataire */}
      <div className="hidden lg:flex flex-col items-center justify-center h-screen sticky top-0 relative bg-emerald-950/20 overflow-hidden p-12">
        <div className="absolute inset-0 bg-emerald-900/5 mix-blend-multiply" />

        <div className="relative z-10 w-full max-w-md bg-white p-7 rounded-3xl shadow-xl border border-emerald-100 flex flex-col gap-5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
              <HomeIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-[15.5px]">Loyer de Septembre 2026</h3>
              <p className="text-[12.5px] text-slate-500">Villa Les Cocotiers · Cadjehoun</p>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
            <span className="text-[13px] font-medium text-slate-600">Montant à régler</span>
            <span className="text-[17px] font-bold text-slate-900 tabular-nums">150 000 FCFA</span>
          </div>
          <div className="w-full py-2.5 bg-emerald-600 text-white font-semibold text-[13px] rounded-xl flex justify-center items-center gap-2 shadow-xs">
            Payer par MTN / Moov MoMo
          </div>
        </div>

        <div className="relative z-10 mt-8 text-center max-w-sm">
          <h2 className="text-[22px] font-bold text-slate-900 mb-1.5 leading-tight tracking-tight">
            Votre location,<br />sans friction.
          </h2>
          <p className="text-[13.5px] text-slate-600 font-normal">
            Lokka simplifie votre vie de locataire : quittances officielles en 1 clic et règlements instantanés.
          </p>
        </div>
      </div>
    </div>
  );
}
