import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

// Brand type system — see imodoye-brand-guidelines.md §7 for rationale.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500"],
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Imodoye — A home for writers. A space for stories.",
  description:
    "Imodoye is a writers' residency, fellowship community, and publishing house working from Ilorin, Nigeria toward the wider literary world.",
  metadataBase: new URL("https://imodoye.ng"),
  openGraph: {
    title: "Imodoye",
    description: "A home for writers. A space for stories.",
    url: "https://imodoye.ng",
    siteName: "Imodoye",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="font-ui">
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
