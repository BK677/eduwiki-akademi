import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, GradeLevel, AIModelType, StudyTask, DayOfWeek, AppSettings, Article } from '../types';
import { ALL_BADGES } from '../data/mockData';
import { CURATED_ARTICLES } from '../data/articlesData';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info' | 'reward';
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  simplicityMode: boolean;
  toggleSimplicityMode: () => void;
  gradeLevel: GradeLevel;
  setGradeLevel: (grade: GradeLevel) => void;
  selectedModel: AIModelType;
  setSelectedModel: (model: AIModelType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'role_select';
  setAuthModalMode: (mode: 'login' | 'register' | 'role_select') => void;
  openAuthModal: (mode?: 'login' | 'register' | 'role_select') => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  weeklyTasks: StudyTask[];
  addWeeklyTask: (task: Omit<StudyTask, 'id' | 'isCompleted'>) => void;
  updateWeeklyTask: (id: string, updates: Partial<StudyTask>) => void;
  deleteWeeklyTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  reorderTaskDay: (taskId: string, targetDay: DayOfWeek) => void;
  setAllWeeklyTasks: (tasks: StudyTask[]) => void;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addXP: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeLesson: (lessonId: string) => void;
  recordQuizResult: (correctCount: number) => void;
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'info' | 'reward') => void;
  // Articles state and actions
  articles: Article[];
  toggleLikeArticle: (id: string) => void;
  toggleBookmarkArticle: (id: string) => void;
  addArticle: (article: Article) => void;
  markArticleAsRead: (id: string) => void;
  readArticleIds: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'eduwiki_user_session';
const THEME_STORAGE_KEY = 'eduwiki_theme_dark';
const TASKS_STORAGE_KEY = 'eduwiki_weekly_tasks';
const SETTINGS_STORAGE_KEY = 'eduwiki_settings';
const ARTICLES_STORAGE_KEY = 'eduwiki_articles_list';
const READ_ARTICLES_STORAGE_KEY = 'eduwiki_read_articles';

const DEFAULT_SETTINGS: AppSettings = {
  speechRate: 1.0,
  speechPitch: 1.0,
  autoSpeak: true,
  continuousVoiceMode: false,
  soundEffects: true,
};

const INITIAL_TASKS: StudyTask[] = [
  { id: 'task_1', day: 'Pazartesi', timeSlot: '17:00 - 17:45', subject: 'Matematik', topic: 'Cebirsel İfadeler & Denklem Çözme', durationMinutes: 45, isCompleted: true },
  { id: 'task_2', day: 'Pazartesi', timeSlot: '18:00 - 18:40', subject: 'Fen Bilimleri', topic: 'Kuvvet ve Hareket Deneyleri', durationMinutes: 40, isCompleted: false },
  { id: 'task_3', day: 'Salı', timeSlot: '16:30 - 17:15', subject: 'Türkçe & Edebiyat', topic: 'Paragrafta Anlam ve Ana Düşünce', durationMinutes: 45, isCompleted: false },
  { id: 'task_4', day: 'Salı', timeSlot: '17:30 - 18:15', subject: 'Kodlama & Robotik', topic: 'Python Döngüler ve Algoritmalar', durationMinutes: 45, isCompleted: true },
  { id: 'task_5', day: 'Çarşamba', timeSlot: '17:00 - 18:00', subject: 'Matematik', topic: '5 Soruluk Hızlı Quiz ve Soru Çözümü', durationMinutes: 60, isCompleted: false },
  { id: 'task_6', day: 'Perşembe', timeSlot: '17:15 - 18:00', subject: 'İngilizce', topic: 'Kelime Bilgisi & Okuma Parçaları', durationMinutes: 45, isCompleted: false },
  { id: 'task_7', day: 'Cuma', timeSlot: '16:00 - 17:00', subject: 'Sosyal Bilgiler & Tarih', topic: 'Harita Bilgisi ve Olaylar', durationMinutes: 60, isCompleted: false },
  { id: 'task_8', day: 'Cumartesi', timeSlot: '11:00 - 12:30', subject: 'Fen Bilimleri', topic: 'Haftalık Konu Tekrarı ve Pomodoro', durationMinutes: 90, isCompleted: false },
  { id: 'task_9', day: 'Pazar', timeSlot: '14:00 - 15:00', subject: 'Kodlama & Robotik', topic: 'Kişisel Mini Proje Geliştirme', durationMinutes: 60, isCompleted: false },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Simplicity (Minimal) Mode state
  const [simplicityMode, setSimplicityMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('eduwiki_simplicity_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSimplicityMode = () => {
    setSimplicityMode(prev => {
      const next = !prev;
      localStorage.setItem('eduwiki_simplicity_mode', String(next));
      return next;
    });
  };

  // User state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [gradeLevel, setGradeLevelState] = useState<GradeLevel>(() => {
    return user?.gradeLevel || 'ortaokul';
  });

  const [selectedModel, setSelectedModel] = useState<AIModelType>('gemini-3.8-flash');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'role_select'>('role_select');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const openAuthModal = (mode: 'login' | 'register' | 'role_select' = 'role_select') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Articles State & Persistence
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return CURATED_ARTICLES;
    } catch {
      return CURATED_ARTICLES;
    }
  });

  const [readArticleIds, setReadArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(READ_ARTICLES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync articles & read items to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.warn('Articles storage error:', e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(READ_ARTICLES_STORAGE_KEY, JSON.stringify(readArticleIds));
    } catch (e) {
      console.warn('Read articles storage error:', e);
    }
  }, [readArticleIds]);

  const toggleLikeArticle = (id: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          const isLiked = !art.isLiked;
          const likesCount = isLiked ? art.likesCount + 1 : Math.max(0, art.likesCount - 1);
          if (isLiked) {
            showToast('Makale beğenildi! ❤️', 'info');
            addXP(10, 'Makale etkileşimi');
          }
          return { ...art, isLiked, likesCount };
        }
        return art;
      })
    );
  };

  const toggleBookmarkArticle = (id: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          const isBookmarked = !art.isBookmarked;
          showToast(isBookmarked ? 'Makale yer imlerine eklendi! 🔖' : 'Yer imlerinden kaldırıldı.', 'info');
          if (isBookmarked) {
            addXP(10, 'Yer imlerine kaydetme');
          }
          return { ...art, isBookmarked };
        }
        return art;
      })
    );
  };

  const addArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
    showToast(`"${newArticle.title}" kütüphaneye eklendi! ✨`, 'reward');
    addXP(35, 'Yeni yapay zeka makalesi üretme');
  };

  const markArticleAsRead = (id: string) => {
    if (readArticleIds.includes(id)) return;
    setReadArticleIds(prev => [...prev, id]);
    addXP(25, 'Eğitim makalesi tamamlama');
    showToast('Tebrikler! Makaleyi okudun (+25 XP)', 'reward');
  };

  // Weekly study tasks state
  const [weeklyTasks, setWeeklyTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Apply dark mode class to HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, String(darkMode));
  }, [darkMode]);

  // Sync user state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Sync tasks to local storage
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(weeklyTasks));
  }, [weeklyTasks]);

  // Sync settings to local storage
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Ayarlar başarıyla kaydedildi.', 'success');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'reward' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const setGradeLevel = (newGrade: GradeLevel) => {
    setGradeLevelState(newGrade);
    if (user) {
      setUser(prev => prev ? { ...prev, gradeLevel: newGrade } : null);
    }
    const gradeLabels: Record<GradeLevel, string> = {
      ilkokul: 'İlkokul (1-4. Sınıf)',
      ortaokul: 'Ortaokul (5-8. Sınıf)',
      lise: 'Lise (9-12. Sınıf)',
    };
    showToast(`Ders seviyesi "${gradeLabels[newGrade]}" olarak güncellendi.`, 'info');
  };

  const addWeeklyTask = (task: Omit<StudyTask, 'id' | 'isCompleted'>) => {
    const newTask: StudyTask = {
      ...task,
      id: 'task_' + Date.now(),
      isCompleted: false,
    };
    setWeeklyTasks(prev => [...prev, newTask]);
    showToast(`"${task.topic}" haftalık plana eklendi!`, 'success');
    addXP(15, 'Yeni çalışma hedefi ekleme');
  };

  const updateWeeklyTask = (id: string, updates: Partial<StudyTask>) => {
    setWeeklyTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteWeeklyTask = (id: string) => {
    setWeeklyTasks(prev => prev.filter(t => t.id !== id));
    showToast('Ders görevi kaldırıldı.', 'info');
  };

  const toggleTaskCompleted = (id: string) => {
    setWeeklyTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newState = !t.isCompleted;
          if (newState) {
            addXP(30, `"${t.topic}" dersini tamamlama`);
          }
          return { ...t, isCompleted: newState };
        }
        return t;
      })
    );
  };

  const reorderTaskDay = (taskId: string, targetDay: DayOfWeek) => {
    setWeeklyTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, day: targetDay } : t))
    );
    showToast(`Görev ${targetDay} gününe taşındı.`, 'info');
  };

  const setAllWeeklyTasks = (tasks: StudyTask[]) => {
    setWeeklyTasks(tasks);
    showToast('Haftalık ders programı başarıyla güncellendi!', 'success');
  };

  const login = (userData: Partial<User>) => {
    const gl = userData.gradeLevel || gradeLevel;
    const defaultSchool = gl === 'ilkokul' ? 'Cumhuriyet İlkokulu' : gl === 'ortaokul' ? 'Atatürk Ortaokulu (LGS)' : 'Gazi Anadolu Lisesi (YKS)';
    const defaultExam = gl === 'ilkokul' ? 'Temel Kazanımlar' : gl === 'ortaokul' ? 'LGS Hazırlık' : 'YKS (TYT & AYT)';

    const fullUser: User = {
      id: userData.id || 'usr_' + Date.now(),
      name: userData.name || 'Kadir Kara',
      email: userData.email || 'duygukadirkara@gmail.com',
      avatar: userData.avatar || '🎓',
      gradeLevel: gl,
      role: userData.role || 'ogrenci',
      schoolLevel: userData.schoolLevel || gl,
      classGrade: userData.classGrade || (gl === 'ilkokul' ? '3. Sınıf' : gl === 'ortaokul' ? '8. Sınıf (LGS)' : '12. Sınıf (YKS)'),
      schoolName: userData.schoolName || defaultSchool,
      targetExam: userData.targetExam || defaultExam,
      dailyGoalMinutes: userData.dailyGoalMinutes || 60,
      xp: userData.xp || 150,
      level: Math.floor((userData.xp || 150) / 200) + 1,
      streakDays: userData.streakDays || 3,
      badges: userData.badges || ['first_step'],
      completedLessons: userData.completedLessons || [],
      quizzesTaken: userData.quizzesTaken || 1,
      correctAnswersCount: userData.correctAnswersCount || 4,
    };
    setUser(fullUser);
    setGradeLevelState(fullUser.gradeLevel);
    setAuthModalOpen(false);
    showToast(`Hoş geldin, ${fullUser.name}! EduWiki Akademi seni bekliyor.`, 'success');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (updates.gradeLevel) {
        setGradeLevelState(updates.gradeLevel);
      }
      return updated;
    });
    showToast('Profil ve okul bilgileri güncellendi.', 'success');
  };

  const logout = () => {
    setUser(null);
    setActiveTab('dashboard');
    showToast('Başarıyla çıkış yapıldı.', 'info');
  };

  const addXP = (amount: number, reason?: string) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return null;
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 200) + 1;
      const levelUp = newLevel > prev.level;

      if (levelUp) {
        showToast(`🎉 TEBRİKLER! Seviye Atladın: Seviye ${newLevel}!`, 'reward');
      } else if (reason) {
        showToast(`+${amount} XP Kazandın: ${reason}`, 'reward');
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    if (!user || user.badges.includes(badgeId)) return;
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });

    showToast(`🎖️ Yeni Rozet Açıldı: "${badge.name}" (${badge.icon})`, 'reward');
    addXP(100, `"${badge.name}" rozeti kazanımı`);
  };

  const completeLesson = (lessonId: string) => {
    if (!user || user.completedLessons.includes(lessonId)) return;
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
    addXP(80, 'Video Dersi Tamamlama');
    unlockBadge('video_expert');
  };

  const recordQuizResult = (correctCount: number) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        quizzesTaken: prev.quizzesTaken + 1,
        correctAnswersCount: prev.correctAnswersCount + correctCount,
      };
    });
    const xpGained = correctCount * 25 + (correctCount === 5 ? 50 : 0);
    addXP(xpGained, `Test sonucu: ${correctCount}/5 Doğru`);
    if (correctCount === 5) {
      unlockBadge('quiz_master');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        darkMode,
        toggleDarkMode,
        simplicityMode,
        toggleSimplicityMode,
        gradeLevel,
        setGradeLevel,
        selectedModel,
        setSelectedModel,
        activeTab,
        setActiveTab,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        isSettingsOpen,
        setIsSettingsOpen,
        settings,
        updateSettings,
        weeklyTasks,
        addWeeklyTask,
        updateWeeklyTask,
        deleteWeeklyTask,
        toggleTaskCompleted,
        reorderTaskDay,
        setAllWeeklyTasks,
        login,
        logout,
        updateUserProfile,
        addXP,
        unlockBadge,
        completeLesson,
        recordQuizResult,
        toasts,
        showToast,
        articles,
        toggleLikeArticle,
        toggleBookmarkArticle,
        addArticle,
        markArticleAsRead,
        readArticleIds,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
              t.type === 'reward'
                ? 'bg-amber-500/95 text-white border-amber-400'
                : t.type === 'success'
                ? 'bg-emerald-600/95 text-white border-emerald-500'
                : 'bg-slate-900/95 text-slate-100 border-slate-700 dark:bg-slate-800/95'
            }`}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

