import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get or initialize GoogleGenAI client
function getAIClient(customKey?: string) {
  const apiKey = (customKey && customKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY tanımlı değil. Lütfen Ayarlar menüsünden API anahtarınızı girin.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractApiKey(req: express.Request): string | undefined {
  const headerKey = req.headers['x-gemini-api-key'];
  if (typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim();
  }
  if (req.body && typeof req.body.apiKey === 'string' && req.body.apiKey.trim()) {
    return req.body.apiKey.trim();
  }
  return undefined;
}

// Grade level instruction helpers
function getGradeSystemInstruction(gradeLevel: string, subject?: string) {
  let tone = `Sen Ortaokul 5. Sınıf (Türkiye Yüzyılı Maarif Modeli) öğrencileri için harika, motive edici, anlayışlı, sabırlı ve akıcı bir yapay zekâ öğretmenisin.
- 5. sınıf seviyesine uygun, açık ve teşvik edici bir Türkçe kullan.
- Konuları günlük yaşam örnekleriyle, analitik ve eğlenceli şekilde açıkla.
- MEB Maarif Modeli kazanımlarına ve soru çözüm adımlarına özen göster.
- Yanıtının sonunda öğrencinin karatahtasında özet olarak görünmesi için MUTLAKA şu kalıpta bir tahta notu ekle:
[TAHTA]
📌 5. Sınıf Konu Özeti: ...
💡 Püf Noktası / Akılda Tut: ...
⚡ Örnek / Çözüm Adımı: ...
[/TAHTA]`;

  return `${tone}\nBranş / Konu: ${subject || '5. Sınıf Genel Derslik'}. Türkçe dilinde yanıt ver.`;
}

// Resilient Fallback Generators for 5. Sınıf Maarif Modeli
function getFallbackChatAnswer(message: string, subject: string = 'Genel'): { text: string; boardContent: string; modelUsed: string } {
  const cleanMsg = message.toLowerCase();
  let mainText = `Harika bir soru sordun! 5. Sınıf ${subject} dersinde bu konuyu adım adım öğrenelim. 

Konuyu kavramak için temel ilkeleri anlamak çok önemlidir. Bilgiyi günlük hayattaki karşılığıyla ilişkilendirdiğinde çok daha kalıcı hale gelecektir. Soru çözerken önce verilenleri ve istenenleri net bir şekilde belirlemeli, ardından uygun formül veya kuralı adım adım uygulamalısın.`;

  let boardContent = `📌 5. Sınıf ${subject} Özeti:\n- Verilenleri dikkatle oku ve not al.\n- Temel kavram ve kuralları adım adım uygula.\n💡 Püf Noktası: Sorularda çeldiricilere dikkat et, sağlamasını yap!`;

  if (cleanMsg.includes('kesir') || cleanMsg.includes('sayı') || cleanMsg.includes('matematik')) {
    mainText = `5. Sınıf Matematik dersinde doğal sayılar, basamak değerleri ve kesirler çok temel konulardır. Kesirlerle toplama veya çıkarma yaparken paydaların eşit olması gerektiğini unutmuyoruz. Eşit değilse genişletme veya sadeleştirme yöntemini kullanırız.`;
    boardContent = `📌 Matematik 5. Sınıf Püf Noktaları:\n1. Kesirlerde payda eşitliği şarttır.\n2. Ondalık gösterimde virgülün yeri basamağı belirler.\n3. Problem çözerken plan yap ve sonucu kontrol et.`;
  } else if (cleanMsg.includes('güneş') || cleanMsg.includes('ay') || cleanMsg.includes('dünya') || cleanMsg.includes('fen')) {
    mainText = `5. Sınıf Fen Bilimleri 1. Ünitemiz olan 'Güneş, Dünya ve Ay' konusunda gök cisimlerinin özellikleri incelenir. Güneş orta büyüklükte bir yıldızdır, Ay ise Dünya'mızın tek doğal uydusudur ve yaklaşık 29.5 günde evrelerini tamamlar.`;
    boardContent = `📌 Fen Bilimleri: Güneş, Dünya ve Ay:\n- Güneş: Gazlardan oluşur, ısı ve ışık kaynağımızdır.\n- Ay'ın Evreleri: Yeni ay, İlk dördün, Dolunay, Son dördün.\n💡 Unutma: Ay'da atmosfer yok denecek kadar azdır!`;
  } else if (cleanMsg.includes('kod') || cleanMsg.includes('algoritma') || cleanMsg.includes('bilişim') || cleanMsg.includes('python')) {
    mainText = `5. Sınıf Bilişim Teknolojileri ve Yazılım dersinde algoritmik düşünme, problemleri adım adım küçük parçalara ayırarak çözmektir. Bir algoritma her zaman 'Başla' ile başlar ve net adımlardan sonra 'Bitir' ile sonlanır.`;
    boardContent = `📌 Bilişim & Algoritma:\n1. Başla -> Adımları Sırala -> Bitir\n2. Döngüler: Tekrarlayan işlemleri kolaylaştırır.\n💡 Koşul (Eğer): Belirli bir şarta göre farklı yollar seçer.`;
  }

  return {
    text: mainText,
    boardContent,
    modelUsed: 'Maarif-5-Akıllı-Motor (Dahili)',
  };
}

function getFallbackQuiz(subject: string = 'Matematik', topic: string = 'Genel Tekrar') {
  return {
    title: `5. Sınıf ${subject} - ${topic} Kazanım Testi`,
    topic: topic,
    gradeLevel: '5. Sınıf (Maarif Modeli)',
    questions: [
      {
        id: 1,
        question: `5. Sınıf ${subject} dersinde "${topic}" konusuyla ilgili aşağıdakilerden hangisi doğrudur?`,
        options: [
          'Kavramın tanımı ve temel özellikleri doğru kavranmalıdır.',
          'Konuyla ilgili yalnızca tek bir soru tipi vardır.',
          'Formül ve kurallar rastgele uygulanabilir.',
          'Verilen bilgileri kontrol etmeye gerek yoktur.'
        ],
        correctAnswer: 0,
        explanation: 'Maarif modeline göre kavramların temel mantığını kavramak ve bilgiyi doğru analiz etmek esastır.',
        hint: 'Kavramsal anlama ve analiz her zaman en doğru yaklaşımdır.'
      },
      {
        id: 2,
        question: `Bir öğrenci ${topic} konusunda problem çözerken ilk olarak hangi adımı uygulamalıdır?`,
        options: [
          'Doğrudan seçenekleri tahmin etmek',
          'Sorudaki verilenleri ve istenenleri dikkatlice belirlemek',
          'Soruyu okumadan çözüme geçmek',
          'İşlemleri kafadan rastgele yapmak'
        ],
        correctAnswer: 1,
        explanation: 'Problem çözme sürecinde ilk aşama soruyu anlamak ve verilenler ile isteneni belirlemektir.',
        hint: 'Verilenler ve istenenler çözüme giden ilk yoldur.'
      },
      {
        id: 3,
        question: `Aşağıdakilerden hangisi 5. Sınıf Maarif Modeli kapsamında hedeflenen öğrenme becerilerinden biridir?`,
        options: [
          'Ezberci yaklaşım sergilemek',
          'Eleştirel ve analitik düşünerek çözüm üretmek',
          'Yalnızca teorik bilgiyi tekrarlamak',
          'Sorulardan kaçınmak'
        ],
        correctAnswer: 1,
        explanation: 'Yeni Maarif Modeli, öğrencilerin eleştirel, analitik ve beceri temelli öğrenmesini hedefler.',
        hint: 'Düşünme ve problem çözme becerisi ön plandadır.'
      },
      {
        id: 4,
        question: `${subject} dersinde başarılı olmak ve konuları kalıcı öğrenmek için en etkili yöntem hangisidir?`,
        options: [
          'Düzenli tekrar yapmak ve soru çözerek pratik yapmak',
          'Sınavdan bir gün önce ezberlemek',
          'Anlaşılmayan yerleri sormaktan çekinmek',
          'Ders notu tutmamak'
        ],
        correctAnswer: 0,
        explanation: 'Düzenli tekrar ve aşamalı soru çözümü bilgilerin uzun süreli belleğe aktarılmasını sağlar.',
        hint: 'Süreklilik ve pratik başarıyı getirir.'
      },
      {
        id: 5,
        question: `Aşağıdakilerden hangisi ${subject} - ${topic} konusunda dikkat edilmesi gereken bir püf noktasıdır?`,
        options: [
          'İşlem basamaklarını kontrol ederek sağlamasını yapmak',
          'Birimlere ve soru köküne dikkat etmemek',
          'Hızlı bitirmek için soruları yarım okumak',
          'Soru kökündeki olumsuz ifadelere bakmamak'
        ],
        correctAnswer: 0,
        explanation: 'İşlem basamaklarını takip etmek ve sağlama yapmak hata payını sıfıra indirir.',
        hint: 'Sağlama yapmak ve işlem kontrolü en büyük yardımcındır.'
      }
    ]
  };
}

// Supported Gemini Models (Configured according to @google/genai guidelines)
const ALLOWED_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.6-flash-lite',
  'gemini-3.7-flash-lite',
  'gemini-3.1-pro-preview',
];

const MODEL_MAPPING: Record<string, string[]> = {
  'gemini-3.8-flash': ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'],
  'gemini-3.1-flash-lite': ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'],
  'gemini-3.6-flash-lite': ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'],
  'gemini-3.7-flash-lite': ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'],
  'gemini-3.1-pro-preview': ['gemini-3.1-pro-preview', 'gemini-3.8-flash', 'gemini-flash-latest'],
};

async function executeGeminiWithFallback(ai: any, requestedModel: string, config: any) {
  const candidates = MODEL_MAPPING[requestedModel] || [requestedModel, 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  const sequence = Array.from(new Set([...candidates, 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite']));

  let lastError: any = null;
  for (const m of sequence) {
    try {
      const response = await ai.models.generateContent({
        ...config,
        model: m,
      });
      return { response, modelUsed: m };
    } catch (err: any) {
      // If 503 (model overloaded / high demand), log concisely without spamming
      const is503 = err?.status === 503 || (err?.message && err.message.includes('503'));
      if (!is503) {
        console.warn(`Model ${m} call notice (${err?.status || err?.message || 'unavailable'}), trying alternative...`);
      }
      lastError = err;
    }
  }
  throw lastError;
}

// 1. Health check & status
app.get('/api/health', (req, res) => {
  const customKey = req.headers['x-gemini-api-key'] as string;
  const hasKey = !!(customKey || process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasKey,
    availableModels: ALLOWED_GEMINI_MODELS,
    timestamp: new Date().toISOString(),
  });
});

// 2. Chat / Live Classroom Interaction
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history, gradeLevel = 'ortaokul', subject = 'Genel', model = 'gemini-3.8-flash' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mesaj boş olamaz.' });
  }

  try {
    const ai = getAIClient(extractApiKey(req));
    const systemInstruction = getGradeSystemInstruction(gradeLevel, subject);

    // Format chat contents
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-8)) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const { response, modelUsed } = await executeGeminiWithFallback(ai, model, {
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'Üzgünüm, şu anda yanıt oluşturulamadı.';
    
    // Extract blackboard content if present
    let boardContent = '';
    let mainText = replyText;
    const boardMatch = replyText.match(/\[TAHTA\]([\s\S]*?)\[\/TAHTA\]/);
    if (boardMatch) {
      boardContent = boardMatch[1].trim();
      mainText = replyText.replace(/\[TAHTA\][\s\S]*?\[\/TAHTA\]/, '').trim();
    }

    return res.json({
      text: mainText,
      boardContent,
      modelUsed,
    });
  } catch (error: any) {
    const is503 = error?.status === 503 || (error?.message && error.message.includes('503'));
    if (!is503) {
      console.warn('Gemini chat request using local Maarif pedagogical fallback engine:', error?.message);
    }
    const fallback = getFallbackChatAnswer(message, subject);
    return res.json(fallback);
  }
});

// 3. Automated 5-Question Quiz Generator
app.post('/api/gemini/generate-quiz', async (req, res) => {
  const { subject = 'Matematik', topic = 'Genel Konular', gradeLevel = 'ortaokul', model = 'gemini-3.8-flash' } = req.body;

  try {
    const ai = getAIClient(extractApiKey(req));

    const prompt = `Lütfen 5. Sınıf (Türkiye Yüzyılı Maarif Modeli) seviyesine uygun, "${subject}" dersi ve "${topic}" konusunda TAM OLARAK 5 soruluk çoktan seçmeli bir test hazırla.
    Her soru için 4 seçenek (A, B, C, D) ve doğru seçeneğin indeksini (0=A, 1=B, 2=C, 3=D) belirt.
    Ayrıca her soru için kısa bir ipucu ve sorunun detaylı Türkçe çözüm açıklamasını ekle.`;

    const { response } = await executeGeminiWithFallback(ai, model, {
      contents: prompt,
      config: {
        systemInstruction: `Sen uzman bir 5. sınıf ölçme ve değerlendirme uzmanısın. JSON formatında 5 soruluk test oluştur.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Test başlığı' },
            topic: { type: Type.STRING, description: 'Konu adı' },
            gradeLevel: { type: Type.STRING, description: 'Sınıf seviyesi' },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING, description: 'Soru metni' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '4 seçenek (A, B, C, D)',
                  },
                  correctAnswer: {
                    type: Type.INTEGER,
                    description: 'Doğru seçeneğin indeksi: 0, 1, 2 veya 3',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Detaylı çözüm ve açıklama',
                  },
                  hint: {
                    type: Type.STRING,
                    description: 'Öğrenciye takıldığı an verilecek küçük ipucu',
                  },
                },
                required: ['id', 'question', 'options', 'correctAnswer', 'explanation', 'hint'],
              },
            },
          },
          required: ['title', 'topic', 'gradeLevel', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Quiz generation fallback triggered:', error?.message);
    return res.json(getFallbackQuiz(subject, topic));
  }
});

// 3b. Interactive Weekly Study Schedule Generator
app.post('/api/gemini/generate-schedule', async (req, res) => {
  const { gradeLevel = 'ortaokul', focusArea = 'Genel Dengeli', model = 'gemini-3.8-flash' } = req.body;
  try {
    const ai = getAIClient(extractApiKey(req));

    const prompt = `5. Sınıf (Türkiye Yüzyılı Maarif Modeli) öğrencisi için haftalık (Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar) ders çalışma programı oluştur.
Odak alanı: "${focusArea}".
Haftanın her günü için 1 veya 2 adet dengeli çalışma görevi planla.`;

    const { response } = await executeGeminiWithFallback(ai, model, {
      contents: prompt,
      config: {
        systemInstruction: `Sen uzman bir 5. sınıf eğitim ve rehberlik danışmanısın. Öğrencilerin sınıf düzeylerine uygun haftalık ders programları hazırlarsın.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklyGoal: { type: Type.STRING, description: 'Haftalık temel hedef' },
            advice: { type: Type.STRING, description: 'Öğrenciye rehberlik tavsiyesi' },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  day: { type: Type.STRING },
                  timeSlot: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  durationMinutes: { type: Type.INTEGER },
                },
                required: ['id', 'day', 'timeSlot', 'subject', 'topic', 'durationMinutes'],
              },
            },
          },
          required: ['weeklyGoal', 'advice', 'tasks'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Schedule generation fallback:', error?.message);
    return res.json({
      weeklyGoal: '5. Sınıf Maarif Modeli Temel Konularında Başarı ve Düzenli Tekrar',
      advice: 'Günde 40-45 dakikalık odaklanma blokları ile çalışıp 10 dakika mola vermek en yüksek verimi sağlar.',
      tasks: [
        { id: 'fb_1', day: 'Pazartesi', timeSlot: '17:00 - 17:45', subject: 'Matematik', topic: 'Doğal Sayılar ve Milyonlar', durationMinutes: 45 },
        { id: 'fb_2', day: 'Salı', timeSlot: '17:00 - 17:45', subject: 'Fen Bilimleri', topic: 'Güneş, Dünya ve Ay Evreleri', durationMinutes: 45 },
        { id: 'fb_3', day: 'Çarşamba', timeSlot: '17:00 - 17:45', subject: 'Türkçe & Edebiyat', topic: 'Sözcükte Anlam ve Okuma Becerisi', durationMinutes: 45 },
        { id: 'fb_4', day: 'Perşembe', timeSlot: '17:00 - 17:45', subject: 'Sosyal Bilgiler & Tarih', topic: 'Birlikte Yaşamak ve Çocuk Hakları', durationMinutes: 45 },
        { id: 'fb_5', day: 'Cuma', timeSlot: '17:00 - 17:45', subject: 'İngilizce', topic: 'Unit 1: Hello & School Subjects', durationMinutes: 45 },
        { id: 'fb_6', day: 'Cumartesi', timeSlot: '11:00 - 12:00', subject: 'Kodlama & Robotik', topic: 'Algoritma ve Blok Tabanlı Kodlama', durationMinutes: 60 },
        { id: 'fb_7', day: 'Pazar', timeSlot: '14:00 - 15:00', subject: 'Matematik', topic: 'Haftalık Konu Tekrarı ve MEB Denemesi', durationMinutes: 60 }
      ]
    });
  }
});

// 4. Code Explanation, Debugging & Simulation
app.post('/api/gemini/explain-code', async (req, res) => {
  const { code = '', language = 'python', gradeLevel = 'ortaokul', action = 'explain', model = 'gemini-3.8-flash' } = req.body;
  try {
    const ai = getAIClient(extractApiKey(req));

    let instruction = '';
    if (action === 'debug') {
      instruction = `Bu ${language} kodundaki hataları veya geliştirilebilecek yerleri bul, düzeltilmiş halini ver ve 5. sınıf seviyesindeki bir öğrencinin kolayca anlayacağı şekilde açıkla.`;
    } else if (action === 'run_explain') {
      instruction = `Bu ${language} kodunun adım adım nasıl çalıştığını simüle et, beklenen çıktısını göster ve 5. sınıf öğrencisi için kod satırlarının mantığını açıkla.`;
    } else {
      instruction = `Bu ${language} kodunun ne yaptığını, hangi mantıkla çalıştığını 5. sınıf seviyesinde pedagojik bir dille açıkla.`;
    }

    const { response } = await executeGeminiWithFallback(ai, model, {
      contents: `${instruction}\n\nKod:\n\`\`\`${language}\n${code}\n\`\`\``,
      config: {
        systemInstruction: `Sen 5. sınıf öğrencilerine kodlamayı sevdiren çok cana yakın bir yazılım ve bilişim teknolojileri öğretmenisin.`,
      },
    });

    return res.json({ result: response.text });
  } catch (error: any) {
    console.warn('Code explain fallback:', error?.message);
    return res.json({
      result: `🚀 **5. Sınıf Kod İncelemesi:**\n\nBu kod bloğu, bilgisayara adım adım komut vermeyi sağlar. Kodlama yaparken adımların sırası (algoritma), değişken tanımları ve koşullar (if/else) çok önemlidir.\n\n💡 **İpucu:** Kodunu çalıştırırken syntax (yazım kuralları) ve girintilere (indentation) dikkat etmeyi unutma!`
    });
  }
});

// 5. Video Q&A / Video Concept Summary
app.post('/api/gemini/ask-video', async (req, res) => {
  const { videoTitle = 'Ders Videosu', videoTopic = 'Konu', question = '', gradeLevel = 'ortaokul', model = 'gemini-3.8-flash' } = req.body;
  try {
    const ai = getAIClient(extractApiKey(req));

    const { response } = await executeGeminiWithFallback(ai, model, {
      contents: `Video Başlığı: "${videoTitle}"\nVideo Konusu: "${videoTopic}"\nÖğrenci Sorusu: "${question}"\n\nBu video dersi kapsamında öğrencinin sorusunu 5. sınıf seviyesine uygun şekilde açıkla.`,
      config: {
        systemInstruction: `Sen 5. sınıf video dersin yardımcı öğretmenisin. Öğrencinin sorusunu net ve öğretici biçimde yanıtla.`,
      },
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.warn('Video Q&A fallback:', error?.message);
    return res.json({
      answer: `Harika bir soru! "${videoTitle}" konulu 5. sınıf dersinde bu kavram çok önemlidir. Konuyu tam oturtmak için videodaki ilgili bölüme tekrar göz atabilir ve konu sonundaki özet notlarını inceleyebilirsin.`
    });
  }
});

// 6. Smart Summary & Flashcards Generator
app.post('/api/gemini/generate-summary', async (req, res) => {
  const { subject = 'Matematik', topic = 'Genel', gradeLevel = 'ortaokul', model = 'gemini-3.8-flash' } = req.body;
  try {
    const ai = getAIClient(extractApiKey(req));

    const { response } = await executeGeminiWithFallback(ai, model, {
      contents: `5. Sınıf seviyesinde "${subject}" dersi, "${topic}" konusu için konu özeti, 5 flashcard ve hafıza çivisi hazırla.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING, description: 'Soru veya Terim' },
                  back: { type: Type.STRING, description: 'Cevap veya Tanım' },
                },
                required: ['front', 'back'],
              },
            },
            memoryTip: { type: Type.STRING, description: 'Hafıza çivisi veya püf nokta' },
          },
          required: ['title', 'summary', 'keyPoints', 'flashcards', 'memoryTip'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.json(data);
  } catch (error: any) {
    console.warn('Summary fallback:', error?.message);
    return res.json({
      title: `5. Sınıf ${subject} - ${topic}`,
      summary: `5. Sınıf ${subject} dersinde ${topic} konusu, temel kavramlar ve beceri temelli sorular açısından kritik önem taşır. Konuyla ilgili formül ve kuralları günlük hayat örnekleriyle pekiştirmek kalıcılığı artırır.`,
      keyPoints: [
        'Konuyla ilgili temel kavramları ve tanımları öğren.',
        'Soru çözerken verilenleri ve istenenleri listele.',
        'Hata yaptığın soruların çözümlerini dikkatle incele.'
      ],
      flashcards: [
        { front: `${topic} Temel Kuralı Nedir?`, back: 'Adım adım planlı işlem yapmak ve sağlama yapmaktır.' },
        { front: 'Problem çözerken ilk adım?', back: 'Soruyu dikkatlice okuyup verilenleri ve isteneni belirlemektir.' }
      ],
      memoryTip: 'Kavram haritası çıkararak görsel hafızanı güçlendirebilirsin!'
    });
  }
});

function getFallbackArticle(topic: string, category: string = 'Verimli Çalışma') {
  return {
    title: `${topic}: Başarıya Götüren Stratejiler ve Altın Kurallar`,
    subtitle: `Öğrencilerin ${category} alanında en yüksek verimi elde etmesi için adım adım rehber.`,
    category: category,
    readTime: '4 dk',
    summary: `${topic} konusu, MEB kazanımları ve sınav başarısı açısından kritik bir öneme sahiptir. Düzenli planlama ve doğru tekniklerle bu alandaki hakimiyetinizi katlayabilirsiniz.`,
    content: `## ${topic} Konusunu Neden Önceliklendirmeliyiz?

Eğitim yolculuğunda hedeflere ulaşmak, sadece çok çalışmakla değil; doğru yöntemlerle **akılcı çalışmakla** mümkündür. "${topic}" konusu da tam olarak bu stratejinin merkezinde yer alır.

---

## 3 Aşamalı Başarı Planı

### 1. Temel Kavramları Netleştirin
Konuyla ilgili temel terimleri ve kuralları öğrenmeden soru çözmeye geçmeyin. Önce konunun büyük resmini (haritasını) çıkarın.

### 2. Adım Adım Problem Çözümü ve Geri Bildirim
- İlk soruları çözerken ipuçlarından yararlanabilirsiniz.
- Yanlış yaptığınız soruları asla geçmeyin; hatanızın işlem hatası mı yoksa kavram eksikliği mi olduğunu tespit edin.

### 3. Aralıklı Tekrar ve Sınav Simülasyonu
Bilgiyi uzun süreli belleğe aktarmak için 24 saat sonra 10 dakikalık hızlı bir özet tekrarı yapın ve kendi kendinize anlatın.

---

## Sonuç ve Motivasyon

Başarı bir gecede elde edilen bir tesadüf değil, her gün sabırla atılan küçük adımların birikimidir. EduWiki araçları ve haftalık planlayıcınızla bu adımları takip etmeye devam edin!`,
    keyTakeaways: [
      'Konunun mantığını kavramadan soru ezberlemeye çalışmayın.',
      'Yanlış yapılan sorular başarıya giden en değerli kılavuzdur.',
      'Günlük 40 dakikalık odaklanmış çalışma, verimsiz saatlerden çok daha etkilidir.'
    ],
    proTip: 'Ders çalışırken yanınızda sadece ilgili dersin materyali olsun; masadaki görsel fazlalık dikkat dağınıklığını tetikler.',
    tags: [category, topic, 'Maarif Modeli', 'Başarı Rehberi']
  };
}

// 7. Educational Article Generator
app.post('/api/gemini/generate-article', async (req, res) => {
  const { topic = 'Verimli Ders Çalışma', category = 'Verimli Çalışma', gradeLevel = 'ortaokul', model = 'gemini-3.8-flash' } = req.body;
  try {
    const ai = getAIClient(extractApiKey(req));

    const prompt = `5. - 8. Sınıf veya lise düzeyindeki Türk öğrenciler için "${topic}" konusunda, "${category}" kategorisinde ilham verici, kanıtlanmış, pedagojik ve sürükleyici bir eğitim makalesi yaz.
    Makale başlığı ilgi çekici olsun.
    İçerik giriş, 3-4 alt başlık, madde işaretleri, somut taktikler ve günlük hayat örnekleri içermeli.
    Ayrıca öğrencinin aklında kalacak 3 ana çıkarım (keyTakeaways) ve 1 uzman püf noktası (proTip) ile 3-4 etiket (tags) ekle.`;

    const { response } = await executeGeminiWithFallback(ai, model, {
      contents: prompt,
      config: {
        systemInstruction: `Sen Türkiye'nin en seçkin eğitim uzmanı, pedagoji danışmanı ve öğrenci koçusun. Türkçe dilinde samimi, motive edici ve yapılandırılmış eğitim içerikleri üretirsin.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            category: { type: Type.STRING },
            readTime: { type: Type.STRING, description: 'Örn: 4 dk' },
            summary: { type: Type.STRING, description: '2 cümlelik çarpıcı özet' },
            content: { type: Type.STRING, description: 'Markdown formatında tam makale metni' },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            proTip: { type: Type.STRING, description: 'Uzman altın öğüdü' },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'subtitle', 'category', 'readTime', 'summary', 'content', 'keyTakeaways', 'proTip', 'tags'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Article generation fallback:', error?.message);
    return res.json(getFallbackArticle(topic, category));
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`EduWiki Akademi server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
