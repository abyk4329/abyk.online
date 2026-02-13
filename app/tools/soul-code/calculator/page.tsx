"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Calendar, RotateCcw, Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { PencilCard } from "@/components/ui/pencil-card"

const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
]

const HEBREW_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"]

function calculateWealthCode(date: Date): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  
  // Sum all digits
  const sumDigits = (num: number): number => {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  }
  
  // Reduce to single digit
  const reduceNumber = (num: number): number => {
    while (num > 9) {
      num = sumDigits(num)
    }
    return num
  }
  
  const dayNum = reduceNumber(day)
  const monthNum = reduceNumber(month)
  const yearNum = reduceNumber(sumDigits(year))
  const totalNum = reduceNumber(day + month + sumDigits(year))
  
  return `${dayNum}${monthNum}${yearNum}${totalNum}`
}

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

export default function CalculatorPage() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
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
    if (!selectedDate) return
    
    setIsCalculating(true)
    const code = calculateWealthCode(selectedDate)
    
    // Save to sessionStorage
    sessionStorage.setItem('abyk:last-code', code)
    
    setTimeout(() => {
      router.push(`/tools/soul-code/result?code=${code}`)
    }, 800)
  }

  const handleClear = () => {
    setSelectedDate(null)
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
          {/* לוגו */}
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

          {/* כותרת */}
          <h1 className="font-light text-primary overline tracking-wide text-3xl">
            מחשבון קוד האושר
          </h1>

          {/* כרטיס המחשבון */}
          <PencilCard>
            <div className="space-y-5">
            {/* כפתור בחירת תאריך */}
            <Button
              variant="outline"
              className="w-full h-14 rounded-xl gap-3 text-base bg-transparent hover:bg-muted/50 transition-all duration-200"
              onClick={() => setIsCalendarOpen(true)}
            >
              <Calendar className="h-5 w-5" strokeWidth={1} />
              <span className="font-normal text-lg text-muted-foreground">בחר/י תאריך לידה</span>
            </Button>

            {/* תאריך נבחר */}
            {selectedDate && (
              <div className="py-3 text-3xl text-primary tracking-normal font-light text-center">
                {formatHebrewDate(selectedDate)}
              </div>
            )}

            {/* כפתור חישוב */}
            <Button
              className="w-full h-14 rounded-xl gap-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
              onClick={handleCalculate}
              disabled={!selectedDate || isCalculating}
            >
              {isCalculating ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>מחשב...</span>
                </>
              ) : (
                <>
                  
                  <span className="font-normal text-xl text-background">חישוב קוד האושר</span>
                </>
              )}
            </Button>

            {/* כפתור נקה */}
            {selectedDate && (
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl gap-2 text-muted-foreground hover:text-foreground transition-all duration-200"
                onClick={handleClear}
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1} />
                <span className="text-xl">נקה</span>
              </Button>
            )}
          </div>
          </PencilCard>
        </div>

        {/* יומן עברי - Popup */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsCalendarOpen(false)}
              onKeyDown={() => {}}
              role="presentation"
            />
            
            {/* Calendar Card */}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={nextMonth}
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1} />
                  </Button>
                  
                  {/* Month Select */}
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
                  
                  {/* Year Select */}
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
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={prevMonth}
                  >
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
                {/* Empty cells for days before first day of month */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* Days */}
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
                        ${isToday ? 'ring-1 ring-primary' : ''}
                        ${isSelected ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
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
