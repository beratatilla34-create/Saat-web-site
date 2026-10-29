import React, { useState } from 'react';
import { Sparkles, Eye, ArrowUpRight, ShieldCheck, Check } from 'lucide-react';
import watchPerpetualImg from '../assets/images/watch_perpetual_gold_1793304293049.jpg';
import watchCelestialImg from '../assets/images/watch_celestial_platinum_1793304293765.jpg';
import watchHeroMacroImg from '../assets/images/watch_hero_macro_1793304293208.jpg';

export interface WatchProduct {
  id: string;
  name: string;
  reference: string;
  category: string;
  price: number;
  formattedPrice: string;
  caseMaterial: string;
  diameter: string;
  movement: string;
  powerReserve: string;
  waterResistance: string;
  limitation: string;
  description: string;
  image: string;
  specs: { label: string; value: string }[];
}

const WATCH_CATALOG: WatchProduct[] = [
  {
    id: 'kalpa-royal-01',
    name: 'Kalpa Tourbillon Royal 01',
    reference: 'REF. 904.RO.25',
    category: 'Grand Complication',
    price: 148000,
    formattedPrice: '$148,000',
    caseMaterial: '18K Masif Pembe Altın (4N)',
    diameter: '44.0 mm · 12.8 mm kalınlık',
    movement: 'Calibre 904-TR Manüfaktür Uçan Tourbillon',
    powerReserve: '72 Saat (Çift Yay Tulumbası)',
    waterResistance: '50 Metre / 5 Bar',
    limitation: 'Dünya Genelinde 25 Adet Sınırlı Üretim',
    description:
      'Yerçekimini sıfırlayan 60 saniyelik uçan tourbillon kafesi, el işçiliği Côtes de Genève köprüleri ve masif 18k som pembe altın kasasıyla yüksek saatçilik sanatının zirvesi.',
    image: watchHeroMacroImg,
    specs: [
      { label: 'Kalibre', value: 'Aethelgard 904-TR (Otomatik)' },
      { label: 'Titreşim Frekansı', value: '28,800 vph / 4 Hz' },
      { label: 'Taş Sayısı', value: '35 Sentetik Yakut' },
      { label: 'Denge Yayı', value: 'Anti-manyetik Silisyum (15,000 Gauss)' },
      { label: 'Cam', value: 'Çift taraflı anti-refleks Safir Kristal' },
      { label: 'Kayış', value: 'El dikişli mat Mississippiensis timsah derisi' },
    ],
  },
  {
    id: 'chrono-perpetuel',
    name: 'Chronographe Perpétuel Noir',
    reference: 'REF. 720.CP.50',
    category: 'Perpetual Calendar Chrono',
    price: 92000,
    formattedPrice: '$92,000',
    caseMaterial: '18K Fırçalanmış Pembe Altın',
    diameter: '42.5 mm · 13.2 mm kalınlık',
    movement: 'Calibre 812-CP Kolon Çarklı Kronograf & Sonsuz Takvim',
    powerReserve: '65 Saat',
    waterResistance: '30 Metre / 3 Bar',
    limitation: '50 Adet Numaralandırılmış Özel Seri',
    description:
      '2100 yılına kadar ayar gerektirmeyen sonsuz takvim, mikro-oymalı altın ay fazı diski ve flyback özellikli entegre kolon çarklı kronograf mekanizması.',
    image: watchPerpetualImg,
    specs: [
      { label: 'Kalibre', value: 'Aethelgard 812-CP (Otomatik)' },
      { label: 'Komplikasyonlar', value: 'Sonsuz Takvim, Ay Fazı, Flyback Krono' },
      { label: 'Taş Sayısı', value: '42 Yakut' },
      { label: 'Kadran', value: 'Siyah Güneş Işını & Salisilik Alt Bölmeler' },
      { label: 'Kasa Arkası', value: 'Safir kristal sergi kapak & 22k altın rotor' },
      { label: 'Toka', value: '18K altın katlanır güvenlik klipsi' },
    ],
  },
  {
    id: 'celeste-platinum',
    name: 'Céleste Platinum Skeleton',
    reference: 'REF. 990.PL.15',
    category: 'Haute Horlogerie Astronomique',
    price: 126000,
    formattedPrice: '$126,000',
    caseMaterial: 'Platin 950 & Titanyum Köprüler',
    diameter: '43.0 mm · 11.9 mm kalınlık',
    movement: 'Calibre 990-SKY İskeletleştirilmiş Astronomik Tourbillon',
    powerReserve: '80 Saat',
    waterResistance: '50 Metre / 5 Bar',
    limitation: '15 Adet Özel Sipariş Üretim',
    description:
      'Gece gökyüzünü bileğinize taşıyan aventurin taşı iç kadran, altın yıldız takımyıldızları ve tamamen havada asılı gibi duran iskelet mimari.',
    image: watchCelestialImg,
    specs: [
      { label: 'Kalibre', value: 'Aethelgard 990-SKY (Manuel Kurmalı)' },
      { label: 'Kadran', value: 'Hakiki Aventurin camı ve 18k som altın mikro-ay' },
      { label: 'Pah Kırma', value: '300 saatlik el işçiliği mikro-anglage' },
      { label: 'Ağırlık', value: '168 gram (Platin 950 yoğunluğu)' },
      { label: 'Sertifika', value: 'Cenevre Mührü (Poinçon de Genève)' },
      { label: 'Garanti', value: 'Ömür Boyu Ücretsiz Periyodik Bakım' },
    ],
  },
];

interface CollectionSectionProps {
  onSelectWatch: (watch: WatchProduct) => void;
  onOpenBooking: () => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  onSelectWatch,
  onOpenBooking,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<WatchProduct | null>(null);

  const filteredWatches = WATCH_CATALOG.filter((w) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'tourbillon') return w.name.includes('Tourbillon');
    if (activeFilter === 'perpetual') return w.name.includes('Perpétuel');
    if (activeFilter === 'platinum') return w.caseMaterial.includes('Platin');
    return true;
  });

  const handleInspect = (watch: WatchProduct) => {
    setSelectedProduct(watch);
    onSelectWatch(watch);
  };

  return (
    <section id="masterpieces" className="relative py-24 px-6 bg-[#08090c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-mono text-[#d4af37]">
              <span>Haute Horlogerie Başyapıtları</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>2026 Koleksiyonu</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              02. Özel Üretim Zaman Şaheserleri
            </h2>
            <p className="text-white/60 text-sm max-w-xl font-sans">
              Her biri Cenevre atölyemizde tek bir usta saatçi tarafından baştan sona monte edilen, sınırlı sayıda üretilen ikonik modellerimiz.
            </p>
          </div>

          {/* Interactive Filter Tabs (Button elements allowed as per skill) */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-lg shrink-0">
            {[
              { id: 'all', label: 'Tüm Modeller' },
              { id: 'tourbillon', label: 'Tourbillon' },
              { id: 'perpetual', label: 'Sonsuz Takvim' },
              { id: 'platinum', label: 'Platin Serisi' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-sans font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-[#d4af37] text-black font-semibold shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Luxury Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWatches.map((watch) => (
            <div
              key={watch.id}
              onClick={() => handleInspect(watch)}
              className="group cursor-pointer bg-[#0f1117] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#d4af37]/10 flex flex-col justify-between"
            >
              {/* Product Image (takes ~65% of card height on solid backdrop) */}
              <div className="relative aspect-[4/3] w-full bg-[#0a0b0f] overflow-hidden">
                <img
                  src={watch.image}
                  alt={watch.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent pointer-events-none" />

                {/* Subtle text badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-mono tracking-wider text-[#d4af37] uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                    {watch.limitation.split(' ')[0]} {watch.limitation.split(' ')[1]}
                  </span>
                </div>
              </div>

              {/* Card Metadata & Information */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline text-xs text-white/50 font-mono">
                    <span>{watch.category}</span>
                    <span>{watch.reference}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors mt-1.5">
                    {watch.name}
                  </h3>

                  <p className="mt-2 text-xs text-white/60 line-clamp-2 font-sans leading-relaxed">
                    {watch.description}
                  </p>
                </div>

                {/* Technical highlights */}
                <div className="pt-4 border-t border-white/5 space-y-1.5 text-xs text-white/70 font-sans">
                  <div className="flex justify-between">
                    <span className="text-white/40">Kasa:</span>
                    <span className="font-medium text-white/90">{watch.caseMaterial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Çap:</span>
                    <span className="font-medium text-white/90">{watch.diameter}</span>
                  </div>
                </div>

                {/* Price and CTA footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-white/40 block">Fiyat</span>
                    <span className="font-serif text-lg font-bold text-white tabular-nums">
                      {watch.formattedPrice}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInspect(watch);
                    }}
                    className="px-4 py-2 text-xs uppercase tracking-wider font-sans font-medium rounded bg-white/10 text-white group-hover:bg-[#d4af37] group-hover:text-black transition-colors flex items-center gap-1.5"
                  >
                    <span>İncele</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED WATCH INSPECTION MODAL */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0f1118] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white p-2 text-sm rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Product Visual */}
              <div className="rounded-xl overflow-hidden border border-white/10 aspect-square bg-[#0a0b0f]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs text-[#d4af37] uppercase tracking-widest">
                    {selectedProduct.reference} · {selectedProduct.category}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white mt-1">
                    {selectedProduct.name}
                  </h2>
                  <p className="font-serif text-xl font-bold text-[#d4af37] mt-2 tabular-nums">
                    {selectedProduct.formattedPrice}
                  </p>
                </div>

                <p className="text-sm text-white/70 font-sans leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Technical Specifications Table */}
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <span className="font-mono text-[10px] uppercase text-white/40 block mb-2">
                    Teknik Özellikler
                  </span>
                  {selectedProduct.specs.map((s, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/50 font-sans">{s.label}</span>
                      <span className="text-white font-medium font-sans text-right">{s.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1">
                    <span className="text-white/50 font-sans">Sınırlı Sayı</span>
                    <span className="text-[#d4af37] font-medium font-sans text-right">
                      {selectedProduct.limitation}
                    </span>
                  </div>
                </div>

                {/* Modal CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      onOpenBooking();
                    }}
                    className="flex-1 py-3 text-xs uppercase tracking-wider font-sans font-semibold text-black bg-[#d4af37] hover:bg-[#e4bf47] rounded-md transition-all shadow-md text-center"
                  >
                    Boutique Rezervasyonu Yap
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="py-3 px-5 text-xs uppercase tracking-wider font-sans font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
