"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.95, rotateX: -5, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.95, rotateX: 5, filter: "blur(20px)" }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
          ease: [0.25, 0.1, 0.25, 1], // ease-out-cubic approximation
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

