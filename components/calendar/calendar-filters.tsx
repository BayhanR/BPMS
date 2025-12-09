"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarFiltersProps {
  projects: Array<{ id: string; name: string; color: string }>;
  users: Array<{ id: string; name?: string; email: string }>;
  selectedProjectId?: string;
  selectedUserId?: string;
  selectedStatus?: string;
  onProjectChange: (projectId?: string) => void;
  onUserChange: (userId?: string) => void;
  onStatusChange: (status?: string) => void;
  onClear: () => void;
}

export function CalendarFilters({
  projects,
  users,
  selectedProjectId,
  selectedUserId,
  selectedStatus,
  onProjectChange,
  onUserChange,
  onStatusChange,
  onClear,
}: CalendarFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasFilters = selectedProjectId || selectedUserId || selectedStatus;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2",
          hasFilters
            ? "bg-primary/20 border-primary/40 text-primary"
            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Filter className="w-4 h-4" />
        Filtrele
        {hasFilters && (
          <span className="w-2 h-2 rounded-full bg-primary" />
        )}
      </motion.button>

      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            className="absolute top-full mt-2 right-0 w-80 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 z-50 shadow-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Filtreler</h3>
                {hasFilters && (
                  <button
                    onClick={onClear}
                    className="text-xs text-primary hover:text-accent transition-colors"
                  >
                    Temizle
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Proje</label>
                <select
                  value={selectedProjectId || ""}
                  onChange={(e) => onProjectChange(e.target.value || undefined)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Tüm Projeler</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Atanan Kişi</label>
                <select
                  value={selectedUserId || ""}
                  onChange={(e) => onUserChange(e.target.value || undefined)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Tüm Kullanıcılar</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Durum</label>
                <select
                  value={selectedStatus || ""}
                  onChange={(e) => onStatusChange(e.target.value || undefined)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="todo">Yapılacak</option>
                  <option value="doing">Yapılıyor</option>
                  <option value="done">Tamamlandı</option>
                </select>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

