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
    <div className="login-form m-auto w-72">
      {error && (
        <div className="flex flex-col justify-center bg-red-200 rounded-md text-red-950 items-center p-4 transition-all shadow-xs mb-4">
          <div className="flex space-x-2 items-center">
            <AlertTriangle size={18} />
            <div className="font-bold text-sm">{error}</div>
          </div>
          {showLogin && (
            <div className="mt-3 pt-3 border-t border-red-300 w-full text-center">
              <Link
                className="flex space-x-2 items-center justify-center text-sm font-medium"
                href="/login"
              >
                <User size={14} /> <div>Go to Login</div>
              </Link>
            </div>
          )}
        </div>
      )}
      {message && (
        <div className="flex flex-col space-y-4 justify-center bg-green-200 rounded-md text-green-950 items-center p-4 transition-all shadow-xs">
          <div className="flex space-x-2">
            <Check size={18} />
            <div className="font-bold text-sm">{message}</div>
          </div>
          <div className="text-sm">Redirecting to login page...</div>
        </div>
      )}
      {!message && (
        <>
          <FormLayout onSubmit={formik.handleSubmit}>
            <FormField name="email">
              <FormLabelAndMessage label="Email" message={formik.errors.email} />
              <Form.Control asChild>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  type="email"
                  required
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
                />
              </Form.Control>
            </FormField>
            <div className="flex py-4">
              <Form.Submit asChild>
                <button className="w-full bg-black text-white font-bold text-center p-2 rounded-md shadow-md hover:cursor-pointer">
                  {isSubmitting ? 'Loading...' : 'Create an account'}
                </button>
              </Form.Submit>
            </div>
          </FormLayout>
          <div>

            <div className="flex h-0.5 rounded-2xl bg-slate-100 mt-5 mb-5 mx-10"></div>
            <button
              onClick={handleGoogleSignIn}
              className="flex justify-center py-3 text-md w-full bg-white text-slate-600 space-x-3 font-semibold text-center p-2 rounded-md shadow-sm hover:cursor-pointer"
            >
              <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="" />
              <span>Sign in with Google</span>
            </button>
            <Link
              href={{
                pathname: getUriWithoutOrg('/login'),
                query: org?.slug ? { orgslug: org.slug } : null
              }}
              className="flex justify-center items-center py-3 text-md w-full bg-gray-800 text-gray-300 space-x-3 font-semibold text-center p-2 rounded-md shadow-sm hover:cursor-pointer"
            >
              <UserRoundPlus size={17} />
              <span>Login</span>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default OpenSignUpComponent