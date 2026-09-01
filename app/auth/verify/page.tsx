"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpVerification from "@/components/auth/OtpVerification";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Rediriger vers login si pas d'email fourni
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  if (!email) {
    return null;
  }

  return (
    <AuthLayout mode="login">
      <div className="w-full">
        {/* Titre & Sous-titre éditorial */}
        <div className="mb-6 text-left">
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0F172A] tracking-tight leading-tight mb-2">
            Vérification de votre{" "}
            <span className="font-serif italic font-normal text-[#0F172A]">
              identité
            </span>
          </h1>
          <p className="text-[14px] text-[#64635F]">
            Entrez le code de sécurité pour accéder à votre espace Lokka.
          </p>
        </div>

        {/* Composant OTP interactif */}
        <OtpVerification
          email={email}
          onSuccess={() => router.push("/dashboard")}
          onChangeEmail={() => router.push("/auth/login")}
          onFallbackPassword={() => router.push(`/auth/login?email=${encodeURIComponent(email)}`)}
        />
      </div>
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
