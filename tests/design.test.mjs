import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const built = await build({ entryPoints: ['src/design.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { DEFAULT_DESIGN, normalizeDesign, designStyle } = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`);

test('older content without settings keeps the defaults; valid design settings round-trip', () => {
  assert.deepEqual(normalizeDesign(undefined), DEFAULT_DESIGN);
  assert.deepEqual(normalizeDesign(null), DEFAULT_DESIGN);
  const input = { ...DEFAULT_DESIGN, headerLogoHeight: 76, mobileLogoHeight: 38, textScale: 120, bodyFont: 'sans' };
  assert.deepEqual(normalizeDesign(JSON.parse(JSON.stringify(input))), input);
  const style = designStyle(input);
  assert.equal(style['--site-logo-height'], '76px');
  assert.equal(style['--site-mobile-logo-height'], '38px');
  assert.equal(style['--text-base'], 'calc(1rem * 1.2)');
  assert.equal(DEFAULT_DESIGN.headerLogoHeight, 56);
});

test('invalid imported settings use defaults or safe bounds instead of arbitrary CSS', () => {
  const d = normalizeDesign({ headerLogoHeight: 9999, mobileLogoHeight: -50, contentWidth: 2,
    textScale: NaN, lineHeight: Infinity, heroFontSize: 'url(https://example.com)', bodyFont: 'bad', headingFont: 'bad' });
  assert.equal(d.headerLogoHeight, 100);
  assert.equal(d.mobileLogoHeight, 28);
  assert.equal(d.contentWidth, 960);
  assert.equal(d.textScale, DEFAULT_DESIGN.textScale);
  assert.equal(d.lineHeight, DEFAULT_DESIGN.lineHeight);
  assert.equal(d.heroFontSize, DEFAULT_DESIGN.heroFontSize);
  assert.equal(d.bodyFont, 'original');
  assert.equal(d.headingFont, 'original');
  assert.ok(!JSON.stringify(designStyle(d)).includes('example.com'));
});
