export interface BibleVerse {
  ref: string;
  text: string;
  theme?: string;
  isPrimary?: boolean;
}

export interface QuestionItem {
  id: string;
  number: number;
  question: string;
  fullText: string;
  summary?: string;
  tractQuote?: string;
  biblicalAnswer?: string;
  bibleVerses?: BibleVerse[];
  practicalSteps?: string[];
  category?: 'hook' | 'theological' | 'practical';
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  price?: number;
  description: string;
  highlights: string[];
  coverImage?: string; // Image data URL or file URL
  isFeatured?: boolean;
  isPreOrder?: boolean;
  preOrderNote?: string;
  releaseDate?: string;
}

export interface OrderItem {
  id: string;
  type: 'order' | 'preorder';
  bookId: string;
  bookTitle: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  status: 'uus' | 'kinnitatud' | 'postitatud' | 'täidetud' | 'tühistatud';
  createdAt: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  author?: string;
  category: string;
  description: string;
  fileSize?: string;
  pages?: number;
  pdfUrl?: string; // Base64 data URL or external URL
  fileName?: string;
  uploadedAt: string;
  downloadCount?: number;
  contentPages?: {
    pageNumber: number;
    heading: string;
    text: string;
  }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export interface TestimonialItem {
  id: string;
  title: string;
  person: string;
  type: 'tervenemine' | 'vabanemine' | 'poordumine';
  summary: string;
  fullStory?: string;
  image?: string;
  facebookUrl?: string;
  facebookPageTitle?: string;
  date?: string;
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
  paypalEmail?: string;
  paypalNote?: string;
  bookSalesNote?: string;
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
  primaryVerse: BibleVerse;
  coreVerses: BibleVerse[];
  centralQuestions: QuestionItem[];
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
  en?: Partial<SiteContent>;
}
