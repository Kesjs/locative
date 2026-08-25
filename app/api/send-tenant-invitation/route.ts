import { NextResponse } from 'next/server';
import { sendTenantInvitationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tenantName,
      tenantEmail,
      tenantPhone,
      ownerName,
      propertyTitle,
      propertyAddress,
      rentAmount,
      depositMonths = 3,
    } = body;

    if (!tenantName || (!tenantEmail && !tenantPhone)) {
      return NextResponse.json(
        { error: 'Le nom du locataire et un contact (email ou téléphone) sont requis.' },
        { status: 400 }
      );
    }

    const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://codeo-ui.com'}/locataire`;

    // WhatsApp Message Text template
    const whatsappMessage = `*LOKKA BÉNIN — Votre Espace Locataire est prêt !* 🇧🇯\n\nBonjour ${tenantName},\nVotre propriétaire/gestionnaire *${ownerName || 'votre bailleur'}* vous a créé un accès à votre espace pour *${propertyTitle}*.\n\n• *Loyer mensuel :* ${Number(rentAmount).toLocaleString('fr-FR')} FCFA\n• *Caution légale (Loi 2022-30) :* ${(Number(rentAmount) * Number(depositMonths)).toLocaleString('fr-FR')} FCFA (${depositMonths} mois)\n\n👉 *Accéder à votre espace :* ${portalUrl}\n\n_Connectez-vous avec votre numéro (+229) et votre code de sécurité pour télécharger vos quittances PDF et payer votre loyer par MoMo._`;

    // Send email via Resend if email is provided
    let emailResult = null;
    if (tenantEmail && tenantEmail.includes('@')) {
      emailResult = await sendTenantInvitationEmail({
        to: tenantEmail,
        tenantName,
        ownerName: ownerName || 'Votre bailleur',
        propertyTitle: propertyTitle || 'Votre logement',
        propertyAddress: propertyAddress || 'Cotonou, Bénin',
        rentAmountFcfa: Number(rentAmount) || 0,
        depositMonths: Number(depositMonths) || 3,
        portalUrl,
      });
    }

    return NextResponse.json({
      success: true,
      emailResult,
      whatsappMessage,
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
