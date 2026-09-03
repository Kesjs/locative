import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Si un code OAuth (ex: retour Google) atterrit sur la racine ou une autre page au lieu de /auth/callback
  if (request.nextUrl.searchParams.has('code') && pathname !== '/auth/callback') {
    const code = request.nextUrl.searchParams.get('code')!
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    url.searchParams.set('code', code)
    return NextResponse.redirect(url)
  }

  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/locataire')
  const isAuthPath = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')
  const isOnboardingPath = pathname === '/onboarding'

  // Redirection vers login si accès à une route protégée sans être connecté
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Si connecté, vérifier l'onboarding et le rôle pour les redirections
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .maybeSingle()

    // Si nouveau compte non complété tentant d'accéder au dashboard
    if (isProtectedPath && profile && !profile.onboarding_completed) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // Si déjà complété mais tente d'aller sur /onboarding
    if (isOnboardingPath && profile?.onboarding_completed) {
      const url = request.nextUrl.clone()
      if (profile.role === 'tenant') {
        url.pathname = '/locataire'
      } else if (profile.role === 'super_admin') {
        url.pathname = '/admin'
      } else {
        url.pathname = '/dashboard'
      }
      return NextResponse.redirect(url)
    }

    // Si déjà connecté et tente d'aller sur login/register
    if (isAuthPath) {
      const url = request.nextUrl.clone()
      if (!profile || !profile.onboarding_completed) {
        url.pathname = '/onboarding'
      } else if (profile.role === 'tenant') {
        url.pathname = '/locataire'
      } else if (profile.role === 'super_admin') {
        url.pathname = '/admin'
      } else {
        url.pathname = '/dashboard'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
