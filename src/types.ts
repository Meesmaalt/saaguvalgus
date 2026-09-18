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
  description: string;
  highlights: string[];
  isFeatured?: boolean;
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
  salvationPrayerTitle: string;
  salvationPrayerSubtitle: string;
  salvationPrayerIntro: string;
  salvationPrayerText: string;
  salvationPrayerNextSteps: { title: string; desc: string }[];
  books: BookItem[];
}
