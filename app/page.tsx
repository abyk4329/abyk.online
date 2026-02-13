"use client"

import { useState, useCallback, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Share2, Calculator, MessageCircle, Compass } from "lucide-react"
import Image from "next/image"
import { SplashScreen } from "@/components/splash-screen"
import { SPLASH_VIDEO } from "@/lib/constants"
import { useTheme } from "@/components/theme-provider"
import { PencilCard } from "@/components/ui/pencil-card"

export default function HomePage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [mounted, setMounted] = useState(false)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    setMounted(true)
    const lastSplash = sessionStorage.getItem("abyk-splash-shown")
    if (!lastSplash) {
      setShowSplash(true)
    }
  }, [])
  
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("abyk-splash-shown", "true")
    }
  }, [])

  const handleShare = async () => {
    const shareData = {
      title: "AWAKENING BY KSENIA",
      text: "AWAKENING BY KSENIA - מרחב דיגיטלי להתפתחות והתעוררות הנשמה",
      url: window.location.origin,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        alert("הקישור הועתק!")
      } catch {
        // Fallback for older browsers
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, "_blank")
      }
    }
  }

  return (
    <>
      {mounted && showSplash && (
        <SplashScreen
          onComplete={handleSplashComplete}
          videoSrc={SPLASH_VIDEO}
        />
      )}
      
      <AppShell>
        <div className="min-h-screen flex flex-col items-center px-4 py-6">
          {/* Hero Section - כרטיס ראשי */}
          <section className="w-full max-w-md mx-auto text-center space-y-6">
            {/* Logo with Metatron's Cube integrated */}
            <div className="w-full max-w-sm mx-auto">
              <Image
                src={isDark ? "/images/logo-metatron-dark.png" : "/images/logo-metatron.png"}
                alt="Awakening by Ksenia"
                width={500}
                height={500}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

          <div className="grid gap-5 -mt-2">
            {/* יעוץ אישי */}
            <Link href="/consultation" className="group active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <MessageCircle className="h-6 w-6 text-primary" strokeWidth={1} />
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="text-foreground text-2xl font-normal">יעוץ אישי</h3>
                    <p className="text-muted-foreground text-base">קבעו פגישת ייעוץ אישית</p>
                  </div>
                </div>
              </PencilCard>
            </Link>

            {/* מצפן פנג שואי */}
            <Link href="/tools/feng-shui/calculator" className="group active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <Compass className="h-6 w-6 text-primary" strokeWidth={1} />
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="text-foreground font-normal text-2xl">{"מצפן פנג שואי"}</h3>
                    <p className="text-muted-foreground text-base">{"גלו את הכיוונים המומלצים שלכם"}</p>
                  </div>
                </div>
              </PencilCard>
            </Link>

            {/* מחשבון קוד האושר */}
            <Link href="/tools/soul-code/calculator" className="group active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <Calculator className="h-6 w-6 text-primary" strokeWidth={1} />
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="text-foreground font-normal text-2xl">{"מחשבון קוד האושר"}</h3>
                    <p className="text-muted-foreground text-base">{"גלו את קוד האושר האישי שלכם"}</p>
                  </div>
                </div>
              </PencilCard>
            </Link>

          </div>
        </section>

        {/* Share Section */}
        <section className="w-full max-w-md mx-auto mt-6">
          <button 
            onClick={handleShare}
            className="w-full text-right active:scale-[0.98] transition-transform duration-200"
          >
            <PencilCard>
                <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                  <Share2 className="h-6 w-6 text-primary" strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground text-2xl font-normal">{"שתפו עם מי שחשוב לכם"}</h3>
                  <p className="text-muted-foreground text-base">{"הזמינו חברים ומשפחה לגלות את עצמם"}</p>
                </div>
              </div>
            </PencilCard>
          </button>
        </section>
      </div>
    </AppShell>
    </>
  )
}
