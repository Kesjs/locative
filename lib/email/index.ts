import { resend, SENDER_EMAIL, isResendConfigured } from './resend';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Envoie un email générique via Resend
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  if (!isResendConfigured() || !resend) {
    console.warn('[Resend] Clé API non configurée. L’email suivant n’a pas été envoyé :', {
      to,
      subject,
    });
    return { success: false, error: 'RESEND_API_KEY_MISSING' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Resend Exception]:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Modèle d'email : Confirmation d'inscription / Bienvenue
 */
export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #0F172A; margin: 0; padding: 24px; }
    .card { background-color: #FFFFFF; border: 1px solid #E8E5E0; border-radius: 8px; max-width: 560px; margin: 0 auto; padding: 32px; }
    .header { border-bottom: 1px solid #F0EDE8; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px; }
    .badge { display: inline-block; background-color: #E6F5EF; color: #087F5B; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-top: 8px; }
    .content { font-size: 15px; line-height: 1.6; color: #64635F; }
    .btn { display: inline-block; background-color: #0F172A; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 20px; }
    .footer { font-size: 12px; color: #9C9A95; margin-top: 32px; border-top: 1px solid #F0EDE8; padding-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Lokka</div>
      <div class="badge">Gestion Locative — Bénin 🇧🇯</div>
    </div>
    <div class="content">
      <p style="color: #0F172A; font-weight: 600; font-size: 17px;">Bonjour ${name || 'Cher bailleur'},</p>
      <p>Bienvenue sur <strong>Lokka</strong>, votre outil de gestion locative et de suivi financier conforme à la Loi 2022-30 au Bénin.</p>
      <p>Votre espace est prêt. Vous pouvez dès maintenant :</p>
      <ul>
        <li>Ajouter vos biens immobiliers et logements</li>
        <li>Enregistrer vos locataires et générer des baux conformes</li>
        <li>Suivre les encaissements MTN MoMo, Moov Money et virements</li>
      </ul>
      <p style="text-align: center; margin-top: 28px;">
        <a href="https://lokka.bj/dashboard" class="btn">Accéder à mon espace Lokka</a>
      </p>
    </div>
    <div class="footer">
      Lokka • Cotonou, Bénin • <a href="https://lokka.bj" style="color: #64635F;">lokka.bj</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: 'Bienvenue sur Lokka — Votre espace de gestion locative',
    html,
  });
}

/**
 * Modèle d'email : Invitation Locataire & Coordonnées de Connexion avec Message Personnalisé
 */
export async function sendTenantInvitationEmail({
  to,
  tenantName,
  ownerName,
  propertyTitle,
  propertyAddress,
  rentAmountFcfa,
  depositMonths = 3,
  customMessage,
  subject,
  portalUrl = 'https://lokka.bj/locataire',
}: {
  to: string;
  tenantName: string;
  ownerName: string;
  propertyTitle: string;
  propertyAddress: string;
  rentAmountFcfa: number;
  depositMonths?: number;
  customMessage?: string;
  subject?: string;
  portalUrl?: string;
}) {
  const formattedRent = new Intl.NumberFormat('fr-FR').format(rentAmountFcfa);
  const depositAmount = rentAmountFcfa * depositMonths;
  const formattedDeposit = new Intl.NumberFormat('fr-FR').format(depositAmount);

  const customMessageBlock = customMessage?.trim()
    ? `
    <div style="background-color: #F8F6F0; border-left: 3px solid #087F5B; padding: 14px 16px; margin: 18px 0; border-radius: 4px; font-style: italic; color: #1C1C1C; font-size: 13.5px;">
      "${customMessage.replace(/\n/g, '<br/>')}"
      <div style="font-style: normal; font-weight: 700; font-size: 11.5px; margin-top: 6px; color: #64635F;">— Note de votre bailleur ${ownerName}</div>
    </div>
    `
    : '';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #0F172A; margin: 0; padding: 24px; }
    .card { background-color: #FFFFFF; border: 1px solid #E8E5E0; border-radius: 10px; max-width: 580px; margin: 0 auto; padding: 32px; }
    .header { border-bottom: 1px solid #F0EDE8; padding-bottom: 16px; margin-bottom: 20px; }
    .logo { font-size: 22px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; }
    .badge { display: inline-block; background-color: #E6F5EF; color: #087F5B; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 8px; }
    .box { background-color: #FAF9F6; border: 1px solid #E8E5E0; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 14px; }
    .btn { display: inline-block; background-color: #0F172A; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 10px; }
    .footer { font-size: 12px; color: #9C9A95; margin-top: 32px; border-top: 1px solid #F0EDE8; padding-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Lokka</div>
      <div class="badge">Espace Locataire Sécurisé · Loi 2022-30 🇧🇯</div>
    </div>

    <p style="font-size: 16px; color: #0F172A; font-weight: 700; margin-bottom: 12px;">Bonjour ${tenantName},</p>
    <p style="font-size: 14px; color: #64635F; line-height: 1.6;">
      Votre bailleur / gestionnaire <strong>${ownerName}</strong> vous a activé un accès sécurisé à votre <strong>Portail Locataire Lokka</strong> pour le logement :
    </p>

    <div class="box">
      <p style="margin: 0 0 8px; font-weight: 700; font-size: 15px; color: #0F172A;">${propertyTitle}</p>
      <p style="margin: 0 0 12px; color: #64635F;">📍 ${propertyAddress}</p>
      <div style="border-top: 1px dashed #E8E5E0; padding-top: 10px;">
        <p style="margin: 4px 0; color: #0F172A;">• <strong>Loyer mensuel :</strong> ${formattedRent} FCFA</p>
        <p style="margin: 4px 0; color: #0F172A;">• <strong>Caution légale sécurisée :</strong> ${formattedDeposit} FCFA (${depositMonths} mois max - Loi n° 2022-30)</p>
      </div>
    </div>

    ${customMessageBlock}

    <p style="font-size: 14px; color: #0F172A; font-weight: 700; margin-top: 20px;">Depuis votre Espace Locataire, vous pouvez :</p>
    <ul style="font-size: 14px; color: #64635F; line-height: 1.7; padding-left: 20px;">
      <li>Télécharger directement vos <strong>Quittances PDF officielles</strong> avec QR Code certifié</li>
      <li>Régler votre loyer en 1 clic par <strong>MTN MoMo ou Moov Money</strong></li>
      <li>Consulter votre bail et signaler une panne avec photos</li>
    </ul>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${portalUrl}" class="btn">Accéder à mon Espace Locataire</a>
    </div>

    <div style="background-color: #E6F5EF; border-radius: 6px; padding: 12px; font-size: 12px; color: #087F5B; text-align: center;">
      🔒 <strong>Connexion simplifiée :</strong> Entrez simplement votre email ou numéro de téléphone pour recevoir un code d'accès à 6 chiffres (aucun mot de passe requis).
    </div>

    <div class="footer">
      Lokka • Plateforme conforme à la Loi n° 2022-30 de la République du Bénin • <a href="https://lokka.bj" style="color: #64635F;">lokka.bj</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: subject || `Votre Espace Locataire Lokka est prêt — ${propertyTitle}`,
    html,
  });
}

/**
 * Modèle d'email : Partage d'Annonce / Fiche Vitrine & Réservation de Visite
 */
export async function sendPropertyShowcaseEmail({
  to,
  prospectName,
  ownerName,
  propertyTitle,
  propertyAddress,
  propertyType,
  rentAmountFcfa,
  chargesAmountFcfa = 0,
  photoUrl,
  features = [],
  visitFeeFcfa,
  customMessage,
  showcaseUrl = 'https://lokka.bj/p/patrimoine-lokka',
}: {
  to: string;
  prospectName: string;
  ownerName: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyType: string;
  rentAmountFcfa: number;
  chargesAmountFcfa?: number;
  photoUrl?: string;
  features?: string[];
  visitFeeFcfa?: number;
  customMessage?: string;
  showcaseUrl?: string;
}) {
  const formattedRent = new Intl.NumberFormat('fr-FR').format(rentAmountFcfa);
  const formattedCharges = new Intl.NumberFormat('fr-FR').format(chargesAmountFcfa);

  const customMessageBlock = customMessage?.trim()
    ? `
    <div style="background-color: #F8F6F0; border-left: 3px solid #087F5B; padding: 14px 16px; margin: 18px 0; border-radius: 4px; font-style: italic; color: #1C1C1C; font-size: 13.5px;">
      "${customMessage.replace(/\n/g, '<br/>')}"
      <div style="font-style: normal; font-weight: 700; font-size: 11.5px; margin-top: 6px; color: #64635F;">— Message de ${ownerName}</div>
    </div>
    `
    : '';

  const featuresList = features.length > 0
    ? `<div style="margin: 12px 0;">${features.map(f => `<span style="display: inline-block; background-color: #F0EDE8; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin: 2px 4px 2px 0; color: #1C1C1C;">✓ ${f}</span>`).join('')}</div>`
    : '';

  const photoBlock = photoUrl
    ? `<div style="border-radius: 8px; overflow: hidden; margin: 16px 0; max-height: 240px;"><img src="${photoUrl}" alt="${propertyTitle}" style="width: 100%; height: 220px; object-fit: cover;" /></div>`
    : '';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #0F172A; margin: 0; padding: 24px; }
    .card { background-color: #FFFFFF; border: 1px solid #E8E5E0; border-radius: 10px; max-width: 580px; margin: 0 auto; padding: 32px; }
    .header { border-bottom: 1px solid #F0EDE8; padding-bottom: 16px; margin-bottom: 20px; }
    .logo { font-size: 22px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; }
    .badge { display: inline-block; background-color: #E6F5EF; color: #087F5B; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 8px; }
    .box { background-color: #FAF9F6; border: 1px solid #E8E5E0; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 14px; }
    .btn { display: inline-block; background-color: #087F5B; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 10px; }
    .footer { font-size: 12px; color: #9C9A95; margin-top: 32px; border-top: 1px solid #F0EDE8; padding-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Lokka</div>
      <div class="badge">Opportunité Immobilière · Bénin 🇧🇯</div>
    </div>

    <p style="font-size: 16px; color: #0F172A; font-weight: 700; margin-bottom: 12px;">Bonjour ${prospectName || 'Madame, Monsieur'},</p>
    <p style="font-size: 14px; color: #64635F; line-height: 1.6;">
      <strong>${ownerName}</strong> vous invite à découvrir la fiche détaillée du logement suivant disponible à la location :
    </p>

    ${photoBlock}

    <div class="box">
      <div style="font-size: 12px; font-weight: 700; color: #087F5B; text-transform: uppercase;">${propertyType}</div>
      <p style="margin: 4px 0 6px; font-weight: 800; font-size: 17px; color: #0F172A;">${propertyTitle}</p>
      <p style="margin: 0 0 12px; color: #64635F;">📍 ${propertyAddress}</p>
      
      <div style="border-top: 1px dashed #E8E5E0; padding-top: 10px;">
        <p style="margin: 4px 0; color: #0F172A; font-size: 16px;">• <strong>Loyer :</strong> <span style="font-weight: 800; color: #087F5B;">${formattedRent} FCFA</span> / mois ${chargesAmountFcfa > 0 ? `<span style="font-size: 12px; color: #64635F;">(+ ${formattedCharges} FCFA charges)</span>` : ''}</p>
        ${visitFeeFcfa ? `<p style="margin: 4px 0; font-size: 12.5px; color: #64635F;">• Frais de visite : ${new Intl.NumberFormat('fr-FR').format(visitFeeFcfa)} FCFA</p>` : ''}
      </div>

      ${featuresList}
    </div>

    ${customMessageBlock}

    <div style="text-align: center; margin: 28px 0;">
      <a href="${showcaseUrl}" class="btn">Voir l'Annonce & Réserver une Visite</a>
    </div>

    <div class="footer">
      Lokka • Plateforme de gestion et vitrine immobilière certifiée • <a href="https://lokka.bj" style="color: #64635F;">lokka.bj</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: `Découvrez ce bien disponible : ${propertyTitle} (${propertyAddress})`,
    html,
  });
}

/**
 * Modèle d'email : Quittance de loyer envoyée au locataire
 */
export async function sendRentReceiptEmail({
  to,
  tenantName,
  propertyTitle,
  month,
  amountFcfa,
  paymentMethod,
}: {
  to: string;
  tenantName: string;
  propertyTitle: string;
  month: string;
  amountFcfa: number;
  paymentMethod: string;
}) {
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amountFcfa);

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #0F172A; margin: 0; padding: 24px; }
    .card { background-color: #FFFFFF; border: 1px solid #E8E5E0; border-radius: 8px; max-width: 560px; margin: 0 auto; padding: 32px; }
    .header { border-bottom: 1px solid #F0EDE8; padding-bottom: 16px; margin-bottom: 20px; }
    .receipt-box { background-color: #FAF9F6; border: 1px dashed #E8E5E0; border-radius: 6px; padding: 20px; margin: 20px 0; }
    .receipt-total { border-top: 1px solid #E8E5E0; padding-top: 10px; margin-top: 10px; font-weight: 700; font-size: 16px; color: #087F5B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">Quittance de Loyer Certifiée</h2>
      <p style="margin: 4px 0 0; color: #64635F; font-size: 13px;">Période : ${month}</p>
    </div>
    <p style="font-size: 15px; color: #0F172A;">Bonjour <strong>${tenantName}</strong>,</p>
    <p style="font-size: 14px; color: #64635F;">Nous confirmons la bonne réception de votre paiement de loyer pour le bien suivant :</p>
    
    <div class="receipt-box">
      <p style="margin: 0 0 8px; font-weight: 600;">Logement : ${propertyTitle}</p>
      <p style="margin: 0 0 8px; color: #64635F;">Mode de règlement : ${paymentMethod}</p>
      <p style="margin: 0 0 8px; color: #64635F;">Mois concerné : ${month}</p>
      <div class="receipt-total">
        Montant réglé : ${formattedAmount} FCFA
      </div>
    </div>

    <p style="font-size: 13px; color: #9C9A95;">Ce document certifié tient lieu de quittance de loyer officielle avec QR Code infalsifiable. Conforme à la Loi n° 2022-30 au Bénin.</p>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: `Quittance de loyer certifiée - ${month} - ${propertyTitle}`,
    html,
  });
}
