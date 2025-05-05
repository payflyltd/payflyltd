"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard, Menu, Settings, Users, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/frontend/contexts/auth.context"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session } = useAuth()

  // Don't render mobile nav if not authenticated
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
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 justify-between flex-row-reverse">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <Link href="/" onClick={() => setOpen(false)}>
                  <Image
                    src="https://www-konga-com-res.cloudinary.com/image/upload/w_400,f_auto,fl_lossy,dpr_3.0,q_auto/assets/images/content/logo-alternate.png"
                    alt="Konga Logo"
                    width={120}
                    height={30}
                    className="h-8"
                  />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-md transition-colors font-medium text-base ${
                            isActive ? "bg-[#FF0084] text-white" : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center order-1">
          <Image
            src="https://www-konga-com-res.cloudinary.com/image/upload/w_400,f_auto,fl_lossy,dpr_3.0,q_auto/assets/images/content/logo-alternate.png"
            alt="Konga Logo"
            width={120}
            height={30}
            className="h-8"
          />
        </Link>
      </div>
    </div>
  )
}
