import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050608] border-t border-white/10 text-white/60 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="font-serif text-lg tracking-[0.2em] font-extrabold text-[#d4af37] block">
              AETHEL·GARD
            </span>
            <p className="text-xs text-white/50 leading-relaxed">
              1894 yılından bu yana Cenevre kantonunda geleneksel İsviçre Haute Horlogerie sanatını ve uçan tourbillon inovasyonunu yaşatan bağımsız saat manüfaktürü.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#d4af37]">
              <ShieldCheck size={14} />
              <span className="font-mono">Poinçon de Genève Sertifikalı</span>
            </div>
          </div>

          {/* Boutique Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Boutique & Salonlar
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors">Cenevre — Rue du Rhône 42</li>
              <li className="hover:text-white transition-colors">İstanbul — Zorlu Center & Nişantaşı</li>
              <li className="hover:text-white transition-colors">Londra — 14 New Bond Street</li>
              <li className="hover:text-white transition-colors">New York — 740 Madison Ave</li>
              <li className="hover:text-white transition-colors">Dubai — DIFC Gate Village 03</li>
            </ul>
          </div>

          {/* Horology Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Hizmetler & Zanaat
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors">Atelier Sur-Mesure (Özel Sipariş)</li>
              <li className="hover:text-white transition-colors">Ömür Boyu Kalibre Restorasyonu</li>
              <li className="hover:text-white transition-colors">Orijinallik ve Provenans Arşivi</li>
              <li className="hover:text-white transition-colors">Uluslararası Zırhlı Kurye Teslimatı</li>
            </ul>
          </div>

          {/* Newsletter / Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Özel Bülten Kaydı
            </h4>
            <p className="text-xs text-white/50">
              Yeni limitli modeller ve Cenevre sergi davetiyeleri için özel listemize katılın.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); }} className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-[#101218] border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] w-full"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-mono bg-white/10 hover:bg-[#d4af37] hover:text-black rounded-md text-white transition-colors whitespace-nowrap"
              >
                Kayıt
              </button>
            </form>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} Aethelgard Haute Horlogerie SA. Cenevre, İsviçre. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-white transition-colors">Etik Altın Beyanı</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
