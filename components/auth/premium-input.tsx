"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
}

export function PremiumInput({
  icon: Icon,
  label,
  className,
  ...props
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-white/70">{label}</label>
      )}
      <motion.div
        className="relative"
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 z-10" />
        )}
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full pl-11 pr-4 py-3 rounded-xl",
            "bg-white/5 border border-white/10",
            "text-white placeholder:text-white/30",
            "focus:outline-none transition-all",
            "backdrop-blur-sm",
            className
          )}
          style={{
            boxShadow: isFocused
              ? "0 0 0 3px rgba(255, 30, 86, 0.35), 0 8px 32px rgba(255, 30, 86, 0.2)"
              : "none",
            borderColor: isFocused ? "rgba(255, 30, 86, 0.5)" : "rgba(255, 255, 255, 0.1)",
          }}
        />
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    </div>
  );
}

