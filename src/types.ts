export interface BibleVerse {
  ref: string;
  text: string;
  theme?: string;
}

export interface QuestionItem {
  id: string;
  number: number;
  question: string;
  summary: string;
  tractQuote: string;
  biblicalAnswer: string;
  bibleVerses: BibleVerse[];
  practicalSteps?: string[];
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  description: string;
  highlights: string[];
  isFeatured?: boolean;
}

export interface TestimonialItem {
  id: string;
  title: string;
  person: string;
  type: 'tervenemine' | 'vabanemine' | 'poordumine';
  summary: string;
  fullStory?: string;
  youtubeId?: string; // e.g. "dQw4w9WgXcQ"
  youtubeUrl?: string;
}

export interface SupportInfo {
  title: string;
  subtitle: string;
  description: string;
  recipientName: string;
  iban: string;
  bankName: string;
  swift: string;
  reference: string;
  explanation: string;
  supportGoals: string[];
}

export interface LordPrayerInfo {
  title: string;
  subtitle: string;
  intro: string;
  text: string;
  ref: string;
}

export interface SiteContent {
  brandName: string;
  brandTagline: string;
  contactEmail: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  coreVerses: BibleVerse[];
  tractQuestions: QuestionItem[];
  cleanlinessTitle: string;
  cleanlinessSubtitle: string;
  cleanlinessDescription: string;
  cleanlinessSteps: { title: string; desc: string }[];
  testimonials: TestimonialItem[];
  publisherStoryTitle: string;
  publisherStoryText: string;
  books: BookItem[];
  support: SupportInfo;
  salvationPrayerTitle: string;
  salvationPrayerSubtitle: string;
  salvationPrayerIntro: string;
  salvationPrayerText: string;
  salvationPrayerNextSteps: { title: string; desc: string }[];
  lordPrayer: LordPrayerInfo;
}
