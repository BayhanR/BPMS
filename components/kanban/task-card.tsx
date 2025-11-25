"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Tilt from "react-parallax-tilt";
import { cn } from "@/lib/utils";
import { Calendar, Users } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    assignees: Array<{ id: string; name: string; avatar: string }>;
    labels: Array<{ id: string; name: string; color: string }>;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  };
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date() && !task.dueDate.includes("Completed")
    : false;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        className={cn(
          "relative rounded-2xl border bg-white/5 backdrop-blur-xl",
          "cursor-grab active:cursor-grabbing",
          "transition-all duration-200",
          "group"
        )}
        onClick={(e) => {
          if (!isDragging && onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          rotateY: 3,
          boxShadow: "0 20px 60px rgba(255, 30, 86, 0.4)",
          transition: {
            type: "spring",
            stiffness: 150,
            damping: 20,
          },
        }}
        animate={
          isDragging
            ? {
                scale: 1.1,
                opacity: 0.9,
                rotateY: 5,
                boxShadow: "0 30px 80px rgba(255, 30, 86, 0.55)",
              }
            : {}
        }
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
        }}
        style={{
          borderColor: isDragging
            ? "rgba(255, 30, 86, 0.5)"
            : "rgba(255, 255, 255, 0.1)",
          boxShadow: isDragging
            ? "0 0 0 2px rgba(255, 30, 86, 0.8), 0 30px 80px rgba(255, 30, 86, 0.55)"
            : "0 8px 32px rgba(255, 30, 86, 0.12)",
        }}
      >
        <Tilt
          tiltMaxAngleX={isDragging ? 0 : 5}
          tiltMaxAngleY={isDragging ? 0 : 5}
          scale={isDragging ? 1 : 1.02}
          transitionSpeed={1000}
          className="h-full"
        >
          <div className="p-4 space-y-3">
            {/* Cover Image */}
            {task.coverImage && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3 -mx-4 -mt-4">
                <img
                  src={task.coverImage}
                  alt={task.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            {/* Title */}
            <h3 className="text-base font-semibold text-white line-clamp-2">
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-white/60 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <motion.span
                    key={label.id}
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      "border backdrop-blur-sm"
                    )}
                    style={{
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                      borderColor: `${label.color}40`,
                      boxShadow: `0 0 12px ${label.color}40`,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {label.name}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              {/* Avatar Stack */}
              {task.assignees && task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((assignee, idx) => (
                    <motion.div
                      key={assignee.id}
                      className="w-7 h-7 rounded-full border-2 border-white/20 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-white"
                      style={{ zIndex: 10 - idx }}
                      whileHover={{ scale: 1.2, zIndex: 20 }}
                    >
                      {assignee.avatar ? (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        assignee.name.charAt(0).toUpperCase()
                      )}
                    </motion.div>
                  ))}
                  {task.assignees.length > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70">
                      +{task.assignees.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <motion.div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                    isOverdue
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-white/10 text-white/70 border border-white/10"
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
                </motion.div>
              )}
            </div>
          </div>
        </Tilt>
      </motion.div>
    </div>
  );
}

