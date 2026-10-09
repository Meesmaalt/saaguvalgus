// Clipboard API is unavailable on some HTTP deployments; keep explicit copy buttons usable there.
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return; } catch { /* Try the legacy clipboard path. */ }
  }
  const focused = document.activeElement as HTMLElement | null;
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  try {
    input.select();
    if (!document.execCommand('copy')) throw new Error('Kopeerimine ebaõnnestus. Palun proovi uuesti.');
  } finally {
    input.remove();
    focused?.focus({ preventScroll: true });
  }
}
