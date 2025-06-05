import {
  LEARNHOUSE_DOMAIN,
  LEARNHOUSE_TOP_DOMAIN,
  getDefaultOrg,
  getUriWithOrg,
  isMultiOrgModeEnabled,
} from './services/config/config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. Umami Analytics
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|umami|examples|[\\w-]+\\.\\w+).*)',
    '/sitemap.xml',
    '/payments/stripe/connect/oauth',
  ],
}

export default async function middleware(req: NextRequest) {
  const hosting_mode = isMultiOrgModeEnabled() ? 'multi' : 'single'
  const default_org = getDefaultOrg()
  const { pathname, search } = req.nextUrl
  const fullhost = req.headers ? req.headers.get('host') : ''
  const cookie_orgslug = req.cookies.get('learnhouse_current_orgslug')?.value

  // Allow root page to load normally
if (pathname === '/') {
return NextResponse.next()
}

// Allow home page to load normally

  // Auth paths handling
  const auth_paths = ['/login', '/signup', '/reset', '/forgot']
  
  if (auth_paths.includes(pathname)) {
    const response = NextResponse.rewrite(
      new URL(`/auth${pathname}${search}`, req.url)
    )

    const searchParams = new URLSearchParams(search)
    const orgslug = searchParams.get('orgslug')

    if (orgslug) {
      response.cookies.set({
        name: 'learnhouse_current_orgslug',
        value: orgslug,
        domain: LEARNHOUSE_TOP_DOMAIN == 'localhost' ? '' : LEARNHOUSE_TOP_DOMAIN,
        path: '/',
      })
    }
    return response
  }

  // Dynamic Pages Editor
  if (pathname.match(/^\/course\/[^/]+\/activity\/[^/]+\/edit$/)) {
    return NextResponse.rewrite(new URL(`/editor${pathname}`, req.url))
  }

  // Stripe callback handling
  if (req.nextUrl.pathname.startsWith('/payments/stripe/connect/oauth')) {
    const searchParams = req.nextUrl.searchParams
    const orgslug = searchParams.get('state')?.split('_')[0]
    
    const redirectUrl = new URL('/payments/stripe/connect/oauth', req.url)
    
    searchParams.forEach((value, key) => {
      redirectUrl.searchParams.append(key, value)
    })
    
    if (orgslug) {
      redirectUrl.searchParams.set('orgslug', orgslug)
    }

    return NextResponse.rewrite(redirectUrl)
  }

  // Health Check
  if (pathname.startsWith('/health')) {
    return NextResponse.rewrite(new URL(`/api/health`, req.url))
  }

  // Auth Redirects
  if (pathname == '/redirect_from_auth') {
    if (cookie_orgslug) {
      const searchParams = req.nextUrl.searchParams
      const queryString = searchParams.toString()
      const redirectPathname = '/home'
      const redirectUrl = new URL(
        getUriWithOrg(cookie_orgslug, redirectPathname),
        req.url
      )

      if (queryString) {
        redirectUrl.search = queryString
      }
      return NextResponse.redirect(redirectUrl)
    } else {
      return NextResponse.json({ error: 'Did not find the orgslug in the cookie' })
    }
  }

  // Sitemap handling
  if (pathname.startsWith('/sitemap.xml')) {
    let orgslug: string;
    
    if (hosting_mode === 'multi') {
      orgslug = fullhost
        ? fullhost.replace(`.${LEARNHOUSE_DOMAIN}`, '')
        : (default_org as string);
    } else {
      orgslug = default_org as string;
    }

    const sitemapUrl = new URL(`/api/sitemap`, req.url);
    const response = NextResponse.rewrite(sitemapUrl);
    response.headers.set('X-Sitemap-Orgslug', orgslug);

    return response;
  }

  // Multi Organization Mode
  if (hosting_mode === 'multi') {
    const orgslug = fullhost
      ? fullhost.replace(`.${LEARNHOUSE_DOMAIN}`, '')
      : (default_org as string)
    const response = NextResponse.rewrite(
      new URL(`/orgs/${orgslug}${pathname}`, req.url)
    )

    response.cookies.set({
      name: 'learnhouse_current_orgslug',
      value: orgslug,
      domain: LEARNHOUSE_TOP_DOMAIN == 'localhost' ? '' : LEARNHOUSE_TOP_DOMAIN,
      path: '/',
    })

    return response
  }

  // Single Organization Mode - for all other paths
  if (hosting_mode === 'single') {
    // Skip certain paths that shouldn't be rewritten
    const skipPaths = ['/orgs/', '/auth/', '/api/', '/_next/', '/home']
    
    if (skipPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }
    
    // Rewrite other paths to org structure
    const orgslug = default_org as string
    const response = NextResponse.rewrite(
      new URL(`/orgs/${orgslug}${pathname}`, req.url)
    )

    response.cookies.set({
      name: 'learnhouse_current_orgslug',
      value: orgslug,
      domain: LEARNHOUSE_TOP_DOMAIN == 'localhost' ? '' : LEARNHOUSE_TOP_DOMAIN,
      path: '/',
    })

    return response
  }

  // Default fallback
  return NextResponse.next()
}
