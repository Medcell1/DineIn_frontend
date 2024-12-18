'use client'

import { ThemeSwitcher } from './theme-switcher'
import { Input } from "@/components/ui/input"

interface HeaderProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSearchDisabled: boolean
}

export function Header({ searchTerm, onSearchChange, isSearchDisabled }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to DineIn</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Input
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full sm:w-64"
              disabled={isSearchDisabled}
            />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}

