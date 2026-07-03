"use client"

import { useActionState, useRef } from "react"
import { toast } from "sonner"

import { changePassword, type ChangePasswordFormState } from "@/actions/profile.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: ChangePasswordFormState = {}

export function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function action(
    prevState: ChangePasswordFormState,
    formData: FormData
  ): Promise<ChangePasswordFormState> {
    const result = await changePassword(prevState, formData)
    if (result.success) {
      toast.success("Mot de passe modifié.")
      formRef.current?.reset()
    }
    return result
  }

  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe</CardTitle>
        <CardDescription>Modifiez le mot de passe de votre compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
            {state.errors?.currentPassword && (
              <p className="text-sm text-destructive">{state.errors.currentPassword[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
            />
            {state.errors?.newPassword && (
              <p className="text-sm text-destructive">{state.errors.newPassword[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
            {state.errors?.confirmPassword && (
              <p className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>
            )}
          </div>

          {state.message && <p className="text-sm text-destructive">{state.message}</p>}

          <Button type="submit" disabled={pending} className="w-fit">
            {pending ? "Enregistrement..." : "Modifier le mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
