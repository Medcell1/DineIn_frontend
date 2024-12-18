'use client'

import { ThemeSwitcher } from './theme-switcher'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface HeaderProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSearchDisabled: boolean
}

export function Header({ searchTerm, onSearchChange, isSearchDisabled }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Welcome to DineIn</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Input
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full sm:w-64"
              disabled={isSearchDisabled}
            />
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/admin/login">Register/Login as a Vendor</Link>
              </Button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

