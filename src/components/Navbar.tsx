import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GradeLevel, AIModelType } from '../types';
import { SchoolProfileModal } from './profile/SchoolProfileModal';
import {
  Sun,
  Moon,
  Sparkles,
  Flame,
  Award,
  LogIn,
  LogOut,
  ChevronDown,
  Menu,
  Sliders,
  School,
  User as UserIcon,
  X
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    user,
    isAuthenticated,
    darkMode,
    toggleDarkMode,
    gradeLevel,
    setGradeLevel,
    selectedModel,
    setSelectedModel,
    openAuthModal,
    setIsSettingsOpen,
    logout,
    setActiveTab,
  } = useApp();

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);

  const modelLabels: Record<AIModelType, { label: string; short: string }> = {
    'gemini-3.1-flash-lite': { label: 'Gemini 3.1 Flash Lite', short: '3.1 Lite' },
    'gemini-3.6-flash-lite': { label: 'Gemini 3.6 Flash Lite', short: '3.6 Lite' },
    'gemini-3.7-flash-lite': { label: 'Gemini 3.7 Flash Lite', short: '3.7 Lite' },
    'gemini-3.8-flash': { label: 'Gemini 3.8 Flash (Önerilen)', short: '3.8 Flash' },
    'gemini-3.1-pro-preview': { label: 'Gemini 3.1 Pro (Derin)', short: '3.1 Pro' },
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      {/* LEFT: Mobile Menu + Brand Logo + School/Grade Badge */}
      <div className="flex items-center gap-2 sm:gap-4">
        {isAuthenticated && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Menü"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 cursor-pointer select-none group"
        >
          <span className="text-2xl sm:text-2xl font-black tracking-tight text-[#e11d48]">
            eduwiki
          </span>
          <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="hidden md:inline rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Akademi
          </span>
        </div>

        {/* School & Grade Badge (Clickable to Edit/Switch) */}
        {isAuthenticated && (
          <button
            onClick={() => setSchoolModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 hover:bg-pink-50 hover:border-pink-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            title="Okul ve Sınıf Bilgilerini Düzenle"
          >
            <School className="h-3.5 w-3.5 text-[#e11d48]" />
            <span className="max-w-[140px] truncate font-bold">
              {user?.schoolName || 'Cumhuriyet Ortaokulu'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-pink-600 dark:text-pink-400 font-bold">
              {user?.classGrade || (gradeLevel === 'ilkokul' ? '3. Sınıf' : gradeLevel === 'ortaokul' ? '8. Sınıf' : '12. Sınıf')}
            </span>
          </button>
        )}
      </div>

      {/* RIGHT: Model Selector + Stats + Theme Toggle + User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compact Gemini Model Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setModelDropdownOpen(!modelDropdownOpen);
              setUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            <span>{modelLabels[selectedModel]?.short || '3.8 Flash'}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Gemini Model Seçimi
              </div>
              {(Object.keys(modelLabels) as AIModelType[]).map((mKey) => (
                <button
                  key={mKey}
                  onClick={() => {
                    setSelectedModel(mKey);
                    setModelDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-left transition ${
                    selectedModel === mKey
                      ? 'bg-pink-50 text-[#e11d48] dark:bg-pink-950/50 dark:text-pink-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{modelLabels[mKey].label}</span>
                  {selectedModel === mKey && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Combined Streak & XP Badge (When Authenticated) */}
        {isAuthenticated && user && (
          <div
            onClick={() => setActiveTab('badges')}
            className="hidden md:flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50/70 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-100 cursor-pointer dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800/40 transition"
            title="Gelişim ve Rozetler"
          >
            <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Flame className="h-3.5 w-3.5 fill-orange-500" />
              <span>{user.streakDays}g</span>
            </span>
            <span className="text-amber-400">|</span>
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
              <Award className="h-3.5 w-3.5" />
              <span>{user.xp} XP</span>
            </span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={darkMode ? 'Açık Mod' : 'Koyu Mod'}
          title={darkMode ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        {/* Authenticated User Menu Dropdown */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setModelDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-full p-1 border border-slate-200 hover:border-pink-300 dark:border-slate-800 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#e11d48] to-pink-500 text-base font-black text-white shadow-xs">
                {user.avatar || '🎓'}
              </div>
              <ChevronDown className="h-3 w-3 text-slate-500 pr-1" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 z-50">
                {/* User Header */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded-md">
                    <School className="h-3 w-3 shrink-0" />
                    <span className="truncate">{user.schoolName || 'Cumhuriyet Ortaokulu'}</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSchoolModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    <School className="h-4 w-4 text-[#e11d48]" />
                    <span>Okul & Sınıfı Düzenle</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    <Sliders className="h-4 w-4 text-slate-500" />
                    <span>Derslik Ayarları & API</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-1.5 rounded-full bg-[#e11d48] px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Giriş Yap</span>
          </button>
        )}
      </div>

      {/* School & Profile Editor Modal */}
      <SchoolProfileModal
        isOpen={schoolModalOpen}
        onClose={() => setSchoolModalOpen(false)}
      />
    </header>
  );
};
