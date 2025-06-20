import { useAssignments } from '@components/Contexts/Assignments/AssignmentContext';
import { BookOpenCheck, Check, Download, Info, MoveRight, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import TaskQuizObject from '../../_components/TaskEditor/Subs/TaskTypes/TaskQuizObject';
import TaskFileObject from '../../_components/TaskEditor/Subs/TaskTypes/TaskFileObject';
import { useOrg } from '@components/Contexts/OrgContext';
import { getTaskRefFileDir } from '@services/media/media';
import { deleteUserSubmission, markActivityAsDoneForUser, putFinalGrade } from '@services/courses/assignments';
import { useLHSession } from '@components/Contexts/LHSessionContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function EvaluateAssignment({ user_id }: any) {
    const assignments = useAssignments() as any;
    const session = useLHSession() as any;
    const org = useOrg() as any;

    async function gradeAssignment() {
        const res = await putFinalGrade(user_id, assignments?.assignment_object.assignment_uuid, session.data?.tokens?.access_token);
        if (res.success) {
            toast.success(res.data.message)
        }
        else {
            toast.error(res.data.message)
        }
    }

    async function markActivityAsDone() {
        const res = await markActivityAsDoneForUser(user_id, assignments?.assignment_object.assignment_uuid, session.data?.tokens?.access_token)
        if (res.success) {
            toast.success(res.data.message)
        }
        else {
            toast.error(res.data.message)
        }
    }

    async function rejectAssignment() {
        const res = await deleteUserSubmission(user_id, assignments?.assignment_object.assignment_uuid, session.data?.tokens?.access_token)
        toast.success('Assignment rejected successfully')
        window.location.reload()
    }

    return (
        <div className='flex-col space-y-4 px-3 py-3 overflow-y-auto min-h-fit bg-slate-900/20 backdrop-blur-xl rounded-lg'>
            {assignments && assignments?.assignment_tasks?.sort((a: any, b: any) => a.id - b.id).map((task: any, index: number) => {
                return (
                    <div className='flex flex-col space-y-2 bg-black/20 backdrop-blur-xl border border-purple-500/30 rounded-lg p-4 shadow-lg shadow-purple-500/10' key={task.assignment_task_uuid}>
                        <div className='flex justify-between py-2'>
                            <div className='flex space-x-2 font-semibold text-purple-300'>
                                <p>Task {index + 1} : </p>
                                <p className='text-slate-400'>{task.description}</p>
                            </div>
                            <div className='flex space-x-2'>
                                <div
                                    onClick={() => alert(task.hint)}
                                    className='px-3 py-1 flex items-center backdrop-blur-xl border border-amber-400/30 bg-amber-600/20 text-amber-300 rounded-full space-x-2 cursor-pointer hover:bg-amber-600/30 transition-all shadow-lg shadow-amber-500/20'>
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
                                    className='px-3 py-1 flex items-center backdrop-blur-xl border border-cyan-400/30 bg-cyan-600/20 text-cyan-300 rounded-full space-x-2 cursor-pointer hover:bg-cyan-600/30 transition-all shadow-lg shadow-cyan-500/20'>
                                    <Download size={13} />
                                    <div className='flex items-center space-x-2'>
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
                        <div className='min-h-full'>
                            {task.assignment_type === 'QUIZ' && <TaskQuizObject key={task.assignment_task_uuid} view='grading' user_id={user_id} assignmentTaskUUID={task.assignment_task_uuid} />}
                            {task.assignment_type === 'FILE_SUBMISSION' && <TaskFileObject key={task.assignment_task_uuid} view='custom-grading' user_id={user_id} assignmentTaskUUID={task.assignment_task_uuid} />}
                        </div>
                    </div>
                )
            })}
            <div className='flex space-x-4 font-semibold items-center justify-between'>
                <button onClick={rejectAssignment} className='flex space-x-2 px-4 py-2 text-sm bg-rose-600/90 backdrop-blur-xl border border-rose-400/30 text-white rounded-lg shadow-lg shadow-rose-500/20 items-center cursor-pointer hover:bg-rose-600/70 transition-all'>
                    <X size={18} />
                    <span>Reject Assignment</span>
                </button>
                <div className='flex space-x-3 items-center'>
                    <button onClick={gradeAssignment} className='flex space-x-2 px-4 py-2 text-sm bg-purple-600/90 backdrop-blur-xl border border-purple-400/30 text-white rounded-lg shadow-lg shadow-purple-500/20 items-center cursor-pointer hover:bg-purple-600/70 transition-all'>
                        <BookOpenCheck size={18} />
                        <span>Set final grade</span>
                    </button>
                    <MoveRight className='text-purple-400' size={18} />
                    <button onClick={markActivityAsDone} className='flex space-x-2 px-4 py-2 text-sm bg-emerald-600/90 backdrop-blur-xl border border-emerald-400/30 text-white rounded-lg shadow-lg shadow-emerald-500/20 items-center cursor-pointer hover:bg-emerald-600/70 transition-all'>
                        <Check size={18} />
                        <span>Mark Activity as Done for User</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EvaluateAssignment