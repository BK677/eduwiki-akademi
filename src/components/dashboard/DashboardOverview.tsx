import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolProfileModal } from '../profile/SchoolProfileModal';
import { GradeLevel, Subject, StudyTask, DayOfWeek } from '../../types';
import { generateWeeklySchedule } from '../../services/geminiService';
import {
  Video,
  PlayCircle,
  Terminal,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  BookOpenCheck,
  Mic,
  Calendar,
  Gamepad2,
  School,
  Edit3,
  Target,
  Zap,
  TrendingUp,
  Brain,
  AlertTriangle,
  RefreshCw,
  CalendarPlus,
  Check,
  Eye,
  Sliders
} from 'lucide-react';

interface SubjectMasteryData {
  subject: Subject;
  progressPercent: number;
  masteryLabel: string;
  accuracy: number;
  weakTopic: string;
  completedTopics: number;
  totalTopics: number;
  gradient: string;
  colorClass: string;
}

export const DashboardOverview: React.FC = () => {
  const {
    user,
    gradeLevel,
    setActiveTab,
    selectedModel,
    setAllWeeklyTasks,
    showToast,
    simplicityMode,
    toggleSimplicityMode,
  } = useApp();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isGeneratingWeakPlan, setIsGeneratingWeakPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{
    summary: string;
    focusDays: { day: DayOfWeek; subject: Subject; topic: string; strategy: string; duration: number; xp: number }[];
  } | null>(null);

  // Subject Mastery & Progress Bars tailored to Grade Level
  const getSubjectProgressList = (): SubjectMasteryData[] => {
    if (gradeLevel === 'ilkokul') {
      return [
        {
          subject: 'Matematik',
          progressPercent: 78,
          masteryLabel: 'Başarılı Seviye',
          accuracy: 85,
          weakTopic: 'Çarpım Tablosu & 4 İşlem Hızı',
          completedTopics: 14,
          totalTopics: 18,
          gradient: 'from-blue-500 to-indigo-600',
          colorClass: 'text-blue-600 dark:text-blue-400',
        },
        {
          subject: 'Fen Bilimleri',
          progressPercent: 88,
          masteryLabel: 'İleri Seviye',
          accuracy: 92,
          weakTopic: 'Gezegenlerin Sıralaması',
          completedTopics: 11,
          totalTopics: 12,
          gradient: 'from-emerald-500 to-teal-600',
          colorClass: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          subject: 'Türkçe & Edebiyat',
          progressPercent: 65,
          masteryLabel: 'Geliştirilmeli',
          accuracy: 72,
          weakTopic: 'Eş Anlamlı & Zıt Anlamlı Kelimeler',
          completedTopics: 10,
          totalTopics: 15,
          gradient: 'from-rose-500 to-pink-600',
          colorClass: 'text-rose-600 dark:text-rose-400',
        },
        {
          subject: 'Kodlama & Robotik',
          progressPercent: 90,
          masteryLabel: 'Mükemmel',
          accuracy: 96,
          weakTopic: 'Labirent Algoritması Döngüleri',
          completedTopics: 9,
          totalTopics: 10,
          gradient: 'from-purple-500 to-indigo-600',
          colorClass: 'text-purple-600 dark:text-purple-400',
        },
      ];
    } else if (gradeLevel === 'ortaokul') {
      return [
        {
          subject: 'Matematik',
          progressPercent: 64,
          masteryLabel: 'Geliştirilmeli (LGS Kritik)',
          accuracy: 68,
          weakTopic: 'Cebirsel İfadeler & LGS Modelleme',
          completedTopics: 16,
          totalTopics: 25,
          gradient: 'from-blue-600 to-cyan-600',
          colorClass: 'text-blue-600 dark:text-blue-400',
        },
        {
          subject: 'Fen Bilimleri',
          progressPercent: 82,
          masteryLabel: 'Başarılı',
          accuracy: 86,
          weakTopic: 'Katı & Sıvı Basıncı Deney Soruları',
          completedTopics: 18,
          totalTopics: 22,
          gradient: 'from-emerald-500 to-teal-600',
          colorClass: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          subject: 'Türkçe & Edebiyat',
          progressPercent: 74,
          masteryLabel: 'İyi Düzeyde',
          accuracy: 79,
          weakTopic: 'Paragrafta Anlatım Biçimleri & Ana Fikir',
          completedTopics: 14,
          totalTopics: 19,
          gradient: 'from-rose-500 to-pink-600',
          colorClass: 'text-rose-600 dark:text-rose-400',
        },
        {
          subject: 'Sosyal Bilgiler & Tarih',
          progressPercent: 88,
          masteryLabel: 'İleri Seviye',
          accuracy: 91,
          weakTopic: 'Milli Mücadele Dönemi Antlaşmaları',
          completedTopics: 15,
          totalTopics: 17,
          gradient: 'from-amber-500 to-orange-600',
          colorClass: 'text-amber-600 dark:text-amber-400',
        },
        {
          subject: 'İngilizce',
          progressPercent: 70,
          masteryLabel: 'İyi Düzeyde',
          accuracy: 75,
          weakTopic: 'Expressing Preferences & Vocabulary',
          completedTopics: 12,
          totalTopics: 17,
          gradient: 'from-purple-500 to-indigo-600',
          colorClass: 'text-purple-600 dark:text-purple-400',
        },
      ];
    } else {
      return [
        {
          subject: 'Matematik',
          progressPercent: 58,
          masteryLabel: 'Kritik Gelişim Alanı (AYT)',
          accuracy: 62,
          weakTopic: 'Türevin Geometrik Yorumu & Ekstremum Noktaları',
          completedTopics: 22,
          totalTopics: 38,
          gradient: 'from-blue-600 to-indigo-600',
          colorClass: 'text-blue-600 dark:text-blue-400',
        },
        {
          subject: 'Fizik',
          progressPercent: 62,
          masteryLabel: 'Geliştirilmeli',
          accuracy: 66,
          weakTopic: 'Newton Hareket Yasaları & Sürtünme Kuvveti',
          completedTopics: 15,
          totalTopics: 24,
          gradient: 'from-cyan-500 to-blue-600',
          colorClass: 'text-cyan-600 dark:text-cyan-400',
        },
        {
          subject: 'Kimya',
          progressPercent: 80,
          masteryLabel: 'Başarılı',
          accuracy: 84,
          weakTopic: 'Gaz Yasaları ve Kısmi Basınç',
          completedTopics: 16,
          totalTopics: 20,
          gradient: 'from-amber-500 to-orange-600',
          colorClass: 'text-amber-600 dark:text-amber-400',
        },
        {
          subject: 'Biyoloji',
          progressPercent: 85,
          masteryLabel: 'İleri Seviye',
          accuracy: 89,
          weakTopic: 'Hücresel Solunum & ATP Üretimi',
          completedTopics: 17,
          totalTopics: 20,
          gradient: 'from-emerald-500 to-teal-600',
          colorClass: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          subject: 'Türkçe & Edebiyat',
          progressPercent: 82,
          masteryLabel: 'Başarılı',
          accuracy: 86,
          weakTopic: 'Divan Edebiyatı Nazım Şekilleri',
          completedTopics: 23,
          totalTopics: 28,
          gradient: 'from-rose-500 to-pink-600',
          colorClass: 'text-rose-600 dark:text-rose-400',
        },
      ];
    }
  };

  const subjectProgressList = getSubjectProgressList();

  // Personalized daily recommendation generated for the student
  const getDailyRecommendation = () => {
    if (gradeLevel === 'ilkokul') {
      return {
        badge: 'GÜNÜN YAPAY ZEKA ROTASI 🌟',
        subject: 'Fen Bilimleri & Matematik',
        topic: 'Güneş Sistemi ve Çarpım Tablosu Macera Seansı',
        estimatedMinutes: 35,
        xpReward: '+60 XP',
        aiAdvice:
          'Sevgili ' +
          (user?.name || 'öğrencimiz') +
          ', bugün 3. ve 4. sınıf kazanımlarında Güneş Sistemi’ni keşfetmek ve ardından 5 soruluk eğlenceli testi tamamlamak günün en yüksek kalıcılık sağlayan adımı olacaktır!',
        primaryActionTab: 'live-classroom',
        primaryActionText: 'Canlı Anlatıma Katıl',
        secondaryActionTab: 'games',
        secondaryActionText: 'Eğitici Oyun Oyna',
      };
    } else if (gradeLevel === 'ortaokul') {
      return {
        badge: 'LGS HEDEF ROTASI (YAPAY ZEKA ÖNERİSİ) 🎯',
        subject: 'Matematik & Fen Bilimleri',
        topic: 'Cebirsel İfadeler & LGS Yeni Nesil Modelleme',
        estimatedMinutes: 45,
        xpReward: '+80 XP',
        aiAdvice:
          'Milli Eğitim Bakanlığı LGS analizine göre ' +
          (user?.name || 'öğrencimiz') +
          ', cebirsel modelleme soruları sınavda en çok eleyici olan kısımdır. Bugün 25 dk Pomodoro ile konuyu inceleyip ardından 5 yeni nesil soru çözmen hedefine ulaştıracaktır!',
        primaryActionTab: 'quiz',
        primaryActionText: '5 Soruluk LGS Testi Çöz',
        secondaryActionTab: 'voice-mode',
        secondaryActionText: 'Yapay Zekaya Sesli Sor',
      };
    } else {
      return {
        badge: 'YKS / TYT ANALİTİK ROTASI 🎓',
        subject: 'Matematik & Fizik (AYT)',
        topic: 'Türevde Teğet Eğimi ve Newton Hareket Yasaları',
        estimatedMinutes: 60,
        xpReward: '+100 XP',
        aiAdvice:
          'ÖSYM soru standartlarına göre türevin geometrik yorumu ile kinematik hareket entegrasyonu TYT/AYT ayrımında belirleyicidir. Bugün formül ispatlarını inceleyip ardından test çözmen önerilir.',
        primaryActionTab: 'live-classroom',
        primaryActionText: 'Canlı Derse Başla',
        secondaryActionTab: 'quiz',
        secondaryActionText: 'AYT Testini Başlat',
      };
    }
  };

  const rec = getDailyRecommendation();

  // Trigger AI Weakness Analysis & Weekly Study Focus Generation
  const handleGenerateWeakTopicPlan = async () => {
    setIsGeneratingWeakPlan(true);
    showToast('Gemini API eksik konularınızı ve netlerinizi analiz ediyor...', 'info');

    try {
      const promptGrade = gradeLevel === 'ilkokul' ? 'İlkokul' : gradeLevel === 'ortaokul' ? 'Ortaokul LGS' : 'Lise YKS';
      const weakSummary = subjectProgressList.map(s => `${s.subject}: ${s.weakTopic} (Başarı: %${s.progressPercent})`).join(', ');

      const res = await generateWeeklySchedule(
        gradeLevel,
        `Öğrencinin teşhis edilen eksik konuları: ${weakSummary}. Bu eksik konuları 7 güne dağıtarak telafi edecek stratejik bir plan hazırla.`,
        selectedModel
      );

      if (res && res.tasks && Array.isArray(res.tasks)) {
        const days: DayOfWeek[] = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
        const focusItems = res.tasks.slice(0, 7).map((t: any, idx: number) => ({
          day: (t.day || days[idx % 7]) as DayOfWeek,
          subject: (t.subject || 'Matematik') as Subject,
          topic: t.topic || 'Eksik Konu Güçlendirme',
          strategy: 'Kazanım eksiğini kapatmaya yönelik odaklı tekrar ve soru çözümü.',
          duration: t.durationMinutes || 45,
          xp: 40,
        }));

        setGeneratedPlan({
          summary: res.weeklyGoal || `${promptGrade} seviyeniz için 7 günlük eksik konu telafi ve pekiştirme rotası oluşturuldu.`,
          focusDays: focusItems,
        });

        showToast('Gemini kişiselleştirilmiş eksik konu planınızı başarıyla oluşturdu!', 'reward');
      } else {
        throw new Error('Yanıt alınamadı');
      }
    } catch {
      // Fallback high quality diagnostic plan
      const fallbackDays: { day: DayOfWeek; subject: Subject; topic: string; strategy: string; duration: number; xp: number }[] = [
        { day: 'Pazartesi', subject: 'Matematik', topic: subjectProgressList[0]?.weakTopic || 'Cebirsel İfadeler', strategy: 'Kural kartları çıkarma ve 10 temel soru çözümü', duration: 45, xp: 50 },
        { day: 'Salı', subject: 'Fen Bilimleri', topic: subjectProgressList[1]?.weakTopic || 'Basınç Deneyleri', strategy: 'Kavram haritası inceleme ve simülasyon', duration: 40, xp: 45 },
        { day: 'Çarşamba', subject: 'Türkçe & Edebiyat', topic: subjectProgressList[2]?.weakTopic || 'Paragrafta Anlam', strategy: 'Hızlı okuma ve paragraf soru çözümü', duration: 45, xp: 45 },
        { day: 'Perşembe', subject: 'Matematik', topic: 'Problem Çözme Taktikleri', strategy: 'Yeni nesil modelleme soruları', duration: 50, xp: 50 },
        { day: 'Cuma', subject: (subjectProgressList[3]?.subject || 'Sosyal Bilgiler & Tarih') as Subject, topic: subjectProgressList[3]?.weakTopic || 'Olaylar & Nedenler', strategy: 'Özet not çıkarma ve kronoloji', duration: 40, xp: 40 },
        { day: 'Cumartesi', subject: 'Matematik', topic: 'Haftalık Karma Test & Pomodoro', strategy: '20 soruluk deneme simülasyonu', duration: 60, xp: 60 },
        { day: 'Pazar', subject: 'Kodlama & Robotik', topic: 'Hafta Değerlendirmesi & Zeka Oyunu', strategy: 'Eğlenceli pekiştirme ve hız düellosu', duration: 35, xp: 40 },
      ];

      setGeneratedPlan({
        summary: 'Teşhis edilen eksik konulara göre haftalık odaklı çalışma planı hazırlandı.',
        focusDays: fallbackDays,
      });
      showToast('Kişiselleştirilmiş eksik konu planınız hazırlandı!', 'success');
    } finally {
      setIsGeneratingWeakPlan(false);
    }
  };

  // Apply Generated Plan to Weekly Calendar
  const handleApplyPlanToSchedule = () => {
    if (!generatedPlan) return;

    const mappedTasks: StudyTask[] = generatedPlan.focusDays.map((f, i) => ({
      id: `weak_plan_task_${Date.now()}_${i}`,
      day: f.day,
      subject: f.subject,
      topic: f.topic,
      timeSlot: '17:30 - 18:15',
      durationMinutes: f.duration,
      isCompleted: false,
    }));

    setAllWeeklyTasks(mappedTasks);
    showToast('Plan haftalık ders takviminize aktarıldı! "Haftalık Ders Planı" sekmesinden inceleyebilirsiniz.', 'reward');
    setActiveTab('schedule');
  };

  const quickLaunchCards = [
    {
      id: 'unit-explorer',
      title: 'Morpa Kampüs Dersler & Üniteler',
      desc: 'Yukarıda dersler, aşağıda üniteler, + ile açılan konular ve sinematik ders çalışma odası.',
      icon: BookOpen,
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      badge: '5. SINIF YENİ MAARİF',
    },
    {
      id: 'articles',
      title: 'EduWiki Kütüphane & Makaleler',
      desc: 'Sınav stratejileri, bilişsel verimli çalışma ve Gemini eğitim rehberleri.',
      icon: BookOpenCheck,
      gradient: 'from-rose-500 via-pink-600 to-amber-500',
      badge: 'YENİ MAKALE',
    },
    {
      id: 'voice-mode',
      title: 'Sesli Etkileşim Odası',
      desc: 'Web Speech API ile yapay zekayla sesli konuş, yanıtları canlı dinle.',
      icon: Mic,
      gradient: 'from-purple-600 via-indigo-600 to-blue-600',
      badge: 'SESLİ AI',
    },
    {
      id: 'schedule',
      title: 'Haftalık Ders Takvimi',
      desc: 'Sürükle-bırak interaktif 7 günlük ders programı.',
      icon: Calendar,
      gradient: 'from-amber-500 to-orange-600',
      badge: 'PLANLAYICI',
    },
    {
      id: 'games',
      title: 'Eğitici Zeka Oyunları',
      desc: 'Matematik Düellosu, anagram, refleks ve hafıza oyunları.',
      icon: Gamepad2,
      gradient: 'from-violet-600 to-pink-600',
      badge: 'OYUN ODASI',
    },
    {
      id: 'quiz',
      title: '5 Soruluk Hızlı Test',
      desc: 'Yapay zekanın ürettiği yeni nesil soruları çöz, dönüt al.',
      icon: HelpCircle,
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'ÖLÇME',
    },
    {
      id: 'live-classroom',
      title: 'Canlı Ders Simülasyonu',
      desc: 'Birebir AI öğretmen ve akıllı karatahta ile interaktif anlatım.',
      icon: Video,
      gradient: 'from-red-500 to-rose-600',
      badge: 'DERSLİK',
    },
    {
      id: 'coding',
      title: 'Kodlama Laboratuvarı',
      desc: 'Python & JS kod editörü ile canlı programlama yap ve hata ayıkla.',
      icon: Terminal,
      gradient: 'from-indigo-600 to-purple-600',
      badge: 'YAZILIM',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Simplicity Mode Notification & Toggle Bar */}
      {simplicityMode && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 dark:border-emerald-800 dark:bg-emerald-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                Basitlik (Odak) Modu Aktif
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Gereksiz detaylar gizlendi. Yalnızca hedeflerine ve günlük derslerine odaklan.
              </p>
            </div>
          </div>
          <button
            onClick={toggleSimplicityMode}
            className="rounded-xl border border-emerald-300 bg-white px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-300 transition"
          >
            Standart Görünüme Dön
          </button>
        </div>
      )}

      {/* 1. STUDENT PROFILE & WORKSPACE PANEL */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar & Student Details */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e11d48] to-pink-500 text-3xl shadow-md text-white">
                {user?.avatar || '🎓'}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {user?.name || 'Öğrenci'}
                </h1>
                <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-extrabold text-[#e11d48] border border-pink-200 dark:bg-pink-950/60 dark:border-pink-900 dark:text-pink-300">
                  {user?.classGrade || (gradeLevel === 'ilkokul' ? '3. Sınıf' : gradeLevel === 'ortaokul' ? '8. Sınıf (LGS)' : '12. Sınıf (YKS)')}
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-200 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-300">
                  {user?.role === 'ogretmen' ? '👨‍🏫 Öğretmen' : '🎓 Öğrenci'}
                </span>
              </div>

              {/* School and Target Exam */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <School className="h-3.5 w-3.5 text-[#e11d48]" />
                  <span>{user?.schoolName || 'Cumhuriyet Ortaokulu'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Target className="h-3.5 w-3.5 text-amber-500" />
                  <span>Hedef: <strong>{user?.targetExam || 'LGS 500 Puan'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Stats & Edit Profile Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3.5 py-2 text-center dark:border-slate-800 dark:bg-slate-800/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Gelişim Seviyesi
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                {user?.level || 1}. Seviye • <span className="text-[#e11d48]">{user?.xp || 150} XP</span>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/80 px-3.5 py-2 text-center dark:border-orange-950/40 dark:bg-orange-950/20">
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
                <Flame className="h-3 w-3 fill-orange-500" />
                <span>Seri</span>
              </div>
              <div className="text-xs font-black text-orange-700 dark:text-orange-300">
                {user?.streakDays || 3} Gün
              </div>
            </div>

            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#e11d48] hover:text-[#e11d48] px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-pink-500 transition"
              title="Okul ve Sınıf Bilgilerini Düzenle"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Okul / Profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DERS BAZLI GÖRSEL İLERLEME ÇUBUKLARI (SUBJECT MASTERY & PROGRESS BARS) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Ders Bazlı Kazanım ve İlerleme Durumu
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                MEB müfredatı konu tamamlama ve test doğruluk oranları
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            {gradeLevel === 'ilkokul' ? 'İlkokul Müfredatı' : gradeLevel === 'ortaokul' ? 'LGS Hazırlık' : 'YKS / AYT Seviyesi'}
          </span>
        </div>

        {/* Progress Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {subjectProgressList.map((item) => (
            <div
              key={item.subject}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                  {item.subject}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  %{item.progressPercent}
                </span>
              </div>

              {/* Progress Bar Component */}
              <div className="h-2.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-700 overflow-hidden mb-2.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700`}
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                <span>{item.completedTopics} / {item.totalTopics} Konu Tamamlandı</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">%{item.accuracy} Doğruluk</span>
              </div>

              {/* Detected Weak Point Tag */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-1 text-[10px]">
                <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 truncate max-w-[190px]" title={item.weakTopic}>
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span className="truncate">Eksik: {item.weakTopic}</span>
                </div>
                <button
                  onClick={() => setActiveTab('live-classroom')}
                  className="font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline shrink-0"
                >
                  Çalış →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GEMINI API ILE KİŞİSELLEŞTİRİLMİŞ EKSİK KONU ANALİZİ VE HAFTALIK ÇALIŞMA PLANI (DAILY STUDY FOCUS) */}
      <div className="rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 p-5 sm:p-6 shadow-2xs dark:border-indigo-500/20 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Yapay Zeka Eksik Konu Teşhisi & Haftalık Çalışma Rotası
                </h2>
                <span className="rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px] font-extrabold px-2 py-0.5">
                  Gemini API
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deneme sınavı ve test dönütlerinizi analiz ederek zayıf olduğunuz kazanımları telafi eden 7 günlük rota oluşturur.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateWeakTopicPlan}
            disabled={isGeneratingWeakPlan}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition shrink-0"
          >
            <Sparkles className={`h-4 w-4 ${isGeneratingWeakPlan ? 'animate-spin' : ''}`} />
            <span>{isGeneratingWeakPlan ? 'Eksikler Analiz Ediliyor...' : 'Eksiklerime Özel Haftalık Plan Üret'}</span>
          </button>
        </div>

        {/* Generated Weekly Plan Display or Initial Guidance */}
        {generatedPlan ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="rounded-2xl border border-indigo-200 bg-white/90 p-3.5 dark:border-indigo-900 dark:bg-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                🎯 <strong>Yapay Zeka Stratejisi:</strong> {generatedPlan.summary}
              </div>
              <button
                onClick={handleApplyPlanToSchedule}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white shadow-xs transition shrink-0"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                <span>Bu Planı Haftalık Takvime Aktar</span>
              </button>
            </div>

            {/* 7 Daily Focus Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
              {generatedPlan.focusDays.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-850 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-extrabold mb-1">
                      <span className="text-indigo-600 dark:text-indigo-400">{item.day}</span>
                      <span className="text-amber-600 font-bold text-[10px]">+{item.xp} XP</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {item.subject}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight mb-2">
                      {item.topic}
                    </h4>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.duration} dk</span>
                    <button
                      onClick={() => setActiveTab('live-classroom')}
                      className="font-bold text-[#e11d48] hover:underline"
                    >
                      Başla →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/50 p-4 text-center dark:border-indigo-900/60 dark:bg-slate-800/30">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Şu anda <strong>Matematik ({subjectProgressList[0]?.weakTopic})</strong> ve <strong>Fen ({subjectProgressList[1]?.weakTopic})</strong> konularında kazanım pekiştirmesi öneriliyor.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              "Eksiklerime Özel Haftalık Plan Üret" butonuna tıklayarak Gemini modelinin tüm eksiklerinizi günlere dağıttığı akıllı çalışma rotasını tek tıkla oluşturabilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* 4. AI-POWERED PERSONALIZED DAILY STUDY RECOMMENDATION CARD (Günün Rotası) */}
      {!simplicityMode && (
        <div className="relative overflow-hidden rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10 p-5 sm:p-6 shadow-2xs dark:border-pink-500/20 dark:bg-slate-900">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e11d48] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  <span>{rec.badge}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  <Clock className="h-3 w-3 text-pink-600" />
                  <span>{rec.estimatedMinutes} dk</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-black text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300">
                  <Zap className="h-3 w-3 fill-amber-500" />
                  <span>{rec.xpReward}</span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {rec.topic}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {rec.aiAdvice}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={() => setActiveTab(rec.primaryActionTab)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#e11d48] hover:bg-rose-700 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md transition"
              >
                <span>{rec.primaryActionText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab(rec.secondaryActionTab)}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                <span>{rec.secondaryActionText}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. QUICK LAUNCH WORKSPACE TILES */}
      {!simplicityMode && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Derslik & Çalışma Modülleri
            </h2>
            <span className="text-xs font-medium text-slate-400">
              MEB Müfredatı & Gemini 3 Destekli
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {quickLaunchCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveTab(card.id)}
                  className="group relative cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr ${card.gradient} text-white shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#e11d48] transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#e11d48] dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Hemen Aç</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* School Profile Edit Modal */}
      <SchoolProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
};
