import type { CSSProperties } from 'react';
import type { DesignSettings } from './types';

export const DEFAULT_DESIGN: DesignSettings = {
  headerLogoHeight: 56, mobileLogoHeight: 48, footerLogoHeight: 40,
  textScale: 100, headingScale: 100, heroFontSize: 60, lineHeight: 1.85,
  contentWidth: 1152, readingWidth: 70, sectionSpacing: 100, cornerRadius: 24,
  bodyFont: 'original', headingFont: 'original',
};

type NumericKey = { [K in keyof DesignSettings]: DesignSettings[K] extends number ? K : never }[keyof DesignSettings];
export const DESIGN_CONTROLS: { key: NumericKey; label: string; min: number; max: number; step: number; unit: string; group: 'logo' | 'text' | 'layout' }[] = [
  { key: 'headerLogoHeight', label: 'Logo kõrgus arvutis', min: 36, max: 100, step: 2, unit: 'px', group: 'logo' },
  { key: 'mobileLogoHeight', label: 'Logo kõrgus telefonis', min: 28, max: 64, step: 2, unit: 'px', group: 'logo' },
  { key: 'footerLogoHeight', label: 'Logo kõrgus jaluses', min: 24, max: 80, step: 2, unit: 'px', group: 'logo' },
  { key: 'textScale', label: 'Põhiteksti ja nuppude suurus', min: 90, max: 140, step: 5, unit: '%', group: 'text' },
  { key: 'headingScale', label: 'Pealkirjade suurus', min: 80, max: 140, step: 5, unit: '%', group: 'text' },
  { key: 'heroFontSize', label: 'Avalehe põhipealkirja suurus', min: 40, max: 88, step: 2, unit: 'px', group: 'text' },
  { key: 'lineHeight', label: 'Põhiteksti reavahe', min: 1.4, max: 2.2, step: .05, unit: '×', group: 'text' },
  { key: 'contentWidth', label: 'Lehe suurim laius', min: 960, max: 1440, step: 16, unit: 'px', group: 'layout' },
  { key: 'readingWidth', label: 'Pika teksti rea pikkus', min: 45, max: 90, step: 1, unit: 'märki', group: 'layout' },
  { key: 'sectionSpacing', label: 'Sektsioonide vahed', min: 65, max: 140, step: 5, unit: '%', group: 'layout' },
  { key: 'cornerRadius', label: 'Kaartide nurkade ümarus', min: 0, max: 32, step: 2, unit: 'px', group: 'layout' },
];

// Old databases work without a migration; imported values cannot inject arbitrary CSS.
export function normalizeDesign(input?: Partial<DesignSettings> | null): DesignSettings {
  const design = { ...DEFAULT_DESIGN };
  for (const control of DESIGN_CONTROLS) {
    const raw: unknown = input?.[control.key];
    const value = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
    if (Number.isFinite(value)) design[control.key] = Math.round(Math.min(control.max, Math.max(control.min, value)) * 100) / 100;
  }
  if (['original', 'serif', 'sans'].includes(input?.bodyFont || '')) design.bodyFont = input!.bodyFont!;
  if (['original', 'serif', 'editorial', 'sans'].includes(input?.headingFont || '')) design.headingFont = input!.headingFont!;
  return design;
}

export const TEXT_SIZES: Record<string, string> = {
  xs: '.75rem', sm: '.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem',
  '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem',
};
export function designStyle(input?: Partial<DesignSettings>): CSSProperties {
  const d = normalizeDesign(input);
  const variables: Record<string, string> = {
    '--site-logo-height': `${d.headerLogoHeight}px`, '--site-mobile-logo-height': `${d.mobileLogoHeight}px`,
    '--site-footer-logo-height': `${d.footerLogoHeight}px`, '--site-text-scale': String(d.textScale / 100),
    '--site-heading-scale': String(d.headingScale / 100), '--site-hero-size': `${d.heroFontSize}px`,
    '--site-line-height': String(d.lineHeight), '--site-content-width': `${d.contentWidth}px`,
    '--site-reading-width': `${d.readingWidth}ch`, '--site-spacing': String(d.sectionSpacing / 100),
    '--site-radius': `${d.cornerRadius}px`,
  };
  for (const [name, size] of Object.entries(TEXT_SIZES)) variables[`--text-${name}`] = `calc(${size} * ${d.textScale / 100})`;
  return variables as CSSProperties;
}
