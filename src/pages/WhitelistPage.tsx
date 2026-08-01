import { useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, User, BookOpen, Send, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { DiscordUser, DiscordMember, Page } from '../types';

const WEBHOOK =
  'https://discord.com/api/webhooks/1525196337279270962/L7l2cqzDLS2xXVOLCoEfNrQdUBwoRUBUkByzDSkKEeZFUxSTrlagKA0r5-xiobQ8ItBZ';

const WHITELIST_ROLE = '1409637134368899172';

interface F { real_name: string; birth_date: string; character_name: string; character_story: string; rules_ok: boolean; }
const init: F = { real_name: '', birth_date: '', character_name: '', character_story: '', rules_ok: false };

function age(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 31557600000); }

async function webhook(f: F, user: DiscordUser | null) {
  const a = age(f.birth_date);
  const av = user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128` : undefined;
  await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'ULG CFW | الوايت ليست',
      avatar_url: 'https://ui-avatars.com/api/?name=ULG&background=E07B20&color=fff',
      embeds: [{
        title: '📋 طلب وايت ليست جديد',
        color: 0xe07b20,
        thumbnail: av ? { url: av } : undefined,
        fields: [
          { name: '👤 Discord', value: [`**الاسم:** ${user?.global_name || user?.username || 'ضيف'}`, `**يوزر:** @${user?.username || 'غير معروف'}`, `**ID:** \`${user?.id || '-'}\``].join('\n'), inline: false },
          { name: '📝 البيانات', value: [`**الاسم الحقيقي:** ${f.real_name}`, `**تاريخ الميلاد:** ${f.birth_date}`, `**العمر:** ${a} سنة`].join('\n'), inline: true },
          { name: '🎭 الشخصية', value: `**اسم الشخصية:** ${f.character_name}`, inline: true },
          { name: '📖 القصة', value: f.character_story.length > 1000 ? f.character_story.slice(0, 1000) + '...' : f.character_story },
          { name: '⏱️ التوقيت', value: new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' }), inline: true },
          { name: '✅ الحالة', value: '`قيد المراجعة`', inline: true },
        ],
        footer: { text: 'ULG CFW • نظام الوايت ليست' },
      }],
    }),
  });
}

export default function WhitelistPage({ user, member, navigate }: { user: DiscordUser | null; member: DiscordMember | null; navigate: (p: Page) => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState<F>(init);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const hasWL = member?.roles.includes(WHITELIST_ROLE);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setF((p) => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const s1ok = f.real_name.trim().length >= 3 && f.birth_date && age(f.birth_date) >= 15;
  const s2ok = f.character_name.trim().length >= 3 && f.character_story.trim().length >= 150 && f.rules_ok;

  const submit = async () => {
    setLoading(true); setErr('');
    try {
      const { error } = await supabase.from('whitelist_applications').insert({
        discord_id: user?.id || 'guest',
        discord_username: user?.username || 'guest',
        discord_avatar: user?.avatar || null,
        real_name: f.real_name,
        birth_date: f.birth_date,
        age: age(f.birth_date),
        character_story: `${f.character_name}\n\n${f.character_story}`,
      });
      if (error) throw error;
      await webhook(f, user);
      setDone(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'حدث خطأ، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (hasWL) return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">حسابك مفعّل بالفعل</h2>
          <p className="text-[var(--text-2)] text-sm mb-7">لديك رتبة الوايت ليست. يمكنك الانضمام للسيرفر والاستمتاع باللعب.</p>
          <button onClick={() => navigate('home')} className="btn-primary text-sm">العودة للرئيسية</button>
        </div>
      </div>
    </div>
  );

  if (done) return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--brand-dim)] border border-[var(--brand-border)] flex items-center justify-center mx-auto mb-5">
            <Send className="w-8 h-8 text-[var(--brand)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">تم إرسال طلبك</h2>
          <p className="text-[var(--text-2)] text-sm mb-1">سيتم مراجعة طلبك خلال 24–48 ساعة.</p>
          <p className="text-[var(--text-3)] text-xs mb-7">ستصلك إشعار على Discord عند قبول أو رفض الطلب.</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => navigate('home')} className="btn-ghost text-sm">الرئيسية</button>
            <a href="https://discord.gg/gM6FaEMF2B" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-semibold rounded-xl transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20">
      <div className="max-w-lg mx-auto px-4">
        <div className="mb-8">
          <span className="section-label">التقديم</span>
          <h1 className="text-2xl font-bold text-[var(--text-1)] mb-1.5">طلب الوايت ليست</h1>
          <p className="text-[var(--text-2)] text-sm">سيتم مراجعة طلبك خلال 24–48 ساعة.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[{ n: 1, label: 'بياناتك', Icon: User }, { n: 2, label: 'الشخصية', Icon: BookOpen }].map(({ n, label, Icon }, i) => (
            <div key={n} className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  step > n ? 'bg-green-500 text-white' : step === n ? 'text-white' : 'bg-[var(--surface-3)] text-[var(--text-3)] border border-black/8'
                }`} style={step === n ? { background: 'var(--brand)' } : {}}>
                  {step > n ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm font-medium ${step >= n ? 'text-[var(--text-1)]' : 'text-[var(--text-3)]'}`}>{label}</span>
              </div>
              {i < 1 && <div className={`h-px w-8 ${step > 1 ? 'bg-green-500' : 'bg-black/10'}`} />}
            </div>
          ))}
        </div>

        {!user && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-700 text-sm leading-relaxed">لم تقم بتسجيل الدخول. يُنصح بتسجيل الدخول لربط الطلب بحسابك.</p>
          </div>
        )}

        <div className="card p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[var(--text-1)] flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-[var(--brand)]" /> بياناتك الشخصية
              </h2>
              <div>
                <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">الاسم الحقيقي <span className="text-red-500">*</span></label>
                <input name="real_name" value={f.real_name} onChange={ch} placeholder="اسمك الكامل" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">تاريخ الميلاد <span className="text-red-500">*</span></label>
                <input type="date" name="birth_date" value={f.birth_date} onChange={ch} max={new Date().toISOString().split('T')[0]} className="input" />
                {f.birth_date && (
                  <p className={`text-sm mt-1.5 ${age(f.birth_date) >= 15 ? 'text-green-600' : 'text-red-500'}`}>
                    العمر: {age(f.birth_date)} سنة {age(f.birth_date) < 15 ? '— الحد الأدنى 15 سنة' : ''}
                  </p>
                )}
              </div>
              {user && (
                <div className="p-3 rounded-xl bg-[#5865F2]/6 border border-[#5865F2]/12 flex items-center gap-2.5">
                  <img src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : `https://ui-avatars.com/api/?name=${user.username}&background=E07B20&color=fff&size=64`}
                    alt="" className="w-9 h-9 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-[var(--text-1)] text-sm font-medium">{user.global_name || user.username}</div>
                    <div className="text-[var(--text-3)] text-xs">{user.id}</div>
                  </div>
                  <span className="badge bg-green-50 text-green-600 border border-green-200">تم الربط</span>
                </div>
              )}
              <button onClick={() => setStep(2)} disabled={!s1ok} className="btn-primary w-full justify-center mt-2">
                التالي <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[var(--text-1)] flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-[var(--brand)]" /> شخصيتك في اللعبة
              </h2>
              <div>
                <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">اسم الشخصية <span className="text-red-500">*</span></label>
                <input name="character_name" value={f.character_name} onChange={ch} placeholder="الاسم الكامل للشخصية (اسم + لقب)" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">
                  قصة الشخصية <span className="text-red-500">*</span>
                  <span className="text-[var(--text-3)] mr-1 text-xs">(150 حرف على الأقل)</span>
                </label>
                <textarea name="character_story" value={f.character_story} onChange={ch} rows={7}
                  placeholder="من أين أتت شخصيتك؟ ما الذي دفعها للمجيء؟ أهدافها وطموحاتها داخل المدينة..."
                  className="input resize-none leading-relaxed" />
                <div className={`text-xs mt-1.5 ${f.character_story.length >= 150 ? 'text-green-600' : 'text-[var(--text-3)]'}`}>
                  {f.character_story.length} / 150
                </div>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" name="rules_ok" checked={f.rules_ok} onChange={ch} className="mt-0.5 accent-[var(--brand)] w-4 h-4" />
                <span className="text-[var(--text-2)] text-sm leading-relaxed">
                  قرأت وأوافق على{' '}
                  <button type="button" onClick={() => navigate('rules')} className="text-[var(--brand)] hover:underline font-medium">قوانين السيرفر</button>
                  {' '}وأتعهد بالالتزام بها.
                </span>
              </label>
              {err && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{err}</div>}
              <div className="flex gap-2.5 pt-1">
                <button onClick={() => setStep(1)} className="btn-ghost">
                  <ChevronRight className="w-4 h-4" /> رجوع
                </button>
                <button onClick={submit} disabled={!s2ok || loading} className="btn-primary flex-1 justify-center">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> إرسال...</>
                    : <><Send className="w-4 h-4" /> إرسال الطلب</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
