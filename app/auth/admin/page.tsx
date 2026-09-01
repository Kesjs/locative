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
          <span className="text-[11.5px] font-extrabold px-3 py-1 bg-[#18181B] text-white rounded-full uppercase tracking-wider">
            Supervision Lokka
          </span>
        </div>

        <div className="w-full max-w-[380px] mx-auto my-auto">
          <div className="mb-8 text-left">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#18181B] tracking-tight leading-tight mb-3">
              Lokka HQ
            </h1>
            <p className="text-[14px] text-[#52525B]">
              Accès restreint aux administrateurs. Centre de contrôle pour la gestion globale de la plateforme.
            </p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-bold text-[#18181B] mb-1.5">
                Adresse email administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <EnvelopeIcon className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@lokka.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 h-12 bg-white border border-[#E8E3DC] rounded-xl text-[14px] font-medium text-[#18181B] placeholder-[#71717A] focus:outline-none focus:border-[#9D6B3C] focus:ring-4 focus:ring-[#9D6B3C]/15 transition shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-12 px-4 bg-[#18181B] hover:bg-[#9D6B3C] text-white text-[13.5px] font-bold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? "Authentification..." : "Accéder au HQ"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </form>

          <p className="text-center text-[12px] text-[#71717A] mt-8 pt-4 border-t border-[#E8E3DC]">
            Veuillez utiliser un terminal autorisé.
          </p>
        </div>

        <footer className="pt-6 flex flex-col items-start gap-2 text-[12px] text-[#71717A]">
          <span>© 2026 Lokka. Supervision interne.</span>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Visuel "Tech/Sécurité" Admin                             */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col items-center justify-center h-screen sticky top-0 relative bg-[#18181B] overflow-hidden p-12">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        
        {/* Soft UI Graphic for Admin */}
        <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/15 flex flex-col gap-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheckIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-[15px]">Système Sécurisé</h3>
                <p className="text-[12px] text-white/70">Réseau Postgres &amp; MoMo en direct</p>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-full">
              ONLINE
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-[11px] text-white/70 mb-1">Comptes Actifs</div>
              <div className="text-[20px] font-extrabold text-white tabular-nums">4 289</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-[11px] text-white/70 mb-1">Volume Mensuel</div>
              <div className="text-[20px] font-extrabold text-white tabular-nums">124.5M</div>
            </div>
          </div>

          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-emerald-400 rounded-full" />
          </div>
        </div>

        <div className="relative z-10 mt-10 text-center max-w-sm">
          <h2 className="text-[24px] font-extrabold text-white mb-2 leading-tight tracking-tight">
            Tour de Contrôle Lokka
          </h2>
          <p className="text-[14px] text-white/75 font-medium">
            Supervisez la conformité, surveillez les flux financiers et validez les comptes agences.
          </p>
        </div>
      </div>
    </div>
  );
}
