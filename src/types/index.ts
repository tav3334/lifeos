import type { Habit, HabitLog, Project, Task } from "@/generated/prisma/client"

export type TaskWithProject = Task & {
  project: Project | null
}

export type HabitWithLogs = Habit & {
  logs: HabitLog[]
}

export type PriorityReason =
  | "OVERDUE"
  | "DUE_TODAY"
  | "DUE_SOON"
  | "URGENT_PRIORITY"
  | "HIGH_PRIORITY"

export type TaskSummary = Pick<
  Task,
  "id" | "title" | "priority" | "status" | "dueDate"
> & {
  project: Pick<Project, "id" | "name"> | null
}

export type PrioritizedTask = {
  task: TaskSummary
  score: number
  reasons: PriorityReason[]
}

export type HabitDayStatus = {
  date: string
  done: boolean
  isToday: boolean
}

export type HabitWeekSummary = {
  habit: Habit
  days: HabitDayStatus[]
  completedCount: number
}

export type TaskOverviewStats = {
  pendingCount: number
  overdueCount: number
  doneTodayCount: number
}

export type TaskStatusBreakdown = {
  status: Task["status"]
  count: number
}
