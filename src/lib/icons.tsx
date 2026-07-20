// src/lib/icons.tsx
//
// emoji-এর বদলে ব্যবহারের জন্য কেন্দ্রীয় lucide-react আইকন ম্যাপিং।

import {
  MessageSquare,
  Image as ImageIcon,
  PenLine,
  FileText,
  Code2,
  Languages,
  CheckCircle2,
  Mail,
  ThumbsUp,
  Camera,
  Clapperboard,
  File,
  ClipboardList,
  Briefcase,
  Smile,
  Handshake,
  Sparkles,
  Laugh,
  Rocket,
  type LucideIcon,
} from 'lucide-react';

export const TOOL_ICONS: Record<string, LucideIcon> = {
  chat: MessageSquare,
  'image-generator': ImageIcon,
  'content-writer': PenLine,
  'blog-generator': FileText,
  'code-generator': Code2,
  translator: Languages,
  'grammar-checker': CheckCircle2,
  'email-generator': Mail,
  'facebook-post': ThumbsUp,
  'instagram-caption': Camera,
  'youtube-script': Clapperboard,
  'document-summarizer': File,
  'resume-builder': ClipboardList,
};

export const TONE_ICONS: Record<string, LucideIcon> = {
  professional: Briefcase,
  casual: Smile,
  friendly: Handshake,
  formal: Briefcase,
  creative: Sparkles,
  humorous: Laugh,
  motivational: Rocket,
};
