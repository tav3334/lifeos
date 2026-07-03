"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations/project.schema"

export type ProjectFormState = {
  errors?: {
    name?: string[]
    description?: string[]
    status?: string[]
  }
  message?: string
  success?: boolean
}

export async function createProject(
  _prevState: ProjectFormState | undefined,
  formData: FormData
): Promise<ProjectFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { name, description, status } = parsed.data

  await prisma.project.create({
    data: {
      name,
      description: description || null,
      status,
      userId: session.user.id,
    },
  })

  revalidatePath("/projects")
  return { success: true }
}

export async function updateProject(
  projectId: string,
  _prevState: ProjectFormState | undefined,
  formData: FormData
): Promise<ProjectFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { name, description, status } = parsed.data

  const { count } = await prisma.project.updateMany({
    where: { id: projectId, userId: session.user.id },
    data: { name, description: description || null, status },
  })

  if (count === 0) {
    return { message: "Projet introuvable." }
  }

  revalidatePath("/projects")
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function deleteProject(projectId: string): Promise<{ message?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const { count } = await prisma.project.deleteMany({
    where: { id: projectId, userId: session.user.id },
  })

  if (count === 0) {
    return { message: "Projet introuvable." }
  }

  revalidatePath("/projects")
  return {}
}
