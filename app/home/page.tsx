import React from 'react'
import { getDefaultOrg, isMultiOrgModeEnabled } from '@services/config/config'
import { getOrganizationContextInfo } from '@services/organizations/orgs'
import { getOrgCourses } from '@services/courses/courses'
import { getOrgCollections } from '@services/courses/collections'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from 'app/auth/options'
import LandingClassic from '@components/Landings/LandingClassic'
import { mockOrganization, mockCourses, mockCollections, isDevelopmentMode } from '@services/utils/mock-data'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Home - SoftLearn Learning Platform',
  description: 'Welcome to SoftLearn - Your comprehensive learning management system for courses, collections, and educational content.',
  keywords: 'LMS, Learning Management System, Online Education, Course Platform, E-Learning',
}

export default async function HomePage() {
  // Get the default organization
  const default_org = getDefaultOrg() as string
  const orgslug = default_org
  
  const session = await getServerSession(nextAuthOptions)
  const access_token = session?.tokens?.access_token
  
  // Initialize variables
  let org: any = null
  let courses: any[] = []
  let collections: any[] = []
  let org_id: string = orgslug
  let errors: { org?: string; courses?: string; collections?: string } = {}
  
  // Fetch organization info
  try {
    org = await getOrganizationContextInfo(orgslug, {
      revalidate: 0,
      tags: ['organizations'],
    })
    
    if (org?.id) {
      org_id = org.id
    }
  } catch (error) {
    console.warn(`Failed to fetch organization info for "${orgslug}":`, error)
    errors.org = error instanceof Error ? error.message : 'Unknown error'
  }
  
  // Fetch courses
  try {
    courses = await getOrgCourses(
      orgslug,
      { revalidate: 0, tags: ['courses'] },
      access_token || null
    )
    
    courses = Array.isArray(courses) ? courses : []
  } catch (error) {
    console.warn(`Failed to fetch courses for "${orgslug}":`, error)
    errors.courses = error instanceof Error ? error.message : 'Unknown error'
    courses = []
  }
  
  // Fetch collections (only if we have org info)
  if (org?.id) {
    try {
      collections = await getOrgCollections(
        org.id,
        access_token || null,
        { revalidate: 0, tags: ['courses'] }
      )
      
      collections = Array.isArray(collections) ? collections : []
    } catch (error) {
      console.warn(`Failed to fetch collections for org "${org.id}":`, error)
      errors.collections = error instanceof Error ? error.message : 'Unknown error'
      collections = []
    }
  }
  
  // If in development mode and we have errors, use mock data
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
                Using mock data for development.
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
  
  // If we don't have org data and not in development, show error
  if (!org) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Organization Not Found</h1>
          <p className="text-gray-300">Unable to load organization data.</p>
        </div>
      </div>
    )
  }
  
  return (
    <LandingClassic 
      courses={courses}
      collections={collections}
      orgslug={orgslug}
      org_id={org_id}
    />
  )
}