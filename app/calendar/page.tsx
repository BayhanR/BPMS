"use client";

import * as React from "react";
import { motion, Reorder } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import { mockTasks, mockUsers, mockProjects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const weekDays = ["Pts", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

function buildMonthDays(anchor: Date): CalendarDay[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const startOfMonth = new Date(year, month, 1);
  const startDay = (startOfMonth.getDay() + 6) % 7; // convert Sunday -> 6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, inCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: new Date(year, month, d), inCurrentMonth: true });
  }

  while (days.length % 7 !== 0) {
    const next = new Date(year, month, daysInMonth + (days.length % 7));
    days.push({ date: next, inCurrentMonth: false });
  }

  return days;
}

const todayKey = new Date().toDateString();

export default function CalendarPage() {
  const { sidebarWidth } = useSidebarContext();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [orderedTasks, setOrderedTasks] = React.useState<string[]>([]);

  const days = React.useMemo(() => buildMonthDays(currentMonth), [currentMonth]);

  const tasksByDate = React.useMemo(() => {
    return mockTasks.reduce<Record<string, typeof mockTasks>>((acc, task) => {
      const key = new Date(task.dueDate).toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, []);

  React.useEffect(() => {
    const key = selectedDate.toDateString();
    const list = tasksByDate[key] ?? [];
    setOrderedTasks(list.map((task) => task.id));
  }, [selectedDate, tasksByDate]);

  const selectedTasks = React.useMemo(() => {
    const key = selectedDate.toDateString();
    const list = tasksByDate[key] ?? [];
    const ordering = new Map(orderedTasks.map((id, idx) => [id, idx]));
    return [...list].sort((a, b) => (ordering.get(a.id)! - ordering.get(b.id)!));
  }, [orderedTasks, selectedDate, tasksByDate]);

  const changeMonth = (delta: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      return next;
    });
  };

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const selectedWeekIndex = weeks.findIndex((week) =>
    week.some((day) => day.date.toDateString() === selectedDate.toDateString())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ paddingLeft: sidebarWidth, transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,30,86,0.15),transparent_55%)] animate-pulse" />
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-screen"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%), linear-gradient(20deg, rgba(255,0,110,0.08) 0%, transparent 40%)`,
              }}
            />
          </div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/50">Takvim</p>
                <h1 className="text-4xl font-semibold text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white/80"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => changeMonth(-1)}
                >
                  ←
                </motion.button>
                <motion.button
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white/80"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => changeMonth(1)}
                >
                  →
                </motion.button>
              </div>
            </header>

            <div className="overflow-x-auto pb-4">
              <div className="flex gap-3 min-w-max">
                {weeks.map((week, idx) => (
                  <motion.div
                    key={`week-${idx}`}
                    className={cn(
                      "flex gap-1 rounded-2xl border border-white/5 px-4 py-3 backdrop-blur-xl bg-white/5",
                      idx === selectedWeekIndex && "border-primary/70 bg-primary/10"
                    )}
                    whileHover={{ y: -4 }}
                  >
                    {week.map((day) => (
                      <div
                        key={day.date.toISOString()}
                        className={cn(
                          "text-xs font-semibold px-2 py-1 rounded-xl",
                          day.date.toDateString() === selectedDate.toDateString()
                            ? "bg-primary/20 text-white"
                            : "text-white/60"
                        )}
                      >
                        {day.date.getDate()}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {weekDays.map((day) => (
                <p key={day} className="hidden xl:block text-center text-xs uppercase tracking-[0.3em] text-white/40">
                  {day}
                </p>
              ))}

              {days.map((day) => {
                const key = day.date.toDateString();
                const tasks = tasksByDate[key] ?? [];
                const isToday = key === todayKey;
                const isSelected = key === selectedDate.toDateString();

                return (
                  <Tilt key={key} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={isSelected ? 1.05 : 1.01} transitionSpeed={1000}>
                    <motion.button
                      onClick={() => setSelectedDate(day.date)}
                      className={cn(
                        "relative w-full h-40 rounded-3xl border backdrop-blur-xl text-left p-4 flex flex-col justify-between",
                        "border-white/5 bg-white/5 text-white",
                        !day.inCurrentMonth && "opacity-40",
                        isSelected && "border-primary/70 shadow-[0_25px_80px_rgba(255,30,86,0.35)]"
                      )}
                      whileHover={{ y: -6 }}
                    >
                      {isToday && (
                        <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-ping" />
                      )}
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{weekDays[(day.date.getDay() + 6) % 7]}</p>
                        <h3 className="text-2xl font-semibold">{day.date.getDate()}</h3>
                      </div>
                      <div>
                        {tasks.length > 0 ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold border border-primary/40">
                            {tasks.length} task
                          </div>
                        ) : (
                          <p className="text-xs text-white/40">Boş gün</p>
                        )}
                      </div>
                    </motion.button>
                  </Tilt>
                );
              })}

              <motion.div
                className="absolute top-0 right-0 h-full w-full lg:w-96 lg:translate-x-full lg:pl-6 pointer-events-none lg:pointer-events-auto"
                initial={false}
                animate={{
                  translateX: selectedTasks.length ? 0 : 20,
                  opacity: selectedTasks.length ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                <div className="sticky top-4 space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-[#121217]/90 backdrop-blur-2xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                    <p className="text-sm text-white/50 uppercase tracking-[0.3em]">Günün Task'ları</p>
                    <h3 className="text-2xl font-semibold text-white mt-2">
                      {selectedDate.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                    </h3>
                    <p className="text-white/60 text-sm mt-2">
                      {selectedTasks.length > 0 ? `${selectedTasks.length} görev planlandı.` : "Bu güne atanan görev yok."}
                    </p>
                  </div>

                  {selectedTasks.length > 0 && (
                    <Reorder.Group axis="y" values={orderedTasks} onReorder={setOrderedTasks} className="space-y-3">
                      {selectedTasks.map((task) => {
                        const assignee = mockUsers.find((user) => user.id === task.assigneeId);
                        const project = mockProjects.find((proj) => proj.id === task.projectId);
                        return (
                          <Reorder.Item key={task.id} value={task.id}>
                            <motion.div
                              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col gap-2 cursor-grab active:cursor-grabbing"
                              whileHover={{ y: -4 }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{project?.name}</p>
                                  <h4 className="text-white font-semibold">{task.title}</h4>
                                </div>
                                <span
                                  className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                                    task.status === "done" && "bg-green-500/20 text-green-300",
                                    task.status === "doing" && "bg-primary/20 text-primary",
                                    task.status === "todo" && "bg-white/10 text-white/70"
                                  )}
                                >
                                  {task.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-white/60">
                                <div className="flex items-center gap-2">
                                  {assignee && (
                                    <>
                                      <img src={assignee.avatarUrl} alt={assignee.name} className="w-6 h-6 rounded-full border border-white/20" />
                                      <span>{assignee.name}</span>
                                    </>
                                  )}
                                </div>
                                <span>{new Date(task.dueDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </motion.div>
                          </Reorder.Item>
                        );
                      })}
                    </Reorder.Group>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

