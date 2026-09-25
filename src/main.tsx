import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silently intercept any benign preview WebSocket disconnection notifications
if (typeof window !== 'undefined') {
  const isWsError = (msg: unknown) => {
    if (!msg) return false;
    const str = String(msg).toLowerCase();
    return str.includes('websocket') || str.includes('failed to connect') || str.includes('ws:');
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = (reason && (reason.message || reason.stack || String(reason))) || '';
    if (isWsError(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (isWsError(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });

  // Filter console.error for harmless dev WebSocket notices
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const combined = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    if (isWsError(combined)) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
console.log('🚀 EduWiki Akademi başarıyla yüklendi!, EduWiki Akedemi ye hoş geldiniz');
