import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toast";
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
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem('lokka_pref_theme')||'dark';
              var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
              var r=t==='system'?(d?'dark':'light'):t;
              var e=document.documentElement;
              e.classList.remove('light','dark');
              e.classList.add(r);
              e.style.colorScheme=r;

              var c=localStorage.getItem('lokka_pref_color')||'#F59E0B';
              var clean=c.replace('#','');
              var rgbNum=parseInt(clean,16);
              var red=(rgbNum>>16)&255, green=(rgbNum>>8)&255, blue=rgbNum&255;
              var lum=0.299*red + 0.587*green + 0.114*blue;
              var fg=lum>145?'#000000':'#FFFFFF';
              e.style.setProperty('--primary', c);
              e.style.setProperty('--brand-accent', c);
              e.style.setProperty('--primary-foreground', fg);
              e.style.setProperty('--primary-subtle', 'rgba('+red+','+green+','+blue+',0.14)');
              e.style.setProperty('--primary-border', 'rgba('+red+','+green+','+blue+',0.28)');
              e.style.setProperty('--ring', c);
            }catch(err){}})();`,
          }}
        />
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
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
