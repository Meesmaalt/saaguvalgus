import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Mail, 
  BookOpen, 
  Edit3, 
  Layers, 
  CheckCircle2, 
  Trash2, 
  Search, 
  Download, 
  Upload, 
  Plus, 
  ArrowLeft, 
  X, 
  Check, 
  Filter, 
  Sparkles,
  Calendar,
  Phone,
  MapPin,
  Clock,
  RotateCcw,
  Save,
  Server,
  Lock,
  Unlock,
  ShieldAlert,
  Flame,
  Heart,
  FileText,
  Printer,
  LogOut,
  Key,
  Eye,
  EyeOff,
  Shield,
  UserCheck,
  BarChart3,
  Globe
} from 'lucide-react';
import { SiteContent, BookItem, OrderItem, ContactMessage, QuestionItem, PublicationItem } from './types';
import { api } from './api';
import { SITE_CONTENT_EN } from './translations';

interface AdminDashboardProps {
  content: SiteContent;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string;
  onRetrySave: () => void;
  saveContent: (newContent: SiteContent) => void;
  orders: OrderItem[];
  saveOrders: (newOrders: OrderItem[]) => void;
  messages: ContactMessage[];
  saveMessages: (newMessages: ContactMessage[]) => void;
  publications: PublicationItem[];
  savePublications: (newPubs: PublicationItem[]) => void;
  onUploadPublication?: (data: {
    title: string;
    author?: string;
    category?: string;
    description?: string;
    pages?: number;
    fileName?: string;
    fileSize?: string;
    pdfBase64?: string;
    contentPages?: any[];
  }) => Promise<PublicationItem>;
  onDeletePublication?: (id: string) => Promise<void>;
  adminPassword?: string;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  onLogout?: () => void;
  onClose: () => void;
  onResetToDefault: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  content,
  saveStatus,
  saveError,
  onRetrySave,
  saveContent,
  orders,
  saveOrders,
  messages,
  saveMessages,
  publications,
  savePublications,
  onUploadPublication,
  onDeletePublication,
  adminPassword = 'admin',
  onChangePassword,
  onLogout,
  onClose,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'messages' | 'publications' | 'books' | 'content' | 'settings' | 'backup'>('orders');
  const [editLang, setEditLang] = useState<'et' | 'en'>('et');
  const [orderFilter, setOrderFilter] = useState<'all' | 'preorder' | 'order' | 'uus' | 'kinnitatud' | 'postitatud'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [newBookModalOpen, setNewBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);

  // Password Management State
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdChangeStatus, setPwdChangeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pwdChangeErrorMsg, setPwdChangeErrorMsg] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeStatus('idle');
    setPwdChangeErrorMsg('');

    if (newPwdInput.length < 4) {
      setPwdChangeStatus('error');
      setPwdChangeErrorMsg('Uus parool peab olema vähemalt 4 tähemärki pikk!');
      return;
    }
    if (newPwdInput !== confirmPwdInput) {
      setPwdChangeStatus('error');
      setPwdChangeErrorMsg('Uued paroolid ei kattu!');
      return;
    }

    if (onChangePassword) {
      const res = await onChangePassword(currentPwdInput, newPwdInput);
      if (res && !res.success) {
        setPwdChangeStatus('error');
        setPwdChangeErrorMsg(res.error || 'Praegune parool on vale!');
        return;
      }
    }
    setPwdChangeStatus('success');
    setCurrentPwdInput('');
    setNewPwdInput('');
    setConfirmPwdInput('');
    setTimeout(() => setPwdChangeStatus('idle'), 4000);
  };

  // New Publication Modal State
  const [newPubModalOpen, setNewPubModalOpen] = useState(false);
  const [newPubData, setNewPubData] = useState<{
    title: string;
    author: string;
    category: string;
    description: string;
    pages: number;
    file: File | null;
  }>({
    title: '',
    author: 'Kirjastus Saagu Valgus',
    category: 'Infovoldik',
    description: '',
    pages: 2,
    file: null
  });

  // Publication Handlers
  const [isUploadingPub, setIsUploadingPub] = useState(false);

  const handleUploadPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubData.title.trim()) return;

    setIsUploadingPub(true);
    try {
      if (newPubData.file && (newPubData.file.size > 10 * 1024 * 1024 || !/\.pdf$/i.test(newPubData.file.name))) {
        throw new Error('Vali PDF fail suurusega kuni 10 MB.');
      }
      let pdfBase64: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      let fileSize: string | undefined = undefined;

      if (newPubData.file) {
        fileName = newPubData.file.name;
        fileSize = (newPubData.file.size / (1024 * 1024)).toFixed(1) + ' MB';
        pdfBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(newPubData.file!);
        });
      }

      if (onUploadPublication) {
        const created = await onUploadPublication({
          title: newPubData.title,
          author: newPubData.author || 'Kirjastus Saagu Valgus',
          category: newPubData.category || 'Trükis',
          description: newPubData.description || 'Trükis / infomaterjal',
          pages: Number(newPubData.pages) || 2,
          fileName,
          fileSize,
          pdfBase64,
          contentPages: [
            {
              pageNumber: 1,
              heading: newPubData.title,
              text: newPubData.description || 'Infotrükis.'
            }
          ]
        });
        // Parent updates the list from the confirmed server record.
      } else {
        throw new Error('Serveri üleslaadimine ei ole saadaval.');
      }

      setNewPubModalOpen(false);
      setNewPubData({
        title: '',
        author: 'Kirjastus Saagu Valgus',
        category: 'Infovoldik',
        description: '',
        pages: 2,
        file: null
      });
      notifySaved();
    } catch (err: any) {
      alert('Viga trükise lisamisel: ' + (err?.message || 'Palun proovige uuesti'));
    } finally {
      setIsUploadingPub(false);
    }
  };

  const handleDownloadPublication = (pub: PublicationItem) => {
    if (pub.pdfUrl) {
      const a = document.createElement('a');
      a.href = pub.pdfUrl;
      a.download = pub.fileName || `${pub.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    const docText = `======================================================
KIRJASTUS SAAGU VALGUS - TRÜKIS
======================================================
Pealkiri: ${pub.title}
Kategooria: ${pub.category}
Autor: ${pub.author || 'Kirjastus Saagu Valgus'}
Kuupäev: ${pub.uploadedAt}
Kirjeldus: ${pub.description}

------------------------------------------------------
${(pub.contentPages || []).map(p => `
[ LEHEKÜLG ${p.pageNumber} ]
${p.heading.toUpperCase()}

${p.text}
`).join('\n------------------------------------------------------\n')}
======================================================`;
    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pub.fileName ? pub.fileName.replace('.pdf', '.txt') : `${pub.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeletePublication = async (pubId: string) => {
    if (!window.confirm('Kas oled kindel, et soovid selle trükise kustutada?')) return;
    try {
      if (!onDeletePublication) throw new Error('Serveri ühendus puudub.');
      await onDeletePublication(pubId);
      notifySaved();
    } catch (error) { alert((error as Error).message); }
  };

  // New Manual Order State
  const [manualOrder, setManualOrder] = useState<{
    type: 'order' | 'preorder';
    bookId: string;
    quantity: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    status: OrderItem['status'];
  }>({
    type: 'preorder',
    bookId: content.books[0]?.id || '',
    quantity: 1,
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    status: 'uus'
  });

  const notifySaved = () => {
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  // Confirm server persistence before updating the admin view.
  const handleUpdateOrderStatus = async (orderId: string, status: OrderItem['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      saveOrders(await api.fetchOrders());
      notifySaved();
    } catch (error) { alert((error as Error).message); }
  };
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Kas oled kindel, et soovid selle tellimuse kustutada?')) return;
    try {
      await api.deleteOrder(orderId);
      saveOrders(await api.fetchOrders());
      notifySaved();
    } catch (error) { alert((error as Error).message); }
  };
  const handleAddManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const book = content.books.find(b => b.id === manualOrder.bookId);
    if (!book) return;
    try {
      const created = await api.createOrder({ ...manualOrder, bookTitle: book.title });
      if (manualOrder.status !== 'uus') await api.updateOrderStatus(created.id, manualOrder.status);
      saveOrders(await api.fetchOrders());
      setNewOrderModalOpen(false);
      setManualOrder({ type: 'preorder', bookId: content.books[0]?.id || '', quantity: 1,
        name: '', email: '', phone: '', address: '', notes: '', status: 'uus' });
      notifySaved();
    } catch (error) { alert((error as Error).message); }
  };
  const handleToggleMessageRead = async (msgId: string) => {
    try {
      await api.markMessageRead(msgId, !messages.find(m => m.id === msgId)?.read);
      saveMessages(await api.fetchMessages());
    } catch (error) { alert((error as Error).message); }
  };
  const handleDeleteMessage = async (msgId: string) => {
    if (!window.confirm('Kas soovid selle sõnumi kustutada?')) return;
    try {
      await api.deleteMessage(msgId);
      saveMessages(await api.fetchMessages());
      notifySaved();
    } catch (error) { alert((error as Error).message); }
  };

  // Book Handlers
  const handleTogglePreOrder = (bookId: string) => {
    const updatedBooks = content.books.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          isPreOrder: !b.isPreOrder,
          preOrderNote: !b.isPreOrder ? (b.preOrderNote || 'Ilmumas peagi – broneeri oma eksemplar ette!') : b.preOrderNote
        };
      }
      return b;
    });
    saveContent({ ...content, books: updatedBooks });
  };

  const handleSaveBook = (bookToSave: BookItem) => {
    const exists = content.books.some(b => b.id === bookToSave.id);
    let updatedBooks: BookItem[];
    if (exists) {
      updatedBooks = content.books.map(b => b.id === bookToSave.id ? bookToSave : b);
    } else {
      updatedBooks = [...content.books, bookToSave];
    }
    saveContent({ ...content, books: updatedBooks });
    setEditingBook(null);
    setNewBookModalOpen(false);
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Kas soovid selle raamatu kataloogist eemaldada?')) {
      const updatedBooks = content.books.filter(b => b.id !== bookId);
      saveContent({ ...content, books: updatedBooks });
    }
  };

  // CSV Export for orders
  const handleExportOrdersCSV = () => {
    const headers = ['ID', 'Tüüp', 'Kuupäev', 'Nimi', 'E-post', 'Telefon', 'Aadress / Märkused', 'Raamat', 'Kogus', 'Staatus', 'Märkused'];
    const rows = orders.map(ord => [
      ord.id,
      ord.type === 'preorder' ? 'ETTETELLIMINE' : 'TAVATELLIMUS',
      new Date(ord.createdAt).toLocaleString('et-EE'),
      `"${ord.name.replace(/"/g, '""')}"`,
      ord.email,
      `"${ord.phone}"`,
      `"${(ord.address || '').replace(/"/g, '""')}"`,
      `"${ord.bookTitle.replace(/"/g, '""')}"`,
      ord.quantity,
      ord.status,
      `"${(ord.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `saaguvalgus-tellimused-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // The server backup includes all persisted content and uploaded PDF files.
  const handleExportFullJSON = async () => {
    try {
      const backup = await api.exportBackup();
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `saaguvalgus-varundus-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { alert((error as Error).message); }
  };
  const handleImportFullJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm('Taastamine asendab praeguse sisu, tellimused, sõnumid ja trükised. Kas jätkata?')) return;
    try {
      await api.importBackup(JSON.parse(await file.text()));
      window.location.reload();
    } catch (error) { alert((error as Error).message); }
  };

  // Filter orders
  const filteredOrders = orders.filter(ord => {
    if (orderFilter === 'preorder' && ord.type !== 'preorder') return false;
    if (orderFilter === 'order' && ord.type !== 'order') return false;
    if (orderFilter === 'uus' && ord.status !== 'uus') return false;
    if (orderFilter === 'kinnitatud' && ord.status !== 'kinnitatud') return false;
    if (orderFilter === 'postitatud' && ord.status !== 'postitatud') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ord.name.toLowerCase().includes(q);
      const matchEmail = ord.email.toLowerCase().includes(q);
      const matchPhone = ord.phone.toLowerCase().includes(q);
      const matchBook = ord.bookTitle.toLowerCase().includes(q);
      const matchAddress = Boolean(ord.address && ord.address.toLowerCase().includes(q));
      return matchName || matchEmail || matchPhone || matchBook || matchAddress;
    }
    return true;
  });

  const preOrderCount = orders.filter(o => o.type === 'preorder').length;
  const regularOrderCount = orders.filter(o => o.type === 'order').length;
  const newOrdersCount = orders.filter(o => o.status === 'uus').length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-[#f1f5f2] text-stone-900 font-sans flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-[#144225] text-white border-b border-[#0d2d19] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
              title="Tagasi kodulehele"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Tagasi kodulehele</span>
            </button>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#144225] flex items-center justify-center font-black text-sm">
                SV
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold font-display leading-tight">Admin & Tellimuste haldus</h1>
                <p className="text-[11px] text-emerald-200">Kirjastus Saagu Valgus</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {saveSuccessMsg && (
              <span className="text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Salvestatud!</span>
              </span>
            )}
            <button
              onClick={handleExportFullJSON}
              disabled={saveStatus === 'saving'}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Varunda JSON</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Vaata lehte</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Logi administraatori paneelist välja"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logi välja</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        
        <div role="status" aria-live="polite" className={`p-4 rounded-xl border text-sm flex flex-wrap items-center justify-between gap-3 ${saveStatus === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-stone-200 text-stone-600'}`}>
          <span>{saveStatus === 'saving' ? 'Salvestan muudatusi serverisse…' : saveStatus === 'saved' ? 'Muudatused on serverisse salvestatud.' : saveStatus === 'error' ? saveError : 'Sisu salvestatakse automaatselt serverisse. Trükised on avalikud pärast edukat üleslaadimist.'}</span>
          {saveStatus === 'error' && <button onClick={onRetrySave} className="font-semibold underline cursor-pointer">Proovi uuesti</button>}
        </div>
        {/* KPI / Overview Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          <div 
            onClick={() => { setActiveTab('orders'); setOrderFilter('preorder'); }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'orders' && orderFilter === 'preorder' 
                ? 'bg-amber-500 text-white border-amber-600' 
                : 'bg-white hover:border-amber-400 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Ettetellimused</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-2 font-display">{preOrderCount}</div>
            <p className="text-[11px] mt-0.5 opacity-90">Uued trükised ettetellimisel</p>
          </div>

          <div 
            onClick={() => { setActiveTab('orders'); setOrderFilter('order'); }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'orders' && orderFilter === 'order' 
                ? 'bg-[#1a6838] text-white border-[#14542d]' 
                : 'bg-white hover:border-[#1a6838] border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Tavatellimused</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-2 font-display">{regularOrderCount}</div>
            <p className="text-[11px] mt-0.5 opacity-90">Kataloogist tellitud raamatud</p>
          </div>

          <div 
            onClick={() => { setActiveTab('orders'); setOrderFilter('uus'); }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'orders' && orderFilter === 'uus' 
                ? 'bg-blue-600 text-white border-blue-700' 
                : 'bg-white hover:border-blue-400 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Töötlemata</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-2 font-display">{newOrdersCount}</div>
            <p className="text-[11px] mt-0.5 opacity-90">Ootavad kinnitamist</p>
          </div>

          <div 
            onClick={() => setActiveTab('messages')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'messages' 
                ? 'bg-stone-800 text-white border-stone-900' 
                : 'bg-white hover:border-stone-400 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Sõnumid</span>
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-2 font-display">{messages.length}</div>
            <p className="text-[11px] mt-0.5 opacity-90">{unreadMessagesCount} lugemata sõnumit</p>
          </div>

        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-300 pb-2">
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-[#1a6838] text-white shadow-sm' 
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Tellimused & Ettetellimused ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'messages' 
                ? 'bg-[#1a6838] text-white shadow-sm' 
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Sõnumid & Kontakt ({messages.length})</span>
            {unreadMessagesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('publications')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'publications' 
                ? 'bg-[#1a6838] text-white shadow-sm' 
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Trükised & PDF ({publications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'books' 
                ? 'bg-[#1a6838] text-white shadow-sm' 
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Raamatud & Ettetellimine ({content.books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'content' 
                ? 'bg-[#1a6838] text-white shadow-sm' 
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Kodulehe sisu (CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-[#1a6838] text-white shadow-sm' 
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Konto & Turvalisus</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'backup' 
                ? 'bg-[#1a6838] text-white shadow-sm' 
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Varundus</span>
          </button>

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TELLIMUSED & ETTETELLIMUSED */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter & Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    orderFilter === 'all' ? 'bg-[#1a6838] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Kõik ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('preorder')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    orderFilter === 'preorder' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ettetellimused ({preOrderCount})</span>
                </button>
                <button
                  onClick={() => setOrderFilter('order')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    orderFilter === 'order' ? 'bg-[#1a6838] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Tavatellimused ({regularOrderCount})
                </button>
                <button
                  onClick={() => setOrderFilter('uus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    orderFilter === 'uus' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Uued ({newOrdersCount})
                </button>
              </div>

              {/* Search and Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Otsi nime, meili, raamatut..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Ekspordi tellimused CSV failina"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
                <button
                  onClick={() => setNewOrderModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Lisa tellimus</span>
                </button>
              </div>

            </div>

            {/* Orders List / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-800">Ühtegi tellimust ei leitud</h4>
                <p className="text-xs text-stone-500">Proovi teist filtrit või lisa uus tellimus käsitsi.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => {
                  const isPreOrder = ord.type === 'preorder';
                  return (
                    <div 
                      key={ord.id}
                      className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:border-[#1a6838]/40 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            isPreOrder 
                              ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {isPreOrder ? '✨ ETTETELLIMINE' : '📦 TAVATELLIMUS'}
                          </span>
                          <span className="font-mono text-xs text-stone-500 font-semibold">{ord.id}</span>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {new Date(ord.createdAt).toLocaleString('et-EE', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-500">Staatus:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderItem['status'])}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                              ord.status === 'uus' 
                                ? 'bg-blue-50 text-blue-800 border-blue-200' 
                                : ord.status === 'kinnitatud'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : ord.status === 'postitatud'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : ord.status === 'täidetud'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                            }`}
                          >
                            <option value="uus">Uus</option>
                            <option value="kinnitatud">Kinnitatud</option>
                            <option value="postitatud">Postitatud</option>
                            <option value="täidetud">Täidetud</option>
                            <option value="tühistatud">Tühistatud</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Kustuta tellimus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                        {/* Book & Quantity */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Tellitud raamat</span>
                          <div className="font-bold text-[#144225] text-base">
                            «{ord.bookTitle}»
                          </div>
                          <div className="text-stone-600 font-semibold">
                            Kogus: <span className="text-stone-900 font-bold bg-stone-100 px-2 py-0.5 rounded">{ord.quantity} tk</span>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Tellija andmed</span>
                          <div className="font-bold text-stone-900">{ord.name}</div>
                          <div className="text-stone-600 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            <a href={`mailto:${ord.email}`} className="text-[#1a6838] hover:underline font-mono text-xs">{ord.email}</a>
                          </div>
                          {ord.phone && (
                            <div className="text-stone-600 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <a href={`tel:${ord.phone}`} className="font-mono text-xs">{ord.phone}</a>
                            </div>
                          )}
                        </div>

                        {/* Delivery Address & Notes */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Tarne / Pakiautomaat</span>
                          <div className="text-stone-800 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#1a6838] shrink-0 mt-0.5" />
                            <span className="font-medium">{ord.address || 'Aadress märkimata'}</span>
                          </div>
                          {ord.notes && (
                            <div className="mt-2 p-2 bg-stone-50 rounded-lg text-xs text-stone-600 italic border border-stone-200">
                              Märkus: «{ord.notes}»
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SÕNUMID & KONTAKT */}
        {/* ========================================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900">Veebilehe kontaktisõnumid</h3>
                <p className="text-xs text-stone-500">Külastajate kirjad, küsimused ja päringud kirjastusele</p>
              </div>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Kokku: {messages.length}
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-800">Ühtegi sõnumit pole veel saabunud</h4>
                <p className="text-xs text-stone-500">Kõik lehe allosas oleva kontaktivormi kaudu saadetud kirjad salvestatakse siia.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-colors ${
                      msg.read ? 'border-stone-200 opacity-90' : 'border-[#1a6838]/60 bg-emerald-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-xs font-mono text-[#1a6838] hover:underline">
                          &lt;{msg.email}&gt;
                        </a>
                        {!msg.read && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            UUS
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">
                          {new Date(msg.createdAt).toLocaleString('et-EE')}
                        </span>
                        <button
                          onClick={() => handleToggleMessageRead(msg.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
                        >
                          {msg.read ? 'Märgi uueks' : 'Märgi loetuks'}
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=Vastus päringule Kirjastuselt Saagu Valgus`}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1a6838] text-white hover:bg-[#15542d] transition-colors"
                        >
                          Vasta
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-xl text-xs sm:text-sm text-stone-700 leading-relaxed font-sans border border-stone-200">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: TRÜKISED & PDF FAILIDE HALDUS */}
        {/* ========================================================================= */}
        {activeTab === 'publications' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-stone-900 font-display">Kirjastuse Trükised ja PDF failid</h3>
                <p className="text-xs text-stone-500 max-w-xl">
                  Laadi siia üles uusi PDF faile, infovoldikuid ja lehti. Külastajad saavad neid lehel vaadata ja printida. Samuti saad siit paneelist kõiki faile igal ajal alla laadida.
                </p>
              </div>
              <button
                onClick={() => setNewPubModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Laadi üles uus PDF trükis</span>
              </button>
            </div>

            {/* Publications Grid */}
            {publications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-stone-400" />
                </div>
                <h4 className="font-bold text-stone-800">Ühtegi trükist ei ole veel lisatud</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Vaikimisi 3 trükist on eemaldatud. Uute trükiste lisamiseks vajuta ülalolevat nuppu «Laadi üles uus PDF trükis».
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1a6838]/50 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#1a6838] bg-[#1a6838]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {pub.category}
                        </span>
                        {pub.fileSize && (
                          <span className="text-xs text-stone-400 font-mono">
                            {pub.fileSize}
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 leading-snug">
                            {pub.title}
                          </h4>
                          <p className="text-xs text-stone-500">
                            {pub.author || 'Kirjastus Saagu Valgus'} • {pub.pages || pub.contentPages?.length || 1} lk
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {pub.description}
                      </p>

                      <div className="text-[11px] text-stone-400">
                        Lisatud: {pub.uploadedAt}
                      </div>
                    </div>

                    {/* Actions: Download PDF & Delete */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleDownloadPublication(pub)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1a6838] border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Laadi see PDF fail alla arvutisse"
                      >
                        <Download className="w-3.5 h-3.5 text-[#1a6838]" />
                        <span>Laadi alla (PDF)</span>
                      </button>

                      <button
                        onClick={() => handleDeletePublication(pub.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-200 transition-colors cursor-pointer"
                        title="Kustuta trükis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RAAMATUD & ETTETELLIMINE */}
        {/* ========================================================================= */}
        {activeTab === 'books' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900">Kirjastuse raamatud ja ettetellimise seaded</h3>
                <p className="text-xs text-stone-500">Määra millised raamatud on ettetellimisel ja muuda tutvustusi</p>
              </div>
              <button
                onClick={() => {
                  setEditingBook({
                    id: 'raamat-' + Date.now(),
                    title: '',
                    author: 'Kirjastus Saagu Valgus',
                    category: 'Vaimulik kirjandus',
                    description: '',
                    highlights: [''],
                    isFeatured: true,
                    isPreOrder: true,
                    preOrderNote: 'Uus trükk ilmumas! Ettetellijatele kindlustatud esitrükk.'
                  });
                  setNewBookModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Lisa uus raamat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.books.map((book) => (
                <div 
                  key={book.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{book.category}</span>
                      
                      {/* Pre-Order Toggle Button */}
                      <button
                        onClick={() => handleTogglePreOrder(book.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                          book.isPreOrder
                            ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                        title="Klõpsa ettetellimise staatuse muutmiseks"
                      >
                        {book.isPreOrder ? (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>ETTETELLIMISEL</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>LAOS SAADAVAL</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h4 className="text-lg font-bold font-display text-[#144225]">«{book.title}»</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{book.description}</p>

                    {book.isPreOrder && book.preOrderNote && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                        📌 Ettetellimise märge: {book.preOrderNote}
                      </div>
                    )}

                    <div className="space-y-1">
                      {book.highlights.map((h, i) => (
                        <div key={i} className="text-xs text-stone-500 flex items-center gap-1.5">
                          <span className="text-[#1a6838] font-bold">•</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-medium">{book.author}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          setNewBookModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1a6838] bg-[#1a6838]/10 hover:bg-[#1a6838]/20 transition-colors"
                      >
                        Muuda
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 transition-colors"
                        title="Kustuta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KODULEHE SISU HALDUS (CMS) */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-3xl border border-[#E2D7C8] p-6 sm:p-8 shadow-md space-y-8 text-left">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E2D7C8] pb-5 gap-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#14532D]">Kodulehe Tekstide ja Sisu Toimetamine</h3>
                <p className="text-xs sm:text-sm text-stone-600 font-sans mt-0.5">Kõik muudatused salvestatakse automaatselt serverisse ning on nähtavad kõigile külastajatele.</p>
              </div>
              <button
                onClick={() => saveContent(content)}
                className="px-6 py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md shrink-0"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Salvesta muudatused</span>
              </button>
            </div>

            {/* Language Selector Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200 max-w-md">
              <button
                type="button"
                onClick={() => setEditLang('et')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  editLang === 'et' ? 'bg-[#14532D] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🇪🇪 Toimeta Eesti keelt
              </button>
              <button
                type="button"
                onClick={() => setEditLang('en')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  editLang === 'en' ? 'bg-[#14532D] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🇬🇧 Toimeta Inglise keelt (EN)
              </button>
            </div>

            {/* Hero & Brand */}
            <div className="space-y-5 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D7C8]">
              <h4 className="font-sans font-bold text-sm text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                <span>1. Päis, Pealkirjad & Kontakt {editLang === 'en' ? '(Inglise keeles)' : '(Eesti keeles)'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Päise teema / hüüdlause</label>
                  <input
                    type="text"
                    value={editLang === 'en' ? (content.en?.heroBadge || '') : content.heroBadge}
                    onChange={(e) => {
                      if (editLang === 'en') {
                        saveContent({ ...content, en: { ...(content.en || {}), heroBadge: e.target.value } });
                      } else {
                        saveContent({ ...content, heroBadge: e.target.value });
                      }
                    }}
                    placeholder={editLang === 'en' ? 'E.g. Light or darkness?' : ''}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base font-bold text-stone-900 focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Kirjastuse e-post (info@saaguvalgus.eu)</label>
                  <input
                    type="email"
                    value={content.contactEmail}
                    onChange={(e) => saveContent({ ...content, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base font-mono font-bold text-[#14532D] focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Avalehe pealkirja tekst</label>
                <input
                  type="text"
                  value={editLang === 'en' ? (content.en?.heroTitle || '') : content.heroTitle}
                  onChange={(e) => {
                    if (editLang === 'en') {
                      saveContent({ ...content, en: { ...(content.en || {}), heroTitle: e.target.value } });
                    } else {
                      saveContent({ ...content, heroTitle: e.target.value });
                    }
                  }}
                  placeholder={editLang === 'en' ? 'E.g. Light or' : ''}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base sm:text-lg font-serif font-bold text-stone-900 focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Autori sissejuhatav pöördumine</label>
                <textarea
                  rows={4}
                  value={editLang === 'en' ? (content.en?.heroDescription || '') : content.heroDescription}
                  onChange={(e) => {
                    if (editLang === 'en') {
                      saveContent({ ...content, en: { ...(content.en || {}), heroDescription: e.target.value } });
                    } else {
                      saveContent({ ...content, heroDescription: e.target.value });
                    }
                  }}
                  placeholder={editLang === 'en' ? 'E.g. Our land is surrounded by spiritual deception...' : ''}
                  className="w-full p-4 rounded-xl border border-stone-300 text-base sm:text-lg font-serif leading-relaxed text-stone-900 focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Central Questions (1:1 Text) */}
            <div className="space-y-6 pt-4 border-t border-[#E2D7C8]">
              <h4 className="font-sans font-bold text-sm text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>2. Kolm Põhiküsimust (Autori täistekstid - {editLang === 'en' ? 'Inglise keeles' : 'Eesti keeles'})</span>
              </h4>
              
              {content.centralQuestions.map((q, idx) => (
                <div key={q.id} className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E2D7C8] space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-mono font-bold text-sm text-[#9A3412]">Põhiküsimus 0{q.number}.</span>
                    <span className="text-xs font-sans text-stone-500 font-semibold">Toimeta keeles: {editLang === 'en' ? 'Inglise' : 'Eesti'}</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Küsimuse pealkiri</label>
                    <input
                      type="text"
                      value={editLang === 'en' ? (content.en?.centralQuestions?.[idx]?.question || '') : q.question}
                      onChange={(e) => {
                        if (editLang === 'en') {
                          const updatedEn = { ...(content.en || {}) };
                          const updatedQs = [...(updatedEn.centralQuestions || [])];
                          if (updatedQs.length === 0) {
                            SITE_CONTENT_EN.centralQuestions.forEach(eq => updatedQs.push({ ...eq }));
                          }
                          if (!updatedQs[idx]) {
                            updatedQs[idx] = { ...(content.centralQuestions[idx] || {}) };
                          }
                          updatedQs[idx].question = e.target.value;
                          updatedEn.centralQuestions = updatedQs;
                          saveContent({ ...content, en: updatedEn });
                        } else {
                          const updated = [...content.centralQuestions];
                          updated[idx].question = e.target.value;
                          saveContent({ ...content, centralQuestions: updated });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base sm:text-lg font-serif font-bold text-stone-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Autori täistekst (vastuse sisu)</label>
                    <textarea
                      rows={8}
                      value={editLang === 'en' ? (content.en?.centralQuestions?.[idx]?.fullText || '') : q.fullText}
                      onChange={(e) => {
                        if (editLang === 'en') {
                          const updatedEn = { ...(content.en || {}) };
                          const updatedQs = [...(updatedEn.centralQuestions || [])];
                          if (updatedQs.length === 0) {
                            SITE_CONTENT_EN.centralQuestions.forEach(eq => updatedQs.push({ ...eq }));
                          }
                          if (!updatedQs[idx]) {
                            updatedQs[idx] = { ...(content.centralQuestions[idx] || {}) };
                          }
                          updatedQs[idx].fullText = e.target.value;
                          updatedEn.centralQuestions = updatedQs;
                          saveContent({ ...content, en: updatedEn });
                        } else {
                          const updated = [...content.centralQuestions];
                          updated[idx].fullText = e.target.value;
                          saveContent({ ...content, centralQuestions: updated });
                        }
                      }}
                      className="w-full p-4 rounded-xl border border-stone-300 text-base sm:text-lg font-serif leading-relaxed text-stone-900 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Book Covers & Homepage Display Management */}
            <div className="space-y-6 pt-4 border-t border-[#E2D7C8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D7C8] pb-4">
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#14532D]" />
                    <span>3. Raamatute Haldus, Kaanepildid & Esilehel Kuvamine</span>
                  </h4>
                  <p className="text-xs text-stone-600 font-sans mt-1">
                    Vali, mitu raamatut esilehel kuvatakse (asetus ja laius kohanduvad automaatselt), lülita üksikute raamatute nähtavust ning muuda pilte ja kirjeldusi.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newBook: BookItem = {
                      id: `raamat-${Date.now().toString().slice(-4)}`,
                      title: 'Uus Raamat',
                      author: 'Kirjastus Saagu Valgus',
                      category: 'Vaimulik kirjandus',
                      description: 'Sisesta raamatu lühitutvustus...',
                      highlights: ['Põhiteema 1', 'Põhiteema 2'],
                      isFeatured: true,
                      isPreOrder: true,
                      showOnHomepage: true,
                      isVisible: true,
                      preOrderNote: 'Valmimisel',
                      releaseDate: 'Valmimisel'
                    };
                    saveContent({ ...content, books: [...content.books, newBook] });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-sans font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Lisa uus raamat</span>
                </button>
              </div>

              {/* Homepage display count selector toolbar */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D7C8] flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#14532D] font-sans uppercase tracking-wider">
                    Esilehel kuvatavate raamatute arv (Küljendus & veergude laius)
                  </label>
                  <p className="text-xs text-stone-600 font-sans">
                    Vastavalt valitud arvule kohandab leht automaatselt ploki laiuse (1 raamatu puhul suur fookusvaade, 2 raamatul 2 veergu, 3 raamatul 3 veergu).
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={content.maxHomepageBooks || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      saveContent({ ...content, maxHomepageBooks: val });
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white shadow-2xs focus:ring-2 focus:ring-[#14532D]"
                  >
                    <option value={0}>Kõik lubatud raamatud (Automaatne veergude asetus)</option>
                    <option value={1}>1 raamat (Suur esiletõstetud fookusvaade)</option>
                    <option value={2}>2 raamatut (Kaheveeruline sümmeetriline laius)</option>
                    <option value={3}>3 raamatut (Kolmeveeruline ruudustik)</option>
                    <option value={4}>4 raamatut (Neljaveeruline paigutus)</option>
                  </select>

                  <span className="text-xs font-bold font-sans bg-emerald-100 text-[#14532D] px-3 py-2 rounded-xl border border-emerald-200">
                    Aktiivseid: {content.books.filter(b => b.showOnHomepage !== false && b.isVisible !== false).slice(0, content.maxHomepageBooks && content.maxHomepageBooks > 0 ? content.maxHomepageBooks : undefined).length} / {content.books.length}
                  </span>
                </div>
              </div>

              {/* Books Grid Editor */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.books.map((book, bIdx) => (
                  <div 
                    key={book.id} 
                    className={`p-5 rounded-2xl border space-y-4 shadow-2xs text-left transition-all ${
                      book.showOnHomepage !== false && book.isVisible !== false
                        ? 'bg-white border-[#E2D7C8]' 
                        : 'bg-stone-100/70 border-stone-300 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#14532D]">«{book.title}»</span>
                        {book.showOnHomepage !== false && book.isVisible !== false ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Esilehel
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-md">
                            Peidetud
                          </span>
                        )}
                      </div>
                      
                      {content.books.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Kas soovid raamatu «${book.title}» eemaldada?`)) {
                              const updated = content.books.filter((_, idx) => idx !== bIdx);
                              saveContent({ ...content, books: updated });
                            }
                          }}
                          className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Kustuta raamat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Visibility Toggle for this specific book */}
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7E0D5] flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 font-sans">
                        Kuva see raamat esilehel:
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={book.showOnHomepage !== false && book.isVisible !== false}
                          onChange={(e) => {
                            const updated = [...content.books];
                            updated[bIdx].showOnHomepage = e.target.checked;
                            updated[bIdx].isVisible = e.target.checked;
                            saveContent({ ...content, books: updated });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#14532D]"></div>
                      </label>
                    </div>

                    {/* Image Preview */}
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white border border-stone-300 shadow-inner relative flex items-center justify-center">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="p-4 text-center space-y-2">
                          <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
                          <span className="text-xs font-sans text-stone-500 block">Standard kaanepilt kasutusel</span>
                        </div>
                      )}
                    </div>

                    {/* Image Upload Input */}
                    <div className="space-y-2 font-sans">
                      <label className="block text-xs font-bold text-stone-800">
                        Laadi üles uus pildifail:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              const updated = [...content.books];
                              updated[bIdx].coverImage = base64;
                              saveContent({ ...content, books: updated });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#14532D] file:text-white hover:file:bg-[#0F3D24] cursor-pointer"
                      />
                    </div>

                    {/* Image URL fallback input */}
                    <div className="space-y-1 font-sans">
                      <label className="block text-[11px] font-bold text-stone-700">
                        Või pildi veebilink (URL):
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={book.coverImage || ''}
                        onChange={(e) => {
                          const updated = [...content.books];
                          updated[bIdx].coverImage = e.target.value;
                          saveContent({ ...content, books: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono bg-white"
                      />
                    </div>

                    {book.coverImage && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...content.books];
                          delete updated[bIdx].coverImage;
                          saveContent({ ...content, books: updated });
                        }}
                        className="w-full py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Taasta algne pilt
                      </button>
                    )}

                    {/* Title, Category & Description Fields */}
                    <div className="space-y-2 pt-2 border-t border-stone-200">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Raamatu pealkiri</label>
                        <input
                          type="text"
                          value={book.title}
                          onChange={(e) => {
                            const updated = [...content.books];
                            updated[bIdx].title = e.target.value;
                            saveContent({ ...content, books: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-serif font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Autor & Kategooria</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={book.author}
                            onChange={(e) => {
                              const updated = [...content.books];
                              updated[bIdx].author = e.target.value;
                              saveContent({ ...content, books: updated });
                            }}
                            placeholder="Autor"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                          />
                          <input
                            type="text"
                            value={book.category}
                            onChange={(e) => {
                              const updated = [...content.books];
                              updated[bIdx].category = e.target.value;
                              saveContent({ ...content, books: updated });
                            }}
                            placeholder="Kategooria"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Lühikirjeldus</label>
                        <textarea
                          rows={3}
                          value={book.description}
                          onChange={(e) => {
                            const updated = [...content.books];
                            updated[bIdx].description = e.target.value;
                            saveContent({ ...content, books: updated });
                          }}
                          className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-serif bg-white"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* 4. Publisher Story & Mission */}
            <div className="space-y-5 pt-4 border-t border-[#E2D7C8] bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D7C8]">
              <h4 className="font-sans font-bold text-sm text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#14532D]" />
                <span>4. Kirjastuse Missioon & Lugu {editLang === 'en' ? '(Inglise keeles)' : '(Eesti keeles)'}</span>
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Kirjastuse missiooni pealkiri</label>
                  <input
                    type="text"
                    value={editLang === 'en' ? (content.en?.publisherStoryTitle || '') : content.publisherStoryTitle}
                    onChange={(e) => {
                      if (editLang === 'en') {
                        saveContent({ ...content, en: { ...(content.en || {}), publisherStoryTitle: e.target.value } });
                      } else {
                        saveContent({ ...content, publisherStoryTitle: e.target.value });
                      }
                    }}
                    placeholder={editLang === 'en' ? 'E.g. Let There Be Light Publishing History' : ''}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base sm:text-lg font-serif font-bold text-stone-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Kirjastuse missiooni teksti sisu</label>
                  <textarea
                    rows={6}
                    value={editLang === 'en' ? (content.en?.publisherStoryText || '') : content.publisherStoryText}
                    onChange={(e) => {
                      if (editLang === 'en') {
                        saveContent({ ...content, en: { ...(content.en || {}), publisherStoryText: e.target.value } });
                      } else {
                        saveContent({ ...content, publisherStoryText: e.target.value });
                      }
                    }}
                    placeholder={editLang === 'en' ? 'E.g. Our mission is to publish pure spiritual books...' : ''}
                    className="w-full p-4 rounded-xl border border-stone-300 text-base sm:text-lg font-serif leading-relaxed text-stone-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 5. Support & Bank Information */}
            <div className="space-y-5 pt-4 border-t border-[#E2D7C8] bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D7C8]">
              <h4 className="font-sans font-bold text-sm text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#14532D]" />
                <span>5. Toetuse andmed & Tekstid {editLang === 'en' ? '(Inglise keeles)' : '(Eesti keeles)'}</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Toetuse sektsiooni pealkiri</label>
                <input
                  type="text"
                  value={editLang === 'en' ? (content.en?.support?.title || '') : content.support.title}
                  onChange={(e) => {
                    if (editLang === 'en') {
                      const updatedEn = { ...(content.en || {}) };
                      updatedEn.support = { ...(updatedEn.support || {}), title: e.target.value } as any;
                      saveContent({ ...content, en: updatedEn });
                    } else {
                      saveContent({ ...content, support: { ...content.support, title: e.target.value } });
                    }
                  }}
                  placeholder={editLang === 'en' ? 'If this website has been a blessing to You, You may support its work here:' : 'Kui see lehekülg on olnud Sulle õnnistuseks, saad selle toimimist toetada nii:'}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base sm:text-lg font-serif font-bold text-stone-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Saaja nimi (Kairi Oja) (Globaalne)</label>
                  <input
                    type="text"
                    value={content.support.recipientName}
                    onChange={(e) => saveContent({ ...content, support: { ...content.support, recipientName: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base font-serif font-bold text-stone-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Pangakonto (IBAN) (Globaalne)</label>
                  <input
                    type="text"
                    value={content.support.iban}
                    onChange={(e) => saveContent({ ...content, support: { ...content.support, iban: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base font-mono font-bold text-[#14532D] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Pank / Pangad (Globaalne)</label>
                  <input
                    type="text"
                    value={content.support.bankName}
                    onChange={(e) => saveContent({ ...content, support: { ...content.support, bankName: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Selgitus (makse selgitus) (Globaalne)</label>
                  <input
                    type="text"
                    value={content.support.explanation}
                    onChange={(e) => saveContent({ ...content, support: { ...content.support, explanation: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">PayPal e-posti aadress (Globaalne)</label>
                  <input
                    type="text"
                    value={content.support.paypalEmail || ''}
                    onChange={(e) => saveContent({ ...content, support: { ...content.support, paypalEmail: e.target.value } })}
                    placeholder="kairioja777@proton.me"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono font-bold text-[#14532D] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">PayPal annetuse märge</label>
                  <input
                    type="text"
                    value={editLang === 'en' ? (content.en?.support?.paypalNote || '') : (content.support.paypalNote || '')}
                    onChange={(e) => {
                      if (editLang === 'en') {
                        const updatedEn = { ...(content.en || {}) };
                        updatedEn.support = { ...(updatedEn.support || {}), paypalNote: e.target.value } as any;
                        saveContent({ ...content, en: updatedEn });
                      } else {
                        saveContent({ ...content, support: { ...content.support, paypalNote: e.target.value } });
                      }
                    }}
                    placeholder={editLang === 'en' ? 'or by making a donation to the PayPal account:' : 'või tehes annetuse PayPal kontole:'}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-serif italic text-stone-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Märge raamatute müügi arvelduse kohta</label>
                <input
                  type="text"
                  value={content.support.bookSalesNote || ''}
                  onChange={(e) => saveContent({ ...content, support: { ...content.support, bookSalesNote: e.target.value } })}
                  placeholder="Raamatute müük ja trükiste arveldus toimub Saagu Valgus OÜ kaudu."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs font-serif text-stone-700 bg-white"
                />
              </div>
            </div>

            {/* 6. Prayers Section */}
            <div className="space-y-5 pt-4 border-t border-[#E2D7C8] bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D7C8]">
              <h4 className="font-sans font-bold text-sm text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#14532D]" />
                <span>6. Päästepalve & Meie Isa Palve {editLang === 'en' ? '(Inglise keeles)' : '(Eesti keeles)'}</span>
              </h4>
              
              <div>
                <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Päästepalve tekst</label>
                <textarea
                  rows={8}
                  value={editLang === 'en' ? (content.en?.salvationPrayerText || '') : content.salvationPrayerText}
                  onChange={(e) => {
                    if (editLang === 'en') {
                      saveContent({ ...content, en: { ...(content.en || {}), salvationPrayerText: e.target.value } });
                    } else {
                      saveContent({ ...content, salvationPrayerText: e.target.value });
                    }
                  }}
                  placeholder={editLang === 'en' ? 'E.g. Dear Heavenly Father...' : ''}
                  className="w-full p-4 rounded-xl border border-stone-300 text-base sm:text-lg font-serif leading-relaxed text-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Meie Isa palve tekst</label>
                <textarea
                  rows={6}
                  value={editLang === 'en' ? (content.en?.lordPrayer?.text || '') : content.lordPrayer.text}
                  onChange={(e) => {
                    if (editLang === 'en') {
                      const updatedEn = { ...(content.en || {}) };
                      updatedEn.lordPrayer = { ...(updatedEn.lordPrayer || {}), text: e.target.value } as any;
                      saveContent({ ...content, en: updatedEn });
                    } else {
                      saveContent({ ...content, lordPrayer: { ...content.lordPrayer, text: e.target.value } });
                    }
                  }}
                  placeholder={editLang === 'en' ? 'E.g. Our Father who art in heaven...' : ''}
                  className="w-full p-4 rounded-xl border border-stone-300 text-base sm:text-lg font-serif leading-relaxed text-stone-900 bg-white"
                />
              </div>
            </div>

            {/* 7. Testimonials & Author Photo Editor */}
            {(() => {
              const testimony = (content.testimonials && content.testimonials[0]) || {
                id: 'kairi-oja-tunnistus',
                title: 'Kairi tunnistus – Vabanemine viis aastat kestnud karmist vaimsest sidumisest',
                person: 'Kairi Oja',
                type: 'vabanemine',
                date: '08.03.2025',
                image: '',
                facebookUrl: 'https://www.facebook.com/share/1DUothVLCF/',
                facebookPageTitle: 'Saagu Valgus - kas Jumal on reaalne?',
                summary: '',
                fullStory: ''
              };

              const enTestimony = content.en?.testimonials?.[0] || {
                title: '',
                person: 'Kairi Oja',
                summary: '',
                fullStory: '',
                facebookPageTitle: ''
              };

              const updateTestimony = (patch: Partial<typeof testimony>) => {
                const updatedList = content.testimonials && content.testimonials.length > 0
                  ? [...content.testimonials]
                  : [testimony];
                updatedList[0] = { ...updatedList[0], ...patch };
                saveContent({ ...content, testimonials: updatedList });
              };

              const updateEnTestimony = (patch: Partial<typeof enTestimony>) => {
                const updatedEn = { ...(content.en || {}) };
                const updatedEnList = Array.isArray(updatedEn.testimonials) && updatedEn.testimonials.length > 0
                  ? [...updatedEn.testimonials]
                  : [enTestimony];
                updatedEnList[0] = { ...updatedEnList[0], ...patch };
                updatedEn.testimonials = updatedEnList as any;
                saveContent({ ...content, en: updatedEn });
              };

              return (
                <div className="space-y-6 pt-4 border-t border-[#E2D7C8] bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E2D7C8] text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D7C8] pb-4">
                    <div>
                      <h4 className="font-sans font-bold text-base text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#14532D]" />
                        <span>7. Kairi Tunnistus, Ikoon / Foto & Sisu {editLang === 'en' ? '(Inglise keeles)' : '(Eesti keeles)'}</span>
                      </h4>
                      <p className="text-xs text-stone-600 font-sans mt-1">
                        Siin saad vahetada Kairi portreefotot/ikooni, muuta tunnistuse sisu, pealkirja, kuupäeva ning Facebooki linki.
                      </p>
                    </div>
                  </div>

                  {/* Photo / Icon management (Global) */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E2D7C8] space-y-4">
                    <span className="text-xs font-bold text-[#14532D] font-sans uppercase tracking-wider block">
                      📷 Kairi Portreefoto / Ikooni Haldus (Globaalne)
                    </span>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 border-2 border-[#14532D]/30 shadow-md shrink-0 relative flex items-center justify-center">
                        {testimony.image ? (
                          <img 
                            src={testimony.image} 
                            alt={testimony.person} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="p-2 text-center text-[10px] text-stone-500 font-sans">
                            Vaikimisi foto
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 flex-1 w-full font-sans">
                        <div>
                          <label className="block text-xs font-bold text-stone-800 mb-1">
                            Laadi üles uus foto failist (JPG, PNG, WebP):
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateTestimony({ image: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#14532D] file:text-white hover:file:bg-[#0F3D24] cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Või sisesta pildi otselink / failitee:
                          </label>
                          <input
                            type="text"
                            value={testimony.image || ''}
                            onChange={(e) => updateTestimony({ image: e.target.value })}
                            placeholder="/src/assets/images/kairi_oja_portrait_1791059785550.jpg"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono text-stone-800 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Author & Meta (Grid 3 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Autori / Isiku nimi</label>
                      <input
                        type="text"
                        value={editLang === 'en' ? (enTestimony.person || '') : testimony.person}
                        onChange={(e) => {
                          if (editLang === 'en') {
                            updateEnTestimony({ person: e.target.value });
                          } else {
                            updateTestimony({ person: e.target.value });
                          }
                        }}
                        placeholder="Kairi Oja"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Kuupäev (Globaalne)</label>
                      <input
                        type="text"
                        value={testimony.date || ''}
                        onChange={(e) => updateTestimony({ date: e.target.value })}
                        placeholder="08.03.2025"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono font-bold text-stone-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Tunnistuse kategooria</label>
                      <select
                        value={testimony.type || 'vabanemine'}
                        onChange={(e) => updateTestimony({ type: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 bg-white"
                      >
                        <option value="vabanemine">Vabanemislugu (Deliverance)</option>
                        <option value="tervenemine">Tervenemine (Healing)</option>
                      </select>
                    </div>
                  </div>

                  {/* Facebook Integration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Facebooki lehe veebiaadress (Globaalne)</label>
                      <input
                        type="text"
                        value={testimony.facebookUrl || ''}
                        onChange={(e) => updateTestimony({ facebookUrl: e.target.value })}
                        placeholder="https://www.facebook.com/share/1DUothVLCF/"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-[#14532D] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Facebooki nupu tekst</label>
                      <input
                        type="text"
                        value={editLang === 'en' ? (enTestimony.facebookPageTitle || '') : (testimony.facebookPageTitle || '')}
                        onChange={(e) => {
                          if (editLang === 'en') {
                            updateEnTestimony({ facebookPageTitle: e.target.value });
                          } else {
                            updateTestimony({ facebookPageTitle: e.target.value });
                          }
                        }}
                        placeholder="Saagu Valgus - kas Jumal on reaalne?"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Tunnistuse pealkiri</label>
                      <input
                        type="text"
                        value={editLang === 'en' ? (enTestimony.title || '') : testimony.title}
                        onChange={(e) => {
                          if (editLang === 'en') {
                            updateEnTestimony({ title: e.target.value });
                          } else {
                            updateTestimony({ title: e.target.value });
                          }
                        }}
                        placeholder="Kairi tunnistus – Vabanemine viis aastat kestnud karmist vaimsest sidumisest"
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-base sm:text-lg font-serif font-bold text-stone-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 font-sans mb-1.5">Tunnistuse kokkuvõte / tutvustav tsitaat</label>
                      <textarea
                        rows={3}
                        value={editLang === 'en' ? (enTestimony.summary || '') : testimony.summary}
                        onChange={(e) => {
                          if (editLang === 'en') {
                            updateEnTestimony({ summary: e.target.value });
                          } else {
                            updateTestimony({ summary: e.target.value });
                          }
                        }}
                        placeholder="Elame vaimses maailmas, mis domineerib selle reaalsuse üle..."
                        className="w-full p-4 rounded-xl border border-stone-300 text-base font-serif italic text-stone-800 bg-white"
                      />
                    </div>
                  </div>

                  {/* Full Story Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-800 font-sans">
                        Täismahus tunnistuse tekst (avaneb lehel nupuga)
                      </label>
                      <span className="text-[11px] text-stone-500 font-sans">
                        Lõigud eralda tühja reaga. Piiblitsitaadid ja alapealkirjad vormindatakse automaatselt.
                      </span>
                    </div>
                    <textarea
                      rows={18}
                      value={editLang === 'en' ? (enTestimony.fullStory || '') : testimony.fullStory}
                      onChange={(e) => {
                        if (editLang === 'en') {
                          updateEnTestimony({ fullStory: e.target.value });
                        } else {
                          updateTestimony({ fullStory: e.target.value });
                        }
                      }}
                      placeholder="Sisesta siia täispikk tunnistus..."
                      className="w-full p-4 sm:p-6 rounded-xl border border-stone-300 text-base font-serif leading-relaxed text-stone-900 bg-white"
                    />
                  </div>

                </div>
              );
            })()}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: VARUNDUS & SEADED */}
        {/* ========================================================================= */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-lg text-stone-900">Andmete varundamine ja taastamine</h3>
              <p className="text-xs text-stone-500">Ekspordi või impordi tellimused, ettetellimused, sõnumid ja saidi sisu</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#1a6838]" />
                  <h4 className="font-bold text-sm text-[#144225]">Täielik varundus (JSON)</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Laadi alla terviklik varukoopia fail, mis sisaldab kõiki tellimusi, ettetellimusi, sõnumeid ja sisu seadistusi.
                </p>
                <button
                  onClick={handleExportFullJSON}
              disabled={saveStatus === 'saving'}
                  className="px-4 py-2 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Laadi alla varukoopia</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-700" />
                  <h4 className="font-bold text-sm text-amber-900">Impordi varukoopiast</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Taasta andmed varasemast JSON varukoopia failist.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Vali JSON fail</span>
                  <input type="file" accept=".json" disabled={saveStatus === 'saving'} onChange={handleImportFullJSON} className="hidden" />
                </label>
              </div>

            </div>

            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-xs text-red-700">Taasta esialgsed algandmed</h5>
                <p className="text-[11px] text-stone-500">See taastab kirjastuse algsed tekstid ja raamatud.</p>
              </div>
              <button
                onClick={onResetToDefault}
                className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Taasta vaikimisi sisu</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: KONTO & TURVALISUS (PAROOLI MUUTMINE JA SESSIOON) */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Account Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1a6838] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Admin roll</span>
                    <h4 className="font-bold text-stone-900 text-sm">Peakasutaja / Toimetaja</h4>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <p>• Täielikud õigused tellimuste haldamiseks</p>
                  <p>• Trükiste ja PDF failide haldus</p>
                  <p>• Kodulehe sisu ja raamatute muutmine</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Kirjastuse kontakt</span>
                    <h4 className="font-bold text-stone-900 text-sm">info@saaguvalgus.eu</h4>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <p>• Kirjastuse e-post</p>
                  <p>• Kodulehe päringute sihtkoht</p>
                  <p>• Broneeringute kinnituskirjad</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Turvasessioon</span>
                    <h4 className="font-bold text-emerald-700 text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Aktiivne ja turvaline</span>
                    </h4>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <p>• Parooliga kaitstud ligipääs</p>
                  <p>• Sessioon säilib lehe värskendamisel</p>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="text-red-600 font-bold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Lõpeta sessioon (Logi välja)</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-2xl space-y-5">
              <div className="border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#1a6838]" />
                  <h3 className="font-bold text-lg text-stone-900 font-display">Administraatori parooli muutmine</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Määra uus turvaline parool administraatori töölauale sisselogimiseks. Uus parool salvestatakse koheselt.
                </p>
              </div>

              {pwdChangeStatus === 'success' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Admin parool on edukalt uuendatud ja salvestatud!</span>
                </div>
              )}

              {pwdChangeStatus === 'error' && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>{pwdChangeErrorMsg || 'Viga parooli muutmisel!'}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs sm:text-sm">
                
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Praegune admin parool *</label>
                  <input
                    type={showPasswordChange ? "text" : "password"}
                    required
                    placeholder="Sisesta kehtiv parool (nt admin)"
                    value={currentPwdInput}
                    onChange={(e) => setCurrentPwdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a6838] focus:outline-none bg-stone-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Uus parool *</label>
                    <input
                      type={showPasswordChange ? "text" : "password"}
                      required
                      placeholder="Vähemalt 4 märki"
                      value={newPwdInput}
                      onChange={(e) => setNewPwdInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a6838] focus:outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Korda uut parooli *</label>
                    <input
                      type={showPasswordChange ? "text" : "password"}
                      required
                      placeholder="Korda uut parooli"
                      value={confirmPwdInput}
                      onChange={(e) => setConfirmPwdInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a6838] focus:outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 font-medium">
                    <input
                      type="checkbox"
                      checked={showPasswordChange}
                      onChange={(e) => setShowPasswordChange(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1a6838] focus:ring-[#1a6838]"
                    />
                    <span>Näita sisestatud paroole</span>
                  </label>

                  <span className="text-[11px] text-stone-500 font-medium">
                    🛡️ Parool on salvestatud serverisse ja kehtib kõigis seadmetes
                  </span>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvesta uus parool</span>
                  </button>
                </div>

              </form>
            </div>

            {/* SEO & Google Analytics 4 Configuration */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-2xl space-y-5 text-left">
              <div className="border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#1a6838]" />
                  <h3 className="font-bold text-lg text-stone-900 font-display">SEO & Google Analytics 4 seadistus</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Sisesta oma Google Analytics 4 mõõtmis-ID (Measurement ID) külastatavuse, tellimuste ja allalaadimiste jälgimiseks.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Google Analytics 4 Mõõtmis-ID (Measurement ID)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="nt G-XXXXXXXXXX"
                      value={content.googleAnalyticsId || ''}
                      onChange={(e) => saveContent({ ...content, googleAnalyticsId: e.target.value.trim() })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a6838] focus:outline-none font-mono text-xs text-stone-900 bg-stone-50/50"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {content.googleAnalyticsId ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 mt-1">
                        <Check className="w-3.5 h-3.5" />
                        Google Analytics on aktiivne ({content.googleAnalyticsId})
                      </span>
                    ) : (
                      <span>Sisesta oma Google Analytics 4 ID (kujul G-XXXXXXXXXX). Kui väli on tühi, on analüütika välja lülitatud.</span>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#1a6838]" />
                    <span>Seadistatud automaatsed sündmused (Events):</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-stone-600">
                    <li><strong>Lehevaatamised (page_view)</strong> – esileht, sektsioonid, trükiste aken</li>
                    <li><strong>Raamatute tellimused (purchase_intent)</strong> – raamatu pealkiri, kogus, tüüp</li>
                    <li><strong>Trükiste lugemine & allalaadimine (file_download)</strong> – PDF failide vaatamine</li>
                    <li><strong>Kontaktivormi päringud (generate_lead)</strong> – saadetud sõnumid</li>
                    <li><strong>Päästepalve ja Meie Isa palve kopeerimine (copy_prayer)</strong></li>
                    <li><strong>Keelevahetus (select_language)</strong> – ET / EN</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modal: Lisa tellimus käsitsi */}
      {newOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-300 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#144225] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Lisa uus tellimus või ettetellimus</h3>
              <button onClick={() => setNewOrderModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualOrder} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setManualOrder({ ...manualOrder, type: 'preorder' })}
                  className={`flex-1 py-2 rounded-xl font-bold border text-xs cursor-pointer ${
                    manualOrder.type === 'preorder' 
                      ? 'bg-amber-100 border-amber-400 text-amber-900' 
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  ✨ Ettetellimine
                </button>
                <button
                  type="button"
                  onClick={() => setManualOrder({ ...manualOrder, type: 'order' })}
                  className={`flex-1 py-2 rounded-xl font-bold border text-xs cursor-pointer ${
                    manualOrder.type === 'order' 
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900' 
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  📦 Tavatellimus
                </button>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Raamat</label>
                <select
                  value={manualOrder.bookId}
                  onChange={(e) => setManualOrder({ ...manualOrder, bookId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  {content.books.map(b => (
                    <option key={b.id} value={b.id}>«{b.title}»</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kogus (tk)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={manualOrder.quantity}
                    onChange={(e) => setManualOrder({ ...manualOrder, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Staatus</label>
                  <select
                    value={manualOrder.status}
                    onChange={(e) => setManualOrder({ ...manualOrder, status: e.target.value as OrderItem['status'] })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="uus">Uus</option>
                    <option value="kinnitatud">Kinnitatud</option>
                    <option value="postitatud">Postitatud</option>
                    <option value="täidetud">Täidetud</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Tellija nimi</label>
                <input
                  type="text"
                  required
                  placeholder="Ees- ja perekonnanimi"
                  value={manualOrder.name}
                  onChange={(e) => setManualOrder({ ...manualOrder, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">E-post</label>
                  <input
                    type="email"
                    required
                    placeholder="meil@aadress.ee"
                    value={manualOrder.email}
                    onChange={(e) => setManualOrder({ ...manualOrder, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    placeholder="+372 ..."
                    value={manualOrder.phone}
                    onChange={(e) => setManualOrder({ ...manualOrder, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Aadress või pakiautomaat</label>
                <input
                  type="text"
                  required
                  placeholder="nt Omniva / Smartpost Tallinna Kristiine Keskus"
                  value={manualOrder.address}
                  onChange={(e) => setManualOrder({ ...manualOrder, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Märkused (valikuline)</label>
                <textarea
                  rows={2}
                  placeholder="Lisamärkused või soovid..."
                  value={manualOrder.notes}
                  onChange={(e) => setManualOrder({ ...manualOrder, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm transition-colors cursor-pointer shadow-xs"
              >
                Salvesta tellimus andmebaasi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lisa / Muuda raamatut */}
      {newBookModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-300 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-[#144225] text-white flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-base">Raamatu andmete muutmine</h3>
              <button onClick={() => setNewBookModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Raamatu pealkiri</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Autor / Väljaandja</label>
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kategooria</label>
                  <input
                    type="text"
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Pre-order checkbox & note */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={editingBook.isPreOrder || false}
                    onChange={(e) => setEditingBook({ ...editingBook, isPreOrder: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1a6838] focus:ring-[#1a6838]"
                  />
                  <span>See raamat on ettetellimisel (Pre-order)</span>
                </label>

                {editingBook.isPreOrder && (
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">Ettetellimise lisamärge</label>
                    <input
                      type="text"
                      placeholder="nt Uus trükk ilmumas! Broneeri ette."
                      value={editingBook.preOrderNote || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, preOrderNote: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Tutvustav tekst</label>
                <textarea
                  rows={3}
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Põhipunktid (eraldatud reavahetusega)</label>
                <textarea
                  rows={3}
                  value={editingBook.highlights.join('\n')}
                  onChange={(e) => setEditingBook({ ...editingBook, highlights: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewBookModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-50"
                >
                  Loobu
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveBook(editingBook)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Salvesta raamat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Laadi üles uus PDF trükis */}
      {newPubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-300 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#144225] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Laadi üles uus PDF trükis</h3>
              </div>
              <button 
                onClick={() => setNewPubModalOpen(false)} 
                className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadPublication} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* PDF file input */}
              <div className="p-4 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl text-center space-y-2">
                <FileText className="w-8 h-8 text-[#1a6838] mx-auto opacity-70" />
                <div>
                  <label className="block text-xs font-bold text-stone-700 cursor-pointer">
                    Vali PDF fail arvutist
                  </label>
                  <p className="text-[11px] text-stone-500">Toetatud on .pdf failid (kuni 10 MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewPubData({
                        ...newPubData,
                        file: file,
                        title: newPubData.title || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
                      });
                    }
                  }}
                  className="text-xs text-stone-600 block mx-auto file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1a6838] file:text-white hover:file:bg-[#15542d] cursor-pointer"
                />
                {newPubData.file && (
                  <p className="text-xs font-bold text-[#1a6838]">
                    Valitud fail: {newPubData.file.name} ({(newPubData.file.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Trükise pealkiri *</label>
                <input
                  type="text"
                  required
                  placeholder="nt Saagu Valgus: Tõde ja vabanemine"
                  value={newPubData.title}
                  onChange={(e) => setNewPubData({ ...newPubData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kategooria</label>
                  <input
                    type="text"
                    placeholder="nt Infovoldik, Juhendmaterjal"
                    value={newPubData.category}
                    onChange={(e) => setNewPubData({ ...newPubData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Lehekülgi</label>
                  <input
                    type="number"
                    min="1"
                    value={newPubData.pages}
                    onChange={(e) => setNewPubData({ ...newPubData, pages: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Autori või kirjastuse märge</label>
                <input
                  type="text"
                  value={newPubData.author}
                  onChange={(e) => setNewPubData({ ...newPubData, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Kirjeldus ja tutvustus</label>
                <textarea
                  rows={3}
                  placeholder="Lühike kokkuvõte trükise teemast..."
                  value={newPubData.description}
                  onChange={(e) => setNewPubData({ ...newPubData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPubModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Loobu
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPub}
                  className="flex-1 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingPub ? 'Laadin üles…' : 'Salvesta ja laadi üles'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
