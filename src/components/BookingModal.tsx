import React, { useState } from 'react';
import { ShieldCheck, Calendar, Clock, MapPin, CheckCircle2, Sparkles, X } from 'lucide-react';
import { horologySound } from '../utils/soundEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledNotes?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  prefilledNotes = '',
}) => {
  const [formData, setFormData] = useState({
    name: 'Berat Atilla',
    email: 'beratatilla34@gmail.com',
    phone: '+90 532 000 00 00',
    boutique: 'Cenevre — Rue du Rhône (Amiral Mağaza)',
    date: '2026-11-15',
    time: '14:30',
    type: 'Boutique VIP Salonu Ziyareti',
    notes: prefilledNotes,
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    horologySound.playMetallicClick();
    const generatedId = `AG-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#0f1118] border border-[#d4af37]/50 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
                <Sparkles size={14} />
                <span>Haute Horlogerie Concierge</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Özel Boutique Randevusu
              </h3>
              <p className="text-xs text-white/60 font-sans mt-1">
                Aethelgard başyapıtlarını özel VIP salonumuzda baş saat uzmanımız eşliğinde deneyimleyin.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase text-[11px]">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#151822] border border-white/15 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-mono uppercase text-[11px]">
                    E-Posta
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#151822] border border-white/15 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1 font-mono uppercase text-[11px]">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#151822] border border-white/15 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase text-[11px]">
                  Tercih Edilen Boutique Salonu
                </label>
                <select
                  value={formData.boutique}
                  onChange={(e) => setFormData({ ...formData, boutique: e.target.value })}
                  className="w-full bg-[#151822] border border-white/15 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-white focus:outline-none"
                >
                  <option value="Cenevre — Rue du Rhône (Amiral Mağaza)">
                    Cenevre — Rue du Rhône (Amiral Mağaza)
                  </option>
                  <option value="İstanbul — Zorlu Center & Nişantaşı Salonu">
                    İstanbul — Zorlu Center & Nişantaşı Salonu
                  </option>
                  <option value="Londra — New Bond Street">Londra — New Bond Street</option>
                  <option value="New York — Madison Avenue">New York — Madison Avenue</option>
                  <option value="Dubai — DIFC Gate Village">Dubai — DIFC Gate Village</option>
                  <option value="Tokyo — Ginza Central">Tokyo — Ginza Central</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-mono uppercase text-[11px]">
                    Tarih
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#151822] border border-white/15 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1 font-mono uppercase text-[11px]">
                    Saat
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#151822] border border-white/15 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase text-[11px]">
                  İlgilenilen Model veya Özel Notlar
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Örn: Kalpa Tourbillon Royal 01 18K Pembe Altın modeli için randevu talep ediyorum."
                  className="w-full bg-[#151822] border border-white/15 focus:border-[#d4af37] rounded-lg px-3.5 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
              <span className="text-[11px] text-white/40 flex items-center gap-1.5 font-sans">
                <ShieldCheck size={14} className="text-[#d4af37]" />
                Gizlilik garantisi
              </span>

              <button
                type="submit"
                className="px-6 py-3 text-xs uppercase tracking-wider font-sans font-bold text-black bg-[#d4af37] hover:bg-[#e4bf47] rounded-lg transition-all shadow-md shadow-[#d4af37]/25"
              >
                Randevuyu Onayla
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-xs text-[#d4af37] uppercase tracking-widest">
                Rezervasyon Talebiniz Alındı
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                VIP Boutique Randevu Bileti
              </h3>
              <p className="text-xs text-white/60 font-sans max-w-sm mx-auto">
                Özel müşteri temsilcimiz 1 iş saati içinde sizinle iletişime geçecektir.
              </p>
            </div>

            {/* Simulated VIP Ticket pass */}
            <div className="p-5 bg-black/60 border border-[#d4af37]/40 rounded-xl text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Protokol No:</span>
                <span className="text-[#d4af37] font-bold">{ticketId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Müşteri:</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Boutique:</span>
                <span className="text-white text-right">{formData.boutique.split('—')[0]}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Tarih & Saat:</span>
                <span className="text-white">
                  {formData.date} · {formData.time}
                </span>
              </div>
              {formData.notes && (
                <div className="pt-2 border-t border-white/5 text-[11px] text-white/70 italic">
                  Not: {formData.notes}
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-sans font-medium text-white/80 hover:text-white bg-white/10 rounded-md transition-colors"
            >
              Pencereyi Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
