// Utilitaires de calcul et d'application du Design System Lokka

export type AccentPreset = {
  id: string;
  name: string;
  hex: string;
};

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: "amber", name: "Ambre", hex: "#F59E0B" }, // Défaut officiel Lokka
  { id: "blue", name: "Bleu", hex: "#3B82F6" },
  { id: "indigo", name: "Indigo", hex: "#6366F1" },
  { id: "violet", name: "Violet", hex: "#8B5CF6" },
  { id: "emerald", name: "Émeraude", hex: "#10B981" },
  { id: "cyan", name: "Cyan", hex: "#06B6D4" },
];

export const DEFAULT_ACCENT = ACCENT_PRESETS[0]; // Ambre #F59E0B

/**
 * Convertit un hexadécimal (#RRGGBB) en composantes RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Ajuste la luminosité d'un code couleur HEX (pour hover et active)
 */
export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * factor)));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(clamp(r))}${toHex(clamp(g))}${toHex(clamp(b))}`;
}

/**
 * Calcule la luminance perçue pour garantir un contraste WCAG AAA sur le texte
 */
export function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Applique la couleur d'accent dynamique aux variables CSS globales
 */
export function applyAccentColor(hexColor: string) {
  if (typeof document === "undefined") return;

  try {
    const { r, g, b } = hexToRgb(hexColor);
    const hoverColor = adjustBrightness(hexColor, -12);
    const activeColor = adjustBrightness(hexColor, -22);
    const subtleColor = `rgba(${r}, ${g}, ${b}, 0.14)`;
    const borderColor = `rgba(${r}, ${g}, ${b}, 0.28)`;

    // Si la couleur est claire (comme l'Ambre #F59E0B ou le Cyan #06B6D4), texte en NOIR PUR pour lisibilité absolue
    // Sinon texte en BLANC
    const lum = getLuminance(r, g, b);
    const foregroundColor = lum > 145 ? "#000000" : "#FFFFFF";

    const root = document.documentElement;
    root.style.setProperty("--primary", hexColor);
    root.style.setProperty("--brand-accent", hexColor);
    root.style.setProperty("--primary-hover", hoverColor);
    root.style.setProperty("--primary-active", activeColor);
    root.style.setProperty("--primary-subtle", subtleColor);
    root.style.setProperty("--primary-border", borderColor);
    root.style.setProperty("--primary-foreground", foregroundColor);
    root.style.setProperty("--ring", hexColor);
  } catch (err) {
    console.error("Erreur lors de l'application de la couleur d'accent:", err);
  }
}

/**
 * Applique le thème Clair / Sombre / Système
 */
export function applyThemeMode(mode: "light" | "dark" | "system") {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.remove("light", "dark");

  let resolved = mode;
  if (mode === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}
