import React, { useState } from 'react'
import DynamicPageActivityImage from 'public/activities_types/dynamic-page-activity.png'
import VideoPageActivityImage from 'public//activities_types/video-page-activity.png'
import DocumentPdfPageActivityImage from 'public//activities_types/documentpdf-page-activity.png'
import AssignmentActivityImage from 'public//activities_types/assignment-page-activity.png'

import DynamicCanvaModal from './NewActivityModal/DynamicActivityModal'
import VideoModal from './NewActivityModal/VideoActivityModal'
import Image from 'next/image'
import DocumentPdfModal from './NewActivityModal/DocumentActivityModal'
import Assignment from './NewActivityModal/AssignmentActivityModal'

function NewActivityModal({
  closeModal,
  submitActivity,
  submitFileActivity,
  submitExternalVideo,
  chapterId,
  course,
}: any) {
  const [selectedView, setSelectedView] = useState('home')

  return (
    <>
      {selectedView === 'home' && (
        <div className="grid grid-cols-4 gap-2 mt-2.5 w-full">
          <ActivityOption
            onClick={() => {
              setSelectedView('dynamic')
            }}
          >
            <div className="h-20 rounded-lg m-0.5 flex flex-col items-center justify-end text-center bg-white hover:cursor-pointer">
              <Image unoptimized quality={100} alt="Dynamic Page" src={DynamicPageActivityImage}></Image>
            </div>
            <div className="flex text-sm h-5 font-medium text-gray-500 items-center justify-center text-center">
              Dynamic Page
            </div>
          </ActivityOption>
          <ActivityOption
            onClick={() => {
              setSelectedView('video')
            }}
          >
            <div className="h-20 rounded-lg m-0.5 flex flex-col items-center justify-end text-center bg-white hover:cursor-pointer">
              <Image unoptimized quality={100} alt="Video Page" src={VideoPageActivityImage}></Image>
            </div>
            <div className="flex text-sm h-5 font-medium text-gray-500 items-center justify-center text-center">
              Video
            </div>
          </ActivityOption>
          <ActivityOption
            onClick={() => {
              setSelectedView('documentpdf')
            }}
          >
            <div className="h-20 rounded-lg m-0.5 flex flex-col items-center justify-end text-center bg-white hover:cursor-pointer">
              <Image unoptimized quality={100} alt="Document PDF Page" src={DocumentPdfPageActivityImage}></Image>
            </div>
            <div className="flex text-sm h-5 font-medium text-gray-500 items-center justify-center text-center">
              Document
            </div>
          </ActivityOption>
          <ActivityOption
            onClick={() => {
              setSelectedView('assignments')
            }}
          >
            <div className="h-20 rounded-lg m-0.5 flex flex-col items-center justify-end text-center bg-white hover:cursor-pointer">
              <Image unoptimized quality={100} alt="Assignment Page" src={AssignmentActivityImage}></Image>
            </div>
            <div className="flex text-sm h-5 font-medium text-gray-500 items-center justify-center text-center">
              Assignments
            </div>
          </ActivityOption>
        </div>
      )}

      {selectedView === 'dynamic' && (
        <DynamicCanvaModal
          submitActivity={submitActivity}
          chapterId={chapterId}
          course={course}
        />
      )}

      {selectedView === 'video' && (
        <VideoModal
          submitFileActivity={submitFileActivity}
          submitExternalVideo={submitExternalVideo}
          chapterId={chapterId}
          course={course}
        />
      )}

      {selectedView === 'documentpdf' && (
        <DocumentPdfModal
          submitFileActivity={submitFileActivity}
          chapterId={chapterId}
          course={course}
        />
      )}

      {selectedView === 'assignments' && (
        <Assignment
          submitActivity={submitActivity}
          chapterId={chapterId}
          course={course}
          closeModal={closeModal}
        />)
      }
    </>
  )
}

const ActivityOption = ({ onClick, children }: any) => (
  <div
    onClick={onClick}
    className="w-full text-center rounded-xl bg-gray-100 border-4 border-gray-100 mx-auto hover:bg-gray-200 hover:border-gray-200 transition duration-200 ease-in-out cursor-pointer"
  >
    {children}
  </div>
)

export default NewActivityModal
