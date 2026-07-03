import * as z from "zod"

export const taskPriorityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const
export const taskStatusValues = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as const

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { error: "Le titre doit contenir au moins 2 caractères." })
    .max(150, { error: "Le titre est trop long." }),
  description: z
    .string()
    .trim()
    .max(1000, { error: "La description est trop longue." })
    .optional()
    .or(z.literal("")),
  priority: z.enum(taskPriorityValues, { error: "Priorité invalide." }),
  status: z.enum(taskStatusValues, { error: "Statut invalide." }),
  dueDate: z
    .string()
    .optional()
    .or(z.literal("")),
  projectId: z
    .string()
    .optional()
    .or(z.literal("")),
})

export type TaskInput = z.infer<typeof taskSchema>
