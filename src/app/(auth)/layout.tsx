import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in oklch, var(--primary) 12%, transparent), transparent)",
        }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" />
          </span>
          <span className="text-xl font-semibold">LifeOS</span>
        </Link>

        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
