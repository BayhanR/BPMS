import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PageTransition } from "@/components/page-transition";
import { GlobalButtonStyles } from "@/components/global-styles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bayhan Project Management System",
  description: "Ultra premium project management SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <GlobalButtonStyles />
        <Providers>
          <div className="relative min-h-screen overflow-hidden">
            {/* Global Glassmorphism Background */}
            <div className="fixed inset-0 -z-10">
              {/* Gradient Base */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]" />
              
              {/* Animated Orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
              
              {/* Mesh Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-indigo-500/10" />
              
              {/* Noise Texture */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </Providers>
      </body>
    </html>
  );
}

