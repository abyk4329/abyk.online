"use client"

import type React from "react"
import { useState } from "react"
import { FooterNav } from "./footer-nav"
import { SideMenu } from "./side-menu"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-1 pb-20">{children}</main>

      <FooterNav onMenuClick={() => setIsMenuOpen(true)} />
    </>
  )
}
