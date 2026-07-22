// src/lib/constants.ts

// ==================== AI TOOLS ====================
export const AI_TOOLS = [
  {
    id: 'chat',
    name: 'AI Chat',
    icon: '💬',
    description: 'Get answers to all your questions',
    path: '/dashboard/tools/chat',
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    icon: '🎨',
    description: 'Create AI images from text descriptions',
    path: '/dashboard/tools/image-generator',
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    icon: '✍️',
    description: 'Create high-quality content',
    path: '/dashboard/tools/content-writer',
  },
  {
    id: 'blog-generator',
    name: 'Blog Generator',
    icon: '📝',
    description: 'Write complete blog posts',
    path: '/dashboard/tools/blog-generator',
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    icon: '💻',
    description: 'Write code in any programming language',
    path: '/dashboard/tools/code-generator',
  },
  {
    id: 'translator',
    name: 'Language Translator',
    icon: '🌍',
    description: 'Translate into 25+ languages',
    path: '/dashboard/tools/translator',
  },
  {
    id: 'grammar-checker',
    name: 'Grammar Checker',
    icon: '✓',
    description: 'Fix grammar and spelling',
    path: '/dashboard/tools/grammar-checker',
  },
  {
    id: 'email-generator',
    name: 'Email Generator',
    icon: '📧',
    description: 'Write professional emails',
    path: '/dashboard/tools/email-generator',
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post Generator',
    icon: '👍',
    description: 'Write engaging Facebook posts',
    path: '/dashboard/tools/facebook-post',
  },
  {
    id: 'instagram-caption',
    name: 'Instagram Caption',
    icon: '📸',
    description: 'Create trendy Instagram captions',
    path: '/dashboard/tools/instagram-caption',
  },
  {
    id: 'youtube-script',
    name: 'YouTube Script',
    icon: '🎬',
    description: 'Write video scripts',
    path: '/dashboard/tools/youtube-script',
  },
  {
    id: 'document-summarizer',
    name: 'Document Summarizer',
    icon: '📄',
    description: 'Summarize long documents',
    path: '/dashboard/tools/document-summarizer',
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    icon: '📋',
    description: 'Build a professional resume',
    path: '/dashboard/tools/resume-builder',
  },
];

// ==================== SUPPORTED LANGUAGES ====================
export const SUPPORTED_LANGUAGES = {
  // এশিয়ান ভাষা
  'bn': { name: 'Bengali (বাংলা)', nativeName: 'বাংলা', flag: '🇧🇩' },
  'hi': { name: 'Hindi (हिन्दी)', nativeName: 'हिन्दी', flag: '🇮🇳' },
  'ur': { name: 'Urdu (اردو)', nativeName: 'اردو', flag: '🇵🇰' },
  'ta': { name: 'Tamil (தமிழ்)', nativeName: 'தமிழ்', flag: '🇮🇳' },
  'te': { name: 'Telugu (తెలుగు)', nativeName: 'తెలుగు', flag: '🇮🇳' },
  'ml': { name: 'Malayalam (മലയാളം)', nativeName: 'മലയാളം', flag: '🇮🇳' },
  'gu': { name: 'Gujarati (ગુજરાતી)', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  'kn': { name: 'Kannada (ಕನ್ನಡ)', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  'ja': { name: 'Japanese (日本語)', nativeName: '日本語', flag: '🇯🇵' },
  'zh': { name: 'Chinese (中文)', nativeName: '中文', flag: '🇨🇳' },
  'ko': { name: 'Korean (한국어)', nativeName: '한국어', flag: '🇰🇷' },
  'th': { name: 'Thai (ไทย)', nativeName: 'ไทย', flag: '🇹🇭' },
  'vi': { name: 'Vietnamese (Tiếng Việt)', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  'id': { name: 'Indonesian (Bahasa Indonesia)', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  
  // ইউরোপীয় ভাষা
  'en': { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  'es': { name: 'Spanish (Español)', nativeName: 'Español', flag: '🇪🇸' },
  'fr': { name: 'French (Français)', nativeName: 'Français', flag: '🇫🇷' },
  'de': { name: 'German (Deutsch)', nativeName: 'Deutsch', flag: '🇩🇪' },
  'it': { name: 'Italian (Italiano)', nativeName: 'Italiano', flag: '🇮🇹' },
  'pt': { name: 'Portuguese (Português)', nativeName: 'Português', flag: '🇵🇹' },
  'pl': { name: 'Polish (Polski)', nativeName: 'Polski', flag: '🇵🇱' },
  'ru': { name: 'Russian (Русский)', nativeName: 'Русский', flag: '🇷🇺' },
  'uk': { name: 'Ukrainian (Українська)', nativeName: 'Українська', flag: '🇺🇦' },
  'nl': { name: 'Dutch (Nederlands)', nativeName: 'Nederlands', flag: '🇳🇱' },
  'sv': { name: 'Swedish (Svenska)', nativeName: 'Svenska', flag: '🇸🇪' },
  'tr': { name: 'Turkish (Türkçe)', nativeName: 'Türkçe', flag: '🇹🇷' },
  
  // মধ্যপ্রাচ্যীয় ভাষা
  'ar': { name: 'Arabic (العربية)', nativeName: 'العربية', flag: '🇸🇦' },
  'fa': { name: 'Persian (فارسی)', nativeName: 'فارسی', flag: '🇮🇷' },
};

// ==================== HASHTAGS (প্রি-সেট হ্যাশট্যাগ) ====================
export const HASHTAG_SUGGESTIONS = {
  // সামাজিক মাধ্যম
  'facebook': ['#Facebook', '#SocialMedia', '#Digital', '#Marketing', '#Community'],
  'instagram': ['#Instagram', '#SocialMedia', '#Trending', '#Creative', '#Digital'],
  'youtube': ['#YouTube', '#Video', '#Content', '#Creator', '#Subscribe'],
  'twitter': ['#Twitter', '#Social', '#Trending', '#News', '#Talk'],
  
  // কন্টেন্ট টাইপ
  'blog': ['#Blog', '#Writing', '#Content', '#Article', '#Tips'],
  'code': ['#Code', '#Programming', '#Development', '#Tech', '#Software'],
  'email': ['#Email', '#Business', '#Communication', '#Marketing'],
  'general': ['#AI', '#Tech', '#Innovation', '#Digital', '#Future'],
};

// ==================== EMOJI SUGGESTIONS ====================
export const EMOJI_SUGGESTIONS = {
  // ইতিবাচক আবেগ
  positive: ['😊', '😃', '😄', '😍', '🎉', '🎊', '👏', '🙌', '💪', '🚀'],
  
  // মধ্যপন্থী
  neutral: ['🤔', '😐', '👉', '👈', '⚡', '💡', '📌', '✨', '🔥'],
  
  // ব্যবসা
  business: ['💼', '📊', '📈', '💰', '🎯', '💻', '📱', '🔐', '✅'],
  
  // সৃজনশীলতা
  creative: ['🎨', '🖌️', '🎭', '📸', '🎬', '🎪', '🎸', '🎤'],
  
  // শিক্ষা
  education: ['📚', '📖', '✏️', '📝', '🎓', '👨‍🎓', '💡', '🔬'],
  
  // খাদ্য ও পানীয়
  food: ['🍔', '🍕', '🍜', '🍰', '☕', '🍷', '🥗', '🍱'],
};

// ==================== PRICING ====================
export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/month',
    features: [
      'Limited AI Chat',
      'Basic content generation',
      '100,000 tokens/month',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 0,
    period: '/month (Free Beta)',
    features: [
      'Unlimited AI Chat',
      'All content generators',
      '1,000,000 tokens/month',
      'Priority support',
      'Advanced analytics',
      'API access',
    ],
    cta: 'Try Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    period: '/custom',
    features: [
      'Everything in Pro',
      'Custom models',
      'Dedicated support',
      'SLA guarantee',
      'Team management',
      'White-label option',
    ],
    cta: 'Contact Us',
    popular: false,
  },
];

// ==================== TONE STYLES ====================
export const TONE_STYLES = [
  { id: 'professional', name: 'Professional', emoji: '💼' },
  { id: 'casual', name: 'Casual', emoji: '😊' },
  { id: 'friendly', name: 'Friendly', emoji: '🤝' },
  { id: 'formal', name: 'Formal', emoji: '🎩' },
  { id: 'creative', name: 'Creative', emoji: '✨' },
  { id: 'humorous', name: 'Humorous', emoji: '😂' },
  { id: 'motivational', name: 'Motivational', emoji: '🚀' },
];

// ==================== CONTENT LENGTH ====================
export const CONTENT_LENGTH = [
  { id: 'short', name: 'Short (100-200 words)', min: 100, max: 200 },
  { id: 'medium', name: 'Medium (300-500 words)', min: 300, max: 500 },
  { id: 'long', name: 'Long (800-1500 words)', min: 800, max: 1500 },
  { id: 'extra-long', name: 'Extra Long (2000+ words)', min: 2000, max: 5000 },
];

// ==================== API RATE LIMITS ====================
export const RATE_LIMITS = {
  free: {
    tokensPerMonth: 100000,
    requestsPerHour: 100,
    maxContextLength: 2000,
  },
  pro: {
    tokensPerMonth: 1000000,
    requestsPerHour: 1000,
    maxContextLength: 10000,
  },
  enterprise: {
    tokensPerMonth: 10000000,
    requestsPerHour: -1, // unlimited
    maxContextLength: 50000,
  },
};

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGES = {
  'UNAUTHORIZED': 'You are not authorized',
  'NOT_FOUND': 'Data not found',
  'INVALID_INPUT': 'Invalid input',
  'RATE_LIMITED': 'Too many requests. Please try again later.',
  'SERVER_ERROR': 'Server error. Please try again later.',
  'INSUFFICIENT_TOKENS': 'Insufficient tokens. Please upgrade.',
  'FILE_TOO_LARGE': 'File is too large. Keep it under 5MB.',
  'INVALID_FILE_TYPE': 'Unsupported file type',
};

// ==================== SUCCESS MESSAGES ====================
export const SUCCESS_MESSAGES = {
  'LOGIN_SUCCESS': 'Logged in successfully',
  'REGISTER_SUCCESS': 'Registration successful. Please verify your email.',
  'CONTENT_GENERATED': 'Content generated successfully',
  'CONTENT_SAVED': 'Content saved',
  'CONTENT_COPIED': 'Copied to clipboard',
  'TRANSLATION_SUCCESS': 'Translation successful',
  'DOCUMENT_UPLOADED': 'Document uploaded successfully',
};

// ==================== REGEX PATTERNS ====================
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// ==================== FILE TYPES ====================
export const ALLOWED_FILE_TYPES = {
  documents: ['.pdf', '.docx', '.txt', '.doc'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  videos: ['.mp4', '.avi', '.mov', '.mkv'],
};

// ==================== NAVIGATION ITEMS ====================
export const NAVIGATION = {
  public: [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  authenticated: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Chat', href: '/dashboard/chat' },
    { label: 'Tools', href: '/dashboard/tools' },
    { label: 'History', href: '/dashboard/history' },
    { label: 'Settings', href: '/dashboard/settings' },
  ],
  admin: [
    { label: 'Admin', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Subscriptions', href: '/admin/subscriptions' },
    { label: 'Settings', href: '/admin/settings' },
  ],
};
