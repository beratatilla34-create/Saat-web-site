import React, { useState } from 'react';
import { Watch3DViewer, MaterialFinish } from './Watch3DViewer';
import { Shield, Sparkles, Cpu, Disc3 } from 'lucide-react';

interface WatchStudioSectionProps {
  onOpenBooking: () => void;
}

export const WatchStudioSection: React.FC<WatchStudioSectionProps> = ({ onOpenBooking }) => {
  const [currentFinish, setCurrentFinish] = useState<MaterialFinish>('rose-gold');
  const [explodedAmount, setExplodedAmount] = useState<number>(0);

  return (
    <section id="mechanism-studio" className="relative py-20 px-6 bg-[#0a0b0f] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Editorial Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-mono text-[#d4af37]">
              <span>Haute Horlogerie Keşfi</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Canlı 3D WebGL Deneyimi</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              01. Calibre 904-TR Mekanizma ve Kasa Mimarisi
            </h2>
            <p className="text-white/60 text-sm max-w-2xl font-sans">
              Zamanı mikron hassasiyetinde yöneten mekanik kalbi 360 derece keşfedin. Katmanları ayırmak için patlatılmış görünüm kaydırıcısını kullanın, kasa materyallerini değiştirin veya mekanik tik-tak akustiğini dinleyin.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setExplodedAmount(explodedAmount > 0.4 ? 0 : 0.85);
              }}
              className="px-4 py-2 text-xs uppercase tracking-wider font-mono font-medium rounded border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
            >
              {explodedAmount > 0.4 ? 'Mekanizmayı Kapat' : 'Katmanları Patlat (%85)'}
            </button>
          </div>
        </div>

        {/* 3D WebGL Interactive Canvas Viewer */}
        <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative">
          <Watch3DViewer
            finish={currentFinish}
            onFinishChange={setCurrentFinish}
            explodedAmount={explodedAmount}
            onExplodedChange={setExplodedAmount}
          />
        </div>

        {/* Calibre 904-TR Engineering Specifications Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-[#0f1117] rounded-xl border border-white/10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#d4af37]">
              <Cpu size={18} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-white/50 uppercase">Bileşen Sayısı</span>
              <p className="font-serif text-base font-bold text-white tabular-nums mt-0.5">382 Parça</p>
              <p className="text-xs text-white/40">Tamamı el ile cilalanmış</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#d4af37]">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-white/50 uppercase">Sentetik Yakut</span>
              <p className="font-serif text-base font-bold text-white tabular-nums mt-0.5">35 Taşlı Yatak</p>
              <p className="text-xs text-white/40">Sürtünmesiz döner miller</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#d4af37]">
              <Disc3 size={18} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-white/50 uppercase">Tourbillon Kafesi</span>
              <p className="font-serif text-base font-bold text-[#d4af37] tabular-nums mt-0.5">0.28 Gram</p>
              <p className="text-xs text-white/40">Havacılık sınıfı titanyum</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#d4af37]">
              <Shield size={18} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-white/50 uppercase">Manyetik Direnç</span>
              <p className="font-serif text-base font-bold text-white tabular-nums mt-0.5">15,000 Gauss</p>
              <p className="text-xs text-white/40">Anti-manyetik silisyum yay</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
