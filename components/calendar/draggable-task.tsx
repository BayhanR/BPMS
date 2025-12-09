"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DraggableTaskProps {
  task: {
    id: string;
    title: string;
  };
}

export function DraggableTask({ task }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-white/70 cursor-move hover:bg-white/10 transition-colors",
        isDragging && "opacity-50"
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, x: 0 }}
      transition={{ delay: 0.05 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="h-2 w-2 rounded-full bg-[#ff1e56]" />
      <p className="truncate">{task.title}</p>
    </motion.div>
  );
}

