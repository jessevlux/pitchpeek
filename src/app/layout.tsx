import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PitchPeek — WK 2026",
  description:
    "Live voetbalstatistieken met radarveld, momentum-tijdlijn en poule-voorspellingen",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${geistSans.variable} h-full dark`}>
      <body className="flex min-h-full items-center justify-center bg-[#030712] antialiased">
        <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-[#030712] shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <AppProviders>{children}</AppProviders>
        </div>
      </body>
    </html>
  );
}
