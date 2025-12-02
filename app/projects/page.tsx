"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/ui/premium-button";
import { useSidebarContext } from "@/components/sidebar-context";
import { useProjectContext } from "@/components/project-context";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: string;
  name: string;
  icon: LucideIcon;
  taskCount: number;
  color: string;
  status: string;
  team: string;
  progress: number;
  description: string;
  deadline: string;
}

const projects: Project[] = [
  {
    id: "crm",
    name: "CRM Pipeline",
    icon: Workflow,
    taskCount: 48,
    color: "#f43f5e",
    status: "Live Sprint",
    team: "Revenue Ops",
    progress: 72,
    description: "Lead-to-close akışını yöneten otomasyon katmanı. Enterprise CRM'inizi yeni bir seviyeye taşıyın.",
    deadline: "23 Mar",
  },
  {
    id: "sprint",
    name: "Sprint Command",
    icon: FolderKanban,
    taskCount: 36,
    color: "#fb7185",
    status: "Planning",
    team: "Core Product",
    progress: 54,
    description: "Sprint 18 epiklerini, velocity'yi ve riskleri tek bakışta yönetin.",
    deadline: "17 Mar",
  },
  {
    id: "roadmap",
    name: "Product Roadmap",
    icon: Target,
    taskCount: 28,
    color: "#f97316",
    status: "Review",
    team: "Strategy Guild",
    progress: 41,
    description: "Q2 feature'larını, milestone'ları ve müşteri feedback loop'unu hizalayın.",
    deadline: "05 Apr",
  },
  {
    id: "analytics",
    name: "Insight Hub",
    icon: BarChart3,
    taskCount: 19,
    color: "#facc15",
    status: "In Flight",
    team: "Data Studio",
    progress: 63,
    description: "Gerçek zamanlı KPI'ları canlı olarak izleyen yeni analitik kontrol odası.",
    deadline: "29 Mar",
  },
  {
    id: "feature",
    name: "Velocity Engine",
    icon: Zap,
    taskCount: 33,
    color: "#fb5f5f",
    status: "Code Freeze",
    team: "Velocity Crew",
    progress: 88,
    description: "Otomasyon motorunun release'e hazırlanması için son sprint.",
    deadline: "12 Mar",
  },
];

export default function ProjectsPage() {
  const { selectedProjectId, setSelectedProjectId } = useProjectContext();
  const [selectedId, setSelectedId] = React.useState(selectedProjectId || projects[0].id);
  const [navigationDirection, setNavigationDirection] = React.useState<"left" | "right">("right");
  const selectedIndex = projects.findIndex((project) => project.id === selectedId);
  const focusProject = projects[selectedIndex];

  // Context'i güncelle
  React.useEffect(() => {
    setSelectedProjectId(selectedId);
  }, [selectedId, setSelectedProjectId]);
  const [viewMode, setViewMode] = React.useState<"spatial" | "classic">("spatial");
  const viewOptions: Array< { label: string; value: "spatial" | "classic"; icon: React.ReactNode }> = [
    { label: "Deck", value: "spatial", icon: <Grid3x3 className="w-4 h-4" /> },
    { label: "List", value: "classic", icon: <LayoutList className="w-4 h-4" /> },
  ];
  const { sidebarWidth } = useSidebarContext();
  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  const leftDeck = projects.slice(0, selectedIndex).slice(-3);
  const rightDeck = projects.slice(selectedIndex + 1).slice(0, 3);

  // Klavye navigasyonu
  React.useEffect(() => {
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
  }, [selectedId]);

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
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-screen"
              style={{
                backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.05) 0%, transparent 45%), linear-gradient(300deg, rgba(255,255,255,0.03) 0%, transparent 45%)`,
              }}
            />
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
                  {viewMode === "spatial" ? "Focus + Deck · Yeni nesil proje seçicisi" : "Klasik liste · Hafif animasyonlu görünüm"}
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
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => {
                      setNavigationDirection("left");
                      setSelectedId(projects[(selectedIndex - 1 + projects.length) % projects.length].id);
                    }}
                    className="w-10 h-10 rounded-xl border border-white/20 text-white/60 backdrop-blur-sm transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    whileHover={{
                      y: -2,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderColor: "rgba(244,63,94,0.6)",
                      color: "#fff",
                      scale: 1.05,
                    }}
                    animate={{
                      opacity: 1,
                    }}
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
                    whileHover={{
                      y: -2,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderColor: "rgba(244,63,94,0.6)",
                      color: "#fff",
                      scale: 1.05,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                  >
                    <ChevronRight className="w-5 h-5 mx-auto" />
                  </motion.button>
                </div>
                <Link href="/projects/new" passHref>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <PremiumButton className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-medium shadow-lg shadow-[#ff1e56]/30">
                      <Plus className="w-5 h-5 mr-2" />
                      Yeni Proje
                    </PremiumButton>
                  </motion.div>
                </Link>
              </div>
            </div>

            {viewMode === "spatial" ? (
              <>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:hidden">
                  {projects
                    .filter((project) => project.id !== focusProject.id)
                    .map((project) => (
                      <motion.button
                        key={project.id}
                        onClick={() => setSelectedId(project.id)}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10 transition-colors"
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                            style={{
                              background: `linear-gradient(135deg, ${project.color}, ${project.color}80)`,
                            }}
                          >
                            <project.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{project.name}</p>
                            <p className="text-xs text-white/60">{project.taskCount} tasks</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                </div>
              </>
            ) : (
              <SimpleProjectGrid
                projects={projects}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setNavigationDirection("right");
                }}
              />
            )}
          </motion.div>

          {/* Sabit "Projeyi Aç" Butonu - Sadece klasik modda ve seçili proje varsa */}
          {viewMode === "classic" && selectedId && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="fixed bottom-8 right-8 z-50"
              >
                <Link href={`/projects/${selectedId}/board`} passHref>
                  <motion.button
                    className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#ff1e56] to-[#ff006e] shadow-[0_8px_32px_rgba(255,30,86,0.5)] flex items-center justify-center text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#ff1e56]"
                      animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#ff1e56] blur-xl"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    <Plus className="w-8 h-8 relative z-10" />
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}

function FocusCard({ project, direction }: { project: Project; direction: "left" | "right" }) {
  // direction: hangi tuşa basıldı (left = sol ok tuşu, right = sağ ok tuşu)
  // Sol ok basınca: yeni kart SOLDAN gelir (x: -150), eski kart SAĞA gider (x: 150)
  // Sağ ok basınca: yeni kart SAĞDAN gelir (x: 150), eski kart SOLA gider (x: -150)
  const comesFromLeft = direction === "left"; // Sol ok basınca yeni kart soldan gelsin
  const exitsToRight = direction === "left"; // Sol ok basınca eski kart sağa gider
  
  return (
    <motion.div
      key={project.id}
      className="relative w-full max-w-3xl mx-auto z-[100]"
      initial={{ 
        opacity: 0, 
        scale: 0.9, 
        x: comesFromLeft ? -150 : 150, 
        rotateY: comesFromLeft ? -15 : 15 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: 0, 
        rotateY: 0 
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        x: exitsToRight ? 150 : -150, 
        rotateY: exitsToRight ? 15 : -15, 
        zIndex: 10 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 450, 
        damping: 30,
        opacity: { duration: 0.1 },
      }}
    >
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        scale={1}
        transitionSpeed={1500}
        className="w-full"
      >
        <motion.div
          className="relative w-full rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1f1a1c] via-[#140f12] to-[#0c0b10] backdrop-blur-2xl shadow-[0_40px_160px_rgba(12,0,0,0.35)] p-6 overflow-hidden"
        >
        {/* Kırmızı pulse ring */}
        <motion.div
          className="absolute -inset-1 rounded-[28px] border-2 border-[#ff1e56]/40 -z-10"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-32 -right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle at center, rgba(255,30,86,0.35), transparent 60%)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 space-y-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-3">
              <div 
                className="w-14 h-14 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${project.color}, ${project.color}90)`,
                }}
              >
                <project.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/50">{project.team}</p>
                <h2 className="text-3xl font-bold text-white">{project.name}</h2>
                <p className="text-white/65 max-w-2xl leading-relaxed">{project.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-white/70">
                {project.status}
              </span>
              <p className="text-xs text-white/40 mt-2">Teslim: {project.deadline}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatBlock label="Görevler" value={`${project.taskCount}`} sub="aktif" />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60 mb-2">İlerleme</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-white">{project.progress}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff1e56] via-[#ff1744] to-[#ff006e]"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                />
              </div>
            </div>
            <StatBlock label="Öncelik" value="Yüksek" sub="otomatik" />
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
          return (
            <DeckCard
              key={project.id}
              project={project}
              side={side}
              style={{ x: xOffset, y: yOffset, zIndex: 20 - depth }}
              isHovering={hoveredId === project.id}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId((prev) => (prev === project.id ? null : prev))}
              onSelect={onSelect}
              delay={depth * 0.12}
            />
          );
        })}
      </div>
    </div>
  );
}

function DeckCard({
  project,
  side,
  style,
  isHovering,
  onHoverStart,
  onHoverEnd,
  onSelect,
  delay,
}: {
  project: Project;
  side: "left" | "right";
  style: { x: number; y: number; zIndex: number };
  isHovering: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: (id: string) => void;
  delay: number;
}) {
  const { x, y, zIndex } = style;
  const baseRotate = side === "left" ? -4 : 4;
  const Icon = project.icon;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        x,
        y,
        zIndex: isHovering ? 80 : zIndex,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 0.75,
        scale: 1,
        rotate: baseRotate,
      }}
      transition={{
        delay,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <motion.button
        onClick={() => onSelect(project.id)}
        className="group w-[190px] rounded-2xl border border-white/15 bg-[#1a1416]/85 backdrop-blur-xl p-4 text-left shadow-[0_12px_40px_rgba(5,5,8,0.55)] relative overflow-hidden"
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        {/* Gradient overlay - sadece hover'da görünsün */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 0.4 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background: `linear-gradient(135deg, ${project.color}, rgba(255,255,255,0.1))`,
          }}
        />
        
        {/* İçerik */}
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
          <motion.div
            className="mt-3 text-[11px] text-white/70 leading-snug overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isHovering ? "auto" : 0,
              opacity: isHovering ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {project.description}
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}

function StatBlock({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40">{sub}</p>
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
  const selectedProject = projects.find((p) => p.id === selectedId);
  const otherProjects = projects.filter((p) => p.id !== selectedId);

  return (
    <div className="space-y-8">
      {/* Seçili proje - büyük kart */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 35,
            }}
            className="w-full"
          >
            <motion.article
              onClick={() => onSelect(selectedProject.id)}
              className="relative w-full rounded-[32px] border-2 border-[#ff1e56]/60 bg-white/10 p-8 backdrop-blur-2xl overflow-hidden cursor-pointer"
              animate={{
                scale: 1.015,
                y: -12,
                boxShadow: "0 32px 80px rgba(255,30,86,0.35)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {/* Kırmızı pulse ring */}
              <motion.div
                className="absolute -inset-3 rounded-[36px] border-3 border-[#ff1e56]/70 -z-10"
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Güçlü kırmızı glow efekti */}
              <motion.div
                className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-[#ff1e56]/40 to-[#ff006e]/40 blur-2xl -z-20"
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${selectedProject.color}, ${selectedProject.color}90)` }}
                    >
                      <selectedProject.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-1">{selectedProject.team}</p>
                      <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h3>
                      <p className="text-base text-white/70 max-w-2xl leading-relaxed">{selectedProject.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm uppercase tracking-widest text-white/80 mb-2 inline-block">
                      {selectedProject.status}
                    </span>
                    <p className="text-sm text-white/50">Teslim: {selectedProject.deadline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/60 mb-1">Görevler</p>
                    <p className="text-2xl font-bold text-white">{selectedProject.taskCount}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/60 mb-1">İlerleme</p>
                    <p className="text-2xl font-bold text-white">{selectedProject.progress}%</p>
                    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff1e56] via-[#ff1744] to-[#ff006e]"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedProject.progress}%` }}
                        transition={{ type: "spring", stiffness: 140, damping: 22 }}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/60 mb-1">Öncelik</p>
                    <p className="text-2xl font-bold text-white">Yüksek</p>
                  </div>
                </div>

              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diğer projeler - grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence>
          {otherProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: selectedId === project.id ? 1 : 0.5,
                  scale: selectedId === project.id ? 1 : 0.98,
                }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{
                  layout: { type: "spring", stiffness: 350, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                className="relative"
              >
                <motion.article
                  layout="position"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelect(project.id);
                  }}
                  className="relative rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl overflow-hidden cursor-pointer h-full"
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
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{project.team}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-white/70">{project.progress}%</span>
                  </div>
                  <p className="mt-3 text-sm text-white/65 line-clamp-3">{project.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/60 flex-wrap">
                    <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5">{project.status}</span>
                    <span className="px-3 py-1 rounded-full border border-white/10">
                      {project.taskCount} görev
                    </span>
                    <span className="px-3 py-1 rounded-full border border-white/10">Teslim {project.deadline}</span>
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
                </motion.article>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

