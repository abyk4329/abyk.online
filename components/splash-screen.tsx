"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

export function SplashScreen({
  onComplete,
  videoSrc,
}: {
  onComplete: () => void
  videoSrc: string
}) {
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setFading(true)
    setTimeout(() => onCompleteRef.current(), 1000)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      finish()
      return
    }

    // When video ends naturally, fade out
    const onEnded = () => finish()
    video.addEventListener("ended", onEnded)

    const onLoadedData = () => {}
    video.addEventListener("loadeddata", onLoadedData)

    // If video fails to load, fade out after 1s
    const onError = () => {
      setTimeout(() => finish(), 1000)
    }
    video.addEventListener("error", onError)

    // Try to play
    video.play().catch(() => {
      video.muted = true
      video.play().catch(() => {
        setTimeout(() => finish(), 1500)
      })
    })

    // Safety fallback: max 8 seconds no matter what
    const fallback = setTimeout(() => finish(), 8000)

    return () => {
      video.removeEventListener("ended", onEnded)
      video.removeEventListener("error", onError)
      video.removeEventListener("loadeddata", onLoadedData)
      clearTimeout(fallback)
    }
  }, [finish])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-white",
        "transition-opacity duration-1000 ease-out",
        fading ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        autoPlay
        preload="auto"
        className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain"
      />
    </div>
  )
}
