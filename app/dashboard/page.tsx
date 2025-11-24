"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { FloatingGlassCard } from "@/components/floating-glass-card";
import { TrendingUp, Users, FolderKanban, Clock } from "lucide-react";
import { useSidebarContext } from "@/components/sidebar-context";

const stats = [
  {
    title: "Toplam Proje",
    value: "24",
    change: "+12%",
    icon: FolderKanban,
    color: "from-primary to-accent",
  },
  {
    title: "Aktif Görevler",
    value: "156",
    change: "+8%",
    icon: Clock,
    color: "from-accent to-[#ff4d6d]",
  },
  {
    title: "Takım Üyeleri",
    value: "42",
    change: "+5%",
    icon: Users,
    color: "from-[#ff4d6d] to-[#ff1e56]",
  },
  {
    title: "Tamamlanma Oranı",
    value: "78%",
    change: "+15%",
    icon: TrendingUp,
    color: "from-primary to-[#ff4d6d]",
  },
];

const recentProjects = [
  {
    id: "1",
    name: "Web Portal Redesign",
    status: "Devam Ediyor",
    progress: 65,
    color: "#ff1e56",
  },
  {
    id: "2",
    name: "Mobile App Development",
    status: "Planlama",
    progress: 30,
    color: "#ff4d6d",
  },
  {
    id: "3",
    name: "API Integration",
    status: "İnceleme",
    progress: 85,
    color: "#ff006e",
  },
];

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { sidebarWidth } = useSidebarContext();
  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  React.useEffect(() => {
    // Blur in animation after route transition
    setIsLoaded(true);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoaded && (
        <motion.div
          key="dashboard"
          className="flex h-screen overflow-hidden"
          initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Sidebar />
          <div className="flex-1 flex flex-col" style={contentStyle}>
            <Topbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-white/60">Projelerinize genel bakış</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FloatingGlassCard className="p-6 hover:scale-105">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-white/60">{stat.title}</p>
                    </div>
                  </FloatingGlassCard>
                </motion.div>
              ))}
            </div>

            {/* Recent Projects */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 md:mb-6">Son Projeler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <FloatingGlassCard className="p-6 hover:scale-105 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{
                            backgroundColor: `${project.color}20`,
                            color: project.color,
                            border: `1px solid ${project.color}40`,
                          }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-white/50">
                          <span>İlerleme</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${project.color}, ${project.color}80)`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 20,
                              delay: index * 0.1,
                            }}
                          />
                        </div>
                      </div>
                    </FloatingGlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
              </motion.div>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

