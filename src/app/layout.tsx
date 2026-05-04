import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ClientInit } from "@/components/ClientInit";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CuraClinic - Clinic Management System",
  description: "Simple system for managing appointments, patient flow, and daily operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} h-full antialiased`}>
      <body className="min-h-full flex font-sans bg-background">
        <ClientInit />
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
