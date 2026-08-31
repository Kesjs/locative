export type DashboardView = "dashboard" | "vitrine" | "locataire";
export type RoleView = "bailleur" | "agence" | "diaspora";
export type BillingCycle = "monthly" | "annual";
export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface DashboardTransaction {
  id: string;
  name: string;
  property: string;
  amountFcfa: number;
  method: "MTN MoMo" | "Moov Money" | "Virement BOA";
  receipt: string;
  status: "paid" | "late";
  detail: string;
}

export interface DashboardKpi {
  label: string;
  value: string;
  helper: string;
  status: "neutral" | "success" | "warning" | "danger";
}

export interface RolePanel {
  id: RoleView;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  metrics: Array<{ label: string; value: string }>;
  action?: string;
}

export interface PropertyListing {
  title: string;
  location: string;
  rentFcfa: number;
  features: string[];
  domain: string;
}

export interface LandingTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface PricingPlan {
  name: string;
  monthlyPriceFcfa: number;
  annualPriceFcfa: number;
  period: string;
  annualDetail: string;
  description: string;
  propertyLimit: string;
  features: string[];
  cta: string;
  popular: boolean;
  badgeLabel?: string;
}

export interface PricingComparisonRow {
  name: string;
  decouverte: string | boolean;
  pro: string | boolean;
  agence: string | boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}
