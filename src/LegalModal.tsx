import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CreditCard, Truck, Building2 } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'delivery';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E2D7C8] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 text-left flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#14532D] text-white flex items-center justify-between border-b border-[#0F3D24]">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="font-serif font-bold text-xl leading-tight">
                Saagu Valgus OÜ — Õiguslik info & Müügitingimused
              </h3>
              <p className="text-xs text-emerald-200 font-sans mt-0.5">
                Reg. kood: 16842102 · e-post: info@saaguvalgus.eu
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Sulge aken"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-[#E7E0D5] bg-[#FAF7F2] px-6 gap-2 pt-3 font-sans text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-white border-[#E7E0D5] text-[#14532D] font-bold border-b-white -mb-px'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#14532D]" />
            <span>Privaatsuspoliitika</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2.5 rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-white border-[#E7E0D5] text-[#14532D] font-bold border-b-white -mb-px'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-[#14532D]" />
            <span>Müügi- ja kasutustingimused</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2.5 rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'delivery'
                ? 'bg-white border-[#E7E0D5] text-[#14532D] font-bold border-b-white -mb-px'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#14532D]" />
            <span>Makseviisid & Tarne</span>
          </button>
        </div>

        {/* Modal Content Reader */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800 text-sm sm:text-base font-serif leading-relaxed">
          
          {/* TAB 1: PRIVAATSUSPOLIITIKA */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h4 className="text-2xl font-bold font-serif text-[#1C1917]">Isikuandmete töötlemise privaatsuspoliitika</h4>
                <p className="text-xs text-stone-500 font-sans mt-1">Kehtiv alates: 2026 · Saagu Valgus OÜ</p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">1. Vastutav töötleja</h5>
                <p>
                  Isikuandmete vastutav töötleja on <strong>Saagu Valgus OÜ</strong> (registrikood: 16842102, aadress: Eesti Vabariik, e-post: <strong>info@saaguvalgus.eu</strong>).
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">2. Milliseid isikuandmeid me töötleme?</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Kontaktandmed:</strong> Nimi, e-posti aadress, telefoninumber.</li>
                  <li><strong>Tarneandmed:</strong> Postiaadress, pakiautomaadi asukoht (tellimuste täitmiseks).</li>
                  <li><strong>Panga- ja makseandmed:</strong> Pangakonto number (IBAN), makse teostamise aeg ja staatuse kinnitus.</li>
                  <li><strong>Sõnumid ja päringud:</strong> Kontaktivormi kaudu saadetud sõnumid ja tagasiside.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">3. Isikuandmete töötlemise eesmärgid ja õiguslik alus</h5>
                <p>
                  Töötleme isikuandmeid kliendi ees võetud kohustuste täitmiseks (raamatute ja trükiste saatmine), päringutele vastamiseks ning õigusaktidest tulenevate raamatupidamiskohustuste täitmiseks.
                </p>
              </section>

              <section className="p-5 rounded-2xl bg-[#F5F0E6] border border-[#E2D7C8] space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#14532D]" />
                  <span>4. Makseandmete edastamine volitatud töötlejale</span>
                </h5>
                <p className="text-sm">
                  Saagu Valgus OÜ on isikuandmete vastutav töötleja. Saagu Valgus OÜ edastab maksete teostamiseks vajalikud isikuandmed volitatud töötlejale pangalinkide ja makselahenduste pakkujale (nt Montonio Finance UAB, Swedbank, LHV Pank) makse sooritamise eesmärgil.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">5. Andmete säilitamine ja turvalisus</h5>
                <p>
                  Isikuandmeid säilitatakse turvaliselt ning neid ei edastata kolmandatele isikutele, välja arvatud seaduses ettenähtud juhtudel või teenuse osutamiseks vajalikele partneritele (pank, kullerteenus/Omniva/SmartPost). Raamatupidamise algdokumente säilitatakse vastavalt seadusele 7 aastat.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">6. Kliendi õigused</h5>
                <p>
                  Teil on igal ajal õigus tutvuda oma isikuandmetega, nõuda andmete parandamist, kustutamist või töötlemise piiramist, võttes ühendust e-posti teel: <strong>info@saaguvalgus.eu</strong>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: MÜÜGITINGIMUSED */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h4 className="text-2xl font-bold font-serif text-[#1C1917]">E-poe ja Kirjastuse Müügitingimused</h4>
                <p className="text-xs text-stone-500 font-sans mt-1">Kehtiv alates: 2026 · Saagu Valgus OÜ</p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">1. Üldsätted</h5>
                <p>
                  Käesolevad müügitingimused kehtivad veebilehelt <strong>saaguvalgus.eu</strong> ostetavate raamatute ja trükiste ostu-müügilepingutele. Müüja on <strong>Saagu Valgus OÜ</strong> (registrikood: 16842102, e-post: info@saaguvalgus.eu).
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">2. Hinnad ja Maksetingimused</h5>
                <p>
                  Kõik veebilehel näidatud hinnad on eurodes (€). Ostu eest tasumine toimub turvaliselt pangalinkide kaudu või pangaülekandega Saagu Valgus OÜ arvelduskontole.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">3. Taganemisõigus (14 päeva)</h5>
                <p>
                  Vastavalt võlaõigusseadusele on tarbijal õigus e-poest ostetud füüsilisest kaubast taganeda 14 päeva jooksul alates kauba kättesaamisest. Taganemisõiguse kasutamiseks tuleb esitada avaldus e-posti aadressile info@saaguvalgus.eu. Tagastatav kaup peab olema kasutamata ja originaalpakendis.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-lg text-[#14532D] font-serif">4. Pretensiooni esitamise õigus ja vaidlused</h5>
                <p>
                  Müüja vastutab müüdud kauba lepingutingimustele mittevastavuse või puuduste eest vastavalt kehtivale seadusandlusele. Vaidlused lahendatakse läbirääkimiste teel. Kokkuleppe mittesaavutamisel on ostjal õigus pöörduda Tarbijakaitse ja Tehnilise Järelevalve Ameti tarbijavaidluste komisjoni poole.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: MAKSEVIISID JA TARNE */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h4 className="text-2xl font-bold font-serif text-[#1C1917]">Makseviisid ja Kohaletoimetamine</h4>
                <p className="text-xs text-stone-500 font-sans mt-1">Saagu Valgus OÜ</p>
              </div>

              <section className="space-y-3">
                <h5 className="font-bold text-lg text-[#14532D] font-serif flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#14532D]" />
                  <span>Makseviisid</span>
                </h5>
                <p>
                  Tellimuste eest saab tasuda järgmiste makseviisidega:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Eesti pangalingid:</strong> Swedbank, LHV Pank, SEB, Luminor, Coop Pank pangalinkide kaudu.</li>
                  <li><strong>Pangaülekanne:</strong> Otseülekandega Saagu Valgus OÜ Swedbank arvelduskontole.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h5 className="font-bold text-lg text-[#14532D] font-serif flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#14532D]" />
                  <span>Kohaletoimetamine & Tarneaeg</span>
                </h5>
                <p>
                  Füüsilised raamatud ja trükised toimetatakse kohale Omniva või SmartPOSTi pakiautomaatide kaudu Eesti piires. Tarneaeg on tavaliselt <strong>1–3 tööpäeva</strong>.
                </p>
                <p>
                  Elektroonilised PDF-trükised ja materjalid on kättesaadavad tasuta otse veebilehel või saadetakse e-posti teel.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E7E0D5] flex items-center justify-between text-xs font-sans text-stone-600">
          <span>Saagu Valgus OÜ · info@saaguvalgus.eu</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#14532D] text-white hover:bg-[#0F3D24] font-semibold cursor-pointer transition-colors"
          >
            Sulge aken
          </button>
        </div>

      </div>
    </div>
  );
};
