"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { FloatingGlassCard } from "@/components/floating-glass-card";
import { TrendingUp, Users, FolderKanban, Clock, Loader2, AlertCircle } from "lucide-react";
import { useSidebarContext } from "@/components/sidebar-context";
import { useAppStore } from "@/lib/store";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statIcons = {
  totalProjects: FolderKanban,
  totalTasks: Clock,
  teamMembers: Users,
  completionRate: TrendingUp,
};

const statColors = {
  totalProjects: "from-primary to-accent",
  totalTasks: "from-accent to-[#ff4d6d]",
  teamMembers: "from-[#ff4d6d] to-[#ff1e56]",
  completionRate: "from-primary to-[#ff4d6d]",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { sidebarWidth } = useSidebarContext();
  const { currentWorkspaceId, setWorkspace } = useAppStore();

  // Session'dan workspace ID al veya store'dan
  const workspaceId = session?.user?.workspaceId || currentWorkspaceId;

  // Dashboard stats API çağrısı
  const { data, error, isLoading } = useSWR(
    workspaceId ? `/api/dashboard/stats?workspaceId=${workspaceId}` : null,
    fetcher,
    { refreshInterval: 30000 } // Her 30 saniyede bir yenile
  );

  // Workspace yoksa workspace seçim sayfasına yönlendir
  React.useEffect(() => {
    if (status === "authenticated" && !workspaceId) {
      router.push("/workspaces");
    }
  }, [status, workspaceId, router]);

  // Workspace ID'yi store'a kaydet
  React.useEffect(() => {
    if (session?.user?.workspaceId && session?.user?.role) {
      setWorkspace(session.user.workspaceId, session.user.role);
    }
  }, [session?.user?.workspaceId, session?.user?.role, setWorkspace]);

  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Stats dizisi
  const stats = React.useMemo(() => {
    if (!data?.stats) return [];
    return [
      {
        key: "totalProjects",
        title: "Toplam Proje",
        value: data.stats.totalProjects?.toString() || "0",
        change: data.stats.weeklyChange || "+0%",
        icon: statIcons.totalProjects,
        color: statColors.totalProjects,
      },
      {
        key: "totalTasks",
        title: "Aktif Görevler",
        value: (data.stats.inProgressTasks + data.stats.todoTasks)?.toString() || "0",
        change: `${data.stats.todoTasks} bekliyor`,
        icon: statIcons.totalTasks,
        color: statColors.totalTasks,
      },
      {
        key: "teamMembers",
        title: "Takım Üyeleri",
        value: data.stats.teamMembers?.toString() || "0",
        change: `${data.stats.userActiveTasks || 0} görevin`,
        icon: statIcons.teamMembers,
        color: statColors.teamMembers,
      },
      {
        key: "completionRate",
        title: "Tamamlanma Oranı",
        value: `${data.stats.completionRate || 0}%`,
        change: `${data.stats.weeklyCompleted || 0} bu hafta`,
        icon: statIcons.completionRate,
        color: statColors.completionRate,
      },
    ];
  }, [data?.stats]);

  if (status === "loading" || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
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
                <p className="text-white/60">
                  {session?.user?.name ? `Hoş geldin, ${session.user.name}!` : "Projelerinize genel bakış"}
                </p>
              </div>

              {/* Loading / Error State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>Veriler yüklenirken bir hata oluştu.</span>
                </div>
              )}

              {!isLoading && !error && data && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <FloatingGlassCard className="p-6 hover:scale-105">
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                            >
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
                    {data.recentProjects?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {data.recentProjects.map((project: any, index: number) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            <FloatingGlassCard
                              className="p-6 hover:scale-105 cursor-pointer"
                              onClick={() => router.push(`/projects/${project.id}/board`)}
                            >
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
                                <p className="text-xs text-white/40 mt-2">
                                  {project.taskCount} görev
                                </p>
                              </div>
                            </FloatingGlassCard>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-white/40">
                        <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Henüz proje yok.</p>
                        <button
                          onClick={() => router.push("/projects/new")}
                          className="mt-4 px-6 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        >
                          İlk Projeyi Oluştur
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
