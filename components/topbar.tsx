"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Sun, Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "./notifications-dropdown";

const mockNotifications = [
  {
    id: "1",
    title: "Yeni görev atandı",
    message: "Web Portal Redesign projesine atandınız",
    timestamp: new Date(),
    read: false,
    type: "info" as const,
  },
  {
    id: "2",
    title: "Görev tamamlandı",
    message: "API Integration görevi tamamlandı",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    type: "success" as const,
  },
  {
    id: "3",
    title: "Yorum eklendi",
    message: "John Doe bir yorum ekledi",
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    type: "info" as const,
  },
];

interface TopbarProps {
  className?: string;
}

export function Topbar({ className }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

        {/* Notifications */}
        <NotificationsDropdown
          notifications={mockNotifications}
          onMarkAsRead={(id) => console.log("Mark as read:", id)}
          onMarkAllAsRead={() => console.log("Mark all as read")}
        />

        {/* Avatar */}
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
        >
          <User className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </motion.header>
  );
}

