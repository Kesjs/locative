"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpVerification from "@/components/auth/OtpVerification";
import { getPostAuthRedirect } from "@/lib/supabase/postAuthRedirect";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
            Vérification de votre{" "}
            <span className="font-serif italic font-normal text-emerald-700">
              identité
            </span>
          </h1>
          <p className="text-[14px] text-slate-600">
            Entrez le code de sécurité pour accéder à votre espace Lokka.
          </p>
        </div>

        {/* Composant OTP interactif */}
        <OtpVerification
          email={email}
          onSuccess={async () => {
            const redirectTo = await getPostAuthRedirect(email);
            window.location.href = redirectTo;
          }}
          onChangeEmail={() => router.push("/auth/login")}
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
