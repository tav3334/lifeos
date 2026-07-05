import { renderButton, renderEmailLayout } from "@/notifications/templates/layout"

const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

type WeeklySummaryData = {
  tasksCompleted: number
  tasksCreated: number
  habitCompletionRate: number
}

export function renderWeeklySummaryEmail(data: WeeklySummaryData): { subject: string; html: string } {
  const subject = "Votre résumé de la semaine"

  const stat = (label: string, value: string) => `
    <div style="flex:1;text-align:center;padding:12px;background-color:#f4f4f5;border-radius:8px;">
      <p style="margin:0;font-size:22px;font-weight:600;color:#5b3df0;">${value}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#71717a;">${label}</p>
    </div>
  `

  const body = `
    <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;">
      Voici un aperçu de votre semaine sur LifeOS :
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="8">
      <tr>
        <td>${stat("Tâches terminées", String(data.tasksCompleted))}</td>
        <td>${stat("Nouvelles tâches", String(data.tasksCreated))}</td>
        <td>${stat("Habitudes suivies", `${data.habitCompletionRate}%`)}</td>
      </tr>
    </table>
    ${renderButton("Voir mon dashboard", `${APP_URL}/dashboard`)}
  `

  return { subject, html: renderEmailLayout(subject, body) }
}
