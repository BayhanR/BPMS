"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

interface PremiumButtonProps extends ButtonProps {
  glowColor?: string;
}

export function PremiumButton({
  className,
  glowColor = "#ff1e56",
  children,
  ...props
}: PremiumButtonProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -2,
        transition: {
          type: "spring",
          stiffness: 150,
          damping: 20,
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
      className="relative"
    >
      <motion.div
        className="absolute -inset-1 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
        style={{ backgroundColor: glowColor }}
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <Button
        {...props}
        className={cn(
          "relative group",
          "hover:shadow-lg transition-all",
          className
        )}
        style={{
          boxShadow: `0 4px 16px ${glowColor}20`,
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
}

