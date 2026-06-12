import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Het Tactische Momentum — WK 2026",
  description:
    "Live voetbalstatistieken met radarveld, momentum-tijdlijn en poule-voorspellingen",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${geistSans.variable} h-full`}>
      <body className="flex min-h-full items-center justify-center bg-slate-950 antialiased">
        <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-slate-950 shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
