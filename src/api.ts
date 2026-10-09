import { SiteContent, PublicationItem, OrderItem, ContactMessage } from './types';
import { INITIAL_SITE_CONTENT, INITIAL_PUBLICATIONS } from './data';

const SESSION_KEY = 'saaguvalgus_admin_session_v1';

// A successful write always means the server persisted it. Never simulate saves in localStorage.
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = sessionStorage.getItem(SESSION_KEY);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body) headers.set('Content-Type', 'application/json');
  let response: Response;
  try {
    response = await fetch(`/api${url}`, { ...options, headers, cache: 'no-store' });
  } catch {
    throw new Error('Ühendus serveriga puudub. Muudatusi ei salvestatud. Palun proovi uuesti.');
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Serveri API ei ole saadaval. Kontrolli, et domeen suunab Node serverisse. Muudatusi ei salvestatud.');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Andmete salvestamine ebaõnnestus.');
  return data;
}
const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

export const api = {
  async fetchContent(): Promise<SiteContent> {
    try { return await request<SiteContent>('/content'); }
    catch { return INITIAL_SITE_CONTENT; }
  },
  saveContent: (content: SiteContent) => request<SiteContent>('/content', json('PUT', content)),
  resetContent: () => request<SiteContent>('/content/reset', json('POST')),
  async fetchPublications(): Promise<PublicationItem[]> {
    try { return await request<PublicationItem[]>('/publications'); }
    catch { return INITIAL_PUBLICATIONS; }
  },
  uploadPublication: (data: {
    title: string; author?: string; category?: string; description?: string; pages?: number;
    fileName?: string; fileSize?: string; pdfBase64?: string;
    contentPages?: { pageNumber: number; heading: string; text: string }[];
  }) => request<PublicationItem>('/publications', json('POST', data)),
  async deletePublication(id: string): Promise<boolean> {
    await request(`/publications/${encodeURIComponent(id)}`, json('DELETE')); return true;
  },
  fetchOrders: () => request<OrderItem[]>('/orders'),
  createOrder: (data: {
    type: 'order' | 'preorder'; bookId: string; bookTitle: string; quantity: number;
    name: string; email: string; phone: string; address?: string; notes?: string;
  }) => request<OrderItem>('/orders', json('POST', data)),
  async updateOrderStatus(id: string, status: OrderItem['status']): Promise<boolean> {
    await request(`/orders/${encodeURIComponent(id)}`, json('PATCH', { status })); return true;
  },
  async deleteOrder(id: string): Promise<boolean> {
    await request(`/orders/${encodeURIComponent(id)}`, json('DELETE')); return true;
  },
  fetchMessages: () => request<ContactMessage[]>('/messages'),
  createMessage: (data: { name: string; email: string; message: string }) => request<ContactMessage>('/messages', json('POST', data)),
  async markMessageRead(id: string, read = true): Promise<boolean> {
    await request(`/messages/${encodeURIComponent(id)}/read`, json('PATCH', { read })); return true;
  },
  async deleteMessage(id: string): Promise<boolean> {
    await request(`/messages/${encodeURIComponent(id)}`, json('DELETE')); return true;
  },
  exportBackup: () => request<any>('/backup'),
  importBackup: (data: unknown) => request<any>('/backup', json('PUT', data)),
  async loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try { return await request('/auth/login', json('POST', { password })); }
    catch (error) { return { success: false, error: (error as Error).message }; }
  },
  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try { return await request('/auth/change-password', json('POST', { currentPassword, newPassword })); }
    catch (error) { return { success: false, error: (error as Error).message }; }
  },
  async verifySession(token: string): Promise<boolean> {
    try { return (await request<{ success: boolean }>('/auth/verify', json('POST', { token }))).success; }
    catch { return false; }
  }
};
