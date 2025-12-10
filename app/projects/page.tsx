"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/ui/premium-button";
import { useSidebarContext } from "@/components/sidebar-context";
import { useProjectContext } from "@/components/project-context";
import { useAppStore } from "@/lib/store";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Plus,
  Workflow,
  FolderKanban,
  Target,
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  Grid3x3,
  Loader2,
  AlertCircle,
  Folder,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// İkon eşleştirme
const iconMap: Record<string, LucideIcon> = {
  workflow: Workflow,
  folder: Folder,
  kanban: FolderKanban,
  target: Target,
  barchart: BarChart3,
  zap: Zap,
};

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  taskCount: number;
  progress: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { selectedProjectId, setSelectedProjectId } = useProjectContext();
  const { currentWorkspaceId, setWorkspace } = useAppStore();
  const { canCreateProject } = usePermissions();
  const { sidebarWidth } = useSidebarContext();
  
  const [navigationDirection, setNavigationDirection] = React.useState<"left" | "right">("right");
  const [viewMode, setViewMode] = React.useState<"spatial" | "classic">("spatial");

  // Session'dan workspace ID al veya store'dan
  const workspaceId = session?.user?.workspaceId || currentWorkspaceId;

  // Projects API çağrısı
  const { data: projects, error, isLoading, mutate } = useSWR<Project[]>(
    workspaceId ? `/api/projects?workspaceId=${workspaceId}` : null,
    fetcher
  );

  // Workspace yoksa workspace seçim sayfasına yönlendir
  React.useEffect(() => {
    if (sessionStatus === "authenticated" && !workspaceId) {
      router.push("/workspaces");
    }
  }, [sessionStatus, workspaceId, router]);

  // Workspace ID'yi store'a kaydet
  React.useEffect(() => {
    if (session?.user?.workspaceId && session?.user?.role) {
      setWorkspace(session.user.workspaceId, session.user.role);
    }
  }, [session?.user?.workspaceId, session?.user?.role, setWorkspace]);

  // Seçili proje
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (projects && projects.length > 0 && !selectedId) {
      setSelectedId(selectedProjectId || projects[0].id);
    }
  }, [projects, selectedId, selectedProjectId]);

  // Context'i güncelle
  React.useEffect(() => {
    if (selectedId) {
      setSelectedProjectId(selectedId);
    }
  }, [selectedId, setSelectedProjectId]);

  const selectedIndex = projects?.findIndex((p) => p.id === selectedId) ?? 0;
  const focusProject = projects?.[selectedIndex];

  const viewOptions = [
    { label: "Deck", value: "spatial" as const, icon: <Grid3x3 className="w-4 h-4" /> },
    { label: "List", value: "classic" as const, icon: <LayoutList className="w-4 h-4" /> },
  ];

  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  const leftDeck = projects?.slice(0, selectedIndex).slice(-3) || [];
  const rightDeck = projects?.slice(selectedIndex + 1).slice(0, 3) || [];

  // Klavye navigasyonu
  React.useEffect(() => {
    if (!projects || projects.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIdx = projects.findIndex((p) => p.id === selectedId);
      if (currentIdx === -1) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setNavigationDirection("left");
        setSelectedId(projects[(currentIdx - 1 + projects.length) % projects.length].id);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setNavigationDirection("right");
        setSelectedId(projects[(currentIdx + 1) % projects.length].id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, projects]);

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Projeler yüklenirken bir hata oluştu.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={contentStyle}>
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative bg-transparent">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[#19080b] via-[#0f0e13] to-[#15161d]" />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.25),_transparent_60%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle_at_bottom,_rgba(120,113,108,0.25),_transparent_55%)]" />
          </div>

          <motion.div
            className="space-y-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Projeler</h1>
                <p className="text-white/60">
                  {viewMode === "spatial"
                    ? "Focus + Deck · Yeni nesil proje seçicisi"
                    : "Klasik liste · Hafif animasyonlu görünüm"}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                <div className="flex items-center">
                  <div className="flex rounded-full border border-white/15 bg-white/5 p-1 text-sm text-white/60">
                    {viewOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setViewMode(option.value)}
                        className={cn(
                          "relative px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2",
                          viewMode === option.value ? "text-white" : "text-white/50"
                        )}
                      >
                        {viewMode === option.value && (
                          <motion.span
                            layoutId="view-mode-pill"
                            className="absolute inset-0 rounded-full bg-white/15"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{option.icon}</span>
                        <span className="relative z-10">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {projects && projects.length > 0 && (
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => {
                        setNavigationDirection("left");
                        setSelectedId(
                          projects[(selectedIndex - 1 + projects.length) % projects.length].id
                        );
                      }}
                      className="w-10 h-10 rounded-xl border border-white/20 text-white/60 backdrop-blur-sm transition-all"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <ChevronLeft className="w-5 h-5 mx-auto" />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setNavigationDirection("right");
                        setSelectedId(projects[(selectedIndex + 1) % projects.length].id);
                      }}
                      className="w-10 h-10 rounded-xl border border-white/20 text-white/60 backdrop-blur-sm transition-all"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <ChevronRight className="w-5 h-5 mx-auto" />
                    </motion.button>
                  </div>
                )}
                {canCreateProject && (
                  <Link href="/projects/new" passHref>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <PremiumButton className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-medium shadow-lg shadow-[#ff1e56]/30">
                        <Plus className="w-5 h-5 mr-2" />
                        Yeni Proje
                      </PremiumButton>
                    </motion.div>
                  </Link>
                )}
              </div>
            </div>

            {/* Empty State */}
            {(!projects || projects.length === 0) && (
              <div className="text-center py-20">
                <FolderKanban className="w-16 h-16 mx-auto mb-6 text-white/20" />
                <h3 className="text-2xl font-bold text-white mb-2">Henüz proje yok</h3>
                <p className="text-white/60 mb-6">İlk projenizi oluşturarak başlayın</p>
                {canCreateProject && (
                  <Link href="/projects/new">
                    <PremiumButton className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e]">
                      <Plus className="w-5 h-5 mr-2" />
                      İlk Projeyi Oluştur
                    </PremiumButton>
                  </Link>
                )}
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && viewMode === "spatial" && focusProject && (
              <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr_auto] gap-0 items-center max-w-[1600px] mx-auto">
                <DeckColumn
                  projects={leftDeck}
                  side="left"
                  onSelect={(id) => {
                    setNavigationDirection("left");
                    setSelectedId(id);
                  }}
                />

                <div className="relative z-[100] min-h-[500px] flex items-center justify-center w-full">
                  <AnimatePresence mode="wait">
                    <FocusCard
                      key={focusProject.id}
                      project={focusProject}
                      direction={navigationDirection}
                    />
                  </AnimatePresence>
                </div>

                <DeckColumn
                  projects={rightDeck}
                  side="right"
                  onSelect={(id) => {
                    setNavigationDirection("right");
                    setSelectedId(id);
                  }}
                />
              </div>
            )}

            {projects && projects.length > 0 && viewMode === "classic" && (
              <SimpleProjectGrid
                projects={projects}
                selectedId={selectedId || ""}
                onSelect={(id) => {
                  setSelectedId(id);
                  setNavigationDirection("right");
                }}
              />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function FocusCard({
  project,
  direction,
}: {
  project: Project;
  direction: "left" | "right";
}) {
  const Icon = iconMap[project.icon] || Folder;
  const comesFromLeft = direction === "left";

  return (
    <motion.div
      key={project.id}
      className="relative w-full max-w-3xl mx-auto z-[100]"
      initial={{
        opacity: 0,
        scale: 0.9,
        x: comesFromLeft ? -150 : 150,
        rotateY: comesFromLeft ? -15 : 15,
      }}
      animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        x: comesFromLeft ? 150 : -150,
        rotateY: comesFromLeft ? 15 : -15,
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 30,
        opacity: { duration: 0.1 },
      }}
    >
      <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1} transitionSpeed={1500} className="w-full">
        <motion.div className="relative w-full rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1f1a1c] via-[#140f12] to-[#0c0b10] backdrop-blur-2xl shadow-[0_40px_160px_rgba(12,0,0,0.35)] p-6 overflow-hidden">
          <motion.div
            className="absolute -inset-1 rounded-[28px] border-2 border-[#ff1e56]/40 -z-10"
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 space-y-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 rounded-2xl border border-white/15 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}90)` }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{project.name}</h2>
                  <p className="text-white/65 max-w-2xl leading-relaxed">
                    {project.description || "Proje açıklaması eklenmemiş."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-white/70">
                  {project.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 mb-1">Görevler</p>
                <p className="text-3xl font-bold text-white">{project.taskCount}</p>
                <p className="text-xs text-white/40">aktif</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 mb-2">İlerleme</p>
                <p className="text-3xl font-bold text-white">{project.progress}%</p>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#ff1e56] via-[#ff1744] to-[#ff006e]"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 mb-1">Öncelik</p>
                <p className="text-3xl font-bold text-white">Yüksek</p>
                <p className="text-xs text-white/40">otomatik</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={`/projects/${project.id}/board`} passHref>
                <PremiumButton className="h-12 px-6 bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30">
                  Projeyi Aç
                </PremiumButton>
              </Link>
              <Link href={`/projects/${project.id}/activity`} passHref>
                <motion.button
                  className="h-12 px-6 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/40 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Aktiviteleri Gör
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Tilt>
    </motion.div>
  );
}

function DeckColumn({
  projects,
  side,
  onSelect,
}: {
  projects: Project[];
  side: "left" | "right";
  onSelect: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  if (!projects.length) {
    return <div className="hidden xl:flex w-full justify-center" />;
  }

  const ordered = side === "left" ? [...projects].reverse() : projects;

  return (
    <div
      className={cn(
        "hidden xl:flex w-full items-center relative z-10",
        side === "left" ? "justify-end" : "justify-start",
        side === "right" && "-ml-32"
      )}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className="relative w-[220px] h-[520px] overflow-visible">
        {ordered.map((project, idx) => {
          const depth = idx;
          const xOffset = (depth + 1) * 22 * (side === "left" ? -1 : 1);
          const yOffset = depth * 28;
          const Icon = iconMap[project.icon] || Folder;

          return (
            <motion.div
              key={project.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                x: xOffset,
                y: yOffset,
                zIndex: hoveredId === project.id ? 80 : 20 - depth,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.75, scale: 1, rotate: side === "left" ? -4 : 4 }}
              transition={{ delay: depth * 0.12, type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.button
                onClick={() => onSelect(project.id)}
                className="group w-[190px] rounded-2xl border border-white/15 bg-[#1a1416]/85 backdrop-blur-xl p-4 text-left shadow-[0_12px_40px_rgba(5,5,8,0.55)] relative overflow-hidden"
                onHoverStart={() => setHoveredId(project.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}90)` }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{project.name}</p>
                      <p className="text-xs text-white/60">{project.taskCount} tasks</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                    <span>{project.status}</span>
                    <span className="text-white/80">{project.progress}%</span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SimpleProjectGrid({
  projects,
  selectedId,
  onSelect,
}: {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {projects.map((project, index) => {
        const Icon = iconMap[project.icon] || Folder;
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.article
              onClick={() => onSelect(project.id)}
              className={cn(
                "relative rounded-[28px] border bg-white/5 p-5 backdrop-blur-2xl overflow-hidden cursor-pointer h-full",
                selectedId === project.id
                  ? "border-[#ff1e56]/60 ring-2 ring-[#ff1e56]/30"
                  : "border-white/10 hover:border-white/20"
              )}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}90)` }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{project.name}</p>
                    <p className="text-xs text-white/50">{project.status}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white/70">{project.progress}%</span>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#ff1e56] via-[#ff1744] to-[#ff006e]"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-white/60">{project.taskCount} görev</p>

              {selectedId === project.id && (
                <Link href={`/projects/${project.id}/board`} className="mt-4 block">
                  <PremiumButton className="w-full h-10 bg-gradient-to-r from-[#ff1e56] to-[#ff006e]">
                    Projeyi Aç
                  </PremiumButton>
                </Link>
              )}
            </motion.article>
          </motion.div>
        );
      })}
    </div>
  );
}
