import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { getUriWithoutOrg, getUriWithOrg } from '@services/config/config'
import { LogIn, LogOut } from 'lucide-react'
import { removeCourse, startCourse } from '@services/courses/activity'
import { revalidateTags } from '@services/utils/ts/requests'
import UserAvatar from '../../UserAvatar'
import { getUserAvatarMediaDirectory } from '@services/media/media'

interface Author {
  user: {
    user_uuid: string
    avatar_image: string
    first_name: string
    last_name: string
    username: string
  }
  authorship: 'CREATOR' | 'CONTRIBUTOR' | 'MAINTAINER' | 'REPORTER'
  authorship_status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
}

interface CourseRun {
  status: string
  course_id: string
}

interface Course {
  id: string
  authors: Author[]
  trail?: {
    runs: CourseRun[]
  }
  chapters?: Array<{
    name: string
    activities: Array<{
      activity_uuid: string
      name: string
      activity_type: string
    }>
  }>
}

interface CourseActionsMobileProps {
  courseuuid: string
  orgslug: string
  course: Course & {
    org_id: number
  }
}

// Component for displaying multiple authors
const MultipleAuthors = ({ authors }: { authors: Author[] }) => {
  const displayedAvatars = authors.slice(0, 3)
  const remainingCount = Math.max(0, authors.length - 3)
  
  // Avatar size for mobile
  const avatarSize = 36
  const borderSize = "border-2"

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3 relative">
        {displayedAvatars.map((author, index) => (
          <div
            key={author.user.user_uuid}
            className="relative"
            style={{ zIndex: displayedAvatars.length - index }}
          >
            <UserAvatar
              border={borderSize}
              rounded='rounded-full'
              avatar_url={author.user.avatar_image ? getUserAvatarMediaDirectory(author.user.user_uuid, author.user.avatar_image) : ''}
              predefined_avatar={author.user.avatar_image ? undefined : 'empty'}
              width={avatarSize}
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div 
            className="relative"
            style={{ zIndex: 0 }}
          >
            <div 
              className="flex items-center justify-center bg-neutral-100 text-neutral-600 font-medium rounded-full border-2 border-white shadow-sm"
              style={{ 
                width: `${avatarSize}px`, 
                height: `${avatarSize}px`,
                fontSize: '12px'
              }}
            >
              +{remainingCount}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs text-neutral-400 font-medium">
          {authors.length > 1 ? 'Authors' : 'Author'}
        </span>
        {authors.length === 1 ? (
          <span className="text-sm font-semibold text-neutral-800">
            {authors[0].user.first_name && authors[0].user.last_name 
              ? `${authors[0].user.first_name} ${authors[0].user.last_name}` 
              : `@${authors[0].user.username}`}
          </span>
        ) : (
          <span className="text-sm font-semibold text-neutral-800">
            {authors[0].user.first_name && authors[0].user.last_name
              ? `${authors[0].user.first_name} ${authors[0].user.last_name}`
              : `@${authors[0].user.username}`}
            {authors.length > 1 && ` & ${authors.length - 1} more`}
          </span>
        )}
      </div>
    </div>
  )
}

const CourseActionsMobile = ({ courseuuid, orgslug, course }: CourseActionsMobileProps) => {
  const router = useRouter()
  const session = useLHSession() as any
  const [isActionLoading, setIsActionLoading] = useState(false)

  const isStarted = course.trail?.runs?.some(
    (run) => run.status === 'STATUS_IN_PROGRESS' && run.course_id === course.id
  ) ?? false

  const handleCourseAction = async () => {
    if (!session.data?.user) {
      router.push(getUriWithoutOrg(`/signup?orgslug=${orgslug}`))
      return
    }

    setIsActionLoading(true)
    try {
      if (isStarted) {
        await removeCourse('course_' + courseuuid, orgslug, session.data?.tokens?.access_token)
        await revalidateTags(['courses'], orgslug)
        router.refresh()
      } else {
        await startCourse('course_' + courseuuid, orgslug, session.data?.tokens?.access_token)
        await revalidateTags(['courses'], orgslug)
        
        // Get the first activity from the first chapter
        const firstChapter = course.chapters?.[0]
        const firstActivity = firstChapter?.activities?.[0]
        
        if (firstActivity) {
          // Redirect to the first activity
          router.push(
            getUriWithOrg(orgslug, '') +
            `/course/${courseuuid}/activity/${firstActivity.activity_uuid.replace('activity_', '')}`
          )
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      console.error('Failed to perform course action:', error)
    } finally {
      setIsActionLoading(false)
    }
  }

  // Filter active authors and sort by role priority
  const sortedAuthors = [...course.authors]
    .filter(author => author.authorship_status === 'ACTIVE')
    .sort((a, b) => {
      const rolePriority: Record<string, number> = {
        'CREATOR': 0,
        'MAINTAINER': 1,
        'CONTRIBUTOR': 2,
        'REPORTER': 3
      };
      return rolePriority[a.authorship] - rolePriority[b.authorship];
    });

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm shadow-md shadow-black/25 outline outline-1 outline-white/20 rounded-lg overflow-hidden p-4 my-6 mx-2">
      <div className="flex flex-col space-y-4">
        <MultipleAuthors authors={sortedAuthors} />
        
        <button
          onClick={handleCourseAction}
          disabled={isActionLoading}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
            isStarted
              ? 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-400'
              : 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-700'
          }`}
        >
          {isActionLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : !session.data?.user ? (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          ) : isStarted ? (
            <>
              <LogOut className="w-4 h-4" />
              Leave Course
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Start Course
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CourseActionsMobile