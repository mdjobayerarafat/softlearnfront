'use client';
import { use } from "react";
import '@styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Watermark from '@components/Objects/Watermark'
import { OrgMenu } from '@components/Objects/Menus/OrgMenu'

export default function RootLayout(
  props: {
    children: React.ReactNode
    params: Promise<any>
  }
) {
  const params = use(props.params);

  const {
    children
  } = props;

  return (
    <div className="min-h-screen flex flex-col">
      <SessionProvider>
        <OrgMenu orgslug={params?.orgslug}></OrgMenu>
        <div className="flex-1 pt-[60px]">{/* Add padding-top to account for fixed header */}
          {children}
        </div>
        <Watermark />
      </SessionProvider>
    </div>
  )
}
