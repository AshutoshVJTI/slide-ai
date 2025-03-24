export const dynamic = 'force-dynamic';

import { ThemeProvider } from "@/provider/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import { ClientOnlyToaster } from "@/components/client-only-toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shared Presentation",
  description: "View a shared presentation",
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <ClientOnlyToaster />
        </ThemeProvider>
      </body>
    </html>
  );
} 