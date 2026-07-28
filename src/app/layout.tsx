import type { Metadata } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Editorial accent, italic only: used to lift a single word inside a display
 * headline. Not preloaded on purpose, it never carries above-the-fold copy.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://funestravel.com.ar"),
  title: {
    default: "Funes Travel · Agencia de viajes",
    template: "%s · Funes Travel",
  },
  description:
    "Paquetes, vuelos, hoteles y experiencias con asesoramiento humano antes, durante y después de tu viaje. Agencia de viajes en Funes, Santa Fe.",
  openGraph: {
    siteName: "Funes Travel",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${bricolage.variable} ${hanken.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
