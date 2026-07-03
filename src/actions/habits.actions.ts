"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { habitSchema } from "@/lib/validations/habit.schema"

export type HabitFormState = {
  errors?: {
    name?: string[]
    description?: string[]
    targetPerWeek?: string[]
  }
  message?: string
  success?: boolean
}

export async function createHabit(
  _prevState: HabitFormState | undefined,
  formData: FormData
): Promise<HabitFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    targetPerWeek: formData.get("targetPerWeek"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { name, description, targetPerWeek } = parsed.data

  await prisma.habit.create({
    data: {
      name,
      description: description || null,
      targetPerWeek,
      userId: session.user.id,
    },
  })

  revalidatePath("/habits")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateHabit(
  habitId: string,
  _prevState: HabitFormState | undefined,
  formData: FormData
): Promise<HabitFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    targetPerWeek: formData.get("targetPerWeek"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { name, description, targetPerWeek } = parsed.data

  const { count } = await prisma.habit.updateMany({
    where: { id: habitId, userId: session.user.id },
    data: { name, description: description || null, targetPerWeek },
  })

  if (count === 0) {
    return { message: "Habitude introuvable." }
  }

  revalidatePath("/habits")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteHabit(habitId: string): Promise<{ message?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const { count } = await prisma.habit.deleteMany({
    where: { id: habitId, userId: session.user.id },
  })

  if (count === 0) {
    return { message: "Habitude introuvable." }
  }

  revalidatePath("/habits")
  revalidatePath("/dashboard")
  return {}
}

function todayDateOnly(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export async function toggleHabitToday(habitId: string): Promise<{ message?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: session.user.id },
    select: { id: true },
  })
  if (!habit) {
    return { message: "Habitude introuvable." }
  }

  const date = todayDateOnly()

  const existingLog = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date } },
  })

  if (existingLog) {
    await prisma.habitLog.delete({ where: { id: existingLog.id } })
  } else {
    await prisma.habitLog.create({ data: { habitId, date, done: true } })
  }

  revalidatePath("/habits")
  revalidatePath("/dashboard")
  return {}
}
