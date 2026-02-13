"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShow(false)
    // Enable TikTok pixel after consent
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie-consent-accepted"))
    }
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 z-[60] px-4 pb-2 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-md rounded-2xl bg-card border border-border/60 p-5 shadow-lg backdrop-blur-sm">
        {/* Decorative line */}
        <div className="flex justify-center mb-3">
          <svg width="40" height="8" viewBox="0 0 40 8" fill="none" className="text-primary/40">
            <line x1="0" y1="4" x2="16" y2="4" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="20" cy="4" r="2" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <line x1="24" y1="4" x2="40" y2="4" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <h3 className="text-sm font-medium text-foreground text-center mb-2">
          {"האתר משתמש בעוגיות"}
        </h3>
        <p className="text-xs text-muted-foreground text-center leading-relaxed mb-4">
          {"אנו משתמשים בעוגיות לשיפור חוויית הגלישה, ניתוח תנועה ולצרכי שיווק. בלחיצה על \"אישור\" את/ה מסכימ/ה לשימוש בעוגיות בהתאם ל"}
          <a href="/legal" className="text-primary hover:underline">{"מדיניות הפרטיות"}</a>
          {"."}
        </p>

        <div className="flex gap-3">
          <Button
            onClick={handleAccept}
            className="flex-1 h-10 rounded-xl text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {"אישור"}
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            className="flex-1 h-10 rounded-xl text-sm bg-transparent border-border/60"
          >
            {"דחייה"}
          </Button>
        </div>
      </div>
    </div>
  )
}
