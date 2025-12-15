"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ActivityFeed } from "@/components/activity-feed";
import { Loader2, AlertCircle, Activity } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ActivityPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Proje aktivitelerini çek
  const { data: activities, error, isLoading } = useSWR(
    projectId ? `/api/projects/${projectId}/activity` : null,
    fetcher,
    {
      // Hata durumunda boş array döndür
      onError: () => {},
    }
  );

  // API henüz yoksa veya hata varsa boş göster
  const activityList = Array.isArray(activities) ? activities : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
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
          <h1 className="text-4xl font-bold text-white mb-2">Aktivite</h1>
          <p className="text-white/60">Proje aktivitelerini takip edin</p>
        </div>

        {/* Empty State */}
        {activityList.length === 0 && (
          <div className="text-center py-16">
            <Activity className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Henüz aktivite yok</h3>
            <p className="text-white/60">
              Görev oluşturduğunuzda, düzenlediğinizde veya tamamladığınızda aktiviteler burada görünecek.
            </p>
          </div>
        )}

        {/* Activity Feed */}
        {activityList.length > 0 && (
          <ActivityFeed
            activities={activityList.map((a: any) => ({
              id: a.id,
              type: a.action.includes("created") ? "task_created" :
                    a.action.includes("completed") ? "task_completed" :
                    a.action.includes("comment") ? "comment" : "task_created",
              user: a.user?.name || "Kullanıcı",
              action: a.action,
              target: a.metadata?.title || a.metadata?.name || "",
              timestamp: new Date(a.createdAt),
            }))}
            onLoadMore={() => {}}
            hasMore={false}
          />
        )}
      </motion.div>
    </div>
  );
}
