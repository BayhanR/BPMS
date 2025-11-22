"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export function NotificationsDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeColors = {
    info: "#6366f1",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
          className={cn(
            "relative w-10 h-10 rounded-xl",
            "bg-white/5 border border-white/10",
            "flex items-center justify-center",
            "hover:bg-white/10 transition-colors"
          )}
          whileHover={{
            scale: 1.1,
            transition: {
              type: "spring",
              stiffness: 150,
              damping: 20,
            },
          }}
          whileTap={{
            scale: 0.95,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25,
            },
          }}
        >
          <Bell className="w-4 h-4 text-white" />
          {unreadCount > 0 && (
            <motion.span
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              align="end"
              sideOffset={10}
              className="w-80"
            >
              <motion.div
                className={cn(
                  "rounded-2xl border border-white/20",
                  "bg-white/10 backdrop-blur-2xl",
                  "shadow-2xl overflow-hidden"
                )}
                initial={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(10px)" }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                style={{
                  boxShadow: "0 20px 60px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                }}
              >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Bildirimler</h3>
                  {unreadCount > 0 && (
                    <motion.button
                      onClick={onMarkAllAsRead}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Tümünü okundu işaretle
                    </motion.button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-white/50 text-sm">
                      Bildirim yok
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className={cn(
                          "p-4 border-b border-white/10 cursor-pointer transition-colors",
                          !notification.read && "bg-purple-500/10 hover:bg-purple-500/20",
                          notification.read && "hover:bg-white/5"
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.03,
                          type: "spring",
                          stiffness: 150,
                          damping: 20,
                        }}
                        onClick={() => onMarkAsRead?.(notification.id)}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                            style={{
                              backgroundColor: typeColors[notification.type],
                              boxShadow: `0 0 8px ${typeColors[notification.type]}`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm font-semibold mb-1", notification.read ? "text-white/70" : "text-white")}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-white/60 mb-2">{notification.message}</p>
                            <p className="text-xs text-white/40">
                              {notification.timestamp.toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <motion.div
                              className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-2"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}

