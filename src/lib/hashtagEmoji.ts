// src/lib/hashtagEmoji.ts

import { HASHTAG_SUGGESTIONS, EMOJI_SUGGESTIONS } from './constants';

type HashtagCategory = keyof typeof HASHTAG_SUGGESTIONS;
type EmojiCategory = keyof typeof EMOJI_SUGGESTIONS;

// টুল টাইপ অনুযায়ী hashtag ক্যাটাগরি ম্যাপিং
const TOOL_HASHTAG_MAP: Record<string, HashtagCategory> = {
  'facebook-post': 'facebook',
  'instagram-caption': 'instagram',
  'youtube-script': 'youtube',
  'blog-generator': 'blog',
  'code-generator': 'code',
  'email-generator': 'email',
};

// টুল টাইপ অনুযায়ী emoji ক্যাটাগরি ম্যাপিং
const TOOL_EMOJI_MAP: Record<string, EmojiCategory> = {
  'facebook-post': 'positive',
  'instagram-caption': 'positive',
  'youtube-script': 'creative',
  'blog-generator': 'neutral',
  'email-generator': 'business',
  'content-writer': 'neutral',
};

// কয়েকটি র‍্যান্ডম আইটেম নির্বাচন করুন
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

interface EnhanceOptions {
  content: string;
  toolType: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
}

// কন্টেন্টে hashtag এবং emoji যোগ করুন (যদি ব্যবহারকারী চেয়ে থাকে)
export function enhanceContent({
  content,
  toolType,
  includeHashtags,
  includeEmojis,
}: EnhanceOptions): { content: string; hashtags: string; emojis: string } {
  let finalContent = content;
  let hashtagsUsed = '';
  let emojisUsed = '';

  // Emoji যোগ করুন (কন্টেন্টের শুরুতে একটি, শেষে দুটি)
  if (includeEmojis) {
    const emojiCategory = TOOL_EMOJI_MAP[toolType] || 'positive';
    const emojis = pickRandom(EMOJI_SUGGESTIONS[emojiCategory], 3);
    emojisUsed = emojis.join(' ');
    finalContent = `${emojis[0]} ${finalContent}\n\n${emojis.slice(1).join(' ')}`;
  }

  // Hashtag যোগ করুন (কন্টেন্টের একদম শেষে)
  if (includeHashtags) {
    const hashtagCategory = TOOL_HASHTAG_MAP[toolType] || 'general';
    const hashtags = pickRandom(
      HASHTAG_SUGGESTIONS[hashtagCategory] || HASHTAG_SUGGESTIONS.general,
      5
    );
    hashtagsUsed = hashtags.join(' ');
    finalContent = `${finalContent}\n\n${hashtagsUsed}`;
  }

  return { content: finalContent, hashtags: hashtagsUsed, emojis: emojisUsed };
}
