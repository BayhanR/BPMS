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
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/kanban/task-card";
import { NewTaskModal } from "@/components/kanban/new-task-modal";
import { TaskDetailModal } from "@/components/kanban/task-detail-modal";
import { Plus, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  assignees: Array<{ id: string; name: string; avatar: string }>;
  labels: Array<{ id: string; name: string; color: string }>;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function KanbanBoardPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [targetColumn, setTargetColumn] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = React.useState(false);

  // Socket.io setup (ready for integration)
  React.useEffect(() => {
    // In production, use actual server URL
    // const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
    // setSocket(newSocket);

    // Mock socket for now
    // return () => {
    //   newSocket.close();
    // };
  }, [projectId]);

  // Emit task moved event
  const emitTaskMoved = (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    if (socket) {
      socket.emit("task-moved", {
        projectId,
        taskId,
        fromColumnId,
        toColumnId,
        newIndex,
      });
    }
  };

  const [columns, setColumns] = React.useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "task-1",
          title: "Design new dashboard layout",
          description: "Create wireframes and mockups for the new dashboard",
          assignees: [
            { id: "1", name: "John Doe", avatar: "" },
            { id: "2", name: "Jane Smith", avatar: "" },
          ],
          labels: [
            { id: "design", name: "Design", color: "#8b5cf6" },
            { id: "ui", name: "UI/UX", color: "#ec4899" },
          ],
          dueDate: "2024-12-15",
          priority: "high",
        },
        {
          id: "task-2",
          title: "Implement authentication",
          description: "Set up user authentication and authorization",
          coverImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400",
          assignees: [{ id: "3", name: "Mike Johnson", avatar: "" }],
          labels: [{ id: "backend", name: "Backend", color: "#06b6d4" }],
          dueDate: "2024-12-20",
          priority: "medium",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "task-3",
          title: "Fix responsive issues",
          description: "Fix mobile responsive problems on dashboard",
          assignees: [
            { id: "1", name: "John Doe", avatar: "" },
            { id: "4", name: "Sarah Wilson", avatar: "" },
          ],
          labels: [
            { id: "frontend", name: "Frontend", color: "#10b981" },
            { id: "bug", name: "Bug", color: "#ef4444" },
          ],
          dueDate: "2024-12-10",
          priority: "high",
        },
        {
          id: "task-4",
          title: "Write API documentation",
          description: "Document all API endpoints and methods",
          assignees: [{ id: "2", name: "Jane Smith", avatar: "" }],
          labels: [{ id: "documentation", name: "Documentation", color: "#f59e0b" }],
          priority: "low",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      tasks: [
        {
          id: "task-5",
          title: "Code review for PR #123",
          description: "Review the pull request for new features",
          assignees: [{ id: "3", name: "Mike Johnson", avatar: "" }],
          labels: [{ id: "review", name: "Review", color: "#6366f1" }],
          dueDate: "2024-12-08",
          priority: "medium",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "task-6",
          title: "Setup CI/CD pipeline",
          description: "Configure continuous integration and deployment",
          assignees: [
            { id: "4", name: "Sarah Wilson", avatar: "" },
            { id: "5", name: "Tom Brown", avatar: "" },
          ],
          labels: [{ id: "devops", name: "DevOps", color: "#14b8a6" }],
          dueDate: "2024-12-05",
          priority: "high",
        },
      ],
    },
  ]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

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

    const activeTaskIndex = activeColumn.tasks.findIndex((task) => task.id === activeId);
    const activeTask = activeColumn.tasks[activeTaskIndex];

    // If dropped on a task, insert before that task
    // If dropped on a column, append to the end
    let newIndex: number;
    if (overColumn.tasks.some((task) => task.id === overId)) {
      newIndex = overColumn.tasks.findIndex((task) => task.id === overId);
    } else {
      newIndex = overColumn.tasks.length;
    }

    // Move task
    if (activeColumn.id === overColumn.id) {
      // Same column - reorder
      const newTasks = arrayMove(activeColumn.tasks, activeTaskIndex, newIndex);
      setColumns((cols) =>
        cols.map((col) =>
          col.id === activeColumn.id ? { ...col, tasks: newTasks } : col
        )
      );
    } else {
      // Different column - move
      const newActiveTasks = activeColumn.tasks.filter((task) => task.id !== activeId);
      const newOverTasks = [...overColumn.tasks];
      newOverTasks.splice(newIndex, 0, activeTask);

      setColumns((cols) =>
        cols.map((col) => {
          if (col.id === activeColumn.id) {
            return { ...col, tasks: newActiveTasks };
          }
          if (col.id === overColumn.id) {
            return { ...col, tasks: newOverTasks };
          }
          return col;
        })
      );

      // Emit socket event
      emitTaskMoved(activeId, activeColumn.id, overColumn.id, newIndex);
    }
  };

  const handleAddTask = (columnId: string) => {
    setTargetColumn(columnId);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (taskData: {
    title: string;
    description?: string;
    assignees: string[];
    labels: string[];
    dueDate?: string;
    coverImage?: string;
  }) => {
    if (!targetColumn) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      coverImage: taskData.coverImage,
      assignees: [],
      labels: [],
      dueDate: taskData.dueDate,
      priority: "medium",
    };

    setColumns((cols) =>
      cols.map((col) =>
        col.id === targetColumn
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );
  };

  const activeTask = columns
    .flatMap((col) => col.tasks)
    .find((task) => task.id === activeId);

  const columnIds = columns.map((col) => col.id);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-80 ml-0">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
            }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Kanban Board</h1>
            <p className="text-white/60">Drag and drop tasks to organize your workflow</p>
          </motion.div>

          {/* Board */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-4 h-full min-h-[600px] md:flex-row flex-col">
                  {columns.map((column) => (
                    <KanbanColumn
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      tasks={column.tasks}
                      onAddTask={handleAddTask}
                      onTaskClick={(task) => {
                        setSelectedTask(task);
                        setIsTaskDetailOpen(true);
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
                    style={{
                      width: 320,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 20,
                    }}
                  >
                    <TaskCard task={activeTask} onClick={() => {}} />
                  </motion.div>
                )}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Floating Add Button */}
          <motion.button
            onClick={() => {
              setTargetColumn(columns[0]?.id || null);
              setIsModalOpen(true);
            }}
            className={cn(
              "fixed bottom-8 right-8 w-16 h-16 rounded-full",
              "bg-gradient-to-r from-purple-500 to-indigo-600",
              "shadow-2xl",
              "flex items-center justify-center",
              "text-white",
              "z-40",
              "group"
            )}
            style={{
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
            }}
            whileHover={{
              scale: 1.1,
              y: -4,
              boxShadow: "0 12px 48px rgba(139, 92, 246, 0.6)",
              transition: {
                type: "spring",
                stiffness: 150,
                damping: 20,
              },
            }}
            whileTap={{
              scale: 0.95,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
              },
            }}
            animate={{
              boxShadow: [
                "0 8px 32px rgba(139, 92, 246, 0.4)",
                "0 12px 48px rgba(139, 92, 246, 0.6)",
                "0 8px 32px rgba(139, 92, 246, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Plus className="w-8 h-8 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
          </motion.button>

          {/* New Task Modal */}
          <NewTaskModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            columnId={targetColumn || ""}
            onSubmit={handleTaskSubmit}
          />

          {/* Task Detail Modal */}
          {selectedTask && (
            <TaskDetailModal
              open={isTaskDetailOpen}
              onOpenChange={setIsTaskDetailOpen}
              task={selectedTask}
              subtasks={[
                { id: "1", title: "Wireframes oluştur", completed: true },
                { id: "2", title: "Mockup tasarla", completed: false },
                { id: "3", title: "Kullanıcı testi yap", completed: false },
              ]}
              comments={[
                {
                  id: "1",
                  author: "John Doe",
                  content: "Harika bir başlangıç!",
                  timestamp: new Date(),
                },
                {
                  id: "2",
                  author: "Jane Smith",
                  content: "Detayları görüşmek isterim.",
                  timestamp: new Date(Date.now() - 3600000),
                },
              ]}
              attachments={[
                {
                  id: "1",
                  name: "design-mockup.png",
                  url: "#",
                  size: "2.4 MB",
                  type: "image/png",
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
