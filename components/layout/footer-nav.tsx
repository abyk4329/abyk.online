"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

// Geometric SVG icons
function GeoMenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

function GeoHomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,3 22,12 18,12 18,21 6,21 6,12 2,12" />
      <line x1="12" y1="14" x2="12" y2="21" />
    </svg>
  )
}

function GeoContactIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4,4 L20,4 C20.5,4 21,4.5 21,5 L21,15 C21,15.5 20.5,16 20,16 L7,16 L3,20 L3,5 C3,4.5 3.5,4 4,4 Z" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="12" x2="13" y2="12" />
    </svg>
  )
}

function GeoUserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M5,21 C5,16.5 8,14 12,14 C16,14 19,16.5 19,21" />
    </svg>
  )
}

interface FooterNavProps {
  onMenuClick: () => void
}

export function FooterNav({ onMenuClick }: FooterNavProps) {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    {
      icon: GeoMenuIcon,
      label: "תפריט",
      action: "menu" as const,
    },
    {
      icon: GeoHomeIcon,
      label: "בית",
      href: "/",
    },
    {
      icon: GeoContactIcon,
      label: "יצירת קשר",
      href: "/contact",
    },
    {
      icon: GeoUserIcon,
      label: isLoggedIn ? "אזור אישי" : "התחברות",
      href: isLoggedIn ? "/dashboard" : "/login",
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/40 safe-area-pb"
      role="navigation"
      aria-label="ניווט ראשי"
    >
      <div className="flex items-center justify-around h-14 px-6 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href ? pathname === item.href : false

          if (item.action === "menu") {
            return (
              <button
                key={item.label}
                onClick={onMenuClick}
                className={cn(
                  "flex items-center justify-center p-2.5 rounded-xl transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  "active:scale-95",
                )}
                aria-label={item.label}
              >
                <Icon className="h-6 w-6" />
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "flex items-center justify-center p-2.5 rounded-xl transition-all duration-200",
                "active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-6 w-6" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
