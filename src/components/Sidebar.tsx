import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Mic,
  Video,
  Calendar,
  PlayCircle,
  Terminal,
  HelpCircle,
  Award,
  Clock,
  PenTool,
  ChevronRight,
  Sparkles,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  Gamepad2,
  BookOpen,
  BookOpenCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, user, gradeLevel, setIsSettingsOpen } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Genel Bakış',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Derslik ana paneli',
    },
    {
      id: 'unit-explorer',
      label: 'Dersler & Üniteler',
      icon: BookOpen,
      badge: 'MAARİF',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold',
      desc: 'Derslig tarzı ünite ve konu haritası',
    },
    {
      id: 'articles',
      label: 'EduWiki Kütüphane / Makaleler',
      icon: BookOpenCheck,
      badge: 'YENİ',
      badgeColor: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold',
      desc: 'Sınav taktikleri, rehberlik & AI makaleleri',
    },
    {
      id: 'voice-mode',
      label: 'Sesli Etkileşim',
      icon: Mic,
      badge: 'SESLİ',
      badgeColor: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white animate-pulse',
      desc: 'Web Speech ile sesli soru & cevap',
    },
    {
      id: 'live-classroom',
      label: 'Canlı Ders Simülasyonu',
      icon: Video,
      badge: 'CANLI',
      badgeColor: 'bg-red-500 text-white animate-pulse',
      desc: 'Birebir AI Öğretmen & Tahta',
    },
    {
      id: 'schedule',
      label: 'Haftalık Ders Planı',
      icon: Calendar,
      badge: 'PLAN',
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Sürükle-bırak haftalık takvim',
    },
    {
      id: 'videos',
      label: 'YouTube Video Dersler',
      icon: PlayCircle,
      badge: null,
      desc: 'Konu anlatımları & not alma',
    },
    {
      id: 'coding',
      label: 'Kodlama Laboratuvarı',
      icon: Terminal,
      badge: 'KOD',
      badgeColor: 'bg-indigo-600 text-white',
      desc: 'Python & JS kod editörü',
    },
    {
      id: 'quiz',
      label: 'Soru Sor & Test Çöz',
      icon: HelpCircle,
      badge: '5 Soru',
      badgeColor: 'bg-emerald-600 text-white',
      desc: 'Otomatik test & soru çözümü',
    },
    {
      id: 'games',
      label: 'Eğitici Oyunlar',
      icon: Gamepad2,
      badge: 'YENİ',
      badgeColor: 'bg-violet-600 text-white',
      desc: 'Matematik & Hafıza Oyunları',
    },
    {
      id: 'badges',
      label: 'Gelişim & Rozetler',
      icon: Award,
      badge: user ? `${user.badges.length} Rozet` : null,
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Puanlar, seviye ve sıralama',
    },
    {
      id: 'study-tools',
      label: 'Çalışma Araçları',
      icon: Clock,
      badge: null,
      desc: 'Pomodoro, Ambiyans & Flashcard',
    },
    {
      id: 'whiteboard',
      label: 'Sanal Çizim Tahtası',
      icon: PenTool,
      badge: null,
      desc: 'Formül çizimi ve karalama',
    },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col justify-between border-r border-slate-200/80 bg-white/95 p-3 backdrop-blur-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/95 lg:static lg:h-full lg:overflow-y-auto lg:shrink-0 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-68'}`}
      >
        <div className="space-y-3 overflow-y-auto">
          {/* Mobile Close Button & Desktop Collapse Toggle */}
          <div className="flex items-center justify-between pb-1 px-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${collapsed ? 'lg:hidden' : ''}`}>
              Menü & Derslik
            </span>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Desktop collapse/expand toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              title={collapsed ? 'Genişlet' : 'Daralt'}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          {/* Sınıf Seviyesi Durum Kartı (Expanded Only) */}
          {!collapsed && (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>AKTİF KADEME</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  EduWiki AI
                </span>
              </div>
              <div className="mt-1 font-bold text-slate-800 dark:text-slate-100 text-xs">
                {gradeLevel === 'ilkokul' && '🎨 İlkokul (1-4. Sınıf)'}
                {gradeLevel === 'ortaokul' && '🚀 Ortaokul (5-8. Sınıf)'}
                {gradeLevel === 'lise' && '🎓 Lise (9-12. Sınıf)'}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`group flex w-full items-center rounded-2xl transition-all ${
                    collapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5 text-left'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <Icon
                      className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600'
                      }`}
                    />
                    {!collapsed && (
                      <div className="overflow-hidden">
                        <div className="leading-tight text-xs font-bold truncate">{item.label}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    )}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-1 shrink-0">
                      {item.badge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                            isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 ${
                          isActive ? 'opacity-100 text-white' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Tip Card / Quick Settings */}
        <div className="pt-2">
          {!collapsed ? (
            <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 p-3 text-xs dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-blue-950/40">
              <div className="flex items-center justify-between font-bold text-indigo-700 dark:text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>EduWiki Asistan</span>
                </span>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="rounded-md p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                  title="Ayarlar"
                >
                  <Sliders className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                Web Speech ile sesli soru sorabilir, haftalık takvimde derslerini planlayabilirsin!
              </p>
            </div>
          ) : (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex w-full items-center justify-center rounded-2xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="EduWiki Ayarları"
            >
              <Sliders className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
