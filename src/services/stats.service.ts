import "server-only"

import { prisma } from "@/lib/prisma"
import type { HabitDayStatus, HabitWeekSummary, TaskOverviewStats, TaskStatusBreakdown } from "@/types"

function startOfWeek(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export async function getWeeklyHabitSummary(userId: string): Promise<HabitWeekSummary[]> {
  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      logs: {
        where: {
          date: { gte: weekStart, lt: weekEnd },
        },
        select: { date: true, done: true },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  const todayKey = toDateKey(today)

  return habits.map((habit) => {
    const logsByDate = new Map(habit.logs.map((log) => [toDateKey(log.date), log.done]))

    const days: HabitDayStatus[] = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + index)
      const dateKey = toDateKey(date)

      return {
        date: dateKey,
        done: logsByDate.get(dateKey) ?? false,
        isToday: dateKey === todayKey,
      }
    })

    return {
      habit,
      days,
      completedCount: days.filter((day) => day.done).length,
    }
  })
}

export async function getTaskOverviewStats(userId: string): Promise<TaskOverviewStats> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)

  const [pendingCount, overdueCount, doneTodayCount] = await Promise.all([
    prisma.task.count({
      where: { userId, status: { in: ["TODO", "IN_PROGRESS"] } },
    }),
    prisma.task.count({
      where: {
        userId,
        status: { in: ["TODO", "IN_PROGRESS"] },
        dueDate: { lt: todayStart },
      },
    }),
    prisma.task.count({
      where: {
        userId,
        status: "DONE",
        updatedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
  ])

  return { pendingCount, overdueCount, doneTodayCount }
}

export async function getTaskStatusBreakdown(userId: string): Promise<TaskStatusBreakdown[]> {
  const counts = await prisma.task.groupBy({
    by: ["status"],
    where: { userId },
    _count: true,
  })

  const countByStatus = new Map(counts.map((row) => [row.status, row._count]))

  return (["TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as const).map((status) => ({
    status,
    count: countByStatus.get(status) ?? 0,
  }))
}
