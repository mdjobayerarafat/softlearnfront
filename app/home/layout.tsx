'use client';
import { OrgProvider } from '@components/Contexts/OrgContext'
import NextTopLoader from 'nextjs-toploader';
import Toast from '@components/Objects/StyledElements/Toast/Toast'
import '@styles/globals.css'
import { getDefaultOrg } from '@services/config/config'
import { SessionProvider } from 'next-auth/react'
import Watermark from '@components/Objects/Watermark'
import { OrgMenu } from '@components/Objects/Menus/OrgMenu'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultOrg = getDefaultOrg() as string

  return (
    <div className="min-h-screen flex flex-col">
      <OrgProvider orgslug={defaultOrg}>
        <SessionProvider>
          <NextTopLoader color="#2e2e2e" initialPosition={0.3} height={4} easing={'ease'} speed={500} showSpinner={false} />
          <Toast />
          <OrgMenu orgslug={defaultOrg} />
          <div className="flex-1 pt-[60px]">{/* Add padding-top to account for fixed header */}
            {children}
          </div>
          <Watermark />
        </SessionProvider>
      </OrgProvider>
    </div>
  )
}
