import { redirect } from "next/navigation"

import { ChangePasswordForm } from "@/components/profile/change-password-form"
import { NotificationPreferencesForm } from "@/components/profile/notification-preferences-form"
import { UpdateProfileForm } from "@/components/profile/update-profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const [user, notificationPreferences] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { name: true, email: true },
    }),
    prisma.notificationPreference.findMany({
      where: { userId: session.user.id },
      select: { channel: true, enabled: true },
    }),
  ])

  const preferences = Object.fromEntries(
    notificationPreferences.map((pref) => [pref.channel, pref.enabled])
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Profil</h1>
        <p className="text-sm text-muted-foreground">
          Gérez vos informations et vos préférences.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <UpdateProfileForm name={user.name} email={user.email} />
        </TabsContent>

        <TabsContent value="security">
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPreferencesForm preferences={preferences} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
