"use client";

import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/kanban/task-card";
import { NewTaskModal } from "@/components/kanban/new-task-modal";
import { TaskDetailModal } from "@/components/kanban/task-detail-modal";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/components/sidebar-context";
import { useAppStore } from "@/lib/store";
import { usePermissions } from "@/hooks/use-permissions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Task {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  order: number;
  dueDate?: string;
  assignee?: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
  labels: Array<{
    label: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  project: {
    id: string;
    name: string;
    color: string;
  };
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function KanbanBoardPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { data: session, status: sessionStatus } = useSession();
  const { currentWorkspaceId, setProject } = useAppStore();
  const { canCreateTask, canEditTask } = usePermissions();
  const { sidebarWidth } = useSidebarContext();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [targetColumn, setTargetColumn] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = React.useState(false);

  // Tasks API çağrısı
  const { data: tasks, error, isLoading, mutate } = useSWR<Task[]>(
    projectId ? `/api/tasks?projectId=${projectId}` : null,
    fetcher
  );

  // Workspace members (assignee dropdown için)
  const { data: members } = useSWR(
    currentWorkspaceId ? `/api/users?workspaceId=${currentWorkspaceId}` : null,
    fetcher
  );

  // Project ID'yi store'a kaydet
  React.useEffect(() => {
    if (projectId) {
      setProject(projectId);
    }
  }, [projectId, setProject]);

  // Task'ları column'lara göre grupla
  const columns = React.useMemo<Column[]>(() => {
    if (!tasks) return [];

    const grouped: Record<string, Task[]> = {
      todo: [],
      doing: [],
      done: [],
    };

    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    // Her column'u order'a göre sırala
    Object.keys(grouped).forEach((status) => {
      grouped[status].sort((a, b) => a.order - b.order);
    });

    return [
      { id: "todo", title: "Yapılacak", tasks: grouped.todo },
      { id: "doing", title: "Devam Ediyor", tasks: grouped.doing },
      { id: "done", title: "Tamamlandı", tasks: grouped.done },
    ];
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !canEditTask) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find columns and tasks
    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );
    const overColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === overId) || col.id === overId
    );

    if (!activeColumn || !overColumn) return;

    const activeTask = activeColumn.tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    // Hedef column'un status değeri
    const newStatus = overColumn.id as "todo" | "doing" | "done";

    // Status veya sıralama değiştiyse API'ye gönder
    if (activeColumn.id !== overColumn.id || activeTask.status !== newStatus) {
      try {
        // Optimistic update
        mutate(
          (currentTasks) =>
            currentTasks?.map((t) =>
              t.id === activeId ? { ...t, status: newStatus } : t
            ),
          false
        );

        // API çağrısı
        await fetch(`/api/tasks/${activeId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        // Veriyi yeniden çek
        mutate();
      } catch (error) {
        console.error("Status update error:", error);
        mutate(); // Hata durumunda eski veriye dön
      }
    }
  };

  const handleAddTask = (columnId: string) => {
    setTargetColumn(columnId);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = async (taskData: {
    title: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
    priority?: string;
  }) => {
    if (!targetColumn) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          projectId,
          status: targetColumn,
        }),
      });

      if (res.ok) {
        mutate(); // Listeyi yenile
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Task create error:", error);
    }
  };

  const activeTask = tasks?.find((task) => task.id === activeId);

  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Görevler yüklenirken bir hata oluştu.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={contentStyle}>
        <Topbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Kanban Board</h1>
            <p className="text-white/60">
              {tasks?.length || 0} görev · Sürükle bırak ile durumları değiştir
            </p>
          </motion.div>

          {/* Board */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columns.map((c) => c.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex gap-4 h-full min-h-[600px] md:flex-row flex-col">
                  {columns.map((column) => (
                    <KanbanColumn
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      tasks={column.tasks.map((task) => ({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        assignees: task.assignee
                          ? [
                              {
                                id: task.assignee.id,
                                name: task.assignee.name || task.assignee.email,
                                avatar: task.assignee.avatarUrl || "",
                              },
                            ]
                          : [],
                        labels: task.labels.map((l) => l.label),
                        dueDate: task.dueDate,
                        priority: task.priority,
                      }))}
                      onAddTask={canCreateTask ? handleAddTask : undefined}
                      onTaskClick={(task) => {
                        const fullTask = tasks?.find((t) => t.id === task.id);
                        if (fullTask) {
                          setSelectedTask(fullTask);
                          setIsTaskDetailOpen(true);
                        }
                      }}
                    />
                  ))}
                </div>
              </SortableContext>

              {/* Drag Overlay */}
              <DragOverlay>
                {activeTask && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0 }}
                    style={{ width: 320 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  >
                    <TaskCard
                      task={{
                        id: activeTask.id,
                        title: activeTask.title,
                        description: activeTask.description,
                        assignees: activeTask.assignee
                          ? [
                              {
                                id: activeTask.assignee.id,
                                name:
                                  activeTask.assignee.name ||
                                  activeTask.assignee.email,
                                avatar: activeTask.assignee.avatarUrl || "",
                              },
                            ]
                          : [],
                        labels: activeTask.labels.map((l) => l.label),
                        dueDate: activeTask.dueDate,
                        priority: activeTask.priority,
                      }}
                      onClick={() => {}}
                    />
                  </motion.div>
                )}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Floating Add Button */}
          {canCreateTask && (
            <motion.button
              onClick={() => {
                setTargetColumn("todo");
                setIsModalOpen(true);
              }}
              className={cn(
                "fixed bottom-8 right-8 w-16 h-16 rounded-full",
                "bg-gradient-to-r from-primary to-accent",
                "shadow-2xl",
                "flex items-center justify-center",
                "text-white",
                "z-40",
                "group"
              )}
              style={{ boxShadow: "0 8px 32px rgba(255, 30, 86, 0.38)" }}
              whileHover={{
                scale: 1.1,
                y: -4,
                boxShadow: "0 12px 48px rgba(255, 30, 86, 0.58)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-8 h-8 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>
          )}

          {/* New Task Modal */}
          <NewTaskModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            columnId={targetColumn || ""}
            onSubmit={handleTaskSubmit}
            members={members || []}
            projectId={projectId}
          />

          {/* Task Detail Modal */}
          {selectedTask && (
            <TaskDetailModal
              open={isTaskDetailOpen}
              onOpenChange={setIsTaskDetailOpen}
              task={{
                id: selectedTask.id,
                title: selectedTask.title,
                description: selectedTask.description,
                assignees: selectedTask.assignee
                  ? [
                      {
                        id: selectedTask.assignee.id,
                        name:
                          selectedTask.assignee.name ||
                          selectedTask.assignee.email,
                        avatar: selectedTask.assignee.avatarUrl || "",
                      },
                    ]
                  : [],
                labels: selectedTask.labels.map((l) => l.label),
                dueDate: selectedTask.dueDate,
                priority: selectedTask.priority,
              }}
              subtasks={
                selectedTask.subtasks?.map((s) => ({
                  id: s.id,
                  title: s.title,
                  completed: s.completed,
                })) || []
              }
              comments={[]}
              attachments={[]}
              onUpdate={() => mutate()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
