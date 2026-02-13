import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  const { code } = await request.json()

  if (!code || code.length !== 4 || !/^\d{4}$/.test(code)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 })
  }

  const token = randomUUID()
  const supabase = await createClient()

  const { error } = await supabase.from("pending_purchases").insert({
    token,
    code,
  })

  if (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }

  // Set the token as a cookie (survives external redirects reliably)
  const response = NextResponse.json({ token })
  response.cookies.set("purchase-token", token, {
    path: "/",
    maxAge: 86400, // 24 hours
    sameSite: "lax",
    httpOnly: false, // needs to be readable by client
  })

  return response
}
