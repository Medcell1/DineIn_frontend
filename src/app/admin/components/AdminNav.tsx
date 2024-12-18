"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/dashboard/menu", label: "Menu" },
  { href: "/admin/dashboard/hours", label: "Work Hours" },
  { href: "/admin/dashboard/profile", label: "Profile" },
]

export function AdminNav({image, name}: {image: string; name: string;}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="w-full">
      <div className="lg:hidden flex justify-between items-center px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="p-2">
              <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex items-center mt-4 mb-6">
              <Avatar>
                <AvatarImage src={image} alt="user-image" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="ml-2 font-semibold">{name}</span>
            </div>
            <nav className="flex flex-col space-y-4">
              <AnimatePresence>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block p-2 rounded-lg transition-colors ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </nav>
            <div className="mt-4 space-y-4">
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="w-full justify-start"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Switch to Dark Mode
                  </>
                )}
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Avatar className="h-9 w-9">
          <AvatarImage src={image} alt="user-image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex w-full bg-background items-center px-4">
        <Tabs value={pathname} className="flex-grow">
          <TabsList className="w-full justify-start h-auto">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.href}
                value={item.href}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                asChild
              >
                <Link href={item.href}>{item.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center space-x-4 ml-4">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-800 dark:text-white"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
            className="h-9"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src={image} alt="user-image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

