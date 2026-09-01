import { NextResponse } from 'next/server';
import { sendPropertyShowcaseEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      to,
      prospectName,
      ownerName,
      propertyTitle,
      propertyAddress,
      propertyType,
      rentAmountFcfa,
      chargesAmountFcfa,
      photoUrl,
      features,
      visitFeeFcfa,
      customMessage,
      showcaseUrl,
    } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { error: 'Une adresse email valide est requise.' },
        { status: 400 }
      );
    }

    const emailResult = await sendPropertyShowcaseEmail({
      to,
      prospectName: prospectName || 'Cher prospect',
      ownerName: ownerName || 'Votre bailleur',
      propertyTitle: propertyTitle || 'Logement de standing',
      propertyAddress: propertyAddress || 'Cotonou, Bénin',
      propertyType: propertyType || 'Appartement',
      rentAmountFcfa: Number(rentAmountFcfa) || 0,
      chargesAmountFcfa: Number(chargesAmountFcfa) || 0,
      photoUrl,
      features: features || [],
      visitFeeFcfa: visitFeeFcfa ? Number(visitFeeFcfa) : undefined,
      customMessage,
      showcaseUrl: showcaseUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lokka.bj'}/p/patrimoine-lokka`,
    });

    return NextResponse.json({
      success: true,
      emailResult,
    });
  } catch (error: any) {
    console.error('Error sending showcase email:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l’envoi de la fiche annonce.' },
      { status: 500 }
    );
  }
}
