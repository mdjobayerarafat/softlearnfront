'use client'
import { useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import FormLayout, {
  FormField,
  FormLabelAndMessage,
  Input,
  Textarea,
} from '@components/Objects/StyledElements/Form/Form'
import * as Form from '@radix-ui/react-form'
import { AlertTriangle, Check, User, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import { signup } from '@services/auth/auth'
import { useOrg } from '@components/Contexts/OrgContext'
import { signIn } from 'next-auth/react'
import { getUriWithoutOrg } from '@services/config/config'
import { motion } from 'framer-motion'

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

  if (!values.username) {
    errors.username = 'Required'
  }

  if (!values.username || values.username.length < 4) {
    errors.username = 'Username must be at least 4 characters'
  }

  if (!values.bio) {
    errors.bio = 'Required'
  }

  return errors
}

function OpenSignUpComponent() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const org = useOrg() as any
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [showLogin, setShowLogin] = React.useState(false)

  // Check for OAuth errors from URL
  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError('Google sign-in failed. Please try again or use email signup.')
    }
  }, [searchParams])

  const formik = useFormik({
    initialValues: {
      org_slug: org?.slug,
      org_id: org?.id,
      email: '',
      password: '',
      username: '',
      bio: '',
      first_name: '',
      last_name: '',
    },
    validate,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setError('')
      setMessage('')
      setIsSubmitting(true)
      setShowLogin(false)

     try {
       let res = await signup(values)
       let message = await res.json()

       if (res.status == 200) {
         setMessage('Your account was successfully created')
         // Navigate to login page after a short delay
         setTimeout(() => {
           router.push('/login')
         }, 1500)
       } else if (res.status == 409) {
         // Account already exists
         setError('Account already exists')
         setShowLogin(true)
       } else if (
         res.status == 401 ||
         res.status == 400 ||
         res.status == 404
       ) {
         setError(message.detail || 'Authentication error')
       } else {
         setError('Something went wrong')
       }
     } catch (err) {
       // This could be a network error or other client-side error
       setError('Account created. Please login.')
     } finally {
       setIsSubmitting(false)
     }
    },
  })

  useEffect(() => { }, [org])

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' }).catch(err => {
      // This will catch client-side errors
      setError('Google sign-in failed. Please try again.')
    })
  }

  return (
    <motion.div 
      className="login-form m-auto w-80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {error && (
        <motion.div 
          className="flex flex-col justify-center bg-red-800/80 backdrop-blur-sm border border-red-400/30 rounded-md text-red-400 items-center p-4 transition-all shadow-xs mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex space-x-2 items-center">
            <AlertTriangle size={18} />
            <div className="font-bold text-sm">{error}</div>
          </div>
          {showLogin && (
            <motion.div 
              className="mt-3 pt-3 border-t border-red-400/30 w-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                className="flex space-x-2 items-center justify-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                href="/login"
              >
                <User size={14} /> <div>Go to Login</div>
              </Link>
            </motion.div>
          )}
        </motion.div>
      )}
      {message && (
        <motion.div 
          className="flex flex-col space-y-4 justify-center bg-green-800/80 backdrop-blur-sm border border-green-400/30 rounded-md text-green-400 items-center p-4 transition-all shadow-xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex space-x-2">
            <Check size={18} />
            <div className="font-bold text-sm">{message}</div>
          </div>
          <div className="text-sm text-green-300">Redirecting to login page...</div>
        
        </motion.div>
      )}
      {!message && (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FormLayout onSubmit={formik.handleSubmit}>
              <FormField name="email">
                <FormLabelAndMessage label="Email" message={formik.errors.email} />
                <Form.Control asChild>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                    required
                    className="bg-slate-800/80 border border-slate-600 text-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </Form.Control>
              </FormField>
              <FormField name="password">
                <FormLabelAndMessage
                  label="Password"
                  message={formik.errors.password}
                />
                <Form.Control asChild>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type="password"
                    required
                    className="bg-slate-800/80 border border-slate-600 text-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </Form.Control>
              </FormField>
              <FormField name="username">
                <FormLabelAndMessage
                  label="Username"
                  message={formik.errors.username}
                />
                <Form.Control asChild>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    type="text"
                    required
                    className="bg-slate-800/80 border border-slate-600 text-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </Form.Control>
              </FormField>
              <FormField name="bio">
                <FormLabelAndMessage label="Bio" message={formik.errors.bio} />
                <Form.Control asChild>
                  <Textarea
                    onChange={formik.handleChange}
                    value={formik.values.bio}
                    required
                    className="bg-slate-800/80 border border-slate-600 text-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </Form.Control>
              </FormField>
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
                    {isSubmitting ? 'Loading...' : 'Create an account'}
                  </motion.button>
                </Form.Submit>
              </motion.div>
            </FormLayout>
          </motion.div>
          <div>
            <motion.div 
              className='flex h-0.5 rounded-2xl bg-slate-700/50 mt-5 mb-5 mx-10'
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            ></motion.div>
            
            <motion.div 
              className='flex flex-col space-y-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.button
                onClick={handleGoogleSignIn}
                className="flex justify-center py-3 text-md w-full bg-slate-800/80 backdrop-blur-sm border border-white/10 text-blue-200 space-x-3 font-semibold text-center p-2 rounded-md shadow-sm hover:bg-slate-700/80 transition-colors hover:cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="" />
                <span>Sign in with Google</span>
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={{
                    pathname: getUriWithoutOrg('/login'),
                    query: org?.slug ? { orgslug: org.slug } : null
                  }}
                  className="flex justify-center items-center py-3 text-md w-full bg-slate-700/80 backdrop-blur-sm border border-white/10 text-blue-200 space-x-3 font-semibold text-center p-2 rounded-md shadow-sm hover:bg-slate-600/80 transition-colors hover:cursor-pointer"
                >
                  <UserRoundPlus size={17} />
                  <span>Login</span>
                </Link>
              </motion.div>
            </motion.div>
            
          </div>
        </>
      )}
      
    </motion.div>
    
  )
}

export default OpenSignUpComponent