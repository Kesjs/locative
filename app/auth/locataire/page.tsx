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
          <span className="text-[12px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            Portail Locataire
          </span>
        </div>

        <div className="w-full max-w-[380px] mx-auto my-auto">
          <div className="mb-8 text-left">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0F172A] tracking-tight leading-tight mb-3">
              Bienvenue chez vous.
            </h1>
            <p className="text-[14px] text-[#64635F]">
              Accédez à vos quittances, payez votre loyer via MoMo et suivez vos demandes de maintenance en un seul endroit.
            </p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] text-[#0F172A] placeholder-[#9C9A95] focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-2.5 px-4 bg-[#059669] hover:bg-[#047857] text-white text-[13px] font-bold rounded-[6px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? "Vérification..." : "Accéder à mon espace"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </form>

          <p className="text-center text-[13px] text-[#64635F] mt-8 pt-4 border-t border-[#E8E5E0]">
            Problème de connexion ?{" "}
            <Link href="/contact" className="font-bold text-[#0F172A] hover:underline ml-1">
              Contacter l'agence
            </Link>
          </p>
        </div>

        <footer className="pt-6 flex flex-col items-start gap-2 text-[12px] text-[#9C9A95]">
          <span>© 2026 Lokka. Fait pour le Bénin 🇧🇯</span>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Visuel "Soft" Locataire                                  */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col items-center justify-center h-screen sticky top-0 relative bg-[#E8F3EE] overflow-hidden p-12">
        <div className="absolute inset-0 bg-emerald-900/5 mix-blend-multiply" />
        
        {/* Soft UI Graphic for Locataire */}
        <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-[24px] shadow-2xl border border-emerald-100 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <HomeIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Loyer de Septembre</h3>
              <p className="text-[13px] text-[#64635F]">Villa Les Cocotiers - Apt 2B</p>
            </div>
          </div>
          <div className="p-4 rounded-[12px] bg-[#FAF9F6] border border-[#E8E5E0] flex justify-between items-center">
            <span className="text-[14px] font-medium text-[#64635F]">Montant à régler</span>
            <span className="text-[18px] font-extrabold text-[#0F172A]">350 000 FCFA</span>
          </div>
          <button type="button" disabled className="w-full py-3 bg-[#FFCC00] text-black font-bold text-[14px] rounded-[8px] flex justify-center items-center gap-2 opacity-80 cursor-not-allowed">
            Payer avec MTN MoMo
          </button>
        </div>

        <div className="relative z-10 mt-12 text-center max-w-sm">
          <h2 className="text-[24px] font-extrabold text-[#059669] mb-3 leading-tight tracking-tight">
            Votre location,<br />sans friction.
          </h2>
          <p className="text-[14px] text-emerald-800/70 font-medium">
            Lokka simplifie votre vie de locataire. Un espace clair pour gérer vos paiements et vos documents.
          </p>
        </div>
      </div>
    </div>
  );
}
