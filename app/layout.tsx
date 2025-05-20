'use client'

import { SessionProvider } from 'next-auth/react'
import StyledComponentsRegistry from '../components/Utils/libs/styled-registry'
import { motion } from 'framer-motion'
import LHSessionProvider from '@components/Contexts/LHSessionContext'
import { isDevEnv } from './auth/options'
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const variants = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  }

  return (
    <html lang="en">
      <head />
      <body>
        {isDevEnv ? '' : <Script data-website-id="a1af6d7a-9286-4a1f-8385-ddad2a29fcbb" src="/umami/script.js" />}
        <SessionProvider>
          <LHSessionProvider>
            <StyledComponentsRegistry>
              <motion.main
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ type: 'linear' }}
              >
                {children}
              </motion.main>
            </StyledComponentsRegistry>
          </LHSessionProvider>
        </SessionProvider>
      </body>
    </html>
  )
}