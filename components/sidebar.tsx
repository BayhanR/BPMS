"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Settings,
  Users,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ collapsed: initialCollapsed = false, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(initialCollapsed);
  const [hovered, setHovered] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isExpanded = isMobile ? mobileOpen : (collapsed ? hovered : true);

  const toggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
    onToggle?.();
  };

  // Mobile overlay
  if (isMobile && mobileOpen) {
    return (
      <>
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
        />
        <motion.aside
          className={cn(
            "fixed left-0 top-0 h-screen z-50",
            "bg-white/5 backdrop-blur-2xl border-r border-white/10",
            "w-80"
          )}
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
          }}
          style={{
            boxShadow: "4px 0 24px rgba(139, 92, 246, 0.1)",
          }}
        >
          {/* Mobile sidebar content */}
          <SidebarContent
            isExpanded={true}
            onToggle={toggle}
            isMobile={true}
          />
        </motion.aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <motion.button
          className={cn(
            "fixed top-4 left-4 z-50",
            "w-12 h-12 rounded-xl",
            "bg-white/10 backdrop-blur-xl border border-white/20",
            "flex items-center justify-center",
            "shadow-lg"
          )}
          onClick={toggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-6 h-6 text-white" />
        </motion.button>
      )}

      <motion.aside
        className={cn(
          "fixed left-0 top-0 h-screen z-50",
          "bg-white/5 backdrop-blur-2xl border-r border-white/10",
          "transition-all duration-300 ease-out",
          isMobile && "hidden"
        )}
        initial={false}
        animate={{
          width: isExpanded ? 280 : 80,
        }}
        onHoverStart={() => !isMobile && setHovered(true)}
        onHoverEnd={() => !isMobile && setHovered(false)}
        style={{
          boxShadow: "4px 0 24px rgba(139, 92, 246, 0.1)",
        }}
      >
        <SidebarContent
          isExpanded={isExpanded}
          onToggle={toggle}
          isMobile={false}
        />
      </motion.aside>
    </>
  );
}

function SidebarContent({
  isExpanded,
  onToggle,
  isMobile,
}: {
  isExpanded: boolean;
  onToggle: () => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex flex-col h-full p-4">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between mb-8">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  BPMS
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={onToggle}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobile || !isExpanded ? (
              <X className="w-5 h-5 text-white/70" />
            ) : (
              <Menu className="w-5 h-5 text-white/70" />
            )}
          </motion.button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl",
                "text-white/70 hover:text-white transition-colors",
                "bg-white/0 hover:bg-white/10",
                "relative group overflow-hidden"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Active Indicator */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100"
                initial={false}
              />
            </motion.a>
          ))}
        </nav>

        {/* User Profile */}
        <motion.div
          className={cn(
            "mt-auto p-3 rounded-xl bg-white/5 border border-white/10",
            "flex items-center gap-3"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  Bayhan
                </p>
                <p className="text-xs text-white/50 truncate">
                  bayhan@example.com
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
  );
}

