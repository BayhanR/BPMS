"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Repeat, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecurringTaskFormProps {
  taskId: string;
  onClose: () => void;
  onSubmit: (data: {
    recurrenceType: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    endDate?: string;
    occurrences?: number;
  }) => Promise<void>;
}

export function RecurringTaskForm({ taskId, onClose, onSubmit }: RecurringTaskFormProps) {
  const [recurrenceType, setRecurrenceType] = React.useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
  const [interval, setInterval] = React.useState(1);
  const [daysOfWeek, setDaysOfWeek] = React.useState<number[]>([]);
  const [dayOfMonth, setDayOfMonth] = React.useState(1);
  const [endDate, setEndDate] = React.useState("");
  const [occurrences, setOccurrences] = React.useState<number | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);

  const weekDays = [
    { label: "Pazartesi", value: 0 },
    { label: "Salı", value: 1 },
    { label: "Çarşamba", value: 2 },
    { label: "Perşembe", value: 3 },
    { label: "Cuma", value: 4 },
    { label: "Cumartesi", value: 5 },
    { label: "Pazar", value: 6 },
  ];

  const handleDayToggle = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        recurrenceType,
        interval,
        daysOfWeek: recurrenceType === "weekly" ? daysOfWeek : undefined,
        dayOfMonth: recurrenceType === "monthly" || recurrenceType === "yearly" ? dayOfMonth : undefined,
        endDate: endDate || undefined,
        occurrences: occurrences || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error creating recurring task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-white">Tekrarlayan Görev</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Tekrarlama Tipi</label>
          <select
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          >
            <option value="daily">Günlük</option>
            <option value="weekly">Haftalık</option>
            <option value="monthly">Aylık</option>
            <option value="yearly">Yıllık</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Aralık</label>
          <input
            type="number"
            min="1"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          <p className="text-xs text-white/50 mt-1">
            Her {interval} {recurrenceType === "daily" ? "gün" : recurrenceType === "weekly" ? "hafta" : recurrenceType === "monthly" ? "ay" : "yıl"}
          </p>
        </div>

        {recurrenceType === "weekly" && (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Haftanın Günleri</label>
            <div className="grid grid-cols-2 gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm transition-all",
                    daysOfWeek.includes(day.value)
                      ? "bg-primary/20 border-primary/40 text-primary"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {(recurrenceType === "monthly" || recurrenceType === "yearly") && (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Ayın Günü</label>
            <input
              type="number"
              min="1"
              max="31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Bitiş Tarihi (Opsiyonel)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Maksimum Tekrar (Opsiyonel)</label>
          <input
            type="number"
            min="1"
            value={occurrences || ""}
            onChange={(e) => setOccurrences(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="Sınırsız"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={isLoading || (recurrenceType === "weekly" && daysOfWeek.length === 0)}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-white hover:brightness-110 disabled:opacity-50"
          >
            {isLoading ? "Kaydediliyor..." : "Oluştur"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

