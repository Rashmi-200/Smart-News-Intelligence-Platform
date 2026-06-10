// ─── Types ────────────────────────────────────────────────────────────────────
export type Sentiment = "Positive" | "Negative" | "Neutral";
export type Category =
  | "All"
  | "Politics"
  | "Business"
  | "Sports"
  | "Tech"
  | "Climate"
  | "Entertainment";

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: Category;
  source: string;
  timeAgo: string;
  imageId: number;
  sentiment: Sentiment;
  isBookmarked: boolean;
  isHero?: boolean;
  readTime?: number;
  views?: number;
  shares?: number;
}

export interface TrendingTopic {
  id: number;
  rank: number;
  topic: string;
  articleCount: number;
  category: Category;
}

export interface Comment {
  id: number;
  username: string;
  avatarColor: string;
  initials: string;
  timeAgo: string;
  text: string;
  likes: number;
}

export interface AlsoReportedBy {
  source: string;
  title: string;
  timeAgo: string;
  url: string;
}

export interface ArticleDetail extends NewsArticle {
  publishedAt: string;
  readTime: number;
  sentimentScore: { positive: number; neutral: number; negative: number };
  isVerifiedSource: boolean;
  bodyParagraphs: string[];
  aiSummaryPoints: string[];
  alsoReportedBy: AlsoReportedBy[];
  comments: Comment[];
  tags: string[];
}

export interface CategoryMeta {
  slug: string;
  label: Category;
  description: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  subFilters: string[];
  articleCount: number;
}

// ─── Breaking News ─────────────────────────────────────────────────────────────
export const breakingHeadlines: string[] = [
  "Sri Lanka secures $3B IMF loan extension amid economic recovery",
  "President signs landmark climate bill targeting net-zero by 2040",
  "Tech giant announces 10,000 new jobs in Colombo tech hub",
  "Cricket: Sri Lanka beats Australia by 47 runs in historic ODI series",
  "UN report warns of record monsoon flooding across South Asia",
  "Central Bank holds interest rates steady at 8.5% for Q3",
  "New high-speed rail line connecting Colombo to Kandy breaks ground",
  "Global AI summit concludes with 40-nation safety accord",
];

// ─── Hero & News Articles ──────────────────────────────────────────────────────
export const heroArticle: NewsArticle = {
  id: 0,
  title: "Sri Lanka's Economic Recovery Accelerates: GDP Growth Hits 5.2% in Q1 2026 Amid IMF Programme Milestones",
  summary: "The Central Bank reports the fastest growth in four years, driven by strong tourism revenues, recovering exports, and improved investor confidence following successive IMF review completions.",
  category: "Business",
  source: "Ada Derana",
  timeAgo: "12m ago",
  imageId: 1043,
  sentiment: "Positive",
  isBookmarked: false,
  isHero: true,
  readTime: 4,
  views: 14200,
  shares: 892,
};

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Parliament Passes Landmark Anti-Corruption Act with Cross-Party Support",
    summary: "The sweeping legislation introduces mandatory asset declarations for all public officials and creates an independent oversight commission with prosecutorial powers.",
    category: "Politics",
    source: "Colombo Telegraph",
    timeAgo: "20m ago",
    imageId: 1055,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 5,
    views: 8400,
    shares: 341,
  },
  {
    id: 2,
    title: "Apple Unveils AI-Powered Siri Overhaul at WWDC 2026 — On-Device LLM Runs Entirely Offline",
    summary: "The redesigned Siri leverages a 7B-parameter on-device model, enabling full conversational AI without an internet connection and with end-to-end encryption.",
    category: "Tech",
    source: "TechCrunch",
    timeAgo: "45m ago",
    imageId: 1080,
    sentiment: "Positive",
    isBookmarked: true,
    readTime: 6,
    views: 22000,
    shares: 1540,
  },
  {
    id: 3,
    title: "Colombo Stock Exchange Sees Record Rs. 4.2B Single-Day Foreign Inflow",
    summary: "Analysts attribute the surge to upgraded sovereign credit outlook and a wave of institutional interest in frontier market equities ahead of the index rebalancing.",
    category: "Business",
    source: "Daily FT",
    timeAgo: "1h ago",
    imageId: 1040,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 4,
    views: 5600,
    shares: 220,
  },
  {
    id: 4,
    title: "South Asia Faces Worst Drought in Decades as El Niño Intensifies Across Indian Ocean",
    summary: "Meteorologists warn that erratic monsoon patterns could devastate crop yields in six countries, with early projections indicating a 30% reduction in rice output.",
    category: "Climate",
    source: "Reuters",
    timeAgo: "2h ago",
    imageId: 1015,
    sentiment: "Negative",
    isBookmarked: false,
    readTime: 7,
    views: 9100,
    shares: 675,
  },
  {
    id: 5,
    title: "Sri Lanka Crushes Pakistan in T20 Final, Clinches Asia Cup Title at R.Premadasa",
    summary: "Kusal Mendis's blistering 94 off 52 balls set up a dominant 68-run victory as Sri Lanka lifted the Asia Cup for the seventh time in front of a sold-out crowd.",
    category: "Sports",
    source: "ESPN Cricinfo",
    timeAgo: "3h ago",
    imageId: 1060,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 3,
    views: 31000,
    shares: 2100,
  },
  {
    id: 6,
    title: "Opposition Walkout Stalls Budget Debate in Parliament Over Education Cuts",
    summary: "Opposition MPs staged a dramatic walkout after the Finance Minister refused to restore Rs. 18B in proposed cuts to the national university expansion programme.",
    category: "Politics",
    source: "Newsfirst",
    timeAgo: "4h ago",
    imageId: 1050,
    sentiment: "Negative",
    isBookmarked: false,
    readTime: 4,
    views: 6700,
    shares: 289,
  },
  {
    id: 7,
    title: "Colombo Port City SEZ Attracts $800M Singapore Investment in FinTech Campus",
    summary: "The deal, signed at the Port City Authority, will establish South Asia's largest dedicated financial technology incubator, creating an estimated 15,000 direct jobs by 2029.",
    category: "Business",
    source: "Daily Mirror",
    timeAgo: "5h ago",
    imageId: 1035,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 5,
    views: 7800,
    shares: 412,
  },
  {
    id: 8,
    title: "Google DeepMind Releases Open-Source Climate Prediction Model Outperforming ECMWF",
    summary: "The WeatherBench 2 successor model delivers 15-day forecasts with unprecedented 1km resolution, potentially transforming disaster early-warning systems globally.",
    category: "Tech",
    source: "Nature",
    timeAgo: "6h ago",
    imageId: 1074,
    sentiment: "Neutral",
    isBookmarked: false,
    readTime: 8,
    views: 11200,
    shares: 930,
  },
  {
    id: 9,
    title: "Glacial Melt in Himalayas Accelerates 65% Since 2000, New Satellite Study Finds",
    summary: "A comprehensive analysis of 30 years of ESA satellite data confirms that Himalayan ice loss is now on track to eliminate 40% of glacial volume before 2100.",
    category: "Climate",
    source: "BBC",
    timeAgo: "7h ago",
    imageId: 1018,
    sentiment: "Negative",
    isBookmarked: false,
    readTime: 6,
    views: 8800,
    shares: 560,
  },
  {
    id: 10,
    title: "Colombo Named Top 10 Emerging Tech Hub in Global Startup Index 2026",
    summary: "A joint report by Startup Genome and the World Bank ranks Colombo 8th globally among emerging tech ecosystems, citing rapid growth in fintech and health-tech sectors.",
    category: "Tech",
    source: "Wired",
    timeAgo: "8h ago",
    imageId: 1076,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 5,
    views: 9400,
    shares: 710,
  },
  {
    id: 11,
    title: "National Energy Policy Mandates 70% Renewables by 2030, Solar Subsidy Doubled",
    summary: "The Ministry of Power announced an aggressive new framework including a doubling of rooftop solar subsidies and an accelerated offshore wind procurement schedule.",
    category: "Climate",
    source: "Daily News",
    timeAgo: "9h ago",
    imageId: 1021,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 5,
    views: 5200,
    shares: 340,
  },
  {
    id: 12,
    title: "Sri Lanka Women's Football Team Qualifies for AFC Asian Cup for First Time",
    summary: "A 2-1 victory over Vietnam in the qualifying playoff sealed an historic berth, sending shockwaves through South Asian football.",
    category: "Sports",
    source: "AFC Media",
    timeAgo: "10h ago",
    imageId: 1062,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 3,
    views: 18700,
    shares: 1380,
  },
  {
    id: 13,
    title: "OpenAI Launches GPT-5 with Real-Time Web Browsing and Multimodal Reasoning",
    summary: "The flagship model demonstrates unprecedented reasoning across text, images and audio simultaneously, with a claimed 40% improvement on MMLU benchmarks over GPT-4.",
    category: "Tech",
    source: "The Verge",
    timeAgo: "11h ago",
    imageId: 1083,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 7,
    views: 45000,
    shares: 3800,
  },
  {
    id: 14,
    title: "President Announces Cabinet Reshuffle — Three Ministers Replaced Amid Corruption Probes",
    summary: "In a surprise press conference, the President announced the immediate replacement of three senior ministers pending independent investigations into procurement irregularities.",
    category: "Politics",
    source: "Hiru News",
    timeAgo: "12h ago",
    imageId: 1052,
    sentiment: "Negative",
    isBookmarked: false,
    readTime: 4,
    views: 21000,
    shares: 1650,
  },
  {
    id: 15,
    title: "Bollywood Star Signs Record Rs. 500Cr Film Deal with Netflix for South Asian Series",
    summary: "In a landmark deal for the region, a three-season original series set in Sri Lanka and India will mark Netflix's largest South Asian content investment to date.",
    category: "Entertainment",
    source: "Variety",
    timeAgo: "13h ago",
    imageId: 1090,
    sentiment: "Positive",
    isBookmarked: false,
    readTime: 3,
    views: 28000,
    shares: 2200,
  },
];

// ─── Article Detail ────────────────────────────────────────────────────────────
export const articleDetail: ArticleDetail = {
  id: 2,
  title: "Apple Unveils AI-Powered Siri Overhaul at WWDC 2026 — On-Device LLM Runs Entirely Offline",
  summary: "The redesigned Siri leverages a 7B-parameter on-device model, enabling full conversational AI without an internet connection and with end-to-end encryption.",
  category: "Tech",
  source: "TechCrunch",
  timeAgo: "45m ago",
  publishedAt: "June 8, 2026 · 9:15 AM",
  imageId: 1080,
  sentiment: "Positive",
  isBookmarked: true,
  readTime: 6,
  views: 22000,
  shares: 1540,
  isVerifiedSource: true,
  sentimentScore: { positive: 72, neutral: 20, negative: 8 },
  aiSummaryPoints: [
    "Apple announced a fully redesigned Siri powered by a 7B-parameter on-device large language model that runs entirely without internet connectivity.",
    "The new model supports multi-turn conversation, context retention across apps, and full system-wide control — tasks previously impossible for Siri.",
    "Privacy is central to the redesign: all inference happens locally, meaning Apple's servers never see user queries or responses.",
  ],
  tags: ["Apple", "WWDC 2026", "AI", "Siri", "LLM", "Privacy", "iOS 20"],
  bodyParagraphs: [
    "In what industry analysts are calling the most significant upgrade to Apple's voice assistant in over a decade, Apple CEO Tim Cook took to the WWDC 2026 stage in Cupertino to unveil a ground-up redesign of Siri powered by a proprietary 7-billion-parameter large language model that runs entirely on-device.",
    "Unlike previous iterations of Siri, which relied heavily on cloud servers for natural language processing, the new architecture leverages Apple's latest Neural Engine in the A19 Pro chip to perform all inference locally. The result, Apple claims, is a voice assistant that can carry on multi-turn conversations, retain context across applications, and understand nuanced requests — all without sending a single byte of data to Apple's servers.",
    "\"This is the moment we've been working toward for years,\" Cook told a packed Steve Jobs Theater. \"An assistant that truly understands you, and keeps everything you say completely private.\" The audience responded with a standing ovation as the demo showed Siri seamlessly switching between drafting an email, editing a photo, and booking a restaurant reservation — all through continuous conversation.",
    "The on-device model, internally codenamed 'Ajax Nano', is a distilled variant of Apple's larger server-side Ajax model. Engineers spent 18 months compressing the model using a combination of quantisation, pruning, and knowledge distillation techniques to achieve real-time inference on consumer hardware. Battery impact, Apple says, is minimal — roughly equivalent to streaming a video at 1080p.",
    "Beyond the privacy angle, the new Siri introduces what Apple calls 'App Intent Chaining' — the ability to orchestrate complex tasks across multiple installed applications without requiring developers to rewrite a single line of code. An early demo showed Siri pulling a flight number from an email, checking the airline's app for real-time gate information, and automatically updating a calendar event — in under three seconds.",
    "Developer reaction has been largely positive, though some expressed frustration at Apple's tight vertical integration. \"It's impressive, but it only works this seamlessly because Apple controls the entire stack,\" said one prominent iOS developer on social media. \"Android users are going to have a very different experience with equivalent on-device models.\"",
    "Apple also announced that the new Siri would support over 40 languages at launch, with dedicated dialect support for 12 additional regional variants. Sri Lanka's Sinhala and Tamil languages are both included in the launch lineup — a first for any major AI assistant.",
    "The update will be available as part of iOS 20, iPadOS 20, and macOS Tahoe, all shipping to existing A17 Pro and later devices in September 2026. Older devices will receive a cloud-assisted version with reduced capabilities.",
  ],
  alsoReportedBy: [
    { source: "The Verge", title: "Apple's new Siri is actually impressive — and it all runs on your phone", timeAgo: "1h ago", url: "#" },
    { source: "Wired", title: "WWDC 2026: The on-device AI revolution Apple has been quietly building", timeAgo: "2h ago", url: "#" },
    { source: "BBC Technology", title: "Apple puts privacy at heart of new AI assistant overhaul", timeAgo: "3h ago", url: "#" },
  ],
  comments: [
    {
      id: 1,
      username: "Ravindra_K",
      initials: "RK",
      avatarColor: "from-violet-500 to-purple-700",
      timeAgo: "12m ago",
      text: "This is genuinely impressive. The fact that it runs entirely offline means Apple is miles ahead on privacy. Google and Microsoft have a lot of catching up to do.",
      likes: 47,
    },
    {
      id: 2,
      username: "TechWatcher_SL",
      initials: "TW",
      avatarColor: "from-blue-500 to-cyan-600",
      timeAgo: "28m ago",
      text: "The Sinhala language support is huge for us. Finally an AI assistant that can actually understand Sri Lankan names and places correctly!",
      likes: 89,
    },
    {
      id: 3,
      username: "Priya_M",
      initials: "PM",
      avatarColor: "from-rose-500 to-pink-600",
      timeAgo: "41m ago",
      text: "Interesting but I'll believe it when I see independent benchmarks. Apple has a history of promising things in demos that don't quite hold up in real-world use.",
      likes: 23,
    },
  ],
};

// ─── Category Metadata ─────────────────────────────────────────────────────────
export const categoryMeta: Record<string, CategoryMeta> = {
  politics: {
    slug: "politics",
    label: "Politics",
    description: "In-depth coverage of Sri Lankan and global political developments, parliament, governance, and international affairs.",
    icon: "🏛️",
    gradientFrom: "from-purple-900/60",
    gradientTo: "to-purple-600/20",
    subFilters: ["All", "Parliament", "Governance", "International", "Elections"],
    articleCount: 284,
  },
  business: {
    slug: "business",
    label: "Business",
    description: "Markets, economy, companies, and the financial forces shaping Sri Lanka and the world.",
    icon: "📈",
    gradientFrom: "from-emerald-900/60",
    gradientTo: "to-emerald-600/20",
    subFilters: ["All", "Economy", "Markets", "Companies", "Startups"],
    articleCount: 317,
  },
  sports: {
    slug: "sports",
    label: "Sports",
    description: "Cricket, football, athletics and all the sporting moments that move the nation.",
    icon: "🏏",
    gradientFrom: "from-orange-900/60",
    gradientTo: "to-orange-600/20",
    subFilters: ["All", "Cricket", "Football", "Athletics", "Other Sports"],
    articleCount: 198,
  },
  tech: {
    slug: "tech",
    label: "Tech",
    description: "AI, gadgets, software, startups, and the technology trends redefining how we live and work.",
    icon: "💻",
    gradientFrom: "from-blue-900/60",
    gradientTo: "to-blue-600/20",
    subFilters: ["All", "AI & ML", "Gadgets", "Startups", "Cybersecurity"],
    articleCount: 256,
  },
  climate: {
    slug: "climate",
    label: "Climate",
    description: "Environment, climate change, sustainability, and the planet's most urgent crisis.",
    icon: "🌿",
    gradientFrom: "from-teal-900/60",
    gradientTo: "to-teal-600/20",
    subFilters: ["All", "Climate Crisis", "Renewables", "Policy", "Disasters"],
    articleCount: 142,
  },
  entertainment: {
    slug: "entertainment",
    label: "Entertainment",
    description: "Movies, music, television, celebrity news and culture from Sri Lanka and beyond.",
    icon: "🎬",
    gradientFrom: "from-pink-900/60",
    gradientTo: "to-pink-600/20",
    subFilters: ["All", "Movies", "Music", "Television", "Celebrity"],
    articleCount: 176,
  },
};

// ─── Most Read ─────────────────────────────────────────────────────────────────
export const mostReadArticles = [
  { id: 5, title: "Sri Lanka Crushes Pakistan in T20 Final, Clinches Asia Cup Title", source: "ESPN Cricinfo", timeAgo: "3h ago" },
  { id: 13, title: "OpenAI Launches GPT-5 with Real-Time Web Browsing", source: "The Verge", timeAgo: "11h ago" },
  { id: 14, title: "President Announces Cabinet Reshuffle — Three Ministers Replaced", source: "Hiru News", timeAgo: "12h ago" },
  { id: 2, title: "Apple Unveils AI-Powered Siri Overhaul at WWDC 2026", source: "TechCrunch", timeAgo: "45m ago" },
  { id: 15, title: "Bollywood Star Signs Record Rs. 500Cr Film Deal with Netflix", source: "Variety", timeAgo: "13h ago" },
];

// ─── Trending Topics ───────────────────────────────────────────────────────────
export const trendingTopics: TrendingTopic[] = [
  { id: 1, rank: 1, topic: "IMF Sri Lanka", articleCount: 142, category: "Business" },
  { id: 2, rank: 2, topic: "Asia Cup 2026", articleCount: 98, category: "Sports" },
  { id: 3, rank: 3, topic: "AI Regulation", articleCount: 76, category: "Tech" },
  { id: 4, rank: 4, topic: "Monsoon Floods", articleCount: 54, category: "Climate" },
  { id: 5, rank: 5, topic: "Parliament Session", articleCount: 41, category: "Politics" },
];

// ─── Style Maps ────────────────────────────────────────────────────────────────
export const categoryColors: Record<string, string> = {
  All: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Politics: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Business: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Sports: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Tech: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Climate: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Entertainment: "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

export const sentimentStyles: Record<Sentiment, { label: string; classes: string }> = {
  Positive: { label: "Positive", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  Negative: { label: "Negative", classes: "bg-red-500/15 text-red-400 border-red-500/30" },
  Neutral: { label: "Neutral", classes: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};
