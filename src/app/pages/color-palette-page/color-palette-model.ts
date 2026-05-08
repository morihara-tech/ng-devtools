/** Palette tool operating mode */
export type ColorPaletteMode = 'compare' | 'shades';

/** Material Design shade steps from lightest to darkest */
export const SHADE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type ShadeStep = (typeof SHADE_STEPS)[number];

/** Input model passed from the input card to the output card */
export interface ColorPaletteInputModel {
  mode: ColorPaletteMode;
  colors: string[];
}

/**
 * Parses a hex color string and returns its RGB components.
 * Accepts 3-digit and 6-digit formats, with or without a '#' prefix.
 * Returns null when the input is not a valid hex color.
 */
export function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, '');
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

/** Clamps a number to [0, 255] and converts it to a 2-digit hex string */
function toHexByte(value: number): string {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
}

/** Converts RGB components to a 6-digit hex string with '#' prefix */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + toHexByte(r) + toHexByte(g) + toHexByte(b);
}

/**
 * Calculates the relative luminance of a hex color using the WCAG formula.
 * Returns a value between 0 (darkest black) and 1 (brightest white).
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = parseHexColor(hex);
  if (!rgb) return 0;
  const linearize = (channel: number): number => {
    const sRgb = channel / 255;
    return sRgb <= 0.03928 ? sRgb / 12.92 : Math.pow((sRgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

/**
 * Determines the best text color (black or white) for a given background hex
 * based on WCAG contrast ratio guidelines.
 */
export function getTextColorForBackground(backgroundHex: string): string {
  const luminance = getRelativeLuminance(backgroundHex);
  // Threshold 0.179 provides sufficient contrast for both choices
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

/** Linear interpolation between two RGB color objects */
function mixColors(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number },
  ratio: number,
): { r: number; g: number; b: number } {
  return {
    r: c1.r + (c2.r - c1.r) * ratio,
    g: c1.g + (c2.g - c1.g) * ratio,
    b: c1.b + (c2.b - c1.b) * ratio,
  };
}

const COLOR_WHITE = { r: 255, g: 255, b: 255 };
const COLOR_BLACK = { r: 0, g: 0, b: 0 };

/**
 * Mix configuration for each shade step.
 * The base color is the 500 step. Steps below 500 are mixed with white;
 * steps above 500 are mixed with black.
 */
const SHADE_MIX_CONFIG: Record<ShadeStep, { target: 'white' | 'black' | 'original'; ratio: number }> = {
  50:  { target: 'white', ratio: 0.90 },
  100: { target: 'white', ratio: 0.80 },
  200: { target: 'white', ratio: 0.60 },
  300: { target: 'white', ratio: 0.40 },
  400: { target: 'white', ratio: 0.20 },
  500: { target: 'original', ratio: 0 },
  600: { target: 'black', ratio: 0.10 },
  700: { target: 'black', ratio: 0.25 },
  800: { target: 'black', ratio: 0.40 },
  900: { target: 'black', ratio: 0.60 },
};

/**
 * Generates Material Design-like shade variants from a base hex color.
 * The input color is treated as the 500 (mid) shade.
 * @param baseHex The base hex color treated as the 500 shade.
 * @returns A record mapping each shade step to its computed hex color.
 */
export function generateMaterialShades(baseHex: string): Record<ShadeStep, string> {
  const base = parseHexColor(baseHex);
  if (!base) {
    return Object.fromEntries(SHADE_STEPS.map(step => [step, baseHex])) as Record<ShadeStep, string>;
  }
  const shades = SHADE_STEPS.map(step => {
    const config = SHADE_MIX_CONFIG[step];
    if (config.target === 'original') {
      return [step, rgbToHex(base.r, base.g, base.b)];
    }
    const target = config.target === 'white' ? COLOR_WHITE : COLOR_BLACK;
    const mixed = mixColors(base, target, config.ratio);
    return [step, rgbToHex(mixed.r, mixed.g, mixed.b)];
  });
  return Object.fromEntries(shades) as Record<ShadeStep, string>;
}

/**
 * Returns true when the string is a valid 3- or 6-digit hex color,
 * with or without a '#' prefix.
 */
export function isValidHexColor(value: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

/**
 * Normalizes a hex color string to uppercase 6-digit format with '#' prefix.
 * E.g. 'f00' → '#FF0000', '#aabbcc' → '#AABBCC'.
 */
export function normalizeHexColor(hex: string): string {
  const raw = hex.trim().replace(/^#/, '');
  if (raw.length === 3) {
    return '#' + raw.split('').map(c => c + c).join('').toUpperCase();
  }
  return '#' + raw.toUpperCase();
}
