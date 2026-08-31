import type {
  DashboardKpi,
  DashboardTransaction,
  FaqItem,
  LandingTestimonial,
  PricingComparisonRow,
  PricingPlan,
  PropertyListing,
  RolePanel,
} from "./types";

export const HERO_COPY = {
  title: "Votre patrimoine locatif",
  emphasis: "Enfin sous contrôle",
  description:
    "Que vous soyez au Bénin ou dans la diaspora, gérez vos logements, vos quittances officielles et votre site vitrine depuis un seul espace.",
};

export const DASHBOARD_KPIS: DashboardKpi[] = [
  {
    label: "Loyers du mois",
    value: "4 850 000 FCFA",
    helper: "96.5% collecté",
    status: "success",
  },
  {
    label: "Taux d’occupation",
    value: "12 / 12 lots",
    helper: "Zéro vacance",
    status: "success",
  },
  {
    label: "Retards de loyer",
    value: "180 000 FCFA",
    helper: "Relance J+5 programmée",
    status: "danger",
  },
  {
    label: "Conformité Loi 2022-30",
    value: "100% conforme",
    helper: "Caution 3 mois max",
    status: "success",
  },
];

export const DASHBOARD_TRANSACTIONS: DashboardTransaction[] = [
  {
    id: "transaction-koudjo",
    name: "Koudjo Dossou",
    property: "Villa Fidjrossè Plage",
    amountFcfa: 350000,
    method: "MTN MoMo",
    receipt: "LOK-2026-0891",
    status: "paid",
    detail: "Règlement rapproché le 02 septembre 2026",
  },
  {
    id: "transaction-berenice",
    name: "Bérénice Agossou",
    property: "Studio Meublé · Haie Vive",
    amountFcfa: 120000,
    method: "Moov Money",
    receipt: "LOK-2026-0890",
    status: "paid",
    detail: "Règlement rapproché le 02 septembre 2026",
  },
  {
    id: "transaction-estelle",
    name: "Estelle Houndété",
    property: "Duplex Cadjehoun",
    amountFcfa: 450000,
    method: "Virement BOA",
    receipt: "LOK-2026-0865",
    status: "paid",
    detail: "Règlement rapproché le 01 septembre 2026",
  },
];

export const PAYMENT_PROOF_STEPS = [
  {
    number: "01",
    label: "Paiement confirmé",
    title: "MTN MoMo / Moov Money",
    description: "350 000 FCFA rapprochés au règlement de Koudjo Dossou.",
  },
  {
    number: "02",
    label: "Quittance générée",
    title: "PDF officiel + QR Code",
    description: "La référence LOK-2026-0891 est prête à être consultée et téléchargée.",
  },
  {
    number: "03",
    label: "Locataire informé",
    title: "Portail OTP mis à jour",
    description: "Le document apparaît dans l’espace du locataire, sans mot de passe complexe.",
  },
] as const;

export const REVENUE_DATA = [
  { month: "Jan", value: 1200000, shortValue: "1,2 M" },
  { month: "Fév", value: 1300000, shortValue: "1,3 M" },
  { month: "Mar", value: 1250000, shortValue: "1,25 M" },
  { month: "Avr", value: 1450000, shortValue: "1,45 M" },
  { month: "Mai", value: 1450000, shortValue: "1,45 M" },
  { month: "Juin", value: 1450000, shortValue: "1,45 M" },
] as const;

export const ROLE_PANELS: RolePanel[] = [
  {
    id: "bailleur",
    label: "Bailleur",
    eyebrow: "Je gère mes biens",
    title: "Loyers, occupation, locataires.",
    description:
      "Une vue directe sur ce qui est encaissé, ce qui manque et ce que votre locataire peut retrouver dans son portail.",
    metrics: [
      { label: "Encaissé", value: "1 450 000 FCFA" },
      { label: "Occupation", value: "4 / 5 lots" },
    ],
    action: "Inviter un locataire",
  },
  {
    id: "agence",
    label: "Agence",
    eyebrow: "Je gère pour des propriétaires",
    title: "Le mandat garde le lien.",
    description:
      "Les encaissements restent séparés des reversements aux propriétaires, avec une commission et un historique lisibles.",
    metrics: [
      { label: "Mandats actifs", value: "24" },
      { label: "Reversements en attente", value: "7 650 000 FCFA" },
    ],
    action: "Voir les reversements",
  },
  {
    id: "diaspora",
    label: "Diaspora",
    eyebrow: "Depuis l’étranger",
    title: "Garder une vue claire, à distance.",
    description:
      "Suivez les paiements en FCFA avec un contexte Euro ou Dollar et retrouvez vos documents dans une archive unique.",
    metrics: [
      { label: "Dernier règlement", value: "350 000 FCFA" },
      { label: "Documents archivés", value: "24 quittances" },
    ],
    action: "Ouvrir l’archive",
  },
];

export const VACANT_LISTING: PropertyListing = {
  title: "Appartement F3 Standing",
  location: "Arconville, Calavi",
  rentFcfa: 180000,
  features: ["Compteur SBEE personnel", "Forage avec surpresseur", "Climatisation installée"],
  domain: "agence-littoral.lokka.bj",
};

export const PROOF_METRICS = [
  { value: "100+", label: "Bailleurs & gestionnaires" },
  { value: "450+", label: "Logements sous gestion" },
  { value: "98,2%", label: "Taux de recouvrement MoMo" },
  { value: "100%", label: "Conforme Loi 2022-30" },
] as const;

export const TESTIMONIALS: LandingTestimonial[] = [
  {
    quote:
      "Lokka a révolutionné ma gestion locative. Mes locataires téléchargent leurs quittances PDF certifiées directement depuis leur espace web, et je n'ai plus jamais à rédiger de reçus papier manuscrits.",
    name: "Aïcha Houndété",
    role: "Propriétaire Bailleur · Calavi · 8 logements",
  },
  {
    quote:
      "Grâce au site vitrine généré en 1 clic et aux Comptes-Rendus de Gestion (CRG) édités pour nos propriétaires mandants avec les 10% de commission Loi 2022-30, notre agence a gagné une crédibilité exceptionnelle.",
    name: "Aristide Gbaguidi",
    role: "Directeur d'Agence Immobilière · Cotonou Haie Vive · 24 lots",
  },
  {
    quote:
      "Gérant mes biens à Cotonou depuis Paris, le double affichage FCFA / Euros et les notifications de paiement MoMo en direct me procurent une totale tranquillité d'esprit sans intermédiaire douteux.",
    name: "Dr. Fabrice Tossou",
    role: "Investisseur Diaspora · Paris & Cotonou · 6 biens",
  },
];

export const PLANS: PricingPlan[] = [
  {
    name: "Découverte",
    monthlyPriceFcfa: 0,
    annualPriceFcfa: 0,
    period: "",
    annualDetail: "Gratuit et sans engagement",
    description: "Pour découvrir Lokka.",
    propertyLimit: "1 seul bien",
    features: [
      "Gestion basique (baux, locataires)",
      "Paiements & quittances PDF manuels",
      "Accès aux fonctionnalités essentielles",
    ],
    cta: "Créer mon compte gratuit",
    popular: false,
  },
  {
    name: "Bailleur Pro",
    monthlyPriceFcfa: 5000,
    annualPriceFcfa: 4000,
    period: "/mois",
    annualDetail: "48 000 FCFA facturés par an (-20%)",
    description: "Pour les bailleurs indépendants.",
    propertyLimit: "Jusqu'à 15 biens",
    features: [
      "Gestion complète en autonomie",
      "Paiements Mobile Money",
      "Portail locataire",
      "Marketplace Lokka (annonces)",
      "Frais de visite Mobile Money",
      "Vitrine web (lien standard)",
    ],
    cta: "Démarrer l'essai 14 jours",
    popular: true,
    badgeLabel: "Le Plus Populaire",
  },
  {
    name: "Agence Pro",
    monthlyPriceFcfa: 25000,
    annualPriceFcfa: 20000,
    period: "/mois",
    annualDetail: "240 000 FCFA facturés par an (-20%)",
    description: "Pour les agences et gestionnaires.",
    propertyLimit: "50 biens inclus",
    features: [
      "Multi-propriétaires & mandats",
      "Reversements automatiques aux bailleurs",
      "Marketplace Lokka (annonces)",
      "Frais de visite avancés",
      "Domaine personnalisé + thèmes",
      "SEO & Blog inclus",
    ],
    cta: "Choisir le Plan Agence",
    popular: false,
  },
];

export const ADDONS = [
  "Bailleur Pro : +5 biens pour 2 000 FCFA/mois (jusqu'à 35 biens max)",
  "Agence Pro : pack +100 biens pour 5 000 FCFA/mois",
] as const;

export const FAQS: FaqItem[] = [
  {
    question: "Quelle est la différence entre les formules Découverte, Bailleur Pro et Agence Pro ?",
    answer:
      "Découverte est gratuit à vie pour 1 bien avec une gestion basique et des quittances PDF manuelles. Bailleur Pro (5 000 FCFA/mois, jusqu'à 15 biens) débloque le Mobile Money, le portail locataire et la Marketplace Lokka. Agence Pro (25 000 FCFA/mois, 50 biens inclus) ajoute la gestion multi-propriétaires avec mandats, les reversements automatiques, un domaine personnalisé et le SEO/blog.",
  },
  {
    question: "Que se passe-t-il si je dépasse le plafond de biens de mon forfait ?",
    answer:
      "Vous pouvez étendre votre forfait avec un pack additionnel plutôt que de changer de plan : +5 biens pour 2 000 FCFA/mois en Bailleur Pro (jusqu'à 35 biens max), ou un pack +100 biens pour 5 000 FCFA/mois en Agence Pro. Au-delà, contactez l'équipe Lokka pour une formule personnalisée.",
  },
  {
    question: "Comment mes locataires accèdent-ils à leurs quittances PDF et à leur espace ?",
    answer:
      "Dès que vous ajoutez un locataire sur Lokka, il reçoit un accès sécurisé par email ou numéro de téléphone (avec code OTP sans mot de passe complexe). Sur son espace web dédié, il retrouve l'historique complet de tous ses mois payés et peut télécharger à tout moment ses quittances PDF officielles certifiées avec QR Code.",
  },
  {
    question: "Comment fonctionne l'encaissement par Mobile Money (MTN MoMo & Moov) ?",
    answer:
      "Vos locataires peuvent régler leur loyer directement depuis leur téléphone en FCFA. Dès que la transaction est confirmée, votre tableau de bord s'actualise en temps réel et la quittance certifiée est générée automatiquement.",
  },
  {
    question: "Comment Lokka garantit-il la conformité avec la Loi n° 2022-30 au Bénin ?",
    answer:
      "Lokka intègre un bouclier juridique automatique : le sélecteur de caution bloque tout dépassement du plafond légal de 3 mois de loyer en vigueur au Bénin, les quittances comportent toutes les mentions légales obligatoires, et pour les agences, la commission de gestion est plafonnée à 10% comme l'exige la loi.",
  },
  {
    question: "Comment fonctionne mon site vitrine public et le nom de domaine personnalisé ?",
    answer:
      "Chaque compte Bailleur Pro ou Agence Pro dispose d'un mini-site public (ex: agence-littoral.lokka.bj). Il vous suffit de cocher 'Publier' sur vos logements vacants pour qu'ils apparaissent instantanément avec leurs photos, loyers et bouton de réservation de visite. Avec Agence Pro, vous pouvez connecter votre propre nom de domaine (ex: www.monagence.bj) avec votre logo et bénéficier du SEO/blog inclus.",
  },
  {
    question: "Qu'est-ce que la Marketplace Lokka et les frais de visite Mobile Money ?",
    answer:
      "La Marketplace Lokka permet de publier vos annonces de biens vacants pour trouver des locataires sans passer par une agence tierce (disponible à partir de Bailleur Pro). Vous pouvez fixer des frais de visite payables en ligne par Mobile Money, intégralement acquis, pour filtrer les demandes non sérieuses.",
  },
  {
    question: "Je vis à l'étranger, Lokka est-il adapté pour gérer mes biens au Bénin ?",
    answer:
      "Absolument. En configurant votre profil Bailleur Pro, vous choisissez simplement votre zone (Bénin ou Diaspora) : vous suivez en direct vos loyers avec double conversion FCFA / Euros (€) ou Dollars ($), échangez directement avec vos locataires pour éviter les intermédiaires opaques, et bénéficiez d'un archivage infalsifiable de tous les paiements.",
  },
  {
    question: "Mes locataires doivent-ils payer pour utiliser Lokka ?",
    answer:
      "Non, Lokka est 100% gratuit pour vos locataires. Ils peuvent recevoir leurs rappels et quittances, payer leur loyer et suivre leur bail sans aucun frais supplémentaire.",
  },
  {
    question: "Puis-je changer de formule ou annuler à tout moment ?",
    answer:
      "Oui, les forfaits mensuels sont sans aucun engagement. Vous pouvez passer d'un plan à un autre ou annuler votre abonnement depuis vos paramètres en 1 clic, sans frais de résiliation.",
  },
];

export function formatFcfa(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export function formatPlanPrice(plan: PricingPlan, cycle: "monthly" | "annual"): string {
  return formatFcfa(cycle === "annual" ? plan.annualPriceFcfa : plan.monthlyPriceFcfa);
}

export function buildComparisonRows(): PricingComparisonRow[] {
  const rows: PricingComparisonRow[] = [
    {
      name: "Nombre de biens",
      decouverte: PLANS[0].propertyLimit,
      pro: PLANS[1].propertyLimit,
      agence: PLANS[2].propertyLimit,
    },
  ];

  const seen = new Set<string>();
  PLANS.forEach((plan) => {
    plan.features.forEach((feature) => {
      if (seen.has(feature)) return;
      seen.add(feature);
      rows.push({
        name: feature,
        decouverte: PLANS[0].features.includes(feature),
        pro: PLANS[1].features.includes(feature),
        agence: PLANS[2].features.includes(feature),
      });
    });
  });

  return rows;
}
