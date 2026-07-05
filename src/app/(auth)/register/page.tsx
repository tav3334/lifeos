"use client"

import Link from "next/link"
import { Lock, Mail, User } from "lucide-react"
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
        <CardTitle className="text-xl">Créer un compte</CardTitle>
        <CardDescription>
          Renseignez vos informations pour rejoindre LifeOS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nom</Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="Jean Dupont"
                autoComplete="name"
                aria-invalid={!!state.errors?.name}
                className="pl-8"
                required
              />
            </div>
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jean@example.com"
                autoComplete="email"
                aria-invalid={!!state.errors?.email}
                className="pl-8"
                required
              />
            </div>
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!state.errors?.password}
                className="pl-8"
                required
              />
            </div>
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
          <Link href="/login" className="font-medium text-primary underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
