import { SiteContent, PublicationItem, OrderItem, ContactMessage } from './types';
import { INITIAL_SITE_CONTENT, INITIAL_PUBLICATIONS, INITIAL_ORDERS, INITIAL_MESSAGES } from './data';

const API_BASE = '/api';

// Storage keys for static / offline fallback
const STORAGE_CONTENT_KEY = 'saaguvalgus_site_content_v6';
const STORAGE_PUBLICATIONS_KEY = 'saaguvalgus_publications_v2';
const STORAGE_ORDERS_KEY = 'saaguvalgus_orders_v2';
const STORAGE_MESSAGES_KEY = 'saaguvalgus_messages_v2';
const ADMIN_PASSWORD_KEY = 'saaguvalgus_admin_password_v2';
const ADMIN_SESSION_KEY = 'saaguvalgus_admin_session_v1';
const DEFAULT_PASSWORD = 'admin';

// Helper to safely fetch JSON without ever throwing "Unexpected token '<'" when receiving HTML error pages (like 405 or 404)
async function safeJsonFetch(url: string, options?: RequestInit): Promise<{ ok: boolean; status: number; data?: any }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    }
    // Received HTML (like index.html fallback or Nginx 405 Method Not Allowed error page)
    return { ok: false, status: res.status };
  } catch {
    // Network / offline error
    return { ok: false, status: 0 };
  }
}

// Local password helpers
function getLocalPassword(): string {
  try {
    const saved = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return DEFAULT_PASSWORD;
}

function setLocalPassword(pwd: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, pwd.trim());
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
}

export const api = {
  // --- Content ---
  async fetchContent(): Promise<SiteContent> {
    const res = await safeJsonFetch(`${API_BASE}/content`);
    if (res.ok && res.data && typeof res.data === 'object' && res.data.brandName) {
      try {
        localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(res.data));
      } catch (e) {}
      return res.data;
    }

    // Fallback: LocalStorage or Initial Content
    try {
      const saved = localStorage.getItem(STORAGE_CONTENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SITE_CONTENT;
  },

  async saveContent(content: SiteContent): Promise<SiteContent> {
    // Always persist to local cache first
    try {
      localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(content));
    } catch (e) {}

    // Attempt server sync
    const res = await safeJsonFetch(`${API_BASE}/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });

    if (res.ok && res.data) {
      return res.data;
    }
    return content;
  },

  async resetContent(): Promise<SiteContent> {
    try {
      localStorage.removeItem(STORAGE_CONTENT_KEY);
    } catch (e) {}

    const res = await safeJsonFetch(`${API_BASE}/content/reset`, { method: 'POST' });
    if (res.ok && res.data) {
      return res.data;
    }
    return INITIAL_SITE_CONTENT;
  },

  // --- Publications & PDFs ---
  async fetchPublications(): Promise<PublicationItem[]> {
    const res = await safeJsonFetch(`${API_BASE}/publications`);
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      try {
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(res.data));
      } catch (e) {}
      return res.data;
    }

    try {
      const saved = localStorage.getItem(STORAGE_PUBLICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PUBLICATIONS;
  },

  async uploadPublication(data: {
    title: string;
    author?: string;
    category?: string;
    description?: string;
    pages?: number;
    fileName?: string;
    fileSize?: string;
    pdfBase64?: string;
    contentPages?: { pageNumber: number; heading: string; text: string }[];
  }): Promise<PublicationItem> {
    // Attempt server upload first
    const res = await safeJsonFetch(`${API_BASE}/publications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok && res.data && res.data.id) {
      try {
        const existing = await api.fetchPublications();
        const updated = [res.data, ...existing.filter(p => p.id !== res.data.id)];
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return res.data;
    }

    // Static hosting fallback: create client publication record
    const id = 'pub-' + Date.now();
    const newPub: PublicationItem = {
      id,
      title: data.title.trim(),
      author: data.author || 'Kirjastus Saagu Valgus',
      category: data.category || 'Trükis',
      description: data.description || 'Kirjastuse ametlik väljaanne',
      pages: Number(data.pages) || 2,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileName: data.fileName || `${data.title.replace(/\s+/g, '_')}.pdf`,
      fileSize: data.fileSize || '1.2 MB',
      pdfUrl: data.pdfBase64,
      downloadCount: 0,
      contentPages: data.contentPages && data.contentPages.length > 0
        ? data.contentPages
        : [{ pageNumber: 1, heading: data.title.trim(), text: data.description || 'Kirjastuse ametlik infotrükis.' }]
    };

    try {
      const saved = localStorage.getItem(STORAGE_PUBLICATIONS_KEY);
      const list: PublicationItem[] = saved ? JSON.parse(saved) : INITIAL_PUBLICATIONS;
      const updated = [newPub, ...list.filter(p => p.id !== id)];
      localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    return newPub;
  },

  async deletePublication(id: string): Promise<boolean> {
    try {
      const saved = localStorage.getItem(STORAGE_PUBLICATIONS_KEY);
      if (saved) {
        const list: PublicationItem[] = JSON.parse(saved);
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(list.filter(p => p.id !== id)));
      }
    } catch (e) {}

    const res = await safeJsonFetch(`${API_BASE}/publications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // --- Orders ---
  async fetchOrders(): Promise<OrderItem[]> {
    const res = await safeJsonFetch(`${API_BASE}/orders`);
    if (res.ok && Array.isArray(res.data)) {
      try {
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(res.data));
      } catch (e) {}
      return res.data;
    }

    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ORDERS;
  },

  async createOrder(orderData: {
    type: 'order' | 'preorder';
    bookId: string;
    bookTitle: string;
    quantity: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  }): Promise<OrderItem> {
    const res = await safeJsonFetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (res.ok && res.data && res.data.id) {
      try {
        const existing = await api.fetchOrders();
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify([res.data, ...existing.filter(o => o.id !== res.data.id)]));
      } catch (e) {}
      return res.data;
    }

    // Static fallback
    const id = 'ord-' + Date.now().toString().slice(-6);
    const newOrder: OrderItem = {
      id,
      type: orderData.type,
      bookId: orderData.bookId,
      bookTitle: orderData.bookTitle,
      quantity: orderData.quantity,
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      notes: orderData.notes,
      status: 'uus',
      createdAt: new Date().toISOString()
    };

    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      const list: OrderItem[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify([newOrder, ...list.filter(o => o.id !== id)]));
    } catch (e) {}

    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderItem['status']): Promise<boolean> {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) {
        const list: OrderItem[] = JSON.parse(saved);
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(list.map(o => o.id === id ? { ...o, status } : o)));
      }
    } catch (e) {}

    const res = await safeJsonFetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  },

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) {
        const list: OrderItem[] = JSON.parse(saved);
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(list.filter(o => o.id !== id)));
      }
    } catch (e) {}

    const res = await safeJsonFetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // --- Messages ---
  async fetchMessages(): Promise<ContactMessage[]> {
    const res = await safeJsonFetch(`${API_BASE}/messages`);
    if (res.ok && Array.isArray(res.data)) {
      try {
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(res.data));
      } catch (e) {}
      return res.data;
    }

    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MESSAGES;
  },

  async createMessage(msgData: { name: string; email: string; message: string }): Promise<ContactMessage> {
    const res = await safeJsonFetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData),
    });

    if (res.ok && res.data && res.data.id) {
      try {
        const existing = await api.fetchMessages();
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify([res.data, ...existing.filter(m => m.id !== res.data.id)]));
      } catch (e) {}
      return res.data;
    }

    // Static fallback
    const id = 'msg-' + Date.now().toString().slice(-6);
    const newMsg: ContactMessage = {
      id,
      name: msgData.name,
      email: msgData.email,
      message: msgData.message,
      createdAt: new Date().toISOString(),
      read: false
    };

    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      const list: ContactMessage[] = saved ? JSON.parse(saved) : INITIAL_MESSAGES;
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify([newMsg, ...list.filter(m => m.id !== id)]));
    } catch (e) {}

    return newMsg;
  },

  async markMessageRead(id: string): Promise<boolean> {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) {
        const list: ContactMessage[] = JSON.parse(saved);
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(list.map(m => m.id === id ? { ...m, read: true } : m)));
      }
    } catch (e) {}

    const res = await safeJsonFetch(`${API_BASE}/messages/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    });
    return res.ok;
  },

  async deleteMessage(id: string): Promise<boolean> {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) {
        const list: ContactMessage[] = JSON.parse(saved);
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(list.filter(m => m.id !== id)));
      }
    } catch (e) {}

    const res = await safeJsonFetch(`${API_BASE}/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // --- Auth (Dual mode: Real Server API + Static Hosting Fallback) ---
  async loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const candidate = String(password || '').trim();
    if (!candidate) {
      return { success: false, error: 'Parool on kohustuslik' };
    }

    // 1. Try server API
    const res = await safeJsonFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: candidate }),
    });

    if (res.ok && res.data) {
      return res.data;
    }

    // If server actively returned 401 Unauthorized with JSON error message
    if (res.status === 401 && res.data && res.data.error) {
      return res.data;
    }

    // 2. Fallback for static hosting (e.g. saaguvalgus.eu where /api returns 405 or HTML)
    const currentStoredPwd = getLocalPassword();
    if (candidate === currentStoredPwd) {
      const token = 'tok_local_' + Date.now();
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, token);
      } catch (e) {}
      return { success: true, token };
    }

    return { success: false, error: 'Vale parool!' };
  },

  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const candidateCurrent = String(currentPassword || '').trim();
    const candidateNew = String(newPassword || '').trim();

    if (candidateNew.length < 4) {
      return { success: false, error: 'Uus parool peab olema vähemalt 4 tähemärki pikk!' };
    }

    // 1. Try server API
    const res = await safeJsonFetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: candidateCurrent, newPassword: candidateNew }),
    });

    if (res.ok && res.data) {
      setLocalPassword(candidateNew);
      return res.data;
    }

    if (res.status === 401 && res.data && res.data.error) {
      return res.data;
    }

    // 2. Fallback for static hosting
    const currentStoredPwd = getLocalPassword();
    if (candidateCurrent !== currentStoredPwd) {
      return { success: false, error: 'Praegune parool on vale!' };
    }

    // Update stored password
    setLocalPassword(candidateNew);
    const token = 'tok_local_' + Date.now();
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, token);
    } catch (e) {}

    return { success: true, token };
  },

  async verifySession(token: string): Promise<boolean> {
    if (!token) return false;
    if (token.startsWith('tok_local_')) return true;

    const res = await safeJsonFetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (res.ok && res.data) {
      return !!res.data.success;
    }

    // If server not present, consider active session valid
    return token.length > 5;
  }
};
