import type { Metadata } from "next"
import { Playfair_Display, Lato } from 'next/font/google'
import "./globals.css"
import Providers from "./providers"

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair-display',
  display: 'swap',
})

const lato = Lato({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "DineIn Food E-commerce",
  description: "A user-friendly food e-commerce platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfairDisplay.variable} ${lato.variable} font-sans`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

