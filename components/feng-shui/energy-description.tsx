import { type EnergySegment } from "@/lib/feng-shui-data"
import { Sparkles, AlertTriangle, Heart, Lightbulb } from "lucide-react"

const SEGMENT_ICONS: Record<string, React.ReactNode> = {
  "יסוד ואנרגיה": <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />,
  "חוזקות": <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />,
  "אתגרים": <AlertTriangle className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />,
  "בריאות": <Heart className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />,
  "המלצה": <Lightbulb className="h-4 w-4 text-primary" strokeWidth={1.5} />,
}

function highlightBold(text: string, boldPhrases: string[]) {
  if (!boldPhrases.length) return text

  // Sort by length descending so longer phrases are matched first
  const sorted = [...boldPhrases].sort((a, b) => b.length - a.length)
  const escaped = sorted.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const regex = new RegExp(`(${escaped.join("|")})`, "g")

  const parts = text.split(regex)

  return parts.map((part, i) => {
    if (boldPhrases.includes(part)) {
      return (
        <span key={i} className="font-semibold text-foreground">
          {part}
        </span>
      )
    }
    return part
  })
}

export function EnergyDescription({ segments }: { segments: EnergySegment[] }) {
  return (
    <div className="space-y-4 text-right" dir="rtl">
      {segments.map((segment, index) => (
        <div key={index} className="space-y-1.5">
          {/* Label with icon */}
          <div className="flex items-center gap-2">
            {SEGMENT_ICONS[segment.label] ?? (
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
            )}
            <span className="text-sm font-medium text-primary tracking-wide">
              {segment.label}
            </span>
          </div>

          {/* Text content */}
          <p className="text-foreground/75 leading-loose text-lg tracking-tight pe-6">
            {highlightBold(segment.text, segment.bold)}
          </p>

          {/* Subtle separator between sections (not after last) */}
          {index < segments.length - 1 && (
            <div className="pt-2">
              <div className="h-px bg-border/30 mx-6" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
