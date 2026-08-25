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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #1C1C1C; margin: 0; padding: 24px; }
    .card { background-color: #FFFFFF; border: 1px solid #E8E5E0; border-radius: 8px; max-width: 560px; margin: 0 auto; padding: 32px; }
    .header { border-bottom: 1px solid #F0EDE8; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 22px; font-weight: 700; color: #1C1C1C; letter-spacing: -0.5px; }
    .badge { display: inline-block; background-color: #E6F5EF; color: #087F5B; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-top: 8px; }
    .content { font-size: 15px; line-height: 1.6; color: #64635F; }
    .btn { display: inline-block; background-color: #1C1C1C; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 20px; }
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
      <p style="color: #1C1C1C; font-weight: 600; font-size: 17px;">Bonjour ${name || 'Cher bailleur'},</p>
      <p>Bienvenue sur <strong>Lokka</strong>, votre outil de gestion locative et de suivi financier conforme à la Loi 2022-30 au Bénin.</p>
      <p>Votre espace est prêt. Vous pouvez dès maintenant :</p>
      <ul>
        <li>Ajouter vos biens immobiliers et logements</li>
        <li>Enregistrer vos locataires et générer des baux conformes</li>
        <li>Suivre les encaissements MTN MoMo, Moov Money et virements</li>
      </ul>
      <p style="text-align: center; margin-top: 28px;">
        <a href="https://codeo-ui.com/dashboard" class="btn">Accéder à mon espace Lokka</a>
      </p>
    </div>
    <div class="footer">
      Lokka • Cotonou, Bénin • <a href="https://codeo-ui.com" style="color: #64635F;">codeo-ui.com</a>
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
 * Modèle d'email : Invitation Locataire & Coordonnées de Connexion
 */
export async function sendTenantInvitationEmail({
  to,
  tenantName,
  ownerName,
  propertyTitle,
  propertyAddress,
  rentAmountFcfa,
  depositMonths,
  portalUrl = 'https://codeo-ui.com/locataire',
}: {
  to: string;
  tenantName: string;
  ownerName: string;
  propertyTitle: string;
  propertyAddress: string;
  rentAmountFcfa: number;
  depositMonths: number;
  portalUrl?: string;
}) {
  const formattedRent = new Intl.NumberFormat('fr-FR').format(rentAmountFcfa);
  const depositAmount = rentAmountFcfa * depositMonths;
  const formattedDeposit = new Intl.NumberFormat('fr-FR').format(depositAmount);

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #1C1C1C; margin: 0; padding: 24px; }
    .card { background-color: #FFFFFF; border: 1px solid #E8E5E0; border-radius: 10px; max-width: 580px; margin: 0 auto; padding: 32px; }
    .header { border-bottom: 1px solid #F0EDE8; padding-bottom: 16px; margin-bottom: 20px; }
    .logo { font-size: 22px; font-weight: 800; color: #1C1C1C; letter-spacing: -0.5px; }
    .badge { display: inline-block; background-color: #E6F5EF; color: #087F5B; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 8px; }
    .box { background-color: #FAF9F6; border: 1px solid #E8E5E0; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 14px; }
    .btn { display: inline-block; background-color: #1C1C1C; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 10px; }
    .footer { font-size: 12px; color: #9C9A95; margin-top: 32px; border-top: 1px solid #F0EDE8; padding-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Lokka</div>
      <div class="badge">Espace Locataire Sécurisé · Loi 2022-30 🇧🇯</div>
    </div>

    <p style="font-size: 16px; color: #1C1C1C; font-weight: 700; margin-bottom: 12px;">Bonjour ${tenantName},</p>
    <p style="font-size: 14px; color: #64635F; line-height: 1.6;">
      Votre bailleur / gestionnaire <strong>${ownerName}</strong> vous a activé un accès sécurisé à votre <strong>Portail Locataire Lokka</strong> pour le logement suivant :
    </p>

    <div class="box">
      <p style="margin: 0 0 8px; font-weight: 700; font-size: 15px; color: #1C1C1C;">${propertyTitle}</p>
      <p style="margin: 0 0 12px; color: #64635F;">📍 ${propertyAddress}</p>
      <div style="border-top: 1px dashed #E8E5E0; padding-top: 10px;">
        <p style="margin: 4px 0; color: #1C1C1C;">• <strong>Loyer mensuel :</strong> ${formattedRent} FCFA</p>
        <p style="margin: 4px 0; color: #1C1C1C;">• <strong>Caution sécurisée :</strong> ${formattedDeposit} FCFA (${depositMonths} mois max - Loi n° 2022-30)</p>
      </div>
    </div>

    <p style="font-size: 14px; color: #1C1C1C; font-weight: 700; margin-top: 20px;">Depuis votre Espace Locataire, vous pouvez :</p>
    <ul style="font-size: 14px; color: #64635F; line-height: 1.7; padding-left: 20px;">
      <li>Télécharger directement vos <strong>Quittances PDF officielles</strong> avec QR Code</li>
      <li>Régler votre loyer en 1 clic par <strong>MTN MoMo ou Moov Money</strong></li>
      <li>Signaler une panne ou une réparation au propriétaire</li>
    </ul>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${portalUrl}" class="btn">Accéder à mon Espace Locataire</a>
    </div>

    <div style="background-color: #E6F5EF; border-radius: 6px; padding: 12px; font-size: 12px; color: #087F5B; text-align: center;">
      🔒 <strong>Connexion simplifiée :</strong> Entrez simplement votre email ou numéro de téléphone pour recevoir un code d'accès à 6 chiffres (aucun mot de passe requis).
    </div>

    <div class="footer">
      Lokka • Plateforme conforme à la Loi n° 2022-30 de la République du Bénin • <a href="https://codeo-ui.com" style="color: #64635F;">codeo-ui.com</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: `Votre Espace Locataire Lokka est prêt — ${propertyTitle}`,
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #1C1C1C; margin: 0; padding: 24px; }
    .card { background-color: #FFFFFF; border: 1px solid #E8E5E0; border-radius: 8px; max-width: 560px; margin: 0 auto; padding: 32px; }
    .header { border-bottom: 1px solid #F0EDE8; padding-bottom: 16px; margin-bottom: 20px; }
    .receipt-box { background-color: #FAF9F6; border: 1px dashed #E8E5E0; border-radius: 6px; padding: 20px; margin: 20px 0; }
    .receipt-total { border-top: 1px solid #E8E5E0; padding-top: 10px; margin-top: 10px; font-weight: 700; font-size: 16px; color: #087F5B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">Quittance de Loyer</h2>
      <p style="margin: 4px 0 0; color: #64635F; font-size: 13px;">Période : ${month}</p>
    </div>
    <p style="font-size: 15px; color: #1C1C1C;">Bonjour <strong>${tenantName}</strong>,</p>
    <p style="font-size: 14px; color: #64635F;">Nous confirmons la bonne réception de votre paiement de loyer pour le bien suivant :</p>
    
    <div class="receipt-box">
      <p style="margin: 0 0 8px; font-weight: 600;">Logement : ${propertyTitle}</p>
      <p style="margin: 0 0 8px; color: #64635F;">Mode de règlement : ${paymentMethod}</p>
      <p style="margin: 0 0 8px; color: #64635F;">Mois concerné : ${month}</p>
      <div class="receipt-total">
        Montant reçu : ${formattedAmount} FCFA
      </div>
    </div>

    <p style="font-size: 13px; color: #9C9A95;">Ce document tient lieu de quittance de loyer officielle avec QR Code infalsifiable. Conforme à la Loi n° 2022-30 au Bénin.</p>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: `Quittance de loyer - ${month} - ${propertyTitle}`,
    html,
  });
}
