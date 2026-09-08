export interface ParsedMomoSms {
  montant: number;
  expediteurNom: string | null;
  expediteurTel: string | null;
  dateTransaction: string | null; // ISO si trouvée
  reference: string | null; // valeur à mettre dans reference_paiement
  operateur: "MTN MoMo" | "Moov Money" | null;
}

/**
 * Parse un SMS de confirmation de réception Mobile Money (copié/collé par
 * le bailleur) pour en extraire montant, expéditeur et référence.
 *
 * Calé sur le format MTN Bénin observé :
 * "Transfert 1000F de JEAN DE DIEU ROMEO OLUWA-FEMI AHOSSI (2290151225703)
 *  2026-09-06 20:58:39 Ref:paye Solde:1025F ID:12829015560"
 *
 * Le champ "Ref:" dans ce format MTN est souvent un simple statut ("paye")
 * et non un identifiant unique exploitable — on privilégie donc "ID:" comme
 * référence de rapprochement, avec repli sur "Ref:" s'il n'y a pas d'ID.
 *
 * Le format Moov n'a pas encore été vérifié sur un vrai SMS : le parseur
 * générique ci-dessous (montant/téléphone/ID en recherche libre, pas
 * d'ordre imposé) sert de filet, mais devra être affiné dès qu'un exemple
 * réel de SMS Moov sera disponible.
 */
export function parseMomoSms(rawText: string): ParsedMomoSms | null {
  const text = rawText.replace(/\s+/g, " ").trim();
  if (!text) return null;

  // --- Format MTN strict (le format confirmé) ---
  const mtnPattern =
    /Transfert\s+([\d.,]+)\s*F\s+de\s+(.+?)\s*\((\d{6,15})\)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+Ref:(\S+)\s+Solde:[\d.,]+\s*F\s+ID:(\S+)/i;
  const mtnMatch = text.match(mtnPattern);
  if (mtnMatch) {
    const [, montantStr, nom, tel, date, ref, id] = mtnMatch;
    return {
      montant: parseMontant(montantStr),
      expediteurNom: titleCase(nom),
      expediteurTel: tel,
      dateTransaction: normalizeDate(date),
      reference: id || ref || null,
      operateur: "MTN MoMo",
    };
  }

  // --- Repli générique (Moov ou variante MTN non prévue) ---
  const montantMatch = text.match(/([\d][\d.,]*)\s*F(?:CFA)?\b/i);
  if (!montantMatch) return null; // sans montant, pas exploitable

  const telMatch = text.match(/\((\d{6,15})\)/);
  const idMatch = text.match(/\bID\s*:?\s*(\S+)/i);
  const refMatch = text.match(/\bR[eé]f(?:erence)?\s*:?\s*(\S+)/i);
  const dateMatch = text.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
  const nomMatch = text.match(/\bde\s+(.+?)\s*(?:\(|\d{4}-\d{2}-\d{2}|$)/i);

  const isMoov = /moov|flooz/i.test(text);

  return {
    montant: parseMontant(montantMatch[1]),
    expediteurNom: nomMatch ? titleCase(nomMatch[1]) : null,
    expediteurTel: telMatch ? telMatch[1] : null,
    dateTransaction: dateMatch ? normalizeDate(dateMatch[1]) : null,
    reference: (idMatch?.[1] || refMatch?.[1]) ?? null,
    operateur: isMoov ? "Moov Money" : "MTN MoMo",
  };
}

function parseMontant(raw: string): number {
  // "1000" / "1.000" / "1,000" -> 1000
  return Number(raw.replace(/[.,](?=\d{3}\b)/g, "").replace(",", "."));
}

function normalizeDate(raw: string): string | null {
  const iso = raw.replace(" ", "T");
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function titleCase(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());
}
