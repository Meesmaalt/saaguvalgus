import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || path.join(__dirname, 'uploads'));
const DB_FILE = path.join(DATA_DIR, 'db.json');
const INITIAL_DB_FILE = path.join(__dirname, 'data', 'initial-db.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface DatabaseSchema {
  adminPassword: string;
  publications: any[];
  orders: any[];
  messages: any[];
  content: any;
}

// Active session tokens in memory
const activeTokens = new Set<string>();

// Read or initialize database
function getDatabase(): DatabaseSchema {
  // Never replace existing user data with seed data after a read/parse failure.
  if (fs.existsSync(DB_FILE)) {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Invalid database; restore from backup instead of resetting it.');
    }
    return {
      adminPassword: parsed.adminPassword || 'admin',
      publications: Array.isArray(parsed.publications) ? parsed.publications : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      content: parsed.content || {},
    };
  }
  const db: DatabaseSchema = fs.existsSync(INITIAL_DB_FILE)
    ? JSON.parse(fs.readFileSync(INITIAL_DB_FILE, 'utf-8'))
    : { adminPassword: 'admin', publications: [], orders: [], messages: [], content: {} };
  db.adminPassword = process.env.ADMIN_PASSWORD || db.adminPassword || 'admin';
  saveDatabase(db);
  return db;
}

function saveDatabase(db: DatabaseSchema) {
  const tempFile = `${DB_FILE}.tmp.${crypto.randomUUID()}`;
  try {
    const fd = fs.openSync(tempFile, 'wx', 0o600);
    try {
      fs.writeFileSync(fd, JSON.stringify(db, null, 2), 'utf-8');
      fs.fsyncSync(fd);
    } finally { fs.closeSync(fd); }
    if (fs.existsSync(DB_FILE)) fs.copyFileSync(DB_FILE, `${DB_FILE}.bak`);
    fs.renameSync(tempFile, DB_FILE);
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }
}

async function startServer() {
  getDatabase();
  const app = express();
  app.use((_req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); next(); });

  // Allow up to 50MB for PDF file uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  // Public PDF URLs must stay public; missing PDFs must return 404, never SPA HTML.
  app.use('/uploads', express.static(UPLOADS_DIR, { fallthrough: false, dotfiles: 'deny' }));
  app.use('/api', (req, res, next) => {
    const publicRead = req.method === 'GET' && ['/status', '/content', '/publications'].includes(req.path);
    const publicPost = req.method === 'POST' && ['/auth/login', '/auth/verify', '/orders', '/messages'].includes(req.path);
    if (publicRead || publicPost) return next();
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (!token || !activeTokens.has(token)) {
      return res.status(401).json({ error: 'Administraatori sessioon on aegunud. Logi uuesti sisse.' });
    }
    next();
  });

  // --- API ROUTES ---

  // Health / Status check
  app.get('/api/status', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // 1. Auth: Login (Strict server-side password check - no hardcoded backdoors!)
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    const db = getDatabase();

    const candidate = String(password || '').trim();
    if (!candidate) {
      return res.status(400).json({ success: false, error: 'Parool on kohustuslik' });
    }

    if (candidate === db.adminPassword) {
      const token = 'tok_' + crypto.randomBytes(24).toString('hex');
      activeTokens.add(token);
      return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, error: 'Vale parool!' });
  });

  // 2. Auth: Change Password (Real server-side update across all devices)
  app.post('/api/auth/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();

    const candidateCurrent = String(currentPassword || '').trim();
    const candidateNew = String(newPassword || '').trim();

    if (candidateCurrent !== db.adminPassword) {
      return res.status(401).json({ success: false, error: 'Praegune parool on vale!' });
    }

    if (candidateNew.length < 4) {
      return res.status(400).json({ success: false, error: 'Uus parool peab olema vähemalt 4 tähemärki pikk!' });
    }

    db.adminPassword = candidateNew;
    saveDatabase(db);
    console.log('[Auth] Admin password successfully updated and persisted to disk.');

    // Invalidate old tokens and issue new one
    activeTokens.clear();
    const token = 'tok_' + crypto.randomBytes(24).toString('hex');
    activeTokens.add(token);

    return res.json({ success: true, token });
  });

  // 3. Auth: Verify Session Token
  app.post('/api/auth/verify', (req, res) => {
    const { token } = req.body;
    if (token && activeTokens.has(token)) {
      return res.json({ success: true });
    }
    return res.json({ success: false });
  });

  // 4. Content: Get & Update
  app.get('/api/content', (_req, res) => {
    const db = getDatabase();
    res.json(db.content);
  });

  app.put('/api/content', (req, res) => {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object' || Array.isArray(newContent) || !newContent.brandName) {
      return res.status(400).json({ error: 'Vigased andmed' });
    }
    const db = getDatabase();
    db.content = newContent;
    saveDatabase(db);
    res.json(db.content);
  });

  app.post('/api/content/reset', (_req, res) => {
    const db = getDatabase();
    try {
      if (fs.existsSync(INITIAL_DB_FILE)) {
        const initData = JSON.parse(fs.readFileSync(INITIAL_DB_FILE, 'utf-8'));
        if (initData.content) {
          db.content = initData.content;
          saveDatabase(db);
          return res.json(db.content);
        }
      }
    } catch (e) {
      console.error(e);
    }
    res.json(db.content);
  });

  // 5. Publications & PDFs: Get, Upload (Files saved to disk on server!), Delete
  app.get('/api/publications', (_req, res) => {
    const db = getDatabase();
    res.json(db.publications);
  });

  app.post('/api/publications', (req, res) => {
    const { title, author, category, description, pages, fileName, fileSize, pdfBase64, contentPages } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Pealkiri on kohustuslik' });
    }

    const db = getDatabase();
    const id = 'pub-' + crypto.randomUUID();
    let pdfUrl: string | undefined = undefined;
    let savedFileName = fileName || `${title.replace(/[^a-zA-Z0-9_\u00C0-\u017F]/g, '_')}.pdf`;
    let calculatedFileSize = fileSize || '1.0 MB';

    // If PDF base64 was sent, save it as a real file in /uploads
    if (pdfBase64 && typeof pdfBase64 === 'string') {
      try {
        const encoded = pdfBase64.replace(/^data:[^;,]*;base64,/, '');
        if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
          return res.status(400).json({ error: 'Vigane PDF fail.' });
        }
        const buffer = Buffer.from(encoded, 'base64');
        if (buffer.length > 10 * 1024 * 1024) {
          return res.status(413).json({ error: 'PDF peab olema kuni 10 MB.' });
        }
        if (buffer.subarray(0, 5).toString() !== '%PDF-') {
          return res.status(400).json({ error: 'Valitud fail ei ole PDF.' });
        }
        const safeName = `${id}.pdf`;
        const filePath = path.join(UPLOADS_DIR, safeName);
        fs.writeFileSync(filePath, buffer);
        pdfUrl = `/uploads/${safeName}`;
        calculatedFileSize = (buffer.length / (1024 * 1024)).toFixed(1) + ' MB';
        console.log(`[Upload] Saved PDF to ${filePath} (${calculatedFileSize})`);
      } catch (err) {
        console.error('Error saving uploaded PDF file:', err);
        return res.status(500).json({ error: 'PDF salvestamine ebaõnnestus. Kontrolli serveri kettaruumi ja õigusi.' });
      }
    }

    const newPub = {
      id,
      title: String(title).trim(),
      author: author || 'Kirjastus Saagu Valgus',
      category: category || 'Trükis',
      description: description || 'Kirjastuse ametlik väljaanne',
      pages: Number(pages) || 2,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileName: savedFileName,
      fileSize: calculatedFileSize,
      pdfUrl: pdfUrl,
      downloadCount: 0,
      contentPages: Array.isArray(contentPages) && contentPages.length > 0
        ? contentPages
        : [
            {
              pageNumber: 1,
              heading: String(title).trim(),
              text: description || 'Kirjastuse ametlik infotrükis.'
            }
          ]
    };

    db.publications.unshift(newPub);
    try { saveDatabase(db); } catch (error) {
      if (pdfUrl) fs.rmSync(path.join(UPLOADS_DIR, path.basename(pdfUrl)), { force: true });
      throw error;
    }

    res.json(newPub);
  });

  app.delete('/api/publications/:id', (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.publications.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      const pub = db.publications[index];
      // Clean up uploaded file if local
      db.publications.splice(index, 1);
      saveDatabase(db);
      if (pub.pdfUrl && pub.pdfUrl.startsWith('/uploads/')) {
        try { fs.rmSync(path.join(UPLOADS_DIR, path.basename(pub.pdfUrl)), { force: true }); }
        catch (error) { console.error('Unable to remove unused PDF:', error); }
      }
    }
    res.json({ success: true });
  });

  // 6. Orders: Get, Create, Update status, Delete
  app.get('/api/orders', (_req, res) => {
    const db = getDatabase();
    res.json(db.orders);
  });

  app.post('/api/orders', (req, res) => {
    const { type, bookId, bookTitle, quantity, name, email, phone, address, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Nimi ja e-post on kohustuslikud' });
    }

    const db = getDatabase();
    const newOrder = {
      id: 'ord-' + Date.now(),
      type: type === 'order' ? 'order' : 'preorder',
      bookId: bookId || 'saagu-valgus-raamat',
      bookTitle: bookTitle || 'Kirjastuse raamat',
      quantity: Number(quantity) || 1,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      address: address ? String(address).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      status: 'uus',
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);

    res.json(newOrder);
  });

  app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDatabase();
    const order = db.orders.find((o: any) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Tellimust ei leitud' });
    }
    if (status) {
      order.status = status;
      saveDatabase(db);
    }
    res.json(order);
  });

  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.orders.findIndex((o: any) => o.id === id);
    if (index !== -1) {
      db.orders.splice(index, 1);
      saveDatabase(db);
    }
    res.json({ success: true });
  });

  // 7. Messages: Get, Create, Mark read, Delete
  app.get('/api/messages', (_req, res) => {
    const db = getDatabase();
    res.json(db.messages);
  });

  app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Nimi ja sõnum on kohustuslikud' });
    }

    const db = getDatabase();
    const newMsg = {
      id: 'msg-' + Date.now(),
      name: String(name).trim(),
      email: String(email || '').trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    db.messages.unshift(newMsg);
    saveDatabase(db);

    res.json(newMsg);
  });

  app.patch('/api/messages/:id/read', (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const msg = db.messages.find((m: any) => m.id === id);
    if (msg) {
      msg.read = typeof req.body?.read === 'boolean' ? req.body.read : true;
      saveDatabase(db);
    }
    res.json({ success: true });
  });

  app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.messages.findIndex((m: any) => m.id === id);
    if (index !== -1) {
      db.messages.splice(index, 1);
      saveDatabase(db);
    }
    res.json({ success: true });
  });

  // Portable backup includes PDF bytes, not just URLs into the old server.
  app.get('/api/backup', (_req, res) => {
    const { adminPassword: _password, ...db } = getDatabase();
    const files: Record<string, string> = {};
    for (const publication of db.publications) {
      if (publication.pdfUrl?.startsWith('/uploads/')) {
        const name = path.basename(publication.pdfUrl);
        files[name] = fs.readFileSync(path.join(UPLOADS_DIR, name)).toString('base64');
      }
    }
    res.json({ version: '3.0', exportedAt: new Date().toISOString(), ...db, files });
  });
  app.put('/api/backup', (req, res) => {
    const input = req.body;
    if (!input?.content?.brandName || !Array.isArray(input.orders) ||
        !Array.isArray(input.messages) || !Array.isArray(input.publications)) {
      return res.status(400).json({ error: 'Vigane varundusfail.' });
    }
    // Stage restored PDFs under unique names to preserve the current site if restore fails.
    const created: string[] = [];
    try {
      const publications = input.publications.map((publication: any) => {
        if (!publication.pdfUrl) return publication;
        const name = path.basename(publication.pdfUrl);
        const bytes = publication.pdfUrl.startsWith('data:application/pdf;base64,')
          ? publication.pdfUrl.split(',')[1] : input.files?.[name];
        if (!bytes) {
          if (publication.pdfUrl.startsWith('/uploads/') && fs.existsSync(path.join(UPLOADS_DIR, name))) return publication;
          throw new Error('Varundus ei sisalda kõiki PDF faile. Taasta ka uploads kaust.');
        }
        const buffer = Buffer.from(bytes, 'base64');
        if (buffer.subarray(0, 5).toString() !== '%PDF-' || buffer.length > 10 * 1024 * 1024) {
          throw new Error('Varunduses on vigane või liiga suur PDF.');
        }
        const restoredName = `restore-${crypto.randomUUID()}.pdf`;
        const file = path.join(UPLOADS_DIR, restoredName);
        fs.writeFileSync(file, buffer);
        created.push(file);
        return { ...publication, pdfUrl: `/uploads/${restoredName}` };
      });
      const db = getDatabase();
      Object.assign(db, { content: input.content, orders: input.orders, messages: input.messages, publications });
      saveDatabase(db);
      res.json({ content: db.content, orders: db.orders, messages: db.messages, publications });
    } catch (error) {
      created.forEach(file => fs.rmSync(file, { force: true }));
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found' }));
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Request failed:', err);
    res.status(err.status || 500).json({ error: err.status === 404 ? 'Faili ei leitud.' :
      err.status === 413 ? 'Fail või sisu on liiga suur.' : 'Server ei saanud andmeid salvestada või lugeda. Palun proovi uuesti.' });
  });

  // --- VITE MIDDLEWARES / STATIC SPA SERVING ---
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    console.log('[Vite] Initializing Vite middleware in dev mode...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Server] Serving production build from dist...');
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const primaryPort = PORT;
  app.listen(primaryPort, '0.0.0.0', () => {
    console.log(`🚀 Saagu Valgus Server running on http://0.0.0.0:${primaryPort}`);
  });

  // Support dual-port listening for Docker host mappings (-p 3002:80 or -p 3002:3000)
  const secondaryPort = primaryPort === 80 ? 3000 : (primaryPort === 3000 ? 80 : null);
  if (secondaryPort) {
    try {
      const secondaryServer = app.listen(secondaryPort, '0.0.0.0', () => {
        console.log(`🚀 Also listening on http://0.0.0.0:${secondaryPort}`);
      });
      secondaryServer.on('error', () => {
        // Port might be in use or require root privileges, ignore gracefully
      });
    } catch {}
  }
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
