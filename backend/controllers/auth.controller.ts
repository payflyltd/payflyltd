import { type NextRequest, NextResponse } from "next/server"
import { createUser, verifyCredentials } from "../services/user.service"
import * as jwt from "jsonwebtoken"
import type { ApiResponse, LoginCredentials, SignupData, User } from "@/types"
import { getUserById } from "../services/user.service"

// Make sure we have a valid JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development-only"
const TOKEN_EXPIRY = "7d" // 7 days

// Login user
export const loginUser = async (
  request: NextRequest,
): Promise<NextResponse<ApiResponse<{ token: string; user: Omit<User, "password"> }>>> => {
  try {
    const credentials: LoginCredentials = await request.json()

    // Validate required fields
    if (!credentials.email || !credentials.password) {
      return NextResponse.json({ error: "Email and password are required", success: false }, { status: 400 })
    }

    // Verify credentials
    const user = await verifyCredentials(credentials.email, credentials.password)
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

// Register new user
export const registerUser = async (
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Omit<User, "password">>>> => {
  try {
    const userData: SignupData = await request.json()

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

// Logout user
export const logoutUser = async (): Promise<NextResponse<ApiResponse<null>>> => {
  const response = NextResponse.json({ success: true }, { status: 200 })

  // Clear the auth cookie
  response.cookies.delete("auth-token")

  return response
}

// Get current user
export const getCurrentUser = async (
  request: NextRequest,
): Promise<NextResponse<ApiResponse<{ user: Omit<User, "password"> } | null>>> => {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ data: null, success: true }, { status: 200 })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string }

      // Get user from database
      const user = getUserById(decoded.id)

      if (!user) {
        return NextResponse.json({ data: null, success: true }, { status: 200 })
      }

      return NextResponse.json({ data: { user }, success: true }, { status: 200 })
    } catch (error) {
      // Token is invalid
      console.error("Invalid token:", error)
      const response = NextResponse.json({ data: null, success: true }, { status: 200 })

      // Clear the invalid token
      response.cookies.delete("auth-token")

      return response
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json({ error: "Failed to get current user", success: false }, { status: 500 })
  }
}
