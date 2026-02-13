"use client"

import { X, Home, Calculator, MessageCircle, LogIn, FileText, Download, User, Compass } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [showHomeSheet, setShowHomeSheet] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  const menuItems = [
    { icon: Home, label: "דף הבית", href: "/" },
    { icon: Compass, label: "מצפן פנג שואי", href: "/tools/feng-shui/calculator" },
    { icon: Calculator, label: "מחשבון קוד האושר", href: "/tools/soul-code/calculator" },
    { icon: MessageCircle, label: "יצירת קשר", href: "/contact" },
    { icon: User, label: "האזור האישי", href: "/dashboard" },
    { icon: LogIn, label: "התחברות / הרשמה", href: "/login" },
    { icon: FileText, label: "תנאים משפטיים", href: "/legal" },
  ]

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <SideMenuContent
        isOpen={isOpen}
        onClose={onClose}
        menuItems={menuItems}
        onOpenHomeSheet={() => {
          onClose()
          setTimeout(() => setShowHomeSheet(true), 250)
        }}
      />
      {showHomeSheet && <AddToHomeSheet onClose={() => setShowHomeSheet(false)} isDark={isDark} />}
    </>
  )
}

function AddToHomeSheet({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    setIsIOS(/iPad|iPhone|iPod/.test(ua))
    setIsAndroid(/Android/.test(ua))
  }, [])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">{"שמירה למסך הבית"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted/50">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        {isIOS ? (
          <div className="space-y-4 text-right">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-xl shrink-0">1</span>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {"לחצו על כפתור השיתוף"}
                <span className="inline-block mx-1">
                  <svg className="inline h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span>
                {"בתחתית המסך (Safari)"}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-xl shrink-0">2</span>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {"גללו למטה ובחרו "}
                <span className="font-semibold text-foreground">{'"הוסף למסך הבית"'}</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-xl shrink-0">3</span>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {"לחצו "}
                <span className="font-semibold text-foreground">{'"הוסף"'}</span>
                {" בפינה הימנית העליונה"}
              </p>
            </div>
          </div>
        ) : isAndroid ? (
          <div className="space-y-4 text-right">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-xl shrink-0">1</span>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {"לחצו על שלוש הנקודות "}
                <span className="font-semibold text-foreground">{"\u22EE"}</span>
                {" בפינה העליונה של Chrome"}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-xl shrink-0">2</span>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {"בחרו "}
                <span className="font-semibold text-foreground">{'"הוספה למסך הבית"'}</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-xl shrink-0">3</span>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {"אשרו ע\"י לחיצה על "}
                <span className="font-semibold text-foreground">{'"הוסף"'}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-right">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {'פתחו את האתר בדפדפן בטלפון (Safari ב-iPhone או Chrome ב-Android) והשתמשו באפשרות "הוסף למסך הבית" מתפריט השיתוף.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SideMenuContent({ isOpen, onClose, menuItems, onOpenHomeSheet }: { isOpen: boolean; onClose: () => void; menuItems: { icon: any; label: string; href: string }[]; onOpenHomeSheet: () => void }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div
      className={cn(
        "fixed top-0 right-0 z-50 h-full w-[280px] max-w-[85vw] shadow-2xl bg-background",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="תפריט ראשי"
    >
      {/* Pencil-sketch geometric decoration */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] stroke-primary" viewBox="0 0 280 600" fill="none" strokeWidth="0.5" strokeLinecap="round">
        <circle cx="140" cy="300" r="180" strokeDasharray="3 6" />
        <circle cx="140" cy="300" r="120" strokeDasharray="2 8" />
        <line x1="0" y1="300" x2="280" y2="300" strokeDasharray="2 10" />
        <line x1="140" y1="80" x2="140" y2="520" strokeDasharray="2 10" />
      </svg>

      <div className="relative flex items-center justify-between p-4 border-b border-sidebar-border">
        <button
          onClick={onClose}
          className="p-2 rounded-full transition-colors text-sidebar-foreground"
          aria-label="סגור תפריט"
        >
          <X className="h-5 w-5" />
        </button>
        <ThemeToggle />
      </div>

      <div className="relative px-5 py-5 border-b border-sidebar-border">
        {isDark ? (
          <Image
            src="/images/logo-light.svg"
            alt="Awakening by Ksenia"
            width={260}
            height={70}
            className="w-full h-auto object-contain"
          />
        ) : (
          <Image
            src="/images/logo-dark.svg"
            alt="Awakening by Ksenia"
            width={260}
            height={70}
            className="w-full object-contain h-auto px-0 mx-0"
          />
        )}
      </div>

      <nav className="relative p-4 space-y-1 font-light">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xl font-thin font-sans"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-light text-xl text-sidebar-foreground">{item.label}</span>
            </Link>
          )
        })}

        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 active:scale-[0.98] mt-4 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onOpenHomeSheet}
        >
          <Download className="h-5 w-5 text-primary" />
          <span className="font-light text-xl text-sidebar-foreground">שמירה למסך הבית</span>
        </button>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <p className="text-[10px] text-center text-muted-foreground/50">© 2025 Awakening by Ksenia</p>
      </div>

    </div>
  )
}
