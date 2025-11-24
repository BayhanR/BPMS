"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingGlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  glowIntensity?: number;
}

export function FloatingGlassCard({
  children,
  className,
  hoverScale = 1.05,
  glowIntensity = 0.5,
}: FloatingGlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl",
        "shadow-[0_8px_32px_0_rgba(139,92,246,0.1)]",
        "transition-all duration-300 ease-out",
        className
      )}
      whileHover={{
        scale: hoverScale,
        y: -4,
        boxShadow: `0 20px 60px rgba(139, 92, 246, ${glowIntensity})`,
        transition: {
          type: "spring",
          stiffness: 150,
          damping: 20,
        },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

