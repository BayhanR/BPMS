"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, Clock, Tag, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  task?: {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    startTime?: string;
    endTime?: string;
    priority?: string;
    projectId?: string;
    assigneeId?: string;
  } | null;
  projects?: Array<{ id: string; name: string; color: string }>;
  users?: Array<{ id: string; name?: string; email: string }>;
  onSubmit: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    startTime?: string;
    endTime?: string;
    priority?: string;
    projectId?: string;
    assigneeId?: string;
  }) => Promise<void>;
}

export function TaskModal({
  open,
  onOpenChange,
  selectedDate,
  task,
  projects = [],
  users = [],
  onSubmit,
}: TaskModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [priority, setPriority] = React.useState("medium");
  const [projectId, setProjectId] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
      setStartTime(task.startTime ? new Date(task.startTime).toISOString().slice(11, 16) : "");
      setEndTime(task.endTime ? new Date(task.endTime).toISOString().slice(11, 16) : "");
      setPriority(task.priority || "medium");
      setProjectId(task.projectId || "");
      setAssigneeId(task.assigneeId || "");
    } else if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setDueDate(dateStr);
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setPriority("medium");
      setProjectId("");
      setAssigneeId("");
    }
  }, [task, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        title,
        description,
        dueDate,
        startTime: startTime ? `${dueDate}T${startTime}:00` : undefined,
        endTime: endTime ? `${dueDate}T${endTime}:00` : undefined,
        priority,
        projectId: projectId || undefined,
        assigneeId: assigneeId || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <>
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl"
                    style={{
                      boxShadow: "0 20px 60px rgba(255, 30, 86, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                    }}
                  >
                    <Dialog.Close asChild>
                      <motion.button
                        className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </Dialog.Close>

                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {task ? "Görevi Düzenle" : "Yeni Görev"}
                        </h2>
                        <p className="text-white/60">Görev detaylarını girin</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Başlık *
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            placeholder="Görev başlığı"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Açıklama
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                            placeholder="Görev açıklaması"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Tarih
                            </label>
                            <input
                              type="date"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Öncelik
                            </label>
                            <select
                              value={priority}
                              onChange={(e) => setPriority(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            >
                              <option value="low">Düşük</option>
                              <option value="medium">Orta</option>
                              <option value="high">Yüksek</option>
                              <option value="urgent">Acil</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Başlangıç Saati
                            </label>
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Bitiş Saati
                            </label>
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                          </div>
                        </div>

                        {projects.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Proje
                            </label>
                            <select
                              value={projectId}
                              onChange={(e) => setProjectId(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            >
                              <option value="">Proje seçin</option>
                              {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                  {project.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {users.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Atanan Kişi
                            </label>
                            <select
                              value={assigneeId}
                              onChange={(e) => setAssigneeId(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            >
                              <option value="">Atanmamış</option>
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name || user.email}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                          >
                            İptal
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading || !title.trim() || !projectId}
                            className="flex-1 bg-gradient-to-r from-primary to-accent text-white hover:brightness-110 disabled:opacity-50"
                          >
                            {isLoading ? "Kaydediliyor..." : task ? "Güncelle" : "Oluştur"}
                          </Button>
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

