import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppContextProvider } from './appContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'This todo app is created to try out Next.js features.',
  icons: {
    icon: 'favicon.ico',
  },
}

type RootLayoutProps = { children: React.ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  )
}
