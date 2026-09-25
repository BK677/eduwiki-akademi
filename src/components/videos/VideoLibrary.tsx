import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CURATED_VIDEOS } from '../../data/mockData';
import { MAARIF_5_SUBJECTS } from '../../data/maarif5Data';
import { VideoLesson, Subject } from '../../types';
import { askVideoQuestion } from '../../services/geminiService';
import {
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  FileText,
  Save,
  MessageSquare,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Volume2,
  Check,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

export const VideoLibrary: React.FC = () => {
  const { gradeLevel, user, completeLesson, addXP, showToast } = useApp();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('Tümü');
  const [playerMode, setPlayerMode] = useState<'youtube' | 'interactive_board'>('youtube');
  const [isSpeakingBoard, setIsSpeakingBoard] = useState(false);

  // Build unified video list including 5th grade Maarif units
  const all5thGradeVideos: VideoLesson[] = useMemo(() => {
    const list: VideoLesson[] = [];

    // From Maarif 5 Data
    MAARIF_5_SUBJECTS.forEach((subject) => {
      subject.units.forEach((unit) => {
        let mappedSubject: Subject = 'Matematik';
        if (subject.id === 'fen') mappedSubject = 'Fen Bilimleri';
        else if (subject.id === 'turkce') mappedSubject = 'Türkçe & Edebiyat';
        else if (subject.id === 'sosyal') mappedSubject = 'Sosyal Bilgiler & Tarih';
        else if (subject.id === 'ingilizce') mappedSubject = 'İngilizce';
        else if (subject.id === 'bilisim') mappedSubject = 'Kodlama & Robotik';

        list.push({
          id: `maarif5_${subject.id}_${unit.id}`,
          title: `5. Sınıf ${subject.name} - ${unit.title}`,
          subject: mappedSubject,
          gradeLevel: 'ortaokul',
          youtubeId: unit.video.youtubeId,
          duration: unit.video.duration,
          instructor: unit.video.instructor,
          description: unit.description,
          keyPoints: unit.kazanimlar.slice(0, 3),
        });
      });
    });

    // Also include curated videos
    CURATED_VIDEOS.forEach((v) => {
      if (!list.some((existing) => existing.id === v.id)) {
        list.push(v);
      }
    });

    return list;
  }, []);

  const filteredVideos = useMemo(() => {
    if (selectedSubjectFilter === 'Tümü') return all5thGradeVideos;
    return all5thGradeVideos.filter((v) => {
      if (selectedSubjectFilter === 'Matematik') return v.subject === 'Matematik';
      if (selectedSubjectFilter === 'Fen Bilimleri') return v.subject === 'Fen Bilimleri';
      if (selectedSubjectFilter === 'Türkçe') return v.subject === 'Türkçe & Edebiyat';
      if (selectedSubjectFilter === 'Sosyal Bilgiler') return v.subject === 'Sosyal Bilgiler & Tarih';
      if (selectedSubjectFilter === 'İngilizce') return v.subject === 'İngilizce';
      if (selectedSubjectFilter === 'Bilişim & Kodlama') return v.subject === 'Kodlama & Robotik';
      return true;
    });
  }, [all5thGradeVideos, selectedSubjectFilter]);

  const [activeVideo, setActiveVideo] = useState<VideoLesson>(filteredVideos[0] || all5thGradeVideos[0]);

  // Personal notes for the active video
  const [notes, setNotes] = useState<string>('');
  const [savedNoteStatus, setSavedNoteStatus] = useState<boolean>(false);

  // Gemini Q&A state
  const [questionText, setQuestionText] = useState('');
  const [qaList, setQaList] = useState<{ q: string; a: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  // Load saved notes when active video changes
  useEffect(() => {
    if (activeVideo) {
      const saved = localStorage.getItem(`novaders_notes_${activeVideo.id}`);
      setNotes(saved || '');
      setPlayerMode('youtube');
    }
  }, [activeVideo]);

  const handleSaveNotes = () => {
    if (!activeVideo) return;
    localStorage.setItem(`novaders_notes_${activeVideo.id}`, notes);
    setSavedNoteStatus(true);
    setTimeout(() => setSavedNoteStatus(false), 2000);
    addXP(10, 'Ders notu kaydetme');
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || isAsking || !activeVideo) return;

    const q = questionText.trim();
    setQuestionText('');
    setIsAsking(true);

    try {
      const answer = await askVideoQuestion(
        activeVideo.title,
        activeVideo.subject,
        q,
        gradeLevel
      );
      setQaList((prev) => [...prev, { q, a: answer }]);
      addXP(15, 'Video soru-cevap');
    } catch (err: any) {
      setQaList((prev) => [
        ...prev,
        { q, a: `Cevap: 5. Sınıf ${activeVideo.subject} dersinde bu konuyu kavrarken dikkat edilmesi gereken ana nokta, işlem adımlarını sırasıyla uygulamak ve formülleri pekiştirmektir.` },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSpeakBoardText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Tarayıcınız sesli okumayı desteklemiyor.', 'info');
      return;
    }
    if (isSpeakingBoard) {
      window.speechSynthesis.cancel();
      setIsSpeakingBoard(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeakingBoard(false);
    utterance.onerror = () => setIsSpeakingBoard(false);
    setIsSpeakingBoard(true);
    window.speechSynthesis.speak(utterance);
  };

  const isCompleted = user?.completedLessons.includes(activeVideo?.id);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-rose-100 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              5. SINIF MAARİF VİDEO DERSLİK
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Tüm Derslerin Konu Anlatım Kütüphanesi
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            5. Sınıf Maarif Modeli ünitelerine özel konu videoları, interaktif akıllı tahta dersleri ve yapay zekâ video asistanı.
          </p>
        </div>

        {/* Lesson completion status */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <span>Tamamlandı (+80 XP Alındı)</span>
            </span>
          ) : (
            <button
              onClick={() => activeVideo && completeLesson(activeVideo.id)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Dersi Tamamla (+80 XP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['Tümü', 'Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilgiler', 'İngilizce', 'Bilişim & Kodlama'].map((sub) => (
          <button
            key={sub}
            onClick={() => {
              setSelectedSubjectFilter(sub);
              const list = sub === 'Tümü' ? all5thGradeVideos : all5thGradeVideos.filter((v) => {
                if (sub === 'Matematik') return v.subject === 'Matematik';
                if (sub === 'Fen Bilimleri') return v.subject === 'Fen Bilimleri';
                if (sub === 'Türkçe') return v.subject === 'Türkçe & Edebiyat';
                if (sub === 'Sosyal Bilgiler') return v.subject === 'Sosyal Bilgiler & Tarih';
                if (sub === 'İngilizce') return v.subject === 'İngilizce';
                if (sub === 'Bilişim & Kodlama') return v.subject === 'Kodlama & Robotik';
                return true;
              });
              if (list.length > 0) setActiveVideo(list[0]);
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              selectedSubjectFilter === sub
                ? 'bg-blue-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Main Video Stage */}
      {activeVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left (8 cols): Video Player & Details */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Player Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setPlayerMode('youtube')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                    playerMode === 'youtube'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>YouTube Video</span>
                </button>

                <button
                  onClick={() => setPlayerMode('interactive_board')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                    playerMode === 'interactive_board'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>İnteraktif Akıllı Tahta Dersi</span>
                </button>
              </div>

              {/* Direct YouTube Search/Open Button */}
              <a
                href={`https://www.youtube.com/results?search_query=5.+s%C4%B1n%C4%B1f+${encodeURIComponent(activeVideo.subject)}+${encodeURIComponent(activeVideo.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-600 shadow-xs"
              >
                <span>YouTube'da Aç</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Video Player or Interactive Blackboard Lesson */}
            {playerMode === 'youtube' ? (
              <div className="space-y-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-lg dark:border-slate-800">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Fallback info */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Tarayıcınız YouTube gömmeyi engelliyorsa "İnteraktif Akıllı Tahta" moduna geçebilir veya "YouTube'da Aç" butonunu kullanabilirsiniz.</span>
                  </span>
                  <button
                    onClick={() => setPlayerMode('interactive_board')}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] shrink-0 hover:bg-amber-700 ml-2"
                  >
                    Tahtaya Geç 🚀
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Blackboard Lesson */
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl min-h-[300px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-4">
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      5. Sınıf MEB Maarif Akıllı Tahta Dersi
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Eğitmen: {activeVideo.instructor}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-amber-300 mb-2">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                    {activeVideo.description}
                  </p>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">
                      📌 Temel Formül & Kavram Özeti:
                    </div>
                    {activeVideo.keyPoints && activeVideo.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleSpeakBoardText(`${activeVideo.title}. ${activeVideo.description}. Temel noktalar: ${activeVideo.keyPoints?.join(', ')}`)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                      isSpeakingBoard
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingBoard ? 'Durdur' : 'Sesli Dinle'}</span>
                  </button>

                  <button
                    onClick={() => setPlayerMode('youtube')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    YouTube Oynatıcıya Dön
                  </button>
                </div>
              </div>
            )}

            {/* Video Meta Info */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800">
                    {activeVideo.subject}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {activeVideo.duration}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Eğitmen: <strong className="text-slate-800 dark:text-slate-200">{activeVideo.instructor}</strong>
                </span>
              </div>

              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {activeVideo.title}
              </h1>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeVideo.description}
              </p>

              {/* Key takeaway badges */}
              {activeVideo.keyPoints && activeVideo.keyPoints.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    5. Sınıf Maarif Kazanımları:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {activeVideo.keyPoints.map((pt, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        ✨ {pt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Note Taking Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Ders Notlarım (5. Sınıf Defteri)</span>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{savedNoteStatus ? 'Kaydedildi ✓' : 'Notu Kaydet'}</span>
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Video izlerken önemli kuralları, formülleri ve püf noktaları buraya not alabilirsin..."
                className="w-full h-24 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Right (4 cols): Video Playlist & Gemini Q&A */}
          <div className="lg:col-span-4 space-y-4">
            {/* Playlist for Selected Subject */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                5. Sınıf Video Listesi ({filteredVideos.length})
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredVideos.map((video) => {
                  const isSelected = video.id === activeVideo.id;
                  const completed = user?.completedLessons.includes(video.id);

                  return (
                    <button
                      key={video.id}
                      onClick={() => setActiveVideo(video)}
                      className={`flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition ${
                        isSelected
                          ? 'border border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                          : 'border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="relative mt-0.5 flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800">
                        <Play className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                        {completed && (
                          <div className="absolute -top-1 -right-1 rounded-full bg-emerald-500 p-0.5 text-white">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                          {video.title}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{video.instructor}</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Teacher Video Q&A */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Bu Videoyla İlgili Yapay Zekâya Sor
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Videoda anlamadığın bir terimi veya formülü sor, anında açıklasın.
              </p>

              {/* QA History */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto mb-3">
                {qaList.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-400 dark:bg-slate-800/50">
                    Henüz soru sorulmadı. Aşağıdan sorunu sorabilirsin!
                  </div>
                ) : (
                  qaList.map((item, i) => (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="rounded-lg bg-blue-50 p-2 font-semibold text-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                        👤 Sen: {item.q}
                      </div>
                      <div className="rounded-lg bg-slate-100 p-2 text-slate-800 dark:bg-slate-800 dark:text-slate-200 whitespace-pre-line">
                        🤖 Maarif AI: {item.a}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleAskQuestion} className="flex gap-1.5">
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Videoyla ilgili sorunu yaz..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!questionText.trim() || isAsking}
                  className="flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
