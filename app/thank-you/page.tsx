"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Download, ChevronDown, ChevronUp, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/layout/app-shell"
import { PencilCard } from "@/components/ui/pencil-card"
import { digitInterpretations } from "@/lib/data"
import { codeStructures } from "@/lib/data"
import { dailyApplication } from "@/lib/data"
import { useTheme } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/client"

type CodeType = "master" | "repeating" | "diverse"

interface CodeInfo {
  type: CodeType
  title: string
  description: string
}

function analyzeCode(code: string): CodeInfo {
  const digits = code.split("")
  const uniqueDigits = new Set(digits)

  if (uniqueDigits.size === 1) {
    return { type: "master", title: "קוד מאסטר", description: codeStructures.master }
  }

  const digitCount = new Map<string, number>()
  for (const digit of digits) {
    digitCount.set(digit, (digitCount.get(digit) || 0) + 1)
  }
  const hasRepeating = Array.from(digitCount.values()).some((count) => count >= 2)

  if (hasRepeating) {
    return { type: "repeating", title: "קוד עם ספרות חוזרות", description: codeStructures.repeating }
  }

  return { type: "diverse", title: "קוד מגוון", description: codeStructures.diverse }
}

function DigitCard({ digit }: { digit: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const data = digitInterpretations[digit]
  if (!data) return null

  const sections = [
    { label: "מהות", content: data.essence },
    { label: "מתנות", content: data.gifts.join("\n") },
    { label: "חסמים", content: data.blocks.join("\n") },
    { label: "דגלים אדומים", content: data.redFlags },
    { label: "מסלול צמיחה", content: data.growth.join("\n") },
    { label: "קריירות מומלצות", content: data.careers },
    { label: "תרגול יומי", content: data.dailyPractice },
    { label: "שורה תחתונה", content: data.bottomLine },
  ]

  return (
    <PencilCard>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3"
        dir="rtl"
      >
        <div className="flex items-center gap-2.5 flex-1 text-justify font-bold text-sm">
          <span className="text-2xl font-bold text-primary">{digit}</span>
          <span className="text-foreground text-2xl font-normal text-left">{data.title}</span>
        </div>
        <div className="shrink-0">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-6 pt-4 border-t border-border/30 animate-in fade-in slide-in-from-top-2 duration-300">
          {sections.map((section) => (
            <div key={section.label} className="space-y-2">
              <h4 className="text-primary text-2xl font-medium text-center">{section.label}</h4>
              <div className="text-foreground/80 leading-loose text-lg leading-7 tracking-tight mx-0 px-0">
                {section.content.split("\n").map((line, i) => {
                  const dashMatch = line.match(/^(.+?)\s*[–\-]\s*(.+)$/)
                  if (dashMatch) {
                    return (
                      <p key={i} className="mb-1">
                        <span className="text-foreground font-medium tracking-normal text-xl">{dashMatch[1]}</span>
                        <span>{" – "}</span>
                        <span className="text-lg tracking-tight px-0">{dashMatch[2]}</span>
                      </p>
                    )
                  }
                  return <p key={i} className="mb-1">{line}</p>
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PencilCard>
  )
}

function parseCodeDigits(c: string): number[] {
  return c.split("").map(Number)
}

function generateTextFile(code: string): string {
  const codeInfo = analyzeCode(code)
  const digits = parseCodeDigits(code)
  const uniqueDigits = [...new Set(digits)]

  let text = `קוד האושר שלך: ${code}\n`
  text += `סוג הקוד: ${codeInfo.title}\n`
  text += `${"=".repeat(50)}\n\n`
  text += `${codeInfo.description}\n\n`
  text += `${"=".repeat(50)}\n\n`

  for (const digit of uniqueDigits) {
    const data = digitInterpretations[digit]
    if (!data) continue

    text += `--- ספרה ${digit}: ${data.title} ---\n\n`
    text += `מהות:\n${data.essence}\n\n`
    text += `מתנות:\n${data.gifts.map((g) => `  > ${g}`).join("\n")}\n\n`
    text += `חסמים:\n${data.blocks.map((b) => `  > ${b}`).join("\n")}\n\n`
    text += `דגלים אדומים:\n${data.redFlags}\n\n`
    text += `מסלול צמיחה:\n${data.growth.map((g) => `  > ${g}`).join("\n")}\n\n`
    text += `קריירות מומלצות:\n${data.careers}\n\n`
    text += `תרגול יומי:\n${data.dailyPractice}\n\n`
    text += `שורה תחתונה:\n${data.bottomLine}\n\n`
    text += `${"=".repeat(50)}\n\n`
  }

  text += `${dailyApplication.title}\n\n`
  text += `${dailyApplication.content}\n\n`
  text += `${"=".repeat(50)}\n`
  text += `Awakening by Ksenia\n`

  return text
}

function ThankYouContent() {
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams.get("code")
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [code, setCode] = useState<string | null>(codeFromUrl)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [codeSaved, setCodeSaved] = useState(false)

  useEffect(() => {
    if (codeFromUrl) return

    async function retrieveCode() {
      // 1. Try to get token from cookie (set by server in API route)
      const cookieMatch = document.cookie.match(/purchase-token=([^;]+)/)
      const tokenFromCookie = cookieMatch ? cookieMatch[1] : null
      // 2. Fallback: token from localStorage
      const tokenFromLocal = localStorage.getItem("purchase-token")
      const token = tokenFromCookie || tokenFromLocal

      if (token) {
        try {
          const res = await fetch(`/api/get-pending-code?token=${token}`)
          if (res.ok) {
            const { code: savedCode } = await res.json()
            if (savedCode) {
              setCode(savedCode)
              return
            }
          }
        } catch (_) { /* ignore */ }
      }

      // 3. Last resort: direct localStorage fallback
      const directCode = localStorage.getItem("soul-code-purchased")
      if (directCode) {
        setCode(directCode)
      }
    }

    retrieveCode()
  }, [codeFromUrl])

  useEffect(() => {
    async function checkAuthAndSave() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        if (code) {
          const { error } = await supabase.from("purchased_codes").upsert({
            user_id: user.id,
            code: code,
          }, { onConflict: "user_id,code" })
          if (!error) {
            setCodeSaved(true)
            // Clean up all storage
            localStorage.removeItem("soul-code-purchased")
            localStorage.removeItem("purchase-token")
            document.cookie = "purchase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            document.cookie = "pending-soul-code=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          }
        }
      } else {
        // User not logged in - save code in a persistent cookie so dashboard can pick it up after login
        if (code) {
          const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
          document.cookie = `pending-soul-code=${code}; path=/; expires=${expires}; SameSite=Lax`
          localStorage.setItem("pending-soul-code", code)
        }
      }
    }
    if (code) {
      checkAuthAndSave()
    }
  }, [code])

  if (!code || code.length !== 4 || !/^\d{4}$/.test(code)) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-28 text-center">
        <p className="text-muted-foreground mb-4">לא נמצא קוד תקין</p>
        <Button asChild>
          <Link href="/tools/soul-code/calculator">חזרה למחשבון</Link>
        </Button>
      </div>
    )
  }

  const codeInfo = analyzeCode(code)
  const digits = parseCodeDigits(code)
  const uniqueDigits = [...new Set(digits)]

  const handleDownload = () => {
    const text = generateTextFile(code)
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `soul-code-${code}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center px-4 pb-28 pt-4">
      <div className="w-full max-w-md mx-auto space-y-5">
        {/* Logo */}
        <div className="w-full max-w-xs mx-auto">
          <Image
            src={isDark ? "/images/logo-light.svg" : "/images/logo-dark.svg"}
            alt="Awakening by Ksenia"
            width={400}
            height={150}
            className="object-contain w-full h-auto"
            priority
          />
        </div>

        {/* Thank You Header */}
        <PencilCard>
          <div className="space-y-3 text-center">
            
            <h1 className="text-2xl font-medium tracking-wide text-muted-foreground">
              תודה על הרכישה!
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              הפירוש המלא של קוד האושר שלך מוכן. ניתן לקרוא כאן או להוריד כקובץ.
            </p>
          </div>
        </PencilCard>

        {/* Code Display */}
        <PencilCard>
          <div className="space-y-4 text-center">
            <h2 className="font-light overline text-primary text-4xl">קוד האושר שלך</h2>
            <div className="flex items-center justify-center gap-3" dir="ltr">
              {digits.map((digit, index) => (
                <div
                  key={index}
                  className="w-14 h-18 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center py-3"
                >
                  <span className="text-2xl font-light text-foreground">{digit}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl text-muted-foreground font-medium">{codeInfo.title}</h3>
              <p className="text-foreground/75 leading-loose text-lg tracking-tight">{codeInfo.description}</p>
            </div>
          </div>
        </PencilCard>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          className="w-full h-12 rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-xl font-normal">הורדת הפירוש המלא כקובץ</span>
        </Button>

        {/* Full Digit Interpretations */}
        <div className="space-y-1">
          <h2 className="text-center text-xl font-medium mb-3 text-muted-foreground">פירוש הספרות</h2>
          <div className="space-y-3">
            {uniqueDigits.map((digit) => (
              <DigitCard key={digit} digit={digit} />
            ))}
          </div>
        </div>

        {/* Daily Application */}
        <PencilCard>
          <div className="space-y-2">
            <h3 className="text-primary text-2xl font-medium text-center">{dailyApplication.title}</h3>
            <p className="text-foreground/75 leading-loose whitespace-pre-line text-right text-lg tracking-tight">
              {dailyApplication.content}
            </p>
          </div>
        </PencilCard>

        {/* Account CTA - show if not logged in */}
        {!isLoggedIn && (
          <PencilCard>
            <div className="space-y-4 text-center py-2">
              <h3 className="font-medium text-foreground text-xl">
                {"שמרו את הפירוש באזור האישי"}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {"צרו חשבון כדי לגשת לפירוש המלא של קוד האושר שלכם בכל עת, ללא תשלום נוסף."}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 text-xl"
                >
                  <Link href="/signup">{"יצירת חשבון"}</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-10 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 text-lg"
                >
                  <Link href="/login">{"כבר יש לי חשבון - התחברות"}</Link>
                </Button>
              </div>
            </div>
          </PencilCard>
        )}

        {/* Saved confirmation */}
        {isLoggedIn && codeSaved && (
          <PencilCard>
            <div className="text-center py-2 space-y-2">
              <p className="text-sm text-primary font-medium">
                {"הפירוש נשמר בהצלחה באזור האישי שלכם"}
              </p>
              <p className="text-xs text-muted-foreground">
                {"תוכלו לגשת אליו בכל עת דרך כניסה לחשבון"}
              </p>
            </div>
          </PencilCard>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <Button
            asChild
            variant="ghost"
            className="w-full h-12 rounded-xl gap-2 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Link href="/">
              <Home className="h-4 w-4" strokeWidth={1} />
              <span className="text-xl font-normal">חזרה לדף הבית</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">טוען...</p>
        </div>
      }>
        <ThankYouContent />
      </Suspense>
    </AppShell>
  )
}
