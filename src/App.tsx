import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Mail, 
  Check, 
  Copy, 
  Volume2, 
  VolumeX, 
  Lock, 
  FileText, 
  Eye, 
  EyeOff, 
  Building2, 
  Heart,
  Send,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { INITIAL_SITE_CONTENT, INITIAL_PUBLICATIONS } from './data';
import { SiteContent, BookItem, OrderItem, ContactMessage, PublicationItem } from './types';
import { AdminDashboard } from './AdminDashboard';
import { PublicationsModal } from './PublicationsModal';
import { LegalModal, LegalTab } from './LegalModal';
import { BrandLogo } from './BrandLogo';
import { api } from './api';
import { SITE_CONTENT_EN, UI_TRANSLATIONS, Language } from './translations';

import lapsJaJumalCover from './assets/images/book_laps_ja_jumal_1790963503364.jpg';
import saatanaVangCover from './assets/images/book_saatana_vang_1790963515414.jpg';
import saaguValgusCover from './assets/images/book_saagu_valgus_1790963525251.jpg';
import heroPublisherImage from './assets/images/publisher_hero_image_1790963536689.jpg';

const STORAGE_KEY = 'saaguvalgus_site_content_v6';
const ADMIN_SESSION_KEY = 'saaguvalgus_admin_session_v1';
const LANG_STORAGE_KEY = 'saaguvalgus_lang';

const INITIAL_ORDERS: OrderItem[] = [];

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

// Helper to render text with italicized "new age"
const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(new age)/i);
  return (
    <>
      {parts.map((part, idx) => 
        part.toLowerCase() === 'new age' ? (
          <em key={idx} className="italic font-serif font-semibold text-[#14532D]">new age</em>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
};

// Helper for author prose paragraphs
const renderAuthorParagraphs = (fullText: string) => {
  if (!fullText) return null;
  const paragraphs = fullText.split(/\n\s*\n/);
  return (
    <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-[#292524]">
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
            className={isBibleQuote ? 'p-5 sm:p-6 rounded-2xl bg-[#F5F0E6] border-l-4 border-[#14532D] text-[#14532D] font-serif font-semibold italic text-base sm:text-lg leading-relaxed shadow-2xs my-4' : ''}
          >
            {renderFormattedText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Map book ID to its respective cover image
const getBookCoverImage = (id: string) => {
  if (id === 'laps-ja-jumal') return lapsJaJumalCover;
  if (id === 'ma-olin-saatana-vang') return saatanaVangCover;
  return saaguValgusCover;
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'et') return saved;
    } catch {}
    return 'et';
  });

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.et;

  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SITE_CONTENT;
  });

  const activeContent: SiteContent = lang === 'en' ? SITE_CONTENT_EN : content;

  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const [publications, setPublications] = useState<PublicationItem[]>(INITIAL_PUBLICATIONS);
  const [isPublicationsOpen, setIsPublicationsOpen] = useState(false);

  // Legal Modal State (Privaatsuspoliitika, Müügitingimused jne)
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  const openLegalModal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Strictly 3 Põhiküsimust
  const [activeCentralQuestion, setActiveCentralQuestion] = useState<string>('noidade-selgeltnagijate-vagi');

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPrayer, setCopiedPrayer] = useState(false);
  const [copiedLordPrayer, setCopiedLordPrayer] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingLordPrayer, setIsSpeakingLordPrayer] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [isAdminView, setIsAdminView] = useState(() => typeof window !== 'undefined' && window.location.hash === '#admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState(false);
  const [adminAuthErrorMsg, setAdminAuthErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSetLanguage = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'en'
      ? 'Let There Be Light Publishing | Christian Literature & Evangelistic Resources'
      : 'Kirjastus Saagu Valgus | Vaimulik kirjandus ja evangeelsed materjalid';
  }, [lang]);

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

  const saveContent = (newContent: SiteContent) => {
    setContent(newContent);
    api.saveContent(newContent).catch(err => {
      console.error('Error saving content:', err);
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
        <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7E0D5] p-8 sm:p-10 shadow-lg max-w-md w-full space-y-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#14532D] text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6 text-amber-300" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display text-[#1C1917]">{activeContent.brandName}</h2>
              <p className="text-xs text-stone-500 uppercase tracking-widest font-sans">{t.footer.adminLink}</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Admin parool</span>
                  <span className="text-[11px] text-stone-400">Turvaline sisselogimine</span>
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
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-[#E7E0D5] text-sm focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-[#FAF7F2]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {adminAuthError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {adminAuthErrorMsg}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <span>Kontrollin...</span> : <span>Logi administraatorina sisse</span>}
              </button>
            </form>

            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={closeAdmin}
                className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans selection:bg-[#14532D]/15 selection:text-[#14532D] relative overflow-x-hidden">
      
      {/* Top Bar with Official Brand Logo */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7E0D5] shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Zone 1: Official Brand Logo */}
          <a href="#" className="flex items-center hover:opacity-90 transition-opacity">
            <BrandLogo size="md" />
          </a>

          {/* Zone 2: Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-700">
            <button onClick={() => scrollTo('tunnistused')} className="hover:text-[#14532D] transition-colors cursor-pointer">
              {t.nav.testimonials}
            </button>
            <button onClick={() => scrollTo('kirjastus')} className="hover:text-[#14532D] transition-colors cursor-pointer">
              {t.nav.books}
            </button>
            <button 
              onClick={() => setIsPublicationsOpen(true)} 
              className="hover:text-[#14532D] font-bold text-[#14532D] transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-[#14532D]" />
              <span>{t.nav.publications}</span>
            </button>
            <button onClick={() => scrollTo('toetus')} className="hover:text-[#14532D] transition-colors cursor-pointer">
              {t.nav.support}
            </button>
            <button onClick={() => scrollTo('paastepalve')} className="hover:text-[#14532D] font-bold text-[#14532D] transition-colors cursor-pointer">
              {t.nav.prayer}
            </button>
            <button onClick={() => scrollTo('kontakt')} className="hover:text-[#14532D] transition-colors cursor-pointer">
              {t.nav.contact}
            </button>
          </nav>

          {/* Zone 3: Language & PDF Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center text-xs font-semibold text-stone-600 border border-[#E2D7C8] rounded-lg p-0.5 bg-white">
              <button
                onClick={() => handleSetLanguage('et')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  lang === 'et' ? 'bg-[#14532D] text-white font-bold' : 'hover:text-stone-900'
                }`}
              >
                ET
              </button>
              <button
                onClick={() => handleSetLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-[#14532D] text-white font-bold' : 'hover:text-stone-900'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsPublicationsOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#14532D] hover:bg-[#0F3D24] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.nav.publications}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section WITH 3 PÕHIKÜSIMUST FRONT & CENTER */}
      <section id="kusimused" className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-[#E7E0D5] bg-[#FAF7F2] paper-grain">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-semibold tracking-widest text-[#9A3412] uppercase font-sans">
              Kirjastus Saagu Valgus
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1C1917] tracking-tight leading-[1.12]">
              {activeContent.heroTitle} <span className="text-[#14532D] italic">{activeContent.heroHighlight}</span>
            </h1>

            <p className="text-base sm:text-lg font-serif text-[#292524] leading-relaxed italic max-w-2xl mx-auto">
              «{activeContent.heroDescription}»
            </p>
          </div>

          {/* ========================================================================= */}
          {/* THE 3 CORE QUESTIONS (3 PÕHIKÜSIMUST) COMFORTABLY VISIBLE FRONT AND CENTER */}
          {/* ========================================================================= */}
          <div className="space-y-6 pt-2">
            
            <div className="flex items-center justify-between border-b border-[#E2D7C8] pb-3">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                3 Põhiküsimust
              </h2>
              <span className="text-xs font-semibold text-stone-500 font-sans">
                {lang === 'en' ? 'Select question to read answer:' : 'Vali küsimus vastuse lugemiseks:'}
              </span>
            </div>

            {/* The 3 Question Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeContent.centralQuestions.map((q) => {
                const isSelected = activeCentralQuestion === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveCentralQuestion(q.id)}
                    className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected 
                        ? 'bg-[#14532D] text-white border-[#14532D] shadow-md' 
                        : 'bg-white hover:bg-[#F5F0E6] border-[#E7E0D5] text-[#1C1917] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className={`font-mono font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-[#9A3412]'}`}>
                        0{q.number}.
                      </span>
                      <span className={isSelected ? 'text-emerald-200' : 'text-stone-500'}>
                        {lang === 'en' ? 'Core Question' : 'Põhiküsimus'}
                      </span>
                    </div>

                    <h3 className={`font-serif font-bold text-base sm:text-lg leading-snug ${isSelected ? 'text-white' : 'text-[#1C1917]'}`}>
                      {q.question}
                    </h3>

                    <div className={`text-xs font-semibold pt-2 border-t flex items-center justify-between ${
                      isSelected ? 'border-emerald-800 text-amber-300' : 'border-[#E2D7C8] text-[#14532D]'
                    }`}>
                      <span>{lang === 'en' ? 'Read full answer' : 'Loe vastust & tõde'}</span>
                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Full Answer Reader for Selected Question */}
            {(() => {
              const current = activeContent.centralQuestions.find(q => q.id === activeCentralQuestion) || activeContent.centralQuestions[0];
              return (
                <div className="bg-white rounded-3xl border border-[#E2D7C8] p-6 sm:p-10 shadow-sm space-y-8 text-left">
                  
                  <div className="border-b border-[#E2D7C8] pb-6 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-stone-500 font-sans">
                      <span className="font-mono font-bold text-[#9A3412] text-sm">Põhiküsimus 0{current.number}.</span>
                      <span>{lang === 'en' ? 'Spiritual Truth' : 'Vaimulik tõde & Piibellik vastus'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C1917] leading-tight">
                      {current.question}
                    </h3>
                  </div>

                  {/* Author Prose */}
                  <div>
                    {renderAuthorParagraphs(current.fullText)}
                  </div>

                  {/* Scripture Verses */}
                  {current.bibleVerses && current.bibleVerses.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-[#E2D7C8]">
                      <h5 className="font-sans font-bold text-xs uppercase tracking-widest text-[#14532D]">
                        {t.questions.biblicalVerses}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {current.bibleVerses.map((verse, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D5] shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-[#14532D] font-sans block">
                              📖 {verse.ref}
                            </span>
                            <p className="text-sm font-serif italic text-stone-800">
                              «{verse.text}»
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practical Steps */}
                  {current.practicalSteps && (
                    <div className="p-6 rounded-2xl bg-[#F5F0E6] border border-[#E2D7C8] space-y-3">
                      <h5 className="font-sans font-bold text-[#14532D] text-sm sm:text-base flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-[#14532D]" />
                        <span>{t.questions.practicalSteps}</span>
                      </h5>
                      <ul className="space-y-2 text-sm font-serif text-stone-800">
                        {current.practicalSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="font-sans font-bold text-[#14532D] text-xs mt-0.5">0{i+1}.</span>
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

          {/* Primary Scripture & Photo Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-[#E7E0D5] items-center">
            
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="p-6 rounded-2xl bg-[#F5F0E6] border border-[#E2D7C8] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] font-sans block">
                  📖 {activeContent.primaryVerse?.ref || 'Joel 2:32'}
                </span>
                <p className="text-xl sm:text-2xl font-serif font-semibold text-[#1C1917]">
                  «{activeContent.primaryVerse?.text}»
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeContent.coreVerses.slice(1).map((v, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-[#E7E0D5] shadow-2xs space-y-1">
                    <span className="font-bold text-[#14532D] text-xs font-sans">{v.ref}</span>
                    <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
                      «{v.text}»
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#E2D7C8] shadow-sm bg-white p-2">
                <img
                  src={heroPublisherImage}
                  alt="Holy Bible on warm wooden desk"
                  className="w-full h-auto object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Clean Home Section */}
      <section id="puhas-kodu" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E7E0D5] paper-grain">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#9A3412] font-sans">
              {activeContent.cleanlinessSubtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
              {activeContent.cleanlinessTitle}
            </h2>
            <p className="text-sm sm:text-base font-serif text-stone-700 leading-relaxed">
              {activeContent.cleanlinessDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeContent.cleanlinessSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E7E0D5] shadow-2xs space-y-3 flex flex-col justify-between text-left">
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold text-[#9A3412] uppercase tracking-wider block">
                    {lang === 'en' ? `Step 0${idx + 1}` : `Samm 0${idx + 1}`}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1C1917]">{step.title}</h3>
                  <p className="text-sm font-serif text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="tunnistused" className="py-16 sm:py-20 bg-white border-b border-[#E7E0D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#14532D] font-sans">
              {t.testimonials.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
              {t.testimonials.title}
            </h2>
            <p className="text-sm sm:text-base font-serif text-stone-600">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeContent.testimonials.map((test) => (
              <div key={test.id} className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#E2D7C8] shadow-2xs flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-sans">
                    <span className="font-bold uppercase tracking-wider text-[#9A3412]">
                      {test.type === 'vabanemine' ? (lang === 'en' ? 'Deliverance' : 'Vabanemine') : (lang === 'en' ? 'Healing' : 'Tervenemine')}
                    </span>
                    <span>{test.person}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#1C1917] leading-snug">{test.title}</h3>
                  
                  <p className="text-base font-serif text-stone-800 leading-relaxed italic">
                    «{test.summary}»
                  </p>

                  {test.fullStory && (
                    <p className="text-sm font-serif text-stone-700 leading-relaxed">
                      {test.fullStory}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Share Testimony Callout */}
          <div className="p-8 rounded-2xl bg-[#F5F0E6] border border-[#E2D7C8] text-center max-w-2xl mx-auto space-y-3">
            <h4 className="text-xl font-serif font-bold text-[#1C1917]">
              {lang === 'en' ? 'Do you have a testimony of God\'s grace?' : 'Kas sul on oma lugu elava Jumala tööst?'}
            </h4>
            <p className="text-sm font-serif text-stone-700 leading-relaxed">
              {lang === 'en'
                ? 'Share how God has touched your life to encourage others and bear witness to the truth.'
                : 'Kirjuta kirjastusele ja jaga oma tunnistust teiste inimeste julgustuseks ning tõe tunnistuseks.'}
            </p>
            <button
              onClick={() => scrollTo('kontakt')}
              className="px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Send your testimony' : 'Saada oma tunnistus'}
            </button>
          </div>

        </div>
      </section>

      {/* Books & Publisher Section */}
      <section id="kirjastus" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E7E0D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Publisher Story */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E0D5] shadow-xs space-y-4 max-w-4xl mx-auto text-left">
            <span className="text-xs font-bold text-[#14532D] uppercase tracking-widest font-sans">
              Kirjastuse Saagu Valgus Missioon
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
              {activeContent.publisherStoryTitle}
            </h3>
            <p className="text-base sm:text-lg font-serif text-stone-700 leading-relaxed">
              {activeContent.publisherStoryText}
            </p>
          </div>

          {/* Books Grid */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                Kirjastuse Raamatud
              </h3>
              <p className="text-sm font-serif text-stone-600">Vaimulik kirjandus ja teosed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeContent.books.map((book) => {
                const coverImg = getBookCoverImage(book.id);
                return (
                  <div key={book.id} className="bg-white rounded-3xl border border-[#E7E0D5] p-6 shadow-xs flex flex-col justify-between space-y-6">
                    
                    <div className="space-y-4">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E2D7C8] shadow-sm relative">
                        <img
                          src={coverImg}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <span className="text-xs text-stone-500 font-sans block">{book.category}</span>
                        <h4 className="text-xl font-serif font-bold text-[#1C1917]">«{book.title}»</h4>
                        <p className="text-xs text-stone-500 font-sans">{book.author}</p>
                      </div>

                      <p className="text-sm font-serif text-stone-700 leading-relaxed text-left">
                        {book.description}
                      </p>

                      <div className="space-y-1 text-xs text-stone-600 font-serif text-left pt-2 border-t border-stone-100">
                        {book.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[#14532D] font-bold">•</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPublicationsOpen(true)}
                      className="w-full py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-amber-300" />
                      <span>{lang === 'en' ? 'View Literature (PDF)' : 'Loe trükist (PDF)'}</span>
                    </button>

                  </div>
                );
              })}
            </div>
          </div>

          {/* PDF Viewer Banner */}
          <div className="p-8 rounded-3xl bg-white border border-[#E7E0D5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-[#14532D] uppercase tracking-widest font-sans">
                {t.publicationsBanner.badge}
              </span>
              <h4 className="text-2xl font-serif font-bold text-[#1C1917]">
                {t.publicationsBanner.title}
              </h4>
              <p className="text-sm font-serif text-stone-600 max-w-xl">
                {t.publicationsBanner.desc}
              </p>
            </div>

            <button
              onClick={() => setIsPublicationsOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{t.publicationsBanner.openBtn}</span>
            </button>
          </div>

        </div>
      </section>

      {/* Support Section WITH RECIPIENT SET TO Saagu Valgus OÜ */}
      <section id="toetus" className="py-16 sm:py-20 bg-[#F5F0E6] border-b border-[#E2D7C8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl font-serif font-bold text-[#14532D] leading-relaxed italic border-y border-[#E2D7C8] py-3 bg-white/60 rounded-2xl shadow-2xs">
              «Kui see lehekülg on olnud Sulle õnnistuseks, saad selle toimimist toetada siin:»
            </p>

            <span className="text-xs uppercase tracking-widest font-bold text-[#9A3412] font-sans block pt-2">
              {activeContent.support.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
              {activeContent.support.title}
            </h2>
            <p className="text-sm sm:text-base font-serif text-stone-700 leading-relaxed">
              {activeContent.support.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Bank details */}
            <div className="bg-white p-8 rounded-3xl border border-[#E7E0D5] shadow-2xs space-y-4 text-left">
              <h4 className="font-serif font-bold text-lg text-[#1C1917]">{t.support.bankDetails}</h4>

              <div className="space-y-3 text-xs font-sans">
                {/* RECIPIENT NAME: Saagu Valgus OÜ */}
                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E0D5]">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.recipient}</span>
                  <span className="font-bold text-stone-900 text-sm">Saagu Valgus OÜ</span>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E0D5] flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.account}</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{activeContent.support.iban}</span>
                  </div>
                  <button
                    onClick={handleCopyIban}
                    className="p-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold cursor-pointer"
                  >
                    {copiedIban ? t.support.copied : t.support.copyIban}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E0D5]">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.bank}</span>
                    <span className="font-semibold text-stone-800">{activeContent.support.bankName}</span>
                  </div>
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E0D5]">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.support.explanation}</span>
                    <span className="font-semibold text-stone-800">{activeContent.support.explanation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support goals */}
            <div className="bg-white p-8 rounded-3xl border border-[#E7E0D5] shadow-2xs space-y-4 text-left">
              <h4 className="font-serif font-bold text-lg text-[#1C1917]">
                {lang === 'en' ? 'Where Your Support Goes:' : 'Kuhu sinu toetus läheb?'}
              </h4>

              <div className="space-y-3">
                {activeContent.support.supportGoals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7E0D5] text-xs sm:text-sm font-serif text-stone-800">
                    <span className="font-mono font-bold text-[#14532D] text-xs mt-0.5">0{i + 1}.</span>
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Salvation & Lord's Prayer Section */}
      <section id="paastepalve" className="py-16 sm:py-20 bg-white border-b border-[#E7E0D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Salvation Prayer */}
          <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#E2D7C8] shadow-xs space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#14532D] font-sans">
                {activeContent.salvationPrayerSubtitle}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                {activeContent.salvationPrayerTitle}
              </h2>
              <p className="text-sm font-serif text-stone-600 italic">
                {activeContent.salvationPrayerIntro}
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#E7E0D5] font-serif text-base sm:text-lg leading-relaxed text-[#1C1917] whitespace-pre-line text-left">
              {activeContent.salvationPrayerText}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={toggleSpeech}
                className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? (lang === 'en' ? 'Stop audio' : 'Peata heli') : (lang === 'en' ? 'Listen to prayer' : 'Kuula palvet')}</span>
              </button>

              <button
                onClick={handleCopyPrayer}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-[#E7E0D5] text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {copiedPrayer ? t.salvation.copied : t.salvation.copyPrayer}
              </button>
            </div>

            {/* Next Steps */}
            <div className="pt-6 border-t border-[#E2D7C8] space-y-3 text-left">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#14532D]">
                {t.salvation.nextStepsTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeContent.salvationPrayerNextSteps.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-[#E7E0D5] text-xs space-y-1">
                    <span className="font-bold text-[#14532D] block font-sans">{s.title}</span>
                    <p className="text-stone-600 font-serif leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lord's Prayer */}
          <div className="bg-[#F5F0E6] p-8 sm:p-10 rounded-3xl border border-[#E2D7C8] space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2D7C8] pb-4">
              <div className="text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-[#14532D] font-sans">
                  {t.lordPrayer.badge}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
                  {activeContent.lordPrayer.title}
                </h3>
              </div>
              <button
                onClick={toggleSpeechLordPrayer}
                className="p-3 rounded-xl bg-white text-[#14532D] hover:bg-stone-50 transition-colors cursor-pointer border border-[#E2D7C8]"
              >
                {isSpeakingLordPrayer ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#E7E0D5] font-serif text-lg leading-relaxed text-[#1C1917] whitespace-pre-line italic text-left">
              {activeContent.lordPrayer.text}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 font-sans">
              <span>{activeContent.lordPrayer.ref}</span>
              <button
                onClick={handleCopyLordPrayer}
                className="font-bold text-[#14532D] hover:underline cursor-pointer"
              >
                {copiedLordPrayer ? t.salvation.copied : (lang === 'en' ? 'Copy prayer' : 'Kopeeri palve')}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#14532D] font-sans">
              {t.contact.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
              {t.contact.title}
            </h2>
            <p className="text-sm font-serif text-stone-600">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <div className="bg-white p-8 rounded-3xl border border-[#E7E0D5] shadow-2xs space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#1C1917]">{t.contact.emailTitle}</h4>
                  <p className="text-xs text-stone-500 font-sans">{t.contact.emailSub}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D5] flex items-center justify-between">
                <a href={`mailto:${activeContent.contactEmail}`} className="font-mono text-base font-bold text-[#14532D] hover:underline">
                  {activeContent.contactEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white border border-[#E7E0D5] text-[#14532D] hover:bg-stone-50 text-xs font-bold cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs font-serif text-stone-600 leading-relaxed">
                {t.contact.responseTime}
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E7E0D5] shadow-2xs text-left">
              {formSent ? (
                <div className="text-center py-8 space-y-3">
                  <h4 className="font-serif font-bold text-xl text-[#1C1917]">{t.contact.formSuccess}</h4>
                  <button 
                    onClick={() => setFormSent(false)} 
                    className="text-xs font-sans font-bold text-[#14532D] underline pt-2 cursor-pointer"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 font-sans mb-1">{t.contact.nameLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.contact.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E0D5] text-sm focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 font-sans mb-1">{t.contact.emailLabel}</label>
                    <input
                      type="email"
                      required
                      placeholder={t.contact.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E0D5] text-sm focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 font-sans mb-1">{t.contact.msgLabel}</label>
                    <textarea
                      rows={3}
                      required
                      placeholder={t.contact.msgPlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E0D5] text-sm focus:ring-2 focus:ring-[#14532D] focus:outline-none bg-[#FAF7F2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
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

      {/* Footer with Merchant Compliance & Legal Links */}
      <footer className="bg-white border-t border-[#E7E0D5] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-600 font-sans">
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <BrandLogo size="sm" />
              <div className="text-left space-y-0.5 border-l border-stone-200 pl-4">
                <span className="font-bold text-stone-900 block font-serif">Saagu Valgus OÜ</span>
                <span>Reg. kood: 16842102 · info@saaguvalgus.eu</span>
                <span className="block text-[11px] text-stone-500">© {new Date().getFullYear()}. Kõik õigused kaitstud.</span>
              </div>
            </div>

            {/* Legal & Compliance Footer Links for Bank Links / Payment Providers */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button 
                onClick={() => openLegalModal('privacy')} 
                className="hover:text-[#14532D] underline cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#14532D]" />
                <span>Privaatsuspoliitika</span>
              </button>

              <span>·</span>

              <button 
                onClick={() => openLegalModal('terms')} 
                className="hover:text-[#14532D] underline cursor-pointer flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-[#14532D]" />
                <span>Müügi- ja kasutustingimused</span>
              </button>

              <span>·</span>

              <button 
                onClick={() => openLegalModal('delivery')} 
                className="hover:text-[#14532D] underline cursor-pointer flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#14532D]" />
                <span>Makseviisid & Tarne</span>
              </button>
            </div>

            {/* Navigation & Admin Link */}
            <div className="flex items-center gap-4 font-semibold">
              <button 
                onClick={openAdmin} 
                className="hover:text-[#14532D] cursor-pointer border border-[#E7E0D5] px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-xs"
              >
                {t.footer.adminLink}
              </button>
            </div>

          </div>

        </div>
      </footer>

      {/* Publications Modal */}
      <PublicationsModal
        isOpen={isPublicationsOpen}
        onClose={() => setIsPublicationsOpen(false)}
        publications={publications}
        lang={lang}
      />

      {/* Merchant Compliance Legal Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

    </div>
  );
}
