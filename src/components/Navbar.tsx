import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const links: { label: string; page: Page }[] = [
  { label: 'الرئيسية', page: 'home' },
  { label: 'صناع المحتوى', page: 'creators' },

  { label: 'الطاقم', page: 'staff' },
  { label: 'القوانين', page: 'rules' },
  { label: 'التقديمات', page: 'applications' },
  { label: 'المتجر', page: 'store' },
];

export default function Navbar({ currentPage, navigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'glass border-b border-white/[0.04] shadow-lg shadow-black/50'
        : 'bg-gradient-to-b from-black/50 to-transparent'
    }`}>
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E07B20]/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-[60px]">

        {/* Logo */}
        <button onClick={() => navigate('home')} className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <img
              src="https://a.top4top.io/p_3849ne4pe1.png"
              alt="ULG CFW"
              className="w-9 h-9 object-contain drop-shadow-[0_2px_10px_rgba(224,123,32,0.35)]"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-[0.12em]">
              <span className="text-grad">ULG</span>
            </span>
            <span className="text-[var(--text-3)] text-[9px] font-semibold tracking-[0.22em] uppercase mt-0.5">CFW Roleplay</span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => navigate(l.page)}
              className={`relative px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors duration-200 rounded-lg ${
                currentPage === l.page
                  ? 'text-[var(--brand)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
              }`}
            >
              {l.label}
              {currentPage === l.page && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-5 bg-[var(--brand)] rounded-full shadow-[0_0_8px_rgba(224,123,32,0.4)]" />
              )}
            </button>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-white/[0.04] px-4 py-4 space-y-1 shadow-xl">
          {links.map((l) => (
            <button key={l.page} onClick={() => { navigate(l.page); setMobileOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentPage === l.page
                  ? 'bg-[var(--brand-dim)] text-[var(--brand)] border border-[var(--brand-border)]'
                  : 'text-[var(--text-2)] hover:bg-white/[0.03] hover:text-[var(--text-1)]'
              }`}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
