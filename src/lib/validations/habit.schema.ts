import * as z from "zod"

export const habitSchema = z.object({
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
  targetPerWeek: z.coerce
    .number({ error: "Doit être un nombre." })
    .int({ error: "Doit être un nombre entier." })
    .min(1, { error: "Minimum 1 fois par semaine." })
    .max(7, { error: "Maximum 7 fois par semaine." }),
})

export type HabitInput = z.infer<typeof habitSchema>
