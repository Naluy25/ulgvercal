import { Crown, Shield, Star, MessageCircle, Calendar, Heart } from 'lucide-react';
import { DiscordLogo } from '../components/Icons';
import type { Page } from '../types';

const founders = [
  {
    name: 'Abu,Gabaaal',
    note: 'مؤسس',
    avatar: 'https://a.top4top.io/p_3849ne4pe1.png',
    online: true,
    joined: '2015',
    role: 'المؤسس الرئيسي',
    desc: 'مطور ومبتكر مشروع ULG CFW — بنى هذا المجتمع من الصفر وعمل على تطويره ليصبح أحد أقوى مجتمعات FiveM العربية.',
    discord: 'https://discord.gg/gM6FaEMF2B',
  },
  {
    name: 'YBV10',
    note: 'مؤسس',
    avatar: 'https://a.top4top.io/p_3849ne4pe1.png',
    online: true,
    joined: '2015',
    role: 'مؤسس مشارك',
    desc: 'شريك في تأسيس ULG CFW — ساهم في بناء الأساس ودعم المجتمع منذ أول يوم لافتتاح السيرفر.',
    discord: 'https://discord.gg/gM6FaEMF2B',
  },
];

const milestones = [
  { year: '2015', event: 'إفتتاح أول نسخة', icon: Star },
  { year: '2020', event: 'إطلاق الموقع الرسمي', icon: Shield },
  { year: '2024', event: 'إطلاق ULG CFW', icon: Heart },
];

export default function StaffPage({ navigate }: { navigate?: (p: Page) => void }) {
  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://h.top4top.io/p_38493hc7o1.png"
            alt=""
            className="w-full h-full object-cover opacity-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 via-[var(--bg)]/70 to-[var(--bg)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(245,158,11,0.1),transparent_70%)]" />
        </div>

        {/* Grid + glow */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="glow-orb w-[500px] h-[500px] bg-[#F59E0B]/12 -top-40 right-1/4" />
        <div className="glow-orb w-[350px] h-[350px] bg-[#E07B20]/8 bottom-0 -left-20" />

        {/* Diagonal accent */}
        <div className="absolute top-0 right-0 w-[300px] h-[2px] bg-gradient-to-l from-[#F59E0B] to-transparent origin-right rotate-[-35deg] translate-y-32 -translate-x-20 opacity-50" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 py-20 text-center">
          <div className="fade-up">
            {/* Crown icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-[#F59E0B]" />
            </div>

            <span className="section-label mb-4 inline-block">الفريق</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[var(--text-1)] leading-tight mb-5">
              الطاقم <span className="text-grad">الإداري</span>
            </h1>
            <p className="text-[var(--text-2)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              المؤسسون الذين بنوا ULG CFW من الصفر — يقودون المجتمع بأكثر من <span className="text-[var(--brand)] font-bold">9 سنوات</span> من الخبرة.
            </p>
          </div>

          {/* Milestones */}
          <div className="flex justify-center gap-6 mt-12 fade-up delay-1">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={m.year} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-white/5 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--brand)]" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--text-1)] leading-none">{m.year}</div>
                    <div className="text-[var(--text-3)] text-[10px] mt-0.5">{m.event}</div>
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="hidden sm:block h-px w-8 bg-gradient-to-l from-[var(--brand)]/30 to-transparent mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOUNDERS ════════════════════════ */}
      <section className="relative px-5 pb-24 -mt-8">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8 fade-up">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--text-1)] text-base">المؤسسان</h2>
              <p className="text-[var(--text-3)] text-xs mt-0.5">القائدان الرئيسيان للمجتمع</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {founders.map((f, i) => (
              <div
                key={f.name}
                className="fade-up group"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)] hover:border-[var(--brand)]/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(224,123,32,0.1)]">
                  {/* Top gold accent bar */}
                  <div className="h-[3px] w-full bg-gradient-to-r from-[#F59E0B] via-[#E07B20] to-[#F59E0B]" />

                  {/* Banner area */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src="https://h.top4top.io/p_38493hc7o1.png"
                      alt=""
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-45 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/40 to-[var(--surface)]" />
                    {/* Crown overlay */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/25 flex items-center justify-center backdrop-blur-sm">
                      <Crown className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    {/* Year badge */}
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-[var(--text-2)]">
                      منذ {f.joined}
                    </div>
                  </div>

                  {/* Avatar + info */}
                  <div className="px-6 pb-7 -mt-14 relative z-10">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#F59E0B]/30 to-[#E07B20]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                      <img
                        src={f.avatar}
                        alt={f.name}
                        className="relative w-[88px] h-[88px] rounded-2xl object-cover ring-4 ring-[var(--surface)] border-2 border-[#F59E0B]/20 group-hover:border-[#F59E0B]/40 transition-all duration-300"
                      />
                      {/* Online dot */}
                      <span
                        className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full border-[3px] border-[var(--surface)]"
                        style={{
                          background: f.online ? '#22c55e' : '#5a5a68',
                          boxShadow: f.online ? '0 0 12px rgba(34,197,94,0.6)' : 'none',
                        }}
                      />
                    </div>

                    {/* Name */}
                    <h3 className="font-extrabold text-[var(--text-1)] text-xl mb-1">{f.name}</h3>

                    {/* Role tags */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-bold">
                        <Crown className="w-3 h-3" />
                        {f.role}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface-2)] border border-white/5 text-[var(--text-3)] text-[10px] font-semibold">
                        <Calendar className="w-3 h-3" />
                        {f.joined}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#22c55e] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />
                        متصل
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[var(--text-2)] text-sm leading-relaxed mb-6">
                      {f.desc}
                    </p>

                    {/* Discord button */}
                    <a
                      href={f.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-2.5 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/15 text-[#5865F2] text-sm font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_4px_20px_rgba(88,101,242,0.15)]"
                    >
                      <DiscordLogo className="w-4 h-4" />
                      تواصل على Discord
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom quote */}
          <div className="mt-16 text-center fade-up delay-2">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--surface-2)] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-dim)] border border-[var(--border-brand)] flex items-center justify-center shrink-0">
                <img src="https://a.top4top.io/p_3849ne4pe1.png" alt="" className="w-6 h-6 object-contain" />
              </div>
              <p className="text-[var(--text-2)] text-sm leading-relaxed max-w-md">
                <span className="text-[var(--text-1)] font-bold">ULG CFW</span> — مجتمع مبني على الشغف والإبداع، نعمل لتقديم أفضل تجربةFiveM عربية.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
