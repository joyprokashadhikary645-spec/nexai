// src/lib/toolConfig.ts

export interface ToolConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  topicLabel: string;
  topicPlaceholder: string;
  showTone: boolean;
  showLength: boolean;
  showDescription: boolean;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  isTextArea: boolean;
  submitLabel: string;
}

export const TOOL_CONFIGS: { [key: string]: ToolConfig } = {
  'content-writer': {
    id: 'content-writer',
    title: 'Content Writer',
    icon: '',
    description: 'Create high-quality content on any topic',
    topicLabel: 'Topic',
    topicPlaceholder: 'e.g. Healthy lifestyle tips',
    showTone: true,
    showLength: false,
    showDescription: false,
    descriptionLabel: '',
    descriptionPlaceholder: '',
    isTextArea: false,
    submitLabel: 'Generate Content',
  },
  'blog-generator': {
    id: 'blog-generator',
    title: 'Blog Generator',
    icon: '',
    description: 'Write a complete blog post',
    topicLabel: 'Blog Title',
    topicPlaceholder: 'e.g. Easy ways to start freelancing',
    showTone: true,
    showLength: false,
    showDescription: true,
    descriptionLabel: 'Short Description (optional)',
    descriptionPlaceholder: 'Briefly note what points the blog should cover',
    isTextArea: false,
    submitLabel: 'Generate Blog',
  },
  'email-generator': {
    id: 'email-generator',
    title: 'Email Generator',
    icon: '',
    description: 'Write professional emails',
    topicLabel: 'Email Type',
    topicPlaceholder: 'e.g. Job application, meeting schedule, follow-up',
    showTone: true,
    showLength: false,
    showDescription: true,
    descriptionLabel: 'Details',
    descriptionPlaceholder: 'What information should the email include?',
    isTextArea: false,
    submitLabel: 'Generate Email',
  },
  'facebook-post': {
    id: 'facebook-post',
    title: 'Facebook Post Generator',
    icon: '',
    description: 'Write engaging Facebook posts',
    topicLabel: 'Post Topic',
    topicPlaceholder: 'e.g. New product launch, sale offer',
    showTone: true,
    showLength: false,
    showDescription: false,
    descriptionLabel: '',
    descriptionPlaceholder: '',
    isTextArea: false,
    submitLabel: 'Generate Post',
  },
  'instagram-caption': {
    id: 'instagram-caption',
    title: 'Instagram Caption Generator',
    icon: '',
    description: 'Create trendy Instagram captions (AI adds hashtags & emojis itself)',
    topicLabel: 'Photo/Reel Topic',
    topicPlaceholder: 'e.g. Sunset photo, travel moment',
    showTone: false,
    showLength: false,
    showDescription: false,
    descriptionLabel: '',
    descriptionPlaceholder: '',
    isTextArea: false,
    submitLabel: 'Generate Caption',
  },
  'youtube-script': {
    id: 'youtube-script',
    title: 'YouTube Script Generator',
    icon: '',
    description: 'Write video scripts',
    topicLabel: 'Video Topic',
    topicPlaceholder: 'e.g. 5 productivity tips',
    showTone: true,
    showLength: false,
    showDescription: true,
    descriptionLabel: 'Video Length',
    descriptionPlaceholder: 'e.g. 5 minutes, 10 minutes',
    isTextArea: false,
    submitLabel: 'Generate Script',
  },
  'grammar-checker': {
    id: 'grammar-checker',
    title: 'Grammar Checker',
    icon: '',
    description: 'Fix grammar and spelling',
    topicLabel: 'Paste your text',
    topicPlaceholder: 'Paste your text here...',
    showTone: false,
    showLength: false,
    showDescription: false,
    descriptionLabel: '',
    descriptionPlaceholder: '',
    isTextArea: true,
    submitLabel: 'Check Text',
  },
  'resume-builder': {
    id: 'resume-builder',
    title: 'Resume Builder',
    icon: '',
    description: 'Build a professional, ATS-friendly resume',
    topicLabel: 'Job Title',
    topicPlaceholder: 'e.g. Software Engineer, Marketing Manager',
    showTone: false,
    showLength: false,
    showDescription: true,
    descriptionLabel: 'Experience, Skills & Education',
    descriptionPlaceholder: 'e.g. 3 years experience, React/Node.js skills, CSE graduate',
    isTextArea: false,
    submitLabel: 'Generate Resume',
  },
};
