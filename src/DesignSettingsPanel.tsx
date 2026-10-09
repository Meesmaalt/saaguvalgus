import React from 'react';
import { RotateCcw, Eye } from 'lucide-react';
import type { DesignSettings, SiteContent } from './types';
import { DEFAULT_DESIGN, DESIGN_CONTROLS, normalizeDesign, designStyle } from './design';
import { BrandLogo } from './BrandLogo';

export function DesignSettingsPanel({ content, onChange, onPreview }: {
  content: SiteContent; onChange: (design: DesignSettings) => void; onPreview: () => void;
}) {
  const design = normalizeDesign(content.design);
  const presets: { label: string; values: Partial<DesignSettings> }[] = [
    { label: 'Kompaktne', values: { headerLogoHeight: 44, textScale: 95, headingScale: 90, heroFontSize: 52, contentWidth: 1040, sectionSpacing: 85 } },
    { label: 'Praegune põhikujundus', values: DEFAULT_DESIGN },
    { label: 'Avardatud ja suurem tekst', values: { headerLogoHeight: 64, textScale: 115, headingScale: 110, heroFontSize: 68, contentWidth: 1200, sectionSpacing: 110 } },
  ];
  return <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
    <div className="space-y-5">
      <section className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-stone-900">Lehe kujundus</h2>
        <p className="text-sm text-stone-600">Muudatused salvestatakse automaatselt ja rakenduvad mõlemas keeles. Telefonis kohandatakse suurused ekraanile sobivaks. PDF-faili enda teksti suurust saad muuta PDF-lugeja suumiga.</p>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => <button key={preset.label} type="button" onClick={() => onChange(normalizeDesign({ ...DEFAULT_DESIGN, ...preset.values }))} className="px-3 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-sm cursor-pointer">{preset.label}</button>)}
        </div>
      </section>
      {([['logo', 'Logo'], ['text', 'Tekst ja fondid'], ['layout', 'Lehe paigutus']] as const).map(([group, title]) =>
        <section key={group} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          <h3 className="font-semibold text-lg text-stone-900">{title}</h3>
          {DESIGN_CONTROLS.filter(control => control.group === group).map(control => <div key={control.key} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <label htmlFor={`design-${control.key}`} className="text-stone-700 font-medium">{control.label}</label>
              <output htmlFor={`design-${control.key}`} className="font-mono text-[#14532D] shrink-0">{design[control.key]} {control.unit}</output>
            </div>
            <input id={`design-${control.key}`} type="range" min={control.min} max={control.max} step={control.step}
              value={design[control.key]} onChange={event => onChange({ ...design, [control.key]: Number(event.target.value) })}
              className="w-full accent-[#14532D] cursor-pointer" />
          </div>)}
          {group === 'text' && <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <label className="space-y-2">Põhiteksti font
              <select value={design.bodyFont} onChange={event => onChange({ ...design, bodyFont: event.target.value as DesignSettings['bodyFont'] })} className="block w-full mt-2 p-2 border border-stone-300 rounded-lg bg-white">
                <option value="original">Praegused fondid</option><option value="serif">Klassikaline – Lora</option><option value="sans">Lihtne – Jakarta Sans</option>
              </select>
            </label>
            <label className="space-y-2">Pealkirjade font
              <select value={design.headingFont} onChange={event => onChange({ ...design, headingFont: event.target.value as DesignSettings['headingFont'] })} className="block w-full mt-2 p-2 border border-stone-300 rounded-lg bg-white">
                <option value="original">Praegused fondid</option><option value="serif">Klassikaline – Lora</option><option value="editorial">Elegantne – Cormorant</option><option value="sans">Lihtne – Jakarta Sans</option>
              </select>
            </label>
          </div>}
        </section>)}
      <button type="button" onClick={() => onChange({ ...DEFAULT_DESIGN })} className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 cursor-pointer"><RotateCcw size={16} />Taasta kujunduse algseaded</button>
    </div>
    <div className="xl:sticky xl:top-24 space-y-3">
      <div className="flex justify-between items-center gap-3"><h3 className="font-semibold">Kujunduse eelvaade</h3><button type="button" onClick={onPreview} className="flex gap-2 items-center text-sm font-medium text-[#14532D] cursor-pointer"><Eye size={16} />Vaata kogu lehte</button></div>
      <div className="public-site design-preview overflow-hidden border border-stone-200 rounded-2xl bg-[#FAF7F2] p-6 space-y-6" style={designStyle(design)} data-body-font={design.bodyFont} data-heading-font={design.headingFont}>
        <BrandLogo className="preview-header-logo" />
        <div className="site-hero"><h1 className="font-serif font-medium text-[#1C1917]">{content.heroTitle} <span className="text-[#14532D] italic">{content.heroHighlight}</span></h1></div>
        <div className="paper-card rounded-3xl p-5 space-y-3">
          <h2 className="font-serif text-2xl font-semibold text-[#14532D]">{content.centralQuestions[0]?.question || 'Pealkirja näidis'}</h2>
          <p className="font-serif text-base text-stone-700 whitespace-pre-wrap">{content.publisherStoryText}</p>
          <button type="button" onClick={onPreview} className="text-sm font-semibold rounded-lg bg-[#14532D] text-white px-4 py-2">Loe edasi</button>
        </div>
        <p className="font-serif text-sm text-stone-600">Lehe suurim laius: {design.contentWidth} px · Sektsioonide vahed: {design.sectionSpacing}%</p>
      </div>
      <p className="text-xs text-stone-500">Eelvaade näitab logo, teksti ja kaartide proportsioone. Lehe laiuse ning arvuti- ja telefonivaate kontrollimiseks ava kogu leht.</p>
    </div>
  </div>;
}
