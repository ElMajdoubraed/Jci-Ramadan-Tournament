import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JCI Hammem Laghzez Ramadan Football Tournament - Live Scores, Fixtures & Standings",
  description: "Follow the JCI Hammem Laghzez Ramadan Football Tournament with live match results, detailed fixtures, group standings, knockout rounds, team line-ups, and goal scorers. Stay updated with real-time scores and match highlights!",
  keywords: "JCI Hammem Laghzez, Ramadan Football Tournament, Live Football Scores, Football Fixtures, Soccer Standings, Match Highlights, Knockout Rounds, Group Stage, Match Schedule, Local Football Events, Tunisia Football, Football Teams, Goal Scorers, Football Rankings",
  openGraph: {
    title: "JCI Hammem Laghzez Ramadan Football Tournament - Live Updates & Standings",
    description: "Catch every moment of the JCI Laghzez Ramadan Tournament. Live match scores, real-time updates, group standings, and knockout stages — all in one place!",
    type: "website",
    locale: "en_US",
    siteName: "JCI Laghzez Football",
    images: [
      {
        url: "/images/tournament-banner.jpg",
        width: 1200,
        height: 630,
        alt: "JCI Hammem Laghzez Football Tournament Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JCI Hammem Laghzez Ramadan Football Tournament - Live Scores & Fixtures",
    description: "Follow live scores, match updates, player stats, and standings from the JCI Laghzez Ramadan Football Tournament.",
    images: ["/images/tournament-banner.jpg"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

