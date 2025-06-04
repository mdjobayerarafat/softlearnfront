'use client'
import React, { useEffect, use } from 'react';
import { motion } from 'framer-motion'
import UserEditGeneral from '@components/Dashboard/Pages/UserAccount/UserEditGeneral/UserEditGeneral'
import UserEditPassword from '@components/Dashboard/Pages/UserAccount/UserEditPassword/UserEditPassword'
import Link from 'next/link'
import { getUriWithOrg } from '@services/config/config'
import { Info, Lock, LucideIcon, User } from 'lucide-react'
import BreadCrumbs from '@components/Dashboard/Misc/BreadCrumbs'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import UserProfile from '@components/Dashboard/Pages/UserAccount/UserProfile/UserProfile';

interface User {
  username: string;
  // Add other user properties as needed
}

interface Session {
  user?: User;
  // Add other session properties as needed
}

export type SettingsParams = {
  subpage: string
  orgslug: string
}

type NavigationItem = {
  id: string
  label: string
  icon: LucideIcon
  component: React.ComponentType
}

const navigationItems: NavigationItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: Info,
    component: UserEditGeneral
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    component: UserProfile
  },
  {
    id: 'security',
    label: 'Password',
    icon: Lock,
    component: UserEditPassword
  },
]

const SettingsNavigation = ({ 
  items, 
  currentPage, 
  orgslug 
}: { 
  items: NavigationItem[]
  currentPage: string
  orgslug: string 
}) => (
  <div className="flex space-x-5 font-semibold text-sm">
    {items.map((item) => (
      <Link
        key={item.id}
        href={getUriWithOrg(orgslug, `/dash/user-account/settings/${item.id}`)}
      >
        <div
          className={`py-3 w-fit text-center transition-all duration-300 ease-out ${
            currentPage === item.id 
              ? 'border-b-2 border-blue-400 text-blue-300 bg-blue-900/20 px-4 rounded-t-lg' 
              : 'text-white/80 hover:text-white hover:bg-white/5 px-4 rounded-lg'
          } cursor-pointer`}
        >
          <div className="flex items-center space-x-2.5 mx-2">
            <item.icon size={18} className={currentPage === item.id ? "text-blue-300" : ""} />
            <div>{item.label}</div>
          </div>
        </div>
      </Link>
    ))}
  </div>
)

function SettingsPage({ params }: { params: Promise<SettingsParams> }) {
  const { subpage, orgslug } = use(params);
  const session = useLHSession() as Session;

  useEffect(() => {}, [session])

  const CurrentComponent = navigationItems.find(item => item.id === subpage)?.component;

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="pl-10 pr-10 tracking-tight bg-black/40 backdrop-blur-xl border-b border-white/10 z-10 flex-shrink-0 shadow-lg">
        <BreadCrumbs
          type="user"
          last_breadcrumb={session?.user?.username}
        />
        <div className="my-2 tracking-tighter">
          <div className="w-100 flex justify-between">
            <div className="pt-3 flex font-bold text-4xl text-white">Account Settings</div>
          </div>
        </div>
        <SettingsNavigation 
          items={navigationItems}
          currentPage={subpage}
          orgslug={orgslug}
        />
      </div>
      <div className="h-6 flex-shrink-0" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
        className="flex-1 overflow-y-auto bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="p-6">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsPage
