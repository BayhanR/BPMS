"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import Link from "next/link";

interface PremiumStackedProjectCardProps {
  project: {
    id: string;
    name: string;
    icon: LucideIcon;
    taskCount: number;
    color: string;
  };
  index: number;
  total: number;
  mouseX: number;
  mouseY: number;
}

export function PremiumStackedProjectCard({
  project,
  index,
  total,
  mouseX,
  mouseY,
}: PremiumStackedProjectCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const Icon = project.icon;

  const depth = index / total;
  const scale = 1 - depth * 0.08;
  const zIndex = total - index;
  const yOffset = depth * 30;
  const blur = depth * 1.5;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-8, 8]);

  React.useEffect(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (mouseX - centerX) / (rect.width / 2);
    const deltaY = (mouseY - centerY) / (rect.height / 2);

    x.set(deltaX * 0.15 * (1 - depth));
    y.set(deltaY * 0.15 * (1 - depth));
  }, [mouseX, mouseY, depth, x, y]);

  const [glowIntensity, setGlowIntensity] = React.useState(0.3);

  React.useEffect(() => {
    const unsubscribeX = xSpring.on("change", () => {
      const absX = Math.abs(xSpring.get());
      const absY = Math.abs(ySpring.get());
      setGlowIntensity(0.3 + (absX + absY) * 0.3);
    });
    const unsubscribeY = ySpring.on("change", () => {
      const absX = Math.abs(xSpring.get());
      const absY = Math.abs(ySpring.get());
      setGlowIntensity(0.3 + (absX + absY) * 0.3);
    });
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [xSpring, ySpring]);

  const xOffset = useTransform(xSpring, (v) => v * 50);
  const yOffsetTotal = useTransform(ySpring, (v) => v * 50 + yOffset);

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{
        scale,
        zIndex,
        x: xOffset,
        y: yOffsetTotal,
        rotateX,
        rotateY,
        filter: `blur(${blur}px)`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: index * 0.2,
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      whileHover={{
        scale: scale * 1.05,
        z: 50,
        filter: "blur(0px)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1.05}
        transitionSpeed={1500}
        className="h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className={cn(
            "relative h-[320px] w-[420px] rounded-3xl border border-white/20",
            "bg-gradient-to-br from-purple-600/20 to-indigo-600/20",
            "backdrop-blur-xl",
            "shadow-2xl",
            "overflow-hidden",
            "cursor-pointer",
            "group"
          )}
          style={{
            boxShadow: `0 20px 60px rgba(139, 92, 246, ${0.2 + depth * 0.2}), 
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                        ${xSpring.get() * 15}px ${ySpring.get() * 15}px 40px rgba(99, 102, 241, ${0.15})`,
          }}
          whileHover={{
            boxShadow: `0 30px 80px rgba(139, 92, 246, ${0.6 + glowIntensity * 0.2}), 
                       0 0 0 1px rgba(255, 255, 255, 0.2) inset,
                       0 0 120px rgba(139, 92, 246, ${0.4})`,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 20,
            },
          }}
        >
          {/* Purple Glow Background */}
          <motion.div
            className="absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${project.color}, #6366f1)`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner Glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.3), transparent 70%)`,
              opacity: glowIntensity * (1 - depth),
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full p-8 flex flex-col justify-between">
            {/* Icon & Title */}
            <div className="space-y-4">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-white/20 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-white/60">
                  {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
                </p>
              </div>
            </div>

            {/* View Project Button - Glowing Orb */}
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
      </Tilt>
    </motion.div>
  );
}

