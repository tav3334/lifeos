import "server-only"

import { prisma } from "@/lib/prisma"
import type { PrioritizedTask, PriorityReason, TaskSummary } from "@/types"

const PRIORITY_WEIGHTS: Record<TaskSummary["priority"], number> = {
  URGENT: 40,
  HIGH: 25,
  MEDIUM: 10,
  LOW: 0,
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function scoreTask(task: TaskSummary, now: Date): { score: number; reasons: PriorityReason[] } {
  const reasons: PriorityReason[] = []
  let score = PRIORITY_WEIGHTS[task.priority]

  if (task.priority === "URGENT") reasons.push("URGENT_PRIORITY")
  if (task.priority === "HIGH") reasons.push("HIGH_PRIORITY")

  if (task.dueDate) {
    const daysUntilDue = (task.dueDate.getTime() - now.getTime()) / MS_PER_DAY

    if (daysUntilDue < 0) {
      score += 100 + Math.min(Math.abs(daysUntilDue), 30) * 2
      reasons.push("OVERDUE")
    } else if (daysUntilDue < 1) {
      score += 60
      reasons.push("DUE_TODAY")
    } else if (daysUntilDue <= 3) {
      score += 30 - daysUntilDue * 5
      reasons.push("DUE_SOON")
    }
  }

  return { score, reasons }
}

export async function getPrioritizedTasks(
  userId: string,
  limit = 5
): Promise<PrioritizedTask[]> {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: { in: ["TODO", "IN_PROGRESS"] },
    },
    select: {
      id: true,
      title: true,
      priority: true,
      status: true,
      dueDate: true,
      project: { select: { id: true, name: true } },
    },
  })

  const now = new Date()

  return tasks
    .map((task) => {
      const { score, reasons } = scoreTask(task, now)
      return { task, score, reasons }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
