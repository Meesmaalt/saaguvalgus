import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3e3;
const DATA_DIR = path.resolve(__dirname, "data");
const UPLOADS_DIR = path.resolve(__dirname, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");
const INITIAL_DB_FILE = path.join(DATA_DIR, "initial-db.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const activeTokens = /* @__PURE__ */ new Set();
function getDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === "object") {
        return {
          adminPassword: parsed.adminPassword || "admin",
          publications: Array.isArray(parsed.publications) ? parsed.publications : [],
          orders: Array.isArray(parsed.orders) ? parsed.orders : [],
          messages: Array.isArray(parsed.messages) ? parsed.messages : [],
          content: parsed.content || {}
        };
      }
    }
  } catch (err) {
    console.error("Error reading db.json:", err);
  }
  try {
    if (fs.existsSync(INITIAL_DB_FILE)) {
      const initData = fs.readFileSync(INITIAL_DB_FILE, "utf-8");
      const parsed = JSON.parse(initData);
      saveDatabase(parsed);
      return parsed;
    }
  } catch (err) {
    console.error("Error reading initial-db.json:", err);
  }
  const defaultDb = {
    adminPassword: "admin",
    publications: [],
    orders: [],
    messages: [],
    content: {}
  };
  saveDatabase(defaultDb);
  return defaultDb;
}
function saveDatabase(db) {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error saving db.json:", err);
  }
}
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use("/uploads", express.static(UPLOADS_DIR));
  app.get("/api/status", (_req, res) => {
    res.json({ ok: true, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    const db = getDatabase();
    const candidate = String(password || "").trim();
    if (!candidate) {
      return res.status(400).json({ success: false, error: "Parool on kohustuslik" });
    }
    if (candidate === db.adminPassword) {
      const token = "tok_" + crypto.randomBytes(24).toString("hex");
      activeTokens.add(token);
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, error: "Vale parool!" });
  });
  app.post("/api/auth/change-password", (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();
    const candidateCurrent = String(currentPassword || "").trim();
    const candidateNew = String(newPassword || "").trim();
    if (candidateCurrent !== db.adminPassword) {
      return res.status(401).json({ success: false, error: "Praegune parool on vale!" });
    }
    if (candidateNew.length < 4) {
      return res.status(400).json({ success: false, error: "Uus parool peab olema v\xE4hemalt 4 t\xE4hem\xE4rki pikk!" });
    }
    db.adminPassword = candidateNew;
    saveDatabase(db);
    console.log("[Auth] Admin password successfully updated and persisted to disk.");
    activeTokens.clear();
    const token = "tok_" + crypto.randomBytes(24).toString("hex");
    activeTokens.add(token);
    return res.json({ success: true, token });
  });
  app.post("/api/auth/verify", (req, res) => {
    const { token } = req.body;
    if (token && activeTokens.has(token)) {
      return res.json({ success: true });
    }
    return res.json({ success: false });
  });
  app.get("/api/content", (_req, res) => {
    const db = getDatabase();
    res.json(db.content);
  });
  app.put("/api/content", (req, res) => {
    const newContent = req.body;
    if (!newContent || typeof newContent !== "object") {
      return res.status(400).json({ error: "Vigased andmed" });
    }
    const db = getDatabase();
    db.content = newContent;
    saveDatabase(db);
    res.json(db.content);
  });
  app.post("/api/content/reset", (_req, res) => {
    const db = getDatabase();
    try {
      if (fs.existsSync(INITIAL_DB_FILE)) {
        const initData = JSON.parse(fs.readFileSync(INITIAL_DB_FILE, "utf-8"));
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
  app.get("/api/publications", (_req, res) => {
    const db = getDatabase();
    res.json(db.publications);
  });
  app.post("/api/publications", (req, res) => {
    const { title, author, category, description, pages, fileName, fileSize, pdfBase64, contentPages } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: "Pealkiri on kohustuslik" });
    }
    const db = getDatabase();
    const id = "pub-" + Date.now();
    let pdfUrl = void 0;
    let savedFileName = fileName || `${title.replace(/[^a-zA-Z0-9_\u00C0-\u017F]/g, "_")}.pdf`;
    let calculatedFileSize = fileSize || "1.0 MB";
    if (pdfBase64 && typeof pdfBase64 === "string") {
      try {
        const matches = pdfBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let buffer;
        if (matches && matches.length === 3) {
          buffer = Buffer.from(matches[2], "base64");
        } else {
          buffer = Buffer.from(pdfBase64, "base64");
        }
        const safeName = `${id}-${savedFileName.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
        const filePath = path.join(UPLOADS_DIR, safeName);
        fs.writeFileSync(filePath, buffer);
        pdfUrl = `/uploads/${safeName}`;
        calculatedFileSize = (buffer.length / (1024 * 1024)).toFixed(1) + " MB";
        console.log(`[Upload] Saved PDF to ${filePath} (${calculatedFileSize})`);
      } catch (err) {
        console.error("Error saving uploaded PDF file:", err);
      }
    }
    const newPub = {
      id,
      title: String(title).trim(),
      author: author || "Kirjastus Saagu Valgus",
      category: category || "Tr\xFCkis",
      description: description || "Kirjastuse ametlik v\xE4ljaanne",
      pages: Number(pages) || 2,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      fileName: savedFileName,
      fileSize: calculatedFileSize,
      pdfUrl,
      downloadCount: 0,
      contentPages: Array.isArray(contentPages) && contentPages.length > 0 ? contentPages : [
        {
          pageNumber: 1,
          heading: String(title).trim(),
          text: description || "Kirjastuse ametlik infotr\xFCkis."
        }
      ]
    };
    db.publications.unshift(newPub);
    saveDatabase(db);
    res.json(newPub);
  });
  app.delete("/api/publications/:id", (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.publications.findIndex((p) => p.id === id);
    if (index !== -1) {
      const pub = db.publications[index];
      if (pub.pdfUrl && pub.pdfUrl.startsWith("/uploads/")) {
        const localFile = path.join(UPLOADS_DIR, path.basename(pub.pdfUrl));
        if (fs.existsSync(localFile)) {
          try {
            fs.unlinkSync(localFile);
          } catch (e) {
            console.error("Error deleting file:", e);
          }
        }
      }
      db.publications.splice(index, 1);
      saveDatabase(db);
    }
    res.json({ success: true });
  });
  app.get("/api/orders", (_req, res) => {
    const db = getDatabase();
    res.json(db.orders);
  });
  app.post("/api/orders", (req, res) => {
    const { type, bookId, bookTitle, quantity, name, email, phone, address, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Nimi ja e-post on kohustuslikud" });
    }
    const db = getDatabase();
    const newOrder = {
      id: "ord-" + Date.now(),
      type: type === "order" ? "order" : "preorder",
      bookId: bookId || "saagu-valgus-raamat",
      bookTitle: bookTitle || "Kirjastuse raamat",
      quantity: Number(quantity) || 1,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || "").trim(),
      address: address ? String(address).trim() : void 0,
      notes: notes ? String(notes).trim() : void 0,
      status: "uus",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.orders.unshift(newOrder);
    saveDatabase(db);
    res.json(newOrder);
  });
  app.patch("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDatabase();
    const order = db.orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: "Tellimust ei leitud" });
    }
    if (status) {
      order.status = status;
      saveDatabase(db);
    }
    res.json(order);
  });
  app.delete("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      db.orders.splice(index, 1);
      saveDatabase(db);
    }
    res.json({ success: true });
  });
  app.get("/api/messages", (_req, res) => {
    const db = getDatabase();
    res.json(db.messages);
  });
  app.post("/api/messages", (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Nimi ja s\xF5num on kohustuslikud" });
    }
    const db = getDatabase();
    const newMsg = {
      id: "msg-" + Date.now(),
      name: String(name).trim(),
      email: String(email || "").trim(),
      message: String(message).trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    };
    db.messages.unshift(newMsg);
    saveDatabase(db);
    res.json(newMsg);
  });
  app.patch("/api/messages/:id/read", (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const msg = db.messages.find((m) => m.id === id);
    if (msg) {
      msg.read = true;
      saveDatabase(db);
    }
    res.json({ success: true });
  });
  app.delete("/api/messages/:id", (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      db.messages.splice(index, 1);
      saveDatabase(db);
    }
    res.json({ success: true });
  });
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    console.log("[Vite] Initializing Vite middleware in dev mode...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Serving production build from dist...");
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} Saagu Valgus Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
