import { useState, useMemo, useEffect } from 'react';
import { Star, Car, Home, Coins, Zap, ShoppingBag, Gift, Check, Search, Shield, Clock, Sparkles, X, SlidersHorizontal, Tag, Loader2, Hash, MessageCircle, ArrowLeft, CreditCard, ChevronDown, Crown, TrendingUp, Briefcase, Package, Users, Trophy, AlertTriangle, Award, Video, Eye, Wrench } from 'lucide-react';
import type { Page } from '../types';
import { getStore, type StoreCategory, type StoreProduct } from '../lib/store';

const STORE_WEBHOOK = 'https://discord.com/api/webhooks/1527431383340023839/be9_A-GwaPIHVJlb2a8VS5IPqnRWPAv3zJ95iKdABjtrZ8AdvgQXz2Bz2agZ70uA3qh3';

type StoreItem = {
  name: string;
  price: number;
  popular?: boolean;
  image: string;
  features: string[];
  badge?: string;
};

type Category = {
  id: string;
  title: string;
  icon: typeof Star;
  color: string;
  items: StoreItem[];
};

const ICON_MAP: Record<string, typeof Star> = { Star, Trophy, Shield, Users, Zap, Video, Award, Coins, Package, Crown, Heart: Award, Home, Car, Briefcase, Clock, AlertTriangle, Eye, Wrench };

function mapStoreCategories(raw: StoreCategory[]): Category[] {
  return raw.map(c => ({
    id: c.id,
    title: c.title,
    icon: ICON_MAP[c.icon] || Package,
    color: c.color,
    items: c.items.map(i => ({ name: i.name, price: i.price, popular: i.popular, image: i.image, features: i.features })),
  }));
}

const trustBadges = [
  { icon: Shield, label: 'دفع آمن', sub: 'حماية Tebex' },
  { icon: Zap, label: 'تفعيل فوري', sub: 'تلقائي بعد الدفع' },
  { icon: Clock, label: 'دعم 24/7', sub: 'فريق متواجد دائماً' },
  { icon: Gift, label: 'جوائز حصرية', sub: 'مزايا لا تُنسى' },
];

const paymentMethods = [
  { id: 'visa', label: 'فيزا', sub: 'Visa Card', icon: CreditCard, color: '#3B82F6' },
  { id: 'paypal', label: 'باي بال', sub: 'PayPal', icon: CreditCard, color: '#0070BA' },
  { id: 'instapay', label: 'انستا باي', sub: 'InstaPay', icon: CreditCard, color: '#9333EA' },
  { id: 'vodafone_cash', label: 'فودافون كاش', sub: 'Vodafone Cash', icon: CreditCard, color: '#E60000' },
] as const;

type CheckoutItem = {
  name: string;
  price: number;
  category?: string;
  color: string;
};

type OrderResult = {
  orderNumber: string;
  productName: string;
  playerName: string;
  playerDiscordId: string;
  paymentMethod: string;
};

export default function StorePage({ navigate }: { navigate?: (p: Page) => void }) {
  const [activeCat, setActiveCat] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [categories, setCategories] = useState<Category[]>(() => mapStoreCategories(getStore()));

  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerDiscordId, setPlayerDiscordId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCategories(mapStoreCategories(getStore()));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = categories.find((c) => c.id === activeCat) || null;
  const CurrentIcon = current?.icon;

  const allItems = useMemo(() => {
    return categories.flatMap((c) => c.items.map((i) => ({ ...i, catId: c.id, catTitle: c.title, color: c.color })));
  }, []);

  const results = useMemo(() => {
    let list = activeCat === 'all' ? allItems : allItems.filter((i) => i.catId === activeCat);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.features.some((f) => f.toLowerCase().includes(q)) ||
          i.catTitle.toLowerCase().includes(q),
      );
    }

    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

    return list;
  }, [activeCat, query, sortBy, allItems]);

  const openCheckout = (item: { name: string; price: number; catTitle?: string; color: string }) => {
    setCheckoutItem({ name: item.name, price: item.price, category: item.catTitle, color: item.color });
    setPlayerName('');
    setPlayerDiscordId('');
    setPaymentMethod('');
    setSubmitError('');
    setOrderResult(null);
  };

  const closeCheckout = () => {
    setCheckoutItem(null);
    setOrderResult(null);
  };

  const handleSubmit = async () => {
    if (!checkoutItem) return;
    setSubmitError('');

    if (!playerName.trim()) { setSubmitError('يرجى إدخال اسم اللاعب'); return; }
    if (!playerDiscordId.trim()) { setSubmitError('يرجى إدخال ايدي ديسكورد اللاعب'); return; }
    if (!paymentMethod) { setSubmitError('يرجى اختيار طريقة الدفع'); return; }

    setSubmitting(true);

    try {
      const orderNumber = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const paymentLabel = paymentMethods.find((p) => p.id === paymentMethod)?.label || paymentMethod;

      await fetch(STORE_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'ULG CFW | متجر',
          avatar_url: 'https://ui-avatars.com/api/?name=ULG+Store&background=E07B20&color=fff',
          embeds: [{
            title: `🛒 طلب جديد — ${orderNumber}`,
            color: 0xe07b20,
            fields: [
              { name: '📦 المنتج', value: `**${checkoutItem.name}**`, inline: true },
              { name: '📂 القسم', value: checkoutItem.category || 'غير محدد', inline: true },
              { name: '💰 السعر', value: `**$${checkoutItem.price}**`, inline: true },
              { name: '🎮 اسم اللاعب', value: playerName.trim(), inline: true },
              { name: '🔑 ايدي ديسكورد اللاعب', value: `\`${playerDiscordId.trim()}\``, inline: true },
              { name: '👤 مقدم الطلب', value: playerDiscordId ? `<@${playerDiscordId}> (\`${playerDiscordId}\`)` : 'غير محدد', inline: true },
              { name: '💳 طريقة الدفع', value: paymentLabel, inline: true },
              { name: '⏱️ التوقيت', value: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }), inline: false },
              { name: '✅ الحالة', value: '`قيد المراجعة`', inline: true },
            ],
            footer: { text: 'ULG CFW • نظام المتجر' },
          }],
        }),
      });

      setOrderResult({
        orderNumber,
        productName: checkoutItem.name,
        playerName: playerName.trim(),
        playerDiscordId: playerDiscordId.trim(),
        paymentMethod,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 overflow-x-hidden">
      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative px-5 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
        <div className="glow-orb w-[500px] h-[500px] bg-[#E07B20]/[0.05] -top-40 -right-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#F59E0B]/[0.04] top-0 -left-32" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-2xl fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-dim)] border border-[var(--border-brand)] text-[var(--brand)] text-[10px] font-bold mb-5 uppercase tracking-wider">
              <Crown className="w-3 h-3" />
              ULG CFW Store
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-1)] leading-[1.1] mb-4 font-heading">
              متجر <span className="text-grad">ULG CFW</span>
            </h1>
            <p className="text-[var(--text-2)] text-base leading-relaxed max-w-lg">
              ارفع مستوى تجربتك داخل السيرفر بالحزم والمزايا الحصرية. تفعيل فوري ودفع آمن.
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up delay-1">
            {trustBadges.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="group p-4 rounded-2xl bg-[var(--surface)] border border-white/[0.04] hover:border-[var(--brand)]/15 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-dim)] border border-[var(--border-brand)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-[var(--brand)]" />
                  </div>
                  <div className="text-sm font-bold text-[var(--text-1)]">{t.label}</div>
                  <div className="text-[11px] text-[var(--text-3)] mt-0.5">{t.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════ STORE ════════════════════════ */}
      <section className="relative px-5 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Tebex notice */}
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-l from-[#5865F2]/8 to-transparent border border-[#5865F2]/10 flex items-center gap-4 fade-up">
            <div className="w-12 h-12 rounded-xl bg-[#5865F2]/12 border border-[#5865F2]/15 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-[#5865F2]" />
            </div>
            <div>
              <div className="font-bold text-[var(--text-1)] text-sm">معالجة الدفع عبر Tebex</div>
              <p className="text-[var(--text-2)] text-xs mt-1 leading-relaxed">جميع المدفوعات تتم بأمان عبر Tebex. يُفعّل المنتج تلقائياً فور الدفع.</p>
            </div>
          </div>

          {/* Search + sort bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3 fade-up delay-1">
            <div className="relative flex-1 group">
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[var(--brand-dim)] flex items-center justify-center shrink-0 pointer-events-none group-focus-within:bg-[var(--brand)]/15 transition-colors">
                <Search className="w-4 h-4 text-[var(--brand)]" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن منتج، ميزة، أو قسم..."
                className="w-full bg-[var(--surface-2)] border border-white/[0.04] rounded-2xl pr-14 pl-10 py-3.5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none transition-all duration-300 focus:border-[var(--brand-border)] focus:shadow-[0_0_0_3px_var(--brand-dim)]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-hover)] transition-colors"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative group">
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <SlidersHorizontal className="w-4 h-4 text-[var(--text-3)] group-hover:text-[var(--brand)] transition-colors" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full sm:w-auto appearance-none bg-[var(--surface-2)] border border-white/[0.04] rounded-2xl pr-11 pl-8 py-3.5 text-sm text-[var(--text-1)] outline-none cursor-pointer transition-all duration-300 hover:border-white/[0.08] focus:border-[var(--brand-border)] min-w-[170px]"
              >
                <option value="featured">الأكثر رواجاً</option>
                <option value="price-asc">السعر: الأقل أولاً</option>
                <option value="price-desc">السعر: الأعلى أولاً</option>
              </select>
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-[var(--text-3)]" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[220px_1fr] gap-8 fade-up delay-2">
            {/* Sidebar */}
            <aside className="space-y-1.5">
              <div className="text-[var(--text-3)] text-[10px] font-bold uppercase tracking-wider px-3 mb-2">الأقسام</div>
              <button
                onClick={() => setActiveCat('all')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCat === 'all'
                    ? 'bg-[var(--surface-2)] text-[var(--text-1)] border border-white/[0.06] shadow-sm'
                    : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--brand-dim)]">
                  <Sparkles className="w-4 h-4 text-[var(--brand)]" />
                </div>
                <span className="flex-1 text-right">الكل</span>
                <span className="text-[10px] text-[var(--text-3)] font-bold bg-white/[0.04] px-2 py-0.5 rounded-md">{allItems.length}</span>
              </button>

              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[var(--surface-2)] text-[var(--text-1)] border border-white/[0.06] shadow-sm'
                      : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.02] border border-transparent'
                  }`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cat.color}10` }}>
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <span className="flex-1 text-right">{cat.title}</span>
                    <span className="text-[10px] text-[var(--text-3)] font-bold bg-white/[0.04] px-2 py-0.5 rounded-md">{cat.items.length}</span>
                  </button>
                );
              })}
            </aside>

            {/* Products */}
            <div>
              {/* Section title */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {current ? (
                    <>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${current.color}10`, border: `1px solid ${current.color}20` }}>
                        <CurrentIcon className="w-5 h-5" style={{ color: current.color }} />
                      </div>
                      <div>
                        <h2 className="font-bold text-[var(--text-1)] text-lg">{current.title}</h2>
                        <p className="text-[var(--text-3)] text-[11px] mt-0.5">{results.length} منتج متاح</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--brand-dim)] border border-[var(--border-brand)]">
                        <Sparkles className="w-5 h-5 text-[var(--brand)]" />
                      </div>
                      <div>
                        <h2 className="font-bold text-[var(--text-1)] text-lg">جميع المنتجات</h2>
                        <p className="text-[var(--text-3)] text-[11px] mt-0.5">{results.length} منتج متاح</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {results.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[var(--surface)] border border-white/[0.04]">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-[var(--text-3)]" />
                  </div>
                  <p className="text-[var(--text-2)] text-sm mb-1">لا توجد نتائج مطابقة لبحثك.</p>
                  <button onClick={() => { setQuery(''); setActiveCat('all'); }} className="text-xs text-[var(--brand)] font-bold hover:underline mt-2">
                    إعادة ضبط البحث
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.map((item) => {
                    const color = item.color;
                    return (
                      <div
                        key={item.name}
                        className="group relative flex flex-col rounded-2xl bg-[var(--surface)] border border-white/[0.04] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[var(--brand-border)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5),0_0_0_1px_var(--border-brand)]"
                      >
                        {/* Popular glow */}
                        {item.popular && (
                          <>
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#F59E0B]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent" />
                          </>
                        )}

                        {/* Image */}
                        <div className="relative h-52 overflow-hidden bg-[var(--bg-2)]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/40 via-transparent to-transparent" />

                          {/* Badges top */}
                          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                            {item.popular && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-l from-[#F59E0B] to-[#E07B20] text-white text-[10px] font-bold rounded-lg shadow-lg shadow-[#F59E0B]/30">
                                <TrendingUp className="w-3 h-3" />
                                الأكثر مبيعاً
                              </div>
                            )}
                          </div>

                          {/* Price badge floating */}
                          <div className="absolute bottom-3 left-3 z-10">
                            <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                              <span className="text-xl font-extrabold" style={{ color }}>${item.price}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          {/* Product name */}
                          <h3 className="font-bold text-[var(--text-1)] text-base leading-snug mb-4">{item.name}</h3>

                          {/* Features */}
                          <ul className="space-y-2.5 mb-6 flex-1">
                            {item.features.map((feat) => (
                              <li key={feat} className="flex items-center gap-2.5">
                                <div
                                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                  style={{ background: `${color}10` }}
                                >
                                  <Check className="w-3 h-3" style={{ color }} strokeWidth={3} />
                                </div>
                                <span className="text-[13px] text-[var(--text-2)]">{feat}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Buy button */}
                          <button
                            onClick={() => openCheckout(item)}
                            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97] relative overflow-hidden"
                            style={
                              item.popular
                                ? {
                                    background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                                    color: '#fff',
                                    boxShadow: `0 8px 24px ${color}30`,
                                  }
                                : {
                                    background: `${color}0a`,
                                    color,
                                    border: `1px solid ${color}15`,
                                  }
                            }
                          >
                            <ShoppingBag className="w-4 h-4" />
                            اشتري الآن — ${item.price}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Payment methods footer */}
          <div className="mt-12 pt-8 border-t border-white/[0.04]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[var(--text-3)] text-xs">
                <Tag className="w-3.5 h-3.5" />
                <span>طرق دفع متعددة: فيزا، PayPal، InstaPay، فودافون كاش</span>
              </div>
              <p className="text-[var(--text-3)] text-xs text-center sm:text-left">
                * المنتجات للاستخدام داخل السيرفر فقط. لا استرداد إلا في حالات الأعطال التقنية المثبتة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ CHECKOUT MODAL ════════════════════════ */}
      {checkoutItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={closeCheckout}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-white/[0.06] shadow-2xl"
            style={{ animation: 'fadeUp 0.3s var(--ease-out-expo) both' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeCheckout}
              className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {orderResult ? (
              /* ── ORDER CONFIRMATION ── */
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-5 shadow-lg shadow-[#10B981]/30">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>

                <h3 className="text-xl font-extrabold text-[var(--text-1)] mb-2">تم استلام طلبك بنجاح!</h3>
                <p className="text-[var(--text-2)] text-sm mb-6">احفظ رقم الطلب التالي واتبع الخطوات لإتمام العملية.</p>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--brand-dim)] to-[var(--surface-2)] border border-[var(--border-brand)] mb-6">
                  <div className="text-[var(--text-3)] text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    رقم الطلب الخاص بك
                  </div>
                  <div className="text-3xl font-extrabold text-grad tracking-wider font-display">
                    {orderResult.orderNumber}
                  </div>
                </div>

                <div className="text-right space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-2)] border border-white/[0.04]">
                    <div className="w-7 h-7 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                    <p className="text-sm text-[var(--text-2)] leading-relaxed pt-0.5">
                      توجه الى الديسكورد روم التذاكر قسم <span className="text-[var(--brand)] font-bold">تذكرة موقع</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-2)] border border-white/[0.04]">
                    <div className="w-7 h-7 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
                    <p className="text-sm text-[var(--text-2)] leading-relaxed pt-0.5">
                      اكتب رقم الطلب الخاص بك <span className="text-[var(--text-1)] font-bold">{orderResult.orderNumber}</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-2)] border border-white/[0.04]">
                    <div className="w-7 h-7 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
                    <p className="text-sm text-[var(--text-2)] leading-relaxed pt-0.5">
                      سيتم التواصل معك من قبل الفريق الفني
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-2)] border border-white/[0.04] text-right space-y-2.5 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-3)]">المنتج</span>
                    <span className="text-[var(--text-1)] font-semibold">{orderResult.productName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-3)]">اسم اللاعب</span>
                    <span className="text-[var(--text-1)] font-semibold">{orderResult.playerName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-3)]">طريقة الدفع</span>
                    <span className="text-[var(--text-1)] font-semibold">{paymentMethods.find((p) => p.id === orderResult.paymentMethod)?.label}</span>
                  </div>
                </div>

                <a
                  href="https://discord.gg/gM6FaEMF2B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-angular w-full justify-center group"
                >
                  <MessageCircle className="w-4 h-4" />
                  الذهاب إلى ديسكورد
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </a>

                <button
                  onClick={closeCheckout}
                  className="w-full mt-3 py-2.5 text-sm text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors font-medium"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              /* ── CHECKOUT FORM ── */
              <div className="p-8">
                <div className="mb-6">
                  <span className="section-label">إتمام الطلب</span>
                  <h3 className="text-xl font-extrabold text-[var(--text-1)] mt-1">تأكيد عملية الشراء</h3>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-2)] border border-white/[0.04] mb-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${checkoutItem.color}10`, border: `1px solid ${checkoutItem.color}20` }}>
                    <ShoppingBag className="w-5 h-5" style={{ color: checkoutItem.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[var(--text-1)] text-sm truncate">{checkoutItem.name}</div>
                    {checkoutItem.category && <div className="text-[var(--text-3)] text-xs">{checkoutItem.category}</div>}
                  </div>
                  <div className="text-left shrink-0">
                            <div className="text-xl font-extrabold" style={{ color: checkoutItem.color }}>${checkoutItem.price}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-2)] mb-2">اسم اللاعب</label>
                    <input
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="أدخل اسم اللاعب داخل السيرفر"
                      className="input py-3 text-sm"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-2)] mb-2">ايدي ديسكورد اللاعب</label>
                    <input
                      value={playerDiscordId}
                      onChange={(e) => setPlayerDiscordId(e.target.value)}
                      placeholder="مثال: 987654321012345678"
                      className="input py-3 text-sm"
                      disabled={submitting}
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-2)] mb-2">طريقة الدفع</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {paymentMethods.map((pm) => {
                        const Icon = pm.icon;
                        const selected = paymentMethod === pm.id;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => setPaymentMethod(pm.id)}
                            disabled={submitting}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-right ${
                              selected
                                ? 'bg-[var(--surface-2)]'
                                : 'bg-transparent border-white/[0.04] hover:bg-white/[0.02]'
                            }`}
                            style={selected ? { borderColor: pm.color, boxShadow: `0 0 0 1px ${pm.color}` } : {}}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${pm.color}10`, border: `1px solid ${pm.color}20` }}>
                              <Icon className="w-4 h-4" style={{ color: pm.color }} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[var(--text-1)] truncate">{pm.label}</div>
                              <div className="text-[10px] text-[var(--text-3)] truncate">{pm.sub}</div>
                            </div>
                            {selected && (
                              <Check className="w-4 h-4 mr-auto shrink-0" style={{ color: pm.color }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-medium text-center">
                    {submitError}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-angular w-full justify-center mt-6 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      تأكيد الطلب — ${checkoutItem.price}
                    </>
                  )}
                </button>

                <p className="text-center text-[var(--text-3)] text-[10px] mt-3 leading-relaxed">
                  بالضغط على تأكيد الطلب، يتم إرسال بياناتك إلى فريق المتجر عبر ديسكورد.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
