"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { PencilCard } from "@/components/ui/pencil-card"
import { useTheme } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/client"
import { codeStructures } from "@/lib/data"

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 21H19a2 2 0 002-2V5a2 2 0 00-2-2h-4" />
      <polyline points="8 17 3 12 8 7" />
      <line x1="3" y1="12" x2="15" y2="12" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

type Profile = {
  first_name: string | null
  last_name: string | null
  gender: string | null
  phone: string | null
  birth_date: string | null
}

type PurchasedCode = {
  id: string
  code: string
  purchased_at: string
}

function analyzeCode(code: string) {
  const sorted = code.split("").sort().join("")
  return codeStructures[sorted] || codeStructures["default"] || null
}

function getGreeting(gender: string | null) {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "בוקר טוב"
  if (hour >= 12 && hour < 17) return "צהריים טובים"
  if (hour >= 17 && hour < 21) return "ערב טוב"
  return "לילה טוב"
}

function getWelcomeText(gender: string | null) {
  if (gender === "female") return "ברוכה השבה"
  if (gender === "male") return "ברוך השב"
  return "ברוכים השבים"
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  try {
    const [year, month, day] = dateStr.split("-")
    return `${day}.${month}.${year}`
  } catch {
    return dateStr
  }
}

export default function DashboardPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [purchasedCodes, setPurchasedCodes] = useState<PurchasedCode[]>([])
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, gender, phone, birth_date")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      } else {
        setProfile({
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null,
          gender: user.user_metadata?.gender || null,
          phone: user.user_metadata?.phone || null,
          birth_date: user.user_metadata?.birth_date || null,
        })
      }

      // Check for any pending code from a recent purchase (cookie or localStorage)
      const cookieMatch = document.cookie.match(/pending-soul-code=(\d{4})/)
      const pendingCode = cookieMatch?.[1] || localStorage.getItem("pending-soul-code")
      
      if (pendingCode) {
        await supabase.from("purchased_codes").upsert({
          user_id: user.id,
          code: pendingCode,
        }, { onConflict: "user_id,code" })
        // Clean up
        localStorage.removeItem("pending-soul-code")
        document.cookie = "pending-soul-code=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        localStorage.removeItem("purchase-token")
        document.cookie = "purchase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }

      // Also check for purchase-token in case thank-you page didn't save
      const tokenCookieMatch = document.cookie.match(/purchase-token=([^;]+)/)
      const purchaseToken = tokenCookieMatch?.[1] || localStorage.getItem("purchase-token")
      if (purchaseToken) {
        try {
          const res = await fetch(`/api/get-pending-code?token=${purchaseToken}`)
          if (res.ok) {
            const { code: tokenCode } = await res.json()
            if (tokenCode) {
              await supabase.from("purchased_codes").upsert({
                user_id: user.id,
                code: tokenCode,
              }, { onConflict: "user_id,code" })
            }
          }
        } catch (_) { /* ignore */ }
        localStorage.removeItem("purchase-token")
        document.cookie = "purchase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }

      const { data: codes } = await supabase
        .from("purchased_codes")
        .select("id, code, purchased_at")
        .eq("user_id", user.id)
        .order("purchased_at", { ascending: false })

      if (codes) setPurchasedCodes(codes)
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground text-base">{"..."}</p>
        </div>
      </AppShell>
    )
  }

  const firstName = profile?.first_name || "אורח"
  const gender = profile?.gender || null

  return (
    <AppShell>
      <div className="flex flex-col items-center px-4 pt-4 pb-28">
        <div className="w-full max-w-md mx-auto space-y-6">

          {/* Logo */}
          <div className="w-full max-w-xs mx-auto">
            <Image
              src={isDark ? "/images/logo-light.svg" : "/images/logo-dark.svg"}
              alt="Awakening by Ksenia"
              width={600}
              height={200}
              className="object-contain w-full h-auto"
              priority
            />
          </div>

          {/* Greeting */}
          <div className="text-center space-y-1">
            
            <h1 className="tracking-wide text-3xl font-light overline text-sidebar-ring">
              {`${getGreeting(gender)}, ${firstName}`}
            </h1>
          </div>

          {/* User Info */}
          {profile?.birth_date && (
            <div className="text-center">
              <p className="border-none border-0 text-xl font-medium text-muted-foreground">
                {"תאריך לידה: "}
                <span className="text-xl text-muted-foreground font-semibold">{formatDate(profile.birth_date)}</span>
              </p>
            </div>
          )}

          {/* Purchased Codes */}
          <div className="space-y-3">
            

            {purchasedCodes.length === 0 ? (
              <PencilCard>
                <div className="text-center py-4 space-y-3">
                  <p className="text-base text-muted-foreground">{"עדיין אין רכישות"}</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Link href="/tools/soul-code/calculator">{"לגילוי קוד האושר"}</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-xl bg-transparent"
                    >
                      <Link href="/consultation">{"להזמנת ייעוץ אישי"}</Link>
                    </Button>
                  </div>
                </div>
              </PencilCard>
            ) : (
              purchasedCodes.map((item) => {
                const codeInfo = analyzeCode(item.code)
                return (
                  <Link key={item.id} href={`/thank-you?code=${item.code}`}>
                    <PencilCard>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-right flex-1">
                          <p className="tracking-[0.3em] text-3xl text-center text-sidebar-ring font-normal" dir="ltr">
                            {item.code}
                          </p>
                          {codeInfo && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {codeInfo.name}
                            </p>
                          )}
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      </div>
                    </PencilCard>
                  </Link>
                )
              })
            )}
          </div>

          {/* Extra Purchase CTAs - only if user has at least one purchase */}
          {purchasedCodes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-xl text-center text-muted-foreground overline font-normal">{"גלו עוד"}</h2>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-normal text-xl"
                >
                  <Link href="/tools/soul-code/calculator">{"חישוב קוד אושר נוסף"}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl bg-transparent text-xl font-normal text-muted-foreground"
                >
                  <Link href="/consultation">{"הזמנת ייעוץ אישי"}</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <div className="border-t border-border/30 my-1" />

            <Button
              asChild
              variant="ghost"
              className="w-full h-11 rounded-xl justify-between hover:bg-muted/50 text-muted-foreground"
            >
              <Link href="/reset-password">
                <span className="font-normal text-lg">{"שינוי סיסמה"}</span>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground/50" />
              </Link>
            </Button>

            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              variant="ghost"
              className="w-full h-11 rounded-xl justify-between text-primary/60 hover:text-primary hover:bg-primary/5 font-normal text-lg"
            >
              <span className="text-lg text-muted-foreground">{loggingOut ? "מתנתקים..." : "התנתקות"}</span>
              <LogOutIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
