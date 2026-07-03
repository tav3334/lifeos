"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import * as z from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  changePasswordSchema,
  notificationChannelValues,
  updateProfileSchema,
} from "@/lib/validations/profile.schema"

export type UpdateProfileFormState = {
  errors?: {
    name?: string[]
    email?: string[]
  }
  message?: string
  success?: boolean
}

export async function updateProfile(
  _prevState: UpdateProfileFormState | undefined,
  formData: FormData
): Promise<UpdateProfileFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { name, email } = parsed.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser && existingUser.id !== session.user.id) {
    return { errors: { email: ["Cet email est déjà utilisé."] } }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
  })

  revalidatePath("/profile")
  return { success: true }
}

export type ChangePasswordFormState = {
  errors?: {
    currentPassword?: string[]
    newPassword?: string[]
    confirmPassword?: string[]
  }
  message?: string
  success?: boolean
}

export async function changePassword(
  _prevState: ChangePasswordFormState | undefined,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { currentPassword, newPassword } = parsed.data

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.password) {
    return { message: "Impossible de changer le mot de passe pour ce compte." }
  }

  const passwordsMatch = await bcrypt.compare(currentPassword, user.password)
  if (!passwordsMatch) {
    return { errors: { currentPassword: ["Mot de passe actuel incorrect."] } }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return { success: true }
}

export async function toggleNotificationChannel(
  channel: (typeof notificationChannelValues)[number],
  enabled: boolean
): Promise<{ message?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." }
  }

  await prisma.notificationPreference.upsert({
    where: { userId_channel: { userId: session.user.id, channel } },
    create: { userId: session.user.id, channel, enabled },
    update: { enabled },
  })

  revalidatePath("/profile")
  return {}
}
