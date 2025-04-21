import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Raytracing Visualization',
  description: 'Interactive 3D raytracing visualization with React Three Fiber',
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
