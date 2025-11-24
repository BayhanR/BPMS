"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/ui/premium-button";
import { useSidebarContext } from "@/components/sidebar-context";
import {
  Plus,
  Workflow,
  FolderKanban,
  Target,
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
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
  const [selectedId, setSelectedId] = React.useState(projects[0].id);
  const selectedIndex = projects.findIndex((project) => project.id === selectedId);
  const focusProject = projects[selectedIndex];
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
                <p className="text-white/60">Focus + Deck · Yeni nesil proje seçicisi</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setSelectedId(projects[(selectedIndex - 1 + projects.length) % projects.length].id)}
                    className="w-10 h-10 rounded-xl border border-white/10 text-white/70 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    whileHover={{
                      y: -2,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderColor: "rgba(255,255,255,0.4)",
                      color: "#fff",
                    }}
                  >
                    <ChevronLeft className="w-5 h-5 mx-auto" />
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedId(projects[(selectedIndex + 1) % projects.length].id)}
                    className="w-10 h-10 rounded-xl border border-white/10 text-white/70 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    whileHover={{
                      y: -2,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderColor: "rgba(255,255,255,0.4)",
                      color: "#fff",
                    }}
                  >
                    <ChevronRight className="w-5 h-5 mx-auto" />
                  </motion.button>
                </div>
                <Link href="/projects/new" passHref>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <PremiumButton className="h-12 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium shadow-lg shadow-rose-500/25">
                      <Plus className="w-5 h-5 mr-2" />
                      Yeni Proje
                    </PremiumButton>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Focus + Deck layout */}
            <div className="grid grid-cols-1 xl:grid-cols-[0.4fr_2.8fr_0.4fr] gap-6 items-center">
              <DeckColumn
                projects={leftDeck}
                side="left"
                onSelect={setSelectedId}
              />

              <div className="relative z-20">
                <FocusCard project={focusProject} />
              </div>

              <DeckColumn
                projects={rightDeck}
                side="right"
                onSelect={setSelectedId}
              />
            </div>

            {/* Mobile deck */}
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
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function FocusCard({ project }: { project: Project }) {
  return (
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      scale={1}
      transitionSpeed={1500}
      className="w-full max-w-3xl mx-auto"
    >
      <motion.div
        key={project.id}
        className="relative w-full rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1f1a1c] via-[#140f12] to-[#0c0b10] backdrop-blur-2xl shadow-[0_40px_160px_rgba(12,0,0,0.35)] p-6 overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
      >
        <motion.div
          className="absolute -top-32 -right-10 w-96 h-96 rounded-full bg-rose-500/25 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 space-y-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center text-sm font-semibold text-white/90">
                {project.id.toUpperCase()}
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
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-orange-400"
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
              <PremiumButton className="h-12 px-6 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold shadow-lg shadow-rose-500/30">
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
  if (!projects.length) {
    return <div className="hidden xl:flex" />;
  }

  const ordered = side === "left" ? [...projects].reverse() : projects;

  return (
    <div
      className={cn("hidden xl:flex", side === "left" ? "justify-end" : "justify-start")}
      style={{
        marginRight: side === "left" ? "-80px" : undefined,
        marginLeft: side === "right" ? "-80px" : undefined,
      }}
    >
      <div className="relative w-[180px] h-[420px] overflow-visible">
        {ordered.map((project, idx) => {
          const depth = idx;
          const xOffset = (depth + 1) * 10 * (side === "left" ? -1 : 1);
          const yOffset = depth * 14;
          return (
            <DeckCard
              key={project.id}
              project={project}
              side={side}
              style={{ x: xOffset, y: yOffset, zIndex: 10 - depth }}
              onSelect={onSelect}
              delay={depth * 0.15}
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
  onSelect,
  delay,
}: {
  project: Project;
  side: "left" | "right";
  style: { x: number; y: number; zIndex: number };
  onSelect: (id: string) => void;
  delay: number;
}) {
  const [isHovering, setIsHovering] = React.useState(false);
  const { x, y, zIndex } = style;
  const hoverY = y - 10;
  const baseRotate = side === "left" ? -4 : 4;

  return (
    <motion.button
      onClick={() => onSelect(project.id)}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px]"
      style={{ x, y, zIndex: isHovering ? 40 : zIndex, rotate: baseRotate }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 150, damping: 20 }}
      whileHover={{ scale: 1.12, y: hoverY, rotate: 0 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileTap={{ scale: 0.98 }}
    >
      <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={1200}>
        <motion.div
          className="rounded-2xl border border-white/15 bg-[#1a1416]/80 backdrop-blur-xl p-4 text-left shadow-[0_12px_40px_rgba(5,5,8,0.6)] relative overflow-hidden"
          animate={{
            boxShadow: isHovering
              ? "0 24px 60px rgba(244,63,94,0.35)"
              : "0 12px 40px rgba(5,5,8,0.6)",
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-0"
            animate={{ opacity: isHovering ? 0.35 : 0 }}
            style={{
              background: `linear-gradient(135deg, ${project.color}, #ffffff22)`,
            }}
          />
          <div className="flex items-center gap-3 relative z-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}90)` }}
            >
              <project.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">{project.name}</p>
              <p className="text-xs text-white/60">{project.taskCount} tasks</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-white/60 relative z-10">
            <span>{project.status}</span>
            <span className="text-white/80">{project.progress}%</span>
          </div>
          <motion.div
            className="mt-3 text-[11px] text-white/70 leading-snug relative z-10"
            initial={false}
            animate={{
              opacity: isHovering ? 1 : 0,
              height: isHovering ? "auto" : 0,
            }}
          >
            {project.description}
          </motion.div>
        </motion.div>
      </Tilt>
    </motion.button>
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

