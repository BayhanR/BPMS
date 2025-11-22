"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { ActivityFeed } from "@/components/activity-feed";

const mockActivities = [
  {
    id: "1",
    type: "task_created" as const,
    user: "John Doe",
    action: "oluşturdu",
    target: "Design new dashboard",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "task_completed" as const,
    user: "Jane Smith",
    action: "tamamladı",
    target: "API Integration",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "3",
    type: "comment" as const,
    user: "Mike Johnson",
    action: "yorum ekledi",
    target: "Web Portal Redesign",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "4",
    type: "file_uploaded" as const,
    user: "Sarah Wilson",
    action: "dosya yükledi",
    target: "design-mockup.png",
    timestamp: new Date(Date.now() - 10800000),
  },
  {
    id: "5",
    type: "branch_created" as const,
    user: "Tom Brown",
    action: "branch oluşturdu",
    target: "feature/auth-system",
    timestamp: new Date(Date.now() - 14400000),
  },
  ...Array.from({ length: 50 }).map((_, i) => {
    const types = ["task_created", "task_completed", "comment", "file_uploaded"] as const;
    const users = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"];
    const actions = ["oluşturdu", "tamamladı", "yorum ekledi", "dosya yükledi"];
    
    return {
      id: `activity-${i + 6}`,
      type: types[i % 4],
      user: users[i % 4],
      action: actions[i % 4],
      target: `Task ${i + 6}`,
      timestamp: new Date(Date.now() - (i + 6) * 3600000),
    };
  }),
];

export default function ActivityPage() {
  const [activities, setActivities] = React.useState(mockActivities);
  const [hasMore, setHasMore] = React.useState(true);

  const handleLoadMore = () => {
    // Infinite scroll logic
    // In production, fetch more from API
    setTimeout(() => {
      if (activities.length < mockActivities.length) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    }, 500);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-80 ml-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
            }}
          >
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Activity Feed</h1>
              <p className="text-white/60">Tüm proje aktivitelerini takip edin</p>
            </div>

            {/* Activity Feed */}
            <ActivityFeed
              activities={activities}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

