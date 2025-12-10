"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import { useAppStore } from "@/lib/store";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  Upload,
  Building2,
  Users,
  TrendingUp,
  FolderKanban,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  MoreVertical,
  Shield,
  Edit3,
  Eye,
  UserMinus,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: "admin" | "editor" | "viewer";
  activeTasks: number;
  lastActivity: string;
  online: boolean;
}

export default function TeamPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { sidebarWidth } = useSidebarContext();
  const { currentWorkspaceId, setWorkspace } = useAppStore();
  const { canInviteUser, canChangeRole, canRemoveUser, isAdmin } = usePermissions();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "admin" | "editor" | "viewer" | "online">("all");

  // Session'dan workspace ID al veya store'dan
  const workspaceId = session?.user?.workspaceId || currentWorkspaceId;

  // Users API çağrısı
  const { data: users, error, isLoading, mutate } = useSWR<TeamMember[]>(
    workspaceId ? `/api/users?workspaceId=${workspaceId}` : null,
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

  // Filtrelenmiş üyeler
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const matchesSearch =
        (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "online" && user.online) ||
        user.role === filter;

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, filter]);

  // İstatistikler
  const stats = React.useMemo(() => {
    if (!users) return null;
    const totalMembers = users.length;
    const onlineCount = users.filter((u) => u.online).length;
    const totalActiveTasks = users.reduce((sum, u) => sum + u.activeTasks, 0);

    // En aktif 3 kişi
    const topContributors = [...users]
      .sort((a, b) => b.activeTasks - a.activeTasks)
      .slice(0, 3);

    return {
      totalMembers,
      onlineCount,
      totalActiveTasks,
      topContributors,
    };
  }, [users]);

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
          <span>Takım verileri yüklenirken bir hata oluştu.</span>
        </div>
      </div>
    );
  }

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
              {canInviteUser && (
                <InviteButtonHeader workspaceId={workspaceId!} onSuccess={() => mutate()} />
              )}
            </header>

            {/* Ana Alan - 2 Sütun */}
            <div className="grid gap-6 lg:grid-cols-[65%_35%] grid-cols-1">
              {/* Sol: Ekip Grid */}
              <MemberGrid
                users={filteredUsers}
                currentUserId={session?.user?.id || ""}
                workspaceId={workspaceId!}
                canChangeRole={canChangeRole}
                canRemoveUser={canRemoveUser}
                onUpdate={() => mutate()}
              />

              {/* Sağ: İstatistikler */}
              {stats && <WorkspaceStats stats={stats} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MemberGrid({
  users,
  currentUserId,
  workspaceId,
  canChangeRole,
  canRemoveUser,
  onUpdate,
}: {
  users: TeamMember[];
  currentUserId: string;
  workspaceId: string;
  canChangeRole: boolean;
  canRemoveUser: boolean;
  onUpdate: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">{users.length} üye bulundu</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {users.map((user, index) => (
            <MemberCard
              key={user.id}
              user={user}
              index={index}
              isCurrentUser={user.id === currentUserId}
              workspaceId={workspaceId}
              canChangeRole={canChangeRole}
              canRemoveUser={canRemoveUser}
              onUpdate={onUpdate}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MemberCard({
  user,
  index,
  isCurrentUser,
  workspaceId,
  canChangeRole,
  canRemoveUser,
  onUpdate,
}: {
  user: TeamMember;
  index: number;
  isCurrentUser: boolean;
  workspaceId: string;
  canChangeRole: boolean;
  canRemoveUser: boolean;
  onUpdate: () => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/users/${user.id}?workspaceId=${workspaceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      onUpdate();
    } catch (error) {
      console.error("Role change error:", error);
    } finally {
      setIsUpdating(false);
      setShowMenu(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`${user.name || user.email} kullanıcısını ekipten çıkarmak istediğinize emin misiniz?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      await fetch(`/api/admin/users/${user.id}?workspaceId=${workspaceId}`, {
        method: "DELETE",
      });
      onUpdate();
    } catch (error) {
      console.error("Remove user error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const roleIcons = {
    admin: Shield,
    editor: Edit3,
    viewer: Eye,
  };
  const RoleIcon = roleIcons[user.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 380, damping: 28 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      <div
        className={cn(
          "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 cursor-pointer transition-all overflow-hidden",
          isHovered && "border-[#ff1e56]/50",
          isCurrentUser && "ring-1 ring-[#ff1e56]/30"
        )}
      >
        {isUpdating && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {/* Menu Button */}
        {(canChangeRole || canRemoveUser) && !isCurrentUser && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-10 right-3 z-30 min-w-[140px] rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
            {canChangeRole && (
              <>
                <button
                  onClick={() => handleRoleChange("admin")}
                  disabled={user.role === "admin"}
                  className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Admin Yap
                </button>
                <button
                  onClick={() => handleRoleChange("editor")}
                  disabled={user.role === "editor"}
                  className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Editor Yap
                </button>
                <button
                  onClick={() => handleRoleChange("viewer")}
                  disabled={user.role === "viewer"}
                  className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Viewer Yap
                </button>
              </>
            )}
            {canRemoveUser && (
              <button
                onClick={handleRemove}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <UserMinus className="w-4 h-4" /> Ekipten Çıkar
              </button>
            )}
          </div>
        )}

        <div className="relative z-10 space-y-4">
          {/* Avatar + İsim + Rol */}
          <div className="flex items-start gap-3">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "User"}
                  className={cn(
                    "w-14 h-14 rounded-xl object-cover border-2 transition-all",
                    isHovered ? "border-[#ff1e56]/60" : "border-white/20"
                  )}
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff1e56] to-[#ff006e] flex items-center justify-center text-white font-bold text-xl">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0a0a]",
                  user.online ? "bg-emerald-400" : "bg-white/30"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {user.name || "İsimsiz Kullanıcı"}
                {isCurrentUser && <span className="text-xs text-white/40 ml-1">(Sen)</span>}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 mt-1 text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border",
                  user.role === "admin" && "bg-[#ff1e56]/20 border-[#ff1e56]/40 text-[#ff1e56]",
                  user.role === "editor" && "bg-white/10 border-white/20 text-white/80",
                  user.role === "viewer" && "bg-white/5 border-white/10 text-white/60"
                )}
              >
                <RoleIcon className="w-3 h-3" />
                {user.role}
              </span>
            </div>
          </div>

          {/* Email */}
          <p className="text-xs text-white/50 truncate">{user.email}</p>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Clock className="w-3 h-3" />
              <span>{user.activeTasks} aktif görev</span>
            </div>
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

      {/* En Aktif Kişiler */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#ff1e56]" />
          <p className="text-sm font-semibold text-white">En Aktif Üyeler</p>
        </div>
        <div className="space-y-3">
          {stats.topContributors.map((member: TeamMember, index: number) => (
            <motion.div
              key={member.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 380, damping: 28 }}
            >
              <div className="relative">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name || "User"}
                    className="w-10 h-10 rounded-lg object-cover border border-[#ff1e56]/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff1e56] to-[#ff006e] flex items-center justify-center text-white font-bold">
                    {(member.name || member.email).charAt(0).toUpperCase()}
                  </div>
                )}
                {index === 0 && <span className="absolute -top-1 -right-1 text-xs">🏆</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {member.name || member.email}
                </p>
                <p className="text-xs text-white/60">{member.activeTasks} görev</p>
              </div>
              <div className="text-xs font-semibold text-[#ff1e56]">#{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toplam Aktif Görev */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/60 mb-1">Toplam Aktif Görev</p>
            <p className="text-2xl font-bold text-white">{stats.totalActiveTasks}</p>
          </div>
          <FolderKanban className="w-8 h-8 text-[#ff1e56]/50" />
        </div>
      </div>
    </div>
  );
}

function InviteButtonHeader({
  workspaceId,
  onSuccess,
}: {
  workspaceId: string;
  onSuccess: () => void;
}) {
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
        Üye Davet Et
      </motion.button>

      {showModal && (
        <InviteModal
          workspaceId={workspaceId}
          onClose={() => setShowModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}

function InviteModal({
  workspaceId,
  onClose,
  onSuccess,
}: {
  workspaceId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"editor" | "viewer">("editor");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleInvite = async () => {
    if (!email) {
      setError("E-posta adresi gerekli");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Davet gönderilemedi");
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

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

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Rol</label>
            <div className="flex gap-2">
              {[
                { value: "editor", label: "Editor", icon: Edit3 },
                { value: "viewer", label: "Viewer", icon: Eye },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRole(option.value as typeof role)}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                    role === option.value
                      ? "border-[#ff1e56]/50 bg-[#ff1e56]/10 text-white"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </motion.button>
            <motion.button
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInvite}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Davet Gönder"}
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
