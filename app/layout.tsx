import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lightyear Recruitment - Warehouse & Logistics Jobs in Berkshire',
  description: 'Find your next warehouse or logistics role with Lightyear Recruitment. Family-run agency specializing in connecting skilled professionals with dynamic career opportunities.',
  keywords: 'warehouse jobs, logistics jobs, recruitment, Berkshire, Newbury, Reading, Basingstoke',
  openGraph: {
    title: 'Lightyear Recruitment',
    description: 'Connecting skilled professionals with dynamic career opportunities',
    url: 'https://www.lightyear-recruitment.com',
    siteName: 'Lightyear Recruitment',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}