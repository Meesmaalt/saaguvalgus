import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Flame, 
  ShieldAlert, 
  Mail, 
  Check, 
  Copy, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send,
  Lock,
  Unlock,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Server,
  Layers,
  FileCode,
  CheckCircle2,
  X,
  Heart,
  Video,
  Play,
  ShoppingCart,
  CreditCard,
  Building2,
  Share2,
  Edit3,
  Calendar,
  Package,
  FileText,
  Printer,
  Eye,
  EyeOff,
  Key,
  LogOut,
  Shield,
  Globe
} from 'lucide-react';
import { INITIAL_SITE_CONTENT, INITIAL_PUBLICATIONS } from './data';
import { SiteContent, QuestionItem, BookItem, BibleVerse, TestimonialItem, OrderItem, ContactMessage, PublicationItem } from './types';
import { AdminDashboard } from './AdminDashboard';
import { PublicationsModal } from './PublicationsModal';
import { api } from './api';
import { SITE_CONTENT_EN, UI_TRANSLATIONS, Language } from './translations';

const STORAGE_KEY = 'saaguvalgus_site_content_v6';
const ORDERS_STORAGE_KEY = 'saaguvalgus_orders_v2';
const MESSAGES_STORAGE_KEY = 'saaguvalgus_messages_v2';
const PUBLICATIONS_STORAGE_KEY = 'saaguvalgus_publications_v2';
const ADMIN_PASSWORD_KEY = 'saaguvalgus_admin_password_v1';
const ADMIN_SESSION_KEY = 'saaguvalgus_admin_session_v1';
const LANG_STORAGE_KEY = 'saaguvalgus_lang';

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    type: 'preorder',
    bookId: 'saagu-valgus-raamat',
    bookTitle: 'Saagu Valgus: Tõde ja vabanemine',
    quantity: 2,
    name: 'Marek Tamm',
    email: 'marek.tamm@gmail.com',
    phone: '+372 5551 2345',
    address: 'Omniva Tallinna Kristiine Keskus',
    notes: 'Soovin kindlasti esimese trüki eksemplari.',
    status: 'uus',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'ord-102',
    type: 'order',
    bookId: 'laps-ja-jumal',
    bookTitle: 'Laps ja Jumal',
    quantity: 1,
    name: 'Kristiina Kallas',
    email: 'kristiina.kallas@neti.ee',
    phone: '+372 5123 9876',
    address: 'Smartpost Tartu Kaubamaja',
    notes: 'Palun pakkida kingitusena.',
    status: 'kinnitatud',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-201',
    name: 'Andres Kuusk',
    email: 'andres.kuusk@mail.ee',
    message: 'Tere! Kas teie trükiseid ja raamatuid saab tellida ka suuremas koguses kohalikule kogudusele levitamiseks?',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    read: false
  }
];

// Helper to render question text with "new age" in italics as requested
const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(new age)/i);
  return (
    <>
      {parts.map((part, idx) => 
        part.toLowerCase() === 'new age' ? (
          <em key={idx} className="italic font-serif font-bold tracking-normal">new age</em>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
};

// Helper to render author's exact text preserving paragraphs and Bible citations
const renderAuthorParagraphs = (fullText: string) => {
  if (!fullText) return null;
  const paragraphs = fullText.split(/\n\s*\n/);
  return (
    <div className="space-y-4 font-serif text-base leading-relaxed text-[#1e3427]">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();
        const isBibleQuote = 
          trimmed.startsWith('“') || 
          trimmed.startsWith('«') || 
          trimmed.startsWith('"') ||
          trimmed.includes('Piibel') || 
          trimmed.includes('Bible') || 
          trimmed.startsWith('Jeesus ütles') || 
          trimmed.startsWith('Jesus said') ||
          trimmed.startsWith('Ma kutsun täna') ||
          trimmed.startsWith('I call heaven') ||
          trimmed.includes('5. Ms') ||
          trimmed.includes('5.Ms') ||
          trimmed.includes('Deuteronomy') ||
          trimmed.includes('Ilm.') ||
          trimmed.includes('Revelation') ||
          trimmed.includes('2. Kr') ||
          trimmed.includes('2 Corinthians') ||
          trimmed.includes('Rm.') ||
          trimmed.includes('Romans');
        return (
          <p 
            key={idx} 
            className={isBibleQuote ? 'p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-l-4 border-amber-600 text-[#144225] font-semibold italic shadow-2xs text-base leading-relaxed' : ''}
          >
            {renderFormattedText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Official Kirjastus Saagu Valgus Brand Logo
const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className = '' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon: Open Book with Radiant Sun Rays */}
      <svg 
        viewBox="0 0 160 140" 
        className={isSm ? 'w-9 h-8 shrink-0' : isLg ? 'w-20 h-16 shrink-0' : 'w-12 h-10 shrink-0'}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#1a6838" strokeWidth="2.5" strokeLinecap="round">
          <line x1="80" y1="58" x2="80" y2="8" strokeWidth="3" />
          <line x1="72" y1="60" x2="52" y2="18" />
          <line x1="88" y1="60" x2="108" y2="18" />
          <line x1="64" y1="64" x2="32" y2="34" />
          <line x1="96" y1="64" x2="128" y2="34" />
          <line x1="60" y1="70" x2="20" y2="52" />
          <line x1="100" y1="70" x2="140" y2="52" />
        </g>
        
        <path 
          d="M 66 65 A 14 14 0 0 1 94 65" 
          stroke="#8ab897" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />

        <path 
          d="M 22 75 C 48 70, 72 73, 80 82 C 88 73, 112 70, 138 75 L 138 116 C 112 111, 88 114, 80 125 C 72 114, 48 111, 22 116 Z" 
          fill="#144225" 
        />

        <path 
          d="M 25 78 C 50 73, 72 76, 80 84 L 80 123 C 72 115, 50 112, 25 117 Z" 
          fill="#1b5430" 
        />
        <path 
          d="M 135 78 C 110 73, 88 76, 80 84 L 80 123 C 88 115, 110 112, 135 117 Z" 
          fill="#256b3e" 
        />

        <line x1="80" y1="84" x2="80" y2="123" stroke="#8ab897" strokeWidth="2.5" />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <span className={`${isSm ? 'text-base' : isLg ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-bold font-display tracking-tight text-[#144225] leading-none`}>
          Saagu Valgus
        </span>
        <span className={`${isSm ? 'text-[9px]' : isLg ? 'text-sm sm:text-base' : 'text-[11px] sm:text-xs'} uppercase tracking-[0.22em] text-[#1a6838] font-bold mt-1`}>
          Kirjastus • Publishing
        </span>
      </div>
    </div>
  );
};

export default function App() {
  // Language State: 'et' | 'en'
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'et') return saved;
    } catch {}
    return 'et';
  });

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.et;

  // Primary Site Content State
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SITE_CONTENT;
  });

  // Dynamic active content based on language
  const activeContent: SiteContent = lang === 'en' ? SITE_CONTENT_EN : content;

  // Orders State (Persisted in Server)
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  // Contact Messages State (Persisted in Server)
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);

  // Publications (Trükised / PDF) State (Persisted in Server & Shared across all devices)
  const [publications, setPublications] = useState<PublicationItem[]>(INITIAL_PUBLICATIONS);
  const [isPublicationsOpen, setIsPublicationsOpen] = useState(false);

  const [activeCentralQuestion, setActiveCentralQuestion] = useState<string>('noidade-selgeltnagijate-vagi');
  const [activeTractQuestion, setActiveTractQuestion] = useState<string>('igauele-oma-jumal');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPrayer, setCopiedPrayer] = useState(false);
  const [copiedLordPrayer, setCopiedLordPrayer] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingLordPrayer, setIsSpeakingLordPrayer] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Pure Pre-Order Modal State
  const [selectedBookForOrder, setSelectedBookForOrder] = useState<BookItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderData, setOrderData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  // Admin View & Authentication State
  const [isAdminView, setIsAdminView] = useState(() => typeof window !== 'undefined' && window.location.hash === '#admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState(false);
  const [adminAuthErrorMsg, setAdminAuthErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Language switch handler
  const handleSetLanguage = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
  };

  // Sync document title and HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'en'
      ? 'Let There Be Light Publishing | Christian Literature & Evangelistic Resources'
      : 'Kirjastus Saagu Valgus | Vaimulik kirjandus ja evangeelsed materjalid';
  }, [lang]);

  // Fetch initial data from server on startup
  useEffect(() => {
    api.fetchContent().then(setContent).catch(console.error);
    api.fetchPublications().then(setPublications).catch(console.error);
    api.fetchOrders().then(setOrders).catch(console.error);
    api.fetchMessages().then(setMessages).catch(console.error);

    const token = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (token) {
      api.verifySession(token).then((valid) => {
        setIsAdminAuthenticated(valid);
        if (!valid) sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }).catch(() => {
        setIsAdminAuthenticated(false);
      });
    }
  }, []);

  // Sync hash with admin view
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdmin = () => {
    setIsAdminView(true);
    window.location.hash = '#admin';
  };

  const closeAdmin = () => {
    setIsAdminView(false);
    if (window.location.hash === '#admin') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.error('Logout error:', e);
    }
    closeAdmin();
  };

  const handleChangeAdminPassword = async (currentPwd: string, newPwd: string) => {
    try {
      const res = await api.changeAdminPassword(currentPwd, newPwd);
      if (res.success) {
        if (res.token) {
          try {
            sessionStorage.setItem(ADMIN_SESSION_KEY, res.token);
          } catch (e) {
            console.error(e);
          }
        }
        return { success: true };
      }
      return { success: false, error: res.error || 'Parooli muutmine ebaõnnestus' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Ühenduse viga serveriga' };
    }
  };

  // Save content to Server
  const saveContent = (newContent: SiteContent) => {
    setContent(newContent);
    api.saveContent(newContent).catch(err => {
      console.error('Error saving content to server:', err);
    });
  };

  const saveOrders = (newOrders: OrderItem[]) => {
    setOrders(newOrders);
  };

  const saveMessages = (newMessages: ContactMessage[]) => {
    setMessages(newMessages);
  };

  const savePublications = (newPubs: PublicationItem[]) => {
    setPublications(newPubs);
  };

  const handleUploadPublication = async (data: {
    title: string;
    author?: string;
    category?: string;
    description?: string;
    pages?: number;
    fileName?: string;
    fileSize?: string;
    pdfBase64?: string;
    contentPages?: any[];
  }) => {
    const created = await api.uploadPublication(data);
    setPublications(prev => [created, ...prev]);
    return created;
  };

  const handleDeletePublication = async (id: string) => {
    await api.deletePublication(id);
    setPublications(prev => prev.filter(p => p.id !== id));
  };

  // Pre-Order Openers
  const openPreOrderModal = (book?: BookItem) => {
    const targetBook = book || activeContent.books.find(b => b.isPreOrder) || activeContent.books[0];
    setSelectedBookForOrder(targetBook);
    setOrderQuantity(1);
    setOrderData({ name: '', email: '', phone: '', notes: '' });
    setOrderSubmitted(false);
  };

  // Order submission
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForOrder) return;
    try {
      const created = await api.createOrder({
        type: 'preorder',
        bookId: selectedBookForOrder.id,
        bookTitle: selectedBookForOrder.title,
        quantity: orderQuantity,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        notes: orderData.notes,
      });
      setOrders(prev => [created, ...prev]);
      setLastSubmittedId(created.id);
      setOrderSubmitted(true);
    } catch (err: any) {
      console.error('Order creation error, fallback:', err);
      const orderId = 'ord-' + Date.now().toString().slice(-6);
      const newOrd: OrderItem = {
        id: orderId,
        type: 'preorder',
        bookId: selectedBookForOrder.id,
        bookTitle: selectedBookForOrder.title,
        quantity: orderQuantity,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        notes: orderData.notes,
        status: 'uus',
        createdAt: new Date().toISOString()
      };
      setOrders(prev => [newOrd, ...prev]);
      setLastSubmittedId(orderId);
      setOrderSubmitted(true);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    try {
      const created = await api.createMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setMessages(prev => [created, ...prev]);
      setFormSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Message creation error, fallback:', err);
      const msgId = 'msg-' + Date.now().toString().slice(-6);
      const newMsg: ContactMessage = {
        id: msgId,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: new Date().toISOString(),
        read: false
      };
      setMessages(prev => [newMsg, ...prev]);
      setFormSent(true);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Kas oled kindel, et soovid taastada lehe esialgse sisu?')) {
      try {
        const resetContent = await api.resetContent();
        setContent(resetContent);
      } catch (err) {
        saveContent(INITIAL_SITE_CONTENT);
      }
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = adminPasswordInput.trim();
    if (!input) return;

    setIsLoggingIn(true);
    setAdminAuthError(false);
    setAdminAuthErrorMsg('');

    try {
      const res = await api.loginAdmin(input);
      if (res.success) {
        setIsAdminAuthenticated(true);
        setAdminAuthError(false);
        setAdminAuthErrorMsg('');
        if (res.token) {
          try {
            sessionStorage.setItem(ADMIN_SESSION_KEY, res.token);
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        setAdminAuthError(true);
        setAdminAuthErrorMsg(res.error || 'Vale parool!');
      }
    } catch (err: any) {
      setAdminAuthError(true);
      setAdminAuthErrorMsg('Vale parool!');
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(activeContent.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(activeContent.support.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleCopyPrayer = () => {
    navigator.clipboard.writeText(activeContent.salvationPrayerText);
    setCopiedPrayer(true);
    setTimeout(() => setCopiedPrayer(false), 2000);
  };

  const handleCopyLordPrayer = () => {
    navigator.clipboard.writeText(activeContent.lordPrayer.text);
    setCopiedLordPrayer(true);
    setTimeout(() => setCopiedLordPrayer(false), 2000);
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeContent.salvationPrayerText);
        utterance.lang = lang === 'en' ? 'en-US' : 'et-EE';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const toggleSpeechLordPrayer = () => {
    if ('speechSynthesis' in window) {
      if (isSpeakingLordPrayer) {
        window.speechSynthesis.cancel();
        setIsSpeakingLordPrayer(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeContent.lordPrayer.text);
        utterance.lang = lang === 'en' ? 'en-US' : 'et-EE';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeakingLordPrayer(false);
        utterance.onerror = () => setIsSpeakingLordPrayer(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeakingLordPrayer(true);
      }
    }
  };

  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#f1f5f2] flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6 text-center animate-in fade-in duration-150">
            <div className="w-16 h-16 rounded-2xl bg-[#144225] text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display text-[#144225]">{activeContent.brandName}</h2>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">{t.footer.adminLink}</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Admin parool</span>
                  <span className="text-[11px] text-stone-400 font-normal">Turvaline ligipääs</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sisesta administraatori parool"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (adminAuthError) setAdminAuthError(false);
                    }}
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none bg-stone-50/60"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                    title={showPassword ? "Peida parool" : "Näita parooli"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {adminAuthError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5 font-medium">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{adminAuthErrorMsg}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <span>Kontrollin...</span>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Logi administraatorina sisse</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={closeAdmin}
                className="text-xs text-stone-500 hover:text-stone-800 font-bold transition-colors cursor-pointer"
              >
                ← Tagasi avalikule lehele
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminDashboard
        content={content}
        saveContent={saveContent}
        orders={orders}
        saveOrders={saveOrders}
        messages={messages}
        saveMessages={saveMessages}
        publications={publications}
        savePublications={savePublications}
        onUploadPublication={handleUploadPublication}
        onDeletePublication={handleDeletePublication}
        onChangePassword={handleChangeAdminPassword}
        onLogout={handleAdminLogout}
        onClose={closeAdmin}
        onResetToDefault={handleResetToDefault}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#1c2e24] flex flex-col font-sans selection:bg-[#8ab897]/30 selection:text-[#1a6838] relative overflow-x-hidden">
      
      {/* 1. Header & Navigation with Bilingual Language Selector */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#8ab897]/20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          
          <a href="#" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <BrandLogo size="md" />
          </a>

          {/* Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-semibold text-[#2c4c3b]">
            <button onClick={() => scrollTo('kusimused')} className="hover:text-[#1a6838] transition-colors font-bold text-[#144225] cursor-pointer">
              {t.nav.topics}
            </button>
            <button onClick={() => scrollTo('puhas-kodu')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              {t.nav.cleanHome}
            </button>
            <button 
              onClick={() => setIsPublicationsOpen(true)} 
              className="hover:text-[#1a6838] transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-[#144225]"
              title="Ava trükised ja PDF vaatleja"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>{t.nav.publications}</span>
            </button>
            <button onClick={() => scrollTo('tunnistused')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              {t.nav.testimonials}
            </button>
            <button onClick={() => scrollTo('kirjastus')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              {t.nav.books}
            </button>
            <button onClick={() => scrollTo('toetus')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              {t.nav.support}
            </button>
            <button onClick={() => scrollTo('paastepalve')} className="hover:text-[#1a6838] transition-colors cursor-pointer text-[#1a6838]">
              {t.nav.prayer}
            </button>
            <button onClick={() => scrollTo('kontakt')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              {t.nav.contact}
            </button>
          </nav>

          {/* Right Action: Language Switcher & Pre-Order Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Bilingual Selector Button */}
            <div className="flex items-center bg-[#f0f5f1] p-1 rounded-2xl border border-[#8ab897]/40 shadow-inner">
              <button
                onClick={() => handleSetLanguage('et')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  lang === 'et' 
                    ? 'bg-[#1a6838] text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
                title="Eesti keel"
              >
                <span>🇪🇪</span>
                <span>ET</span>
              </button>
              <button
                onClick={() => handleSetLanguage('en')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-[#1a6838] text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
                title="English Language"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <button
              onClick={() => openPreOrderModal()}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title={t.books.preOrder}
            >
              <Package className="w-4 h-4 text-stone-900" />
              <span>{t.books.preOrder}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 bg-gradient-to-b from-[#f4f8f5] via-white to-white border-b border-[#8ab897]/20 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none cross-pattern opacity-30" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a6838]/10 border border-[#1a6838]/20 text-[#1a6838] text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-[#1a6838]" />
              <span>{activeContent.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#144225] tracking-tight leading-tight">
              {activeContent.heroTitle} <span className="text-[#1a6838]">{activeContent.heroHighlight}</span>
            </h1>
          </div>

          {/* 3 Core Questions */}
          <div id="kusimused" className="pt-2 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeContent.centralQuestions.map((q) => {
                const isSelected = activeCentralQuestion === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveCentralQuestion(q.id)}
                    className={`p-5 sm:p-6 rounded-3xl border-2 text-left transition-all flex flex-col justify-between gap-4 group cursor-pointer ${
                      isSelected 
                        ? 'bg-[#1a6838] text-white border-[#1a6838] shadow-lg ring-2 ring-[#1a6838]/25' 
                        : 'bg-white hover:bg-[#f4f8f5] border-[#8ab897]/40 text-[#144225] shadow-xs hover:border-[#1a6838]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-md ${
                        isSelected ? 'bg-amber-400 text-stone-900' : 'bg-red-600 text-white group-hover:scale-105 transition-transform'
                      }`}>
                        ?
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#1a6838]/10 text-[#1a6838]'
                      }`}>
                        {lang === 'en' ? `Question ${q.number}` : `Küsimus ${q.number}`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className={`font-bold font-display text-base sm:text-lg leading-snug line-clamp-3 ${
                        isSelected ? 'text-white' : 'text-[#144225]'
                      }`}>
                        {q.question}
                      </h3>
                      <p className={`text-xs line-clamp-2 leading-relaxed ${
                        isSelected ? 'text-emerald-100' : 'text-[#446752]'
                      }`}>
                        {q.fullText.slice(0, 110)}...
                      </p>
                    </div>

                    <div className={`text-xs font-bold pt-2 border-t flex items-center justify-between ${
                      isSelected ? 'border-white/20 text-amber-300' : 'border-stone-100 text-[#1a6838]'
                    }`}>
                      <span>{lang === 'en' ? 'Read explanation' : 'Loe vastust & tõde'}</span>
                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Question Detail Card */}
            {(() => {
              const current = activeContent.centralQuestions.find(q => q.id === activeCentralQuestion) || activeContent.centralQuestions[0];
              return (
                <div className="bg-white rounded-3xl border-2 border-[#1a6838]/30 p-6 sm:p-10 shadow-md space-y-6">
                  
                  <div className="flex items-start gap-4 pb-4 border-b border-stone-100">
                    <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-900 font-black text-3xl flex items-center justify-center shrink-0 shadow-md">
                      ?
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-[#1a6838] tracking-wider mb-1">
                        {lang === 'en' ? `Core Question ${current.number}` : `Põhiküsimus ${current.number}`}
                      </div>
                      <h4 className="text-xl sm:text-3xl font-bold font-display text-[#144225] leading-tight">
                        {current.question}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-2">
                    {renderAuthorParagraphs(current.fullText)}
                  </div>

                  {/* Bible Verses */}
                  {current.bibleVerses && current.bibleVerses.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-stone-600">
                        {t.questions.biblicalVerses}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {current.bibleVerses.map((verse, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl bg-[#fcfdfc] border border-[#8ab897]/30 shadow-2xs space-y-1">
                            <span className="text-xs sm:text-sm font-bold text-[#1a6838] block">
                              📖 {verse.ref}
                            </span>
                            <p className="text-xs sm:text-sm font-serif italic text-[#314c3e]">
                              «{verse.text}»
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practical steps */}
                  {current.practicalSteps && (
                    <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
                      <h5 className="font-bold text-[#1a6838] text-sm sm:text-base flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-[#1a6838]" />
                        <span>{t.questions.practicalSteps}</span>
                      </h5>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#243d2e]">
                        {current.practicalSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#1a6838] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                            <span className="font-medium">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              );
            })()}

          </div>

          {/* Scripture Bar */}
          <div className="pt-6 border-t border-[#8ab897]/25 space-y-6 max-w-4xl mx-auto">
            
            <div className="p-5 sm:p-6 rounded-3xl bg-[#f4f8f5] border border-[#8ab897]/30 text-center shadow-2xs">
              <p className="text-base sm:text-lg text-[#1e382b] font-serif leading-relaxed italic">
                «{activeContent.heroDescription}»
              </p>
            </div>

            {/* PRIMARY BIBLE SCRIPTURE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#1a6838]/10 to-amber-500/10 border-2 border-[#1a6838]/30 shadow-xs relative">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1a6838] bg-white/90 px-3 py-0.5 rounded-full border border-[#1a6838]/30 shadow-2xs">
                  {lang === 'en' ? 'Core Biblical Scripture' : 'Peamine Piibli tõotus'} • {activeContent.primaryVerse?.ref || 'Joel 2:32'}
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-serif font-bold text-[#144225] italic text-center leading-snug">
                «{activeContent.primaryVerse?.text}»
              </p>
            </div>

            {/* Core Bible Verses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {activeContent.coreVerses.map((v, i) => (
                <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#8ab897]/40 shadow-xs flex flex-col justify-between relative group hover:border-[#1a6838]/60 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#1a6838] uppercase tracking-wider">{v.ref}</span>
                      {v.theme && <span className="text-[11px] text-stone-600 font-bold bg-stone-100 px-2 py-0.5 rounded-md">{v.theme}</span>}
                    </div>
                    <p className="text-sm sm:text-base italic font-serif text-[#1c2e24] leading-relaxed">«{v.text}»</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. Hoia oma kodu puhas (Clean Home) Section */}
      <section id="puhas-kodu" className="py-14 sm:py-20 bg-white border-b border-[#8ab897]/20 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
              {activeContent.cleanlinessSubtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
              {activeContent.cleanlinessTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#41624f] max-w-2xl mx-auto leading-relaxed">
              {activeContent.cleanlinessDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeContent.cleanlinessSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#f4f8f5] border border-[#8ab897]/30 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#1a6838] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold font-display text-[#144225]">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[#2c4938] leading-relaxed font-serif">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Testimonials & Real Stories */}
      <section id="tunnistused" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 z-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
            {t.testimonials.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#144225]">
            {t.testimonials.title}
          </h2>
          <p className="text-sm text-[#41624f]">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeContent.testimonials.map((test) => (
            <div key={test.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    test.type === 'vabanemine' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {test.type === 'vabanemine' ? (lang === 'en' ? 'Deliverance' : 'Vabanemine') : (lang === 'en' ? 'Healing' : 'Tervenemine')}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">{test.person}</span>
                </div>

                <h3 className="text-xl font-bold font-display text-[#144225]">{test.title}</h3>
                
                <p className="text-sm text-[#2d4937] leading-relaxed font-serif">
                  {test.summary}
                </p>

                {test.fullStory && (
                  <div className="p-4 rounded-2xl bg-[#f4f8f5] text-xs sm:text-sm text-[#243d2e] italic leading-relaxed border border-[#8ab897]/20">
                    «{test.fullStory}»
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{lang === 'en' ? 'Share your story:' : 'Jaga oma lugu:'}</span>
                <button
                  onClick={() => scrollTo('kontakt')}
                  className="font-bold text-[#1a6838] hover:underline cursor-pointer"
                >
                  {lang === 'en' ? 'Send your testimony' : 'Saada oma tunnistus'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Publisher & Books Section */}
      <section id="kirjastus" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 z-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#8ab897]/20">
          <div>
            <BrandLogo size="lg" />
            <p className="text-sm text-[#385643] mt-2 max-w-xl">
              {activeContent.brandTagline}
            </p>
          </div>
          <button
            onClick={() => scrollTo('toetus')}
            className="px-5 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-emerald-200" />
            <span>{t.support.badge}</span>
          </button>
        </div>

        {/* Publisher Story */}
        <div className="bg-[#f4f8f5] p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-[#1a6838] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'en' ? 'Story & Vision' : 'Sünnilugu ja visioon'}</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
            {activeContent.publisherStoryTitle}
          </h3>
          <p className="text-sm sm:text-base text-[#2c4938] leading-relaxed font-serif">
            {activeContent.publisherStoryText}
          </p>
        </div>

        {/* Books Cards & Ordering */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
              {t.books.title}
            </h3>
            <span className="text-xs text-[#385643] font-semibold">{t.books.subtitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeContent.books.map((book) => {
              return (
                <div key={book.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between space-y-4 relative group hover:border-[#1a6838]/60 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8ab897] uppercase tracking-wider">{book.category}</span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        <span>{t.books.preOrder}</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">«{book.title}»</h3>
                    <p className="text-xs sm:text-sm text-[#2d4937] leading-relaxed font-serif">{book.description}</p>
                    
                    {book.preOrderNote && (
                      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                        📌 {book.preOrderNote}
                      </div>
                    )}

                    <div className="pt-2 space-y-1 text-xs text-[#3e5e4b]">
                      {book.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[#1a6838] font-bold">•</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs text-stone-500 font-medium">{book.author}</span>
                    
                    <button
                      onClick={() => openPreOrderModal(book)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 text-stone-900" />
                      <span>{t.books.preOrder}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trükised & PDF Vaatleja banner */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#eef6f1] via-white to-[#f4f8f5] border-2 border-[#1a6838]/25 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#144225] text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a6838] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {t.publicationsBanner.badge}
                </span>
                <span className="text-xs text-stone-500 font-medium">{t.publicationsBanner.sub}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
                {t.publicationsBanner.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#2d4937] leading-relaxed max-w-xl">
                {t.publicationsBanner.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsPublicationsOpen(true)}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>{t.publicationsBanner.openBtn}</span>
            </button>
          </div>
        </div>

      </section>

      {/* 6. Support Section */}
      <section id="toetus" className="py-14 sm:py-20 bg-amber-50/70 border-t border-amber-200/60 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-amber-700 fill-amber-700" />
              <span>{activeContent.support.subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              {activeContent.support.title}
            </h2>
            <p className="text-sm text-stone-700 max-w-xl mx-auto font-serif">
              {activeContent.support.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Bank details card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-stone-900">{t.support.bankDetails}</h4>
                  <p className="text-xs text-stone-500">{activeContent.support.explanation}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.recipient}</span>
                    <span className="font-bold text-stone-800 text-sm">{activeContent.support.recipientName}</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.account}</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{activeContent.support.iban}</span>
                  </div>
                  <button
                    onClick={handleCopyIban}
                    className="p-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIban ? t.support.copied : t.support.copyIban}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.bank}</span>
                    <span className="font-semibold text-stone-800">{activeContent.support.bankName}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.explanation}</span>
                    <span className="font-semibold text-stone-800">{activeContent.support.explanation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support goals */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
              <h4 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{lang === 'en' ? 'Where Your Support Goes:' : 'Kuhu sinu toetus läheb?'}</span>
              </h4>

              <div className="space-y-2.5">
                {activeContent.support.supportGoals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-stone-800">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0 text-[10px]">{i + 1}</span>
                    <span>{goal}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-stone-500 italic pt-2">
                {lang === 'en' 
                  ? 'Every donation, large or small, helps bring the Light of the Gospel to thousands.'
                  : 'Iga toetus, olgu väike või suur, on suureks õnnistuseks ja aitab viia evangeeliumi valguse tuhandete inimesteni.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Salvation Prayer & Lord's Prayer Section */}
      <section id="paastepalve" className="py-14 sm:py-20 bg-white border-t border-[#8ab897]/20 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Salvation Prayer */}
          <div className="bg-gradient-to-br from-[#f4f8f5] via-white to-[#eef6f1] p-6 sm:p-10 rounded-3xl border-2 border-[#1a6838]/30 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
                {activeContent.salvationPrayerSubtitle}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
                {activeContent.salvationPrayerTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#385643] italic font-serif">
                {activeContent.salvationPrayerIntro}
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#8ab897]/30 shadow-xs font-serif text-base sm:text-lg leading-relaxed text-[#144225] whitespace-pre-line space-y-4">
              {activeContent.salvationPrayerText}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={toggleSpeech}
                className="px-4 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? (lang === 'en' ? 'Stop audio' : 'Peata heli') : (lang === 'en' ? 'Listen to prayer' : 'Kuula palvet')}</span>
              </button>

              <button
                onClick={handleCopyPrayer}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedPrayer ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrayer ? t.salvation.copied : t.salvation.copyPrayer}</span>
              </button>
            </div>

            {/* Next Steps */}
            <div className="pt-4 border-t border-[#8ab897]/20 space-y-3">
              <h4 className="font-bold text-sm text-[#144225]">
                {t.salvation.nextStepsTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeContent.salvationPrayerNextSteps.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#8ab897]/20 text-xs space-y-1">
                    <span className="font-bold text-[#1a6838] block">{s.title}</span>
                    <p className="text-stone-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lord's Prayer (Meie Isa palve) */}
          <div className="bg-[#fcfdfc] p-6 sm:p-8 rounded-3xl border border-[#8ab897]/40 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#8ab897]/20 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#1a6838] tracking-wider">
                  {t.lordPrayer.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
                  {activeContent.lordPrayer.title}
                </h3>
              </div>
              <button
                onClick={toggleSpeechLordPrayer}
                className="p-2.5 rounded-xl bg-[#1a6838]/10 text-[#1a6838] hover:bg-[#1a6838]/20 transition-colors cursor-pointer"
                title={lang === 'en' ? 'Listen to the Lord\'s Prayer' : 'Kuula Meie Isa palvet'}
              >
                {isSpeakingLordPrayer ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200 font-serif text-base sm:text-lg leading-relaxed text-[#1e3427] whitespace-pre-line italic">
              {activeContent.lordPrayer.text}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>{activeContent.lordPrayer.ref}</span>
              <button
                onClick={handleCopyLordPrayer}
                className="font-bold text-[#1a6838] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedLordPrayer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLordPrayer ? t.salvation.copied : (lang === 'en' ? 'Copy prayer' : 'Kopeeri palve')}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Contact Section */}
      <section id="kontakt" className="py-14 sm:py-20 bg-[#f4f8f5] border-t border-[#8ab897]/20 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
              {t.contact.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
              {t.contact.title}
            </h2>
            <p className="text-sm text-[#41624f]">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Email Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/40 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1a6838]/10 text-[#1a6838] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#144225]">{t.contact.emailTitle}</h4>
                  <p className="text-xs sm:text-sm text-stone-500">{t.contact.emailSub}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#8ab897]/40 flex items-center justify-between">
                <a href={`mailto:${activeContent.contactEmail}`} className="font-mono text-lg sm:text-xl font-bold text-[#1a6838] hover:underline">
                  {activeContent.contactEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-white border border-[#8ab897]/40 text-[#1a6838] hover:bg-[#f4f8f5] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#1a6838]" />}
                </button>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                {t.contact.responseTime}
              </p>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/40 shadow-xs">
              {formSent ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#1a6838]/10 text-[#1a6838] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-[#144225]">{t.contact.formSuccess}</h4>
                  <button 
                    onClick={() => setFormSent(false)} 
                    className="text-sm font-bold text-[#1a6838] underline pt-2 cursor-pointer"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={handleContactSubmit} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-[#144225] mb-1.5">{t.contact.nameLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.contact.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm sm:text-base focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#144225] mb-1.5">{t.contact.emailLabel}</label>
                    <input
                      type="email"
                      required
                      placeholder={t.contact.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm sm:text-base focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#144225] mb-1.5">{t.contact.msgLabel}</label>
                    <textarea
                      rows={3}
                      required
                      placeholder={t.contact.msgPlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm sm:text-base focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.sendBtn}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-white border-t border-[#8ab897]/20 py-10 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#385643]">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>© {new Date().getFullYear()} {activeContent.brandName}. {t.footer.rights}</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 font-semibold justify-center">
            <button onClick={() => scrollTo("kusimused")} className="hover:text-[#1a6838] cursor-pointer">{t.nav.topics}</button>
            <button onClick={() => scrollTo("puhas-kodu")} className="hover:text-[#1a6838] cursor-pointer">{t.nav.cleanHome}</button>
            <button 
              onClick={() => setIsPublicationsOpen(true)} 
              className="hover:text-[#1a6838] font-bold text-[#144225] cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.nav.publications}</span>
            </button>
            <button onClick={() => scrollTo("tunnistused")} className="hover:text-[#1a6838] cursor-pointer">{t.nav.testimonials}</button>
            <button onClick={() => scrollTo("kirjastus")} className="hover:text-[#1a6838] cursor-pointer">{t.nav.books}</button>
            <button onClick={() => scrollTo("toetus")} className="hover:text-[#1a6838] cursor-pointer">{t.nav.support}</button>
            <button onClick={() => scrollTo("paastepalve")} className="hover:text-[#1a6838] cursor-pointer">{t.nav.prayer}</button>
            <button onClick={() => scrollTo("kontakt")} className="hover:text-[#1a6838] cursor-pointer">{t.nav.contact}</button>
            <button 
              onClick={openAdmin} 
              className="hover:text-[#1a6838] flex items-center gap-1.5 bg-[#f4f8f5] px-3 py-1.5 rounded-full border border-[#8ab897]/40 text-[#1a6838] font-bold cursor-pointer transition-colors shadow-2xs"
              title="Admin"
            >
              <Lock className="w-3.5 h-3.5 text-[#1a6838]" />
              <span>{t.footer.adminLink}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Pre-Order Modal */}
      {selectedBookForOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-amber-300 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            
            <div className="px-6 py-4.5 text-white flex items-center justify-between bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 border-b border-amber-900">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-bold text-base leading-tight font-display">
                    {t.orderModal.titlePreOrder}
                  </h3>
                  <p className="text-xs opacity-85">
                    {lang === 'en' ? 'Reserve your copy before printing' : 'Garanteeri endale eksemplar enne trükist ilmumist'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBookForOrder(null)} 
                className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {orderSubmitted ? (
                <div className="text-center py-6 sm:py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm bg-amber-100 text-amber-800">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl sm:text-2xl text-stone-900 font-display">
                      {t.orderModal.successTitle}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      {lang === 'en' ? 'Booking Reference:' : 'Broneeringu kood:'} <span className="font-mono font-bold text-stone-800">#{lastSubmittedId || "ORD-SAV"}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-left text-xs sm:text-sm space-y-1.5">
                    <p className="font-semibold text-stone-900">{lang === 'en' ? 'Summary:' : 'Teie broneeringu kokkuvõte:'}</p>
                    <p className="text-stone-700">• {lang === 'en' ? 'Book' : 'Teos'}: <strong>«{selectedBookForOrder.title}»</strong> ({orderQuantity} {lang === 'en' ? 'pcs' : 'tk'})</p>
                    <p className="text-stone-700">• {lang === 'en' ? 'Name' : 'Tellija'}: {orderData.name}</p>
                    <p className="text-stone-700">• {lang === 'en' ? 'Email' : 'E-post'}: {orderData.email}</p>
                    {orderData.phone && (
                      <p className="text-stone-700">• {lang === 'en' ? 'Phone' : 'Telefon'}: {orderData.phone}</p>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
                    {t.orderModal.successMsg}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedBookForOrder(null)}
                      className="px-8 py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm cursor-pointer shadow-xs transition-colors"
                    >
                      {t.orderModal.close}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4 text-sm">
                  
                  {/* Selected Book card */}
                  <div className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/70 border-amber-300/80">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600 text-white">
                          {t.books.preOrder}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-base truncate">«{selectedBookForOrder.title}»</h4>
                      <p className="text-stone-500 text-xs">{selectedBookForOrder.author} • {selectedBookForOrder.category}</p>
                    </div>

                    <div className="w-full sm:w-auto">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                        {lang === 'en' ? 'Select title:' : 'Vali teine teos:'}
                      </label>
                      <select 
                        value={selectedBookForOrder.id}
                        onChange={(e) => {
                          const found = activeContent.books.find(b => b.id === e.target.value);
                          if (found) {
                            setSelectedBookForOrder(found);
                          }
                        }}
                        className="w-full sm:w-44 text-xs font-medium bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#1a6838] focus:outline-none"
                      >
                        {activeContent.books.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="space-y-0.5">
                      <label className="font-bold text-stone-800 text-xs sm:text-sm block">{t.orderModal.quantity}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 font-bold flex items-center justify-center cursor-pointer text-base shadow-2xs"
                      >
                        -
                      </button>
                      <span className="font-bold text-base w-8 text-center text-stone-800">{orderQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 font-bold flex items-center justify-center cursor-pointer text-base shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <label className="block font-bold text-stone-700 text-xs mb-1">{t.orderModal.name}</label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'en' ? 'First and last name' : 'Ees- ja perekonnanimi'}
                      value={orderData.name}
                      onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 text-xs mb-1">{t.orderModal.email}</label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={orderData.email}
                        onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 text-xs mb-1">{t.orderModal.phone}</label>
                      <input
                        type="tel"
                        required
                        placeholder="+372 ..."
                        value={orderData.phone}
                        onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 text-xs mb-1">
                      {t.orderModal.notes}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t.orderModal.notesPlaceholder}
                      value={orderData.notes}
                      onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-stone-900 font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 bg-amber-500 hover:bg-amber-600"
                  >
                    <Package className="w-4 h-4 text-stone-900" />
                    <span>{t.orderModal.submitPreOrder}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Publications Modal with Language Support */}
      <PublicationsModal
        isOpen={isPublicationsOpen}
        onClose={() => setIsPublicationsOpen(false)}
        publications={publications}
        lang={lang}
      />

    </div>
  );
}
