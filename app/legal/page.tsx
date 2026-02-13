"use client"

import { AppShell } from "@/components/layout/app-shell"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { PencilCard } from "@/components/ui/pencil-card"

const sections = [
  {
    title: "אופי השירות",
    items: [
      "האתר מציע מוצרים דיגיטליים ייחודיים, לרבות פירוש אישי לקוד העושר.",
      "התכנים והשירותים באתר נועדו לספק הכוונה, השראה וכלים להתפתחות אישית ורוחנית.",
      "התכנים אינם מהווים תחליף לייעוץ רפואי, משפטי או פיננסי מוסמך.",
    ],
  },
  {
    title: "רכישה ואספקה",
    items: [
      'לאחר השלמת התשלום, תיפתח גישה מיידית להורדה, והעותק יישלח לכתובת הדוא"ל שנמסרה בעת ההזמנה.',
      "מאחר שמדובר במוצר דיגיטלי הנמסר באופן מיידי, לא ניתן לבטל את העסקה ולא יינתן החזר כספי.",
    ],
  },
  {
    title: "זכויות יוצרים",
    items: [
      "כל הזכויות בתכנים, בקבצים, בעיצוב ובמיתוג \u2013 שייכות ל-Awakening by Ksenia.",
      "השימוש בתכנים הוא אישי בלבד, אינו מסחרי ואינו ניתן להעברה או לשימוש חוזר ללא אישור מראש ובכתב מהמפעילה.",
    ],
  },
  {
    title: "אחריות מוגבלת",
    items: [
      'המוצרים נמסרים "As Is".',
      "האחריות המלאה על אופן היישום והשימוש בתכנים מוטלת על המשתמש בלבד.",
      "המפעילה לא תישא באחריות לנזקים ישירים או עקיפים שייגרמו עקב שימוש באתר או בתכנים.",
    ],
  },
  {
    title: "דין וסמכות שיפוט",
    items: [
      "תנאי שימוש אלה כפופים לדין הישראלי בלבד.",
      "במקרה של מחלוקת, הסמכות הבלעדית תהיה נתונה לבתי המשפט המוסמכים בישראל.",
    ],
  },
  {
    title: "יצירת קשר",
    items: [
      'לשאלות או פניות ניתן ליצור קשר בדוא"ל:',
      "awakening.by.ksenia@gmail.com",
    ],
  },
]

const privacySections = [
  {
    title: "זהות האחראית על המידע",
    items: [
      "המפעילה: צ\u05F3ודנובסקי קסניה אוריה.",
      'דוא"ל לפניות בנושא פרטיות: awakening.by.ksenia@gmail.com',
    ],
  },
  {
    title: "סוגי המידע הנאסף",
    items: [
      'פרטים שנמסרו על ידי המשתמש: שם, כתובת דוא"ל, פרטי הזמנה ותשלום (המעובדים על ידי ספק הסליקה החיצוני).',
      "פרטים טכניים בסיסיים: כתובת IP, סוג דפדפן ועוגיות חיוניות להפעלת האתר.",
    ],
  },
  {
    title: "מטרות השימוש במידע",
    items: [
      "אספקת המוצרים הדיגיטליים ושירות לקוחות.",
      'שליחת הפירוש או הקובץ לכתובת הדוא"ל.',
      "שיפור חוויית השימוש ואבטחת האתר.",
      "שליחת עדכונים או דיוור \u2013 רק בהסכמה מפורשת של המשתמש, עם אפשרות הסרה בכל עת.",
    ],
  },
  {
    title: "שימוש בעוגיות (Cookies)",
    items: [
      "האתר משתמש בקובצי קוקיז לצורך שיפור החוויה, איסוף מידע סטטיסטי ומטרות שיווק.",
      "השימוש בקוקיז כולל גם שימוש בפיקסל של TikTok למדידה ושיווק.",
      "המשתמש יכול לאשר או לסרב לשימוש בקוקיז דרך ההודעה שמופיעה בעת כניסה לאתר.",
      "אישור הקוקיז נשמר במכשיר וההודעה לא תופיע שוב עד שהמשתמש ימחק את נתוני הדפדפן.",
    ],
  },
  {
    title: "פיקסל TikTok",
    items: [
      "האתר עשוי להשתמש בפיקסל של TikTok למטרות מדידה ושיווק.",
      "הפיקסל אוסף נתונים אנונימיים על התנהגות משתמשים באתר לצורך שיפור מסעות פרסום.",
      "השימוש בפיקסל כפוף למדיניות הפרטיות של TikTok.",
      "ניתן לבטל את הסכמתך לשימוש בפיקסל דרך הגדרות העוגיות באתר.",
    ],
  },
  {
    title: "שיתוף מידע עם צדדים שלישיים",
    items: [
      "המידע יועבר לצדדים שלישיים רק ככל שנדרש לצורך אספקת השירות (כגון: ספק סליקה, שירותי דיוור ואחסון בענן).",
      "המידע עלול להימסר אם קיימת חובה חוקית או דרישה של רשות מוסמכת.",
      "המידע עשוי להימסר לצורך הגנה על זכויות משפטיות, אם יתעורר צורך בכך.",
    ],
  },
  {
    title: "אבטחת מידע",
    items: [
      "האתר עושה שימוש באמצעי אבטחה סבירים ומקובלים להגנה על המידע האישי מפני גישה בלתי מורשית, שימוש לרעה או חשיפה.",
    ],
  },
  {
    title: "תקופת שמירת מידע",
    items: [
      "המידע נשמר רק ככל שנדרש למימוש מטרות המדיניות או בהתאם לחובות שמטיל הדין החל.",
    ],
  },
  {
    title: "זכויות המשתמש/ת",
    items: [
      "למשתמש הזכות לעיין במידע שנאסף אודותיו.",
      "ניתן לבקש את תיקון המידע או מחיקתו.",
      "ניתן לבקש הסרה מרשימות הדיוור בכל עת.",
      "לפניות בנושא זכויות משתמש: awakening.by.ksenia@gmail.com",
    ],
  },
  {
    title: "עדכוני מדיניות",
    items: [
      "מסמך זה עשוי להתעדכן מעת לעת. תאריך העדכון האחרון יופיע בראש העמוד.",
    ],
  },
]

export default function LegalPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <AppShell>
      <div className="flex flex-col items-center px-4 pb-28 pt-4">
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
          <div className="text-center space-y-2">
            <h1 className="font-light tracking-wide text-3xl text-primary overline">
              {"תנאים משפטיים"}
            </h1>
            <p className="text-muted-foreground text-lg font-normal">
              {"AWAKENING BY KSENIA"}
            </p>
          </div>

          {/* Intro */}
          <PencilCard>
            <div className="space-y-3 text-right">
              <p className="text-muted-foreground text-lg">{"נכנסו לתוקף בתאריך: "}
                <span className="font-semibold">{"26.09.2025"}</span>
              </p>
              <p className="text-muted-foreground text-lg">{"תאריך עדכון אחרון: "}
                <span className="font-semibold">{"30.10.2025"}</span>
              </p>
              <p className="text-foreground/80 leading-loose text-lg tracking-tight">
                {'האתר Awakening by Ksenia ("האתר") מופעל על ידי צ\u05F3ודנובסקי קסניה אוריה ("המפעילה"). שימוש באתר, לרבות רכישת מוצרים דיגיטליים, מהווה הסכמה מלאה ומפורשת לתנאי שימוש אלה.'}
              </p>
              <p className="text-lg text-foreground font-semibold">
                {"אם אין הסכמה לתנאים אלו, אין רשות להשתמש באתר."}
              </p>
            </div>
          </PencilCard>

          {/* Terms Sections */}
          <div className="space-y-3">
            {sections.map((section) => (
              <PencilCard key={section.title}>
                <div className="space-y-2.5 text-right">
                  <h3 className="text-primary text-xl font-medium text-center">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-foreground/80 leading-loose text-lg tracking-tight">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </PencilCard>
            ))}
          </div>

          {/* Privacy Policy Title */}
          <div className="text-center pt-4">
            <h2 className="tracking-wide text-primary font-light text-3xl overline">
              {"מדיניות פרטיות"}
            </h2>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-3">
            {privacySections.map((section) => (
              <PencilCard key={section.title}>
                <div className="space-y-2.5 text-right">
                  <h3 className="text-primary text-xl font-medium text-center">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-foreground/80 leading-loose text-lg tracking-tight mx-0 px-0">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </PencilCard>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
