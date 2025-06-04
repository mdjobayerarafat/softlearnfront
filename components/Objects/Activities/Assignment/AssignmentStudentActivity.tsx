import { useAssignments } from '@components/Contexts/Assignments/AssignmentContext';
import { useCourse } from '@components/Contexts/CourseContext';
import { useOrg } from '@components/Contexts/OrgContext';
import { getTaskRefFileDir } from '@services/media/media';
import TaskFileObject from 'app/orgs/[orgslug]/dash/assignments/[assignmentuuid]/_components/TaskEditor/Subs/TaskTypes/TaskFileObject';
import TaskQuizObject from 'app/orgs/[orgslug]/dash/assignments/[assignmentuuid]/_components/TaskEditor/Subs/TaskTypes/TaskQuizObject'
import { Backpack, Calendar, Download, EllipsisVertical, Info } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'

function AssignmentStudentActivity() {
  const assignments = useAssignments() as any;
  const course = useCourse() as any;
  const org = useOrg() as any;

  useEffect(() => {
  }, [assignments, org])


  return (
    <div className='flex flex-col space-y-4 md:space-y-6'>
      <div className='flex flex-col md:flex-row justify-center md:space-x-3 space-y-3 md:space-y-0 items-center'>
        <div className='text-xs h-fit flex space-x-3 items-center'>
          <div className='flex gap-2 py-2 px-4 md:px-5 h-fit text-sm text-purple-300 bg-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-full shadow-lg shadow-purple-500/20 items-center'>
            <Backpack size={14} className="md:size-[14px]" />
            <p className='font-semibold'>Assignment</p>
          </div>
        </div>
        <div>
          <div className='flex gap-2 items-center'>
            <EllipsisVertical className='text-slate-400 hidden md:block' size={18} />
            <div className='flex gap-2 items-center'>
              <div className='flex gap-1 md:space-x-2 text-xs items-center text-slate-300'>
                <Calendar size={14} />
                <p className='font-semibold'>Due Date</p>
                <p className='font-semibold text-white'>{assignments?.assignment_object?.due_date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      
      {assignments?.assignment_object?.description && (
        <div className='flex flex-col space-y-2 p-4 md:p-6 bg-slate-900/40 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10'>
          <div className='flex flex-col space-y-3'>
            <div className='flex items-center gap-2 text-white'>
              <Info size={16} className="text-purple-400" />
              <h3 className='text-sm font-semibold'>Assignment Description</h3>
            </div>
            <div className='pl-6'>
              <p className='text-sm leading-relaxed text-slate-300'>{assignments.assignment_object.description}</p>
            </div>
          </div>
        </div>
      )}
      
      
      {assignments && assignments?.assignment_tasks?.sort((a: any, b: any) => a.id - b.id).map((task: any, index: number) => {
        return (
          <div className='flex flex-col space-y-2' key={task.assignment_task_uuid}>
            <div className='flex flex-col md:flex-row md:justify-between py-2 space-y-2 md:space-y-0'>
              <div className='flex flex-wrap space-x-2 font-semibold text-slate-800'>
                <p>Task {index + 1} : </p>
                <p className='text-slate-500 break-words'>{task.description}</p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <div
                  onClick={() => alert(task.hint)}
                  className='px-3 py-1 flex items-center nice-shadow bg-amber-50/40 text-amber-900 rounded-full space-x-2 cursor-pointer'>
                  <Info size={13} />
                  <p className='text-xs font-semibold'>Hint</p>
                </div>
                <Link
                  href={getTaskRefFileDir(
                    org?.org_uuid,
                    assignments?.course_object.course_uuid,
                    assignments?.activity_object.activity_uuid,
                    assignments?.assignment_object.assignment_uuid,
                    task.assignment_task_uuid,
                    task.reference_file
                  )}
                  target='_blank'
                  download={true}
                  className='px-3 py-1 flex items-center nice-shadow bg-cyan-50/40 text-cyan-900 rounded-full space-x-1 md:space-x-2 cursor-pointer'>
                  <Download size={13} />
                  <div className='flex items-center space-x-1 md:space-x-2'>
                    {task.reference_file && (
                      <span className='relative'>
                        <span className='absolute right-0 top-0 block h-2 w-2 rounded-full ring-2 ring-white bg-green-400'></span>
                      </span>
                    )}
                    <p className='text-xs font-semibold'>Reference Document</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className='w-full'>
              {task.assignment_type === 'QUIZ' && <TaskQuizObject key={task.assignment_task_uuid} view='student' assignmentTaskUUID={task.assignment_task_uuid} />}
              {task.assignment_type === 'FILE_SUBMISSION' && <TaskFileObject key={task.assignment_task_uuid} view='student' assignmentTaskUUID={task.assignment_task_uuid} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AssignmentStudentActivity