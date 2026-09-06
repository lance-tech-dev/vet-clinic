import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { getAuthSession } from "@/lib/auth/session";
import type { NavAuthState } from "@/lib/auth/types";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vet",
  description: "Veterinary Clinic",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getAuthSession();
  const authState: NavAuthState = {
    isAuthenticated: session.isAuthenticated,
    displayName: session.profile?.full_name || session.user?.email || null,
    isAdmin: session.isAdmin,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy-900">
        <Navbar authState={authState} />
        {children}
      </body>
    </html>
  );
}
