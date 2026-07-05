import { renderButton, renderEmailLayout, renderList } from "@/notifications/templates/layout"

const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export function renderHabitReminderEmail(habitNames: string[]): { subject: string; html: string } {
  const count = habitNames.length
  const subject = `N'oubliez pas ${count > 1 ? "vos habitudes" : "votre habitude"} du jour`

  const body = `
    <p style="margin:0 0 12px;font-size:14px;color:#3f3f46;">
      Il vous reste ${count} habitude${count > 1 ? "s" : ""} à cocher aujourd'hui :
    </p>
    ${renderList(habitNames)}
    ${renderButton("Voir mes habitudes", `${APP_URL}/habits`)}
  `

  return { subject, html: renderEmailLayout(subject, body) }
}
