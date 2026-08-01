import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Users, Twitch, Youtube, Radio, Music2 } from 'lucide-react';
import type { Page } from '../types';
import { getCreators } from '../lib/store';

const ULG_BANNER = 'https://h.top4top.io/p_38493hc7o1.png';

function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path d="M10.0 16.2l-3.8-3.8 1.4-1.4 2.4 2.4 5.4-5.4 1.4 1.4z" fill="white" />
    </svg>
  );
}

const platformMeta: Record<string, { color: string; icon: typeof Twitch; label: string }> = {
  Twitch:  { color: '#9146FF', icon: Twitch,   label: 'Twitch' },
  YouTube: { color: '#FF4444', icon: Youtube,  label: 'YouTube' },
  Kick:    { color: '#53FC18', icon: Radio,    label: 'Kick' },
  TikTok:  { color: '#FF004F', icon: Music2,   label: 'TikTok' },
};

const PLATFORM_FILTERS = ['الكل', 'Kick', 'Twitch', 'YouTube', 'TikTok'] as const;

export default function CreatorsPage({ navigate }: { navigate?: (p: Page) => void }) {
  const [creators, setCreators] = useState(() => getCreators());
  const [activePlatform, setActivePlatform] = useState<string>('الكل');

  useEffect(() => {
    const interval = setInterval(() => setCreators(getCreators()), 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    if (activePlatform === 'الكل') return creators;
    return creators.filter(c => c.platforms.some(p => p.name === activePlatform));
  }, [creators, activePlatform]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { Kick: 0, Twitch: 0, YouTube: 0, TikTok: 0 };
    creators.forEach(c => c.platforms.forEach(p => { if (counts[p.name] !== undefined) counts[p.name]++; }));
    return counts;
  }, [creators]);

  return (
    <div className="pt-16 overflow-x-hidden">
      {/* HERO */}
      <section className="relative px-5 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#9146FF]/[0.06] -top-20 -left-24" />
        <div className="glow-orb w-[350px] h-[350px] bg-[#E07B20]/[0.06] top-10 -right-20" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-2xl fade-up">
            <span className="section-label">المعتمدون</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-1)] leading-[1.1] mb-4 font-heading">
              صناع <span className="text-grad">المحتوى</span>
            </h1>
            <p className="text-[var(--text-2)] text-[15px] leading-[1.8] mb-8 max-w-lg">
              أبرز صناع المحتوى المعتمدين داخل مجتمع ULG CFW — تابع قنواتهم واستكشف محتواهم على مختلف المنصات.
            </p>
          </div>
        </div>
      </section>

      {/* PLATFORM TABS */}
      <section className="relative px-5 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2.5 fade-up delay-1">
            {PLATFORM_FILTERS.map(pf => {
              const isActive = activePlatform === pf;
              const isAll = pf === 'الكل';
              const meta = !isAll ? platformMeta[pf] : null;
              const Icon = meta?.icon;
              const count = isAll ? creators.length : (platformCounts[pf] || 0);

              return (
                <button
                  key={pf}
                  onClick={() => setActivePlatform(pf)}
                  className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-[var(--surface)] text-[var(--text-2)] border border-white/[0.04] hover:text-[var(--text-1)] hover:border-white/[0.08] hover:bg-[var(--surface-2)]'
                  }`}
                  style={isActive && meta ? {
                    background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
                    boxShadow: `0 4px 20px ${meta.color}30`,
                  } : isActive ? {
                    background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                    boxShadow: '0 4px 20px rgba(224,123,32,0.25)',
                  } : {}}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {isAll && <Users className="w-4 h-4" />}
                  <span>{pf}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-white/[0.04] text-[var(--text-3)]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CREATORS GRID */}
      <section className="relative px-5 pb-20">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="card p-16 text-center hover:transform-none fade-up">
              <Users className="w-12 h-12 text-[var(--text-3)]/20 mx-auto mb-4" />
              <p className="text-[var(--text-2)] text-base font-semibold mb-1">لا يوجد صناع محتوى</p>
              <p className="text-[var(--text-3)] text-sm">
                {activePlatform === 'الكل' ? 'لم تتم إضافة أي صانع محتوى بعد' : `لا يوجد صناع محتوى على ${activePlatform}`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 fade-up delay-2">
                <h3 className="text-sm font-bold text-[var(--text-3)]">
                  عرض <span className="text-[var(--brand)]">{filtered.length}</span> صانع محتوى
                  {activePlatform !== 'الكل' && <span> على {activePlatform}</span>}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((c, idx) => (
                  <div
                    key={c.name}
                    className="card overflow-hidden group fade-up"
                    style={{ animationDelay: `${0.05 * (idx % 6)}s` }}
                  >
                    {/* Banner */}
                    <div className="relative h-24 overflow-hidden">
                      <img
                        src={c.banner || ULG_BANNER}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ filter: 'saturate(0.8)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/60 to-transparent" />
                    </div>

                    {/* Avatar + Info */}
                    <div className="px-5 pb-5 -mt-10">
                      <div className="relative inline-block">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[var(--surface)] border border-[var(--border)]"
                        />
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[var(--text-1)] text-base">{c.name}</h3>
                          {c.verified && <VerifiedBadge className="w-[17px] h-[17px] shrink-0" />}
                        </div>
                        <p className="text-[var(--text-3)] text-xs mt-0.5">{c.handle}</p>
                        {c.verified && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#1877F2]/[0.08] border border-[#1877F2]/20 text-[#1877F2] text-[10px] font-bold">
                            صانع محتوى موثّق
                          </span>
                        )}
                      </div>

                      <p className="text-[var(--text-2)] text-[13px] mt-3 leading-[1.7] line-clamp-2">{c.bio}</p>

                      {c.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {c.platforms.map((p) => {
                            const meta = platformMeta[p.name];
                            const PIcon = meta?.icon ?? ExternalLink;
                            return (
                              <a
                                key={p.name}
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105"
                                style={{
                                  background: `${meta?.color ?? '#888'}[0.08]`,
                                  color: meta?.color ?? '#888',
                                  border: `1px solid ${meta?.color ?? '#888'}20`,
                                }}
                              >
                                <PIcon className="w-3 h-3" />
                                {p.name}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
