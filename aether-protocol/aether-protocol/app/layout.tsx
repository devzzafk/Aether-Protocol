// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aether Protocol — Universal AI Memory',
  description: 'Open-source infrastructure layer that gives AI systems persistent, portable, and interoperable memory.',
  openGraph: {
    title: 'Aether Protocol',
    description: 'Universal AI Memory Layer',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-aether-void text-aether-text font-body antialiased">
        {children}
      </body>
    </html>
  )
}
