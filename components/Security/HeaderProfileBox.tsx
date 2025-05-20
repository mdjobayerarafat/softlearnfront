'use client'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Package2, Settings } from 'lucide-react'
import UserAvatar from '@components/Objects/UserAvatar'
import useAdminStatus from '@components/Hooks/useAdminStatus'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { useOrg } from '@components/Contexts/OrgContext'
import { getUriWithoutOrg } from '@services/config/config'
import Tooltip from '@components/Objects/StyledElements/Tooltip/Tooltip'

export const HeaderProfileBox = () => {
  const session = useLHSession() as any
  const isUserAdmin = useAdminStatus()
  const org = useOrg() as any

  useEffect(() => { }
    , [session])

  return (
    <ProfileArea>
      {session.status == 'unauthenticated' && (
        <UnidentifiedArea className="flex text-sm text-gray-700 font-bold p-1.5 px-2 rounded-lg">
          <ul className="flex space-x-3 items-center">
            <li>
              <Link
                href={{ pathname: getUriWithoutOrg('/login'), query: org ? { orgslug: org.slug } : null }} >Login</Link>
            </li>
            <li className="bg-black rounded-lg shadow-md p-2 px-3 text-white">
              <Link href={{ pathname: getUriWithoutOrg('/signup'), query: org ? { orgslug: org.slug } : null }}>Sign up</Link>
            </li>
          </ul>
        </UnidentifiedArea>
      )}
      {session.status == 'authenticated' && (
        <AccountArea className="space-x-0">
          <div className="flex items-center space-x-2">
            <div className='flex items-center space-x-2' >
              <p className='text-sm capitalize'>{session.data.user.username}</p>
              {isUserAdmin.isAdmin && <div className="text-[10px] bg-rose-300 px-2 font-bold rounded-md shadow-inner py-1">ADMIN</div>}
            </div>

            <div className="flex items-center space-x-2">
              <Tooltip 
                content={"Your Owned Courses"}
                sideOffset={15}
                side="bottom"
              >
                <Link className="text-gray-600" href={'/dash/user-account/owned'}>
                  <Package2 size={14} />
                </Link>
              </Tooltip>
              <Tooltip 
                content={"Your Settings"}
                sideOffset={15}
                side="bottom"
              >
                <Link className="text-gray-600" href={'/dash'}>
                  <Settings size={14} />
                </Link>
              </Tooltip>
            </div>
            <div className="py-4">
              <UserAvatar border="border-4" rounded="rounded-lg" width={30} />
            </div>
          </div>
        </AccountArea>
      )}
    </ProfileArea>
  )
}

const AccountArea = styled.div`
  display: flex;
  place-items: center;

  img {
    width: 29px;
  }
`

const ProfileArea = styled.div`
  display: flex;
  place-items: stretch;
  place-items: center;
`

const UnidentifiedArea = styled.div`
  display: flex;
  place-items: stretch;
  grow: 1;
`
