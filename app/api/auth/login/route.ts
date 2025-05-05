import { type NextRequest, NextResponse } from "next/server"
import { verifyCredentials } from "@/backend/services/user.service"
import * as jwt from "jsonwebtoken"

// Make sure we have a valid JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development-only"
const TOKEN_EXPIRY = "7d" // 7 days

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required", success: false }, { status: 400 })
    }

    // Verify credentials
    const user = await verifyCredentials(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password", success: false }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })

    // Set HTTP-only cookie with the token
    const response = NextResponse.json({ data: { token, user }, success: true }, { status: 200 })

    // Set cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed", success: false }, { status: 500 })
  }
}
