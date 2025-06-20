'use client';
import BreadCrumbs from '@components/Dashboard/Misc/BreadCrumbs'
import { ArrowRight, BookOpen, BookX, EllipsisVertical, Eye, Layers2, Monitor, Pencil, UserRoundPen } from 'lucide-react'
import React, { useEffect } from 'react'
import { AssignmentProvider, useAssignments } from '@components/Contexts/Assignments/AssignmentContext';
import ToolTip from '@components/Objects/StyledElements/Tooltip/Tooltip';
import { updateAssignment } from '@services/courses/assignments';
import { useLHSession } from '@components/Contexts/LHSessionContext';
import { mutate } from 'swr';
import { getAPIUrl } from '@services/config/config';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { updateActivity } from '@services/courses/activities';
// Lazy Loading
import dynamic from 'next/dynamic';
import AssignmentEditorSubPage from './subpages/AssignmentEditorSubPage';
import { useMediaQuery } from 'usehooks-ts';
import EditAssignmentModal from '@components/Objects/Modals/Activities/Assignments/EditAssignmentModal';
const AssignmentSubmissionsSubPage = dynamic(() => import('./subpages/AssignmentSubmissionsSubPage'))

function AssignmentEdit() {
    const params = useParams<{ assignmentuuid: string; }>()
    const searchParams = useSearchParams()
    const [selectedSubPage, setSelectedSubPage] = React.useState(searchParams.get('subpage') || 'editor')
    const isMobile = useMediaQuery('(max-width: 767px)')

    if (isMobile) {
        // TODO: Work on a better mobile experience
        return (
          <div className="h-screen w-full bg-[#f8f8f8] flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-4">Desktop Only</h2>
              <Monitor className='mx-auto my-5' size={60} />    
              <p>This page is only accessible from a desktop device.</p>
              <p>Please switch to a desktop to view and manage the assignment.</p>
            </div>
          </div>
        )
    }
    
    return (
        <div className='flex w-full flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen'>
            <AssignmentProvider assignment_uuid={'assignment_' + params.assignmentuuid}>
                <div className='flex flex-col bg-black/20 backdrop-blur-xl border border-purple-500/30 z-50 shadow-lg shadow-purple-500/10'>
                    <div className='flex justify-between mr-10 h-full'>
                        <div className="pl-10 mr-10 tracking-tighter">
                            <BrdCmpx />
                            <div className="w-100 flex justify-between">
                                <div className="flex font-bold text-2xl text-white">
                                    <AssignmentTitle />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-center antialiased'>
                            <PublishingState />
                        </div>
                    </div>
                    <div className='flex space-x-2 pt-2 text-sm tracking-tight font-semibold pl-10 mr-10'>
                        <div
                            onClick={() => setSelectedSubPage('editor')}
                            className={`flex space-x-4 py-2 w-fit text-center border-purple-400 transition-all ease-linear ${selectedSubPage === 'editor'
                                ? 'border-b-4 text-purple-300'
                                : 'opacity-50 text-slate-300 hover:opacity-75'
                                } cursor-pointer`}
                        >
                            <div className="flex items-center space-x-2.5 mx-2">
                                <Layers2 size={16} />
                                <div>Editor</div>
                            </div>
                        </div>
                        <div
                            onClick={() => setSelectedSubPage('submissions')}
                            className={`flex space-x-4 py-2 w-fit text-center border-purple-400 transition-all ease-linear ${selectedSubPage === 'submissions'
                                ? 'border-b-4 text-purple-300'
                                : 'opacity-50 text-slate-300 hover:opacity-75'
                                } cursor-pointer`}
                        >
                            <div className="flex items-center space-x-2.5 mx-2">
                                <UserRoundPen size={16} />
                                <div>Submissions</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex h-full w-full">
                    {selectedSubPage === 'editor' && <AssignmentEditorSubPage assignmentuuid={params.assignmentuuid} />}
                    {selectedSubPage === 'submissions' && <AssignmentSubmissionsSubPage assignment_uuid={params.assignmentuuid} />}
                </div>
            </AssignmentProvider>
        </div>
    )
}

export default AssignmentEdit

function BrdCmpx() {
    const assignment = useAssignments() as any

    useEffect(() => {
    }, [assignment])

    return (
        <BreadCrumbs type="assignments" last_breadcrumb={assignment?.assignment_object?.title} />
    )
}

function PublishingState() {
    const assignment = useAssignments() as any;
    const session = useLHSession() as any;
    const access_token = session?.data?.tokens?.access_token;
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

    async function updateAssignmentPublishState(assignmentUUID: string) {
        const res = await updateAssignment({ published: !assignment?.assignment_object?.published }, assignmentUUID, access_token)
        const res2 = await updateActivity({ published: !assignment?.assignment_object?.published }, assignment?.activity_object?.activity_uuid, access_token)
        const toast_loading = toast.loading('Updating assignment...')
        if (res.success && res2) {
            mutate(`${getAPIUrl()}assignments/${assignmentUUID}`)
            toast.success('The assignment has been updated successfully')
            toast.dismiss(toast_loading)
        }
        else {
            toast.error('Error updating assignment, please retry later.')
        }
    }

    useEffect(() => {
    }, [assignment])

    return (
        <>
            <div className='flex mx-auto mt-5 items-center space-x-4'>
                <div className={`flex text-xs rounded-full px-3.5 py-2 mx-auto font-bold backdrop-blur-xl border ${!assignment?.assignment_object?.published ? 'border-slate-500/50 bg-slate-800/80 text-slate-300' : 'border-emerald-500/50 bg-emerald-800/80 text-emerald-300'}`}>
                    {assignment?.assignment_object?.published ? 'Published' : 'Unpublished'}
                </div>
                <div><EllipsisVertical className='text-slate-400' size={13} /></div>

                <ToolTip
                    side='left'
                    slateBlack
                    sideOffset={10}
                    content="Edit Assignment Details">
                    <div
                        onClick={() => setIsEditModalOpen(true)}
                        className='flex px-3 py-2 cursor-pointer rounded-md space-x-2 items-center text-blue-300 font-medium bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 shadow-lg shadow-blue-500/20 hover:bg-blue-600/30 transition-all'>
                        <Pencil size={18} />
                        <p className='text-sm font-bold'>Edit</p>
                    </div>
                </ToolTip>

                <ToolTip
                    side='left'
                    slateBlack
                    sideOffset={10}
                    content="Preview the Assignment as a student" >
                    <Link
                        target='_blank'
                        href={`/course/${assignment?.course_object?.course_uuid.replace('course_', '')}/activity/${assignment?.activity_object?.activity_uuid.replace('activity_', '')}`}
                        className='flex px-3 py-2 cursor-pointer rounded-md space-x-2 items-center text-cyan-300 font-medium bg-cyan-600/20 backdrop-blur-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20 hover:bg-cyan-600/30 transition-all'>
                        <Eye size={18} />
                        <p className=' text-sm font-bold'>Preview</p>
                    </Link>
                </ToolTip>
                {assignment?.assignment_object?.published && <ToolTip
                    side='left'
                    slateBlack
                    sideOffset={10}
                    content="Make your Assignment unavailable for students" >
                    <div
                        onClick={() => updateAssignmentPublishState(assignment?.assignment_object?.assignment_uuid)}
                        className='flex px-3 py-2 cursor-pointer rounded-md space-x-2 items-center text-slate-300 font-medium bg-slate-600/20 backdrop-blur-xl border border-slate-500/30 shadow-lg shadow-slate-500/20 hover:bg-slate-600/30 transition-all'>
                        <BookX size={18} />
                        <p className='text-sm font-bold'>Unpublish</p>
                    </div>
                </ToolTip>}
                {!assignment?.assignment_object?.published &&
                    <ToolTip
                        side='left'
                        slateBlack
                        sideOffset={10}
                        content="Make your Assignment public and available for students" >
                        <div
                            onClick={() => updateAssignmentPublishState(assignment?.assignment_object?.assignment_uuid)}
                            className='flex px-3 py-2 cursor-pointer rounded-md space-x-2 items-center text-emerald-300 font-medium bg-emerald-600/20 backdrop-blur-xl border border-emerald-500/30 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600/30 transition-all'>
                            <BookOpen size={18} />
                            <p className=' text-sm font-bold'>Publish</p>
                        </div>
                    </ToolTip>}
            </div>
            {isEditModalOpen && (
                <EditAssignmentModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    assignment={assignment?.assignment_object}
                    accessToken={access_token}
                />
            )}
        </>
    )
}

function AssignmentTitle() {
    const assignment = useAssignments() as any;
    
    return (
        <div className="flex items-center gap-2">
            Assignment Tools 
        </div>
    );
}
