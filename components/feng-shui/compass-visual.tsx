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

  // Best direction for needle
  const bestDir = directions.shengChi
  const needleTargetDeg = DIRECTION_DEGREES[bestDir]

  // Stable orientation handler — no dependency on React state
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let alpha: number | null = null

    // iOS: webkitCompassHeading gives true heading (0 = north, increases clockwise)
    const evt = e as DeviceOrientationEvent & { webkitCompassHeading?: number }
    if (typeof evt.webkitCompassHeading === "number" && !isNaN(evt.webkitCompassHeading)) {
      alpha = evt.webkitCompassHeading
    } else if (e.alpha !== null && e.alpha !== undefined) {
      // Android: alpha is rotation around Z. When device points north, alpha ~ 360 or 0
      // The compass heading = (360 - alpha) % 360
      // If e.absolute is true, alpha is relative to north
      alpha = (360 - e.alpha) % 360
    }

    if (alpha !== null && !isNaN(alpha)) {
      headingRef.current = alpha
      if (!settledRef.current) {
        settledRef.current = true
        onSettledRef.current?.()
      }
    }
  }, []) // no dependencies — fully stable

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

      // iOS 13+ requires explicit permission via user gesture
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>
      }
      if (typeof DOE.requestPermission === "function") {
        if (active) setStatus("permission-needed")
        return
      }

      // Android / other — listen immediately
      window.addEventListener("deviceorientation", handleOrientation, true)

      // Also try 'deviceorientationabsolute' for Android (gives absolute north)
      if ("ondeviceorientationabsolute" in window) {
        window.addEventListener(
          "deviceorientationabsolute" as "deviceorientation",
          handleOrientation,
          true,
        )
      }

      if (active) setStatus("active")

      // After 3 seconds, if no heading data, mark as unavailable (probably desktop)
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

  // Mark settled in status
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
  const outerR = size / 2 - 10
  const innerR = outerR - 45
  const labelR = outerR - 22
  const tickR = outerR - 4

  const isLive = status === "active" && settledRef.current
  // The compass rose rotates opposite to the heading so north direction stays at real north
  const roseRotation = isLive ? -smoothHeading : 0

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
        {/* Fixed north indicator triangle at top */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
            <polygon points="10,0 0,14 20,14" className="fill-primary" />
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
          <circle cx={center} cy={center} r={outerR - 1} className="fill-card" opacity={0.95} />

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
            <polygon
              points={`${center},${center - innerR + 15} ${center - 5},${center} ${center + 5},${center}`}
              className="fill-primary"
              opacity={0.9}
            />
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
