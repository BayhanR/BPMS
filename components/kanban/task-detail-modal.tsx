"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Tilt from "react-parallax-tilt";
import { X, Calendar, Users, Paperclip, MessageSquare, CheckCircle2, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumButton } from "@/components/ui/premium-button";
import { cn } from "@/lib/utils";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    assignees: Array<{ id: string; name: string; avatar?: string }>;
    labels: Array<{ id: string; name: string; color: string }>;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  };
  subtasks?: Subtask[];
  comments?: Comment[];
  attachments?: Attachment[];
}

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
  subtasks = [],
  comments = [],
  attachments = [],
}: TaskDetailModalProps) {
  const [newSubtask, setNewSubtask] = React.useState("");
  const [newComment, setNewComment] = React.useState("");

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    // Add subtask logic here
    setNewSubtask("");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // Add comment logic here
    setNewComment("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence mode="wait">
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
                  initial={{ opacity: 0, scale: 0.8, rotateX: -15, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 15, filter: "blur(20px)" }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                  }}
                >
                  <Tilt
                    tiltMaxAngleX={3}
                    tiltMaxAngleY={3}
                    scale={1.01}
                    transitionSpeed={1500}
                    className="w-full max-w-3xl max-h-[90vh]"
                  >
                    <motion.div
                      className={cn(
                        "relative rounded-3xl border",
                        "bg-white/10 backdrop-blur-2xl",
                        "border-white/20",
                        "shadow-2xl",
                        "overflow-hidden",
                        "flex flex-col"
                      )}
                      style={{
                        boxShadow: "0 30px 80px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                      }}
                    >
                      {/* Purple Glow */}
                      <motion.div
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-600 blur-xl opacity-50"
                        animate={{
                          opacity: [0.3, 0.5, 0.3],
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <Dialog.Title className="text-2xl font-bold text-white mb-2">
                                {task.title}
                              </Dialog.Title>
                              {task.description && (
                                <p className="text-white/60">{task.description}</p>
                              )}
                            </div>
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

                          {/* Task Meta */}
                          <div className="flex flex-wrap items-center gap-3">
                            {task.labels.map((label) => (
                              <span
                                key={label.id}
                                className="px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                                style={{
                                  backgroundColor: `${label.color}20`,
                                  color: label.color,
                                  borderColor: `${label.color}40`,
                                  boxShadow: `0 0 12px ${label.color}40`,
                                }}
                              >
                                {label.name}
                              </span>
                            ))}
                            {task.dueDate && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-white/70 text-xs">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString("tr-TR")}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                          {/* Subtasks */}
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Alt Görevler</h3>
                            <div className="space-y-2">
                              {subtasks.map((subtask) => (
                                <motion.div
                                  key={subtask.id}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 20,
                                  }}
                                >
                                  <CheckCircle2
                                    className={cn(
                                      "w-5 h-5 cursor-pointer transition-colors",
                                      subtask.completed ? "text-green-400" : "text-white/30"
                                    )}
                                  />
                                  <span className={cn("flex-1 text-white", subtask.completed && "line-through text-white/50")}>
                                    {subtask.title}
                                  </span>
                                </motion.div>
                              ))}
                              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                                <Plus className="w-5 h-5 text-white/50" />
                                <input
                                  type="text"
                                  value={newSubtask}
                                  onChange={(e) => setNewSubtask(e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                                  placeholder="Alt görev ekle..."
                                  className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Comments */}
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Yorumlar</h3>
                            <div className="space-y-4">
                              {comments.map((comment) => (
                                <motion.div
                                  key={comment.id}
                                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 20,
                                  }}
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
                                      {comment.author.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-white">{comment.author}</p>
                                      <p className="text-xs text-white/50">{comment.timestamp.toLocaleDateString("tr-TR")}</p>
                                    </div>
                                  </div>
                                  <p className="text-white/70 text-sm">{comment.content}</p>
                                </motion.div>
                              ))}
                              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                                  Y
                                </div>
                                <input
                                  type="text"
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                                  placeholder="Yorum ekle..."
                                  className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
                                />
                                <PremiumButton
                                  size="icon"
                                  onClick={handleAddComment}
                                  className="w-8 h-8 rounded-lg"
                                >
                                  <Send className="w-4 h-4" />
                                </PremiumButton>
                              </div>
                            </div>
                          </div>

                          {/* Attachments */}
                          {attachments.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-3">Ekler</h3>
                              <div className="space-y-2">
                                {attachments.map((attachment) => (
                                  <motion.a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 150,
                                      damping: 20,
                                    }}
                                    whileHover={{ x: 4 }}
                                  >
                                    <Paperclip className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">{attachment.name}</p>
                                      <p className="text-xs text-white/50">{attachment.size} • {attachment.type}</p>
                                    </div>
                                  </motion.a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Tilt>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

