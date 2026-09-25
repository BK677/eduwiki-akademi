import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Play,
  PlayCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Users,
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  ShoppingCart,
  Mic,
  Calendar,
  Code2,
  Brain,
  HelpCircle,
  X,
  Volume2,
  BookOpen,
  BookOpenCheck,
  Heart,
  Bookmark,
  Clock,
  Layers,
  Zap,
  Target,
  FileText,
  Star,
  Compass,
  Award
} from 'lucide-react';
import { CURATED_ARTICLES } from '../data/articlesData';
import { Article } from '../types';
import { ArticleReaderModal } from './articles/ArticleReaderModal';

export const LandingPage: React.FC = () => {
  const { openAuthModal } = useApp();
  const [activePreviewGrade, setActivePreviewGrade] = useState<'ilkokul' | 'ortaokul' | 'lise'>('ortaokul');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>('Tümü');

  const gradeToneExamples = {
    ilkokul: {
      title: 'İlkokul Anlatımı (3. Sınıf - Fen Bilimleri)',
      badge: '🎨 İlkokul (1-4. Sınıf)',
      toneDesc: 'Masalsı, sevimli emojiler ve oyunlaştırma dili:',
      aiQuote: '“Düşünsene küçük dostum! 🍎 Dünya kocaman ve sevgi dolu bir mıknatıs gibidir. Elindeki topu havaya fırlattığında Dünya onu çok sevdiği için kucağına geri çağırır! Hadi sen de bir silgi fırlat ve kucaklaşmayı gör!”',
      color: 'border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300',
    },
    ortaokul: {
      title: 'Ortaokul Anlatımı (8. Sınıf - LGS Odaklı)',
      badge: '🚀 Ortaokul (5-8. Sınıf / LGS)',
      toneDesc: 'Neden-sonuç ilişkisi, deneyler ve yeni nesil LGS ipuçları:',
      aiQuote: '“Harika bir soru şampiyon! 🌍 Kütle evrenin her yerinde sabittir, ancak ağırlık yerçekimi ivmesine göre değişir. Örneğin Ay’da yerçekimi 6 kat az olduğu için Dünya’da 60 kg olan bir astronot Ay’da sadece 10 kg ağırlık hisseder. LGS’de bu fark sıkça sorulur!”',
      color: 'border-pink-500/40 bg-pink-50/60 dark:bg-pink-950/20 text-pink-800 dark:text-pink-300',
    },
    lise: {
      title: 'Lise Anlatımı (12. Sınıf - YKS/AYT Odaklı)',
      badge: '🎓 Lise (9-12. Sınıf / YKS)',
      toneDesc: 'Akademik formüller, vektörel analiz ve derinlemesine soru çözümü:',
      aiQuote: '“Newton’un Evrensel Kütleçekim Kanununa göre F = G.(m₁·m₂)/r² bağıntısıyla modellenir. Potansiyel enerji integrali hesaplanırken referans noktasının sonsuz kabul edildiğini ve skaler korunum ilkelerini ÖSYM sorularında dikkatle uygulamalısın.”',
      color: 'border-purple-500/40 bg-purple-50/60 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300',
    },
  };

  const faqs = [
    {
      q: 'EduWiki Akademi MEB müfredatına tam uyumlu mu?',
      a: 'Evet, 1. sınıftan 12. sınıfa kadar tüm dersler, Milli Eğitim Bakanlığı (MEB) güncel müfredat kazanımları, LGS ve YKS soru standartlarına %100 uyumludur.',
    },
    {
      q: 'Web Speech API ile Sesli Etkileşim nasıl çalışır?',
      a: 'Öğrencilerimiz mikrofon butonuyla doğrudan Türkçe sorular sorabilir. Yapay zeka öğretmenimiz anlaşılır ve akıcı bir Türkçe diksiyonla sesli olarak yanıt verir.',
    },
    {
      q: 'Hangi Gemini modelleri platformda yer alıyor?',
      a: 'EduWiki Akademi; Gemini 3.1 Flash Lite, Gemini 3.6 Flash Lite, Gemini 3.7 Flash Lite, Gemini 3.8 Flash ve Gemini 3.1 Pro dahil en yeni nesil tüm yapay zeka modellerini destekler.',
    },
    {
      q: 'Haftalık Sürükle-Bırak Ders Çalışma Takvimi nedir?',
      a: 'Öğrencinin seviyesine ve hedefine (LGS, YKS, genel okul dersleri) göre yapay zekanın otomatik ders çalışma programı oluşturduğu ve görev kartlarının sürüklenebildiği interaktif planlayıcıdır.',
    },
    {
      q: '5 Soruluk Yapay Zeka Testleri nasıl üretilir?',
      a: 'Seçtiğiniz ders ve konuya özel olarak, yapay zeka müfredat kazanımlarına uygun 5 yeni nesil soru hazırlar. Öğrenci her sorudan sonra detaylı çözüm gerekçesini inceler.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors">
      {/* 1. TOP ANNOUNCEMENT & HOTLINE BAR (Derslig Banner - Screenshot 1) */}
      <div className="bg-[#e11d48] text-white text-xs font-semibold px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="mx-auto max-w-7xl w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="tel:02162370000"
              className="flex items-center gap-1.5 hover:text-pink-150 transition"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>0216 237 00 00</span>
            </a>
            <a
              href="mailto:iletisim@eduwikiakademi.com"
              className="hidden sm:flex items-center gap-1.5 hover:text-pink-150 transition"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>iletisim@eduwikiakademi.com</span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="hidden md:inline bg-white/20 px-2 py-0.5 rounded-full">
              ✨ 2026-2027 MEB Müfredatına Tam Uyumlu
            </span>
            <button
              onClick={() => openAuthModal('role_select')}
              className="underline font-bold hover:text-pink-100"
            >
              Kurumsal Üye Girişi
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR (Derslig Style - Screenshot 1) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="text-3xl font-black tracking-tight text-[#e11d48]">
                eduwiki
              </span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
            </div>

            {/* Nav Menu */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {/* Sınıflar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setClassesDropdownOpen(!classesDropdownOpen)}
                  className="flex items-center gap-1 hover:text-[#e11d48] transition py-2"
                >
                  <span>Sınıflar</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {classesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
                    <div
                      onClick={() => {
                        setActivePreviewGrade('ilkokul');
                        setClassesDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer transition"
                    >
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        🎨 İlkokul (1, 2, 3, 4. Sınıf)
                      </div>
                      <div className="text-[11px] text-slate-500">Oyunlu & masalsı temel eğitim</div>
                    </div>
                    <div
                      onClick={() => {
                        setActivePreviewGrade('ortaokul');
                        setClassesDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-950/30 cursor-pointer transition"
                    >
                      <div className="text-xs font-bold text-pink-700 dark:text-pink-400">
                        🚀 Ortaokul (5, 6, 7, 8. Sınıf / LGS)
                      </div>
                      <div className="text-[11px] text-slate-500">LGS hazırlık & yeni nesil sorular</div>
                    </div>
                    <div
                      onClick={() => {
                        setActivePreviewGrade('lise');
                        setClassesDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 cursor-pointer transition"
                    >
                      <div className="text-xs font-bold text-purple-700 dark:text-purple-400">
                        🎓 Lise (9, 10, 11, 12. Sınıf / YKS)
                      </div>
                      <div className="text-[11px] text-slate-500">TYT & AYT derinlemesine analiz</div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => openAuthModal('role_select')}
                className="hover:text-[#e11d48] transition"
              >
                Okullar İçin
              </button>

              <button
                onClick={() => {
                  document.getElementById('makaleler-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#e11d48] transition flex items-center gap-1 font-bold text-[#e11d48]"
              >
                <span>Makaleler</span>
                <span className="rounded-full bg-rose-100 text-[#e11d48] dark:bg-rose-950/60 dark:text-rose-300 text-[10px] px-1.5 py-0.2">
                  Yeni
                </span>
              </button>

              <button
                onClick={() => {
                  document.getElementById('sss-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#e11d48] transition"
              >
                SSS
              </button>

              <button
                onClick={() => {
                  document.getElementById('footer-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#e11d48] transition"
              >
                İletişim
              </button>

              {/* Keşif Modu (YENİ) */}
              <button
                onClick={() => openAuthModal('role_select')}
                className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 hover:text-[#e11d48] transition"
              >
                <span>Keşif Modu</span>
                <span className="rounded-full bg-[#e11d48] px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                  YENİ
                </span>
              </button>
            </nav>
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-3">
            {/* Basket / Catalog Button */}
            <button
              onClick={() => openAuthModal('register')}
              className="p-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              title="Eğitim Paketleri"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>

            {/* Giriş Yap Button (Rounded-full outline) */}
            <button
              onClick={() => openAuthModal('login')}
              className="rounded-full border-2 border-slate-300 px-5 py-2 text-xs font-bold text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              Giriş Yap
            </button>

            {/* Ücretsiz Üye Ol Button (Rounded-full vibrant magenta CTA) */}
            <button
              onClick={() => openAuthModal('role_select')}
              className="rounded-full bg-[#e11d48] hover:bg-rose-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:shadow-lg transition"
            >
              Ücretsiz Üye Ol
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (Screenshot 1 - Derslig Authentic Layout) */}
      <section className="relative px-4 sm:px-6 py-10 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Card Container */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 lg:p-14 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 relative overflow-hidden">
            {/* Soft pink/cyan ambient glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Heading, Subtitle, CTA, Stats */}
              <div className="lg:col-span-6 space-y-6">
                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#e11d48] leading-tight">
                  Okul Hayatın boyunca seninle!
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
                  1. Sınıftan 12. Sınıfa, MEB müfredatına %100 uyumlu içerikler sunan, Gemini yapay zeka destekli yeni nesil dijital öğrenim platformu.
                </p>

                {/* Main CTA Button: "EduWiki'yi Keşfet ↓" */}
                <div>
                  <button
                    onClick={() => {
                      document.getElementById('sinif-kesfet')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#e11d48] hover:bg-rose-700 px-8 py-3.5 text-sm font-black text-white shadow-lg hover:shadow-xl transition-all duration-150 transform hover:-translate-y-0.5"
                  >
                    <span>EduWiki'yi Keşfet</span>
                    <span className="text-base">↓</span>
                  </button>
                </div>

                {/* Three Stats Counters (Screenshot 1: 2.3M, 500+, %100) */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                      <GraduationCap className="h-5 w-5" />
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        2.3M
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      ÖĞRENCİ
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                      <Building2 className="h-5 w-5" />
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        500+
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      OKUL
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        %100
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      MEB UYUMLU
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Tablet Mockup Frame (Screenshot 1) */}
              <div className="lg:col-span-6 flex justify-center relative">
                {/* Floating Activity Badge 1 (Top Left) */}
                <div className="hidden sm:flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 shadow-xl border border-slate-200/80 dark:border-slate-700 absolute -top-4 -left-6 z-20 animate-float">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-[#e11d48] text-base">
                    🎙️
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Sesli Soru-Cevap</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-slate-400">Canlı Türkçe Anlatım</div>
                  </div>
                </div>

                {/* Floating Activity Badge 2 (Bottom Right) */}
                <div className="hidden sm:flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 shadow-xl border border-slate-200/80 dark:border-slate-700 absolute -bottom-5 -right-6 z-20 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 text-base">
                    ⚡
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-black text-slate-900 dark:text-white">
                      +50 XP Kazanıldı!
                    </div>
                    <div className="text-[10px] text-slate-400">Maarif 5. Sınıf Fen Quiz</div>
                  </div>
                </div>

                <div className="relative w-full max-w-lg">
                  {/* Tablet Bezel Frame */}
                  <div className="rounded-[36px] bg-slate-900 p-4 shadow-2xl ring-1 ring-slate-800">
                    {/* Tablet Top Camera Hole */}
                    <div className="flex justify-center mb-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    </div>

                    {/* Tablet Display Screen */}
                    <div
                      onClick={() => setVideoModalOpen(true)}
                      className="group relative aspect-16/10 w-full rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-600 to-indigo-700 overflow-hidden cursor-pointer shadow-inner flex flex-col items-center justify-center p-6 text-white text-center hover:scale-[1.01] transition-transform duration-300"
                    >
                      {/* Decorative Avatars Illustration Mockup */}
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-2xl shadow-md">
                          👧
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm text-3xl shadow-lg border border-white/30">
                          👩‍🏫
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-2xl shadow-md">
                          👨‍🎓
                        </div>
                      </div>

                      {/* Play Button Icon */}
                      <div className="my-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#e11d48] text-white shadow-xl group-hover:scale-110 transition-transform duration-200">
                        <Play className="h-7 w-7 fill-white translate-x-0.5" />
                      </div>

                      {/* "EDUWİKİ NEDİR?" Pill Banner */}
                      <div className="mt-3 rounded-full bg-white/95 px-5 py-1.5 shadow-md">
                        <span className="text-xs font-extrabold text-[#e11d48] tracking-wider uppercase">
                          EDUWİKİ NEDİR?
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-cyan-100 font-medium">
                        1 dakikalık tanıtım videosunu izle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLASS LEVELS & SMART AI TONE ADAPTATION */}
      <section id="sinif-kesfet" className="py-16 px-4 sm:px-6 border-y border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-extrabold text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 mb-3">
              <Brain className="h-3.5 w-3.5" />
              <span>Sınıf Seviyesine Özel Yapay Zeka Dili</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Her Yaş Grubunun Kendi Anlatım Dili Var
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Yapay zeka öğretmeni, seçtiğiniz sınıf seviyesine göre üslubunu, örneklerini ve derinliğini anında adapte eder.
            </p>
          </div>

          {/* Grade Selector Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(['ilkokul', 'ortaokul', 'lise'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setActivePreviewGrade(grade)}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
                  activePreviewGrade === grade
                    ? 'bg-[#e11d48] text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {grade === 'ilkokul' ? '🎨 İlkokul (1-4)' : grade === 'ortaokul' ? '🚀 Ortaokul / LGS' : '🎓 Lise / YKS'}
              </button>
            ))}
          </div>

          {/* Tone Example Box */}
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-xs ${gradeToneExamples[activePreviewGrade].color}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="font-extrabold text-sm sm:text-base">
                {gradeToneExamples[activePreviewGrade].title}
              </span>
              <span className="rounded-full bg-white/70 dark:bg-slate-800/80 px-3 py-1 text-xs font-bold shadow-2xs">
                {gradeToneExamples[activePreviewGrade].badge}
              </span>
            </div>
            <div className="text-xs font-semibold mb-2 opacity-80">
              {gradeToneExamples[activePreviewGrade].toneDesc}
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 text-sm sm:text-base font-medium italic border border-white/60 dark:border-slate-800 shadow-sm leading-relaxed">
              {gradeToneExamples[activePreviewGrade].aiQuote}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold opacity-75">
                Gemini 3.1 & 3.7 Flash Lite Destekli Canlı Anlatım
              </span>
              <button
                onClick={() => openAuthModal('role_select')}
                className="text-xs font-extrabold underline hover:opacity-80 flex items-center gap-1"
              >
                <span>Hemen Dene</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIX PILLARS OF EDUWIKI (Voice, Calendar, Gemini, Quizzes, Coding, Badges) */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Eğitimde Fark Yaratan Gelişmiş Özellikler
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Gerçek bir sınıf ortamının çok ötesinde, her an yanında olan kişisel yapay zeka akademisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Sesli Etkileşim */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-xl hover:border-pink-300 dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-[#e11d48] dark:bg-pink-950/60 dark:text-pink-400 group-hover:scale-110 transition-transform">
                  <Mic className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-50 text-[#e11d48] dark:bg-pink-950/40">
                  Canlı Sesli
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#e11d48] transition-colors">
                Web Speech Sesli Etkileşim
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Yazmakla vakit kaybetmeyin. Türkçe sesli sorular sorun ve yapay zekanın doğal sesli yanıtlarıyla canlı sohbet edin.
              </p>
            </div>

            {/* Feature 2: Haftalık Takvim */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-xl hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                  Sürükle-Bırak
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 transition-colors">
                Sürükle-Bırak Haftalık Takvim
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pazartesi’den Pazar’a 7 günlük interaktif ders planı. Yapay zeka seviyenize özel dengeli çalışma programını saniyeler içinde hazırlar.
              </p>
            </div>

            {/* Feature 3: Gemini Modelleri */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-xl hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                  5 Model
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                5 Güçlü Gemini Modeli
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini 3.1 Flash Lite, 3.6 Flash Lite, 3.7 Flash Lite, 3.8 Flash ve 3.1 Pro arasında tek tıkla geçiş imkanı.
              </p>
            </div>

            {/* Feature 4: Otomatik Testler */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-xl hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950/40">
                  Yeni Nesil
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">
                5 Soruluk Yeni Nesil Testler
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Konuyu bitirir bitirmez anlık 5 soru çözün. Her şıkkın neden doğru ya da yanlış olduğunu detaylı çözüm kartından öğrenin.
              </p>
            </div>

            {/* Feature 5: Kodlama Laboratuvarı */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Code2 className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
                  Python & JS
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                Kodlama ve Algoritma Laboratuvarı
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Python ve JavaScript kodlarınızı yazıp çalıştırın. Hata yaptığınızda yapay zeka nerede hata yaptığınızı öğretir.
              </p>
            </div>

            {/* Feature 6: Puan ve Rozetler */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-xl hover:border-rose-300 dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-[#e11d48] dark:bg-rose-950/60 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-[#e11d48] dark:bg-rose-950/40">
                  XP & Rozetler
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#e11d48] transition-colors">
                Gelişim ve Başarı Rozetleri
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ders çalıştıkça XP kazanın, seviye atlayın ve rozetlerin kilidini açarak çalışma motivasyonunuzu zirvede tutun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5b. FEATURED ARTICLES & EDUWIKI BLOG SECTION */}
      <section id="makaleler-section" className="py-20 px-4 sm:px-6 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-[#e11d48] dark:bg-rose-950/60 dark:text-rose-300">
                <BookOpenCheck className="h-4 w-4" />
                <span>EDUWİKİ BLOG & REHBERLİK KÜTÜPHANESİ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Öne Çıkan Eğitim & Yapay Zeka Makaleleri
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sınav stratejileri, kanıtlanmış verimli çalışma teknikleri ve Gemini yapay zekasıyla öğrenme yöntemlerini hemen keşfedin.
              </p>
            </div>

            {/* View all articles CTA */}
            <div>
              <button
                onClick={() => openAuthModal('role_select')}
                className="inline-flex items-center gap-2 rounded-full bg-[#e11d48] hover:bg-rose-700 px-6 py-3 text-xs font-black text-white shadow-md hover:shadow-lg transition"
              >
                <span>Tüm Makaleleri Keşfet</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['Tümü', 'Sınav Stratejileri', 'Verimli Çalışma', 'Yapay Zeka & Teknoloji', 'Maarif Modeli', 'Bilim & Kodlama'].map((cat) => (
              <button
                key={cat}
                onClick={() => setArticleCategoryFilter(cat)}
                className={`whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-bold transition ${
                  articleCategoryFilter === cat
                    ? 'bg-[#e11d48] text-white shadow-md shadow-rose-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURATED_ARTICLES.filter(
              (art) => articleCategoryFilter === 'Tümü' || art.category === articleCategoryFilter
            )
              .slice(0, 6)
              .map((article, idx) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
                    idx === 0 && articleCategoryFilter === 'Tümü' ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  {/* Image container */}
                  <div className={`relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800 ${
                    idx === 0 && articleCategoryFilter === 'Tümü' ? 'aspect-16/9 sm:aspect-21/9' : 'aspect-16/9'
                  }`}>
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-black uppercase text-white shadow-xs">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="rounded-full bg-[#e11d48] px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                          ÖNE ÇIKAN
                        </span>
                      )}
                    </div>

                    {/* Read time badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-white/95 drop-shadow-sm">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readTime} okuma</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className={`font-black text-slate-900 dark:text-white group-hover:text-[#e11d48] transition leading-snug ${
                        idx === 0 && articleCategoryFilter === 'Tümü' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                      }`}>
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    {/* Author & Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-base shadow-xs dark:bg-pink-950/60">
                          {article.author.avatar || '👩‍🏫'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {article.author.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {article.author.role}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[#e11d48] font-bold group-hover:translate-x-1 transition-transform">
                        <span>Hemen Oku</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Bottom Card for Full Library Access */}
          <div className="rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-pink-50 p-6 sm:p-8 dark:border-rose-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e11d48] to-pink-500 text-white text-2xl shadow-md shrink-0">
                📚
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Öğrenci Paneline Özel Makale Kütüphanesi ve AI İçerik Üretici
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Öğrenci panelinde tüm makaleleri beğenebilir, yer imlerine ekleyebilir ve Gemini ile dilediğin konuda anında yeni makale yazdırabilirsin.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('role_select')}
              className="shrink-0 rounded-full bg-[#e11d48] hover:bg-rose-700 px-6 py-3 text-xs font-black text-white shadow-md hover:shadow-lg transition"
            >
              Ücretsiz Katıl ve İncele →
            </button>
          </div>
        </div>
      </section>

      {/* 5c. LIVE INTERACTIVE FEATURE SHOWCASE & BENTO LAB */}
      <section className="py-20 px-4 sm:px-6 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-black text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-900 dark:text-indigo-300">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>GÜÇLÜ ÖĞRENME ARAÇLARI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sadece Ders Dinleme, Aktif Olarak Deneyimle
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Akıllı çalışma sayaçlarından dijital beyaz tahtaya kadar bir öğrencinin ihtiyaç duyduğu tüm araçlar tek bir entegre ekranda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Akıllı Pomodoro ve Odak Sayacı */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  25/5 Pomodoro Odak Sayacı
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bilişsel odaklanma süresini koruyan dahili Pomodoro motoru. Dikkat dağılmadan ders çalışma aralıklarını takip eder ve çalışma bittiğinde puan ödülü verir.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200/80 bg-white p-3 dark:border-amber-900/50 dark:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  25:00 Odak Bloğu
                </span>
                <span className="text-[11px] text-slate-400">+50 XP Tamamlama</span>
              </div>
            </div>

            {/* Bento Card 2: İnteraktif Çizim ve Karatahta */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-[#e11d48] dark:bg-pink-950/60 dark:text-pink-400">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Sanal Karatahta & Geometri Çizimi
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Formülleri kağıda döker gibi ekranda serbest çizim yapın, geometri şekilleri çizin ve yapay zekanın tahta notlarıyla eş zamanlı olarak çözümü görselleştirin.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-200/80 bg-white p-3 dark:border-rose-900/50 dark:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="text-[#e11d48]">🎨 Çoklu Renk & Şekil</span>
                <span className="text-[11px] text-slate-400">SVG Dışa Aktar</span>
              </div>
            </div>

            {/* Bento Card 3: 5. Sınıf Maarif Ünite Haritası */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Derslig Tarzı Ünite Yol Haritası
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  MEB Türkiye Yüzyılı Maarif Modeli ile %100 uyumlu konu kazanım ağacı. Hangi konuyu ne kadar tamamladığını adım adım görsel grafiklerle izle.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200/80 bg-white p-3 dark:border-emerald-900/50 dark:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="text-emerald-600">🎯 Kazanım Takibi</span>
                <span className="text-[11px] text-slate-400">%100 MEB Uyumlu</span>
              </div>
            </div>
          </div>

          {/* Social Proof / Student Testimonials Bento */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 sm:p-10 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 space-y-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 ml-2">
                    4.9 / 5.0 Memnuniyet • 28.400+ Doğrulanmış Öğrenci & Veli
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Öğrenciler, Öğretmenler ve Veliler Ne Diyor?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Canlı ve akan gerçek kullanıcı deneyimleri (kartların üzerine gelerek durdurabilirsiniz)
                </p>
              </div>
              <button
                onClick={() => openAuthModal('role_select')}
                className="rounded-full bg-[#e11d48] text-white hover:bg-rose-700 px-6 py-3 text-xs font-black shadow-md hover:shadow-lg transition shrink-0 transform hover:scale-105"
              >
                Aramıza Katıl & Puan Topla →
              </button>
            </div>

            {/* MARQUEE ROW 1: SOLA DOĞRU AKAN YORUMLAR */}
            <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex gap-4 animate-marquee py-2">
                {[
                  {
                    avatar: '👦',
                    name: 'Kadir K.',
                    role: '5. Sınıf Öğrencisi • LGS Adayı',
                    color: 'bg-pink-100',
                    badge: '🏆 Matematik Canavarı (1.250 XP)',
                    comment: 'Takıldığım matematik sorularını sesli olarak sorduğumda adeta yanımda özel ders öğretmenim varmış gibi adım adım açıklıyor. Makaleler bölümündeki sınav turlama tekniği netlerimi çok artırdı!'
                  },
                  {
                    avatar: '👩‍🏫',
                    name: 'Duygu Öğretmen',
                    role: 'Fen Bilimleri Zümre Başkanı',
                    color: 'bg-blue-100',
                    badge: '🌟 Doğrulanmış Eğitmen',
                    comment: 'Türkiye Yüzyılı Maarif Modeli\'nin beceri temelli kazanımlarına bu denli sadık kalan ilk yapay zeka platformu. Sınıfımdaki tüm öğrencilere haftalık planlama için öneriyorum.'
                  },
                  {
                    avatar: '👨‍👩‍👧',
                    name: 'Mehmet B.',
                    role: 'Veli • Ankara',
                    color: 'bg-amber-100',
                    badge: '🛡️ Veli Takipçi',
                    comment: 'Kızımın masanın başında sıkılmadan 25 dakikalık Pomodoro bloklarıyla çalışması ve kendi kendine kodlama testleri yapması motivasyonunu inanılmaz yükseltti.'
                  },
                  {
                    avatar: '👧',
                    name: 'Zeynep S.',
                    role: '8. Sınıf • LGS Derece Grubu',
                    color: 'bg-emerald-100',
                    badge: '🔥 32 Günlük Seri',
                    comment: 'LGS Fen ve Paragraf yeni nesil soruları harika. Her sorudan sonra yapay zekanın "Çeldirici Neden Yanlış?" analizi deneme netlerimi 14\'ten 19\'a çıkardı.'
                  },
                  {
                    avatar: '🧑‍💻',
                    name: 'Emre T.',
                    role: '11. Sınıf Sayısal • YKS',
                    color: 'bg-indigo-100',
                    badge: '⚡ Python Yıldızı',
                    comment: 'Kodlama laboratuvarında Python algoritmaları çözüp anında geri bildirim almak ve karatahtada fizikteki serbest düşme grafiklerini çizmek müthiş pratik.'
                  },
                  // Duplicate items for infinite seamless scroll loop
                  {
                    avatar: '👦',
                    name: 'Kadir K.',
                    role: '5. Sınıf Öğrencisi • LGS Adayı',
                    color: 'bg-pink-100',
                    badge: '🏆 Matematik Canavarı (1.250 XP)',
                    comment: 'Takıldığım matematik sorularını sesli olarak sorduğumda adeta yanımda özel ders öğretmenim varmış gibi adım adım açıklıyor. Makaleler bölümündeki sınav turlama tekniği netlerimi çok artırdı!'
                  },
                  {
                    avatar: '👩‍🏫',
                    name: 'Duygu Öğretmen',
                    role: 'Fen Bilimleri Zümre Başkanı',
                    color: 'bg-blue-100',
                    badge: '🌟 Doğrulanmış Eğitmen',
                    comment: 'Türkiye Yüzyılı Maarif Modeli\'nin beceri temelli kazanımlarına bu denli sadık kalan ilk yapay zeka platformu. Sınıfımdaki tüm öğrencilere haftalık planlama için öneriyorum.'
                  },
                  {
                    avatar: '👨‍👩‍👧',
                    name: 'Mehmet B.',
                    role: 'Veli • Ankara',
                    color: 'bg-amber-100',
                    badge: '🛡️ Veli Takipçi',
                    comment: 'Kızımın masanın başında sıkılmadan 25 dakikalık Pomodoro bloklarıyla çalışması ve kendi kendine kodlama testleri yapması motivasyonunu inanılmaz yükseltti.'
                  },
                  {
                    avatar: '👧',
                    name: 'Zeynep S.',
                    role: '8. Sınıf • LGS Derece Grubu',
                    color: 'bg-emerald-100',
                    badge: '🔥 32 Günlük Seri',
                    comment: 'LGS Fen ve Paragraf yeni nesil soruları harika. Her sorudan sonra yapay zekanın "Çeldirici Neden Yanlış?" analizi deneme netlerimi 14\'ten 19\'a çıkardı.'
                  },
                  {
                    avatar: '🧑‍💻',
                    name: 'Emre T.',
                    role: '11. Sınıf Sayısal • YKS',
                    color: 'bg-indigo-100',
                    badge: '⚡ Python Yıldızı',
                    comment: 'Kodlama laboratuvarında Python algoritmaları çözüp anında geri bildirim almak ve karatahtada fizikteki serbest düşme grafiklerini çizmek müthiş pratik.'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="w-80 sm:w-96 shrink-0 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-pink-300 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} text-lg shadow-2xs`}>
                          {item.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{item.role}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="h-3 w-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{item.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* MARQUEE ROW 2: SAĞA DOĞRU AKAN YORUMLAR (REVERSE) */}
            <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex gap-4 animate-marquee-reverse py-2">
                {[
                  {
                    avatar: '👨‍🎓',
                    name: 'Burak Y.',
                    role: '12. Sınıf • TYT/AYT',
                    color: 'bg-rose-100',
                    badge: '🎯 Derece Hedefli',
                    comment: 'Gece saat 11\'de kimyada kafama takılan orbital sorusunu sordum, saniyeler içinde denklem denkleştirip çözümü verdi. EduWiki resmen dijital kütüphanem oldu.'
                  },
                  {
                    avatar: '👩‍💼',
                    name: 'Selin A.',
                    role: 'Veli • İzmir',
                    color: 'bg-purple-100',
                    badge: '🏅 Bilinçli Ebeveyn',
                    comment: 'Reklamsız ve güvenli olması bizim için en kritik kriterdi. Çocuğum güvenle video izliyor, sesli soru soruyor ve rozet kazandıkça gururla gösteriyor.'
                  },
                  {
                    avatar: '🧑‍🏫',
                    name: 'Ahmet Hoca',
                    role: 'Matematik Öğretmeni',
                    color: 'bg-emerald-100',
                    badge: '📚 MEB Müfredat Uzmanı',
                    comment: 'Yeni nesil beceri temelli soruların kalitesi beni çok şaşırttı. Derslerimde tahtaya yansıtıp öğrencilerle beraber çözüyoruz, derse katılım tavan yaptı.'
                  },
                  {
                    avatar: '👧',
                    name: 'Elif N.',
                    role: '6. Sınıf Öğrencisi',
                    color: 'bg-cyan-100',
                    badge: '🎨 Karatahta Ressamı',
                    comment: 'Karatahtada gezegenleri çizip yapay zekaya sordum, bana Güneş sisteminin harika bir hikayesini anlattı. Fen dersini artık çok seviyorum!'
                  },
                  {
                    avatar: '👦',
                    name: 'Caner D.',
                    role: '7. Sınıf Öğrencisi',
                    color: 'bg-orange-100',
                    badge: '⏰ Pomodoro Şampiyonu',
                    comment: 'Zamanlayıcı sayesinde ders çalışırken telefonumu elime almıyorum. 25 dakika bitince çalan zil sesi ve gelen +50 XP ödülü çok keyifli.'
                  },
                  // Duplicate items for continuous reverse loop
                  {
                    avatar: '👨‍🎓',
                    name: 'Burak Y.',
                    role: '12. Sınıf • TYT/AYT',
                    color: 'bg-rose-100',
                    badge: '🎯 Derece Hedefli',
                    comment: 'Gece saat 11\'de kimyada kafama takılan orbital sorusunu sordum, saniyeler içinde denklem denkleştirip çözümü verdi. EduWiki resmen dijital kütüphanem oldu.'
                  },
                  {
                    avatar: '👩‍💼',
                    name: 'Selin A.',
                    role: 'Veli • İzmir',
                    color: 'bg-purple-100',
                    badge: '🏅 Bilinçli Ebeveyn',
                    comment: 'Reklamsız ve güvenli olması bizim için en kritik kriterdi. Çocuğum güvenle video izliyor, sesli soru soruyor ve rozet kazandıkça gururla gösteriyor.'
                  },
                  {
                    avatar: '🧑‍🏫',
                    name: 'Ahmet Hoca',
                    role: 'Matematik Öğretmeni',
                    color: 'bg-emerald-100',
                    badge: '📚 MEB Müfredat Uzmanı',
                    comment: 'Yeni nesil beceri temelli soruların kalitesi beni çok şaşırttı. Derslerimde tahtaya yansıtıp öğrencilerle beraber çözüyoruz, derse katılım tavan yaptı.'
                  },
                  {
                    avatar: '👧',
                    name: 'Elif N.',
                    role: '6. Sınıf Öğrencisi',
                    color: 'bg-cyan-100',
                    badge: '🎨 Karatahta Ressamı',
                    comment: 'Karatahtada gezegenleri çizip yapay zekaya sordum, bana Güneş sisteminin harika bir hikayesini anlattı. Fen dersini artık çok seviyorum!'
                  },
                  {
                    avatar: '👦',
                    name: 'Caner D.',
                    role: '7. Sınıf Öğrencisi',
                    color: 'bg-orange-100',
                    badge: '⏰ Pomodoro Şampiyonu',
                    comment: 'Zamanlayıcı sayesinde ders çalışırken telefonumu elime almıyorum. 25 dakika bitince çalan zil sesi ve gelen +50 XP ödülü çok keyifli.'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="w-80 sm:w-96 shrink-0 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} text-lg shadow-2xs`}>
                          {item.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{item.role}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="h-3 w-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{item.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ (SSS) SECTION */}
      <section id="sss-section" className="py-16 px-4 sm:px-6 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              EduWiki Akademi hakkında merak edilen sorular ve yanıtları
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#e11d48]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM BANNER */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#e11d48] to-pink-600 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Başarı Yolculuğuna Şimdi Başla!
          </h2>
          <p className="text-sm sm:text-base text-pink-100 font-medium">
            Öğrenci ve öğretmen kaydı tamamen ücretsizdir. Kredi kartı gerekmez.
          </p>
          <div className="pt-3">
            <button
              onClick={() => openAuthModal('role_select')}
              className="rounded-full bg-white text-[#e11d48] hover:bg-slate-50 px-8 py-3.5 text-sm font-black shadow-xl hover:shadow-2xl transition transform hover:scale-105"
            >
              Ücretsiz Üye Ol ve Keşfet →
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer id="footer-section" className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-2xl font-black text-[#e11d48]">eduwiki</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              © 2026 EduWiki Eğitim Teknolojileri A.Ş. Tüm hakları saklıdır. MEB Müfredatına Uyumludur.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="tel:02162370000" className="hover:text-[#e11d48]">
              0216 237 00 00
            </a>
            <a href="mailto:iletisim@eduwiki.com.tr" className="hover:text-[#e11d48]">
              iletisim@eduwiki.com.tr
            </a>
            <button onClick={() => openAuthModal('role_select')} className="hover:text-[#e11d48]">
              Kurumsal Üyelik
            </button>
          </div>
        </div>
      </footer>

      {/* Video Modal ("EduWiki Nedir? - Türkçe Tanıtım") */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 p-5 border border-slate-800 shadow-2xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-[#e11d48]" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  EduWiki Eğitim Teknolojileri A.Ş. Tanıtım Videosu
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Yapay zeka öğretmen, sesli derslik, interaktif haftalık takvim ve eğitici oyunların Türkçe anlatımı
              </p>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/nB_d-iKkI9c?autoplay=1&rel=0&modestbranding=1"
                title="EduWiki Türkçe Eğitim Tanıtımı"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Chapters & Highlights */}
            <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="font-bold text-pink-400 block">1. Derslik</span>
                <span>Canlı AI öğretmen & tahta</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="font-bold text-blue-400 block">2. Sesli Mod</span>
                <span>Mikrofonla soru sorma</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="font-bold text-amber-400 block">3. Takvim</span>
                <span>Sürükle-bırak haftalık plan</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="font-bold text-emerald-400 block">4. Oyunlar</span>
                <span>5 farklı eğitici zeka oyunu</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                EduWiki Eğitim Teknolojileri A.Ş. • MEB Müfredatına Uygun
              </span>
              <button
                onClick={() => {
                  setVideoModalOpen(false);
                  openAuthModal('role_select');
                }}
                className="rounded-full bg-[#e11d48] px-5 py-2 text-xs font-black text-white hover:bg-rose-700 transition"
              >
                Hemen Ücretsiz Başla →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenAuth={() => openAuthModal('role_select')}
      />
    </div>
  );
};
