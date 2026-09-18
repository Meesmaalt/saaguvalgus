import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Flame, 
  ShieldAlert, 
  Mail, 
  Printer, 
  Check, 
  Copy, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Sparkles, 
  Send,
  Settings,
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
  ExternalLink,
  Edit3
} from 'lucide-react';
import { INITIAL_SITE_CONTENT } from './data';
import { SiteContent, QuestionItem, BookItem, BibleVerse } from './types';

const STORAGE_KEY = 'saaguvalgus_site_content_v1';

// Official Kirjastus Saagu Valgus Brand Logo (matching the provided brand design)
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Admin Modal & State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState(false);
  const [adminTab, setAdminTab] = useState<'general' | 'questions' | 'cleanliness' | 'prayer' | 'books' | 'docker' | 'backup'>('general');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [copiedDockerCmd, setCopiedDockerCmd] = useState('');

  // Save to localStorage whenever content changes
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

  const handleCopyPrayer = () => {
    navigator.clipboard.writeText(content.salvationPrayerText);
    setCopiedPrayer(true);
    setTimeout(() => setCopiedPrayer(false), 2000);
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

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDockerCmd(label);
    setTimeout(() => setCopiedDockerCmd(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#1c2e24] flex flex-col font-sans selection:bg-[#8ab897]/30 selection:text-[#1a6838]">
      
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#8ab897]/20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <a href="#" className="flex items-center hover:opacity-90 transition-opacity">
            <BrandLogo size="md" />
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#2c4c3b]">
            <button onClick={() => scrollTo('kusimused')} className="hover:text-[#1a6838] transition-colors">
              3 Põhiküsimust
            </button>
            <button onClick={() => scrollTo('hoia-kodu-puhas-sec')} className="hover:text-[#1a6838] transition-colors flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#1a6838]" />
              <span>Hoia kodu puhas</span>
            </button>
            <button onClick={() => scrollTo('paastepalve')} className="hover:text-[#1a6838] transition-colors flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#1a6838]" />
              <span>Päästepalve</span>
            </button>
            <button onClick={() => scrollTo('kirjastus')} className="hover:text-[#1a6838] transition-colors">
              Kirjastus & Raamatud
            </button>
            <button onClick={() => scrollTo('kontakt')} className="hover:text-[#1a6838] transition-colors">
              Kontakt
            </button>
          </nav>

          {/* Actions: Admin & Print & Prayer */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              title="Ava Admin Paneel (Muuda sisu / Portainer)"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#f4f8f5] hover:bg-[#e8f1eb] text-[#1a6838] border border-[#8ab897]/40 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Settings className="w-4 h-4 text-[#1a6838]" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden lg:flex px-3 py-2 rounded-xl bg-white hover:bg-[#f4f8f5] text-[#1a6838] border border-[#8ab897]/40 text-xs font-bold items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#1a6838]" />
              <span>Prindi</span>
            </button>

            <button
              onClick={() => scrollTo('paastepalve')}
              className="px-3.5 py-2 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Päästepalve</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-[#f4f8f5] via-white to-white border-b border-[#8ab897]/20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none cross-pattern opacity-40" />

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

          {/* 3 Core Bible Verses */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-left">
            {content.coreVerses.map((v, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#1a6838] uppercase tracking-wider">{v.ref}</span>
                  <p className="text-xs sm:text-sm italic font-serif text-[#1c2e24]">«{v.text}»</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Selection Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {content.tractQuestions.slice(0, 2).map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestion(q.id);
                  scrollTo('kusimused');
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#f4f8f5] border border-[#8ab897]/50 text-xs sm:text-sm font-bold text-[#1a6838] flex items-center gap-2 shadow-2xs transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">?</span>
                <span>{q.number}. {q.question.split('–')[0].replace('?', '')}?</span>
              </button>
            ))}

            <button
              onClick={() => {
                setActiveQuestion('hoia-kodu-puhas');
                scrollTo('hoia-kodu-puhas-sec');
              }}
              className="px-4 py-2 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>3. Hoia oma kodu puhas!</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. The 3 Questions Section */}
      <section id="kusimused" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#1a6838] font-bold">
            Trükise 3 põhiküsimust
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#144225]">
            Vastused, mis muudavad elu
          </h2>
          <p className="text-sm text-[#41624f]">
            Vali küsimus, et lugeda Piibli selgitust ja praktilist tõde
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 bg-[#f4f8f5] p-2 rounded-2xl border border-[#8ab897]/30 max-w-2xl mx-auto">
          {content.tractQuestions.map((q) => {
            const isSelected = activeQuestion === q.id;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestion(q.id)}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected 
                    ? 'bg-[#1a6838] text-white shadow-sm' 
                    : 'text-[#2b4c3b] hover:bg-white/60'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                  isSelected ? 'bg-white text-[#1a6838]' : 'bg-red-600 text-white'
                }`}>
                  {q.number}
                </span>
                <span className="truncate">{q.number}. {q.id === 'igauele-oma-jumal' ? '«Oma jumal»' : q.id === 'hea-inimene-paasemine' ? 'Hea inimene?' : 'Puhas kodu'}</span>
              </button>
            );
          })}
        </div>

        {/* Active Question Content Card */}
        {(() => {
          const current = content.tractQuestions.find(q => q.id === activeQuestion) || content.tractQuestions[0];
          return (
            <div className="bg-white rounded-3xl border border-[#8ab897]/30 p-6 sm:p-10 shadow-sm space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                  {current.number}
                </div>
                <div>
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
                <p className="text-sm sm:text-base text-[#243d2e] leading-relaxed">
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
                  <h5 className="font-bold text-[#1a6838] text-sm">
                    Kuidas teha oma kodu vaimulikult puhtaks?
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
      <section id="hoia-kodu-puhas-sec" className="py-12 sm:py-16 bg-[#1a6838] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
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
              <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/20">
                <span className="font-bold text-sm text-[#8ab897] block mb-1">{step.title}</span>
                <p className="text-xs text-white/90">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Salvation Prayer Section */}
      <section id="paastepalve" className="py-14 sm:py-20 bg-[#f4f8f5] border-y border-[#8ab897]/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          
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
                Palveta seda südamest:
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

      {/* 6. Publisher & Books Section */}
      <section id="kirjastus" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#8ab897]/20">
          <div>
            <BrandLogo size="lg" />
            <p className="text-sm text-[#385643] mt-2">
              {content.brandTagline}
            </p>
          </div>
          <button
            onClick={() => scrollTo('kontakt')}
            className="px-5 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Küsige raamatuid / trükiseid</span>
          </button>
        </div>

        {/* Books Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.books.map((book) => (
            <div key={book.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#8ab897]/30 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#8ab897] uppercase tracking-wider">{book.category}</span>
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
                  onClick={() => scrollTo('kontakt')}
                  className="text-xs font-bold text-[#1a6838] hover:underline flex items-center gap-1"
                >
                  <span>Huvi raamatu vastu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 7. Contact Section */}
      <section id="kontakt" className="py-14 sm:py-20 bg-[#f4f8f5] border-t border-[#8ab897]/20">
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

      {/* 8. Footer */}
      <footer className="bg-white border-t border-[#8ab897]/20 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#385643]">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>© {new Date().getFullYear()} {content.brandName}</span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <button onClick={() => scrollTo('kusimused')} className="hover:text-[#1a6838]">3 Põhiküsimust</button>
            <button onClick={() => scrollTo('paastepalve')} className="hover:text-[#1a6838]">Päästepalve</button>
            <button onClick={() => scrollTo('kirjastus')} className="hover:text-[#1a6838]">Kirjastus</button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#1a6838] flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" />
              <span>Admin & Portainer</span>
            </button>
            <a href={`mailto:${content.contactEmail}`} className="hover:text-[#1a6838]">{content.contactEmail}</a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 9. ADMIN PANEL MODAL (CMS & DOCKER/PORTAINER MANAGEMENT) */}
      {/* ========================================================================= */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#8ab897]/40 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1a6838] text-white flex items-center justify-between border-b border-[#14542d]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display">Kirjastus Saagu Valgus – Admin Paneel</h3>
                  <p className="text-xs text-emerald-100">Sisu haldus, reaalajas muutmine ja Portainer / Docker paigaldus</p>
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
                  <p className="text-xs text-stone-500">Sisesta parool lehe sisu muutmiseks või Docker failide vaatamiseks.</p>
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
                    <span>Üldine & Kontakt</span>
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
                    <span>Hoia kodu puhas</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('prayer')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'prayer' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <Flame className="w-4 h-4 shrink-0" />
                    <span>Päästepalve</span>
                  </button>

                  <button
                    onClick={() => setAdminTab('books')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                      adminTab === 'books' ? 'bg-[#1a6838] text-white shadow-xs' : 'text-[#2c4c3b] hover:bg-white/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>Raamatud ({content.books.length})</span>
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
                  
                  {/* TAB 1: GENERAL & CONTACT */}
                  {adminTab === 'general' && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Üldised seaded ja päise tekstid</h4>
                        <p className="text-xs text-stone-500">Muuda lehe pealkirju, meiliaadressi ja hüüdlauset</p>
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

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Kirjastuse missioon / allkirjatekst</label>
                        <textarea
                          rows={2}
                          value={content.brandTagline}
                          onChange={(e) => saveContent({ ...content, brandTagline: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: 3 QUESTIONS */}
                  {adminTab === 'questions' && (
                    <div className="space-y-6">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">3 Põhiküsimuse sisu ja vastused</h4>
                        <p className="text-xs text-stone-500">Muuda trükise tsitaate, Piibli vastuseid ja kirjakohti</p>
                      </div>

                      {content.tractQuestions.map((q, qIndex) => (
                        <div key={q.id} className="p-5 rounded-2xl border border-stone-200 bg-[#fcfdfc] space-y-4 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
                              {q.number}
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

                          {/* Verses Editor */}
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

                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-[#1a6838] uppercase">3 Vabanemise sammu</span>
                        {content.cleanlinessSteps.map((step, idx) => (
                          <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const updated = [...content.cleanlinessSteps];
                                updated[idx].title = e.target.value;
                                saveContent({ ...content, cleanlinessSteps: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                            />
                            <textarea
                              rows={2}
                              value={step.desc}
                              onChange={(e) => {
                                const updated = [...content.cleanlinessSteps];
                                updated[idx].desc = e.target.value;
                                saveContent({ ...content, cleanlinessSteps: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PRAYER */}
                  {adminTab === 'prayer' && (
                    <div className="space-y-5">
                      <div className="border-b border-stone-200 pb-3">
                        <h4 className="font-bold text-base text-[#144225]">Päästepalve ja järgmised sammud</h4>
                        <p className="text-xs text-stone-500">Muuda palve sõnastust ja uue usuelu juhendeid</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Palve pealkiri</label>
                        <input
                          type="text"
                          value={content.salvationPrayerTitle}
                          onChange={(e) => saveContent({ ...content, salvationPrayerTitle: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Sissejuhatav selgitus</label>
                        <input
                          type="text"
                          value={content.salvationPrayerIntro}
                          onChange={(e) => saveContent({ ...content, salvationPrayerIntro: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Päästepalve täistekst</label>
                        <textarea
                          rows={8}
                          value={content.salvationPrayerText}
                          onChange={(e) => saveContent({ ...content, salvationPrayerText: e.target.value })}
                          className="w-full p-4 rounded-xl border border-stone-300 text-sm font-serif leading-relaxed"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-[#1a6838] uppercase">3 Sammu pärast palvetamist</span>
                        {content.salvationPrayerNextSteps.map((step, idx) => (
                          <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const updated = [...content.salvationPrayerNextSteps];
                                updated[idx].title = e.target.value;
                                saveContent({ ...content, salvationPrayerNextSteps: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                            />
                            <textarea
                              rows={2}
                              value={step.desc}
                              onChange={(e) => {
                                const updated = [...content.salvationPrayerNextSteps];
                                updated[idx].desc = e.target.value;
                                saveContent({ ...content, salvationPrayerNextSteps: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: BOOKS */}
                  {adminTab === 'books' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                        <div>
                          <h4 className="font-bold text-base text-[#144225]">Kirjastuse Raamatud</h4>
                          <p className="text-xs text-stone-500">Lisa uusi raamatuid või muuda olemasolevaid tutvustusi</p>
                        </div>
                        <button
                          onClick={() => {
                            const newBook: BookItem = {
                              id: `raamat-${Date.now()}`,
                              title: 'Uus raamat',
                              author: 'Kirjastus Saagu Valgus',
                              category: 'Vaimulik kirjandus',
                              description: 'Raamatu lühitutvustus ja peamine sõnum...',
                              highlights: ['Oluline punkt 1', 'Oluline punkt 2']
                            };
                            saveContent({ ...content, books: [...content.books, newBook] });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Lisa raamat</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {content.books.map((book, bIdx) => (
                          <div key={book.id} className="p-4 rounded-2xl border border-stone-200 bg-[#fcfdfc] space-y-3 relative shadow-2xs">
                            <button
                              onClick={() => {
                                if (window.confirm(`Kustuta raamat "${book.title}"?`)) {
                                  const updated = content.books.filter((_, idx) => idx !== bIdx);
                                  saveContent({ ...content, books: updated });
                                }
                              }}
                              className="absolute top-4 right-4 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              title="Kustuta raamat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-10">
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Raamatu pealkiri</label>
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
                                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Kategooria</label>
                                <input
                                  type="text"
                                  value={book.category}
                                  onChange={(e) => {
                                    const updated = [...content.books];
                                    updated[bIdx].category = e.target.value;
                                    saveContent({ ...content, books: updated });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
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

                  {/* TAB 6: DOCKER & PORTAINER */}
                  {adminTab === 'docker' && (
                    <div className="space-y-6">
                      <div className="border-b border-stone-200 pb-3">
                        <div className="flex items-center gap-2">
                          <Server className="w-5 h-5 text-emerald-700" />
                          <h4 className="font-bold text-base text-[#144225]">Docker & Portainer Paigaldusjuhend</h4>
                        </div>
                        <p className="text-xs text-stone-500">Kuidas panna see leht tööle oma serveris Portaineri või Docker Compose abil</p>
                      </div>

                      {/* Step by Step Portainer guide */}
                      <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3">
                        <h5 className="font-bold text-sm text-[#144225] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Kiirjuhend: Paigaldus Portainerisse (Stack)</span>
                        </h5>
                        <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#203c2c] leading-relaxed">
                          <li>Ava oma <strong>Portainer</strong> administraatori liides.</li>
                          <li>Mine vasakult menüüst <strong>Stacks</strong> &gt; vajuta <strong>«Add stack»</strong>.</li>
                          <li>Pane nimeks näiteks <code className="bg-white px-1.5 py-0.5 rounded border font-mono">saaguvalgus</code>.</li>
                          <li>Vali <strong>«Web editor»</strong> ja kleebi sinna allolev <code className="bg-white px-1.5 py-0.5 rounded border font-mono">docker-compose.yml</code> sisu.</li>
                          <li>Vajuta all <strong>«Deploy the stack»</strong>. Valmis! Leht töötab pordil <strong>3002</strong> (või sinu valitud pordil).</li>
                        </ol>
                      </div>

                      {/* Docker Compose File */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1a6838] uppercase font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" />
                            <span>docker-compose.yml</span>
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

                      {/* Dockerfile */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1a6838] uppercase font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" />
                            <span>Dockerfile (Multi-stage Nginx)</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(`FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`, 'dockerfile')}
                            className="px-2.5 py-1 rounded-lg bg-[#f4f8f5] hover:bg-[#e8f1eb] text-xs font-semibold text-[#1a6838] border border-[#8ab897]/40 flex items-center gap-1"
                          >
                            {copiedDockerCmd === 'dockerfile' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedDockerCmd === 'dockerfile' ? 'Kopeeritud!' : 'Kopeeri'}</span>
                          </button>
                        </div>
                        <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
{`FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
                        </pre>
                      </div>

                      {/* Command line quick start */}
                      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 space-y-2">
                        <span className="font-bold text-xs text-stone-800 block">Käsurealt käivitamine (Terminal):</span>
                        <div className="p-2.5 bg-black text-emerald-400 font-mono text-xs rounded-lg flex items-center justify-between">
                          <span>docker compose up -d --build</span>
                          <button 
                            onClick={() => copyToClipboard('docker compose up -d --build', 'cli')}
                            className="text-stone-400 hover:text-white"
                          >
                            {copiedDockerCmd === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Nginx Reverse Proxy Config helper */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1a6838] uppercase font-mono flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5" />
                            <span>Sinu serveri Nginx Reverse Proxy seadistus (nt /saaguvalgus/ või domeen)</span>
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

                  {/* TAB 7: BACKUP & JSON */}
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
                            <p className="text-xs text-stone-500 mt-0.5">Salvesta kõik muudatused ja tekstid oma arvutisse failina.</p>
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
                            <p className="text-xs text-stone-500 mt-0.5">Laadi üles varem salvestatud tekstide varukoopia.</p>
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
                          <span className="text-[11px] text-red-700">Tühjendab kõik kohalikud muudatused ja taastab esialgse kanoonilise sisu.</span>
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
                <span>Automaatselt salvestuv CMS</span>
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
