import { SiteContent, PublicationItem, OrderItem, ContactMessage } from './types';
import { INITIAL_SITE_CONTENT, INITIAL_PUBLICATIONS, INITIAL_ORDERS, INITIAL_MESSAGES } from './data';

const API_BASE = '/api';

export const api = {
  // --- Content ---
  async fetchContent(): Promise<SiteContent> {
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API error fetching content, using fallback:', e);
    }
    return INITIAL_SITE_CONTENT;
  },

  async saveContent(content: SiteContent): Promise<SiteContent> {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Sisumuudatuste salvestamine ebaõnnestus');
    }
    return await res.json();
  },

  async resetContent(): Promise<SiteContent> {
    const res = await fetch(`${API_BASE}/content/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Lähtestamine ebaõnnestus');
    return await res.json();
  },

  // --- Publications & PDFs ---
  async fetchPublications(): Promise<PublicationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/publications`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API error fetching publications:', e);
    }
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
    const res = await fetch(`${API_BASE}/publications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Trükise üleslaadimine ebaõnnestus');
    }
    return await res.json();
  },

  async deletePublication(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/publications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // --- Orders ---
  async fetchOrders(): Promise<OrderItem[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API error fetching orders:', e);
    }
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
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Tellimuse esitamine ebaõnnestus');
    }
    return await res.json();
  },

  async updateOrderStatus(id: string, status: OrderItem['status']): Promise<boolean> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  },

  async deleteOrder(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // --- Messages ---
  async fetchMessages(): Promise<ContactMessage[]> {
    try {
      const res = await fetch(`${API_BASE}/messages`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API error fetching messages:', e);
    }
    return INITIAL_MESSAGES;
  },

  async createMessage(msgData: { name: string; email: string; message: string }): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Sõnumi saatmine ebaõnnestus');
    }
    return await res.json();
  },

  async markMessageRead(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/messages/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    });
    return res.ok;
  },

  async deleteMessage(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // --- Auth (Real Server-Side Password Check) ---
  async loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, error: 'Ühenduse viga serveriga: ' + (e?.message || '') };
    }
  },

  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, error: 'Ühenduse viga serveriga: ' + (e?.message || '') };
    }
  },

  async verifySession(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  }
};
