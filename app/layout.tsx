import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { PublicNavbarWrapper } from "@/components/navbar/public-navbar-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VetClinic - FurBabies & Friends",
  description: "Comprehensive veterinary care and pet management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} antialiased min-h-full bg-slate-50 text-navy-900 flex flex-col`}>
        <PublicNavbarWrapper>
          <Navbar />
        </PublicNavbarWrapper>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}