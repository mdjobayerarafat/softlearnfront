import { useLHSession } from '@components/Contexts/LHSessionContext';
import UserAvatar from '@components/Objects/UserAvatar';
import Modal from '@components/Objects/StyledElements/Modal/Modal';
import { getAPIUrl } from '@services/config/config';
import { getUserAvatarMediaDirectory } from '@services/media/media';
import { swrFetcher } from '@services/utils/ts/requests';
import { SendHorizonal, UserCheck, X } from 'lucide-react';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import EvaluateAssignment from './Modals/EvaluateAssignment';
import { AssignmentProvider } from '@components/Contexts/Assignments/AssignmentContext';
import { AssignmentsTaskProvider } from '@components/Contexts/Assignments/AssignmentsTaskContext';
import AssignmentSubmissionProvider from '@components/Contexts/Assignments/AssignmentSubmissionContext';

function AssignmentSubmissionsSubPage({ assignment_uuid }: { assignment_uuid: string }) {
    const session = useLHSession() as any;
    const access_token = session?.data?.tokens?.access_token;

    const { data: assignmentSubmission, error: assignmentError } = useSWR(
        `${getAPIUrl()}assignments/assignment_${assignment_uuid}/submissions`,
        (url) => swrFetcher(url, access_token)
    );

    useEffect(() => {
        console.log(assignmentSubmission);
    }, [session, assignmentSubmission]);

    const renderSubmissions = (status: string) => {
        return assignmentSubmission
            ?.filter((submission: any) => submission.submission_status === status)
            .map((submission: any) => (
                <SubmissionBox key={submission.submission_uuid} submission={submission} assignment_uuid={assignment_uuid} user_id={submission.user_id} />
            ));
    };

    return (
        <div className='pl-10 mr-10 flex flex-col pt-3 w-full bg-slate-900/20 backdrop-blur-xl'>
            <div className='flex flex-row w-full'>
                <div className='flex-1'>
                    <div className='flex w-fit mx-auto px-3.5 py-1 bg-rose-600/80 backdrop-blur-xl border border-rose-400/30 space-x-2 my-5 items-center text-sm font-bold text-white rounded-full shadow-lg shadow-rose-500/20'>
                        <X size={18} />
                        <h3>Late</h3>
                    </div>
                    <div className='flex flex-col gap-4'>
                        {renderSubmissions('LATE')}
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='flex w-fit mx-auto px-3.5 py-1 bg-amber-600/80 backdrop-blur-xl border border-amber-400/30 space-x-2 my-5 items-center text-sm font-bold text-white rounded-full shadow-lg shadow-amber-500/20'>
                        <SendHorizonal size={18} />
                        <h3>Submitted</h3>
                    </div>
                    <div className='flex flex-col gap-4'>
                        {renderSubmissions('SUBMITTED')}
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='flex w-fit mx-auto px-3.5 py-1 bg-emerald-600/80 backdrop-blur-xl border border-emerald-400/30 space-x-2 my-5 items-center text-sm font-bold text-white rounded-full shadow-lg shadow-emerald-500/20'>
                        <UserCheck size={18} />
                        <h3>Graded</h3>
                    </div>
                    <div className='flex flex-col gap-4'>
                        {renderSubmissions('GRADED')}
                    </div>
                </div>

            </div>
        </div>
    );
}

function SubmissionBox({ assignment_uuid, user_id, submission }: any) {
    const session = useLHSession() as any;
    const access_token = session?.data?.tokens?.access_token;
    const [gradeSudmissionModal, setGradeSubmissionModal] = React.useState({
        open: false,
        submission_id: '',
    });

    const { data: user, error: userError } = useSWR(
        `${getAPIUrl()}users/id/${user_id}`,
        (url) => swrFetcher(url, access_token)
    );

    useEffect(() => {
        console.log(user);
    }
        , [session, user]);

    return (
        <div className='flex flex-row bg-black/20 backdrop-blur-xl border border-purple-500/30 shadow-lg shadow-purple-500/10 rounded-lg p-4 w-[350px] mx-auto'>
            <div className='flex flex-col space-y-2 w-full'>
                <div className='flex justify-between w-full'>
                    <h2 className='uppercase text-purple-400 text-xs tracking-tight font-semibold'>Submission</h2>
                    <p className='uppercase text-xs tracking-tight font-semibold text-slate-400'>
                        {new Date(submission.creation_date).toLocaleDateString('en-UK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <div className='flex justify-between space-x-2'>
                    <div className='flex space-x-2'>
                        <UserAvatar
                            border="border-4"
                            avatar_url={getUserAvatarMediaDirectory(user?.user_uuid, user?.avatar_image)}
                            predefined_avatar={user?.avatar_image ? undefined : 'empty'}
                            width={40}
                        />
                        <div className='flex flex-col'>
                            {user?.first_name && user?.last_name ? (<p className='text-sm font-semibold text-white'>{user?.first_name} {user?.last_name}</p>) : (<p className='text-sm font-semibold text-white'>@{user?.username}</p>)}
                            <p className='text-xs text-slate-400'>{user?.email}</p>
                        </div>
                    </div>
                    <div className='flex flex-col'>

                        <Modal
                            isDialogOpen={gradeSudmissionModal.open && gradeSudmissionModal.submission_id === submission.submission_uuid}
                            onOpenChange={(open: boolean) => setGradeSubmissionModal({ open, submission_id: submission.submission_uuid })}
                            minHeight="lg"
                            minWidth="lg"
                            dialogContent={
                                <AssignmentProvider assignment_uuid={"assignment_" + assignment_uuid}>
                                    <AssignmentsTaskProvider>
                                        <AssignmentSubmissionProvider assignment_uuid={"assignment_" + assignment_uuid}>
                                            <EvaluateAssignment user_id={user_id} />
                                        </AssignmentSubmissionProvider>
                                    </AssignmentsTaskProvider>
                                </AssignmentProvider>
                            }
                            dialogTitle={`Evaluate @${user?.username}`}
                            dialogDescription="Evaluate the submission"
                            dialogTrigger={
                                <div className='bg-purple-600/90 backdrop-blur-xl border border-purple-400/30 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded text-xs cursor-pointer transition-all shadow-lg shadow-purple-500/20'>
                                    Evaluate
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssignmentSubmissionsSubPage;
