"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { StackedProjectCard } from "@/components/3d-stacked-project-card";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: "1",
    name: "Web Portal Redesign",
    description: "Modern ve kullanıcı dostu web portal tasarımı ve geliştirmesi",
    status: "Devam Ediyor",
    members: 5,
    progress: 65,
    color: "#8b5cf6",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "iOS ve Android için native mobil uygulama geliştirmesi",
    status: "Planlama",
    members: 3,
    progress: 30,
    color: "#6366f1",
  },
  {
    id: "3",
    name: "API Integration",
    description: "Third-party servisler ile API entegrasyonu",
    status: "İnceleme",
    members: 4,
    progress: 85,
    color: "#ec4899",
  },
  {
    id: "4",
    name: "Dashboard Analytics",
    description: "Gerçek zamanlı veri görselleştirme ve analitik dashboard",
    status: "Geliştirme",
    members: 6,
    progress: 50,
    color: "#06b6d4",
  },
  {
    id: "5",
    name: "Cloud Migration",
    description: "On-premise sistemlerin cloud altyapısına taşınması",
    status: "Tamamlandı",
    members: 8,
    progress: 100,
    color: "#10b981",
  },
  {
    id: "6",
    name: "Security Audit",
    description: "Güvenlik açıklarının tespiti ve iyileştirme",
    status: "Planlama",
    members: 2,
    progress: 15,
    color: "#f59e0b",
  },
];

export default function ProjectsPage() {
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  return (
    <div className="flex h-screen overflow-hidden" onMouseMove={handleMouseMove}>
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-80 ml-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <motion.div
            className="space-y-8"
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25">
                  <Plus className="w-5 h-5 mr-2" />
                  Yeni Proje
                </Button>
              </motion.div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Projelerde ara..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>

            {/* 3D Stacked Cards Container */}
            <div className="relative h-[600px] md:h-[700px] flex items-center justify-center perspective-1000 overflow-hidden">
              <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                {projects.map((project, index) => (
                  <StackedProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    total={projects.length}
                    mouseX={mouseX}
                    mouseY={mouseY}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

