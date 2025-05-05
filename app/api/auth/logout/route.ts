import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 })

    // Clear the auth cookie
    response.cookies.delete("auth-token")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed", success: false }, { status: 500 })
  }
}
