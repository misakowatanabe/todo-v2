import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FirebaseContextProvider } from './appContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Test',
}

type RootLayoutProps = { children: React.ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseContextProvider>{children}</FirebaseContextProvider>
      </body>
    </html>
  )
}
