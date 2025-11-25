"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  const particles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: 4,
            height: 4,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: "0 0 8px rgba(255, 30, 86, 0.5)",
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glowing skeleton */}
      <motion.div
        className="h-full w-full bg-white/5 backdrop-blur-sm"
        animate={{
          background: [
            "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)",
            "linear-gradient(90deg, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%, rgba(255,255,255,0.05) 0%)",
            "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)",
          ],
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

