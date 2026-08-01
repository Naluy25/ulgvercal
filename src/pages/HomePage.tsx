import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Users, ChevronLeft, Sparkles, Shield, BookOpen, FileText, MapPin, Zap } from 'lucide-react';
import { getCreators } from '../lib/store';
import type { Page } from '../types';

function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path d="M10.0 16.2l-3.8-3.8 1.4-1.4 2.4 2.4 5.4-5.4 1.4 1.4z" fill="white" />
    </svg>
  );
}
import { DiscordLogo } from '../components/Icons';

const SERVER_BG = 'https://h.top4top.io/p_38493hc7o1.png';
const SERVER_LOGO = 'https://a.top4top.io/p_3849ne4pe1.png';

const stats = [
  { v: '+5,000', l: 'عضو نشط' },
  { v: '+800',   l: 'لاعب يومي' },
  { v: '+50K',   l: 'ساعة محتوى' },
];

const creators = getCreators().filter(c => c.verified);

const community = [
  { title: 'من نحن',   desc: 'ULG CFW مجتمع FiveM العربي الرائد لتقمص الأدوار — نبني تجربة غامرة ومجتمع راقٍ يحترم القوانين ويصنع القصص.', icon: Shield,   cta: null,            page: null as Page | null },
  { title: 'القوانين',  desc: 'بيئة منظمة بقواعد واضحة تضمن المتعة والاحترام للجميع — اقرأها قبل الانضمام.',                              icon: BookOpen, cta: 'قراءة القوانين', page: 'rules' as Page },
  { title: 'التقديمات', desc: 'سجّل بياناتك واملأ قصة شخصيتك ليراجعها الفريق ويفعّل حسابك للدخول إلى السيرفر.',                          icon: FileText, cta: 'التقديم الآن',   page: 'applications' as Page },
];

const marqueeWords = ['تقمص أدوار', 'قصص لا تنتهي', 'مجتمع عربي', 'اقتصاد حيّ', 'بطولات', 'وظائف', 'عصابات', 'شرطة', 'مستشفيات'];

const features = [
  { icon: Shield, title: 'شرطة وإسعاف', desc: 'نظام قطاعات كامل بتعيين وترقيات', color: '#3B82F6' },
  { icon: Users, title: 'عصابات', desc: 'تحكم في مناطقك وابن إمبراطوريتك', color: '#EF4444' },
  { icon: Zap, title: 'اقتصاد حيّ', desc: 'وظائف، تجارة، وممتلكات', color: '#F59E0B' },
  { icon: MapPin, title: 'عالم مفتوح', desc: 'خريطة ضخمة بأنشطة لا تنتهي', color: '#10B981' },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({ children, delay = '', className = '' }: { children: React.ReactNode; delay?: string; className?: string }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`${shown ? 'fade-up ' + delay : 'opacity-0'} ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative min-h-[94vh] flex items-center overflow-hidden noise-overlay">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={SERVER_BG}
            alt=""
            className="w-full h-full object-cover opacity-[0.2]"
            style={{ filter: 'saturate(0.7)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 via-[var(--bg)]/70 to-[var(--bg)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(224,123,32,0.08),transparent_70%)]" />
        </div>

        {/* Grid + glow overlays */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="glow-orb w-[600px] h-[600px] bg-[#E07B20]/[0.07] -top-48 -right-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#b85e10]/[0.05] bottom-0 -left-40" />

        {/* Floating decorative lines */}
        <div className="absolute top-0 right-0 w-[350px] h-[1px] bg-gradient-to-l from-[#E07B20]/40 to-transparent origin-right rotate-[-30deg] translate-y-40 -translate-x-24" />
        <div className="absolute bottom-32 left-0 w-[200px] h-[1px] bg-gradient-to-r from-[#E07B20]/20 to-transparent origin-left rotate-[15deg] translate-y-10" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 py-20">
          <div className="max-w-2xl">
            {/* Server logo */}
            <div className="mb-8 fade-up">
              <img
                src={SERVER_LOGO}
                alt="ULG CFW"
                className="w-20 h-20 object-contain drop-shadow-[0_4px_24px_rgba(224,123,32,0.35)]"
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 glass border border-[var(--brand-border)] text-[var(--brand)] text-xs font-bold mb-8 fade-up delay-1 rounded-xl">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[var(--brand)] live-dot" />
                <span className="relative rounded-full bg-[var(--brand)] w-2 h-2" />
              </span>
              السيرفر مفتوح الآن
            </div>

            {/* Heading */}
            <h1 className="text-[2.6rem] sm:text-[3.8rem] font-extrabold leading-[1.08] mb-6 fade-up delay-1">
              <span className="text-[var(--text-1)]">ابدأ رحلتك —</span>
              <br />
              <span className="text-grad-neon">واصنع قصتك في ULG</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[var(--text-2)] text-[15px] sm:text-lg leading-[1.8] mb-10 max-w-xl fade-up delay-2">
              سيرفر FiveM العربي لتقمص الأدوار. قصص حقيقية، شخصيات مميزة، عالم بلا حدود — حيث كل قرار يصنع الفرق.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 fade-up delay-3">
              <button onClick={() => navigate('applications')} className="btn-angular group">
                التقديم على الوايت ليست
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
              <button onClick={() => navigate('store')} className="btn-ghost group">
                تصفح المتجر
                <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 sm:gap-10 mt-16 fade-up delay-4">
              {stats.map((s, i) => (
                <div key={s.l} className="flex items-center gap-6 sm:gap-10">
                  <div className="text-right">
                    <div className="text-[1.75rem] sm:text-3xl font-extrabold text-grad leading-none font-heading">{s.v}</div>
                    <div className="text-[var(--text-3)] text-xs mt-2 font-medium">{s.l}</div>
                  </div>
                  {i < stats.length - 1 && <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#E07B20]/25 to-transparent" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom marquee */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/[0.03] bg-[var(--bg-2)]/60 backdrop-blur-sm overflow-hidden">
          <div className="flex gap-10 py-3.5 whitespace-nowrap"
               style={{ animation: 'marquee 30s linear infinite' }}>
            {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i} className="inline-flex items-center gap-10 text-[var(--text-3)] text-[11px] font-bold tracking-wider uppercase">
                {w} <Sparkles className="w-3 h-3 text-[var(--brand)]/50" />
              </span>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(33.33%); }
          }
        `}</style>
      </section>

      {/* ════════════════════════ FEATURES STRIP ════════════════════════ */}
      <section className="relative px-5 py-12 border-b border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-center gap-3.5 fade-up group cursor-default" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="w-11 h-11 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}10`, border: `1px solid ${f.color}20`, clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-1)]">{f.title}</div>
                    <div className="text-[11px] text-[var(--text-3)] mt-0.5">{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════ ABOUT US ════════════════════════ */}
      <section className="relative px-5 py-28 border-b border-white/[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(224,123,32,0.04),transparent)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="w-16 h-16 mx-auto mb-6">
              <img src={SERVER_LOGO} alt="ULG CFW" className="w-full h-full object-contain drop-shadow-[0_4px_20px_rgba(224,123,32,0.3)]" />
            </div>
            <span className="section-label mb-4 inline-block">عن المدينة</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-1)] font-display tracking-wide mb-6">
              مدينة ULG CFW
            </h2>
            <p className="text-[var(--text-2)] text-base sm:text-lg leading-[1.9] max-w-2xl mx-auto">
              نحنُ سيرفر مدينة يوإلجي الحياة الواقعية لتمثيل الأدوار، تم إفتتاح أول نسخة لنا في عام 2015 ومازلنا نطورُ من الخادم من أجلكم.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════ LIVE STREAMS ════════════════════════ */}
      <section className="relative px-5 py-28">
        <div className="glow-orb w-[300px] h-[300px] bg-[#9146FF]/[0.06] top-20 left-0" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <span className="section-label">صناع المحتوى</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-1)] font-display tracking-wide">
                  شاهد أفضل صناع المحتوى
                </h2>
              </div>
              <button onClick={() => navigate('creators')} className="flex items-center gap-1 text-sm text-[var(--text-3)] hover:text-[var(--brand)] transition-colors duration-300 group">
                عرض الكل <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {creators.map((c, idx) => (
              <Reveal key={c.name} delay={['', 'delay-1', 'delay-2'][idx]}>
                <div className="card-angular p-5 group h-full hover:!border-[var(--brand-border)]">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img src={c.avatar} alt={c.name} className="w-14 h-14 object-cover ring-2 ring-white/5 group-hover:ring-[var(--brand)]/30 transition-all duration-300"
                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="font-bold text-[var(--text-1)] text-sm truncate">{c.name}</div>
                        {c.verified && <VerifiedBadge className="w-[17px] h-[17px] shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {c.platforms.map((p) => (
                          <span key={p.name} className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: p.name === 'Kick' ? '#53FC18' : p.name === 'Twitch' ? '#9146FF' : p.name === 'YouTube' ? '#FF0000' : '#FF4444' }}>
                            {p.name}
                          </span>
                        ))}
                        {c.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#1877F2] font-bold">
                            صانع محتوى موثّق
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

                  <div className="text-xs text-[var(--text-3)] text-center py-1">{c.bio}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider max-w-6xl mx-auto" />

      {/* ════════════════════════ COMMUNITY + DISCORD ════════════════════════ */}
      <section className="relative px-5 py-28">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12 max-w-xl">
              <span className="section-label">مجتمع ULG</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-1)] font-display tracking-wide">تعرّف علينا</h2>
              <p className="text-[var(--text-3)] text-sm mt-3">مجتمع مبني على الاحترام، القصص، والشغف بتقمص الأدوار.</p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              {community.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <Reveal key={c.title} delay={['', 'delay-1', 'delay-2'][idx]}>
                    <div className="card-angular p-6 group h-full">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-11 h-11 bg-[var(--brand-dim)] border border-[var(--brand-border)] flex items-center justify-center text-[var(--brand)] group-hover:bg-[var(--brand)]/10 transition-all duration-300"
                          style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[var(--text-1)] text-base mb-1.5">{c.title}</h3>
                          <p className="text-[var(--text-2)] text-sm leading-[1.8]">{c.desc}</p>
                          {c.cta && c.page && (
                            <button onClick={() => navigate(c.page!)} className="mt-4 flex items-center gap-1.5 text-sm text-[var(--brand)] hover:gap-2.5 transition-all duration-300 font-bold">
                              {c.cta} <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay="delay-1">
              <div className="card-angular p-6 sticky top-24 bg-gradient-to-b from-[var(--surface)] to-[var(--bg-2)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 bg-[#5865F2]/[0.08] border border-[#5865F2]/15 flex items-center justify-center text-[#5865F2]"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                    <DiscordLogo className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[var(--text-1)] text-base">سيرفر Discord</div>
                    <div className="text-[var(--text-3)] text-xs flex items-center gap-1.5">
                      ULG CFW Community
                      <span className="inline-flex items-center gap-1 text-[#22c55e]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" /> متصل
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[var(--text-2)] text-sm leading-[1.8] mb-5">
                  انضم لأكثر من <span className="text-[var(--text-1)] font-bold">5,000 عضو</span>. تحدث مع اللاعبين، تابع آخر الأخبار، وكن جزءاً من القصة.
                </p>

                <div className="relative overflow-hidden border border-white/[0.05] bg-[#2b2d31] rounded-xl">
                  <iframe
                    src="https://discord.com/widget?id=1075522145876201532&theme=dark"
                    width="100%"
                    height="340"
                    allowTransparency={true}
                    frameBorder={0}
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    className="w-full"
                    title="Discord"
                  />
                </div>

                <a href="https://discord.gg/gM6FaEMF2B" target="_blank" rel="noopener noreferrer"
                   className="btn-angular w-full justify-center mt-5 group"
                   style={{ background: 'linear-gradient(135deg, #5865F2, #4752c4)', boxShadow: '0 4px 16px rgba(88,101,242,0.25)' }}>
                  <DiscordLogo className="w-4 h-4" />
                  انضم إلى Discord
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
}
