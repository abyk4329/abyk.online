"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { PencilCard } from "@/components/ui/pencil-card"
import { CompassVisual } from "@/components/feng-shui/compass-visual"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  type Gender,
  type KuaDirections,
  calculateKua,
  genderText,
  getKuaEnergyDescription,
  getUsageGuides,
  KUA_DIRECTIONS,
  DIRECTION_CATEGORIES,
  DIRECTION_LABELS,
} from "@/lib/feng-shui-data"
import {
  Compass,
  ChevronDown,
  LogIn,
  Briefcase,
  Moon,
  DoorOpen,
  Flame,
  Heart,
  HeartHandshake,
} from "lucide-react"

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  Moon,
  DoorOpen,
  Flame,
  Heart,
  HeartHandshake,
}

interface PurchaseData {
  kuaNumber: number
  rawKua: number
  gender: Gender
  birthDate: string
  purchasedAt: string
}

function usePurchaseData() {
  const [data, setData] = useState<PurchaseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for purchase data
    const stored = localStorage.getItem("fengshui-purchase")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PurchaseData
        setData(parsed)
      } catch {
        // invalid data
      }
    }
    setLoading(false)
  }, [])

  return { data, loading }
}

function CompassContent({ purchase }: { purchase: PurchaseData }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [compassSettled, setCompassSettled] = useState(false)
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null)

  const { kuaNumber, gender } = purchase
  const directions = KUA_DIRECTIONS[kuaNumber] as KuaDirections
  const g = (m: string, f: string) => genderText(gender, m, f)
  const guides = getUsageGuides(directions, gender)

  const handleSettled = useCallback(() => {
    setCompassSettled(true)
  }, [])

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

        {/* CTA banner — save to account */}
        <div className="w-full rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3">
          <Button
            asChild
            size="sm"
            className="rounded-lg gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/login?redirect=/tools/feng-shui/compass">
              <LogIn className="h-4 w-4" strokeWidth={1} />
              <span>{g("התחבר", "התחברי")}</span>
            </Link>
          </Button>
          <p className="text-sm text-foreground/70 text-right flex-1">
            {g("שמור את המצפן שלך באיזור האישי", "שמרי את המצפן שלך באיזור האישי")}
          </p>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="font-light text-primary text-3xl tracking-wide">
            {"המצפן האישי"}
          </h1>
          <p className="text-muted-foreground text-base">
            {"קואה"} {purchase.rawKua}
          </p>
        </div>

        {/* Interactive Compass */}
        <PencilCard>
          <div className="flex flex-col items-center py-4 space-y-4">
            <CompassVisual directions={directions} onSettled={handleSettled} />
            {compassSettled && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {DIRECTION_CATEGORIES.map((cat) => {
                  const dir = directions[cat.key]
                  return (
                    <span
                      key={cat.key}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${cat.color} border-current/20 bg-current/5`}
                      style={{ transition: "opacity 0.5s", opacity: compassSettled ? 1 : 0 }}
                    >
                      <span className="font-medium">{DIRECTION_LABELS[dir]}</span>
                      <span className="opacity-60">{cat.label}</span>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </PencilCard>

        {/* Direction Detail Cards */}
        <div className="space-y-3">
          <h2 className="text-foreground text-xl font-light text-center">
            {"הכיוונים המומלצים"}
          </h2>

          {DIRECTION_CATEGORIES.map((cat) => {
            const dir = directions[cat.key]
            return (
              <PencilCard key={cat.key}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{dir}</span>
                    <div className="flex items-center gap-2 flex-row-reverse">
                      <span className={`text-lg font-medium ${cat.color}`}>{cat.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-2xl text-foreground">{DIRECTION_LABELS[dir]}</span>
                  </div>
                  <p className="text-foreground/70 leading-relaxed text-right text-base">
                    {cat.description}
                  </p>
                </div>
              </PencilCard>
            )
          })}
        </div>

        {/* Practical Usage Guide */}
        <div className="space-y-3 pt-2">
          <h2 className="text-foreground text-xl font-light text-center">
            {"מדריך שימוש מעשי"}
          </h2>

          {guides.map((guide, idx) => {
            const isExpanded = expandedGuide === idx
            const IconComponent = ICON_MAP[guide.icon] || Compass
            return (
              <PencilCard key={guide.title}>
                <button
                  type="button"
                  className="w-full text-right"
                  onClick={() => setExpandedGuide(isExpanded ? null : idx)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      strokeWidth={1}
                    />
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="text-foreground text-lg">{guide.title}</span>
                      <div className="p-2 rounded-lg border border-primary/20 bg-primary/[0.06]">
                        <IconComponent className="h-5 w-5 text-primary" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div className="pt-3 mt-3 border-t border-border/50">
                    <p className="text-foreground/70 leading-loose text-right text-base">
                      {guide.content}
                    </p>
                  </div>
                )}
              </PencilCard>
            )
          })}
        </div>

        {/* Back to Calculator */}
        <div className="pt-2">
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

export default function FengShuiCompassPage() {
  const { data, loading } = usePurchaseData()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !data) {
      router.replace("/tools/feng-shui/calculator")
    }
  }, [loading, data, router])

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">{"טוען..."}</p>
        </div>
      </AppShell>
    )
  }

  if (!data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">{"מעביר למחשבון..."}</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <CompassContent purchase={data} />
    </AppShell>
  )
}
