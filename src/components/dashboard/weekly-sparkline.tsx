const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"]

type WeeklySparklineProps = {
  values: number[]
  width?: number
  height?: number
}

export function WeeklySparkline({ values, width = 280, height = 64 }: WeeklySparklineProps) {
  const max = Math.max(...values, 1)
  const stepX = width / (values.length - 1)
  const padY = 8

  const points = values.map((value, index) => {
    const x = index * stepX
    const y = padY + (height - padY * 2) * (1 - value / max)
    return { x, y, value }
  })

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`

  const lastPoint = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full overflow-visible"
      role="img"
      aria-label="Cases d'habitudes cochées par jour cette semaine"
    >
      <path d={areaPath} fill="var(--primary)" opacity="0.1" />
      <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, index) => (
        <g key={index}>
          {index === points.length - 1 && (
            <circle cx={p.x} cy={p.y} r="4" fill="var(--primary)" stroke="var(--card)" strokeWidth="2" />
          )}
          <text
            x={p.x}
            y={height + 14}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {DAY_LABELS[index]}
          </text>
        </g>
      ))}

      {lastPoint && (
        <text
          x={lastPoint.x}
          y={lastPoint.y - 8}
          textAnchor="middle"
          className="fill-foreground text-[10px] font-medium tabular-nums"
        >
          {lastPoint.value}
        </text>
      )}
    </svg>
  )
}
