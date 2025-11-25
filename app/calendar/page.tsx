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
  const startDay = (startOfMonth.getDay() + 6) % 7;
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className="flex-1 flex flex-col"
        style={{ paddingLeft: sidebarWidth, transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <AnimatedBackdrop />

          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-white/50">Spatial Calendar</p>
                <h1 className="text-4xl md:text-5xl font-semibold text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <OrbButton direction="left" onClick={() => changeMonth(-1)} />
                <OrbButton direction="right" onClick={() => changeMonth(1)} />
              </div>
            </header>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="space-y-5">
                <div className="grid grid-cols-7 gap-3">
                  {weekDays.map((day) => (
                    <p key={day} className="text-center text-xs uppercase tracking-[0.3em] text-white/40">
                      {day}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {days.map((day) => {
                    const key = day.date.toDateString();
                    const tasks = tasksByDate[key] ?? [];
                    const isToday = key === todayKey;
                    const isSelected = key === selectedDate.toDateString();
                    const hasTasks = tasks.length > 0;

                    return (
                      <Tilt key={key} tiltMaxAngleX={7} tiltMaxAngleY={7} scale={isSelected ? 1.05 : 1.01} transitionSpeed={1200}>
                        <motion.button
                          onClick={() => setSelectedDate(day.date)}
                          className={cn(
                            "group relative w-full h-48 rounded-[28px] border p-5 text-left flex flex-col justify-between overflow-hidden",
                            "bg-gradient-to-br from-white/5 via-white/2 to-white/5 border-white/10 backdrop-blur-2xl",
                            !day.inCurrentMonth && "opacity-30",
                            isSelected && "border-[#ff1e56]/60 shadow-[0_35px_120px_rgba(255,30,86,0.35)]"
                          )}
                          whileHover={{ y: -6 }}
                        >
                          {isToday && <PulseRing />}

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                                {weekDays[(day.date.getDay() + 6) % 7]}
                              </p>
                              <h3 className="text-3xl font-bold text-white">{day.date.getDate()}</h3>
                            </div>
                            {hasTasks && (
                              <span className="rounded-full border border-[#ff1e56]/30 bg-[#ff1e56]/10 px-3 py-1 text-xs font-semibold text-white flex items-center gap-1">
                                <span className="inline-flex h-2 w-2 rounded-full bg-[#ff1e56]" />
                                {tasks.length} task
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs">
                            {tasks.slice(0, 2).map((task) => (
                              <motion.div
                                key={task.id}
                                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-white/70"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                              >
                                <span className="h-2 w-2 rounded-full bg-[#ff1e56]" />
                                <p className="truncate">{task.title}</p>
                              </motion.div>
                            ))}

                            {!hasTasks && <p className="text-white/40">Planlanmış görev yok</p>}
                          </div>
                        </motion.button>
                      </Tilt>
                    );
                  })}
                </div>
              </section>

              <TaskPanel
                selectedDate={selectedDate}
                selectedTasks={selectedTasks}
                orderedTasks={orderedTasks}
                setOrderedTasks={setOrderedTasks}
              />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function TaskPanel({
  selectedDate,
  selectedTasks,
  orderedTasks,
  setOrderedTasks,
}: {
  selectedDate: Date;
  selectedTasks: typeof mockTasks;
  orderedTasks: string[];
  setOrderedTasks: (ids: string[]) => void;
}) {
  return (
    <motion.aside
      className="relative rounded-[32px] border border-white/10 bg-[#0f0f10]/70 backdrop-blur-3xl p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] overflow-hidden"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 24 }}
    >
      <motion.div
        className="absolute inset-12 rounded-[40px] bg-gradient-to-br from-[#ff1e56]/10 via-transparent to-[#ff006e]/10 blur-3xl"
        animate={{ opacity: [0.2, 0.4, 0.2], rotate: [0, 6, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Günlük Akış</p>
          <h2 className="mt-2 text-3xl font-semibold">
            {selectedDate.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
          </h2>
          <p className="text-sm text-white/60">
            {selectedTasks.length > 0 ? `${selectedTasks.length} görev listelendi.` : "Bu güne bağlı görev bulunmuyor."}
          </p>
        </div>

        {selectedTasks.length > 0 ? (
          <Reorder.Group axis="y" values={orderedTasks} onReorder={setOrderedTasks} className="space-y-4">
            {selectedTasks.map((task) => {
              const assignee = mockUsers.find((user) => user.id === task.assigneeId);
              const project = mockProjects.find((proj) => proj.id === task.projectId);
              return (
                <Reorder.Item key={task.id} value={task.id} className="cursor-grab active:cursor-grabbing">
                  <motion.div
                    className="relative rounded-[24px] border border-white/10 bg-white/5 p-4"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">{project?.name}</p>
                        <h3 className="text-white font-semibold">{task.title}</h3>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold capitalize border",
                          task.status === "done" && "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                          task.status === "doing" && "bg-[#ff1e56]/15 text-[#ff879d] border-[#ff1e56]/40",
                          task.status === "todo" && "bg-white/5 text-white/60 border-white/10"
                        )}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-2">
                        {assignee && (
                          <>
                            <img
                              src={assignee.avatarUrl}
                              alt={assignee.name}
                              className="h-7 w-7 rounded-full border border-white/20"
                            />
                            <span>{assignee.name}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{new Date(task.startDate ?? task.dueDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="text-white/30">→</span>
                        <span>{new Date(task.dueDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </motion.div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <motion.div
            className="rounded-[28px] border border-dashed border-white/15 bg-white/5 p-6 text-center text-white/60"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            <p>Sükunet modu. Bugüne tanımlı task yok.</p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}

function OrbButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center overflow-hidden"
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff1e56]/15 to-[#ff006e]/20 blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <span className="relative z-10 text-xl">{direction === "left" ? "←" : "→"}</span>
    </motion.button>
  );
}

function PulseRing() {
  return (
    <motion.div
      className="absolute inset-0 rounded-[28px] border border-[#ff1e56]/40"
      animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0, 0.7] }}
      transition={{ duration: 2.2, repeat: Infinity }}
    />
  );
}

function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
      {[...Array(20)].map((_, idx) => (
        <motion.div
          key={`particle-${idx}`}
          className="absolute h-2 w-2 rounded-full bg-[#ff1e56]/40 blur-[2px]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, idx % 2 === 0 ? -20 : 20, 0],
            x: [0, idx % 2 === 0 ? 15 : -15, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 6 + idx * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.04) 0%, transparent 45%), linear-gradient(300deg, rgba(255,30,86,0.12) 0%, transparent 55%)`,
        }}
      />
    </div>
  );
}

