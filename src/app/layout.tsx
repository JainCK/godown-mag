import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./design.css";
import "./fonts.css";
import { AppShell } from "../components/AppShell";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Smart Ledger & Operations Tracker",
  description: "Modern, fast, and minimal ledger for daily godown operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex h-full bg-background overflow-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

