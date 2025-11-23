"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { FocusDeckProjectCard } from "@/components/focus-deck-project-card";
import { Plus, Workflow, FolderKanban, Target, BarChart3, Zap } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import Link from "next/link";

const projects = [
  {
    id: "1",
    name: "CRM Pipeline",
    icon: Workflow,
    taskCount: 24,
    color: "#8b5cf6",
  },
  {
    id: "2",
    name: "Sprint Board",
    icon: FolderKanban,
    taskCount: 18,
    color: "#6366f1",
  },
  {
    id: "3",
    name: "Product Roadmap",
    icon: Target,
    taskCount: 32,
    color: "#ec4899",
  },
  {
    id: "4",
    name: "Analytics Dashboard",
    icon: BarChart3,
    taskCount: 15,
    color: "#06b6d4",
  },
  {
    id: "5",
    name: "Feature Development",
    icon: Zap,
    taskCount: 28,
    color: "#10b981",
  },
];

export default function ProjectsPage() {
  const [activeIndex, setActiveIndex] = React.useState(2); // Default to middle card
  const [isMobile, setIsMobile] = React.useState(false);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => Math.min(projects.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [projects.length]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-80 ml-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
          {/* Background: Mor-indigo mesh gradient + noise */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-purple-900/30" />
            <div
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <motion.div
            className="space-y-8 relative z-10 max-w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Projeler</h1>
                <p className="text-white/60">Tüm projelerinize buradan erişin</p>
              </div>
              <Link href="/projects/new" passHref>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <PremiumButton className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-lg shadow-purple-500/25">
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Proje
                  </PremiumButton>
                </motion.div>
              </Link>
            </div>

            {/* Focus + Deck Cards Container */}
            <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full flex items-center justify-center perspective-1000 overflow-hidden">
              <div className="relative w-full max-w-[1800px] h-full mx-auto">
                {projects.map((project, index) => {
                  let position: "left" | "center" | "right";
                  let stackIndex = 0;

                  if (index < activeIndex) {
                    position = "left";
                    stackIndex = activeIndex - index - 1;
                  } else if (index === activeIndex) {
                    position = "center";
                    stackIndex = 0;
                  } else {
                    position = "right";
                    stackIndex = index - activeIndex - 1;
                  }

                  return (
                    <FocusDeckProjectCard
                      key={project.id}
                      project={project}
                      position={position}
                      stackIndex={stackIndex}
                      isActive={index === activeIndex}
                      onClick={() => setActiveIndex(index)}
                      isMobile={isMobile}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

