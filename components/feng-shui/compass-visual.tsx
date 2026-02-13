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

// English abbreviations for the outer ring
const DIRECTION_EN: Record<Direction, string> = {
  N: "N",
  NE: "NE",
  E: "E",
  SE: "SE",
  S: "S",
  SW: "SW",
  W: "W",
  NW: "NW",
}

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

  const headingRef = useRef(0)
  const smoothRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const settledRef = useRef(false)
  const onSettledRef = useRef(onSettled)
  const mountedRef = useRef(true)

  useEffect(() => {
    onSettledRef.current = onSettled
  }, [onSettled])

  // Map direction key to its category color
  const directionColorMap = new Map<Direction, string>()
  for (const cat of DIRECTION_CATEGORIES) {
    const dir = directions[cat.key]
    directionColorMap.set(dir, cat.colorHex)
  }

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

  // Smooth animation loop
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
    if (settledRef.current) setStatus("active")
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

  /* ---------- Layout constants ---------- */
  const size = 320
  const center = size / 2
  const outerR = size / 2 - 18
  const ringWidth = 36
  const innerR = outerR - ringWidth
  const labelR = outerR - ringWidth / 2 // center of the ring band
  const centerR = innerR - 6 // inner area radius

  const isLive = status === "active" && settledRef.current
  const roseRotation = isLive ? -smoothHeading : 0

  const currentDir = isLive ? headingToDirection(smoothHeading) : null
  const currentDirLabel = currentDir ? DIRECTION_LABELS[currentDir] : ""
  const currentDirColor = currentDir ? directionColorMap.get(currentDir) : undefined

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
        {/* Fixed external arrow at top */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
            <polygon points="10,0 2,14 18,14" className="fill-primary" />
          </svg>
        </div>

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-lg"
          style={{ transform: `rotate(${roseRotation}deg)`, transition: "none" }}
          aria-label="מצפן פנג שואי"
          role="img"
        >
          {/* Background circle */}
          <circle cx={center} cy={center} r={outerR} className="fill-card" opacity={0.97} />

          {/* Colored direction segments in the ring band */}
          {ALL_DIRECTIONS.map((dir) => {
            const deg = DIRECTION_DEGREES[dir]
            const color = directionColorMap.get(dir)
            if (!color) return null

            const startAngle = ((deg - 22.5) * Math.PI) / 180
            const endAngle = ((deg + 22.5) * Math.PI) / 180

            const x1i = center + innerR * Math.sin(startAngle)
            const y1i = center - innerR * Math.cos(startAngle)
            const x1o = center + outerR * Math.sin(startAngle)
            const y1o = center - outerR * Math.cos(startAngle)
            const x2i = center + innerR * Math.sin(endAngle)
            const y2i = center - innerR * Math.cos(endAngle)
            const x2o = center + outerR * Math.sin(endAngle)
            const y2o = center - outerR * Math.cos(endAngle)

            return (
              <path
                key={`seg-${dir}`}
                d={`M ${x1i} ${y1i} L ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerR} ${innerR} 0 0 0 ${x1i} ${y1i}`}
                fill={color}
                opacity={0.2}
              />
            )
          })}

          {/* Divider lines between each direction sector */}
          {ALL_DIRECTIONS.map((dir) => {
            const deg = DIRECTION_DEGREES[dir]
            const borderAngle = ((deg - 22.5) * Math.PI) / 180
            const x1 = center + innerR * Math.sin(borderAngle)
            const y1 = center - innerR * Math.cos(borderAngle)
            const x2 = center + outerR * Math.sin(borderAngle)
            const y2 = center - outerR * Math.cos(borderAngle)
            return (
              <line
                key={`div-${dir}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-border"
                strokeWidth={1}
                opacity={0.6}
              />
            )
          })}

          {/* Outer ring border */}
          <circle cx={center} cy={center} r={outerR} fill="none" className="stroke-border" strokeWidth={2} />

          {/* Inner ring border */}
          <circle cx={center} cy={center} r={innerR} fill="none" className="stroke-border" strokeWidth={1.5} />

          {/* Degree ticks on outer edge */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = (i * 5 * Math.PI) / 180
            const isMajor = i % 9 === 0
            const isMid = i % 9 !== 0 && i % 3 === 0
            const r1 = isMajor ? outerR - 10 : isMid ? outerR - 6 : outerR - 3
            const r2 = outerR
            return (
              <line
                key={`tick-${i}`}
                x1={center + r1 * Math.sin(angle)}
                y1={center - r1 * Math.cos(angle)}
                x2={center + r2 * Math.sin(angle)}
                y2={center - r2 * Math.cos(angle)}
                className="stroke-muted-foreground/40"
                strokeWidth={isMajor ? 1.5 : 0.5}
              />
            )
          })}

          {/* English abbreviations on the ring band */}
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
                fontSize={isCardinal ? 16 : 12}
                fontWeight={isCardinal ? 700 : 600}
                fill={color || "currentColor"}
                style={{
                  transform: `rotate(${-roseRotation}deg)`,
                  transformOrigin: `${x}px ${y}px`,
                }}
              >
                {DIRECTION_EN[dir]}
              </text>
            )
          })}

          {/* Center area background */}
          <circle cx={center} cy={center} r={centerR} className="fill-card" opacity={0.6} />

          {/* Center: Hebrew direction label (counter-rotated) */}
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
                      fontSize={26}
                      fontWeight={700}
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
                    fontSize={22}
                    fontWeight={700}
                    fill={currentDirColor || "currentColor"}
                  >
                    <tspan x={center} dy="-0.6em">{parts[0]}</tspan>
                    <tspan x={center} dy="1.2em">{parts[1]}</tspan>
                  </text>
                )
              })()
            ) : null}
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
