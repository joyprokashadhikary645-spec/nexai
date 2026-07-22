// src/lib/i18n.ts
//
// হালকা-ওজনের i18n ডিকশনারি। নতুন ভাষা/স্ট্রিং যোগ করতে চাইলে
// নিচের অবজেক্টে একটা key-এর জন্য প্রতিটা ভাষায় মান যোগ করুন।

export type LanguageCode = 'en' | 'bn';

export const translations = {
  // ---------- Sidebar ----------
  newChat: { en: 'New Chat', bn: 'নতুন চ্যাট' },
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  aiChat: { en: 'AI Chat', bn: 'এআই চ্যাট' },
  history: { en: 'History', bn: 'হিস্ট্রি' },
  favorites: { en: 'Favorites', bn: 'ফেভারিট' },
  aiTools: { en: 'AI Tools', bn: 'এআই টুলস' },
  upgradeToPro: { en: 'Upgrade to Pro', bn: 'প্রো-তে আপগ্রেড করুন' },
  upgradeDesc: { en: 'Unlock more features and higher usage limits', bn: 'আরও ফিচার ও বেশি ব্যবহারের সুযোগ আনলক করুন' },
  upgradeNow: { en: 'Upgrade Now', bn: 'এখনই আপগ্রেড করুন' },
  profile: { en: 'Profile', bn: 'প্রোফাইল' },
  settings: { en: 'Settings', bn: 'সেটিংস' },
  freePlan: { en: 'Free Plan', bn: 'ফ্রি প্ল্যান' },

  // ---------- Settings page ----------
  settingsTitle: { en: 'Settings', bn: 'সেটিংস' },
  appearance: { en: 'Appearance', bn: 'থিম' },
  lightMode: { en: 'Light Mode', bn: 'লাইট মোড' },
  darkMode: { en: 'Dark Mode', bn: 'ডার্ক মোড' },
  language: { en: 'Language', bn: 'ভাষা' },
  languageDesc: { en: 'The app interface and AI tools will use this language', bn: 'অ্যাপের পুরো ইন্টারফেস এবং এআই টুলস এই ভাষায় দেখাবে' },
  notifications: { en: 'Notifications', bn: 'নোটিফিকেশন' },
  emailNotifications: { en: 'Email notifications', bn: 'ইমেইল নোটিফিকেশন' },
  subscription: { en: 'Subscription', bn: 'সাবস্ক্রিপশন' },
  tokensPerMonth: { en: 'tokens/month', bn: 'টোকেন/মাস' },
  active: { en: 'Active', bn: 'সক্রিয়' },
  saveChanges: { en: 'Save Changes', bn: 'পরিবর্তন সংরক্ষণ করুন' },
  languageSaved: { en: 'Language updated', bn: 'ভাষা পরিবর্তন হয়েছে' },

  // ---------- Profile page ----------
  profileTitle: { en: 'Profile', bn: 'প্রোফাইল' },
  editProfile: { en: 'Edit Profile', bn: 'প্রোফাইল এডিট করুন' },
  cancel: { en: 'Cancel', bn: 'বাতিল' },
  bio: { en: 'Bio', bn: 'বায়ো' },
  noBio: { en: 'No bio added yet.', bn: 'এখনো কোনো বায়ো যোগ করা হয়নি।' },
  fullName: { en: 'Full Name', bn: 'পুরো নাম' },
  bioPlaceholder: { en: 'Tell us about yourself...', bn: 'নিজের সম্পর্কে কিছু লিখুন...' },
  accountInfo: { en: 'Account Information', bn: 'অ্যাকাউন্ট তথ্য' },
  email: { en: 'Email', bn: 'ইমেইল' },
  role: { en: 'Role', bn: 'রোল' },
  changePhoto: { en: 'Change Photo', bn: 'ছবি পরিবর্তন করুন' },
  photoUpdated: { en: 'Profile photo updated', bn: 'প্রোফাইল ছবি পরিবর্তন হয়েছে' },
  photoTooLarge: { en: 'Please choose an image under 3MB', bn: 'অনুগ্রহ করে ৩MB এর কম সাইজের ছবি দিন' },
  photoInvalidType: { en: 'Please choose an image file', bn: 'অনুগ্রহ করে একটা ছবি ফাইল নির্বাচন করুন' },

  // ---------- Dashboard home ----------
  welcomeBack: { en: 'Welcome back', bn: 'ফিরে আসার জন্য স্বাগতম' },
  whatToCreate: { en: 'What would you like to create today?', bn: 'আজ কী তৈরি করতে চান?' },
  startNewChat: { en: 'Start a New Chat', bn: 'নতুন চ্যাট শুরু করুন' },
  statTotalChats: { en: 'Total Chats', bn: 'মোট চ্যাট' },
  statContentCreated: { en: 'Content Created', bn: 'তৈরি করা কন্টেন্ট' },
  statTranslations: { en: 'Translations', bn: 'অনুবাদ' },
  statTokensUsed: { en: 'Tokens Used', bn: 'ব্যবহৃত টোকেন' },
  allAiTools: { en: 'All AI Tools', bn: 'সব এআই টুলস' },
  viewAll: { en: 'View All →', bn: 'সব দেখুন →' },

  // ---------- Tools listing page ----------
  toolsPageTitle: { en: 'AI Tools', bn: 'এআই টুলস' },
  toolsPageDesc: { en: 'All the tools you need in one place', bn: 'যা যা লাগবে, সব এক জায়গায়' },

  // ---------- Chat page ----------
  helloUser: { en: 'Hello', bn: 'হ্যালো' },
  howCanIHelp: { en: 'How can I help you today?', bn: 'আজ আপনাকে কীভাবে সাহায্য করতে পারি?' },
  typeYourMessage: { en: 'Type your message...', bn: 'আপনার মেসেজ লিখুন...' },
  typeMessageHint: { en: 'Type your message... (Enter to send, Shift+Enter for new line)', bn: 'আপনার মেসেজ লিখুন... (পাঠাতে Enter, নতুন লাইনের জন্য Shift+Enter)' },
  send: { en: 'Send', bn: 'পাঠান' },
  explainWithExample: { en: 'Explain with an example', bn: 'একটা উদাহরণ দিয়ে বোঝান' },
  compareWithClassical: { en: 'Compare with classical computing', bn: 'ক্লাসিক্যালের সাথে তুলনা করুন' },
  applications: { en: 'Applications', bn: 'ব্যবহারিক প্রয়োগ' },
  chatDisclaimer: { en: 'NexAI can make mistakes. Please verify important information.', bn: 'NexAI ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করে নিন।' },
  newChatWelcome: { en: 'Ask me anything — I\u2019m here to help.', bn: 'যেকোনো কিছু জিজ্ঞাসা করুন — আমি সাহায্য করতে প্রস্তুত।' },
  welcomeToChatTitle: { en: 'Welcome to NexAI Chat', bn: 'NexAI চ্যাটে স্বাগতম' },
  welcomeToChatDesc: { en: 'Ask anything, get help with writing, or just have a conversation. I\u2019m here to help!', bn: 'যেকোনো কিছু জিজ্ঞাসা করুন, লেখায় সাহায্য নিন, অথবা শুধু গল্প করুন। আমি সাহায্য করতে প্রস্তুত!' },
  goodResponse: { en: 'Good response', bn: 'ভালো উত্তর' },
  badResponse: { en: 'Bad response', bn: 'খারাপ উত্তর' },

  // ---------- History / Favorites ----------
  historyTitle: { en: 'History', bn: 'হিস্ট্রি' },
  favoritesTitle: { en: 'Favorites', bn: 'ফেভারিট' },
  noHistoryYet: { en: 'No history yet.', bn: 'এখনো কোনো হিস্ট্রি নেই।' },
  noFavoritesYet: { en: 'No favorites yet.', bn: 'এখনো কোনো ফেভারিট নেই।' },
  chatHistoryTitle: { en: 'Chat History', bn: 'চ্যাট হিস্ট্রি' },
  loadingHistory: { en: 'Loading history...', bn: 'হিস্ট্রি লোড হচ্ছে...' },
  couldNotLoadHistory: { en: 'Could not load history', bn: 'হিস্ট্রি লোড করা যায়নি' },
  noChatsYet: { en: 'No chats yet', bn: 'এখনো কোনো চ্যাট নেই' },
  removedFromFavorites: { en: 'Removed from favorites', bn: 'ফেভারিট থেকে সরানো হয়েছে' },
  addedToFavorites: { en: 'Added to favorites', bn: 'ফেভারিটে যোগ হয়েছে' },
  operationFailed: { en: 'Operation failed', bn: 'কাজটি করা যায়নি' },
  confirmDeleteChat: { en: 'Are you sure you want to delete this chat?', bn: 'আপনি কি নিশ্চিত এই চ্যাটটি ডিলিট করতে চান?' },
  chatDeleted: { en: 'Chat deleted', bn: 'চ্যাট ডিলিট হয়েছে' },
  deleteFailed: { en: 'Delete failed', bn: 'ডিলিট করা যায়নি' },
  favoriteChatsTitle: { en: 'Favorite Chats', bn: 'ফেভারিট চ্যাট' },
  loadingFavorites: { en: 'Loading favorites...', bn: 'ফেভারিট লোড হচ্ছে...' },
  couldNotLoadData: { en: 'Could not load data', bn: 'ডেটা লোড করা যায়নি' },
  chatsTab: { en: 'Chats', bn: 'চ্যাট' },
  contentTab: { en: 'Content', bn: 'কন্টেন্ট' },
  loadingGeneric: { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  noSavedChatsYet: { en: 'No saved chats yet', bn: 'এখনো কোনো সেভ করা চ্যাট নেই' },
  noSavedContentYet: { en: 'No saved content yet', bn: 'এখনো কোনো সেভ করা কন্টেন্ট নেই' },

  // ---------- Generator form (shared across content/blog/email/social/resume tools) ----------
  topicLabel: { en: 'Topic', bn: 'বিষয়' },
  topicPlaceholder: { en: 'What is this about?', bn: 'এটা কী নিয়ে?' },
  descriptionLabel: { en: 'Description', bn: 'বিস্তারিত' },
  descriptionPlaceholder: { en: 'Add more details...', bn: 'আরও বিস্তারিত লিখুন...' },
  toneLabel: { en: 'Tone', bn: 'টোন' },
  languageLabel: { en: 'Output Language', bn: 'আউটপুট ভাষা' },
  generateButton: { en: 'Generate', bn: 'জেনারেট করুন' },
  generatingButton: { en: 'Generating...', bn: 'জেনারেট হচ্ছে...' },
  copyButton: { en: 'Copy', bn: 'কপি করুন' },
  copiedToast: { en: 'Copied to clipboard', bn: 'ক্লিপবোর্ডে কপি হয়েছে' },
  regenerateButton: { en: 'Regenerate', bn: 'আবার জেনারেট করুন' },
  yourResult: { en: 'Your Result', bn: 'আপনার ফলাফল' },
  generatedSuccess: { en: 'Generated successfully!', bn: 'সফলভাবে জেনারেট হয়েছে!' },
  generationFailed: { en: 'Generation failed', bn: 'জেনারেট করা যায়নি' },
  addHashtags: { en: 'Add Hashtags', bn: 'হ্যাশট্যাগ যোগ করুন' },
  addEmojis: { en: 'Add Emojis', bn: 'ইমোজি যোগ করুন' },
  resultPlaceholder: { en: 'Your result will appear here', bn: 'আপনার ফলাফল এখানে দেখাবে' },

  // ---------- AI tool names & descriptions (used on dashboard + tools listing) ----------
  tool_chat_name: { en: 'AI Chat', bn: 'এআই চ্যাট' },
  tool_chat_desc: { en: 'Get answers to all your questions', bn: 'আপনার সব প্রশ্নের উত্তর পান' },
  tool_image_generator_name: { en: 'Image Generator', bn: 'ছবি জেনারেটর' },
  tool_image_generator_desc: { en: 'Create AI images from text descriptions', bn: 'লেখা থেকে এআই ছবি তৈরি করুন' },
  tool_content_writer_name: { en: 'Content Writer', bn: 'কন্টেন্ট রাইটার' },
  tool_content_writer_desc: { en: 'Create high-quality content', bn: 'উচ্চমানের কন্টেন্ট তৈরি করুন' },
  tool_blog_generator_name: { en: 'Blog Generator', bn: 'ব্লগ জেনারেটর' },
  tool_blog_generator_desc: { en: 'Write complete blog posts', bn: 'সম্পূর্ণ ব্লগ পোস্ট লিখুন' },
  tool_code_generator_name: { en: 'Code Generator', bn: 'কোড জেনারেটর' },
  tool_code_generator_desc: { en: 'Write code in any programming language', bn: 'যেকোনো প্রোগ্রামিং ভাষায় কোড লিখুন' },
  tool_translator_name: { en: 'Language Translator', bn: 'ভাষা অনুবাদক' },
  tool_translator_desc: { en: 'Translate into 25+ languages', bn: '২৫+ ভাষায় অনুবাদ করুন' },
  tool_grammar_checker_name: { en: 'Grammar Checker', bn: 'গ্রামার চেকার' },
  tool_grammar_checker_desc: { en: 'Fix grammar and spelling', bn: 'গ্রামার ও বানান ঠিক করুন' },
  tool_email_generator_name: { en: 'Email Generator', bn: 'ইমেইল জেনারেটর' },
  tool_email_generator_desc: { en: 'Write professional emails', bn: 'পেশাদার ইমেইল লিখুন' },
  tool_facebook_post_name: { en: 'Facebook Post Generator', bn: 'ফেসবুক পোস্ট জেনারেটর' },
  tool_facebook_post_desc: { en: 'Write engaging Facebook posts', bn: 'আকর্ষণীয় ফেসবুক পোস্ট লিখুন' },
  tool_instagram_caption_name: { en: 'Instagram Caption', bn: 'ইনস্টাগ্রাম ক্যাপশন' },
  tool_instagram_caption_desc: { en: 'Create trendy Instagram captions', bn: 'ট্রেন্ডি ইনস্টাগ্রাম ক্যাপশন তৈরি করুন' },
  tool_youtube_script_name: { en: 'YouTube Script', bn: 'ইউটিউব স্ক্রিপ্ট' },
  tool_youtube_script_desc: { en: 'Write video scripts', bn: 'ভিডিও স্ক্রিপ্ট লিখুন' },
  tool_document_summarizer_name: { en: 'Document Summarizer', bn: 'ডকুমেন্ট সারাংশ' },
  tool_document_summarizer_desc: { en: 'Summarize long documents', bn: 'বড় ডকুমেন্টের সারাংশ তৈরি করুন' },
  tool_resume_builder_name: { en: 'Resume Builder', bn: 'রিজিউম বিল্ডার' },
  tool_resume_builder_desc: { en: 'Build a professional resume', bn: 'পেশাদার রিজিউম তৈরি করুন' },
} as const;

export type TranslationKey = keyof typeof translations;

export function translate(key: TranslationKey, lang: LanguageCode): string {
  const entry = translations[key];
  if (!entry) return String(key);
  return entry[lang] ?? entry.en;
}

export function translateTool(
  toolId: string,
  field: 'name' | 'desc',
  lang: LanguageCode,
  fallback: string
): string {
  const key = `tool_${toolId.replace(/-/g, '_')}_${field}` as TranslationKey;
  const entry = (translations as Record<string, { en: string; bn: string }>)[key];
  if (!entry) return fallback;
  return entry[lang] ?? fallback;
}
