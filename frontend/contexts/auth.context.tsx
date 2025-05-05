"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { mockAuthService } from "../services/mock-auth.service"
import type { Session } from "@/types"

interface AuthContextType {
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize session from localStorage on mount
  useEffect(() => {
    try {
      const storedSession = mockAuthService.getSession()
      setSession(storedSession)
    } catch (error) {
      console.error("Failed to initialize session:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle redirects based on auth state
  useEffect(() => {
    if (!loading) {
      // If not logged in and trying to access protected route
      if (!session && !pathname.startsWith("/auth/")) {
        router.push("/auth/login")
      }

      // If logged in and trying to access auth routes
      if (session && pathname.startsWith("/auth/")) {
        router.push("/")
      }
    }
  }, [session, loading, pathname, router])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const newSession = await mockAuthService.login({ email, password })
      setSession(newSession)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      await mockAuthService.register({ name, email, password })
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await mockAuthService.logout()
      setSession(null)
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  const value = {
    session,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
