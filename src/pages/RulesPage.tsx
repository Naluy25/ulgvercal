import { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Shield, Users, Briefcase, AlertTriangle, Scale, Star, Zap, Trophy, Award, Video, Package, FolderOpen, Coins, TrendingUp, Eye, Clock, Home, Car, Heart, Swords } from 'lucide-react';
import type { Page } from '../types';
import { getRules, type RuleCategory } from '../lib/store';

const ICON_MAP: Record<string, typeof BookOpen> = { BookOpen, Shield, Users, Briefcase, AlertTriangle, Scale, Star, Zap, Trophy, Award, Video, Package, FolderOpen, Coins, TrendingUp, Eye, Clock, Home, Car, Heart, Swords };

export default function RulesPage({ navigate }: { navigate?: (p: Page) => void }) {
  const [open, setOpen] = useState('general');
  const [cats, setCats] = useState<RuleCategory[]>(getRules);

  useEffect(() => {
    const interval = setInterval(() => { setCats(getRules()); }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-16 overflow-x-hidden">
      <section className="relative px-5 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="glow-orb w-[340px] h-[340px] bg-[#E07B20]/[0.06] -top-16 -right-20" />
        <div className="glow-orb w-[280px] h-[280px] bg-[#3B82F6]/[0.05] top-10 -left-16" />
        <div className="relative max-w-3xl mx-auto">
          <div className="max-w-2xl fade-up">
            <span className="section-label">القوانين</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-1)] leading-[1.1] mb-4 font-heading">
              قوانين <span className="text-grad">ULG CFW</span>
            </h1>
            <p className="text-[var(--text-2)] text-[15px] leading-[1.8] max-w-lg">
              الالتزام بالقوانين أساس تجربة ممتعة للجميع. اقرأها بعناية قبل البدء.
            </p>
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-16">
        <div className="max-w-3xl mx-auto">
          {cats.length === 0 ? (
            <div className="card p-16 text-center"><BookOpen className="w-12 h-12 text-[var(--text-3)]/30 mx-auto mb-4" /><p className="text-[var(--text-3)] text-sm">لا يوجد قوانين بعد</p></div>
          ) : (
            <div className="space-y-3">
              {cats.map((c, idx) => {
                const Icon = ICON_MAP[c.icon] || BookOpen;
                const isOpen = open === c.id;
                return (
                  <div key={c.id} className={`card overflow-hidden fade-up ${['delay-1', 'delay-2', 'delay-3'][idx % 3]} ${isOpen ? '!border-[var(--border-strong)]' : ''}`}>
                    <button onClick={() => setOpen(isOpen ? '' : c.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors duration-300">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}10`, border: `1px solid ${c.color}18` }}>
                          <Icon className="w-5 h-5" style={{ color: c.color }} /></div>
                        <div className="text-right">
                          <div className="font-bold text-[var(--text-1)] text-sm">{c.title}</div>
                          <div className="text-[var(--text-3)] text-[11px] mt-0.5">{c.rules.length} قوانين</div>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[var(--text-3)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && c.rules.length > 0 && (
                      <div className="px-5 pb-5 border-t border-white/[0.04]">
                        <div className="pt-4 space-y-4">
                          {c.rules.map((r, i) => (
                            <div key={i} className="flex gap-3.5 group">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                                style={{ background: `${c.color}10`, color: c.color, border: `1px solid ${c.color}15` }}>{i + 1}</div>
                              <div>
                                <div className="font-semibold text-[var(--text-1)] text-sm">{r.title}</div>
                                <div className="text-[var(--text-2)] text-[13px] mt-1 leading-[1.8]">
                                  {r.description.split('\n').map((line, li) => (
                                    <span key={li}>{line}{li < r.description.split('\n').length - 1 && <br />}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {isOpen && c.rules.length === 0 && (
                      <div className="px-5 pb-5 border-t border-white/[0.04]">
                        <div className="pt-4 text-center text-[var(--text-3)] text-sm">لا يوجد قوانين في هذا القسم</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 p-5 rounded-2xl bg-[var(--brand-dim)] border border-[var(--brand-border)] flex gap-3.5 fade-up">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-[var(--brand)]" /></div>
            <div>
              <div className="font-bold text-[var(--text-1)] text-sm mb-1">قوانين قابلة للتحديث</div>
              <p className="text-[var(--text-2)] text-[13px] leading-[1.8]">
                القوانين قابلة للتحديث. تحقق من آخر نسخة في قناة{' '}
                <strong className="text-[var(--brand)]">#قوانين</strong> على Discord. الجهل بالقانون لا يُعفي من العقوبة.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
