'use client'
import { getUriWithoutOrg } from '@services/config/config'
import { AlertTriangle, HomeIcon, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function ErrorUI(params: { message?: string, submessage?: string }) {
  const router = useRouter()

  function reloadPage() {
    router.refresh()
    window.location.reload()
  }

  return (
    <div className="flex flex-col py-10 mx-auto antialiased items-center space-y-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="flex flex-row items-center space-x-5 rounded-xl bg-red-800/20 backdrop-blur-sm border border-red-400/30 p-6">
        <AlertTriangle className="text-red-400" size={45} />
        <div className='flex flex-col'>
          <p className="text-3xl font-bold text-red-400">{params.message ? params.message : 'Something went wrong'}</p>
          <p className="text-lg font-bold text-red-300">{params.submessage ? params.submessage : ''}</p>
        </div>
      </div>
      <div className='flex space-x-4'>
        <button
          onClick={() => reloadPage()}
          className="flex space-x-2 items-center rounded-full px-4 py-1 text-red-200 bg-red-700/80 backdrop-blur-sm border border-red-400/30 hover:bg-red-600/80 transition-all ease-linear shadow-lg"
        >
          <RefreshCcw className="text-red-200" size={17} />
          <span className="text-md font-bold">Retry</span>
        </button>
        <Link
          href={getUriWithoutOrg('/home')}
          className="flex space-x-2 items-center rounded-full px-4 py-1 text-blue-200 bg-slate-700/80 backdrop-blur-sm border border-white/10 hover:bg-slate-600/80 transition-all ease-linear shadow-lg"
        >
          <HomeIcon className="text-blue-200" size={17} />
          <span className="text-md font-bold">Home</span>
        </Link>
      </div>
    </div>
  )
}

export default ErrorUI
