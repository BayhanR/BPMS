"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Tilt from "react-parallax-tilt";
import { X, Users, Crown, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName?: string;
  onSubmit: (role: "admin" | "editor" | "viewer") => void;
}

const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Tüm yetkilere sahip, workspace ayarlarını değiştirebilir",
    icon: Crown,
    color: "#8b5cf6",
  },
  {
    id: "editor",
    name: "Editor",
    description: "Projeler ve görevler oluşturup düzenleyebilir",
    icon: Edit3,
    color: "#6366f1",
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Sadece görüntüleme yetkisi, değişiklik yapamaz",
    icon: Eye,
    color: "#10b981",
  },
];

export function WorkspaceInviteModal({
  open,
  onOpenChange,
  workspaceName = "Workspace",
  onSubmit,
}: WorkspaceInviteModalProps) {
  const [selectedRole, setSelectedRole] = React.useState<"admin" | "editor" | "viewer">("editor");

  const handleSubmit = () => {
    onSubmit(selectedRole);
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
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <Tilt
                    tiltMaxAngleX={5}
                    tiltMaxAngleY={5}
                    scale={1.02}
                    transitionSpeed={1500}
                    className="w-full max-w-md"
                  >
                    <motion.div
                      className={cn(
                        "relative rounded-3xl border",
                        "bg-white/10 backdrop-blur-2xl",
                        "border-white/20",
                        "shadow-2xl",
                        "overflow-hidden"
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
                          <div>
                            <Dialog.Title className="text-2xl font-bold text-white mb-1">
                              Workspace Daveti
                            </Dialog.Title>
                            <p className="text-white/60 text-sm">
                              <span className="font-semibold text-white">{workspaceName}</span> workspace'ine davet edildiniz
                            </p>
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

                        {/* Role Selection */}
                        <div className="space-y-3 mb-6">
                          <label className="block text-sm font-medium text-white/70 mb-3">
                            Rolünüzü Seçin
                          </label>
                          {roles.map((role) => {
                            const Icon = role.icon;
                            const isSelected = selectedRole === role.id;
                            return (
                              <motion.button
                                key={role.id}
                                type="button"
                                onClick={() => setSelectedRole(role.id as "admin" | "editor" | "viewer")}
                                className={cn(
                                  "w-full p-4 rounded-xl border text-left transition-all",
                                  "flex items-start gap-3",
                                  isSelected
                                    ? "bg-white/10 border-white/30"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  boxShadow: isSelected
                                    ? `0 0 0 2px ${role.color}40, 0 8px 24px ${role.color}20`
                                    : "none",
                                }}
                              >
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{
                                    background: `linear-gradient(135deg, ${role.color}, ${role.color}80)`,
                                    boxShadow: `0 4px 16px ${role.color}30`,
                                  }}
                                >
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-white">{role.name}</h3>
                                    {isSelected && (
                                      <motion.div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: role.color }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                      />
                                    )}
                                  </div>
                                  <p className="text-xs text-white/60">{role.description}</p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
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
                              onClick={handleSubmit}
                              className="px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
                            >
                              Daveti Kabul Et
                            </Button>
                          </motion.div>
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

