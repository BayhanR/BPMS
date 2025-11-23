"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FocusDeckProjectCardProps {
  project: {
    id: string;
    name: string;
    icon: LucideIcon;
    taskCount: number;
    color: string;
  };
  position: "left" | "center" | "right";
  stackIndex: number;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

export function FocusDeckProjectCard({
  project,
  position,
  stackIndex,
  isActive,
  onClick,
  isMobile = false,
}: FocusDeckProjectCardProps) {
  const Icon = project.icon;

  // Calculate transforms based on position
  const getPositionStyles = () => {
    if (position === "center") {
      return {
        x: 0,
        y: 0,
        scale: 1.0,
        opacity: 1,
        zIndex: 100,
        blur: 0,
        rotateY: 0,
      };
    }

    if (position === "left") {
      const deckOffset = isMobile ? -180 : -320; // Base offset for left deck
      const stackOffset = stackIndex * (isMobile ? 10 : 15); // Stack spacing
      const scale = 0.55 - stackIndex * 0.06; // Each card slightly smaller
      return {
        x: deckOffset - stackOffset * 0.6,
        y: stackOffset * 2.5,
        scale: Math.max(0.35, scale),
        opacity: 0.65 - stackIndex * 0.08,
        zIndex: 50 - stackIndex,
        blur: 2.5 + stackIndex * 0.6,
        rotateY: -18 - stackIndex * 2.5,
      };
    }

    // position === "right"
    const deckOffset = isMobile ? 180 : 320; // Base offset for right deck
    const stackOffset = stackIndex * (isMobile ? 10 : 15);
    const scale = 0.55 - stackIndex * 0.06;
    return {
      x: deckOffset + stackOffset * 0.6,
      y: stackOffset * 2.5,
      scale: Math.max(0.35, scale),
      opacity: 0.65 - stackIndex * 0.08,
      zIndex: 50 - stackIndex,
      blur: 2.5 + stackIndex * 0.6,
      rotateY: 18 + stackIndex * 2.5,
    };
  };

  const styles = getPositionStyles();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "cursor-pointer"
        )}
        style={{
          x: styles.x,
          y: styles.y,
          scale: styles.scale,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
          filter: `blur(${styles.blur}px)`,
          rotateY: styles.rotateY,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: styles.opacity,
          scale: styles.scale,
          x: styles.x,
          y: styles.y,
          rotateY: styles.rotateY,
          filter: `blur(${styles.blur}px)`,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 0.5,
        }}
        whileHover={
          !isActive
            ? {
                scale: styles.scale * 1.2,
                opacity: Math.min(1, styles.opacity + 0.4),
                filter: "blur(0px)",
                zIndex: 99,
                y: styles.y - 10,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }
            : {}
        }
        onClick={onClick}
      >
        {isActive ? (
          <Tilt
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            scale={1.02}
            transitionSpeed={1500}
            className="h-full w-full"
          >
            <CardContent project={project} Icon={Icon} isActive={isActive} />
          </Tilt>
        ) : (
          <CardContent project={project} Icon={Icon} isActive={isActive} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function CardContent({
  project,
  Icon,
  isActive,
}: {
  project: {
    id: string;
    name: string;
    taskCount: number;
    color: string;
  };
  Icon: LucideIcon;
  isActive: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative rounded-3xl border border-white/20",
        "bg-gradient-to-br from-purple-600/20 to-indigo-600/20",
        "backdrop-blur-xl",
        "shadow-2xl",
        "overflow-hidden",
        "group",
        isActive ? "h-[400px] w-[480px]" : "h-[240px] w-[300px]"
      )}
      style={{
        boxShadow: isActive
          ? "0 30px 80px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 120px rgba(139, 92, 246, 0.3)"
          : "0 10px 40px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
      }}
      whileHover={{
        boxShadow: isActive
          ? "0 40px 100px rgba(139, 92, 246, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.2) inset, 0 0 150px rgba(139, 92, 246, 0.5)"
          : "0 20px 60px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset",
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20,
        },
      }}
    >
      {/* Purple Glow Background */}
      <motion.div
        className={cn(
          "absolute -inset-1 rounded-3xl blur-2xl transition-opacity duration-500",
          isActive ? "opacity-40" : "opacity-0 group-hover:opacity-30"
        )}
        style={{
          background: `linear-gradient(135deg, ${project.color}, #6366f1)`,
        }}
        animate={
          isActive
            ? {
                opacity: [0.3, 0.5, 0.3],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-6 flex flex-col justify-between">
        {/* Icon & Title */}
        <div className="space-y-3">
          <motion.div
            className={cn(
              "rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-white/20 flex items-center justify-center backdrop-blur-sm",
              isActive ? "w-20 h-20" : "w-12 h-12"
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icon className={cn("text-white", isActive ? "w-10 h-10" : "w-6 h-6")} />
          </motion.div>

          <div>
            <h3
              className={cn(
                "font-bold text-white mb-1 group-hover:text-purple-300 transition-colors",
                isActive ? "text-3xl" : "text-lg"
              )}
            >
              {project.name}
            </h3>
            <p className={cn("text-white/60", isActive ? "text-base" : "text-xs")}>
              {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
            </p>
          </div>
        </div>

        {/* View Project Button - Only show on active card */}
        {isActive && (
          <Link href={`/projects/${project.id}/board`} passHref>
            <motion.button
              className="relative w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold overflow-hidden group/btn"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Glowing Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-1 rounded-xl blur-xl bg-purple-500/50 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
              />

              {/* Content */}
              <span className="relative z-10 flex items-center justify-center">
                View Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </span>

              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.button>
          </Link>
        )}
      </div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
}

