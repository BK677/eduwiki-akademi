import { AIModelType, GradeLevel, Quiz } from '../types';

export interface ChatResponse {
  text: string;
  boardContent?: string;
  modelUsed: string;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  try {
    const customKey = localStorage.getItem('gemini_user_api_key');
    if (customKey && customKey.trim()) {
      headers['x-gemini-api-key'] = customKey.trim();
    }
  } catch {
    // Ignore localStorage errors
  }
  return headers;
}

export async function askGeminiTeacher(
  message: string,
  history: { role: string; content: string }[],
  gradeLevel: GradeLevel,
  subject: string,
  model: AIModelType
): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, history, gradeLevel, subject, model }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Sunucu hatası (${res.status})`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('askGeminiTeacher error:', error);
    throw error;
  }
}

export async function generateGeminiQuiz(
  subject: string,
  topic: string,
  gradeLevel: GradeLevel,
  model: AIModelType
): Promise<Quiz> {
  try {
    const res = await fetch('/api/gemini/generate-quiz', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ subject, topic, gradeLevel, model }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Test oluşturulamadı (${res.status})`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('generateGeminiQuiz error:', error);
    throw error;
  }
}

export async function explainCodeWithGemini(
  code: string,
  language: string,
  gradeLevel: GradeLevel,
  action: 'explain' | 'debug' | 'run_explain'
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/explain-code', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, language, gradeLevel, action }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Kod açıklanamadı');
    }

    const data = await res.json();
    return data.result || 'Açıklama alınamadı.';
  } catch (error: any) {
    console.error('explainCodeWithGemini error:', error);
    throw error;
  }
}

export async function askVideoQuestion(
  videoTitle: string,
  videoTopic: string,
  question: string,
  gradeLevel: GradeLevel
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/ask-video', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ videoTitle, videoTopic, question, gradeLevel }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Video sorusu yanıtlanamadı');
    }

    const data = await res.json();
    return data.answer || 'Cevap alınamadı.';
  } catch (error: any) {
    console.error('askVideoQuestion error:', error);
    throw error;
  }
}

export async function generateWeeklySchedule(
  gradeLevel: GradeLevel,
  focusArea: string,
  model: AIModelType
) {
  try {
    const res = await fetch('/api/gemini/generate-schedule', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ gradeLevel, focusArea, model }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Ders programı oluşturulamadı');
    }

    return await res.json();
  } catch (error: any) {
    console.error('generateWeeklySchedule error:', error);
    throw error;
  }
}

export async function generateSummaryWithFlashcards(
  subject: string,
  topic: string,
  gradeLevel: GradeLevel
) {
  try {
    const res = await fetch('/api/gemini/generate-summary', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ subject, topic, gradeLevel }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Özet oluşturulamadı');
    }

    return await res.json();
  } catch (error: any) {
    console.error('generateSummaryWithFlashcards error:', error);
    throw error;
  }
}

export async function checkSystemHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { status: 'error', hasKey: false };
    return await res.json();
  } catch {
    return { status: 'offline', hasKey: false };
  }
}

export async function askMaarif5Coach(
  subject: string,
  unitTitle: string,
  userQuestion: string,
  model: AIModelType = 'gemini-3.8-flash'
): Promise<ChatResponse> {
  const customMessage = `[Türkiye Yüzyılı Maarif Modeli - 5. Sınıf ${subject} Dersi, "${unitTitle}" Ünitesi]\nSoru / İstek: ${userQuestion}\nLütfen MEB Türkiye Yüzyılı Maarif Modeli 5. sınıf kazanımlarına tam uyumlu, 10-11 yaşındaki bir 5. sınıf öğrencisinin anlayacağı samimi, cesaretlendirici, net, adım adım pedagojik bir dille yanıtla. Sonuna pratik bir tahta özeti [TAHTA]...[/TAHTA] ekle.`;
  return askGeminiTeacher(customMessage, [], 'ortaokul', subject, model);
}

export async function generateGeminiArticle(
  topic: string,
  category: string,
  gradeLevel: GradeLevel = 'ortaokul',
  model: AIModelType = 'gemini-3.8-flash'
) {
  try {
    const res = await fetch('/api/gemini/generate-article', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, category, gradeLevel, model }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Makale oluşturulamadı');
    }

    return await res.json();
  } catch (error: any) {
    console.error('generateGeminiArticle error:', error);
    throw error;
  }
}


