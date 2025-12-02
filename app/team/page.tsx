"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import { mockUsers, mockTasks, mockProjects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Plus, Search, Upload, Building2, Users, TrendingUp, FolderKanban, Clock, CheckCircle2 } from "lucide-react";

const workspaceName = "Bayhan Core Workspace";

// Genişletilmiş mock üyeler (12-15 kişi)
const extendedUsers = [
  ...mockUsers,
  { id: "u-ali", name: "Ali Yılmaz", email: "ali@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=1", role: "editor" as const, online: true, activeTasks: 7 },
  { id: "u-zeynep", name: "Zeynep Demir", email: "zeynep@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=12", role: "admin" as const, online: false, activeTasks: 4 },
  { id: "u-can", name: "Can Öztürk", email: "can@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=33", role: "editor" as const, online: true, activeTasks: 9 },
  { id: "u-ayse", name: "Ayşe Kaya", email: "ayse@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=28", role: "viewer" as const, online: true, activeTasks: 2 },
  { id: "u-mehmet", name: "Mehmet Arslan", email: "mehmet@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=8", role: "editor" as const, online: false, activeTasks: 6 },
  { id: "u-elif", name: "Elif Şahin", email: "elif@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=45", role: "admin" as const, online: true, activeTasks: 11 },
  { id: "u-kerem", name: "Kerem Çelik", email: "kerem@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=19", role: "editor" as const, online: true, activeTasks: 5 },
  { id: "u-deniz", name: "Deniz Aydın", email: "deniz@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=52", role: "viewer" as const, online: false, activeTasks: 3 },
  { id: "u-berkay", name: "Berkay Yıldız", email: "berkay@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=16", role: "editor" as const, online: true, activeTasks: 8 },
  { id: "u-selin", name: "Selin Özdemir", email: "selin@bpms.io", avatarUrl: "https://i.pravatar.cc/120?img=37", role: "admin" as const, online: true, activeTasks: 10 },
];

// Her üye için random proje tag'leri
const getUserProjects = (userId: string) => {
  const userProjects = mockProjects
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map((p) => ({ id: p.id, name: p.name, color: p.color }));
  return userProjects;
};

// Bu hafta tamamlanan task sayısı (mock)
const getWeekTasks = (userId: string) => {
  return Math.floor(Math.random() * 12) + 1;
};

// Son görülme (mock)
const getLastSeen = (online: boolean) => {
  if (online) return "Şu an aktif";
  const hours = Math.floor(Math.random() * 48);
  if (hours === 0) return "Az önce";
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours / 24)} gün önce`;
};

export default function TeamPage() {
  const { sidebarWidth } = useSidebarContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "admin" | "editor" | "viewer" | "online">("all");

  // Filtrelenmiş üyeler
  const filteredUsers = React.useMemo(() => {
    return extendedUsers.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filter === "all" ||
                           filter === "online" && user.online ||
                           user.role === filter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  // Workspace istatistikleri
  const stats = React.useMemo(() => {
    const totalMembers = extendedUsers.length;
    const onlineCount = extendedUsers.filter((u) => u.online).length;
    const thisWeekTasks = mockTasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return task.status === "done" && taskDate >= weekAgo;
    }).length;

    // Bu hafta en aktif 3 kişi
    const weeklyStats = extendedUsers.map((user) => ({
      ...user,
      weekTasks: getWeekTasks(user.id),
    })).sort((a, b) => b.weekTasks - a.weekTasks).slice(0, 3);

    return {
      totalMembers,
      onlineCount,
      weekTasks: thisWeekTasks,
      activeProjects: mockProjects.length,
      pendingInvites: 3,
      topContributors: weeklyStats,
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-h-0"
        style={{
          paddingLeft: sidebarWidth,
          transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <TeamBackdrop />
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative min-h-0">
          <div className="relative z-10 max-w-[1800px] mx-auto space-y-6">
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-4xl font-bold text-white">Ekip</h1>

              <div className="flex items-center gap-4 flex-1 max-w-2xl">
                {/* Arama */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Üye ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff1e56]/50 focus:border-[#ff1e56]/50 transition-all"
                  />
                </div>

                {/* Filtreler */}
                <div className="flex items-center gap-2">
                  {[
                    { label: "Tümü", value: "all" },
                    { label: "Admin", value: "admin" },
                    { label: "Editor", value: "editor" },
                    { label: "Viewer", value: "viewer" },
                    { label: "Online", value: "online" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value as typeof filter)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        filter === option.value
                          ? "bg-[#ff1e56] text-white shadow-lg shadow-[#ff1e56]/30"
                          : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invite Member */}
              <InviteButtonHeader />
            </header>

            {/* Ana Alan - 2 Sütun */}
            <div className="grid gap-6 lg:grid-cols-[65%_35%] grid-cols-1">
              {/* Sol: Ekip Grid */}
              <MemberGrid users={filteredUsers} />

              {/* Sağ: Workspace İstatistikleri */}
              <WorkspaceStats stats={stats} />
            </div>
          </div>

          {/* Alt Sabit Butonlar */}
          <FixedBottomButtons />
        </main>
      </div>
    </div>
  );
}

function MemberGrid({ users }: { users: typeof extendedUsers }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">{users.length} üye bulundu</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {users.map((user, index) => (
            <MemberCard key={user.id} user={user} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MemberCard({ user, index }: { user: typeof extendedUsers[number]; index: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const userProjects = getUserProjects(user.id);
  const weekTasks = getWeekTasks(user.id);
  const lastSeen = getLastSeen(user.online);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        delay: index * 0.03,
        type: "spring",
        stiffness: 380,
        damping: 28,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 cursor-pointer transition-all overflow-hidden",
          isHovered && "border-[#ff1e56]/50"
        )}
      >
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          style={{
            background: `radial-gradient(circle at center, rgba(255,30,86,0.3), transparent 70%)`,
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Avatar + İsim + Rol */}
          <div className="flex items-start gap-3">
            <div className="relative">
              <motion.img
                src={user.avatarUrl}
                alt={user.name}
                className={cn(
                  "w-14 h-14 rounded-xl object-cover border-2 transition-all",
                  isHovered ? "border-[#ff1e56]/60 shadow-lg shadow-[#ff1e56]/30" : "border-white/20"
                )}
                animate={{ scale: isHovered ? 1.05 : 1 }}
              />
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0a0a]",
                  user.online ? "bg-emerald-400" : "bg-white/30"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <span className={cn(
                "inline-block mt-1 text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border",
                user.role === "admin" && "bg-[#ff1e56]/20 border-[#ff1e56]/40 text-[#ff1e56]",
                user.role === "editor" && "bg-white/10 border-white/20 text-white/80",
                user.role === "viewer" && "bg-white/5 border-white/10 text-white/60"
              )}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Online durum */}
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Clock className="w-3 h-3" />
            <span>{lastSeen}</span>
          </div>

          {/* Proje Tag'leri */}
          {userProjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {userProjects.slice(0, 3).map((project) => (
                <span
                  key={project.id}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium border"
                  style={{
                    backgroundColor: `${project.color}20`,
                    borderColor: `${project.color}40`,
                    color: project.color,
                  }}
                >
                  {project.name.split(" ")[0]}
                </span>
              ))}
              {userProjects.length > 3 && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-medium bg-white/5 border border-white/10 text-white/60">
                  +{userProjects.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Bu hafta task sayısı / Profiline Git butonu - aynı yerde fade */}
          <div className="pt-2 border-t border-white/10 relative min-h-[60px] flex items-center">
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.div
                  key="week-tasks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white/50" />
                    <span className="text-xs text-white/60">Bu hafta</span>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 40 40">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="transparent"
                        stroke="#ff1e56"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 16 * (1 - Math.min(weekTasks / 15, 1)),
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{weekTasks}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="profile-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold text-sm shadow-lg shadow-[#ff1e56]/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Profiline Git
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WorkspaceStats({ stats }: { stats: any }) {
  return (
    <div className="space-y-4">
      {/* Toplam Üye */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ff1e56]" />
            <p className="text-sm font-medium text-white/60">Toplam Üye</p>
          </div>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{stats.totalMembers}</p>
        <p className="text-xs text-white/50">{stats.onlineCount} şu an online</p>
      </div>

      {/* En Aktif 3 Kişi */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#ff1e56]" />
          <p className="text-sm font-semibold text-white">Bu Hafta En Aktif</p>
        </div>
        <div className="space-y-3">
          {stats.topContributors.map((member: any, index: number) => (
            <motion.div
              key={member.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 380,
                damping: 28,
              }}
            >
              <div className="relative">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-10 h-10 rounded-lg object-cover border border-[#ff1e56]/40"
                />
                {index === 0 && (
                  <span className="absolute -top-1 -right-1 text-xs">🏆</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{member.name}</p>
                <p className="text-xs text-white/60">{member.weekTasks} görev</p>
              </div>
              <div className="text-xs font-semibold text-[#ff1e56]">#{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Workspace Velocity */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FolderKanban className="w-5 h-5 text-[#ff1e56]" />
          <p className="text-sm font-semibold text-white">Velocity</p>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{stats.weekTasks}</p>
        <p className="text-xs text-white/50">Son 7 gün tamamlanan görev</p>
      </div>

      {/* Aktif Proje */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/60 mb-1">Aktif Proje</p>
            <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
          </div>
          <FolderKanban className="w-8 h-8 text-[#ff1e56]/50" />
        </div>
      </div>

      {/* Pending Invites */}
      {stats.pendingInvites > 0 && (
        <div className="rounded-2xl border border-[#ff1e56]/40 bg-[#ff1e56]/10 backdrop-blur-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">Bekleyen Davetler</p>
              <p className="text-2xl font-bold text-white">{stats.pendingInvites}</p>
            </div>
            <div className="relative">
              <Users className="w-8 h-8 text-[#ff1e56]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff1e56] text-white text-xs flex items-center justify-center font-bold">
                {stats.pendingInvites}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InviteButtonHeader() {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <motion.button
        className="h-12 px-6 rounded-full bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30 flex items-center gap-2"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
      >
        <Plus className="w-5 h-5" />
        Invite Member
      </motion.button>

      {showModal && <InviteModal onClose={() => setShowModal(false)} />}
    </>
  );
}

function FixedBottomButtons() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
      <motion.button
        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-white font-medium flex items-center gap-2 shadow-lg"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Upload className="w-5 h-5" />
        Bulk Invite (CSV)
      </motion.button>

      <motion.button
        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-white font-medium flex items-center gap-2 shadow-lg"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Building2 className="w-5 h-5" />
        Departman Ekle
      </motion.button>
    </div>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = React.useState("");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Üye Davet Et</h3>
        <p className="text-sm text-white/60 mb-6">E-posta adresi ile yeni üye davet edin</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff1e56]/50 focus:ring-2 focus:ring-[#ff1e56]/20 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <motion.button
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              İptal
            </motion.button>
            <motion.button
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose();
              }}
            >
              Davet Gönder
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TeamBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
      {[...Array(3)].map((_, idx) => (
        <motion.div
          key={idx}
          className="absolute w-[55%] h-[360px] rounded-full blur-[140px]"
          style={{
            background: idx % 2 === 0 ? "rgba(255,0,110,0.15)" : "rgba(255,30,86,0.12)",
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
