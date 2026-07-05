import { CheckCircle2, Flame, ListTodo } from "lucide-react"

type OverviewCardProps = {
  pendingCount: number
  overdueCount: number
  doneTodayCount: number
}

export function OverviewCard({ pendingCount, overdueCount, doneTodayCount }: OverviewCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary to-accent p-6 text-primary-foreground shadow-md">
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }}
      />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-primary-foreground/80">
            Tâches en attente
          </p>
          <ListTodo className="size-5 text-primary-foreground/70" />
        </div>

        <p className="text-5xl font-semibold tabular-nums">{pendingCount}</p>

        <div className="flex items-center gap-6 border-t border-primary-foreground/20 pt-4">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-primary-foreground/70" />
            <div>
              <p className="text-lg font-semibold tabular-nums leading-none">{overdueCount}</p>
              <p className="mt-1 text-xs text-primary-foreground/70">En retard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary-foreground/70" />
            <div>
              <p className="text-lg font-semibold tabular-nums leading-none">{doneTodayCount}</p>
              <p className="mt-1 text-xs text-primary-foreground/70">Terminées aujourd&apos;hui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
