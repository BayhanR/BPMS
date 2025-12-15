"use client";

import * as React from "react";
import { motion, Reorder } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { Plus, Calendar as CalendarIcon, Grid3x3, LayoutList, Search, Download, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import { TaskModal } from "@/components/calendar/task-modal";
import { WeeklyView } from "@/components/calendar/weekly-view";
import { CalendarFilters } from "@/components/calendar/calendar-filters";
import { DraggableTask } from "@/components/calendar/draggable-task";
import { DroppableDay } from "@/components/calendar/droppable-day";
import { generateICal } from "@/lib/ical-export";
import { useAppStore } from "@/lib/store";
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

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  priority?: string;
  status?: string;
  projectId?: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
  };
  project?: {
    id: string;
    name: string;
    color: string;
  };
}

export default function CalendarPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { sidebarWidth } = useSidebarContext();
  const { currentWorkspaceId, setWorkspace } = useAppStore();
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [orderedTasks, setOrderedTasks] = React.useState<string[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [projects, setProjects] = React.useState<Array<{ id: string; name: string; color: string }>>([]);
  const [users, setUsers] = React.useState<Array<{ id: string; name?: string; email: string }>>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterProjectId, setFilterProjectId] = React.useState<string | undefined>();
  const [filterUserId, setFilterUserId] = React.useState<string | undefined>();
  const [filterStatus, setFilterStatus] = React.useState<string | undefined>();
  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);
  const mainRef = React.useRef<HTMLElement>(null);

  // Store'dan workspace ID al, yoksa session'dan
  const workspaceId = currentWorkspaceId || session?.user?.workspaceId;

  // Workspace yoksa workspace seçim sayfasına yönlendir
  React.useEffect(() => {
    if (sessionStatus === "authenticated" && !workspaceId) {
      router.push("/workspaces");
    }
  }, [sessionStatus, workspaceId, router]);

  // Workspace ID'yi store'a kaydet
  React.useEffect(() => {
    if (session?.user?.workspaceId && session?.user?.role) {
      setWorkspace(session.user.workspaceId, session.user.role);
    }
  }, [session?.user?.workspaceId, session?.user?.role, setWorkspace]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const days = React.useMemo(() => buildMonthDays(currentMonth), [currentMonth]);

  // Fetch tasks and projects
  React.useEffect(() => {
    if (!workspaceId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tasksRes, projectsRes, usersRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch(`/api/projects?workspaceId=${workspaceId}`),
          fetch(`/api/users?workspaceId=${workspaceId}`),
        ]);

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentMonth, workspaceId]);

  // Ensure mouse wheel scroll works on calendar container
  // Global Lenis might be preventing scroll, so we ensure native scroll works
  React.useEffect(() => {
    if (!mainRef.current) return;

    const container = mainRef.current;
    
    // Force enable native scrolling
    const handleWheel = (e: WheelEvent) => {
      // Check if we're at scroll boundaries
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // If scrolling down and at bottom, or scrolling up and at top
      // let the event bubble (for page scroll)
      if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
        return; // Allow event to bubble
      }

      // Otherwise, scroll the container
      container.scrollTop += e.deltaY;
      e.preventDefault();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterProjectId && task.projectId !== filterProjectId) {
        return false;
      }
      if (filterUserId && task.assigneeId !== filterUserId) {
        return false;
      }
      if (filterStatus && task.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [tasks, searchQuery, filterProjectId, filterUserId, filterStatus]);

  const tasksByDate = React.useMemo(() => {
    return filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
      if (task.dueDate) {
        const key = new Date(task.dueDate).toDateString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
      }
      return acc;
    }, {});
  }, [filteredTasks]);

  React.useEffect(() => {
    const key = selectedDate.toDateString();
    const list = tasksByDate[key] ?? [];
    setOrderedTasks(list.map((task) => task.id));
  }, [selectedDate, tasksByDate]);

  const selectedTasks = React.useMemo(() => {
    const key = selectedDate.toDateString();
    const list = tasksByDate[key] ?? [];
    const ordering = new Map(orderedTasks.map((id, idx) => [id, idx]));
    return [...list].sort((a, b) => {
      const orderA = ordering.get(a.id) ?? 999;
      const orderB = ordering.get(b.id) ?? 999;
      return orderA - orderB;
    });
  }, [orderedTasks, selectedDate, tasksByDate]);

  const handleExport = () => {
    const icalContent = generateICal(filteredTasks);
    const blob = new Blob([icalContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bpms-calendar-${new Date().toISOString().split("T")[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTaskSubmit = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    startTime?: string;
    endTime?: string;
    priority?: string;
    projectId?: string;
    assigneeId?: string;
  }) => {
    try {
      if (editingTask) {
        // Update task
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
        }
      } else {
        // Create task
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const newTask = await response.json();
          setTasks((prev) => [...prev, newTask]);
        }
      }

      setEditingTask(null);
    } catch (error) {
      console.error("Error submitting task:", error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    setDraggedTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const targetDate = over.id as string;

    // Check if dropped on a date cell
    if (targetDate.startsWith("date-")) {
      const newDate = new Date(targetDate.replace("date-", ""));
      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        try {
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dueDate: newDate.toISOString(),
            }),
          });

          if (response.ok) {
            const updatedTask = await response.json();
            setTasks((prev) =>
              prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
          }
        } catch (error) {
          console.error("Error updating task date:", error);
        }
      }
    }
  };

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
        <main 
          ref={mainRef} 
          className="flex-1 overflow-y-auto p-4 md:p-8 relative"
          style={{ scrollBehavior: 'smooth' }}
          data-lenis-prevent="false"
        >
          <AnimatedBackdrop />

          <motion.div
            className="relative z-10 space-y-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-white/50">Spatial Calendar</p>
                <h1 className="text-4xl md:text-5xl font-semibold text-white">
                  {viewMode === "month"
                    ? `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
                    : "Haftalık Görünüm"}
                </h1>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Görev ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                {/* Filters */}
                <CalendarFilters
                  projects={projects}
                  users={users}
                  selectedProjectId={filterProjectId}
                  selectedUserId={filterUserId}
                  selectedStatus={filterStatus}
                  onProjectChange={setFilterProjectId}
                  onUserChange={setFilterUserId}
                  onStatusChange={setFilterStatus}
                  onClear={() => {
                    setFilterProjectId(undefined);
                    setFilterUserId(undefined);
                    setFilterStatus(undefined);
                  }}
                />

                {/* Export */}
                <motion.button
                  onClick={handleExport}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </motion.button>

                {/* View Mode Switcher */}
                <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1">
                  <button
                    onClick={() => setViewMode("month")}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                      viewMode === "month"
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Ay</span>
                  </button>
                  <button
                    onClick={() => setViewMode("week")}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                      viewMode === "week"
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    <LayoutList className="w-4 h-4" />
                    <span className="hidden sm:inline">Hafta</span>
                  </button>
                </div>
                <OrbButton direction="left" onClick={() => changeMonth(-1)} />
                <OrbButton direction="right" onClick={() => changeMonth(1)} />
              </div>
            </header>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="space-y-5">
                {viewMode === "month" ? (
                  <>
                    <div className="grid grid-cols-7 gap-3">
                      {weekDays.map((day) => (
                        <p key={day} className="text-center text-xs uppercase tracking-[0.3em] text-white/40">
                          {day}
                        </p>
                      ))}
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                        {days.map((day) => {
                          const key = day.date.toDateString();
                          const dayTasks = tasksByDate[key] ?? [];
                          const isToday = key === todayKey;
                          const isSelected = key === selectedDate.toDateString();
                          const hasTasks = dayTasks.length > 0;

                          return (
                            <Tilt key={key} tiltMaxAngleX={7} tiltMaxAngleY={7} scale={isSelected ? 1.05 : 1.01} transitionSpeed={1200}>
                              <DroppableDay
                                date={day.date}
                                onClick={() => setSelectedDate(day.date)}
                                className={cn(
                                  "group relative w-full h-48 rounded-[28px] border p-5 text-left flex flex-col justify-between overflow-hidden",
                                  "bg-gradient-to-br from-white/5 via-white/2 to-white/5 border-white/10 backdrop-blur-2xl",
                                  !day.inCurrentMonth && "opacity-30",
                                  isSelected && "border-[#ff1e56]/60 shadow-[0_35px_120px_rgba(255,30,86,0.35)]"
                                )}
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
                            {dayTasks.slice(0, 2).map((task) => (
                              <DraggableTask key={task.id} task={task} />
                            ))}

                            {!hasTasks && <p className="text-white/40">Planlanmış görev yok</p>}
                          </div>
                              </DroppableDay>
                            </Tilt>
                    );
                  })}
                      </div>

                      <DragOverlay>
                        {draggedTask && (
                          <motion.div
                            className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl px-3 py-2 text-white text-xs flex items-center gap-2"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                          >
                            <span className="h-2 w-2 rounded-full bg-[#ff1e56]" />
                            <p>{draggedTask.title}</p>
                          </motion.div>
                        )}
                      </DragOverlay>
                    </DndContext>
                  </>
                ) : (
                  <WeeklyView
                    weekStart={currentMonth}
                    tasks={filteredTasks}
                    onTaskClick={(task) => {
                      setEditingTask(task);
                      setIsTaskModalOpen(true);
                    }}
                    onDateClick={(date) => setSelectedDate(date)}
                  />
                )}
              </section>

              <TaskPanel
                selectedDate={selectedDate}
                selectedTasks={selectedTasks}
                orderedTasks={orderedTasks}
                setOrderedTasks={setOrderedTasks}
                onAddTask={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onDeleteTask={handleDeleteTask}
              />

              <TaskModal
                open={isTaskModalOpen}
                onOpenChange={setIsTaskModalOpen}
                selectedDate={selectedDate}
                task={editingTask}
                projects={projects}
                users={users}
                onSubmit={handleTaskSubmit}
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
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  selectedDate: Date;
  selectedTasks: Task[];
  orderedTasks: string[];
  setOrderedTasks: (ids: string[]) => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Günlük Akış</p>
            <motion.button
              onClick={onAddTask}
              className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
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
              const assignee = task.assignee;
              const project = task.project;
              return (
                <Reorder.Item key={task.id} value={task.id} className="cursor-grab active:cursor-grabbing">
                  <motion.div
                    className="relative rounded-[24px] border border-white/10 bg-white/5 p-4 group"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {project && (
                          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 truncate">{project.name}</p>
                        )}
                        <h3 className="text-white font-semibold truncate">{task.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold capitalize border whitespace-nowrap",
                            task.status === "done" && "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                            task.status === "doing" && "bg-[#ff1e56]/15 text-[#ff879d] border-[#ff1e56]/40",
                            task.status === "todo" && "bg-white/5 text-white/60 border-white/10"
                          )}
                        >
                          {task.status}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={() => onEditTask(task)}
                            className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ✎
                          </motion.button>
                          <motion.button
                            onClick={() => onDeleteTask(task.id)}
                            className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-xs"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ×
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {task.description && (
                      <p className="mt-2 text-xs text-white/60 line-clamp-2">{task.description}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-2">
                        {assignee && (
                          <>
                            {assignee.avatarUrl ? (
                              <img
                                src={assignee.avatarUrl}
                                alt={assignee.name || assignee.email}
                                className="h-7 w-7 rounded-full border border-white/20"
                              />
                            ) : (
                              <div className="h-7 w-7 rounded-full border border-white/20 bg-primary/20 flex items-center justify-center text-xs font-semibold">
                                {(assignee.name || assignee.email)[0].toUpperCase()}
                              </div>
                            )}
                            <span>{assignee.name || assignee.email}</span>
                          </>
                        )}
                      </div>
                      {(task.startTime || task.endTime) && (
                        <div className="flex items-center gap-2">
                          {task.startTime && (
                            <>
                              <span>{new Date(task.startTime).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                              {task.endTime && (
                                <>
                                  <span className="text-white/30">→</span>
                                  <span>{new Date(task.endTime).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      )}
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
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
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

