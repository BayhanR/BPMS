"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import {
  FolderKanban,
  Activity,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useSWR from "swr";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Sadece mevcut sayfalar
const projectSidebarItems = [
  { icon: FolderKanban, label: "Kanban Board", href: "/board" },
  { icon: Activity, label: "Aktivite", href: "/activity" },
];

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.id as string;
  const { sidebarWidth } = useSidebarContext();
  
  // Proje bilgisini çek
  const { data: project } = useSWR(
    projectId ? `/api/projects?id=${projectId}` : null,
    fetcher
  );

  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  // Proje adını al
  const projectName = project?.name || `Proje #${projectId.slice(0, 8)}`;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={contentStyle}>
        <Topbar />
        <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
          {/* Project Sidebar - Sadeleştirilmiş */}
          <motion.aside
            className={cn(
              "w-full md:w-56 border-r border-white/10 border-b md:border-b-0",
              "bg-white/5 backdrop-blur-2xl",
              "flex flex-col",
              "transition-all duration-300",
              "md:h-full h-auto max-h-48 md:max-h-none overflow-y-auto"
            )}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <Link href="/projects">
                <motion.div
                  className="flex items-center gap-2 mb-3 text-white/60 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: -4 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Projelere Dön</span>
                </motion.div>
              </Link>
              <h2 className="text-lg font-bold text-white truncate" title={projectName}>
                {projectName}
              </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
              {projectSidebarItems.map((item, index) => {
                const href = `/projects/${projectId}${item.href}`;
                const isActive = pathname === href;
                return (
                  <Link key={item.label} href={href}>
                    <motion.div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "transition-colors cursor-pointer",
                        "relative group overflow-hidden",
                        isActive 
                          ? "bg-primary/20 text-white" 
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full"
                          layoutId="activeIndicator"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-transparent w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

