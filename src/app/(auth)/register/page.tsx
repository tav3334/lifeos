"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

import { registerUser, type RegisterFormState } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: RegisterFormState = {}

export default function RegisterPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState(registerUser, initialState)

  useEffect(() => {
    if (state.success) {
      router.push("/login")
    }
  }, [state.success, router])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Renseignez vos informations pour rejoindre LifeOS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" placeholder="Jean Dupont" autoComplete="name" required />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jean@example.com"
              autoComplete="email"
              required
            />
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            {state.errors?.password && (
              <ul className="text-sm text-destructive">
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          {state.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Création en cours..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
