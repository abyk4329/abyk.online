"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Calendar, RotateCcw, ChevronLeft, ChevronRight, X, Compass } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { PencilCard } from "@/components/ui/pencil-card"
import type { Gender } from "@/lib/feng-shui-data"

const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
]

const HEBREW_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"]

function formatHebrewDate(date: Date): string {
  const day = date.getDate()
  const month = HEBREW_MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ב${month} ${year}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export default function FengShuiCalculatorPage() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [isCalculating, setIsCalculating] = useState(false)

  const handleDateSelect = (day: number) => {
    const newDate = new Date(calendarYear, calendarMonth, day)
    setSelectedDate(newDate)
    setIsCalendarOpen(false)
  }

  const handleCalculate = () => {
    if (!selectedDate || !gender) return

    setIsCalculating(true)
    const birthDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

    setTimeout(() => {
      router.push(`/tools/feng-shui/result?birthDate=${birthDate}&gender=${gender}`)
    }, 800)
  }

  const handleClear = () => {
    setSelectedDate(null)
    setGender(null)
  }

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(calendarYear - 1)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(calendarYear + 1)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth)
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth)
  const today = new Date()

  return (
    <AppShell>
      <div className="flex flex-col items-center px-4 pt-4 pb-28">
        <div className="w-full max-w-md mx-auto text-center space-y-4">
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

          {/* Title */}
          <div className="space-y-1">
            <h1 className="font-light text-primary tracking-wide text-3xl">
              {"מצפן פנג שואי"}
            </h1>
            <p className="text-muted-foreground text-base">
              {"גלו את הכיוונים המומלצים שלכם"}
            </p>
          </div>

          {/* Calculator Card */}
          <PencilCard>
            <div className="space-y-5">
              {/* Gender selector */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-right">{"מין"}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`flex-1 h-12 rounded-xl border text-lg transition-all duration-200 ${
                      gender === "female"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-transparent text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {"נקבה"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`flex-1 h-12 rounded-xl border text-lg transition-all duration-200 ${
                      gender === "male"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-transparent text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {"זכר"}
                  </button>
                </div>
              </div>

              {/* Date picker button */}
              <Button
                variant="outline"
                className="w-full h-14 rounded-xl gap-3 text-base bg-transparent hover:bg-muted/50 transition-all duration-200"
                onClick={() => setIsCalendarOpen(true)}
              >
                <Calendar className="h-5 w-5" strokeWidth={1} />
                <span className="font-normal text-lg text-muted-foreground">{"בחרו תאריך לידה"}</span>
              </Button>

              {/* Selected date display */}
              {selectedDate && (
                <div className="py-3 text-3xl text-primary tracking-normal font-light text-center">
                  {formatHebrewDate(selectedDate)}
                </div>
              )}

              {/* Calculate button */}
              <Button
                className="w-full h-14 rounded-xl gap-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                onClick={handleCalculate}
                disabled={!selectedDate || !gender || isCalculating}
              >
                {isCalculating ? (
                  <>
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>{"מחשב..."}</span>
                  </>
                ) : (
                  <>
                    <Compass className="h-5 w-5" strokeWidth={1} />
                    <span className="font-normal text-xl text-background">{"גלו את מספר הקואה"}</span>
                  </>
                )}
              </Button>

              {/* Clear button */}
              {(selectedDate || gender) && (
                <Button
                  variant="ghost"
                  className="w-full h-12 rounded-xl gap-2 text-muted-foreground hover:text-foreground transition-all duration-200"
                  onClick={handleClear}
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1} />
                  <span className="text-xl">{"נקה"}</span>
                </Button>
              )}
            </div>
          </PencilCard>
        </div>

        {/* Calendar Popup */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsCalendarOpen(false)}
              onKeyDown={() => {}}
              role="presentation"
            />

            <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsCalendarOpen(false)}
                >
                  <X className="h-4 w-4" strokeWidth={1} />
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" strokeWidth={1} />
                  </Button>

                  <select
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(Number(e.target.value))}
                    className="bg-transparent text-sm font-medium text-foreground border border-border/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {HEBREW_MONTHS.map((month, index) => (
                      <option key={month} value={index} className="bg-card text-foreground">
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={calendarYear}
                    onChange={(e) => setCalendarYear(Number(e.target.value))}
                    className="bg-transparent text-sm font-medium text-foreground border border-border/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year} className="bg-card text-foreground">
                        {year}
                      </option>
                    ))}
                  </select>

                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" strokeWidth={1} />
                  </Button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 px-4 py-2 border-b border-border/50">
                {HEBREW_DAYS.map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 p-4">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const isToday =
                    day === today.getDate() &&
                    calendarMonth === today.getMonth() &&
                    calendarYear === today.getFullYear()
                  const isSelected =
                    selectedDate &&
                    day === selectedDate.getDate() &&
                    calendarMonth === selectedDate.getMonth() &&
                    calendarYear === selectedDate.getFullYear()

                  return (
                    <button
                      key={day}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-sm
                        transition-all duration-200 hover:bg-muted
                        ${isToday ? "ring-1 ring-primary" : ""}
                        ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                      `}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
