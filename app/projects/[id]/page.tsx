"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { FloatingGlassCard } from "@/components/floating-glass-card";
import { Calendar, Users, CheckCircle2, Clock, Loader2, AlertCircle, FolderKanban, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // Proje bilgisini çek
  const { data: project, error: projectError, isLoading: projectLoading } = useSWR(
    projectId ? `/api/projects?id=${projectId}` : null,
    fetcher
  );

  // Task'ları çek
  const { data: tasks, isLoading: tasksLoading } = useSWR(
    projectId ? `/api/tasks?projectId=${projectId}` : null,
    fetcher
  );

  // İstatistikleri hesapla
  const stats = React.useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return {
        completed: 0,
        inProgress: 0,
        todo: 0,
        total: 0,
      };
    }

    return {
      completed: tasks.filter((t: any) => t.status === "done").length,
      inProgress: tasks.filter((t: any) => t.status === "doing").length,
      todo: tasks.filter((t: any) => t.status === "todo").length,
      total: tasks.length,
    };
  }, [tasks]);

  const isLoading = projectLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Proje bulunamadı.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-white/60">{project.description || "Proje açıklaması eklenmemiş."}</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/projects/${projectId}/board`}>
              <motion.button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FolderKanban className="w-5 h-5" />
                Kanban Board
              </motion.button>
            </Link>
            <Link href={`/projects/${projectId}/activity`}>
              <motion.button
                className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Activity className="w-5 h-5" />
                Aktivite
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: CheckCircle2, label: "Tamamlanan", value: stats.completed.toString(), color: "from-green-500 to-emerald-600" },
            { icon: Clock, label: "Devam Eden", value: stats.inProgress.toString(), color: "from-yellow-500 to-orange-600" },
            { icon: Calendar, label: "Bekleyen", value: stats.todo.toString(), color: "from-blue-500 to-cyan-600" },
            { icon: Users, label: "Toplam Görev", value: stats.total.toString(), color: "from-primary to-accent" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FloatingGlassCard className="p-6">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", stat.color)}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </FloatingGlassCard>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <FloatingGlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Proje İlerlemesi</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Genel İlerleme</span>
              <span className="text-white font-medium">{project.progress || 0}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#ff1e56] to-[#ff006e]"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </FloatingGlassCard>

        {/* Quick Actions */}
        {stats.total === 0 && (
          <FloatingGlassCard className="p-6 text-center">
            <FolderKanban className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Henüz görev yok</h3>
            <p className="text-white/60 mb-4">Kanban board'a gidip ilk görevinizi oluşturun</p>
            <Link href={`/projects/${projectId}/board`}>
              <motion.button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Kanban Board'a Git
              </motion.button>
            </Link>
          </FloatingGlassCard>
        )}
      </motion.div>
    </div>
  );
}
