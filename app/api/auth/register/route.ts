import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/backend/services/user.service"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      return NextResponse.json({ error: "Email, password, and name are required", success: false }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({ error: "Invalid email format", success: false }, { status: 400 })
    }

    // Validate password strength
    if (userData.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long", success: false },
        { status: 400 },
      )
    }

    try {
      // Create new user
      const newUser = await createUser({
        ...userData,
        role: "hr", // Default role for new users
      })

      return NextResponse.json({ data: newUser, success: true }, { status: 201 })
    } catch (error: any) {
      return NextResponse.json({ error: error.message, success: false }, { status: 400 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed", success: false }, { status: 500 })
  }
}
