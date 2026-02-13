import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/cookie-consent"
import { TikTokPixel } from "@/components/tiktok-pixel"
import "./globals.css"

import { Assistant, Geist_Mono, Assistant as V0_Font_Assistant, Geist_Mono as V0_Font_Geist_Mono } from 'next/font/google'

// Initialize fonts
const _assistant = V0_Font_Assistant({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-assistant",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "AWAKENING BY KSENIA | מרחב דיגיטלי לנשמה",
  description: "AWAKENING BY KSENIA - מרחב דיגיטלי להתפתחות והתעוררות הנשמה",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AWAKENING",
  },
  icons: {
    icon: [
      { url: "/icons/app-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/app-icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/app-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/app-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/app-icon.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/app-icon.png", sizes: "120x120", type: "image/png" },
    ],
    shortcut: "/icons/app-icon.png",
  },
  openGraph: {
    title: "AWAKENING BY KSENIA",
    description: "מרחב דיגיטלי להתפתחות והתעוררות הנשמה",
    type: "website",
    locale: "he_IL",
    images: [
      {
        url: "/images/og-share.png",
        width: 512,
        height: 512,
        alt: "AWAKENING BY KSENIA",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "AWAKENING BY KSENIA",
    description: "מרחב דיגיטלי להתפתחות והתעוררות הנשמה",
    images: ["/images/og-share.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F3EF" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1F2E" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${assistant.className} ${geistMono.variable} font-sans antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('awakening-theme')||'system';var r=t;if(t==='system'){r=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.classList.add(r)}catch(e){}})()` }} />
        <ThemeProvider defaultTheme="system">
          {children}
          <CookieConsent />
        </ThemeProvider>
        <TikTokPixel />
        <Analytics />
      </body>
    </html>
  )
}
