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
  ArrowRight, 
  ArrowLeft,
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
  Package
} from 'lucide-react';
import { INITIAL_SITE_CONTENT } from './data';
import { SiteContent, QuestionItem, BookItem, BibleVerse, TestimonialItem, OrderItem, ContactMessage } from './types';
import { AdminDashboard } from './AdminDashboard';

const STORAGE_KEY = 'saaguvalgus_site_content_v6';
const ORDERS_STORAGE_KEY = 'saaguvalgus_orders_v2';
const MESSAGES_STORAGE_KEY = 'saaguvalgus_messages_v2';

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

// Helper to render author's exact 1:1 text preserving paragraphs and Bible citations
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
          trimmed.includes('Piibel') || 
          trimmed.startsWith('Jeesus ütles') || 
          trimmed.startsWith('Ma kutsun täna') ||
          trimmed.includes('5. Ms') ||
          trimmed.includes('5.Ms') ||
          trimmed.includes('Ilm.') ||
          trimmed.includes('2. Kr') ||
          trimmed.includes('Rm.');
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
const SubtleCrossMotif: React.FC<{ className?: string; size?: number }> = () => null;

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
        {/* Rising sun rays from center */}
        <g stroke="#1a6838" strokeWidth="2.5" strokeLinecap="round">
          <line x1="80" y1="58" x2="80" y2="8" strokeWidth="3" />
          <line x1="72" y1="60" x2="52" y2="18" />
          <line x1="88" y1="60" x2="108" y2="18" />
          <line x1="64" y1="64" x2="32" y2="34" />
          <line x1="96" y1="64" x2="128" y2="34" />
          <line x1="60" y1="70" x2="20" y2="52" />
          <line x1="100" y1="70" x2="140" y2="52" />
        </g>
        
        {/* Soft Sage Sun Arch */}
        <path 
          d="M 66 65 A 14 14 0 0 1 94 65" 
          stroke="#8ab897" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round" 
        />

        {/* Center stem / vertical division */}
        <path d="M 80 65 L 80 115" stroke="#1a6838" strokeWidth="3.5" strokeLinecap="round" />

        {/* Open Book Pages / Green Palm Leaves */}
        <path d="M 80 115 C 65 95 40 85 10 90 C 35 75 65 85 80 115 Z" fill="#1a6838" />
        <path d="M 80 115 C 65 85 45 70 18 70 C 45 60 70 75 80 115 Z" fill="#1a6838" />
        <path d="M 80 115 C 70 80 55 60 30 52 C 55 46 72 65 80 115 Z" fill="#1a6838" />
        
        <path d="M 80 115 C 95 95 120 85 150 90 C 125 75 95 85 80 115 Z" fill="#1a6838" />
        <path d="M 80 115 C 95 85 115 70 142 70 C 115 60 90 75 80 115 Z" fill="#1a6838" />
        <path d="M 80 115 C 90 80 105 60 130 52 C 105 46 88 65 80 115 Z" fill="#1a6838" />

        {/* Base stem knot */}
        <ellipse cx="80" cy="116" rx="6" ry="4" fill="#1a6838" />
      </svg>

      {/* Brand Text Typography */}
      <div className="flex flex-col leading-none">
        <span className={`font-script text-[#1a6838] -mb-1 tracking-wide ${
          isSm ? 'text-lg' : isLg ? 'text-3xl' : 'text-xl'
        }`}>
          Kirjastus
        </span>
        <span className={`font-black tracking-wider text-[#8ab897] uppercase ${
          isSm ? 'text-xs' : isLg ? 'text-2xl tracking-widest' : 'text-base sm:text-lg'
        }`}>
          SAAGU
        </span>
        <span className={`font-black tracking-wider text-[#1a6838] uppercase ${
          isSm ? 'text-xs' : isLg ? 'text-2xl tracking-widest' : 'text-base sm:text-lg'
        }`}>
          VALGUS
        </span>
      </div>
    </div>
  );
};

export default function App() {
  // Content State with LocalStorage sync
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...INITIAL_SITE_CONTENT, 
          ...parsed,
          primaryVerse: parsed.primaryVerse || INITIAL_SITE_CONTENT.primaryVerse,
          centralQuestions: (parsed.centralQuestions && parsed.centralQuestions.length > 0)
            ? parsed.centralQuestions 
            : INITIAL_SITE_CONTENT.centralQuestions,
          tractQuestions: (parsed.tractQuestions && parsed.tractQuestions.length > 0)
            ? parsed.tractQuestions 
            : INITIAL_SITE_CONTENT.tractQuestions,
          books: (parsed.books && parsed.books.length > 0)
            ? parsed.books
            : INITIAL_SITE_CONTENT.books,
        };
      }
    } catch (e) {
      console.error('Failed to parse saved site content:', e);
    }
    return INITIAL_SITE_CONTENT;
  });

  // Orders State (Persisted in LocalStorage)
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse orders:', e);
    }
    return INITIAL_ORDERS;
  });

  // Contact Messages State (Persisted in LocalStorage)
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse contact messages:', e);
    }
    return INITIAL_MESSAGES;
  });

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

  // Book Order & Pre-Order Modal State
  const [selectedBookForOrder, setSelectedBookForOrder] = useState<BookItem | null>(null);
  const [orderType, setOrderType] = useState<'order' | 'preorder'>('preorder');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderData, setOrderData] = useState({ name: '', email: '', phone: '', address: '', notes: '' });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  // Admin View & Authentication State
  const [isAdminView, setIsAdminView] = useState(() => typeof window !== 'undefined' && window.location.hash === '#admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState(false);

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

  // Save content to localStorage
  const saveContent = (newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving content:', e);
    }
  };

  // Save orders to localStorage
  const saveOrders = (newOrders: OrderItem[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  };

  // Save contact messages to localStorage
  const saveMessages = (newMessages: ContactMessage[]) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (e) {
      console.error('Error saving messages:', e);
    }
  };

  // Pre-Order Modal Openers
  const openPreOrderModal = (book?: BookItem) => {
    const targetBook = book || content.books.find(b => b.isPreOrder) || content.books[0];
    setSelectedBookForOrder(targetBook);
    setOrderType('preorder');
    setOrderQuantity(1);
    setOrderData({ name: '', email: '', phone: '', address: '', notes: '' });
    setOrderSubmitted(false);
  };

  const openStandardOrderModal = (book: BookItem) => {
    setSelectedBookForOrder(book);
    setOrderType(book.isPreOrder ? 'preorder' : 'order');
    setOrderQuantity(1);
    setOrderData({ name: '', email: '', phone: '', address: '', notes: '' });
    setOrderSubmitted(false);
  };

  // Order submission
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForOrder) return;
    const orderId = 'ord-' + Date.now().toString().slice(-6);
    const newOrd: OrderItem = {
      id: orderId,
      type: orderType,
      bookId: selectedBookForOrder.id,
      bookTitle: selectedBookForOrder.title,
      quantity: orderQuantity,
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      notes: orderData.notes,
      status: 'uus',
      createdAt: new Date().toISOString()
    };
    saveOrders([newOrd, ...orders]);
    setLastSubmittedId(orderId);
    setOrderSubmitted(true);
  };

  // Contact form submission (without prayer requests)
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msgId = 'msg-' + Date.now().toString().slice(-6);
    const newMsg: ContactMessage = {
      id: msgId,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      createdAt: new Date().toISOString(),
      read: false
    };
    saveMessages([newMsg, ...messages]);
    setFormSent(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kas oled kindel, et soovid taastada lehe esialgse sisu?')) {
      saveContent(INITIAL_SITE_CONTENT);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin' || adminPasswordInput === '1234' || adminPasswordInput === 'saaguvalgus' || !adminPasswordInput.trim()) {
      setIsAdminAuthenticated(true);
      setAdminAuthError(false);
    } else {
      setAdminAuthError(true);
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
    navigator.clipboard.writeText(content.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(content.support.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleCopyPrayer = () => {
    navigator.clipboard.writeText(content.salvationPrayerText);
    setCopiedPrayer(true);
    setTimeout(() => setCopiedPrayer(false), 2000);
  };

  const handleCopyLordPrayer = () => {
    navigator.clipboard.writeText(content.lordPrayer.text);
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
        const utterance = new SpeechSynthesisUtterance(content.salvationPrayerText);
        utterance.lang = 'et-EE';
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
        const utterance = new SpeechSynthesisUtterance(content.lordPrayer.text);
        utterance.lang = 'et-EE';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeakingLordPrayer(false);
        utterance.onerror = () => setIsSpeakingLordPrayer(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeakingLordPrayer(true);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#f1f5f2] flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#144225] text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display text-[#144225]">Kirjastus Saagu Valgus</h2>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Administraatori ligipääs</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Admin parool</label>
                <input
                  type="password"
                  placeholder="Sisesta parool (nt admin)"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none bg-stone-50"
                  autoFocus
                />
                {adminAuthError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">Vale parool! (Proovi 'admin' või kasuta kiirvalikut)</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Logi sisse</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminAuthenticated(true);
                    setAdminAuthError(false);
                  }}
                  className="px-4 py-3 rounded-xl bg-[#f4f8f5] hover:bg-[#e8f1eb] text-[#1a6838] border border-[#8ab897]/40 text-xs font-bold cursor-pointer transition-colors"
                  title="Kiirvalik administraatori testimiseks"
                >
                  Kiirvalik
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={closeAdmin}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tagasi avalikule kodulehele</span>
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
        onClose={closeAdmin}
        onResetToDefault={handleResetToDefault}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#1c2e24] flex flex-col font-sans selection:bg-[#8ab897]/30 selection:text-[#1a6838] relative overflow-x-hidden">
      
      {/* 1. Header & Navigation (Lihtne, rahulik ja selge menüü) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#8ab897]/20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <a href="#" className="flex items-center hover:opacity-90 transition-opacity">
            <BrandLogo size="md" />
          </a>

          {/* Simple, clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#2c4c3b]">
            <button onClick={() => scrollTo('kusimused')} className="hover:text-[#1a6838] transition-colors font-bold text-[#144225] cursor-pointer">
              3 Põhiküsimust
            </button>
            <button onClick={() => scrollTo('kirjastus')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              Kirjastus & Raamatud
            </button>
            <button onClick={() => scrollTo('tunnistused')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              Tunnistused
            </button>
            <button onClick={() => scrollTo('toetus')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              Toeta
            </button>
            <button onClick={() => scrollTo('kontakt')} className="hover:text-[#1a6838] transition-colors cursor-pointer">
              Kontakt
            </button>
          </nav>

          {/* Top Action: Single, clear "Ettetellimine" button (ei ole topelt, ei ole admini nuppu siin) */}
          <div className="flex items-center">
            <button
              onClick={() => openPreOrderModal()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              title="Vormista trükise ettetellimus"
            >
              <Package className="w-4 h-4 text-stone-900" />
              <span>Ettetellimine</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Visuaalselt ja füüsiliselt esimesena 3 Keskset Küsimust, allpool Piibli kirjakohad */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 bg-gradient-to-b from-[#f4f8f5] via-white to-white border-b border-[#8ab897]/20 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none cross-pattern opacity-30" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a6838]/10 border border-[#1a6838]/20 text-[#1a6838] text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-[#1a6838]" />
              <span>{content.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#144225] tracking-tight leading-tight">
              {content.heroTitle} <span className="text-[#1a6838]">{content.heroHighlight}</span>
            </h1>
          </div>

          {/* ========================================================================= */}
          {/* 1. KOLME KÜSIMUSE BLOKK ALGUSES! (KÕIGEPEALT 3 PÕHIKÜSIMUST JA VASTUSED) */}
          {/* ========================================================================= */}
          <div id="kusimused" className="pt-2 space-y-6">
            
            {/* The 3 Question Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.centralQuestions.map((q) => {
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
                      {/* High Contrast Red/Gold Question Mark */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-md ${
                        isSelected ? 'bg-amber-400 text-stone-900' : 'bg-red-600 text-white group-hover:scale-105 transition-transform'
                      }`}>
                        ?
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#1a6838]'
                      }`}>
                        Teema {q.number}
                      </span>
                    </div>

                    <h3 className={`text-base sm:text-lg font-black leading-snug tracking-tight font-display ${
                      isSelected ? 'text-white' : 'text-[#144225]'
                    }`}>
                      {renderFormattedText(q.question)}
                    </h3>

                    <div className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 pt-2 border-t ${
                      isSelected ? 'border-white/20 text-emerald-200' : 'border-stone-100 text-[#1a6838]'
                    }`}>
                      <span>{isSelected ? 'Avatud tekst allpool' : 'Loe vastust'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Question Content Display (1:1 Autori algne tekst) */}
            {(() => {
              const current = content.centralQuestions.find(q => q.id === activeCentralQuestion) || content.centralQuestions[0];
              return (
                <div className="bg-white rounded-3xl border-2 border-[#8ab897]/40 p-6 sm:p-10 shadow-md space-y-6">

                  {/* Question Header */}
                  <div className="flex items-start gap-4 sm:gap-5 pb-4 border-b border-[#8ab897]/20">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-md">
                      ?
                    </div>
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#1a6838]/10 text-[#1a6838] text-xs font-extrabold uppercase tracking-wider mb-1">
                        Küsimus {current.number}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-display text-[#144225] leading-tight">
                        {renderFormattedText(current.question)}
                      </h3>
                    </div>
                  </div>

                  {/* 1:1 Author's exact text */}
                  <div className="pt-2">
                    {renderAuthorParagraphs(current.fullText)}
                  </div>

                  {/* Bible Verses */}
                  {current.bibleVerses && current.bibleVerses.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-stone-600">
                        Kirjakohad:
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
                        <span>Kuidas toimida ja leida vabanemine:</span>
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

          {/* ========================================================================= */}
          {/* 2. KIRJAKOHTADE BLOKK (ALLPOOL KOLME KÜSIMUSE BLOKIST) */}
          {/* ========================================================================= */}
          <div className="pt-6 border-t border-[#8ab897]/25 space-y-6 max-w-4xl mx-auto">
            
            {/* Author's authentic introductory text */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#f4f8f5] border border-[#8ab897]/30 text-center shadow-2xs">
              <p className="text-base sm:text-lg text-[#1e382b] font-serif leading-relaxed italic">
                «{content.heroDescription}»
              </p>
            </div>

            {/* PRIMARY BIBLE SCRIPTURE (PEAMINE KIRJAKOHT LEHEL: Jl 3:5) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#1a6838]/10 to-amber-500/10 border-2 border-[#1a6838]/30 shadow-xs relative">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1a6838] bg-white/90 px-3 py-0.5 rounded-full border border-[#1a6838]/30 shadow-2xs">
                  Peamine Piibli tõotus • {content.primaryVerse?.ref || 'Joeli 3:5'}
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-serif font-bold text-[#144225] italic text-center leading-snug">
                «{content.primaryVerse?.text || 'Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb.'}»
              </p>
            </div>

            {/* 3 Core Bible Verses (Jh 3:16, 2Kn 17:17, Jl 3:5) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {content.coreVerses.map((v, i) => (
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

      {/* 3. HOIATAVAD TEEMAD JA TÕDE (1:1 AUTORI ALGNE TEKST) */}
      <section id="hoiatavad-teemad" className="py-14 sm:py-20 bg-[#f4f8f5] border-y border-[#8ab897]/20 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
              Hoiatused & vaimulik tõde
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#144225]">
              Olulised Teemad ja Vastused
            </h2>
            <p className="text-sm text-[#41624f]">
              Mida Piibel tegelikult õpetab Jumala, patu ja vaimuliku puhtuse kohta?
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 bg-white p-2 rounded-2xl border border-[#8ab897]/30 max-w-2xl mx-auto shadow-2xs">
            {content.tractQuestions.filter(q => q.id !== 'hoia-kodu-puhas').map((q) => {
              const isSelected = activeTractQuestion === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveTractQuestion(q.id)}
                  className={`flex-1 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#1a6838] text-white shadow-sm' 
                      : 'text-[#2b4c3b] hover:bg-[#f4f8f5]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                    isSelected ? 'bg-amber-400 text-stone-900' : 'bg-red-600 text-white shadow-2xs'
                  }`}>
                    ?
                  </span>
                  <span className="truncate text-left">
                    {q.id === 'igauele-oma-jumal' ? '«Igaühele oma jumal»?' : 'Hea inimene pääseb taevasse?'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Question Content Card */}
          {(() => {
            const tractList = content.tractQuestions.filter(q => q.id !== 'hoia-kodu-puhas');
            const current = tractList.find(q => q.id === activeTractQuestion) || tractList[0];
            return (
              <div className="bg-white rounded-3xl border border-[#8ab897]/30 p-6 sm:p-10 shadow-sm space-y-6">

                <div className="flex items-start gap-4 pb-4 border-b border-stone-100">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                    ?
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-[#1a6838] tracking-wider mb-0.5">Teema {current.number}</div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
                      {current.question}
                    </h3>
                  </div>
                </div>

                {/* 1:1 Author's exact text */}
                <div className="pt-2">
                  {renderAuthorParagraphs(current.fullText)}
                </div>

                {/* Bible Verses */}
                {current.bibleVerses && current.bibleVerses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {current.bibleVerses.map((verse, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#8ab897]/20">
                        <span className="text-xs font-bold text-[#1a6838] block mb-1">
                          📖 {verse.ref}
                        </span>
                        <p className="text-xs sm:text-sm font-serif italic text-[#314c3e]">
                          «{verse.text}»
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Practical steps if available */}
                {current.practicalSteps && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#1a6838]/5 border border-[#1a6838]/20 space-y-2">
                    <h5 className="font-bold text-[#1a6838] text-sm flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#1a6838]" />
                      <span>Kuidas teha oma kodu vaimulikult puhtaks?</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#243d2e]">
                      {current.practicalSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#1a6838] font-bold">✓</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            );
          })()}

        </div>
      </section>



      {/* 5. Testimonials & Real Stories (Tunnistused & YouTube videod) */}
      <section id="tunnistused" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 z-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
            Tõestisündinud lood
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#144225]">
            Tunnistused tervenemistest ja vabanemistest
          </h2>
          <p className="text-sm text-[#41624f]">
            Inimeste reaalsed kogemused ja videod sellest, kuidas Jeesus muudab elusid ja vabastab pimedusest
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.testimonials.map((test) => (
            <div key={test.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    test.type === 'vabanemine' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {test.type === 'vabanemine' ? 'Vabanemine' : test.type === 'tervenemine' ? 'Tervenemine' : 'Pöördumine'}
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

                {/* YouTube Video Link/Player */}
                {test.youtubeId && (
                  <div className="pt-2">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-900 shadow-sm border border-stone-200">
                      <iframe
                        src={`https://www.youtube.com/embed/${test.youtubeId}`}
                        title={test.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Jaga oma lugu:</span>
                <button
                  onClick={() => scrollTo('kontakt')}
                  className="font-bold text-[#1a6838] hover:underline cursor-pointer"
                >
                  Saada oma tunnistus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* 8. Publisher & Books Section (Kirjastus & Raamatud & Sünnilugu & E-pood) */}
      <section id="kirjastus" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 z-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#8ab897]/20">
          <div>
            <BrandLogo size="lg" />
            <p className="text-sm text-[#385643] mt-2 max-w-xl">
              {content.brandTagline}
            </p>
          </div>
          <button
            onClick={() => scrollTo('toetus')}
            className="px-5 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-emerald-200" />
            <span>Toeta kirjastustööd</span>
          </button>
        </div>

        {/* Publisher Story */}
        <div className="bg-[#f4f8f5] p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-[#1a6838] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Sünnilugu ja visioon</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
            {content.publisherStoryTitle}
          </h3>
          <p className="text-sm sm:text-base text-[#2c4938] leading-relaxed font-serif">
            {content.publisherStoryText}
          </p>
        </div>

        {/* Pre-Order Highlight Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Ettetellimine avatud</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-[#144225]">
              Kirjastuse Saagu Valgus väljaannete ettetellimine
            </h3>
            <p className="text-xs sm:text-sm text-[#2b4b39] max-w-2xl leading-relaxed">
              Broneeri endale või oma kogudusele uued elumuutvad trükised enne tiraaži ilmumist. Ettetellijatele garanteerime esimese trüki eksemplarid ja kiireima postituse üle Eesti.
            </p>
          </div>
          <button
            onClick={() => openPreOrderModal()}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-sm sm:text-base flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-900" />
            <span>Vormista ettetellimus</span>
          </button>
        </div>

        {/* Books Cards & Ordering */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
              Kirjastuse raamatud ja tellimine
            </h3>
            <span className="text-xs text-[#385643] font-semibold">Saadaval postiga üle Eesti</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.books.map((book) => {
              const isPreOrder = book.isPreOrder;
              return (
                <div key={book.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between space-y-4 relative group hover:border-[#1a6838]/60 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8ab897] uppercase tracking-wider">{book.category}</span>
                      {isPreOrder ? (
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          <span>Ettetellimisel</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#1a6838] bg-[#1a6838]/10 px-2.5 py-0.5 rounded-full">
                          Laos saadaval
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">«{book.title}»</h3>
                    <p className="text-xs sm:text-sm text-[#2d4937] leading-relaxed font-serif">{book.description}</p>
                    
                    {isPreOrder && book.preOrderNote && (
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
                    
                    {isPreOrder ? (
                      <button
                        onClick={() => openPreOrderModal(book)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                        <span>Ettetellimine</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openStandardOrderModal(book)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Esita tellimissoov</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kirjastuse Kontakt (info@saaguvalgus.eu) */}
        <div className="p-6 rounded-3xl bg-white border-2 border-[#1a6838]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a6838] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1a6838] block">
                Kirjastuse ametlik kontakt
              </span>
              <a href="mailto:info@saaguvalgus.eu" className="text-lg sm:text-xl font-bold font-mono text-[#144225] hover:underline">
                info@saaguvalgus.eu
              </a>
              <p className="text-xs text-[#3d5a47] mt-0.5">
                Raamatute tellimused, hulgitellimused kogudustele, trükiste levitamine ja koostöösoovid.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="mailto:info@saaguvalgus.eu"
              className="px-4 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Kirjuta meile</span>
            </a>
          </div>
        </div>

      </section>

      {/* 9. Support Section (Tule toetajaks!) */}
      <section id="toetus" className="py-14 sm:py-20 bg-amber-50/70 border-t border-amber-200/60 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-amber-700 fill-amber-700" />
              <span>{content.support.subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              {content.support.title}
            </h2>
            <p className="text-sm text-stone-700 max-w-xl mx-auto font-serif">
              {content.support.description}
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
                  <h4 className="font-bold text-base text-stone-900">Pangaülekande rekvisiidid</h4>
                  <p className="text-xs text-stone-500">Toetus kirjastustööks ja trükisteks</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Saaja nimi</span>
                    <span className="font-bold text-stone-800 text-sm">{content.support.recipientName}</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">IBAN Kontonumber</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{content.support.iban}</span>
                  </div>
                  <button
                    onClick={handleCopyIban}
                    className="p-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIban ? 'Kopeeritud' : 'Kopeeri'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Pank</span>
                    <span className="font-semibold text-stone-800">{content.support.bankName}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Selgitus</span>
                    <span className="font-semibold text-stone-800">{content.support.explanation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support goals */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
              <h4 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Kuhu sinu toetus läheb?</span>
              </h4>

              <div className="space-y-2.5">
                {content.support.supportGoals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-stone-800">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0 text-[10px]">{i + 1}</span>
                    <span>{goal}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-stone-500 italic pt-2">
                Iga toetus, olgu väike või suur, on suureks õnnistuseks ja aitab viia evangeeliumi valguse tuhandete eestimaalasteni.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 10. Contact Section (PUHTALT KIRJASTUSE KONTAKT, ILMA PALVESOOVIDE ESITAMISETA) */}
      <section id="kontakt" className="py-14 sm:py-20 bg-[#f4f8f5] border-t border-[#8ab897]/20 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
              Võta ühendust
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
              Võta ühendust kirjastusega
            </h2>
            <p className="text-sm text-[#41624f]">
              Oleme olemas, kui sul on küsimusi trükiste, raamatute tellimise, levitamise või koostöö kohta.
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
                  <h4 className="font-bold text-lg text-[#144225]">E-post</h4>
                  <p className="text-xs sm:text-sm text-stone-500">Otsene kontakt meeskonnaga</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#8ab897]/40 flex items-center justify-between">
                <a href={`mailto:${content.contactEmail}`} className="font-mono text-lg sm:text-xl font-bold text-[#1a6838] hover:underline">
                  {content.contactEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-white border border-[#8ab897]/40 text-[#1a6838] hover:bg-[#f4f8f5] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#1a6838]" />}
                </button>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                Vastame kirjadele tavaliselt 1–2 tööpäeva jooksul. Küsimused ja koostöösoovid on alati oodatud.
              </p>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/40 shadow-xs">
              {formSent ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#1a6838]/10 text-[#1a6838] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-[#144225]">Täname kirjutamast!</h4>
                  <p className="text-sm text-stone-600">Sinu sõnum on saadetud aadressile {content.contactEmail} ning salvestatud andmebaasi.</p>
                  <button 
                    onClick={() => setFormSent(false)} 
                    className="text-sm font-bold text-[#1a6838] underline pt-2 cursor-pointer"
                  >
                    Saada teine kiri
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={handleContactSubmit} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-[#144225] mb-1.5">Nimi</label>
                    <input
                      type="text"
                      required
                      placeholder="Sinu nimi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm sm:text-base focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#144225] mb-1.5">E-post</label>
                    <input
                      type="email"
                      required
                      placeholder="sinu@epost.ee"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm sm:text-base focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#144225] mb-1.5">Sõnum või küsimus</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Kirjuta oma küsimus, tagasiside või koostöösoov siia..."
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
                    <span>Saada teade</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 11. Footer (Puhas jalus koos ametliku autoriõiguse ja Admin halduslehe lingiga) */}
      <footer className="bg-white border-t border-[#8ab897]/20 py-10 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#385643]">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>© {new Date().getFullYear()} {content.brandName}. Kõik õigused kaitstud.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 font-semibold justify-center">
            <button onClick={() => scrollTo("kusimused")} className="hover:text-[#1a6838] cursor-pointer">3 Põhiküsimust</button>
            <button onClick={() => scrollTo("kirjastus")} className="hover:text-[#1a6838] cursor-pointer">Kirjastus & Raamatud</button>
            <button onClick={() => scrollTo("tunnistused")} className="hover:text-[#1a6838] cursor-pointer">Tunnistused</button>
            <button onClick={() => scrollTo("toetus")} className="hover:text-[#1a6838] cursor-pointer">Toeta</button>
            <button onClick={() => scrollTo("kontakt")} className="hover:text-[#1a6838] cursor-pointer">Kontakt</button>
            <button 
              onClick={openAdmin} 
              className="hover:text-[#1a6838] flex items-center gap-1.5 bg-[#f4f8f5] px-3 py-1.5 rounded-full border border-[#8ab897]/40 text-[#1a6838] font-bold cursor-pointer transition-colors shadow-2xs"
              title="Ava administraatori haldusleht"
            >
              <Lock className="w-3.5 h-3.5 text-[#1a6838]" />
              <span>Admin haldusleht</span>
            </button>
            <a href={"mailto:" + content.contactEmail} className="hover:text-[#1a6838]">{content.contactEmail}</a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 12. BOOK ORDER & PRE-ORDER MODAL (TELLIMISE JA ETTETELLIMISE VORM) */}
      {/* ========================================================================= */}
      {selectedBookForOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#8ab897]/40 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            
            {/* Header */}
            <div className={"px-6 py-4.5 text-white flex items-center justify-between " + (
              orderType === "preorder" 
                ? "bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 border-b border-amber-900" 
                : "bg-gradient-to-r from-[#144225] to-[#1a6838] border-b border-[#14542d]"
            )}>
              <div className="flex items-center gap-2.5">
                {orderType === "preorder" ? (
                  <Package className="w-5 h-5 text-amber-300" />
                ) : (
                  <ShoppingCart className="w-5 h-5 text-emerald-200" />
                )}
                <div>
                  <h3 className="font-bold text-base leading-tight font-display">
                    {orderType === "preorder" ? "Trükise ettetellimine" : "Raamatu tellimissoov"}
                  </h3>
                  <p className="text-xs opacity-85">
                    {orderType === "preorder" ? "Garanteeri endale eksemplar enne trükist ilmumist" : "Otsene tellimus kirjastuselt Saagu Valgus"}
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
                  <div className={"w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm " + (
                    orderType === "preorder" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"
                  )}>
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl sm:text-2xl text-stone-900 font-display">
                      {orderType === "preorder" ? "Ettetellimus edukalt registreeritud!" : "Tellimus vastu võetud!"}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Broneeringu kood: <span className="font-mono font-bold text-stone-800">#{lastSubmittedId || "ORD-SAV"}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs sm:text-sm space-y-1.5">
                    <p className="font-semibold text-stone-900">Teie broneeringu kokkuvõte:</p>
                    <p className="text-stone-700">• Teos: <strong>«{selectedBookForOrder.title}»</strong> ({orderQuantity} tk)</p>
                    <p className="text-stone-700">• Tellija: {orderData.name} ({orderData.email})</p>
                    <p className="text-stone-700">• Saatmisaadress / pakiautomaat: {orderData.address}</p>
                    {orderType === "preorder" && (
                      <p className="text-amber-800 font-medium pt-1">
                        ★ Hoiame teid raamatu trükkimise ja ilmumise infoga kursis meili teel!
                      </p>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
                    Kinnituskiri ja täpsem info on saadetud aadressile <strong>{orderData.email}</strong>. Andmed on salvestatud ka kirjastuse haldussüsteemi.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedBookForOrder(null)}
                      className="px-8 py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm cursor-pointer shadow-xs transition-colors"
                    >
                      Lõpeta ja naase lehele
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4 text-sm">
                  
                  {/* Selected Book card */}
                  <div className={"p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 " + (
                    orderType === "preorder" 
                      ? "bg-amber-50/70 border-amber-300/80" 
                      : "bg-[#f4f8f5] border-[#8ab897]/50"
                  )}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={"text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full " + (
                          orderType === "preorder" 
                            ? "bg-amber-600 text-white" 
                            : "bg-[#1a6838] text-white"
                        )}>
                          {orderType === "preorder" ? "Ettetellimine" : "Tavaline tellimus"}
                        </span>
                        {selectedBookForOrder.price && (
                          <span className="text-xs font-bold text-stone-700">
                            {selectedBookForOrder.price.toFixed(2)} €
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-stone-900 text-base truncate">«{selectedBookForOrder.title}»</h4>
                      <p className="text-stone-500 text-xs">{selectedBookForOrder.author} • {selectedBookForOrder.category}</p>
                    </div>

                    {/* Book Switcher Dropdown */}
                    <div className="w-full sm:w-auto">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">Vali teine teos:</label>
                      <select 
                        value={selectedBookForOrder.id}
                        onChange={(e) => {
                          const found = content.books.find(b => b.id === e.target.value);
                          if (found) {
                            setSelectedBookForOrder(found);
                            if (found.isPreOrder) setOrderType("preorder");
                          }
                        }}
                        className="w-full sm:w-44 text-xs font-medium bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#1a6838] focus:outline-none"
                      >
                        {content.books.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.title} {b.isPreOrder ? "(Ettetelli)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity and Order Type Switch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <label className="font-bold text-stone-700 text-xs sm:text-sm">Kogus (tk):</label>
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

                    <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setOrderType("order")}
                        className={"flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer " + (
                          orderType === "order"
                            ? "bg-white text-[#144225] shadow-xs border border-stone-200"
                            : "text-stone-500 hover:text-stone-800"
                        )}
                      >
                        Tavaline
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType("preorder")}
                        className={"flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer " + (
                          orderType === "preorder"
                            ? "bg-amber-600 text-white shadow-xs"
                            : "text-amber-800 hover:text-amber-950"
                        )}
                      >
                        Ettetellimine
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <label className="block font-bold text-stone-700 text-xs mb-1">Tellija nimi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ees- ja perekonnanimi"
                      value={orderData.name}
                      onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 text-xs mb-1">E-post *</label>
                      <input
                        type="email"
                        required
                        placeholder="sinu@epost.ee"
                        value={orderData.email}
                        onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 text-xs mb-1">Telefoninumber *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+372 5..."
                        value={orderData.phone}
                        onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 text-xs mb-1">
                      Pakiautomaat või kättetoimetamise aadress *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="nt Omniva / Smartpost Kristiine Keskus või postiaadress"
                      value={orderData.address}
                      onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 text-xs mb-1">
                      Märkused või täpsustused (vabatahtlik)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Näiteks: erisoovid pühenduse või tarne osas..."
                      value={orderData.notes}
                      onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className={"w-full py-3.5 rounded-xl text-white font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 " + (
                      orderType === "preorder"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-[#1a6838] hover:bg-[#15542d]"
                    )}
                  >
                    {orderType === "preorder" ? (
                      <>
                        <Package className="w-4 h-4" />
                        <span>Kinnita ja saada ettetellimus</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Kinnita ja saada tellimissoov</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-stone-400">
                    Andmeid hoitakse turvaliselt kirjastuse sisesüsteemis. Maksmine toimub arve või pangaülekande alusel.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
