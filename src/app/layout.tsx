import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tournoi de Football Ramadan JCI Hammem Laghzez - Scores en Direct, Calendrier et Classements",
  description: "Suivez le Tournoi de Football Ramadan JCI Hammem Laghzez avec les résultats des matchs en direct, les calendriers détaillés, les classements de groupes, les phases finales, les compositions d'équipes et les buteurs. Restez à jour avec les scores en temps réel et les moments forts des matchs !",
  keywords: "JCI Hammem Laghzez, Tournoi de Football Ramadan, Scores de Football en Direct, Calendrier de Football, Classements de Football, Moments Forts des Matchs, Phases Finales, Phase de Groupes, Programme des Matchs, Événements de Football Locaux, Football Tunisie, Équipes de Football, Buteurs, Classements de Football",
  openGraph: {
    title: "Tournoi de Football Ramadan JCI Hammem Laghzez - Mises à Jour en Direct et Classements",
    description: "Suivez chaque moment du Tournoi Ramadan JCI Laghzez. Scores de matchs en direct, mises à jour en temps réel, classements de groupes et phases finales — tout en un seul endroit !",
    type: "website",
    locale: "fr_FR",
    siteName: "Football JCI Laghzez",
    url: 'https://tournament.jci-hg.site',
    images: [
      {
        url: "jci.jpg",
        alt: "Bannière du Tournoi de Football JCI Hammem Laghzez",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tournoi de Football Ramadan JCI Hammem Laghzez - Scores en Direct et Calendrier",
    description: "Suivez les scores en direct, les mises à jour des matchs, les statistiques des joueurs et les classements du Tournoi de Football Ramadan JCI Laghzez.",
    images: ["jci.jpg"],
  },
  applicationName: "Football JCI Hammem Laghzez",
  authors: [{ name: "JCI Hammem Laghzez" }, { name: "Raed Elmajdoub" }],
  robots: "index, follow",
  viewport: 'width=device-width, initial-scale=1.0',
  referrer: 'origin',
  generator: 'Next.js',
  themeColor: '#000000',
  colorScheme: 'normal',
  verification: {
    google: 'google3f09ff634e2ebf6c',
  },
  bookmarks: []
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <h1 className="hidden">
          Tournoi de Football Ramadan JCI Hammem Laghzez - Scores en Direct, Calendrier et Classements
        </h1>
        <Suspense fallback={null}>
          <GoogleAnalytics />
          <Analytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}



