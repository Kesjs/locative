import { NextResponse } from 'next/server';
import { sendTenantInvitationEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tenantName,
      tenantEmail,
      tenantPhone,
      ownerName,
      agencyName,
      isAgency,
      propertyTitle,
      propertyAddress,
      rentAmount,
      depositMonths = 3,
      temporaryPassword,
      customMessage,
      subject,
    } = body;

    if (!tenantName || (!tenantEmail && !tenantPhone)) {
      return NextResponse.json(
        { error: 'Le nom du locataire et un contact (email ou téléphone) sont requis.' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codeo-ui.com';
    const portalUrl = tenantEmail
      ? `${siteUrl}/auth/locataire?email=${encodeURIComponent(tenantEmail)}`
      : `${siteUrl}/auth/locataire`;

    // 1. Provisionner automatiquement le compte Supabase Auth pour le locataire si mot de passe fourni
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey && tenantEmail && temporaryPassword) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        // Tenter de créer l'utilisateur
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: tenantEmail,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: {
            full_name: tenantName,
            phone_number: tenantPhone || '',
            role: 'tenant',
          },
        });

        if (createError) {
          // Si l'utilisateur existe déjà, mettre à jour son mot de passe
          if (createError.message?.toLowerCase().includes('already') || createError.message?.toLowerCase().includes('exists')) {
            const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
            const existing = userList?.users?.find((u) => u.email?.toLowerCase() === tenantEmail.toLowerCase());
            if (existing) {
              await supabaseAdmin.auth.admin.updateUserById(existing.id, {
                password: temporaryPassword,
                user_metadata: { ...existing.user_metadata, role: 'tenant', full_name: tenantName },
              });
              await supabaseAdmin.from('profiles').update({ role: 'tenant', full_name: tenantName }).eq('id', existing.id);
            }
          } else {
            console.warn('Supabase Admin createUser notice:', createError.message);
          }
        } else if (newUser?.user) {
          // Garantir son profil locataire
          await supabaseAdmin
            .from('profiles')
            .upsert({
              id: newUser.user.id,
              email: tenantEmail,
              full_name: tenantName,
              phone_number: tenantPhone || '',
              role: 'tenant',
              onboarding_completed: true,
            });
        }
      } catch (authErr: any) {
        console.warn('Supabase Admin provisioning warning:', authErr?.message);
      }
    }

    // 2. Envoyer l'email officiel d'invitation avec identifiants et consignes de sécurité
    let emailResult = null;
    if (tenantEmail && tenantEmail.includes('@')) {
      emailResult = await sendTenantInvitationEmail({
        to: tenantEmail,
        tenantName,
        ownerName: ownerName || 'Votre bailleur',
        agencyName: agencyName || undefined,
        isAgency: Boolean(isAgency),
        propertyTitle: propertyTitle || 'Votre logement',
        propertyAddress: propertyAddress || 'Cotonou, Bénin',
        rentAmountFcfa: Number(rentAmount) || 0,
        depositMonths: Number(depositMonths) || 3,
        temporaryPassword,
        customMessage,
        subject,
        portalUrl,
      });
    }

    return NextResponse.json({
      success: true,
      emailResult,
      portalUrl,
    });
  } catch (error: any) {
    console.error('Error sending tenant invitation:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l’envoi de l’invitation.' },
      { status: 500 }
    );
  }
}
