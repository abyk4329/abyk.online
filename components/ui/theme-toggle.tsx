"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full hover:bg-muted transition-colors"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={resolvedTheme === "dark" ? "עבור למצב בהיר" : "עבור למצב כהה"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-gold-soft transition-transform hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 text-ocean transition-transform hover:-rotate-12" />
      )}
    </Button>
  )
}
