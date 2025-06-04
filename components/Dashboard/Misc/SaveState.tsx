'use client'
import { getAPIUrl } from '@services/config/config'
import { updateCourseOrderStructure } from '@services/courses/chapters'
import { revalidateTags } from '@services/utils/ts/requests'
import {
  useCourse,
  useCourseDispatch,
} from '@components/Contexts/CourseContext'
import { Check, SaveAllIcon, Timer, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { mutate } from 'swr'
import { updateCourse } from '@services/courses/courses'
import { useLHSession } from '@components/Contexts/LHSessionContext'

function SaveState(props: { orgslug: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const course = useCourse() as any
  const session = useLHSession() as any;
  const router = useRouter()
  const saved = course ? course.isSaved : true
  const dispatchCourse = useCourseDispatch() as any
  const course_structure = course.courseStructure
  const withUnpublishedActivities = course ? course.withUnpublishedActivities : false
  const saveCourseState = async () => {
    if (saved || isLoading) return
    setIsLoading(true)
    try {
      // Course  order
      await changeOrderBackend()
      mutate(`${getAPIUrl()}courses/${course.courseStructure.course_uuid}/meta?with_unpublished_activities=${withUnpublishedActivities}`)
      // Course metadata
      await changeMetadataBackend()
      mutate(`${getAPIUrl()}courses/${course.courseStructure.course_uuid}/meta?with_unpublished_activities=${withUnpublishedActivities}`)
      await revalidateTags(['courses'], props.orgslug)
      dispatchCourse({ type: 'setIsSaved' })
    } finally {
      setIsLoading(false)
    }
  }

  //
  // Course Order
  const changeOrderBackend = async () => {
    mutate(`${getAPIUrl()}courses/${course.courseStructure.course_uuid}/meta?with_unpublished_activities=${withUnpublishedActivities}`)
    await updateCourseOrderStructure(
      course.courseStructure.course_uuid,
      course.courseOrder,
      session.data?.tokens?.access_token
    )
    await revalidateTags(['courses'], props.orgslug)
    router.refresh()
    dispatchCourse({ type: 'setIsSaved' })
  }

  // Course metadata
  const changeMetadataBackend = async () => {
    mutate(`${getAPIUrl()}courses/${course.courseStructure.course_uuid}/meta?with_unpublished_activities=${withUnpublishedActivities}`)
    await updateCourse(
      course.courseStructure.course_uuid,
      course.courseStructure,
      session.data?.tokens?.access_token
    )
    await revalidateTags(['courses'], props.orgslug)
    router.refresh()
    dispatchCourse({ type: 'setIsSaved' })
  }

  const handleCourseOrder = (course_structure: any) => {
    const chapters = course_structure.chapters
    const chapter_order_by_ids = chapters.map((chapter: any) => {
      return {
        chapter_id: chapter.id,
        activities_order_by_ids: chapter.activities.map((activity: any) => {
          return {
            activity_id: activity.id,
          }
        }),
      }
    })
    dispatchCourse({
      type: 'setCourseOrder',
      payload: { chapter_order_by_ids: chapter_order_by_ids },
    })
    dispatchCourse({ type: 'setIsNotSaved' })
  }

  const initOrderPayload = () => {
    if (course_structure && course_structure.chapters) {
      handleCourseOrder(course_structure)
      dispatchCourse({ type: 'setIsSaved' })
    }
  }

  const changeOrderPayload = () => {
    if (course_structure && course_structure.chapters) {
      handleCourseOrder(course_structure)
      dispatchCourse({ type: 'setIsNotSaved' })
    }
  }

  useEffect(() => {
    if (course_structure?.chapters) {
      initOrderPayload()
    }
    if (course_structure?.chapters && !saved) {
      changeOrderPayload()
    }
  }, [course_structure]) // This effect depends on the `course_structure` variable

  return (
    <div className="flex space-x-4">
      {saved ? (
        <></>
      ) : (
        <div className="text-purple-300 flex space-x-2 items-center antialiased animate-pulse">
          <Timer size={15} className="text-amber-400" />
          <div>Unsaved changes</div>
        </div>
      )}
      <div
        className={
          `px-4 py-2 rounded-lg backdrop-blur-xl cursor-pointer flex space-x-2 items-center font-bold antialiased transition-all ease-linear duration-300 ` +
          (saved
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/20'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-500/30 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20') +
          (isLoading ? 'opacity-50 cursor-not-allowed' : '')
        }
        onClick={saveCourseState}
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : saved ? (
          <Check size={20} />
        ) : (
          <SaveAllIcon size={20} />
        )}
        {isLoading ? (
          <div className="">Saving...</div>
        ) : saved ? (
          <div className="">Saved</div>
        ) : (
          <div className="">Save</div>
        )}
      </div>
    </div>
  )
}

export default SaveState
