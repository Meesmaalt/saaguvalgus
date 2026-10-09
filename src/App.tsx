import React, { useState, useEffect, useRef } from 'react';
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
  CreditCard,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  DollarSign,
  Menu,
  X
} from 'lucide-react';
import { INITIAL_SITE_CONTENT, INITIAL_PUBLICATIONS } from './data';
import { SiteContent, BookItem, OrderItem, ContactMessage, PublicationItem } from './types';
import { AdminDashboard } from './AdminDashboard';
import { PublicationsModal } from './PublicationsModal';
import { LegalModal, LegalTab } from './LegalModal';
import { BrandLogo } from './BrandLogo';
import { api } from './api';
import { SITE_CONTENT_EN, UI_TRANSLATIONS, Language } from './translations';
import { initGA, analytics } from './analytics';

import lapsJaJumalCover from './assets/images/book_laps_ja_jumal_1790963503364.jpg';
import saatanaVangCover from './assets/images/book_saatana_vang_1790963515414.jpg';
import saaguValgusCover from './assets/images/book_saagu_valgus_1790963525251.jpg';
import heroPublisherImage from './assets/images/publisher_hero_image_1790963536689.jpg';
import kairiOjaPhoto from './assets/images/kairi_oja_portrait_1791059785550.jpg';

const STORAGE_KEY = 'saaguvalgus_site_content_v10';
const ADMIN_SESSION_KEY = 'saaguvalgus_admin_session_v1';
const LANG_STORAGE_KEY = 'saaguvalgus_lang';

const INITIAL_ORDERS: OrderItem[] = [];

const INITIAL_MESSAGES: ContactMessage[] = [];

// Helper to render text with italicized "new age"
const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(new age)/i);
  return (
    <>
      {parts.map((part, idx) => 
        part.toLowerCase() === 'new age' ? (
          <em key={idx} className="italic font-serif font-semibold text-[#14532D]">{part}</em>
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
            className={isBibleQuote ? 'p-5 sm:p-6 rounded-2xl bg-[#F5F0E6] border-l-4 border-[#14532D] text-[#14532D] font-serif font-semibold italic text-base sm:text-lg leading-relaxed shadow-2xs my-4' : 'text-stone-800 text-base sm:text-lg font-serif leading-relaxed'}
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

// Helper for rendering testimony story with formatting and large font
const renderTestimonyParagraphs = (fullStory: string, isExpanded: boolean) => {
  if (!fullStory) return null;
  const rawParagraphs = fullStory.split(/\n\s*\n/);
  const visibleParagraphs = isExpanded ? rawParagraphs : rawParagraphs.slice(0, 3);

  return (
    <div className="space-y-6 font-serif text-lg sm:text-xl leading-relaxed text-[#292524]">
      {visibleParagraphs.map((p, idx) => {
        const trimmed = p.trim();

        // Check for Scripture Quotes (kirjakohad) - keep them nicely separated
        const isBibleQuote = 
          trimmed.startsWith('“') || 
          trimmed.startsWith('«') || 
          (trimmed.startsWith('"') && trimmed.includes('Piibel')) ||
          trimmed.includes('(5 Mos') ||
          trimmed.includes('(5. Mos') ||
          trimmed.includes('(5Ms') ||
          trimmed.includes('(5.Ms') ||
          trimmed.includes('(Ilmutuse') ||
          trimmed.includes('(Rm 6:12') ||
          trimmed.includes('(Gl 6:7') ||
          trimmed.includes('(1 Joh 1:9') ||
          trimmed.includes('(Lk 15:7') ||
          trimmed.includes('(Mt 11:28') ||
          trimmed.includes('(Ps 103:2') ||
          trimmed.includes('(Õp 18:21') ||
          trimmed.includes('(Mt 7:26-27') ||
          trimmed.includes('Piibel)');

        if (isBibleQuote) {
          return (
            <div 
              key={idx} 
              className="p-5 sm:p-7 rounded-2xl bg-[#F5F0E6] border border-[#E2D7C8] border-l-4 border-l-[#14532D] text-[#14532D] font-serif font-semibold italic text-lg sm:text-xl leading-relaxed shadow-2xs my-4"
            >
              {trimmed}
            </div>
          );
        }

        // Clean, beautiful regular paragraph without heavy emphasis
        return (
          <p key={idx} className="text-stone-800 text-lg sm:text-xl font-serif leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

// Map book object to its respective cover image
const getBookCoverImage = (book: BookItem) => {
  if (book.coverImage && book.coverImage.trim()) return book.coverImage;
  if (book.id === 'laps-ja-jumal') return lapsJaJumalCover;
  if (book.id === 'ma-olin-saatana-vang') return saatanaVangCover;
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

  const activeContent: SiteContent = React.useMemo(() => {
    // Create a copy of content to preserve all cover images, configurations, and media
    const active = JSON.parse(JSON.stringify(content)) as SiteContent;
    
    if (lang === 'en') {
      const enFallback = SITE_CONTENT_EN;
      const enOverrides = content.en || {};
    
    active.brandName = enOverrides.brandName || enFallback.brandName || active.brandName;
    active.brandTagline = enOverrides.brandTagline || enFallback.brandTagline || active.brandTagline;
    active.heroBadge = enOverrides.heroBadge || enFallback.heroBadge || active.heroBadge;
    active.heroTitle = enOverrides.heroTitle || enFallback.heroTitle || active.heroTitle;
    active.heroHighlight = enOverrides.heroHighlight || enFallback.heroHighlight || active.heroHighlight;
    active.heroDescription = enOverrides.heroDescription || enFallback.heroDescription || active.heroDescription;
    
    if (active.primaryVerse) {
      const enVerse = enOverrides.primaryVerse || enFallback.primaryVerse || {};
      active.primaryVerse = {
        ...active.primaryVerse,
        ref: enVerse.ref || active.primaryVerse.ref,
        text: enVerse.text || active.primaryVerse.text,
        theme: enVerse.theme || active.primaryVerse.theme
      };
    }
    
    if (Array.isArray(active.coreVerses)) {
      active.coreVerses = active.coreVerses.map((v, i) => {
        const enVerse = enOverrides.coreVerses?.[i] || enFallback.coreVerses?.[i] || {};
        return {
          ...v,
          ref: enVerse.ref || v.ref,
          text: enVerse.text || v.text,
          theme: enVerse.theme || v.theme
        };
      });
    }
    
    if (Array.isArray(active.centralQuestions)) {
      active.centralQuestions = active.centralQuestions.map((q, i) => {
        const enQ = enOverrides.centralQuestions?.[i] || enFallback.centralQuestions?.find((eq: any) => eq.id === q.id) || enFallback.centralQuestions?.[i] || {};
        return {
          ...q,
          question: enQ.question || q.question,
          fullText: enQ.fullText || q.fullText,
          practicalSteps: enQ.practicalSteps || q.practicalSteps,
          summary: enQ.summary || q.summary,
          tractQuote: enQ.tractQuote || q.tractQuote,
          biblicalAnswer: enQ.biblicalAnswer || q.biblicalAnswer
        };
      });
    }
    
    active.cleanlinessTitle = enOverrides.cleanlinessTitle || enFallback.cleanlinessTitle || active.cleanlinessTitle;
    active.cleanlinessSubtitle = enOverrides.cleanlinessSubtitle || enFallback.cleanlinessSubtitle || active.cleanlinessSubtitle;
    active.cleanlinessDescription = enOverrides.cleanlinessDescription || enFallback.cleanlinessDescription || active.cleanlinessDescription;
    if (Array.isArray(active.cleanlinessSteps)) {
      active.cleanlinessSteps = active.cleanlinessSteps.map((s, i) => {
        const enStep = enOverrides.cleanlinessSteps?.[i] || enFallback.cleanlinessSteps?.[i] || {};
        return {
          ...s,
          title: enStep.title || s.title,
          desc: enStep.desc || s.desc
        };
      });
    }
    
    active.publisherStoryTitle = enOverrides.publisherStoryTitle || enFallback.publisherStoryTitle || active.publisherStoryTitle;
    active.publisherStoryText = enOverrides.publisherStoryText || enFallback.publisherStoryText || active.publisherStoryText;
    
    if (Array.isArray(active.books)) {
      active.books = active.books.map((b, i) => {
        const enBook = enOverrides.books?.[i] || enFallback.books?.find((eb: any) => eb.id === b.id) || enFallback.books?.[i] || {};
        return {
          ...b,
          title: enBook.title || b.title,
          category: enBook.category || b.category,
          description: enBook.description || b.description,
          highlights: enBook.highlights || b.highlights,
          preOrderNote: enBook.preOrderNote || b.preOrderNote,
          releaseDate: enBook.releaseDate || b.releaseDate
        };
      });
    }
    
    if (active.support) {
      const enSupport = enOverrides.support || enFallback.support || {};
      active.support = {
        ...active.support,
        title: enSupport.title || active.support.title,
        subtitle: enSupport.subtitle || active.support.subtitle,
        description: enSupport.description || active.support.description,
        reference: enSupport.reference || active.support.reference,
        explanation: enSupport.explanation || active.support.explanation,
        supportGoals: enSupport.supportGoals || active.support.supportGoals
      };
    }
    
    active.salvationPrayerTitle = enOverrides.salvationPrayerTitle || enFallback.salvationPrayerTitle || active.salvationPrayerTitle;
    active.salvationPrayerSubtitle = enOverrides.salvationPrayerSubtitle || enFallback.salvationPrayerSubtitle || active.salvationPrayerSubtitle;
    active.salvationPrayerIntro = enOverrides.salvationPrayerIntro || enFallback.salvationPrayerIntro || active.salvationPrayerIntro;
    active.salvationPrayerText = enOverrides.salvationPrayerText || enFallback.salvationPrayerText || active.salvationPrayerText;
    
    if (active.lordPrayer) {
      const enPrayer = enOverrides.lordPrayer || enFallback.lordPrayer || {};
      active.lordPrayer = {
        ...active.lordPrayer,
        title: enPrayer.title || active.lordPrayer.title,
        subtitle: enPrayer.subtitle || active.lordPrayer.subtitle,
        intro: enPrayer.intro || active.lordPrayer.intro,
        text: enPrayer.text || active.lordPrayer.text,
        ref: enPrayer.ref || active.lordPrayer.ref
      };
    }

    if (Array.isArray(active.testimonials)) {
      active.testimonials = active.testimonials.map((t, i) => {
        const enT = enOverrides.testimonials?.[i] || enFallback.testimonials?.find((et: any) => et.id === t.id) || enFallback.testimonials?.[i] || {};
        return {
          ...t,
          title: enT.title || t.title,
          person: enT.person || t.person,
          summary: enT.summary || t.summary,
          fullStory: enT.fullStory || t.fullStory,
          facebookPageTitle: enT.facebookPageTitle || t.facebookPageTitle
        };
      });
    }
    }
    
    // Always strictly filter out sample/placeholder testimonials and ensure valid photo & updated facebookUrl
    if (Array.isArray(active.testimonials)) {
      active.testimonials = active.testimonials
        .filter((t) => t.id !== 'vabanemine-esoteerikast' && t.id !== 'ime-ja-tervenemine')
        .map((t) => ({
          ...t,
          facebookUrl: (!t.facebookUrl || t.facebookUrl === 'https://www.facebook.com/saaguvalgus') 
            ? 'https://www.facebook.com/share/1DUothVLCF/' 
            : t.facebookUrl,
          image: t.image && !t.image.startsWith('/src/assets/') ? t.image : kairiOjaPhoto
        }));
    }
    
    return active;
  }, [content, lang]);

  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const [publications, setPublications] = useState<PublicationItem[]>(INITIAL_PUBLICATIONS);
  const [isPublicationsOpen, setIsPublicationsOpen] = useState(() => window.location.hash === '#trukised');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');
  const saveQueue = useRef(Promise.resolve());
  const saveRevision = useRef(0);

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
  const [copiedPaypal, setCopiedPaypal] = useState(false);
  const [isTestimonyExpanded, setIsTestimonyExpanded] = useState<boolean>(false);
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
    analytics.trackLanguageSwitch(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
  };

  useEffect(() => {
    initGA(activeContent.googleAnalyticsId);
  }, [activeContent.googleAnalyticsId]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'en'
      ? 'Let There Be Light Publishing | Christian Literature & Evangelistic Resources'
      : (activeContent.metaTitle || 'Kirjastus Saagu Valgus | Vaimulik kirjandus ja evangeelsed materjalid');
    const description = document.querySelector('meta[name="description"]');
    if (description && activeContent.metaDescription) description.setAttribute('content', activeContent.metaDescription);
  }, [lang, activeContent.metaTitle, activeContent.metaDescription]);

  useEffect(() => {
    api.fetchContent().then(setContent).catch(console.error);
    api.fetchPublications().then(setPublications).catch(console.error);


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
    if (!isAdminAuthenticated) return;
    api.fetchOrders().then(setOrders).catch(console.error);
    api.fetchMessages().then(setMessages).catch(console.error);
  }, [isAdminAuthenticated]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
      if (window.location.hash === '#trukised') setIsPublicationsOpen(true);
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
    const revision = ++saveRevision.current;
    setSaveStatus('saving');
    // Serialize autosaves so an older response cannot overwrite a newer edit.
    saveQueue.current = saveQueue.current.catch(() => {}).then(async () => {
      try {
        await api.saveContent(newContent);
        if (revision === saveRevision.current) setSaveStatus('saved');
      } catch (error) {
        if (revision === saveRevision.current) {
          setSaveStatus('error');
          setSaveError((error as Error).message);
        }
      }
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
    analytics.trackContactMessage();
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
      alert((err as Error).message || 'Sõnumi saatmine ebaõnnestus. Palun proovi uuesti.');
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Kas oled kindel, et soovid taastada lehe esialgse sisu?')) {
      try {
        const resetContent = await api.resetContent();
        setContent(resetContent);
      } catch (err) {
        alert((err as Error).message);
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
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(activeContent.contactEmail);
    setCopiedEmail(true);
    analytics.trackBankDetailsCopy('email');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(activeContent.support.iban);
    setCopiedIban(true);
    analytics.trackBankDetailsCopy('iban');
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleCopyPaypal = () => {
    navigator.clipboard.writeText(activeContent.support.paypalEmail || 'Kairioja777@proton.me');
    setCopiedPaypal(true);
    analytics.trackBankDetailsCopy('paypal');
    setTimeout(() => setCopiedPaypal(false), 2000);
  };

  const handleCopyPrayer = () => {
    navigator.clipboard.writeText(activeContent.salvationPrayerText);
    setCopiedPrayer(true);
    analytics.trackPrayerCopy('salvation');
    setTimeout(() => setCopiedPrayer(false), 2000);
  };

  const handleCopyLordPrayer = () => {
    navigator.clipboard.writeText(activeContent.lordPrayer.text);
    setCopiedLordPrayer(true);
    analytics.trackPrayerCopy('lords_prayer');
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
        saveStatus={saveStatus}
        saveError={saveError}
        onRetrySave={() => saveContent(content)}
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans selection:bg-[#14532D]/15 selection:text-[#14532D] relative overflow-x-hidden public-site">
      
      <a href="#kusimused" className="skip-link">{lang === 'en' ? 'Skip to content' : 'Liigu sisuni'}</a>
      {/* Top Bar with Official Brand Logo */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7E0D5] shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 site-header-inner flex items-center justify-between gap-4">
          
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

          <button type="button" className="md:hidden mobile-menu-button" aria-expanded={mobileNavOpen}
            aria-controls="mobile-navigation" aria-label={lang === 'en' ? 'Menu' : 'Menüü'} onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
        {mobileNavOpen && <nav id="mobile-navigation" className="md:hidden mobile-navigation" aria-label={lang === 'en' ? 'Navigation' : 'Navigeerimine'}>
          {[
            ['kusimused', lang === 'en' ? 'Questions' : 'Põhiküsimused'],
            ['tunnistused', t.nav.testimonials], ['kirjastus', t.nav.books],
            ['toetus', t.nav.support], ['paastepalve', t.nav.prayer], ['kontakt', t.nav.contact]
          ].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMobileNavOpen(false)}>{label}</a>)}
        </nav>}
      </header>

      <main>
      {/* Hero Section WITH 3 PÕHIKÜSIMUST FRONT & CENTER */}
      <section id="kusimused" className="site-hero relative pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-[#E7E0D5] bg-[#FAF7F2] paper-grain">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-semibold tracking-widest text-[#9A3412] uppercase font-sans">
              {activeContent.brandName}
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
                {lang === 'en' ? '3 Core Questions' : '3 Põhiküsimust'}
              </h2>
              <span className="text-xs font-semibold text-stone-500 font-sans">
                {lang === 'en' ? 'Select question to read answer:' : 'Vali küsimus vastuse lugemiseks:'}
              </span>
            </div>

            {/* The 3 Question Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {activeContent.centralQuestions.map((q) => {
                const isSelected = activeCentralQuestion === q.id;
                return (
                  <button
                    key={q.id}
                    aria-pressed={isSelected}
                    aria-controls="question-answer"
                    onClick={() => setActiveCentralQuestion(q.id)}
                    className={`p-6 sm:p-7 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-5 relative overflow-hidden ${
                      isSelected 
                        ? 'bg-[#14532D] text-white border-[#14532D] shadow-sm'
                        : 'bg-white hover:bg-[#F5F0E6] border-[#E2D7C8] text-[#1C1917] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className={`font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg ${isSelected ? 'bg-emerald-900/60 text-amber-300' : 'bg-[#F5F0E6] text-[#9A3412]'}`}>
                        0{q.number}.
                      </span>
                      <span className={`font-semibold ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                        {lang === 'en' ? 'Core Question' : 'Põhiküsimus'}
                      </span>
                    </div>

                    <h3 className={`font-serif font-bold text-lg sm:text-xl leading-snug ${isSelected ? 'text-white' : 'text-[#1C1917]'}`}>
                      {q.question}
                    </h3>

                    <div className={`text-xs font-bold pt-3 border-t flex items-center justify-between font-sans ${
                      isSelected ? 'border-emerald-800/80 text-amber-300' : 'border-[#E2D7C8] text-[#14532D]'
                    }`}>
                      <span>{lang === 'en' ? 'Read full answer' : 'Loe vastust & tõde'}</span>
                      <span className="text-base">→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Full Answer Reader for Selected Question */}
            {(() => {
              const current = activeContent.centralQuestions.find(q => q.id === activeCentralQuestion) || activeContent.centralQuestions[0];
              if (!current) return null;
              return (
                <div id="question-answer" className="answer-reader bg-white rounded-3xl border border-[#E2D7C8] border-t-4 border-t-[#14532D] p-6 sm:p-10 shadow-md space-y-8 text-left relative">
                  
                  <div className="border-b border-[#E2D7C8] pb-6 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-stone-500 font-sans">
                      <span className="font-mono font-bold text-[#9A3412] text-sm px-3 py-1 bg-[#F5F0E6] rounded-lg">{lang === 'en' ? 'Question' : 'Põhiküsimus'} 0{current.number}.</span>
                      <span className="font-semibold">{lang === 'en' ? 'Spiritual Truth' : 'Vaimulik tõde & Piibellik vastus'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C1917] leading-tight pt-1">
                      {current.question}
                    </h3>
                  </div>

                  {/* Author Prose */}
                  <div>
                    {renderAuthorParagraphs(current.fullText)}
                  </div>

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
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#9A3412] font-sans">
              {activeContent.cleanlinessSubtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
              {activeContent.cleanlinessTitle}
            </h2>
            <p className="text-sm sm:text-base font-serif text-stone-700 leading-relaxed">
              {activeContent.cleanlinessDescription}
            </p>

            {/* 5 Mos 7:25-26 Scripture Quote */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F5F0E6] border border-[#E2D7C8] border-l-4 border-l-[#14532D] text-[#14532D] text-left max-w-2xl mx-auto shadow-2xs space-y-3">
              <p className="text-base sm:text-lg font-serif font-semibold italic leading-relaxed text-[#14532D]">
                «Nende jumalakujud põletage tules; ära himusta hõbedat ja kulda nende pealt ja ära võta seda enesele, et sind sellega ei võrgutataks, sest see on jäledus Issandale, su Jumalale! 26 Ära vii niisugust jäledust oma kotta, et sinagi ei saaks neetuks nagu see; sa pead seda ülimalt põlgama ja jälestama, sest see on neetud asi!»
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] font-sans block text-right">
                📖 {lang === 'en' ? 'Deuteronomy 7:25-26' : '5 Mos 7:25-26'}
              </span>
            </div>
          </div>

          {/* Practical steps title */}
          <div className="text-center pt-4">
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#9A3412] font-sans block mb-1">
              {lang === 'en' ? 'What to do?' : 'Mida teha?'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
              {lang === 'en' ? 'Practical Steps' : 'Praktilised sammud:'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeContent.cleanlinessSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E7E0D5] hover:border-[#14532D]/30 shadow-2xs hover:shadow-xs transition-all duration-200 space-y-3 flex flex-col justify-between text-left">
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold text-[#9A3412] uppercase tracking-wider block">
                    {lang === 'en' ? `Step 0${idx + 1}` : `Samm 0${idx + 1}`}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1C1917] leading-snug">{step.title}</h3>
                  <p className="text-sm font-serif text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="tunnistused" className="py-16 sm:py-24 bg-white border-b border-[#E7E0D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#14532D] font-sans">
              {t.testimonials.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917]">
              {t.testimonials.title}
            </h2>
            <p className="text-base sm:text-lg font-serif text-stone-600">
              {t.testimonials.subtitle}
            </p>
          </div>

          {/* Wide, full-width article view */}
          <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-8">
            {activeContent.testimonials.map((test) => (
              <div 
                key={test.id} 
                className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#FAF7F2] border border-[#E2D7C8] shadow-sm space-y-8 text-left transition-all duration-300"
              >
                {/* Header: Author portrait, Name, Type, Date, Facebook link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E2D7C8]">
                  <div className="flex items-center gap-4 sm:gap-5">
                    {test.image && (
                      <img 
                        src={test.image} 
                        alt={test.person} 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#14532D]/30 shadow-md shrink-0" 
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#14532D]/10 text-[#14532D] font-sans font-bold text-xs uppercase tracking-wider">
                          {test.type === 'vabanemine' ? (lang === 'en' ? 'Deliverance' : 'Vabanemislugu') : (lang === 'en' ? 'Healing' : 'Tervenemine')}
                        </span>
                        {test.date && (
                          <span className="text-xs font-mono text-stone-500">{test.date}</span>
                        )}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                        {test.person}
                      </h3>
                      <p className="text-xs sm:text-sm font-serif text-stone-600">
                        {lang === 'en' ? 'Deliverance from five years of severe spiritual bondage' : 'Vabanemine viis aastat kestnud karmist vaimsest sidumisest'}
                      </p>
                    </div>
                  </div>

                  {test.facebookUrl && (
                    <a
                      href={test.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2D7C8] text-[#14532D] hover:bg-[#14532D] hover:text-white font-sans font-bold text-xs shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{test.facebookPageTitle || (lang === 'en' ? 'Facebook Page' : 'Facebooki leht')}</span>
                    </a>
                  )}
                </div>

                {/* Main Heading & Summary */}
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C1917] leading-snug">
                    {test.title}
                  </h3>
                  
                  {test.summary && (
                    <p className="text-lg sm:text-xl font-serif text-[#14532D] font-medium leading-relaxed italic bg-white/70 p-6 rounded-2xl border border-[#E2D7C8]">
                      «{test.summary}»
                    </p>
                  )}
                </div>

                {/* Story content with expand/collapse and large font */}
                <div className="relative">
                  {renderTestimonyParagraphs(test.fullStory || '', isTestimonyExpanded)}

                  {/* Gradient overlay when collapsed */}
                  {!isTestimonyExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Expand / Collapse Toggle Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      if (isTestimonyExpanded) {
                        setIsTestimonyExpanded(false);
                        const el = document.getElementById('tunnistused');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setIsTestimonyExpanded(true);
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-serif font-bold text-base sm:text-lg transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-3 active:scale-[0.99]"
                  >
                    {isTestimonyExpanded ? (
                      <>
                        <ChevronUp className="w-5 h-5 text-amber-300" />
                        <span>{lang === 'en' ? 'Close story' : 'Sulge tunnistus'}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5 text-amber-300" />
                        <span>{lang === 'en' ? 'Read full testimony (open in full)' : 'Loe kogu tunnistust (avaneb täismahus)'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Share Testimony Callout */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F5F0E6] border border-[#E2D7C8] text-center max-w-3xl mx-auto space-y-4 shadow-2xs">
            <h4 className="text-2xl font-serif font-bold text-[#1C1917]">
              {lang === 'en' ? 'Do you have a testimony of God\'s grace?' : 'Kas sul on oma lugu elava Jumala tööst?'}
            </h4>
            <p className="text-base font-serif text-stone-700 leading-relaxed max-w-xl mx-auto">
              {lang === 'en'
                ? 'Share how God has touched your life to encourage others and bear witness to the truth.'
                : 'Kirjuta kirjastusele ja jaga oma tunnistust teiste inimeste julgustuseks ning tõe tunnistuseks.'}
            </p>
            <button
              onClick={() => scrollTo('kontakt')}
              className="px-8 py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
            >
              {lang === 'en' ? 'Send your testimony' : 'Saada oma tunnistus'}
            </button>
          </div>

        </div>
      </section>

      {/* Books & Publisher Section */}
      <section id="kirjastus" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E7E0D5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Publisher Story */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E0D5] shadow-xs space-y-4 max-w-4xl mx-auto text-left">
            <span className="text-xs font-bold text-[#14532D] uppercase tracking-widest font-sans">
              {lang === 'en' ? 'Publishing House Mission' : 'Kirjastuse Saagu Valgus Missioon'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
              {activeContent.publisherStoryTitle}
            </h3>
            <p className="text-base sm:text-lg font-serif text-stone-700 leading-relaxed">
              {activeContent.publisherStoryText}
            </p>
          </div>

          {/* Dynamic Books Layout based on user selection */}
          {(() => {
            const displayedBooks = (activeContent.books || [])
              .filter((b) => b.showOnHomepage !== false && b.isVisible !== false)
              .slice(0, activeContent.maxHomepageBooks && activeContent.maxHomepageBooks > 0 ? activeContent.maxHomepageBooks : undefined);

            if (displayedBooks.length === 0) {
              return null;
            }

            return (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                    {lang === 'en' ? 'Publications & Books' : 'Kirjastuse Raamatud'}
                  </h3>
                  <p className="text-sm font-serif text-stone-600">
                    {lang === 'en' ? 'Christian literature and works' : 'Vaimulik kirjandus ja teosed'}
                  </p>
                </div>

                {/* 1 Book Layout: Spotlight presentation */}
                {displayedBooks.length === 1 ? (
                  <div className="max-w-3xl mx-auto">
                    {(() => {
                      const book = displayedBooks[0];
                      const coverImg = getBookCoverImage(book);
                      return (
                        <div className="bg-white rounded-3xl border border-[#E7E0D5] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center gap-8 text-left">
                          <div className="w-full md:w-5/12 aspect-[3/4] max-w-xs rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E2D7C8] shadow-sm shrink-0">
                            <img
                              src={coverImg}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="w-full md:w-7/12 space-y-4 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-sans">
                                  {book.category}
                                </span>
                                {book.isPreOrder && (
                                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-sans">
                                    {book.preOrderNote || (lang === 'en' ? 'In preparation' : 'Valmimisel')}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                                «{book.title}»
                              </h4>
                              <p className="text-xs text-stone-500 font-sans">{book.author}</p>
                              <p className="text-base font-serif text-stone-700 leading-relaxed pt-2">
                                {book.description}
                              </p>
                              {book.highlights && book.highlights.length > 0 && (
                                <div className="space-y-1.5 text-xs text-stone-600 font-serif pt-3 border-t border-stone-100">
                                  {book.highlights.map((h, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <span className="text-[#14532D] font-bold">•</span>
                                      <span>{h}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="pt-3">
                              <button
                                onClick={() => setIsPublicationsOpen(true)}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D24] text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                              >
                                <FileText className="w-4 h-4 text-amber-300" />
                                <span>{lang === 'en' ? 'View Literature (PDF)' : 'Loe trükist (PDF)'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  /* 2, 3, or 4+ Books Layout: Responsive balanced Grid */
                  <div className={`grid gap-8 ${
                    displayedBooks.length === 2 
                      ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                      : displayedBooks.length === 3 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto' 
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto'
                  }`}>
                    {displayedBooks.map((book) => {
                      const coverImg = getBookCoverImage(book);
                      return (
                        <div key={book.id} className="bg-white rounded-3xl border border-[#E7E0D5] p-6 shadow-xs flex flex-col justify-between space-y-6 text-left">
                          
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
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-stone-500 font-sans block">{book.category}</span>
                                {book.isPreOrder && (
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-sans">
                                    {book.preOrderNote || (lang === 'en' ? 'In prep' : 'Valmimisel')}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xl font-serif font-bold text-[#1C1917]">«{book.title}»</h4>
                              <p className="text-xs text-stone-500 font-sans">{book.author}</p>
                            </div>

                            <p className="text-sm font-serif text-stone-700 leading-relaxed text-left">
                              {book.description}
                            </p>

                            {book.highlights && book.highlights.length > 0 && (
                              <div className="space-y-1 text-xs text-stone-600 font-serif text-left pt-2 border-t border-stone-100">
                                {book.highlights.map((h, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <span className="text-[#14532D] font-bold">•</span>
                                    <span>{h}</span>
                                  </div>
                                ))}
                              </div>
                            )}
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
                )}
              </div>
            );
          })()}

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

      {/* Support Section */}
      <section id="toetus" className="py-16 sm:py-20 bg-[#F5F0E6] border-b border-[#E2D7C8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-center">
          
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] leading-snug">
            {lang === 'en' 
              ? 'If this website has been a blessing to You, You may support its work here:'
              : 'Kui see lehekülg on olnud Sulle õnnistuseks, saad selle toimimist toetada nii:'}
          </h2>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E0D5] shadow-xs space-y-5 text-left max-w-xl mx-auto">
            
            {/* Bank details */}
            <div className="space-y-3 font-sans text-xs sm:text-sm">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E7E0D5] space-y-0.5">
                <span className="text-stone-500 block text-[11px] uppercase tracking-wider font-bold">
                  {lang === 'en' ? 'Recipient' : 'Saaja'}
                </span>
                <span className="font-serif font-bold text-stone-900 text-lg sm:text-xl block">
                  {activeContent.support.recipientName || 'Kairi Oja'}
                </span>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E7E0D5] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-stone-500 block text-[11px] uppercase tracking-wider font-bold">
                    {lang === 'en' ? 'Bank Account (IBAN)' : 'Pangakonto (IBAN)'} • {activeContent.support.bankName || 'LHV Pank'}
                  </span>
                  <span className="font-mono font-bold text-[#14532D] text-base sm:text-lg block tracking-wide truncate">
                    {activeContent.support.iban || 'EE537700771000431636'}
                  </span>
                </div>
                <button
                  onClick={handleCopyIban}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-[#14532D] hover:text-white font-bold text-xs cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  {copiedIban ? (lang === 'en' ? 'Copied!' : 'Kopeeritud!') : (lang === 'en' ? 'Copy' : 'Kopeeri')}
                </button>
              </div>
            </div>

            {/* PayPal donation block */}
            <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E2D7C8] space-y-2 font-sans">
              <span className="text-stone-700 block text-xs sm:text-sm font-semibold">
                {activeContent.support.paypalNote || (lang === 'en' ? 'or by making a donation to the PayPal account:' : 'või tehes annetuse PayPal kontole:')}
              </span>
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="font-mono font-bold text-[#14532D] text-sm sm:text-base truncate">
                  {activeContent.support.paypalEmail || 'kairioja777@proton.me'}
                </span>
                <button
                  onClick={handleCopyPaypal}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E2D7C8] text-[#14532D] hover:bg-[#14532D] hover:text-white font-bold text-xs cursor-pointer shrink-0 transition-colors shadow-2xs"
                >
                  {copiedPaypal ? (lang === 'en' ? 'Copied!' : 'Kopeeritud!') : (lang === 'en' ? 'Copy' : 'Kopeeri')}
                </button>
              </div>
            </div>

            {/* Book sales note */}
            <div className="pt-1 text-center text-xs text-stone-500 font-serif">
              ℹ️ {activeContent.support.bookSalesNote || (lang === 'en' ? 'Book sales and publications distribution are invoiced through Saagu Valgus OÜ.' : 'Raamatute müük ja trükiste tellimine toimub Saagu Valgus OÜ kaudu.')}
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
      </main>
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
