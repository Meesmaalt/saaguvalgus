import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Upload,
  Plus,
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Sparkles, 
  Share2, 
  Check, 
  ZoomIn, 
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { PublicationItem } from './types';

interface PublicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  publications: PublicationItem[];
  onUploadPublication?: (newPub: PublicationItem) => void;
  initialPublicationId?: string;
}

export const PublicationsModal: React.FC<PublicationsModalProps> = ({
  isOpen,
  onClose,
  publications,
  onUploadPublication,
  initialPublicationId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    return initialPublicationId || publications[0]?.id || '';
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  // User upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Trükis / Voldik');
  const [uploadDesc, setUploadDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUserUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    const reader = new FileReader();
    const fileName = uploadFile.name;
    const fileSize = (uploadFile.size / (1024 * 1024)).toFixed(1) + ' MB';
    const title = uploadTitle.trim() || fileName.replace(/\.[^/.]+$/, '');

    reader.onload = () => {
      const newPub: PublicationItem = {
        id: 'trukis-' + Date.now(),
        title: title,
        author: 'Üleslaaditud materjal',
        category: uploadCategory || 'PDF Trükis',
        description: uploadDesc.trim() || `Üleslaaditud fail: ${fileName}`,
        pages: 1,
        uploadedAt: new Date().toISOString().split('T')[0],
        fileName: fileName,
        fileSize: fileSize,
        pdfUrl: reader.result as string,
        downloadCount: 0,
        contentPages: [
          {
            pageNumber: 1,
            heading: title,
            text: uploadDesc.trim() || `Fail: ${fileName} (${fileSize})`
          }
        ]
      };

      if (onUploadPublication) {
        onUploadPublication(newPub);
      }
      setSelectedId(newPub.id);
      setCurrentPage(1);
      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle('');
      setUploadDesc('');
      setIsUploading(false);
    };

    reader.readAsDataURL(uploadFile);
  };

  if (!isOpen) return null;

  const currentPub = publications.find(p => p.id === selectedId) || publications[0];
  const totalPages = currentPub?.contentPages?.length || currentPub?.pages || 1;
  const activePageData = currentPub?.contentPages?.find(p => p.pageNumber === currentPage) || currentPub?.contentPages?.[0];

  const categories = ['all', ...Array.from(new Set(publications.map(p => p.category)))];

  const filteredPubs = publications.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSelectPublication = (id: string) => {
    setSelectedId(id);
    setCurrentPage(1);
    setZoomLevel(100);
  };

  const handlePrint = () => {
    // If publication has direct PDF url
    if (currentPub?.pdfUrl) {
      const win = window.open(currentPub.pdfUrl, '_blank');
      if (win) {
        win.focus();
        setTimeout(() => win.print(), 800);
        return;
      }
    }

    // Print the structured document using a dedicated printable container or iframe
    const printableElement = document.getElementById('printable-publication-content');
    if (printableElement) {
      const iframe = printFrameRef.current;
      if (iframe && iframe.contentWindow) {
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${currentPub?.title || 'Trükis'} - Kirjastus Saagu Valgus</title>
              <style>
                @page { size: A4; margin: 15mm; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
                  color: #1a3324;
                  line-height: 1.6;
                  padding: 10px;
                }
                .pub-header {
                  border-bottom: 2px solid #1a6838;
                  padding-bottom: 15px;
                  margin-bottom: 25px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .pub-brand { font-size: 14pt; font-weight: bold; color: #144225; }
                .pub-meta { font-size: 9pt; color: #555; }
                .pub-title { font-size: 20pt; font-weight: bold; color: #144225; margin-bottom: 10px; }
                .pub-category { display: inline-block; background: #e8f3ec; color: #1a6838; padding: 3px 8px; border-radius: 4px; font-size: 9pt; font-weight: bold; margin-bottom: 15px; }
                .page-block { margin-bottom: 40px; page-break-after: always; }
                .page-block:last-child { page-break-after: avoid; }
                .page-num { font-size: 9pt; color: #888; text-align: right; margin-bottom: 5px; }
                .page-heading { font-size: 14pt; font-weight: bold; color: #1a6838; margin-bottom: 12px; }
                .page-text { font-size: 11pt; white-space: pre-line; color: #222; }
                .pub-footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9pt; color: #666; text-align: center; }
              </style>
            </head>
            <body>
              <div class="pub-header">
                <div>
                  <div class="pub-brand">Kirjastus Saagu Valgus</div>
                  <div class="pub-meta">Ametlik infotrükis ja evangeelne materjal</div>
                </div>
                <div class="pub-meta">${new Date().toLocaleDateString('et-EE')}</div>
              </div>

              <div class="pub-category">${currentPub?.category || 'Trükis'}</div>
              <h1 class="pub-title">${currentPub?.title}</h1>
              <p style="font-size: 11pt; color: #444; margin-bottom: 25px; font-style: italic;">«${currentPub?.description}»</p>

              ${(currentPub?.contentPages || []).map((cp) => `
                <div class="page-block">
                  <div class="page-num">Lehekülg ${cp.pageNumber} / ${totalPages}</div>
                  <div class="page-heading">${cp.heading}</div>
                  <div class="page-text">${cp.text}</div>
                </div>
              `).join('')}

              <div class="pub-footer">
                Kirjastus Saagu Valgus • info@saaguvalgus.eu • https://saaguvalgus.eu • Väljatrükk isiklikuks ja koguduse lugemiseks
              </div>
            </body>
          </html>
        `);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        }, 500);
        return;
      }
    }

    window.print();
  };

  const handleDownload = () => {
    if (currentPub?.pdfUrl) {
      const a = document.createElement('a');
      a.href = currentPub.pdfUrl;
      a.download = currentPub.fileName || `${currentPub.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Generate downloadable text/document file
    const content = `======================================================
KIRJASTUS SAAGU VALGUS - AMETLIK TRÜKIS
======================================================
Pealkiri: ${currentPub?.title}
Kategooria: ${currentPub?.category}
Autor: ${currentPub?.author || 'Kirjastus Saagu Valgus'}
Kuupäev: ${currentPub?.uploadedAt || ''}
Kirjeldus: ${currentPub?.description}

------------------------------------------------------
SISU:
------------------------------------------------------
${(currentPub?.contentPages || []).map(p => `
[ LEHEKÜLG ${p.pageNumber} ]
${p.heading.toUpperCase()}

${p.text}
`).join('\n------------------------------------------------------\n')}

======================================================
Kirjastus Saagu Valgus
Koduleht: https://saaguvalgus.eu
E-post: info@saaguvalgus.eu
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '#trukised');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-150">
      
      {/* Hidden print iframe for clean A4 printing without printing background website UI */}
      <iframe ref={printFrameRef} className="hidden" title="PrintFrame" />

      <div className="bg-[#f8faf8] rounded-3xl border border-stone-200 shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden text-stone-900">
        
        {/* Top Header Bar */}
        <div className="bg-[#144225] text-white px-5 sm:px-7 py-3.5 flex items-center justify-between border-b border-[#1b5430] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display tracking-tight">Trükised</h2>
                <span className="text-[11px] font-semibold bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  PDF & Digitaalne lugemine
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 hidden sm:block">
                Kirjastuse Saagu Valgus ametlikud voldikud ja infomaterjalid printimiseks ja lugemiseks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Laadi üles oma PDF või trükis vaatamiseks ja printimiseks"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Laadi fail üles</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Prindi see trükis välja"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Prindi</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Laadi trükise fail alla"
            >
              <Download className="w-4 h-4 text-stone-900" />
              <span className="hidden sm:inline">Laadi alla</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
              title="Sulge vaatleja"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar: Publications Selector */}
          <div className="w-full md:w-80 lg:w-96 bg-white border-r border-stone-200 flex flex-col shrink-0 h-48 md:h-auto overflow-hidden">
            
            {/* Quick Upload Action Button in Sidebar */}
            <div className="p-3 bg-stone-50 border-b border-stone-200">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Laadi üles uus PDF fail</span>
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="p-3 sm:p-4 border-b border-stone-100 space-y-2.5 bg-stone-50/70">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Otsi trükist..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a6838]"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[#1a6838] text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {cat === 'all' ? 'Kõik trükised' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Publication List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredPubs.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  Trükiseid ei leitud.
                </div>
              ) : (
                filteredPubs.map((pub) => {
                  const isSelected = pub.id === currentPub?.id;
                  return (
                    <button
                      key={pub.id}
                      onClick={() => handleSelectPublication(pub.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-[#eef6f1] border-[#1a6838] shadow-xs'
                          : 'bg-white hover:bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-[#1a6838] text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {pub.category}
                        </span>
                        {pub.fileSize && (
                          <span className="text-[10px] text-stone-400 font-mono">
                            {pub.fileSize}
                          </span>
                        )}
                      </div>

                      <h3 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                        isSelected ? 'text-[#144225]' : 'text-stone-800'
                      }`}>
                        {pub.title}
                      </h3>

                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {pub.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100/80">
                        <span>{pub.pages || pub.contentPages?.length || 1} lk</span>
                        <span className="text-[#1a6838] font-bold flex items-center gap-1">
                          <span>{isSelected ? 'Aktiivne' : 'Ava lugemiseks'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer info */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
              Trükiseid uuendab kirjastuse toimetus
            </div>
          </div>

          {/* Right Main Viewer Area */}
          <div className="flex-1 flex flex-col bg-[#eef1ef] overflow-hidden">
            
            {/* Viewer Toolbar */}
            <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-600">
                  Leht {currentPage} / {totalPages}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Eelmine leht"
                  >
                    <ChevronLeft className="w-4 h-4 text-stone-700" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Järgmine leht"
                  >
                    <ChevronRight className="w-4 h-4 text-stone-700" />
                  </button>
                </div>
              </div>

              {/* Zoom and Share Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
                  <button
                    onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="Vähenda"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                  <span className="px-1 text-[11px] font-mono font-medium text-stone-600">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="Suurenda"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Kopeeri link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Kopeeritud' : 'Jaga'}</span>
                </button>
              </div>
            </div>

            {/* Document Reader Screen */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center items-start">
              
              {currentPub?.pdfUrl ? (
                /* Native PDF rendering via iframe if custom uploaded PDF */
                <div className="w-full h-full max-w-4xl bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300">
                  <iframe 
                    src={currentPub.pdfUrl} 
                    className="w-full h-full min-h-[500px]" 
                    title={currentPub.title} 
                  />
                </div>
              ) : (
                /* Authentic High-Fidelity Printable Document Page (A4 Aspect) */
                <div 
                  id="printable-publication-content"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-6 sm:p-10 md:p-12 space-y-6 transition-transform duration-100"
                >
                  {/* Document Header */}
                  <div className="border-b-2 border-[#1a6838]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1a6838]">
                          Kirjastus Saagu Valgus
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs font-semibold text-stone-500">
                          {currentPub?.category}
                        </span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold font-display text-[#144225] mt-1">
                        {currentPub?.title}
                      </h1>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[11px] font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                        Lk {currentPage} / {totalPages}
                      </span>
                    </div>
                  </div>

                  {/* Document Page Content */}
                  <div className="space-y-4 min-h-[340px]">
                    {activePageData ? (
                      <>
                        <h2 className="text-lg sm:text-xl font-bold text-[#1a6838] font-display">
                          {activePageData.heading}
                        </h2>
                        <div className="text-sm sm:text-base text-stone-800 leading-relaxed font-serif whitespace-pre-line space-y-3">
                          {activePageData.text}
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center text-stone-400">
                        Lehekülje sisu laaditakse...
                      </div>
                    )}
                  </div>

                  {/* Document Footer Callout */}
                  <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Trükis sobib väljaprintimiseks A4 formaadis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrint}
                        className="text-[#1a6838] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Prindi see leht</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={handleDownload}
                        className="text-stone-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Salvesta fail</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Page Navigation Bar */}
            <div className="bg-white border-t border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-stone-600 shrink-0">
              <span className="font-medium text-stone-500 truncate max-w-xs sm:max-w-md">
                Dokument: <strong className="text-stone-800">{currentPub?.title}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs cursor-pointer"
                >
                  Eelmine leht
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs cursor-pointer"
                >
                  Järgmine leht
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Upload Publication Popup Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#1a6838] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 font-display">Laadi üles uus fail / trükis</h3>
                  <p className="text-xs text-stone-500">Fail lisatakse vaatlejasse lugemiseks, printimiseks ja allalaadimiseks</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUserUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Vali fail (PDF, tekstdokument vms) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,application/pdf,text/plain"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setUploadFile(file);
                    if (file && !uploadTitle) {
                      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="w-full text-xs text-stone-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#1a6838] hover:file:bg-emerald-100 file:cursor-pointer border border-stone-200 rounded-xl p-2 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Trükise pealkiri</label>
                <input
                  type="text"
                  placeholder="nt Saagu Valgus: Tõde ja vabanemine"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#1a6838] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kategooria</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1a6838] focus:outline-none bg-white"
                  >
                    <option value="Infovoldik">Infovoldik</option>
                    <option value="Trükis / PDF">Trükis / PDF</option>
                    <option value="Evangeelne leht">Evangeelne leht</option>
                    <option value="Lastekirjandus">Lastekirjandus</option>
                    <option value="Muu materjal">Muu materjal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Faili suurus</label>
                  <div className="px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 font-mono">
                    {uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Pole valitud'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kirjeldus või märksõnad</label>
                <textarea
                  rows={2}
                  placeholder="Lühike kirjeldus faili sisu kohta..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1a6838] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  Loobu
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-[#1a6838] hover:bg-[#15542d] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Töötlemisel...' : 'Lisa vaatlejasse'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
