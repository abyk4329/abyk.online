"use client"

import { useEffect, useState, useRef, useCallback } from "react"
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

// Smoothly interpolate angles avoiding the 0/360 jump
function lerpAngle(current: number, target: number, factor: number): number {
  let diff = target - current
  // Normalize to -180..180
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return current + diff * factor
}

type CompassStatus = "loading" | "active" | "unavailable" | "permission-needed"

export function CompassVisual({ directions, onSettled }: CompassVisualProps) {
  const [heading, setHeading] = useState(0) // real device heading in degrees
  const [smoothHeading, setSmoothHeading] = useState(0)
  const [status, setStatus] = useState<CompassStatus>("loading")
  const [settled, setSettled] = useState(false)
  const headingRef = useRef(0)
  const smoothRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  // Map direction key to its category color
  const directionColorMap = new Map<Direction, string>()
  for (const cat of DIRECTION_CATEGORIES) {
    const dir = directions[cat.key]
    directionColorMap.set(dir, cat.colorHex)
  }

  // Best direction for needle
  const bestDir = directions.shengChi
  const needleTargetDeg = DIRECTION_DEGREES[bestDir]

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      smoothRef.current = lerpAngle(smoothRef.current, headingRef.current, 0.12)
      setSmoothHeading(smoothRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Update ref when heading changes
  useEffect(() => {
    headingRef.current = heading
  }, [heading])

  // Handle device orientation (real compass)
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let alpha: number | null = null

    // iOS: webkitCompassHeading is the most accurate
    if ("webkitCompassHeading" in e && typeof (e as unknown as Record<string, unknown>).webkitCompassHeading === "number") {
      alpha = (e as unknown as Record<string, number>).webkitCompassHeading
    } else if (e.alpha !== null && e.alpha !== undefined) {
      // Android / other: alpha is rotation around Z axis (0-360)
      // alpha = 0 means pointing to magnetic north
      // We need to invert since alpha measures device rotation relative to north
      alpha = (360 - e.alpha) % 360
    }

    if (alpha !== null && !isNaN(alpha)) {
      setHeading(alpha)
      if (!settled) {
        setSettled(true)
        onSettled?.()
      }
    }
  }, [settled, onSettled])

  // Request permission and start listening
  useEffect(() => {
    let mounted = true

    const startCompass = async () => {
      // Check if DeviceOrientationEvent exists
      if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
        if (mounted) setStatus("unavailable")
        return
      }

      // iOS 13+ requires explicit permission
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>
      }
      if (typeof DOE.requestPermission === "function") {
        // We need user interaction to request permission on iOS
        if (mounted) setStatus("permission-needed")
        return
      }

      // Android / desktop — just listen
      window.addEventListener("deviceorientation", handleOrientation, true)

      // After a short delay, if we haven't received any data, show unavailable
      setTimeout(() => {
        if (mounted && !settled) {
          // Check if we received any heading data
          // If not, we're probably on desktop
          setStatus((prev) => (prev === "loading" ? "unavailable" : prev))
        }
      }, 2000)

      if (mounted) setStatus("active")
    }

    startCompass()

    return () => {
      mounted = false
      window.removeEventListener("deviceorientation", handleOrientation, true)
    }
  }, [handleOrientation, settled])

  // When settled, mark active
  useEffect(() => {
    if (settled) {
      setStatus("active")
    }
  }, [settled])

  const requestiOSPermission = async () => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>
    }
    if (typeof DOE.requestPermission === "function") {
      try {
        const result = await DOE.requestPermission()
        if (result === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true)
          setStatus("active")
        } else {
          setStatus("unavailable")
        }
      } catch {
        setStatus("unavailable")
      }
    }
  }

  const size = 320
  const center = size / 2
  const outerR = size / 2 - 10
  const innerR = outerR - 45
  const labelR = outerR - 22
  const tickR = outerR - 4

  // The compass rose rotates opposite to the heading so north stays at real north
  const roseRotation = status === "active" && settled ? -smoothHeading : 0

  return (
    <div className="relative flex flex-col items-center justify-center gap-3">
      {/* Permission button for iOS */}
      {status === "permission-needed" && (
        <button
          type="button"
          onClick={requestiOSPermission}
          className="mb-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 text-base text-primary transition-colors hover:bg-primary/20"
        >
          {"הפעל מצפן"}
        </button>
      )}

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "active" && settled
              ? "bg-green-500 animate-pulse"
              : status === "unavailable"
                ? "bg-amber-500"
                : "bg-muted-foreground/40 animate-pulse"
          }`}
        />
        <span className="text-xs text-muted-foreground">
          {status === "active" && settled
            ? `${Math.round(smoothHeading)}°`
            : status === "unavailable"
              ? "מצפן לא זמין במכשיר זה"
              : status === "permission-needed"
                ? "יש לאשר גישה למצפן"
                : "מחפש כיוון..."}
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Fixed north indicator triangle at top */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 z-10"
          style={{ width: 0, height: 0 }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14">
            <polygon points="10,0 0,14 20,14" className="fill-primary" />
          </svg>
        </div>

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-lg"
          style={{
            transform: `rotate(${roseRotation}deg)`,
            // No transition — smooth interpolation is done via RAF
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

          {/* Direction labels — counter-rotate so text stays upright */}
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
                  transform: `rotate(${-roseRotation}deg)`,
                  transformOrigin: `${x}px ${y}px`,
                }}
              >
                {DIRECTION_LABELS[dir]}
              </text>
            )
          })}

          {/* Center decorative circle */}
          <circle cx={center} cy={center} r={12} className="fill-primary/20 stroke-primary/40" strokeWidth={1} />
          <circle cx={center} cy={center} r={4} className="fill-primary" />

          {/* Compass needle pointing to Sheng Chi direction */}
          <g
            style={{
              transform: `rotate(${needleTargetDeg}deg)`,
              transformOrigin: `${center}px ${center}px`,
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

      {/* Unavailable fallback info */}
      {status === "unavailable" && (
        <p className="text-xs text-muted-foreground/70 text-center max-w-[260px] leading-relaxed">
          {"ניתן להשתמש במצפן רגיל ולהתמצא לפי הכיוונים המופיעים למטה"}
        </p>
      )}
    </div>
  )
}
