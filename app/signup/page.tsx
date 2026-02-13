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



export default function SignupPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gender, setGender] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!firstName.trim()) {
      setError("יש להזין שם פרטי")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            gender: gender || "unspecified",
            phone: phone.trim(),
            birth_date: birthDate || null,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("כתובת המייל הזו כבר רשומה. נסו להתחבר.")
        } else {
          setError(signUpError.message)
        }
        setIsLoading(false)
        return
      }

      if (data.session) {
        const purchasedCode = localStorage.getItem("soul-code-purchased")
        if (purchasedCode) {
          await supabase.from("purchased_codes").insert({
            user_id: data.user!.id,
            code: purchasedCode,
          })
          localStorage.removeItem("soul-code-purchased")
          router.push(`/thank-you?code=${purchasedCode}`)
        } else {
          router.push("/dashboard")
        }
      } else {
        setSuccess(true)
      }
    } catch {
      setError("אירעה שגיאה. נסו שוב.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell hideNav>
      <div className="flex flex-col items-center px-4 pt-4 pb-10">
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
            <h1 className="font-light tracking-wide text-3xl text-primary overline">{"יצירת חשבון"}</h1>
            
          </div>

          {/* Success Message */}
          {success && (
            <PencilCard>
              <div className="text-center space-y-4 py-4">
                <h2 className="text-lg font-medium text-foreground">{"נרשמתם בהצלחה!"}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"שלחנו לכם מייל אימות לכתובת"}{" "}
                  <span className="text-foreground font-medium" dir="ltr">{email}</span>
                  {". לחצו על הקישור במייל כדי להשלים את ההרשמה."}
                </p>
                <p className="text-xs text-muted-foreground">{"לא קיבלתם? בדקו בתיקיית הספאם"}</p>
                <Button asChild variant="outline" className="rounded-xl bg-transparent">
                  <Link href="/login">{"מעבר להתחברות"}</Link>
                </Button>
              </div>
            </PencilCard>
          )}

          {/* Signup Form */}
          {!success && (
          <PencilCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5 text-right">
                  <label className="text-muted-foreground text-base">{"שם פרטי *"}</label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="שם פרטי"
                    required
                    dir="rtl"
                    className="rounded-xl bg-background border-border/50 text-right placeholder:text-muted-foreground/40 focus:border-primary/50 text-sidebar-accent h-11"
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-right">
                  <label className="text-muted-foreground text-base">{"שם משפחה"}</label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="שם משפחה"
                    dir="rtl"
                    className="rounded-xl bg-background border-border/50 text-right placeholder:text-muted-foreground/40 focus:border-primary/50 text-input h-11"
                  />
                </div>
              </div>

              {/* Birth date */}
              <div className="space-y-1.5 text-right">
                <label className="text-muted-foreground text-base">{"תאריך לידה"}</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  dir="ltr"
                  className="h-12 rounded-xl bg-background border-border/50 placeholder:text-muted-foreground/40 focus:border-primary/50 text-left text-[rgba(110,109,104,1)] font-normal text-base"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5 text-right">
                <label className="text-muted-foreground text-base">{"מין"}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  dir="rtl"
                  className="w-full rounded-xl bg-background border border-border/50 px-3 focus:border-primary/50 focus:outline-none transition-colors text-left h-12 text-[rgba(109,108,104,1)] text-base font-normal"
                >
                  <option value="" disabled>{"בחירה"}</option>
                  <option value="female">{"נקבה"}</option>
                  <option value="male">{"זכר"}</option>
                  <option value="unspecified">{"לא רוצה לציין"}</option>
                </select>
              </div>

              {/* Phone */}
              <div className="space-y-1.5 text-right">
                <label className="text-muted-foreground text-base">{"מספר טלפון"}</label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="0524616121"
                  maxLength={10}
                  dir="ltr"
                  autoComplete="tel"
                  className="h-12 rounded-xl bg-background border-border/50 text-left placeholder:text-muted-foreground/40 focus:border-primary/50 text-input"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-right">
                <label className="text-muted-foreground text-base">{"אימייל *"}</label>
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

              {/* Password */}
              <div className="space-y-1.5 text-right">
                <label className="text-muted-foreground text-base">{"סיסמה *"}</label>
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

              {error && <p className="text-destructive text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 text-xl font-normal h-12 py-0 my-3.5"
                disabled={isLoading}
              >
                {isLoading ? "יוצרים חשבון..." : "יצירת חשבון"}
              </Button>
            </form>
          </PencilCard>
          )}

          {/* Links */}
          {!success && (
          <div className="text-center pt-1">
            <div className="text-muted-foreground text-lg">
              {"כבר יש לכם חשבון?"}{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                {"התחברות"}
              </Link>
            </div>
          </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
