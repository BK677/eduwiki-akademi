import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GradeLevel } from '../types';
import {
  X,
  GraduationCap,
  Sparkles,
  ArrowRight,
  School,
  KeyRound,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  ChevronDown,
  Building2,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, showToast } = useApp();

  // Selected role for registration
  const [selectedRole, setSelectedRole] = useState<'ogrenci' | 'ogretmen'>('ogrenci');

  // Form Fields
  const [schoolLevel, setSchoolLevel] = useState<'ilkokul' | 'ortaokul' | 'lise'>('ortaokul');
  const [classGrade, setClassGrade] = useState('8. Sınıf (LGS)');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Institution / Class Code Modal State
  const [codeType, setCodeType] = useState<'institution' | 'class'>('institution');
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  // Validation / Error
  const [formError, setFormError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  // Grade options mapped by schoolLevel
  const gradeOptions: Record<'ilkokul' | 'ortaokul' | 'lise', string[]> = {
    ilkokul: ['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf'],
    ortaokul: ['5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf (LGS)'],
    lise: ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf (YKS)'],
  };

  const handleSchoolLevelChange = (level: 'ilkokul' | 'ortaokul' | 'lise') => {
    setSchoolLevel(level);
    setClassGrade(gradeOptions[level][gradeOptions[level].length - 1]);
  };

  // Google One-Click Auth Simulation
  const handleGoogleAuth = () => {
    const isTeacher = selectedRole === 'ogretmen';
    login({
      id: 'goog_' + Date.now(),
      name: isTeacher ? 'Prof. Dr. Deniz Arslan' : 'Kadir Kara (Google Öğrenci)',
      email: isTeacher ? 'deniz.arslan@gmail.com' : 'duygukadirkara@gmail.com',
      avatar: isTeacher ? '👨‍🏫' : '🚀',
      gradeLevel: schoolLevel,
      role: selectedRole,
      schoolLevel,
      classGrade,
      xp: 250,
      badges: ['first_step', 'math_genius'],
    });
    setAuthModalOpen(false);
    showToast(`Google ile başarıyla giriş yapıldı! Hoş geldiniz.`, 'success');
  };

  // Quick Demo Logins
  const handleQuickDemo = (role: 'ilkokul' | 'ortaokul' | 'lise' | 'ogretmen') => {
    if (role === 'ogretmen') {
      login({
        id: 'demo_teacher',
        name: 'Selin Yılmaz (Öğretmen)',
        email: 'selin.ogretmen@eduwiki.com',
        avatar: '👩‍🏫',
        gradeLevel: 'ortaokul',
        role: 'ogretmen',
        schoolLevel: 'ortaokul',
        classGrade: '8. Sınıf Rehberlik',
        xp: 800,
        badges: ['first_step', 'quiz_master', 'code_explorer'],
      });
    } else {
      const demoUsers = {
        ilkokul: { name: 'Can Yıldız (3. Sınıf)', avatar: '👧', grade: 'ilkokul' as GradeLevel, classText: '3. Sınıf' },
        ortaokul: { name: 'Zeynep Kaya (8. Sınıf LGS)', avatar: '👩‍🎓', grade: 'ortaokul' as GradeLevel, classText: '8. Sınıf (LGS)' },
        lise: { name: 'Emre Demir (12. Sınıf YKS)', avatar: '👨‍🎓', grade: 'lise' as GradeLevel, classText: '12. Sınıf (YKS)' },
      };
      const cur = demoUsers[role];
      login({
        id: 'demo_' + role,
        name: cur.name,
        email: `${role}@eduwiki.com`,
        avatar: cur.avatar,
        gradeLevel: cur.grade,
        role: 'ogrenci',
        schoolLevel: cur.grade,
        classGrade: cur.classText,
        xp: 350,
        badges: ['first_step', role === 'ilkokul' ? 'math_genius' : 'quiz_master'],
      });
    }
    setAuthModalOpen(false);
    showToast('Demo hesabı ile giriş yapıldı! Tüm özellikler aktif.', 'reward');
  };

  // Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!firstName.trim()) {
      setFormError('Lütfen adınızı giriniz.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (password.length < 6) {
      setFormError('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== passwordConfirm) {
      setFormError('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }
    if (!agreeTerms) {
      setFormError('Lütfen kullanıcı sözleşmesi ve KVKK metnini onaylayınız.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    login({
      id: 'usr_' + Date.now(),
      name: fullName,
      email: email.trim().toLowerCase(),
      avatar: selectedRole === 'ogretmen' ? '👨‍🏫' : '👩‍🎓',
      gradeLevel: schoolLevel,
      role: selectedRole,
      schoolLevel,
      classGrade,
      xp: 150,
      badges: ['first_step'],
    });
    setAuthModalOpen(false);
    showToast(`EduWiki Akademi ailesine hoş geldiniz, ${fullName}!`, 'success');
  };

  // Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    if (!password) {
      setFormError('Lütfen şifrenizi giriniz.');
      return;
    }

    // Auto log in with nice generated name or entered email
    const inferredName = email.split('@')[0];
    const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
    login({
      id: 'usr_' + Date.now(),
      name: formattedName,
      email: email.trim().toLowerCase(),
      avatar: '🧑‍💻',
      gradeLevel: 'ortaokul',
      role: 'ogrenci',
      xp: 220,
      badges: ['first_step', 'quiz_master'],
    });
    setAuthModalOpen(false);
    showToast(`Tekrar hoş geldiniz, ${formattedName}!`, 'success');
  };

  // Code Verification (Kurumsal / Sınıf Kodu)
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setCodeError('Lütfen kodunuzu giriniz.');
      return;
    }

    // Accept valid test codes or any format
    login({
      id: 'code_' + Date.now(),
      name: codeType === 'institution' ? 'MEB Okul Üyesi' : '8-A Sınıfı Öğrencisi',
      email: `${code.toLowerCase()}@okul.k12.tr`,
      avatar: '🏛️',
      gradeLevel: 'ortaokul',
      role: 'ogrenci',
      schoolLevel: 'ortaokul',
      classGrade: '8. Sınıf',
      xp: 500,
      badges: ['first_step', 'quiz_master', 'math_genius'],
    });
    setAuthModalOpen(false);
    showToast(`"${code}" kodu başarıyla onaylandı! Dersliğe bağlandınız.`, 'reward');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-4 top-4 z-20 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>

        {/* VIEW 1: ROLE SELECTION (Screenshot 3 - derslig.com/uyelik) */}
        {authModalMode === 'role_select' && (
          <div className="p-6 sm:p-10 text-center">
            {/* Top Quick Actions (Kurumsal & Sınıf Kodu) */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <button
                onClick={() => {
                  setCodeType('institution');
                  setAuthModalMode('login'); // or code entry
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-pink-300 hover:bg-pink-50/50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition shadow-2xs"
              >
                <span>🏛️</span>
                <span>Kurumsal Üyeliğim Var</span>
              </button>
              <button
                onClick={() => {
                  setCodeType('class');
                  setAuthModalMode('login');
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-pink-300 hover:bg-pink-50/50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition shadow-2xs"
              >
                <span>🎓</span>
                <span>Sınıf Kodum Var</span>
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              EduWiki'ye <span className="text-pink-600">Üye Ol!</span>
            </h2>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                <span className="bg-white px-4 dark:bg-slate-900 font-semibold">VEYA BİREYSEL KAYIT</span>
              </div>
            </div>

            {/* Two Big Cards: Öğrenciyim & Öğretmenim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              {/* Card 1: Öğrenciyim */}
              <div
                onClick={() => {
                  setSelectedRole('ogrenci');
                  setAuthModalMode('register');
                }}
                className="group relative flex flex-col items-center rounded-3xl border-2 border-slate-200/90 bg-white p-6 shadow-sm hover:border-pink-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-pink-500 cursor-pointer transition-all duration-200"
              >
                <div className="absolute top-4 right-4 rounded-full bg-pink-50 px-2.5 py-1 text-[10px] font-extrabold text-pink-600 uppercase tracking-wider dark:bg-pink-950/50 dark:text-pink-400">
                  ÖĞRENCİ
                </div>

                {/* Circular Visual / Avatar */}
                <div className="relative mt-2 mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500/20 via-rose-500/15 to-amber-500/20 p-1 group-hover:scale-105 transition-transform duration-200">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-pink-500/10 text-5xl">
                    👩‍🎓
                  </div>
                  <span className="absolute bottom-1 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-white shadow-md text-sm">
                    ✨
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition">
                  Öğrenciyim
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                  MEB müfredatına %100 uyumlu tüm dersler, Gemini yapay zeka öğretmeni, 5 soruluk testler, haftalık takvim ve rozetler.
                </p>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition">
                  <span>Öğrenci Olarak Başla</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Card 2: Öğretmenim */}
              <div
                onClick={() => {
                  setSelectedRole('ogretmen');
                  setAuthModalMode('register');
                }}
                className="group relative flex flex-col items-center rounded-3xl border-2 border-slate-200/90 bg-white p-6 shadow-sm hover:border-teal-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-teal-500 cursor-pointer transition-all duration-200"
              >
                <div className="absolute top-4 right-4 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-extrabold text-teal-700 uppercase tracking-wider dark:bg-teal-950/50 dark:text-teal-400">
                  ÖĞRETMEN
                </div>

                {/* Circular Visual / Avatar */}
                <div className="relative mt-2 mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-500/15 to-blue-500/20 p-1 group-hover:scale-105 transition-transform duration-200">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-teal-500/10 text-5xl">
                    👨‍🏫
                  </div>
                  <span className="absolute bottom-1 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white shadow-md text-sm">
                    📚
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                  Öğretmenim
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                  Sınıf yönetimi, otomatik ders materyali ve sınav üretimi, ödev takibi ve zengin MEB kazanım havuzu.
                </p>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition">
                  <span>Öğretmen Olarak Başla</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Bottom link to Login */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Zaten bir hesabınız var mı?{' '}
              <button
                onClick={() => setAuthModalMode('login')}
                className="font-bold text-pink-600 hover:text-pink-700 underline underline-offset-2 ml-1"
              >
                Giriş Yap
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: SPLIT REGISTRATION SCREEN (Screenshot 2 - derslig.com/kayit?ogrenci) */}
        {authModalMode === 'register' && (
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
            {/* Left Brand Panel: Teal / Cyan backdrop with 3D educational graphics */}
            <div className="md:col-span-5 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-teal-400/20 blur-2xl" />

              <div>
                {/* Brand Logo */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 font-black text-lg shadow-md">
                    e
                  </div>
                  <span className="font-extrabold text-2xl tracking-tight">eduwiki</span>
                  <span className="text-xs bg-white/20 text-white font-semibold px-2 py-0.5 rounded-full ml-1">
                    Akademi
                  </span>
                </div>

                {/* 3D Visual Mockup Elements */}
                <div className="relative my-6 py-4 flex justify-center">
                  <div className="relative w-44 h-36 rounded-2xl bg-white/10 border border-white/20 p-3 shadow-xl backdrop-blur-sm flex flex-col items-center justify-center">
                    <span className="text-5xl mb-1">💻</span>
                    <span className="text-xs font-bold text-teal-100">Sanal Sınıf & Gemini</span>
                    <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-md text-base">
                      📐
                    </div>
                    <div className="absolute -bottom-2 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white shadow-md text-base">
                      🌍
                    </div>
                    <div className="absolute -bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-teal-700 shadow-md text-xs font-black">
                      ✏️
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold tracking-tight mb-2">
                  Hoş geldiniz!
                </h3>
                <p className="text-xs text-teal-100 leading-relaxed">
                  Öğrenciler ve veliler, öğretmenler ve yöneticiler EduWiki ailesinde buluşuyor.
                  Eğitim şimdi herkes için mutluluk kaynağı.
                </p>
              </div>

              {/* Fast Demo Buttons */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="text-[11px] font-semibold text-teal-200 mb-2">
                  ⚡ Form doldurmadan tek tıkla test et:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ortaokul')}
                    className="rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-2.5 py-1.5 text-[11px] font-bold text-white transition text-center"
                  >
                    🎒 Zeynep (LGS 8)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ogretmen')}
                    className="rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-2.5 py-1.5 text-[11px] font-bold text-white transition text-center"
                  >
                    👨‍🏫 Selin Öğretmen
                  </button>
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    EduWiki'ye <span className="text-teal-600 dark:text-teal-400">Üye Ol!</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Öğrenci ve öğretmen üyeliği <strong className="text-teal-600 dark:text-teal-400">ücretsizdir</strong>.
                  </p>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google ile devam et</span>
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="bg-white px-3 dark:bg-slate-900">VEYA</span>
                  </div>
                </div>

                {/* Segmented Switch: Öğrenci | Öğretmen */}
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ogrenci')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      selectedRole === 'ogrenci'
                        ? 'bg-white text-teal-700 shadow-xs border border-teal-200 dark:border-transparent dark:bg-teal-900/60 dark:text-teal-200'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    🎓 Öğrenci
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ogretmen')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      selectedRole === 'ogretmen'
                        ? 'bg-white text-teal-700 shadow-xs border border-teal-200 dark:border-transparent dark:bg-teal-900/60 dark:text-teal-200'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    👨‍🏫 Öğretmen
                  </button>
                </div>

                {/* Error Banner */}
                {formError && (
                  <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                    {formError}
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  {/* Okul Düzeyi ve Sınıf Dropdowns */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Okul düzeyi seçin
                      </label>
                      <select
                        value={schoolLevel}
                        onChange={(e) => handleSchoolLevelChange(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <option value="ilkokul">İlkokul (1-4)</option>
                        <option value="ortaokul">Ortaokul (5-8 / LGS)</option>
                        <option value="lise">Lise (9-12 / YKS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        2026-2027 Sınıfınız
                      </label>
                      <select
                        value={classGrade}
                        onChange={(e) => setClassGrade(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {gradeOptions[schoolLevel].map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ad & Soyad */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Ad"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Soyad"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  {/* E-posta */}
                  <div>
                    <input
                      type="email"
                      placeholder="E-posta adresi"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  {/* Şifre ve Tekrar */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="password"
                        placeholder="Şifre (en az 6 hane)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Şifrenizi Tekrar Girin"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>
                  </div>

                  {/* KVKK Onayı */}
                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Kullanım Şartları ve KVKK Aydınlatma Metnini okudum, kabul ediyorum.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition duration-150"
                  >
                    Ücretsiz Üye Ol
                  </button>
                </form>

                {/* Footer Switch */}
                <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  Zaten hesabınız var mı?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Giriş Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SPLIT LOGIN SCREEN (Giriş Yap) */}
        {authModalMode === 'login' && (
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
            {/* Left Brand Panel */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-blue-500/20 blur-2xl" />

              <div>
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-700 font-black text-lg shadow-md">
                    e
                  </div>
                  <span className="font-extrabold text-2xl tracking-tight">eduwiki</span>
                  <span className="text-xs bg-white/20 text-white font-semibold px-2 py-0.5 rounded-full ml-1">
                    Giriş
                  </span>
                </div>

                <div className="my-6 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 border border-white/20 text-4xl shadow-inner mb-3">
                    🚀
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">
                    Tekrar Hoş Geldin!
                  </h3>
                  <p className="text-xs text-blue-100 leading-relaxed max-w-xs mx-auto">
                    Kişisel yapay zeka dersliğin, haftalık çalışma programın ve başarı rozetlerin seni bekliyor.
                  </p>
                </div>
              </div>

              {/* Instant Grade Shortcuts */}
              <div className="border-t border-white/20 pt-4">
                <div className="text-[11px] font-semibold text-blue-200 mb-2">
                  ⚡ Hızlı Demo ile Anında Giriş:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ilkokul')}
                    className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-1.5 text-[11px] font-bold text-white transition text-center"
                  >
                    👶 İlkokul
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ortaokul')}
                    className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-1.5 text-[11px] font-bold text-white transition text-center"
                  >
                    🎒 LGS (8)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('lise')}
                    className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-1.5 text-[11px] font-bold text-white transition text-center"
                  >
                    🎓 YKS (12)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    EduWiki'ye <span className="text-pink-600">Giriş Yap</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Öğrenci veya öğretmen hesabınızla oturum açın.
                  </p>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition mb-4"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google ile Giriş Yap</span>
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="bg-white px-3 dark:bg-slate-900">VEYA E-POSTA İLE</span>
                  </div>
                </div>

                {formError && (
                  <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                    {formError}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      placeholder="adiniz@ornek.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-pink-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Şifre
                      </label>
                      <button
                        type="button"
                        onClick={() => showToast('Şifre sıfırlama bağlantısı e-postanıza gönderildi.', 'info')}
                        className="text-[11px] font-semibold text-pink-600 hover:underline"
                      >
                        Şifremi unuttum?
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-pink-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition"
                  >
                    Giriş Yap
                  </button>
                </form>

                {/* Kurumsal / Sınıf Kodu Toggle */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('role_select')}
                    className="font-semibold text-slate-600 dark:text-slate-400 hover:text-pink-600 flex items-center gap-1"
                  >
                    <span>🏛️</span>
                    <span>Kurumsal / Sınıf Kodu</span>
                  </button>

                  <div className="text-slate-500 dark:text-slate-400">
                    Hesabınız yok mu?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('role_select')}
                      className="font-bold text-pink-600 hover:underline"
                    >
                      Üye Ol
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
