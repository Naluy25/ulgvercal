import { useState } from 'react';
import {
  Settings, Plus, Trash2, Save, Users, Trophy, X, Edit3, Eye,
  Check, ChevronLeft, Crown, Star, Shield, Zap, Award, Video, ShoppingBag,
  Package, Tag, DollarSign, Link, BarChart3, TrendingUp, AlertCircle,
  FolderOpen, Coins, BookOpen, FileText, ExternalLink,
  Radio, Music2, Youtube, Twitch, Heart, Landmark, Scale,
  ChevronDown, Copy, ToggleRight, ToggleLeft, MessageSquare, Type
} from 'lucide-react';
import type { DiscordUser, DiscordMember, Page } from '../types';
import type { Creator, Leaderboard, LeaderboardEntry, RuleCategory, Rule, StoreCategory, StoreProduct, ApplicationTypeConfig, ApplicationQuestion } from '../lib/store';
import {
  getCreators, addCreator, removeCreator,
  getLeaderboards, saveLeaderboards, addLeaderboard, removeLeaderboard, updateLeaderboard,
  updateLeaderboardEntry, removeLeaderboardEntry,
  getStore, addStoreCategory, removeStoreCategory,
  addStoreProduct, removeStoreProduct, updateStoreProduct,
  getRules, addRuleCategory, removeRuleCategory, addRule, removeRule, updateRule,
  getApplications, addApplication, removeApplication, updateApplication,
} from '../lib/store';
import { ULGShield } from '../components/Icons';

const ADMIN_ROLE_ID = '1409636726435086366';
type AdminTab = 'creators' | 'leaderboard' | 'store' | 'rules' | 'applications';

const PLATFORMS = [
  { name: 'Kick', color: '#53FC18', icon: Radio },
  { name: 'Twitch', color: '#9146FF', icon: Twitch },
  { name: 'YouTube', color: '#FF4444', icon: Youtube },
  { name: 'TikTok', color: '#FF004F', icon: Music2 },
] as const;
const PLATFORM_MAP: Record<string, typeof PLATFORMS[number]> = Object.fromEntries(PLATFORMS.map(p => [p.name, p])) as any;

const ICON_MAP: Record<string, any> = { Star, Trophy, Shield, Users, Zap, Video, Award, Coins, Package, Crown, Heart, Home: FolderOpen, Car: TrendingUp, Clock: Eye, AlertTriangle: AlertCircle, BookOpen, Scale, Briefcase: TrendingUp, User: Users, Landmark, FileText };
function getIcon(name: string) { return ICON_MAP[name] || Package; }

export default function AdminPanel({ user, member, navigate }: {
  user: DiscordUser | null; member: DiscordMember | null; navigate: (p: Page) => void;
}) {
  const [tab, setTab] = useState<AdminTab>('creators');
  const [creators, setCreatorsState] = useState<Creator[]>(getCreators);
  const [boards, setBoardsState] = useState<Leaderboard[]>(getLeaderboards);
  const [storeCats, setStoreCats] = useState<StoreCategory[]>(getStore);
  const [rulesCats, setRulesCats] = useState<RuleCategory[]>(getRules);
  const [apps, setApps] = useState<ApplicationTypeConfig[]>(getApplications);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAdmin = member?.roles.includes(ADMIN_ROLE_ID);
  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  if (!user || !isAdmin) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-1)] mb-2">غير مصرح</h2>
          <p className="text-[var(--text-2)] text-sm mb-8 leading-relaxed">لا تملك صلاحية الوصول لهذه الصفحة.<br/>تواصل مع الإدارة للحصول على الصلاحيات.</p>
          <button onClick={() => navigate('home')} className="btn-primary">الرئيسية</button>
        </div>
      </div>
    );
  }

  const totalProducts = storeCats.reduce((s, c) => s + c.items.length, 0);
  const totalEntries = boards.reduce((s, b) => s + b.data.length, 0);
  const totalRules = rulesCats.reduce((s, c) => s + c.rules.length, 0);

  const navItems: { id: AdminTab; label: string; icon: any; color: string; count: number; desc: string }[] = [
    { id: 'creators', label: 'صناع المحتوى', icon: Users, color: '#E07B20', count: creators.length, desc: 'إدارة صناع المحتوى' },
    { id: 'leaderboard', label: 'المتصدرين', icon: Trophy, color: '#F59E0B', count: totalEntries, desc: 'قوائم الترتيب' },
    { id: 'store', label: 'المتجر', icon: ShoppingBag, color: '#10B981', count: totalProducts, desc: 'المنتجات والأسعار' },
    { id: 'rules', label: 'القوانين', icon: BookOpen, color: '#8B5CF6', count: totalRules, desc: 'نظام السيرفر' },
    { id: 'applications', label: 'التقديمات', icon: FileText, color: '#3B82F6', count: apps.length, desc: 'نظام التقديمات' },
  ];

  const stats = [
    { label: 'صناع محتوى', value: creators.length, color: '#E07B20', icon: Users },
    { label: 'مدخلات', value: totalEntries, color: '#F59E0B', icon: Trophy },
    { label: 'منتجات', value: totalProducts, color: '#10B981', icon: Package },
    { label: 'قوانين', value: totalRules, color: '#8B5CF6', icon: BookOpen },
  ];

  return (
    <div className="pt-16 flex min-h-screen" dir="rtl">
      {/* SIDEBAR */}
      <aside className={`fixed top-16 bottom-0 right-0 overflow-hidden transition-all duration-500 z-40 ${sidebarOpen ? 'w-72' : 'w-0'}`}>
        <div className="w-72 h-full flex flex-col bg-[var(--bg-2)] border-l border-white/[0.04]" style={{ boxShadow: '-8px 0 40px rgba(0,0,0,0.3)' }}>
          <div className="p-5 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E07B20] to-[#b85e10] flex items-center justify-center shadow-lg shadow-[#E07B20]/20">
                  <ULGShield className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--bg-2)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-extrabold text-[var(--text-1)]">لوحة التحكم</h2>
                <p className="text-[10px] font-medium text-green-400">● متصل الآن</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-b border-white/[0.04]">
            <div className="grid grid-cols-2 gap-2">
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="relative p-3 rounded-xl overflow-hidden group" style={{ background: `${s.color}08`, border: `1px solid ${s.color}12` }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 50% 50%, ${s.color}10, transparent)` }} />
                    <div className="relative flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                      <div>
                        <div className="text-base font-extrabold leading-none" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[9px] text-[var(--text-3)] mt-0.5">{s.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            <div className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-wider px-3 mb-2">الإدارة</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${active ? 'text-white' : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.03]'}`}
                  style={active ? { background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`, border: `1px solid ${item.color}25` } : { border: '1px solid transparent' }}>
                  {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full" style={{ background: item.color }} />}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300" style={active ? { background: `${item.color}18` } : { background: 'rgba(255,255,255,0.03)' }}>
                    <Icon className="w-[18px] h-[18px]" style={active ? { color: item.color } : {}} />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-sm" style={active ? { color: item.color } : {}}>{item.label}</div>
                    <div className="text-[10px] text-[var(--text-3)]">{item.desc}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={active ? { background: `${item.color}15`, color: item.color } : { background: 'rgba(255,255,255,0.04)', color: 'var(--text-3)' }}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-l from-white/[0.03] to-transparent border border-white/[0.04]">
              <img src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : `https://ui-avatars.com/api/?name=${user?.username || 'A'}&background=E07B20&color=fff&size=64`} alt="" className="w-10 h-10 rounded-xl object-cover border-2 border-[#E07B20]/30" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[var(--text-1)] truncate">{user?.global_name || user?.username}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-medium text-[#E07B20]">مدير النظام</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`fixed top-20 z-50 p-2 bg-[var(--surface)] border border-white/[0.06] rounded-l-xl transition-all duration-500 hover:bg-[var(--surface-2)] group ${sidebarOpen ? 'right-[288px]' : 'right-0'}`}>
        <ChevronLeft className={`w-4 h-4 text-[var(--text-2)] transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
      </button>

      <main className={`flex-1 transition-all duration-500 overflow-y-auto ${sidebarOpen ? 'mr-72' : 'mr-0'}`}>
        <div className="lg:hidden sticky top-16 z-10 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${tab === item.id ? 'text-white shadow-lg scale-[1.02]' : 'bg-[var(--surface)] text-[var(--text-2)] border border-white/[0.06]'}`}
                  style={tab === item.id ? { background: item.color, boxShadow: `0 4px 20px ${item.color}30` } : {}}>
                  <Icon className="w-3.5 h-3.5" /> {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          {saved && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-2xl shadow-emerald-500/30" style={{ animation: 'fadeUp 0.3s ease-out' }}>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-4 h-4" /></div>
              تم الحفظ بنجاح
            </div>
          )}

          {tab === 'creators' && <CreatorsTab creators={creators} setCreatorsState={setCreatorsState} showSaved={showSaved} />}
          {tab === 'leaderboard' && <LeaderboardTab boards={boards} setBoardsState={setBoardsState} showSaved={showSaved} />}
          {tab === 'store' && <StoreTab storeCats={storeCats} setStoreCats={setStoreCats} showSaved={showSaved} />}
          {tab === 'rules' && <RulesTab rulesCats={rulesCats} setRulesCats={setRulesCats} showSaved={showSaved} />}
          {tab === 'applications' && <ApplicationsTab apps={apps} setApps={setApps} showSaved={showSaved} />}
        </div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════════════════════════════ */
function StatsGrid({ items }: { items: { l: string; v: number | string; c: string; i: any }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up">
      {items.map(s => {
        const Icon = s.i;
        return (
          <div key={s.l} className="relative card-flat p-4 overflow-hidden group hover:transform-none">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 30% 30%, ${s.c}08, transparent)` }} />
            <div className="relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.c}10`, border: `1px solid ${s.c}15` }}>
                <Icon className="w-5 h-5" style={{ color: s.c }} />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wide">{s.l}</div>
                <div className="text-xl font-extrabold mt-0.5" style={{ color: s.c }}>{s.v}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({ label, title, desc, color = 'var(--brand)' }: { label: string; title: string; desc: string; color?: string }) {
  return (
    <div className="fade-up">
      <span className="section-label" style={{ color }}>{label}</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-1)] mb-1">{title}</h1>
      <p className="text-[var(--text-3)] text-sm">{desc}</p>
    </div>
  );
}

function FormCard({ title, icon: Icon, iconColor, children, footer }: { title: string; icon: any; iconColor: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="card p-6 hover:transform-none fade-up">
      <h3 className="text-sm font-bold text-[var(--text-1)] mb-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${iconColor}12` }}><Icon className="w-4 h-4" style={{ color: iconColor }} /></div>
        {title}
      </h3>
      {children}
      {footer && <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.04]">{footer}</div>}
    </div>
  );
}

function ListCard({ title, icon: Icon, iconColor, count, countLabel, children, emptyIcon: EmptyIcon, emptyText }: {
  title: string; icon: any; iconColor: string; count: number; countLabel: string; children: React.ReactNode; emptyIcon: any; emptyText: string;
}) {
  return (
    <div className="card overflow-hidden hover:transform-none fade-up">
      <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}12` }}><Icon className="w-5 h-5" style={{ color: iconColor }} /></div>
        <div className="flex-1"><h3 className="text-sm font-bold text-[var(--text-1)]">{title}</h3><p className="text-[10px] text-[var(--text-3)]">{count} {countLabel}</p></div>
      </div>
      {count === 0 ? (
        <div className="p-12 text-center"><EmptyIcon className="w-12 h-12 text-[var(--text-3)]/15 mx-auto mb-3" /><p className="text-[var(--text-3)] text-sm">{emptyText}</p></div>
      ) : (
        <div className="divide-y divide-white/[0.03]">{children}</div>
      )}
    </div>
  );
}

function PillTab({ label, active, color, count, onClick, onDelete }: { label: string; active: boolean; color: string; count?: number; onClick: () => void; onDelete?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${active ? 'text-white shadow-lg scale-[1.02]' : 'bg-[var(--surface)] text-[var(--text-2)] border border-white/[0.06] hover:text-[var(--text-1)]'}`}
      style={active ? { background: color, boxShadow: `0 4px 20px ${color}30` } : {}}>
      {label}
      {count !== undefined && <span className="text-[10px] opacity-70">{count}</span>}
      {onDelete && <span onClick={e => { e.stopPropagation(); onDelete(); }} className="w-4 h-4 rounded-full bg-white/20 hover:bg-red-500/40 flex items-center justify-center text-[8px] cursor-pointer">✕</span>}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   CREATORS TAB
   ══════════════════════════════════════════════════════════════ */
function CreatorsTab({ creators, setCreatorsState, showSaved }: { creators: Creator[]; setCreatorsState: React.Dispatch<React.SetStateAction<Creator[]>>; showSaved: () => void }) {
  const [nc, setNc] = useState<Partial<Creator>>({});
  const [pSel, setPSel] = useState('');
  const [pUrl, setPUrl] = useState('');

  const handleAdd = () => {
    if (!nc.name || !nc.handle) return;
    setCreatorsState(addCreator({ name: nc.name, handle: nc.handle, bio: nc.bio || '', avatar: nc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(nc.name)}&background=E07B20&color=fff&size=128`, verified: nc.verified || false, platforms: nc.platforms || [] }));
    setNc({}); showSaved();
  };

  const addPlat = () => {
    if (!pSel || !pUrl || (nc.platforms || []).some(p => p.name === pSel)) return;
    setNc({ ...nc, platforms: [...(nc.platforms || []), { name: pSel, url: pUrl }] });
    setPSel(''); setPUrl('');
  };

  const availablePlats = PLATFORMS.filter(p => !(nc.platforms || []).some(cp => cp.name === p.name));

  return (
    <div className="space-y-6">
      <SectionHeader label="إدارة المحتوى" title="صناع المحتوى" desc="إضافة وتعديل وحذف صناع المحتوى" color="#E07B20" />
      <StatsGrid items={[
        { l: 'الإجمالي', v: creators.length, c: '#E07B20', i: Users },
        { l: 'الموثوقين', v: creators.filter(c => c.verified).length, c: '#3B82F6', i: Award },
        { l: 'لديهم منصات', v: creators.filter(c => c.platforms.length > 0).length, c: '#10B981', i: Link },
        { l: 'بلا منصات', v: creators.filter(c => c.platforms.length === 0).length, c: '#6B7280', i: AlertCircle },
      ]} />

      <FormCard title="إضافة صانع محتوى جديد" icon={Plus} iconColor="#E07B20" footer={<>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative"><input type="checkbox" checked={nc.verified || false} onChange={e => setNc({ ...nc, verified: e.target.checked })} className="sr-only peer" /><div className="w-9 h-5 rounded-full bg-white/[0.08] peer-checked:bg-[#E07B20] transition-colors" /><div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" /></div>
          <span className="text-sm text-[var(--text-2)] group-hover:text-[var(--text-1)]">موثّق</span>
        </label>
        <button onClick={handleAdd} disabled={!nc.name || !nc.handle} className="btn-primary btn-sm disabled:opacity-40"><Plus className="w-4 h-4" /> إضافة</button>
      </>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الاسم *</label><input value={nc.name || ''} onChange={e => setNc({ ...nc, name: e.target.value })} placeholder="اسم صانع المحتوى" className="input py-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">المعرّف *</label><input value={nc.handle || ''} onChange={e => setNc({ ...nc, handle: e.target.value })} placeholder="@username" className="input py-2.5 text-sm" dir="ltr" /></div>
          <div className="sm:col-span-2"><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الوصف</label><input value={nc.bio || ''} onChange={e => setNc({ ...nc, bio: e.target.value })} placeholder="وصف مختصر" className="input py-2.5 text-sm" /></div>
          <div className="sm:col-span-2"><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">رابط الصورة</label><input value={nc.avatar || ''} onChange={e => setNc({ ...nc, avatar: e.target.value })} placeholder="https://..." className="input py-2.5 text-sm" dir="ltr" /></div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <label className="text-[11px] font-bold text-[var(--text-2)] mb-3 block">المنصات والروابط</label>
          {(nc.platforms || []).length > 0 && <div className="flex flex-wrap gap-2 mb-3">
            {(nc.platforms || []).map((p, i) => { const meta = PLATFORM_MAP[p.name]; const PIcon = meta?.icon || ExternalLink; const pc = meta?.color || '#888'; return (
              <span key={i} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold" style={{ background: `${pc}10`, border: `1px solid ${pc}20`, color: pc }}>
                <PIcon className="w-3.5 h-3.5" /> {p.name} <span className="text-[var(--text-3)] text-[10px] truncate max-w-[140px]" dir="ltr">{p.url}</span>
                <button onClick={() => setNc({ ...nc, platforms: (nc.platforms || []).filter((_, j) => j !== i) })} className="w-4 h-4 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-[8px] ml-1">✕</button>
              </span>
            ); })}
          </div>}
          {availablePlats.length > 0 && <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
            <div className="select-wrap"><select value={pSel} onChange={e => setPSel(e.target.value)} className="select py-2 text-sm"><option value="">اختر المنصة</option>{availablePlats.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}</select></div>
            <input value={pUrl} onChange={e => setPUrl(e.target.value)} placeholder="https://..." className="input py-2 text-sm" dir="ltr" />
            <button onClick={addPlat} disabled={!pSel || !pUrl} className="btn-ghost btn-sm disabled:opacity-40"><Plus className="w-3.5 h-3.5" /></button>
          </div>}
        </div>
      </FormCard>

      <ListCard title="القائمة الحالية" icon={Users} iconColor="#E07B20" count={creators.length} countLabel="صانع محتوى" emptyIcon={Users} emptyText="لا يوجد صناع محتوى بعد">
        {creators.map(c => (
          <div key={c.name} className="px-6 py-4 hover:bg-white/[0.02] transition-colors group flex items-center gap-4">
            <img src={c.avatar} alt="" className="w-11 h-11 rounded-xl object-cover border border-white/[0.06] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[var(--text-1)] truncate">{c.name}</span>
                {c.verified && <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path d="M10.0 16.2l-3.8-3.8 1.4-1.4 2.4 2.4 5.4-5.4 1.4 1.4z" fill="white" /></svg>}
              </div>
              <div className="text-xs text-[var(--text-3)] mt-0.5">{c.handle}</div>
              {c.platforms.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">
                {c.platforms.map((p, pi) => { const meta = PLATFORM_MAP[p.name]; const PIcon = meta?.icon || ExternalLink; const pc = meta?.color || '#888'; return <span key={pi} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: `${pc}10`, color: pc }}><PIcon className="w-2.5 h-2.5" />{p.name}</span>; })}
              </div>}
            </div>
            <button onClick={() => { setCreatorsState(removeCreator(c.name)); showSaved(); }} className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </ListCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LEADERBOARD TAB — with board CRUD
   ══════════════════════════════════════════════════════════════ */
function LeaderboardTab({ boards, setBoardsState, showSaved }: { boards: Leaderboard[]; setBoardsState: React.Dispatch<React.SetStateAction<Leaderboard[]>>; showSaved: () => void }) {
  const [sel, setSel] = useState(boards[0]?.id || '');
  const [ne, setNe] = useState<Partial<LeaderboardEntry>>({});
  const [editR, setEditR] = useState<number | null>(null);
  const [editV, setEditV] = useState(0);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [nb, setNb] = useState({ title: '', icon: 'Trophy', color: '#F59E0B', unit: '' });
  const [editBoard, setEditBoard] = useState<string | null>(null);
  const [ebData, setEbData] = useState({ title: '', icon: 'Trophy', color: '', unit: '' });
  const cur = boards.find(b => b.id === sel);

  const handleAddBoard = () => {
    if (!nb.title || !nb.unit) return;
    const id = nb.title.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now();
    setBoardsState(addLeaderboard({ id, title: nb.title, icon: nb.icon, color: nb.color, unit: nb.unit, data: [] }));
    setNb({ title: '', icon: 'Trophy', color: '#F59E0B', unit: '' }); setShowNewBoard(false); setSel(id); showSaved();
  };

  const handleDeleteBoard = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    setBoardsState(removeLeaderboard(id));
    if (sel === id) setSel(boards.find(b => b.id !== id)?.id || '');
    showSaved();
  };

  const handleSaveBoardEdit = (id: string) => {
    if (!ebData.title || !ebData.unit) return;
    setBoardsState(updateLeaderboard(id, { title: ebData.title, icon: ebData.icon, color: ebData.color, unit: ebData.unit }));
    setEditBoard(null); showSaved();
  };

  return (
    <div className="space-y-6">
      <SectionHeader label="الإحصائيات" title="المتصدرين" desc="إدارة قوائم المتصدرين — إضافة أقسام وتعديلها وإدارة اللاعبين" color="#F59E0B" />

      <StatsGrid items={[
        { l: 'الأقسام', v: boards.length, c: '#F59E0B', i: FolderOpen },
        { l: 'إجمالي اللاعبين', v: boards.reduce((s, b) => s + b.data.length, 0), c: '#E07B20', i: Users },
        { l: 'أكبر قيمة', v: boards.flatMap(b => b.data).length ? Math.max(...boards.flatMap(b => b.data).map(e => e.val)).toLocaleString() : '0', c: '#10B981', i: TrendingUp },
      ]} />

      {/* Board Tabs + Add */}
      <div className="flex flex-wrap items-center gap-2.5 fade-up">
        {boards.map(b => (
          <div key={b.id} className="flex items-center">
            {editBoard === b.id ? (
              <div className="flex items-center gap-1.5 bg-[var(--surface)] border border-white/[0.08] rounded-xl px-3 py-1.5">
                <input value={ebData.title} onChange={e => setEbData({ ...ebData, title: e.target.value })} className="bg-transparent text-xs font-bold text-[var(--text-1)] w-20 outline-none" placeholder="الاسم" />
                <input type="color" value={ebData.color} onChange={e => setEbData({ ...ebData, color: e.target.value })} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
                <input value={ebData.unit} onChange={e => setEbData({ ...ebData, unit: e.target.value })} className="bg-transparent text-[10px] text-[var(--text-3)] w-14 outline-none" placeholder="الوحدة" />
                <button onClick={() => handleSaveBoardEdit(b.id)} className="w-5 h-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center"><Check className="w-3 h-3" /></button>
                <button onClick={() => setEditBoard(null)} className="w-5 h-5 rounded bg-white/10 text-[var(--text-3)] flex items-center justify-center"><X className="w-3 h-3" /></button>
              </div>
            ) : (
              <PillTab label={b.title} active={sel === b.id} color={b.color} count={b.data.length} onClick={() => setSel(b.id)} onDelete={() => handleDeleteBoard(b.id)} />
            )}
          </div>
        ))}
        <button onClick={() => setShowNewBoard(!showNewBoard)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--surface)] text-[var(--text-2)] border border-dashed border-white/[0.1] hover:text-[var(--brand)] hover:border-[var(--brand-border)] transition-all">
          <Plus className="w-3.5 h-3.5" /> قسم جديد
        </button>
      </div>

      {/* New Board Form */}
      {showNewBoard && (
        <FormCard title="إضافة قسم جديد" icon={Plus} iconColor="#F59E0B" footer={<>
          <button onClick={() => setShowNewBoard(false)} className="btn-ghost btn-sm"><X className="w-3.5 h-3.5" /> إلغاء</button>
          <button onClick={handleAddBoard} disabled={!nb.title || !nb.unit} className="btn-primary btn-sm disabled:opacity-40" style={{ background: '#F59E0B' }}><Plus className="w-4 h-4" /> إضافة</button>
        </>}>
          <div className="grid sm:grid-cols-4 gap-4">
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اسم القسم *</label><input value={nb.title} onChange={e => setNb({ ...nb, title: e.target.value })} placeholder="أغنى اللاعبين" className="input py-2.5 text-sm" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الأيقونة</label><input value={nb.icon} onChange={e => setNb({ ...nb, icon: e.target.value })} placeholder="Trophy" className="input py-2.5 text-sm" dir="ltr" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اللون</label><input type="color" value={nb.color} onChange={e => setNb({ ...nb, color: e.target.value })} className="w-full h-10 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">وحدة القيمة *</label><input value={nb.unit} onChange={e => setNb({ ...nb, unit: e.target.value })} placeholder="ريال، ساعة..." className="input py-2.5 text-sm" /></div>
          </div>
        </FormCard>
      )}

      {cur && (
        <>
          <FormCard title={`إضافة لاعب إلى "${cur.title}"`} icon={Plus} iconColor={cur.color} footer={<div className="flex justify-end w-full">
            <button onClick={() => { if (!sel || !ne.name || ne.val === undefined) return; setBoardsState(updateLeaderboardEntry(sel, { r: 0, name: ne.name, val: ne.val, avatar: ne.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ne.name)}&background=3B82F6&color=fff&size=120` })); setNe({}); showSaved(); }} disabled={!ne.name || ne.val === undefined} className="btn-primary btn-sm disabled:opacity-40" style={{ background: cur.color }}><Plus className="w-4 h-4" /> إضافة</button>
          </div>}>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اسم اللاعب *</label><input value={ne.name || ''} onChange={e => setNe({ ...ne, name: e.target.value })} placeholder="PlayerName" className="input py-2.5 text-sm" dir="ltr" /></div>
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">القيمة *</label><input type="number" value={ne.val ?? ''} onChange={e => setNe({ ...ne, val: Number(e.target.value) })} placeholder="0" className="input py-2.5 text-sm" dir="ltr" /></div>
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">رابط الصورة</label><input value={ne.avatar || ''} onChange={e => setNe({ ...ne, avatar: e.target.value })} placeholder="اختياري" className="input py-2.5 text-sm" dir="ltr" /></div>
            </div>
          </FormCard>

          <ListCard title={cur.title} icon={Trophy} iconColor={cur.color} count={cur.data.length} countLabel={`لاعب — ${cur.unit}`} emptyIcon={Trophy} emptyText="لا يوجد لاعبين">
            {cur.data.map(e => (
              <div key={e.r} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors group">
                <span className="w-8 text-center text-sm font-extrabold" style={{ color: e.r <= 3 ? cur.color : 'var(--text-3)' }}>#{e.r}</span>
                <img src={e.avatar} alt="" className="w-9 h-9 rounded-lg object-cover border border-white/[0.06]" />
                <span className="flex-1 text-sm font-semibold text-[var(--text-1)] truncate">{e.name}</span>
                {editR === e.r ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={editV} onChange={ev => setEditV(Number(ev.target.value))} className="input py-1.5 px-3 text-sm w-24" autoFocus dir="ltr"
                      onKeyDown={ev => { if (ev.key === 'Enter' && sel) { setBoardsState(updateLeaderboardEntry(sel, { ...e, val: editV })); setEditR(null); showSaved(); } if (ev.key === 'Escape') setEditR(null); }} />
                    <button onClick={() => { if (sel) { setBoardsState(updateLeaderboardEntry(sel, { ...e, val: editV })); setEditR(null); showSaved(); } }} className="w-7 h-7 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/10"><Check className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <span className="text-sm font-bold tabular-nums cursor-pointer hover:opacity-70" style={{ color: cur.color }} onClick={() => { setEditR(e.r); setEditV(e.val); }}>{e.val.toLocaleString()}</span>
                )}
                <span className="text-[10px] text-[var(--text-3)] w-12 text-left">{cur.unit}</span>
                <button onClick={() => { if (sel) { setBoardsState(removeLeaderboardEntry(sel, e.r)); showSaved(); } }} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </ListCard>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STORE TAB — fixed features textarea
   ══════════════════════════════════════════════════════════════ */
function StoreTab({ storeCats, setStoreCats, showSaved }: { storeCats: StoreCategory[]; setStoreCats: React.Dispatch<React.SetStateAction<StoreCategory[]>>; showSaved: () => void }) {
  const [selCat, setSelCat] = useState(storeCats[0]?.id || '');
  const [newCat, setNewCat] = useState<Partial<StoreCategory>>({});
  const [np, setNp] = useState<Partial<StoreProduct>>({ features: [] });
  const [featuresText, setFeaturesText] = useState('');
  const [ep, setEp] = useState<string | null>(null);
  const [epData, setEpData] = useState<Partial<StoreProduct>>({});
  const [epFeaturesText, setEpFeaturesText] = useState('');
  const curCat = storeCats.find(c => c.id === selCat);

  const handleAddCat = () => {
    if (!newCat.title || !newCat.id) return;
    const id = newCat.id.replace(/\s+/g, '_').toLowerCase();
    setStoreCats(addStoreCategory({ id, title: newCat.title, icon: newCat.icon || 'Package', color: newCat.color || '#6B7280', items: [] }));
    setNewCat({}); setSelCat(id); showSaved();
  };

  const handleAddProduct = () => {
    if (!selCat || !np.name || !np.price) return;
    const features = featuresText.split('\n').filter(l => l.trim());
    setStoreCats(addStoreProduct(selCat, { name: np.name, price: np.price, popular: np.popular || false, image: np.image || '', features }));
    setNp({ features: [] }); setFeaturesText(''); showSaved();
  };

  const startEdit = (p: StoreProduct) => { setEp(p.name); setEpData({ ...p }); setEpFeaturesText(p.features.join('\n')); };
  const saveEdit = () => { if (!selCat || !ep || !epData.name || !epData.price) return; setStoreCats(updateStoreProduct(selCat, ep, { ...epData, features: epFeaturesText.split('\n').filter(l => l.trim()) })); setEp(null); setEpData({}); showSaved(); };

  const allProducts = storeCats.flatMap(c => c.items);

  return (
    <div className="space-y-6">
      <SectionHeader label="إدارة المتجر" title="المتجر" desc="إدارة المنتجات والكاتيجوريات" color="#10B981" />
      <StatsGrid items={[
        { l: 'الأقسام', v: storeCats.length, c: '#8B5CF6', i: FolderOpen },
        { l: 'المنتجات', v: allProducts.length, c: '#E07B20', i: Package },
        { l: 'المميزة', v: allProducts.filter(i => i.popular).length, c: '#F59E0B', i: Crown },
        { l: 'أعلى سعر', v: allProducts.length ? `$${Math.max(...allProducts.map(i => i.price))}` : '$0', c: '#10B981', i: DollarSign },
      ]} />

      <FormCard title="إضافة كاتيجوري جديدة" icon={FolderOpen} iconColor="#8B5CF6" footer={<div className="flex justify-end w-full">
        <button onClick={handleAddCat} disabled={!newCat.title || !newCat.id} className="btn-primary btn-sm disabled:opacity-40" style={{ background: '#8B5CF6' }}><Plus className="w-4 h-4" /> إضافة قسم</button>
      </div>}>
        <div className="grid sm:grid-cols-4 gap-4">
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">المعرّف *</label><input value={newCat.id || ''} onChange={e => setNewCat({ ...newCat, id: e.target.value })} placeholder="ex: vip" className="input py-2.5 text-sm" dir="ltr" /></div>
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الاسم *</label><input value={newCat.title || ''} onChange={e => setNewCat({ ...newCat, title: e.target.value })} placeholder="اسم القسم" className="input py-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الأيقونة</label><input value={newCat.icon || ''} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} placeholder="Star, Trophy..." className="input py-2.5 text-sm" dir="ltr" /></div>
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اللون</label><div className="flex gap-2"><input type="color" value={newCat.color || '#6B7280'} onChange={e => setNewCat({ ...newCat, color: e.target.value })} className="w-10 h-10 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent" /><input value={newCat.color || ''} onChange={e => setNewCat({ ...newCat, color: e.target.value })} className="input py-2.5 text-sm flex-1" dir="ltr" /></div></div>
        </div>
      </FormCard>

      <div className="flex flex-wrap gap-2.5 fade-up">
        {storeCats.map(c => <PillTab key={c.id} label={c.title} active={selCat === c.id} color={c.color} count={c.items.length} onClick={() => setSelCat(c.id)} onDelete={() => { setStoreCats(removeStoreCategory(c.id)); if (selCat === c.id) setSelCat(storeCats.find(x => x.id !== c.id)?.id || ''); showSaved(); }} />)}
      </div>

      {curCat && (
        <>
          <FormCard title={`إضافة منتج إلى "${curCat.title}"`} icon={Plus} iconColor={curCat.color} footer={<>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative"><input type="checkbox" checked={np.popular || false} onChange={e => setNp({ ...np, popular: e.target.checked })} className="sr-only peer" /><div className="w-9 h-5 rounded-full bg-white/[0.08] peer-checked:bg-amber-500 transition-colors" /><div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" /></div>
              <span className="text-sm text-[var(--text-2)] group-hover:text-[var(--text-1)]">الأكثر مبيعاً</span>
            </label>
            <button onClick={handleAddProduct} disabled={!np.name || !np.price} className="btn-primary btn-sm disabled:opacity-40" style={{ background: curCat.color }}><Plus className="w-4 h-4" /> إضافة</button>
          </>}>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اسم المنتج *</label><input value={np.name || ''} onChange={e => setNp({ ...np, name: e.target.value })} placeholder="اسم المنتج" className="input py-2.5 text-sm" /></div>
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">السعر ($) *</label><input type="number" value={np.price ?? ''} onChange={e => setNp({ ...np, price: Number(e.target.value) })} placeholder="0" className="input py-2.5 text-sm" dir="ltr" /></div>
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">رابط الصورة</label><input value={np.image || ''} onChange={e => setNp({ ...np, image: e.target.value })} placeholder="https://..." className="input py-2.5 text-sm" dir="ltr" /></div>
            </div>
            <div className="mt-4"><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">المميزات (كل سطر ميزة)</label><textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder={"ميزة 1\nميزة 2\nميزة 3"} className="input py-2.5 text-sm" rows={3} /></div>
          </FormCard>

          <ListCard title={curCat.title} icon={Package} iconColor={curCat.color} count={curCat.items.length} countLabel="منتج" emptyIcon={Package} emptyText="لا يوجد منتجات">
            {curCat.items.map((p, i) => (
              <div key={p.name + i} className="px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                {ep === p.name ? (
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input value={epData.name || ''} onChange={e => setEpData({ ...epData, name: e.target.value })} placeholder="الاسم" className="input py-2 text-sm" />
                      <input type="number" value={epData.price ?? ''} onChange={e => setEpData({ ...epData, price: Number(e.target.value) })} placeholder="السعر" className="input py-2 text-sm" dir="ltr" />
                      <input value={epData.image || ''} onChange={e => setEpData({ ...epData, image: e.target.value })} placeholder="رابط الصورة" className="input py-2 text-sm" dir="ltr" />
                    </div>
                    <textarea value={epFeaturesText} onChange={e => setEpFeaturesText(e.target.value)} className="input py-2 text-sm" rows={2} placeholder={"ميزة 1\nميزة 2"} />
                    <div className="flex items-center gap-2">
                      <button onClick={saveEdit} className="btn-primary btn-sm" style={{ background: curCat.color }}><Check className="w-3.5 h-3.5" /> حفظ</button>
                      <button onClick={() => { setEp(null); setEpData({}); }} className="btn-ghost btn-sm"><X className="w-3.5 h-3.5" /> إلغاء</button>
                      <label className="flex items-center gap-2 mr-auto cursor-pointer"><input type="checkbox" checked={epData.popular || false} onChange={e => setEpData({ ...epData, popular: e.target.checked })} className="accent-amber-500 w-3.5 h-3.5" /><span className="text-xs text-[var(--text-2)]">Popular</span></label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {p.image && <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/[0.06] shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="text-sm font-bold text-[var(--text-1)]">{p.name}</span>{p.popular && <span className="text-[9px] font-bold bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded">POPULAR</span>}</div>
                      {p.features.length > 0 && <div className="text-[11px] text-[var(--text-3)] mt-0.5 truncate">{p.features.slice(0, 3).join(' • ')}</div>}
                    </div>
                    <span className="text-sm font-extrabold shrink-0" style={{ color: curCat.color }}>${p.price}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setStoreCats(removeStoreProduct(curCat.id, p.name)); showSaved(); }} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ListCard>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   RULES TAB
   ══════════════════════════════════════════════════════════════ */
function RulesTab({ rulesCats, setRulesCats, showSaved }: { rulesCats: RuleCategory[]; setRulesCats: React.Dispatch<React.SetStateAction<RuleCategory[]>>; showSaved: () => void }) {
  const [selCat, setSelCat] = useState(rulesCats[0]?.id || '');
  const [nc, setNc] = useState<Partial<RuleCategory>>({});
  const [nr, setNr] = useState<Partial<Rule>>({});
  const [ei, setEi] = useState<number | null>(null);
  const [ed, setEd] = useState<Partial<Rule>>({});
  const curCat = rulesCats.find(c => c.id === selCat);
  const totalRules = rulesCats.reduce((s, c) => s + c.rules.length, 0);

  const addCat = () => { if (!nc.title || !nc.id) return; const id = nc.id.replace(/\s+/g, '_').toLowerCase(); setRulesCats(addRuleCategory({ id, title: nc.title, icon: nc.icon || 'BookOpen', color: nc.color || '#6B7280', rules: [] })); setNc({}); setSelCat(id); showSaved(); };
  const delCat = (id: string) => { setRulesCats(removeRuleCategory(id)); if (selCat === id) setSelCat(rulesCats.find(x => x.id !== id)?.id || ''); showSaved(); };
  const addRule_ = () => { if (!selCat || !nr.title || !nr.description) return; setRulesCats(addRule(selCat, { title: nr.title, description: nr.description })); setNr({}); showSaved(); };

  return (
    <div className="space-y-6">
      <SectionHeader label="إدارة القوانين" title="القوانين" desc="إضافة وتعديل وحذف القوانين والأقسام" color="#8B5CF6" />
      <StatsGrid items={[
        { l: 'الأقسام', v: rulesCats.length, c: '#8B5CF6', i: FolderOpen },
        { l: 'القوانين', v: totalRules, c: '#E07B20', i: BookOpen },
        { l: 'المتوسط', v: rulesCats.length ? Math.round(totalRules / rulesCats.length) : 0, c: '#10B981', i: BarChart3 },
      ]} />

      <FormCard title="إضافة قسم قوانين جديد" icon={FolderOpen} iconColor="#8B5CF6" footer={<div className="flex justify-end w-full">
        <button onClick={addCat} disabled={!nc.title || !nc.id} className="btn-primary btn-sm disabled:opacity-40" style={{ background: '#8B5CF6' }}><Plus className="w-4 h-4" /> إضافة قسم</button>
      </div>}>
        <div className="grid sm:grid-cols-4 gap-4">
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">المعرّف *</label><input value={nc.id || ''} onChange={e => setNc({ ...nc, id: e.target.value })} placeholder="ex: rules" className="input py-2.5 text-sm" dir="ltr" /></div>
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الاسم *</label><input value={nc.title || ''} onChange={e => setNc({ ...nc, title: e.target.value })} placeholder="اسم القسم" className="input py-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الأيقونة</label><input value={nc.icon || ''} onChange={e => setNc({ ...nc, icon: e.target.value })} placeholder="BookOpen, Shield..." className="input py-2.5 text-sm" dir="ltr" /></div>
          <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اللون</label><div className="flex gap-2"><input type="color" value={nc.color || '#6B7280'} onChange={e => setNc({ ...nc, color: e.target.value })} className="w-10 h-10 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent" /><input value={nc.color || ''} onChange={e => setNc({ ...nc, color: e.target.value })} className="input py-2.5 text-sm flex-1" dir="ltr" /></div></div>
        </div>
      </FormCard>

      <div className="flex flex-wrap gap-2.5 fade-up">
        {rulesCats.map(c => <PillTab key={c.id} label={c.title} active={selCat === c.id} color={c.color} count={c.rules.length} onClick={() => setSelCat(c.id)} onDelete={() => delCat(c.id)} />)}
      </div>

      {curCat && (
        <>
          <FormCard title={`إضافة قانون إلى "${curCat.title}"`} icon={Plus} iconColor={curCat.color} footer={<div className="flex justify-end w-full">
            <button onClick={addRule_} disabled={!nr.title || !nr.description} className="btn-primary btn-sm disabled:opacity-40" style={{ background: curCat.color }}><Plus className="w-4 h-4" /> إضافة قانون</button>
          </div>}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">عنوان القانون *</label><input value={nr.title || ''} onChange={e => setNr({ ...nr, title: e.target.value })} placeholder="عنوان القانون" className="input py-2.5 text-sm" /></div>
              <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الوصف *</label><input value={nr.description || ''} onChange={e => setNr({ ...nr, description: e.target.value })} placeholder="وصف القانون" className="input py-2.5 text-sm" /></div>
            </div>
          </FormCard>

          <ListCard title={curCat.title} icon={BookOpen} iconColor={curCat.color} count={curCat.rules.length} countLabel="قانون" emptyIcon={BookOpen} emptyText="لا يوجد قوانين">
            {curCat.rules.map((r, i) => (
              <div key={i} className="px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                {ei === i ? (
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={ed.title || ''} onChange={e => setEd({ ...ed, title: e.target.value })} className="input py-2 text-sm" />
                      <input value={ed.description || ''} onChange={e => setEd({ ...ed, description: e.target.value })} className="input py-2 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { if (!ed.title || !ed.description) return; setRulesCats(updateRule(curCat.id, i, ed)); setEi(null); showSaved(); }} className="btn-primary btn-sm" style={{ background: curCat.color }}><Check className="w-3.5 h-3.5" /> حفظ</button>
                      <button onClick={() => { setEi(null); setEd({}); }} className="btn-ghost btn-sm"><X className="w-3.5 h-3.5" /> إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${curCat.color}12`, color: curCat.color, border: `1px solid ${curCat.color}20` }}>{i + 1}</div>
                    <div className="flex-1 min-w-0"><span className="text-sm font-bold text-[var(--text-1)]">{r.title}</span><p className="text-xs text-[var(--text-2)] mt-0.5 truncate">{r.description}</p></div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEi(i); setEd({ title: r.title, description: r.description }); }} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setRulesCats(removeRule(curCat.id, i)); showSaved(); }} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ListCard>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APPLICATIONS TAB — full CRUD for application types
   ══════════════════════════════════════════════════════════════ */
function ApplicationsTab({ apps, setApps, showSaved }: { apps: ApplicationTypeConfig[]; setApps: React.Dispatch<React.SetStateAction<ApplicationTypeConfig[]>>; showSaved: () => void }) {
  const [sel, setSel] = useState(apps[0]?.id || '');
  const [showNew, setShowNew] = useState(false);
  const [ne, setNe] = useState<Partial<ApplicationTypeConfig>>({ questions: [], requirements: [] });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [emData, setEmData] = useState<Partial<ApplicationTypeConfig>>({});
  const [newQ, setNewQ] = useState({ label: '', type: 'text' as const, required: true, placeholder: '' });
  const [newReq, setNewReq] = useState('');
  const cur = apps.find(a => a.id === sel);

  const addApp = () => {
    if (!ne.label || !ne.id) return;
    const app: ApplicationTypeConfig = { id: ne.id, label: ne.label, icon: ne.icon || 'FileText', color: ne.color || '#3B82F6', description: ne.description || '', roleId: ne.roleId || '', questions: ne.questions || [], requirements: ne.requirements || [], enabled: true };
    setApps(addApplication(app)); setNe({ questions: [], requirements: [] }); setShowNew(false); setSel(app.id); showSaved();
  };

  const deleteApp = (id: string) => { setApps(removeApplication(id)); if (sel === id) setSel(apps.find(a => a.id !== id)?.id || ''); showSaved(); };

  const addQuestion = (appId: string) => { if (!newQ.label) return; const q: ApplicationQuestion = { id: Date.now().toString(), label: newQ.label, type: newQ.type, required: newQ.required, placeholder: newQ.placeholder }; setApps(updateApplication(appId, { questions: [...(cur?.questions || []), q] })); setNewQ({ label: '', type: 'text', required: true, placeholder: '' }); showSaved(); };
  const removeQuestion = (appId: string, qId: string) => { setApps(updateApplication(appId, { questions: (cur?.questions || []).filter(q => q.id !== qId) })); showSaved(); };
  const addRequirement = (appId: string) => { if (!newReq) return; setApps(updateApplication(appId, { requirements: [...(cur?.requirements || []), { text: newReq }] })); setNewReq(''); showSaved(); };
  const removeRequirement = (appId: string, idx: number) => { setApps(updateApplication(appId, { requirements: (cur?.requirements || []).filter((_, i) => i !== idx) })); showSaved(); };

  return (
    <div className="space-y-6">
      <SectionHeader label="نظام التقديمات" title="التقديمات" desc="إدارة أنواع التقديمات — الشروط، الأسئلة، والرول الممنوح" color="#3B82F6" />
      <StatsGrid items={[
        { l: 'أنواع التقديمات', v: apps.length, c: '#3B82F6', i: FileText },
        { l: 'نشط', v: apps.filter(a => a.enabled).length, c: '#10B981', i: ToggleRight },
        { l: 'إجمالي الأسئلة', v: apps.reduce((s, a) => s + a.questions.length, 0), c: '#F59E0B', i: MessageSquare },
        { l: 'إجمالي الشروط', v: apps.reduce((s, a) => s + a.requirements.length, 0), c: '#8B5CF6', i: BookOpen },
      ]} />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 fade-up">
        {apps.map(a => <PillTab key={a.id} label={a.label} active={sel === a.id} color={a.color} count={a.questions.length} onClick={() => setSel(a.id)} onDelete={() => deleteApp(a.id)} />)}
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--surface)] text-[var(--text-2)] border border-dashed border-white/[0.1] hover:text-[#3B82F6] hover:border-[#3B82F6]/30 transition-all">
          <Plus className="w-3.5 h-3.5" /> تقديم جديد
        </button>
      </div>

      {/* New Application Form */}
      {showNew && (
        <FormCard title="إضافة نوع تقديم جديد" icon={Plus} iconColor="#3B82F6" footer={<>
          <button onClick={() => setShowNew(false)} className="btn-ghost btn-sm"><X className="w-3.5 h-3.5" /> إلغاء</button>
          <button onClick={addApp} disabled={!ne.label || !ne.id} className="btn-primary btn-sm disabled:opacity-40" style={{ background: '#3B82F6' }}><Plus className="w-4 h-4" /> إضافة</button>
        </>}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">المعرّف (ID) *</label><input value={ne.id || ''} onChange={e => setNe({ ...ne, id: e.target.value })} placeholder="ex: whitelist" className="input py-2.5 text-sm" dir="ltr" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اسم التقديم *</label><input value={ne.label || ''} onChange={e => setNe({ ...ne, label: e.target.value })} placeholder="الوايت ليست" className="input py-2.5 text-sm" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الوصف</label><input value={ne.description || ''} onChange={e => setNe({ ...ne, description: e.target.value })} placeholder="وصف التقديم" className="input py-2.5 text-sm" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الأيقونة</label><input value={ne.icon || ''} onChange={e => setNe({ ...ne, icon: e.target.value })} placeholder="Shield, Heart..." className="input py-2.5 text-sm" dir="ltr" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اللون</label><input type="color" value={ne.color || '#3B82F6'} onChange={e => setNe({ ...ne, color: e.target.value })} className="w-full h-10 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent" /></div>
            <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">رول Discord (Role ID)</label><input value={ne.roleId || ''} onChange={e => setNe({ ...ne, roleId: e.target.value })} placeholder="1530789244375797791" className="input py-2.5 text-sm" dir="ltr" /></div>
          </div>
        </FormCard>
      )}

      {/* Current Application Detail */}
      {cur && (
        <>
          {/* Edit Application */}
          {editMode === cur.id && (
            <FormCard title={`تعديل "${cur.label}"`} icon={Edit3} iconColor={cur.color} footer={<>
              <button onClick={() => setEditMode(null)} className="btn-ghost btn-sm"><X className="w-3.5 h-3.5" /> إلغاء</button>
              <button onClick={() => { setApps(updateApplication(cur.id, emData)); setEditMode(null); showSaved(); }} className="btn-primary btn-sm" style={{ background: cur.color }}><Check className="w-3.5 h-3.5" /> حفظ</button>
            </>}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الاسم</label><input value={emData.label || ''} onChange={e => setEmData({ ...emData, label: e.target.value })} className="input py-2.5 text-sm" /></div>
                <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">اللون</label><input type="color" value={emData.color || '#3B82F6'} onChange={e => setEmData({ ...emData, color: e.target.value })} className="w-full h-10 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent" /></div>
                <div className="sm:col-span-2"><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الوصف</label><input value={emData.description || ''} onChange={e => setEmData({ ...emData, description: e.target.value })} className="input py-2.5 text-sm" /></div>
                <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">رول Discord</label><input value={emData.roleId || ''} onChange={e => setEmData({ ...emData, roleId: e.target.value })} className="input py-2.5 text-sm" dir="ltr" /></div>
                <div><label className="text-[11px] font-bold text-[var(--text-2)] mb-1.5 block">الأيقونة</label><input value={emData.icon || ''} onChange={e => setEmData({ ...emData, icon: e.target.value })} className="input py-2.5 text-sm" dir="ltr" /></div>
              </div>
            </FormCard>
          )}

          {/* Info Bar */}
          <div className="card p-4 hover:transform-none fade-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${cur.color}15`, border: `1px solid ${cur.color}30` }}>
                {(() => { const Ic = getIcon(cur.icon); return <Ic className="w-6 h-6" style={{ color: cur.color }} />; })()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--text-1)] text-lg">{cur.label}</h3>
                <p className="text-xs text-[var(--text-3)]">{cur.description}</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: `${cur.color}15`, color: cur.color }}>{cur.questions.length} أسئلة</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400">{cur.requirements.length} شروط</span>
                  {cur.roleId && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-400">رول: {cur.roleId}</span>}
                  <button onClick={() => { setEditMode(cur.id); setEmData({ label: cur.label, color: cur.color, description: cur.description, roleId: cur.roleId, icon: cur.icon }); }} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer transition-all">تعديل</button>
                  <button onClick={() => { setApps(updateApplication(cur.id, { enabled: !cur.enabled })); showSaved(); }} className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-all ${cur.enabled ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {cur.enabled ? '● مفعّل' : '○ معطّل'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <FormCard title="الشروط والمتطلبات" icon={BookOpen} iconColor="#8B5CF6" footer={<div className="flex gap-2 w-full">
            <input value={newReq} onChange={e => setNewReq(e.target.value)} placeholder="شرط جديد..." className="input py-2 text-sm flex-1"
              onKeyDown={e => { if (e.key === 'Enter') addRequirement(cur.id); }} />
            <button onClick={() => addRequirement(cur.id)} disabled={!newReq} className="btn-ghost btn-sm disabled:opacity-40"><Plus className="w-3.5 h-3.5" /></button>
          </div>}>
            {cur.requirements.length === 0 ? (
              <p className="text-xs text-[var(--text-3)] text-center py-4">لا يوجد شروط بعد</p>
            ) : (
              <div className="space-y-2">
                {cur.requirements.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] group">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#8B5CF615' }}>
                      <span className="text-[10px] font-bold text-purple-400">{i + 1}</span>
                    </div>
                    <span className="flex-1 text-sm text-[var(--text-2)]">{r.text}</span>
                    <button onClick={() => removeRequirement(cur.id, i)} className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </FormCard>

          {/* Questions */}
          <FormCard title="أسئلة التقديم" icon={MessageSquare} iconColor="#F59E0B" footer={<>
            <div className="flex flex-wrap gap-2 items-center w-full">
              <input value={newQ.label} onChange={e => setNewQ({ ...newQ, label: e.target.value })} placeholder="اسم السؤال..." className="input py-2 text-sm flex-1 min-w-[150px]"
                onKeyDown={e => { if (e.key === 'Enter') addQuestion(cur.id); }} />
              <div className="select-wrap"><select value={newQ.type} onChange={e => setNewQ({ ...newQ, type: e.target.value as any })} className="select py-2 text-sm">
                <option value="text">نص قصير</option><option value="textarea">نص طويل</option><option value="checkbox">صح/خطأ</option>
              </select></div>
              <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={newQ.required} onChange={e => setNewQ({ ...newQ, required: e.target.checked })} className="accent-[#E07B20] w-3.5 h-3.5" /><span className="text-[10px] text-[var(--text-3)]">مطلوب</span></label>
              <button onClick={() => addQuestion(cur.id)} disabled={!newQ.label} className="btn-ghost btn-sm disabled:opacity-40"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </>}>
            {cur.questions.length === 0 ? (
              <p className="text-xs text-[var(--text-3)] text-center py-4">لا يوجد أسئلة بعد</p>
            ) : (
              <div className="space-y-2">
                {cur.questions.map(q => (
                  <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cur.color}12` }}>
                      {q.type === 'text' && <Type className="w-4 h-4" style={{ color: cur.color }} />}
                      {q.type === 'textarea' && <FileText className="w-4 h-4" style={{ color: cur.color }} />}
                      {q.type === 'checkbox' && <Check className="w-4 h-4" style={{ color: cur.color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--text-1)]">{q.label}</span>
                        {q.required && <span className="text-[9px] font-bold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">مطلوب</span>}
                        <span className="text-[9px] font-bold bg-white/[0.04] text-[var(--text-3)] px-1.5 py-0.5 rounded">{q.type === 'text' ? 'نص قصير' : q.type === 'textarea' ? 'نص طويل' : 'صح/خطأ'}</span>
                      </div>
                      {q.placeholder && <p className="text-[10px] text-[var(--text-3)] mt-0.5">{q.placeholder}</p>}
                    </div>
                    <button onClick={() => removeQuestion(cur.id, q.id)} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </FormCard>
        </>
      )}
    </div>
  );
}
