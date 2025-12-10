"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  priority?: string;
  status?: string;
  project?: {
    id: string;
    name: string;
    color: string;
  };
  assignee?: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
  };
}

interface WeeklyViewProps {
  weekStart: Date;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDateClick?: (date: Date) => void;
}

const weekDayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export function WeeklyView({ weekStart, tasks, onTaskClick, onDateClick }: WeeklyViewProps) {
  const weekDays = React.useMemo(() => {
    const days: Date[] = [];
    const start = new Date(weekStart);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekStart]);

  const tasksByDate = React.useMemo(() => {
    return tasks.reduce<Record<string, Task[]>>((acc, task) => {
      if (task.dueDate) {
        const key = new Date(task.dueDate).toDateString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
      }
      return acc;
    }, {});
  }, [tasks]);

  const today = new Date().toDateString();

  return (
    <div className="space-y-4">
      {/* Week Header */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayKey = day.toDateString();
          const isToday = dayKey === today;
          const dayTasks = tasksByDate[dayKey] || [];

          return (
            <motion.div
              key={dayKey}
              className={cn(
                "rounded-xl border p-3 text-center",
                "bg-white/5 border-white/10 backdrop-blur-xl",
                isToday && "border-primary/60 bg-primary/10"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <p className="text-xs text-white/50 mb-1">
                {weekDayNames[index].slice(0, 3)}
              </p>
              <p className={cn(
                "text-2xl font-bold",
                isToday ? "text-primary" : "text-white"
              )}>
                {day.getDate()}
              </p>
              {dayTasks.length > 0 && (
                <p className="text-xs text-white/60 mt-1">
                  {dayTasks.length} görev
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2 min-h-[600px]">
        {weekDays.map((day) => {
          const dayKey = day.toDateString();
          const dayTasks = tasksByDate[dayKey] || [];
          const isToday = dayKey === today;

          return (
            <motion.div
              key={dayKey}
              className={cn(
                "rounded-xl border p-3 min-h-[200px]",
                "bg-white/5 border-white/10 backdrop-blur-xl",
                isToday && "border-primary/40 bg-primary/5"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <motion.button
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className={cn(
                      "w-full rounded-lg border p-2 text-left text-xs",
                      "bg-white/5 border-white/10 hover:bg-white/10 transition-colors",
                      task.project && `border-l-4`,
                      task.status === "done" && "opacity-60"
                    )}
                    style={{
                      borderLeftColor: task.project?.color || "transparent",
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="font-semibold text-white truncate">{task.title}</p>
                    {task.startTime && (
                      <p className="text-white/60 text-[10px] mt-1">
                        {new Date(task.startTime).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {task.endTime &&
                          ` - ${new Date(task.endTime).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`}
                      </p>
                    )}
                  </motion.button>
                ))}
                {dayTasks.length === 0 && (
                  <p className="text-white/30 text-xs text-center py-4">
                    Görev yok
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

