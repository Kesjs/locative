"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StripeAuthLogo from "@/components/auth/StripeAuthLogo";
import { EnvelopeIcon, ArrowRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function LocataireLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulation OTP for now
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to Locataire dashboard
      router.push("/dashboard/locataire");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-[#FAF9F6]">
      {/* ========================================================================= */}
      {/* COLONNE GAUCHE : Formulaire Locataire                                     */}
      {/* ========================================================================= */}
      <div className="h-full lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10">
        <div className="flex items-center justify-between mb-12">
          <StripeAuthLogo />
          <span className="text-[11.5px] font-extrabold px-3 py-1 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full uppercase tracking-wider">
            Portail Locataire
          </span>
        </div>

        <div className="w-full max-w-[380px] mx-auto my-auto">
          <div className="mb-8 text-left">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#18181B] tracking-tight leading-tight mb-3">
              Bienvenue chez vous.
            </h1>
            <p className="text-[14px] text-[#52525B]">
              Accédez à vos quittances certifiées, payez votre loyer via MoMo et suivez vos demandes d&apos;intervention.
            </p>
          </div>

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
                  className="w-full pl-10 pr-3.5 h-12 bg-white border border-[#E8E3DC] rounded-xl text-[14px] font-medium text-[#18181B] placeholder-[#71717A] focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15 transition shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-12 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-[13.5px] font-bold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? "Vérification..." : "Accéder à mon espace"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </form>

          <p className="text-center text-[13px] text-[#52525B] mt-8 pt-4 border-t border-[#E8E3DC]">
            Besoin d&apos;aide ?{" "}
            <Link href="/" className="font-bold text-[#18181B] hover:text-emerald-700 transition-colors ml-1">
              Retour à l&apos;accueil
            </Link>
          </p>
        </div>

        <footer className="pt-6 flex flex-col items-start gap-2 text-[12px] text-[#71717A]">
          <span>© 2026 Lokka. Fait pour le Bénin 🇧🇯</span>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Visuel "Soft" Locataire                                  */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col items-center justify-center h-screen sticky top-0 relative bg-[#F0F7F4] overflow-hidden p-12">
        <div className="absolute inset-0 bg-emerald-900/5 mix-blend-multiply" />
        
        {/* Soft UI Graphic for Locataire */}
        <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-700">
              <HomeIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#18181B] text-[16px]">Loyer de Septembre 2026</h3>
              <p className="text-[13px] text-[#52525B]">Villa Les Cocotiers · Cadjehoun</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8E3DC] flex justify-between items-center">
            <span className="text-[13.5px] font-semibold text-[#52525B]">Montant à régler</span>
            <span className="text-[18px] font-extrabold text-[#18181B] tabular-nums">350 000 FCFA</span>
          </div>
          <div className="w-full py-3 bg-[#9D6B3C] text-white font-bold text-[13.5px] rounded-xl flex justify-center items-center gap-2 shadow-xs">
            Payer par MTN / Moov MoMo
          </div>
        </div>

        <div className="relative z-10 mt-10 text-center max-w-sm">
          <h2 className="text-[24px] font-extrabold text-emerald-950 mb-2 leading-tight tracking-tight">
            Votre location,<br />sans friction.
          </h2>
          <p className="text-[14px] text-emerald-800/80 font-medium">
            Lokka simplifie votre vie de locataire : quittances en 1 clic et règlements instantanés.
          </p>
        </div>
      </div>
    </div>
  );
}
