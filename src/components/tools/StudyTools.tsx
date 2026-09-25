import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { generateSummaryWithFlashcards } from '../../services/geminiService';
import { Subject, Flashcard } from '../../types';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Brain,
  Coffee,
  CloudRain,
  Library,
  Flame
} from 'lucide-react';

export const StudyTools: React.FC = () => {
  const { gradeLevel, addXP } = useApp();

  // Pomodoro State
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Web Audio Ambient Noise generator
  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'library' | 'cafe'>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Flashcards state
  const [flashSubject, setFlashSubject] = useState<Subject>('Matematik');
  const [flashTopic, setFlashTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: '1', front: 'Doğal Sayılar (N) nedir?', back: '0\'dan başlayıp sonsuza kadar giden sayılar kümesidir: {0, 1, 2, 3, ...}' },
    { id: '2', front: 'Tam Sayılar (Z) nedir?', back: 'Negatif sayılar, sıfır ve pozitif sayıların tamamıdır: {..., -2, -1, 0, 1, 2, ...}' },
    { id: '3', front: 'Asal Sayı nedir?', back: 'Sadece 1\'e ve kendisine bölünebilen 1\'den büyük pozitif tam sayılardır (2, 3, 5, 7, ...)' },
  ]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [memoryTip, setMemoryTip] = useState<string>('Hafıza Çivisi: Formülleri sesli tekrar edip karatahtaya çizerek çalışmak kalıcılığı %80 artırır.');
  const [timerNotification, setTimerNotification] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  // Timer Tick Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      if (pomodoroMode === 'work') {
        setTimerNotification('🎉 Harika! 25 dakikalık odaklanma tamamlandı. 5 dakikalık mola vakti!');
        addXP(50, '25 dk Pomodoro Tamamlama');
        setPomodoroMode('break');
        setTimeLeft(5 * 60);
      } else {
        setTimerNotification('⏰ Mola süresi bitti! Yeni bir odak seansı başlatalım.');
        setPomodoroMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, pomodoroMode]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(pomodoroMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchPomodoroMode = (mode: 'work' | 'break') => {
    setPomodoroMode(mode);
    setIsTimerRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  // Ambient Sound Generator using Web Audio API (White / Pink Noise synthesis)
  const toggleAmbientSound = (sound: 'rain' | 'library' | 'cafe') => {
    if (activeSound === sound) {
      stopAmbientSound();
      return;
    }

    stopAmbientSound();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create white noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Filter to simulate sound
      const filter = ctx.createBiquadFilter();
      if (sound === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 800; // Rain / soft pink noise
      } else if (sound === 'library') {
        filter.type = 'bandpass';
        filter.frequency.value = 400; // Gentle air hum
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 600; // Soft cafe rumble
      }

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.08; // soothing low volume

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(0);
      noiseNodeRef.current = whiteNoise;
      setActiveSound(sound);
    } catch (e) {
      console.warn('Audio synthesis not permitted without user gesture');
    }
  };

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
      } catch {}
      noiseNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setActiveSound('none');
  };

  const handleGenerateCards = async () => {
    const topicToUse = flashTopic.trim() || 'Temel Kavramlar';
    setIsGeneratingCards(true);

    try {
      const data = await generateSummaryWithFlashcards(flashSubject, topicToUse, gradeLevel);
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(
          data.flashcards.map((fc: any, i: number) => ({
            id: String(i + 1),
            front: fc.front,
            back: fc.back,
          }))
        );
      }
      if (data.memoryTip) {
        setMemoryTip(data.memoryTip);
      }
      setFlippedCards({});
      addXP(25, 'Yeni bilgi kartları oluşturma');
    } catch (err: any) {
      setCardError(`Kartlar oluşturulamadı: ${err.message || 'Lütfen tekrar deneyin.'}`);
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Çalışma ve Odaklanma Odası
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pomodoro sayacı, rahatlatıcı odak sesleri ve yapay zeka hafıza kartları.
          </p>
        </div>
      </div>

      {/* Grid: Pomodoro & Ambient Sounds (5 cols) + Flashcards (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pomodoro & Sounds (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pomodoro Timer Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center">
            {/* Mode Switcher */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => switchPomodoroMode('work')}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                  pomodoroMode === 'work'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                🎯 25 dk Odak
              </button>
              <button
                onClick={() => switchPomodoroMode('break')}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                  pomodoroMode === 'break'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                ☕ 5 dk Mola
              </button>
            </div>

            {/* Huge Timer Display */}
            <div className="font-mono text-5xl sm:text-6xl font-black tracking-wider text-slate-900 dark:text-white mb-4">
              {timeFormatted}
            </div>

            {timerNotification && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                {timerNotification}
              </div>
            )}

            {/* Timer Action Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                }`}
              >
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                <span>{isTimerRunning ? 'Duraklat' : 'Başlat'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="flex items-center justify-center rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                title="Sıfırla"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Ambient Study Noise Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Volume2 className="h-4 w-4 text-cyan-600" />
                <span>Odaklanma Ambiyans Sesleri</span>
              </div>
              {activeSound !== 'none' && (
                <button
                  onClick={stopAmbientSound}
                  className="text-[11px] text-red-500 font-bold hover:underline"
                >
                  Sesi Kapat
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Dikkatin dağılmadan çalışabilmen için rahatlatıcı arka plan sesini açabilirsin:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'rain', label: 'Yağmur', icon: CloudRain },
                { id: 'library', label: 'Kütüphane', icon: Library },
                { id: 'cafe', label: 'Kafe', icon: Coffee },
              ].map((snd) => {
                const Icon = snd.icon;
                const isActive = activeSound === snd.id;
                return (
                  <button
                    key={snd.id}
                    onClick={() => toggleAmbientSound(snd.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-400 dark:bg-cyan-950/50 dark:text-cyan-300'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1.5" />
                    <span>{snd.label}</span>
                    <span className="text-[9px] font-normal opacity-70 mt-0.5">
                      {isActive ? 'Çalıyor ♪' : 'Başlat'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Flashcards & Smart Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gemini Akıllı Bilgi Kartları (Flashcards)
                </h3>
              </div>
            </div>

            {cardError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                {cardError}
              </div>
            )}

            {/* Topic input & generator */}
            <div className="flex flex-wrap gap-2">
              <select
                value={flashSubject}
                onChange={(e) => setFlashSubject(e.target.value as Subject)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {['Matematik', 'Fen Bilimleri', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe & Edebiyat', 'Sosyal Bilgiler & Tarih'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <input
                type="text"
                value={flashTopic}
                onChange={(e) => setFlashTopic(e.target.value)}
                placeholder="Örn: Newton Yasaları, Çarpanlara Ayırma..."
                className="flex-1 min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />

              <button
                onClick={handleGenerateCards}
                disabled={isGeneratingCards}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700 disabled:opacity-50 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isGeneratingCards ? 'Üretiliyor...' : 'Kartları Üret'}</span>
              </button>
            </div>

            {/* Cards Flip Carousel / List */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Kartı çevirmek için üzerine tıklayın:
              </div>

              {flashcards.map((card) => {
                const isFlipped = flippedCards[card.id];
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleCardFlip(card.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 min-h-[90px] flex flex-col justify-between select-none ${
                      isFlipped
                        ? 'border-purple-500 bg-purple-50/70 dark:border-purple-600 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
                      <span>{isFlipped ? 'CEVAP / AÇIKLAMA' : 'SORU / KAVRAM'}</span>
                      <span>{isFlipped ? 'Tıkla: Soruya Dön' : 'Tıkla: Cevabı Gör'}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold leading-relaxed">
                      {isFlipped ? card.back : card.front}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Memory Tip Box */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200 flex items-start gap-2">
              <Brain className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="leading-relaxed">
                <strong>Hafıza İpucu:</strong> {memoryTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
