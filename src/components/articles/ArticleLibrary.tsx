import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Article, ArticleCategory } from '../../types';
import { ArticleReaderModal } from './ArticleReaderModal';
import { GenerateArticleModal } from './GenerateArticleModal';
import {
  BookOpen,
  Search,
  Sparkles,
  Heart,
  Bookmark,
  Clock,
  Calendar,
  ArrowRight,
  Plus,
  CheckCircle2,
  Filter,
  Flame,
  Award,
  BookOpenCheck,
  Zap,
  GraduationCap
} from 'lucide-react';

export const ArticleLibrary: React.FC = () => {
  const {
    articles,
    toggleLikeArticle,
    toggleBookmarkArticle,
    readArticleIds,
    user,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  // Category list
  const categories = [
    'Tümü',
    'Sınav Stratejileri',
    'Verimli Çalışma',
    'Yapay Zeka & Teknoloji',
    'Maarif Modeli',
    'Bilim & Kodlama',
    'Yer İmlerim',
  ];

  // Filtered and searched articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Category filter
      if (activeCategory === 'Yer İmlerim') {
        if (!art.isBookmarked) return false;
      } else if (activeCategory !== 'Tümü' && art.category !== activeCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = art.title.toLowerCase().includes(query);
        const inSummary = art.summary.toLowerCase().includes(query);
        const inAuthor = art.author.name.toLowerCase().includes(query);
        const inTags = art.tags?.some((t) => t.toLowerCase().includes(query));
        return inTitle || inSummary || inAuthor || inTags;
      }

      return true;
    });
  }, [articles, activeCategory, searchQuery]);

  // Featured article (first featured or top article)
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.featured) || articles[0];
  }, [articles]);

  const bookmarkedCount = articles.filter((a) => a.isBookmarked).length;
  const readCount = articles.filter((a) => readArticleIds.includes(a.id)).length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HERO BENTO HEADER */}
      <div className="relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-[#e11d48] border border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300">
              <BookOpenCheck className="h-3.5 w-3.5" />
              <span>EDUWİKİ KÜTÜPHANE & BİLGİ MERKEZİ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Sınav Stratejileri, Verimli Çalışma & AI Makaleleri
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Öğrenci koçları, psikolojik danışmanlar ve Gemini yapay zekası tarafından hazırlanan rehberlerle çalışma verimini artır, sınav stresini yen ve başarını taçlandır.
            </p>

            {/* Quick stats chips */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                <span>{articles.length} Toplam Makale</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-300">
                <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{bookmarkedCount} Yer İmi</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{readCount} Okundu (+{readCount * 25} XP)</span>
              </span>
            </div>
          </div>

          {/* Action CTA: Gemini ile Yeni Makale Yazdır */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => setGenerateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e11d48] to-pink-600 hover:from-rose-700 hover:to-pink-700 px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Gemini ile Yeni Makale Yazdır</span>
            </button>
            <div className="text-[11px] text-center text-slate-400 font-semibold">
              Kişiye özel rehberlik & MEB odaklı
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const isBookmarks = cat === 'Yer İmlerim';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#e11d48] text-white shadow-md shadow-rose-500/20'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {isBookmarks && <Bookmark className={`h-3.5 w-3.5 ${isActive ? 'fill-white' : 'text-amber-500'}`} />}
                <span>{cat}</span>
                {isBookmarks && bookmarkedCount > 0 && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${isActive ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                    {bookmarkedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Makale başlığı, etiket veya konu ara..."
            className="w-full rounded-2xl border border-slate-200/90 bg-white py-2 pl-9.5 pr-4 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#e11d48] focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* 3. FEATURED ARTICLE BENTO BANNER (When "Tümü" is selected & no search) */}
      {activeCategory === 'Tümü' && !searchQuery && featuredArticle && (
        <div className="rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-md transition">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Image col */}
            <div className="lg:col-span-5 relative aspect-16/9 lg:aspect-auto overflow-hidden">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-[#e11d48] px-3 py-1 text-xs font-black text-white shadow-md uppercase tracking-wider">
                  ÖNE ÇIKAN
                </span>
                <span className="rounded-full bg-slate-950/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white">
                  {featuredArticle.category}
                </span>
              </div>
            </div>

            {/* Content col */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{featuredArticle.readTime} okuma</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{featuredArticle.publishedDate}</span>
                  </span>
                </div>

                <h2
                  onClick={() => setSelectedArticle(featuredArticle)}
                  className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white cursor-pointer hover:text-[#e11d48] transition leading-snug"
                >
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {featuredArticle.summary}
                </p>

                {/* Author info */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-[#e11d48] text-white text-base shadow-xs">
                    {featuredArticle.author.avatar || '👩‍🏫'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {featuredArticle.author.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {featuredArticle.author.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeArticle(featuredArticle.id)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                      featuredArticle.isLiked
                        ? 'border-rose-400 bg-rose-50 text-[#e11d48] dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${featuredArticle.isLiked ? 'fill-[#e11d48]' : ''}`} />
                    <span>{featuredArticle.likesCount}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmarkArticle(featuredArticle.id)}
                    className={`rounded-full p-2 border transition ${
                      featuredArticle.isBookmarked
                        ? 'border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                    title={featuredArticle.isBookmarked ? 'Yer imlerinden kaldır' : 'Yer imlerine kaydet'}
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${featuredArticle.isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedArticle(featuredArticle)}
                  className="flex items-center gap-1.5 rounded-full bg-[#e11d48] px-5 py-2 text-xs font-black text-white hover:bg-rose-700 shadow-md transition"
                >
                  <span>Makaleyi Oku</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ARTICLES GRID (Bento grid style) */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isRead = readArticleIds.includes(article.id);
            return (
              <div
                key={article.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200"
              >
                {/* Image & Category Pill Header */}
                <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-xs">
                      {article.category}
                    </span>

                    {article.generatedByAI && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 text-[9px] font-black text-white shadow-xs">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>AI</span>
                      </span>
                    )}
                  </div>

                  {/* Read status check */}
                  {isRead && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white px-2 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Okundu</span>
                    </div>
                  )}

                  {/* Reading time at bottom of image */}
                  <div className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-white/90 drop-shadow-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime} okuma</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h3
                      onClick={() => setSelectedArticle(article)}
                      className="text-base font-black text-slate-900 dark:text-white cursor-pointer group-hover:text-[#e11d48] transition line-clamp-2 leading-snug"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Author avatar & Name */}
                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-950/60 text-sm">
                      {article.author.avatar || '👨‍🏫'}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {article.author.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {article.author.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 pb-4 pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    {/* Like button */}
                    <button
                      onClick={() => toggleLikeArticle(article.id)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border transition ${
                        article.isLiked
                          ? 'border-rose-400 bg-rose-50 text-[#e11d48] dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                      title="Beğen"
                    >
                      <Heart className={`h-3 w-3 ${article.isLiked ? 'fill-[#e11d48]' : ''}`} />
                      <span>{article.likesCount}</span>
                    </button>

                    {/* Bookmark button */}
                    <button
                      onClick={() => toggleBookmarkArticle(article.id)}
                      className={`rounded-full p-1.5 border transition ${
                        article.isBookmarked
                          ? 'border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                      title={article.isBookmarked ? 'Yer imlerinden kaldır' : 'Yer imlerine ekle'}
                    >
                      <Bookmark className={`h-3 w-3 ${article.isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Read button */}
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-[#e11d48] hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#e11d48] dark:hover:text-white transition"
                  >
                    <span>İncele</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
            {activeCategory === 'Yer İmlerim'
              ? 'Henüz yer imlerine eklenmiş bir makaleniz bulunmuyor.'
              : 'Arama kriterlerinize uygun makale bulunamadı.'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {activeCategory === 'Yer İmlerim'
              ? 'Beğendiğiniz makalelerin sağ alt köşesindeki yer imi simgesine tıklayarak buraya kaydedebilirsiniz.'
              : 'Farklı bir arama terimi deneyebilir veya Gemini ile anında bu konuda yeni bir makale yazdırabilirsiniz.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setActiveCategory('Tümü');
                setSearchQuery('');
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              Filtreleri Sıfırla
            </button>
            <button
              onClick={() => setGenerateModalOpen(true)}
              className="rounded-full bg-[#e11d48] px-5 py-2 text-xs font-black text-white hover:bg-rose-700 transition"
            >
              Gemini ile Yeni Yazdır
            </button>
          </div>
        </div>
      )}

      {/* Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Generate AI Article Modal */}
      <GenerateArticleModal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onArticleGenerated={(newArticle) => {
          setSelectedArticle(newArticle);
        }}
      />
    </div>
  );
};
