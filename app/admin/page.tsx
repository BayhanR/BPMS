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
  Users,
  Settings,
  Shield,
  Edit3,
  Eye,
  UserMinus,
  Loader2,
  AlertCircle,
  ChevronDown,
  Search,
  Building2,
  Mail,
  Plus,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: "admin" | "editor" | "viewer";
  activeTasks: number;
  completedTasks: number;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { sidebarWidth } = useSidebarContext();
  const { currentWorkspaceId, setWorkspace } = useAppStore();
  const { isAdmin, isLoading: permissionsLoading } = usePermissions();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"users" | "settings">("users");

  // Session'dan workspace ID al veya store'dan
  const workspaceId = session?.user?.workspaceId || currentWorkspaceId;

  // Admin users API çağrısı
  const { data: users, error, isLoading, mutate } = useSWR<AdminUser[]>(
    workspaceId && isAdmin ? `/api/admin/users?workspaceId=${workspaceId}` : null,
    fetcher
  );

  // Workspace bilgisi
  const { data: workspace } = useSWR(
    workspaceId ? `/api/workspaces/${workspaceId}` : null,
    fetcher
  );

  // Workspace ID'yi store'a kaydet
  React.useEffect(() => {
    if (session?.user?.workspaceId && session?.user?.role) {
      setWorkspace(session.user.workspaceId, session.user.role);
    }
  }, [session?.user?.workspaceId, session?.user?.role, setWorkspace]);

  // Admin değilse yönlendir
  React.useEffect(() => {
    if (sessionStatus === "authenticated" && !permissionsLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [sessionStatus, permissionsLoading, isAdmin, router]);

  // Workspace yoksa workspace seçim sayfasına yönlendir
  React.useEffect(() => {
    if (sessionStatus === "authenticated" && !workspaceId) {
      router.push("/workspaces");
    }
  }, [sessionStatus, workspaceId, router]);

  // Filtrelenmiş kullanıcılar
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((user) =>
      (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  if (sessionStatus === "loading" || permissionsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Yetkisiz Erişim</h1>
          <p className="text-white/60">Bu sayfayı görüntülemek için admin yetkisi gereklidir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0" style={contentStyle}>
        <AdminBackdrop />
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative min-h-0">
          <div className="relative z-10 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white">Admin Paneli</h1>
                <p className="text-white/60">
                  {workspace?.name || "Workspace"} · {users?.length || 0} üye
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Tabs */}
                <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
                  {[
                    { id: "users", label: "Kullanıcılar", icon: Users },
                    { id: "settings", label: "Ayarlar", icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        activeTab === tab.id
                          ? "bg-[#ff1e56] text-white"
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                {/* Search & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      placeholder="Kullanıcı ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff1e56]/50"
                    />
                  </div>

                  <motion.button
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/team")}
                  >
                    <Plus className="w-5 h-5" />
                    Üye Davet Et
                  </motion.button>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Kullanıcılar yüklenirken bir hata oluştu.</span>
                  </div>
                )}

                {/* Users Table */}
                {!isLoading && !error && users && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                            Kullanıcı
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                            Rol
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                            Aktif Görev
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                            Tamamlanan
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <UserRow
                            key={user.id}
                            user={user}
                            workspaceId={workspaceId!}
                            currentUserId={session?.user?.id || ""}
                            onUpdate={() => mutate()}
                          />
                        ))}
                      </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                      <div className="text-center py-12 text-white/40">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Kullanıcı bulunamadı.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <WorkspaceSettings workspace={workspace} workspaceId={workspaceId!} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function UserRow({
  user,
  workspaceId,
  currentUserId,
  onUpdate,
}: {
  user: AdminUser;
  workspaceId: string;
  currentUserId: string;
  onUpdate: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const isCurrentUser = user.id === currentUserId;

  const roleIcons = {
    admin: Shield,
    editor: Edit3,
    viewer: Eye,
  };
  const RoleIcon = roleIcons[user.role];

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
      setIsOpen(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`${user.name || user.email} kullanıcısını silmek istediğinize emin misiniz?`)) {
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

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff1e56] to-[#ff006e] flex items-center justify-center text-white font-bold">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-white">
              {user.name || "İsimsiz"}
              {isCurrentUser && <span className="text-xs text-white/40 ml-1">(Sen)</span>}
            </p>
            <p className="text-sm text-white/50">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
            user.role === "admin" && "bg-[#ff1e56]/20 text-[#ff1e56]",
            user.role === "editor" && "bg-blue-500/20 text-blue-400",
            user.role === "viewer" && "bg-white/10 text-white/60"
          )}
        >
          <RoleIcon className="w-3 h-3" />
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-white">{user.activeTasks}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-white">{user.completedTasks}</span>
      </td>
      <td className="px-6 py-4">
        {!isCurrentUser && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              disabled={isUpdating}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ChevronDown className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")} />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-1 z-30 min-w-[160px] rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden"
                >
                  <button
                    onClick={() => handleRoleChange("admin")}
                    disabled={user.role === "admin"}
                    className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" /> Admin Yap
                  </button>
                  <button
                    onClick={() => handleRoleChange("editor")}
                    disabled={user.role === "editor"}
                    className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Editor Yap
                  </button>
                  <button
                    onClick={() => handleRoleChange("viewer")}
                    disabled={user.role === "viewer"}
                    className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Viewer Yap
                  </button>
                  <div className="border-t border-white/10" />
                  <button
                    onClick={handleRemove}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <UserMinus className="w-4 h-4" /> Kullanıcıyı Sil
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </td>
    </tr>
  );
}

function WorkspaceSettings({
  workspace,
  workspaceId,
}: {
  workspace: any;
  workspaceId: string;
}) {
  const [name, setName] = React.useState(workspace?.name || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    if (workspace?.name) {
      setName(workspace.name);
    }
  }, [workspace?.name]);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Workspace adı boş olamaz" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Ayarlar kaydedildi" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Bir hata oluştu" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#ff1e56]" />
          Workspace Ayarları
        </h2>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Workspace Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff1e56]/50 focus:ring-2 focus:ring-[#ff1e56]/20"
            />
          </div>

          {message && (
            <div
              className={cn(
                "p-3 rounded-xl text-sm",
                message.type === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              )}
            >
              {message.text}
            </div>
          )}

          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Kaydet"}
          </motion.button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4">Tehlikeli Bölge</h2>
        <p className="text-white/60 text-sm mb-4">
          Workspace'i silmek tüm projeleri, görevleri ve üyelikleri kalıcı olarak siler. Bu işlem geri alınamaz.
        </p>
        <motion.button
          className="px-6 py-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (confirm("Bu workspace'i silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
              // Delete workspace
            }
          }}
        >
          Workspace'i Sil
        </motion.button>
      </div>
    </div>
  );
}

function AdminBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
      <motion.div
        className="absolute w-[60%] h-[400px] rounded-full blur-[140px] bg-[rgba(255,30,86,0.12)]"
        style={{ top: "-15%", left: "20%" }}
        animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

