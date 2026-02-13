"use client"

import { AppShell } from "@/components/layout/app-shell"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { PencilCard } from "@/components/ui/pencil-card"

const WHATSAPP_LINK = "https://wa.me/message/PUSKMULYLLD7F1"

export default function ConsultationPage() {
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

          {/* Title & Price */}
          <div className="text-center space-y-1">
            <h1 className="tracking-wide text-3xl font-light overline text-primary">
              {"ייעוץ אישי בזום"}
            </h1>
            <p className="text-xl text-muted-foreground font-semibold">
              {"369 \u20AA לשעה"}
            </p>
            <p className="text-muted-foreground text-base">
              {"(ניתן לקבוע מפגש של שעה או שעתיים ברצף)"}
            </p>
          </div>

          {/* Main Description */}
          <PencilCard className="text-right">
            <p className="text-lg text-foreground/80 leading-loose tracking-tight">
              {"מפגש הייעוץ האישי בזום נועד להעניק לך מרחב "}
              <span className="font-semibold text-foreground">{"בטוח, דיסקרטי ומכיל"}</span>
              {" \u2013 הפתוח לנשים וגברים כאחד."}
            </p>
            <p className="text-lg text-foreground/80 leading-loose mt-3 tracking-tight">
              {"זהו מרחב המוקדש כולו עבורך: להקשבה "}
              <span className="font-semibold text-foreground">{"עמוקה, אותנטית וללא שיפוט"}</span>
              {", שבו תוכל/י לשתף ולהביא כל דבר שמעסיק אותך \u2013 ללא צורך להעמיד פנים או לעמוד בציפיות."}
            </p>
          </PencilCard>

          {/* What you can do */}
          <PencilCard className="text-right">
            <h2 className="mb-3 text-primary font-semibold text-xl">
              {"במהלך הפגישה תוכל/י:"}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                <span className="text-foreground/80 leading-loose text-lg tracking-tight">
                  {"לשתף בחוויות אישיות, רגשות עמוקים, דילמות או תחושת תקיעות \u2013 בזוגיות, משפחה, קריירה, התפתחות אישית ועוד"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                <span className="text-foreground/80 leading-loose text-lg tracking-tight">
                  {"לקבל "}
                  <span className="font-semibold text-foreground">{"הקשבה מלאה ואמפתית"}</span>
                  {" \u2013 ללא ביקורת"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                <span className="text-foreground/80 leading-loose tracking-tight text-lg">
                  {"לזכות ב"}
                  <span className="font-semibold text-foreground">{"פרספקטיבה רעננה"}</span>
                  {", תובנות עמוקות וכלים פרקטיים לצמיחה"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                <span className="text-foreground/80 leading-loose text-lg tracking-tight">
                  {"לגלות דרכי התבוננות חדשות על עצמך והמציאות שלך"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0 font-bold">{">"}</span>
                <span className="text-foreground/80 leading-loose text-lg tracking-tight">
                  {"לחוות "}
                  <span className="font-semibold text-foreground">{"הקלה, חיבור פנימי"}</span>
                  {" ותחושת תמיכה אמיתית"}
                </span>
              </li>
            </ul>
          </PencilCard>

          {/* Personal note */}
          <PencilCard className="text-right">
            <p className="text-foreground/80 leading-loose text-lg tracking-tight">
              {"אני מלווה אותך בנוכחות מלאה, רגישות גבוהה, ושימוש בכלים מקצועיים וניסיון החיים העשיר שלי."}
            </p>
            <p className="leading-loose mt-2 text-primary font-medium text-xl tracking-tight">
              {"המטרה שלי היא לאפשר לך להרגיש בטוח/ה להיות מי שאת/ה."}
            </p>
          </PencilCard>

          {/* Continuation */}
          <PencilCard className="text-right">
            <p className="text-foreground/80 leading-loose text-lg tracking-tight">
              {"אין כל התחייבות להמשך תהליך מעבר לפגישה זו."}
            </p>
            <p className="text-foreground/80 leading-loose mt-1 text-lg tracking-tight">
              {"אם תרצה/י \u2013 ניתן לקבוע פגישה נוספת במחיר זהה, או להמשיך ל"}
              <span className="font-semibold text-foreground">{"ליווי מותאם אישית"}</span>
              {"."}
            </p>
          </PencilCard>

          {/* Advanced Tools */}
          <PencilCard className="text-right">
            <h2 className="text-lg mb-3 text-primary font-semibold">
              {"אפשרויות להרחבה \u2013 כלים מתקדמים:"}
            </h2>
            <p className="text-foreground/70 mb-3 text-lg tracking-tight">
              {"אם יתברר רצון או צורך \u2013 תישלח הצעת מחיר מותאמת לאחר הפגישה."}
            </p>
            <div className="space-y-2">
              <p className="text-foreground/80 leading-relaxed text-lg tracking-tight">
                <span className="font-semibold">{"אסטרולוגיה"}</span>{" | "}
                <span className="font-semibold">{"נומרולוגיה"}</span>{" | "}
                <span className="font-semibold">{"Human Design"}</span>{" | "}
                <span className="font-semibold">{"פנג שואי"}</span>{" | "}
                <span className="font-semibold">{"קבלה"}</span>
              </p>
              <p className="text-foreground/80 leading-relaxed text-lg tracking-tight">
                <span className="font-semibold">{"קלפי טארוט"}</span>
                {" \u2013 מסרים, הכוונה ותובנות אינטואיטיביות"}
              </p>
              <p className="text-foreground/80 leading-relaxed text-lg tracking-tight">
                <span className="font-semibold">{"נוירוגרפיקה"}</span>
                {" \u2013 עבודה רגשית בציור אינטואיטיבי מודרך"}
              </p>
            </div>
          </PencilCard>

          {/* Hours */}
          <PencilCard className="text-right">
            <div className="space-y-1.5">
              <p className="text-foreground/80 text-xl">
                {"תיאומים: "}
                <span className="font-semibold text-foreground">{"08:00\u201316:00"}</span>
              </p>
              <p className="text-foreground/80 text-xl">
                {"פגישות: "}
                <span className="font-semibold text-foreground">{"10:00\u201319:00"}</span>
              </p>
            </div>
          </PencilCard>

          {/* Payment & Cancellation */}
          <PencilCard className="text-right">
            <h2 className="mb-2 text-primary text-xl font-semibold">
              {"תיאום ותשלום"}
            </h2>
            <p className="text-foreground/80 leading-loose text-lg tracking-tight">
              {"המפגש מאושר לאחר ביצוע "}
              <span className="font-semibold text-foreground">{"תשלום מראש בלבד"}</span>
              {"."}
            </p>
            <p className="text-foreground/80 leading-loose text-lg tracking-tight">
              {"לא ניתן לשריין מועד ללא תשלום."}
            </p>
            <h2 className="mt-4 mb-2 text-primary font-semibold text-xl">
              {"שינוי או ביטול פגישה"}
            </h2>
            <p className="text-foreground/80 leading-loose text-lg tracking-tight">
              {"ניתן לשנות/לבטל עד "}
              <span className="font-semibold text-foreground">{"24 שעות"}</span>
              {" מראש ללא חיוב."}
            </p>
            <p className="text-foreground/80 leading-loose text-lg tracking-tight">
              {"ביטול בפחות מ-24 שעות \u2013 "}
              <span className="font-semibold text-foreground">{"ללא החזר כספי"}</span>
              {"."}
            </p>
          </PencilCard>

          {/* WhatsApp CTA */}
          <div className="pt-1">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-card border border-primary/30 hover:border-primary/60 text-foreground font-medium text-base transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-xl text-primary">{"זימון ייעוץ אישי"}</span>
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
