"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import {
  Building2,
  Shield,
  Edit3,
  Eye,
  Check,
  X,
  Loader2,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface InviteData {
  id: string;
  workspace: {
    id: string;
    name: string;
  };
  role: "admin" | "editor" | "viewer";
  email: string | null;
  expiresAt: string;
  error?: string;
}

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const token = params.token as string;

  const [isAccepting, setIsAccepting] = React.useState(false);
  const [acceptError, setAcceptError] = React.useState<string | null>(null);
  const [accepted, setAccepted] = React.useState(false);

  // Davet bilgisini çek
  const { data: invite, error, isLoading } = useSWR<InviteData>(
    token ? `/api/invites/${token}` : null,
    fetcher
  );

  const roleConfig = {
    admin: { icon: Shield, label: "Admin", color: "text-[#ff1e56] bg-[#ff1e56]/20" },
    editor: { icon: Edit3, label: "Editor", color: "text-blue-400 bg-blue-500/20" },
    viewer: { icon: Eye, label: "Viewer", color: "text-white/60 bg-white/10" },
  };

  const handleAccept = async () => {
    if (!session?.user?.id) {
      // Giriş yapmamışsa signin'e yönlendir, sonra geri gel
      router.push(`/signin?callbackUrl=/invite/${token}`);
      return;
    }

    setIsAccepting(true);
    setAcceptError(null);

    try {
      const res = await fetch(`/api/invites/${token}`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setAccepted(true);
        // 2 saniye sonra workspace'e yönlendir
        setTimeout(() => {
          router.push("/workspaces");
        }, 2000);
      } else {
        setAcceptError(data.error || "Bir hata oluştu");
      }
    } catch (err) {
      setAcceptError("Bir hata oluştu");
    } finally {
      setIsAccepting(false);
    }
  };

  // Loading state
  if (isLoading || sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Error state
  if (error || invite?.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Geçersiz Davet</h1>
          <p className="text-white/60 mb-6">
            {invite?.error || "Bu davet linki geçersiz, süresi dolmuş veya zaten kullanılmış."}
          </p>
          <Link href="/workspaces">
            <motion.button
              className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Workspace'lere Git
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Accepted state
  if (accepted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            className="w-20 h-20 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Check className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Hoş Geldin! 🎉</h1>
          <p className="text-white/60 mb-2">
            <span className="text-white font-semibold">{invite?.workspace.name}</span> workspace'ine
            katıldın.
          </p>
          <p className="text-white/40 text-sm">Yönlendiriliyorsun...</p>
        </motion.div>
      </div>
    );
  }

  const role = invite?.role || "editor";
  const RoleIcon = roleConfig[role].icon;

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
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-16 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff1e56] to-[#ff006e] flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">Workspace'e Davet Edildin!</h1>
            <p className="text-white/60 mb-6">
              Aşağıdaki workspace'e katılmak için daveti kabul et
            </p>

            {/* Workspace Info */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff1e56] to-[#ff006e] flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-white">{invite?.workspace.name}</h2>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                    roleConfig[role].color
                  )}>
                    <RoleIcon className="w-3 h-3" />
                    {roleConfig[role].label} olarak
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {acceptError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{acceptError}</span>
              </div>
            )}

            {/* Login Notice */}
            {sessionStatus === "unauthenticated" && (
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-6">
                Daveti kabul etmek için önce giriş yapmalısın.
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/workspaces" className="flex-1">
                <motion.button
                  className="w-full px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reddet
                </motion.button>
              </Link>
              <motion.button
                onClick={handleAccept}
                disabled={isAccepting}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold shadow-lg shadow-[#ff1e56]/30 disabled:opacity-50 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAccepting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {sessionStatus === "unauthenticated" ? "Giriş Yap & Kabul Et" : "Kabul Et"}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

