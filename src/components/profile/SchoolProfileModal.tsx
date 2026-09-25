import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeLevel } from '../../types';
import { School, X, Check, GraduationCap, Target, Clock, Sparkles } from 'lucide-react';

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATARS = ['🎓', '👧', '👦', '👩‍🏫', '👨‍🎓', '🚀', '⭐', '🧠', '🦁'];

const POPULAR_SCHOOLS_BY_GRADE: Record<GradeLevel, string[]> = {
  ilkokul: [
    'Cumhuriyet İlkokulu',
    'Atatürk İlkokulu',
    'Fevzi Çakmak İlkokulu',
    'Barış Manço İlkokulu',
  ],
  ortaokul: [
    'Atatürk Ortaokulu',
    'Namık Kemal Ortaokulu',
    'Mehmet Akif İnan Ortaokulu',
    'Bilim ve Sanat Merkezi (BİLSEM)',
  ],
  lise: [
    'Atatürk Fen Lisesi',
    'Kabataş Erkek Lisesi',
    'İstanbul Erkek Lisesi',
    'Ankara Fen Lisesi',
    'İzmir Fen Lisesi',
  ],
};

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, gradeLevel, showToast } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [schoolName, setSchoolName] = useState(user?.schoolName || 'Cumhuriyet Ortaokulu');
  const [classGrade, setClassGrade] = useState(user?.classGrade || '8. Sınıf (LGS)');
  const [targetExam, setTargetExam] = useState(user?.targetExam || 'LGS Hazırlık');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 60);
  const [avatar, setAvatar] = useState(user?.avatar || '🎓');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(user?.gradeLevel || gradeLevel);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || user?.name || 'Öğrenci',
      schoolName: schoolName.trim() || 'Atatürk Ortaokulu',
      classGrade: classGrade.trim() || '8. Sınıf',
      targetExam: targetExam.trim() || 'Okul Başarısı',
      dailyGoalMinutes: Number(dailyGoalMinutes),
      avatar,
      gradeLevel: selectedGrade,
    });
    showToast('Öğrenci ve okul bilgileri başarıyla güncellendi!', 'success');
    onClose();
  };

  const handleSelectPresetSchool = (school: string) => {
    setSchoolName(school);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-xs">
              <School className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Okul ve Profil Ayarları
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kademeni, okulunu ve hedeflerini özelleştir.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="school-profile-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Profil Avatarı
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`h-9 w-9 shrink-0 rounded-xl text-lg flex items-center justify-center transition ${
                    avatar === av
                      ? 'bg-pink-100 border-2 border-pink-500 dark:bg-pink-950/60 shadow-xs scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 border border-transparent dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Ad & Soyad */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Öğrenci Adı Soyadı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-pink-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Örn: Zeynep Kaya"
              required
            />
          </div>

          {/* Sınıf Kademesi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Eğitim Kademesi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ilkokul', 'ortaokul', 'lise'] as GradeLevel[]).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => {
                    setSelectedGrade(g);
                    if (g === 'ilkokul') {
                      setClassGrade('3. Sınıf');
                      setTargetExam('Temel Okul Başarısı');
                      setSchoolName('Cumhuriyet İlkokulu');
                    } else if (g === 'ortaokul') {
                      setClassGrade('8. Sınıf (LGS)');
                      setTargetExam('LGS 500 Tam Puan');
                      setSchoolName('Atatürk Ortaokulu');
                    } else {
                      setClassGrade('12. Sınıf (YKS)');
                      setTargetExam('YKS İlk 10.000 Hedefi');
                      setSchoolName('Atatürk Fen Lisesi');
                    }
                  }}
                  className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition ${
                    selectedGrade === g
                      ? 'border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400'
                  }`}
                >
                  {g === 'ilkokul' ? '🎨 İlkokul (1-4)' : g === 'ortaokul' ? '🚀 Ortaokul (LGS)' : '🎓 Lise (YKS)'}
                </button>
              ))}
            </div>
          </div>

          {/* Okul Adı & Önerilenler */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Okul Adı
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-pink-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Örn: Atatürk Ortaokulu"
              required
            />
            {/* Quick school chips */}
            <div className="mt-2 flex flex-wrap gap-1">
              {POPULAR_SCHOOLS_BY_GRADE[selectedGrade].map((sch) => (
                <button
                  type="button"
                  key={sch}
                  onClick={() => handleSelectPresetSchool(sch)}
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-medium transition ${
                    schoolName === sch
                      ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-pink-50 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  + {sch}
                </button>
              ))}
            </div>
          </div>

          {/* Sınıf & Hedef Sınav Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sınıf / Şube
              </label>
              <input
                type="text"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-pink-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Örn: 8. Sınıf - A Şubesi"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hedef Sınav
              </label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-pink-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Örn: LGS 500 Tam Puan"
              />
            </div>
          </div>

          {/* Günlük Hedef Çalışma Süresi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Günlük Hedef Çalışma Süresi
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[30, 45, 60, 90, 120].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDailyGoalMinutes(mins)}
                  className={`py-1.5 text-center text-xs font-bold rounded-xl border transition ${
                    dailyGoalMinutes === mins
                      ? 'border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {mins} dk
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Fixed Sticky Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-850 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800 transition"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            form="school-profile-form"
            className="rounded-xl bg-[#e11d48] hover:bg-rose-700 px-5 py-2 text-xs font-extrabold text-white shadow-md hover:shadow-lg transition"
          >
            Kaydet ve Güncelle
          </button>
        </div>

      </div>
    </div>
  );
};
