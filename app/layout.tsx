import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PageTransition } from "@/components/page-transition";
import { GlobalButtonStyles } from "@/components/global-styles";
import { SidebarProvider } from "@/components/sidebar-context";
import { ProjectProvider } from "@/components/project-context";

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
      <body className={`${inter.className} min-h-screen`}>
        <GlobalButtonStyles />
        <Providers>
          <SidebarProvider>
            <ProjectProvider>
              <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
                <div className="pointer-events-none fixed inset-0 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(circle_at_top,_rgba(255,30,86,0.35),_transparent_60%)] blur-2xl" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle_at_bottom,_rgba(255,0,110,0.18),_transparent_55%)]" />
                  <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-screen"
                    style={{
                      backgroundImage: `linear-gradient(125deg, rgba(255,255,255,0.05) 0%, transparent 40%), linear-gradient(300deg, rgba(255,30,86,0.12) 0%, transparent 55%)`,
                    }}
                  />
                </div>

                <PageTransition>{children}</PageTransition>
              </div>
            </ProjectProvider>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}

