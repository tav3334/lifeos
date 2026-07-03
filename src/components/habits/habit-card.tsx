"use client"

import { Check, MoreVertical, Pencil } from "lucide-react"
import { useState, useTransition } from "react"

import { toggleHabitToday } from "@/actions/habits.actions"
import { DeleteHabitButton } from "@/components/habits/delete-habit-button"
import { HabitFormDialog } from "@/components/habits/habit-form-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { HabitWeekSummary } from "@/types"

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"]

export function HabitCard({ summary }: { summary: HabitWeekSummary }) {
  const { habit, days, completedCount } = summary
  const [isPending, startTransition] = useTransition()
  const [editOpen, setEditOpen] = useState(false)

  function handleToggleToday() {
    startTransition(() => {
      toggleHabitToday(habit.id)
    })
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="min-w-0">
          <CardTitle className="truncate">{habit.name}</CardTitle>
          {habit.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {habit.description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil />
              Modifier
            </DropdownMenuItem>
            <DeleteHabitButton habitId={habit.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Cette semaine</span>
          <span>
            {completedCount}/{habit.targetPerWeek}
          </span>
        </div>

        <div className="flex gap-1.5">
          {days.map((day, index) => (
            <button
              key={day.date}
              type="button"
              disabled={!day.isToday || isPending}
              onClick={day.isToday ? handleToggleToday : undefined}
              title={day.date}
              className={cn(
                "flex size-8 flex-1 items-center justify-center rounded-md border text-xs font-medium transition-colors",
                day.done
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground",
                day.isToday && !day.done && "border-ring",
                day.isToday && "cursor-pointer hover:opacity-80",
                !day.isToday && "cursor-default"
              )}
            >
              {day.done ? <Check className="size-4" /> : DAY_LABELS[index]}
            </button>
          ))}
        </div>
      </CardContent>

      <HabitFormDialog habit={habit} open={editOpen} onOpenChange={setEditOpen} />
    </Card>
  )
}
