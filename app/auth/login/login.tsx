'use client'
import learnhouseIcon from 'public/learnhouse_bigicon_1.png'
import FormLayout, {
  FormField,
  Input,
} from '@components/Objects/StyledElements/Form/Form'
import Image from 'next/image'
import * as Form from '@radix-ui/react-form'
import { useFormik } from 'formik'
import { getOrgLogoMediaDirectory } from '@services/media/media'
import React, { useState, useEffect } from 'react'
import { AlertTriangle, UserRoundPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from "next-auth/react"
import { getUriWithOrg, getUriWithoutOrg } from '@services/config/config'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import SplashLoading from '@components/Objects/Loaders/SplashLoading'
import { motion } from 'framer-motion'

interface LoginClientProps {
  org: any
}

const validate = (values: any) => {
  const errors: any = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  return errors
}

const LoginClient = (props: LoginClientProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();
  const session = useLHSession() as any;

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const [error, setError] = useState('')
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, {validateForm, setErrors, setSubmitting}) => {
      setIsSubmitting(true)
      const errors = await validateForm(values);
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        setSubmitting(false);
        return;
      }
      
      const res = await signIn('credentials', {
        redirect: true,
        email: values.email,
        password: values.password,
        callbackUrl: '/home'
      });
      if (res?.error) {
        setError("Wrong Email or password");
        setIsSubmitting(false);
      }
    },
  })

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
            className="ml-10 h-4/6 flex flex-row text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="m-auto flex space-x-4 items-center flex-wrap">
              <div className="text-slate-300">Login to </div>
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
                    alt="Learnhouse"
                    style={{ width: 'auto', height: 70 }}
                    className="rounded-xl shadow-xl inset-0 ring-1 ring-inset ring-white/20 bg-slate-800/80"
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
        <div className="left-login-part bg-slate-900/60 backdrop-blur-sm flex flex-row rounded-r-xl">
          <motion.div 
            className="login-form m-auto w-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {error && (
              <motion.div 
                className="flex justify-center bg-red-900/40 rounded-md text-red-200 space-x-2 items-center p-4 transition-all shadow-xs border border-red-600/30 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle size={18} />
                <div className="font-bold text-sm">{error}</div>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormLayout onSubmit={formik.handleSubmit}>
                <FormField name="email">
                  <div className="flex items-center space-x-3">
                    <Form.Label className="grow text-sm text-blue-200">Email</Form.Label>
                    {formik.errors.email && (
                      <div className="text-rose-500 text-sm items-center rounded-md flex space-x-1">
                        <AlertTriangle size={10} />
                        <div>{formik.errors.email}</div>
                      </div>
                    )}
                  </div>
                <Form.Control asChild>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                    className="bg-slate-800/80 border border-slate-600 text-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </Form.Control>
              </FormField>
              {/* for password  */}
              <FormField name="password">
                <div className="flex items-center space-x-3">
                  <Form.Label className="grow text-sm text-blue-200">Password</Form.Label>
                  {formik.errors.password && (
                    <div className="text-rose-500 text-sm items-center rounded-md flex space-x-1">
                      <AlertTriangle size={10} />
                      <div>{formik.errors.password}</div>
                    </div>
                  )}
                </div>
                <Form.Control asChild>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type="password"
                    className="bg-slate-800/80 border border-slate-600 text-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </Form.Control>
              </FormField>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href={{ pathname: getUriWithoutOrg('/forgot'), query: props.org.slug ? { orgslug: props.org.slug } : null }}
                  passHref
                  className="text-xs text-blue-200 hover:text-blue-100 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>
              <motion.div 
                className="flex py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Form.Submit asChild>
                  <motion.button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-center p-2 rounded-md shadow-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300 neon-glow-blue"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isSubmitting ? 'Loading...' : 'Login'}
                  </motion.button>
                </Form.Submit>
              </motion.div>
            </FormLayout>
            <motion.div 
              className='flex h-0.5 rounded-2xl bg-slate-700/50 mt-5 mx-10'
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            ></motion.div>
            <motion.div 
              className='flex justify-center py-5 mx-auto text-blue-200'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >OR </motion.div>
            <motion.div 
              className='flex flex-col space-y-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href={{ pathname: getUriWithoutOrg('/signup'), query: props.org.slug ? { orgslug: props.org.slug } : null }}  
                  className="flex justify-center items-center py-3 text-md w-full bg-gray-800/80 text-gray-300 space-x-3 font-semibold text-center p-2 rounded-md shadow-sm hover:cursor-pointer hover:bg-gray-700/80 transition-colors">
                  <UserRoundPlus size={17} />
                  <span>Sign up</span>
                </Link>
              </motion.div>
              <motion.button 
                onClick={() => signIn('google', { callbackUrl: '/home' })} 
                className="flex justify-center py-3 text-md w-full bg-slate-800/80 text-white/90 space-x-3 font-semibold text-center p-2 rounded-md shadow-md border border-slate-600 hover:bg-slate-700/80 hover:cursor-pointer transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="" />
                <span>Sign in with Google</span>
              </motion.button>
            </motion.div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginClient
