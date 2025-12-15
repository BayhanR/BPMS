"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useAppStore } from "@/lib/store";
import {
  Plus,
  Building2,
  Users,
  FolderKanban,
  ChevronRight,
  Loader2,
  AlertCircle,
  Shield,
  Edit3,
  Eye,
  Check,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Workspace {
  id: string;
  name: string;
  userRole: "admin" | "editor" | "viewer";
  _count: {
    members: number;
    projects: number;
  };
  createdAt: string;
}

export default function WorkspacesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { setWorkspace } = useAppStore();

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] =
    React.useState<Workspace | null>(null);

  // Workspaces API çağrısı
  const { data: workspaces, error, isLoading, mutate } = useSWR<Workspace[]>(
    sessionStatus === "authenticated" ? "/api/workspaces" : null,
    fetcher
  );

  const handleSelectWorkspace = (workspace: Workspace) => {
    setWorkspace(workspace.id, workspace.userRole);
    router.push("/dashboard");
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute w-[50%] h-[400px] rounded-full blur-[140px] bg-[rgba(255,30,86,0.15)]"
          style={{ top: "-10%", left: "25%" }}
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[40%] h-[300px] rounded-full blur-[120px] bg-[rgba(255,0,110,0.1)]"
          style={{ bottom: "10%", right: "10%" }}
          animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Building2 className="w-16 h-16 text-[#ff1e56] mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Workspace Seç</h1>
          <p className="text-white/60 text-lg">
            Çalışmak istediğin workspace'i seç veya yeni bir tane oluştur
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8">
            <AlertCircle className="w-5 h-5" />
            <span>Workspace'ler yüklenirken bir hata oluştu.</span>
          </div>
        )}

        {/* Workspaces Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {workspaces?.map((workspace, index) => (
              <motion.button
                key={workspace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectWorkspace(workspace)}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-left hover:border-[#ff1e56]/50 transition-all"
              >
                {/* Selection indicator */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff1e56]/10 to-[#ff006e]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff1e56] to-[#ff006e] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {workspace.name}
                        </h3>
                        <RoleBadge role={workspace.userRole} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {workspace.userRole === "admin" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorkspaceToDelete(workspace);
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400 px-2 py-1 text-xs hover:bg-red-500/20 hover:border-red-500/60 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Sil
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{workspace._count.members} üye</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4" />
                      <span>{workspace._count.projects} proje</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Create New Workspace */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (workspaces?.length || 0) * 0.1 }}
            onClick={() => setShowCreateModal(true)}
            className="rounded-2xl border-2 border-dashed border-white/20 p-6 flex flex-col items-center justify-center gap-4 min-h-[160px] hover:border-[#ff1e56]/50 hover:bg-white/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-white/60" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white">Yeni Workspace</p>
              <p className="text-sm text-white/50">Ekibiniz için yeni bir alan oluşturun</p>
            </div>
          </motion.button>

          {/* Join Workspace */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ((workspaces?.length || 0) + 1) * 0.1 }}
            onClick={() => setShowJoinModal(true)}
            className="rounded-2xl border-2 border-dashed border-white/20 p-6 flex flex-col items-center justify-center gap-4 min-h-[160px] hover:border-blue-500/50 hover:bg-white/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-white/60" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white">Link ile Katıl</p>
              <p className="text-sm text-white/50">Davet linki ile workspace'e katılın</p>
            </div>
          </motion.button>
        </div>

        {/* Empty State */}
        {workspaces?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Henüz workspace yok</h3>
            <p className="text-white/60 mb-6">
              İlk workspace'inizi oluşturarak başlayın
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Workspace Oluştur
              </motion.button>
              <motion.button
                onClick={() => setShowJoinModal(true)}
                className="px-8 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LinkIcon className="w-5 h-5 inline mr-2" />
                Link ile Katıl
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateWorkspaceModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              mutate();
              setShowCreateModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <JoinWorkspaceModal
            onClose={() => setShowJoinModal(false)}
            onSuccess={() => {
              mutate();
              setShowJoinModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Workspace Modal */}
      <AnimatePresence>
        {workspaceToDelete && (
          <DeleteWorkspaceModal
            workspace={workspaceToDelete}
            onClose={() => setWorkspaceToDelete(null)}
            onDeleted={async () => {
              await mutate();
              setWorkspaceToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleBadge({ role }: { role: "admin" | "editor" | "viewer" }) {
  const roleConfig = {
    admin: { icon: Shield, color: "text-[#ff1e56] bg-[#ff1e56]/20", label: "Admin" },
    editor: { icon: Edit3, color: "text-blue-400 bg-blue-500/20", label: "Editor" },
    viewer: { icon: Eye, color: "text-white/60 bg-white/10", label: "Viewer" },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", config.color)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function CreateWorkspaceModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Workspace adı gerekli");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu");
      }
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff1e56] to-[#ff006e] flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Yeni Workspace
        </h3>
        <p className="text-sm text-white/60 text-center mb-6">
          Ekibiniz için yeni bir çalışma alanı oluşturun
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Workspace Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Şirket Adı"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff1e56]/50 focus:ring-2 focus:ring-[#ff1e56]/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              autoFocus
            />
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
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30 disabled:opacity-50 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Oluştur
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteWorkspaceModal({
  workspace,
  onClose,
  onDeleted,
}: {
  workspace: Workspace;
  onClose: () => void;
  onDeleted: () => void | Promise<void>;
}) {
  const [confirmText, setConfirmText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const requiredText = "SİL";
  const isValid = confirmText.trim().toUpperCase() === requiredText;

  const handleDelete = async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Workspace silinirken bir hata oluştu");
        return;
      }

      await onDeleted();
    } catch (err) {
      console.error("[DELETE_WORKSPACE] Error:", err);
      setError("Workspace silinirken bir hata oluştu");
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0a0a0a]/95 backdrop-blur-2xl p-8 shadow-[0_40px_140px_rgba(0,0,0,0.9)]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Workspace'i Sil
        </h3>
        <p className="text-sm text-white/60 text-center mb-4">
          <span className="font-semibold text-white">{workspace.name}</span>{" "}
          workspace'ini silmek üzeresiniz. Bu işlem geri alınamaz.
        </p>
        <p className="text-xs text-red-300 text-center mb-6">
          Onaylamak için aşağıdaki alana&nbsp;
          <span className="font-semibold">"{requiredText}"</span> yazın.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Onay Metni
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={requiredText}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValid) handleDelete();
              }}
              autoFocus
            />
            <p className="text-xs text-white/40 mt-1">
              Workspace'i kalıcı olarak silmek için büyük harflerle{" "}
              <span className="font-semibold text-red-300">
                {requiredText}
              </span>{" "}
              yazın.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isLoading}
            >
              Vazgeç
            </motion.button>
            <motion.button
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: isValid ? 1.02 : 1 }}
              whileTap={{ scale: isValid ? 0.98 : 1 }}
              onClick={handleDelete}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Workspace'i Sil
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function JoinWorkspaceModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [inviteLink, setInviteLink] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleJoin = async () => {
    if (!inviteLink.trim()) {
      setError("Davet linki gerekli");
      return;
    }

    // Link'ten token'ı çıkar
    const tokenMatch = inviteLink.match(/\/invite\/([a-zA-Z0-9]+)/);
    if (!tokenMatch) {
      setError("Geçersiz davet linki formatı");
      return;
    }

    const token = tokenMatch[1];
    setIsLoading(true);
    setError(null);

    try {
      // Token'ı kullanarak daveti kabul et
      const res = await fetch(`/api/invites/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        // Workspace'e katıldıktan sonra workspace'i seç ve dashboard'a git
        if (data.workspaceId) {
          const { setWorkspace } = useAppStore.getState();
          setWorkspace(data.workspaceId, data.role);
          onSuccess();
          router.push("/dashboard");
        } else {
          onSuccess();
          router.push("/workspaces");
        }
      } else {
        const data = await res.json();
        setError(data.error || "Davet kabul edilemedi");
      }
    } catch (err) {
      console.error("[JOIN_WORKSPACE] Error:", err);
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
          <LinkIcon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Workspace'e Katıl
        </h3>
        <p className="text-sm text-white/60 text-center mb-6">
          Davet linkini girerek workspace'e katılın
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Davet Linki
            </label>
            <input
              type="text"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="https://bpms.bayhan.tech/invite/xxx"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
              autoFocus
            />
            <p className="text-xs text-white/40 mt-1">
              Tam davet linkini yapıştırın
            </p>
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
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Katıl
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

