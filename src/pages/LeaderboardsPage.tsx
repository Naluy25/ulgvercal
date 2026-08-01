import { useState, useEffect } from 'react';
import { Trophy, Clock, Shield, Users, AlertTriangle, Zap, Crown, Medal, Video, ChevronDown } from 'lucide-react';
import type { Page } from '../types';
import { getLeaderboards } from '../lib/store';

const iconMap: Record<string, typeof Trophy> = { Trophy, Clock, Shield, Users, AlertTriangle, Zap, Video };

function fmtVal(v: number, unit: string) {
  if (unit === 'ريال' && v >= 1000000) return `${(v / 1000000).toFixed(2)}M`;
  if (unit === 'ريال' && v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

const rankStyles = [
  { bg: 'linear-gradient(135deg, #F59E0B, #d97706)', icon: Crown, ring: '#F59E0B' },
  { bg: 'linear-gradient(135deg, #94a3b8, #64748b)', icon: Medal, ring: '#94a3b8' },
  { bg: 'linear-gradient(135deg, #b45309, #92400e)', icon: Medal, ring: '#b45309' },
];

export default function LeaderboardsPage({ navigate }: { navigate?: (p: Page) => void }) {
  const [boards, setBoards] = useState(() => getLeaderboards());
  const [active, setActive] = useState(() => getLeaderboards()[0]?.id || 'rich');

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = getLeaderboards();
      setBoards(updated);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = boards.find((b) => b.id === active) || boards[0];
  const CurrentIcon = iconMap[current?.icon] || Trophy;

  const hasTop3 = current && current.data.length >= 3;

  return (
    <div className="pt-16 overflow-x-hidden">
      <section className="relative px-5 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="glow-orb w-[340px] h-[340px] bg-[#F59E0B]/[0.06] -top-16 -right-20" />
        <div className="glow-orb w-[280px] h-[280px] bg-[#3B82F6]/[0.05] top-10 -left-16" />
        <div className="relative max-w-5xl mx-auto">
          <div className="max-w-2xl fade-up">
            <span className="section-label">الإحصائيات</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-1)] leading-[1.1] mb-4 font-heading">
              قائمة <span className="text-grad">المتصدرين</span>
            </h1>
            <p className="text-[var(--text-2)] text-[15px] leading-[1.8] max-w-lg">
              أفضل اللاعبين في سيرفر ULG CFW عبر فئات متعددة — هل اسمك في القائمة؟
            </p>
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8 fade-up">
            {boards.map((b) => {
              const Icon = iconMap[b.icon] || Trophy;
              const isActive = active === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setActive(b.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive ? 'text-white shadow-lg' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                  }`}
                  style={
                    isActive
                      ? { background: b.color, boxShadow: `0 4px 20px ${b.color}35` }
                      : { background: 'var(--surface)', border: '1px solid var(--border)' }
                  }
                >
                  <Icon className="w-4 h-4" />
                  {b.title}
                </button>
              );
            })}
          </div>

          <div className="card overflow-hidden fade-up delay-1">
            <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${current.color}10`, border: `1px solid ${current.color}20` }}
              >
                <CurrentIcon className="w-5 h-5" style={{ color: current.color }} />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-[var(--text-1)] text-base">{current.title}</h2>
                <p className="text-[var(--text-3)] text-[11px] mt-0.5">{current.data.length} لاعب في القائمة</p>
              </div>
              <span
                className="badge"
                style={{ color: current.color, background: `${current.color}10`, border: `1px solid ${current.color}18` }}
              >
                {current.unit}
              </span>
            </div>

            {current.data.length === 0 ? (
              <div className="p-16 text-center">
                <Trophy className="w-12 h-12 text-[var(--text-3)]/30 mx-auto mb-4" />
                <p className="text-[var(--text-3)] text-sm">لا يوجد لاعبين في هذه القائمة بعد</p>
              </div>
            ) : (
              <>
                {hasTop3 && (
                  <div className="grid grid-cols-3 gap-4 p-6 pb-4 bg-gradient-to-b from-white/[0.01] to-transparent">
                    {[1, 0, 2].map((podiumIdx) => {
                      const p = current.data[podiumIdx];
                      if (!p) return <div key={podiumIdx} />;
                      const style = rankStyles[p.r - 1] || rankStyles[2];
                      const RankIcon = style.icon;
                      const isFirst = p.r === 1;
                      return (
                        <div
                          key={p.r}
                          className={`flex flex-col items-center ${isFirst ? 'order-2' : p.r === 2 ? 'order-1' : 'order-3'}`}
                        >
                          <div className="relative">
                            <img
                              src={p.avatar}
                              alt={p.name}
                              className={`rounded-2xl object-cover border-2 ${isFirst ? 'w-20 h-20' : 'w-14 h-14'}`}
                              style={{ borderColor: style.ring, boxShadow: `0 4px 16px ${style.ring}20` }}
                            />
                            <div
                              className={`absolute -top-2 -left-2 flex items-center justify-center shadow-lg ${
                                isFirst ? 'w-7 h-7' : 'w-6 h-6'
                              } rounded-full`}
                              style={{ background: style.bg }}
                            >
                              <RankIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                          <div className={`mt-3 flex items-center justify-center gap-1 ${isFirst ? 'text-sm' : 'text-xs'}`}>
                            <span className="font-semibold text-[var(--text-1)] truncate max-w-full">{p.name}</span>
                          </div>
                          <div className="text-sm font-bold mt-0.5" style={{ color: current.color }}>
                            {fmtVal(p.val, current.unit)}
                          </div>
                          {isFirst && <div className="text-[10px] text-[var(--text-3)] mt-0.5">{current.unit}</div>}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mx-6" />

                <div className="px-6 py-4 space-y-2">
                  {(hasTop3 ? current.data.filter((p) => p.r > 3) : current.data).map((p) => (
                    <div
                      key={p.r}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.015] hover:bg-white/[0.03] transition-colors duration-300 border border-transparent hover:border-white/[0.04]"
                    >
                      <span
                        className="w-7 text-center text-sm font-bold"
                        style={{ color: p.r <= 3 ? current.color : 'var(--text-3)' }}
                      >
                        {p.r}
                      </span>
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/5" />
                      <span className="flex-1 text-sm font-medium text-[var(--text-1)] truncate">{p.name}</span>
                      <span className="text-sm font-bold" style={{ color: current.color }}>
                        {fmtVal(p.val, current.unit)}
                      </span>
                      <span className="text-[11px] text-[var(--text-3)]">{current.unit}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
