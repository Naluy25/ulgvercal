import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FileText, Shield, FolderKanban, Users, ScrollText, Bot,
  ChevronLeft, TrendingUp, CheckCircle, XCircle, Clock,
  Plus, UserPlus, UserMinus, Send, AlertCircle, Activity, Crown,
  Heart, Video, Star, Award, Eye, Radio, Trash2, PenSquare, Search, Filter,
  Calendar, UserCog, BadgeCheck, BarChart3, Trophy, Flame, Zap, Edit3, MessageSquare, Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ULGShield } from '../components/Icons';
import type { DiscordUser, DiscordMember, Page, DashboardSection } from '../types';
import { ROLE_IDS } from '../types';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1525196337279270962/L7l2cqzDLS2xXVOLCoEfNrQdUBwoRUBUkByzDSkKEeZFUxSTrlagKA0r5-xiobQ8ItBZ';

// ── Role config ──
const ROLE_CONFIG: { id: string; section: DashboardSection; label: string; icon: typeof Shield; color: string }[] = [
  { id: ROLE_IDS.POLICE, section: 'police', label: 'داشبورد الشرطة', icon: Shield, color: '#3B82F6' },
  { id: ROLE_IDS.AMBULANCE, section: 'ambulance', label: 'داشبورد الإسعاف', icon: Heart, color: '#EF4444' },
  { id: ROLE_IDS.CREATOR, section: 'creators', label: 'داشبورد صناع المحتوى', icon: Video, color: '#9333EA' },
  { id: ROLE_IDS.ADMIN, section: 'admin', label: 'إدارة الإداريين', icon: Award, color: '#E07B20' },
  { id: ROLE_IDS.GODFATHER, section: 'gangs', label: 'إدارة العصابات', icon: Crown, color: '#F59E0B' },
  { id: ROLE_IDS.GOVERNMENT, section: 'applications', label: 'التقديمات', icon: FileText, color: '#10B981' },
  { id: ROLE_IDS.MANAGEMENT, section: 'overview', label: 'النظرة العامة', icon: LayoutDashboard, color: '#6366F1' },
];

const ADMIN_SECTIONS: DashboardSection[] = ['overview', 'applications', 'projects', 'logs', 'discord'];

export default function DashboardPage({ user, member, navigate }: { user: DiscordUser | null; member: DiscordMember | null; navigate: (p: Page) => void }) {
  const [active, setActive] = useState<DashboardSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userRoles = member?.roles || [];
  const accessibleSections = new Set<DashboardSection>();

  // Management role sees everything
  if (userRoles.includes(ROLE_IDS.MANAGEMENT)) {
    ADMIN_SECTIONS.forEach((s) => accessibleSections.add(s));
    ROLE_CONFIG.forEach((r) => accessibleSections.add(r.section));
  } else {
    // Role-based access
    ROLE_CONFIG.forEach((r) => {
      if (userRoles.includes(r.id)) accessibleSections.add(r.section);
    });
    if (userRoles.includes(ROLE_IDS.GOVERNMENT)) accessibleSections.add('applications');
    if (userRoles.includes(ROLE_IDS.ADMIN)) {
      accessibleSections.add('overview');
      accessibleSections.add('logs');
    }
  }

  // Default to first accessible section
  useEffect(() => {
    if (!accessibleSections.has(active)) {
      const first = Array.from(accessibleSections)[0];
      if (first) setActive(first);
    }
  }, [userRoles.join(',')]);

  const sidebarItems = ROLE_CONFIG.filter((r) => accessibleSections.has(r.section));
  // Add admin-only items
  const adminItems: { section: DashboardSection; label: string; icon: typeof Shield; color: string }[] = [];
  if (accessibleSections.has('overview')) adminItems.push({ section: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, color: '#6366F1' });
  if (accessibleSections.has('applications')) adminItems.push({ section: 'applications', label: 'التقديمات', icon: FileText, color: '#10B981' });
  if (accessibleSections.has('projects')) adminItems.push({ section: 'projects', label: 'المشاريع', icon: FolderKanban, color: '#3B82F6' });
  if (accessibleSections.has('logs')) adminItems.push({ section: 'logs', label: 'السجلات', icon: ScrollText, color: '#64748B' });
  if (accessibleSections.has('discord')) adminItems.push({ section: 'discord', label: 'إدارة Discord', icon: Bot, color: '#5865F2' });

  // Merge and dedupe
  const allItems = [...adminItems];
  sidebarItems.forEach((r) => {
    if (!allItems.find((a) => a.section === r.section)) {
      allItems.push({ section: r.section, label: r.label, icon: r.icon, color: r.color });
    }
  });

  // No access
  if (accessibleSections.size === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">لا تملك صلاحية الوصول</h2>
          <p className="text-[var(--text-2)] text-sm mb-7">هذه اللوحة مخصصة للإداريين وأصحاب الرتب الخاصة فقط.</p>
          <button onClick={() => navigate('home')} className="btn-primary btn-sm">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed top-16 bottom-0 right-0 ${sidebarOpen ? 'w-60' : 'w-0'} overflow-hidden bg-[var(--bg-2)] border-l border-white/5 transition-all duration-300 z-40`}>
        <div className="w-60 h-full flex flex-col p-3">
          <div className="px-3 py-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E07B20] to-[#b85e10] flex items-center justify-center">
                <ULGShield className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-[var(--text-1)]">لوحة التحكم</span>
            </div>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto">
            {allItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.section} onClick={() => setActive(item.section)}
                  className={`sidebar-item ${active === item.section ? 'active' : ''}`}>
                  <Icon className="w-4 h-4 shrink-0" style={active === item.section ? { color: item.color } : {}} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <img src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : `https://ui-avatars.com/api/?name=${user?.username || 'A'}&background=E07B20&color=fff&size=64`} alt="" className="w-8 h-8 rounded-lg object-cover" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-[var(--text-1)] truncate">{user?.global_name || user?.username || 'Admin'}</div>
                <div className="text-[10px] text-[var(--brand)]">{userRoles.includes(ROLE_IDS.MANAGEMENT) ? 'إدارة عامة' : 'موظف'}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-20 ${sidebarOpen ? 'right-60' : 'right-0'} z-50 p-1.5 bg-[var(--surface-2)] border border-white/8 rounded-l-lg transition-all duration-300 hover:bg-[var(--surface-hover)]`}>
        <ChevronLeft className={`w-4 h-4 text-[var(--text-2)] transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
      </button>

      <main className={`flex-1 ${sidebarOpen ? 'mr-60' : 'mr-0'} transition-all duration-300 p-6 overflow-y-auto`}>
        {active === 'overview' && <Overview />}
        {active === 'applications' && <Applications />}
        {active === 'police' && <PoliceDashboard user={user} />}
        {active === 'ambulance' && <AmbulanceDashboard user={user} />}
        {active === 'creators' && <CreatorDashboard user={user} />}
        {active === 'admin' && <AdminManagement user={user} />}
        {active === 'gangs' && <GangDashboard user={user} />}
        {active === 'projects' && <Projects />}
        {active === 'logs' && <Logs />}
        {active === 'discord' && <DiscordManagement user={user} />}
      </main>
    </div>
  );
}

// ── Shared: Webhook sender ──
async function sendWebhook(title: string, fields: { name: string; value: string; inline?: boolean }[], color: number) {
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'ULG CFW Dashboard',
        embeds: [{ title, color, fields, footer: { text: 'ULG CFW • نظام الإدارة' }, timestamp: new Date().toISOString() }],
      }),
    });
  } catch { /* webhook may fail silently */ }
}

async function logActivity(adminName: string, action: string, target?: string, details?: string) {
  await supabase.from('admin_logs').insert({ admin_name: adminName, action, target, details });
}

// ── Overview ──
function Overview() {
  const [stats, setStats] = useState({ apps: 0, pending: 0, projects: 0, gangs: 0, creators: 0, logs: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ count: apps }, { count: pending }, { count: projects }, { count: gangs }, { count: creators }, { count: logs }] = await Promise.all([
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('gangs').select('*', { count: 'exact', head: true }),
        supabase.from('creator_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ apps: apps || 0, pending: pending || 0, projects: projects || 0, gangs: gangs || 0, creators: creators || 0, logs: logs || 0 });

      const { data: ra } = await supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(5);
      if (ra) setRecentApps(ra);
      const { data: rl } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(5);
      if (rl) setRecentLogs(rl);
    })();
  }, []);

  const statCards = [
    { label: 'إجمالي التقديمات', val: stats.apps, icon: FileText, color: '#E07B20' },
    { label: 'قيد المراجعة', val: stats.pending, icon: Clock, color: '#F59E0B' },
    { label: 'المشاريع', val: stats.projects, icon: FolderKanban, color: '#3B82F6' },
    { label: 'العصابات', val: stats.gangs, icon: Users, color: '#EF4444' },
    { label: 'صناع المحتوى', val: stats.creators, icon: Video, color: '#9333EA' },
    { label: 'سجلات النشاط', val: stats.logs, icon: Activity, color: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-1)] mb-1">نظرة عامة</h1>
        <p className="text-sm text-[var(--text-2)]">إحصائيات شاملة لسيرفر ULG CFW</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-[var(--text-3)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--text-1)]">{s.val}</div>
              <div className="text-xs text-[var(--text-3)] mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--brand)]" /> آخر التقديمات
          </h3>
          <div className="space-y-2">
            {recentApps.length === 0 && <p className="text-sm text-[var(--text-3)] py-4 text-center">لا توجد تقديمات</p>}
            {recentApps.map((app) => (
              <div key={app.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-2)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[var(--text-3)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-1)] truncate">{app.real_name}</div>
                  <div className="text-xs text-[var(--text-3)]">{app.type === 'whitelist' ? 'وايت ليست' : app.type === 'police' ? 'شرطة' : app.type === 'ambulance' ? 'إسعاف' : 'صانع محتوى'}</div>
                </div>
                <span className={`badge ${app.status === 'pending' ? 'status-pending' : app.status === 'accepted' ? 'status-active' : app.status === 'reviewing' ? 'status-reviewing' : 'status-rejected'}`}>
                  {app.status === 'pending' ? 'مراجعة' : app.status === 'accepted' ? 'مقبول' : app.status === 'reviewing' ? 'دراسة' : 'مرفوض'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--brand)]" /> آخر النشاطات
          </h3>
          <div className="space-y-2">
            {recentLogs.length === 0 && <p className="text-sm text-[var(--text-3)] py-4 text-center">لا توجد نشاطات</p>}
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-2)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center shrink-0">
                  <ScrollText className="w-4 h-4 text-[var(--text-3)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-1)] truncate">{log.action}</div>
                  <div className="text-xs text-[var(--text-3)] truncate">{log.details || log.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Applications ──
function Applications() {
  const [apps, setApps] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (data) setApps(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  const updateStatus = async (id: string, status: string, name: string) => {
    await supabase.from('applications').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    await logActivity('Admin', `application_${status}`, id, `${name} — ${status}`);
    load();
  };

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'pending', label: 'قيد المراجعة' },
    { id: 'reviewing', label: 'قيد الدراسة' },
    { id: 'accepted', label: 'مقبول' },
    { id: 'rejected', label: 'مرفوض' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-1)] mb-1">إدارة التقديمات</h1>
        <p className="text-sm text-[var(--text-2)]">مراجعة وقبول أو رفض طلبات الانضمام</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${filter === f.id ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-2)] text-[var(--text-2)] border border-white/8 hover:text-[var(--text-1)]'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-[var(--text-3)]">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-3)]">لا توجد تقديمات</div>
        ) : (
          <div className="divide-y divide-white/4">
            {filtered.map((app) => (
              <div key={app.id} className="p-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface-3)] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[var(--text-3)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-1)]">{app.real_name}</span>
                    <span className="badge bg-[var(--brand-dim)] text-[var(--brand)] border border-[var(--border-brand)]">
                      {app.type === 'whitelist' ? 'وايت ليست' : app.type === 'police' ? 'شرطة' : app.type === 'ambulance' ? 'إسعاف' : 'صانع محتوى'}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-3)] mt-0.5">{app.discord_username} · {app.age} سنة</div>
                </div>
                <span className={`badge ${app.status === 'pending' ? 'status-pending' : app.status === 'accepted' ? 'status-active' : app.status === 'reviewing' ? 'status-reviewing' : 'status-rejected'}`}>
                  {app.status === 'pending' ? 'مراجعة' : app.status === 'accepted' ? 'مقبول' : app.status === 'reviewing' ? 'دراسة' : 'مرفوض'}
                </span>
                <div className="flex gap-1.5">
                  <button onClick={() => updateStatus(app.id, 'accepted', app.real_name)} className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors" title="قبول">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateStatus(app.id, 'rejected', app.real_name)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="رفض">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Police Dashboard ──
function PoliceDashboard({ user }: { user: DiscordUser | null }) {
  const [discordId, setDiscordId] = useState('');
  const [username, setUsername] = useState('');
  const [action, setAction] = useState<'hire' | 'promote' | 'fire'>('hire');
  const [rank, setRank] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const ranks = ['شرطي', 'عريف', 'رقيب', 'ملازم', 'نقيب', 'رائد', 'عميد'];
  const adminName = user?.global_name || user?.username || 'Admin';

  const loadLogs = useCallback(async () => {
    const { data } = await supabase.from('admin_logs').select('*').like('action', 'police_%').order('created_at', { ascending: false }).limit(20);
    if (data) setLogs(data);
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleSubmit = async () => {
    if (!discordId.trim() || !reason.trim()) return;
    setLoading(true); setResult(null);
    const actionLabels = { hire: 'تعيين', promote: 'ترقية', fire: 'فصل' };
    try {
      await logActivity(adminName, `police_${action}`, discordId, `${actionLabels[action]} — ${rank || '—'} — ${reason}`);
      await sendWebhook(`🚔 ${actionLabels[action]} في قطاع الشرطة`, [
        { name: '👤 الموظف', value: `${username || '—'} (${discordId})`, inline: false },
        { name: '🎯 الإجراء', value: actionLabels[action], inline: true },
        { name: '🎖️ الرتبة', value: rank || '—', inline: true },
        { name: '📝 السبب', value: reason, inline: false },
        { name: '👮 المسؤول', value: adminName, inline: true },
        { name: '⏱️ التوقيت', value: new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' }), inline: true },
      ], 0x3B82F6);
      setResult({ type: 'success', msg: `تم ${actionLabels[action]} بنجاح وإرسال الإشعار` });
      setDiscordId(''); setUsername(''); setRank(''); setReason('');
      loadLogs();
    } catch {
      setResult({ type: 'error', msg: 'حدث خطأ، حاول مرة أخرى' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#3B82F6]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-1)]">داشبورد الشرطة</h1>
          <p className="text-sm text-[var(--text-2)]">تعيين، ترقية، فصل، وإرسال webhook تلقائي</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">إجراء جديد</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Discord ID</label>
              <input value={discordId} onChange={(e) => setDiscordId(e.target.value)} placeholder="987654321012345678" className="input font-mono text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">اسم الموظف</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="الاسم في Discord" className="input" />
            </div>
            <div className="flex gap-2">
              {([['hire', 'تعيين', UserPlus], ['promote', 'ترقية', TrendingUp], ['fire', 'فصل', UserMinus]] as const).map(([act, label, Icon]) => (
                <button key={act} onClick={() => setAction(act)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${action === act ? (act === 'fire' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : act === 'promote' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25' : 'bg-green-500/15 text-green-400 border border-green-500/25') : 'bg-[var(--surface-2)] text-[var(--text-3)] border border-white/8'}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">الرتبة</label>
              <select value={rank} onChange={(e) => setRank(e.target.value)} className="input">
                <option value="">اختر رتبة...</option>
                {ranks.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">السبب <span className="text-red-400">*</span></label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="سبب الإجراء..." className="input resize-none" rows={2} />
            </div>
            {result && (
              <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${result.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'}`}>
                {result.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {result.msg}
              </div>
            )}
            <button onClick={handleSubmit} disabled={loading || !discordId || !reason} className="btn-primary w-full justify-center" style={{ background: '#3B82F6', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              تنفيذ وإرسال Webhook
            </button>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">آخر الإجراءات</h3>
          <div className="space-y-2">
            {logs.length === 0 && <p className="text-sm text-[var(--text-3)] py-4 text-center">لا توجد إجراءات</p>}
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-2)]">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-1)] truncate">{log.action.replace('police_', '')}</div>
                  <div className="text-xs text-[var(--text-3)] truncate">{log.details}</div>
                </div>
                <div className="text-xs text-[var(--text-3)] shrink-0">{new Date(log.created_at).toLocaleDateString('ar-SA')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Ambulance Dashboard ──
function AmbulanceDashboard({ user }: { user: DiscordUser | null }) {
  const [discordId, setDiscordId] = useState('');
  const [username, setUsername] = useState('');
  const [action, setAction] = useState<'hire' | 'promote' | 'fire'>('hire');
  const [rank, setRank] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const ranks = ['مسعف', 'مسعف أول', 'مشرف طبي', 'طبيب', 'استشاري', 'رئيس قسم'];
  const adminName = user?.global_name || user?.username || 'Admin';

  const loadLogs = useCallback(async () => {
    const { data } = await supabase.from('admin_logs').select('*').like('action', 'ambulance_%').order('created_at', { ascending: false }).limit(20);
    if (data) setLogs(data);
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleSubmit = async () => {
    if (!discordId.trim() || !reason.trim()) return;
    setLoading(true); setResult(null);
    const actionLabels = { hire: 'تعيين', promote: 'ترقية', fire: 'فصل' };
    try {
      await logActivity(adminName, `ambulance_${action}`, discordId, `${actionLabels[action]} — ${rank || '—'} — ${reason}`);
      await sendWebhook(`🚑 ${actionLabels[action]} في قطاع الإسعاف`, [
        { name: '👤 الموظف', value: `${username || '—'} (${discordId})`, inline: false },
        { name: '🎯 الإجراء', value: actionLabels[action], inline: true },
        { name: '🎖️ الرتبة', value: rank || '—', inline: true },
        { name: '📝 السبب', value: reason, inline: false },
        { name: '👨‍⚕️ المسؤول', value: adminName, inline: true },
        { name: '⏱️ التوقيت', value: new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' }), inline: true },
      ], 0xEF4444);
      setResult({ type: 'success', msg: `تم ${actionLabels[action]} بنجاح وإرسال الإشعار` });
      setDiscordId(''); setUsername(''); setRank(''); setReason('');
      loadLogs();
    } catch {
      setResult({ type: 'error', msg: 'حدث خطأ' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/25 flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#EF4444]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-1)]">داشبورد الإسعاف</h1>
          <p className="text-sm text-[var(--text-2)]">تعيين، ترقية، فصل، وإرسال webhook تلقائي</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">إجراء جديد</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Discord ID</label>
              <input value={discordId} onChange={(e) => setDiscordId(e.target.value)} placeholder="987654321012345678" className="input font-mono text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">اسم الموظف</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="الاسم في Discord" className="input" />
            </div>
            <div className="flex gap-2">
              {([['hire', 'تعيين', UserPlus], ['promote', 'ترقية', TrendingUp], ['fire', 'فصل', UserMinus]] as const).map(([act, label, Icon]) => (
                <button key={act} onClick={() => setAction(act)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${action === act ? (act === 'fire' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : act === 'promote' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25' : 'bg-green-500/15 text-green-400 border border-green-500/25') : 'bg-[var(--surface-2)] text-[var(--text-3)] border border-white/8'}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">الرتبة</label>
              <select value={rank} onChange={(e) => setRank(e.target.value)} className="input">
                <option value="">اختر رتبة...</option>
                {ranks.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">السبب <span className="text-red-400">*</span></label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="سبب الإجراء..." className="input resize-none" rows={2} />
            </div>
            {result && (
              <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${result.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'}`}>
                {result.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {result.msg}
              </div>
            )}
            <button onClick={handleSubmit} disabled={loading || !discordId || !reason} className="btn-primary w-full justify-center" style={{ background: '#EF4444', boxShadow: '0 4px 16px rgba(239,68,68,0.25)' }}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              تنفيذ وإرسال Webhook
            </button>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">آخر الإجراءات</h3>
          <div className="space-y-2">
            {logs.length === 0 && <p className="text-sm text-[var(--text-3)] py-4 text-center">لا توجد إجراءات</p>}
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-2)]">
                <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-[#EF4444]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-1)] truncate">{log.action.replace('ambulance_', '')}</div>
                  <div className="text-xs text-[var(--text-3)] truncate">{log.details}</div>
                </div>
                <div className="text-xs text-[var(--text-3)] shrink-0">{new Date(log.created_at).toLocaleDateString('ar-SA')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Creator Dashboard ──
function CreatorDashboard({ user }: { user: DiscordUser | null }) {
  const [creators, setCreators] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [points, setPoints] = useState(10);
  const [reason, setReason] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [tab, setTab] = useState<'leaderboard' | 'manage' | 'broadcasts'>('leaderboard');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('creator_profiles').select('*').order('points', { ascending: false });
    if (data) { setCreators(data); if (data.length > 0 && !selectedId) setSelectedId(data[0].id); }
    const { data: bc } = await supabase.from('creator_broadcasts').select('*, creator_profiles(display_name, discord_username)').order('created_at', { ascending: false }).limit(20);
    if (bc) setBroadcasts(bc as any[]);
  }, [selectedId]);

  useEffect(() => { load(); }, [load]);

  const selected = creators.find((c) => c.id === selectedId);

  const adjustPoints = async (delta: number) => {
    if (!reason.trim() || !selectedId || !selected) return;
    setLoading(true);
    await supabase.from('creator_profiles').update({ points: selected.points + delta, updated_at: new Date().toISOString() }).eq('id', selectedId);
    await logActivity(user?.username || 'Creator Manager', `creator_points_${delta > 0 ? 'add' : 'sub'}`, selected.discord_username, `${delta} نقطة — ${reason}`);
    await sendWebhook(`${delta > 0 ? '➕' : '➖'} تعديل نقاط صانع محتوى`, [
      { name: '🎬 الصانع', value: `${selected.display_name || selected.discord_username}`, inline: true },
      { name: '🔢 النقاط', value: `${delta > 0 ? '+' : ''}${delta}`, inline: true },
      { name: '📝 السبب', value: reason, inline: false },
      { name: '👨‍💼 المسؤول', value: user?.username || 'Creator Manager', inline: true },
      { name: '⏱️ التوقيت', value: new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' }), inline: true },
    ], 0x9333EA);
    setReason('');
    load();
    setLoading(false);
  };

  const submitLive = async () => {
    if (!liveUrl.trim() || !selectedId) return;
    setLoading(true);
    const creator = creators.find((c) => c.id === selectedId);
    if (creator) {
      await supabase.from('creator_broadcasts').insert({ creator_id: selectedId, url: liveUrl, platform: 'twitch' });
      await supabase.from('creator_profiles').update({ is_live: true, live_url: liveUrl, total_streams: creator.total_streams + 1, updated_at: new Date().toISOString() }).eq('id', selectedId);
      await logActivity(creator.discord_username, 'creator_live', selectedId, liveUrl);
      await sendWebhook('🔴 صانع محتوى بدأ البث', [
        { name: '🎬 الصانع', value: creator.display_name || creator.discord_username, inline: true },
        { name: '🔗 الرابط', value: liveUrl, inline: false },
        { name: '⏱️ التوقيت', value: new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' }), inline: true },
      ], 0xEF4444);
      setLiveUrl('');
      load();
    }
    setLoading(false);
  };

  const totalPoints = creators.reduce((s, c) => s + (c.points || 0), 0);
  const totalStreams = creators.reduce((s, c) => s + (c.total_streams || 0), 0);
  const totalViewers = creators.reduce((s, c) => s + (c.total_viewers || 0), 0);
  const liveCount = creators.filter((c) => c.is_live).length;
  const rankColors = ['#F59E0B', '#94A3B8', '#CD7F32', '#64748B', '#64748B'];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#9333EA]/15 border border-[#9333EA]/25 flex items-center justify-center">
          <Video className="w-6 h-6 text-[#9333EA]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-1)]">داشبورد صناع المحتوى</h1>
          <p className="text-sm text-[var(--text-2)]">لوحة الصدارة، إدارة النقاط، البثوث، والإحصائيات</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي النقاط', val: totalPoints.toLocaleString(), icon: Star, color: '#9333EA' },
          { label: 'إجمالي البثوث', val: totalStreams, icon: Radio, color: '#3B82F6' },
          { label: 'إجمالي المشاهدات', val: totalViewers.toLocaleString(), icon: Eye, color: '#10B981' },
          { label: 'بثوث مباشرة الآن', val: liveCount, icon: Flame, color: '#EF4444' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--text-1)]">{s.val}</div>
                  <div className="text-xs text-[var(--text-3)]">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {([
          ['leaderboard', 'لوحة الصدارة', Trophy],
          ['manage', 'إدارة النقاط', Award],
          ['broadcasts', 'سجل البثوث', Radio],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${tab === id ? 'bg-[#9333EA] text-white' : 'bg-[var(--surface-2)] text-[var(--text-2)] border border-white/8 hover:text-[var(--text-1)]'}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="font-semibold text-[var(--text-1)] text-sm">صدارة صناع المحتوى</h3>
          </div>
          {creators.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 p-5 pb-3">
              {[1, 0, 2].map((idx) => {
                const c = creators[idx];
                if (!c) return null;
                const rank = idx + 1;
                const isTop = rank === 1;
                return (
                  <div key={c.id} className={`flex flex-col items-center ${isTop ? 'order-2' : rank === 2 ? 'order-1' : 'order-3'}`}>
                    {isTop && <Crown className="w-6 h-6 text-[#F59E0B] mb-1.5" />}
                    <div className={`relative ${isTop ? 'w-16 h-16' : 'w-14 h-14'}`}>
                      <img src={c.discord_avatar ? `https://cdn.discordapp.com/avatars/${c.discord_id}/${c.discord_avatar}.png?size=128` : `https://ui-avatars.com/api/?name=${c.display_name || c.discord_username}&background=9333EA&color=fff&size=128`} alt="" className="w-full h-full rounded-2xl object-cover" style={{ border: `2px solid ${rankColors[idx]}` }} />
                      {c.is_live && <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[var(--surface)] live-dot" />}
                    </div>
                    <div className="text-sm font-bold text-[var(--text-1)] mt-2 truncate max-w-full">{c.display_name || c.discord_username}</div>
                    <div className="text-xs font-bold mt-0.5" style={{ color: rankColors[idx] }}>{c.points} نقطة</div>
                    <div className="text-[10px] text-[var(--text-3)] mt-0.5">{c.total_streams} بث · {c.total_viewers.toLocaleString()} مشاهدة</div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="divide-y divide-white/4">
            {creators.slice(3).map((c, i) => (
              <div key={c.id} className="p-4 flex items-center gap-3 hover:bg-white/2 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-xs font-bold text-[var(--text-3)] shrink-0">{i + 4}</div>
                <img src={c.discord_avatar ? `https://cdn.discordapp.com/avatars/${c.discord_id}/${c.discord_avatar}.png?size=64` : `https://ui-avatars.com/api/?name=${c.display_name || c.discord_username}&background=9333EA&color=fff&size=64`} alt="" className="w-9 h-9 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-1)] truncate">{c.display_name || c.discord_username}</div>
                  <div className="text-xs text-[var(--text-3)]">{c.total_streams} بث · {c.total_viewers.toLocaleString()} مشاهدة</div>
                </div>
                {c.is_live && <span className="badge status-rejected"><span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" /> مباشر</span>}
                <div className="text-sm font-bold text-[#9333EA]">{c.points}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage */}
      {tab === 'manage' && (
        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <div className="space-y-2">
            {creators.map((c) => (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className={`card p-3.5 w-full text-right ${selectedId === c.id ? '!border-[#9333EA]/30' : ''}`}>
                <div className="flex items-center gap-3">
                  <img src={c.discord_avatar ? `https://cdn.discordapp.com/avatars/${c.discord_id}/${c.discord_avatar}.png?size=64` : `https://ui-avatars.com/api/?name=${c.display_name || c.discord_username}&background=9333EA&color=fff&size=64`} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-1)] truncate">{c.display_name || c.discord_username}</div>
                    <div className="text-xs text-[var(--text-3)]">{c.points} نقطة</div>
                  </div>
                  {c.is_live && <span className="w-2 h-2 rounded-full bg-red-500 live-dot shrink-0" />}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {selected && (
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img src={selected.discord_avatar ? `https://cdn.discordapp.com/avatars/${selected.discord_id}/${selected.discord_avatar}.png?size=128` : `https://ui-avatars.com/api/?name=${selected.display_name || selected.discord_username}&background=9333EA&color=fff&size=128`} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-bold text-[var(--text-1)]">{selected.display_name || selected.discord_username}</h3>
                    <p className="text-xs text-[var(--text-3)]">@{selected.discord_username} · {selected.discord_id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] text-center">
                    <div className="text-2xl font-bold text-[#9333EA]">{selected.points}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">نقطة</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] text-center">
                    <div className="text-2xl font-bold text-[var(--text-1)]">{selected.total_streams}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">بث</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] text-center">
                    <div className="text-2xl font-bold text-[var(--text-1)]">{selected.total_viewers.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">مشاهدة</div>
                  </div>
                </div>

                <div className="mb-4 p-4 rounded-xl bg-[var(--surface-2)] border border-white/5">
                  <h4 className="text-xs font-semibold text-[var(--text-1)] mb-2.5 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#9333EA]" /> إرسال رابط لايف
                  </h4>
                  <div className="flex gap-2">
                    <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://twitch.tv/..." className="input flex-1 text-sm" />
                    <button onClick={submitLive} disabled={loading || !liveUrl} className="btn-primary btn-sm" style={{ background: '#9333EA' }}>
                      <Send className="w-3.5 h-3.5" /> إرسال
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-white/5">
                  <h4 className="text-xs font-semibold text-[var(--text-1)] mb-2.5 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#9333EA]" /> تعديل النقاط
                  </h4>
                  <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="سبب التعديل..." className="input mb-2.5 text-sm" />
                  <div className="flex items-center gap-2 mb-2.5">
                    <input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)} className="input w-20 text-sm" />
                    <span className="text-xs text-[var(--text-3)]">نقطة</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => adjustPoints(Math.abs(points))} disabled={loading || !reason} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-40">
                      <Plus className="w-3.5 h-3.5 inline ml-1" /> إضافة
                    </button>
                    <button onClick={() => adjustPoints(-Math.abs(points))} disabled={loading || !reason} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                      <UserMinus className="w-3.5 h-3.5 inline ml-1" /> خصم
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcasts */}
      {tab === 'broadcasts' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#9333EA]" />
            <h3 className="font-semibold text-[var(--text-1)] text-sm">آخر البثوث</h3>
          </div>
          <div className="divide-y divide-white/4">
            {broadcasts.length === 0 && <div className="p-8 text-center text-sm text-[var(--text-3)]">لا توجد بثوث مسجلة</div>}
            {broadcasts.map((b) => (
              <div key={b.id} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#9333EA]/10 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4 text-[#9333EA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-1)] truncate">{b.creator_profiles?.display_name || b.creator_profiles?.discord_username || '—'}</div>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#9333EA] hover:underline truncate block">{b.url}</a>
                </div>
                <div className="text-xs text-[var(--text-3)] shrink-0">{new Date(b.created_at).toLocaleDateString('ar-SA')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Gang Dashboard (Godfather) ──
function GangDashboard({ user }: { user: DiscordUser | null }) {
  const [gangs, setGangs] = useState<any[]>([]);
  const [selectedGang, setSelectedGang] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [nameChanges, setNameChanges] = useState<any[]>([]);
  const [gangPoints, setGangPoints] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview' | 'members' | 'leaves' | 'name' | 'points'>('overview');
  const [loading, setLoading] = useState(false);

  const [points, setPoints] = useState(50);
  const [reason, setReason] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('عضو');
  const [newName, setNewName] = useState('');
  const [leaveType, setLeaveType] = useState<'vacation' | 'sick' | 'emergency' | 'personal'>('vacation');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveMemberId, setLeaveMemberId] = useState('');

  const adminName = user?.global_name || user?.username || 'Godfather';

  const loadGangs = useCallback(async () => {
    const { data: g } = await supabase.from('gangs').select('*').order('created_at', { ascending: false });
    if (g) { setGangs(g); if (g.length > 0 && !selectedGang) setSelectedGang(g[0].id); }
  }, [selectedGang]);

  const loadDetails = useCallback(async () => {
    if (!selectedGang) return;
    const [m, l, nc, gp] = await Promise.all([
      supabase.from('gang_members').select('*').eq('gang_id', selectedGang).order('joined_at', { ascending: false }),
      supabase.from('gang_leaves').select('*').eq('gang_id', selectedGang).order('created_at', { ascending: false }),
      supabase.from('gang_name_changes').select('*').eq('gang_id', selectedGang).order('created_at', { ascending: false }),
      supabase.from('gang_points').select('*').eq('gang_id', selectedGang).order('created_at', { ascending: false }),
    ]);
    if (m.data) setMembers(m.data);
    if (l.data) setLeaves(l.data);
    if (nc.data) setNameChanges(nc.data);
    if (gp.data) setGangPoints(gp.data);
  }, [selectedGang]);

  useEffect(() => { loadGangs(); }, [loadGangs]);
  useEffect(() => { loadDetails(); }, [loadDetails]);

  const selected = gangs.find((g) => g.id === selectedGang);

  const addMember = async () => {
    if (!newMemberId.trim() || !newMemberName.trim() || !selectedGang) return;
    setLoading(true);
    await supabase.from('gang_members').insert({ gang_id: selectedGang, discord_id: newMemberId, username: newMemberName, role: newMemberRole });
    await logActivity(adminName, 'gang_member_add', selected?.name, `${newMemberName} (${newMemberRole})`);
    await sendWebhook('➕ عضو جديد في العصابة', [
      { name: '🏴 العصابة', value: selected?.name || '—', inline: true },
      { name: '👤 العضو', value: `${newMemberName} (${newMemberId})`, inline: true },
      { name: '🎖️ الرتبة', value: newMemberRole, inline: true },
      { name: '👑 المسؤول', value: adminName, inline: true },
      { name: '⏱️ التوقيت', value: new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' }), inline: true },
    ], 0xF59E0B);
    setNewMemberId(''); setNewMemberName('');
    loadDetails();
    setLoading(false);
  };

  const updateMemberRole = async (memberId: string, newRole: string, memberName: string) => {
    await supabase.from('gang_members').update({ role: newRole }).eq('id', memberId);
    await logActivity(adminName, 'gang_member_role', selected?.name, `${memberName} → ${newRole}`);
    await sendWebhook('🎖️ تغيير رتبة عضو', [
      { name: '🏴 العصابة', value: selected?.name || '—', inline: true },
      { name: '👤 العضو', value: memberName, inline: true },
      { name: '🎖️ الرتبة الجديدة', value: newRole, inline: true },
      { name: '👑 المسؤول', value: adminName, inline: true },
    ], 0xF59E0B);
    loadDetails();
  };

  const removeMember = async (memberId: string, memberName: string) => {
    await supabase.from('gang_members').update({ status: 'removed' }).eq('id', memberId);
    await logActivity(adminName, 'gang_member_remove', selected?.name, memberName);
    await sendWebhook('➖ إزالة عضو من العصابة', [
      { name: '🏴 العصابة', value: selected?.name || '—', inline: true },
      { name: '👤 العضو', value: memberName, inline: true },
      { name: '👑 المسؤول', value: adminName, inline: true },
    ], 0xEF4444);
    loadDetails();
  };

  const requestNameChange = async () => {
    if (!newName.trim() || !selectedGang || !selected) return;
    setLoading(true);
    await supabase.from('gang_name_changes').insert({ gang_id: selectedGang, old_name: selected.name, new_name: newName, requested_by: adminName, reason });
    await logActivity(adminName, 'gang_name_request', selected.name, `→ ${newName}`);
    await sendWebhook('📝 طلب تغيير اسم عصابة', [
      { name: '🏴 الاسم الحالي', value: selected.name, inline: true },
      { name: '✨ الاسم الجديد', value: newName, inline: true },
      { name: '👑 المسؤول', value: adminName, inline: true },
      { name: '📝 السبب', value: reason || '—', inline: false },
    ], 0xF59E0B);
    setNewName(''); setReason('');
    loadDetails();
    setLoading(false);
  };

  const approveNameChange = async (ncId: string, gangId: string, newName: string) => {
    await supabase.from('gang_name_changes').update({ status: 'approved', reviewed_by: adminName }).eq('id', ncId);
    await supabase.from('gangs').update({ name: newName }).eq('id', gangId);
    await logActivity(adminName, 'gang_name_approve', newName, 'تم الموافقة');
    loadDetails();
    loadGangs();
  };

  const submitLeave = async () => {
    if (!leaveMemberId || !leaveStart || !selectedGang) return;
    setLoading(true);
    const member = members.find((m) => m.id === leaveMemberId);
    if (member) {
      await supabase.from('gang_leaves').insert({
        gang_id: selectedGang, member_discord_id: member.discord_id, member_username: member.username,
        leave_type: leaveType, start_date: leaveStart, end_date: leaveEnd || null, reason: leaveReason,
      });
      await supabase.from('gang_members').update({ status: 'on_leave' }).eq('id', leaveMemberId);
      await logActivity(adminName, 'gang_leave_submit', selected?.name, `${member.username} — ${leaveType}`);
      await sendWebhook('🏖️ إجازة عضو عصابة', [
        { name: '🏴 العصابة', value: selected?.name || '—', inline: true },
        { name: '👤 العضو', value: member.username, inline: true },
        { name: '📋 النوع', value: { vacation: 'إجازة', sick: 'مرضية', emergency: 'طارئة', personal: 'شخصية' }[leaveType], inline: true },
        { name: '📅 من', value: leaveStart, inline: true },
        { name: '📅 إلى', value: leaveEnd || 'غير محدد', inline: true },
        { name: '📝 السبب', value: leaveReason || '—', inline: false },
        { name: '👑 المسؤول', value: adminName, inline: true },
      ], 0x3B82F6);
      setLeaveStart(''); setLeaveEnd(''); setLeaveReason(''); setLeaveMemberId('');
      loadDetails();
    }
    setLoading(false);
  };

  const reviewLeave = async (leaveId: string, status: 'approved' | 'rejected') => {
    await supabase.from('gang_leaves').update({ status, reviewed_by: adminName }).eq('id', leaveId);
    if (status === 'rejected') {
      const leave = leaves.find((l) => l.id === leaveId);
      if (leave) await supabase.from('gang_members').update({ status: 'active' }).eq('discord_id', leave.member_discord_id);
    }
    await logActivity(adminName, `gang_leave_${status}`, selected?.name, status === 'approved' ? 'موافق' : 'مرفوض');
    loadDetails();
  };

  const adjustPoints = async (delta: number) => {
    if (!reason.trim() || !selectedGang) return;
    setLoading(true);
    await supabase.from('gang_points').insert({ gang_id: selectedGang, points: delta, reason, awarded_by: adminName });
    await logActivity(adminName, `gang_points_${delta > 0 ? 'add' : 'sub'}`, selected?.name, `${delta} نقطة — ${reason}`);
    await sendWebhook(`${delta > 0 ? '➕' : '➖'} نقاط عصابة`, [
      { name: '🏴 العصابة', value: selected?.name || '—', inline: true },
      { name: '🔢 النقاط', value: `${delta > 0 ? '+' : ''}${delta}`, inline: true },
      { name: '📝 السبب', value: reason, inline: false },
      { name: '👑 المسؤول', value: adminName, inline: true },
    ], 0xF59E0B);
    setReason('');
    loadDetails();
    setLoading(false);
  };

  const statusLabels: Record<string, { label: string; cls: string }> = {
    active: { label: 'نشط', cls: 'status-active' },
    dissolved: { label: 'منحل', cls: 'status-rejected' },
    warned: { label: 'محذر', cls: 'status-pending' },
    banned: { label: 'محظور', cls: 'status-rejected' },
  };
  const memberStatusLabels: Record<string, { label: string; cls: string }> = {
    active: { label: 'نشط', cls: 'status-active' },
    on_leave: { label: 'في إجازة', cls: 'status-pending' },
    removed: { label: 'مزال', cls: 'status-rejected' },
  };
  const leaveTypeLabels: Record<string, string> = { vacation: 'إجازة', sick: 'مرضية', emergency: 'طارئة', personal: 'شخصية' };

  const tabs = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: BarChart3 },
    { id: 'members' as const, label: 'الأعضاء', icon: Users },
    { id: 'leaves' as const, label: 'الإجازات', icon: Calendar },
    { id: 'name' as const, label: 'تغيير الاسم', icon: Edit3 },
    { id: 'points' as const, label: 'النقاط', icon: Award },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/25 flex items-center justify-center">
          <Crown className="w-6 h-6 text-[#F59E0B]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-1)]">إدارة العصابات</h1>
          <p className="text-sm text-[var(--text-2)]">صلاحية Godfather — تحكم كامل بكل العصابات</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        {/* Gang list */}
        <div className="space-y-2">
          {gangs.map((g) => {
            const st = statusLabels[g.status] || statusLabels.active;
            return (
              <button key={g.id} onClick={() => setSelectedGang(g.id)}
                className={`card p-4 w-full text-right ${selectedGang === g.id ? '!border-[#F59E0B]/30' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${g.color}15`, border: `1px solid ${g.color}30` }}>
                    <Users className="w-4 h-4" style={{ color: g.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-1)] truncate">{g.name}</div>
                    <div className="text-xs text-[var(--text-3)]">{g.leader} · {g.member_count} أعضاء</div>
                  </div>
                  <span className={`badge ${st.cls}`}>{st.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected && (
            <>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${selected.color}15`, border: `1px solid ${selected.color}30` }}>
                    <Users className="w-6 h-6" style={{ color: selected.color }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[var(--text-1)]">{selected.name}</h2>
                    <p className="text-xs text-[var(--text-3)]">القائد: {selected.leader} · المنطقة: {selected.territory || '—'}</p>
                  </div>
                  <span className={`badge ${statusLabels[selected.status]?.cls || 'status-active'}`}>{statusLabels[selected.status]?.label || 'نشط'}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {tabs.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${tab === t.id ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25' : 'text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-white/4'}`}>
                        <Icon className="w-3.5 h-3.5" /> {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Overview */}
              {tab === 'overview' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'الأعضاء النشطون', val: members.filter((m) => m.status === 'active').length, icon: Users, color: '#10B981' },
                    { label: 'في إجازة', val: members.filter((m) => m.status === 'on_leave').length, icon: Calendar, color: '#F59E0B' },
                    { label: 'إجازات معلقة', val: leaves.filter((l) => l.status === 'pending').length, icon: Clock, color: '#EF4444' },
                    { label: 'إجمالي النقاط', val: gangPoints.reduce((s, p) => s + p.points, 0), icon: Award, color: '#9333EA' },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="card p-4 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                          <Icon className="w-4.5 h-4.5" style={{ color: s.color }} />
                        </div>
                        <div className="text-xl font-bold text-[var(--text-1)]">{s.val}</div>
                        <div className="text-xs text-[var(--text-3)] mt-0.5">{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Members */}
              {tab === 'members' && (
                <div className="space-y-4">
                  <div className="card p-4">
                    <h3 className="text-sm font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-[#F59E0B]" /> إضافة عضو جديد
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-2">
                      <input value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} placeholder="Discord ID" className="input font-mono text-xs" />
                      <input value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="اسم العضو" className="input" />
                      <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} className="input">
                        <option value="عضو">عضو</option>
                        <option value="نائب">نائب</option>
                        <option value="قائد">قائد</option>
                        <option value="منسق">منسق</option>
                      </select>
                    </div>
                    <button onClick={addMember} disabled={loading || !newMemberId || !newMemberName} className="btn-primary btn-sm mt-2.5" style={{ background: '#F59E0B' }}>
                      <Plus className="w-3.5 h-3.5" /> إضافة
                    </button>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5">
                      <h3 className="text-sm font-semibold text-[var(--text-1)]">الأعضاء ({members.filter((m) => m.status !== 'removed').length})</h3>
                    </div>
                    <div className="divide-y divide-white/4">
                      {members.filter((m) => m.status !== 'removed').map((m) => (
                        <div key={m.id} className="p-4 flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${m.username}&background=F59E0B&color=fff&size=64`} alt="" className="w-9 h-9 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[var(--text-1)] truncate">{m.username}</div>
                            <div className="text-xs text-[var(--text-3)] font-mono">{m.discord_id}</div>
                          </div>
                          <span className={`badge ${memberStatusLabels[m.status]?.cls || 'status-active'}`}>{memberStatusLabels[m.status]?.label || 'نشط'}</span>
                          <select value={m.role} onChange={(e) => updateMemberRole(m.id, e.target.value, m.username)}
                            className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-2)] border border-white/8 text-xs text-[var(--text-1)] outline-none focus:border-[#F59E0B]/30">
                            <option value="عضو">عضو</option>
                            <option value="نائب">نائب</option>
                            <option value="قائد">قائد</option>
                            <option value="منسق">منسق</option>
                          </select>
                          <button onClick={() => removeMember(m.id, m.username)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="إزالة">
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {members.filter((m) => m.status !== 'removed').length === 0 && (
                        <div className="p-8 text-center text-sm text-[var(--text-3)]">لا يوجد أعضاء</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Leaves */}
              {tab === 'leaves' && (
                <div className="space-y-4">
                  <div className="card p-4">
                    <h3 className="text-sm font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#F59E0B]" /> طلب إجازة لعضو
                    </h3>
                    <div className="space-y-2">
                      <select value={leaveMemberId} onChange={(e) => setLeaveMemberId(e.target.value)} className="input">
                        <option value="">اختر عضو...</option>
                        {members.filter((m) => m.status === 'active').map((m) => <option key={m.id} value={m.id}>{m.username}</option>)}
                      </select>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value as any)} className="input">
                          <option value="vacation">إجازة</option>
                          <option value="sick">مرضية</option>
                          <option value="emergency">طارئة</option>
                          <option value="personal">شخصية</option>
                        </select>
                        <input type="date" value={leaveStart} onChange={(e) => setLeaveStart(e.target.value)} className="input" />
                        <input type="date" value={leaveEnd} onChange={(e) => setLeaveEnd(e.target.value)} className="input" />
                        <button onClick={submitLeave} disabled={loading || !leaveMemberId || !leaveStart} className="btn-primary btn-sm" style={{ background: '#F59E0B' }}>
                          <Send className="w-3.5 h-3.5" /> تأكيد
                        </button>
                      </div>
                      <input value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} placeholder="السبب (اختياري)" className="input" />
                    </div>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5">
                      <h3 className="text-sm font-semibold text-[var(--text-1)]">طلبات الإجازات</h3>
                    </div>
                    <div className="divide-y divide-white/4">
                      {leaves.length === 0 && <div className="p-8 text-center text-sm text-[var(--text-3)]">لا توجد طلبات إجازة</div>}
                      {leaves.map((l) => (
                        <div key={l.id} className="p-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-[#F59E0B]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[var(--text-1)]">{l.member_username}</span>
                              <span className="badge bg-[var(--surface-3)] text-[var(--text-2)] border border-white/8">{leaveTypeLabels[l.leave_type]}</span>
                            </div>
                            <div className="text-xs text-[var(--text-3)] mt-0.5">
                              {l.start_date} → {l.end_date || 'غير محدد'}
                              {l.reason && ` · ${l.reason}`}
                            </div>
                          </div>
                          {l.status === 'pending' ? (
                            <div className="flex gap-1.5">
                              <button onClick={() => reviewLeave(l.id, 'approved')} className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors" title="موافقة">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => reviewLeave(l.id, 'rejected')} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="رفض">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className={`badge ${l.status === 'approved' ? 'status-active' : 'status-rejected'}`}>{l.status === 'approved' ? 'موافق' : 'مرفوض'}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Name change */}
              {tab === 'name' && (
                <div className="space-y-4">
                  <div className="card p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#F59E0B]" /> طلب تغيير اسم العصابة
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-2)]">
                        <span className="text-xs text-[var(--text-3)]">الاسم الحالي:</span>
                        <span className="text-sm font-semibold text-[var(--text-1)]">{selected.name}</span>
                      </div>
                      <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="الاسم الجديد" className="input" />
                      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="سبب التغيير..." className="input" />
                      <button onClick={requestNameChange} disabled={loading || !newName} className="btn-primary btn-sm" style={{ background: '#F59E0B' }}>
                        <Send className="w-3.5 h-3.5" /> إرسال الطلب
                      </button>
                    </div>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5">
                      <h3 className="text-sm font-semibold text-[var(--text-1)]">سجل تغييرات الاسم</h3>
                    </div>
                    <div className="divide-y divide-white/4">
                      {nameChanges.length === 0 && <div className="p-8 text-center text-sm text-[var(--text-3)]">لا توجد طلبات تغيير</div>}
                      {nameChanges.map((nc) => (
                        <div key={nc.id} className="p-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                            <Edit3 className="w-4 h-4 text-[#F59E0B]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[var(--text-1)]">
                              <span className="text-[var(--text-3)]">{nc.old_name}</span>
                              <ChevronLeft className="w-3.5 h-3.5 inline mx-1 text-[var(--text-3)]" />
                              <span className="font-semibold">{nc.new_name}</span>
                            </div>
                            <div className="text-xs text-[var(--text-3)] mt-0.5">{nc.requested_by} · {nc.reason || '—'}</div>
                          </div>
                          {nc.status === 'pending' ? (
                            <button onClick={() => approveNameChange(nc.id, nc.gang_id, nc.new_name)} className="btn-ghost btn-sm">
                              <CheckCircle className="w-3.5 h-3.5" /> موافقة
                            </button>
                          ) : (
                            <span className={`badge ${nc.status === 'approved' ? 'status-active' : 'status-rejected'}`}>{nc.status === 'approved' ? 'موافق' : 'مرفوض'}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Points */}
              {tab === 'points' && (
                <div className="space-y-4">
                  <div className="card p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#F59E0B]" /> تعديل نقاط العصابة
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)} className="input w-24" />
                        <span className="text-xs text-[var(--text-3)]">نقطة</span>
                      </div>
                      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="سبب التعديل..." className="input" />
                      <div className="flex gap-2">
                        <button onClick={() => adjustPoints(Math.abs(points))} disabled={loading || !reason} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-40">
                          <Plus className="w-3.5 h-3.5 inline ml-1" /> إضافة
                        </button>
                        <button onClick={() => adjustPoints(-Math.abs(points))} disabled={loading || !reason} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                          <UserMinus className="w-3.5 h-3.5 inline ml-1" /> خصم
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5">
                      <h3 className="text-sm font-semibold text-[var(--text-1)]">سجل النقاط</h3>
                    </div>
                    <div className="divide-y divide-white/4">
                      {gangPoints.length === 0 && <div className="p-8 text-center text-sm text-[var(--text-3)]">لا توجد سجلات</div>}
                      {gangPoints.map((p) => (
                        <div key={p.id} className="p-4 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${p.points > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <span className="text-xs font-bold" style={{ color: p.points > 0 ? '#10B981' : '#EF4444' }}>{p.points > 0 ? '+' : ''}{p.points}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[var(--text-1)] truncate">{p.reason}</div>
                            <div className="text-xs text-[var(--text-3)] mt-0.5">{p.awarded_by} · {new Date(p.created_at).toLocaleDateString('ar-SA')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

