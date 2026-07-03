import "server-only"

import { prisma } from "@/lib/prisma"
import type { HabitDayStatus, HabitWeekSummary } from "@/types"

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
