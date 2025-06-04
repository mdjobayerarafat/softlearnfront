'use client'

import React from 'react'
import { useOrg } from '@components/Contexts/OrgContext'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { BookOpen, Package2, ShoppingCart, ExternalLink } from 'lucide-react'
import PageLoading from '@components/Objects/Loaders/PageLoading'
import CourseThumbnail from '@components/Objects/Thumbnails/CourseThumbnail'
import Link from 'next/link'
import { getUriWithOrg } from '@services/config/config'
import { motion } from 'framer-motion'

function OwnedCoursesPage() {
  const org = useOrg() as any
  const session = useLHSession() as any

  // Since payment functionality is removed, show empty state
  const ownedCourses: any[] = []
  const isLoading = false
  const error = null

  if (isLoading) return <PageLoading />
  
  if (error) {
    return (
      <div className="h-full w-full bg-[#f8f8f8] pl-10 pr-10 pt-5">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Courses</h2>
            <p className="text-gray-600">There was an error loading your owned courses</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-[#f8f8f8] pl-10 pr-10 pt-5">
      <motion.div 
        className="flex flex-col bg-slate-900/70 backdrop-blur-sm nice-shadow px-5 py-3 rounded-md mb-6 border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <Package2 className="w-8 h-8 text-white" />
          <div className="flex flex-col -space-y-1">
            <h1 className="font-bold text-xl text-white">My Courses</h1>
            <h2 className="text-blue-200 text-md">Courses you have purchased or subscribed to</h2>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {ownedCourses?.map((course: any, index: number) => (
          <motion.div 
            key={course.course_uuid} 
            className="p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseThumbnail course={course} orgslug={org.slug} />
          </motion.div>
        ))}

        {(!ownedCourses || ownedCourses.length === 0) && (
          <motion.div 
            className="col-span-full flex justify-center items-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center max-w-md">
              <div className="mb-6">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-3">
                No Purchased Courses
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                You haven't purchased any courses yet. Explore our course catalog to find something that interests you!
              </p>
              <div className="space-y-3">
                <Link 
                  href={getUriWithOrg(org?.slug, '/')}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Browse Courses
                </Link>
                <div className="text-sm text-gray-400">
                  Or check out our featured courses and collections
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default OwnedCoursesPage
