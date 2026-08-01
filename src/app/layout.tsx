import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AUTHOR } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const kufi = Noto_Kufi_Arabic({ variable: "--font-kufi", subsets: ["arabic"], display: "swap" });

const title = "Tirage LP1 — Calendrier Ligue 1 Tunisie 2026/2027";
const description =
  "Générez en moins de 50 ms un calendrier complet, équilibré et sans conflit pour la Ligue Professionnelle 1 tunisienne 2026-2027. Tout est calculé dans votre navigateur, la graine est publique, le tirage est reproductible par n'importe qui.";

/**
 * Base absolue des URLs de partage (image OG, canonique).
 * Vercel fournit le domaine de production automatiquement ; en local on retombe
 * sur localhost. Définir NEXT_PUBLIC_SITE_URL pour forcer un domaine personnalisé.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  applicationName: "Tirage LP1",
  keywords: [
    "Ligue 1 Tunisie",
    "calendrier Ligue 1 2026 2027",
    "tirage au sort",
    "LNFP",
    "FTF",
    "Ligue Professionnelle 1",
    "الرابطة المحترفة الأولى",
    "رزنامة",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "fr_TN",
    siteName: "Tirage LP1",
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  authors: [{ name: AUTHOR.name, url: AUTHOR.github }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
};

export const viewport: Viewport = {
  themeColor: "#f4f6fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${kufi.variable} h-full antialiased`}
    >
      <body className="aura relative flex min-h-full flex-col">
        {children}
        {/* Mesure d'audience Vercel : aucun cookie, aucune donnée personnelle.
            Le script n'est injecté qu'en production, pas en développement. */}
        <Analytics />
      </body>
    </html>
  );
}
