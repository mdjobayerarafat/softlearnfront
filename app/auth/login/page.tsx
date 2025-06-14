import { getOrganizationContextInfo } from '@services/organizations/orgs'
import LoginClient from './login'
import { Metadata } from 'next'

type MetadataProps = {
  params: Promise<{ orgslug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(params: MetadataProps): Promise<Metadata> {
  const orgslug = (await params.searchParams).orgslug
  
  try {
    // Get Org context information
    const org = await getOrganizationContextInfo(orgslug, {
      revalidate: 0,
      tags: ['organizations'],
    })

    return {
      title: 'Login' + ` — ${org.name}`,
    }
  } catch (error) {
    console.warn('Failed to fetch organization info for metadata:', error)
    return {
      title: 'Login — SoftLearn',
    }
  }
}

const Login = async (params: MetadataProps) => {
  const orgslug = (await params.searchParams).orgslug
  
  try {
    const org = await getOrganizationContextInfo(orgslug, {
      revalidate: 0,
      tags: ['organizations'],
    })

    return (
      <div>
        <LoginClient org={org}></LoginClient>
      </div>
    )
  } catch (error) {
    console.warn('Failed to fetch organization info:', error)
    
    // Provide a fallback organization object
    const fallbackOrg = {
      name: 'SoftLearn',
      description: 'Learning Management System',
      orgslug: orgslug || 'default',
      id: 'default',
      org_uuid: 'default',
      thumbnail_image: null,
      config: null
    }
    
    return (
      <div>
        <LoginClient org={fallbackOrg}></LoginClient>
      </div>
    )
  }
}

export default Login
