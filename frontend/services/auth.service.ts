import type { LoginCredentials, SignupData, Session } from "@/types"

// Base API URL - replace with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

class AuthService {
  async login(credentials: LoginCredentials): Promise<Session> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()

      // Store user in localStorage for client-side access
      if (typeof window !== "undefined" && data.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user))
      }

      return {
        user: data.data.user,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async register(userData: SignupData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear user from localStorage first
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }

      // Then try to call the logout API
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
      // Already removed from localStorage, so no further action needed
    }
  }

  // Get session from localStorage (client-side only)
  getSession(): Session | null {
    if (typeof window === "undefined") {
      return null
    }

    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        return null
      }

      const user = JSON.parse(userStr)
      return {
        user,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
      return null
    }
  }

  getUser(): Session["user"] | null {
    if (typeof window === "undefined") {
      return null
    }

    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        return null
      }

      return JSON.parse(userStr)
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
      return null
    }
  }
}

export const authService = new AuthService()
