import React, { useState } from 'react';
import { Sliders, Check, Sparkles, Shield, Send, ArrowRight } from 'lucide-react';
import { horologySound } from '../utils/soundEngine';

interface BespokeConfiguratorProps {
  onOpenBookingWithDetails: (details: string) => void;
}

export const BespokeConfigurator: React.FC<BespokeConfiguratorProps> = ({
  onOpenBookingWithDetails,
}) => {
  const [selectedCase, setSelectedCase] = useState({
    id: 'rose-gold',
    name: '18K Masif Pembe Altın (4N)',
    price: 148000,
    color: 'bg-[#d4a373]',
  });

  const [selectedDial, setSelectedDial] = useState({
    id: 'obsidian',
    name: 'Obsidyen Siyah & Güneş Guilloché',
    addon: 0,
    desc: 'Cenevre geleneksel dalga deseni',
  });

  const [selectedStrap, setSelectedStrap] = useState({
    id: 'alligator',
    name: 'Mat Siyah Alligator Timsah Derisi',
    addon: 0,
    desc: 'El dikişli, ipeksi astar',
  });

  const [customEngraving, setCustomEngraving] = useState<string>('BERAT ATILLA · NO. 07/25');

  // Case options
  const CASES = [
    {
      id: 'rose-gold',
      name: '18K Masif Pembe Altın (4N)',
      price: 148000,
      color: 'bg-[#d4a373]',
    },
    {
      id: 'titanium',
      name: 'Titanyum Grade 5 (Fırçalanmış)',
      price: 132000,
      color: 'bg-[#717782]',
    },
    {
      id: 'platinum',
      name: 'Masif Platin 950 (Ayna Polisaj)',
      price: 176000,
      color: 'bg-[#e2e8f0]',
    },
    {
      id: 'carbon',
      name: 'Hafif Dövme Karbon & Seramik',
      price: 142000,
      color: 'bg-[#222428]',
    },
  ];

  // Dial options
  const DIALS = [
    {
      id: 'obsidian',
      name: 'Obsidyen Siyah & Güneş Guilloché',
      addon: 0,
      desc: 'Cenevre geleneksel dalga deseni',
    },
    {
      id: 'royal-blue',
      name: 'Kraliyet Gece Mavisi Emaye',
      addon: 4500,
      desc: '800°C Grand Feu fırınlanmış cam',
    },
    {
      id: 'emerald',
      name: 'Zümrüt Yeşil Aventurin Taşı',
      addon: 6800,
      desc: 'Doğal parıltılı kristal katman',
    },
    {
      id: 'meteorite',
      name: 'Gibeon Demir Meteorit Dilimi',
      addon: 12500,
      desc: 'Widmanstätten desenli uzay taşı',
    },
  ];

  // Strap options
  const STRAPS = [
    {
      id: 'alligator',
      name: 'Mat Siyah Timsah Derisi',
      addon: 0,
      desc: '18K Altın Katlanır Toka ile',
    },
    {
      id: 'rubber',
      name: 'Dokulu FKM Lüks Kauçuk',
      addon: 1200,
      desc: 'Suya ve tere %100 dayanıklı',
    },
    {
      id: 'gold-bracelet',
      name: 'Masif 18K Entegre Altın Bilezik',
      addon: 24000,
      desc: 'Elle pah kırılmış lüks baklalar',
    },
  ];

  const totalPrice = selectedCase.price + selectedDial.addon + selectedStrap.addon;

  const handleConfigSubmit = () => {
    const summary = `Özel Sipariş Konfigürasyonu: ${selectedCase.name} | Kadran: ${selectedDial.name} | Kayış: ${selectedStrap.name} | Kazıma: "${customEngraving}" | Tahmini Bedel: $${totalPrice.toLocaleString()}`;
    onOpenBookingWithDetails(summary);
  };

  return (
    <section id="bespoke" className="relative py-24 px-6 bg-[#08090c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-mono text-[#d4af37]">
            <span>Atelier Sur-Mesure</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>Kişiye Özel Üretim</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            04. Kendi Başyapıtınızı Tasarlayın
          </h2>
          <p className="text-white/60 text-sm max-w-2xl font-sans">
            Aethelgard Cenevre atölyesinde sizin adınıza özel olarak üretilecek eşsiz saatinizin kasa alaşımını, kadran sanatını, kayış tipini ve rotor üzeri lazer el kazımasını belirleyin.
          </p>
        </div>

        {/* 2-Column Configurator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Selection Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Case Material */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                Aşama 1: Kasa Alaşımı ve Metal Bitişi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CASES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCase(c);
                      horologySound.playMetallicClick();
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedCase.id === c.id
                        ? 'bg-[#12141c] border-[#d4af37] ring-1 ring-[#d4af37]'
                        : 'bg-[#0f1117] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3.5 h-3.5 rounded-full ${c.color} border border-white/20`} />
                        <span className="font-serif text-sm font-bold text-white">{c.name}</span>
                      </div>
                      {selectedCase.id === c.id && <Check size={16} className="text-[#d4af37]" />}
                    </div>
                    <div className="mt-2 text-xs font-mono text-white/50 tabular-nums">
                      ${c.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dial Face */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                Aşama 2: Kadran İmalat Tekniği
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DIALS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDial(d);
                      horologySound.playMetallicClick();
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedDial.id === d.id
                        ? 'bg-[#12141c] border-[#d4af37] ring-1 ring-[#d4af37]'
                        : 'bg-[#0f1117] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-serif text-sm font-bold text-white block">{d.name}</span>
                        <span className="text-[11px] text-white/50 font-sans mt-0.5 block">{d.desc}</span>
                      </div>
                      {selectedDial.id === d.id && <Check size={16} className="text-[#d4af37] shrink-0" />}
                    </div>
                    <div className="mt-2 text-xs font-mono text-[#d4af37] tabular-nums">
                      {d.addon === 0 ? 'Standart' : `+ $${d.addon.toLocaleString()}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Strap & Clasp */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                Aşama 3: Kayış & Toka Seçimi
              </label>
              <div className="space-y-2">
                {STRAPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStrap(s);
                      horologySound.playMetallicClick();
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedStrap.id === s.id
                        ? 'bg-[#12141c] border-[#d4af37] ring-1 ring-[#d4af37]'
                        : 'bg-[#0f1117] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="font-serif text-sm font-bold text-white">{s.name}</span>
                      <span className="text-xs text-white/50 font-sans ml-2">({s.desc})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#d4af37] tabular-nums">
                        {s.addon === 0 ? 'Dahil' : `+ $${s.addon.toLocaleString()}`}
                      </span>
                      {selectedStrap.id === s.id && <Check size={16} className="text-[#d4af37]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Rotor / Caseback Inscription */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                Aşama 4: 22K Altın Rotor Üzerine Kişisel Kazıma
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={36}
                  value={customEngraving}
                  onChange={(e) => setCustomEngraving(e.target.value.toUpperCase())}
                  placeholder="Örn: ADINIZ SOYADINIZ · 01/25"
                  className="w-full bg-[#12141c] border border-white/15 focus:border-[#d4af37] rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none uppercase tracking-wider"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">
                  {customEngraving.length}/36
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-sans">
                Cenevre atölyemizdeki usta gravür sanatçısı tarafından rotor ağırlığına el ile kazınacaktır.
              </p>
            </div>
          </div>

          {/* Right Summary & Certificate Preview (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 p-6 sm:p-8 bg-[#0f1117] border border-[#d4af37]/40 rounded-2xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-widest text-[#d4af37]">
                  Atelier Sipariş Özeti
                </span>
                <span className="text-[10px] font-mono text-white/40">GENÈVE PIÈCE UNIQUE</span>
              </div>

              {/* Itemized Specification */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/50">Kasa:</span>
                  <span className="text-white font-medium text-right">{selectedCase.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/50">Kadran Sanatı:</span>
                  <span className="text-white font-medium text-right">{selectedDial.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/50">Kayış & Toka:</span>
                  <span className="text-white font-medium text-right">{selectedStrap.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/50">Lazer & El Kazıma:</span>
                  <span className="text-[#d4af37] font-mono font-bold text-right tracking-wider">
                    "{customEngraving || 'ÖZEL METİN YOK'}"
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-white/50">Teslimat Süresi:</span>
                  <span className="text-white font-medium text-right">8 - 12 Hafta (El Yapımı)</span>
                </div>
              </div>

              {/* Digital Certificate of Authenticity Preview */}
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37]">
                  <Sparkles size={14} />
                  <span>Sertifikasyon Garantisi</span>
                </div>
                <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                  Bu sipariş, Cenevre Mührü (Poinçon de Genève) kalite belgesi, özel maun ahşap sarıcı kutusu ve 5 yıllık uluslararası garanti sertifikası ile teslim edilir.
                </p>
              </div>

              {/* Total Price and Submit CTA */}
              <div className="pt-2 border-t border-white/10 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono uppercase text-white/40">Tahmini Bedel</span>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#d4af37] tabular-nums">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleConfigSubmit}
                  className="w-full py-4 text-xs uppercase tracking-widest font-sans font-bold text-black bg-[#d4af37] hover:bg-[#e4bf47] rounded-xl transition-all shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2"
                >
                  <span>Atölye Talebini Gönder</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
