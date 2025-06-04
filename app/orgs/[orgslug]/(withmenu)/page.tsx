export const dynamic = 'force-dynamic'
import { Metadata } from 'next'
import { getUriWithOrg } from '@services/config/config'
import { getOrgCourses } from '@services/courses/courses'
import Link from 'next/link'
import { getOrganizationContextInfo } from '@services/organizations/orgs'
import GeneralWrapperStyled from '@components/Objects/StyledElements/Wrappers/GeneralWrapper'
import TypeOfContentTitle from '@components/Objects/StyledElements/Titles/TypeOfContentTitle'
import CourseThumbnail from '@components/Objects/Thumbnails/CourseThumbnail'
import CollectionThumbnail from '@components/Objects/Thumbnails/CollectionThumbnail'
import AuthenticatedClientElement from '@components/Security/AuthenticatedClientElement'
import NewCourseButton from '@components/Objects/StyledElements/Buttons/NewCourseButton'
import NewCollectionButton from '@components/Objects/StyledElements/Buttons/NewCollectionButton'
import ContentPlaceHolderIfUserIsNotAdmin from '@components/Objects/ContentPlaceHolder'
import { getOrgCollections } from '@services/courses/collections'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from 'app/auth/options'
import { getOrgThumbnailMediaDirectory } from '@services/media/media'
import LandingClassic from '@components/Landings/LandingClassic'
import LandingCustom from '@components/Landings/LandingCustom'
import { mockOrganization, mockCourses, mockCollections, isDevelopmentMode } from '@services/utils/mock-data'

type MetadataProps = {
  params: Promise<{ orgslug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: MetadataProps): Promise<Metadata> {
  const params = await props.params;
  
  // Enhanced fallback metadata
  const fallbackMetadata: Metadata = {
    title: 'Home — SoftLearn',
    description: 'Learning Management System - Empowering education through technology',
    keywords: ['learning', 'education', 'courses', 'online learning', 'LMS'],
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title: 'Home — SoftLearn',
      description: 'Learning Management System',
      type: 'website',
      siteName: 'SoftLearn',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Home — SoftLearn',
      description: 'Learning Management System',
    },
  }
  
  try {
    // Get Org context information with timeout
    const org = await Promise.race([
      getOrganizationContextInfo(params.orgslug, {
        revalidate: 0,
        tags: ['organizations'],
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Metadata fetch timeout')), 5000)
      )
    ]) as any

    if (!org) {
      return fallbackMetadata
    }

    // Enhanced SEO metadata
    return {
      title: `Home — ${org.name}`,
      description: org.description || `Welcome to ${org.name} - Your learning destination`,
      keywords: ['learning', 'education', 'courses', org.name, ...(org.tags || [])],
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
        },
      },
      openGraph: {
        title: `Home — ${org.name}`,
        description: org.description || `Welcome to ${org.name}`,
        type: 'website',
        siteName: org.name,
        images: org.thumbnail_image ? [
          {
            url: getOrgThumbnailMediaDirectory(org.org_uuid, org.thumbnail_image),
            width: 800,
            height: 600,
            alt: `${org.name} - Learning Platform`,
          },
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Home — ${org.name}`,
        description: org.description || `Welcome to ${org.name}`,
      },
    }
  } catch (error) {
    console.warn('Failed to generate metadata for org:', params.orgslug, error)
    return fallbackMetadata
  }
}

const OrgHomePage = async (props: { params: Promise<{ orgslug: string }> }) => {
  // Safely extract params with better error handling
  let params, orgslug
  try {
    params = await props.params
    orgslug = params?.orgslug?.trim()
    
    if (!orgslug) {
      throw new Error('No organization slug provided')
    }
  } catch (error) {
    console.error('Error extracting params:', error)
    orgslug = 'softlearn' // fallback orgslug
  }

  const session = await getServerSession(nextAuthOptions)
  const access_token = session?.tokens?.access_token
  
  // Initialize with better typing
  let org: any = null
  let courses: any[] = []
  let collections: any[] = []
  let org_id: string = orgslug || 'softlearn'
  let errors: { org?: string; courses?: string; collections?: string } = {}
  
  // Fetch organization info with enhanced error handling
  try {
    org = await Promise.race([
      getOrganizationContextInfo(orgslug, {
        revalidate: 0,
        tags: ['organizations'],
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Organization fetch timeout')), 10000)
      )
    ]) as any
    
    if (org?.id) {
      org_id = org.id
    }
  } catch (error) {
    console.warn(`Failed to fetch organization info for "${orgslug}":`, error)
    errors.org = error instanceof Error ? error.message : 'Unknown error'
  }
  
  // Fetch courses with enhanced error handling
  try {
    courses = await Promise.race([
      getOrgCourses(
        orgslug,
        { revalidate: 0, tags: ['courses'] },
        access_token || null
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Courses fetch timeout')), 8000)
      )
    ]) as any[]
    
    // Ensure courses is always an array
    courses = Array.isArray(courses) ? courses : []
  } catch (error) {
    console.warn(`Failed to fetch courses for "${orgslug}":`, error)
    errors.courses = error instanceof Error ? error.message : 'Unknown error'
    courses = []
  }
  
  // Fetch collections with enhanced error handling (only if we have org info)
  if (org?.id) {
    try {
      collections = await Promise.race([
        getOrgCollections(
          org.id,
          access_token || null,
          { revalidate: 0, tags: ['courses'] }
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Collections fetch timeout')), 8000)
        )
      ]) as any[]
      
      // Ensure collections is always an array
      collections = Array.isArray(collections) ? collections : []
    } catch (error) {
      console.warn(`Failed to fetch collections for org "${org.id}":`, error)
      errors.collections = error instanceof Error ? error.message : 'Unknown error'
      collections = []
    }
  }

  // Check if custom landing is enabled with safe access
  const hasCustomLanding = org?.config?.config?.landing?.enabled === true
  const hasErrors = Object.keys(errors).length > 0

  // Enhanced debug logging
  console.log('Debug - OrgHomePage data:', {
    orgslug,
    org_id,
    hasOrg: !!org,
    orgName: org?.name,
    coursesCount: courses.length,
    collectionsCount: collections.length,
    hasCustomLanding,
    accessToken: !!access_token,
    errors,
    hasErrors
  })

  // Enhanced development mode handling
  if (isDevelopmentMode() && !org && errors.org) {
    console.log('Using mock data due to organization not found...')
    return (
      <div className="w-full">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 m-4">
          <div className="flex items-center space-x-2 text-yellow-300">
            <span>⚠️</span>
            <div>
              <p className="text-sm font-medium">
                <strong>Development Mode:</strong> Organization "{orgslug}" not found.
              </p>
              <p className="text-xs mt-1 text-yellow-400">
                Error: {errors.org} | Using mock data for development.
              </p>
            </div>
          </div>
        </div>
        <LandingClassic 
          courses={mockCourses}
          collections={mockCollections}
          orgslug={orgslug}
          org_id={mockOrganization.id}
        />
      </div>
    )
  }

  // Production error handling - redirect to error page or show minimal error
  if (!org && !isDevelopmentMode()) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4 p-8 max-w-md">
          <div className="text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-white">Organization Not Found</h1>
          <p className="text-slate-300">
            The organization "{orgslug}" could not be found or is temporarily unavailable.
          </p>
          <div className="pt-4">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Show error banner in development if there are partial errors */}
      {isDevelopmentMode() && hasErrors && org && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 m-4">
          <div className="flex items-start space-x-2 text-orange-300">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium">Some data failed to load:</p>
              <ul className="text-xs mt-1 space-y-1 text-orange-400">
                {errors.courses && <li>• Courses: {errors.courses}</li>}
                {errors.collections && <li>• Collections: {errors.collections}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {hasCustomLanding && org ? (
        <LandingCustom 
          landing={org.config.config.landing}
          orgslug={orgslug}
        />
      ) : (
        <LandingClassic 
          courses={courses}
          collections={collections}
          orgslug={orgslug}
          org_id={org_id}
        />
      )}
    </div>
  )
}

export default OrgHomePage
