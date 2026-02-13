"use client"

import { AppShell } from "@/components/layout/app-shell"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { PencilCard } from "@/components/ui/pencil-card"

const WHATSAPP_LINK = "https://wa.me/message/PUSKMULYLLD7F1"
const INSTAGRAM_LINK = "https://www.instagram.com/awakening.by.ksenia?igsh=MTZwOWljN2dsOXZzbQ%3D%3D&utm_source=qr"
const TIKTOK_LINK = "https://www.tiktok.com/@awakening.by.ksenia?_r=1&_t=ZS-93hfpdFVhrk"
const EMAIL = "awakening.by.ksenia@gmail.com"
const PHONE = "0524616121"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 113.4 3.4L3 21" />
      <path d="M9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1zm0 0a5 5 0 005 5m0 0h1a.5.5 0 000-1h-1a.5.5 0 000 1z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  )
}

export default function ContactPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

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
            <h1 className="overline text-3xl font-light text-primary tracking-wide">
              {"יצירת קשר"}
            </h1>
          </div>

          {/* Contact Links */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block no-underline active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <WhatsAppIcon className="h-6 w-6 text-[#b8a07a] dark:text-[#baa791]" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-foreground font-light tracking-normal text-xl">{"WhatsApp"}</p>
                  </div>
                </div>
              </PencilCard>
            </a>

            {/* Phone Call */}
            <a href={`tel:${PHONE}`} className="block no-underline active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <PhoneIcon className="h-6 w-6 text-[#b8a07a] dark:text-[#baa791]" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-foreground font-light text-xl">{"Phone"}</p>
                  </div>
                </div>
              </PencilCard>
            </a>

            {/* Email */}
            <a href={`mailto:${EMAIL}`} className="block no-underline active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <MailIcon className="h-6 w-6 text-[#b8a07a] dark:text-[#baa791]" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-foreground font-light text-xl">{"Gmail"}</p>
                  </div>
                </div>
              </PencilCard>
            </a>

            {/* Instagram */}
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="block no-underline active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <InstagramIcon className="h-6 w-6 text-[#b8a07a] dark:text-[#baa791]" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-foreground font-light text-xl">{"Instagram"}</p>
                  </div>
                </div>
              </PencilCard>
            </a>

            {/* TikTok */}
            <a href={TIKTOK_LINK} target="_blank" rel="noopener noreferrer" className="block no-underline active:scale-[0.98] transition-transform duration-200">
              <PencilCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/[0.06]">
                    <TikTokIcon className="h-6 w-6 text-[#b8a07a] dark:text-[#baa791]" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-foreground font-light text-xl">{"TikTok"}</p>
                  </div>
                </div>
              </PencilCard>
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
