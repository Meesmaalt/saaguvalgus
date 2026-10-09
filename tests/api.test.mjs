import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({ entryPoints: ['src/api.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { api } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
globalThis.sessionStorage = { getItem: () => 'test-token' };

test('unavailable API never creates browser-only PDFs, messages, orders, or authenticated sessions', async () => {
  const previous = globalThis.fetch;
  try {
    for (const response of [() => new Response('<html>SPA</html>', { headers: { 'Content-Type': 'text/html' } }),
      () => new Response(JSON.stringify({ error: 'Disk is full' }), { status: 500, headers: { 'Content-Type': 'application/json' } }),
      () => { throw new Error('Offline'); }]) {
      globalThis.fetch = async () => response();
      await assert.rejects(api.uploadPublication({ title: 'PDF' }));
      await assert.rejects(api.saveContent({ brandName: 'TEST' }));
      await assert.rejects(api.createMessage({ name: 'Test', email: '', message: 'Hi' }));
      await assert.rejects(api.createOrder({ name: 'Test', email: 'test@example.com' }));
      assert.equal((await api.loginAdmin('admin')).success, false);
      assert.equal(await api.verifySession('tok_local_fake'), false);
    }
  } finally { globalThis.fetch = previous; }
});
