"use client"

import { useActionState } from "react"
import { toast } from "sonner"

import { updateProfile, type UpdateProfileFormState } from "@/actions/profile.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: UpdateProfileFormState = {}

export function UpdateProfileForm({
  name,
  email,
}: {
  name: string | null
  email: string
}) {
  async function action(
    prevState: UpdateProfileFormState,
    formData: FormData
  ): Promise<UpdateProfileFormState> {
    const result = await updateProfile(prevState, formData)
    if (result.success) {
      toast.success("Profil mis à jour.")
    }
    return result
  }

  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>Mettez à jour votre nom et votre adresse email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={name ?? ""} required />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={email} required />
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          {state.message && <p className="text-sm text-destructive">{state.message}</p>}

          <Button type="submit" disabled={pending} className="w-fit">
            {pending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
