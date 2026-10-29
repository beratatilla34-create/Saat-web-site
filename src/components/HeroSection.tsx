import React from 'react';
import { ArrowDownRight, Compass, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import heroMacroImg from '../assets/images/watch_hero_macro_1793304293208.jpg';

interface HeroSectionProps {
  onExplore3D: () => void;
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore3D, onOpenBooking }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-12 pb-16 px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left Editorial Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metadata line (Zero-pill discipline) */}
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase font-mono text-[#d4af37]">
            <span>Genève Atölyesi</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>Edition Limitée (08/25)</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>Calibre 904-TR</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight text-balance">
            Zamanın Ötesinde Bir{' '}
            <span className="gold-gradient-text block mt-1">
              Mühendislik ve Zarafet
            </span>{' '}
            Şaheseri
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/70 max-w-xl font-sans font-light leading-relaxed">
            Aethelgard Kalpa Tourbillon Royal 01; yerçekimini alt eden 60 saniyelik uçan tourbillon kafesi, 18 ayar som pembe altın kasası ve el işçiliği Côtes de Genève köprüleriyle yüksek İsviçre saatçiliğinin zirvesini tanımlıyor.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onExplore3D}
              className="px-6 py-3.5 text-xs uppercase tracking-widest font-sans font-semibold text-black bg-[#d4af37] hover:bg-[#e4bf47] rounded-md transition-all shadow-lg shadow-[#d4af37]/25 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>3D İnteraktif Mekanizma</span>
              <ArrowDownRight size={16} />
            </button>

            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 text-xs uppercase tracking-widest font-sans font-medium text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              Özel Randevu Talebi
            </button>
          </div>

          {/* Trust markers */}
          <div className="pt-6 flex items-center gap-6 text-xs text-white/50 border-t border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#d4af37]" />
              <span>5 Yıl İsviçre Garantisi</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#d4af37]" />
              <span>Cenevre Mührü Onaylı</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Showcase (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
            <img
              src={heroMacroImg}
              alt="Aethelgard Kalpa Tourbillon Makro Mekanizma"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Visual Contrast Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* In-image caption badge */}
            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end text-xs">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-[#d4af37] uppercase block">
                  Makro Detay
                </span>
                <span className="font-serif text-white font-bold text-sm">
                  Uçan Tourbillon & Silisyum Eşapman
                </span>
              </div>
              <button
                onClick={onExplore3D}
                className="px-3 py-1.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-sans hover:text-[#d4af37] transition-colors"
              >
                3D İncele
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Technical Specification Strip (Full-width row below hero split) */}
      <div className="max-w-7xl mx-auto w-full pt-12 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
              Komplikasyon
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-white">
              60s Uçan Tourbillon
            </p>
            <p className="text-xs text-white/60 font-sans">Yerçekimi nötrleme</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
              Frekans & Titreşim
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-[#d4af37] tabular-nums">
              28,800 VPH (4 Hz)
            </p>
            <p className="text-xs text-white/60 font-sans">Mikro-saniyelik akış</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
              Güç Rezervi
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-white tabular-nums">
              72 Saat
            </p>
            <p className="text-xs text-white/60 font-sans">Çift yay tulumbası</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
              Kasa Materyali
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-white">
              18K Som Pembe Altın
            </p>
            <p className="text-xs text-white/60 font-sans">44mm · 50M Su Geçirmezlik</p>
          </div>
        </div>
      </div>
    </section>
  );
};
