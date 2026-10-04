import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster, ToastProvider } from "@/components/ui/toaster";
import { AuthProvider } from "@/features/auth/auth-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Fixora — Find Trusted Professionals. Get Things Done.",
  description:
    "From home repairs to everyday tasks, discover skilled professionals and book reliable services with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <AuthProvider>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
