import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, name, profileType, city } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseServiceKey && supabaseUrl !== 'https://placeholder.supabase.co') {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      await supabase.from('leads_waitlist').insert([
        {
          email,
          full_name: name || null,
          profile_type: profileType || 'bailleur',
          city: city || 'Cotonou',
          source: 'landing_api',
        },
      ]);
    }

    // Envoi de l'email de bienvenue / confirmation via Resend
    await sendWelcomeEmail({
      to: email,
      name: name || 'Bailleur',
    });

    return NextResponse.json({ success: true, message: 'Lead enregistré et email envoyé' });
  } catch (err: any) {
    console.error('API Leads error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
