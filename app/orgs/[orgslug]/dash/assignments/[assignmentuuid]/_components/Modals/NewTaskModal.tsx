import { useAssignmentsTaskDispatch } from '@components/Contexts/Assignments/AssignmentsTaskContext';
import { useLHSession } from '@components/Contexts/LHSessionContext';
import { getAPIUrl } from '@services/config/config';
import { createAssignmentTask } from '@services/courses/assignments'
import { AArrowUp, FileUp, ListTodo } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';
import { mutate } from 'swr';

function NewTaskModal({ closeModal, assignment_uuid }: any) {
  const session = useLHSession() as any;
  const access_token = session?.data?.tokens?.access_token;
  const reminderShownRef = React.useRef(false);
  const assignmentTaskStateHook = useAssignmentsTaskDispatch() as any

  function showReminderToast() {
    // Check if the reminder has already been shown using sessionStorage
    if (sessionStorage.getItem("TasksReminderShown") !== "true") {
      setTimeout(() => {
        toast('When editing/adding your tasks, make sure to Unpublish your Assignment to avoid any issues with students, you can Publish it again when you are ready.',
              { icon: '✋', duration: 10000, style: { minWidth: 600 }  });
        // Mark the reminder as shown in sessionStorage
        sessionStorage.setItem("TasksReminderShown", "true");
      }, 3000);
    }
  }

  async function createTask(type: string) {
    const task_object = {
      title: "Untitled Task",
      description: "",
      hint: "",
      reference_file: "",
      assignment_type: type,
      contents: {},
      max_grade_value: 100,
    }
    const res = await createAssignmentTask(task_object, assignment_uuid, access_token)
    toast.success('Task created successfully')
    showReminderToast()
    mutate(`${getAPIUrl()}assignments/${assignment_uuid}/tasks`)
    assignmentTaskStateHook({ type: 'setSelectedAssignmentTaskUUID', payload: res.data.assignment_task_uuid })
    closeModal(false)
  }


  return (
    <div className='flex space-x-6 mx-auto justify-center items-center'>
      <div
        onClick={() => createTask('QUIZ')}
        className='flex flex-col space-y-2 justify-center text-center pt-10'>
        <div className='px-5 py-5 rounded-full w-fit mx-auto bg-purple-600/20 backdrop-blur-xl border border-purple-400/30 text-purple-400 cursor-pointer hover:bg-purple-600/30 transition-all shadow-lg shadow-purple-500/20'>
          <ListTodo size={30} />
        </div>
        <p className='text-xl text-purple-300 font-semibold'>Quiz</p>
        <p className='text-sm text-slate-400 w-40'>Questions with multiple choice answers</p>
      </div>
      <div
        onClick={() => createTask('FILE_SUBMISSION')}
        className='flex flex-col space-y-2 justify-center text-center pt-10'>
        <div className='px-5 py-5 rounded-full w-fit mx-auto bg-cyan-600/20 backdrop-blur-xl border border-cyan-400/30 text-cyan-400 cursor-pointer hover:bg-cyan-600/30 transition-all shadow-lg shadow-cyan-500/20'>
          <FileUp size={30} />
        </div>
        <p className='text-xl text-cyan-300 font-semibold'>File submission</p>
        <p className='text-sm text-slate-400 w-40'>Students can submit files for this task</p>
      </div>
      <div
        onClick={() => toast.error('Forms are not yet supported')}
        className='flex flex-col space-y-2 justify-center text-center pt-10 opacity-25'>
        <div className='px-5 py-5 rounded-full w-fit mx-auto bg-slate-600/20 backdrop-blur-xl border border-slate-400/30 text-slate-400 cursor-pointer hover:bg-slate-600/30 transition-all'>
          <AArrowUp size={30} />
        </div>
        <p className='text-xl text-slate-300 font-semibold'>Form</p>
        <p className='text-sm text-slate-400 w-40'>Forms for students to fill out</p>
      </div>
    </div>
  )
}

export default NewTaskModal