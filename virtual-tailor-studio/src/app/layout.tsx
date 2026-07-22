import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

// ============================================================
// ROOT LAYOUT
// Application shell with metadata, fonts, and providers.
// ============================================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Virtual Tailor Studio | 3D Garment Customization",
  description:
    "Design and customize Indian traditional wear in real-time 3D. Premium garment visualization platform for tailoring businesses.",
  keywords: [
    "virtual tailor",
    "3D garment",
    "Indian traditional wear",
    "customization",
    "lehenga designer",
    "saree configurator",
  ],
  authors: [{ name: "Virtual Tailor Studio" }],
  openGraph: {
    title: "Virtual Tailor Studio",
    description: "3D Garment Customization Platform",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#0a0a0f] text-white antialiased font-sans selection:bg-violet-500/30 selection:text-white"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
