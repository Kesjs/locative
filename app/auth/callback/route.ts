import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let targetPath = '/dashboard';

      if (user) {
        let { data: profile } = await supabase
          .from('profiles')
          .select('id, role, onboarding_completed, organization_id')
          .eq('id', user.id)
          .maybeSingle();

        // Si le profil n'existe pas encore (ex: premier sign-in Google)
        if (!profile) {
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Utilisateur';

          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                full_name: fullName,
                role: 'owner',
                onboarding_completed: false,
              },
            ])
            .select()
            .maybeSingle();

          profile = newProfile;
        }

        // Détermination de la cible selon l'état d'onboarding et le rôle
        if (!profile || !profile.onboarding_completed) {
          targetPath = '/onboarding';
        } else if (next && next !== '/dashboard' && !next.startsWith('/auth')) {
          targetPath = next;
        } else if (profile.role === 'tenant') {
          targetPath = '/locataire';
        } else if (profile.role === 'super_admin') {
          targetPath = '/admin';
        } else {
          targetPath = '/dashboard';
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${targetPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${targetPath}`);
      } else {
        return NextResponse.redirect(`${origin}${targetPath}`);
      }
    }
  }

  // Si erreur ou pas de code, renvoyer vers la page de login avec un paramètre d'erreur
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
