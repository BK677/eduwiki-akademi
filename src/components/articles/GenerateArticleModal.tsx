import React, { useState } from 'react';
import { ArticleCategory, Article } from '../../types';
import { useApp } from '../../context/AppContext';
import { generateGeminiArticle } from '../../services/geminiService';
import {
  X,
  Sparkles,
  Wand2,
  BookOpen,
  ArrowRight,
  Brain,
  CheckCircle2,
  Loader2,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

interface GenerateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleGenerated: (article: Article) => void;
}

export const GenerateArticleModal: React.FC<GenerateArticleModalProps> = ({
  isOpen,
  onClose,
  onArticleGenerated,
}) => {
  const { selectedModel, gradeLevel, user, addArticle, showToast } = useApp();

  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Sınav Stratejileri');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const quickTopicSuggestions: { title: string; category: ArticleCategory }[] = [
    { title: 'LGS Matematik Sorularında Süre Yetiştirme Taktikleri', category: 'Sınav Stratejileri' },
    { title: 'Pomodoro Tekniği ile Masa Başında Odaklanma Süresini Artırma', category: 'Verimli Çalışma' },
    { title: 'Yapay Zekayı Özel Ders Mentoru Olarak Kullanmanın 5 Kuralı', category: 'Yapay Zeka & Teknoloji' },
    { title: '5. Sınıf Yeni Maarif Modeli Fen Deneylerini Anlama Rehberi', category: 'Maarif Modeli' },
    { title: 'Python ve Blok Kodlama ile Problem Çözme Becerisini Geliştirme', category: 'Bilim & Kodlama' },
    { title: 'Sınavdan Bir Gün Önce Yapılması ve Kaçınılması Gerekenler', category: 'Sınav Stratejileri' },
  ];

  // Category image fallbacks
  const getCategoryImage = (cat: ArticleCategory) => {
    switch (cat) {
      case 'Sınav Stratejileri':
        return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80';
      case 'Verimli Çalışma':
        return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80';
      case 'Yapay Zeka & Teknoloji':
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
      case 'Maarif Modeli':
        return 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80';
      case 'Bilim & Kodlama':
        return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
    }
  };

  const handleGenerate = async () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      showToast('Lütfen bir konu başlığı yazın veya önerilerden seçin.', 'info');
      return;
    }

    setIsGenerating(true);
    try {
      const data = await generateGeminiArticle(trimmedTopic, category, gradeLevel, selectedModel);

      const newArticle: Article = {
        id: `ai_art_${Date.now()}`,
        title: data.title || trimmedTopic,
        subtitle: data.subtitle || 'Gemini Yapay Zeka Tarafından Özel Olarak Üretilmiş Rehber',
        category: (data.category as ArticleCategory) || category,
        readTime: data.readTime || '4 dk',
        publishedDate: 'Bugün',
        author: {
          name: `Gemini AI & ${user?.name || 'Kadir Kara'}`,
          role: 'Yapay Zeka Eğitim Asistanı',
          avatar: '✨',
        },
        coverImage: getCategoryImage(category),
        summary: data.summary || `${trimmedTopic} konusunda MEB müfredatı ve öğrenci odaklı özel rehber.`,
        content: data.content || `## ${trimmedTopic}\n\nBu içerik Gemini yapay zekası tarafından öğrencinin çalışma ihtiyaçlarına göre özel olarak yapılandırılmıştır.`,
        keyTakeaways: data.keyTakeaways || [
          'Konuyu kavramsal olarak derinlemesine anlayın.',
          'Pratik uygulamalarla pekiştirin.',
          'Haftalık ders planınızda bu konuya yer verin.'
        ],
        proTip: data.proTip || 'Düzenli aralıklarla tekrar yapmak öğrenilen bilgiyi kalıcı hafızaya taşır.',
        tags: data.tags || [category, 'Yapay Zeka', 'Özel İçerik'],
        likesCount: 1,
        isLiked: true,
        isBookmarked: true,
        generatedByAI: true,
      };

      addArticle(newArticle);
      onArticleGenerated(newArticle);
      onClose();
    } catch (err: any) {
      console.error('Article generation error:', err);
      showToast('Makale oluşturulurken bir sorun oluştu, lütfen tekrar deneyin.', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-[#e11d48] text-white shadow-md">
              <Wand2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Gemini ile Eğitim Makalesi Üret
                </h3>
                <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-black text-[#e11d48] dark:bg-pink-950/60 dark:text-pink-300">
                  AI YAZAR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Merak ettiğin sınav taktiği, ders konusu veya verimli çalışma yöntemini yaz, Gemini saniyeler içinde kapsamlı rehber hazırlasın.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5 py-4">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              1. Kategori Seçimi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'Sınav Stratejileri',
                  'Verimli Çalışma',
                  'Yapay Zeka & Teknoloji',
                  'Maarif Modeli',
                  'Bilim & Kodlama',
                ] as ArticleCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-bold text-left transition ${
                    category === cat
                      ? 'border-[#e11d48] bg-rose-50 text-[#e11d48] shadow-xs dark:bg-rose-950/50 dark:border-rose-700 dark:text-rose-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              2. Konu veya Başlık
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Örn: 5. Sınıf Fen Deneyleri, LGS Paragraf Çözme Taktikleri..."
              disabled={isGenerating}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#e11d48] focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Quick Suggestions Chips */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>Hızlı Öneri Başlıkları (Tıkla ve Doldur):</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {quickTopicSuggestions.map((sug, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setTopic(sug.title);
                    setCategory(sug.category);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:border-pink-300 hover:bg-pink-50 hover:text-[#e11d48] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  {sug.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Model Indicator */}
          <div className="flex items-center justify-between rounded-2xl bg-indigo-50/70 p-3 text-xs dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Aktif Model: {selectedModel}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              MEB Pedagoji & Maarif Modeli Destekli
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="rounded-full px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Vazgeç
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[#e11d48] hover:bg-rose-700 disabled:opacity-50 px-6 py-2.5 text-xs font-black text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Gemini Makaleyi Yazıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Makaleyi Oluştur ve Kütüphaneye Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
