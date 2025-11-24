"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Calendar, Users } from "lucide-react";

interface StackedProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    members: number;
    progress: number;
    color: string;
  };
  index: number;
  total: number;
  mouseX: number;
  mouseY: number;
}

export function StackedProjectCard({
  project,
  index,
  total,
  mouseX,
  mouseY,
}: StackedProjectCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const depth = index / total;
  const scale = 1 - depth * 0.1;
  const zIndex = total - index;
  const yOffset = depth * 20;
  const blur = depth * 2;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);

  React.useEffect(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (mouseX - centerX) / (rect.width / 2);
    const deltaY = (mouseY - centerY) / (rect.height / 2);

    x.set(deltaX * 0.1 * (1 - depth));
    y.set(deltaY * 0.1 * (1 - depth));
  }, [mouseX, mouseY, depth, x, y]);

  const [glowOpacity, setGlowOpacity] = React.useState(0.3);

  React.useEffect(() => {
    const unsubscribeX = xSpring.on("change", () => {
      const absX = Math.abs(xSpring.get());
      const absY = Math.abs(ySpring.get());
      setGlowOpacity(0.3 + absX * 0.2 + absY * 0.2);
    });
    const unsubscribeY = ySpring.on("change", () => {
      const absX = Math.abs(xSpring.get());
      const absY = Math.abs(ySpring.get());
      setGlowOpacity(0.3 + absX * 0.2 + absY * 0.2);
    });
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [xSpring, ySpring]);

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{
        scale,
        zIndex,
        y: yOffset,
        rotateX,
        rotateY,
        filter: `blur(${blur}px)`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      whileHover={{
        scale: scale * 1.1,
        z: 50,
        filter: "blur(0px)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        scale={1.05}
        transitionSpeed={1500}
        className="h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className={cn(
            "relative h-[280px] w-full max-w-md rounded-3xl border",
            "bg-gradient-to-br from-white/10 to-white/5",
            "backdrop-blur-2xl",
            "shadow-2xl",
            "overflow-hidden",
            "cursor-pointer",
            "group"
          )}
          style={{
            borderColor: `rgba(255, 30, 86, ${0.3 + depth * 0.2})`,
            boxShadow: `0 20px 60px rgba(255, 30, 86, ${0.3 + depth * 0.2}), 0 0 0 1px rgba(255, 255, 255, 0.08) inset`,
          }}
          whileHover={{
            boxShadow: `0 30px 80px rgba(255, 30, 86, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2) inset, 0 0 100px rgba(255, 0, 110, 0.4)`,
          }}
        >
          {/* Gradient Background */}
          <div
            className="absolute inset-0 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`,
            }}
          />

          {/* Inner Glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 30, 86, 0.4), transparent 70%)`,
              opacity: glowOpacity * (1 - depth),
            }}
          />

          {/* Outer Glow */}
          <motion.div
            className="absolute -inset-1 rounded-3xl blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${project.color}, #ff1e56)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <motion.div
                  whileHover={{ rotate: 45, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </motion.div>
              </div>
              <p className="text-sm text-white/60 mb-4 line-clamp-2">
                {project.description}
              </p>
            </div>

            <div className="space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: index * 0.1,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white/50">
                  <Users className="w-4 h-4" />
                  <span>{project.members} members</span>
                </div>
                <span className="px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/40">
                  {project.status}
                </span>
              </div>
            </div>
          </div>

          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </Tilt>
    </motion.div>
  );
}

