'use client';
import { useAssignments } from '@components/Contexts/Assignments/AssignmentContext';
import { useAssignmentsTask, useAssignmentsTaskDispatch } from '@components/Contexts/Assignments/AssignmentsTaskContext';
import { useLHSession } from '@components/Contexts/LHSessionContext';
import { getAPIUrl } from '@services/config/config';
import { deleteAssignmentTask } from '@services/courses/assignments';
import { GalleryVerticalEnd, Info, TentTree, Trash } from 'lucide-react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import dynamic from 'next/dynamic';
import { AssignmentTaskGeneralEdit } from './Subs/AssignmentTaskGeneralEdit';
const AssignmentTaskContentEdit = dynamic(() => import('./Subs/AssignmentTaskContentEdit'))

function AssignmentTaskEditor({ page }: any) {
    const [selectedSubPage, setSelectedSubPage] = React.useState(page)
    const assignment = useAssignments() as any
    const assignmentTaskState = useAssignmentsTask() as any
    const assignmentTaskStateHook = useAssignmentsTaskDispatch() as any
    const session = useLHSession() as any;
    const access_token = session?.data?.tokens?.access_token;

    async function deleteTaskUI() {
        const res = await deleteAssignmentTask(assignmentTaskState.assignmentTask.assignment_task_uuid, assignment.assignment_object.assignment_uuid, access_token)
        if (res) {
            assignmentTaskStateHook({
                type: 'SET_MULTIPLE_STATES',
                payload: {
                    selectedAssignmentTaskUUID: null,
                    assignmentTask: {},
                },
            });
            mutate(`${getAPIUrl()}assignments/${assignment.assignment_object.assignment_uuid}/tasks`)
            mutate(`${getAPIUrl()}assignments/${assignment.assignment_object.assignment_uuid}`)
            toast.success('Task deleted successfully')
        } else {
            toast.error('Error deleting task, please retry later.')
        }
    }

    useEffect(() => {
        // Switch back to general page if the selectedAssignmentTaskUUID is changed 
        if (assignmentTaskState.selectedAssignmentTaskUUID !== assignmentTaskState.assignmentTask.assignment_task_uuid) {
            setSelectedSubPage('general')
        }
    }
        , [assignmentTaskState, assignmentTaskStateHook, selectedSubPage, assignment])

    return (
        <div className="flex flex-col font-black text-sm w-full z-20">
            {assignmentTaskState.assignmentTask && Object.keys(assignmentTaskState.assignmentTask).length > 0 && (
                <div className='flex flex-col space-y-3'>
                    <div className='flex flex-col bg-black/20 backdrop-blur-xl border border-purple-500/30 pl-10 pr-10 text-sm tracking-tight z-10 shadow-lg shadow-purple-500/10 pt-5 mb-3 rounded-lg'>
                        <div className='flex py-1 justify-between items-center'>
                            <div className='font-semibold text-lg text-white'>
                                {assignmentTaskState?.assignmentTask.title}
                            </div>
                            <div>
                                <div
                                    onClick={() => deleteTaskUI()}
                                    className='flex px-2 py-1.5 cursor-pointer rounded-md space-x-2 items-center bg-rose-600/90 backdrop-blur-xl border border-rose-400/30 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600/70 transition-all'>
                                    <Trash size={18} />
                                    <p className='text-xs font-semibold'>Delete Task</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex space-x-2'>
                            <div
                                onClick={() => setSelectedSubPage('general')}
                                className={`flex space-x-4 py-2 w-fit text-center border-purple-400 transition-all ease-linear ${selectedSubPage === 'general'
                                    ? 'border-b-4 text-purple-300'
                                    : 'opacity-50 text-slate-300'
                                    } cursor-pointer hover:opacity-100`}
                            >
                                <div className="flex items-center space-x-2.5 mx-2">
                                    <Info size={16} />
                                    <div>General</div>
                                </div>
                            </div>
                            <div
                                onClick={() => setSelectedSubPage('content')}
                                className={`flex space-x-4 py-2 w-fit text-center border-purple-400 transition-all ease-linear ${selectedSubPage === 'content'
                                    ? 'border-b-4 text-purple-300'
                                    : 'opacity-50 text-slate-300'
                                    } cursor-pointer hover:opacity-100`}
                            >
                                <div className="flex items-center space-x-2.5 mx-2">
                                    <GalleryVerticalEnd size={16} />
                                    <div>Content</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='ml-10 mr-10 mt-10 mx-auto bg-slate-900/40 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10 px-6 py-5'>
                        {selectedSubPage === 'general' && <AssignmentTaskGeneralEdit />}
                        {selectedSubPage === 'content' && <AssignmentTaskContentEdit />}
                    </div>
                </div>
            )}
            {Object.keys(assignmentTaskState.assignmentTask).length == 0 && (
                <div className='flex flex-col h-full bg-black/20 backdrop-blur-xl border border-purple-500/30 pl-10 pr-10 text-sm tracking-tight z-10 shadow-lg shadow-purple-500/10 pt-5 rounded-lg'>
                    <div className='flex justify-center items-center h-full text-purple-300 antialiased'>
                        <div className='flex flex-col space-y-2 items-center'>
                            <TentTree size={60} />
                            <div className='font-semibold text-2xl py-1'>
                                No Task Selected
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}



export default AssignmentTaskEditor