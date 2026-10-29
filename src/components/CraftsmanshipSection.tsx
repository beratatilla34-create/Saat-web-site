import React, { useState } from 'react';
import { Award, Hammer, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';
import craftsmanImg from '../assets/images/watch_craftsman_workbench_1793304294104.jpg';

export const CraftsmanshipSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const CRAFT_STEPS = [
    {
      index: '01',
      title: 'Elle Pah Kırma & Siyah Polisaj',
      sub: 'Anglage Main & Miroir Noir',
      desc: 'Her bir mekanizma köprüsünün kenarları, gentian ağacı çubukları ve elmas tozu kullanılarak 45 derecelik kusursuz bir açıyla parlatılır. Siyah polisaj tekniğiyle metal, ışığı yalnızca tek bir yönde kırarak derin bir siyah cam gibi yansıtır.',
      stat: '320 Saat',
      statLabel: 'Ortalama mekanizma cila süresi',
    },
    {
      index: '02',
      title: 'Grand Feu Emaye & Guilloché',
      sub: 'Emaye Fırınlama Sanatı',
      desc: '800°C fırınlarda defalarca pişirilen emaye tozu, asırlar boyunca solmayan derin bir camsı parlaklık kazanır. Kadran üzerindeki mikron düzeyindeki güneş deseni çizgileri, 19. yüzyıldan kalma manuel guilloché torna makinelerinde elde oyulur.',
      stat: '800°C',
      statLabel: 'Geleneksel fırınlama ısısı',
    },
    {
      index: '03',
      title: 'Silisyum Denge Yayı & Eşapman',
      sub: 'Manyetik Alanlara Karşı Mutlak Direnç',
      desc: 'Havacılık teknolojisiyle üretilen silisyum denge yayı ve eşapman çarkı; yağlama gerektirmez, sıcaklık dalgalanmalarından etkilenmez ve 15.000 Gauss manyetik alanlara karşı tam bağışıklık sağlar.',
      stat: '15,000 Gauss',
      statLabel: 'Anti-manyetik direnç',
    },
    {
      index: '04',
      title: 'Cenevre Mührü Standartları',
      sub: 'Poinçon de Genève Sertifikası',
      desc: 'Dünyanın en zorlu saatçilik regülasyonu olan Cenevre Mührü, sadece Cenevre kantonunda üretilen ve 12 katı estetik kuralı eksiksiz karşılayan mekanizmalara verilir. Her parçanın vidası dahi elle pah kırılmış olmalıdır.',
      stat: '12 Kural',
      statLabel: 'Sertifikasyon kriteri',
    },
  ];

  return (
    <section id="craftsmanship" className="relative py-24 px-6 bg-[#0a0b0f] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-mono text-[#d4af37]">
            <span>Cenevre Atölyesi Geleneği</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>Haute Horlogerie Sanatı</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            03. Kusursuzluğun Sabırla İşlendiği Atölye
          </h2>
          <p className="text-white/60 text-sm max-w-2xl font-sans">
            Makinelerin erişemediği mikron hassasiyetindeki detaylar, nesillerden süzülen geleneksel el aletleri ve usta saatçilerin mikroskobik vizyonuyla şekillenir.
          </p>
        </div>

        {/* 2-Column Split: Interactive Craft Steps & High-Res Workshop Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Craft Steps Accordion/Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {CRAFT_STEPS.map((step, idx) => (
              <div
                key={step.index}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-[#12141c] border-[#d4af37]/60 shadow-xl'
                    : 'bg-[#0f1117]/60 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-[#d4af37] font-bold">
                      {step.index}.
                    </span>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                        {step.title}
                      </h3>
                      <span className="text-xs text-white/40 font-mono block">
                        {step.sub}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif text-base font-bold text-[#d4af37] tabular-nums block">
                      {step.stat}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {step.statLabel}
                    </span>
                  </div>
                </div>

                {activeStep === idx && (
                  <p className="mt-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-white/70 font-sans leading-relaxed animate-in fade-in duration-200">
                    {step.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right: Atelier Craftsman Photo (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl aspect-[4/3] group">
              <img
                src={craftsmanImg}
                alt="İsviçreli Baş Saat Ustası Atölyede"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 text-xs text-white/80">
                <span className="font-mono text-[10px] text-[#d4af37] tracking-widest uppercase block mb-1">
                  Atelier Horloger · Cenevre
                </span>
                <p className="font-sans text-xs text-white/90 leading-tight">
                  Her bir tourbillon kafesi, 0.001 mm toleransla usta saatçinin lup merceği altında tek tek monte edilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
