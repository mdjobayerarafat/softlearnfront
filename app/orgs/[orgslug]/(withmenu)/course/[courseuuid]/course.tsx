'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getUriWithOrg } from '@services/config/config'
import PageLoading from '@components/Objects/Loaders/PageLoading'
import { revalidateTags } from '@services/utils/ts/requests'
import ActivityIndicators from '@components/Pages/Courses/ActivityIndicators'
import { useRouter } from 'next/navigation'
import GeneralWrapperStyled from '@components/Objects/StyledElements/Wrappers/GeneralWrapper'
import {
  getCourseThumbnailMediaDirectory,
} from '@services/media/media'
import { ArrowRight, Backpack, Check, File, Sparkles, StickyNote, Video, Square } from 'lucide-react'
import { useOrg } from '@components/Contexts/OrgContext'
import { CourseProvider } from '@components/Contexts/CourseContext'
import { useMediaQuery } from 'usehooks-ts'
import CoursesActions from '@components/Objects/Courses/CourseActions/CoursesActions'
import CourseActionsMobile from '@components/Objects/Courses/CourseActions/CourseActionsMobile'
import CourseAuthors from '@components/Objects/Courses/CourseAuthors/CourseAuthors'

const CourseClient = (props: any) => {
  const [learnings, setLearnings] = useState<any>([])
  const [expandedChapters, setExpandedChapters] = useState<{[key: string]: boolean}>({})
  const courseuuid = props.courseuuid
  const orgslug = props.orgslug
  const course = props.course
  const org = useOrg() as any
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')

  console.log(course)

  function getLearningTags() {
    if (!course?.learnings) {
      setLearnings([])
      return
    }

    try {
      // Try to parse as JSON (new format)
      const parsedLearnings = JSON.parse(course.learnings)
      if (Array.isArray(parsedLearnings)) {
        // New format: array of learning items with text and emoji
        setLearnings(parsedLearnings)
        return
      }
    } catch (e) {
      // Not valid JSON, continue to legacy format handling
    }

    // Legacy format: comma-separated string (changed from pipe-separated)
    const learningItems = course.learnings.split(',').map((text: string) => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: text.trim(), // Trim whitespace that might be present after commas
      emoji: '📝' // Default emoji for legacy items
    }))
    
    setLearnings(learningItems)
  }

  useEffect(() => {
    getLearningTags()

    // Collapse chapters by default if more than 5 activities in total
    if (course?.chapters) {
      const totalActivities = course.chapters.reduce((sum: number, chapter: any) => sum + (chapter.activities?.length || 0), 0)
      const defaultExpanded: {[key: string]: boolean} = {}
      course.chapters.forEach((chapter: any) => {
        defaultExpanded[chapter.chapter_uuid] = totalActivities <= 5
      })
      setExpandedChapters(defaultExpanded)
    }
  }, [org, course])

  const getActivityTypeLabel = (activityType: string) => {
    switch (activityType) {
      case 'TYPE_VIDEO':
        return 'Video'
      case 'TYPE_DOCUMENT':
        return 'Document'
      case 'TYPE_DYNAMIC':
        return 'Page'
      case 'TYPE_ASSIGNMENT':
        return 'Assignment'
      default:
        return 'Learning Material'
    }
  }

  const getActivityTypeBadgeColor = (activityType: string) => {
    switch (activityType) {
      case 'TYPE_VIDEO':
        return 'bg-slate-700/80 text-blue-200'
      case 'TYPE_DOCUMENT':
        return 'bg-slate-700/80 text-blue-200'
      case 'TYPE_DYNAMIC':
        return 'bg-slate-700/80 text-blue-200'
      case 'TYPE_ASSIGNMENT':
        return 'bg-slate-700/80 text-blue-200'
      default:
        return 'bg-slate-700/80 text-blue-200'
    }
  }

  const isActivityDone = (activity: any) => {
    const run = course?.trail?.runs?.find(
      (run: any) => run.course_id == course.id
    )
    if (run) {
      return run.steps.find((step: any) => step.activity_id == activity.id)
    }
    return false
  }

  const isActivityCurrent = (activity: any) => {
    const activity_uuid = activity.activity_uuid.replace('activity_', '')
    if (props.current_activity && props.current_activity == activity_uuid) {
      return true
    }
    return false
  }

  return (
    <>
      {!course && !org ? (
        <PageLoading></PageLoading>
      ) : (
        <>
          <GeneralWrapperStyled>
            <div className="pb-2 pt-5 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-md font-bold text-blue-200 pb-2">Course</p>
                <h1 className="text-3xl md:text-3xl -mt-3 font-bold text-white">{course.name}</h1>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 pt-2">
              <div className="w-full md:w-3/4 space-y-4">
                {props.course?.thumbnail_image && org ? (
                  <div
                    className="inset-0 ring-1 ring-inset ring-black/10 rounded-lg shadow-xl relative w-full h-[200px] md:h-[400px] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${getCourseThumbnailMediaDirectory(
                        org?.org_uuid,
                        course?.course_uuid,
                        course?.thumbnail_image
                      )})`,
                    }}
                  ></div>
                ) : (
                  <div
                    className="inset-0 ring-1 ring-inset ring-black/10 rounded-lg shadow-xl relative w-full h-[400px] bg-cover bg-center"
                    style={{
                      backgroundImage: `url('../empty_thumbnail.png')`,
                      backgroundSize: 'auto',
                    }}
                  ></div>
                )}

                {course?.trail?.runs?.find((run: any) => run.course_id == course.id) && (
                  <ActivityIndicators
                    course_uuid={props.course.course_uuid}
                    orgslug={orgslug}
                    course={course}
                  />
                )}

                <div className="course_metadata_left space-y-2">
                  <div className="">
                    <p className="py-5 whitespace-pre-wrap text-blue-200">{course.about}</p>
                  </div>
                </div>
              </div>

              <div className='course_metadata_right w-full md:w-1/4 space-y-4'>
                {/* Actions Box */}
                <CoursesActions courseuuid={courseuuid} orgslug={orgslug} course={course} />
                
                {/* Authors & Updates Box */}
                <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 shadow-md rounded-lg overflow-hidden p-4">
                  <CourseProvider courseuuid={course.course_uuid}>
                    <CourseAuthors authors={course.authors} />
                  </CourseProvider>
                </div>
              </div>
            </div>

            {learnings.length > 0 && learnings[0]?.text !== 'null' && (
              <div className="w-full">
                <h2 className="py-5 text-xl md:text-2xl font-bold text-white">What you will learn</h2>
                <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 shadow-md rounded-lg overflow-hidden px-5 py-5 space-y-2">
                  {learnings.map((learning: any) => {
                    // Handle both new format (object with text and emoji) and legacy format (string)
                    const learningText = typeof learning === 'string' ? learning : learning.text
                    const learningEmoji = typeof learning === 'string' ? null : learning.emoji
                    const learningId = typeof learning === 'string' ? learning : learning.id || learning.text
                    
                    if (!learningText) return null
                    
                    return (
                      <div
                        key={learningId}
                        className="flex space-x-2 items-center font-semibold text-blue-200"
                      >
                        <div className="px-2 py-2 rounded-full">
                          {learningEmoji ? (
                            <span>{learningEmoji}</span>
                          ) : (
                            <Check className="text-blue-300" size={15} />
                          )}
                        </div>
                        <p>{learningText}</p>
                        {learning.link && (
                          <a 
                            href={learning.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline text-sm transition-colors"
                          >
                            <span className="sr-only">Link to {learningText}</span>
                            <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="w-full my-5 mb-10">
              <h2 className="py-5 text-xl md:text-2xl font-bold text-white">Course Lessons</h2>
              <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 shadow-md rounded-lg overflow-hidden">
                {course.chapters.map((chapter: any) => {
                  const isExpanded = expandedChapters[chapter.chapter_uuid] ?? true; // Default to expanded
                  return (
                    <div key={chapter.chapter_uuid || `chapter-${chapter.name}`} className="">
                      <div 
                        className="flex text-lg py-4 px-4 border border-white/10 font-bold bg-slate-700/80 backdrop-blur-sm text-blue-200 items-center cursor-pointer hover:bg-slate-600/80 transition-colors"
                        onClick={() => setExpandedChapters(prev => ({
                          ...prev,
                          [chapter.chapter_uuid]: !isExpanded
                        }))}
                      >
                        <h3 className="grow mr-3 break-words">{chapter.name}</h3>
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-normal text-blue-300 px-3 py-[2px] border border-white/20 rounded-full whitespace-nowrap shrink-0">
                            {chapter.activities.length} Activities
                          </p>
                          <svg 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className={`transition-all duration-200 ${isExpanded ? 'block' : 'hidden'}`}>
                        <div className="">
                          {chapter.activities.map((activity: any) => {
                            return (
                              <Link
                                key={activity.activity_uuid}
                                href={
                                  getUriWithOrg(orgslug, '') +
                                  `/course/${courseuuid}/activity/${activity.activity_uuid.replace('activity_', '')}`
                                }
                                rel="noopener noreferrer"
                                prefetch={false}
                                className="block group activity-container transition-all duration-200 px-4 py-4 hover:bg-slate-700/40 border-b border-white/5 last:border-b-0"
                              >
                                <div className="flex space-x-3 items-center">
                                  <div className="flex items-center">
                                    {isActivityDone(activity) ? (
                                      <div className="relative cursor-pointer">
                                        <Square size={16} className="stroke-[2] text-teal-400" />
                                        <Check size={16} className="stroke-[2.5] text-teal-400 absolute top-0 left-0" />
                                      </div>
                                    ) : (
                                      <div className="text-blue-300 cursor-pointer">
                                        <Square size={16} className="stroke-[2]" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col grow">
                                    <div className="flex items-center space-x-2 w-full">
                                      <p className="font-semibold text-blue-200 group-hover:text-white transition-colors">{activity.name}</p>
                                      {isActivityCurrent(activity) && (
                                        <div className="flex items-center space-x-1 text-blue-400 bg-blue-900/60 backdrop-blur-sm border border-blue-400/30 px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse">
                                          <span>Current</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1.5 mt-0.5 text-blue-300">
                                      {activity.activity_type === 'TYPE_DYNAMIC' && (
                                        <StickyNote size={10} />
                                      )}
                                      {activity.activity_type === 'TYPE_VIDEO' && (
                                        <Video size={10} />
                                      )}
                                      {activity.activity_type === 'TYPE_DOCUMENT' && (
                                        <File size={10} />
                                      )}
                                      {activity.activity_type === 'TYPE_ASSIGNMENT' && (
                                        <Backpack size={10} />
                                      )}
                                      <span className="text-xs font-medium">{getActivityTypeLabel(activity.activity_type)}</span>
                                    </div>
                                  </div>
                                  <div className="text-blue-300 group-hover:text-white transition-colors cursor-pointer">
                                    <ArrowRight size={14} />
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </GeneralWrapperStyled>
          
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0  p-4 z-50">
              <CourseActionsMobile courseuuid={courseuuid} orgslug={orgslug} course={course} />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default CourseClient
