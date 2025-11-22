"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, X } from "lucide-react";

interface ErrorShakeProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export function ErrorShake({ message, onClose, className }: ErrorShakeProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-4",
        "flex items-center gap-3",
        className
      )}
      initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateX: 0,
        x: [0, -10, 10, -10, 10, 0],
        rotateY: [0, -5, 5, -5, 5, 0],
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        x: {
          type: "spring",
          stiffness: 100,
          damping: 20,
        },
        rotateY: {
          type: "spring",
          stiffness: 100,
          damping: 20,
        },
        duration: 0.6,
      }}
      style={{
        boxShadow: "0 8px 32px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
      }}
    >
      <motion.div
        className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0"
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      >
        <AlertCircle className="w-5 h-5 text-red-400" />
      </motion.div>
      <p className="flex-1 text-white text-sm">{message}</p>
      {onClose && (
        <motion.button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4 text-white/70" />
        </motion.button>
      )}
    </motion.div>
  );
}

