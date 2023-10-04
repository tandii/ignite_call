import { TanstackProvider } from '@/components/providers/react-query'
import './global.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { NextAuthProvider } from '@/components/providers/next-auth'
import { DayjsConfig } from '@/components/providers/dayjs'


const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`${roboto.className} bg-zinc-900 text-zinc-50`}>
        <DayjsConfig>
          <TanstackProvider>
            <NextAuthProvider session={session} >
              {children}
            </NextAuthProvider>
          </TanstackProvider>
        </DayjsConfig>
      </body>
    </html>
  )
}
