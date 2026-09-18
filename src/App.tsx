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
  Edit3
} from 'lucide-react';
import { INITIAL_SITE_CONTENT } from './data';
import { SiteContent, QuestionItem, BookItem, BibleVerse, TestimonialItem } from './types';

const STORAGE_KEY = 'saaguvalgus_site_content_v2';

// Subtle Cross SVG Motif (Tagasihoidlik läbiv rist taustal)
const SubtleCrossMotif: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 120 }) => (
  <svg 
    width={size} 
    height={size * 1.4} 
    viewBox="0 0 100 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-6 text-[#1a6838] transition-opacity ${className}`}
  >
    {/* Elegant classical cross with soft finials */}
    <rect x="44" y="0" width="12" height="140" rx="3" fill="currentColor" />
    <rect x="15" y="32" width="70" height="12" rx="3" fill="currentColor" />
    <circle cx="50" cy="38" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
  </svg>
);

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
        return { ...INITIAL_SITE_CONTENT, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved site content:', e);
    }
    return INITIAL_SITE_CONTENT;
  });

  const [activeQuestion, setActiveQuestion] = useState<string>('igauele-oma-jumal');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPrayer, setCopiedPrayer] = useState(false);
  const [copiedLordPrayer, setCopiedLordPrayer] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingLordPrayer, setIsSpeakingLordPrayer] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Book Order Modal
  const [selectedBookForOrder, setSelectedBookForOrder] = useState<BookItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderData, setOrderData] = useState({ name: '', email: '', phone: '', address: '', notes: '' });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Admin Modal & State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState(false);
  const [adminTab, setAdminTab] = useState<'general' | 'questions' | 'cleanliness' | 'testimonials' | 'publisher' | 'support' | 'prayers' | 'docker' | 'backup'>('general');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [copiedDockerCmd, setCopiedDockerCmd] = useState('');

  // Save to localStorage
  const saveContent = (newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 2500);
    } catch (e) {
      console.error('Error saving content:', e);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kas oled kindel, et soovid taastada lehe esialgse sisu?')) {
      saveContent(INITIAL_SITE_CONTENT);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `saaguvalgus-sisu-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          saveContent({ ...INITIAL_SITE_CONTENT, ...parsed });
          alert('Sisu edukalt imporditud!');
        }
      } catch (err) {
        alert('Viga faili lugemisel. Palun veendu, et tegemist on korrektse JSON failiga.');
      }
    };
    reader.readAsText(file);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin' || adminPasswordInput === '1234' || adminPasswordInput === 'saaguvalgus') {
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDockerCmd(label);
    setTimeout(() => setCopiedDockerCmd(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#1c2e24] flex flex-col font-sans selection:bg-[#8ab897]/30 selection:text-[#1a6838] relative overflow-x-hidden">
      
      {/* Subtle Background Watermark Crosses (Tagasihoidlik läbiv rist taustal) */}
      <div className="fixed top-20 right-4 lg:right-16 pointer-events-none z-0">
        <SubtleCrossMotif size={180} className="opacity-[0.035]" />
      </div>
      <div className="fixed bottom-32 left-4 lg:left-12 pointer-events-none z-0">
        <SubtleCrossMotif size={220} className="opacity-[0.03]" />
      </div>

      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#8ab897]/20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <a href="#" className="flex items-center hover:opacity-90 transition-opacity">
            <BrandLogo size="md" />
          </a>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-semibold text-[#2c4c3b]">
            <button onClick={() => scrollTo('kusimused')} className="hover:text-[#1a6838] transition-colors">
              3 Põhiküsimust
            </button>
            <button onClick={() => scrollTo('hoia-kodu-puhas-sec')} className="hover:text-[#1a6838] transition-colors flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#1a6838]" />
              <span>Puhas kodu</span>
            </button>
            <button onClick={() => scrollTo('tunnistused')} className="hover:text-[#1a6838] transition-colors flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-[#1a6838]" />
              <span>Tunnistused</span>
            </button>
            <button onClick={() => scrollTo('kirjastus')} className="hover:text-[#1a6838] transition-colors">
              Kirjastus & Raamatud
            </button>
            <button onClick={() => scrollTo('toetus')} className="hover:text-[#1a6838] transition-colors text-amber-700 font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600/20" />
              <span>Toeta</span>
            </button>
            <button onClick={() => scrollTo('meie-isa')} className="hover:text-[#1a6838] transition-colors">
              Meie Isa palve
            </button>
            <button onClick={() => scrollTo('kontakt')} className="hover:text-[#1a6838] transition-colors">
              Kontakt
            </button>
          </nav>

          {/* Top Action: Päästepalve */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scrollTo('paastepalve')}
              className="px-4 py-2 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Flame className="w-4 h-4 text-emerald-300" />
              <span>Päästepalve</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-[#f4f8f5] via-white to-white border-b border-[#8ab897]/20 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none cross-pattern opacity-40" />

        {/* Elegant Centered Background Cross */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-4">
          <SubtleCrossMotif size={360} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a6838]/10 border border-[#1a6838]/20 text-[#1a6838] text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-[#1a6838]" />
            <span>{content.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#144225] tracking-tight leading-tight">
            {content.heroTitle} <span className="text-[#1a6838]">{content.heroHighlight}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#324f3e] font-serif leading-relaxed max-w-2xl mx-auto">
            {content.heroDescription}
          </p>

          {/* 3 Core Bible Verses Requested by User (Jh 3:16, 2Kn 17:17, Jl 3:5) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 text-left">
            {content.coreVerses.map((v, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between relative group hover:border-[#1a6838]/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1a6838] uppercase tracking-wider">{v.ref}</span>
                    {v.theme && <span className="text-[10px] text-stone-500 font-semibold bg-stone-100 px-1.5 py-0.5 rounded">{v.theme}</span>}
                  </div>
                  <p className="text-xs sm:text-sm italic font-serif text-[#1c2e24]">«{v.text}»</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Selection Buttons with High Contrast Question Mark Icons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {content.tractQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestion(q.id);
                  scrollTo('kusimused');
                }}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                  q.id === 'hoia-kodu-puhas'
                    ? 'bg-[#1a6838] text-white border-[#1a6838] hover:bg-[#15542d] shadow-xs'
                    : 'bg-white hover:bg-[#f4f8f5] border-[#8ab897]/50 text-[#144225] shadow-2xs'
                }`}
              >
                {/* Prominent Contrast Question Mark */}
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                  q.id === 'hoia-kodu-puhas' ? 'bg-amber-400 text-stone-900' : 'bg-red-600 text-white shadow-xs'
                }`}>
                  ?
                </span>
                <span className="truncate max-w-[220px] sm:max-w-none">
                  {q.number}. {q.question.replace(/\?$/, '')}?
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. The 3 Questions Section (Trükise 3 põhiküsimust) */}
      <section id="kusimused" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 z-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
            Trükise 3 retoorilist põhiküsimust
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
            Vastused, mis avavad silmad
          </h2>
          <p className="text-sm text-[#41624f]">
            Trükise saajale ja igale tõeotsijale – mida õpetab Jumala Sõna?
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 bg-[#f4f8f5] p-2 rounded-2xl border border-[#8ab897]/30 max-w-3xl mx-auto">
          {content.tractQuestions.map((q) => {
            const isSelected = activeQuestion === q.id;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestion(q.id)}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 ${
                  isSelected 
                    ? 'bg-[#1a6838] text-white shadow-sm' 
                    : 'text-[#2b4c3b] hover:bg-white/60'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isSelected ? 'bg-amber-400 text-stone-900' : 'bg-red-600 text-white shadow-2xs'
                }`}>
                  ?
                </span>
                <span className="truncate text-left">{q.number}. {q.id === 'igauele-oma-jumal' ? '«Oma jumal»?' : q.id === 'hea-inimene-paasemine' ? 'Hea inimene?' : 'Hoia kodu puhas'}</span>
              </button>
            );
          })}
        </div>

        {/* Active Question Content Card */}
        {(() => {
          const current = content.tractQuestions.find(q => q.id === activeQuestion) || content.tractQuestions[0];
          return (
            <div className="bg-white rounded-3xl border border-[#8ab897]/30 p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
              
              {/* Corner Watermark Cross */}
              <div className="absolute -bottom-6 -right-6 pointer-events-none opacity-4">
                <SubtleCrossMotif size={180} />
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                  ?
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-[#1a6838] tracking-wider mb-0.5">Küsimus nr {current.number}</div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
                    {current.question}
                  </h3>
                  <p className="text-sm text-[#4a6b57] mt-1">
                    {current.summary}
                  </p>
                </div>
              </div>

              {/* Flyer Quote Callout */}
              <div className="bg-[#f4f8f5] border-l-4 border-[#1a6838] p-5 rounded-r-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a6838]">
                  Trükise tsitaat:
                </span>
                <p className="font-serif italic text-sm sm:text-base text-[#1c2e24]">
                  {current.tractQuote}
                </p>
              </div>

              {/* Biblical Answer */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider text-[#1a6838]">
                  Mida ütleb Piibel ja miks see on oluline?
                </h4>
                <p className="text-sm sm:text-base text-[#243d2e] leading-relaxed font-serif">
                  {current.biblicalAnswer}
                </p>
              </div>

              {/* Bible Verses */}
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

      </section>

      {/* 4. Spiritual Cleanliness Section */}
      <section id="hoia-kodu-puhas-sec" className="py-12 sm:py-16 bg-[#1a6838] text-white relative overflow-hidden">
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-10 text-white">
          <SubtleCrossMotif size={280} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8ab897] font-bold">
                {content.cleanlinessSubtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">
                {content.cleanlinessTitle}
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-serif">
            {content.cleanlinessDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {content.cleanlinessSteps.map((step, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-xs">
                <span className="font-bold text-sm text-[#8ab897] block mb-1">{step.title}</span>
                <p className="text-xs text-white/90">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials & Real Stories (Tunnistused & YouTube videod) */}
      <section id="tunnistused" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 z-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
            Tõestisündinud lood
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
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
                  <div className="p-4 rounded-2xl bg-[#f4f8f5] text-xs text-[#243d2e] italic leading-relaxed border border-[#8ab897]/20">
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
                  className="font-bold text-[#1a6838] hover:underline"
                >
                  Saada oma tunnistus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Salvation Prayer Section */}
      <section id="paastepalve" className="py-14 sm:py-20 bg-[#f4f8f5] border-y border-[#8ab897]/20 relative overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-4">
          <SubtleCrossMotif size={320} />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 relative z-10">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1a6838]/10 text-[#1a6838] text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#1a6838]" />
              <span>{content.salvationPrayerSubtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
              {content.salvationPrayerTitle}
            </h2>
            <p className="text-sm text-[#41624f]">
              {content.salvationPrayerIntro}
            </p>
          </div>

          {/* Prayer Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#8ab897]/30 shadow-md space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="text-xs font-bold text-[#1a6838] uppercase tracking-wider">
                Palveta seda siiralt oma südamega:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeech}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                    isSpeaking 
                      ? 'bg-[#1a6838] text-white border-[#1a6838]' 
                      : 'bg-[#f4f8f5] text-[#1a6838] border-[#8ab897]/40 hover:bg-[#e8f1eb]'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Peata' : 'Kuula ettelugemist'}</span>
                </button>
                <button
                  onClick={handleCopyPrayer}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f4f8f5] text-[#1a6838] border border-[#8ab897]/40 hover:bg-[#e8f1eb] flex items-center gap-1.5 transition-colors"
                >
                  {copiedPrayer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrayer ? 'Kopeeritud' : 'Kopeeri'}</span>
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-[#fcfdfc] border border-[#8ab897]/20 font-serif text-base sm:text-lg leading-relaxed text-[#1c2e24] whitespace-pre-line text-center shadow-inner">
              {content.salvationPrayerText}
            </div>

            {/* Follow-up steps */}
            <div className="pt-4 space-y-4">
              <h4 className="font-bold text-sm text-[#144225] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1a6838]" />
                <span>Palvetasid selle palve? Mis saab edasi?</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {content.salvationPrayerNextSteps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#f4f8f5] border border-[#8ab897]/20 space-y-1">
                    <h5 className="font-bold text-xs sm:text-sm text-[#144225]">{step.title}</h5>
                    <p className="text-xs text-[#3a5946]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Lord's Prayer Section (Meie Isa palve) */}
      <section id="meie-isa" className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 z-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
            {content.lordPrayer.ref}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
            {content.lordPrayer.title}
          </h2>
          <p className="text-sm text-[#41624f] max-w-xl mx-auto">
            {content.lordPrayer.intro}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#8ab897]/30 shadow-md space-y-6 relative overflow-hidden">
          <div className="absolute right-4 bottom-4 pointer-events-none opacity-4">
            <SubtleCrossMotif size={200} />
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <span className="text-xs font-bold text-[#1a6838] uppercase tracking-wider">
              {content.lordPrayer.subtitle}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeechLordPrayer}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                  isSpeakingLordPrayer 
                    ? 'bg-[#1a6838] text-white border-[#1a6838]' 
                    : 'bg-[#f4f8f5] text-[#1a6838] border-[#8ab897]/40 hover:bg-[#e8f1eb]'
                }`}
              >
                {isSpeakingLordPrayer ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeakingLordPrayer ? 'Peata' : 'Kuula'}</span>
              </button>
              <button
                onClick={handleCopyLordPrayer}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f4f8f5] text-[#1a6838] border border-[#8ab897]/40 hover:bg-[#e8f1eb] flex items-center gap-1.5 transition-colors"
              >
                {copiedLordPrayer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLordPrayer ? 'Kopeeritud' : 'Kopeeri'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#fcfdfc] border border-[#8ab897]/20 font-serif text-base sm:text-xl leading-relaxed text-[#1c2e24] whitespace-pre-line text-center shadow-inner">
            {content.lordPrayer.text}
          </div>
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
            className="px-5 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Heart className="w-4 h-4 text-emerald-200" />
            <span>Toeta kirjastustööd</span>
          </button>
        </div>

        {/* Publisher Story */}
        <div className="bg-[#f4f8f5] p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 space-y-3">
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

        {/* Books Cards & E-Store ordering */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#144225]">
              Kirjastuse raamatud ja tellimine
            </h3>
            <span className="text-xs text-[#385643] font-semibold">Saadaval postiga üle Eesti</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.books.map((book) => (
              <div key={book.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between space-y-4 relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8ab897] uppercase tracking-wider">{book.category}</span>
                    <span className="text-base font-extrabold text-[#1a6838] bg-[#1a6838]/10 px-3 py-1 rounded-full">{book.price} €</span>
                  </div>

                  <h3 className="text-2xl font-bold font-display text-[#144225]">«{book.title}»</h3>
                  <p className="text-sm text-[#2d4937] leading-relaxed">{book.description}</p>
                  
                  <div className="pt-2 space-y-1 text-xs text-[#3e5e4b]">
                    {book.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[#1a6838] font-bold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">{book.author}</span>
                  <button
                    onClick={() => {
                      setSelectedBookForOrder(book);
                      setOrderSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Telli raamat ({book.price} €)</span>
                  </button>
                </div>
              </div>
            ))}
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
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-stone-900">
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
                    className="p-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center gap-1 font-semibold"
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

      {/* 10. Contact Section */}
      <section id="kontakt" className="py-14 sm:py-20 bg-[#f4f8f5] border-t border-[#8ab897]/20 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
              Võta ühendust
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
              Kirjuta meile või saada palvesoov
            </h2>
            <p className="text-sm text-[#41624f]">
              Oleme olemas, kui sul on küsimusi, soovid eestpalvet või soovid trükiseid ja raamatuid oma kogudusele.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Email Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1a6838]/10 text-[#1a6838] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#144225]">E-post</h4>
                  <p className="text-xs text-stone-500">Otsene kontakt meeskonnaga</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#8ab897]/30 flex items-center justify-between">
                <a href={`mailto:${content.contactEmail}`} className="font-mono text-base sm:text-lg font-bold text-[#1a6838] hover:underline">
                  {content.contactEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-white border border-[#8ab897]/40 text-[#1a6838] hover:bg-[#f4f8f5] text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Vastame kirjadele tavaliselt 1–2 tööpäeva jooksul. Kõik palvesoovid jäävad konfidentsiaalseks.
              </p>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 shadow-2xs">
              {formSent ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#1a6838]/10 text-[#1a6838] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-[#144225]">Täname kirjutamast!</h4>
                  <p className="text-xs text-stone-600">Sinu sõnum on saadetud aadressile {content.contactEmail}.</p>
                  <button 
                    onClick={() => setFormSent(false)} 
                    className="text-xs font-bold text-[#1a6838] underline pt-2"
                  >
                    Saada teine kiri
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSent(true);
                    setFormData({ name: '', email: '', message: '' });
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#144225] mb-1">Nimi</label>
                    <input
                      type="text"
                      required
                      placeholder="Sinu nimi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#144225] mb-1">E-post</label>
                    <input
                      type="email"
                      required
                      placeholder="sinu@epost.ee"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#144225] mb-1">Sõnum või palvesoov</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Kirjuta oma küsimus või teade siia..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
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

      {/* 11. Footer (Clean footer with subtle Admin link) */}
      <footer className="bg-white border-t border-[#8ab897]/20 py-10 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#385643]">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>© {new Date().getFullYear()} {content.brandName}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-semibold justify-center">
            <button onClick={() => scrollTo('kusimused')} className="hover:text-[#1a6838]">3 Põhiküsimust</button>
            <button onClick={() => scrollTo('tunnistused')} className="hover:text-[#1a6838]">Tunnistused</button>
            <button onClick={() => scrollTo('kirjastus')} className="hover:text-[#1a6838]">Kirjastus</button>
            <button onClick={() => scrollTo('toetus')} className="hover:text-[#1a6838]">Toeta</button>
            <button onClick={() => scrollTo('paastepalve')} className="hover:text-[#1a6838]">Päästepalve</button>
            <button onClick={() => scrollTo('meie-isa')} className="hover:text-[#1a6838]">Meie Isa palve</button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#1a6838] flex items-center gap-1 opacity-80 hover:opacity-100">
              <Lock className="w-3 h-3 text-[#1a6838]" />
              <span>Admin</span>
            </button>
            <a href={`mailto:${content.contactEmail}`} className="hover:text-[#1a6838]">{content.contactEmail}</a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 12. BOOK ORDER MODAL (E-POE TELLIMISVORMI AKNAKE) */}
      {/* ========================================================================= */}
      {selectedBookForOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#8ab897]/40 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#1a6838] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">Raamatu tellimine</h3>
              </div>
              <button onClick={() => setSelectedBookForOrder(null)} className="p-1 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {orderSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-stone-900">Tellimus vastu võetud!</h4>
                  <p className="text-xs text-stone-600">
                    Oleme saanud sinu tellimuse raamatule <strong>«{selectedBookForOrder.title}»</strong>. Saadame kinnituse ja makseinfo sinu meilile ({orderData.email}).
                  </p>
                  <button
                    onClick={() => setSelectedBookForOrder(null)}
                    className="px-6 py-2 rounded-xl bg-[#1a6838] text-white font-bold text-xs mt-2"
                  >
                    Sulge
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setOrderSubmitted(true);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div className="p-3 bg-[#f4f8f5] rounded-xl border border-[#8ab897]/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 text-sm block">«{selectedBookForOrder.title}»</span>
                      <span className="text-stone-500">{selectedBookForOrder.author}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#1a6838] text-base">{selectedBookForOrder.price * orderQuantity} €</span>
                      <div className="text-[10px] text-stone-500">({selectedBookForOrder.price} € / tk)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="font-bold text-stone-700">Kogus:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-6 text-center">{orderQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nimi</label>
                    <input
                      type="text"
                      required
                      placeholder="Sinu ees- ja perekonnanimi"
                      value={orderData.name}
                      onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">E-post</label>
                      <input
                        type="email"
                        required
                        placeholder="sinu@epost.ee"
                        value={orderData.email}
                        onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Telefon</label>
                      <input
                        type="tel"
                        required
                        placeholder="+372 5..."
                        value={orderData.phone}
                        onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Pakiautomaadi asukoht või postiaadress</label>
                    <input
                      type="text"
                      required
                      placeholder="nt Omniva / Smartpost Tallinna Kristiine Keskus"
                      value={orderData.address}
                      onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm shadow-xs transition-colors mt-2"
                  >
                    Kinnita tellimus ({selectedBookForOrder.price * orderQuantity} €)
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. ADMIN PANEL MODAL (CMS, REAALAJAS MUUTMINE, DOCKER & PORTAINER) */}
      {/* ========================================================================= */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#8ab897]/40 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1a6838] text-white flex items-center justify-between border-b border-[#14542d]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display">Kirjastus Saagu Valgus – Admin Paneel</h3>
                  <p className="text-xs text-emerald-100">Kogu veebilehe sisu reaalajas muutmine ja seadistused</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Toast */}
            {saveSuccessMsg && (
              <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 justify-center shadow-inner">
                <CheckCircle2 className="w-4 h-4" />
                <span>Muudatused on salvestatud ja koheselt lehel nähtavad!</span>
              </div>
            )}

            {/* Modal Body */}
            {!isAdminAuthenticated ? (
              /* Password Gate */
              <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#1a6838]/10 text-[#1a6838] flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-display text-[#144225]">Logi sisse administraatorina</h4>
                  <p className="text-xs text-stone-500">Sisesta parool lehe sisu muutmiseks.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="Sisesta parool (nt. admin)"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                    />
                    {adminAuthError && (
                      <p className="text-xs text-red-600 mt-1.5 font-medium">Vale parool! (Vihje: proovi 'admin' või '1234')</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Logi sisse</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminPasswordInput('admin');
                        setIsAdminAuthenticated(true);
                      }}
                      className="px-4 py-3 rounded-xl bg-[#f4f8f5] hover:bg-[#e8f1eb] text-[#1a6838] border border-[#8ab897]/40 text-xs font-bold"
                    >
                      Kiirvalik
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Authenticated Admin CMS View */
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Admin Sidebar Navigation */}
                <div className="w-full md:w-56 bg-[#f4f8f5] border-r border-[#8ab897]/20 p-3 space-y-1 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0">
                  <button
                    onClick={() => setAdminTab('general')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'general' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <Edit3 className="w-4 h-4 shrink-0" />
                    <span>Üldine & Päis</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('questions')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'questions' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">?</span>
                    <span>3 Põhiküsimust</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('cleanliness')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'cleanliness' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Puhas kodu</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('testimonials')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'testimonials' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <Video className="w-4 h-4 shrink-0" />
                    <span>Tunnistused ({content.testimonials.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('publisher')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'publisher' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>Kirjastus & Raamatud</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('support')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'support' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Tule toetajaks!</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('prayers')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'prayers' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <Flame className="w-4 h-4 shrink-0" />
                    <span>Palved (Pääste & Meie Isa)</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('docker')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'docker' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <Server className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Docker & Portainer</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('backup')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'backup' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>Varundus / JSON</span>
                  </button>
                </div>

                {/* Admin Tab Content */}
                <div className="flex-1 p-5 sm:p-7 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                  
                  {/* TAB 1: GENERAL */}
                  {adminTab === 'general' && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Üldised seaded ja päise tekstid</h4>
                        <p className="text-xs text-stone-500">Muuda lehe pealkirju, kontaktmeili ja hüüdlauset</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Kirjastuse Nimi</label>
                          <input
                            type="text"
                            value={content.brandName}
                            onChange={(e) => saveContent({ ...content, brandName: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Kontakt E-post</label>
                          <input
                            type="email"
                            value={content.contactEmail}
                            onChange={(e) => saveContent({ ...content, contactEmail: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Päise bänner / hüüdlause</label>
                        <input
                          type="text"
                          value={content.heroBadge}
                          onChange={(e) => saveContent({ ...content, heroBadge: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Pealkiri 1. osa</label>
                          <input
                            type="text"
                            value={content.heroTitle}
                            onChange={(e) => saveContent({ ...content, heroTitle: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Pealkiri 2. osa (Roheline rõhk)</label>
                          <input
                            type="text"
                            value={content.heroHighlight}
                            onChange={(e) => saveContent({ ...content, heroHighlight: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Päise sissejuhatav tekst</label>
                        <textarea
                          rows={3}
                          value={content.heroDescription}
                          onChange={(e) => saveContent({ ...content, heroDescription: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                        />
                      </div>

                      {/* 3 Core verses editor */}
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-[#1a6838] uppercase">Päise 3 Piibli kirjakohta</span>
                        {content.coreVerses.map((verse, idx) => (
                          <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={verse.ref}
                                onChange={(e) => {
                                  const updated = [...content.coreVerses];
                                  updated[idx].ref = e.target.value;
                                  saveContent({ ...content, coreVerses: updated });
                                }}
                                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                              />
                              <input
                                type="text"
                                placeholder="Teema (nt Jumala armastus)"
                                value={verse.theme || ''}
                                onChange={(e) => {
                                  const updated = [...content.coreVerses];
                                  updated[idx].theme = e.target.value;
                                  saveContent({ ...content, coreVerses: updated });
                                }}
                                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={verse.text}
                              onChange={(e) => {
                                const updated = [...content.coreVerses];
                                updated[idx].text = e.target.value;
                                saveContent({ ...content, coreVerses: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs italic"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: QUESTIONS */}
                  {adminTab === 'questions' && (
                    <div className="space-y-6">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Trükise 3 põhiküsimuse sisu ja vastused</h4>
                        <p className="text-xs text-stone-500">Muuda trükise tsitaate, Piibli vastuseid ja kirjakohti</p>
                      </div>

                      {content.tractQuestions.map((q, qIndex) => (
                        <div key={q.id} className="p-5 rounded-2xl border border-stone-200 bg-[#fcfdfc] space-y-4 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
                              ?
                            </span>
                            <h5 className="font-bold text-sm text-[#144225]">Küsimus {q.number}</h5>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">Küsimuse pealkiri</label>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => {
                                const updated = [...content.tractQuestions];
                                updated[qIndex].question = e.target.value;
                                saveContent({ ...content, tractQuestions: updated });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">Trükise tsitaat</label>
                            <textarea
                              rows={2}
                              value={q.tractQuote}
                              onChange={(e) => {
                                const updated = [...content.tractQuestions];
                                updated[qIndex].tractQuote = e.target.value;
                                saveContent({ ...content, tractQuestions: updated });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none italic"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">Piibli vastus ja selgitus</label>
                            <textarea
                              rows={3}
                              value={q.biblicalAnswer}
                              onChange={(e) => {
                                const updated = [...content.tractQuestions];
                                updated[qIndex].biblicalAnswer = e.target.value;
                                saveContent({ ...content, tractQuestions: updated });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2 pt-1">
                            <span className="text-xs font-bold text-[#1a6838] uppercase">Kirjakohad ({q.bibleVerses.length})</span>
                            {q.bibleVerses.map((verse, vIdx) => (
                              <div key={vIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                                <input
                                  type="text"
                                  placeholder="Viide (nt Johannese 14:6)"
                                  value={verse.ref}
                                  onChange={(e) => {
                                    const updated = [...content.tractQuestions];
                                    updated[qIndex].bibleVerses[vIdx].ref = e.target.value;
                                    saveContent({ ...content, tractQuestions: updated });
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  placeholder="Salmi tekst"
                                  value={verse.text}
                                  onChange={(e) => {
                                    const updated = [...content.tractQuestions];
                                    updated[qIndex].bibleVerses[vIdx].text = e.target.value;
                                    saveContent({ ...content, tractQuestions: updated });
                                  }}
                                  className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs italic"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: CLEANLINESS */}
                  {adminTab === 'cleanliness' && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">«Hoia oma kodu puhas!» sektsioon</h4>
                        <p className="text-xs text-stone-500">Vaimuliku puhtuse hoiatus ja vabanemise 3 sammu</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Alampealkiri</label>
                          <input
                            type="text"
                            value={content.cleanlinessSubtitle}
                            onChange={(e) => saveContent({ ...content, cleanlinessSubtitle: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Põhipealkiri</label>
                          <input
                            type="text"
                            value={content.cleanlinessTitle}
                            onChange={(e) => saveContent({ ...content, cleanlinessTitle: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Selgitav tekst / hoiatus</label>
                        <textarea
                          rows={3}
                          value={content.cleanlinessDescription}
                          onChange={(e) => saveContent({ ...content, cleanlinessDescription: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TESTIMONIALS & YOUTUBE */}
                  {adminTab === 'testimonials' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                        <div>
                          <h4 className="font-bold text-base text-[#144225]">Tunnistused ja YouTube videod</h4>
                          <p className="text-xs text-stone-500">Lisa lugusid ja manusta YouTube videoid</p>
                        </div>
                        <button
                          onClick={() => {
                            const newTest: TestimonialItem = {
                              id: `tunnistus-${Date.now()}`,
                              title: 'Uus tunnistus',
                              person: 'Isiklik lugu',
                              type: 'vabanemine',
                              summary: 'Lühike kokkuvõte loost...',
                              fullStory: 'Täielik kirjeldus sellest, mida Jumal tegi...',
                              youtubeId: ''
                            };
                            saveContent({ ...content, testimonials: [...content.testimonials, newTest] });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Lisa tunnistus</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {content.testimonials.map((test, tIdx) => (
                          <div key={test.id} className="p-4 rounded-2xl border border-stone-200 bg-[#fcfdfc] space-y-3 relative shadow-2xs">
                            <button
                              onClick={() => {
                                if (window.confirm(`Kustuta tunnistus "${test.title}"?`)) {
                                  const updated = content.testimonials.filter((_, idx) => idx !== tIdx);
                                  saveContent({ ...content, testimonials: updated });
                                }
                              }}
                              className="absolute top-4 right-4 p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-10">
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Pealkiri</label>
                                <input
                                  type="text"
                                  value={test.title}
                                  onChange={(e) => {
                                    const updated = [...content.testimonials];
                                    updated[tIdx].title = e.target.value;
                                    saveContent({ ...content, testimonials: updated });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">YouTube Video ID (nt dQw4w9WgXcQ)</label>
                                <input
                                  type="text"
                                  placeholder="Jäta tühjaks kui videot pole"
                                  value={test.youtubeId || ''}
                                  onChange={(e) => {
                                    const updated = [...content.testimonials];
                                    updated[tIdx].youtubeId = e.target.value.trim();
                                    saveContent({ ...content, testimonials: updated });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Lühikokkuvõte</label>
                              <textarea
                                rows={2}
                                value={test.summary}
                                onChange={(e) => {
                                  const updated = [...content.testimonials];
                                  updated[tIdx].summary = e.target.value;
                                  saveContent({ ...content, testimonials: updated });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: PUBLISHER & BOOKS */}
                  {adminTab === 'publisher' && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Kirjastuse sünnilugu ja raamatud</h4>
                        <p className="text-xs text-stone-500">Muuda tutvustust ja raamatute hindu ning kirjeldusi</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Sünniloo pealkiri</label>
                        <input
                          type="text"
                          value={content.publisherStoryTitle}
                          onChange={(e) => saveContent({ ...content, publisherStoryTitle: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Sünniloo kirjeldus</label>
                        <textarea
                          rows={3}
                          value={content.publisherStoryText}
                          onChange={(e) => saveContent({ ...content, publisherStoryText: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>

                      <div className="space-y-4 pt-2">
                        <span className="text-xs font-bold text-[#1a6838] uppercase">Raamatute nimekiri ({content.books.length})</span>
                        {content.books.map((book, bIdx) => (
                          <div key={book.id} className="p-4 rounded-2xl border border-stone-200 bg-[#fcfdfc] space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Pealkiri</label>
                                <input
                                  type="text"
                                  value={book.title}
                                  onChange={(e) => {
                                    const updated = [...content.books];
                                    updated[bIdx].title = e.target.value;
                                    saveContent({ ...content, books: updated });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Hind (€)</label>
                                <input
                                  type="number"
                                  value={book.price}
                                  onChange={(e) => {
                                    const updated = [...content.books];
                                    updated[bIdx].price = Number(e.target.value);
                                    saveContent({ ...content, books: updated });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Kirjeldus</label>
                              <textarea
                                rows={2}
                                value={book.description}
                                onChange={(e) => {
                                  const updated = [...content.books];
                                  updated[bIdx].description = e.target.value;
                                  saveContent({ ...content, books: updated });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: SUPPORT */}
                  {adminTab === 'support' && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Toetuse ja pangakonto andmed</h4>
                        <p className="text-xs text-stone-500">Muuda pangakonto numbrit, saaja nime ja toetusinfot</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Saaja Nimi</label>
                          <input
                            type="text"
                            value={content.support.recipientName}
                            onChange={(e) => saveContent({ ...content, support: { ...content.support, recipientName: e.target.value } })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">IBAN Kontonumber</label>
                          <input
                            type="text"
                            value={content.support.iban}
                            onChange={(e) => saveContent({ ...content, support: { ...content.support, iban: e.target.value } })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono font-bold text-[#1a6838]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Pank</label>
                          <input
                            type="text"
                            value={content.support.bankName}
                            onChange={(e) => saveContent({ ...content, support: { ...content.support, bankName: e.target.value } })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Selgitus</label>
                          <input
                            type="text"
                            value={content.support.explanation}
                            onChange={(e) => saveContent({ ...content, support: { ...content.support, explanation: e.target.value } })}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Toetuse kirjeldav tekst</label>
                        <textarea
                          rows={3}
                          value={content.support.description}
                          onChange={(e) => saveContent({ ...content, support: { ...content.support, description: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 7: PRAYERS */}
                  {adminTab === 'prayers' && (
                    <div className="space-y-6">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Päästepalve ja Meie Isa palve</h4>
                        <p className="text-xs text-stone-500">Muuda palvete tekste ja sissejuhatusi</p>
                      </div>

                      <div className="space-y-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <h5 className="font-bold text-sm text-[#144225] flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-[#1a6838]" />
                          <span>Päästepalve</span>
                        </h5>
                        <textarea
                          rows={6}
                          value={content.salvationPrayerText}
                          onChange={(e) => saveContent({ ...content, salvationPrayerText: e.target.value })}
                          className="w-full p-3 rounded-xl border border-stone-300 text-sm font-serif"
                        />
                      </div>

                      <div className="space-y-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <h5 className="font-bold text-sm text-[#144225] flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#1a6838]" />
                          <span>Meie Isa palve</span>
                        </h5>
                        <textarea
                          rows={8}
                          value={content.lordPrayer.text}
                          onChange={(e) => saveContent({ ...content, lordPrayer: { ...content.lordPrayer, text: e.target.value } })}
                          className="w-full p-3 rounded-xl border border-stone-300 text-sm font-serif leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 8: DOCKER & PORTAINER */}
                  {adminTab === 'docker' && (
                    <div className="space-y-6">
                      <div className="border-b border-stone-200 pb-3">
                        <div className="flex items-center gap-2">
                          <Server className="w-5 h-5 text-emerald-700" />
                          <h4 className="font-bold text-base text-[#144225]">Docker & Portainer Paigaldusjuhend</h4>
                        </div>
                        <p className="text-xs text-stone-500">Portainer Stack ja Nginx Reverse Proxy konfiguratsioon pordile 3002</p>
                      </div>

                      {/* Docker Compose File */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1a6838] uppercase font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" />
                            <span>docker-compose.yml (Port 3002)</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(`version: '3.8'

services:
  saaguvalgus-app:
    build:
      context: .
      dockerfile: Dockerfile
    image: saaguvalgus-web:latest
    container_name: saaguvalgus_web
    restart: unless-stopped
    ports:
      - "3002:80"
    environment:
      - NODE_ENV=production`, 'compose')}
                            className="px-2.5 py-1 rounded-lg bg-[#f4f8f5] hover:bg-[#e8f1eb] text-xs font-semibold text-[#1a6838] border border-[#8ab897]/40 flex items-center gap-1"
                          >
                            {copiedDockerCmd === 'compose' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedDockerCmd === 'compose' ? 'Kopeeritud!' : 'Kopeeri'}</span>
                          </button>
                        </div>
                        <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
{`version: '3.8'

services:
  saaguvalgus-app:
    build:
      context: .
      dockerfile: Dockerfile
    image: saaguvalgus-web:latest
    container_name: saaguvalgus_web
    restart: unless-stopped
    ports:
      - "3002:80"
    environment:
      - NODE_ENV=production`}
                        </pre>
                      </div>

                      {/* Nginx Reverse Proxy helper */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1a6838] uppercase font-mono flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5" />
                            <span>Nginx Reverse Proxy (/saaguvalgus/ alamkaust)</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(`location /saaguvalgus/ {
    proxy_pass http://127.0.0.1:3002/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}`, 'nginx-proxy')}
                            className="px-2.5 py-1 rounded-lg bg-[#f4f8f5] hover:bg-[#e8f1eb] text-xs font-semibold text-[#1a6838] border border-[#8ab897]/40 flex items-center gap-1"
                          >
                            {copiedDockerCmd === 'nginx-proxy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedDockerCmd === 'nginx-proxy' ? 'Kopeeritud!' : 'Kopeeri'}</span>
                          </button>
                        </div>
                        <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
{`location /saaguvalgus/ {
    proxy_pass http://127.0.0.1:3002/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* TAB 9: BACKUP & JSON */}
                  {adminTab === 'backup' && (
                    <div className="space-y-6">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Andmete Varundus ja Taastamine</h4>
                        <p className="text-xs text-stone-500">Ekspordi kogu lehe sisu JSON failina või taasta varem salvestatud failist</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-[#fcfdfc] border border-stone-200 rounded-2xl space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1a6838]/10 text-[#1a6838] flex items-center justify-center">
                            <Download className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-[#144225]">Laadi alla JSON varukoopia</h5>
                            <p className="text-xs text-stone-500 mt-0.5">Salvesta kõik tekstid oma arvutisse failina.</p>
                          </div>
                          <button
                            onClick={handleExportJSON}
                            className="w-full py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Download className="w-4 h-4" />
                            <span>Laadi alla (JSON)</span>
                          </button>
                        </div>

                        <div className="p-5 bg-[#fcfdfc] border border-stone-200 rounded-2xl space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-[#144225]">Impordi JSON fail</h5>
                            <p className="text-xs text-stone-500 mt-0.5">Laadi üles varem salvestatud tekstide fail.</p>
                          </div>
                          <label className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-stone-300">
                            <Upload className="w-4 h-4" />
                            <span>Vali JSON fail</span>
                            <input
                              type="file"
                              accept=".json,application/json"
                              onChange={handleImportJSON}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-xs text-red-800 block">Taasta algsed trükise tekstid</span>
                          <span className="text-[11px] text-red-700">Tühjendab kohalikud muudatused ja taastab esialgse sisu.</span>
                        </div>
                        <button
                          onClick={handleResetToDefault}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Taasta algseaded</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
              <div className="text-stone-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Kirjastus Saagu Valgus CMS</span>
              </div>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white font-bold text-xs transition-colors shadow-2xs"
              >
                Sulge paneel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
