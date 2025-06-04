'use client'
import { useOrg } from '@components/Contexts/OrgContext'
import { signOut } from 'next-auth/react'
import ToolTip from '@components/Objects/StyledElements/Tooltip/Tooltip'
import LearnHouseDashboardLogo from '@public/dashLogo.png'
import { Backpack, BookCopy, Home, LogOut, Package2, School, Settings, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import UserAvatar from '../../Objects/UserAvatar'
import AdminAuthorization from '@components/Security/AdminAuthorization'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { getUriWithOrg, getUriWithoutOrg } from '@services/config/config'

function DashLeftMenu() {
  const org = useOrg() as any
  const session = useLHSession() as any
  const [loading, setLoading] = React.useState(true)

  function waitForEverythingToLoad() {
    if (org && session) {
      return true
    }
    return false
  }

  async function logOutUI() {
    const res = await signOut({ redirect: true, callbackUrl: getUriWithoutOrg('/home') })
    if (res) {
      getUriWithOrg(org.slug, '/')
    }
  }

  useEffect(() => {
    if (waitForEverythingToLoad()) {
      setLoading(false)
    }
  }, [loading])

  return (
    <div
      style={{
        background:
          'linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), radial-gradient(271.56% 105.16% at 50% -5.16%, rgba(255, 255, 255, 0.18) 0%, rgba(0, 0, 0, 0) 100%), rgb(20 19 19)',
      }}
      className="flex flex-col w-[90px] bg-black text-white shadow-xl h-screen sticky top-0"
    >
      <div className="flex flex-col h-full">
        <div className="flex h-20 mt-6">
          <Link
            className="flex flex-col items-center mx-auto space-y-3"
            href={'/'}
          >
            <ToolTip
              content={'Back to Home'}
              slateBlack
              sideOffset={8}
              side="right"
            >
              <Image
                alt="Learnhouse logo"
                width={40}
                src={LearnHouseDashboardLogo}
              />
            </ToolTip>
            <ToolTip
              content={'Your Organization'}
              slateBlack
              sideOffset={8}
              side="right"
            >
              <div className="py-1 px-3 bg-black/40 opacity-40 rounded-md text-[10px] justify-center text-center">
                {org?.name}
              </div>
            </ToolTip>
          </Link>
        </div>
        <div className="flex grow flex-col justify-center space-y-5 items-center mx-auto">
          <AdminAuthorization authorizationMode="component">
            <ToolTip content={'Home'} slateBlack sideOffset={8} side="right">
              <Link
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all ease-linear"
                href={`/dash`}
              >
                <Home size={18} />
              </Link>
            </ToolTip>
            <ToolTip content={'Courses'} slateBlack sideOffset={8} side="right">
              <Link
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all ease-linear"
                href={`/dash/courses`}
              >
                <BookCopy size={18} />
              </Link>
            </ToolTip>
            <ToolTip content={'Assignments'} slateBlack sideOffset={8} side="right">
              <Link
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all ease-linear"
                href={`/dash/assignments`}
              >
                <Package2 size={18} />
              </Link>
            </ToolTip>
            <ToolTip content={'Users'} slateBlack sideOffset={8} side="right">
              <Link
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all ease-linear"
                href={`/dash/users/settings/users`}
              >
                <Users size={18} />
              </Link>
            </ToolTip>
            <ToolTip content={'Settings'} slateBlack sideOffset={8} side="right">
              <Link
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all ease-linear"
                href={`/dash/user-account/settings/general`}
              >
                <Settings size={18} />
              </Link>
            </ToolTip>
          </AdminAuthorization>
          <ToolTip
            content={'User Account'}
            slateBlack
            sideOffset={8}
            side="right"
          >
            <Link
              className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all ease-linear"
              href={`/dash/user-account/settings/general`}
            >
              <UserAvatar username={session?.data?.user?.username} width={18} />
            </Link>
          </ToolTip>
          <ToolTip content={'Logout'} slateBlack sideOffset={8} side="right">
            <div
              onClick={logOutUI}
              className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all ease-linear hover:cursor-pointer"
            >
              <LogOut size={18} />
            </div>
          </ToolTip>
        </div>
      </div>
    </div>
  )
}

export default DashLeftMenu
