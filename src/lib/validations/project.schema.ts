import * as z from "zod"

export const projectStatusValues = ["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"] as const

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { error: "Le nom est trop long." }),
  description: z
    .string()
    .trim()
    .max(1000, { error: "La description est trop longue." })
    .optional()
    .or(z.literal("")),
  status: z.enum(projectStatusValues, { error: "Statut invalide." }),
})

export type ProjectInput = z.infer<typeof projectSchema>
