import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Inter } from 'next/font/google'
import "./globals.css"
import { GlobalAudio } from "@/components/global-audio"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NEXUS - Puzzle Game",
  description: "A 2D puzzle strategy game",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <GlobalAudio />
        {children}
      </body>
    </html>
  )
}
