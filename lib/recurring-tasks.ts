import { prisma } from "@/lib/prisma";
import { RecurrenceType } from "@prisma/client";

export async function generateRecurringTasks() {
  const recurringTasks = await prisma.recurringTask.findMany({
    include: {
      task: true,
    },
  });

  const now = new Date();
  const generatedTasks: any[] = [];

  for (const recurring of recurringTasks) {
    const baseTask = recurring.task;
    const lastGenerated = await prisma.task.findFirst({
      where: {
        projectId: baseTask.projectId,
        title: baseTask.title,
      },
      orderBy: { createdAt: "desc" },
    });

    let nextDate = new Date(baseTask.dueDate || baseTask.startDate || now);
    if (lastGenerated?.dueDate) {
      nextDate = new Date(lastGenerated.dueDate);
    }

    // Check if we should generate
    if (recurring.endDate && nextDate > new Date(recurring.endDate)) {
      continue;
    }

    if (recurring.occurrences) {
      const existingCount = await prisma.task.count({
        where: {
          projectId: baseTask.projectId,
          title: { startsWith: baseTask.title },
        },
      });
      if (existingCount >= recurring.occurrences) {
        continue;
      }
    }

    // Calculate next date based on recurrence type
    const nextTaskDate = calculateNextDate(
      nextDate,
      recurring.recurrenceType,
      recurring.interval,
      recurring.daysOfWeek,
      recurring.dayOfMonth
    );

    if (nextTaskDate <= now) {
      // Generate task
      const newTask = await prisma.task.create({
        data: {
          title: baseTask.title,
          description: baseTask.description,
          projectId: baseTask.projectId,
          assigneeId: baseTask.assigneeId,
          dueDate: nextTaskDate,
          startDate: baseTask.startDate
            ? new Date(
                nextTaskDate.getTime() -
                  (new Date(baseTask.dueDate || 0).getTime() -
                    new Date(baseTask.startDate).getTime())
              )
            : null,
          startTime: baseTask.startTime,
          endTime: baseTask.endTime,
          priority: baseTask.priority,
          status: "todo",
          order: baseTask.order,
        },
      });

      generatedTasks.push(newTask);
    }
  }

  return generatedTasks;
}

function calculateNextDate(
  currentDate: Date,
  recurrenceType: RecurrenceType,
  interval: number,
  daysOfWeek?: number[] | null,
  dayOfMonth?: number | null
): Date {
  const next = new Date(currentDate);

  switch (recurrenceType) {
    case "daily":
      next.setDate(next.getDate() + interval);
      break;

    case "weekly":
      if (daysOfWeek && daysOfWeek.length > 0) {
        // Find next matching day of week
        const currentDay = (next.getDay() + 6) % 7; // Monday = 0
        const nextDay = daysOfWeek.find((d) => d > currentDay) || daysOfWeek[0];
        const daysToAdd = nextDay > currentDay ? nextDay - currentDay : 7 - currentDay + nextDay;
        next.setDate(next.getDate() + daysToAdd);
      } else {
        next.setDate(next.getDate() + interval * 7);
      }
      break;

    case "monthly":
      if (dayOfMonth) {
        next.setMonth(next.getMonth() + interval);
        next.setDate(dayOfMonth);
      } else {
        next.setMonth(next.getMonth() + interval);
      }
      break;

    case "yearly":
      next.setFullYear(next.getFullYear() + interval);
      if (dayOfMonth) {
        next.setDate(dayOfMonth);
      }
      break;
  }

  return next;
}

