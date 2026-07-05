import "server-only"

import { prisma } from "@/lib/prisma"
import { EMAIL_FROM, resend } from "@/notifications/resend-client"
import { renderHabitReminderEmail } from "@/notifications/templates/habit-reminder"
import { renderOverdueTasksEmail } from "@/notifications/templates/overdue-tasks"
import { renderUpcomingTasksEmail } from "@/notifications/templates/upcoming-tasks"
import { renderWeeklySummaryEmail } from "@/notifications/templates/weekly-summary"

async function getEmailSubscribers() {
  return prisma.user.findMany({
    where: {
      notificationPreferences: {
        some: { channel: "EMAIL", enabled: true },
      },
    },
    select: { id: true, email: true, name: true },
  })
}

async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({ from: EMAIL_FROM, to, subject, html })
}

export async function sendOverdueTaskNotifications(): Promise<void> {
  const users = await getEmailSubscribers()
  const now = new Date()

  for (const user of users) {
    const overdueTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: { in: ["TODO", "IN_PROGRESS"] },
        dueDate: { lt: now },
      },
      select: { title: true },
      orderBy: { dueDate: "asc" },
      take: 10,
    })

    if (overdueTasks.length === 0) continue

    const { subject, html } = renderOverdueTasksEmail(overdueTasks.map((t) => t.title))
    await sendEmail(user.email, subject, html)
  }
}

export async function sendUpcomingTaskNotifications(): Promise<void> {
  const users = await getEmailSubscribers()
  const now = new Date()
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  for (const user of users) {
    const upcomingTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: { in: ["TODO", "IN_PROGRESS"] },
        dueDate: { gte: now, lte: in48h },
      },
      select: { title: true },
      orderBy: { dueDate: "asc" },
      take: 10,
    })

    if (upcomingTasks.length === 0) continue

    const { subject, html } = renderUpcomingTasksEmail(upcomingTasks.map((t) => t.title))
    await sendEmail(user.email, subject, html)
  }
}

export async function sendHabitReminderNotifications(): Promise<void> {
  const users = await getEmailSubscribers()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)

  for (const user of users) {
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      select: {
        name: true,
        logs: {
          where: { date: { gte: todayStart, lt: todayEnd }, done: true },
          select: { id: true },
        },
      },
    })

    const pendingHabits = habits.filter((habit) => habit.logs.length === 0)
    if (pendingHabits.length === 0) continue

    const { subject, html } = renderHabitReminderEmail(pendingHabits.map((h) => h.name))
    await sendEmail(user.email, subject, html)
  }
}

export async function sendWeeklySummaryNotifications(): Promise<void> {
  const users = await getEmailSubscribers()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  for (const user of users) {
    const [tasksCompleted, tasksCreated, habitLogs, totalHabits] = await Promise.all([
      prisma.task.count({
        where: { userId: user.id, status: "DONE", updatedAt: { gte: weekAgo } },
      }),
      prisma.task.count({
        where: { userId: user.id, createdAt: { gte: weekAgo } },
      }),
      prisma.habitLog.count({
        where: { habit: { userId: user.id }, date: { gte: weekAgo }, done: true },
      }),
      prisma.habit.count({ where: { userId: user.id } }),
    ])

    const maxPossibleLogs = totalHabits * 7
    const habitCompletionRate =
      maxPossibleLogs > 0 ? Math.round((habitLogs / maxPossibleLogs) * 100) : 0

    const { subject, html } = renderWeeklySummaryEmail({
      tasksCompleted,
      tasksCreated,
      habitCompletionRate,
    })
    await sendEmail(user.email, subject, html)
  }
}
