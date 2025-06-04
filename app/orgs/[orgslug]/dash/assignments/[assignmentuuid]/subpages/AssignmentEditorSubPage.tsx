'use client';
import { AssignmentsTaskProvider } from '@components/Contexts/Assignments/AssignmentsTaskContext'
import { LayoutList } from 'lucide-react'
import React from 'react'
import AssignmentTasks from '../_components/Tasks'
import { AssignmentProvider } from '@components/Contexts/Assignments/AssignmentContext'
import dynamic from 'next/dynamic';
const AssignmentTaskEditor = dynamic(() => import('../_components/TaskEditor/TaskEditor'))

function AssignmentEditorSubPage({ assignmentuuid }: { assignmentuuid: string }) {
    return (
        <AssignmentsTaskProvider>
            <div className='flex w-[400px] flex-col h-full bg-slate-900/40 backdrop-blur-xl border-r border-purple-500/30'>
                <div className='flex mx-auto px-3.5 py-1 bg-purple-600/80 backdrop-blur-xl space-x-2 my-5 items-center text-sm font-bold text-white rounded-full border border-purple-400/30 shadow-lg shadow-purple-500/20'>
                    <LayoutList size={18} />
                    <p>Tasks</p>
                </div>
                <AssignmentTasks assignment_uuid={'assignment_' + assignmentuuid} />
            </div>
            <div className='flex grow bg-slate-900/20 backdrop-blur-xl shadow-lg shadow-purple-500/10 h-full w-full border border-purple-500/20'>
                <AssignmentProvider assignment_uuid={'assignment_' + assignmentuuid}>
                    <AssignmentTaskEditor page='general' />
                </AssignmentProvider>
            </div>
        </AssignmentsTaskProvider>
    )
}

export default AssignmentEditorSubPage