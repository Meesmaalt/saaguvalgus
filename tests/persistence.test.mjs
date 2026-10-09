import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import net from 'node:net';

async function freePort() {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

// Reuse the same disk directories with a replacement server process: container redeploy semantics.
test('public PDFs and all admin data survive server replacement; failures never reset data', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'saaguvalgus-'));
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  let child, token;
  const start = async () => {
    child = spawn(process.execPath, ['server.js'], { env: { ...process.env, NODE_ENV: 'production', PORT: String(port), DATA_DIR: path.join(root, 'data'), UPLOADS_DIR: path.join(root, 'uploads'), ADMIN_PASSWORD: 'test-password' }, stdio: ['ignore', 'pipe', 'pipe'] });
    let logs = '';
    child.stdout.on('data', chunk => { logs += chunk; });
    child.stderr.on('data', chunk => { logs += chunk; });
    for (let n = 0; n < 100; n++) {
      if (child.exitCode !== null) throw new Error(logs);
      try { if ((await fetch(`${base}/api/status`)).ok) return; } catch {}
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    throw new Error('Server did not start: ' + logs);
  };
  const stop = async () => { if (child && child.exitCode === null) { child.kill(); await once(child, 'exit'); } };
  const call = async (route, method = 'GET', body, admin = true) => {
    const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(admin && token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: response.status, data: await response.json() };
  };
  try {
    await start();
    assert.equal((await call('/api/content', 'PUT', {}, false)).status, 401);
    assert.equal((await call('/api/orders', 'GET', undefined, false)).status, 401);
    assert.equal((await call('/api/messages', 'GET', undefined, false)).status, 401);
    token = (await call('/api/auth/login', 'POST', { password: 'test-password' })).data.token;
    assert.ok(token);
    const content = (await call('/api/content')).data;
    content.heroTitle = 'TEST CAPS Preserve';
    assert.equal((await call('/api/content', 'PUT', content)).status, 200);
    const pdf = Buffer.from('%PDF-1.4\n%Integration test\n%%EOF');
    const publication = (await call('/api/publications', 'POST', { title: 'PDF TRÜKIS', fileName: '../proov.pdf', pdfBase64: `data:application/pdf;base64,${pdf.toString('base64')}` })).data;
    assert.ok(publication.pdfUrl.startsWith('/uploads/pub-'));
    const publicPDF = await fetch(base + publication.pdfUrl);
    assert.equal(publicPDF.headers.get('content-type'), 'application/pdf');
    assert.deepEqual(Buffer.from(await publicPDF.arrayBuffer()), pdf);
    assert.equal((await call('/uploads/missing.pdf', 'GET', undefined, false)).status, 404);
    assert.equal((await call('/api/publications', 'POST', { title: 'Bad PDF', pdfBase64: Buffer.from('not pdf').toString('base64') })).status, 400);
    const order = (await call('/api/orders', 'POST', { name: 'Test', email: 'test@example.com', quantity: 2 })).data;
    await call(`/api/orders/${order.id}`, 'PATCH', { status: 'kinnitatud' });
    const message = (await call('/api/messages', 'POST', { name: 'Test', message: 'Hello' }, false)).data;
    await call(`/api/messages/${message.id}/read`, 'PATCH', { read: true });
    const backup = (await call('/api/backup')).data;
    assert.equal(backup.files[path.basename(publication.pdfUrl)], pdf.toString('base64'));
    assert.equal(backup.adminPassword, undefined);
    await call('/api/auth/change-password', 'POST', { currentPassword: 'test-password', newPassword: 'replacement-password' });
    await stop();
    await start();
    token = (await call('/api/auth/login', 'POST', { password: 'replacement-password' })).data.token;
    assert.ok(token, 'Password is persisted instead of replaced by initial ADMIN_PASSWORD');
    assert.equal((await call('/api/content')).data.heroTitle, 'TEST CAPS Preserve');
    assert.ok((await call('/api/publications', 'GET', undefined, false)).data.some(p => p.id === publication.id));
    assert.equal((await call('/api/orders')).data.find(o => o.id === order.id).status, 'kinnitatud');
    assert.equal((await call('/api/messages')).data.find(m => m.id === message.id).read, true);
    assert.deepEqual(Buffer.from(await (await fetch(base + publication.pdfUrl)).arrayBuffer()), pdf);
    assert.equal((await call('/api/backup', 'PUT', backup)).status, 200);
    const restoredPub = (await call('/api/publications')).data.find(p => p.id === publication.id);
    assert.deepEqual(Buffer.from(await (await fetch(base + restoredPub.pdfUrl)).arrayBuffer()), pdf);
    // An unreadable database must report failure and preserve original bytes.
    const dbFile = path.join(root, 'data/db.json');
    const goodDatabase = await readFile(dbFile, 'utf8');
    await writeFile(dbFile, '{corrupt');
    assert.equal((await call('/api/content', 'PUT', content)).status, 500);
    assert.equal(await readFile(dbFile, 'utf8'), '{corrupt');
    await writeFile(dbFile, goodDatabase);
    // Force a real filesystem write failure while keeping reads available.
    await rm(path.join(root, 'data/db.json.bak'), { force: true });
    const { mkdir } = await import('node:fs/promises');
    await mkdir(path.join(root, 'data/db.json.bak'));
    assert.equal((await call('/api/content', 'PUT', { ...content, heroTitle: 'Should not save' })).status, 500);
    assert.equal((await call('/api/content')).data.heroTitle, 'TEST CAPS Preserve');
  } finally { await stop(); await rm(root, { recursive: true, force: true }); }
});
