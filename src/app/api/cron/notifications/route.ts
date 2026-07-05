import { NextResponse } from "next/server"

import {
  sendHabitReminderNotifications,
  sendOverdueTaskNotifications,
  sendUpcomingTaskNotifications,
  sendWeeklySummaryNotifications,
} from "@/notifications/notification.service"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await Promise.all([
    sendOverdueTaskNotifications(),
    sendUpcomingTaskNotifications(),
    sendHabitReminderNotifications(),
  ])

  const isSunday = new Date().getDay() === 0
  if (isSunday) {
    await sendWeeklySummaryNotifications()
  }

  return NextResponse.json({ success: true })
}
