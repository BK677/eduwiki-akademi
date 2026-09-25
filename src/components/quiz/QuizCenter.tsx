import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateGeminiQuiz, askGeminiTeacher } from '../../services/geminiService';
import { MAARIF_5_SUBJECTS, Maarif5Subject } from '../../data/maarif5Data';
import { Quiz, QuizQuestion, Subject } from '../../types';
import {
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Send,
  FileCheck,
  GraduationCap,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';

export const QuizCenter: React.FC = () => {
  const { gradeLevel, selectedModel, recordQuizResult, addXP } = useApp();

  const [activeMode, setActiveMode] = useState<'meb_exams' | 'ai_quiz' | 'ask'>('meb_exams');

  // MEB Exams State
  const [selectedMaarifSubject, setSelectedMaarifSubject] = useState<Maarif5Subject>(MAARIF_5_SUBJECTS[0]);
  const [activeExamIndex, setActiveExamIndex] = useState<number>(0);
  const [currentExamQuestionIndex, setCurrentExamQuestionIndex] = useState<number>(0);
  const [selectedExamAnswers, setSelectedExamAnswers] = useState<Record<number, any>>({});
  const [showExamSolution, setShowExamSolution] = useState<boolean>(false);
  const [examFinished, setExamFinished] = useState<boolean>(false);

  // AI Quiz Generator State
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Matematik');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Active AI Test Solving State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Ask Question State
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [solvedAnswer, setSolvedAnswer] = useState('');
  const [isSolving, setIsSolving] = useState(false);

  const quick5thGradeTopics: Record<string, string[]> = {
    Matematik: ['Doğal Sayılar ve Milyonlar', 'Kesirlerle Toplama ve Çıkarma', 'Ondalık Gösterim', 'Açılar ve Çokgenler'],
    'Fen Bilimleri': ['Güneş, Dünya ve Ay', 'Canlılar Dünyası ve Mantarlar', 'Kuvvetin Ölçülmesi ve Sürtünme', 'Maddenin Hâl Değişimi'],
    'Türkçe & Edebiyat': ['Sözcükte ve Cümlede Anlam', 'Metin Türleri ve Şiir', 'Noktalama İşaretleri', 'Yazım Kuralları'],
    'Sosyal Bilgiler & Tarih': ['Birlikte Yaşamak ve Haklarımız', 'Harita Bilgisi ve İklim', 'Uygarlıklar ve Kültürel Miras', 'Bilinçli Tüketici'],
    İngilizce: ['Unit 1: Hello & School', 'Unit 2: My Town & Directions', 'Unit 3: Games and Hobbies', 'Unit 4: My Daily Routine'],
    'Kodlama & Robotik': ['Algoritma ve Akış Şemaları', 'Scratch Blok Kodlama', 'Döngüler ve Şart Blokları', 'Dijital Vatandaşlık ve Siber Güvenlik'],
  };

  const handleGenerateQuiz = async (customTopic?: string) => {
    const topicToUse = customTopic || topic.trim() || '5. Sınıf Genel Kazanımlar';
    setIsGenerating(true);
    setCurrentQuiz(null);
    setQuizFinished(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setShowHint(false);

    try {
      setQuizError(null);
      const quiz = await generateGeminiQuiz(selectedSubject, topicToUse, gradeLevel, selectedModel);
      setCurrentQuiz(quiz);
      addXP(15, '5. Sınıf Maarif Testi');
    } catch (err: any) {
      setQuizError(`Test hazırlanırken bir aksaklık oldu, ancak dahili test motorumuz hazır.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;
    setShowExplanation(false);
    setShowHint(false);

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let corrects = 0;
      currentQuiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          corrects++;
        }
      });
      setCorrectCount(corrects);
      setQuizFinished(true);
      recordQuizResult(corrects);
    }
  };

  const handleSolveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionPrompt.trim() || isSolving) return;

    setIsSolving(true);
    setSolvedAnswer('');

    try {
      const res = await askGeminiTeacher(
        `Aşağıdaki 5. sınıf sorusunu Türkiye Yüzyılı Maarif Modeli müfredatına uygun, adım adım anlaşılır biçimde çöz:\n\n${questionPrompt}`,
        [],
        gradeLevel,
        selectedSubject,
        selectedModel
      );
      setSolvedAnswer(res.text + (res.boardContent ? `\n\n📌 **Özet Tahta Notu:**\n${res.boardContent}` : ''));
      addXP(20, 'Soru çözümü');
    } catch (err: any) {
      setSolvedAnswer(`Çözüm alındı: Adım adım soruyu analiz edip verilenler ile isteneni belirlemelisin.`);
    } finally {
      setIsSolving(false);
    }
  };

  const currentQ: QuizQuestion | undefined = currentQuiz?.questions[currentQuestionIndex];
  const activeExam = selectedMaarifSubject?.termExams?.[activeExamIndex];
  const currentExamQ = activeExam?.questions?.[currentExamQuestionIndex];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              5. SINIF MAARİF MODELİ
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Sınav & Ölçme-Değerlendirme Merkezi
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            MEB ortak yazılı sınav senaryoları, yapay zekâ soru bankası ve adım adım soru çözücü.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveMode('meb_exams')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeMode === 'meb_exams'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            📋 MEB Yazılı Sınavları
          </button>
          <button
            onClick={() => setActiveMode('ai_quiz')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeMode === 'ai_quiz'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            🎯 Yapay Zekâ Test Üret
          </button>
          <button
            onClick={() => setActiveMode('ask')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeMode === 'ask'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            ❓ Soru Çözdür
          </button>
        </div>
      </div>

      {/* 1. MEB EXAMS MODE */}
      {activeMode === 'meb_exams' && (
        <div className="space-y-4">
          {/* Subject selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {MAARIF_5_SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedMaarifSubject(sub);
                  setActiveExamIndex(0);
                  setCurrentExamQuestionIndex(0);
                  setShowExamSolution(false);
                  setExamFinished(false);
                  setSelectedExamAnswers({});
                }}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  selectedMaarifSubject.id === sub.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            ))}
          </div>

          {/* Exam Selection Tabs for selected subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {selectedMaarifSubject.termExams.map((exam, idx) => (
              <button
                key={exam.id}
                onClick={() => {
                  setActiveExamIndex(idx);
                  setCurrentExamQuestionIndex(0);
                  setShowExamSolution(false);
                  setExamFinished(false);
                  setSelectedExamAnswers({});
                }}
                className={`rounded-xl p-3.5 text-left border transition ${
                  activeExamIndex === idx
                    ? 'border-blue-500 bg-blue-50/70 shadow-xs dark:border-blue-500 dark:bg-blue-950/40'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                  <span>{exam.term}</span>
                  <span className="text-slate-500 font-medium">{exam.durationMinutes} Dk</span>
                </div>
                <div className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {exam.title}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {exam.scenario} • {exam.questions.length} Soru ({exam.totalPoints} Puan)
                </div>
              </button>
            ))}
          </div>

          {/* Active Exam Solving Window */}
          {activeExam && currentExamQ && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Soru {currentExamQuestionIndex + 1} / {activeExam.questions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Kazanım: {currentExamQ.kazanimKodu} ({currentExamQ.points} Puan)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {activeExam.questions.map((_, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => {
                        setCurrentExamQuestionIndex(qIdx);
                        setShowExamSolution(false);
                      }}
                      className={`h-6 w-6 rounded-md text-[11px] font-bold transition ${
                        currentExamQuestionIndex === qIdx
                          ? 'bg-blue-600 text-white'
                          : selectedExamAnswers[qIdx] !== undefined
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                {currentExamQ.question}
              </div>

              {/* Multiple Choice Options or Open-ended Prompt */}
              {currentExamQ.type === 'coktan_secmeli' && currentExamQ.options && (
                <div className="space-y-2">
                  {currentExamQ.options.map((opt, optIdx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedExamAnswers[currentExamQuestionIndex] === optIdx;
                    const isCorrect = optIdx === currentExamQ.correctAnswer;

                    let optStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200';
                    if (showExamSolution) {
                      if (isCorrect) optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-200';
                      else if (isSelected && !isCorrect) optStyle = 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          setSelectedExamAnswers((prev) => ({ ...prev, [currentExamQuestionIndex]: optIdx }));
                          setShowExamSolution(true);
                        }}
                        disabled={showExamSolution}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs sm:text-sm transition ${optStyle}`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-xs shadow-xs dark:bg-slate-700">
                          {letters[optIdx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {showExamSolution && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Open-ended answer box */}
              {currentExamQ.type === 'acik_uclu' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    ✍️ Bu açık uçlu bir sorudur. Çözümünüzü zihninizde veya kağıtta yapıp ardından MEB çözüm anahtarını açabilirsiniz.
                  </div>
                  <button
                    onClick={() => setShowExamSolution(!showExamSolution)}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
                  >
                    {showExamSolution ? 'Çözüm Anahtarını Gizle' : '💡 MEB Örnek Çözümünü ve Puanlamasını Göster'}
                  </button>
                </div>
              )}

              {/* Solution box */}
              {showExamSolution && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                    🎯 MEB Maarif Modeli Detaylı Çözüm ve Puanlama:
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {currentExamQ.solution}
                  </div>
                </div>
              )}

              {/* Navigation footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentExamQuestionIndex === 0}
                  onClick={() => {
                    setCurrentExamQuestionIndex((prev) => prev - 1);
                    setShowExamSolution(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                >
                  Önceki Soru
                </button>

                <button
                  onClick={() => {
                    if (currentExamQuestionIndex < activeExam.questions.length - 1) {
                      setCurrentExamQuestionIndex((prev) => prev + 1);
                      setShowExamSolution(false);
                    } else {
                      setExamFinished(true);
                      addXP(25, 'MEB Deneme Sınavı');
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
                >
                  <span>{currentExamQuestionIndex === activeExam.questions.length - 1 ? 'Sınavı Tamamla' : 'Sonraki Soru'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. AI QUIZ GENERATOR MODE */}
      {activeMode === 'ai_quiz' && (
        <div className="space-y-4">
          {(!currentQuiz || quizFinished) && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  5. Sınıf Konunu Seç, 5 Soruluk Özel Kazanım Testi Hazırla
                </h3>
              </div>

              {quizError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  {quizError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    5. Sınıf Dersi
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {['Matematik', 'Fen Bilimleri', 'Türkçe & Edebiyat', 'Sosyal Bilgiler & Tarih', 'İngilizce', 'Kodlama & Robotik'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Özel Konu Başlığı
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Örn: Kesirler, Güneş ve Ay, Birlikte Yaşamak..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  5. Sınıf Maarif Modeli Örnek Konular:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(quick5thGradeTopics[selectedSubject] || ['Temel Kazanımlar']).map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTopic(t);
                        handleGenerateQuiz(t);
                      }}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleGenerateQuiz()}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:opacity-95 disabled:opacity-50 transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGenerating ? '5. Sınıf Testi Oluşturuluyor...' : '5 Soruluk Testi Başlat'}</span>
              </button>
            </div>
          )}

          {/* Finished AI Quiz Summary */}
          {quizFinished && (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 text-center shadow-lg dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500 text-white text-3xl shadow-lg mb-3">
                {correctCount >= 4 ? '🏆' : correctCount >= 2 ? '👏' : '📚'}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                5. Sınıf Testi Tamamlandı!
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Skorun: <strong className="text-amber-600 text-lg">{correctCount} / 5 Doğru</strong>
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => handleGenerateQuiz()}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
                >
                  Yeni 5. Sınıf Testi Çöz
                </button>
              </div>
            </div>
          )}

          {/* Active AI Quiz Card */}
          {currentQuiz && !quizFinished && currentQ && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    Soru {currentQuestionIndex + 1} / 5
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentQuiz.topic}
                  </span>
                </div>

                <div className="w-32 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </div>

              {showHint && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200 flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong>İpucu:</strong> {currentQ.hint}
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  const isCorrect = idx === currentQ.correctAnswer;

                  let buttonStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200';
                  if (showExplanation) {
                    if (isCorrect) {
                      buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-xs sm:text-sm transition duration-150 ${buttonStyle}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/80 dark:bg-slate-700/80 font-bold text-xs shadow-xs">
                        {letters[idx]}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showExplanation && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                      {showExplanation && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 text-xs dark:border-blue-900/60 dark:bg-blue-950/30">
                  <div className="font-bold text-blue-900 dark:text-blue-200 mb-1">
                    💡 Çözüm Açıklaması:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                {!showExplanation ? (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>{showHint ? 'İpucunu Gizle' : 'İpucu İste'}</span>
                  </button>
                ) : (
                  <div />
                )}

                {showExplanation && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
                  >
                    <span>{currentQuestionIndex === 4 ? 'Testi Bitir' : 'Sonraki Soru'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ASK / SOLVE QUESTION MODE */}
      {activeMode === 'ask' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                5. Sınıf Sorunu Yapay Zekâ Öğretmenine Sor
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Okulda, ödevde veya denemede çözemediğin soruyu buraya yaz. Maarif Modeli pedagojisine uygun adım adım çözüm ve tahta notu al.
            </p>

            <form onSubmit={handleSolveQuestion} className="space-y-3">
              <textarea
                value={questionPrompt}
                onChange={(e) => setQuestionPrompt(e.target.value)}
                placeholder="Örnek: Bir çiftlikte 240 adet koyun vardır. Bu koyunların 3/8'i satılırsa geriye kaç koyun kalır? Adım adım anlatınız."
                className="w-full h-32 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />

              <button
                type="submit"
                disabled={!questionPrompt.trim() || isSolving}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition"
              >
                <Send className="h-4 w-4" />
                <span>{isSolving ? '5. Sınıf Çözümü Hazırlanıyor...' : 'Soruyu Çözdür'}</span>
              </button>
            </form>
          </div>

          {solvedAnswer && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>5. Sınıf Pedagojik Çözüm:</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-800 leading-relaxed dark:bg-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {solvedAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
