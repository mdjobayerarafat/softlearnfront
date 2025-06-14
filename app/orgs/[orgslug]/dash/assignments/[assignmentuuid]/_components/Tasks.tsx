import { useAssignments } from '@components/Contexts/Assignments/AssignmentContext'
import Modal from '@components/Objects/StyledElements/Modal/Modal';
import { FileUp, ListTodo, PanelLeftOpen, Plus } from 'lucide-react';
import React, { useEffect } from 'react'
import NewTaskModal from './Modals/NewTaskModal';
import { useAssignmentsTask, useAssignmentsTaskDispatch } from '@components/Contexts/Assignments/AssignmentsTaskContext';

function AssignmentTasks({ assignment_uuid }: any) {
    const assignments = useAssignments() as any;
    const assignmentTask = useAssignmentsTask() as any;
    const assignmentTaskHook = useAssignmentsTaskDispatch() as any;
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = React.useState(false)

    async function setSelectTask(task_uuid: string) {
        assignmentTaskHook({ type: 'setSelectedAssignmentTaskUUID', payload: task_uuid })
    }

    useEffect(() => {
    }, [assignments])


    return (
        <div className='flex w-full'>
            <div className='flex flex-col space-y-3 mx-auto'>
                {assignments && assignments?.assignment_tasks?.length < 10 && (<Modal
                    isDialogOpen={isNewTaskModalOpen}
                    onOpenChange={setIsNewTaskModalOpen}
                    minHeight="sm"
                    minWidth='sm'
                    dialogContent={
                        <NewTaskModal assignment_uuid={assignment_uuid} closeModal={setIsNewTaskModalOpen} />
                    }
                    dialogTitle="Add an Assignment Task"
                    dialogDescription="Create a new task for this assignment"
                    dialogTrigger={
                        <div className='flex space-x-1.5 px-2 py-2 justify-center bg-purple-600/90 backdrop-blur-xl border border-purple-400/30 text-white text-xs rounded-md antialiased items-center font-semibold cursor-pointer hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20'>
                            <Plus size={17} />
                            <p>Add Task</p>
                        </div>
                    }
                />)}
                {assignments && assignments?.assignment_tasks?.map((task: any) => {
                    return (
                        <div
                            key={task.id}
                            className='flex flex-col w-[250px] bg-black/20 backdrop-blur-xl border border-purple-500/30 shadow-lg shadow-purple-500/10 p-3 rounded-md cursor-pointer hover:bg-black/30 transition-all'
                            onClick={() => setSelectTask(task.assignment_task_uuid)}
                        >
                            <div className='flex items-center px-2 justify-between'>
                                <div className="flex space-x-3 items-center">
                                    <div className='text-purple-400'>
                                        {task.assignment_type === 'QUIZ' && <ListTodo size={15} />}
                                        {task.assignment_type === 'FILE_SUBMISSION' && <FileUp size={15} />}
                                    </div>
                                    <div className='font-semibold text-sm text-white'>{task.title}</div>
                                </div>
                                <button className={`backdrop-blur-xl border border-purple-400/30 ${task.assignment_task_uuid == assignmentTask.selectedAssignmentTaskUUID ? 'bg-purple-600/50 text-purple-300' : 'bg-slate-800/50 text-slate-400'} hover:bg-purple-600/40 rounded-md font-bold py-2 px-3 ease-linear transition-all`}>
                                    <PanelLeftOpen size={16} />
                                </button>
                            </div>
                        </div>
                    )
                })}



            </div>

        </div>
    )
}

export default AssignmentTasks