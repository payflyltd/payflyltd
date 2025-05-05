import type { LoginCredentials, SignupData, Session, User } from "@/types"

// Mock user database
const MOCK_USERS = [
  {
    id: 1,
    email: "admin@konga.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
]

class MockAuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<Session> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check credentials
    const user = MOCK_USERS.find((u) => u.email === credentials.email)

    if (!user || credentials.password !== "password123") {
      throw new Error("Invalid email or password")
    }

    // Store user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }

    return {
      user,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    }
  }

  // Register new user
  async register(userData: SignupData): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === userData.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create new user (in a real app, this would be saved to a database)
    const newUser = {
      id: MOCK_USERS.length + 1,
      email: userData.email,
      name: userData.name,
      role: "hr" as const,
      createdAt: new Date().toISOString(),
    }

    // Add to mock database
    MOCK_USERS.push(newUser)

    // Note: In a real app, we would save this to a database
    console.log("Registered new user:", newUser)
  }

  // Logout user
  async logout(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Clear user from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  }

  // Get current session
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

  // Get current user
  getUser(): Omit<User, "password"> | null {
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

export const mockAuthService = new MockAuthService()
