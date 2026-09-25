export type GradeLevel = 'ilkokul' | 'ortaokul' | 'lise';

export type AIModelType = 
  | 'gemini-3.8-flash' 
  | 'gemini-3.1-pro-preview' 
  | 'gemini-3.1-flash-lite' 
  | 'gemini-3.6-flash-lite' 
  | 'gemini-3.7-flash-lite';

export type Subject = 
  | 'Matematik' 
  | 'Fen Bilimleri' 
  | 'Fizik' 
  | 'Kimya' 
  | 'Biyoloji' 
  | 'Türkçe & Edebiyat' 
  | 'Sosyal Bilgiler & Tarih' 
  | 'İngilizce' 
  | 'Kodlama & Robotik';

export type DayOfWeek = 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi' | 'Pazar';

export interface StudyTask {
  id: string;
  day: DayOfWeek;
  timeSlot: string;
  subject: Subject;
  topic: string;
  durationMinutes: number;
  isCompleted: boolean;
}

export interface AppSettings {
  speechRate: number;
  speechPitch: number;
  autoSpeak: boolean;
  continuousVoiceMode: boolean;
  soundEffects: boolean;
  simplicityMode?: boolean;
  customApiKey?: string;
}

export interface SubjectProgress {
  subject: Subject;
  completionPercentage: number;
  masteryLabel: string;
  accuracyPercentage: number;
  weakTopic?: string;
  completedTopicsCount: number;
  totalTopicsCount: number;
  color: {
    bar: string;
    bg: string;
    text: string;
    badge: string;
  };
}

export interface WeakTopicAnalysis {
  subject: Subject;
  topic: string;
  confidenceScore: number; // 0-100
  urgency: 'high' | 'medium' | 'low';
  suggestedAction: string;
  recommendedDay: DayOfWeek;
  durationMinutes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gradeLevel: GradeLevel;
  role?: 'ogrenci' | 'ogretmen' | 'veli';
  schoolLevel?: string;
  classGrade?: string;
  schoolName?: string;
  targetExam?: string;
  dailyGoalMinutes?: number;
  xp: number;
  level: number;
  streakDays: number;
  badges: string[]; // Badge IDs
  completedLessons: string[]; // Lesson IDs
  quizzesTaken: number;
  correctAnswersCount: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXp?: number;
  category: 'quiz' | 'coding' | 'lesson' | 'streak' | 'general';
  unlockedAt?: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  youtubeId: string;
  duration: string;
  instructor: string;
  description: string;
  keyPoints: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

export interface Quiz {
  title: string;
  topic: string;
  gradeLevel: GradeLevel;
  questions: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  boardContent?: string;
  timestamp: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export type ArticleCategory =
  | 'Sınav Stratejileri'
  | 'Verimli Çalışma'
  | 'Yapay Zeka & Teknoloji'
  | 'Maarif Modeli'
  | 'Bilim & Kodlama';

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  summary: string;
  content: string;
  keyTakeaways: string[];
  proTip: string;
  tags: string[];
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  featured?: boolean;
  generatedByAI?: boolean;
}
