export interface Creator {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  verified: boolean;
  platforms: { name: string; url: string }[];
}

export interface LeaderboardEntry {
  r: number;
  name: string;
  val: number;
  avatar: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  icon: string;
  color: string;
  unit: string;
  data: LeaderboardEntry[];
}

const defaultCreators: Creator[] = [
  {
    name: 'Abu Gabaal',
    handle: '@luffyelmasry',
    bio: 'صانع محتوى موثّق — بثوث حصرية من داخل ULG CFW على Kick و Twitch و YouTube.',
    avatar: 'https://a.top4top.io/p_3849ne4pe1.png',
    verified: true,
    platforms: [
      { name: 'Kick', url: 'https://kick.com/luffy-elmasry' },
      { name: 'Twitch', url: 'https://www.twitch.tv/luffyelmasry' },
      { name: 'YouTube', url: 'https://www.youtube.com/@abugabaaal' },
    ],
  },
];

const defaultLeaderboards: Leaderboard[] = [
  { id: 'rich', title: 'أغنى اللاعبين', icon: 'Trophy', color: '#F59E0B', unit: 'ريال', data: [
    { r: 1, name: 'Khalid_Almighty', val: 4850000, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=120&h=120&fit=crop' },
    { r: 2, name: 'BusinessKing', val: 3120000, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=120&h=120&fit=crop' },
    { r: 3, name: 'GoldHunter', val: 2340500, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=120&h=120&fit=crop' },
    { r: 4, name: 'RichPlayer', val: 1980000, avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=120&h=120&fit=crop' },
    { r: 5, name: 'MoneyMaker', val: 1450000, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=120&h=120&fit=crop' },
  ]},
  { id: 'hours', title: 'أكثر ساعات لعب', icon: 'Clock', color: '#3B82F6', unit: 'ساعة', data: [
    { r: 1, name: 'NeverSleeps', val: 1240, avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?w=120&h=120&fit=crop' },
    { r: 2, name: 'AlwaysOnline', val: 980, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=120&h=120&fit=crop' },
    { r: 3, name: 'DayNightPlayer', val: 875, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=120&h=120&fit=crop' },
    { r: 4, name: 'LifeInULG', val: 742, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=120&h=120&fit=crop' },
    { r: 5, name: 'RPAddict', val: 698, avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=120&h=120&fit=crop' },
  ]},
  { id: 'police', title: 'أفضل الشرطة', icon: 'Shield', color: '#6366F1', unit: 'اعتقال', data: [
    { r: 1, name: 'Chief_Hassan', val: 342, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=120&h=120&fit=crop' },
    { r: 2, name: 'Officer_Nader', val: 287, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=120&h=120&fit=crop' },
    { r: 3, name: 'Detective_Ali', val: 251, avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?w=120&h=120&fit=crop' },
    { r: 4, name: 'Sergeant_Omar', val: 198, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=120&h=120&fit=crop' },
    { r: 5, name: 'Patrol_Saad', val: 156, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=120&h=120&fit=crop' },
  ]},
  { id: 'gangs', title: 'أفضل العصابات', icon: 'Users', color: '#EF4444', unit: 'نقطة', data: [
    { r: 1, name: 'BlackEagle Gang', val: 520, avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=120&h=120&fit=crop' },
    { r: 2, name: 'Desert Wolves', val: 445, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=120&h=120&fit=crop' },
    { r: 3, name: 'Shadow Crew', val: 389, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=120&h=120&fit=crop' },
    { r: 4, name: 'Kings Mafia', val: 312, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=120&h=120&fit=crop' },
    { r: 5, name: 'Urban Brothers', val: 278, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=120&h=120&fit=crop' },
  ]},
  { id: 'creators', title: 'أفضل صناع محتوى', icon: 'Video', color: '#EC4899', unit: 'مشاهد', data: [
    { r: 1, name: 'Abu Gabaal', val: 24500, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=120&h=120&fit=crop' },
    { r: 2, name: 'Alpha_RP', val: 18200, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=120&h=120&fit=crop' },
    { r: 3, name: 'King_Roleplay', val: 14500, avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?w=120&h=120&fit=crop' },
    { r: 4, name: 'Desert_Storm', val: 9800, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=120&h=120&fit=crop' },
    { r: 5, name: 'Luna_Games', val: 7200, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=120&h=120&fit=crop' },
  ]},
  { id: 'wanted', title: 'أكثر المطلوبين', icon: 'AlertTriangle', color: '#F97316', unit: 'ريال', data: [
    { r: 1, name: 'Ghost_Criminal', val: 85000, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=120&h=120&fit=crop' },
    { r: 2, name: 'Heist_Master', val: 72000, avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?w=120&h=120&fit=crop' },
    { r: 3, name: 'DarkRob', val: 61500, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=120&h=120&fit=crop' },
    { r: 4, name: 'Underworld', val: 48000, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=120&h=120&fit=crop' },
    { r: 5, name: 'NightRider', val: 35000, avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=120&h=120&fit=crop' },
  ]},
  { id: 'arena', title: 'أفضل Arena', icon: 'Zap', color: '#10B981', unit: 'انتصار', data: [
    { r: 1, name: 'Arena_Legend', val: 2450, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=120&h=120&fit=crop' },
    { r: 2, name: 'FightClub_King', val: 2100, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=120&h=120&fit=crop' },
    { r: 3, name: 'Warrior_Pro', val: 1875, avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?w=120&h=120&fit=crop' },
    { r: 4, name: 'Chaos_Bringer', val: 1654, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=120&h=120&fit=crop' },
    { r: 5, name: 'BladeRunner', val: 1421, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=120&h=120&fit=crop' },
  ]},
];

export function getCreators(): Creator[] { return defaultCreators; }
export function saveCreators(_creators: Creator[]) {}
export function addCreator(creator: Creator) { defaultCreators.push(creator); return defaultCreators; }
export function removeCreator(name: string) { return defaultCreators.filter((c) => c.name !== name); }

export function getLeaderboards(): Leaderboard[] { return defaultLeaderboards; }
export function saveLeaderboards(_boards: Leaderboard[]) {}
export function updateLeaderboardEntry(boardId: string, entry: LeaderboardEntry) {
  const board = defaultLeaderboards.find((b) => b.id === boardId);
  if (board) {
    const idx = board.data.findIndex((e) => e.r === entry.r);
    if (idx >= 0) board.data[idx] = entry;
    else board.data.push(entry);
    board.data.sort((a, b) => b.val - a.val);
    board.data.forEach((e, i) => (e.r = i + 1));
  }
  return defaultLeaderboards;
}
export function removeLeaderboardEntry(boardId: string, rank: number) {
  const board = defaultLeaderboards.find((b) => b.id === boardId);
  if (board) {
    board.data = board.data.filter((e) => e.r !== rank);
    board.data.sort((a, b) => b.val - a.val);
    board.data.forEach((e, i) => (e.r = i + 1));
  }
  return defaultLeaderboards;
}
export function addLeaderboard(board: Leaderboard) { defaultLeaderboards.push(board); return defaultLeaderboards; }
export function removeLeaderboard(id: string) { return defaultLeaderboards.filter((b) => b.id !== id); }
export function updateLeaderboard(id: string, updates: Partial<Leaderboard>) {
  const idx = defaultLeaderboards.findIndex((b) => b.id === id);
  if (idx >= 0) defaultLeaderboards[idx] = { ...defaultLeaderboards[idx], ...updates };
  return defaultLeaderboards;
}

/* ══════════════════════════════════════════════════════════════
   STORE — Categories & Products
   ══════════════════════════════════════════════════════════════ */

export interface StoreProduct {
  name: string;
  price: number;
  popular: boolean;
  image: string;
  features: string[];
}

export interface StoreCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: StoreProduct[];
}

const defaultStore: StoreCategory[] = [
  {
    id: 'vip', title: 'باقات VIP', icon: 'Star', color: '#F59E0B',
    items: [
      { name: 'داعم برونزي', price: 4, popular: false, image: 'https://k.top4top.io/p_3860ht1391.png', features: ['🌱 بداية الدعم', '💵 250,000$ داخل اللعبة', '🎖️ رتبة داعم برونزي في الديسكورد'] },
      { name: 'داعم فضي', price: 7, popular: false, image: 'https://l.top4top.io/p_3860goycq2.png', features: ['⭐ الأكثر قيمة للمبتدئين', '💵 350,000$ داخل اللعبة', '🎖️ رتبة داعم فضي في الديسكورد', '🔫 سلاح بستول', '📦 3 مخازن'] },
      { name: 'داعم ذهبي', price: 10, popular: false, image: 'https://a.top4top.io/p_3860bjc9b3.png', features: ['⚡ ترقية قوية', '💵 600,000$ داخل اللعبة', '🎖️ رتبة داعم ذهبي في الديسكورد', '🔫 سلاح بستول', '📦 6 مخازن'] },
      { name: 'داعم ماسي', price: 14, popular: false, image: 'https://j.top4top.io/p_3860h6k359.png', features: ['💠 أفضل توازن بين السعر والمميزات', '💵 900,000$ داخل اللعبة', '🎖️ رتبة داعم ماسي في الديسكورد', '🔫 سلاح بستول', '📦 10 مخازن', '🚗 سيارة من معرض المواطنين'] },
      { name: 'داعم استراتيجي', price: 18, popular: true, image: 'https://i.top4top.io/p_3860hc61q8.png', features: ['🏆 الأكثر شراءً', '💵 1,500,000$ داخل اللعبة', '🎖️ رتبة داعم استراتيجي في الديسكورد', '🚘 سيارة من معرض المواطنين', '🎁 مكافأة مفاجئة من الإدارة'] },
      { name: 'داعم ماستر', price: 22, popular: false, image: 'https://h.top4top.io/p_386076i2o7.png', features: ['👑 للمميزين', '💵 1,750,000$ داخل اللعبة', '🎖️ رتبة داعم ماستر في الديسكورد', '🔫 نصف رشاش', '🔫 2 بستول', '🚗 سيارة من معرض المواطنين'] },
      { name: 'داعم بريميوم', price: 30, popular: false, image: 'https://g.top4top.io/p_3860f8x036.png', features: ['🔥 للمحترفين', '💵 2,000,000$ داخل اللعبة', '🎖️ رتبة داعم بريميوم في الديسكورد', '🔫 سلاح نصف رشاش', '📦 15 مخزن'] },
      { name: 'داعم بريميوم بلس', price: 39, popular: false, image: 'https://f.top4top.io/p_3860dov1p5.png', features: ['🌟 أقوى باقة دعم', '💵 2,500,000$ داخل اللعبة', '🎖️ رتبة داعم بريميوم بلس في الديسكورد', '🔫 3 أسلحة نصف رشاش', '🏎️ سيارة من المعرض الفخم'] },
    ],
  },
  {
    id: 'cars', title: 'سيارات حصرية', icon: 'Car', color: '#3B82F6',
    items: [
      { name: 'لامبورجيني اورس', price: 15, popular: true, image: 'https://k.top4top.io/p_3860obp1y1.png', features: ['سيارة فاخرة عالمية', 'أداء خارق', 'تصميم مبهر'] },
      { name: 'بي ام دبليو', price: 15, popular: false, image: 'https://l.top4top.io/p_38608s7r52.png', features: ['سيارة أنيقة', 'مزيج من الفخامة والأداء', 'تجربة قيادة مميزة'] },
      { name: 'بي ام دبليو E46 معدل صوت محرك', price: 15, popular: false, image: 'https://a.top4top.io/p_386089igi3.png', features: ['صوت محرك مميز', 'كلاسيك معدل', 'أداء محسّن'] },
      { name: 'جولف معدلة', price: 20, popular: false, image: 'https://b.top4top.io/p_3860o8k114.png', features: ['سيارة خفيفة وسريعة', 'تعديلات احترافية', 'مناسبة للسباقات'] },
      { name: 'بورش GT3 911', price: 30, popular: false, image: 'https://c.top4top.io/p_38606pyeb5.png', features: ['أداء رياضي عالي', 'تصميم أيقوني', 'تجربة سباق حقيقية'] },
      { name: 'رولز رويس', price: 10, popular: false, image: 'https://d.top4top.io/p_38602ppl06.png', features: ['قمة الفخامة', 'راحة لا مثيل لها', 'رقي في كل تفصيلة'] },
      { name: 'دودج رام بسعر مميز', price: 15, popular: true, image: 'https://k.top4top.io/p_3867gcznc1.png', features: ['صوت محرك قوي', 'هيكل مركبة قوي', 'شكل ضخم أسطوري'] },
      { name: 'تيوتا سوبرا', price: 25, popular: false, image: 'https://e.top4top.io/p_3860ffesk7.png', features: ['أيقونة السيارات الرياضية', 'محرك قوي', 'مثالية للتعديل'] },
      { name: 'مرسيدس مايباخ', price: 10, popular: false, image: 'https://b.top4top.io/p_3869vgh1y1.png', features: ['فخامة استثنائية', 'راحة ملكية', 'تصميم فاخر'] },
      { name: 'مرسيدس', price: 30, popular: false, image: 'https://c.top4top.io/p_38692z4zk2.png', features: ['تصميم أنيق', 'أداء فاخر', 'راحة عالية'] },
      { name: 'بوجاتي سوبر فخم', price: 35, popular: false, image: 'https://e.top4top.io/p_3869weqtl4.png', features: ['سرعة خارقة', 'فخامة مطلقة', 'أداء استثنائي'] },
      { name: 'فيراري سوبر فخم', price: 35, popular: false, image: 'https://f.top4top.io/p_3869ernpn5.png', features: ['تصميم أيقوني', 'تسارع مذهل', 'أداء رياضي فاخر'] },
      { name: 'بينتلي سوبر', price: 35, popular: false, image: 'https://g.top4top.io/p_38694vw1w6.png', features: ['فخامة بريطانية', 'راحة استثنائية', 'محرك قوي'] },
      { name: 'دراجة نارية فخمة RGP', price: 15, popular: false, image: 'https://i.top4top.io/p_38690agl72.png', features: ['سرعة عالية', 'تصميم رياضي', 'أداء احترافي'] },
      { name: 'دراجة نارية', price: 10, popular: false, image: 'https://h.top4top.io/p_3869hgrh71.png', features: ['خفيفة وسريعة', 'تحكم ممتاز', 'مثالية للتنقل'] },
    ],
  },
  {
    id: 'business', title: 'بيزنس', icon: 'Briefcase', color: '#8B5CF6',
    items: [
      { name: 'بيزنس معرض سيارات فخم', price: 35, popular: true, image: 'https://e.top4top.io/p_3860qkkwu4.png', features: ['معرض سيارات فاخرة', 'ماركات عالمية', 'أعلى دخل'] },
      { name: 'بيزنس معرض سيارات المواطنيين', price: 28, popular: false, image: 'https://d.top4top.io/p_3860oevmm3.png', features: ['معرض سيارات عام', 'موقف واسع', 'دخل عالي'] },
      { name: 'بيزنس معرض قوارب', price: 25, popular: false, image: 'https://b.top4top.io/p_3860gv4o31.png', features: ['معرض قوارب فاخرة', 'موقف خاص', 'دخل ممتاز'] },
      { name: 'بيزنس معرض مروحيات', price: 25, popular: false, image: 'https://c.top4top.io/p_3860iamp82.png', features: ['معرض مروحيات', 'هيلباد خاص', 'دخل مرتفع'] },
      { name: 'بيزنس معرض الدراجات', price: 15, popular: false, image: 'https://images.pexels.com/photos/210118/pexels-photo-210118.jpeg?w=600&h=450&fit=crop', features: ['معرض دراجات نارية', 'موقف خاص', 'دخل ممتاز'] },
      { name: 'بيزنس معرض الشاحنات', price: 15, popular: false, image: 'https://images.pexels.com/photos/210118/pexels-photo-210118.jpeg?w=600&h=450&fit=crop', features: ['معرض شاحنات', 'موقف واسع', 'دخل عالي'] },
      { name: 'بيزنس محطات الوقود', price: 25, popular: false, image: 'https://j.top4top.io/p_386023ekl2.png', features: ['محطات وقود المدينة كاملة', 'إدارة تشغيلية', 'دخل مستمر'] },
      { name: 'بيزنس بلاك ماركت', price: 30, popular: false, image: 'https://images.pexels.com/photos/6289055/pexels-photo-6289055.jpeg?w=600&h=450&fit=crop', features: ['سوق سوداء حصري', 'منتجات نادرة', 'دخل ضخم'] },
      { name: 'بيزنس متجر الاسلحة والطلقات', price: 20, popular: false, image: 'https://k.top4top.io/p_3860r0lyr3.png', features: ['متجر أسلحة حصري', 'مخزون متنوع', 'دخل عالي'] },
      { name: 'بيزنس متاجر', price: 20, popular: false, image: 'https://i.top4top.io/p_3860lry791.png', features: ['ملكية متاجر المدينة كاملة', 'إدارة كاملة', 'دخل مستمر'] },
      { name: 'بيزنس بوست وظيفة منجم', price: 15, popular: false, image: 'https://i.top4top.io/p_3860mjo6v2.png', features: ['منصب وظيفة المنجم', 'إدارة كاملة', 'دخل يومي'] },
      { name: 'بيزنس بوست وظيفة الزجاج', price: 15, popular: false, image: 'https://h.top4top.io/p_3860sdp081.png', features: ['منصب وظيفة الزجاج', 'إدارة كاملة', 'دخل يومي'] },
    ],
  },
  {
    id: 'coins', title: 'خدمات وأموال', icon: 'Coins', color: '#E07B20',
    items: [
      { name: 'طاولة تصنيع الأسلحة لمدة شهر', price: 25, popular: false, image: 'https://h.top4top.io/p_38606iimd1.png', features: ['طاولة تصنيع أسلحة', 'مدة شهر كامل', 'تصنيع مجاني'] },
      { name: 'وزنية مركبة خاصة', price: 20, popular: false, image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=600&h=450&fit=crop', features: ['وزنية مركبة خاصة', 'تحسينات مخصصة'] },
      { name: 'فتح شخصية إضافية', price: 10, popular: false, image: 'https://a.top4top.io/p_3870j7tcl1.png', features: ['شخصية إضافية', 'حساب مستقل', 'جاهزة للاستخدام'] },
    ],
  },
  {
    id: 'houses', title: 'منازل حصرية', icon: 'Home', color: '#10B981',
    items: [
      // { name: 'Studio Apartment', price: 11, popular: false, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=600&h=450&fit=crop', features: ['شقة وسط المدينة', 'غرفة تخزين', 'إنذار أمني'] },
      // { name: 'Villa Package', price: 34, popular: true, image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=600&h=450&fit=crop', features: ['فيلا فاخرة', 'مرآب خاص', 'حديقة', 'حمام سباحة'] },
    ],
  },
  {
    id: 'workshops', title: 'ورش التعديل', icon: 'Wrench', color: '#F97316',
    items: [
      { name: 'ورشة تعديل الميناء', price: 20, popular: true, image: 'https://l.top4top.io/p_38602decm4.png', features: ['ورشة تعديل في الميناء', 'تعديل السيارات والمركبات', 'مدة شهر كامل'] },
      { name: 'ورشة تعديل لوس سانتوس', price: 15, popular: false, image: 'https://a.top4top.io/p_3860jy1645.png', features: ['ورشة تعديل في لوس سانتوس', 'تعديل السيارات والمركبات', 'مدة شهر كامل'] },
      { name: 'ورشة تعديل مجمع الورش', price: 10, popular: false, image: 'https://l.top4top.io/p_3870nfywf1.png', features: ['ورشة تعديل في مجمع الورش', 'تعديل السيارات والمركبات', 'مدة شهر كامل'] },
    ],
  },
];

export function getStore(): StoreCategory[] { return defaultStore; }
export function saveStore(_cats: StoreCategory[]) {}
export function addStoreCategory(cat: StoreCategory) { defaultStore.push(cat); return defaultStore; }
export function removeStoreCategory(id: string) { return defaultStore.filter((c) => c.id !== id); }
export function updateStoreCategory(id: string, updates: Partial<StoreCategory>) {
  const idx = defaultStore.findIndex((c) => c.id === id);
  if (idx >= 0) defaultStore[idx] = { ...defaultStore[idx], ...updates };
  return defaultStore;
}
export function addStoreProduct(catId: string, product: StoreProduct) {
  const cat = defaultStore.find((c) => c.id === catId);
  if (cat) cat.items.push(product);
  return defaultStore;
}
export function removeStoreProduct(catId: string, productName: string) {
  const cat = defaultStore.find((c) => c.id === catId);
  if (cat) cat.items = cat.items.filter((i) => i.name !== productName);
  return defaultStore;
}
export function updateStoreProduct(catId: string, oldName: string, updates: Partial<StoreProduct>) {
  const cat = defaultStore.find((c) => c.id === catId);
  if (cat) {
    const idx = cat.items.findIndex((i) => i.name === oldName);
    if (idx >= 0) cat.items[idx] = { ...cat.items[idx], ...updates };
  }
  return defaultStore;
}

/* ══════════════════════════════════════════════════════════════
   RULES — Categories & Rules
   ══════════════════════════════════════════════════════════════ */

export interface Rule {
  title: string;
  description: string;
}

export interface RuleCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  rules: Rule[];
}

const defaultRules: RuleCategory[] = [
  {
    id: 'life', title: 'قوانين الحياة', icon: 'Heart', color: '#EF4444',
    rules: [
      { title: 'NLR — قوانين الحياة الجديدة', description: 'في حال إغمائك بشكل كامل لا يمكنك الكلام أو الحركة أو فعل أي شيء.\nفي حال تم إسقاطك من قبل شخص وتم إنعاشك من قبل المسعفين تستطيع تذكر جميع الأحداث.\nفي حال تم حرق جثتك لا تستطيع تذكر أي شيء حصل لك (بما في ذلك العداوات أو السيناريوهات).' },
      { title: 'NVL — الخوف على الحياة', description: 'يجب أن تخاف على حياتك بشكل واقعي عند تعرضك للتهديد بالأسلحة أو بأي وسيلة قد تعرض حياتك للخطر.\nيعتبر تقدير الحياة أمرًا أساسيًا ومهمًا جدًا.\nمثال: إذا كان هناك أداة قد تعرض حياتك للخطر فيجب التصرف بطريقة واقعية.' },
      { title: 'NWL — عدم حدود الربح', description: 'الحفاظ على حياتك وحياة الآخرين.\nعدم التهور أو الاستهانة بقتل الأشخاص.\nعدم مقاومة المجرم أو الشرطة أو أي شخص يحمل سلاحًا، خاصة إذا كنت أعزل.\nيحق لك الدفاع عن نفسك عند الضرورة إذا تعذر طلب مساعدة الشرطة.\nيجب التفاوض مع اللاعب الآخر بشكل جيد قبل القيام بأي عمل قد يعرض حياته للخطر.' },
      { title: 'PowerGaming', description: 'هو تنفيذ أفعال غير منطقية أو فرض السيطرة على الموقف داخل اللعبة دون إعطاء فرصة للطرف الآخر للرد أو التصرف بشكل عادل.' },
      { title: 'Fear RP — أهمية الحياة', description: 'حياتك داخل اللعبة لها قيمة، ويجب التصرف بما يحافظ عليها في جميع المواقف.\nعدم الالتزام بذلك قد يؤدي إلى الباند النهائي.' },
    ],
  },
  {
    id: 'general', title: 'القوانين العامة لمدينة ULG', icon: 'BookOpen', color: '#E07B20',
    rules: [
      { title: 'Meta Gaming', description: 'يمنع التواصل غير الشرعي.' },
      { title: 'VDM — استخدام المركبة كسلاح', description: 'ممنوع استخدام المركبة كسلاح.' },
      { title: 'RDM — القتل العشوائي', description: 'ممنوع القتل العشوائي.' },
      { title: 'التقمص الكامل', description: 'يجب بناء شخصية خاصة بك وتقمصها بشكل ممتاز.' },
      { title: 'إهانة المسقط', description: 'يمنع إهانة الشخص المسقط.' },
      { title: 'تقليد الزي الرسمي', description: 'يمنع تقليد ملابس الشرطة والإسعاف.' },
      { title: 'الخروج عن الرول بلاي', description: 'يمنع الخروج عن الرول بلاي لأي سبب.' },
      { title: 'أمر OOC', description: 'يستخدم أمر /ooc للمشاكل خارج الرول بلاي.' },
      { title: 'التحدث عن الألم فقط', description: 'عند الإسقاط يسمح لك بالتحدث عن الألم فقط.' },
      { title: 'حظر القلتشات والثغرات', description: 'يمنع استخدام القلتشات أو الثغرات أو الهاك، وعقوبتها باند نهائي.' },
      { title: 'حظر الاتفاق الخارجي', description: 'يمنع أي اتفاق خارج الرول بلاي.' },
      { title: 'برنامج التسجيل', description: 'يجب تشغيل برنامج التصوير مع الصوت أثناء اللعب (آخر 7 دقائق).' },
      { title: 'دخول موقع إطلاق النار', description: 'يمنع على المسعفين دخول موقع إطلاق النار قبل التأكد من خلوه.' },
      { title: 'ترابط الشخصية الأولى مع الثانية', description: 'يمنع ترابط الشخصية الأولى مع الثانية.' },
      { title: 'تعبئة البيانات أمام المسعفين', description: 'يمنع تعبئة البيانات بوجود المسعفين.' },
      { title: 'الخروج أثناء السيناريو', description: 'يمنع الخروج من السيرفر أثناء السيناريو.' },
      { title: 'لبس الغوص خارج البحر', description: 'يمنع لبس عدة الغوص خارج البحر.' },
      { title: 'إطلاق السائق للنار', description: 'يمنع إطلاق السائق للنار.' },
      { title: 'القفز الانتحاري بالمركبات', description: 'يمنع القفز الانتحاري بالمركبات.' },
      { title: 'نسيان المتسبب بالوفاة', description: 'عند تحلل الشخصية يجب نسيان المتسبب بوفاتك.' },
      { title: 'الرجوع لموقع الإسقاط', description: 'بعد إسقاطك في حالة يمنع الرجوع لموقعها.' },
      { title: 'التعرف على الأشخاص بالشكل', description: 'التعرف على الأشخاص يكون بالشكل وليس بالصوت.' },
      { title: 'تقدير الحياة عند التهديد', description: 'يجب تقدير الحياة عند التهديد وعدم المقاومة إذا لم تكن قادرًا.' },
      { title: 'مقاومة مسلحين وحدك', description: 'يمنع مقاومة شخصين مسلحين إذا كنت وحدك، كما يمنع مقاومة السلاحبيض وأنت أعزل.' },
      { title: 'حظر الملفات الضارة', description: 'يمنع استخدام أي ملف يضر بيئة اللعب.' },
      { title: 'خطف المسعفين بدون عداوة', description: 'يمنع خطف أو الاعتداء على المسعفين إلا بوجود عداوة.' },
      { title: 'سرقة أغراض الموظفين', description: 'يمنع سرقة أغراض الشرطة أو المسعفين، ويسمح فقط بأخذ: الدروع، الطلقات، الكلبش، الأموال.' },
      { title: 'التربص للموظفين', description: 'يمنع التربص للموظفين الحكوميين عند أماكن عملهم.' },
      { title: 'إزعاج الموظفين', description: 'يمنع إزعاج موظفي المطاعم والورش والعساكر والمسعفين.' },
      { title: 'الاحتماء في المناطق الآمنة', description: 'يمنع الاحتماء أو الاستفزاز أو بيع الممنوعات في المناطق الآمنة.' },
      { title: 'استكمال السيناريو من المنطقة الآمنة', description: 'يسمح باستكمال السيناريو إذا احتمى الشخص بمنطقة آمنة باستثناء مركز الشرطة.' },
      { title: 'حمل لاعب داخل المركبة', description: 'يمنع حمل لاعب داخل المركبة أو أثناء الفايت.' },
      { title: 'قيادة المركبة بعد فقدان الإطارات', description: 'عند فقدان أربع إطارات يمنع قيادة المركبة.' },
      { title: 'التعرف بالآيتم أو الأيدي', description: 'يمنع التعرف على الأشخاص عن طريق إعطاء الآيتم أو الأيدي.' },
      { title: 'المواقف الجدية', description: 'يجب أخذ جميع المواقف الجدية بجدية.' },
      { title: 'مناطق الوظائف الحكومية', description: 'جميع الوظائف الحكومية تعتبر مناطق آمنة.' },
    ],
  },
  {
    id: 'crime', title: 'قوانين الإجرام', icon: 'Shield', color: '#EF4444',
    rules: [
      { title: 'تحالف العصابات', description: 'يُمنع تحالف العصابات ضد عصابة أخرى، ويُستثنى من ذلك السرقات الكبرى المسموح بها أو الحالات التي تتم بموافقة GodFather.' },
      { title: ' خطف أمام المواطنين', description: 'يمنع خطف أي شخص أمام المواطنين أو المدنيين. يجب أن يكون الشخص بمفرده.\nإذا كانت عصابة الشخص المخطوف قريبة وشاهدت عملية الخطف: يسمح لها بإطلاق النار مباشرة.\nيمنع مقاومة الخطف إذا كان العدد صحيحًا.' },
      { title: 'نظام الأعداد للخطف', description: 'خطف شخص واحد: مسموح بأي عدد من الخاطفين.\nخطف شخصين: يجب وجود 4 خاطفين.\nخطف 3 أشخاص: يجب وجود 6 خاطفين.\nخطف 4 أشخاص: يجب وجود 8 خاطفين.\nالقاعدة: بعد أول شخص يصبح العدد المطلوب ضعف عدد المخطوفين.' },
      { title: ' خطف مواطن للضغط', description: 'يُمنع اختطاف مواطن بهدف الضغط للإفراج عن سجناء.\nيسمح اذا كان عسكري غير مستجد.\nاستثناء: سيناريوهات GodFather.' },
      { title: 'إنزال المحمول قبل الاشتباك', description: 'يجب إنزال أي شخص تحمله قبل بدء إطلاق النار أو الدخول في أي اشتباك.' },
      { title: ' تقليد العصابات', description: 'يُمنع تقليد زي، اسم، شعار أو أسلوب أي عصابة أخرى داخل السيرفر.' },
      { title: 'حماية المفاوض', description: 'يُمنع الاعتداء على المفاوض من أي طرف (شرطة أو مجرمين) طوال فترة التفاوض.' },
      { title: 'الاستيقاف المروري', description: 'يُمنع إطلاق النار على العسكريين أو اختطافهم أثناء حالات الاستيقاف المروري.' },
      { title: 'حماية الموظفين', description: 'يُمنع اختطاف أو الاعتداء على أي لاعب يرتدي الزي الرسمي لوظيفة حكومية أو خاصة، باستثناء منتسبي وزارة الداخلية.' },
      { title: ' الهروب للمناطق الآمنة', description: 'يُمنع الهروب إلى المناطق الآمنة أثناء السيناريو.\nفي حال عصابة قامت بطاردتك يُسمح فقط باللجوء إلى مركز الشرطة.\nيمنع منعا باتا الهروب للمقرات.' },
      { title: ' إهانة الرهائن', description: 'يمنع منعًا باتًا إهانة أي رهينة: بالكلام، بالحركات، أو بطلبات غير منطقية أو غير واقعية.\nيسمح بالتعذيب RP فقط مثل: اللكم، الجري لمسافة معينة، غسل سيارة، نقل أغراض.' },
      { title: ' الجريمة بالزي الرسمي', description: 'يُمنع على أي شخص يرتدي زيًا رسميًا (تاكسي، محامي، مسعف، شرطي... إلخ) ارتكاب أي جريمة تحت أي ظرف.' },
      { title: ' النصب في المناطق الآمنة', description: 'يسمح بالنصب خارج المناطق الآمنة فقط.\nيحق لك قتل الشخص الذي نصب عليك.\nويسمح بتلويت الأغراض المتعلقة بالنصب فقط.' },
      { title: 'نظام العداوات', description: 'تبدأ العداوة بعد 3 حالات عدائية بين العصابتين. مدة العداوة 3 أيام. خلال هذه المدة يسمح بالتلويت. بعد انتهاء المدة يتم إغلاق العداوة تلقائيًا.' },
      { title: ' القتال بدون سبب', description: 'يُمنع افتعال شجار أو قتال دون وجود سبب منطقي ومقنع داخل الرول بلاي.' },
      { title: 'الحد الأقصى للرهائن', description: 'الحد الأقصى في أي سيناريو سرقة هو رهينتان فقط.' },
      { title: 'مبلغ التفاوض', description: 'المواطن: 50,000$.\nالعسكري: 100,000$.' },
      { title: ' خطف المسقط', description: 'يُمنع خطف أي شخص وهو مسقط أو فاقد للوعي تحت أي ظرف.' },
      { title: ' كلبشة الميت', description: 'يُمنع تكبيل (كلبشة) الشخص الميت منعًا باتًا.' },
      { title: ' إعادة الخطف', description: 'لا يُسمح بخطف الشخص أو إسقاطه مرة أخرى مباشرة بعد علاجه.' },
      { title: ' الإيموت أثناء الاشتباكات', description: 'يُمنع استخدام أي إيموت أثناء إطلاق النار أو الاشتباكات.' },
      { title: ' الحلف أثناء النصب', description: 'يُمنع الحلف بالله أو القسم بأي صيغة أثناء عمليات النصب.' },
      { title: ' تلويت المسقط', description: 'يُمنع علاج أو "تلويت" الشخص المسقط تحت أي ظرف.' },
      { title: 'مدة احتجاز الرهائن', description: 'الحد الأقصى: 20 دقيقة.\n24 ساعة في السيناريوهات الكبرى.\nلا يوجد حد زمني في سيناريوهات GodFather.' },
      { title: ' الحركات غير الواقعية', description: 'يُمنع استخدام أي تصرف غير واقعي أثناء القتال، مثل الإيموت أو استخدام الراديو.' },
      { title: 'تصوير الشاشة', description: 'يجب تشغيل برنامج تسجيل الشاشة طوال فترة اللعب، والاحتفاظ بالتسجيل لمدة 20 دقيقة على الأقل.' },
      { title: 'صلاحيات الإدارة', description: 'للإدارة كامل الحق في اتخاذ الإجراءات المناسبة تجاه أي مخالفة حتى وإن لم يُذكر نصها صراحةً في هذه القوانين.' },
      { title: ' الإنعاش أثناء السيناريو', description: 'يُمنع إنعاش أي شخص أثناء السيناريو، كما يُمنع استخدام أمر الإنعاش على نفسك.' },
      { title: ' حمل السلاح أثناء القيادة', description: 'يُمنع حمل السلاح أثناء قيادة المركبة أو قبل ركوبها، ويُسمح بحمله فقط بعد النزول من المركبة.' },
      { title: 'شروط تقديم الشكاوى', description: 'لن تُقبل أي شكوى إلا عند توفر: فيديو كامل للحالة، وجود الصوت، رقم ID للمشتكى عليه.\nوفي حال ثبوت خطأ على المشتكي، سيتم محاسبته أيضًا.' },
      { title: 'توقيت تقديم الشكاوى', description: 'يُمنع رفع أي شكوى قبل انتهاء السيناريو بالكامل، ومن يخالف ذلك يعرض نفسه للعقوبة.' },
      { title: 'مدة السرقات', description: 'الحد الأقصى لأي سيناريو سرقة هو 20 دقيقة، ويجب إنهاؤه خلال هذه المدة.' },
      { title: 'مدة القتال الكبير', description: 'الحد الأقصى لأي قتال كبير هو ساعة واحدة.' },
      { title: 'Stream Sniping', description: 'يُعاقب بـ الباند النهائي كل من يستغل البثوث للحصول على معلومات داخل اللعبة.' },
      { title: ' الهجوم على المراكز العسكرية', description: 'يُمنع الهجوم على أي مركز عسكري إلا عند القبض على GodFather أو نائبه أو قائد عصابة.' },
      { title: ' رهائن الحالات المفتوحة', description: 'يُمنع أخذ رهائن أثناء الحالات المفتوحة، كما يُمنع أخذ رهينة لبدء حالة مفتوحة.' },
      { title: 'حماية العسكريين (ال人数)', description: 'إذا كان عدد العسكريين داخل المدينة أقل من 3 أفراد، يُمنع خطف أي عسكري.' },
      { title: ' إطلاق النار من المركبات', description: 'يُمنع إطلاق النار من داخل المركبات على أي لاعب.\nويُستثنى العسكريون باستخدام التيزر فقط أثناء المطاردات.' },
      { title: 'التلويت خلال العداوات', description: 'يسمح بالتلويت فقط أثناء العداوات.\nإذا دخل شخص مقر عصابتك بدون إذن يحق لك تلويته.\nأما إذا دخل بإذن منك فلا يحق لك تلويته.' },
      { title: 'شروط الكلبشة', description: 'قبل تكبيل أي شخص يجب: توجيه 3 تحذيرات، ترك 5 ثوانٍ بين كل تحذير.\nبعد ذلك يُسمح بالتكبيل الإجباري.' },
      { title: 'التخريب', description: 'في حالة قيام 3 أعضاء من نفس العصابة بأي نوع من أنواع التخريب: تحصل العصابة على إنذار.\nعند وصول العصابة إلى 3 إنذارات يتم إغلاق العصابة نهائيًا.' },
      { title: ' التوكسك بين العصابات', description: 'يمنع منعًا باتًا التوكسك بين العصابات.\nأي عضو يقوم بالتوكسك أو الإهانة يتحمل مسؤوليتها زعيم العصابة.\nالعقوبة: قد تصل إلى حل وإغلاق العصابة بالكامل. اختار أعضاء عصابتك بعناية.' },
      { title: ' تهريب المسقط', description: 'يُمنع سحب أو تهريب أي شخص مسقط أثناء الاشتباكات.' },
      { title: ' الانتظار بعد السرقة', description: 'يُمنع تنفيذ السرقة ثم البقاء في نفس الموقع بغرض التفاوض أو لأي سبب آخر.' },
      { title: ' تدبيل الراديو', description: 'يُمنع منعًا باتًا استخدام أكثر من قناة راديو أو تدبيل الراديو أثناء إطلاق النار أو الاشتباكات.' },
      { title: '⚠️ تنبيه هام', description: 'أي محاولة لاستغلال ثغرات القوانين أو التحايل عليها تُعتبر مخالفة صريحة، ويحق للإدارة اتخاذ العقوبة المناسبة دون إنذار مسبق، بما يحقق العدالة ويحافظ على جودة الرول بلاي داخل السيرفر.' },
    ],
  },
  {
    id: 'interaction', title: 'قوانين التعامل', icon: 'Users', color: '#3B82F6',
    rules: [
      { title: ' خطف الشرطي', description: 'يمنع خطف شرطي إلا إذا كان يوجد 5 أفراد شرطة داخل المدينة.\nيجب أن يكون الخطف بواسطة 3 مجرمين مسلحين على الأقل.\nيمنع خطف الشرطي أثناء تفعيل السيفتي أو أثناء الاستيقاف المروري.' },
      { title: ' تلويت أسلحة الشرطة', description: 'يمنع تلويت أسلحة الشرطة، والعقوبة قد تصل إلى باند أسبوعين.' },
      { title: 'أقصى فدية', description: 'الشرطي: 20,000$.\nقائد الشرطة: 75,000$.' },
      { title: ' استخدام مركبات الشرطة', description: 'يمنع استخدام مركبات الشرطة.' },
    ],
  },
  {
    id: 'loot', title: 'قوانين التلويت', icon: 'Coins', color: '#F59E0B',
    rules: [
      { title: 'المجرم ضد العسكري', description: 'ممنوع أخذ أسلحة العسكري.\nممنوع أخذ الموارد.\nيسمح بأخذ: السترات، الطلقات.' },
      { title: 'المجرم ضد المواطن', description: 'يمنع أخذ الأسلحة النارية إلا بعد 3 عداوات مسجلة.\nيمنع أخذ الموارد.' },
      { title: 'العسكري ضد المجرم', description: 'يمنع أخذ الأموال والموارد والطعام والشراب.\nيمنع أخذ السلاح المرخص.\nيسمح بأخذ السلاح غير المرخص.\nيسمح بأخذ الأسلحة البيضاء.\nيمنع أخذ مفاتيح العصابات.' },
    ],
  },
  {
    id: 'robbery-nums', title: 'عدد أفراد السرقات', icon: 'Trophy', color: '#8B5CF6',
    rules: [
      { title: 'سرقة ATM', description: 'المجرمون: 2\nدوريات الشرطة: 3' },
      { title: 'سرقة البقالة', description: 'المجرمون: 3\nالشرطة: 4' },
      { title: 'سرقة فيلا مادروزا', description: 'المجرمون: 5\nالشرطة: 8' },
      { title: 'سرقة المجوهرات', description: 'المجرمون: 6\nالشرطة: 8' },
      { title: 'سرقة بنك بيتا', description: 'المجرمون: 6\nالشرطة: 8' },
      { title: 'سرقة بنك الاتحاد', description: 'المجرمون: 8\nالشرطة: 12' },
      { title: 'البنك المركزي', description: 'المجرمون: 8\nالشرطة: 12' },
    ],
  },
  {
    id: 'feuds', title: 'قوانين العداوات', icon: 'Swords', color: '#DC2626',
    rules: [
      { title: ' بدء العداوة بدون موافقة', description: 'يمنع بدء العداوة لأسباب تافهة.\nيجب فتح تذكرة والحصول على موافقة الإدارة قبل بدء العداوة.\nيجب وجود فيديو لا يقل عن 5 دقائق يوضح أسباب العداوة.' },
      { title: 'التلويت بعد أسبوع', description: 'يسمح بالتلويت بعد أسبوع من بداية العداوة.' },
      { title: 'الإعدام بعد أسبوعين', description: 'يسمح بالإعدام بعد أسبوعين مع وجود تصوير.' },
      { title: ' توريث ممتلكات المعدم', description: 'يمنع توريث ممتلكات الشخصية المعدمة.' },
      { title: 'عودة المعدم للعصابة', description: 'عند إعدام مجرم: يمنع العودة للعصابة بشخصية أخرى قبل أسبوعين.\nيجب وجود سيناريو للعودة.' },
      { title: 'عودة المعدم للعسكرية', description: 'عند إعدام عسكري: يمنع العودة للعسكرية قبل أسبوعين.\nيجب وجود سيناريو كامل.' },
      { title: 'عودة المعدم كـ GodFather', description: 'عند إعدام قائد العصابة: لا يعود نهائيًا.\nتنتقل الملكية للنائب.\nيمنع نقل الممتلكات بعد الإعدام لأي شخص داخل السيرفر.' },
    ],
  },
  {
    id: 'penalties', title: 'قوانين الحظر', icon: 'AlertTriangle', color: '#F59E0B',
    rules: [
      { title: 'فصل أثناء سيناريو', description: 'العقوبة: 12 ساعة.\nمدة الأدلة المطلوبة: دقيقة واحدة.' },
      { title: 'تخريب متعمد', description: 'العقوبة: يوم.\nمدة الأدلة المطلوبة: دقيقتان.' },
      { title: 'ترصد', description: 'العقوبة: 15 ساعة.' },
      { title: 'قتل عشوائي', description: 'العقوبة: 10 ساعات.' },
      { title: 'استخدام المركبة كسلاح', description: 'العقوبة: 10 ساعات.' },
      { title: 'سب الدين أو الأهل أو الإداري', description: 'العقوبة: مؤبد.' },
      { title: 'استخدام قلتشات', description: 'العقوبة: أسبوع.' },
      { title: 'سب لاعب', description: 'العقوبة: يوم.\nمدة الأدلة المطلوبة: دقيقتان.' },
      { title: 'تواصل خارجي', description: 'العقوبة: يومان.' },
      { title: 'Warn 1', description: 'العقوبة: أسبوع.' },
      { title: 'Warn 2', description: 'العقوبة: أسبوع.' },
      { title: 'Warn 3', description: 'العقوبة: أسبوع.' },
      { title: 'أكثر من 3 Warn', description: 'العقوبة: أسبوعان.' },
      { title: 'مدة التلويت المطلوبة', description: 'مدة الأدلة المطلوبة للتلويت: 20 ثانية على الأقل.' },
    ],
  },
  {
    id: 'recording', title: 'قوانين التصوير للإبلاغ', icon: 'Video', color: '#6366F1',
    rules: [
      { title: 'الإبلاغ عن التخريب أو الإزعاج', description: 'تسجيل الفيديو من دقيقتين إلى خمس دقائق.\nيجب أن تكون الصورة والصوت واضحين.\nيجب سماع صوت الطرفين بوضوح.' },
      { title: 'توقيت التسجيل', description: 'يفضل أن يبدأ التسجيل من بداية المشكلة ويعرض السياق كاملًا.' },
      { title: 'رفع الفيديو', description: 'يتم رفعه على YouTube أو Google Drive أو Discord أو أي منصة مناسبة.\nيجب إرسال الرابط لإدارة السيرفر خلال 24 ساعة من الواقعة.' },
      { title: 'ملاحظة', description: 'عدم الالتزام بهذه التعليمات قد يؤدي إلى رفض الشكوى أو البلاغ.' },
    ],
  },
];

export function getRules(): RuleCategory[] { return defaultRules; }
export function saveRules(_rules: RuleCategory[]) {}
export function addRuleCategory(cat: RuleCategory) { defaultRules.push(cat); return defaultRules; }
export function removeRuleCategory(id: string) { return defaultRules.filter((c) => c.id !== id); }
export function updateRuleCategory(id: string, updates: Partial<RuleCategory>) {
  const idx = defaultRules.findIndex((c) => c.id === id);
  if (idx >= 0) defaultRules[idx] = { ...defaultRules[idx], ...updates };
  return defaultRules;
}
export function addRule(catId: string, rule: Rule) {
  const cat = defaultRules.find((c) => c.id === catId);
  if (cat) cat.rules.push(rule);
  return defaultRules;
}
export function removeRule(catId: string, ruleIndex: number) {
  const cat = defaultRules.find((c) => c.id === catId);
  if (cat) cat.rules.splice(ruleIndex, 1);
  return defaultRules;
}
export function updateRule(catId: string, ruleIndex: number, updates: Partial<Rule>) {
  const cat = defaultRules.find((c) => c.id === catId);
  if (cat && cat.rules[ruleIndex]) cat.rules[ruleIndex] = { ...cat.rules[ruleIndex], ...updates };
  return defaultRules;
}

/* ══════════════════════════════════════════════════════════════
   APPLICATIONS — Configurable application types
   ══════════════════════════════════════════════════════════════ */

export interface ApplicationQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ApplicationRequirement {
  text: string;
}

export interface ApplicationTypeConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  roleId: string;
  questions: ApplicationQuestion[];
  requirements: ApplicationRequirement[];
  enabled: boolean;
}

const defaultApplications: ApplicationTypeConfig[] = [
  {
    id: 'whitelist', label: 'الوايت ليست', icon: 'User', color: '#E07B20',
    description: 'التقديم للانضمام لسيرفر ULG CFW',
    roleId: '1530789244375797791',
    enabled: true,
    requirements: [
      { text: 'يجب أن يكون عمرك 18 سنة على الأقل' },
      { text: 'يجب قراءة جميع قوانين السيرفر' },
      { text: 'يجب ملء جميع البيانات المطلوبة بصراحة' },
    ],
    questions: [
      { id: 'character_name', label: 'اسم الشخصية', type: 'text', required: true, placeholder: 'الاسم الكامل للشخصية' },
      { id: 'character_story', label: 'قصة الشخصية', type: 'textarea', required: true, placeholder: 'من أين أتت شخصيتك؟ ما أهدافها وطموحاتها داخل المدينة؟', },
    ],
  },
  {
    id: 'police', label: 'الشرطة', icon: 'Shield', color: '#3B82F6',
    description: 'التقديم لقطاع الشرطة والأمن',
    roleId: '',
    enabled: true,
    requirements: [
      { text: 'يجب أن تكون وايت ليست' },
      { text: 'يجب أن يكون عمرك 17 سنة على الأقل' },
      { text: 'يجب أن يكون لديك خبرة في الرولبلاي' },
    ],
    questions: [
      { id: 'character_name', label: 'اسم الشخصية', type: 'text', required: true, placeholder: 'اسم الشخصية داخل اللعبة' },
      { id: 'character_story', label: 'قصة الشخصية', type: 'textarea', required: true, placeholder: 'لماذا تريد الانضمام لشرطة؟ ما هي دوافعك؟' },
      { id: 'experience', label: 'الخبرة السابقة', type: 'textarea', required: false, placeholder: 'خبراتك السابقة في هذا المجال...' },
    ],
  },
  {
    id: 'ambulance', label: 'الإسعاف', icon: 'Heart', color: '#EF4444',
    description: 'التقديم لقطاع الطوارئ الطبية',
    roleId: '',
    enabled: true,
    requirements: [
      { text: 'يجب أن تكون وايت ليست' },
      { text: 'يجب أن يكون عمرك 16 سنة على الأقل' },
    ],
    questions: [
      { id: 'character_name', label: 'اسم الشخصية', type: 'text', required: true, placeholder: 'اسم الشخصية داخل اللعبة' },
      { id: 'character_story', label: 'قصة الشخصية', type: 'textarea', required: true, placeholder: 'لماذا تريد الانضمام للاسعاف؟' },
      { id: 'experience', label: 'الخبرة السابقة', type: 'textarea', required: false, placeholder: 'خبراتك السابقة...' },
    ],
  },
  {
    id: 'defense', label: 'وزارة الدفاع', icon: 'Landmark', color: '#10B981',
    description: 'التقديم لوزارة الدفاع',
    roleId: '',
    enabled: true,
    requirements: [
      { text: 'يجب أن تكون وايت ليست' },
      { text: 'يجب أن يكون عمرك 17 سنة على الأقل' },
    ],
    questions: [
      { id: 'character_name', label: 'اسم الشخصية', type: 'text', required: true, placeholder: 'اسم الشخصية داخل اللعبة' },
      { id: 'character_story', label: 'قصة الشخصية', type: 'textarea', required: true, placeholder: 'لماذا تريد الانضمام لوزارة الدفاع؟' },
      { id: 'experience', label: 'الخبرة السابقة', type: 'textarea', required: false, placeholder: 'خبراتك السابقة في القطاع العسكري...' },
    ],
  },
  {
    id: 'justice', label: 'وزارة العدل', icon: 'Scale', color: '#8B5CF6',
    description: 'التقديم لوزارة العدل',
    roleId: '',
    enabled: true,
    requirements: [
      { text: 'يجب أن تكون وايت ليست' },
      { text: 'يجب أن يكون عمرك 17 سنة على الأقل' },
    ],
    questions: [
      { id: 'character_name', label: 'اسم الشخصية', type: 'text', required: true, placeholder: 'اسم الشخصية داخل اللعبة' },
      { id: 'character_story', label: 'قصة الشخصية', type: 'textarea', required: true, placeholder: 'لماذا تريد الانضمام لوزارة العدل؟' },
      { id: 'experience', label: 'الخبرة السابقة', type: 'textarea', required: false, placeholder: 'خبراتك السابقة في القطاع القانوني...' },
    ],
  },
  {
    id: 'creator', label: 'صانع محتوى', icon: 'Video', color: '#9333EA',
    description: 'التقديم لبرنامج صناع المحتوى',
    roleId: '',
    enabled: true,
    requirements: [
      { text: 'يجب أن يكون لديك قناة نشطة' },
      { text: 'يجب أن يكون لديك محتوى عن FiveM' },
    ],
    questions: [
      { id: 'channel_link', label: 'رابط القناة', type: 'text', required: true, placeholder: 'رابط قناتك على أي منصة' },
      { id: 'subscriber_count', label: 'عدد المتابعين', type: 'text', required: true, placeholder: 'عدد المتابعين الحالي' },
      { id: 'character_story', label: 'لماذا أنت؟', type: 'textarea', required: true, placeholder: 'لماذا تريد الانضمام لبرنامج صناع المحتوى؟ ما الذي يميزك؟' },
      { id: 'experience', label: 'روابط المحتوى', type: 'textarea', required: false, placeholder: 'روابط أفضل محتوى لك...' },
    ],
  },
];

export function getApplications(): ApplicationTypeConfig[] { return defaultApplications; }
export function saveApplications(_apps: ApplicationTypeConfig[]) {}
export function addApplication(app: ApplicationTypeConfig) { defaultApplications.push(app); return defaultApplications; }
export function removeApplication(id: string) { return defaultApplications.filter((a) => a.id !== id); }
export function updateApplication(id: string, updates: Partial<ApplicationTypeConfig>) {
  const idx = defaultApplications.findIndex((a) => a.id === id);
  if (idx >= 0) defaultApplications[idx] = { ...defaultApplications[idx], ...updates };
  return defaultApplications;
}
