import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const cookieStore = await cookies();
    const supabase = await createClient();

    try {
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
              .upsert(
                [
                  {
                    id: user.id,
                    email: user.email,
                    full_name: fullName,
                    role: 'owner',
                    onboarding_completed: false,
                  },
                ],
                { onConflict: 'id' }
              )
              .select()
              .maybeSingle();

            profile = newProfile;
          }

          // Détermination de la cible selon l'état d'onboarding et le rôle
          if (!profile || !profile.onboarding_completed) {
            targetPath = '/onboarding';
          } else if (profile.role === 'tenant') {
            targetPath = '/locataire';
          } else if (profile.role === 'super_admin') {
            targetPath = '/admin';
          } else if (next && !next.startsWith('/auth') && next !== '/onboarding') {
            targetPath = next;
          } else {
            targetPath = '/dashboard';
          }
        }

        const forwardedHost = request.headers.get('x-forwarded-host');
        const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
        const isLocalEnv = process.env.NODE_ENV === 'development';

        const redirectUrl = isLocalEnv
          ? `${origin}${targetPath}`
          : forwardedHost
          ? `${forwardedProto}://${forwardedHost}${targetPath}`
          : `${origin}${targetPath}`;

        const response = NextResponse.redirect(redirectUrl);

        // Propager explicitement les cookies de session dans la réponse de redirection
        cookieStore.getAll().forEach((c) => {
          response.cookies.set(c.name, c.value);
        });

        return response;
      } else {
        console.error('exchangeCodeForSession error in /auth/callback:', error.message);
      }
    } catch (err) {
      console.error('Unexpected exception in /auth/callback:', err);
    }
  }

  // Si erreur ou pas de code, renvoyer vers la page de login avec un paramètre d'erreur
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}

