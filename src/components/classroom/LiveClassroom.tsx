import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { askGeminiTeacher } from '../../services/geminiService';
import { ChatMessage, Subject } from '../../types';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Hand,
  Eraser,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Award
} from 'lucide-react';

export const LiveClassroom: React.FC = () => {
  const { gradeLevel, selectedModel, addXP, unlockBadge } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<Subject>('Matematik');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [boardContent, setBoardContent] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [copiedBoard, setCopiedBoard] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const SUBJECTS: Subject[] = [
    'Matematik',
    'Fen Bilimleri',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Türkçe & Edebiyat',
    'Sosyal Bilgiler & Tarih',
    'İngilizce',
    'Kodlama & Robotik',
  ];

  // Initial welcome message based on grade level
  useEffect(() => {
    let welcome = '';
    let initialBoard = '';

    if (gradeLevel === 'ilkokul') {
      welcome = `Merhaba minik şampiyon! 🌟 Ben senin EduWiki Akademi yapay zeka öğretmeninim. Bugün ${selectedSubject} dersinde harika bir maceraya çıkmaya ne dersin? Aklına takılan her şeyi bana sorabilirsin!`;
      initialBoard = `🖍️ DERS: ${selectedSubject}
⭐ HEDEF: Merak etmek, eğlenmek ve öğrenmek!
🎯 GÖREV: İlk sorunla başlayalım!`;
    } else if (gradeLevel === 'ortaokul') {
      welcome = `Selamlar! 🚀 Ben ${selectedSubject} dersi rehber öğretmeninim. Bugün LGS mantığına uygun, kavramların neden-sonuç bağını kurarak ilerleyeceğiz. Hangi konuda takıldın veya nereden başlayalım?`;
      initialBoard = `📌 DERS: ${selectedSubject}
💡 HEDEF: LGS Taktikleri ve Kavramsal Mantık
⚡ İPUCU: Sorularını adım adım analiz edeceğiz!`;
    } else {
      welcome = `Değerli öğrencim hoş geldin. 🎓 ${selectedSubject} dersinde YKS / AYT derinliğiyle, analitik çözümler ve kritik sınav taktikleriyle yanındayım. İster zorlandığın bir teoremi sor, ister örnek bir soru çözümü yapalım.`;
      initialBoard = `📐 DERS: ${selectedSubject} (YKS Odaklı)
🔍 HEDEF: Kavramsal Netlik ve Çözüm Stratejisi
📝 NOT: Formüller ve kritik noktalar buraya aktarılacaktır.`;
    }

    setMessages([
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setBoardContent(initialBoard);
  }, [gradeLevel, selectedSubject]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech synthesis (TTS) helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner speech
    const clean = text.replace(/[*#_`~]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech Recognition for voice input
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInputText('Ses tanıma bu tarayıcıda desteklenmiyor. Lütfen sorunuzu yazarak iletiniz.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || inputText;
    if (!text.trim() || isLoading) return;

    stopSpeaking();

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const apiHistory = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await askGeminiTeacher(text, apiHistory, gradeLevel, selectedSubject, selectedModel);

      const aiMessage: ChatMessage = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: res.text,
        boardContent: res.boardContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (res.boardContent) {
        setBoardContent(res.boardContent);
      }

      // Add student XP
      addXP(15, 'Canlı derste soru sorma');
      if (selectedModel === 'gemini-3.1-pro-preview') {
        unlockBadge('deep_thinker');
      }

      // Voice read if enabled
      if (autoSpeak) {
        speakText(res.text);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `Öğretmen yanıt verirken bir bağlantı sorunu oluştu: ${err.message || 'Lütfen tekrar deneyin.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBoard = () => {
    if (!boardContent) return;
    navigator.clipboard.writeText(boardContent);
    setCopiedBoard(true);
    setTimeout(() => setCopiedBoard(false), 2000);
  };

  const samplePromptsByGrade = {
    ilkokul: [
      'Güneş neden sıcaktır?',
      'Bölme işlemi nasıl yapılır?',
      'Su döngüsü masalı anlat!',
      'Saatleri nasıl okuruz?',
    ],
    ortaokul: [
      'Cebirsel ifadelerde parantezi nasıl dağıtırım?',
      'Mitoz ve Mayoz bölünme farkları nelerdir?',
      'Basınç formülünü günlük hayatla açıkla.',
      'LGS tarzı bir problem sorusu üret ve çöz!',
    ],
    lise: [
      'Türevin geometrik yorumu nedir?',
      'Eylemsizlik momenti ve tork ilişkisini anlat.',
      'Organik kimyada alkan ve alken adlandırması.',
      'YKS AYT ayarında zor bir soru çözümü yap!',
    ],
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Subject & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Branş:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as Subject)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Model info pill */}
          <span className="rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
            {selectedModel === 'gemini-3.8-flash' ? '⚡ Gemini Flash' : '🧠 Gemini Pro'}
          </span>
        </div>

        {/* Live Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition ${
              autoSpeak
                ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}
            title={autoSpeak ? 'Otomatik sesli anlatım açık' : 'Sesli anlatım kapalı'}
          >
            {autoSpeak ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{autoSpeak ? 'Ses Açık' : 'Sessiz'}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 rounded-lg bg-red-500 px-2 py-1 text-[11px] font-bold text-white shadow-xs animate-pulse"
            >
              Durdur
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Layout: Left AI Teacher & Blackboard, Right Chat Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (5 cols): Live Teacher Pod + Dynamic Blackboard */}
        <div className="lg:col-span-5 space-y-4">
          {/* Virtual Teacher Pod */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-3xl shadow-md border-2 border-white/20">
                    {gradeLevel === 'ilkokul' ? '👩‍🏫' : gradeLevel === 'ortaokul' ? '🧑‍🏫' : '👨‍🏫'}
                  </div>
                  {/* Status beacon */}
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900">
                    <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base">Nova AI Öğretmen</h3>
                    <span className="rounded-md bg-red-500/80 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                      CANLI
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedSubject} Eğitmeni • Seviye: {gradeLevel.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono">Birebir Seans</span>
              </div>
            </div>

            {/* Speaking / Thinking Visualizer */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-slate-200">
                  {isLoading
                    ? 'Öğretmen cevabı ve tahtayı hazırlıyor...'
                    : isSpeaking
                    ? 'Dersi sesli olarak anlatıyor...'
                    : 'Seni dinliyor, aklına takılanı sorabilirsin.'}
                </span>
              </div>
              {isSpeaking && (
                <div className="flex items-center gap-0.5">
                  <span className="h-3 w-1 bg-cyan-400 animate-bounce" />
                  <span className="h-4 w-1 bg-cyan-400 animate-bounce delay-75" />
                  <span className="h-2 w-1 bg-cyan-400 animate-bounce delay-150" />
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Karatahta (Virtual Chalkboard) */}
          <div className="rounded-2xl border-4 border-amber-900/60 bg-[#1e3427] p-4 text-emerald-100 shadow-xl relative min-h-[260px] flex flex-col justify-between">
            {/* Wooden frame effect */}
            <div className="flex items-center justify-between border-b border-emerald-700/50 pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-200 uppercase">
                <span>🖍️ SANAL KARATAHTA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyBoard}
                  className="flex items-center gap-1 rounded bg-emerald-900/60 px-2 py-1 text-[10px] text-emerald-200 hover:bg-emerald-800 transition"
                  title="Tahtadaki notları kopyala"
                >
                  {copiedBoard ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedBoard ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
                <button
                  onClick={() => setBoardContent('Ders konusu tahtaya yazılmayı bekliyor...')}
                  className="rounded bg-emerald-900/60 p-1 text-emerald-200 hover:bg-emerald-800 transition"
                  title="Tahtayı Temizle"
                >
                  <Eraser className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Blackboard content */}
            <div className="flex-1 font-mono text-xs whitespace-pre-wrap leading-relaxed text-emerald-50 tracking-wide select-text">
              {boardContent || 'Ders konusu tahtaya yazılmayı bekliyor...'}
            </div>

            {/* Chalk tray footer */}
            <div className="mt-3 pt-2 border-t border-emerald-700/40 flex items-center justify-between text-[10px] text-emerald-300/80">
              <span>Beyaz ve Sarı Tebeşir</span>
              <span>EduWiki Akıllı Tahta</span>
            </div>
          </div>

          {/* Quick Hand Raise & Sample questions */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Hand className="h-3.5 w-3.5 text-amber-500" />
                <span>Hızlı Söz İste & Soru Kalıpları</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {samplePromptsByGrade[gradeLevel].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] text-left text-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Interactive Live Chat Feed */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 h-[620px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Ders İletişim Akışı
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {messages.length} İleti
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {isUser ? 'Ben' : 'AI'}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`mt-1.5 flex items-center justify-between text-[10px] ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => speakText(msg.content)}
                          className="hover:underline flex items-center gap-1 opacity-75 hover:opacity-100"
                        >
                          <Volume2 className="h-3 w-3" />
                          <span>Dinle</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <Sparkles className="h-4 w-4 animate-spin text-indigo-500" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Öğretmen düşüncelerini formüle döküyor...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input & Mic Bar */}
          <div className="border-t border-slate-100 p-3 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Voice Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                  isListening
                    ? 'border-red-500 bg-red-500 text-white animate-pulse'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                title={isListening ? 'Mikrofonu Kapat' : 'Sesli Soru Sor'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? 'Sizi dinliyor, konuşabilirsiniz...' : 'Öğretmene bir soru yazın veya söz isteyin...'}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 disabled:opacity-50 transition"
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
