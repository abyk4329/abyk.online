"use client"

import { useEffect, useState } from "react"
import {
  type Direction,
  type KuaDirections,
  DIRECTION_DEGREES,
  DIRECTION_LABELS,
  DIRECTION_CATEGORIES,
} from "@/lib/feng-shui-data"

interface CompassVisualProps {
  directions: KuaDirections
  onSettled?: () => void
}

const ALL_DIRECTIONS: Direction[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

export function CompassVisual({ directions, onSettled }: CompassVisualProps) {
  const [rotation, setRotation] = useState(720) // start rotated
  const [settled, setSettled] = useState(false)

  // Map direction key to its category color
  const directionColorMap = new Map<Direction, string>()
  for (const cat of DIRECTION_CATEGORIES) {
    const dir = directions[cat.key]
    directionColorMap.set(dir, cat.colorHex)
  }

  // Best direction (Sheng Chi) for needle
  const bestDir = directions.shengChi
  const needleTargetDeg = DIRECTION_DEGREES[bestDir]

  useEffect(() => {
    // Animate compass settling
    const timer = setTimeout(() => {
      setRotation(0)
    }, 100)

    const settleTimer = setTimeout(() => {
      setSettled(true)
      onSettled?.()
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(settleTimer)
    }
  }, [onSettled])

  const size = 320
  const center = size / 2
  const outerR = size / 2 - 10
  const innerR = outerR - 45
  const labelR = outerR - 22
  const tickR = outerR - 4

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Outer ring */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          className="stroke-border"
          strokeWidth={2}
        />

        {/* Inner ring */}
        <circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          className="stroke-border/50"
          strokeWidth={1}
        />

        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerR - 1}
          className="fill-card"
          opacity={0.95}
        />

        {/* Degree ticks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180
          const isMajor = i % 9 === 0
          const r1 = isMajor ? outerR - 12 : outerR - 6
          const r2 = tickR
          const x1 = center + r1 * Math.sin(angle)
          const y1 = center - r1 * Math.cos(angle)
          const x2 = center + r2 * Math.sin(angle)
          const y2 = center - r2 * Math.cos(angle)
          return (
            <line
              key={`tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="stroke-muted-foreground/30"
              strokeWidth={isMajor ? 1.5 : 0.5}
            />
          )
        })}

        {/* Direction segments — highlight good directions */}
        {ALL_DIRECTIONS.map((dir) => {
          const deg = DIRECTION_DEGREES[dir]
          const color = directionColorMap.get(dir)
          if (!color) return null

          const startAngle = ((deg - 22.5) * Math.PI) / 180
          const endAngle = ((deg + 22.5) * Math.PI) / 180
          const r1 = innerR + 2
          const r2 = outerR - 2

          const x1s = center + r1 * Math.sin(startAngle)
          const y1s = center - r1 * Math.cos(startAngle)
          const x1e = center + r2 * Math.sin(startAngle)
          const y1e = center - r2 * Math.cos(startAngle)
          const x2s = center + r1 * Math.sin(endAngle)
          const y2s = center - r1 * Math.cos(endAngle)
          const x2e = center + r2 * Math.sin(endAngle)
          const y2e = center - r2 * Math.cos(endAngle)

          return (
            <path
              key={`seg-${dir}`}
              d={`M ${x1s} ${y1s} L ${x1e} ${y1e} A ${r2} ${r2} 0 0 1 ${x2e} ${y2e} L ${x2s} ${y2s} A ${r1} ${r1} 0 0 0 ${x1s} ${y1s}`}
              fill={color}
              opacity={settled ? 0.25 : 0.1}
              style={{ transition: "opacity 1s ease-in-out" }}
            />
          )
        })}

        {/* Direction labels */}
        {ALL_DIRECTIONS.map((dir) => {
          const deg = DIRECTION_DEGREES[dir]
          const angle = (deg * Math.PI) / 180
          const x = center + labelR * Math.sin(angle)
          const y = center - labelR * Math.cos(angle)
          const color = directionColorMap.get(dir)
          const isCardinal = ["N", "S", "E", "W"].includes(dir)

          return (
            <text
              key={`label-${dir}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className={isCardinal ? "text-[13px] font-medium" : "text-[10px]"}
              fill={color || "currentColor"}
              style={{
                transform: `rotate(${-rotation}deg)`,
                transformOrigin: `${x}px ${y}px`,
                transition: "transform 2s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {DIRECTION_LABELS[dir]}
            </text>
          )
        })}

        {/* Center decorative circle */}
        <circle cx={center} cy={center} r={12} className="fill-primary/20 stroke-primary/40" strokeWidth={1} />
        <circle cx={center} cy={center} r={4} className="fill-primary" />

        {/* Compass needle pointing to Sheng Chi */}
        <g
          style={{
            transform: `rotate(${needleTargetDeg}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: "transform 2.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* North half (red/primary) */}
          <polygon
            points={`${center},${center - innerR + 15} ${center - 5},${center} ${center + 5},${center}`}
            className="fill-primary"
            opacity={0.9}
          />
          {/* South half (lighter) */}
          <polygon
            points={`${center},${center + innerR - 15} ${center - 5},${center} ${center + 5},${center}`}
            className="fill-muted-foreground/30"
          />
        </g>
      </svg>
    </div>
  )
}
