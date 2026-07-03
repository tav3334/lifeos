import * as z from "zod"

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { error: "Le nom est trop long." }),
  email: z.email({ error: "Adresse email invalide." }).trim().toLowerCase(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Le mot de passe actuel est requis." }),
    newPassword: z
      .string()
      .min(8, { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." })
      .regex(/[a-zA-Z]/, { error: "Doit contenir au moins une lettre." })
      .regex(/[0-9]/, { error: "Doit contenir au moins un chiffre." }),
    confirmPassword: z.string().min(1, { error: "Veuillez confirmer le mot de passe." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export const notificationChannelValues = ["EMAIL", "PUSH", "NONE"] as const
