'use client'
import Link from 'next/link'
import { getAPIUrl, getUriWithOrg } from '@services/config/config'
import Canva from '@components/Objects/Activities/DynamicCanva/DynamicCanva'
import VideoActivity from '@components/Objects/Activities/Video/Video'
import { BookOpenCheck, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, FileText, Folder, List, Menu, MoreVertical, UserRoundPen, Video, Layers, ListFilter, ListTree, X, Edit2, EllipsisVertical, Maximize2, Minimize2 } from 'lucide-react'
import { markActivityAsComplete, unmarkActivityAsComplete } from '@services/courses/activity'
import DocumentPdfActivity from '@components/Objects/Activities/DocumentPdf/DocumentPdf'
import ActivityIndicators from '@components/Pages/Courses/ActivityIndicators'
import GeneralWrapperStyled from '@components/Objects/StyledElements/Wrappers/GeneralWrapper'
import { usePathname, useRouter } from 'next/navigation'
import AuthenticatedClientElement from '@components/Security/AuthenticatedClientElement'
import { getCourseThumbnailMediaDirectory } from '@services/media/media'
import { useOrg } from '@components/Contexts/OrgContext'
import { CourseProvider } from '@components/Contexts/CourseContext'
import AIActivityAsk from '@components/Objects/Activities/AI/AIActivityAsk'
import AIChatBotProvider from '@components/Contexts/AI/AIChatBotContext'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import React, { useEffect, useRef } from 'react'
import { getAssignmentFromActivityUUID, getFinalGrade, submitAssignmentForGrading } from '@services/courses/assignments'
import AssignmentStudentActivity from '@components/Objects/Activities/Assignment/AssignmentStudentActivity'
import { AssignmentProvider } from '@components/Contexts/Assignments/AssignmentContext'
import { AssignmentsTaskProvider } from '@components/Contexts/Assignments/AssignmentsTaskContext'
import AssignmentSubmissionProvider, {  useAssignmentSubmission } from '@components/Contexts/Assignments/AssignmentSubmissionContext'
import toast from 'react-hot-toast'
import { mutate } from 'swr'
import ConfirmationModal from '@components/Objects/StyledElements/ConfirmationModal/ConfirmationModal'
import { useMediaQuery } from 'usehooks-ts'
import PaidCourseActivityDisclaimer from '@components/Objects/Courses/CourseActions/PaidCourseActivityDisclaimer'
import { useContributorStatus } from '../../../../../../../../hooks/useContributorStatus'
import ToolTip from '@components/Objects/StyledElements/Tooltip/Tooltip'
import ActivityNavigation from '@components/Pages/Activity/ActivityNavigation'
import ActivityChapterDropdown from '@components/Pages/Activity/ActivityChapterDropdown'
import FixedActivitySecondaryBar from '@components/Pages/Activity/FixedActivitySecondaryBar'
import CourseEndView from '@components/Pages/Activity/CourseEndView'
import { motion, AnimatePresence } from 'framer-motion'

interface ActivityClientProps {
  activityid: string
  courseuuid: string
  orgslug: string
  activity: any
  course: any
}

interface ActivityActionsProps {
  activity: any
  activityid: string
  course: any
  orgslug: string
  assignment: any
  showNavigation?: boolean
}

function ActivityActions({ activity, activityid, course, orgslug, assignment, showNavigation = true }: ActivityActionsProps) {
  const session = useLHSession() as any;
  const { contributorStatus } = useContributorStatus(course.course_uuid);

  return (
    <div className="flex space-x-2 items-center">
      {activity && activity.published == true && activity.content.paid_access != false && (
        <AuthenticatedClientElement checkMethod="authentication">
          {activity.activity_type != 'TYPE_ASSIGNMENT' && (
            <>
              <MarkStatus
                activity={activity}
                activityid={activityid}
                course={course}
                orgslug={orgslug}
              />
            </>
          )}
          {activity.activity_type == 'TYPE_ASSIGNMENT' && (
            <>
              <AssignmentSubmissionProvider assignment_uuid={assignment?.assignment_uuid}>
                <AssignmentTools
                  assignment={assignment}
                  activity={activity}
                  activityid={activityid}
                  course={course}
                  orgslug={orgslug}
                />
              </AssignmentSubmissionProvider>
            </>
          )}
          {showNavigation && (
            <NextActivityButton course={course} currentActivityId={activity.id} orgslug={orgslug} />
          )}
        </AuthenticatedClientElement>
      )}
    </div>
  );
}

function ActivityClient(props: ActivityClientProps) {
  const activityid = props.activityid
  const courseuuid = props.courseuuid
  const orgslug = props.orgslug
  const activity = props.activity
  const course = props.course
  const org = useOrg() as any
  const session = useLHSession() as any;
  const pathname = usePathname()
  const access_token = session?.data?.tokens?.access_token;
  const [bgColor, setBgColor] = React.useState('bg-slate-900')
  const [assignment, setAssignment] = React.useState(null) as any;
  const [markStatusButtonActive, setMarkStatusButtonActive] = React.useState(false);
  const [isFocusMode, setIsFocusMode] = React.useState(false);
  const isInitialRender = useRef(true);
  const { contributorStatus } = useContributorStatus(courseuuid);
  const router = useRouter();

  // Function to find the current activity's position in the course
  const findActivityPosition = () => {
    let allActivities: any[] = [];
    let currentIndex = -1;
    
    // Flatten all activities from all chapters
    course.chapters.forEach((chapter: any) => {
      chapter.activities.forEach((activity: any) => {
        const cleanActivityUuid = activity.activity_uuid?.replace('activity_', '');
        allActivities.push({
          ...activity,
          cleanUuid: cleanActivityUuid,
          chapterName: chapter.name
        });
        
        // Check if this is the current activity
        if (cleanActivityUuid === activityid.replace('activity_', '')) {
          currentIndex = allActivities.length - 1;
        }
      });
    });
    
    return { allActivities, currentIndex };
  };
  
  const { allActivities, currentIndex } = findActivityPosition();
  
  // Get previous and next activities
  const prevActivity = currentIndex > 0 ? allActivities[currentIndex - 1] : null;
  const nextActivity = currentIndex < allActivities.length - 1 ? allActivities[currentIndex + 1] : null;
  
  // Navigate to an activity
  const navigateToActivity = (activity: any) => {
    if (!activity) return;
    
    const cleanCourseUuid = course.course_uuid?.replace('course_', '');
    router.push(getUriWithOrg(orgslug, `/course/${cleanCourseUuid}/activity/${activity.cleanUuid}`));
  };

  // Initialize focus mode from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('globalFocusMode');
      setIsFocusMode(saved === 'true');
    }
  }, []);

  // Save focus mode to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('globalFocusMode', isFocusMode.toString());
      // Dispatch custom event for focus mode change
      window.dispatchEvent(new CustomEvent('focusModeChange', { 
        detail: { isFocusMode } 
      }));
      isInitialRender.current = false;
    }
  }, [isFocusMode]);

  function getChapterNameByActivityId(course: any, activity_id: any) {
    for (let i = 0; i < course.chapters.length; i++) {
      let chapter = course.chapters[i]
      for (let j = 0; j < chapter.activities.length; j++) {
        let activity = chapter.activities[j]
        if (activity.id === activity_id) {
          return chapter.name
        }
      }
    }
    return null // return null if no matching activity is found
  }

  async function getAssignmentUI() {
    const assignment = await getAssignmentFromActivityUUID(activity.activity_uuid, access_token)
    setAssignment(assignment.data)
  }

  useEffect(() => {
    if (activity.activity_type == 'TYPE_DYNAMIC') {
      setBgColor(isFocusMode ? 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50' : 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-purple-500/10');
    }
    else if (activity.activity_type == 'TYPE_ASSIGNMENT') {
      setMarkStatusButtonActive(false);
      setBgColor(isFocusMode ? 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50' : 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-purple-500/10');
      getAssignmentUI();
    }
    else {
      setBgColor(isFocusMode ? 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50' : 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-purple-500/10');
    }
  }
    , [activity, pathname, isFocusMode])

  return (
    <>
      <CourseProvider courseuuid={course?.course_uuid}>
        <AIChatBotProvider>
          {isFocusMode ? (
            <AnimatePresence>
              <motion.div 
                initial={isInitialRender.current ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50"
              >
                {/* Focus Mode Top Bar */}
                <motion.div 
                  initial={isInitialRender.current ? false : { y: -100 }}
                  animate={{ y: 0 }}
                  exit={{ y: -100 }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/30"
                >
                  <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between h-14">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsFocusMode(false)}
                          className="bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 p-2 rounded-full cursor-pointer hover:bg-slate-700/80 transition-all duration-200 shadow-lg shadow-purple-500/20"
                          title="Exit focus mode"
                        >
                          <Minimize2 size={16} className="text-purple-300" />
                        </motion.button>
                        <ActivityChapterDropdown 
                          course={course}
                          currentActivityId={activity.activity_uuid ? activity.activity_uuid.replace('activity_', '') : activityid.replace('activity_', '')}
                          orgslug={orgslug}
                        />
                      </div>
                      
                      {/* Center Course Info */}
                      <motion.div 
                        initial={isInitialRender.current ? false : { opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex">
                          <Link
                            href={getUriWithOrg(orgslug, '') + `/course/${courseuuid}`}
                          >
                            <img
                              className="w-[60px] h-[34px] rounded-md drop-shadow-md"
                              src={`${getCourseThumbnailMediaDirectory(
                                org?.org_uuid,
                                course.course_uuid,
                                course.thumbnail_image
                              )}`}
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="flex flex-col -space-y-1">
                          <p className="font-bold text-purple-300 text-sm">Course </p>
                          <h1 className="font-bold text-white text-lg first-letter:uppercase">
                            {course.name}
                          </h1>
                        </div>
                      </motion.div>

                      {/* Progress Indicator */}
                      <motion.div 
                        initial={isInitialRender.current ? false : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="relative w-8 h-8">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                              fill="none"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="#8b5cf6"
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 14}
                              strokeDashoffset={2 * Math.PI * 14 * (1 - (course.trail?.runs?.find((run: any) => run.course_id === course.id)?.steps?.filter((step: any) => step.complete)?.length || 0) / (course.chapters?.reduce((acc: number, chapter: any) => acc + chapter.activities.length, 0) || 1))}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-300">
                              {Math.round(((course.trail?.runs?.find((run: any) => run.course_id === course.id)?.steps?.filter((step: any) => step.complete)?.length || 0) / (course.chapters?.reduce((acc: number, chapter: any) => acc + chapter.activities.length, 0) || 1)) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-purple-300">
                          {course.trail?.runs?.find((run: any) => run.course_id === course.id)?.steps?.filter((step: any) => step.complete)?.length || 0} of {course.chapters?.reduce((acc: number, chapter: any) => acc + chapter.activities.length, 0) || 0}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Focus Mode Content */}
                <div className="pt-16 pb-20 h-full overflow-auto">
                  <div className="container mx-auto px-4">
                    {activity && activity.published == true && (
                      <>
                        {activity.content.paid_access == false ? (
                          <PaidCourseActivityDisclaimer course={course} />
                        ) : (
                          <motion.div 
                            initial={isInitialRender.current ? false : { scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className={`p-7 rounded-lg ${bgColor} mt-4`}
                          >
                            {/* Activity Types */}
                            <div>
                              {activity.activity_type == 'TYPE_DYNAMIC' && (
                                <Canva content={activity.content} activity={activity} />
                              )}
                              {activity.activity_type == 'TYPE_VIDEO' && (
                                <VideoActivity course={course} activity={activity} />
                              )}
                              {activity.activity_type == 'TYPE_DOCUMENT' && (
                                <DocumentPdfActivity
                                  course={course}
                                  activity={activity}
                                />
                              )}
                              {activity.activity_type == 'TYPE_ASSIGNMENT' && (
                                <div>
                                  {assignment ? (
                                    <AssignmentProvider assignment_uuid={assignment?.assignment_uuid}>
                                      <AssignmentsTaskProvider>
                                        <AssignmentSubmissionProvider assignment_uuid={assignment?.assignment_uuid}>
                                          <AssignmentStudentActivity />
                                        </AssignmentSubmissionProvider>
                                      </AssignmentsTaskProvider>
                                    </AssignmentProvider>
                                  ) : (
                                    <div></div>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Focus Mode Bottom Bar */}
                {activity && activity.published == true && activity.content.paid_access != false && (
                  <motion.div 
                    initial={isInitialRender.current ? false : { y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-purple-500/30"
                  >
                    <div className="container mx-auto px-4">
                      <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigateToActivity(prevActivity)}
                            className={`flex items-center space-x-1.5 p-2 rounded-md transition-all duration-200 cursor-pointer ${
                              prevActivity 
                                ? 'text-purple-300 hover:bg-slate-800/50' 
                                : 'opacity-50 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!prevActivity}
                            title={prevActivity ? `Previous: ${prevActivity.name}` : 'No previous activity'}
                          >
                            <ChevronLeft size={20} className="text-purple-400 shrink-0" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-purple-400">Previous</span>
                              <span className="text-sm capitalize font-semibold text-left text-white">
                                {prevActivity ? prevActivity.name : 'No previous activity'}
                              </span>
                            </div>
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ActivityActions 
                            activity={activity}
                            activityid={activityid}
                            course={course}
                            orgslug={orgslug}
                            assignment={assignment}
                            showNavigation={false}
                          />
                          <button
                            onClick={() => navigateToActivity(nextActivity)}
                            className={`flex items-center space-x-1.5 p-2 rounded-md transition-all duration-200 cursor-pointer ${
                              nextActivity 
                                ? 'text-purple-300 hover:bg-slate-800/50' 
                                : 'opacity-50 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!nextActivity}
                            title={nextActivity ? `Next: ${nextActivity.name}` : 'No next activity'}
                          >
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-purple-400">Next</span>
                              <span className="text-sm capitalize font-semibold text-right text-white">
                                {nextActivity ? nextActivity.name : 'No next activity'}
                              </span>
                            </div>
                            <ChevronRight size={20} className="text-purple-400 shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <GeneralWrapperStyled>
              {/* Original non-focus mode UI */}
              {activityid === 'end' ? (
                <CourseEndView 
                  courseName={course.name}
                  orgslug={orgslug}
                  courseUuid={course.course_uuid}
                  thumbnailImage={course.thumbnail_image}
                />
              ) : (
                <div className="space-y-4 pt-0">
                  <div className="pt-2">
                    <div className="space-y-4 pb-4 activity-info-section">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-6">
                          <div className="flex">
                            <Link
                              href={getUriWithOrg(orgslug, '') + `/course/${courseuuid}`}
                            >
                              <img
                                className="w-[100px] h-[57px] rounded-md drop-shadow-md"
                                src={`${getCourseThumbnailMediaDirectory(
                                  org?.org_uuid,
                                  course.course_uuid,
                                  course.thumbnail_image
                                )}`}
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="flex flex-col -space-y-1">
                            <p className="font-bold text-purple-300 text-md">Course </p>
                            <h1 className="font-bold text-white text-2xl first-letter:uppercase">
                              {course.name}
                            </h1>
                          </div>
                        </div>
                        {activity && activity.published == true && activity.content.paid_access != false && (
                          <AuthenticatedClientElement checkMethod="authentication">
                            { (
                              <div className="flex space-x-2">
                                <PreviousActivityButton 
                                  course={course} 
                                  currentActivityId={activity.id} 
                                  orgslug={orgslug} 
                                />
                                <NextActivityButton 
                                  course={course} 
                                  currentActivityId={activity.id} 
                                  orgslug={orgslug} 
                                />
                              </div>
                            )}
                          </AuthenticatedClientElement>
                        )}
                      </div>

                      <ActivityIndicators
                        course_uuid={courseuuid}
                        current_activity={activityid}
                        orgslug={orgslug}
                        course={course}
                      />

                      <div className="flex justify-between items-center w-full">
                        <div className="flex flex-1/3 items-center space-x-3">
                          <button
                            onClick={() => setIsFocusMode(true)}
                            className="bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 p-2 rounded-full cursor-pointer hover:bg-slate-700/80 transition-all duration-200 shadow-lg shadow-purple-500/20"
                            title="Enter focus mode"
                          >
                            <Maximize2 size={16} className="text-purple-300" />
                          </button>
                          <ActivityChapterDropdown 
                            course={course}
                            currentActivityId={activity.activity_uuid ? activity.activity_uuid.replace('activity_', '') : activityid.replace('activity_', '')}
                            orgslug={orgslug}
                          />
                          <div className="flex flex-col -space-y-1">
                            <p className="font-bold text-purple-300 text-md">
                              Chapter : {getChapterNameByActivityId(course, activity.id)}
                            </p>
                            <h1 className="font-bold text-white text-2xl first-letter:uppercase">
                              {activity.name}
                            </h1>
                          </div>
                        </div>
                        <div className="flex space-x-2 items-center">
                          {activity && activity.published == true && activity.content.paid_access != false && (
                            <AuthenticatedClientElement checkMethod="authentication">
                              {activity.activity_type != 'TYPE_ASSIGNMENT' && (
                                <>
                                  <AIActivityAsk activity={activity} />
                                  {contributorStatus === 'ACTIVE' && activity.activity_type == 'TYPE_DYNAMIC' && (
                                    <Link
                                      href={getUriWithOrg(orgslug, '') + `/course/${courseuuid}/activity/${activityid}/edit`}
                                      className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full px-5 backdrop-blur-xl border border-emerald-500/30 flex items-center space-x-2 p-2.5 text-white hover:cursor-pointer transition-all duration-300 ease-in-out hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20"
                                    >
                                      <Edit2 size={17} />
                                      <span className="text-xs font-bold">Contribute</span>
                                    </Link>
                                  )}
                                </>
                              )}
                            </AuthenticatedClientElement>
                          )}
                        </div>
                      </div>
                    </div>

                    {activity && activity.published == false && (
                      <div className="p-7 backdrop-blur-xl border border-red-500/30 rounded-lg bg-red-900/20 shadow-lg shadow-red-500/10">
                        <div className="text-red-300">
                          <h1 className="font-bold text-2xl">
                            This activity is not published yet
                          </h1>
                        </div>
                      </div>
                    )}

                    {activity && activity.published == true && (
                      <>
                        {activity.content.paid_access == false ? (
                          <PaidCourseActivityDisclaimer course={course} />
                        ) : (
                          <div className={`p-7 drop-shadow-xs rounded-lg ${bgColor}`}>
                            {/* Activity Types */}
                            <div>
                              {activity.activity_type == 'TYPE_DYNAMIC' && (
                                <Canva content={activity.content} activity={activity} />
                              )}
                              {activity.activity_type == 'TYPE_VIDEO' && (
                                <VideoActivity course={course} activity={activity} />
                              )}
                              {activity.activity_type == 'TYPE_DOCUMENT' && (
                                <DocumentPdfActivity
                                  course={course}
                                  activity={activity}
                                />
                              )}
                              {activity.activity_type == 'TYPE_ASSIGNMENT' && (
                                <div>
                                  {assignment ? (
                                    <AssignmentProvider assignment_uuid={assignment?.assignment_uuid}>
                                      <AssignmentsTaskProvider>
                                        <AssignmentSubmissionProvider assignment_uuid={assignment?.assignment_uuid}>
                                          <AssignmentStudentActivity />
                                        </AssignmentSubmissionProvider>
                                      </AssignmentsTaskProvider>
                                    </AssignmentProvider>
                                  ) : (
                                    <div></div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Activity Actions below the content box */}
                    {activity && activity.published == true && activity.content.paid_access != false && (
                      <div className="flex justify-end mt-4">
                        <ActivityActions 
                          activity={activity}
                          activityid={activityid}
                          course={course}
                          orgslug={orgslug}
                          assignment={assignment}
                        />
                      </div>
                    )}

                    {/* Fixed Activity Secondary Bar */}
                    {activity && activity.published == true && activity.content.paid_access != false && (
                      <FixedActivitySecondaryBar
                        course={course}
                        currentActivityId={activityid}
                        orgslug={orgslug}
                        activity={activity}
                      />
                    )}
                    
                    <div style={{ height: '100px' }}></div>
                  </div>
                </div>
              )}
            </GeneralWrapperStyled>
          )}
        </AIChatBotProvider>
      </CourseProvider>
    </>
  )
}

export function MarkStatus(props: {
  activity: any
  activityid: string
  course: any
  orgslug: string
}) {
  const router = useRouter()
  const session = useLHSession() as any;
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isLoading, setIsLoading] = React.useState(false);

  const areAllActivitiesCompleted = () => {
    const run = props.course.trail.runs.find(
      (run: any) => run.course_id == props.course.id
    );
    if (!run) return false;

    let totalActivities = 0;
    let completedActivities = 0;

    // Count all activities and completed activities
    props.course.chapters.forEach((chapter: any) => {
      chapter.activities.forEach((activity: any) => {
        totalActivities++;
        const isCompleted = run.steps.find(
          (step: any) => step.activity_id === activity.id && step.complete === true
        );
        if (isCompleted) {
          completedActivities++;
        }
      });
    });

    console.log('Total activities:', totalActivities);
    console.log('Completed activities:', completedActivities);
    console.log('All completed?', completedActivities >= totalActivities - 1);

    // We check for totalActivities - 1 because the current activity completion 
    // hasn't been counted yet (it's in progress)
    return completedActivities >= totalActivities - 1;
  };

  async function markActivityAsCompleteFront() {
    try {
      // Check if this will be the last activity to complete
      const willCompleteAll = areAllActivitiesCompleted();
      console.log('Will complete all?', willCompleteAll);

      setIsLoading(true);
      await markActivityAsComplete(
        props.orgslug,
        props.course.course_uuid,
        props.activity.activity_uuid,
        session.data?.tokens?.access_token
      );
      
      // Mutate the course data
      await mutate(`${getAPIUrl()}courses/${props.course.course_uuid}/meta`);
      
      if (willCompleteAll) {
        console.log('Redirecting to end page...');
        const cleanCourseUuid = props.course.course_uuid.replace('course_', '');
        router.push(getUriWithOrg(props.orgslug, '') + `/course/${cleanCourseUuid}/activity/end`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error marking activity as complete:', error);
      toast.error('Failed to mark activity as complete');
    } finally {
      setIsLoading(false);
    }
  }

  async function unmarkActivityAsCompleteFront() {
    try {
      setIsLoading(true);
      const trail = await unmarkActivityAsComplete(
        props.orgslug,
        props.course.course_uuid,
        props.activity.activity_uuid,
        session.data?.tokens?.access_token
      );
      
      // Mutate the course data to trigger re-render
      await mutate(`${getAPIUrl()}courses/${props.course.course_uuid}/meta`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to unmark activity as complete');
    } finally {
      setIsLoading(false);
    }
  }

  const isActivityCompleted = () => {
    let run = props.course.trail.runs.find(
      (run: any) => run.course_id == props.course.id
    )
    if (run) {
      return run.steps.find(
        (step: any) => (step.activity_id == props.activity.id) && (step.complete == true)
      )
    }
  }

  return (
    <>
      {isActivityCompleted() ? (
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full px-5 backdrop-blur-xl border border-emerald-500/30 flex items-center space-x-2 p-2.5 text-white shadow-lg shadow-emerald-500/20">
            <i>
              <Check size={17}></Check>
            </i>{' '}
            <i className="not-italic text-xs font-bold">Complete</i>
          </div>
          <ToolTip
            content="Unmark as complete"
            side="top"
          >
            <ConfirmationModal
              confirmationButtonText="Unmark Activity"
              confirmationMessage="Are you sure you want to unmark this activity as complete? This will affect your course progress."
              dialogTitle="Unmark activity as complete"
              dialogTrigger={
                <div
                  className={`${isLoading ? 'opacity-75 cursor-not-allowed' : ''} bg-gradient-to-r from-red-600 to-pink-600 rounded-full p-2 backdrop-blur-xl border border-red-500/30 flex items-center text-white hover:cursor-pointer transition-all duration-300 ease-in-out hover:from-red-500 hover:to-pink-500 shadow-lg shadow-red-500/20`}
                >
                  {isLoading ? (
                    <div className="animate-spin">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <X size={17} />
                  )}
                </div>
              }
              functionToExecute={unmarkActivityAsCompleteFront}
              status="warning"
            />
          </ToolTip>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div
            className={`${isLoading ? 'opacity-75 cursor-not-allowed' : ''} bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-5 backdrop-blur-xl border border-purple-500/30 flex items-center space-x-2 p-2.5 text-white hover:cursor-pointer transition-all duration-300 ease-in-out hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20`}
            onClick={!isLoading ? markActivityAsCompleteFront : undefined}
          >
            {isLoading ? (
              <div className="animate-spin">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <i>
                <Check size={17}></Check>
              </i>
            )}{' '}
            {!isMobile && <i className="not-italic text-xs font-bold">{isLoading ? 'Marking...' : 'Mark as complete'}</i>}
          </div>
        </div>
      )}
    </>
  )
}

function NextActivityButton({ course, currentActivityId, orgslug }: { course: any, currentActivityId: string, orgslug: string }) {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const findNextActivity = () => {
    let allActivities: any[] = [];
    let currentIndex = -1;
    
    // Flatten all activities from all chapters
    course.chapters.forEach((chapter: any) => {
      chapter.activities.forEach((activity: any) => {
        const cleanActivityUuid = activity.activity_uuid?.replace('activity_', '');
        allActivities.push({
          ...activity,
          cleanUuid: cleanActivityUuid,
          chapterName: chapter.name
        });
        
        // Check if this is the current activity
        if (activity.id === currentActivityId) {
          currentIndex = allActivities.length - 1;
        }
      });
    });
    
    // Get next activity
    return currentIndex < allActivities.length - 1 ? allActivities[currentIndex + 1] : null;
  };

  const nextActivity = findNextActivity();

  if (!nextActivity) return null;

  const navigateToActivity = () => {
    const cleanCourseUuid = course.course_uuid?.replace('course_', '');
    router.push(getUriWithOrg(orgslug, '') + `/course/${cleanCourseUuid}/activity/${nextActivity.cleanUuid}`);
  };

  return (
    <div
      onClick={navigateToActivity}
      className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-full px-5 shadow-lg shadow-purple-500/20 flex items-center space-x-1 p-2.5 text-purple-300 hover:cursor-pointer hover:bg-slate-800/90 hover:border-purple-400/50 transition-all duration-300 ease-in-out"
    >
      <span className="text-xs font-bold text-purple-400">Next</span>
      <EllipsisVertical className='text-purple-500/70' size={13} />
      <span className="text-sm font-semibold truncate max-w-[200px] text-white">{nextActivity.name}</span>
      <ChevronRight size={17} className="text-purple-400" />
    </div>
  );
}

function PreviousActivityButton({ course, currentActivityId, orgslug }: { course: any, currentActivityId: string, orgslug: string }) {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const findPreviousActivity = () => {
    let allActivities: any[] = [];
    let currentIndex = -1;
    
    // Flatten all activities from all chapters
    course.chapters.forEach((chapter: any) => {
      chapter.activities.forEach((activity: any) => {
        const cleanActivityUuid = activity.activity_uuid?.replace('activity_', '');
        allActivities.push({
          ...activity,
          cleanUuid: cleanActivityUuid,
          chapterName: chapter.name
        });
        
        // Check if this is the current activity
        if (activity.id === currentActivityId) {
          currentIndex = allActivities.length - 1;
        }
      });
    });
    
    // Get previous activity
    return currentIndex > 0 ? allActivities[currentIndex - 1] : null;
  };

  const previousActivity = findPreviousActivity();

  if (!previousActivity) return null;

  const navigateToActivity = () => {
    const cleanCourseUuid = course.course_uuid?.replace('course_', '');
    router.push(getUriWithOrg(orgslug, '') + `/course/${cleanCourseUuid}/activity/${previousActivity.cleanUuid}`);
  };

  return (
    <div
      onClick={navigateToActivity}
      className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-full px-5 shadow-lg shadow-purple-500/20 flex items-center space-x-1 p-2.5 text-purple-300 hover:cursor-pointer hover:bg-slate-800/90 hover:border-purple-400/50 transition-all duration-300 ease-in-out"
    >
      <ChevronLeft size={17} className="text-purple-400" />
      <span className="text-xs font-bold text-purple-400">Previous</span>
      <EllipsisVertical className='text-purple-500/70' size={13} />
      <span className="text-sm font-semibold truncate max-w-[200px] text-white">{previousActivity.name}</span>
    </div>
  );
}

function AssignmentTools(props: {
  activity: any
  activityid: string
  course: any
  orgslug: string
  assignment: any
}) {
  const submission = useAssignmentSubmission() as any
  const session = useLHSession() as any;
  const [finalGrade, setFinalGrade] = React.useState(null) as any;

  const submitForGradingUI = async () => {
    if (props.assignment) {
      const res = await submitAssignmentForGrading(
        props.assignment?.assignment_uuid,
        session.data?.tokens?.access_token
      )
      if (res.success) {
        toast.success('Assignment submitted for grading')
        mutate(`${getAPIUrl()}assignments/${props.assignment?.assignment_uuid}/submissions/me`,)
      }
      else {
        toast.error('Failed to submit assignment for grading')
      }
    }
  }

  const getGradingBasedOnMethod = async () => {
    const res = await getFinalGrade(
      session.data?.user?.id,
      props.assignment?.assignment_uuid,
      session.data?.tokens?.access_token
    );

    if (res.success) {
      const { grade, max_grade, grading_type } = res.data;
      let displayGrade;

      switch (grading_type) {
        case 'ALPHABET':
          displayGrade = convertNumericToAlphabet(grade, max_grade);
          break;
        case 'NUMERIC':
          displayGrade = `${grade}/${max_grade}`;
          break;
        case 'PERCENTAGE':
          const percentage = (grade / max_grade) * 100;
          displayGrade = `${percentage.toFixed(2)}%`;
          break;
        default:
          displayGrade = 'Unknown grading type';
      }

      // Use displayGrade here, e.g., update state or display it
      setFinalGrade(displayGrade);
    } else {
    }
  };

  // Helper function to convert numeric grade to alphabet grade
  function convertNumericToAlphabet(grade: any, maxGrade: any) {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  useEffect(() => {
    if ( submission && submission.length > 0 && submission[0].submission_status === 'GRADED') {
      getGradingBasedOnMethod();
    }
  }
    , [submission, props.assignment])

  if (!submission || submission.length === 0) {
    return (
      <ConfirmationModal
        confirmationButtonText="Submit Assignment"
        confirmationMessage="Are you sure you want to submit your assignment for grading? Once submitted, you will not be able to make any changes."
        dialogTitle="Submit your assignment for grading"
        dialogTrigger={
          <div className="bg-purple-500/90 backdrop-blur-xl rounded-full px-5 drop-shadow-md flex items-center space-x-2 p-2.5 text-white hover:cursor-pointer hover:bg-purple-400/90 transition delay-150 duration-300 ease-in-out border border-purple-400/30 shadow-lg shadow-purple-500/20">
            <BookOpenCheck size={17} />
            <span className="text-xs font-bold">Submit for grading</span>
          </div>
        }
        functionToExecute={submitForGradingUI}
        status="info"
      />
    )
  }

  if (submission[0].submission_status === 'SUBMITTED') {
    return (
      <div className="bg-amber-500/90 backdrop-blur-xl rounded-full px-5 drop-shadow-md flex items-center space-x-2 p-2.5 text-white transition delay-150 duration-300 ease-in-out border border-amber-400/30 shadow-lg shadow-amber-500/20">
        <UserRoundPen size={17} />
        <span className="text-xs font-bold">Grading in progress</span>
      </div>
    )
  }

  if (submission[0].submission_status === 'GRADED') {
    return (
      <div className="bg-emerald-500/90 backdrop-blur-xl rounded-full px-5 drop-shadow-md flex items-center space-x-2 p-2.5 text-white transition delay-150 duration-300 ease-in-out border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
        <CheckCircle size={17} />
        <span className="text-xs flex space-x-2 font-bold items-center"><span>Graded </span> <span className='bg-slate-900/80 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30'>{finalGrade}</span></span>
      </div>
    )
  }

  // Default return in case none of the conditions are met
  return null
}

export default ActivityClient
