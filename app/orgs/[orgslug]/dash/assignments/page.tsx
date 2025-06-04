'use client';
import { useLHSession } from '@components/Contexts/LHSessionContext';
import { useOrg } from '@components/Contexts/OrgContext';
import BreadCrumbs from '@components/Dashboard/Misc/BreadCrumbs'
import { getAPIUrl, getUriWithOrg } from '@services/config/config';
import { getAssignmentsFromACourse } from '@services/courses/assignments';
import { getCourseThumbnailMediaDirectory } from '@services/media/media';
import { swrFetcher } from '@services/utils/ts/requests';
import { EllipsisVertical, GalleryVerticalEnd, Info, Layers2, UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import useSWR from 'swr';

function AssignmentsHome() {
  const session = useLHSession() as any;
  const access_token = session?.data?.tokens?.access_token;
  const org = useOrg() as any;
  const [courseAssignments, setCourseAssignments] = React.useState<any[]>([])

  const { data: courses } = useSWR(`${getAPIUrl()}courses/org_slug/${org?.slug}/page/1/limit/50`, (url) => swrFetcher(url, access_token))

  async function getAvailableAssignmentsForCourse(course_uuid: string) {
    const res = await getAssignmentsFromACourse(course_uuid, access_token)
    return res.data
  }

  function removeAssignmentPrefix(assignment_uuid: string) {
    return assignment_uuid.replace('assignment_', '')
  }

  function removeCoursePrefix(course_uuid: string) {
    return course_uuid.replace('course_', '')
  }


  React.useEffect(() => {
    if (courses) {
      const course_uuids = courses.map((course: any) => course.course_uuid)
      const courseAssignmentsPromises = course_uuids.map((course_uuid: string) => getAvailableAssignmentsForCourse(course_uuid))
      Promise.all(courseAssignmentsPromises).then((results) => {
        setCourseAssignments(results)
      })
    }
  }, [courses])


  return (
    <div className='flex w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <div className='pl-4 sm:pl-10 mr-4 sm:mr-10 tracking-tighter flex flex-col space-y-5 w-full'>
        <div className='flex flex-col space-y-2'>
          <BreadCrumbs type="assignments" />
          <h1 className="pt-3 flex font-bold text-4xl text-white">Assignments</h1>
        </div>
        <div className='flex flex-col space-y-3 w-full'>
          {courseAssignments.map((assignments: any, index: number) => (
            <div key={index} className='flex flex-col space-y-2 bg-black/20 backdrop-blur-xl border border-purple-500/30 nice-shadow p-3 sm:p-4 rounded-xl w-full'>
              <div>
                <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center justify-between w-full'>
                  <div className='flex space-x-2 items-center'>
                    <MiniThumbnail course={courses[index]} />
                    <div className='flex flex-col font-bold text-lg'>
                      <p className='bg-purple-500/30 text-purple-200 px-2 text-xs py-0.5 rounded-full w-fit backdrop-blur-md border border-purple-400/30'>Course</p>
                      <p className='text-white'>{courses[index].name}</p>
                    </div>
                  </div>
                  <Link
                    href={{
                      pathname: getUriWithOrg(org.slug, `/dash/courses/course/${removeCoursePrefix(courses[index].course_uuid)}/content`),
                      query: { subpage: 'editor' }
                    }}
                    prefetch
                    className='bg-purple-600/80 backdrop-blur-md border border-purple-500/50 hover:bg-purple-500/80 transition-all duration-200 font-semibold text-sm text-white rounded-md flex space-x-1.5 nice-shadow items-center px-3 py-1'>
                    <GalleryVerticalEnd size={15} />
                    <p>Course Editor</p>
                  </Link>
                </div>

                {assignments && assignments.map((assignment: any) => (
                  <div key={assignment.assignment_uuid} className='flex mt-3 p-2 sm:p-3 rounded flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full backdrop-blur-md bg-slate-800/40 border border-purple-400/20 justify-between items-start sm:items-center'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2'>
                      <div className='flex text-xs font-bold bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full h-fit backdrop-blur-md border border-purple-400/30'>
                        <p>Assignment</p>
                      </div>
                      <div className='flex font-semibold text-lg text-white'>{assignment.title}</div>
                      <div className='flex font-semibold text-purple-200 px-2 py-0.5 rounded border border-purple-400/30 bg-purple-500/20 backdrop-blur-md'>{assignment.description}</div>
                    </div>
                    <div className='flex space-x-2 font-bold text-sm items-center'>
                      <EllipsisVertical className='text-purple-300' size={17} />
                      <Link
                        href={{
                          pathname: getUriWithOrg(org.slug, `/dash/assignments/${removeAssignmentPrefix(assignment.assignment_uuid)}`),
                          query: { subpage: 'editor' }
                        }}
                        prefetch
                        className='bg-cyan-600/80 backdrop-blur-md border border-cyan-500/50 hover:bg-cyan-500/80 transition-all duration-200 text-white rounded-full flex space-x-2 nice-shadow items-center px-3 py-0.5'>
                        <Layers2 size={15} />
                        <p>Editor</p>
                      </Link>
                      <Link
                        href={{
                          pathname: getUriWithOrg(org.slug, `/dash/assignments/${removeAssignmentPrefix(assignment.assignment_uuid)}`),
                          query: { subpage: 'submissions' }
                        }}
                        prefetch
                        className='bg-emerald-600/80 backdrop-blur-md border border-emerald-500/50 hover:bg-emerald-500/80 transition-all duration-200 text-white rounded-full flex space-x-2 nice-shadow items-center px-3 py-0.5'>
                        <UserRoundPen size={15} />
                        <p>Submissions</p>
                      </Link>
                    </div>
                  </div>
                ))}

                {assignments.length === 0 && (
                  <>
                    <div className='flex mx-auto space-x-2 font-semibold mt-3 text-purple-200 items-center'>
                      <Info size={20} />
                      <p>No assignments available for this course, create course assignments from the course editor</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const MiniThumbnail = (props: { course: any }) => {
  const org = useOrg() as any

  // function to remove "course_" from the course_uuid
  function removeCoursePrefix(course_uuid: string) {
    return course_uuid.replace('course_', '')
  }

  return (
    <Link
      href={getUriWithOrg(
        org.orgslug,
        '/course/' + removeCoursePrefix(props.course.course_uuid)
      )}
    >
      {props.course.thumbnail_image ? (
        <div
          className="inset-0 ring-1 ring-inset ring-black/10 rounded-lg shadow-xl w-[70px] h-[40px]   bg-cover"
          style={{
            backgroundImage: `url(${getCourseThumbnailMediaDirectory(
              org?.org_uuid,
              props.course.course_uuid,
              props.course.thumbnail_image
            )})`,
          }}
        />
      ) : (
        <div
          className="inset-0 ring-1 ring-inset ring-black/10 rounded-lg shadow-xl w-[70px] h-[40px] bg-cover"
          style={{
            backgroundImage: `url('../empty_thumbnail.png')`,
            backgroundSize: 'contain',
          }}
        />
      )}
    </Link>
  )
}


export default AssignmentsHome
