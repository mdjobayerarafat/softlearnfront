// Mock data for development when API is not available
export const mockOrganization = {
  id: 'default',
  name: 'SoftLearn Demo',
  description: 'A demo organization for development',
  orgslug: 'default',
  org_uuid: 'demo-org-uuid',
  thumbnail_image: null,
  config: {
    config: {
      landing: {
        enabled: false
      }
    }
  }
}

export const mockCourses = [
  {
    course_uuid: 'demo-course-1',
    name: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    thumbnail_image: null,
    published: true,
    instructor_name: 'Demo Instructor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    course_uuid: 'demo-course-2',
    name: 'React Fundamentals',
    description: 'Master React components, hooks, and state management',
    thumbnail_image: null,
    published: true,
    instructor_name: 'Demo Instructor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    course_uuid: 'demo-course-3',
    name: 'Node.js Backend Development',
    description: 'Build RESTful APIs with Node.js and Express',
    thumbnail_image: null,
    published: true,
    instructor_name: 'Demo Instructor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const mockCollections = [
  {
    collection_id: 'demo-collection-1',
    collection_uuid: 'demo-collection-uuid-1',
    name: 'Frontend Development',
    description: 'A collection of courses focused on frontend technologies',
    thumbnail_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    collection_id: 'demo-collection-2',
    collection_uuid: 'demo-collection-uuid-2',
    name: 'Full Stack Development',
    description: 'Complete courses for becoming a full stack developer',
    thumbnail_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LEARNHOUSE_API_URL}health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch (error) {
    console.warn('API health check failed:', error)
    return false
  }
}

export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development'
}
