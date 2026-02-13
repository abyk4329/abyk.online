"use client"

import { useEffect } from "react"
import Script from "next/script"

const TIKTOK_PIXEL_ID = "D3C3JDBC77UEJB9H374G"

export function TikTokPixel() {
  useEffect(() => {
    let loaded = false
    const handleConsent = () => {
      if (loaded) return
      if (TIKTOK_PIXEL_ID && typeof window !== "undefined" && (window as any).ttq) {
        loaded = true
        ;(window as any).ttq.load(TIKTOK_PIXEL_ID)
        ;(window as any).ttq.page()
      }
    }

    // Check if consent already given
    const consent = localStorage.getItem("cookie-consent")
    if (consent === "accepted") {
      handleConsent()
    }

    // Listen for new consent
    window.addEventListener("cookie-consent-accepted", handleConsent)
    return () => window.removeEventListener("cookie-consent-accepted", handleConsent)
  }, [])

  if (!TIKTOK_PIXEL_ID) return null

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
            ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
            var i=document.createElement("script");
            i.type="text/javascript",i.async=!0,i.src=r+"?sdkid="+e+"&lib="+t;
            var a=document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(i,a)};
          }(window, document, 'ttq');
        `,
      }}
    />
  )
}

// Helper to track events (use after purchase, page views, etc.)
export function trackTikTokEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).ttq) {
    const consent = localStorage.getItem("cookie-consent")
    if (consent === "accepted") {
      (window as any).ttq.track(eventName, data)
    }
  }
}
