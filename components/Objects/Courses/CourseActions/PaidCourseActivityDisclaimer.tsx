import React from 'react'
import { Lock, Crown } from 'lucide-react'

interface PaidCourseActivityDisclaimerProps {
  course: any
}

export default function PaidCourseActivityDisclaimer({ course }: PaidCourseActivityDisclaimerProps) {
  return (
    <div className="p-7 backdrop-blur-xl border border-amber-500/30 rounded-lg bg-amber-900/20 shadow-lg shadow-amber-500/10">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-amber-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-amber-400/30">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-300 mb-2">
            Premium Content
          </h3>
          <p className="text-amber-200/80 mb-4">
            This activity is part of premium content. You need to purchase access to this course to view this material.
          </p>
          <div className="flex items-center space-x-3">
            <button className="bg-amber-500/90 backdrop-blur-xl border border-amber-400/30 hover:bg-amber-500 text-amber-900 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/20">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Purchase Access</span>
              </div>
            </button>
            <span className="text-sm text-amber-300/70">
              or contact your administrator
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
