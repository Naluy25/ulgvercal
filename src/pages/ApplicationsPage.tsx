import { useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, User, BookOpen, Send, AlertTriangle, Shield, Heart, Video, FileText, Landmark, Scale, ArrowRight, Sparkles, Clock, MessageCircle, Info } from 'lucide-react';
import type { Page } from '../types';
import { getApplications, type ApplicationTypeConfig } from '../lib/store';

const WEBHOOK =
  'https://discord.com/api/webhooks/1525196337279270962/L7l2cqzDLS2xXVOLCoEfNrQdUBwoRUBUkByzDSkKEeZFUxSTrlagKA0r5-xiobQ8ItBZ';

const WHITELIST_ROLE = '1409637134368899172';

const iconMap: Record<string, typeof Shield> = {
  User, Shield, Heart, Video, Landmark, Scale, FileText, BookOpen, Send, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight,
};

interface FormData {
  discord_id: string;
  real_name: string;
  birth_date: string;
  character_name: string;
  character_story: string;
  experience: string;
  rules_ok: boolean;
  age_confirm: boolean;
}

const initialForm: FormData = {
  discord_id: '',
  real_name: '',
  birth_date: '',
  character_name: '',
  character_story: '',
  experience: '',
  rules_ok: false,
  age_confirm: false,
};

const DISCORD_ID_RE = /^\d{17,20}$/;

function age(d: string) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 31557600000);
}

function buildAppTypes(allApps: ApplicationTypeConfig[]) {
  return allApps
    .filter(a => a.enabled && a.id === 'whitelist')
    .map(a => ({
      type: a.id,
      label: a.label,
      icon: iconMap[a.icon] || Shield,
      color: a.color,
      desc: a.description,
      questions: a.questions,
      requirements: a.requirements,
      roleId: a.roleId,
    }));
}

async function sendWebhook(label: string, f: FormData) {
  const a = age(f.birth_date);
  const mention = f.discord_id ? `<@${f.discord_id}>` : 'غير معروف';

  const embed = {
    title: `📋 طلب ${label}`,
    color: 0xe07b20,
    description: `**طلب جديد — ${label}**`,
    fields: [
      {
        name: '━━━━━━━━━━━━━━━━━━',
        value: `\u200B`,
        inline: false,
      },
      {
        name: '👤 حساب Discord',
        value: [
          `> **المعرّف:** \`${f.discord_id || 'غير معروف'}\``,
          `> **المنشن:** ${mention}`,
        ].join('\n'),
        inline: false,
      },
      {
        name: '━━━━━━━━━━━━━━━━━━',
        value: `\u200B`,
        inline: false,
      },
      {
        name: '📝 البيانات الشخصية',
        value: [
          `> **الاسم الحقيقي:** ${f.real_name}`,
          `> **العمر:** ${f.birth_date ? `${a} سنة${a < 18 ? ' ⚠️' : ''}` : 'غير محدد'}`,
          `> **تاريخ الميلاد:** ${f.birth_date || 'غير محدد'}`,
        ].filter(Boolean).join('\n'),
        inline: false,
      },
      {
        name: '🎭 الشخصية',
        value: [
          `> **الاسم:** ${f.character_name || 'غير محدد'}`,
        ].join('\n'),
        inline: false,
      },
    ],
    footer: {
      text: 'ULG CFW • نظام التقديمات',
    },
  };

  if (f.character_story) {
    embed.fields.push({
      name: '📖 قصة الشخصية',
      value: `> ${f.character_story.slice(0, 1000)}`,
      inline: false,
    });
  }

  if (f.experience) {
    embed.fields.push({
      name: '💼 الخبرة',
      value: `> ${f.experience.slice(0, 500)}`,
      inline: false,
    });
  }

  embed.fields.push(
    {
      name: '━━━━━━━━━━━━━━━━━━',
      value: `\u200B`,
      inline: false,
    },
    {
      name: '📊 ملخص الطلب',
      value: [
        `> **التقديم:** ${label}`,
        `> **العمر:** ${f.birth_date ? `${a} سنة${a < 18 ? ' ⚠️ غير مؤهل' : ''}` : 'غير محدد'}`,
        `> **الحالة:** \`⏳ قيد المراجعة\``,
        `> **الوقت:** <t:${Math.floor(Date.now() / 1000)}:R>`,
      ].join('\n'),
      inline: false,
    }
  );

  await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'ULG CFW | نظام التقديمات',
      avatar_url: 'https://a.top4top.io/p_3849ne4pe1.png',
      content: `**طلب ${label} جديد** — ${mention}`,
      embeds: [embed],
    }),
  });
}

export default function ApplicationsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [f, setF] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const allApps = getApplications();
  const appTypes = buildAppTypes(allApps);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setF((p) => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const calculatedAge = f.birth_date ? age(f.birth_date) : 0;
  const isAgeValid = calculatedAge >= 18;
  const discordIdOk = DISCORD_ID_RE.test(f.discord_id.trim());
  const s1ok = discordIdOk && f.real_name.trim().length >= 3 && f.birth_date && isAgeValid;
  const s2ok = f.character_name.trim().length >= 3 && f.character_story.trim().length >= 150 && f.rules_ok && f.age_confirm;

  const reset = () => {
    setF(initialForm);
    setStep(1);
    setSelectedType(null);
    setDone(false);
    setErr('');
  };

  const submit = async () => {
    if (!selectedType) return;
    if (!isAgeValid) { setErr('يجب أن يكون عمرك 18 سنة على الأقل.'); return; }
    if (!discordIdOk) { setErr('يرجى إدخال معرّف Discord صحيح (17–20 رقم).'); return; }
    const cfg = appTypes.find(t => t.type === selectedType);
    setLoading(true); setErr('');
    try {
      await sendWebhook(cfg?.label || selectedType, f);

      if (selectedType === 'whitelist' && f.discord_id) {
        fetch(`http://31.58.58.206:3000/give-role?userId=${f.discord_id}&roleId=${WHITELIST_ROLE}`).catch(() => {});
      } else if (cfg?.roleId && f.discord_id) {
        fetch(`http://31.58.58.206:3000/give-role?userId=${f.discord_id}&roleId=${cfg.roleId}`).catch(() => {});
      }

      setDone(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'حدث خطأ، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md fade-up">
        <div className="relative mx-auto mb-8">
          <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-3">تم إرسال طلبك بنجاح!</h2>
        <p className="text-[var(--text-2)] text-sm leading-relaxed mb-2">
          تم استلام طلبك وسيتم مراجعته من قبل الإدارة.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand-dim)] border border-[var(--brand-border)] mb-8">
          <Clock className="w-4 h-4 text-[var(--brand)]" />
          <span className="text-[var(--brand)] text-sm font-medium">موعد الرد المتوقع: 24–48 ساعة</span>
        </div>
        <p className="text-[var(--text-3)] text-xs mb-8">
          ستتلقى إشعار على Discord عند قبول أو رفض الطلب.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('home')} className="btn-ghost btn-sm">الرئيسية</button>
          <button onClick={reset} className="btn-primary btn-sm">تقديم آخر</button>
        </div>
      </div>
    </div>
  );

  if (!selectedType) return (
    <div className="pt-16 overflow-x-hidden">
      <section className="relative px-5 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="glow-orb w-[340px] h-[340px] bg-[#E07B20]/[0.06] -top-16 -right-20" />
        <div className="glow-orb w-[280px] h-[280px] bg-[#3B82F6]/[0.05] top-10 -left-16" />
        <div className="relative max-w-3xl mx-auto">
          <div className="max-w-2xl fade-up">
            <span className="section-label">التقديمات</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-1)] leading-[1.1] mb-4 font-heading">
              قدّم <span className="text-grad">طلبك</span>
            </h1>
            <p className="text-[var(--text-2)] text-[15px] leading-[1.8] max-w-lg">
              اختر نوع التقديم المناسب لك واملأ البيانات المطلوبة. يتم المراجعة خلال 24–48 ساعة.
            </p>
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-16">
        <div className="max-w-3xl mx-auto">
          {appTypes.length === 0 ? (
            <div className="card p-16 text-center fade-up">
              <BookOpen className="w-12 h-12 text-[var(--text-3)]/30 mx-auto mb-4" />
              <p className="text-[var(--text-3)] text-sm">لا توجد تقديمات متاحة حالياً.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appTypes.map(({ type, label, icon: Icon, color, desc }, i) => (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setStep(1); setF(initialForm); }}
                  className={`w-full card p-6 text-right group fade-up transition-all duration-300 hover:!border-[var(--brand-border)] cursor-pointer`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                      <Icon className="w-7 h-7" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--text-1)] text-lg mb-1">{label}</h3>
                      <p className="text-[var(--text-2)] text-sm leading-relaxed">{desc}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)]">
                          <User className="w-3.5 h-3.5" />
                          <span>يتطلب Discord ID</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)]">
                          <Shield className="w-3.5 h-3.5" />
                          <span>18+ سنة</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:bg-[var(--brand)]/10 group-hover:border-[var(--brand-border)] transition-all duration-300">
                      <ChevronLeft className="w-5 h-5 text-[var(--text-3)] group-hover:text-[var(--brand)] transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const currentType = appTypes.find(t => t.type === selectedType)!;

  return (
    <div className="pt-16 overflow-x-hidden">
      <section className="relative px-5 pt-16 pb-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <button onClick={() => { setSelectedType(null); setStep(1); }} className="flex items-center gap-2 text-sm text-[var(--text-3)] hover:text-[var(--brand)] transition-colors mb-6 group">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> العودة للقائمة
          </button>
          <div className="flex items-center gap-4 mb-2 fade-up">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${currentType.color}12`, border: `1px solid ${currentType.color}25` }}>
              <currentType.icon className="w-6 h-6" style={{ color: currentType.color }} />
            </div>
            <div>
              <span className="section-label">طلب {currentType.label}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-1)]">{currentType.label}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Steps */}
          <div className="flex items-center gap-4 mb-8 fade-up">
            {[{ n: 1, label: 'بياناتك', Icon: User }, { n: 2, label: 'التفاصيل', Icon: FileText }].map(({ n, label, Icon }, i) => (
              <div key={n} className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    step > n ? 'bg-green-500/15 text-green-400 border border-green-500/25' : step === n ? 'text-white border border-[var(--brand-border)]' : 'bg-[var(--surface-3)] text-[var(--text-3)] border border-white/8'
                  }`} style={step === n ? { background: 'var(--brand-dim)', color: 'var(--brand)' } : {}}>
                    {step > n ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                  </div>
                  <div>
                    <span className={`text-sm font-semibold ${step >= n ? 'text-[var(--text-1)]' : 'text-[var(--text-3)]'}`}>{label}</span>
                    {step === n && <div className="text-[10px] text-[var(--brand)] font-medium">الخطوة الحالية</div>}
                  </div>
                </div>
                {i < 1 && <div className={`h-0.5 w-12 rounded-full transition-colors ${step > 1 ? 'bg-green-500' : 'bg-white/8'}`} />}
              </div>
            ))}
          </div>

          {/* Not logged in */}
          {/* Requirements */}
          {currentType.requirements.length > 0 && (
            <div className="card p-5 mb-6 fade-up">
              <h3 className="text-sm font-bold text-[var(--text-1)] mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-[var(--brand)]" />
                المتطلبات
              </h3>
              <div className="space-y-2.5">
                {currentType.requirements.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02]">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${currentType.color}12`, color: currentType.color }}>
                      <span className="text-[11px] font-bold">{i + 1}</span>
                    </div>
                    <span className="text-[var(--text-2)] text-sm leading-relaxed">{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form card */}
          <div className="card overflow-hidden fade-up">
            {step === 1 && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-dim)] flex items-center justify-center">
                    <User className="w-5 h-5 text-[var(--brand)]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[var(--text-1)]">بياناتك الشخصية</h2>
                    <p className="text-[var(--text-3)] text-xs">أدخل بياناتك الحقيقية</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-2)] mb-2">معرّف Discord (ID) <span className="text-red-400">*</span></label>
                    <input
                      dir="ltr"
                      name="discord_id"
                      value={f.discord_id}
                      onChange={ch}
                      placeholder="مثال: 123456789012345678"
                      className="input py-3 text-left"
                    />
                    <div className={`mt-2 p-3 rounded-xl text-sm flex items-start gap-2 ${discordIdOk ? 'bg-green-500/8 border border-green-500/15 text-green-400' : 'bg-white/[0.02] border border-white/[0.06] text-[var(--text-3)]'}`}>
                      {discordIdOk ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--brand)]" />}
                      <span className="leading-relaxed">كيف تجد الـ ID: افتح Discord ← الإعدادات ← متقدم (Advanced) ← فعّل وضع المطوّر (Developer Mode)، ثم اضغط كليك يمين على اسمك وانسخ المعرّف.</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-2)] mb-2">الاسم الحقيقي <span className="text-red-400">*</span></label>
                    <input
                      name="real_name"
                      value={f.real_name}
                      onChange={ch}
                      placeholder="أدخل اسمك الكامل"
                      className="input py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-2)] mb-2">تاريخ الميلاد <span className="text-red-400">*</span></label>
                    <input
                      type="date"
                      name="birth_date"
                      value={f.birth_date}
                      onChange={ch}
                      max={new Date().toISOString().split('T')[0]}
                      className="input py-3"
                    />
                    {f.birth_date && (
                      <div className={`mt-2 p-3 rounded-xl text-sm flex items-center gap-2 ${isAgeValid ? 'bg-green-500/8 border border-green-500/15 text-green-400' : 'bg-red-500/8 border border-red-500/15 text-red-400'}`}>
                        {isAgeValid ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                        <span>العمر: <strong>{calculatedAge} سنة</strong> {!isAgeValid && '— الحد الأدنى 18 سنة'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button onClick={() => setStep(2)} disabled={!s1ok}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                    s1ok
                      ? 'bg-[var(--brand)] text-white hover:shadow-[0_4px_20px_rgba(224,123,32,0.25)] hover:-translate-y-0.5'
                      : 'bg-white/[0.04] text-[var(--text-3)] cursor-not-allowed'
                  }`}>
                  التالي <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-dim)] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--brand)]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[var(--text-1)]">تفاصيل التقديم</h2>
                    <p className="text-[var(--text-3)] text-xs">أكمل بيانات شخصيتك</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentType.questions.filter(q => q.id !== 'experience').map(q => (
                    <div key={q.id}>
                      <label className="block text-sm font-semibold text-[var(--text-2)] mb-2">
                        {q.label} {q.required && <span className="text-red-400">*</span>}
                      </label>
                      {q.type === 'textarea' ? (
                        <textarea
                          name={q.id}
                          value={(f as unknown as Record<string, string>)[q.id] || ''}
                          onChange={ch}
                          rows={q.id === 'character_story' ? 6 : 4}
                          placeholder={q.placeholder}
                          className="input resize-none leading-relaxed py-3"
                        />
                      ) : (
                        <input
                          name={q.id}
                          value={(f as unknown as Record<string, string>)[q.id] || ''}
                          onChange={ch}
                          placeholder={q.placeholder}
                          className="input py-3"
                        />
                      )}
                      {q.id === 'character_story' && (
                        <div className={`text-xs mt-2 flex items-center gap-2 ${(f.character_story || '').length >= 150 ? 'text-green-400' : 'text-[var(--text-3)]'}`}>
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{(f.character_story || '').length} / 150 حرف كحد أدنى</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                    <input type="checkbox" name="age_confirm" checked={f.age_confirm} onChange={ch} className="mt-1 accent-[var(--brand)] w-4 h-4" />
                    <span className="text-[var(--text-2)] text-sm leading-relaxed">
                      أؤكد أنني <strong className="text-[var(--text-1)]">18 سنة أو أكثر</strong> وأتحمل المسؤولية الكاملة عن معلوماتي.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                    <input type="checkbox" name="rules_ok" checked={f.rules_ok} onChange={ch} className="mt-1 accent-[var(--brand)] w-4 h-4" />
                    <span className="text-[var(--text-2)] text-sm leading-relaxed">
                      قرأت وأوافق على{' '}
                      <button type="button" onClick={() => navigate('rules')} className="text-[var(--brand)] hover:underline font-bold">قوانين السيرفر</button>
                      {' '}وأتعهد بالالتزام بها.
                    </span>
                  </label>
                </div>

                {err && (
                  <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/15 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-red-400 text-sm">{err}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[var(--text-2)] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-[var(--text-1)] transition-all duration-300">
                    <ChevronRight className="w-4 h-4" /> رجوع
                  </button>
                  <button onClick={submit} disabled={!s2ok || loading}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      s2ok && !loading
                        ? 'bg-[var(--brand)] text-white hover:shadow-[0_4px_20px_rgba(224,123,32,0.25)] hover:-translate-y-0.5'
                        : 'bg-white/[0.04] text-[var(--text-3)] cursor-not-allowed'
                    }`}>
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري الإرسال...</>
                    ) : (
                      <><Send className="w-4 h-4" /> إرسال الطلب</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
