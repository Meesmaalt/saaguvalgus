import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Share2, 
  Check, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { PublicationItem } from './types';
import { UI_TRANSLATIONS, Language } from './translations';
import { analytics } from './analytics';
import { copyText } from './clipboard';

interface PublicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  publications: PublicationItem[];
  initialPublicationId?: string;
  lang?: Language;
}

export const PublicationsModal: React.FC<PublicationsModalProps> = ({
  isOpen,
  onClose,
  publications,
  initialPublicationId,
  lang = 'et',
}) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    return initialPublicationId || publications[0]?.id || '';
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWideMode, setIsWideMode] = useState(false);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab') {
        const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, iframe') || []);
        const visible = nodes.filter(node => node.getClientRects().length > 0);
        const first = visible[0], last = visible[visible.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  const t = UI_TRANSLATIONS[lang]?.publicationsModal || UI_TRANSLATIONS.et.publicationsModal;

  const currentPub = publications.find(p => p.id === selectedId) || publications[0];
  useEffect(() => {
    if (!isOpen) return;
    setCurrentPage(1);
    setZoomLevel(100);
    setCopiedLink(false);
    setCopyError('');
  }, [isOpen, currentPub?.id]);
  useEffect(() => {
    if (isOpen && initialPublicationId) setSelectedId(initialPublicationId);
  }, [isOpen, initialPublicationId]);

  if (!isOpen) return null;

  const totalPages = Math.max(1, Math.floor(Number(currentPub?.pdfUrl ? currentPub.pages : currentPub?.contentPages?.length || currentPub?.pages) || 1));
  const activePageData = currentPub?.contentPages?.find(p => p.pageNumber === currentPage) || currentPub?.contentPages?.[0];

  const categories = ['all', ...Array.from(new Set(publications.map(p => p.category)))];

  const filteredPubs = publications.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          (p.description || '').toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSelectPublication = (id: string) => {
    setSelectedId(id);
    setCurrentPage(1);
    setZoomLevel(100);
  };

  // Ultra-reliable, fast & non-blocking print handler
  const handlePrint = () => {
    if (!currentPub) return;

    if (currentPub.pdfUrl) {
      window.open(currentPub.pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      const printWindow = window.open('', '_blank', 'width=850,height=950,top=50,left=50');
      if (!printWindow) {
        window.print();
        return;
      }

      const escape = (value: string) => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
      const pagesHtml = (currentPub.contentPages && currentPub.contentPages.length > 0)
        ? currentPub.contentPages.map((cp) => `
            <div class="page-block">
              <div class="page-num">${t.page} ${cp.pageNumber} / ${totalPages}</div>
              <div class="page-heading">${escape(cp.heading)}</div>
              <div class="page-text">${escape(cp.text)}</div>
            </div>
          `).join('')
        : `
            <div class="page-block">
              <div class="page-heading">${escape(currentPub.title)}</div>
              <div class="page-text">${escape(currentPub.description)}</div>
            </div>
          `;

      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="${lang}">
          <head>
            <meta charset="utf-8">
            <title>${escape(currentPub.title)} - ${lang === 'en' ? 'Let There Be Light Publishing' : 'Kirjastus Saagu Valgus'}</title>
            <style>
              @page { 
                size: A4 portrait; 
                margin: 15mm 15mm 15mm 15mm; 
              }
              *, *:before, *:after { box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
                color: #1a2e22;
                background: #ffffff;
                line-height: 1.65;
                margin: 0;
                padding: 10px;
                font-size: 11pt;
              }
              .header {
                border-bottom: 2.5px solid #1a6838;
                padding-bottom: 12px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
              }
              .brand { font-size: 16pt; font-weight: 800; color: #144225; }
              .subbrand { font-size: 9pt; color: #4a6b56; }
              .date { font-size: 8.5pt; color: #777; }
              .category {
                display: inline-block;
                background: #eef6f1;
                color: #1a6838;
                border: 1px solid #c2e0cd;
                padding: 3px 9px;
                border-radius: 4px;
                font-size: 8.5pt;
                font-weight: 700;
                text-transform: uppercase;
                margin-bottom: 10px;
              }
              .title {
                font-size: 20pt;
                font-weight: 800;
                color: #144225;
                margin: 0 0 10px 0;
                line-height: 1.25;
              }
              .desc {
                font-style: italic;
                color: #444;
                margin: 0 0 25px 0;
                font-size: 10.5pt;
                padding-left: 10px;
                border-left: 3px solid #8ab897;
              }
              .page-block {
                margin-bottom: 35px;
                page-break-inside: avoid;
              }
              .page-num {
                font-size: 8.5pt;
                color: #888;
                text-align: right;
                margin-bottom: 6px;
                font-weight: 600;
              }
              .page-heading {
                font-size: 14pt;
                font-weight: 700;
                color: #1a6838;
                margin-bottom: 10px;
              }
              .page-text {
                font-size: 10.5pt;
                color: #222;
                white-space: pre-line;
                line-height: 1.7;
              }
              .footer {
                margin-top: 40px;
                border-top: 1px solid #ddd;
                padding-top: 12px;
                font-size: 8.5pt;
                color: #666;
                text-align: center;
                display: flex;
                justify-content: space-between;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="brand">${lang === 'en' ? 'Let There Be Light Publishing' : 'Kirjastus Saagu Valgus'}</div>
                <div class="subbrand">${lang === 'en' ? 'Christian literature & evangelistic resources' : 'Vaimulik kirjandus ja evangeelne materjal'}</div>
              </div>
              <div class="date">${new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'et-EE')}</div>
            </div>

            <span class="category">${currentPub.category || (lang === 'en' ? 'Publication' : 'Trükis')}</span>
            <h1 class="title">${escape(currentPub.title)}</h1>
            <p class="desc">${escape(currentPub.description)}</p>

            ${pagesHtml}

            <div class="footer">
              <span>${lang === 'en' ? 'Let There Be Light Publishing • info@saaguvalgus.eu' : 'Kirjastus Saagu Valgus • info@saaguvalgus.eu'}</span>
              <span>www.saaguvalgus.eu</span>
            </div>

            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                }, 250);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      console.error('Print error:', e);
      window.print();
    }
  };

  const handleDownload = () => {
    if (!currentPub) return;
    if (currentPub) {
      analytics.trackPublicationDownload(currentPub.title, currentPub.fileName);
    }

    if (currentPub?.pdfUrl) {
      const a = document.createElement('a');
      a.href = currentPub.pdfUrl;
      a.download = currentPub.fileName || `${currentPub.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const content = `======================================================
${lang === 'en' ? 'LET THERE BE LIGHT PUBLISHING' : 'KIRJASTUS SAAGU VALGUS'}
======================================================
${lang === 'en' ? 'Title' : 'Pealkiri'}: ${currentPub?.title}
${lang === 'en' ? 'Category' : 'Kategooria'}: ${currentPub?.category}
${lang === 'en' ? 'Author' : 'Autor'}: ${currentPub?.author || (lang === 'en' ? 'Let There Be Light Publishing' : 'Kirjastus Saagu Valgus')}
${lang === 'en' ? 'Date' : 'Kuupäev'}: ${currentPub?.uploadedAt || ''}
${lang === 'en' ? 'Description' : 'Kirjeldus'}: ${currentPub?.description}

------------------------------------------------------
${lang === 'en' ? 'CONTENT:' : 'SISU:'}
------------------------------------------------------
${(currentPub?.contentPages || []).map(p => `
[ ${lang === 'en' ? 'PAGE' : 'LEHEKÜLG'} ${p.pageNumber} ]
${p.heading.toUpperCase()}

${p.text}
`).join('\n------------------------------------------------------\n')}

======================================================
${lang === 'en' ? 'Let There Be Light Publishing' : 'Kirjastus Saagu Valgus'}
${lang === 'en' ? 'Website' : 'Koduleht'}: https://saaguvalgus.eu
${lang === 'en' ? 'Email' : 'E-post'}: info@saaguvalgus.eu
======================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentPub?.fileName ? currentPub.fileName.replace('.pdf', '.txt') : `${currentPub?.title || 'trukis'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    if (!currentPub) return;
    setCopyError('');
    try {
      await copyText(new URL(currentPub.pdfUrl || '#trukised', window.location.origin).href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopyError(lang === 'en' ? 'Could not copy the link. Please try again.' : 'Lingi kopeerimine ebaõnnestus. Palun proovi uuesti.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-5 overflow-hidden animate-in fade-in duration-150">
      
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={lang === 'en' ? 'Publications' : 'Trükised'} tabIndex={-1} className="bg-[#f8faf8] rounded-3xl border border-stone-200 shadow-2xl w-full max-w-[96vw] 2xl:max-w-[1520px] h-[94vh] flex flex-col overflow-hidden text-stone-900">
        
        {/* Top Header Bar */}
        <div className="bg-[#144225] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#1b5430] shrink-0">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isSidebarOpen ? (lang === 'en' ? 'Hide list' : 'Peida trükiste nimekiri') : (lang === 'en' ? 'Show list' : 'Näita trükiste nimekirja')}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5 text-emerald-300" /> : <PanelLeft className="w-5 h-5 text-amber-300" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold font-display tracking-tight leading-tight">{t.title}</h2>
                  <span className="text-[11px] font-semibold bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 hidden sm:block truncate max-w-md">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => setIsWideMode(!isWideMode)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold hidden md:flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isWideMode ? t.a4View : t.wideView}
            >
              {isWideMode ? <Minimize2 className="w-4 h-4 text-amber-300" /> : <Maximize2 className="w-4 h-4 text-emerald-300" />}
              <span>{isWideMode ? t.a4View : t.wideView}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={!currentPub}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title={t.print}
            >
              <Printer className="w-4 h-4" />
              <span>{t.print}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={!currentPub}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title={t.download}
            >
              <Download className="w-4 h-4 text-stone-900" />
              <span className="hidden sm:inline">{t.download}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Left Sidebar: Publications Selector */}
          {isSidebarOpen && (
            <div className="w-full md:w-72 lg:w-80 bg-white border-r border-stone-200 flex flex-col shrink-0 h-[min(35vh,18rem)] md:h-auto min-h-0 overflow-hidden animate-in slide-in-from-left-2 duration-150">
              
              {/* Search and Category Filter */}
              <div className="p-3 border-b border-stone-100 space-y-2 bg-stone-50/70">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a6838]"
                  />
                </div>

                {/* Category pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-[#1a6838] text-white'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cat === 'all' ? t.allCategories : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Publication List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                {filteredPubs.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    {t.noPubs}
                  </div>
                ) : (
                  filteredPubs.map((pub) => {
                    const isSelected = pub.id === currentPub?.id;
                    return (
                      <button
                        key={pub.id}
                        onClick={() => handleSelectPublication(pub.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-[#eef6f1] border-[#1a6838] shadow-xs'
                            : 'bg-white hover:bg-stone-50 border-stone-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-[#1a6838] text-white' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {pub.category}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            {pub.pages || pub.contentPages?.length || 1} {lang === 'en' ? 'p.' : 'lk'}
                          </span>
                        </div>

                        <h3 className={`text-xs font-bold leading-snug break-words ${
                          isSelected ? 'text-[#144225]' : 'text-stone-800'
                        }`}>
                          {pub.title}
                        </h3>

                        <p className="text-xs text-stone-600 whitespace-pre-wrap break-words leading-relaxed">
                          {pub.description}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-2.5 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
                {lang === 'en' ? 'Let There Be Light' : 'Kirjastus Saagu Valgus'}
              </div>
            </div>
          )}

          {/* Right Main Viewer Area */}
          <div className="flex-1 min-h-0 min-w-0 flex flex-col bg-[#e6ebe7] overflow-hidden">
            
            {/* Viewer Toolbar */}
            <div className="bg-white border-b border-stone-200 px-3 sm:px-6 py-2 flex flex-wrap gap-2 items-center justify-between shrink-0 shadow-2xs">
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">
                  {t.page} {currentPage} {t.of} {totalPages}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title={t.prevPage}
                  >
                    <ChevronLeft className="w-4 h-4 text-stone-700" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title={t.nextPage}
                  >
                    <ChevronRight className="w-4 h-4 text-stone-700" />
                  </button>
                </div>
              </div>

              {/* Title breadcrumb */}
              <div className="hidden lg:block truncate max-w-md text-xs font-semibold text-stone-700 text-center">
                «{currentPub?.title}»
              </div>

              {/* Zoom and Share Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
                  <button
                    onClick={() => setZoomLevel(Math.max(80, zoomLevel - 15))}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                  <span className="px-1 text-[11px] font-mono font-medium text-stone-600">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(160, zoomLevel + 15))}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                </div>

                <button
                  onClick={handleCopyLink}
                  disabled={!currentPub}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title={t.copyLink}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
                  <span className="hidden sm:inline">{copiedLink ? t.copiedLink : t.copyLink}</span>
                </button>
              </div>
            </div>

            {copyError && <p role="alert" className="px-4 py-2 bg-red-50 text-red-800 text-sm">{copyError}</p>}
            {/* Document Reader Screen */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col items-center gap-5">
              
              {currentPub?.description && (
                <section aria-label={lang === 'en' ? 'Publication description' : 'Trükise kirjeldus'} className="w-full shrink-0 rounded-2xl bg-white border border-stone-200 p-5 sm:p-6 text-left">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#144225] break-words">{currentPub.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] max-w-prose">{currentPub.description}</p>
                </section>
              )}
              {!currentPub ? <p role="status" className="py-12 text-center text-stone-600">{t.noPubs}</p> : currentPub.pdfUrl ? (
                <div className="w-full shrink-0 h-[70vh] min-h-[400px] bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300">
                  <iframe 
                    src={`${currentPub.pdfUrl.split('#')[0]}#page=${currentPage}&zoom=${zoomLevel}`} 
                    className="w-full h-full"
                    title={currentPub.title} 
                  />
                </div>
              ) : (
                <div 
                  id="printable-publication-content"
                  style={{ 
                    transform: `scale(${zoomLevel / 100})`, 
                    transformOrigin: 'top center',
                    width: isWideMode ? '100%' : undefined
                  }}
                  className={`bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-stone-300/80 p-6 sm:p-10 md:p-12 lg:p-14 space-y-7 transition-all duration-150 ${
                    isWideMode 
                      ? 'w-full max-w-6xl' 
                      : 'w-full max-w-4xl xl:max-w-5xl'
                  }`}
                >
                  {/* Document Header */}
                  <div className="border-b-2 border-[#1a6838]/40 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest text-[#1a6838]">
                          {lang === 'en' ? 'Let There Be Light Publishing' : 'Kirjastus Saagu Valgus'}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                          {currentPub?.category}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-[#144225] leading-tight">
                        {currentPub?.title}
                      </h1>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-bold text-stone-600 bg-stone-100 px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                        {t.page} {currentPage} {t.of} {totalPages}
                      </span>
                    </div>
                  </div>

                  {/* Document Page Content */}
                  <div className="space-y-5 min-h-[360px]">
                    {activePageData ? (
                      <>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1a6838] font-display border-b border-stone-100 pb-2">
                          {activePageData.heading}
                        </h2>
                        <div className="text-base sm:text-lg text-stone-900 leading-relaxed sm:leading-loose font-serif whitespace-pre-line space-y-4">
                          {activePageData.text}
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center text-stone-400">
                        {lang === 'en' ? 'Loading page content...' : 'Lehekülje sisu laaditakse...'}
                      </div>
                    )}
                  </div>

                  {/* Document Footer Callout */}
                  <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-stone-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{lang === 'en' ? 'Suitable for A4 home & church printing' : 'Trükis sobib väljaprintimiseks A4 lehena'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrint}
              disabled={!currentPub}
                        className="text-[#1a6838] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{t.print}</span>
                      </button>
                      <span className="text-stone-300">•</span>
                      <button
                        onClick={handleDownload}
              disabled={!currentPub}
                        className="text-stone-700 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.download}</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Page Navigation Bar */}
            <div className="bg-white border-t border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-stone-600 shrink-0 shadow-2xs">
              <span className="font-medium text-stone-600 truncate max-w-xs sm:max-w-md">
                {t.document} <strong className="text-stone-900">{currentPub?.title}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs cursor-pointer transition-colors"
                >
                  {t.prevPage}
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-1.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                >
                  {t.nextPage}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
