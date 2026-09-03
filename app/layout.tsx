import type { Metadata } from "next";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lokka — Gestion locative simplifiée au Bénin",
  description:
    "Lokka est la plateforme de gestion locative pensée pour les propriétaires exigeants. Suivi des loyers MTN MoMo, quittances certifiées Loi 2022-30 et mini-sites vitrines.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.jpg", type: "image/jpeg" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  keywords: [
    "gestion locative bénin",
    "propriétaire bailleur cotonou",
    "loi 2022-30",
    "suivi des loyers momo",
    "quittance officielle bénin",
    "gestion immobilière",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: { fontSize: "13px" },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
