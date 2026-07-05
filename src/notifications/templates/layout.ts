const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export function renderEmailLayout(title: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#5b3df0,#7c5cff);padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:600;">✨ LifeOS</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:18px;color:#18181b;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background-color:#fafafa;border-top:1px solid #e4e4e7;">
                <p style="margin:0;font-size:12px;color:#71717a;">
                  Vous recevez cet email car vous avez activé les notifications par email dans
                  <a href="${APP_URL}/profile" style="color:#5b3df0;">votre profil LifeOS</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim()
}

export function renderList(items: string[]): string {
  return `<ul style="margin:0;padding-left:20px;color:#3f3f46;font-size:14px;line-height:1.6;">${items
    .map((item) => `<li>${item}</li>`)
    .join("")}</ul>`
}

export function renderButton(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:10px 20px;background-color:#5b3df0;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">${label}</a>`
}
