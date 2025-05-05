"use client"

import { useState, useEffect } from "react"
import { FileText, LayoutDashboard, Settings, Users, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/frontend/contexts/auth.context"

export default function Sidebar() {
  const pathname = usePathname()
  const { session } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  // Check for saved sidebar state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed))
  }, [collapsed])

  // Don't render sidebar if not authenticated
  if (!session) {
    return null
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Post Jobs",
      href: "/post-jobs",
      icon: FileText,
    },
    {
      name: "Manage Jobs",
      href: "/manage-jobs",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div
      className={`border-r bg-white flex flex-col transition-all duration-300 ease-in-out relative ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle button */}
      <button
        className="absolute -right-5 top-20 bg-white border rounded-sm p-1 shadow-md z-10 hover:bg-gray-50"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-6 w-6 text-gray-600" />
        ) : (
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        )}
      </button>

      <div className={`p-4 py-4 border-b flex ${collapsed ? "justify-center" : ""}`}>
        <Link href="/">
          {collapsed ? (
            <div className="w-10 h-10 rounded-full bg-[#FF0084] flex items-center justify-center text-white font-bold">
              K
            </div>
          ) : (
            <Image
              src="https://www-konga-com-res.cloudinary.com/image/upload/w_400,f_auto,fl_lossy,dpr_3.0,q_auto/assets/images/content/logo-alternate.png"
              alt="Konga Logo"
              width={140}
              height={40}
              className="h-10"
            />
          )}
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-md transition-colors font-medium ${
                    isActive ? "bg-[#FF0084] text-white" : "text-gray-500 hover:bg-gray-100"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.name : ""}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
