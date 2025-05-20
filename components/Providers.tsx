// apps/web/components/Providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { motion } from 'framer-motion'
import LHSessionProvider from '@components/Contexts/LHSessionContext'
import StyledComponentsRegistry from '../components/Utils/libs/styled-registry'

const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  )
}