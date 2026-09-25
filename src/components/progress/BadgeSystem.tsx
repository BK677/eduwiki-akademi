import React from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_BADGES, LEADERBOARD } from '../../data/mockData';
import {
  Award,
  Flame,
  Zap,
  Star,
  Trophy,
  CheckCircle2,
  Lock,
  Calendar,
  BookOpen,
  Terminal,
  HelpCircle
} from 'lucide-react';

export const BadgeSystem: React.FC = () => {
  const { user, gradeLevel } = useApp();

  if (!user) return null;

  const currentLevelXpStart = (user.level - 1) * 200;
  const currentLevelXpEnd = user.level * 200;
  const levelProgress = Math.min(
    100,
    Math.max(0, ((user.xp - currentLevelXpStart) / (currentLevelXpEnd - currentLevelXpStart)) * 100)
  );

  const unlockedBadgeIds = new Set(user.badges);

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Hero Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-4xl shadow-inner border border-white/30 backdrop-blur-md">
              {user.avatar || '🎓'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  {gradeLevel.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1">
                EduWiki Akademi Sanal Sınıfı • {user.streakDays} Günlük Aktif Seri 🔥
              </p>
            </div>
          </div>

          {/* XP & Level Status */}
          <div className="w-full md:w-72 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>Seviye {user.level}</span>
              <span>{user.xp} / {currentLevelXpEnd} XP</span>
            </div>
            {/* Progress bar */}
            <div className="h-3 w-full rounded-full bg-black/20 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-amber-400 shadow-sm transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="mt-2 text-right text-[10px] text-blue-100">
              Sonraki seviyeye {currentLevelXpEnd - user.xp} XP kaldı
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 text-lg">
            🏆
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {user.badges.length} / {ALL_BADGES.length}
            </div>
            <div className="text-[11px] text-slate-500">Kazanılan Rozet</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 text-lg">
            🎬
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {user.completedLessons.length}
            </div>
            <div className="text-[11px] text-slate-500">Tamamlanan Video Ders</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 text-lg">
            🎯
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {user.correctAnswersCount}
            </div>
            <div className="text-[11px] text-slate-500">Doğru Yanıtlanan Soru</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400 text-lg">
            🔥
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {user.streakDays} Gün
            </div>
            <div className="text-[11px] text-slate-500">Çalışma Serisi</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Badges Showcase & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badges Grid (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Başarı Rozetleri Galerisi
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {user.badges.length} / {ALL_BADGES.length} Tamamlandı
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_BADGES.map((badge) => {
              const isUnlocked = unlockedBadgeIds.has(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition ${
                    isUnlocked
                      ? 'border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20'
                      : 'border-slate-200 bg-slate-50/60 opacity-60 dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-xs ${
                      isUnlocked
                        ? 'bg-amber-400 text-white shadow-amber-500/20'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-700'
                    }`}
                  >
                    {isUnlocked ? badge.icon : <Lock className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {badge.name}
                      </h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Açık
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Leaderboard (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Haftalık Liderlik Tablosu
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Canlı Sıralama</span>
            </div>

            <div className="space-y-2.5">
              {LEADERBOARD.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition ${
                    idx === 0
                      ? 'bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/40'
                      : 'bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-extrabold ${
                        idx === 0
                          ? 'bg-amber-500 text-white shadow-xs'
                          : idx === 1
                          ? 'bg-slate-400 text-white'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-base">{item.avatar}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.grade}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-blue-600 dark:text-blue-400">
                      {item.xp} XP
                    </div>
                    <div className="text-[10px] text-orange-500 font-semibold">
                      {item.streak} Gün 🔥
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current user rank indicator */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Senin Sıralaman:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              #6 • {user.xp} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
