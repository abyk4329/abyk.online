import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("pending_purchases")
    .select("code")
    .eq("token", token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ code: data.code })
}
