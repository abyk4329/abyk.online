"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PencilCard } from "@/components/ui/pencil-card"
import { useTheme } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/client"

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function ResetPasswordPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות לא תואמות")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
    } catch {
      setError("אירעה שגיאה. נסו שוב.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell hideNav>
      <div className="flex flex-col items-center px-4 pt-4 pb-28">
        <div className="w-full max-w-md mx-auto space-y-5">
          {/* Logo */}
          <div className="w-full max-w-xs mx-auto">
            <Image
              src={isDark ? "/images/logo-light.svg" : "/images/logo-dark.svg"}
              alt="Awakening by Ksenia"
              width={600}
              height={200}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          <div className="text-center">
            <h1 className="font-light tracking-wide text-primary overline text-3xl">{"סיסמה חדשה"}</h1>
            <p className="text-muted-foreground mt-1 text-base">{"בחרו סיסמה חדשה לחשבון שלכם"}</p>
          </div>

          <PencilCard>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5 text-right">
                <label className="text-muted-foreground text-base">{"סיסמה חדשה"}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="לפחות 6 תווים"
                    required
                    dir="ltr"
                    className="h-12 rounded-xl bg-background border-border/50 text-left pl-12 placeholder:text-muted-foreground/40 focus:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-muted-foreground text-base">{"אימות סיסמה"}</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="הזינו שוב את הסיסמה"
                  required
                  dir="ltr"
                  className="h-12 rounded-xl bg-background border-border/50 text-left placeholder:text-muted-foreground/40 focus:border-primary/50"
                />
              </div>

              {error && <p className="text-destructive text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 text-xl font-normal"
                disabled={isLoading}
              >
                {isLoading ? "מעדכנים..." : "עדכון סיסמה"}
              </Button>
            </form>
          </PencilCard>
        </div>
      </div>
    </AppShell>
  )
}
