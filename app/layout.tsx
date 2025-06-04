'use client'

import { SessionProvider } from 'next-auth/react'
import StyledComponentsRegistry from '../components/Utils/libs/styled-registry'
import { motion } from 'framer-motion'
import LHSessionProvider from '@components/Contexts/LHSessionContext'
import { isDevEnv } from './auth/options'
import Script from 'next/script'
import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    enter: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      filter: 'blur(10px)',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
  }

  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="theme-color" content="#0f0f23" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="dark min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased overflow-x-hidden">
        <div className="fixed inset-0 modern-dots-bg opacity-30 pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
        
        {isDevEnv ? '' : <Script data-website-id="a1af6d7a-9286-4a1f-8385-ddad2a29fcbb" src="/umami/script.js" />}
        <SessionProvider>
          <LHSessionProvider>
            <StyledComponentsRegistry>
              <motion.main
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                className="relative z-10"
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