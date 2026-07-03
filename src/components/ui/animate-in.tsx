import { cn } from "@/lib/utils"

type AnimateInProps = React.ComponentProps<"div"> & {
  index?: number
}

export function AnimateIn({ index = 0, className, style, ...props }: AnimateInProps) {
  return (
    <div
      className={cn("animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards", className)}
      style={{ animationDelay: `${Math.min(index * 40, 300)}ms`, animationDuration: "300ms", ...style }}
      {...props}
    />
  )
}
