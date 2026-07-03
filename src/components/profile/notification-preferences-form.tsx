"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { toggleNotificationChannel } from "@/actions/profile.actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const CHANNELS = [
  { value: "EMAIL", label: "Email", description: "Recevoir les notifications par email." },
  { value: "PUSH", label: "Push", description: "Recevoir les notifications push sur vos appareils." },
] as const

type NotificationPreferencesFormProps = {
  preferences: Record<string, boolean>
}

export function NotificationPreferencesForm({ preferences }: NotificationPreferencesFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle(channel: "EMAIL" | "PUSH", enabled: boolean) {
    startTransition(async () => {
      const result = await toggleNotificationChannel(channel, enabled)
      if (result.message) {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>Choisissez comment vous souhaitez être notifié.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {CHANNELS.map((channel) => (
          <div key={channel.value} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={`channel-${channel.value}`}>{channel.label}</Label>
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            </div>
            <Switch
              id={`channel-${channel.value}`}
              checked={preferences[channel.value] ?? false}
              disabled={isPending}
              onCheckedChange={(checked) => handleToggle(channel.value, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
