import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { securityManager } from './utils/security'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000'),
  title: 'Monad Profile Card',
  description: 'Create and customize your unique Monad profile card with holographic effects',
  icons: {
    icon: '/monad_logo.ico',
    shortcut: '/monad_logo.ico',
    apple: '/monad_logo.ico',
  },
  openGraph: {
    title: 'Monad Profile Card',
    description: 'Create and customize your unique Monad profile card with holographic effects',
    images: [
      {
        url: '/preview.ico',
        width: 1200,
        height: 630,
        alt: 'Monad Profile Card - Access Restricted Interface',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monad Profile Card',
    description: 'Create and customize your unique Monad profile card with holographic effects',
    images: ['/preview.ico'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize security manager
  if (typeof window !== 'undefined') {
    securityManager;
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
