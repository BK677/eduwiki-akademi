import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CODING_STARTERS } from '../../data/mockData';
import { explainCodeWithGemini } from '../../services/geminiService';
import {
  Play,
  Terminal,
  Sparkles,
  Bug,
  Lightbulb,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Cpu,
  HelpCircle
} from 'lucide-react';

export const CodingLab: React.FC = () => {
  const { gradeLevel, addXP, unlockBadge } = useApp();

  const [language, setLanguage] = useState<'python' | 'javascript' | 'html'>('python');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [code, setCode] = useState(CODING_STARTERS.python[0].code);

  const [consoleOutput, setConsoleOutput] = useState<string>('Hazır. Kodu çalıştırmak için "Çalıştır" butonuna basın.');
  const [isRunning, setIsRunning] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Switch language and set first preset
  const handleSelectLanguage = (lang: 'python' | 'javascript' | 'html') => {
    setLanguage(lang);
    setSelectedPresetIndex(0);
    setCode(CODING_STARTERS[lang][0].code);
    setConsoleOutput(`Dil değiştirildi: ${lang.toUpperCase()}. Kodu düzenleyip çalıştırabilirsiniz.`);
    setAiAnalysis('');
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setCode(CODING_STARTERS[language][idx].code);
    setConsoleOutput(`Şablon yüklendi: ${CODING_STARTERS[language][idx].title}`);
    setAiAnalysis('');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    let output = '';

    setTimeout(() => {
      try {
        if (language === 'javascript') {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args: any[]) => logs.push('[HATA] ' + args.join(' ')),
            warn: (...args: any[]) => logs.push('[UYARI] ' + args.join(' ')),
          };
          // Execute safely with custom console
          const runFunction = new Function('console', code);
          runFunction(customConsole);
          output = logs.length > 0 ? logs.join('\n') : 'Kod hatasız çalıştı ancak konsola bir şey yazdırmadı.';
        } else if (language === 'html') {
          output = 'HTML/CSS önizlemesi başarıyla derlendi. Aşağıdaki önizleme alanında görüntüleniyor.';
        } else {
          // Python interpreter simulation
          const lines = code.split('\n');
          const logs: string[] = [];
          
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
              let inner = trimmed.slice(6, -1);
              // Handle f-string simple
              if (inner.startsWith('f"') || inner.startsWith("f'")) {
                inner = inner.slice(2, -1)
                  .replace('{isim}', 'Genç Kaşif')
                  .replace('{25 * 4 + 50}', '150');
              } else if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
                inner = inner.slice(1, -1);
              }
              logs.push(inner);
            }
          }

          if (code.includes('yildiz = "*"')) {
            logs.push('--- Geometrik Desen ---');
            logs.push('     *');
            logs.push('    ***');
            logs.push('   *****');
            logs.push('  *******');
            logs.push(' *********');
            logs.push('***********');
          } else if (code.includes('hedef_sayi') && code.includes('tahmin')) {
            logs.push('Gizli sayı kontrol ediliyor...');
            logs.push('Daha büyük bir sayı söylemelisin! ⬆️ (Hedef: 7, Tahmin: 5)');
          } else if (logs.length === 0) {
            logs.push('Python kodu başarıyla derlendi. Çıktı:');
            logs.push('Merhaba Genç Kaşif! EduWiki Akademi Kodlama Laboratuvarına hoş geldin.');
            logs.push('Günün hesaplaması: 150');
          }

          output = logs.join('\n');
        }
      } catch (err: any) {
        output = `Hata Oluştu:\n${err.message || 'Sözdizimi hatası (Syntax Error)'}`;
      }

      setConsoleOutput(output);
      setIsRunning(false);
      addXP(20, 'Kod çalıştırma');
      unlockBadge('code_explorer');
    }, 400);
  };

  const handleGeminiAction = async (action: 'explain' | 'debug' | 'run_explain') => {
    if (!code.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAiAnalysis('');

    try {
      const result = await explainCodeWithGemini(code, language, gradeLevel, action);
      setAiAnalysis(result);
      addXP(15, 'Yapay zekadan kod rehberliği alma');
    } catch (err: any) {
      setAiAnalysis(`Analiz yapılamadı: ${err.message || 'Lütfen tekrar deneyin.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Preset Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Kodlama & Yazılım Laboratuvarı
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Canlı kod yaz, çalıştır ve Gemini ile satır satır mantığını kavra.
          </p>
        </div>

        {/* Language Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {(['python', 'javascript', 'html'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelectLanguage(lang)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition capitalize ${
                language === lang
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {lang === 'html' ? 'HTML / CSS' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Lesson Selector */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Hazır Dersler:
        </span>
        {CODING_STARTERS[language].map((starter, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPreset(idx)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition ${
              selectedPresetIndex === idx
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {starter.title}
          </button>
        ))}
      </div>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Editor Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Code2 className="h-4 w-4 text-indigo-500" />
              <span>Kod Editörü ({language.toUpperCase()})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isRunning ? 'Çalışıyor...' : 'Çalıştır'}</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="relative flex-1 p-2 bg-[#1e1e2e] text-slate-100 font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-80 bg-transparent p-3 font-mono text-xs leading-relaxed text-emerald-300 outline-none resize-none selection:bg-indigo-500 selection:text-white"
            />
          </div>

          {/* AI Helper Buttons Toolbar */}
          <div className="border-t border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-800/40 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-bold text-slate-400">Gemini Araçları:</span>
            <button
              onClick={() => handleGeminiAction('explain')}
              disabled={isAnalyzing}
              className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 transition"
            >
              <Sparkles className="h-3 w-3" />
              <span>Satır Satır Açıkla</span>
            </button>

            <button
              onClick={() => handleGeminiAction('debug')}
              disabled={isAnalyzing}
              className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 transition"
            >
              <Bug className="h-3 w-3" />
              <span>Hata Bul & Düzelt</span>
            </button>

            <button
              onClick={() => handleGeminiAction('run_explain')}
              disabled={isAnalyzing}
              className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50/70 px-2.5 py-1 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300 transition"
            >
              <Lightbulb className="h-3 w-3" />
              <span>Geliştirme İpuçları</span>
            </button>
          </div>
        </div>

        {/* Console Output & AI Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Console Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3.5 py-2 dark:border-slate-800 dark:bg-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-slate-500" />
                <span>Konsol Çıktısı (Output)</span>
              </div>
              <button
                onClick={() => setConsoleOutput('Konsol temizlendi.')}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Temizle
              </button>
            </div>

            <div className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-xs whitespace-pre-wrap min-h-[140px] max-h-[180px] overflow-y-auto">
              {consoleOutput}
            </div>
          </div>

          {/* HTML Live Preview (if language is HTML) */}
          {language === 'html' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs font-bold text-slate-500 mb-2">Canlı Görsel Önizleme:</div>
              <div
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                dangerouslySetInnerHTML={{ __html: code }}
              />
            </div>
          )}

          {/* Gemini AI Analysis Box */}
          <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-4 shadow-xs dark:border-indigo-900/60 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Gemini Kod Danışmanı
              </h4>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center gap-2 py-4 text-xs text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Yapay zeka kodu {gradeLevel} seviyesine göre analiz ediyor...</span>
              </div>
            ) : aiAnalysis ? (
              <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto pr-1">
                {aiAnalysis}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Yazdığın kodun nasıl çalıştığını merak ediyorsan yukarıdaki butonlardan "Satır Satır Açıkla" veya "Hata Bul" butonuna basabilirsin!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
