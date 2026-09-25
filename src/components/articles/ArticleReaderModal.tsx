import React, { useState, useEffect } from 'react';
import { Article } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';

interface ArticleReaderModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const {
    isAuthenticated,
    toggleLikeArticle,
    toggleBookmarkArticle,
    markArticleAsRead,
    readArticleIds,
    showToast,
    openAuthModal,
  } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  // Stop speech when modal closes or article changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, article]);

  if (!isOpen || !article) return null;

  const isRead = readArticleIds?.includes(article.id);

  // Category color mappings
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Sınav Stratejileri':
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900';
      case 'Verimli Çalışma':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900';
      case 'Yapay Zeka & Teknoloji':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900';
      case 'Maarif Modeli':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900';
      case 'Bilim & Kodlama':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  // Text-To-Speech Speech Handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Tarayıcınız sesli okumayı desteklemiyor.', 'info');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast('Sesli okuma duraklatıldı.', 'info');
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.subtitle}. ${article.content.replace(/#|\*|-/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast('Makale sesli okunuyor 🎙️', 'info');
    }
  };

  // Share link handler
  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast('Makale bağlantısı kopyalandı! 📋', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAuthRedirect = () => {
    if (openAuthModal) {
      openAuthModal('register');
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  // Mark article read
  const handleMarkAsRead = () => {
    if (isAuthenticated) {
      markArticleAsRead(article.id);
    } else {
      handleAuthRedirect();
    }
  };

  // Render markdown text nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={index} className="h-3" />;
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={index} className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-6 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={index} className="flex items-start gap-2.5 my-1.5 ml-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e11d48] mt-2 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {formatInlineFormatting(trimmed.substring(2))}
            </span>
          </div>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={index} className="my-4 border-l-4 border-[#e11d48] bg-rose-50/70 p-3.5 rounded-r-2xl italic text-slate-800 dark:bg-rose-950/20 dark:text-rose-200">
            {formatInlineFormatting(trimmed.replace('> ', ''))}
          </blockquote>
        );
      }
      if (trimmed === '---') {
        return <hr key={index} className="my-6 border-slate-200 dark:border-slate-800" />;
      }
      return (
        <p key={index} className="my-2.5 text-slate-700 dark:text-slate-300 leading-relaxed">
          {formatInlineFormatting(trimmed)}
        </p>
      );
    });
  };

  // Helper for inline **bold** and *italic*
  const formatInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-base sm:text-lg leading-relaxed';
      case 'xlarge':
        return 'text-lg sm:text-xl leading-loose';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        {/* TOP BAR / CONTROLS */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 py-3.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeClass(article.category)}`}>
              <BookOpen className="h-3.5 w-3.5" />
              <span>{article.category}</span>
            </span>

            {article.generatedByAI && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="h-3 w-3" />
                <span>Gemini Yapay Zeka</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Size Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg transition ${fontSize === 'normal' ? 'bg-white shadow-xs dark:bg-slate-700 text-slate-900 dark:text-white' : ''}`}
                title="Normal Yazı Boyutu"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg transition ${fontSize === 'large' ? 'bg-white shadow-xs dark:bg-slate-700 text-slate-900 dark:text-white' : ''}`}
                title="Büyük Yazı Boyutu"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg transition ${fontSize === 'xlarge' ? 'bg-white shadow-xs dark:bg-slate-700 text-slate-900 dark:text-white' : ''}`}
                title="Ekstra Büyük"
              >
                A++
              </button>
            </div>

            {/* Audio Speech Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                isSpeaking
                  ? 'bg-rose-500 text-white shadow-md animate-pulse'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              title={isSpeaking ? 'Sesli Okumayı Durdur' : 'Makaleyi Sesli Dinle'}
            >
              {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-rose-500" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Durdur' : 'Sesli Dinle'}</span>
            </button>

            {/* Like Button */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  toggleLikeArticle(article.id);
                } else {
                  handleAuthRedirect();
                }
              }}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                article.isLiked
                  ? 'border-rose-400 bg-rose-50 text-[#e11d48] dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${article.isLiked ? 'fill-[#e11d48]' : ''}`} />
              <span>{article.likesCount}</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  toggleBookmarkArticle(article.id);
                } else {
                  handleAuthRedirect();
                }
              }}
              className={`rounded-full p-2 border transition ${
                article.isBookmarked
                  ? 'border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              title={article.isBookmarked ? 'Yer imlerinden kaldır' : 'Yer imlerine kaydet'}
            >
              <Bookmark className={`h-3.5 w-3.5 ${article.isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="rounded-full p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              title="Bağlantıyı Kopyala"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE ARTICLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 space-y-6">
          {/* Header Info: Title, Subtitle, Author, Date, Reading Time */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {article.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              {/* Author info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-[#e11d48] text-white text-lg shadow-sm">
                  {article.author.avatar || '👨‍🏫'}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {article.author.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {article.author.role}
                  </div>
                </div>
              </div>

              {/* Meta stats */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{article.readTime} okuma</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{article.publishedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative aspect-16/8 sm:aspect-16/7 w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 text-xs font-bold text-white/90 drop-shadow-md">
                EduWiki Akademi Kütüphanesi • Özel Analiz
              </div>
            </div>
          )}

          {/* Summary Box */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 sm:p-5 dark:border-blue-900/60 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1.5">
              <Zap className="h-4 w-4" />
              <span>Özet & Ana Fikir</span>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
              "{article.summary}"
            </p>
          </div>

          {/* Main Article Body Text */}
          <article className={`space-y-4 ${getFontSizeClass()}`}>
            {renderFormattedContent(article.content)}
          </article>

          {/* Key Takeaways Section */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/60 p-5 sm:p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 text-sm font-black text-emerald-800 dark:text-emerald-300 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Bu Makaleden Öğrenilen 3 Temel İlke</span>
              </div>
              <div className="space-y-2">
                {article.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expert Pro Tip Box */}
          {article.proTip && (
            <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-5 sm:p-6 dark:border-amber-900/60 dark:from-amber-950/30 dark:to-orange-950/20">
              <div className="flex items-center gap-2 text-sm font-black text-amber-800 dark:text-amber-300 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-600 animate-pulse" />
                <span>Uzman Püf Noktası (Altın Tavsiye)</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {article.proTip}
              </p>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400">Etiketler:</span>
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* UNREGISTERED USER / CALL TO ACTION BANNER */}
          {!isAuthenticated && (
            <div className="rounded-3xl border border-rose-300 bg-gradient-to-r from-[#e11d48] to-pink-600 p-6 sm:p-8 text-white shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-300" />
                <h3 className="text-xl font-black">
                  Tüm Sınav Stratejileri ve Sanal Derslik Seni Bekliyor!
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-pink-100 font-medium max-w-2xl leading-relaxed">
                EduWiki Akademi'ye tamamen ücretsiz üye olarak yapay zeka destekli haftalık ders planı oluşturabilir, sesli dersliğe katılabilir ve yüzlerce MEB uyumlu soru çözebilirsin.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal('role_select');
                  }}
                  className="rounded-full bg-white text-[#e11d48] px-6 py-2.5 text-xs font-black shadow-md hover:bg-slate-50 transition transform hover:scale-105"
                >
                  Ücretsiz Öğrenci Hesabı Aç →
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal('login');
                  }}
                  className="rounded-full border border-white/60 bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          )}

          {/* AUTHENTICATED STUDENT COMPLETED READING ACTION */}
          {isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isRead ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                  {isRead ? <CheckCircle2 className="h-6 w-6" /> : <Award className="h-6 w-6" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isRead ? 'Bu makaleyi tamamladın! 🎉' : 'Okumayı tamamladın mı?'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isRead ? '+25 XP hesabına tanımlandı.' : 'Okundu olarak işaretle ve +25 XP kazan.'}
                  </div>
                </div>
              </div>

              {!isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-xs font-black text-white hover:bg-emerald-700 shadow-md transition"
                >
                  <Check className="h-4 w-4" />
                  <span>Okundu Olarak İşaretle (+25 XP)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
