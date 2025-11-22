"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    assignees: Array<{ id: string; name: string; avatar: string }>;
    labels: Array<{ id: string; name: string; color: string }>;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  }>;
  onAddTask?: (columnId: string) => void;
  onTaskClick?: (task: any) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
      <motion.div
        ref={setNodeRef}
        className={cn(
          "flex flex-col h-full min-w-[320px] w-full md:w-auto rounded-3xl",
          "bg-white/5 backdrop-blur-2xl",
          "border border-white/10",
          "p-4 mb-4 md:mb-0"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
        }}
        style={{
          boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)",
        }}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <span className="px-2 py-1 rounded-lg bg-white/10 text-white/70 text-xs font-semibold">
              {tasks.length}
            </span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
            >
              <TaskCard task={task} onClick={() => onTaskClick?.(task)} />
            </motion.div>
          ))}
        </div>

        {/* Add Task Button */}
        <motion.button
          onClick={() => onAddTask?.(id)}
          className={cn(
            "mt-3 w-full h-10 rounded-xl",
            "bg-white/5 border border-white/10",
            "hover:bg-white/10 transition-colors",
            "flex items-center justify-center gap-2",
            "text-white/70 hover:text-white",
            "text-sm font-medium"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </motion.button>
      </motion.div>
    </SortableContext>
  );
}

