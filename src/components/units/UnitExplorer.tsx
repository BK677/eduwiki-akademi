import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MAARIF_5_SUBJECTS, Maarif5Subject, Maarif5Unit, Maarif5Topic } from '../../data/maarif5Data';
import {
  BookOpen,
  Play,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Search,
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Clock,
  Award,
  BookMarked,
  RotateCcw,
  Check,
  X,
  MessageSquare,
  Send,
  Loader2,
  MonitorPlay,
  Lightbulb,
  GraduationCap,
  ListOrdered,
  FileQuestion,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Flame,
  Star
} from 'lucide-react';
import { askGeminiTeacher } from '../../services/geminiService';

export const UnitExplorer: React.FC = () => {
  const { addXP, showToast, selectedModel } = useApp();
  
  // Active subject state (Top bar selection)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('matematik');
  const [semesterFilter, setSemesterFilter] = useState<'all' | '1' | '2'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Accordion state: Set of expanded unit IDs (where user clicked '+' to show topics)
  const [expandedUnitIds, setExpandedUnitIds] = useState<Set<string>>(new Set(['mat-u1', 'mat-u2']));
  
  // Dedicated Study Theater Workspace (Ders Çalışma Odası)
  const [activeUnitModal, setActiveUnitModal] = useState<Maarif5Unit | null>(null);
  const [activeSubjectForModal, setActiveSubjectForModal] = useState<Maarif5Subject | null>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [modalTab, setModalTab] = useState<'video' | 'summary' | 'quiz' | 'flashcards' | 'ai'>('video');
  const [isFullscreenTheater, setIsFullscreenTheater] = useState<boolean>(false);
  
  // Video & Smartboard mode
  const [videoMode, setVideoMode] = useState<'youtube' | 'interactive_board'>('youtube');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSpeakingSlide, setIsSpeakingSlide] = useState<boolean>(false);
  
  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);

  // AI Chat state
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; topicTag?: string }>>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Current active subject from list
  const currentSubject = MAARIF_5_SUBJECTS.find(s => s.id === selectedSubjectId) || MAARIF_5_SUBJECTS[0];

  // Filter units
  const filteredUnits = currentSubject.units.filter(unit => {
    const matchesSemester = semesterFilter === 'all' || unit.semester.toString() === semesterFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subtopics.some(st => st.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSemester && matchesSearch;
  });

  // Toggle single unit accordion (+ / -)
  const toggleUnitAccordion = (unitId: string) => {
    setExpandedUnitIds(prev => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  };

  // Expand or collapse all units
  const toggleAllUnits = () => {
    if (expandedUnitIds.size >= filteredUnits.length) {
      setExpandedUnitIds(new Set());
    } else {
      setExpandedUnitIds(new Set(filteredUnits.map(u => u.id)));
    }
  };

  // Open unit study workspace (Ders Çalışma Ekranı)
  const handleOpenUnit = (
    unit: Maarif5Unit, 
    topicIndex: number = 0, 
    initialTab: 'video' | 'summary' | 'quiz' | 'flashcards' | 'ai' = 'video'
  ) => {
    setActiveUnitModal(unit);
    setActiveSubjectForModal(currentSubject);
    setActiveTopicIndex(topicIndex);
    setModalTab(initialTab);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setCurrentSlideIndex(0);
    setVideoMode('youtube');
    
    const activeTopic = unit.topics[topicIndex] || unit.topics[0];
    
    // Set default AI welcome message for this specific topic
    setAiChatMessages([
      {
        role: 'assistant',
        text: `Merhaba! Ben senin 5. Sınıf Maarif Modeli yapay zekâ öğretmeninim. 🎓\n\nŞu anda **${currentSubject.name}** dersi **${unit.title}** ünitesinde yer alan **"${activeTopic ? activeTopic.title : unit.title}"** konusunu çalışıyoruz.\n\nTakıldığın bir kavram, formül, örnek soru çözümü veya pratik ipucu istediğin her an buradayım. Bana dilediğini sorabilirsin!`,
        topicTag: activeTopic ? activeTopic.title : unit.title
      }
    ]);
  };

  // Close study workspace
  const handleCloseModal = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingSlide(false);
    setActiveUnitModal(null);
    setActiveSubjectForModal(null);
    setIsFullscreenTheater(false);
  };

  // Handle quiz option selection
  const handleSelectQuizOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    if (!activeUnitModal) return;
    const questions = activeUnitModal.quiz.questions;
    let correct = 0;
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setQuizSubmitted(true);
    setQuizScore({ correct, total: questions.length });

    const earnedXp = correct * 25;
    if (earnedXp > 0) {
      addXP(earnedXp, `${activeUnitModal.title} Kavrama Testi Başarısı`);
      showToast(`Harika! ${correct}/${questions.length} doğru yaparak +${earnedXp} XP kazandın! 🌟`, 'reward');
    }
  };

  // Speak slide text using Web Speech
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Tarayıcınız sesli okumayı desteklemiyor.', 'info');
      return;
    }

    if (isSpeakingSlide) {
      window.speechSynthesis.cancel();
      setIsSpeakingSlide(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeakingSlide(true);
    utterance.onend = () => setIsSpeakingSlide(false);
    utterance.onerror = () => setIsSpeakingSlide(false);
    window.speechSynthesis.speak(utterance);
  };

  // AI Prompt submission
  const handleSendAiPrompt = async (presetText?: string) => {
    const userMsg = (presetText || aiPromptInput).trim();
    if (!userMsg || !activeUnitModal || !activeSubjectForModal) return;

    const currentTopicTitle = activeUnitModal.topics[activeTopicIndex]?.title || activeUnitModal.title;

    setAiChatMessages(prev => [
      ...prev,
      { role: 'user', text: userMsg, topicTag: currentTopicTitle }
    ]);
    if (!presetText) setAiPromptInput('');
    setIsAiLoading(true);

    try {
      const history = aiChatMessages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const contextPrompt = `Sen Türkiye Yüzyılı Maarif Modeli müfredatına tam hakim, 5. sınıf ortaokul öğrencilerine sabırla, sevecenlikle ve öğretici şekilde anlatan bir uzman öğretmensin.
Ders: ${activeSubjectForModal.name} (5. Sınıf)
Ünite: ${activeUnitModal.title}
Seçili Konu: ${currentTopicTitle}
Kazanımlar: ${activeUnitModal.kazanimlar.join('; ')}

Öğrenci Sorusu: ${userMsg}

Lütfen 5. sınıf seviyesinde, anlaşılır, madde madde ve günlük hayattan örneklerle anlat. Varsa pratik formül veya akılda kalıcı şifreler ver.`;

      const response = await askGeminiTeacher(
        contextPrompt,
        history,
        'ortaokul',
        activeSubjectForModal.name,
        selectedModel
      );

      setAiChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: response.text,
          topicTag: currentTopicTitle
        }
      ]);
    } catch {
      setAiChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Üzgünüm, şu an bağlantıda kısa bir gecikme oldu. Lütfen sorunu tekrar sorabilir misin?',
          topicTag: currentTopicTitle
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Active topic object inside modal
  const currentActiveTopic: Maarif5Topic | undefined = activeUnitModal?.topics[activeTopicIndex] || activeUnitModal?.topics[0];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">

      {/* ========================================================================= */}
      {/* 1. MORPA KAMPÜS YUKARI DERSLER ŞERİDİ (SUBJECTS SELECTOR)                */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">
              5. Sınıf Maarif Modeli Dersleri
            </h2>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Morpa & Derslig Standartı
          </span>
        </div>

        {/* Horizontal scrollable / grid subjects cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {MAARIF_5_SUBJECTS.map((subject) => {
            const isSelected = subject.id === selectedSubjectId;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  setSelectedSubjectId(subject.id);
                  // Expand the first unit of the newly selected subject by default
                  const firstUnit = subject.units[0];
                  if (firstUnit) {
                    setExpandedUnitIds(new Set([firstUnit.id]));
                  }
                }}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-blue-500 shadow-md ring-2 ring-blue-500/20 scale-[1.03]'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {/* Active Indicator Pin */}
                {isSelected && (
                  <span className="absolute -top-1.5 w-7 h-1.5 rounded-full bg-blue-600"></span>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110 ${
                  isSelected 
                    ? `bg-gradient-to-br ${subject.themeColor.primary} text-white shadow-md shadow-blue-500/20` 
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
                }`}>
                  <span>{subject.icon}</span>
                </div>

                <span className={`text-xs sm:text-sm font-bold line-clamp-1 transition-colors ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {subject.name}
                </span>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-400'
                  }`}>
                    {subject.units.length} Ünite
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEÇİLEN DERS BİLGİ PANELİ & FİLTRELER                                  */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Subject title & quick stats */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${currentSubject.themeColor.primary} text-white shadow-lg shadow-blue-500/10`}>
              {currentSubject.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  5. Sınıf {currentSubject.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  2024-2025 Maarif Modeli
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Haftalık {currentSubject.mebWeeklyHours} Saat
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {currentSubject.description}
              </p>
            </div>
          </div>

          {/* Controls: Semester filter, Search & Expand All */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Semester Filter */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setSemesterFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  semesterFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setSemesterFilter('1')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  semesterFilter === '1'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                1. Dönem
              </button>
              <button
                onClick={() => setSemesterFilter('2')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  semesterFilter === '2'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                2. Dönem
              </button>
            </div>

            {/* Expand / Collapse All Accordions Button */}
            <button
              onClick={toggleAllUnits}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
              title="Tüm ünitelerin konularını aç veya kapat"
            >
              {expandedUnitIds.size >= filteredUnits.length ? (
                <>
                  <Minus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tümünü Kapat</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tüm Konuları Göster</span>
                </>
              )}
            </button>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Konu veya ünite ara..."
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. AŞAĞIDA SEÇİLEN DERSİN ÜNİTELERİ (MORPA KAMPÜS AKORDEON LİSTESİ)     */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {filteredUnits.map((unit) => {
          const isExpanded = expandedUnitIds.has(unit.id);
          const isTheme = unit.title.startsWith('Theme');
          const unitBadge = isTheme ? unit.title.split(':')[0] : `${unit.unitNumber}. Ünite`;

          return (
            <div
              key={unit.id}
              className={`bg-white dark:bg-slate-900 border transition-all duration-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-md ${
                isExpanded
                  ? 'border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* UNIT HEADER ROW */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Unit Identity & Title */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-sm text-white shadow-md bg-gradient-to-br ${currentSubject.themeColor.primary}`}>
                    {unit.unitNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        currentSubject.id === 'ingilizce'
                          ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border-violet-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200'
                      }`}>
                        {unitBadge}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {unit.semester}. Dönem
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {unit.topics.length} Alt Konu
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {unit.description}
                    </p>
                  </div>
                </div>

                {/* Right: Action Buttons & Prominent Morpa Plus (+) Button */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
                  
                  {/* Direct Launch Workspace Button */}
                  <button
                    onClick={() => handleOpenUnit(unit, 0, 'video')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Dersi Çalış</span>
                  </button>

                  {/* Test Button */}
                  <button
                    onClick={() => handleOpenUnit(unit, 0, 'quiz')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                  >
                    <FileQuestion className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Test ({unit.quiz.questions.length})</span>
                  </button>

                  {/* ============================================================== */}
                  {/* BÜYÜK VE ŞIK MORPA KAMPÜS "+" (ARTIYA BASINCA KONULAR ÇIKAN) BUTON */}
                  {/* ============================================================== */}
                  <button
                    onClick={() => toggleUnitAccordion(unit.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 border ${
                      isExpanded
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                    }`}
                    title={isExpanded ? 'Konuları Gizle' : 'Konuları Göster (+)'}
                  >
                    <span className="hidden sm:inline">
                      {isExpanded ? 'Konuları Gizle' : 'Konular'}
                    </span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-base transition-transform duration-300 ${
                      isExpanded ? 'bg-white/20 rotate-180' : 'bg-blue-200/60 dark:bg-blue-800/60'
                    }`}>
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                </div>
              </div>

              {/* ============================================================== */}
              {/* EXPANDED ACCORDION: MORPA KAMPÜS KONULAR LİSTESİ               */}
              {/* ============================================================== */}
              {isExpanded && (
                <div className="bg-slate-50/80 dark:bg-slate-850/60 border-t border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        {unitBadge} Konu Listesi ve Kazanımları ({unit.topics.length} Konu)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Çalışmak istediğin konuyu seç ve başla
                    </span>
                  </div>

                  {/* List of topics inside unit */}
                  <div className="space-y-3">
                    {unit.topics.map((topic, topicIdx) => (
                      <div
                        key={topicIdx}
                        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Topic title & subtopic items */}
                        <div className="flex items-start gap-3.5 flex-1">
                          <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">
                            {topicIdx + 1}
                          </span>

                          <div className="space-y-1.5 flex-1">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                              {topic.title}
                            </h4>
                            
                            {/* Subtopics bullet pills */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {topic.subtopics.map((sub, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700"
                                >
                                  • {sub}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Morpa Kampüs Topic Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto flex-shrink-0 pt-2 md:pt-0">
                          
                          {/* 1. Dersi Çalış / Video */}
                          <button
                            onClick={() => handleOpenUnit(unit, topicIdx, 'video')}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                            title="Bu konunun video dersini ve tahta anlatımını aç"
                          >
                            <MonitorPlay className="w-3.5 h-3.5" />
                            <span>Dersi Çalış</span>
                          </button>

                          {/* 2. Konu Özeti */}
                          <button
                            onClick={() => handleOpenUnit(unit, topicIdx, 'summary')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 transition-colors"
                            title="Konu özeti ve formüller"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Özet Notlar</span>
                          </button>

                          {/* 3. Kavrama Testi */}
                          <button
                            onClick={() => handleOpenUnit(unit, topicIdx, 'quiz')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors"
                            title="Kavrama testini çöz"
                          >
                            <FileQuestion className="w-3.5 h-3.5" />
                            <span>Kavrama Testi</span>
                          </button>

                          {/* 4. AI Öğretmene Sor */}
                          <button
                            onClick={() => handleOpenUnit(unit, topicIdx, 'ai')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition-colors"
                            title="Yapay zekâ öğretmenine soru sor"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>AI Öğretmen</span>
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Unit Bottom Summary Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>🎯 Toplam <strong>{unit.kazanimlar.length}</strong> MEB Kazanımı</span>
                      <span>•</span>
                      <span>📝 <strong>{unit.quiz.questions.length}</strong> Kavrama Sorusu</span>
                      <span>•</span>
                      <span>💡 <strong>{unit.flashcards.length}</strong> Kavram Kartı</span>
                    </div>

                    <button
                      onClick={() => handleOpenUnit(unit, 0, 'video')}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Tüm Ünite Çalışma Odasını Aç</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredUnits.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <BookMarked className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
            Aradığınız kritere uygun ünite bulunamadı
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Farklı bir arama kelimesi veya dönem filtresi deneyebilirsiniz.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GENİŞ VE FERAH MORPA KAMPÜS DERS ÇALIŞMA EKRANI (STUDY THEATER)        */}
      {/* ========================================================================= */}
      {activeUnitModal && activeSubjectForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 my-auto ${
            isFullscreenTheater ? 'fixed inset-0 rounded-none h-full max-h-screen' : 'max-w-7xl max-h-[95vh]'
          }`}>
            
            {/* 1. TOP HEADER: BREADCRUMB & TOPIC SWITCHER */}
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
              
              {/* Breadcrumb Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${activeSubjectForModal.themeColor.primary} text-white shadow-md flex-shrink-0`}>
                  {activeSubjectForModal.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="font-bold text-blue-400">5. Sınıf</span>
                    <span>&gt;</span>
                    <span>{activeSubjectForModal.name}</span>
                    <span>&gt;</span>
                    <span className="text-amber-400 font-semibold">{activeUnitModal.semester}. Dönem</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white line-clamp-1">
                    {activeUnitModal.title}
                  </h2>
                </div>
              </div>

              {/* Topic Switcher & Modal Window Controls */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                {/* Topic Navigation */}
                <div className="flex items-center bg-slate-800/80 rounded-2xl p-1 border border-slate-700/80">
                  <button
                    disabled={activeTopicIndex <= 0}
                    onClick={() => setActiveTopicIndex(prev => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-xl hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-200 transition-colors"
                    title="Önceki Konu"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-2 text-xs font-bold text-slate-200 whitespace-nowrap">
                    Konu {activeTopicIndex + 1} / {activeUnitModal.topics.length}
                  </span>

                  <button
                    disabled={activeTopicIndex >= activeUnitModal.topics.length - 1}
                    onClick={() => setActiveTopicIndex(prev => Math.min(activeUnitModal.topics.length - 1, prev + 1))}
                    className="p-1.5 rounded-xl hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-200 transition-colors"
                    title="Sonraki Konu"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreenTheater(prev => !prev)}
                  className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                  title={isFullscreenTheater ? 'Pencere Moduna Dön' : 'Tam Ekran Sinema Modu'}
                >
                  {isFullscreenTheater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-2xl bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white transition-colors"
                  title="Ders Ekranını Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* 2. TABS BAR: Morpa Kampüs Study Navigation */}
            <div className="flex items-center gap-1 px-4 sm:px-6 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs sm:text-sm font-bold">
              <button
                onClick={() => setModalTab('video')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  modalTab === 'video'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-sm'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MonitorPlay className="w-4 h-4 text-blue-500" />
                <span>Video & Akıllı Tahta Dersi</span>
              </button>

              <button
                onClick={() => setModalTab('summary')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  modalTab === 'summary'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-sm'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Konu Özeti & Formül Defteri</span>
              </button>

              <button
                onClick={() => setModalTab('quiz')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  modalTab === 'quiz'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-sm'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileQuestion className="w-4 h-4 text-emerald-500" />
                <span>Kavrama Testi ({activeUnitModal.quiz.questions.length} Soru)</span>
              </button>

              <button
                onClick={() => setModalTab('flashcards')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  modalTab === 'flashcards'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-sm'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Kavram Kartları ({activeUnitModal.flashcards.length})</span>
              </button>

              <button
                onClick={() => setModalTab('ai')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  modalTab === 'ai'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-sm'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Maarif AI Öğretmen</span>
              </button>
            </div>

            {/* 3. ACTIVE TOPIC HEADER BANNER */}
            <div className="px-4 sm:px-6 py-3 bg-blue-50/60 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="font-extrabold text-blue-700 dark:text-blue-300">
                  🎯 Seçili Konu {activeTopicIndex + 1}:
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {currentActiveTopic?.title || activeUnitModal.title}
                </span>
              </div>

              {/* Quick Topic Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {activeUnitModal.topics.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTopicIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                      activeTopicIndex === idx
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}. {t.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. WORKSPACE BODY: Expansive & Comfortable Layout */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

              {/* ============================================================= */}
              {/* TAB 1: VIDEO & AKILLI TAHTA OYNATICI                           */}
              {/* ============================================================= */}
              {modalTab === 'video' && (
                <div className="space-y-4">
                  {/* Mode Selector & External YouTube Button Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setVideoMode('youtube')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          videoMode === 'youtube'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>▶ YouTube Video Dersi</span>
                      </button>

                      <button
                        onClick={() => setVideoMode('interactive_board')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          videoMode === 'interactive_board'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>🏫 Morpa Akıllı Tahta Dersi (İnteraktif)</span>
                      </button>
                    </div>

                    {/* Direct External YouTube Button with Targeted Search */}
                    <a
                      href={`https://www.youtube.com/results?search_query=5.+s%C4%B1n%C4%B1f+${encodeURIComponent(activeSubjectForModal.name)}+${encodeURIComponent(currentActiveTopic?.title || activeUnitModal.title)}+konu+anlat%C4%B1m%C4%B1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-100 text-xs font-bold border border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
                      title="YouTube üzerinde yeni sekmede tam ekran izle"
                    >
                      <span>YouTube'da Aç (HD)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* VIDEO CONTAINER (16:9 Widescreen Theater) */}
                  {videoMode === 'youtube' ? (
                    <div className="space-y-2">
                      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${activeUnitModal.video.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                          title={activeUnitModal.video.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>

                      {/* Helpful info pill if YouTube blocks third party embeds */}
                      <div className="flex items-center justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <span>
                            <strong>İpucu:</strong> Eğer tarayıcınız YouTube gömmeyi kısıtlarsa, yukarıdan <strong>"Morpa Akıllı Tahta Dersi"</strong> moduna geçebilir veya <strong>"YouTube'da Aç"</strong> butonuna basabilirsiniz.
                          </span>
                        </div>
                        <button
                          onClick={() => setVideoMode('interactive_board')}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold whitespace-nowrap transition-colors"
                        >
                          Tahtaya Geç
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* INTERACTIVE SMART CHALKBOARD (MORPA KAMPÜS MODU) */
                    <div className="relative w-full min-h-[420px] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-900 flex flex-col justify-between">
                      {/* Board Header */}
                      <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                            Morpa Akıllı Tahta Dersi • Slayt {currentSlideIndex + 1} / 3
                          </span>
                        </div>

                        {/* Read aloud TTS button */}
                        <button
                          onClick={() => {
                            const slideTexts = [
                              `${currentActiveTopic?.title || activeUnitModal.title}. ${activeUnitModal.description}`,
                              `Kazanımlar ve önemli noktalar: ${activeUnitModal.kazanimlar.join('. ')}`,
                              `Örnek soru ve çözüm: ${activeUnitModal.quiz.questions[0]?.question || ''}. Çözüm: ${activeUnitModal.quiz.questions[0]?.explanation || ''}`
                            ];
                            handleSpeakText(slideTexts[currentSlideIndex]);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            isSpeakingSlide
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200'
                          }`}
                        >
                          {isSpeakingSlide ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          <span>{isSpeakingSlide ? 'Durdur' : 'Sesli Dinle'}</span>
                        </button>
                      </div>

                      {/* Board Interactive Slide Content */}
                      <div className="py-6 sm:py-8 space-y-4">
                        {currentSlideIndex === 0 && (
                          <div className="space-y-4 animate-fadeIn">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Adım 1: Temel Kavramlar & Püf Noktalar
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-emerald-100">
                              {currentActiveTopic?.title || activeUnitModal.title}
                            </h3>
                            <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed font-mono">
                              {activeUnitModal.description}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              {currentActiveTopic?.subtopics.map((sub, sIdx) => (
                                <div key={sIdx} className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs sm:text-sm text-emerald-100">
                                  ✓ {sub}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentSlideIndex === 1 && (
                          <div className="space-y-4 animate-fadeIn">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Adım 2: MEB Kazanımları ve Sınav İpuçları
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-amber-100">
                              Kazanımlar & Sınavda Çıkacak Yerler
                            </h3>
                            <div className="space-y-2.5 pt-2">
                              {activeUnitModal.kazanimlar.map((kaz, kIdx) => (
                                <div key={kIdx} className="flex items-start gap-2.5 bg-black/30 p-3 rounded-xl border border-emerald-800/40 text-xs sm:text-sm text-emerald-200">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  <span>{kaz}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentSlideIndex === 2 && (
                          <div className="space-y-4 animate-fadeIn">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Adım 3: Örnek Çözümlü Soru
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white">
                              {activeUnitModal.quiz.questions[0]?.question}
                            </h3>
                            <div className="bg-emerald-950/80 border border-emerald-600/60 p-4 rounded-2xl text-xs sm:text-sm space-y-2">
                              <div className="font-bold text-emerald-300">💡 Öğretmenin Çözüm Yolu:</div>
                              <p className="text-emerald-100 font-mono">
                                {activeUnitModal.quiz.questions[0]?.explanation}
                              </p>
                              <div className="text-emerald-300 text-xs">
                                📌 İpucu: {activeUnitModal.quiz.questions[0]?.hint}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Board Navigation Controls */}
                      <div className="flex items-center justify-between border-t border-emerald-800/60 pt-4">
                        <button
                          disabled={currentSlideIndex <= 0}
                          onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-xs font-bold transition-colors"
                        >
                          ← Önceki Adım
                        </button>

                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map(idx => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlideIndex(idx)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                currentSlideIndex === idx ? 'bg-emerald-400 scale-125' : 'bg-emerald-800'
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          disabled={currentSlideIndex >= 2}
                          onClick={() => setCurrentSlideIndex(prev => Math.min(2, prev + 1))}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                        >
                          Sonraki Adım →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Video & Topic Summary Details Box */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {activeUnitModal.video.title}
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                        {activeUnitModal.video.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeUnitModal.video.summary}
                    </p>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Anlatan: {activeUnitModal.video.instructor}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 2: KONU ÖZETİ & FORMÜL DEFTERİ                            */}
              {/* ============================================================= */}
              {modalTab === 'summary' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Summary Header */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <h3 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-200">
                          {currentActiveTopic?.title || activeUnitModal.title} — Maarif Özeti
                        </h3>
                      </div>
                      <button
                        onClick={() => handleSpeakText(`${currentActiveTopic?.title || activeUnitModal.title}. ${activeUnitModal.description}. Kazanımlar: ${activeUnitModal.kazanimlar.join('. ')}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Sesli Dinle</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                      {activeUnitModal.description}
                    </p>
                  </div>

                  {/* Bulleted Points & Subtopics */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Bu Konuda Bilmen Gereken Alt Başlıklar</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentActiveTopic?.subtopics.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700"
                        >
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {sub}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MEB Kazanimlari */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>MEB Maarif Modeli Resmi Kazanımları</span>
                    </h4>

                    <div className="space-y-2">
                      {activeUnitModal.kazanimlar.map((kaz, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2"></span>
                          <span>{kaz}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solved Example Problem */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-3xl p-6 shadow-sm space-y-3">
                    <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-300 tracking-wider">
                      🎯 Örnek Çözümlü Soru
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {activeUnitModal.quiz.questions[0]?.question}
                    </h4>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-blue-900 text-xs sm:text-sm space-y-1">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">Çözüm:</div>
                      <p className="text-slate-700 dark:text-slate-300 font-mono">
                        {activeUnitModal.quiz.questions[0]?.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 3: KAVRAMA TESTİ (QUIZ)                                   */}
              {/* ============================================================= */}
              {modalTab === 'quiz' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                        {activeUnitModal.quiz.title}
                      </h3>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                        Her doğru cevap için +25 XP kazanırsın!
                      </p>
                    </div>

                    {quizScore && (
                      <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-center">
                        <div className="text-xs text-slate-500 font-semibold">Skorun</div>
                        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {quizScore.correct} / {quizScore.total}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question Cards */}
                  <div className="space-y-4">
                    {activeUnitModal.quiz.questions.map((q, qIndex) => {
                      const selectedOption = quizAnswers[q.id];
                      const isCorrect = selectedOption === q.correctAnswer;

                      return (
                        <div
                          key={q.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                              {qIndex + 1}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                              {q.question}
                            </h4>
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                            {q.options.map((option, optIdx) => {
                              const isThisSelected = selectedOption === optIdx;
                              let btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400';

                              if (quizSubmitted) {
                                if (optIdx === q.correctAnswer) {
                                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                                } else if (isThisSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-500 text-white border-rose-600';
                                } else {
                                  btnStyle = 'opacity-50 bg-slate-100 dark:bg-slate-800 border-slate-200';
                                }
                              } else if (isThisSelected) {
                                btnStyle = 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={quizSubmitted}
                                  onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all text-left ${btnStyle}`}
                                >
                                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 ${
                                    isThisSelected || (quizSubmitted && optIdx === q.correctAnswer)
                                      ? 'bg-white/30 text-white'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{option}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation Box After Submit */}
                          {quizSubmitted && (
                            <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 animate-fadeIn ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                            }`}>
                              <div className="font-bold flex items-center gap-1.5">
                                {isCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                                <span>{isCorrect ? 'Tebrikler! Doğru cevap.' : 'Yanlış cevap.'}</span>
                              </div>
                              <p className="font-mono text-xs">
                                <strong>Çözüm:</strong> {q.explanation}
                              </p>
                              <div className="text-[11px] opacity-80">
                                💡 İpucu: {q.hint}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit / Reset Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length === 0}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-md hover:opacity-95 disabled:opacity-40 transition-all"
                      >
                        Cevapları Kontrol Et & Bitir
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setQuizScore(null);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs hover:bg-slate-300 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Testi Tekrar Çöz</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: KAVRAM KARTLARI (FLASHCARDS)                           */}
              {/* ============================================================= */}
              {modalTab === 'flashcards' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      Kavram {currentCardIndex + 1} / {activeUnitModal.flashcards.length}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                      Karta tıklayarak tanımı ve açıklamayı gör
                    </h3>
                  </div>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => setIsFlipped(prev => !prev)}
                    className="relative w-full h-64 sm:h-72 cursor-pointer perspective-1000"
                  >
                    <div className={`w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xl border transition-all duration-300 ${
                      isFlipped
                        ? 'bg-gradient-to-br from-indigo-900 to-purple-950 text-white border-purple-500'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                    }`}>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                        {isFlipped ? 'Tanım & Açıklama' : 'Kavram'}
                      </span>
                      <p className={`font-bold transition-all ${
                        isFlipped ? 'text-sm sm:text-base leading-relaxed text-purple-100' : 'text-xl sm:text-2xl text-blue-600 dark:text-blue-400'
                      }`}>
                        {isFlipped
                          ? activeUnitModal.flashcards[currentCardIndex]?.definition
                          : activeUnitModal.flashcards[currentCardIndex]?.term
                        }
                      </p>
                      <span className="text-[11px] text-slate-400 mt-4">
                        (Kartı çevirmek için tıkla 🔄)
                      </span>
                    </div>
                  </div>

                  {/* Card Navigation */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      disabled={currentCardIndex <= 0}
                      onClick={() => {
                        setCurrentCardIndex(prev => Math.max(0, prev - 1));
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold transition-colors"
                    >
                      ← Önceki
                    </button>

                    <button
                      onClick={() => {
                        setKnownCards(prev => new Set(prev).add(currentCardIndex));
                        addXP(10, 'Kavram Kartı Öğrenildi');
                        showToast('+10 XP Kazandın!', 'reward');
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold border transition-colors ${
                        knownCards.has(currentCardIndex)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{knownCards.has(currentCardIndex) ? 'Öğrendin ✓' : 'Öğrendim (+10 XP)'}</span>
                    </button>

                    <button
                      disabled={currentCardIndex >= activeUnitModal.flashcards.length - 1}
                      onClick={() => {
                        setCurrentCardIndex(prev => Math.min(activeUnitModal.flashcards.length - 1, prev + 1));
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold transition-colors"
                    >
                      Sonraki →
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 5: MAARİF AI ÖĞRETMEN                                      */}
              {/* ============================================================= */}
              {modalTab === 'ai' && (
                <div className="max-w-3xl mx-auto space-y-4">
                  {/* Quick Preset Prompts */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSendAiPrompt(`5. sınıf öğrencisiyim, "${currentActiveTopic?.title || activeUnitModal.title}" konusunu bana günlük hayattan bir örnekle anlat.`)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold transition-colors"
                    >
                      💡 Günlük Hayattan Örnekle Anlat
                    </button>
                    <button
                      onClick={() => handleSendAiPrompt(`"${currentActiveTopic?.title || activeUnitModal.title}" konusunda 5. sınıf seviyesinde bana çözümlü bir soru sor.`)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold transition-colors"
                    >
                      🎯 Bana Bir Örnek Soru Çöz
                    </button>
                    <button
                      onClick={() => handleSendAiPrompt(`Sınavlarda "${currentActiveTopic?.title || activeUnitModal.title}" konusundan en çok nerelerden soru gelir ve sık yapılan hatalar nelerdir?`)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold transition-colors"
                    >
                      ⚠️ Sık Yapılan Hatalar & Püf Noktaları
                    </button>
                  </div>

                  {/* Chat Message Box */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 sm:p-5 min-h-[300px] max-h-[450px] overflow-y-auto space-y-3">
                    {aiChatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            🎓
                          </div>
                        )}
                        <div className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm whitespace-pre-line leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-semibold p-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Maarif Öğretmeni hazırlıyor...</span>
                      </div>
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={aiPromptInput}
                      onChange={e => setAiPromptInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendAiPrompt()}
                      placeholder="Konu hakkında aklına takılan soruyu sor..."
                      className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => handleSendAiPrompt()}
                      disabled={isAiLoading || !aiPromptInput.trim()}
                      className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Sor</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
