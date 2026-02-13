import React from "react"
import { cn } from "@/lib/utils"

interface PencilCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "wide"
}

export function PencilCard({ children, className, variant = "default" }: PencilCardProps) {
  return (
    <div className={cn("relative mx-0 px-0", className)}>
      {/* Outer border */}
      <div
        className="absolute inset-0 rounded-sm border border-border/60 pointer-events-none"
        style={{ margin: "2px" }}
      />
      {/* Inner border for sketch depth */}
      <div
        className="absolute inset-0 rounded-sm border border-border/25 pointer-events-none"
        style={{ margin: "5px" }}
      />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 pointer-events-none">
        <div className="absolute top-[2px] left-0 w-2.5 h-px bg-border/60" />
        <div className="absolute top-0 left-[2px] w-px h-2.5 bg-border/60" />
      </div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 pointer-events-none">
        <div className="absolute top-[2px] right-0 w-2.5 h-px bg-border/60" />
        <div className="absolute top-0 right-[2px] w-px h-2.5 bg-border/60" />
      </div>
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 pointer-events-none">
        <div className="absolute bottom-[2px] left-0 w-2.5 h-px bg-border/60" />
        <div className="absolute bottom-0 left-[2px] w-px h-2.5 bg-border/60" />
      </div>
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none">
        <div className="absolute bottom-[2px] right-0 w-2.5 h-px bg-border/60" />
        <div className="absolute bottom-0 right-[2px] w-px h-2.5 bg-border/60" />
      </div>

      <div className="relative text-xl text-justify py-4 px-4">
        {children}
      </div>
    </div>
  )
}
