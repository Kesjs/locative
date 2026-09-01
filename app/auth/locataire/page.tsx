"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StripeAuthLogo from "@/components/auth/StripeAuthLogo";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { EnvelopeIcon, ArrowRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function LocataireLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/locataire");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAF9]">
      {/* ========================================================================= */}
      {/* COLONNE GAUCHE : Formulaire Locataire                                     */}
      {/* ========================================================================= */}
      <div className="h-full lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10">
        <div className="flex items-center justify-between mb-8">
          <StripeAuthLogo />
          <span className="text-[11.5px] font-bold px-3 py-1 bg-emerald-100/70 text-emerald-800 border border-emerald-200/60 rounded-full uppercase tracking-wider">
            Portail Locataire
          </span>
        </div>

        <div className="w-full max-w-[380px] mx-auto my-auto">
          <div className="mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
              Bienvenue chez vous.
            </h1>
            <p className="text-[14px] text-slate-600">
              Accédez à vos quittances certifiées, payez votre loyer via MoMo et suivez vos demandes d&apos;intervention.
            </p>
          </div>

          <div className="space-y-4">
            <GoogleAuthButton label="Accéder avec Google" />

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200/80 w-full" />
              <span className="bg-[#F8FAF9] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                ou avec votre email
              </span>
              <div className="border-t border-slate-200/80 w-full" />
            </div>

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
                {isLoading ? "Vérification..." : "Accéder à mon espace"}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <p className="text-center text-[13px] text-slate-500 mt-7 pt-4 border-t border-slate-200/80">
            Besoin d&apos;aide ?{" "}
            <Link href="/" className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors ml-1">
              Retour à l&apos;accueil
            </Link>
          </p>
        </div>

        <footer className="pt-6 flex flex-col items-start gap-2 text-[12px] text-slate-500">
          <span>© 2026 Lokka. Fait pour le Bénin 🇧🇯</span>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Visuel "Soft" Locataire                                  */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col items-center justify-center h-screen sticky top-0 relative bg-emerald-950/20 overflow-hidden p-12">
        <div className="absolute inset-0 bg-emerald-900/5 mix-blend-multiply" />
        
        {/* Soft UI Graphic for Locataire */}
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
            <span className="text-[17px] font-bold text-slate-900 tabular-nums">350 000 FCFA</span>
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
            Lokka simplifie votre vie de locataire : quittances en 1 clic et règlements instantanés.
          </p>
        </div>
      </div>
    </div>
  );
}
