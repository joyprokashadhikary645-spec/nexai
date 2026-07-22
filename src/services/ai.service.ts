// src/services/ai.service.ts
//
// এই সার্ভিস ৩টা AI প্রোভাইডার ব্যবহার করে (নির্ভরযোগ্যতা বাড়ানোর জন্য):
// ১. Google Gemini (প্রধান - দ্রুত ও স্থিতিশীল)
// ২. OpenRouter (ব্যাকআপ - Gemini ব্যর্থ হলে)
// ৩. Hugging Face (দ্বিতীয় ব্যাকআপ)
// তিনটাই ব্যর্থ হলে তখনই error দেখানো হয়।

import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const HF_API_KEY = process.env.HF_API_KEY;

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const HF_API_ENDPOINT = 'https://router.huggingface.co/v1/chat/completions';

const HF_TEXT_MODEL = 'meta-llama/Llama-3.3-70B-Instruct:fastest';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==================== প্রোভাইডার ১: Google Gemini ====================
async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key missing');

  const response = await axios.post(
    `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000,
    }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty response');
  return text;
}

// ==================== প্রোভাইডার ২: OpenRouter ====================
async function callOpenRouter(prompt: string): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API key missing');

  const response = await axios.post(
    OPENROUTER_ENDPOINT,
    {
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 25000,
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenRouter returned empty response');
  return text;
}

// ==================== প্রোভাইডার ৩: Hugging Face (শেষ ব্যাকআপ) ====================
async function callHuggingFace(prompt: string): Promise<string> {
  if (!HF_API_KEY) throw new Error('Hugging Face API key missing');

  const response = await axios.post(
    HF_API_ENDPOINT,
    {
      model: HF_TEXT_MODEL,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 28000,
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Hugging Face returned empty response');
  return text;
}

// ==================== মূল ফাংশন: একে একে ৩টা প্রোভাইডার চেষ্টা করে ====================
async function generateText(prompt: string): Promise<string> {
  const providers: { name: string; fn: () => Promise<string> }[] = [
    { name: 'Gemini', fn: () => callGemini(prompt) },
    { name: 'OpenRouter', fn: () => callOpenRouter(prompt) },
    { name: 'Hugging Face', fn: () => callHuggingFace(prompt) },
  ];

  let lastError: any;

  for (const provider of providers) {
    try {
      const result = await provider.fn();
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`${provider.name} failed:`, error.response?.data || error.message);
      await sleep(500); // পরের প্রোভাইডারে যাওয়ার আগে সংক্ষিপ্ত বিরতি
      continue;
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown'}`);
}

// ==================== স্ট্রিমিং (OpenAI-compatible SSE পার্স করে) ====================
async function* streamOpenAICompatible(
  endpoint: string,
  apiKey: string | undefined,
  model: string,
  prompt: string
): AsyncGenerator<string> {
  if (!apiKey) throw new Error('API key missing');

  const response = await axios.post(
    endpoint,
    {
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
      timeout: 30000,
    }
  );

  let buffer = '';
  for await (const chunk of response.data as AsyncIterable<Buffer>) {
    buffer += chunk.toString('utf-8');
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // অসম্পূর্ণ JSON চাংক — উপেক্ষা করুন
      }
    }
  }
}

// প্রধান স্ট্রিমিং জেনারেটর — OpenRouter → Hugging Face → (ব্যর্থ হলে) নন-স্ট্রিমিং ফলব্যাক
export async function* chatStream(prompt: string, language: string = 'en'): AsyncGenerator<string> {
  const fullPrompt = `You are a helpful AI assistant. Respond in ${langName(language)}.\n\nUser: ${prompt}`;

  try {
    let gotChunk = false;
    for await (const chunk of streamOpenAICompatible(
      OPENROUTER_ENDPOINT,
      OPENROUTER_API_KEY,
      'meta-llama/llama-3.3-70b-instruct:free',
      fullPrompt
    )) {
      gotChunk = true;
      yield chunk;
    }
    if (gotChunk) return;
  } catch (error: any) {
    console.error('OpenRouter stream failed:', error.response?.data || error.message);
  }

  try {
    let gotChunk = false;
    for await (const chunk of streamOpenAICompatible(HF_API_ENDPOINT, HF_API_KEY, HF_TEXT_MODEL, fullPrompt)) {
      gotChunk = true;
      yield chunk;
    }
    if (gotChunk) return;
  } catch (error: any) {
    console.error('Hugging Face stream failed:', error.response?.data || error.message);
  }

  // দুটো স্ট্রিমিং প্রোভাইডারই ব্যর্থ হলে — Gemini-সহ পুরোনো নন-স্ট্রিমিং পদ্ধতিতে ফলব্যাক,
  // পুরো উত্তরটা একবারে একটা "চাংক" হিসেবে পাঠানো হবে
  const text = await generateText(fullPrompt);
  yield text;
}

// ==================== ইউজারের এক্সাক্ট রিকোয়েস্ট মেনে চলার নির্দেশনা ====================
// ইউজার যদি টপিকের ভেতরে নির্দিষ্ট কিছু চায় (যেমন: নির্দিষ্ট শব্দসংখ্যা, এক লাইনে,
// শুধু একটা নির্দিষ্ট শব্দ/বাক্য, নির্দিষ্ট ফরম্যাট), তাহলে AI যেন নিজে থেকে বাড়তি কিছু
// জুড়ে না দিয়ে ঠিক ততটুকুই এবং ঠিক সেভাবেই output দেয়।
const HONOR_EXACT_REQUEST =
  'Important: Treat the input above as the user\'s exact request. If it specifies a particular length, word count, exact wording, or format (e.g. "one word", "one line", "just say X"), follow that precisely and do not add extra generic elaboration beyond what was asked. Only expand with your own generic content when the request is open-ended.';

// ==================== ভাষার নাম হেল্পার ====================
function langName(code: string): string {
  const names: { [key: string]: string } = {
    bn: 'Bengali', en: 'English', hi: 'Hindi', es: 'Spanish', fr: 'French',
    de: 'German', ar: 'Arabic', zh: 'Chinese', ja: 'Japanese', ru: 'Russian',
    pt: 'Portuguese', ur: 'Urdu', ta: 'Tamil', te: 'Telugu',
  };
  return names[code] || code;
}

export const aiService = {
  // ==================== CHAT ====================
  async chat(prompt: string, language: string = 'en'): Promise<string> {
    try {
      const fullPrompt = `You are a helpful AI assistant. Respond in ${langName(language)}.\n\nUser: ${prompt}`;
      return await generateText(fullPrompt);
    } catch (error) {
      throw new Error('Chat generation failed');
    }
  },

  // ==================== CONTENT WRITER ====================
  async generateContent(topic: string, tone: string = 'professional', language: string = 'en', hashtags: boolean = false, emojis: boolean = false): Promise<string> {
    try {
      let prompt = `Write a professional ${tone} article about: ${topic}.\nLanguage: ${langName(language)}.\nLength: 300-400 words (unless the topic itself specifies a different length).`;
      if (hashtags) prompt += '\nInclude 3-5 hashtags relevant specifically to this topic (#hashtag format) at the end.';
      if (emojis) prompt += '\nInclude relevant emojis naturally throughout, matching the topic.';
      prompt += `\n\n${HONOR_EXACT_REQUEST}\n\nReturn ONLY the article content itself. Do not add any introductory phrases like "Here is your article" or "Sure, here's...", no closing remarks, no notes, no markdown labels — just the final article text ready to publish.`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Content generation failed');
    }
  },

  // ==================== BLOG GENERATOR ====================
  async generateBlog(title: string, description: string, language: string = 'en', hashtags: boolean = false, emojis: boolean = false): Promise<string> {
    try {
      let prompt = `Write a complete blog post in ${langName(language)}:\nTitle: ${title}\nDescription: ${description}\n\nFormat:\n- Introduction (2-3 paragraphs)\n- Body (4-5 main points)\n- Conclusion (2-3 paragraphs)\n\nTotal: 800-1000 words (unless the title/description specifies a different length).`;
      if (hashtags) prompt += '\nInclude 3-5 hashtags relevant specifically to this topic (#hashtag format) at the end.';
      if (emojis) prompt += '\nInclude relevant emojis naturally throughout, matching the topic.';
      prompt += `\n\n${HONOR_EXACT_REQUEST}\n\nReturn ONLY the blog post itself. Do not add any introductory phrases like "Here is your blog post", no closing remarks, no notes — just the final blog content.`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Blog generation failed');
    }
  },

  // ==================== EMAIL GENERATOR ====================
  async generateEmail(type: string, details: string, language: string = 'en', hashtags: boolean = false, emojis: boolean = false): Promise<string> {
    try {
      let prompt = `Generate a professional ${type} email in ${langName(language)}:\nDetails: ${details}\n\nInclude:\n- Professional subject line\n- Greeting\n- Body (2-3 paragraphs)\n- Call to action\n- Sign-off`;
      if (emojis) prompt += '\nInclude a couple of relevant emojis naturally, matching the tone (keep it professional).';
      if (hashtags) prompt += '\nIf relevant, include 2-3 hashtags related to this topic at the end.';
      prompt += `\n\n${HONOR_EXACT_REQUEST}\n\nReturn ONLY the email itself. Do not add any introductory phrases like "Here is your email", no closing remarks, no notes — just the final email content.`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Email generation failed');
    }
  },

  // ==================== CODE GENERATOR ====================
  async generateCode(description: string, language: string = 'javascript'): Promise<string> {
    try {
      const prompt = `Generate ${language} code for: ${description}\n\nRequirements:\n- Clean and readable code\n- Proper comments\n- Error handling\n- Best practices\n\nReturn ONLY the code, no explanations before or after.`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Code generation failed');
    }
  },

  // ==================== TRANSLATOR ====================
  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    try {
      const prompt = `Translate the following text from ${langName(sourceLanguage)} to ${langName(targetLanguage)}. Return ONLY the translated text, nothing else:\n\n${text}`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Translation failed');
    }
  },

  // ==================== SUMMARIZER ====================
  async summarize(text: string): Promise<string> {
    try {
      const prompt = `Summarize the following text in 3-5 concise sentences:\n\n${text}`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Summarization failed');
    }
  },

  // ==================== GRAMMAR CHECKER ====================
  async checkGrammar(text: string, language: string = 'en'): Promise<string> {
    try {
      const prompt = `Check and fix all grammar and spelling mistakes in this text, and write the corrected result in ${langName(language)}. Return ONLY the corrected text, nothing else:\n\n"${text}"`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Grammar check failed');
    }
  },

  // ==================== FACEBOOK POST GENERATOR ====================
  async generateFacebookPost(topic: string, tone: string = 'casual', language: string = 'en', hashtags: boolean = false, emojis: boolean = false): Promise<string> {
    try {
      let prompt = `Create a ${tone} Facebook post in ${langName(language)} about: ${topic}\n\nTips:\n- Keep it engaging and shareable\n- Use line breaks for readability`;
      if (hashtags) prompt += '\nInclude 3-5 hashtags relevant specifically to this topic (#hashtag format) at the end.';
      if (emojis) prompt += '\nInclude relevant emojis naturally throughout, matching the topic.';
      prompt += `\n\n${HONOR_EXACT_REQUEST}\n\nReturn ONLY the post text itself. Do not add any introductory phrases like "Here is your post", no closing remarks, no notes — just the final post content.`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Facebook post generation failed');
    }
  },

  // ==================== INSTAGRAM CAPTION GENERATOR ====================
  async generateInstagramCaption(topic: string, hashtags: boolean = true, emojis: boolean = true, language: string = 'en'): Promise<string> {
    try {
      let prompt = `Create an Instagram caption in ${langName(language)} about: ${topic}`;
      if (hashtags) prompt += '\nInclude 5-8 relevant hashtags (#hashtag format) at the end.';
      if (emojis) prompt += '\nInclude relevant emojis naturally throughout (😊, 🎉, etc).';
      prompt += `\n\n${HONOR_EXACT_REQUEST}`;
      prompt += '\n\nReturn ONLY the caption itself. Do not add any introductory phrases like "Here is your caption", no closing remarks, no notes — just the final caption text.';
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Instagram caption generation failed');
    }
  },

  // ==================== YOUTUBE SCRIPT GENERATOR ====================
  async generateYoutubeScript(topic: string, duration: string = '10 minutes', language: string = 'en', hashtags: boolean = false, emojis: boolean = false): Promise<string> {
    try {
      let prompt = `Write a ${duration} YouTube video script in ${langName(language)} about: ${topic}\n\nFormat:\n- Hook (first 5 seconds)\n- Introduction\n- Main Content (sections)\n- Call to Action\n- Outro`;
      if (hashtags) prompt += '\nAt the end, include 3-5 hashtags relevant specifically to this video topic (#hashtag format), suitable for the video description.';
      if (emojis) prompt += '\nInclude relevant emojis naturally where fitting, matching the topic.';
      prompt += `\n\n${HONOR_EXACT_REQUEST}\n\nReturn ONLY the script itself. Do not add any introductory phrases like "Here is your script", no closing remarks, no notes — just the final script content.`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('YouTube script generation failed');
    }
  },

  // ==================== RESUME BUILDER ====================
  async generateResume(jobTitle: string, details: string, language: string = 'en'): Promise<string> {
    try {
      const prompt = `Create a professional resume in ${langName(language)} for the position: ${jobTitle}\n\nCandidate details: ${details}\n\nFormat:\n- Professional Summary (2-3 lines)\n- Key Skills (bullet points)\n- Work Experience\n- Education\n\nKeep it concise, ATS-friendly, and achievement-focused.\n\n${HONOR_EXACT_REQUEST}\n\nReturn ONLY the resume content itself. Do not add any introductory phrases like "Here is your resume", no closing remarks, no notes — just the final resume content.`;
      return await generateText(prompt);
    } catch (error) {
      throw new Error('Resume generation failed');
    }
  },

  // ==================== IMAGE GENERATOR (Pollinations AI - সম্পূর্ণ বিনামূল্যে, কোনো API Key লাগে না) ====================
  async generateImage(prompt: string): Promise<Buffer> {
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true`;

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Image generation error:', error);
      throw new Error('Image generation failed');
    }
  },
};
