import type { Metadata } from "next";
import { Geist, Geist_Mono, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const blackletter = UnifrakturMaguntia({
  variable: "--font-blackletter",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spellbook",
  description: "Browse potion recipes and brew them in the cauldron.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${blackletter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
