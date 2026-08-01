import { CheckCircle, XCircle, Calendar, Hash, User, ChevronLeft, FileText, Clock } from 'lucide-react';
import { DiscordLogo } from '../components/Icons';
import type { DiscordUser, DiscordMember, Page } from '../types';

const WHITELIST_ROLE_ID = '1409637134368899172';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
}

interface RoleDetail {
  id: string;
  name: string;
  color: string;
}

export default function ProfilePage({
  user, member, navigate, onLogin, isLoginLoading,
}: {
  user: DiscordUser | null;
  member: (DiscordMember & { rolesDetails?: RoleDetail[] }) | null;
  navigate: (p: Page) => void;
  onLogin: () => void;
  isLoginLoading: boolean;
}) {
  const hasWL = member?.roles.includes(WHITELIST_ROLE_ID);

  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=E07B20&color=fff&size=128`;

  if (!user) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/15 flex items-center justify-center mx-auto mb-5 text-[#5865F2]">
            <DiscordLogo className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">سجّل دخولك أولاً</h2>
          <p className="text-[var(--text-2)] text-sm mb-7 leading-relaxed">تحتاج تسجيل الدخول بـ Discord للوصول إلى ملفك الشخصي.</p>
          <button onClick={onLogin} disabled={isLoginLoading}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 shadow-sm">
            {isLoginLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <DiscordLogo className="w-5 h-5" />}
            تسجيل الدخول بـ Discord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-3xl mx-auto px-4 pb-10">
      {/* Profile card */}
      <div className="card overflow-hidden mb-5">
        <div className="h-24 bg-gradient-to-br from-[#E07B20]/20 via-[var(--surface-3)] to-[var(--surface-3)]" />
        <div className="px-5 pb-5 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <img src={avatar} alt="" className="w-16 h-16 rounded-2xl ring-4 ring-[var(--surface)] border border-[var(--border-brand)] object-cover shrink-0" />
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-[var(--text-1)]">{user.global_name || user.username}</h1>
              <span className={`badge ${hasWL ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {hasWL ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {hasWL ? 'مفعّل' : 'غير مفعّل'}
              </span>
            </div>
            <p className="text-[var(--text-3)] text-xs mt-0.5">@{user.username}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Info */}
        <div className="card p-5">          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--brand)]" /> معلومات الحساب
          </h3>
          <div className="space-y-2.5">
            {[
              { icon: Hash, label: 'Discord ID', val: user.id, mono: true },
              { icon: User, label: 'اسم المستخدم', val: user.username, mono: false },
              { icon: Calendar, label: 'تاريخ الانضمام', val: member?.joined_at ? fmtDate(member.joined_at) : 'غير متاح', mono: false },
              { icon: Calendar, label: 'تاريخ إنشاء الحساب', val: fmtDate('2022-03-10T08:00:00Z'), mono: false },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--surface-2)]">
                  <Icon className="w-4 h-4 text-[var(--text-3)] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[var(--text-3)] text-xs">{row.label}</div>
                    <div className={`text-[var(--text-1)] text-sm mt-0.5 ${row.mono ? 'font-mono' : 'font-medium'} truncate`}>{row.val}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WL */}
        <div className="space-y-4">
          <div className={`card p-5 ${hasWL ? 'border-green-500/20' : 'border-red-500/20'}`}>
            <h3 className="text-sm font-semibold text-[var(--text-1)] mb-3">حالة الوايت ليست</h3>
            {hasWL ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">حسابك مفعّل</span>
                </div>
                <p className="text-[var(--text-2)] text-sm leading-relaxed">لديك صلاحية الدخول الكاملة لسيرفر ULG CFW.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm font-semibold">حسابك غير مفعّل</span>
                </div>
                <p className="text-[var(--text-2)] text-sm leading-relaxed mb-4">قدّم طلب الوايت ليست ليتم مراجعته وتفعيل حسابك.</p>
                <button onClick={() => navigate('applications')} className="btn-primary btn-sm">
                  تقدّم للوايت ليست <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
