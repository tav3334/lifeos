import { renderButton, renderEmailLayout, renderList } from "@/notifications/templates/layout"

const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export function renderUpcomingTasksEmail(taskTitles: string[]): { subject: string; html: string } {
  const count = taskTitles.length
  const subject = `${count} échéance${count > 1 ? "s" : ""} à venir`

  const body = `
    <p style="margin:0 0 12px;font-size:14px;color:#3f3f46;">
      Ces tâches arrivent à échéance aujourd'hui ou demain :
    </p>
    ${renderList(taskTitles)}
    ${renderButton("Voir mes tâches", `${APP_URL}/tasks`)}
  `

  return { subject, html: renderEmailLayout(subject, body) }
}
