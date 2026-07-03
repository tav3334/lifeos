"use server"

import bcrypt from "bcryptjs"
import * as z from "zod"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AuthError } from "next-auth"
import { loginSchema, registerSchema } from "@/lib/validations/auth.schema"

export type RegisterFormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
}

export async function registerUser(
  _prevState: RegisterFormState | undefined,
  formData: FormData
): Promise<RegisterFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  const { name, email, password } = parsed.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return {
      errors: { email: ["Cet email est déjà utilisé."] },
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
  } catch {
    return {
      message: "Une erreur est survenue lors de la création du compte.",
    }
  }

  return { success: true }
}

export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
}

export async function loginUser(
  _prevState: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email ou mot de passe incorrect." }
        default:
          return { message: "Une erreur est survenue lors de la connexion." }
      }
    }
    throw error
  }

  return {}
}
