import { ExternalLink } from 'lucide-react';
import { DiscordLogo, TikTokLogo } from './Icons';
import type { Page } from '../types';

export default function Footer({ navigate }: { navigate: (page: Page) => void }) {
  const col = (title: string, items: { label: string; page?: Page; href?: string }[]) => (
    <div>
      <p className="text-[var(--brand)] text-[10px] font-bold uppercase tracking-[0.22em] mb-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[var(--brand)] rounded-full opacity-60" />
        {title}
      </p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.label}>
            {it.page ? (
              <button onClick={() => navigate(it.page!)} className="text-[var(--text-3)] hover:text-[var(--text-1)] text-sm transition-colors duration-300">{it.label}</button>
            ) : (
              <a href={it.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[var(--text-3)] hover:text-[var(--text-1)] text-sm transition-colors duration-300">
                {it.label} <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative border-t border-white/[0.03] bg-[var(--bg-2)] mt-20 overflow-hidden">
      {/* Top accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#E07B20]/30 to-transparent" />

      {/* Stripe bg */}
      <div className="absolute inset-0 stripe-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="https://a.top4top.io/p_3849ne4pe1.png"
                  alt="ULG CFW"
                  className="w-8 h-8 object-contain drop-shadow-[0_2px_8px_rgba(224,123,32,0.25)]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-[0.12em] text-grad">ULG</span>
                <span className="text-[var(--text-3)] text-[8px] font-semibold tracking-[0.22em] uppercase mt-0.5">CFW Roleplay</span>
              </div>
            </div>
            <p className="text-[var(--text-3)] text-xs leading-[1.8] mb-6 max-w-[220px]">مجتمع FiveM العربي المتخصص في تقمص الأدوار — عالم افتراضي لا ينام.</p>
            <div className="flex gap-2">
              <a href="https://discord.gg/gM6FaEMF2B" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-[#5865F2]/[0.08] hover:bg-[#5865F2]/15 border border-[#5865F2]/15 flex items-center justify-center text-[#5865F2] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_12px_rgba(88,101,242,0.15)] rounded-lg">
                <DiscordLogo className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@ulgcfw" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] transition-all duration-300 hover:scale-110 rounded-lg">
                <TikTokLogo className="w-4 h-4" />
              </a>
            </div>
          </div>
          {col('الموقع', [
            { label: 'الرئيسية', page: 'home' },
            { label: 'الطاقم', page: 'staff' },
            { label: 'القوانين', page: 'rules' },
          ])}
          {col('المجتمع', [
            { label: 'صناع المحتوى', page: 'creators' },
            { label: 'التقديمات', page: 'applications' },
            { label: 'المتجر', page: 'store' },
          ])}
          {col('تواصل', [
            { label: 'Discord', href: 'https://discord.gg/gM6FaEMF2B' },
            { label: 'TikTok', href: 'https://www.tiktok.com/@ulgcfw' },
          ])}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[var(--text-3)] text-[11px]">&copy; 2025 ULG CFW. جميع الحقوق محفوظة.</p>
          <p className="text-[var(--text-3)] text-[11px] text-center max-w-sm">ULG CFW مجتمع مستقل غير مرتبط بـ Rockstar Games أو Take-Two أو Cfx.re.</p>
        </div>
      </div>
    </footer>
  );
}
