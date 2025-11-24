import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PageTransition } from "@/components/page-transition";
import { GlobalButtonStyles } from "@/components/global-styles";
import { SidebarProvider } from "@/components/sidebar-context";

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
          <SidebarProvider>
            <div className="relative min-h-screen overflow-x-hidden bg-[#0b0a0f] text-white">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#19080b] via-[#0b0a0f] to-[#16171d]" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.25),_transparent_55%)]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle_at_bottom,_rgba(120,113,108,0.2),_transparent_50%)]" />
                <div
                  className="absolute inset-0 opacity-[0.04] mix-blend-screen"
                  style={{
                    backgroundImage: `linear-gradient(125deg, rgba(255,255,255,0.04) 0%, transparent 40%), linear-gradient(300deg, rgba(255,255,255,0.025) 0%, transparent 50%)`,
                  }}
                />
              </div>

              <PageTransition>{children}</PageTransition>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}

