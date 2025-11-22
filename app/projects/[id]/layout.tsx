"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import {
  FolderKanban,
  Calendar,
  Users,
  Settings,
  FileText,
  MessageSquare,
  BarChart3,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const projectSidebarItems = [
  { icon: FolderKanban, label: "Board", href: "/board" },
  { icon: Calendar, label: "Timeline", href: "/timeline" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: MessageSquare, label: "Discussions", href: "/discussions" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Activity, label: "Activity", href: "/activity" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-80 ml-0">
        <Topbar />
        <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
          {/* Project Sidebar */}
          <motion.aside
            className={cn(
              "w-full md:w-64 border-r border-white/10 border-b md:border-b-0",
              "bg-white/5 backdrop-blur-2xl",
              "flex flex-col",
              "transition-all duration-300",
              "md:h-full h-auto max-h-64 md:max-h-none overflow-y-auto md:overflow-y-auto"
            )}
            initial={{ x: -100, opacity: 0 }}
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
                  className="flex items-center gap-2 mb-4 text-white/60 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: -4 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Projelere Dön</span>
                </motion.div>
              </Link>
              <h2 className="text-xl font-bold text-white mb-1">Project #{projectId}</h2>
              <p className="text-sm text-white/60">Web Portal Redesign</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {projectSidebarItems.map((item, index) => {
                const href = `/projects/${projectId}${item.href}`;
                return (
                  <motion.a
                    key={item.label}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl",
                      "text-white/70 hover:text-white transition-colors",
                      "bg-white/0 hover:bg-white/10",
                      "relative group overflow-hidden"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>

                    {/* Active Indicator */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100"
                      initial={false}
                    />
                  </motion.a>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <motion.div
                className="rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10 p-4"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm font-medium text-white mb-1">Proje İlerlemesi</p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-xs text-white/60">65% Tamamlandı</p>
              </motion.div>
            </div>
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

