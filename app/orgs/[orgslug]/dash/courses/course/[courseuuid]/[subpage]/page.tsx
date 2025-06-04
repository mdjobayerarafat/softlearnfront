'use client'
import { getUriWithOrg } from '@services/config/config'
import React, { use } from 'react';
import { CourseProvider } from '../../../../../../../../components/Contexts/CourseContext'
import Link from 'next/link'
import { CourseOverviewTop } from '@components/Dashboard/Misc/CourseOverviewTop'
import { motion } from 'framer-motion'
import { GalleryVerticalEnd, Globe, Info, UserPen, UserRoundCog, Users } from 'lucide-react'
import EditCourseStructure from '@components/Dashboard/Pages/Course/EditCourseStructure/EditCourseStructure'
import EditCourseGeneral from '@components/Dashboard/Pages/Course/EditCourseGeneral/EditCourseGeneral'
import EditCourseAccess from '@components/Dashboard/Pages/Course/EditCourseAccess/EditCourseAccess'
import EditCourseContributors from '@components/Dashboard/Pages/Course/EditCourseContributors/EditCourseContributors'
export type CourseOverviewParams = {
  orgslug: string
  courseuuid: string
  subpage: string
}

function CourseOverviewPage(props: { params: Promise<CourseOverviewParams> }) {
  const params = use(props.params);
  function getEntireCourseUUID(courseuuid: string) {
    // add course_ to uuid
    return `course_${courseuuid}`
  }

  return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 grid grid-rows-[auto_1fr]">
        <CourseProvider courseuuid={getEntireCourseUUID(params.courseuuid)} withUnpublishedActivities={true}>
          <div className="pl-10 pr-10 text-sm tracking-tight bg-black/20 backdrop-blur-xl border-b border-white/10 z-10">
            <CourseOverviewTop params={params} />
            <div className="flex space-x-3 font-semibold text-sm">
              <Link
                  href={
                      getUriWithOrg(params.orgslug, '') +
                      `/dash/courses/course/${params.courseuuid}/general`
                  }
              >
                <div
                    className={`flex space-x-4 py-3 w-fit text-center transition-all duration-300 ease-out ${params.subpage.toString() === 'general'
                        ? 'border-b-2 border-purple-400 text-purple-400'
                        : 'text-white/70 hover:text-white'
                    } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2.5 mx-2">
                    <Info size={16} />
                    <div>General</div>
                  </div>
                </div>
              </Link>

              <Link
                  href={
                      getUriWithOrg(params.orgslug, '') +
                      `/dash/courses/course/${params.courseuuid}/content`
                  }
              >
                <div
                    className={`flex space-x-4 py-3 w-fit text-center transition-all duration-300 ease-out ${params.subpage.toString() === 'content'
                        ? 'border-b-2 border-purple-400 text-purple-400'
                        : 'text-white/70 hover:text-white'
                    } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2.5 mx-2">
                    <GalleryVerticalEnd size={16} />
                    <div>Content</div>
                  </div>
                </div>
              </Link>
              <Link
                  href={
                      getUriWithOrg(params.orgslug, '') +
                      `/dash/courses/course/${params.courseuuid}/access`
                  }
              >
                <div
                    className={`flex space-x-4 py-3 w-fit text-center transition-all duration-300 ease-out ${params.subpage.toString() === 'access'
                        ? 'border-b-2 border-purple-400 text-purple-400'
                        : 'text-white/70 hover:text-white'
                    } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2.5 mx-2">
                    <Globe size={16} />
                    <div>Access</div>
                  </div>
                </div>
              </Link>
              <Link
                  href={
                      getUriWithOrg(params.orgslug, '') +
                      `/dash/courses/course/${params.courseuuid}/contributors`
                  }
              >
                <div
                    className={`flex space-x-4 py-3 w-fit text-center transition-all duration-300 ease-out ${params.subpage.toString() === 'contributors'
                        ? 'border-b-2 border-purple-400 text-purple-400'
                        : 'text-white/70 hover:text-white'
                    } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2.5 mx-2">
                    <UserPen size={16} />
                    <div>Contributors</div>
                  </div>
                </div>
              </Link>
            </div>

          </div>
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full overflow-y-auto bg-slate-900/50 backdrop-blur-sm"
          >
            {params.subpage == 'content' ? (<EditCourseStructure orgslug={params.orgslug} />) : ('')}
            {params.subpage == 'general' ? (<EditCourseGeneral orgslug={params.orgslug} />) : ('')}
            {params.subpage == 'access' ? (<EditCourseAccess orgslug={params.orgslug} />) : ('')}
            {params.subpage == 'contributors' ? (<EditCourseContributors orgslug={params.orgslug} />) : ('')}

          </motion.div>
        </CourseProvider>
      </div>
  )
}

export default CourseOverviewPage