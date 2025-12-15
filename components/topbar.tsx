"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Sun, Moon, User, LogOut, Building2, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "./notifications-dropdown";
import { signOut, useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TopbarProps {
  className?: string;
}

export function Topbar({ className }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { currentWorkspaceId, reset } = useAppStore();
  const [mounted, setMounted] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  // Workspace bilgisini çek
  const { data: workspace } = useSWR(
    currentWorkspaceId ? `/api/workspaces/${currentWorkspaceId}` : null,
    fetcher
  );

  // Gerçek bildirimleri çek (şimdilik boş array)
  const notifications: any[] = [];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    reset(); // Store'u temizle
    await signOut({ callbackUrl: "/" }); // Landing page'e yönlendir
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 h-16",
        "bg-white/5 backdrop-blur-2xl border-b border-white/10",
        "flex items-center justify-between px-6",
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      style={{
        boxShadow: "0 4px 24px rgba(255, 30, 86, 0.15)",
      }}
    >
      {/* Search */}
      <motion.div
        className="relative flex-1 max-w-md"
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          placeholder="Search projects, tasks..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <motion.button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "relative w-10 h-10 rounded-xl",
            "bg-white/5 border border-white/10",
            "flex items-center justify-center",
            "hover:bg-white/10 transition-colors",
            "group overflow-hidden"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {mounted && (
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-white relative z-10" />
              ) : (
                <Sun className="w-4 h-4 text-white relative z-10" />
              )}
            </motion.div>
          )}
        </motion.button>

        {/* Workspace Badge */}
        {workspace && (
          <Link href="/workspaces">
            <motion.div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80 font-medium max-w-[120px] truncate">
                {workspace.name}
              </span>
            </motion.div>
          </Link>
        )}

        {/* Notifications */}
        <NotificationsDropdown
          notifications={notifications}
          onMarkAsRead={(id) => console.log("Mark as read:", id)}
          onMarkAllAsRead={() => console.log("Mark all as read")}
        />

        {/* Avatar / Profile */}
        <div className="relative">
          <motion.button
            className={cn(
              "w-10 h-10 rounded-full",
              "bg-gradient-to-br from-primary to-accent",
              "flex items-center justify-center",
              "border-2 border-white/20",
              "hover:border-white/40 transition-colors"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen((p) => !p)}
          >
            {session?.user?.name ? (
              <span className="text-white font-bold text-sm">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </motion.button>

          {profileOpen && (
            <motion.div
              className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || "Kullanıcı"}
                </p>
                <p className="text-xs text-white/50 truncate">
                  {session?.user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link href="/settings" onClick={() => setProfileOpen(false)}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/80 hover:bg-white/10 transition-colors cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Ayarlar
                  </div>
                </Link>
                <Link href="/workspaces" onClick={() => setProfileOpen(false)}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/80 hover:bg-white/10 transition-colors cursor-pointer">
                    <Building2 className="w-4 h-4" />
                    Workspace Değiştir
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

