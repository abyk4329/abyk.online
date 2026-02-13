"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PencilCard } from "@/components/ui/pencil-card"
import { useTheme } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/client"

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function LoginPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  // Check if saved credentials exist for auto-login with biometrics
  React.useEffect(() => {
    async function checkBiometric() {
      try {
        if (typeof window !== "undefined" && window.PasswordCredential) {
          const hasSaved = localStorage.getItem("abyk-credentials-saved") === "true"
          if (hasSaved) {
            setBiometricAvailable(true)
          }
        }
      } catch {
        // Credentials API not supported
      }
    }
    checkBiometric()
  }, [])

  async function loginWithCredentials(loginEmail: string, loginPassword: string) {
    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (signInError) {
      if (signInError.message.includes("Invalid login")) {
        setError("אימייל או סיסמה שגויים")
      } else if (signInError.message.includes("Email not confirmed")) {
        setError("יש לאמת את כתובת המייל לפני ההתחברות. בדקו את תיבת הדואר.")
      } else {
        setError(signInError.message)
      }
      return
    }

    const purchasedCode = localStorage.getItem("soul-code-purchased")
    if (purchasedCode && data.user) {
      await supabase.from("purchased_codes").insert({
        user_id: data.user.id,
        code: purchasedCode,
      })
      localStorage.removeItem("soul-code-purchased")
      router.push(`/thank-you?code=${purchasedCode}`)
    } else {
      router.push("/dashboard")
    }
  }

  async function handleBiometricLogin() {
    setIsLoading(true)
    setError("")
    try {
      if (window.PasswordCredential) {
        const credential = await navigator.credentials.get({
          password: true,
          mediation: "required",
        }) as PasswordCredential | null
        if (credential && credential.password) {
          await loginWithCredentials(credential.id, credential.password)
        } else {
          setError("לא נמצאו פרטים שמורים. יש להתחבר עם מייל וסיסמה.")
        }
      }
    } catch {
      setError("לא ניתן להשתמש בזיהוי ביומטרי. יש להתחבר עם מייל וסיסמה.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await loginWithCredentials(email, password)

      // Save credentials for future biometric login
      try {
        if (window.PasswordCredential) {
          const cred = new PasswordCredential({
            id: email,
            password: password,
            name: email,
          })
          await navigator.credentials.store(cred)
          localStorage.setItem("abyk-credentials-saved", "true")
        }
      } catch {
        // Credentials store not supported, that's fine
      }
    } catch {
      setError("אירעה שגיאה. נסו שוב.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell>
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

          {/* Title */}
          <div className="text-center">
            <h1 className="font-light tracking-wide overline text-primary text-3xl">
              {"כניסה לאזור האישי"}
            </h1>
          </div>

          {/* Login Form */}
          <PencilCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-foreground block text-right text-base font-normal">
                  {"אימייל"}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base bg-background border-border/50 rounded-xl"
                  placeholder="your@email.com"
                  required
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  
                  <label htmlFor="password" className="text-foreground text-base font-normal">
                    {"סיסמה"}
                  </label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base pl-12 bg-background border-border/50 rounded-xl"
                    required
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-center text-[rgba(190,102,102,1)] text-base">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 text-xl font-normal h-12 my-8"
                disabled={isLoading}
              >
                {isLoading ? "מתחברים..." : "כניסה"}
              </Button>
            </form>

            {/* Biometric login */}
            {biometricAvailable && (
              <div className="pt-3 border-t border-border/30">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBiometricLogin}
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-sm text-muted-foreground hover:text-foreground gap-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 10v4" />
                    <path d="M7.5 8a5 5 0 019 0" />
                    <path d="M5 6a9 9 0 0114 0" />
                    <path d="M12 14a1 1 0 100 2" />
                    <path d="M3 4a13 13 0 0118 0" />
                  </svg>
                  {"כניסה מהירה עם זיהוי ביומטרי"}
                </Button>
              </div>
            )}
          </PencilCard>

          {/* Links */}
          <div className="text-center space-y-3 pt-1">
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-primary transition-colors block text-lg"
            >
              {"שכחתי סיסמה"}
            </Link>

            <div className="text-muted-foreground text-lg">
              {"עדיין אין לכם חשבון?"}{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {"הרשמה"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
