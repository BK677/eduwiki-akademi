import { Badge, VideoLesson } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_step',
    name: 'İlk Adım',
    description: 'EduWiki Akademi sanal dersliğine ilk kez katıldın!',
    icon: '🚀',
    category: 'general',
  },
  {
    id: 'quiz_master',
    name: '5/5 Şampiyonu',
    description: 'Bir testteki tüm 5 soruyu da eksiksiz doğru bildin.',
    icon: '🏆',
    category: 'quiz',
  },
  {
    id: 'code_explorer',
    name: 'Kod Kaşifi',
    description: 'Kodlama laboratuvarında ilk programını başarıyla çalıştırdın.',
    icon: '💻',
    category: 'coding',
  },
  {
    id: 'math_genius',
    name: 'Matematik Kurdu',
    description: 'Matematik dersinde yapay zeka ile 3 farklı problem çözdün.',
    icon: '📐',
    category: 'lesson',
  },
  {
    id: 'streak_fire',
    name: 'Alevli Seri',
    description: '3 gün üst üste dersliğe katılarak çalışma serisi yakaladın.',
    icon: '🔥',
    category: 'streak',
  },
  {
    id: 'science_whiz',
    name: 'Geleceğin Bilim İnsanı',
    description: 'Fen ve Fizik konularında yapay zeka ile deney simülasyonu yaptın.',
    icon: '🔬',
    category: 'lesson',
  },
  {
    id: 'video_expert',
    name: 'Görsel Öğrenici',
    description: 'YouTube video dersini tamamlayıp notlarını aldın.',
    icon: '🎬',
    category: 'lesson',
  },
  {
    id: 'deep_thinker',
    name: 'Derin Düşünür',
    description: 'Gemini Pro modelini kullanarak ileri düzey bir konuyu sorguladın.',
    icon: '🧠',
    category: 'general',
  },
];

export const CURATED_VIDEOS: VideoLesson[] = [
  // İLKOKUL
  {
    id: 'ilk-mat-1',
    title: 'Eğlenceli Çarpım Tablosu ve Sayıların Dansı',
    subject: 'Matematik',
    gradeLevel: 'ilkokul',
    youtubeId: 'r5R8i3g1_Gg', // Clean educational math video
    duration: '10:15',
    instructor: 'Gülümseyen Öğretmen',
    description: 'İlkokul öğrencileri için ritmik saymalar, çarpma işleminin mantığı ve akılda kalıcı şarkılar.',
    keyPoints: ['2\'şer, 3\'er ve 5\'er ritmik sayma', 'Çarpmanın toplama ile bağı', 'Görsel elma gruplama taktiği'],
  },
  {
    id: 'ilk-fen-1',
    title: 'Güneş Sistemi, Gezegenler ve Uzay Serüveni',
    subject: 'Fen Bilimleri',
    gradeLevel: 'ilkokul',
    youtubeId: 'libKBY5-V2A',
    duration: '08:45',
    instructor: 'Uzay Kaşifi Burak',
    description: 'Dünya, Güneş ve komşumuz gezegenlerin gizemli yolculuğu.',
    keyPoints: ['Güneş sistemindeki 8 gezegen', 'Dünya\'nın kendi etrafında dönmesi', 'Gece ve gündüzün oluşumu'],
  },
  {
    id: 'ilk-kod-1',
    title: 'Çocuklar İçin Algoritma ve Blok Kodlama Temelleri',
    subject: 'Kodlama & Robotik',
    gradeLevel: 'ilkokul',
    youtubeId: 'qYZF6NZv14E',
    duration: '12:20',
    instructor: 'Robotçu Zeynep',
    description: 'Adım adım düşünme, bilgisayara komut verme ve eğlenceli labirent oyunu.',
    keyPoints: ['Algoritma nedir?', 'İleri, sağa, sola dön mantığı', 'Döngülerle dans etme'],
  },

  // ORTAOKUL
  {
    id: 'ort-mat-1',
    title: 'Cebirsel İfadeler ve Denklem Çözme Stratejileri',
    subject: 'Matematik',
    gradeLevel: 'ortaokul',
    youtubeId: 'NybHckSEQBI',
    duration: '15:30',
    instructor: 'Matematik Doktoru',
    description: 'LGS odaklı bilinmeyenlerle tanışma, parantez dağıtımı ve pratik denklem taktikleri.',
    keyPoints: ['Bilinmeyen (x) mantığı', 'Eşitliğin korunumu', 'Yeni nesil LGS modelleme soruları'],
  },
  {
    id: 'ort-fen-1',
    title: 'DNA, Genetik Kod ve Kalıtımın Mucizesi',
    subject: 'Fen Bilimleri',
    gradeLevel: 'ortaokul',
    youtubeId: '8m6hHRlKwxY',
    duration: '14:10',
    instructor: 'Biyoloji Atölyesi',
    description: 'Nükleotidler, gen, kromozom ilişkisi ve çaprazlama teknikleri.',
    keyPoints: ['DNA çift sarmal yapısı', 'A-T ve G-C eşleşmeleri', 'Mendel genetiği ve bezelye deneyleri'],
  },
  {
    id: 'ort-kod-1',
    title: 'Python ile Programlamaya İlk Adım: Değişkenler ve Döngüler',
    subject: 'Kodlama & Robotik',
    gradeLevel: 'ortaokul',
    youtubeId: '_uQrJ0TkZlc',
    duration: '18:40',
    instructor: 'Mühendis Efe',
    description: 'Gerçek bir programlama dili olan Python ile ilk kodları yazma ve çalıştırma.',
    keyPoints: ['print() ve input() kullanımı', 'if - else şart blokları', 'for ve while döngüleri'],
  },

  // LİSE
  {
    id: 'lis-mat-1',
    title: 'Türev Geometrik Yorumu ve Maksimum-Minimum Problemleri',
    subject: 'Matematik',
    gradeLevel: 'lise',
    youtubeId: 'rAof9Ld5sOg',
    duration: '22:15',
    instructor: 'Akademi Matematik',
    description: 'AYT Matematik için teğetin eğimi, artan-azalan aralıklar ve ekstremum noktaları.',
    keyPoints: ['Teğet eğimi ve birinci türev', 'Yerel maksimum ve minimum', 'Optimizasyon soru tipleri'],
  },
  {
    id: 'lis-fiz-1',
    title: 'Newton Hareket Yasaları, Sürtünme ve Dinamik',
    subject: 'Fizik',
    gradeLevel: 'lise',
    youtubeId: 'kKKM8Y-u7ds',
    duration: '19:50',
    instructor: 'Fizik Dehası',
    description: 'Serbest cisim diyagramı, eylemsizlik, etki-tepki ve eğik düzlem dinamik analizleri.',
    keyPoints: ['F = m.a formülü ve vektörel işlem', 'Statik ve kinetik sürtünme', 'Eğik düzlemde kuvvet bileşenleri'],
  },
  {
    id: 'lis-kod-1',
    title: 'Modern Web ve Veri Yapıları: JavaScript & Algoritmalar',
    subject: 'Kodlama & Robotik',
    gradeLevel: 'lise',
    youtubeId: 'W6NZfCO5SIk',
    duration: '25:00',
    instructor: 'Yazılım Mimarı',
    description: 'Diziler, nesneler, fonksiyonlar ve karmaşık problem çözme yaklaşımları.',
    keyPoints: ['Array metodları (map, filter, reduce)', 'Zaman karmaşıklığı (Big O)', 'Etkileşimli DOM manipülasyonu'],
  },
];

export const CODING_STARTERS = {
  python: [
    {
      title: '1. İlk Merhaba ve Matematik',
      description: 'Ekrana yazdırma ve değişkenlerle işlem yapma.',
      code: `# EduWiki Akademi Python Başlangıç
isim = "Genç Kaşif"
puan = 100

print(f"Merhaba {isim}! EduWiki Akademi Kodlama Laboratuvarına hoş geldin.")
print("Günün hesaplaması:", 25 * 4 + 50)
`,
    },
    {
      title: '2. Sayı Tahmin Oyunu Mantığı',
      description: 'Şartlı durumlar (if-elif-else) ile oyun kurma.',
      code: `# Sayı Tahmin Oyunu Simülasyonu
hedef_sayi = 7
tahmin = 5

print("Gizli sayı kontrol ediliyor...")
if tahmin == hedef_sayi:
    print("Tebrikler! Doğru bildin 🎯")
elif tahmin < hedef_sayi:
    print("Daha büyük bir sayı söylemelisin! ⬆️")
else:
    print("Daha küçük bir sayı söylemelisin! ⬇️")
`,
    },
    {
      title: '3. Yıldızlarla Üçgen Çizdirme',
      description: 'For döngüsü ile algoritma ve şekil oluşturma.',
      code: `# Döngülerle Yıldız Deseni
satir_sayisi = 6

print("--- Geometrik Desen ---")
for i in range(1, satir_sayisi + 1):
    bosluk = " " * (satir_sayisi - i)
    yildiz = "*" * (2 * i - 1)
    print(bosluk + yildiz)
`,
    },
  ],
  javascript: [
    {
      title: '1. Konsola Mesaj ve Dizi İşlemleri',
      description: 'JavaScript temel sözdizimi ve dizi filtreleme.',
      code: `// EduWiki Akademi JavaScript Laboratuvarı
const ogrenci = "EduWiki Öğrencisi";
const notlar = [85, 92, 78, 96, 65];

const yuksekNotlar = notlar.filter(notDegeri => notDegeri >= 80);
const ortalama = notlar.reduce((toplam, n) => toplam + n, 0) / notlar.length;

console.log("Öğrenci:", ogrenci);
console.log("80 ve üzeri notlar:", yuksekNotlar);
console.log("Genel Ortalama:", ortalama.toFixed(1));
`,
    },
    {
      title: '2. Asal Sayı Bulucu Fonksiyon',
      description: 'Fonksiyonlar ve algoritmik asal kontrolü.',
      code: `function asalMi(sayi) {
  if (sayi <= 1) return false;
  for (let i = 2; i <= Math.sqrt(sayi); i++) {
    if (sayi % i === 0) return false;
  }
  return true;
}

const testSayilari = [2, 7, 10, 13, 21, 29, 35, 47];
testSayilari.forEach(sayi => {
  console.log(sayi + " asal mı? -> " + (asalMi(sayi) ? "EVET ✅" : "HAYIR ❌"));
});
`,
    },
  ],
  html: [
    {
      title: '1. İnteraktif Kart Tasarımı',
      description: 'HTML ve CSS ile modern bir öğrenci kartı.',
      code: `<div style="padding: 24px; background: linear-gradient(135deg, #4f46e5, #9333ea); border-radius: 16px; color: white; font-family: sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
  <h2 style="margin: 0 0 8px 0; font-size: 22px;">🚀 EduWiki Akademi Öğrenci Rozeti</h2>
  <p style="margin: 0 0 16px 0; opacity: 0.9;">Geleceğin Yazılımcısı - Başarı Sertifikası</p>
  <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
    <strong>Kazanılan Puan:</strong> 500 XP | <strong>Seviye:</strong> 5
  </div>
</div>
`,
    },
  ],
};

export const LEADERBOARD = [
  { id: '1', name: 'Zeynep Kaya', xp: 2450, grade: 'Ortaokul', avatar: '👩‍🎓', streak: 12 },
  { id: '2', name: 'Emir Demir', xp: 2180, grade: 'Lise', avatar: '👨‍🔬', streak: 9 },
  { id: '3', name: 'Elif Yılmaz', xp: 1950, grade: 'İlkokul', avatar: '👧', streak: 14 },
  { id: '4', name: 'Burak Aksoy', xp: 1720, grade: 'Lise', avatar: '🧑‍💻', streak: 6 },
  { id: '5', name: 'Deniz Şahin', xp: 1540, grade: 'Ortaokul', avatar: '👦', streak: 8 },
];
