import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    assigneeId: z.string().optional(),
    dueDate: z.string().datetime().optional().nullable(), // Allow ISO string or null
    startDate: z.string().datetime().optional().nullable(),
    startTime: z.string().datetime().optional().nullable(),
    endTime: z.string().datetime().optional().nullable(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    status: z.enum(["todo", "doing", "done"]).optional(),
    labels: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
