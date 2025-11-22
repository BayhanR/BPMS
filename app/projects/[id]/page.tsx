"use client";

import { motion } from "framer-motion";
import { FloatingGlassCard } from "@/components/floating-glass-card";
import { Calendar, Users, CheckCircle2, Clock } from "lucide-react";

export default function ProjectDetailPage() {
  return (
    <div className="p-4 md:p-8">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Project Dashboard</h1>
          <p className="text-white/60">Proje detayları ve genel bakış</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: CheckCircle2, label: "Completed", value: "24", color: "from-green-500 to-emerald-600" },
            { icon: Clock, label: "In Progress", value: "8", color: "from-yellow-500 to-orange-600" },
            { icon: Users, label: "Team Members", value: "12", color: "from-blue-500 to-cyan-600" },
            { icon: Calendar, label: "Days Left", value: "15", color: "from-purple-500 to-indigo-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FloatingGlassCard className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </FloatingGlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

