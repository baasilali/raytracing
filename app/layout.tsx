import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Raytracing',
  description: 'Created by Baasil Ali',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
