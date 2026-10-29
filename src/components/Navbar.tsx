import React from 'react';
import { Compass } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090c]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-serif text-xl tracking-[0.2em] font-extrabold text-[#d4af37] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          AETHEL·GARD
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-sans font-medium text-white/70">
          <a
            href="#mechanism-studio"
            className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0"
          >
            3D Mekanizma
          </a>
          <a
            href="#masterpieces"
            className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0"
          >
            Koleksiyon
          </a>
          <a
            href="#craftsmanship"
            className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0"
          >
            Zanaat & Miras
          </a>
          <a
            href="#bespoke"
            className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0"
          >
            Özel Sipariş
          </a>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold text-black bg-[#d4af37] hover:bg-[#e4bf47] rounded-md transition-all shadow-md shadow-[#d4af37]/20 whitespace-nowrap shrink-0"
          >
            Boutique Randevusu
          </button>
        </div>
      </div>
    </header>
  );
};
