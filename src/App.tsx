import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WatchStudioSection } from './components/WatchStudioSection';
import { CollectionSection, WatchProduct } from './components/CollectionSection';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { BespokeConfigurator } from './components/BespokeConfigurator';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingNotes, setBookingNotes] = useState<string>('');

  const handleOpenBooking = (notes?: string) => {
    setBookingNotes(notes || '');
    setIsBookingOpen(true);
  };

  const scrollToStudio = () => {
    const el = document.getElementById('mechanism-studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-[#e2e8f0] selection:bg-[#d4af37] selection:text-black">
      {/* 3-Zone Luxury Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main>
        {/* Cinematic Hero */}
        <HeroSection
          onExplore3D={scrollToStudio}
          onOpenBooking={() => handleOpenBooking('Kalpa Tourbillon Royal 01 lansman randevusu')}
        />

        {/* 01. 3D WebGL Horology Studio & Exploded Calibre Viewer */}
        <WatchStudioSection
          onOpenBooking={() => handleOpenBooking('Calibre 904-TR 3D teknik inceleme randevusu')}
        />

        {/* 02. Haute Horlogerie Collection Showcase */}
        <CollectionSection
          onSelectWatch={(watch: WatchProduct) => {
            // Selected watch for inspection
          }}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 03. Craftsmanship, Metiers d'Art & Geneva Seal */}
        <CraftsmanshipSection />

        {/* 04. Atelier Sur-Mesure / Bespoke Watch Customizer */}
        <BespokeConfigurator
          onOpenBookingWithDetails={(details: string) => handleOpenBooking(details)}
        />
      </main>

      {/* Editorial Luxury Footer */}
      <Footer />

      {/* VIP Concierge Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefilledNotes={bookingNotes}
      />
    </div>
  );
}
