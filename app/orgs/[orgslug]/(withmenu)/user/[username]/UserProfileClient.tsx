'use client';

import React from 'react'
import UserAvatar from '@components/Objects/UserAvatar'
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Globe, 
  Link as LinkIcon, 
  GraduationCap,
  Award,
  BookOpen,
  Laptop2,
  Users,
  Calendar,
  Lightbulb,
  X,
  ExternalLink
} from 'lucide-react'
import { getUserAvatarMediaDirectory } from '@services/media/media'
import { getCoursesByUser } from '@services/users/users'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { Button } from "@components/ui/button"
import CourseThumbnailLanding from '@components/Objects/Thumbnails/CourseThumbnailLanding'

interface UserProfileClientProps {
  userData: any;
  profile: any;
}

const ICON_MAP = {
  'briefcase': Briefcase,
  'graduation-cap': GraduationCap,
  'map-pin': MapPin,
  'building-2': Building2,
  'speciality': Lightbulb,
  'globe': Globe,
  'laptop-2': Laptop2,
  'award': Award,
  'book-open': BookOpen,
  'link': LinkIcon,
  'users': Users,
  'calendar': Calendar,
} as const

// Add Modal component
const ImageModal: React.FC<{
  image: { url: string; caption?: string };
  onClose: () => void;
}> = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={image.url}
          alt={image.caption || ''}
          className="w-full h-auto rounded-lg"
        />
        {image.caption && (
          <p className="mt-4 text-white text-center text-lg">{image.caption}</p>
        )}
      </div>
    </div>
  );
};

function UserProfileClient({ userData, profile }: UserProfileClientProps) {
  const session = useLHSession() as any
  const access_token = session?.data?.tokens?.access_token
  const [selectedImage, setSelectedImage] = React.useState<{ url: string; caption?: string } | null>(null);
  const [userCourses, setUserCourses] = React.useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = React.useState(false);

  React.useEffect(() => {
    const fetchUserCourses = async () => {
      if (userData.id && access_token) {
        try {
          setIsLoadingCourses(true);
          const coursesData = await getCoursesByUser(userData.id, access_token);
          if (coursesData.data) {
            setUserCourses(coursesData.data);
          }
        } catch (error) {
          console.error('Error fetching user courses:', error);
        } finally {
          setIsLoadingCourses(false);
        }
      }
    };

    fetchUserCourses();
  }, [userData.id, access_token]);

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const IconElement = ICON_MAP[iconName as keyof typeof ICON_MAP]
    if (!IconElement) return null
    return <IconElement className="w-4 h-4 text-gray-600" />
  }

  return (
    <div className="container mx-auto py-8">
      {/* Banner */}
      <div className="h-48 w-full bg-gray-100 rounded-t-xl mb-0 relative overflow-hidden">
        {/* Optional banner content */}
      </div>
      
      {/* Profile Content */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-b-xl nice-shadow p-8 relative border border-white/10">
        {/* Avatar Positioned on the banner */}
        <div className="absolute -top-24 left-8">
          <div className="rounded-xl overflow-hidden shadow-lg border-4 border-slate-700">
            <UserAvatar
              width={150}
              avatar_url={userData.avatar_image ? getUserAvatarMediaDirectory(userData.user_uuid, userData.avatar_image) : ''}
              predefined_avatar={userData.avatar_image ? undefined : 'empty'}
              userId={userData.id}
              showProfilePopup
              rounded="rounded-xl"
            />
          </div>
        </div>

        {/* Affiliation Logos */}
        <div className="absolute -top-12 right-8 flex items-center gap-4">
          {profile.sections?.map((section: any) => (
            section.type === 'affiliation' && section.affiliations?.map((affiliation: any, index: number) => (
              affiliation.logoUrl && (
                <div key={index} className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border-2 border-white/20">
                  <img 
                    src={affiliation.logoUrl} 
                    alt={affiliation.name}
                    className="w-16 h-16 object-contain"
                    title={affiliation.name}
                  />
                </div>
              )
            ))
          ))}
        </div>

        {/* Profile Content with right padding to avoid overlap */}
        <div className="mt-20 md:mt-14">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left column with details - aligned with avatar */}
            <div className="w-full md:w-1/6 pl-2">
              {/* Name */}
              <h1 className="text-[32px] font-bold mb-8">
                {userData.first_name} {userData.last_name}
              </h1>

              {/* Details */}
              <div className="flex flex-col space-y-3">
                {userData.details && Object.values(userData.details).map((detail: any) => (
                  <div key={detail.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <IconComponent iconName={detail.icon} />
                    </div>
                    <span className="text-gray-700 text-[15px] font-medium">{detail.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column with about and related content */}
            <div className="w-full md:w-4/6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                {userData.bio ? (
                  <p className="text-gray-700">{userData.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No biography provided</p>
                )}
              </div>
              
              {/* Profile sections from profile builder */}
              {profile.sections && profile.sections.length > 0 && (
                <div>
                  {profile.sections.map((section: any, index: number) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                      
                      {/* Add Image Gallery section */}
                      {section.type === 'image-gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {section.images.map((image: any, imageIndex: number) => (
                            <div
                              key={imageIndex}
                              className="relative group cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                            >
                              <img
                                src={image.url}
                                alt={image.caption || ''}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              {image.caption && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center p-4">
                                  <p className="text-white text-center text-sm">{image.caption}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {section.type === 'text' && (
                        <div className="prose max-w-none">{section.content}</div>
                      )}
                      
                      {section.type === 'links' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {section.links.map((link: any, linkIndex: number) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                            >
                              <LinkIcon className="w-4 h-4" />
                              <span>{link.title}</span>
                            </a>
                          ))}
                        </div>
                      )}
                      
                      {section.type === 'skills' && (
                        <div className="flex flex-wrap gap-2">
                          {section.skills.map((skill: any, skillIndex: number) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {skill.name}
                              {skill.level && ` • ${skill.level}`}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {section.type === 'experience' && (
                        <div className="space-y-4">
                          {section.experiences.map((exp: any, expIndex: number) => (
                            <div key={expIndex} className="border-l-2 border-gray-200 pl-4">
                              <h3 className="font-medium">{exp.title}</h3>
                              <p className="text-gray-600">{exp.organization}</p>
                              <p className="text-sm text-gray-500">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                              {exp.description && (
                                <p className="mt-2 text-gray-700">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {section.type === 'education' && (
                        <div className="space-y-4">
                          {section.education.map((edu: any, eduIndex: number) => (
                            <div key={eduIndex} className="border-l-2 border-gray-200 pl-4">
                              <h3 className="font-medium">{edu.institution}</h3>
                              <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                              <p className="text-sm text-gray-500">
                                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                              </p>
                              {edu.description && (
                                <p className="mt-2 text-gray-700">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === 'affiliation' && (
                        <div className="space-y-4">
                          {section.affiliations.map((affiliation: any, affIndex: number) => (
                            <div key={affIndex} className="border-l-2 border-gray-200 pl-4">
                              <div className="flex items-start gap-4">
                                {affiliation.logoUrl && (
                                  <img 
                                    src={affiliation.logoUrl} 
                                    alt={affiliation.name}
                                    className="w-12 h-12 object-contain"
                                  />
                                )}
                                <div>
                                  <h3 className="font-medium">{affiliation.name}</h3>
                                  {affiliation.description && (
                                    <p className="mt-2 text-gray-700">{affiliation.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === 'courses' && (
                        <div>
                          {isLoadingCourses ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                          ) : userCourses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                              {userCourses.map((course) => (
                                <div key={course.id} className="flex">
                                  <CourseThumbnailLanding
                                    course={course}
                                    orgslug={userData.org_slug || course.org_slug}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No courses found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
}

export default UserProfileClient 