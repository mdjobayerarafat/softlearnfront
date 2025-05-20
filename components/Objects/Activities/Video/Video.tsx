import React from 'react'
import YouTube from 'react-youtube'
import { getActivityMediaDirectory } from '@services/media/media'
import { useOrg } from '@components/Contexts/OrgContext'

interface VideoDetails {
  startTime?: number
  endTime?: number | null
  autoplay?: boolean
  muted?: boolean
}

interface VideoActivityProps {
  activity: {
    activity_sub_type: string
    activity_uuid: string
    content: {
      filename?: string
      uri?: string
    }
    details?: VideoDetails
  }
  course: {
    course_uuid: string
  }
}

function VideoActivity({ activity, course }: VideoActivityProps) {
  const org = useOrg() as any
  const [videoId, setVideoId] = React.useState('')
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (activity?.content?.uri) {
      var getYouTubeID = require('get-youtube-id')
      setVideoId(getYouTubeID(activity.content.uri))
    }
  }, [activity, org])

  const getVideoSrc = () => {
    if (!activity.content?.filename) return ''
    return getActivityMediaDirectory(
      org?.org_uuid,
      course?.course_uuid,
      activity.activity_uuid,
      activity.content.filename,
      'video'
    )
  }

  // Handle native video time update
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video && activity.details?.endTime) {
      if (video.currentTime >= activity.details.endTime) {
        video.pause()
      }
    }
  }

  // Handle native video load
  const handleVideoLoad = () => {
    const video = videoRef.current
    if (video && activity.details) {
      video.currentTime = activity.details.startTime || 0
      video.autoplay = activity.details.autoplay || false
      video.muted = activity.details.muted || false
    }
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-4">
      {activity && (
        <>
          {activity.activity_sub_type === 'SUBTYPE_VIDEO_HOSTED' && (
            <div className="my-3 md:my-5 w-full">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-gray-300/30 dark:ring-gray-600/30 sm:ring-gray-200/10 sm:dark:ring-gray-700/20 shadow-xs sm:shadow-none">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls
                  src={getVideoSrc()}
                  onLoadedMetadata={handleVideoLoad}
                  onTimeUpdate={handleTimeUpdate}
                ></video>
              </div>
            </div>
          )}
          {activity.activity_sub_type === 'SUBTYPE_VIDEO_YOUTUBE' && (
            <div className="my-3 md:my-5 w-full">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-gray-300/30 dark:ring-gray-600/30 sm:ring-gray-200/10 sm:dark:ring-gray-700/20 shadow-xs sm:shadow-none">
                <YouTube
                  className="w-full h-full"
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: activity.details?.autoplay ? 1 : 0,
                      mute: activity.details?.muted ? 1 : 0,
                      start: activity.details?.startTime || 0,
                      end: activity.details?.endTime || undefined
                    },
                  }}
                  videoId={videoId}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VideoActivity
