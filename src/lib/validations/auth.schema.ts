import * as z from "zod"

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { error: "Le nom est trop long." }),
  email: z
    .email({ error: "Adresse email invalide." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Le mot de passe doit contenir au moins 8 caractères." })
    .regex(/[a-zA-Z]/, { error: "Le mot de passe doit contenir au moins une lettre." })
    .regex(/[0-9]/, { error: "Le mot de passe doit contenir au moins un chiffre." }),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.email({ error: "Adresse email invalide." }).trim().toLowerCase(),
  password: z.string().min(1, { error: "Le mot de passe est requis." }),
})

export type LoginInput = z.infer<typeof loginSchema>
