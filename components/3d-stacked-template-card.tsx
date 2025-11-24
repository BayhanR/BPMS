"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 30, 86"; // Default crimson
}

interface StackedTemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: LucideIcon;
  };
  index: number;
  total: number;
  mouseX: number;
  mouseY: number;
  onSelect?: (id: string) => void;
}

export function StackedTemplateCard({
  template,
  index,
  total,
  mouseX,
  mouseY,
  onSelect,
}: StackedTemplateCardProps) {
  const router = useRouter();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const Icon = template.icon;

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

  const handleClick = () => {
    // Mock: Yeni proje oluştur ve redirect et
    if (onSelect) {
      onSelect(template.id);
    } else {
      // Gerçek uygulamada: API call yapılacak, sonra redirect
      const newProjectId = `project-${Date.now()}`;
      router.push(`/projects/${newProjectId}`);
    }
  };

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
        scale: scale * 1.15,
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
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1.08}
        transitionSpeed={1500}
        className="h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className={cn(
            "relative h-[320px] w-full max-w-md rounded-3xl border",
            "bg-gradient-to-br from-white/10 to-white/5",
            "backdrop-blur-2xl",
            "shadow-2xl",
            "overflow-hidden",
            "cursor-pointer",
            "group"
          )}
          style={{
            borderColor: `rgba(${hexToRgb(template.color)}, ${0.3 + depth * 0.2})`,
            boxShadow: `0 20px 60px rgba(${hexToRgb(template.color)}, ${0.3 + depth * 0.2}), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`,
          }}
          whileHover={{
            boxShadow: `0 40px 100px rgba(${hexToRgb(template.color)}, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset, 0 0 120px rgba(${hexToRgb(template.color)}, 0.4)`,
          }}
          onClick={handleClick}
        >
          {/* Gradient Background */}
          <div
            className="absolute inset-0 opacity-30 transition-opacity duration-300 group-hover:opacity-60"
            style={{
              background: `linear-gradient(135deg, rgba(${hexToRgb(template.color)}, 0.3), rgba(${hexToRgb(template.color)}, 0.15))`,
            }}
          />

          {/* Inner Glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(${hexToRgb(template.color)}, 0.6), transparent 70%)`,
              opacity: glowOpacity * (1 - depth),
            }}
          />

          {/* Outer Glow */}
          <motion.div
            className="absolute -inset-1 rounded-3xl blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${template.color}, rgba(${hexToRgb(template.color)}, 0.5))`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full p-6 flex flex-col justify-between">
            {/* Header */}
            <div>
              <motion.div
                className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${template.color}, rgba(${hexToRgb(template.color)}, 0.5))`,
                  boxShadow: `0 8px 24px rgba(${hexToRgb(template.color)}, 0.3)`,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-white/70 line-clamp-3 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Use Template Button - Glowing Orb */}
            <motion.button
              className="relative mt-4 w-full h-12 rounded-xl overflow-hidden group/button"
              style={{
                background: `linear-gradient(135deg, ${template.color}, rgba(${hexToRgb(template.color)}, 0.5))`,
                boxShadow: `0 4px 20px rgba(${hexToRgb(template.color)}, 0.3)`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              {/* Glowing Orb Effect */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
              />

              <span className="relative z-10 flex items-center justify-center gap-2 text-white font-semibold">
                Use Template
                <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
              </span>
            </motion.button>
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

