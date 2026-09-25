import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { askGeminiTeacher } from '../../services/geminiService';
import { AIModelType, Subject } from '../../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Radio,
  Clock,
  Sliders,
  Zap,
  Send,
  HelpCircle,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const MODEL_OPTIONS: { id: AIModelType; name: string; tag: string }[] = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', tag: 'Ultra Hızlı & Doğal Ses' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', tag: 'Derin Akıl Yürütme' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite', tag: 'Düşük Gecikme' },
];

export const VoiceInteractionView: React.FC = () => {
  const {
    gradeLevel,
    selectedModel,
    setSelectedModel,
    settings,
    updateSettings,
    setIsSettingsOpen,
    addXP,
    showToast,
  } = useApp();

  // Voice Interaction State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastStudentSpeech, setLastStudentSpeech] = useState<string>('');
  const [lastTeacherReply, setLastTeacherReply] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [continuousMode, setContinuousMode] = useState(settings.continuousVoiceMode);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Matematik');
  const [textInput, setTextInput] = useState('');
  const [micPermissionState, setMicPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [turkishVoice, setTurkishVoice] = useState<SpeechSynthesisVoice | null>(null);

  // History for multi-turn conversation
  const [conversationHistory, setConversationHistory] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: 'Merhaba! Ben senin yapay zeka öğretmeninim. Mikrofona basıp istediğin soruyu sorabilir veya aşağıdaki hazır sorulardan birine dokunabilirsin.',
      time: 'Şimdi',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const synthesisUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullTranscriptRef = useRef<string>('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load voices and find best Turkish voice
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const tr = voices.find(v => v.lang.toLowerCase().includes('tr') || v.name.toLowerCase().includes('turkish')) || null;
        setTurkishVoice(tr);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversationHistory, isSpeaking, isListening, isLoading]);

  // Clean Markdown & Speak Turkish TTS
  const speakReply = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Tarayıcınız ses sentezleme (TTS) özelliğini desteklemiyor.', 'info');
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    // Clean markdown and emojis for smooth TTS
    const cleanSpeech = textToSpeak
      .replace(/[\*\_#`~]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[🎨🚀🎓⭐🧠🦁✓🎯✨🔥💡]/g, '')
      .trim();

    if (!cleanSpeech) return;

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = 'tr-TR';
    utterance.rate = Math.max(0.8, Math.min(1.4, settings.speechRate || 1.0));
    utterance.pitch = Math.max(0.8, Math.min(1.3, settings.speechPitch || 1.0));

    if (turkishVoice) {
      utterance.voice = turkishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (continuousMode) {
        setTimeout(() => {
          startListening();
        }, 600);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    synthesisUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech Recognition (STT)
  const startListening = () => {
    stopSpeaking();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      showToast('Tarayıcınız mikrofon ses tanıma özelliğini desteklemiyor. Metin kutusunu veya örnek soruları kullanabilirsiniz.', 'info');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      fullTranscriptRef.current = '';
      setTranscript('');

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermissionState('granted');
      };

      recognition.onresult = (event: any) => {
        let currentFull = '';
        for (let i = 0; i < event.results.length; i++) {
          currentFull += event.results[i][0].transcript + ' ';
        }
        const clean = currentFull.trim();
        setTranscript(clean);
        fullTranscriptRef.current = clean;

        // Auto submit if user stops speaking for 1.4 seconds
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (fullTranscriptRef.current.trim().length > 3) {
            const finalQuery = fullTranscriptRef.current.trim();
            fullTranscriptRef.current = '';
            stopListening();
            handleVoiceSubmit(finalQuery);
          }
        }, 1400);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermissionState('denied');
          showToast('Mikrofon erişimi engellendi. Tarayıcı izinlerinden mikrofona izin verin veya soru butonlarını kullanın.', 'info');
        } else if (event.error === 'no-speech') {
          // just idle timeout
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // If there's pending transcript that wasn't submitted
        if (fullTranscriptRef.current.trim().length > 3) {
          const finalQuery = fullTranscriptRef.current.trim();
          fullTranscriptRef.current = '';
          handleVoiceSubmit(finalQuery);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      if (fullTranscriptRef.current.trim().length > 3) {
        handleVoiceSubmit(fullTranscriptRef.current.trim());
        fullTranscriptRef.current = '';
      }
    } else {
      startListening();
    }
  };

  // Submit spoken or selected question to Gemini
  const handleVoiceSubmit = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    stopListening();
    stopSpeaking();
    setLastStudentSpeech(text);
    setIsLoading(true);
    setTranscript('');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userItem = { role: 'user' as const, text, time: now };
    setConversationHistory(prev => [...prev, userItem]);

    try {
      const historyPayload = conversationHistory.slice(-6).map(h => ({
        role: h.role,
        content: h.text,
      }));

      const res = await askGeminiTeacher(text, historyPayload, gradeLevel, selectedSubject, selectedModel);
      const teacherText = res.text;
      
      setLastTeacherReply(teacherText);
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', text: teacherText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);

      addXP(30, 'Sesli soru-cevap seansı');

      // Speak AI response with voice synthesizer
      speakReply(teacherText);
    } catch (err: any) {
      const errMsg = `Bağlantı sırasında bir aksaklık oldu: ${err?.message || 'Lütfen sorunuzu tekrar deneyin.'}`;
      setLastTeacherReply(errMsg);
      speakReply('Sesli bağlantı kurulamadı. Sorunuzu lütfen tekrar söyleyin veya metin kutusuna yazın.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleVoicePrompts: Record<string, string[]> = {
    ilkokul: [
      'Gezegenler neden Güneş’in etrafında döner?',
      'Bana çarpım tablosu için eğlenceli bir tekerleme öğret!',
      'Gökkuşağı gökyüzünde nasıl oluşur?',
      'Canlılar neden nefes almak için oksijene ihtiyaç duyar?',
    ],
    ortaokul: [
      'LGS fen dersinde katı ve sıvı basıncı mantığını özetler misin?',
      'Mitoz ve mayoz bölünme arasındaki en önemli 3 fark nedir?',
      'Cebirsel ifadelerde parantez içi eksi dağıtma kuralını anlat.',
      'Bana LGS çalışma motivasyonumu yükseltecek tavsiyeler ver!',
    ],
    lise: [
      'Türevin fiziksel hız ve ivme ile ilişkisini açıklar mısın?',
      'Newton hareket yasalarından eylemsizlik prensibini detaylandır.',
      'YKS sınavında zaman yönetimini ve soru eleme taktiğini anlat.',
      'Organik kimyada hidrokarbonların temel sınıflandırmasını özetle.',
    ],
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Voice Mode Header & Model Selection */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              Yapay Zeka Sesli Etkileşim ve Dinleme Odası
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Web Speech STT & Türkçe TTS ile konuşarak sor, sesli dinle ve öğren.
            </p>
          </div>
        </div>

        {/* Model Selector & Settings */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AIModelType)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {MODEL_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.tag})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            title="Ses ve Hız Ayarları"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Voice Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Stage (7 cols): The Voice Orb & Visualizer */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden min-h-[480px]">
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          {/* Top Stage Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isSpeaking ? 'bg-cyan-400' : isListening ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isSpeaking ? 'bg-cyan-500' : isListening ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isSpeaking
                  ? '🔊 Yapay Zeka Öğretmen Seslendiriyor...'
                  : isListening
                  ? '🎙️ Dinleniyor: Şimdi Konuşun...'
                  : isLoading
                  ? '🧠 Yapay Zeka Düşünüyor...'
                  : 'Mikrofona Dokun ve Konuş'}
              </span>
            </div>

            {/* Continuous Mode Toggle */}
            <button
              onClick={() => {
                const next = !continuousMode;
                setContinuousMode(next);
                updateSettings({ continuousVoiceMode: next });
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border transition ${
                continuousMode
                  ? 'border-cyan-400/80 bg-cyan-500/20 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-slate-400'
              }`}
              title="Cevap bitince otomatik olarak dinlemeye devam eder"
            >
              <Zap className="h-3 w-3" />
              <span>Kesintisiz: {continuousMode ? 'Açık' : 'Kapalı'}</span>
            </button>
          </div>

          {/* Center Soundwave Orb */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
            <div className="relative flex items-center justify-center">
              {/* Outer wave rings */}
              {(isSpeaking || isListening) && (
                <>
                  <div
                    className={`absolute h-44 w-44 rounded-full border-2 animate-ping opacity-25 ${
                      isListening ? 'border-red-400' : 'border-cyan-400'
                    }`}
                  />
                  <div
                    className={`absolute h-56 w-56 rounded-full border opacity-15 animate-pulse ${
                      isListening ? 'border-red-400' : 'border-indigo-400'
                    }`}
                  />
                </>
              )}

              {/* Main Mic Action Button */}
              <button
                onClick={toggleListening}
                disabled={isLoading}
                className={`group relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 ${
                  isListening
                    ? 'bg-gradient-to-tr from-red-500 to-rose-600 shadow-red-500/50 scale-105 ring-4 ring-red-400/40'
                    : isSpeaking
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/50 ring-4 ring-cyan-400/40'
                    : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:scale-105 shadow-indigo-500/40'
                }`}
                title={isListening ? 'Dinlemeyi durdur ve yanıt al' : 'Mikrofonu başlat ve soru sor'}
              >
                {isListening ? (
                  <MicOff className="h-10 w-10 text-white animate-pulse" />
                ) : isSpeaking ? (
                  <Volume2 className="h-10 w-10 text-white animate-bounce" />
                ) : (
                  <Mic className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="mt-6 flex items-center justify-center gap-1.5 h-10">
              {[4, 8, 14, 22, 30, 20, 14, 26, 16, 6].map((baseHeight, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isSpeaking
                      ? 'bg-cyan-400 animate-pulse'
                      : isListening
                      ? 'bg-red-400 animate-bounce'
                      : 'bg-slate-700 h-2'
                  }`}
                  style={{
                    height: isSpeaking || isListening ? `${Math.max(6, baseHeight * (Math.random() + 0.6))}px` : '6px',
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>

            {/* Real-time Live Transcript Subtitle */}
            <div className="mt-4 max-w-md w-full min-h-[44px] flex items-center justify-center px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-xs sm:text-sm text-center font-medium">
              {transcript ? (
                <span className="text-cyan-200 italic font-semibold">“{transcript}”</span>
              ) : isListening ? (
                <span className="text-red-300 animate-pulse">Mikrofon açık, sizi dinliyorum...</span>
              ) : isSpeaking ? (
                <span className="text-cyan-300">Öğretmeniniz seslendiriyor...</span>
              ) : (
                <span className="text-slate-400">Ortadaki mikrofona dokunarak veya sağdaki hazır sorulara tıklayarak konuşabilirsiniz.</span>
              )}
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Ders Branşı:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white outline-none backdrop-blur-md"
              >
                {['Matematik', 'Fen Bilimleri', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe & Edebiyat', 'Sosyal Bilgiler & Tarih', 'İngilizce', 'Kodlama & Robotik'].map(s => (
                  <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-1.5 rounded-xl bg-red-500/80 hover:bg-red-600 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition"
                >
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>Sesi Kes</span>
                </button>
              )}

              {lastTeacherReply && (
                <button
                  onClick={() => speakReply(lastTeacherReply)}
                  disabled={isSpeaking}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Tekrar Dinle</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Stage (5 cols): Live Conversation Feed & Quick Prompts */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Quick Voice Starters */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Tek Tıkla Sesli Soru Simülasyonu</span>
              </div>
              <span className="text-[10px] text-slate-400">Dokun ve Dinle</span>
            </div>

            <div className="space-y-2">
              {(sampleVoicePrompts[gradeLevel] || sampleVoicePrompts.ortaokul).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleVoiceSubmit(prompt)}
                  disabled={isLoading}
                  className="w-full text-left rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-purple-50 hover:border-purple-200 p-2.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-purple-950/40 dark:hover:border-purple-800 transition flex items-center justify-between group"
                >
                  <span className="truncate pr-2">“{prompt}”</span>
                  <Play className="h-3.5 w-3.5 shrink-0 text-purple-600 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col min-h-[260px] max-h-[360px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3 dark:border-slate-800">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Sohbet ve Sesli Yanıt Geçmişi
              </span>
              <span className="text-[10px] text-slate-400">
                {conversationHistory.length} İleti
              </span>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
              {conversationHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    item.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      item.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700'
                    }`}
                  >
                    <p>{item.text}</p>
                    <div
                      className={`mt-1 text-[9px] flex items-center justify-end gap-1 ${
                        item.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{item.time}</span>
                      {item.role === 'assistant' && (
                        <button
                          onClick={() => speakReply(item.text)}
                          className="hover:text-blue-500 transition ml-1"
                          title="Bu yanıtı seslendir"
                        >
                          <Volume2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs w-fit">
                  <Sparkles className="h-4 w-4 animate-spin text-indigo-600" />
                  <span>Öğretmen cevabı hazırlıyor ve seslendiriyor...</span>
                </div>
              )}
            </div>

            {/* Custom Question Text Input fallback for 100% reliability */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (textInput.trim()) {
                  handleVoiceSubmit(textInput);
                  setTextInput('');
                }
              }}
              className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Yazarak da sesli yanıt alabilirsin..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 p-2 text-white shadow-xs transition"
                title="Seslendir ve Yanıt Al"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
