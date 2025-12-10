"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnId: string;
  onSubmit: (task: {
    title: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
    priority?: string;
  }) => void;
  members?: Member[];
  projectId?: string;
}

export function NewTaskModal({
  open,
  onOpenChange,
  columnId,
  onSubmit,
  members = [],
  projectId,
}: NewTaskModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [priority, setPriority] = React.useState("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssigneeId("");
    setPriority("medium");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <>
            <Dialog.Portal forceMount>
              {/* Overlay */}
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              {/* Modal */}
              <Dialog.Content asChild>
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                  }}
                >
                  <motion.div
                    className={cn(
                      "relative w-full max-w-2xl rounded-3xl border",
                      "bg-white/10 backdrop-blur-2xl",
                      "border-white/20",
                      "shadow-2xl",
                      "overflow-hidden"
                    )}
                    style={{
                      boxShadow: "0 30px 80px rgba(255, 30, 86, 0.32), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                    }}
                  >
                    {/* Crimson Glow */}
                    <motion.div
                      className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-accent blur-xl opacity-50"
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative z-10 p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-2xl font-bold text-white">
                          Yeni Task Oluştur
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <motion.button
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4 text-white" />
                          </motion.button>
                        </Dialog.Close>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Başlık
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            placeholder="Task başlığını girin..."
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Açıklama (Opsiyonel)
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                            placeholder="Task açıklamasını girin..."
                          />
                        </div>

                        {/* Assignee */}
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Atanan Kişi (Opsiyonel)
                          </label>
                          <select
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          >
                            <option value="" className="bg-[#1a1a1a]">Kimse seçilmedi</option>
                            {members.map((member) => (
                              <option key={member.id} value={member.id} className="bg-[#1a1a1a]">
                                {member.name || member.email}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Priority */}
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Öncelik
                          </label>
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          >
                            <option value="low" className="bg-[#1a1a1a]">Düşük</option>
                            <option value="medium" className="bg-[#1a1a1a]">Orta</option>
                            <option value="high" className="bg-[#1a1a1a]">Yüksek</option>
                            <option value="urgent" className="bg-[#1a1a1a]">Acil</option>
                          </select>
                        </div>

                        {/* Due Date */}
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Bitiş Tarihi (Opsiyonel)
                          </label>
                          <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                          <Dialog.Close asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                              İptal
                            </Button>
                          </Dialog.Close>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              type="submit"
                              className="px-6 bg-gradient-to-r from-primary to-accent text-white hover:brightness-110 transition-all shadow-lg shadow-primary/30"
                            >
                              Oluştur
                            </Button>
                          </motion.div>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

