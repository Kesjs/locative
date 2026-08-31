import type { Metadata } from "next";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lokka — Gestion locative simplifiée",
  description:
    "Lokka est la plateforme de gestion locative pensée pour les propriétaires exigeants. Suivi des loyers, comptabilité, documents — tout au même endroit.",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  keywords: [
    "gestion locative",
    "propriétaire bailleur",
    "suivi des loyers",
    "quittance",
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
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
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
