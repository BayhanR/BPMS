"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, Pause, Square, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeEntry {
  id: string;
  startTime: string;
  endTime?: string;
  description?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
  };
}

interface TimeTrackerProps {
  taskId: string;
  timeEntries?: TimeEntry[];
  onTimeEntryUpdate?: () => void;
}

export function TimeTracker({ taskId, timeEntries = [], onTimeEntryUpdate }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = React.useState(false);
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);

  // Calculate total time from entries
  React.useEffect(() => {
    const total = timeEntries.reduce((acc, entry) => {
      if (entry.endTime) {
        const start = new Date(entry.startTime).getTime();
        const end = new Date(entry.endTime).getTime();
        return acc + (end - start);
      }
      return acc;
    }, 0);
    setTotalTime(total);
  }, [timeEntries]);

  // Update elapsed time when tracking
  React.useEffect(() => {
    if (!isTracking || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime.getTime();
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const handleStart = async () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);

    try {
      await fetch(`/api/tasks/${taskId}/time-entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: now.toISOString(),
        }),
      });
      onTimeEntryUpdate?.();
    } catch (error) {
      console.error("Error starting time tracking:", error);
    }
  };

  const handleStop = async () => {
    if (!startTime) return;

    setIsTracking(false);
    const endTime = new Date();

    try {
      // Find the active time entry (without endTime)
      const activeEntry = timeEntries.find((e) => !e.endTime);
      if (activeEntry) {
        await fetch(`/api/tasks/${taskId}/time-entries/${activeEntry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endTime: endTime.toISOString(),
          }),
        });
      }
      setStartTime(null);
      setElapsedTime(0);
      onTimeEntryUpdate?.();
    } catch (error) {
      console.error("Error stopping time tracking:", error);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const displayTime = isTracking ? elapsedTime : 0;
  const totalDisplayTime = totalTime + displayTime;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-white">Zaman Takibi</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50">Toplam Süre</p>
          <p className="text-2xl font-bold text-white">{formatTime(totalDisplayTime)}</p>
        </div>
      </div>

      {isTracking && (
        <motion.div
          className="rounded-xl border border-primary/40 bg-primary/10 p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">Aktif Takip</p>
              <p className="text-xl font-bold text-white">{formatTime(displayTime)}</p>
            </div>
            <motion.div
              className="w-3 h-3 rounded-full bg-primary"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}

      <div className="flex gap-2">
        {!isTracking ? (
          <Button
            onClick={handleStart}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-white hover:brightness-110"
          >
            <Play className="w-4 h-4 mr-2" />
            Başlat
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
          >
            <Square className="w-4 h-4 mr-2" />
            Durdur
          </Button>
        )}
      </div>

      {timeEntries.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <p className="text-xs text-white/50 mb-2">Zaman Kayıtları</p>
          {timeEntries.map((entry) => {
            const start = new Date(entry.startTime);
            const end = entry.endTime ? new Date(entry.endTime) : new Date();
            const duration = end.getTime() - start.getTime();

            return (
              <motion.div
                key={entry.id}
                className="rounded-lg border border-white/10 bg-white/5 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60">
                      {start.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {entry.endTime &&
                        ` - ${end.toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                    </p>
                    {entry.description && (
                      <p className="text-xs text-white/50 mt-1">{entry.description}</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white">{formatTime(duration)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

