"use client"

import type React from "react"

import { useAuth } from "@/frontend/contexts/auth.context"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const pathname = usePathname()

  // Don't show the dashboard layout for auth pages
  if (pathname.startsWith("/auth/")) {
    return <>{children}</>
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-[#FF0084] border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  // If not authenticated, the AuthProvider will redirect to login
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Show the dashboard layout for authenticated users
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile navigation - visible only on mobile */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b p-4">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Konga Careers Dashboard</h1>
          <UserNav />
        </header>
        <main className="p-3 md:p-6 bg-gray-100 min-h-[calc(100vh-65px)]">{children}</main>
      </div>
    </div>
  )
}
