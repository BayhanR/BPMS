"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import { mockUsers, mockTasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const workspaceName = "Bayhan Core Workspace";
const activitySummary = [
  { label: "Feature", value: 72, color: "#ff1e56" },
  { label: "Ops", value: 54, color: "#ff4d6d" },
  { label: "Growth", value: 31, color: "#ff006e" },
];

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
          <TeamBackdrop />

          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Takım</p>
                <h1 className="text-4xl font-semibold text-white">Orbit Org Chart</h1>
              </div>
              <motion.button
                className="relative h-12 px-6 rounded-full text-white font-semibold bg-gradient-to-r from-[#ff1e56] to-[#ff006e] shadow-[0_20px_60px_rgba(255,30,86,0.35)]"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Invite Member
              </motion.button>
            </header>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_0.8fr] items-start">
              <MemberGalaxy />
              <ActivityPanel />
            </section>

            <MemberGrid />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function MemberGalaxy() {
  const radius = 220;
  const centerMembers = mockUsers.length;

  return (
    <div className="relative min-h-[480px] rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0f0f11] via-[#0b0b0d] to-[#050506] p-6 overflow-hidden">
      <motion.div
        className="absolute inset-12 rounded-[40px] bg-gradient-to-b from-[#ff1e56]/10 to-transparent blur-3xl"
        animate={{ opacity: [0.15, 0.3, 0.15], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col gap-4 text-white">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Orbit</p>
        <h2 className="text-3xl font-semibold">{workspaceName}</h2>
        <p className="text-white/60 text-sm max-w-xl">
          Üyeler kırmızı-siyah eksende, rollerine göre çemberde konumlanır. Hover ile kart ters dönerek son yorumu gösterir.
        </p>
      </div>

      <div className="relative mt-8 h-[320px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {mockUsers.map((member, index) => {
            const angle = (index / centerMembers) * 360;
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius * 0.6;
            return (
              <MemberOrbCard
                key={member.id}
                member={member}
                position={{ x, y }}
                delay={index * 0.05}
              />
            );
          })}

          <motion.div
            className="absolute flex h-32 w-32 flex-col items-center justify-center rounded-full border border-[#ff1e56]/40 bg-[#ff1e56]/10 text-white text-center shadow-[0_20px_60px_rgba(255,30,86,0.3)]"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Workspace</p>
            <p className="text-lg font-semibold">Core Crew</p>
            <p className="text-xs text-white/60 mt-1">{mockUsers.length} active</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MemberOrbCard({
  member,
  position,
  delay,
}: {
  member: (typeof mockUsers)[number];
  position: { x: number; y: number };
  delay: number;
}) {
  const [flipped, setFlipped] = React.useState(false);

  return (
    <motion.div
      className="absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
    >
      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.04} transitionSpeed={1200}>
        <motion.div
          className="relative h-48 w-40 rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
        >
          <motion.div
            className="absolute inset-0 p-4 flex flex-col gap-3"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-12 h-12 rounded-2xl border-2 border-[#ff1e56]/40 object-cover"
                />
                <span
                  className={cn(
                    "absolute -top-1 -right-1 h-3 w-3 rounded-full border border-[#0a0a0a]",
                    member.online ? "bg-emerald-400" : "bg-white/30"
                  )}
                />
              </div>
              <div>
                <p className="text-white font-semibold">{member.name}</p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">{member.role}</p>
              </div>
            </div>
            <p className="text-sm text-white/70">{member.activeTasks} aktif görev</p>
            <motion.div
              className="mt-auto h-1.5 rounded-full bg-white/10 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#ff1e56] to-[#ff006e]"
                initial={{ width: 0 }}
                animate={{ width: `${30 + member.activeTasks * 7}%` }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0 p-4 text-white/70 flex flex-col gap-3"
            animate={{ rotateY: flipped ? 0 : -180 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Son Not</p>
            <p className="text-sm leading-relaxed">{member.lastComment ?? "Henüz yorum yok."}</p>
            <div className="mt-auto flex items-center gap-2 text-xs text-white/50">
              <span className="h-2 w-2 rounded-full bg-[#ff1e56] animate-pulse" />
              {member.online ? "Şu an aktif" : "En son 2 saat önce"}
            </div>
          </motion.div>
        </motion.div>
      </Tilt>
    </motion.div>
  );
}

function ActivityPanel() {
  const tasksDone = mockTasks.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-6 rounded-[32px] border border-white/10 bg-[#101012]/80 backdrop-blur-2xl p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Aktivite</p>
        <h3 className="text-2xl font-semibold text-white mt-2">Son 7 Gün</h3>
        <p className="text-sm text-white/60">{tasksDone} görev ship'lediğiniz yoğun bir hafta.</p>
      </div>

      <div className="relative flex items-center justify-center">
          <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
            {activitySummary.map((ring, index) => {
              const radius = 80 - index * 20;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference * (1 - ring.value / 100);
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
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  opacity={0.85 - index * 0.25}
                  className="drop-shadow-[0_0_15px_rgba(255,30,86,0.35)]"
                />
              );
            })}
          </svg>
          <div className="absolute text-center rotate-90">
            <p className="text-4xl font-semibold text-white">84%</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">engage</p>
          </div>
      </div>

      <ul className="space-y-3">
        {activitySummary.map((ring) => (
          <li key={ring.label} className="flex items-center justify-between text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ring.color }} />
              {ring.label}
            </div>
            <span className="font-semibold text-white">{ring.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MemberGrid() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Üyeler</p>
          <h2 className="text-2xl font-semibold text-white">Tüm ekip</h2>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Hover → 3D flip</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockUsers.map((member, index) => (
          <Tilt key={member.id} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={1100}>
            <motion.div
              className="relative rounded-[26px] border border-white/10 bg-[#111316]/90 backdrop-blur-2xl p-5 overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <img src={member.avatarUrl} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#ff1e56]/30" />
                <div>
                  <p className="text-white font-semibold">{member.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/65">{member.lastComment}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-white/50">
                <span>{member.activeTasks} aktif görev</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>{member.online ? "online" : "offline"}</span>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}

function TeamBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
      {[...Array(3)].map((_, idx) => (
        <motion.div
          key={idx}
          className="absolute w-[55%] h-[360px] rounded-full blur-[140px]"
          style={{
            background: idx % 2 === 0 ? "rgba(255,0,110,0.18)" : "rgba(255,30,86,0.12)",
            top: idx === 0 ? "-10%" : idx === 1 ? "30%" : "65%",
            left: idx === 0 ? "5%" : idx === 1 ? "45%" : "20%",
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

