"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Sparkles, Calculator } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { codeStructures } from "@/lib/data"
import { PencilCard } from "@/components/ui/pencil-card"

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
    return {
      type: "master",
      title: "קוד מאסטר",
      description: codeStructures.master,
    }
  }

  const digitCount = new Map<string, number>()
  for (const digit of digits) {
    digitCount.set(digit, (digitCount.get(digit) || 0) + 1)
  }
  const hasRepeating = Array.from(digitCount.values()).some(
    (count) => count >= 2
  )

  if (hasRepeating) {
    return {
      type: "repeating",
      title: "קוד עם ספרות חוזרות",
      description: codeStructures.repeating,
    }
  }

  return {
    type: "diverse",
    title: "קוד מגוון",
    description: codeStructures.diverse,
  }
}

function parseCodeDigits(c: string): number[] {
  return c.split("").map(Number)
}

interface ResultContentProps {
  code: string
}

const GROW_PAYMENT_URL = "https://pay.grow.link/bd88fddc4bd99a2f569c2875c62e7d52-MzA1NzY3Ng"

function ResultContent({ code }: ResultContentProps) {
  const codeInfo = analyzeCode(code)
  const digits = parseCodeDigits(code)

  const handlePurchase = async () => {
    try {
      // Save code to server (Supabase) - most reliable method
      const res = await fetch("/api/save-pending-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      
      if (res.ok) {
        const { token } = await res.json()
        // Cookie is set by the API, but also save token as backup in localStorage
        localStorage.setItem("purchase-token", token)
      }
    } catch (_) {
      // If server save fails, fall back to client-side storage
      localStorage.setItem("soul-code-purchased", code)
    }
    
    window.location.href = GROW_PAYMENT_URL
  }

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-28">
      <div className="w-full max-w-md mx-auto space-y-5">
        {/* Code Display Card */}
        <PencilCard>
          <div className="space-y-5 text-center">
            <h1 className="font-light overline text-primary text-4xl tracking-wide">
              קוד האושר שלך
            </h1>

            <div className="flex items-center justify-center gap-3" dir="ltr">
              {digits.map((digit, index) => (
                <div
                  key={index}
                  className="w-16 h-20 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center"
                >
                  <span className="text-3xl font-light text-foreground">
                    {String(digit)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-muted-foreground font-normal text-2xl">
                {codeInfo.title}
              </h2>
              <p className="text-foreground/75 leading-loose text-lg tracking-tight">
                {codeInfo.description}
              </p>
            </div>
          </div>
        </PencilCard>

        {/* Sales Section */}
        <PencilCard>
          <div className="space-y-4 text-center">
            

            <h2 className="text-primary font-medium text-2xl">
              גלו את הפירוש המלא של הקוד שלכם
            </h2>

            <div className="space-y-3 text-right">
              <p className="text-foreground/75 leading-loose text-lg tracking-tight">
                הקוד שלכם מכיל שכבות עמוקות של משמעות. הפירוש המלא חושף:
              </p>
              <ul className="space-y-2.5">
                <li className="text-foreground/80 leading-relaxed flex items-start gap-2 text-lg tracking-tight">
                  <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                  <span><span className="font-semibold text-foreground">{"מהות כל ספרה"}</span>{" בקוד שלכם ומשמעותה העמוקה"}</span>
                </li>
                <li className="text-foreground/80 leading-relaxed flex items-start gap-2 text-lg tracking-tight">
                  <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                  <span><span className="font-semibold text-foreground">{"מתנות וכישרונות טבעיים"}</span>{" שמחכים לביטוי"}</span>
                </li>
                <li className="text-base text-foreground/80 leading-relaxed flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                  <span className="text-lg tracking-normal"><span className="font-semibold text-foreground">{"חסמים ודגלים אדומים"}</span>{" שכדאי להכיר"}</span>
                </li>
                <li className="text-foreground/80 leading-relaxed flex items-start gap-2 text-lg tracking-tight">
                  <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                  <span><span className="font-semibold text-foreground">{"מסלול צמיחה אישי"}</span>{" וקריירות מומלצות"}</span>
                </li>
                <li className="text-base text-foreground/80 leading-relaxed flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                  <span className="text-lg tracking-tight"><span className="font-semibold text-foreground">{"תרגול יומי"}</span>{" ויישום מעשי בחיי היומיום"}</span>
                </li>
              </ul>
            </div>

            {/* Purchase Button */}
            <div className="pt-2">
              <Button
                onClick={handlePurchase}
                className="w-full h-14 rounded-xl gap-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
              >
                <span className="font-normal text-xl">לרכישת הפירוש המלא</span>
              </Button>
              <p className="text-muted-foreground mt-2 text-base">
                {"קבלו גישה מיידית לפירוש המלא והמעמיק של הקוד שלכם"}
              </p>
            </div>
          </div>
        </PencilCard>

        {/* Back to Calculator */}
        <div className="space-y-3 pt-1">
          <Button
            asChild
            variant="ghost"
            className="w-full h-12 rounded-xl gap-2 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Link href="/tools/soul-code/calculator">
              <Calculator className="h-4 w-4" strokeWidth={1} />
              <span className="text-xl font-normal">חישוב קוד נוסף</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function InvalidCode() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <p className="text-muted-foreground">לא נמצא קוד תקין</p>
        <Button asChild>
          <Link href="/tools/soul-code/calculator">חזרה למחשבון</Link>
        </Button>
      </div>
    </div>
  )
}

function ResultPageInner() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const isValidCode = code && code.length === 4 && /^\d{4}$/.test(code)

  return isValidCode ? <ResultContent code={code} /> : <InvalidCode />
}

export default function ResultPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">טוען...</p>
        </div>
      }>
        <ResultPageInner />
      </Suspense>
    </AppShell>
  )
}
