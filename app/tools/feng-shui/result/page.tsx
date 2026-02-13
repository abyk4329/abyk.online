"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Compass, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useTheme } from "@/components/theme-provider"
import { PencilCard } from "@/components/ui/pencil-card"
import {
  calculateKua,
  getKuaEnergySegments,
  genderText,
  KUA_TITLES,
  type Gender,
} from "@/lib/feng-shui-data"
import { EnergyDescription } from "@/components/feng-shui/energy-description"

function ResultContent({ birthDate, gender }: { birthDate: string; gender: Gender }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const result = calculateKua(birthDate, gender)
  const energySegments = getKuaEnergySegments(result.rawKua, gender)
  const g = (m: string, f: string) => genderText(gender, m, f)

  const handlePurchase = () => {
    // Simulated purchase — save to localStorage
    const purchaseData = {
      kuaNumber: result.kuaNumber,
      rawKua: result.rawKua,
      gender,
      birthDate,
      purchasedAt: new Date().toISOString(),
    }
    localStorage.setItem("fengshui-purchase", JSON.stringify(purchaseData))
    window.location.href = "/tools/feng-shui/compass"
  }

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-28">
      <div className="w-full max-w-md mx-auto space-y-5">
        {/* Logo */}
        <div className="w-full max-w-[200px] mx-auto">
          {isDark ? (
            <Image
              src="/images/logo-light.svg"
              alt="Awakening by Ksenia"
              width={260}
              height={60}
              className="w-full h-auto"
              priority
            />
          ) : (
            <Image
              src="/images/logo-dark.svg"
              alt="Awakening by Ksenia"
              width={260}
              height={60}
              className="w-full h-auto"
              priority
            />
          )}
        </div>

        {/* Kua Number Display */}
        <PencilCard>
          <div className="space-y-5 text-center">
            <h1 className="font-light text-primary text-3xl tracking-wide">
              {g("מספר הקואה שלך", "מספר הקואה שלך")}
            </h1>

            <div className="flex items-center justify-center">
              <div className="w-24 h-28 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                <span className="text-5xl font-light text-foreground">
                  {result.displayKua}
                </span>
              </div>
            </div>

            {/* Element title */}
            <p className="text-foreground/60 text-lg">
              {KUA_TITLES[result.rawKua]}
            </p>

            {/* Kua 5 explanation */}
            {result.rawKua === 5 && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {"מספר הקואה המקורי הוא 5. בשיטת שמונת הארמונות, קואה 5 "}
                {g("מטופל", "מטופלת")}
                {" כקואה "}
                {result.kuaNumber}
                {" לצורך חישוב הכיוונים."}
              </p>
            )}

            {/* Group */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/15">
              <span className="text-primary text-lg">
                {result.group === "east" ? "קבוצת המזרח" : "קבוצת המערב"}
              </span>
            </div>

            {/* Energy Description */}
            <EnergyDescription segments={energySegments} />
          </div>
        </PencilCard>

        {/* Compass Teaser */}
        <PencilCard>
          <div className="space-y-5 text-center">
            {/* Blurred compass preview */}
            <div className="relative mx-auto w-64 h-64">
              {/* Compass SVG teaser - simplified static version with hidden directions */}
              <svg width="100%" height="100%" viewBox="0 0 260 260" className="drop-shadow-sm">
                {/* Outer ring */}
                <circle cx="130" cy="130" r="120" fill="none" className="stroke-border" strokeWidth={2} />
                {/* Inner ring */}
                <circle cx="130" cy="130" r="80" fill="none" className="stroke-border/50" strokeWidth={1} />
                {/* Background */}
                <circle cx="130" cy="130" r="119" className="fill-card" opacity={0.95} />
                {/* Degree ticks */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180
                  const isMajor = i % 9 === 0
                  const r1 = isMajor ? 108 : 114
                  const r2 = 116
                  const x1 = 130 + r1 * Math.sin(angle)
                  const y1 = 130 - r1 * Math.cos(angle)
                  const x2 = 130 + r2 * Math.sin(angle)
                  const y2 = 130 - r2 * Math.cos(angle)
                  return (
                    <line key={`t-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-muted-foreground/30" strokeWidth={isMajor ? 1.5 : 0.5} />
                  )
                })}
                {/* Cardinal direction labels (visible) */}
                {[
                  { label: "N", deg: 0 },
                  { label: "S", deg: 180 },
                  { label: "E", deg: 90 },
                  { label: "W", deg: 270 },
                ].map((d) => {
                  const angle = (d.deg * Math.PI) / 180
                  const x = 130 + 96 * Math.sin(angle)
                  const y = 130 - 96 * Math.cos(angle)
                  return (
                    <text key={d.label} x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-[12px] fill-muted-foreground/60">
                      {"?"}
                    </text>
                  )
                })}
                {/* Center */}
                <circle cx="130" cy="130" r="10" className="fill-primary/20 stroke-primary/40" strokeWidth={1} />
                <circle cx="130" cy="130" r="3.5" className="fill-primary" />
                {/* Needle placeholder */}
                <polygon points="130,55 126,130 134,130" className="fill-primary" opacity={0.5} />
                <polygon points="130,205 126,130 134,130" className="fill-muted-foreground/20" />
              </svg>
              {/* Blur overlay */}
              <div className="absolute inset-0 rounded-full backdrop-blur-[2px] bg-background/20" />
              {/* Lock icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 rounded-full bg-background/80 border border-border shadow-sm">
                  <Compass className="h-8 w-8 text-primary" strokeWidth={1} />
                </div>
              </div>
            </div>

            <h2 className="text-primary font-light text-2xl">
              {g("הכיוונים שלך מחכים", "הכיוונים שלך מחכים")}
            </h2>

            <Button
              onClick={handlePurchase}
              className="w-full h-14 rounded-xl gap-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
            >
              <ShieldCheck className="h-5 w-5" strokeWidth={1} />
              <span className="font-normal text-xl">{g("קבל גישה למצפן", "קבלי גישה למצפן")}</span>
            </Button>
          </div>
        </PencilCard>

        {/* Benefits */}
        <PencilCard>
          <div className="space-y-4 text-right">
            <h3 className="text-foreground font-light text-xl text-center">
              {"מה כולל המצפן האישי?"}
            </h3>
            <ul className="space-y-3">
              {[
                "מצפן אינטראקטיבי עם הכיוונים האישיים",
                "הסבר מעמיק על כל כיוון ומשמעותו",
                "מדריך מעשי: כיוון מיטה, ישיבה, דלת, מדיטציה",
                "כיוון מומלץ בזמן מחלה",
                "כיוון לחיזוק זוגיות ומערכות יחסים",
              ].map((item) => (
                <li
                  key={item}
                  className="text-foreground/80 leading-relaxed flex items-start gap-2.5 text-lg"
                >
                  <span className="text-primary mt-0.5 shrink-0">{">"}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </PencilCard>

        {/* Second CTA */}
        <Button
          onClick={handlePurchase}
          className="w-full h-14 rounded-xl gap-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        >
          <ShieldCheck className="h-5 w-5" strokeWidth={1} />
          <span className="font-normal text-xl">{"לרכישת המצפן האישי"}</span>
        </Button>
        <p className="text-muted-foreground text-center text-base">
          {"גישה מיידית למצפן ולמדריך המלא"}
        </p>

        {/* Back to Calculator */}
        <div className="space-y-3 pt-1">
          <Button
            asChild
            variant="ghost"
            className="w-full h-12 rounded-xl gap-2 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Link href="/tools/feng-shui/calculator">
              <Compass className="h-4 w-4" strokeWidth={1} />
              <span className="text-xl font-normal">{"חישוב קואה נוסף"}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function InvalidParams() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <p className="text-muted-foreground">{"לא נמצאו פרטים תקינים"}</p>
        <Button asChild>
          <Link href="/tools/feng-shui/calculator">{"חזרה למחשבון"}</Link>
        </Button>
      </div>
    </div>
  )
}

function ResultPageInner() {
  const searchParams = useSearchParams()
  const birthDate = searchParams.get("birthDate")
  const gender = searchParams.get("gender") as Gender | null

  const isValid =
    birthDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(birthDate) &&
    gender &&
    (gender === "male" || gender === "female")

  return isValid ? (
    <ResultContent birthDate={birthDate} gender={gender} />
  ) : (
    <InvalidParams />
  )
}

export default function FengShuiResultPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-muted-foreground">{"טוען..."}</p>
          </div>
        }
      >
        <ResultPageInner />
      </Suspense>
    </AppShell>
  )
}
