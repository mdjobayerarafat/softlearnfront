import React, { useState } from 'react'
import { removeCourse, startCourse } from '@services/courses/activity'
import { revalidateTags } from '@services/utils/ts/requests'
import { useRouter } from 'next/navigation'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { getUriWithOrg, getUriWithoutOrg } from '@services/config/config'
import { LogIn, UserPen, ClockIcon, ArrowRight, Sparkles } from 'lucide-react'
import { applyForContributor } from '@services/courses/courses'
import toast from 'react-hot-toast'
import { useContributorStatus } from '../../../../hooks/useContributorStatus'
import CourseProgress from '../CourseProgress/CourseProgress'

interface CourseRun {
  status: string
  course_id: string
  steps: Array<{
    activity_id: string
    complete: boolean
  }>
}

interface Course {
  id: string
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
  open_to_contributors?: boolean
}

interface CourseActionsProps {
  courseuuid: string
  orgslug: string
  course: Course & {
    org_id: number
  }
}

function CoursesActions({ courseuuid, orgslug, course }: CourseActionsProps) {
  const router = useRouter()
  const session = useLHSession() as any
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isContributeLoading, setIsContributeLoading] = useState(false)
  const [isProgressOpen, setIsProgressOpen] = useState(false)
  const { contributorStatus, refetch } = useContributorStatus(courseuuid)

  const isStarted = course.trail?.runs?.some(
    (run) => run.status === 'STATUS_IN_PROGRESS' && run.course_id === course.id
  ) ?? false

  const handleLogin = () => {
    router.push(
      getUriWithoutOrg(`/login?orgslug=${orgslug}&redirect_uri=${orgslug}/course/${courseuuid}`)
    )
  }

  const handleStart = async () => {
    setIsActionLoading(true)
    try {
      await startCourse('course_' + courseuuid, orgslug, session.data?.tokens?.access_token)
      revalidateTags([`/orgs/${orgslug}/course/${courseuuid}`], orgslug)
      setIsActionLoading(false)
      router.push(
        getUriWithOrg(
          orgslug,
          `/course/${courseuuid}/activity/${course.chapters![0].activities[0].activity_uuid}`
        )
      )
    } catch (error: any) {
      setIsActionLoading(false)
      toast.error(error.message || 'Failed to start course')
    }
  }

  const handleResume = () => {
    const latestRun = course.trail?.runs.find(
      (run) => run.status === 'STATUS_IN_PROGRESS' && run.course_id === course.id
    )

    if (!latestRun) {
      toast.error('No active course run found')
      return
    }

    let nextIncompleteActivity: string | undefined

    for (const chapter of course.chapters || []) {
      for (const activity of chapter.activities) {
        const step = latestRun.steps.find(
          (s) => s.activity_id === activity.activity_uuid
        )
        if (!step?.complete) {
          nextIncompleteActivity = activity.activity_uuid
          break
        }
      }
      if (nextIncompleteActivity) break
    }

    if (!nextIncompleteActivity && course.chapters?.[0]?.activities[0]) {
      nextIncompleteActivity = course.chapters[0].activities[0].activity_uuid
    }

    if (nextIncompleteActivity) {
      router.push(
        getUriWithOrg(orgslug, `/course/${courseuuid}/activity/${nextIncompleteActivity}`)
      )
    } else {
      toast.error('No activities found in this course')
    }
  }

  const handleContribute = async () => {
    setIsContributeLoading(true)
    try {
      await applyForContributor(courseuuid, {}, session.data?.tokens?.access_token)
      toast.success('Successfully applied to be a contributor')
      refetch()
    } catch (error) {
      toast.error('Failed to apply as contributor')
    }
    setIsContributeLoading(false)
  }

  const handleRemove = async () => {
    setIsActionLoading(true)
    try {
      await removeCourse('course_' + courseuuid, orgslug, session.data?.tokens?.access_token)
      revalidateTags([`/orgs/${orgslug}/course/${courseuuid}`], orgslug)
      setIsActionLoading(false)
      router.push(getUriWithOrg(orgslug, '/'))
    } catch (error: any) {
      setIsActionLoading(false)
      toast.error(error.message || 'Failed to remove course')
    }
  }

  const renderActionButtons = () => {
    if (!session.data?.user) {
      return (
        <div
          onClick={handleLogin}
          className="hover:cursor-pointer transition-all ease-linear px-4 py-1.5 bg-gray-100 text-gray-800 hover:bg-black hover:text-white rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <LogIn size={16} />
          Login to Start
        </div>
      )
    }

    const actionButtons = []

    if (contributorStatus === 'CONTRIBUTOR' as typeof contributorStatus) {
      actionButtons.push(
        <div
          key="edit"
          onClick={() =>
            router.push(getUriWithOrg(orgslug, `/dash/courses/course/${courseuuid}/general`))
          }
          className="hover:cursor-pointer transition-all ease-linear px-4 py-1.5 bg-gray-100 text-gray-800 hover:bg-black hover:text-white rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <UserPen size={16} />
          Edit course
        </div>
      )
    }

    if (isStarted) {
      actionButtons.push(
        <div
          key="resume"
          onClick={handleResume}
          className="hover:cursor-pointer transition-all ease-linear px-4 py-1.5 bg-gray-100 text-gray-800 hover:bg-black hover:text-white rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <ArrowRight size={16} />
          Resume
        </div>
      )
    } else {
      actionButtons.push(
        <div
          key="start"
          onClick={handleStart}
          className="hover:cursor-pointer transition-all ease-linear px-4 py-1.5 bg-gray-100 text-gray-800 hover:bg-black hover:text-white rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <ArrowRight size={16} />
          Start
        </div>
      )
    }

    if (course.open_to_contributors && contributorStatus === null) {
      actionButtons.push(
        <div
          key="contribute"
          onClick={handleContribute}
          className="hover:cursor-pointer transition-all ease-linear px-4 py-1.5 bg-gray-100 text-gray-800 hover:bg-black hover:text-white rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <Sparkles size={16} />
          {isContributeLoading ? 'Applying...' : 'Contribute'}
        </div>
      )
    }

    return actionButtons
  }

  if (isActionLoading) {
    return (
      <div className="flex gap-2 mr-2">
        <div className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-lg font-medium text-sm">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mr-2">
      {renderActionButtons()}
      {isStarted && (
        <div
          onClick={() => setIsProgressOpen(true)}
          className="hover:cursor-pointer transition-all ease-linear px-4 py-1.5 bg-gray-100 text-gray-800 hover:bg-black hover:text-white rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <ClockIcon size={16} />
          Progress
        </div>
      )}
      {isProgressOpen && (
        <CourseProgress 
          isOpen={isProgressOpen}
          onClose={() => setIsProgressOpen(false)}
          course={course}
          orgslug={''}
        />
      )}
    </div>
  )
}

export default CoursesActions