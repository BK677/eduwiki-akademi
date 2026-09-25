import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AIModelType, GradeLevel } from '../../types';
import { checkSystemHealth } from '../../services/geminiService';
import {
  X,
  Sliders,
  Cpu,
  KeyRound,
  Volume2,
  Moon,
  Sun,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Activity,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Leaf
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    selectedModel,
    setSelectedModel,
    gradeLevel,
    setGradeLevel,
    settings,
    updateSettings,
    darkMode,
    toggleDarkMode,
    simplicityMode,
    toggleSimplicityMode,
    showToast,
  } = useApp();

  const [healthStatus, setHealthStatus] = useState<{ status: string; hasKey: boolean; pingMs?: number }>({
    status: 'checking',
    hasKey: true,
  });

  const [apiKeyInput, setApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('gemini_user_api_key') || '';
    } catch {
      return '';
    }
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [keyVerificationMsg, setKeyVerificationMsg] = useState<string | null>(null);

  const [localRate, setLocalRate] = useState(settings.speechRate || 1.0);
  const [localPitch, setLocalPitch] = useState(settings.speechPitch || 1.0);
  const [localAutoSpeak, setLocalAutoSpeak] = useState(settings.autoSpeak);
  const [localContinuous, setLocalContinuous] = useState(settings.continuousVoiceMode);

  // Check backend Gemini API connectivity
  useEffect(() => {
    if (!isSettingsOpen) return;

    let isMounted = true;
    const start = performance.now();
    checkSystemHealth().then((res) => {
      if (isMounted) {
        const pingMs = Math.round(performance.now() - start);
        setHealthStatus({
          status: res.status || 'ok',
          hasKey: res.hasKey ?? true,
          pingMs,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const MODELS: { id: AIModelType; name: string; desc: string; badge: string }[] = [
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      desc: 'En düşük gecikme süresi, anlık sesli ve metin yanıtları için optimize edilmiş ultra hafif model.',
      badge: 'Ultra Hızlı',
    },
    {
      id: 'gemini-3.6-flash-lite',
      name: 'Gemini 3.6 Flash Lite',
      desc: 'Gelişmiş talimat takibi ve kompakt akıl yürütme sağlayan yeni nesil Flash Lite motoru.',
      badge: '3.6 Lite',
    },
    {
      id: 'gemini-3.7-flash-lite',
      name: 'Gemini 3.7 Flash Lite',
      desc: 'Yüksek verim, çoklu bağlam anlama ve akıcı pedagojik anlatım sunan Flash Lite sürümü.',
      badge: '3.7 Lite',
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash (Önerilen)',
      desc: 'Genel derslik, problem çözme, tahta notu çıkarma ve interaktif sohbet için mükemmel denge.',
      badge: 'Standart & Dengeli',
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro Preview',
      desc: 'Karmaşık YKS/LGS problemleri, ileri kodlama ve derin mantıksal ispatlar için güçlü akıl yürütme.',
      badge: 'Derin Akıl Yürütme',
    },
  ];

  const handleTestApiKey = async () => {
    setIsVerifyingKey(true);
    setKeyVerificationMsg(null);
    try {
      if (apiKeyInput.trim()) {
        localStorage.setItem('gemini_user_api_key', apiKeyInput.trim());
      } else {
        localStorage.removeItem('gemini_user_api_key');
      }

      const res = await checkSystemHealth();
      if (res.hasKey) {
        setKeyVerificationMsg('✅ Bağlantı Başarılı: API anahtarı doğrulandı ve aktif!');
        showToast('Gemini API anahtar bağlantısı başarıyla doğrulandı!', 'success');
      } else {
        setKeyVerificationMsg('⚠️ Anahtar doğrulanamadı, lütfen geçerli bir Gemini anahtarı girdiğinizden emin olun.');
      }
    } catch (err: any) {
      setKeyVerificationMsg('❌ Doğrulama hatası: ' + (err?.message || 'Bilinmeyen hata'));
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleSaveSettings = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('gemini_user_api_key', apiKeyInput.trim());
    } else {
      localStorage.removeItem('gemini_user_api_key');
    }

    updateSettings({
      speechRate: localRate,
      speechPitch: localPitch,
      autoSpeak: localAutoSpeak,
      continuousVoiceMode: localContinuous,
      customApiKey: apiKeyInput.trim() || undefined,
    });

    showToast('Tüm ayarlar başarıyla kaydedildi!', 'success');
    setIsSettingsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                EduWiki Akademi & Yapay Zeka Ayarları
              </h2>
              <p className="text-xs text-slate-400">
                Gemini modelleri, API anahtarı, sesli etkileşim ve basitlik modu
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

          {/* Section 1: Custom Gemini API Key */}
          <div className="rounded-2xl border-2 border-indigo-500/30 bg-indigo-50/40 p-4 dark:border-indigo-500/20 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Gemini API Anahtarı
                </span>
              </div>
              <span className="rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5">
                İsteğe Bağlı
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Platformumuzda hazır sistem API anahtarı varsayılan olarak devrededir. Dilerseniz kendi Google AI Studio API anahtarınızı girerek sınırsız kotalı özel erişim kullanabilirsiniz.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy... (Boş bırakırsanız sistem varsayılanını kullanır)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showApiKey ? 'Gizle' : 'Göster'}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={isVerifyingKey}
                className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition shrink-0"
              >
                {isVerifyingKey ? 'Doğrulanıyor...' : 'Doğrula & Test Et'}
              </button>
            </div>

            {keyVerificationMsg && (
              <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                {keyVerificationMsg}
              </p>
            )}
          </div>

          {/* Section 2: Gemini AI Model Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                <Cpu className="h-4 w-4 text-purple-600" />
                <span>Aktif Yapay Zeka Modeli</span>
              </div>
              <span className="text-[11px] text-slate-400">Canlı Değiştirilebilir</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`group cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 shadow-xs dark:border-blue-400 dark:bg-blue-950/40'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {model.name}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {model.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-snug pl-6">
                      {model.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Basitlik Modu (Simple Mode) & Themes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Simplicity Mode Card */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                    <span>Basitlik Modu</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    simplicityMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {simplicityMode ? 'Açık' : 'Kapalı'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Tüm dikkat dağıtıcıları ve kalabalık panelleri gizler, sade ve temiz bir öğrenme alanı sunar.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleSimplicityMode}
                className="mt-3 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition"
              >
                {simplicityMode ? 'Standart Görünüme Geç' : 'Basitlik Modunu Etkinleştir'}
              </button>
            </div>

            {/* Dark Mode Card */}
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {darkMode ? <Moon className="h-4 w-4 text-purple-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                    <span>Arayüz Teması</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {darkMode ? 'Karanlık' : 'Aydınlık'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Göz yormayan koyu renkler veya ferah açık tema arasında tek tıkla geçiş yapın.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition"
              >
                {darkMode ? '☀️ Açık Temaya Geç' : '🌙 Karanlık Temaya Geç'}
              </button>
            </div>
          </div>

          {/* Section 4: Web Speech Voice Controls */}
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                <Volume2 className="h-4 w-4 text-blue-600" />
                <span>Sesli Yanıt ve Konuşma Ayarları</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLocalRate(1.0);
                  setLocalPitch(1.0);
                }}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Sıfırla</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Voice Rate */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Konuşma Hızı</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{localRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.1"
                  value={localRate}
                  onChange={(e) => setLocalRate(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Voice Pitch */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Ses Perdesi (Ton)</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{localPitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.1"
                  value={localPitch}
                  onChange={(e) => setLocalPitch(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Fixed Sticky Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className={`h-2 w-2 rounded-full ${healthStatus.hasKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{healthStatus.hasKey ? 'Yapay zeka servisi hazır' : 'Varsayılan servis devrede'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-extrabold text-white shadow-md hover:bg-blue-700 transition"
            >
              Kaydet & Uygula
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
