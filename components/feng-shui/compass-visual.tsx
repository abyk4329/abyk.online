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
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return current + diff * factor
}

/** Return which direction sector (45-deg wide) a given heading falls into */
function headingToDirection(heading: number): Direction {
  const h = ((heading % 360) + 360) % 360
  // Each direction spans 45 degrees centered on its DIRECTION_DEGREES value
  if (h >= 337.5 || h < 22.5) return "N"
  if (h >= 22.5 && h < 67.5) return "NE"
  if (h >= 67.5 && h < 112.5) return "E"
  if (h >= 112.5 && h < 157.5) return "SE"
  if (h >= 157.5 && h < 202.5) return "S"
  if (h >= 202.5 && h < 247.5) return "SW"
  if (h >= 247.5 && h < 292.5) return "W"
  return "NW"
}

type CompassStatus = "loading" | "active" | "unavailable" | "permission-needed"

export function CompassVisual({ directions, onSettled }: CompassVisualProps) {
  const [smoothHeading, setSmoothHeading] = useState(0)
  const [status, setStatus] = useState<CompassStatus>("loading")

  // Use refs for values needed inside rAF / event handlers to avoid stale closures
  const headingRef = useRef(0)
  const smoothRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const settledRef = useRef(false)
  const onSettledRef = useRef(onSettled)
  const mountedRef = useRef(true)

  // Keep onSettled ref current
  useEffect(() => {
    onSettledRef.current = onSettled
  }, [onSettled])

  // Map direction key to its category color
  const directionColorMap = new Map<Direction, string>()
  for (const cat of DIRECTION_CATEGORIES) {
    const dir = directions[cat.key]
    directionColorMap.set(dir, cat.colorHex)
  }

  // Stable orientation handler
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let alpha: number | null = null

    const evt = e as DeviceOrientationEvent & { webkitCompassHeading?: number }
    if (typeof evt.webkitCompassHeading === "number" && !isNaN(evt.webkitCompassHeading)) {
      alpha = evt.webkitCompassHeading
    } else if (e.alpha !== null && e.alpha !== undefined) {
      alpha = (360 - e.alpha) % 360
    }

    if (alpha !== null && !isNaN(alpha)) {
      headingRef.current = alpha
      if (!settledRef.current) {
        settledRef.current = true
        onSettledRef.current?.()
      }
    }
  }, [])

  // Smooth animation loop via rAF
  useEffect(() => {
    mountedRef.current = true

    const animate = () => {
      if (!mountedRef.current) return
      smoothRef.current = lerpAngle(smoothRef.current, headingRef.current, 0.15)
      setSmoothHeading(smoothRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      mountedRef.current = false
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Start listening for device orientation
  useEffect(() => {
    let active = true

    const startCompass = async () => {
      if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
        if (active) setStatus("unavailable")
        return
      }

      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>
      }
      if (typeof DOE.requestPermission === "function") {
        if (active) setStatus("permission-needed")
        return
      }

      window.addEventListener("deviceorientation", handleOrientation, true)

      if ("ondeviceorientationabsolute" in window) {
        window.addEventListener(
          "deviceorientationabsolute" as "deviceorientation",
          handleOrientation,
          true,
        )
      }

      if (active) setStatus("active")

      setTimeout(() => {
        if (active && !settledRef.current) {
          setStatus("unavailable")
        }
      }, 3000)
    }

    startCompass()

    return () => {
      active = false
      window.removeEventListener("deviceorientation", handleOrientation, true)
      window.removeEventListener(
        "deviceorientationabsolute" as "deviceorientation",
        handleOrientation,
        true,
      )
    }
  }, [handleOrientation])

  useEffect(() => {
    if (settledRef.current) {
      setStatus("active")
    }
  })

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
  const outerR = size / 2 - 16 // leave room for arrow outside
  const innerR = outerR - 44
  const labelR = outerR - 22
  const tickR = outerR - 4

  const isLive = status === "active" && settledRef.current
  const roseRotation = isLive ? -smoothHeading : 0

  // Current direction the phone is pointing at (the arrow/top points to this direction)
  const currentDir = isLive ? headingToDirection(smoothHeading) : null
  const currentDirLabel = currentDir ? DIRECTION_LABELS[currentDir] : ""
  const currentDirColor = currentDir ? directionColorMap.get(currentDir) : undefined

  // Split two-word direction labels for stacking
  function splitLabel(dir: Direction): string[] {
    const label = DIRECTION_LABELS[dir]
    const parts = label.split(" ")
    return parts
  }

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
      <div className="flex items-center gap-2" dir="rtl">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isLive
              ? "bg-green-500 animate-pulse"
              : status === "unavailable"
                ? "bg-amber-500"
                : "bg-muted-foreground/40 animate-pulse"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {isLive
            ? `מצפן פעיל - ${Math.round(((smoothHeading % 360) + 360) % 360)}°`
            : status === "unavailable"
              ? "מצפן לא זמין במכשיר זה"
              : status === "permission-needed"
                ? "יש לאשר גישה למצפן"
                : "מחפש כיוון..."}
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Fixed external arrow indicator at top */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
            <polygon points="9,0 1,12 17,12" className="fill-primary" />
          </svg>
        </div>

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-lg"
          style={{ transform: `rotate(${roseRotation}deg)` }}
          aria-label="מצפן פנג שואי"
          role="img"
        >
          {/* Background circle */}
          <circle cx={center} cy={center} r={outerR} className="fill-card" opacity={0.95} />

          {/* Outer ring */}
          <circle cx={center} cy={center} r={outerR} fill="none" className="stroke-border" strokeWidth={2} />

          {/* Inner ring */}
          <circle cx={center} cy={center} r={innerR} fill="none" className="stroke-border/50" strokeWidth={1} />

          {/* Degree ticks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180
            const isMajor = i % 9 === 0
            const r1 = isMajor ? outerR - 12 : outerR - 6
            const r2 = tickR
            return (
              <line
                key={`tick-${i}`}
                x1={center + r1 * Math.sin(angle)}
                y1={center - r1 * Math.cos(angle)}
                x2={center + r2 * Math.sin(angle)}
                y2={center - r2 * Math.cos(angle)}
                className="stroke-muted-foreground/30"
                strokeWidth={isMajor ? 1.5 : 0.5}
              />
            )
          })}

          {/* Direction color segments */}
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
                opacity={0.25}
              />
            )
          })}

          {/* Direction labels — stacked for two-word labels */}
          {ALL_DIRECTIONS.map((dir) => {
            const deg = DIRECTION_DEGREES[dir]
            const angle = (deg * Math.PI) / 180
            const x = center + labelR * Math.sin(angle)
            const y = center - labelR * Math.cos(angle)
            const color = directionColorMap.get(dir)
            const isCardinal = ["N", "S", "E", "W"].includes(dir)
            const parts = splitLabel(dir)

            return (
              <text
                key={`label-${dir}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className={isCardinal ? "text-[13px] font-semibold" : "text-[10px] font-medium"}
                fill={color || "currentColor"}
                style={{
                  transform: `rotate(${-roseRotation}deg)`,
                  transformOrigin: `${x}px ${y}px`,
                }}
              >
                {parts.length === 1 ? (
                  parts[0]
                ) : (
                  <>
                    <tspan x={x} dy="-0.5em">{parts[0]}</tspan>
                    <tspan x={x} dy="1em">{parts[1]}</tspan>
                  </>
                )}
              </text>
            )
          })}

          {/* Center: current direction label (counter-rotated to stay readable) */}
          <g
            style={{
              transform: `rotate(${-roseRotation}deg)`,
              transformOrigin: `${center}px ${center}px`,
            }}
          >
            {currentDirLabel ? (
              (() => {
                const parts = currentDirLabel.split(" ")
                if (parts.length === 1) {
                  return (
                    <text
                      x={center}
                      y={center}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[18px] font-bold"
                      fill={currentDirColor || "currentColor"}
                    >
                      {parts[0]}
                    </text>
                  )
                }
                return (
                  <text
                    x={center}
                    y={center}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[16px] font-bold"
                    fill={currentDirColor || "currentColor"}
                  >
                    <tspan x={center} dy="-0.55em">{parts[0]}</tspan>
                    <tspan x={center} dy="1.1em">{parts[1]}</tspan>
                  </text>
                )
              })()
            ) : (
              <circle cx={center} cy={center} r={6} className="fill-muted-foreground/20" />
            )}
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
