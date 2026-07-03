"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { taskSchema } from "@/lib/validations/task.schema"

export type TaskFormState = {
  errors?: {
    title?: string[]
    description?: string[]
    priority?: string[]
    status?: string[]
    dueDate?: string[]
    projectId?: string[]
  }
  message?: string
  success?: boolean
}

export async function createTask(
  _prevState: TaskFormState | undefined,
  formData: FormData
): Promise<TaskFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    projectId: formData.get("projectId"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { title, description, priority, status, dueDate, projectId } = parsed.data

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      select: { id: true },
    })
    if (!project) {
      return { errors: { projectId: ["Projet invalide."] } }
    }
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: projectId || null,
      userId: session.user.id,
    },
  })

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  if (projectId) revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function updateTask(
  taskId: string,
  _prevState: TaskFormState | undefined,
  formData: FormData
): Promise<TaskFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    projectId: formData.get("projectId"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { title, description, priority, status, dueDate, projectId } = parsed.data

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      select: { id: true },
    })
    if (!project) {
      return { errors: { projectId: ["Projet invalide."] } }
    }
  }

  const { count } = await prisma.task.updateMany({
    where: { id: taskId, userId: session.user.id },
    data: {
      title,
      description: description || null,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: projectId || null,
    },
  })

  if (count === 0) {
    return { message: "Tâche introuvable." }
  }

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  if (projectId) revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function deleteTask(taskId: string): Promise<{ message?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const { count } = await prisma.task.deleteMany({
    where: { id: taskId, userId: session.user.id },
  })

  if (count === 0) {
    return { message: "Tâche introuvable." }
  }

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  return {}
}

export async function toggleTaskStatus(taskId: string, status: "TODO" | "DONE"): Promise<{ message?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const { count } = await prisma.task.updateMany({
    where: { id: taskId, userId: session.user.id },
    data: { status },
  })

  if (count === 0) {
    return { message: "Tâche introuvable." }
  }

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  return {}
}
