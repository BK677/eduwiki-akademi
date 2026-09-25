import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateWeeklySchedule } from '../../services/geminiService';
import { DayOfWeek, Subject, StudyTask } from '../../types';
import {
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Layers,
  Flame,
  ArrowRight,
  GripVertical,
  Check,
  X,
  Target,
  LayoutGrid,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

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

const SUBJECT_COLORS: Record<Subject, { bg: string; text: string; border: string; badge: string }> = {
  'Matematik': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-600 text-white' },
  'Fen Bilimleri': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-600 text-white' },
  'Fizik': { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800', badge: 'bg-cyan-600 text-white' },
  'Kimya': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', badge: 'bg-amber-600 text-white' },
  'Biyoloji': { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800', badge: 'bg-teal-600 text-white' },
  'Türkçe & Edebiyat': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', badge: 'bg-rose-600 text-white' },
  'Sosyal Bilgiler & Tarih': { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800', badge: 'bg-orange-600 text-white' },
  'İngilizce': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', badge: 'bg-purple-600 text-white' },
  'Kodlama & Robotik': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', badge: 'bg-indigo-600 text-white' },
};

export const WeeklyScheduleView: React.FC = () => {
  const {
    weeklyTasks,
    addWeeklyTask,
    deleteWeeklyTask,
    toggleTaskCompleted,
    reorderTaskDay,
    setAllWeeklyTasks,
    gradeLevel,
    selectedModel,
    showToast,
  } = useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDragTargetDay, setActiveDragTargetDay] = useState<DayOfWeek | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // View Mode: 'grid' for 7-day overview, 'day_focus' for single day tab view
  const [scheduleViewMode, setScheduleViewMode] = useState<'grid' | 'day_focus'>('grid');
  const [selectedFocusDay, setSelectedFocusDay] = useState<DayOfWeek>('Pazartesi');

  // New task form state
  const [newTaskDay, setNewTaskDay] = useState<DayOfWeek>('Pazartesi');
  const [newTaskSubject, setNewTaskSubject] = useState<Subject>('Matematik');
  const [newTaskTopic, setNewTaskTopic] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('17:00 - 18:00');
  const [newTaskDuration, setNewTaskDuration] = useState(45);

  // Filter state
  const [filterState, setFilterState] = useState<'all' | 'pending' | 'completed'>('all');

  // Stats
  const totalTasks = weeklyTasks.length;
  const completedTasks = weeklyTasks.filter(t => t.isCompleted).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, day: DayOfWeek) => {
    e.preventDefault();
    if (activeDragTargetDay !== day) {
      setActiveDragTargetDay(day);
    }
  };

  const handleDragLeave = () => {
    setActiveDragTargetDay(null);
  };

  const handleDrop = (e: React.DragEvent, targetDay: DayOfWeek) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      reorderTaskDay(taskId, targetDay);
      showToast(`Ders ${targetDay} gününe taşındı.`, 'info');
    }
    setDraggedTaskId(null);
    setActiveDragTargetDay(null);
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTopic.trim()) return;

    addWeeklyTask({
      day: newTaskDay,
      subject: newTaskSubject,
      topic: newTaskTopic.trim(),
      timeSlot: newTaskTime,
      durationMinutes: Number(newTaskDuration) || 45,
    });

    setNewTaskTopic('');
    setIsAddModalOpen(false);
    showToast('Yeni ders hedefi başarıyla eklendi!', 'success');
  };

  const handleGenerateAISchedule = async () => {
    setIsGeneratingAI(true);
    showToast('Gemini yapay zeka seviyenize ve hedeflerinize uygun haftalık plan hazırlıyor...', 'info');

    try {
      const data = await generateWeeklySchedule(
        gradeLevel,
        'Okul başarısı, LGS ve YKS kazanımları',
        selectedModel
      );

      if (data && data.tasks && Array.isArray(data.tasks)) {
        const mappedTasks: StudyTask[] = data.tasks.map((t: any, idx: number) => ({
          id: `ai_task_${Date.now()}_${idx}`,
          day: t.day as DayOfWeek,
          timeSlot: t.timeSlot || '17:00 - 18:00',
          subject: (SUBJECTS.includes(t.subject as any) ? t.subject : 'Matematik') as Subject,
          topic: t.topic || 'Haftalık Konu Çalışması',
          durationMinutes: t.durationMinutes || 45,
          isCompleted: false,
        }));

        setAllWeeklyTasks(mappedTasks);
        showToast(data.weeklyGoal || 'Yapay zeka haftalık programınızı başarıyla hazırladı!', 'reward');
      } else {
        throw new Error('Geçersiz yapay zeka yanıtı.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Program oluşturulurken bir aksaklık oldu. Lütfen tekrar deneyin.', 'info');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Helper to render task card
  const renderTaskCard = (task: StudyTask) => {
    const colorScheme = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['Matematik'];
    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        className={`group relative rounded-2xl border p-3 shadow-xs transition-all duration-150 cursor-grab active:cursor-grabbing hover:shadow-md ${
          colorScheme.bg
        } ${colorScheme.border} ${
          task.isCompleted ? 'opacity-60 line-through' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${colorScheme.badge}`}>
            {task.subject}
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
            <button
              onClick={() => toggleTaskCompleted(task.id)}
              className="text-slate-400 hover:text-emerald-600 transition p-0.5"
              title={task.isCompleted ? 'Tamamlanmadı yap' : 'Tamamlandı yap'}
            >
              {task.isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
              )}
            </button>
            <button
              onClick={() => deleteWeeklyTask(task.id)}
              className="text-slate-400 hover:text-red-500 transition p-0.5 opacity-60 hover:opacity-100"
              title="Sil"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-2 leading-snug">
          {task.topic}
        </h4>

        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.timeSlot}
          </span>
          <span className="font-semibold">{task.durationMinutes} dk</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Banner / Actions Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              Haftalık Ders ve Çalışma Çizelgesi
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sürükle-bırak haftalık takvim veya gün odaklı çalışma paneli.
            </p>
          </div>
        </div>

        {/* Action Buttons & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setScheduleViewMode('grid')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                scheduleViewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Haftalık Tablo</span>
            </button>
            <button
              onClick={() => setScheduleViewMode('day_focus')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                scheduleViewMode === 'day_focus'
                  ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Günlük Odak</span>
            </button>
          </div>

          {/* AI Generate Schedule Button */}
          <button
            onClick={handleGenerateAISchedule}
            disabled={isGeneratingAI}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Planlanıyor...' : 'Gemini ile Planla'}</span>
          </button>

          {/* Manual Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ders Ekle</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="col-span-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Haftalık Tamamlama</span>
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">%{completionPercentage}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {completedTasks}/{totalTasks} görev tamamlandı. Her ders +30 XP!
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Kalan Görev</span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {totalTasks - completedTasks}
            </div>
            <span className="text-[10px] text-slate-400">Bu hafta</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Kazanılan XP</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {completedTasks * 30} XP
            </div>
            <span className="text-[10px] text-slate-400">Haftalık başarı</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Flame className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterState('all')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
              filterState === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Tümü ({totalTasks})
          </button>
          <button
            onClick={() => setFilterState('pending')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
              filterState === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Bekleyenler ({totalTasks - completedTasks})
          </button>
          <button
            onClick={() => setFilterState('completed')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
              filterState === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Tamamlananlar ({completedTasks})
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
          <GripVertical className="h-3 w-3" />
          <span>Ders kartlarını günlere sürükleyip bırakabilirsin</span>
        </div>
      </div>

      {/* 1. VIEW MODE: DAY FOCUS (GÜNLÜK ODAK GÖRÜNÜMÜ) */}
      {scheduleViewMode === 'day_focus' ? (
        <div className="space-y-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS.map((day) => {
              const count = weeklyTasks.filter(t => t.day === day).length;
              const isSelected = selectedFocusDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedFocusDay(day)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    isSelected
                      ? 'bg-[#e11d48] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`h-4 min-w-[16px] px-1 rounded-full text-[10px] flex items-center justify-center font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Panel */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedFocusDay} Günü Dersleri
                </h3>
                <span className="rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 px-2 py-0.5 text-xs font-bold">
                  {weeklyTasks.filter(t => t.day === selectedFocusDay).length} Ders Hedefi
                </span>
              </div>
              <button
                onClick={() => {
                  setNewTaskDay(selectedFocusDay);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus className="h-4 w-4" />
                <span>Bu Güne Ders Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weeklyTasks
                .filter(t => {
                  if (t.day !== selectedFocusDay) return false;
                  if (filterState === 'pending') return !t.isCompleted;
                  if (filterState === 'completed') return t.isCompleted;
                  return true;
                })
                .map((task) => renderTaskCard(task))}

              {weeklyTasks.filter(t => t.day === selectedFocusDay).length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center p-4 text-slate-400">
                  <p className="text-xs font-medium">{selectedFocusDay} günü için planlanmış ders bulunmuyor.</p>
                  <button
                    onClick={() => {
                      setNewTaskDay(selectedFocusDay);
                      setIsAddModalOpen(true);
                    }}
                    className="mt-2 text-xs font-bold text-pink-600 hover:underline"
                  >
                    + Hemen ilk dersi ekle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2. VIEW MODE: 7-DAY FULL TABLE (WITH SAFE HORIZONTAL OVERFLOW SCROLL WRAPPER) */
        <div className="overflow-x-auto pb-4 -mx-1 px-1">
          <div className="grid grid-cols-7 gap-3 min-w-[980px]">
            {DAYS.map((day) => {
              const dayTasks = weeklyTasks.filter(t => {
                if (t.day !== day) return false;
                if (filterState === 'pending') return !t.isCompleted;
                if (filterState === 'completed') return t.isCompleted;
                return true;
              });

              const isTarget = activeDragTargetDay === day;

              return (
                <div
                  key={day}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day)}
                  className={`rounded-2xl border transition-all duration-150 p-3 flex flex-col min-h-[340px] ${
                    isTarget
                      ? 'border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-950/30 shadow-md'
                      : 'border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 shadow-2xs'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{day}</span>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                        {dayTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setNewTaskDay(day);
                        setIsAddModalOpen(true);
                      }}
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                      title={`${day} gününe ders ekle`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Tasks List */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {dayTasks.length === 0 ? (
                      <div className="h-28 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center p-2 text-slate-400">
                        <p className="text-[10px]">Ders yok</p>
                        <p className="text-[8px] opacity-75">Sürükle veya ekle</p>
                      </div>
                    ) : (
                      dayTasks.map((task) => renderTaskCard(task))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Task Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <span>Haftalık Plana Ders Ekle</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gün Seçimi
                </label>
                <select
                  value={newTaskDay}
                  onChange={(e) => setNewTaskDay(e.target.value as DayOfWeek)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ders Branşı
                </label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value as Subject)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Çalışılacak Konu / Kazanım
                </label>
                <input
                  type="text"
                  value={newTaskTopic}
                  onChange={(e) => setNewTaskTopic(e.target.value)}
                  placeholder="Örn: Rasyonel Sayılarda Dört İşlem & Test"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Saat Aralığı
                  </label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="17:00 - 17:45"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Süre (Dakika)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="5"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-extrabold text-white shadow-md hover:bg-blue-700 transition"
                >
                  Hedefi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
