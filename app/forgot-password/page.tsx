"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PencilCard } from "@/components/ui/pencil-card"
import { useTheme } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        setIsLoading(false)
        return
      }

      setSent(true)
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
            <h1 className="font-light tracking-wide text-primary overline text-3xl">{"איפוס סיסמה"}</h1>
            <p className="text-muted-foreground mt-1 text-base">{"נשלח לכם קישור לאיפוס הסיסמה למייל"}</p>
          </div>

          {sent ? (
            <PencilCard>
              <div className="text-center space-y-4 py-4">
                <h2 className="text-lg font-medium text-foreground">{"הקישור נשלח!"}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"שלחנו קישור לאיפוס הסיסמה לכתובת"}{" "}
                  <span className="text-foreground font-medium" dir="ltr">{email}</span>
                  {". לחצו על הקישור במייל כדי לבחור סיסמה חדשה."}
                </p>
                <p className="text-xs text-muted-foreground">{"לא קיבלתם? בדקו בתיקיית הספאם"}</p>
                <Button asChild variant="outline" className="rounded-xl bg-transparent">
                  <Link href="/login">{"חזרה להתחברות"}</Link>
                </Button>
              </div>
            </PencilCard>
          ) : (
            <PencilCard>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-right my-0 space-y-0 mx-0 px-0 py-0">
                  <label className="text-muted-foreground text-base">{"אימייל"}</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    dir="ltr"
                    className="h-12 rounded-xl bg-background border-border/50 text-left placeholder:text-muted-foreground/40 focus:border-primary/50"
                  />
                </div>

                {error && <p className="text-destructive text-sm text-center">{error}</p>}

                <Button
                  type="submit"
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 text-xl font-normal py-4 px-0 my-3.5 mx-0 w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "שולחים..." : "שליחת קישור איפוס"}
                </Button>
              </form>
            </PencilCard>
          )}

          <div className="text-center pt-1">
            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors text-lg">
              {"חזרה להתחברות"}
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
