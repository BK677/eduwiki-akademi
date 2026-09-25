import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Download,
  Palette,
  Sparkles
} from 'lucide-react';

export const DrawingBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  const COLORS = [
    { name: 'Beyaz Tebeşir', hex: '#ffffff' },
    { name: 'Sarı', hex: '#fde047' },
    { name: 'Cam Göbeği', hex: '#38bdf8' },
    { name: 'Yeşil', hex: '#4ade80' },
    { name: 'Pembe', hex: '#f472b6' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark chalkboard green background
      ctx.fillStyle = '#1b3426';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle chalk guidelines
      ctx.strokeStyle = '#234433';
      ctx.lineWidth = 1;
      for (let y = 40; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#1b3426' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1b3426';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw guidelines
    ctx.strokeStyle = '#234433';
    ctx.lineWidth = 1;
    for (let y = 40; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `novaders-tahta-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Whiteboard Controls */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        {/* Tool selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              tool === 'pen'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Tebeşir</span>
          </button>

          <button
            onClick={() => setTool('eraser')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              tool === 'eraser'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Eraser className="h-3.5 w-3.5" />
            <span>Silgi</span>
          </button>

          {/* Color Palettes */}
          {tool === 'pen' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    color === c.hex ? 'scale-125 border-blue-500 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* Brush Thickness */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
            {[2, 4, 8].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center transition ${
                  brushSize === size
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {size === 2 ? 'İnce' : size === 4 ? 'Orta' : 'Kalın'}
              </button>
            ))}
          </div>
        </div>

        {/* Board Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Temizle</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Çizimi İndir</span>
          </button>
        </div>
      </div>

      {/* Canvas Board */}
      <div className="rounded-3xl border-8 border-amber-950/80 bg-[#1b3426] shadow-2xl overflow-hidden touch-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="block w-full"
        />
      </div>
    </div>
  );
};
