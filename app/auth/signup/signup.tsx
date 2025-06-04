'use client'
import learnhouseIcon from 'public/learnhouse_bigicon_1.png'
import Image from 'next/image'
import { getOrgLogoMediaDirectory } from '@services/media/media'
import Link from 'next/link'
import { getUriWithOrg, getUriWithoutOrg } from '@services/config/config'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import React, { useState, useEffect } from 'react'
import { MailWarning, Ticket, UserPlus } from 'lucide-react'
import { useOrg } from '@components/Contexts/OrgContext'
import UserAvatar from '@components/Objects/UserAvatar'
import OpenSignUpComponent from './OpenSignup'
import InviteOnlySignUpComponent from './InviteOnlySignUp'
import { useRouter, useSearchParams } from 'next/navigation'
import { validateInviteCode } from '@services/organizations/invites'
import PageLoading from '@components/Objects/Loaders/PageLoading'
import SplashLoading from '@components/Objects/Loaders/SplashLoading'
import Toast from '@components/Objects/StyledElements/Toast/Toast'
import toast from 'react-hot-toast'
import { BarLoader } from 'react-spinners'
import { joinOrg } from '@services/organizations/orgs'
import { motion } from 'framer-motion'

interface SignUpClientProps {
  org: any
}

function SignUpClient(props: SignUpClientProps) {
  const session = useLHSession() as any
  const [joinMethod, setJoinMethod] = React.useState('open')
  const [inviteCode, setInviteCode] = React.useState('')
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const inviteCodeParam = searchParams.get('inviteCode')

  useEffect(() => {
    // Initialize splash screen
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (props.org.config) {
      setJoinMethod(
        props.org?.config?.config?.features.members.signup_mode
      )
    }
    if (inviteCodeParam) {
      setInviteCode(inviteCodeParam)
    }
  }, [props.org, inviteCodeParam])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 modern-dots-bg opacity-30 pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <SplashLoading onComplete={() => setIsLoading(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 modern-dots-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="grid grid-flow-col justify-stretch h-screen relative z-10">
        <div
          className="right-login-part rounded-l-xl"
          style={{
            background:
              'linear-gradient(041.61deg, rgba(32, 32, 32, 0.8) 7.15%, rgba(0, 0, 0, 0.9) 90.96%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div 
            className="login-topbar m-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link prefetch href={getUriWithOrg(props.org.slug, '/')}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  quality={100}
                  width={30}
                  height={30}
                  src={learnhouseIcon}
                  alt=""
                  className="relative rounded-lg"
                />
              </motion.div>
            </Link>
          </motion.div>
          <motion.div 
            className="ml-10 h-3/4 flex flex-row text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="m-auto flex space-x-4 items-center flex-wrap">
              <div className="text-slate-300">You've been invited to join </div>
              <motion.div 
                className="shadow-[0px_4px_16px_rgba(0,0,0,0.1)]"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {props.org?.logo_image ? (
                  <img
                    src={`${getOrgLogoMediaDirectory(
                      props.org.org_uuid,
                      props.org?.logo_image
                    )}`}
                    alt="LearnHouse"
                    style={{ width: 'auto', height: 70 }}
                    className="rounded-xl shadow-xl inset-0 ring-1 ring-inset ring-black/10 bg-white"
                  />
                ) : (
                  <Image
                    quality={100}
                    width={70}
                    height={70}
                    src={learnhouseIcon}
                    alt=""
                  />
                )}
              </motion.div>
              <motion.div 
                className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {props.org?.name}
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="left-join-part bg-slate-900/60 backdrop-blur-sm flex flex-row border border-white/10 rounded-r-xl">
          {joinMethod == 'open' &&
            (session.status == 'authenticated' ? (
              <LoggedInJoinScreen inviteCode={inviteCode} />
            ) : (
              <OpenSignUpComponent />
            ))}
          {joinMethod == 'inviteOnly' &&
            (inviteCode ? (
              session.status == 'authenticated' ? (
                <LoggedInJoinScreen inviteCode={inviteCode} />
              ) : (
                <InviteOnlySignUpComponent inviteCode={inviteCode} />
              )
            ) : (
              <NoTokenScreen />
            ))}
        </div>
      </div>
    </div>
  )
}

const LoggedInJoinScreen = (props: any) => {
  const session = useLHSession() as any
  const org = useOrg() as any
  const invite_code = props.inviteCode
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSumbitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const join = async () => {
    setIsSubmitting(true)
    const res = await joinOrg({ org_id: org.id, user_id: session?.data?.user?.id, invite_code: props.inviteCode }, null, session.data?.tokens?.access_token)
    //wait for 1s
    if (res.success) {
      toast.success(
        res.data
      )
      setTimeout(() => {
        router.push(getUriWithOrg(org.slug,'/'))
      }, 2000)
      setIsSubmitting(false)
    } else {
      toast.error(res.data.detail)
      setIsLoading(false)
      setIsSubmitting(false)
    }

  }

  useEffect(() => {
    if (session && org) {
      setIsLoading(false)
    }
  }, [org, session])

  return (
    <motion.div 
      className="flex flex-row items-center mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
       <Toast />
      <div className="flex space-y-7 flex-col justify-center items-center">
        <motion.p 
          className="pt-3 text-2xl font-semibold text-blue-200 flex justify-center space-x-2 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="items-center">Hi</span>
          <span className="capitalize flex space-x-2 items-center">
            <UserAvatar rounded="rounded-xl" border="border-4" width={35} />
            <span>{session.data.username},</span>
          </span>
          <span>join {org?.name} ?</span>
        </motion.p>
        <motion.button 
          onClick={() => join()} 
          className="flex w-fit h-[35px] space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-md rounded-lg font-semibold h-fit items-center shadow-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300 neon-glow-blue"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isSumbitting ? <BarLoader
            cssOverride={{ borderRadius: 60 }}
            width={60}
            color="#ffffff"
          /> : <><UserPlus size={18} />
            <p>Join </p></>}
        </motion.button>
      </div>
    </motion.div>
  )
}

const NoTokenScreen = (props: any) => {
  const session = useLHSession() as any
  const org = useOrg() as any
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [inviteCode, setInviteCode] = React.useState('')
  const [messsage, setMessage] = React.useState('bruh')

  const handleInviteCodeChange = (e: any) => {
    setInviteCode(e.target.value)
  }

  const validateCode = async () => {
    setIsLoading(true)
    let res = await validateInviteCode(org?.id, inviteCode, session?.user?.tokens.access_token)
    //wait for 1s
    if (res.success) {
      toast.success(
        "Invite code is valid, you'll be redirected to the signup page in a few seconds"
      )
      setTimeout(() => {
        router.push(getUriWithoutOrg(`/signup?inviteCode=${inviteCode}&orgslug=${org.slug}`))
      }, 2000)
    } else {
      toast.error('Invite code is invalid')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session && org) {
      setIsLoading(false)
    }
  }, [org, session])

  return (
    <motion.div 
      className="flex flex-row items-center mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Toast />
      {isLoading ? (
        <div className="flex space-y-7 flex-col w-[300px] justify-center items-center">
          <PageLoading />
        </div>
      ) : (
        <div className="flex space-y-7 flex-col justify-center items-center">
          <motion.p 
            className="flex space-x-2 text-lg font-medium text-red-400 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MailWarning size={18} />
            <span>An invite code is required to join {org?.name}</span>
          </motion.p>
          <motion.input
            onChange={handleInviteCodeChange}
            className="bg-slate-800/80 backdrop-blur-sm border border-white/10 text-white placeholder-blue-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-5 w-[300px] h-[50px] transition-all"
            placeholder="Please enter an invite code"
            type="text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          />
          <motion.button
            onClick={validateCode}
            className="flex w-fit space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-md rounded-lg font-semibold h-fit items-center shadow-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300 neon-glow-blue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Ticket size={18} />
            <p>Submit </p>
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

export default SignUpClient
