import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lightyear Recruitment | Warehouse & Logistics Jobs in Berkshire',
  description: 'Family-run recruitment agency specializing in warehouse and logistics roles across Berkshire. Find your perfect job match with our professional recruitment services.',
  keywords: 'recruitment, jobs, warehouse, logistics, Berkshire, employment agency, family-run',
  authors: [{ name: 'Lightyear Recruitment' }],
  creator: 'Lightyear Recruitment',
  publisher: 'Lightyear Recruitment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.lightyear-recruitment.com'),
  openGraph: {
    title: 'Lightyear Recruitment | Warehouse & Logistics Jobs in Berkshire',
    description: 'Family-run recruitment agency specializing in warehouse and logistics roles across Berkshire.',
    url: 'https://www.lightyear-recruitment.com',
    siteName: 'Lightyear Recruitment',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lightyear Recruitment | Warehouse & Logistics Jobs in Berkshire',
    description: 'Family-run recruitment agency specializing in warehouse and logistics roles across Berkshire.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}