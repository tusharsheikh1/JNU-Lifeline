import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jnu Bloodline',
  description: 'Find blood donors fast',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Do not mark this file with 'use client'
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <header className="py-6 flex items-center justify-between">
            <a href="/" className="text-2xl font-semibold">Jnu Bloodline</a>
            <nav className="flex gap-6 text-sm">
              <a href="/donors" className="hover:underline">Donors</a>
              <a href="/locations" className="hover:underline">Locations</a>
              <a href="/register" className="hover:underline">Register</a>
            </nav>
          </header>
          <main className="pb-12">{children}</main>
          <footer className="py-8 text-sm text-gray-500">© {new Date().getFullYear()} Jnu Bloodline</footer>
        </div>
      </body>
    </html>
  )
}
