"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import { mockUsers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const workspaceName = "Bayhan Core Workspace";

export default function TeamPage() {
  const { sidebarWidth } = useSidebarContext();

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div
        className="flex-1 flex flex-col"
        style={{
          paddingLeft: sidebarWidth,
          transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <AnimatedBackdrop />

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/50">Team</p>
                <h1 className="text-4xl font-semibold text-white">Takım Yönetimi</h1>
              </div>
              <motion.button
                className="relative h-12 px-6 rounded-full text-white font-semibold bg-gradient-to-r from-primary to-accent shadow-[0_15px_40px_rgba(255,30,86,0.35)]"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Invite Member
              </motion.button>
            </header>

            <section className="grid xl:grid-cols-[1.4fr_0.6fr] gap-6 items-start">
              <div className="space-y-6">
                <WorkspaceHero members={mockUsers.length} />
                <motion.div
                  className="rounded-[28px] border border-white/10 bg-[#141417]/85 backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Active Sprints</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Orion CRM", "Nova Analytics", "Helix Mobile"].map((proj, idx) => (
                      <motion.div
                        key={proj}
                        className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2"
                        whileHover={{ y: -4 }}
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Workspace</p>
                        <p className="text-white font-semibold">{proj}</p>
                        <p className="text-white/60 text-sm">
                          {idx === 0 ? "Yayın öncesi QA" : idx === 1 ? "Realtime dashboards" : "Spatial mobile UI"}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <ActivityRings />
            </section>

            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-white/50">Üyeler</p>
                  <h2 className="text-2xl font-semibold text-white">Operasyon gücü</h2>
                </div>
                <div className="flex gap-2 text-xs text-white/60 uppercase tracking-[0.3em]">
                  <span>Hover → detay</span>
                  <span className="text-white/30">|</span>
                  <span>Click → seç</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 perspective-1000">
                {mockUsers.map((member, index) => (
                  <MemberDeckCard key={member.id} member={member} index={index} />
                ))}
              </div>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function WorkspaceHero({ members }: { members: number }) {
  return (
    <motion.div
      className="rounded-[32px] border border-white/10 bg-[#0f0f11]/80 backdrop-blur-2xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] flex flex-col gap-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">Workspace</p>
      <h2 className="text-3xl font-semibold text-white">{workspaceName}</h2>
      <p className="text-white/60 text-sm">{members} aktif üye • 4 takım</p>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        {[
          { label: "Online", value: mockUsers.filter((m) => m.online).length.toString() },
          { label: "Aktif görev", value: mockUsers.reduce((sum, m) => sum + m.activeTasks, 0).toString() },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">{item.label}</p>
            <p className="text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MemberDeckCard({
  member,
  index,
}: {
  member: (typeof mockUsers)[number];
  index: number;
}) {
  const [flipped, setFlipped] = React.useState(false);
  return (
    <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.02} transitionSpeed={1200}>
      <motion.div
        className="relative h-56 rounded-[26px] border border-white/10 bg-[#111316]/90 backdrop-blur-2xl overflow-hidden cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <motion.div
          className="absolute inset-0 p-5 flex flex-col gap-3"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={member.avatarUrl} alt={member.name} className="w-14 h-14 rounded-2xl border-4 border-primary/40 object-cover" />
              <span
                className={cn(
                  "absolute -top-1 -right-1 h-3 w-3 rounded-full border border-[#0c0c0c]",
                  member.online ? "bg-green-400" : "bg-white/30"
                )}
              />
            </div>
            <div>
              <p className="text-white font-semibold">{member.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>{member.activeTasks} aktif görev</span>
            <span>{index % 3 === 0 ? "Design" : index % 3 === 1 ? "Dev" : "Growth"}</span>
          </div>
          <motion.div
            className="mt-auto h-1.5 rounded-full bg-white/10 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.1 * index }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${40 + member.activeTasks * 5}%` }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </motion.div>

          <motion.div
            className="absolute inset-0 p-5 text-white/70 flex flex-col gap-3"
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Last Comment</p>
          <p className="text-sm leading-relaxed">{member.lastComment ?? "Henüz yorum yok."}</p>
          <div className="mt-auto flex items-center gap-2 text-xs text-white/50">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Aktif • 2 saat önce
          </div>
        </motion.div>
      </motion.div>
    </Tilt>
  );
}

function ActivityRings() {
  const rings = [
    { label: "Design", value: 0.78, color: "#ff1e56" },
    { label: "Dev", value: 0.64, color: "#ff4d6d" },
    { label: "Growth", value: 0.42, color: "#ff006e" },
  ];

  return (
    <motion.div
      className="rounded-[32px] border border-white/10 bg-[#111216]/90 backdrop-blur-2xl p-6 flex flex-col gap-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Aktivite</p>
        <h3 className="text-2xl font-semibold text-white">Son 7 Gün</h3>
      </div>
      <div className="relative w-full flex justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220" className="rotate-[-90deg]">
          {rings.map((ring, index) => {
            const radius = 80 - index * 20;
            const circumference = 2 * Math.PI * radius;
            return (
              <circle
                key={ring.label}
                cx="110"
                cy="110"
                r={radius}
                fill="transparent"
                stroke={ring.color}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - ring.value)}
                strokeLinecap="round"
                opacity={0.8 - index * 0.2}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-4xl font-semibold">84%</span>
          <span className="text-sm uppercase tracking-[0.4em] text-white/60">aktiflik</span>
        </div>
      </div>
      <ul className="space-y-3">
        {rings.map((ring) => (
          <li key={ring.label} className="flex items-center justify-between text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ring.color }} />
              {ring.label}
            </div>
            <span className="font-semibold text-white">{Math.round(ring.value * 100)}%</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
      {[...Array(3)].map((_, idx) => (
        <motion.div
          key={idx}
          className="absolute w-[60%] h-[400px] rounded-full blur-[140px]"
          style={{
            background: idx % 2 === 0 ? "rgba(255,0,110,0.12)" : "rgba(255,30,86,0.08)",
            top: idx === 0 ? "-10%" : idx === 1 ? "30%" : "70%",
            left: idx === 0 ? "10%" : idx === 1 ? "50%" : "20%",
          }}
          animate={{
            x: [0, idx % 2 === 0 ? 40 : -30, 0],
            y: [0, idx === 0 ? 20 : -20, 0],
          }}
          transition={{
            duration: 18 + idx * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

