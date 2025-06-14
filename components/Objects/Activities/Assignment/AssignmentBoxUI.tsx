import { useAssignmentSubmission } from '@components/Contexts/Assignments/AssignmentSubmissionContext'
import { BookPlus, BookUser, EllipsisVertical, FileUp, Forward, InfoIcon, ListTodo, Save } from 'lucide-react'
import React, { useEffect } from 'react'
import { useLHSession } from '@components/Contexts/LHSessionContext'

type AssignmentBoxProps = {
    type: 'quiz' | 'file'
    view?: 'teacher' | 'student' | 'grading' | 'custom-grading'
    maxPoints?: number
    currentPoints?: number
    saveFC?: () => void
    submitFC?: () => void
    gradeFC?: () => void
    gradeCustomFC?: (grade: number) => void
    showSavingDisclaimer?: boolean
    children: React.ReactNode
}

function AssignmentBoxUI({ type, view, currentPoints, maxPoints, saveFC, submitFC, gradeFC, gradeCustomFC, showSavingDisclaimer, children }: AssignmentBoxProps) {
    const [customGrade, setCustomGrade] = React.useState<number>(0)
    const submission = useAssignmentSubmission() as any
    const session = useLHSession() as any
    
    useEffect(() => {
        console.log(submission)
    }, [submission])

    // Check if user is authenticated
    const isAuthenticated = session?.status === 'authenticated'

    return (
        <div className='flex flex-col px-3 sm:px-6 py-4 backdrop-blur-xl border border-purple-500/30 rounded-lg bg-black/20 shadow-lg shadow-purple-500/10'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:space-x-2 pb-2 text-purple-300/80 sm:items-center'>
                {/* Left side with type and badges */}
                <div className='flex flex-wrap gap-2 items-center mb-2 sm:mb-0'>
                    <div className='text-lg font-semibold text-purple-300'>
                        {type === 'quiz' &&
                            <div className='flex space-x-1.5 items-center'>
                                <ListTodo size={17} />
                                <p>Quiz</p>
                            </div>}
                        {type === 'file' &&
                            <div className='flex space-x-1.5 items-center'>
                                <FileUp size={17} />
                                <p>File Submission</p>
                            </div>}
                    </div>

                    <div className='flex items-center space-x-1'>
                        <EllipsisVertical size={15} />
                    </div>

                    {view === 'teacher' &&
                        <div className='flex bg-amber-500/20 text-xs rounded-full space-x-1 px-2 py-0.5 font-bold border border-amber-400/30 items-center text-amber-300'>
                            <BookUser size={12} />
                            <p>Teacher view</p>
                        </div>
                    }
                    {maxPoints &&
                        <div className='flex bg-emerald-500/20 text-xs rounded-full space-x-1 px-2 py-0.5 font-bold border border-emerald-400/30 items-center text-emerald-300'>
                            <BookPlus size={12} />
                            <p>{maxPoints} points</p>
                        </div>
                    }
                </div>

                {/* Right side with buttons and actions */}
                <div className='flex flex-wrap gap-2 items-center'>
                    {showSavingDisclaimer &&
                        <div className='flex space-x-2 items-center font-semibold px-3 py-1 border border-red-400/30 bg-red-500/20 text-red-300 sm:mr-5 rounded-full w-full sm:w-auto mb-2 sm:mb-0'>
                            <InfoIcon size={14} />
                            <p className='text-xs'>Don't forget to save your progress</p>
                        </div>
                    }

                    {/* Teacher button */}
                    {view === 'teacher' &&
                        <div
                            onClick={() => saveFC && saveFC()}
                            className='flex px-2 py-1 cursor-pointer rounded-md space-x-2 items-center bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 transition-all duration-200 shadow-lg shadow-emerald-500/20'>
                            <Save size={14} />
                            <p className='text-xs font-semibold'>Save</p>
                        </div>
                    }

                    {/* Student button - only show if authenticated */}
                    {view === 'student' && isAuthenticated && submission && submission.length <= 0 &&
                        <div
                            onClick={() => submitFC && submitFC()}
                            className='flex px-2 py-1 cursor-pointer rounded-md space-x-2 items-center justify-center mx-auto w-full sm:w-auto bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 transition-all duration-200 shadow-lg shadow-emerald-500/20'>
                            <Forward size={14} />
                            <p className='text-xs font-semibold'>Save your progress</p>
                        </div>
                    }

                    {/* Grading button */}
                    {view === 'grading' &&
                        <div className='flex flex-wrap sm:flex-nowrap w-full sm:w-auto px-0.5 py-0.5 cursor-pointer rounded-md gap-2 sm:space-x-2 items-center backdrop-blur-xl border border-orange-400/30 bg-orange-500/20 shadow-lg shadow-orange-500/20'>
                            <p className='font-semibold px-2 text-xs text-orange-300'>Current points: {currentPoints}</p>
                            <div
                                onClick={() => gradeFC && gradeFC()}
                                className='bg-orange-500/20 backdrop-blur-xl border border-orange-400/30 text-orange-300 hover:bg-orange-500/30 items-center flex rounded-md px-2 py-1 space-x-2 ml-auto transition-all duration-200'>
                                <BookPlus size={14} />
                                <p className='text-xs font-semibold'>Grade</p>
                            </div>
                        </div>
                    }

                    {/* CustomGrading button */}
                    {view === 'custom-grading' && maxPoints &&
                        <div className='flex flex-wrap sm:flex-nowrap w-full sm:w-auto px-0.5 py-0.5 cursor-pointer rounded-md gap-2 sm:space-x-2 items-center backdrop-blur-xl border border-orange-400/30 bg-orange-500/20 shadow-lg shadow-orange-500/20'>
                            <p className='font-semibold px-2 text-xs text-orange-300 w-full sm:w-auto'>Current points: {currentPoints}</p>
                            <div className='flex items-center gap-2 w-full sm:w-auto'>
                                <input
                                    onChange={(e) => setCustomGrade(parseInt(e.target.value))}
                                    placeholder={maxPoints.toString()} 
                                    className='w-full sm:w-[100px] backdrop-blur-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm py-0.5 rounded-lg px-2 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30' 
                                    type="number" 
                                />
                                <div
                                    onClick={() => gradeCustomFC && gradeCustomFC(customGrade)}
                                    className='bg-orange-500/20 backdrop-blur-xl border border-orange-400/30 text-orange-300 hover:bg-orange-500/30 items-center flex rounded-md px-2 py-1 space-x-2 whitespace-nowrap transition-all duration-200'>
                                    <BookPlus size={14} />
                                    <p className='text-xs font-semibold'>Grade</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {children}
        </div>
    )
}

export default AssignmentBoxUI