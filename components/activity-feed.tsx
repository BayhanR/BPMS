"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { FloatingGlassCard } from "./floating-glass-card";
import { cn } from "@/lib/utils";
import { User, FileText, CheckCircle2, MessageSquare, Plus, GitBranch } from "lucide-react";

interface Activity {
  id: string;
  type: "task_created" | "task_completed" | "comment" | "file_uploaded" | "branch_created";
  user: string;
  userAvatar?: string;
  action: string;
  target?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities: Activity[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const activityIcons = {
  task_created: Plus,
  task_completed: CheckCircle2,
  comment: MessageSquare,
  file_uploaded: FileText,
  branch_created: GitBranch,
};

const activityColors = {
  task_created: "#8b5cf6",
  task_completed: "#10b981",
  comment: "#6366f1",
  file_uploaded: "#06b6d4",
  branch_created: "#f59e0b",
};

export function ActivityFeed({ activities, onLoadMore, hasMore = false }: ActivityFeedProps) {
  const [visibleActivities, setVisibleActivities] = React.useState(activities.slice(0, 10));
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { once: true });

  React.useEffect(() => {
    if (isInView && hasMore && visibleActivities.length < activities.length) {
      // Load more activities
      setVisibleActivities((prev) => [
        ...prev,
        ...activities.slice(prev.length, prev.length + 10),
      ]);
      onLoadMore?.();
    }
  }, [isInView, hasMore, activities, visibleActivities.length, onLoadMore]);

  return (
    <div className="space-y-4">
      {visibleActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const color = activityColors[activity.type];

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              type: "spring",
              stiffness: 150,
              damping: 20,
            }}
          >
            <FloatingGlassCard className="p-4 hover:scale-105">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}80)`,
                    boxShadow: `0 4px 16px ${color}30`,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-white">{activity.user}</span>
                    <span className="text-sm text-white/60">{activity.action}</span>
                    {activity.target && (
                      <span className="text-sm font-medium text-purple-400">{activity.target}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50">
                    {activity.timestamp.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </FloatingGlassCard>
          </motion.div>
        );
      })}

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          <motion.div
            className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}

