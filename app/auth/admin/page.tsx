"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StripeAuthLogo from "@/components/auth/StripeAuthLogo";
import { EnvelopeIcon, ArrowRightIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function AdminLoginPage() {
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
      // Redirect to Admin dashboard
      router.push("/dashboard/admin");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-[#FAF9F6]">
      {/* ========================================================================= */}
      {/* COLONNE GAUCHE : Formulaire Admin                                         */}
      {/* ========================================================================= */}
      <div className="h-full lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10">
        <div className="flex items-center justify-between mb-12">
          <StripeAuthLogo />
          <span className="text-[12px] font-bold px-3 py-1 bg-[#0F172A] text-white rounded-full">
            Admin Portal
          </span>
        </div>

        <div className="w-full max-w-[380px] mx-auto my-auto">
          <div className="mb-8 text-left">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0F172A] tracking-tight leading-tight mb-3">
              Lokka HQ
            </h1>
            <p className="text-[14px] text-[#64635F]">
              Accès restreint. Centre de contrôle pour la gestion des Bailleurs, Agences et des transactions de la plateforme.
            </p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#0F172A] mb-1.5">
                Adresse email administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C9A95]">
                  <EnvelopeIcon className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@lokka.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] text-[#0F172A] placeholder-[#9C9A95] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-2.5 px-4 bg-[#0F172A] hover:bg-black text-white text-[13px] font-bold rounded-[6px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? "Authentification..." : "Accéder au HQ"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </form>

          <p className="text-center text-[12px] text-[#9C9A95] mt-8 pt-4 border-t border-[#E8E5E0]">
            Veuillez utiliser un appareil sécurisé.
          </p>
        </div>

        <footer className="pt-6 flex flex-col items-start gap-2 text-[12px] text-[#9C9A95]">
          <span>© 2026 Lokka. Internal Use Only.</span>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Visuel "Tech/Sécurité" Admin                             */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col items-center justify-center h-screen sticky top-0 relative bg-[#0F172A] overflow-hidden p-12">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        
        {/* Soft UI Graphic for Admin */}
        <div className="relative z-10 w-full max-w-md bg-[#334155] p-8 rounded-[24px] shadow-2xl border border-[#334155] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheckIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-[15px]">Système Sécurisé</h3>
                <p className="text-[12px] text-[#A1A1AA]">Réseau surveillé en temps réel</p>
              </div>
            </div>
            <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded">
              ONLINE
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-[12px] bg-[#0F172A] border border-[#334155]">
              <div className="text-[11px] text-[#A1A1AA] mb-1">Total Utilisateurs</div>
              <div className="text-[18px] font-bold text-white">4,289</div>
            </div>
            <div className="p-3 rounded-[12px] bg-[#0F172A] border border-[#334155]">
              <div className="text-[11px] text-[#A1A1AA] mb-1">Volume Mensuel</div>
              <div className="text-[18px] font-bold text-white">124.5M</div>
            </div>
          </div>

          <div className="w-full h-1.5 bg-[#334155] rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-blue-500 rounded-full" />
          </div>
        </div>

        <div className="relative z-10 mt-12 text-center max-w-sm">
          <h2 className="text-[24px] font-extrabold text-white mb-3 leading-tight tracking-tight">
            Tour de Contrôle.
          </h2>
          <p className="text-[14px] text-[#A1A1AA] font-medium">
            Supervisez l'intégralité de la plateforme, validez les comptes et suivez les métriques clés de Lokka.
          </p>
        </div>
      </div>
    </div>
  );
}
