'use client'
import { useOrg } from '@components/Contexts/OrgContext'
import AuthenticatedClientElement from '@components/Security/AuthenticatedClientElement'
import ConfirmationModal from '@components/Objects/StyledElements/ConfirmationModal/ConfirmationModal'
import { getUriWithOrg } from '@services/config/config'
import { deleteCourseFromBackend } from '@services/courses/courses'
import { getCourseThumbnailMediaDirectory, getUserAvatarMediaDirectory } from '@services/media/media'
import { revalidateTags } from '@services/utils/ts/requests'
import { BookMinus, FilePenLine, Settings2, MoreVertical } from 'lucide-react'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import UserAvatar from '@components/Objects/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"

type Course = {
  course_uuid: string
  name: string
  description: string
  thumbnail_image: string
  org_id: string
  update_date: string
  authors?: Array<{
    user: {
      id: string
      user_uuid: string
      avatar_image: string
      first_name: string
      last_name: string
      username: string
    }
    authorship: 'CREATOR' | 'CONTRIBUTOR' | 'MAINTAINER' | 'REPORTER'
    authorship_status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  }>
}

type PropsType = {
  course: Course
  orgslug: string
  customLink?: string
}

export const removeCoursePrefix = (course_uuid: string) => course_uuid.replace('course_', '')

function CourseThumbnail({ course, orgslug, customLink }: PropsType) {
  const router = useRouter() 
  const org = useOrg() as any
  const session = useLHSession() as any

  const activeAuthors = course.authors?.filter(author => author.authorship_status === 'ACTIVE') || []
  const displayedAuthors = activeAuthors.slice(0, 3)
  const hasMoreAuthors = activeAuthors.length > 3
  const remainingAuthorsCount = activeAuthors.length - 3

  const deleteCourse = async () => {
    const toastId = toast.loading('Deleting course...')
    try {
      await deleteCourseFromBackend(course.course_uuid, session.data?.tokens?.access_token)
      await revalidateTags(['courses'], orgslug)
      toast.success('Course deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete course')
    } finally {
      toast.dismiss(toastId)
    }
  }

  const thumbnailImage = course.thumbnail_image
    ? getCourseThumbnailMediaDirectory(org?.org_uuid, course.course_uuid, course.thumbnail_image)
    : '../empty_thumbnail.png'

  return (
    <div className="relative flex flex-col bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-xl overflow-hidden min-w-[280px] w-full max-w-sm shrink-0 group hover:border-blue-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/10">
      <AdminEditOptions
        course={course}
        orgSlug={orgslug}
        deleteCourse={deleteCourse}
      />
      <Link prefetch href={customLink ? customLink : getUriWithOrg(orgslug, `/course/${removeCoursePrefix(course.course_uuid)}`)}>
        <div
          className="inset-0 ring-1 ring-inset ring-slate-700/20 rounded-t-xl w-full aspect-video bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url(${thumbnailImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent group-hover:from-blue-900/20 transition-all duration-500" />
        </div>
      </Link>
      <div className='flex flex-col w-full p-4 space-y-3'>
        <div className="space-y-2">
          <h2 className="font-bold text-slate-100 leading-tight text-base min-h-[2.75rem] line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">{course.name}</h2>
          <p className='text-xs text-slate-400 leading-normal min-h-[3.75rem] line-clamp-3'>{course.description}</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          {course.update_date && (
            <div className="inline-flex h-5 min-w-[140px] items-center justify-center px-2 rounded-md bg-slate-800/60 border border-slate-700/40">
              <span className="text-[10px] font-medium text-slate-300 truncate">
                Updated {new Date(course.update_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
          
          {displayedAuthors.length > 0 && (
            <div className="flex -space-x-4 items-center">
              {displayedAuthors.map((author, index) => (
                <div 
                  key={author.user.user_uuid} 
                  className="relative"
                  style={{ zIndex: displayedAuthors.length - index }}
                >
                  <UserAvatar
                    border="border-2"
                    rounded="rounded-full"
                    avatar_url={author.user.avatar_image ? getUserAvatarMediaDirectory(author.user.user_uuid, author.user.avatar_image) : ''}
                    predefined_avatar={author.user.avatar_image ? undefined : 'empty'}
                    width={32}
                    showProfilePopup={true}
                    userId={author.user.id}
                  />
                </div>
              ))}
              {hasMoreAuthors && (
                <div 
                  className="relative -ml-1"
                  style={{ zIndex: 0 }}
                >
                  <div className="flex items-center justify-center w-[32px] h-[32px] text-[11px] font-medium text-slate-300 bg-slate-800/60 border-2 border-slate-800 rounded-full">
                    +{remainingAuthorsCount}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Link 
          prefetch 
          href={customLink ? customLink : getUriWithOrg(orgslug, `/course/${removeCoursePrefix(course.course_uuid)}`)}
          className="inline-flex items-center justify-center w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
        >
          Start Learning
        </Link>
      </div>
    </div>
  )
}

const AdminEditOptions = ({ course, orgSlug, deleteCourse }: {
  course: Course
  orgSlug: string
  deleteCourse: () => Promise<void>
}) => {
  return (
    <AuthenticatedClientElement
      action="update"
      ressourceType="courses"
      checkMethod="roles"
      orgId={course.org_id}
    >
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 bg-slate-800/60 backdrop-blur-sm border border-slate-700/30 rounded-full hover:bg-slate-700/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
              <MoreVertical size={20} className="text-slate-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 backdrop-blur-sm border border-slate-700/30">
            <DropdownMenuItem asChild>
              <Link prefetch href={getUriWithOrg(orgSlug, `/dash/courses/course/${removeCoursePrefix(course.course_uuid)}/content`)} className="text-slate-300 hover:text-blue-300 hover:bg-slate-800/50">
                <FilePenLine className="mr-2 h-4 w-4" /> Edit Content
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link prefetch href={getUriWithOrg(orgSlug, `/dash/courses/course/${removeCoursePrefix(course.course_uuid)}/general`)} className="text-slate-300 hover:text-blue-300 hover:bg-slate-800/50">
                <Settings2 className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ConfirmationModal
                confirmationButtonText="Delete Course"
                confirmationMessage="Are you sure you want to delete this course?"
                dialogTitle={`Delete ${course.name}?`}
                dialogTrigger={
                  <button className="w-full text-left flex items-center px-2 py-1 rounded-md text-sm bg-rose-500/10 hover:bg-rose-500/20 transition-colors text-red-400 hover:text-red-300">
                    <BookMinus className="mr-4 h-4 w-4" /> Delete Course
                  </button>
                }
                functionToExecute={deleteCourse}
                status="warning"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </AuthenticatedClientElement>
  )
}

export default CourseThumbnail
