// Türkiye Yüzyılı Maarif Modeli - 5. Sınıf Müfredat ve İçerik Veritabanı
export interface Maarif5Topic {
  title: string;
  subtopics: string[];
}

export interface Maarif5ExamQuestion {
  id: number;
  question: string;
  type: 'coktan_secmeli' | 'acik_uclu';
  options?: string[];
  correctAnswer: number | string;
  solution: string;
  points: number;
  kazanimKodu: string;
}

export interface Maarif5Unit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  semester: 1 | 2;
  topics: Maarif5Topic[];
  kazanimlar: string[];
  video: {
    title: string;
    youtubeId: string;
    duration: string;
    instructor: string;
    summary: string;
  };
  quiz: {
    title: string;
    questions: {
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      hint: string;
    }[];
  };
  flashcards: {
    term: string;
    definition: string;
  }[];
  aiStudyPrompts: string[];
}

export interface Maarif5Subject {
  id: string;
  name: string;
  slug: string;
  icon: string;
  themeColor: {
    primary: string;
    bg: string;
    border: string;
    badge: string;
    accent: string;
  };
  description: string;
  mebWeeklyHours: number;
  totalUnitsCount: number;
  units: Maarif5Unit[];
  termExams: {
    id: string;
    title: string;
    term: '1. Dönem 1. Yazılı' | '1. Dönem 2. Yazılı' | '2. Dönem 1. Yazılı' | '2. Dönem 2. Yazılı';
    scenario: string; // MEB 1. / 2. Senaryo uyumlu
    durationMinutes: number;
    totalPoints: number;
    questions: Maarif5ExamQuestion[];
  }[];
}

export const MAARIF_5_SUBJECTS: Maarif5Subject[] = [
  // 1. MATEMATİK
  {
    id: 'matematik',
    name: 'Matematik',
    slug: 'matematik-5',
    icon: '📐',
    themeColor: {
      primary: 'from-blue-600 to-indigo-600',
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-600 text-white',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    description: 'Doğal sayılar, kesirler, ondalık gösterim, yüzdeler, temel geometri ve veri analizi.',
    mebWeeklyHours: 5,
    totalUnitsCount: 6,
    units: [
      {
        id: 'mat-u1',
        unitNumber: 1,
        title: 'Doğal Sayılar ve Doğal Sayılarla İşlemler',
        description: 'Milyonlu basamaklar, bölük kavramı, zihinden işlemler, üslü ifadeler (karesi ve küpü), parantezli işlemler ve dört işlem problemleri.',
        semester: 1,
        topics: [
          {
            title: 'Milyonlar ve Bölükler',
            subtopics: ['9 basamağa kadar sayıların okunuşu', 'Birler, binler ve milyonlar bölüğü', 'Basamak ve basamak değeri farkı']
          },
          {
            title: 'Örüntüler ve Sayı İlişkileri',
            subtopics: ['Belirli bir kurala göre artan örüntüler', 'Eksik terimi bulma ve sonraki adımı tahmin etme']
          },
          {
            title: 'Doğal Sayılarla Dört İşlem & Zihinden İşlem',
            subtopics: ['Eldenli toplama ve onluk bozmalı çıkarma', 'Çarpma ve bölme algoritmaları', 'Tahmin etme stratejileri (yuvarlama)']
          },
          {
            title: 'Üslü İfadeler & Parantezli İşlemler',
            subtopics: ['Bir doğal sayının karesi (a²)', 'Bir doğal sayının küpü (a³)', 'İşlem önceliği ve parantezin rolü']
          }
        ],
        kazanimlar: [
          'MAT.5.1.1. En çok dokuz basamaklı doğal sayıları okur, yazar ve bölük basamak ilişkisini kurar.',
          'MAT.5.1.2. Kuralı verilen sayı ve şekil örüntülerinin istenen adımlarını belirler.',
          'MAT.5.1.3. Doğal sayılarla dört işlem yapar ve günlük hayat problemlerini çözüp modeller.',
          'MAT.5.1.4. Bir doğal sayının karesini ve küpünü üslü ifade olarak gösterir ve değerini hesaplar.'
        ],
        video: {
          title: '5. Sınıf Matematik - Doğal Sayılar ve Milyonlar Konu Anlatımı',
          youtubeId: 'NZQCvqCBt5g',
          duration: '18:40',
          instructor: 'Mehmet Hoca (MEB Maarif Modeli)',
          summary: 'Bölükler ayrımı, basamak değerinin hesaplanışı ve milyonlu sayıları hatasız okuma taktikleri.'
        },
        quiz: {
          title: 'Doğal Sayılar & İşlem Önceliği Tarama Testi',
          questions: [
            {
              id: 1,
              question: '"45 082 309" sayısının milyonlar bölüğündeki sayı ile birler bölüğündeki sayının toplamı kaçtır?',
              options: ['354', '391', '427', '309'],
              correctAnswer: 0,
              explanation: 'Milyonlar bölüğü: 45, Birler bölüğü: 309. Toplam: 45 + 309 = 354.',
              hint: 'Bölükler sağdan sola üçerli ayrılır: Birler (309), Binler (082), Milyonlar (45).'
            },
            {
              id: 2,
              question: '4³ - 3² işleminin sonucu kaçtır?',
              options: ['48', '55', '57', '61'],
              correctAnswer: 1,
              explanation: '4³ = 4 × 4 × 4 = 64. 3² = 3 × 3 = 9. 64 - 9 = 55.',
              hint: 'Bir sayının küpü o sayının 3 kere, karesi ise 2 kere kendisiyle çarpımıdır.'
            },
            {
              id: 3,
              question: '12 + 8 × (15 - 5) işleminin sonucu kaçtır?',
              options: ['92', '200', '132', '80'],
              correctAnswer: 0,
              explanation: 'Önce parantez içi: 15 - 5 = 10. Sonra çarpma: 8 × 10 = 80. Sonra toplama: 12 + 80 = 92.',
              hint: 'İşlem sırası: 1. Parantez içi, 2. Çarpma/Bölme, 3. Toplama/Çıkarma.'
            }
          ]
        },
        flashcards: [
          { term: 'Bölük', definition: 'Büyük sayıları kolay okumak için sağdan sola doğru üçerli ayrılan basamak grupları (Birler, Binler, Milyonlar).' },
          { term: 'Basamak Değeri', definition: 'Bir rakamın bulunduğu basamağa göre aldığı değer (Örn: On milyonlar basamağındaki 3 sayısı 30.000.000 değerindedir).' },
          { term: 'Sayının Karesi', definition: 'Bir sayının kendisi ile iki kez çarpılmasıdır (5² = 5 × 5 = 25).' },
          { term: 'Sayının Küpü', definition: 'Bir sayının kendisi ile üç kez çarpılmasıdır (2³ = 2 × 2 × 2 = 8).' }
        ],
        aiStudyPrompts: [
          '5. sınıf öğrencisiyim, bana milyonlu sayıları okumak için eğlenceli bir tekerleme yaz.',
          'İşlem önceliğinde parantezin mantığını günlük hayattan bir örnekle anlat.',
          '5. sınıf doğal sayılarla problem çözme konusunda bana bir soru sor ve cevabımı kontrol et.'
        ]
      },
      {
        id: 'mat-u2',
        unitNumber: 2,
        title: 'Kesirler ve Kesirlerle İşlemler',
        description: 'Birim kesirler, tam sayılı ve bileşik kesirler, denk kesirler, genişletme-sadeleştirme, sıralama, kesirlerle toplama ve çıkarma.',
        semester: 1,
        topics: [
          {
            title: 'Kesir Türleri & Sayı Doğrusu',
            subtopics: ['Birim kesirlerin karşılaştırılması', 'Bileşik kesri tam sayılı kesre çevirme', 'Sayı doğrusunda kesirleri gösterme']
          },
          {
            title: 'Denk Kesirler & Sıralama',
            subtopics: ['Sadeleştirme ve genişletme', 'Paydaları eşitleyerek sıralama', 'Yarıma ve bütüne yakınlık stratejisi']
          },
          {
            title: 'Kesirlerle Toplama ve Çıkarma',
            subtopics: ['Paydaları eşit kesirlerde işlemler', 'Paydaları birbirinin katı olan kesirlerde payda eşitleme', 'Bir doğal sayı ile kesri toplama/çıkarma']
          }
        ],
        kazanimlar: [
          'MAT.5.1.5. Birim kesirleri sayı doğrusunda gösterir ve sıralar.',
          'MAT.5.1.6. Tam sayılı kesrin, bir doğal sayı ile bir basit kesrin toplamı olduğunu anlar ve bileşik kesre dönüştürür.',
          'MAT.5.1.7. Sadeleştirme ve genişletmenin kesrin değerini değiştirmediğini anlar ve denk kesirler oluşturur.',
          'MAT.5.1.8. Paydaları eşit veya birbiri katı olan kesirlerle toplama ve çıkarma işlemi yapar.'
        ],
        video: {
          title: '5. Sınıf Kesirler - Tam Sayılı, Bileşik Kesir ve Toplama',
          youtubeId: 'Ml3Jd7L1C-U',
          duration: '16:15',
          instructor: 'Zehra Öğretmen (MEB Maarif)',
          summary: 'Pizza dilimleri ile kesir modelleri, payda eşitleme ve tam sayılı kesirlerde pratik işlem yöntemleri.'
        },
        quiz: {
          title: 'Kesirler Kavram ve İşlem Testi',
          questions: [
            {
              id: 1,
              question: '17/5 bileşik kesri tam sayılı kesir olarak nasıl yazılır?',
              options: ['3 tam 2/5', '2 tam 3/5', '3 tam 1/5', '4 tam 1/5'],
              correctAnswer: 0,
              explanation: '17 ÷ 5 = 3 (kalan 2). Bölüm tam kısım (3), kalan pay (2), bölen payda (5) olur: 3 tam 2/5.',
              hint: 'Payı paydaya böl: Bölüm tam kısım, kalan yeni paydır.'
            },
            {
              id: 2,
              question: '2/3 + 1/6 işleminin sonucu kaçtır?',
              options: ['3/9', '5/6', '4/6', '1 tam'],
              correctAnswer: 1,
              explanation: '2/3 kesrini 2 ile genişletiriz: 4/6. 4/6 + 1/6 = 5/6.',
              hint: 'Paydaları eşitlemek için 2/3 kesrini 2 ile çarp.'
            }
          ]
        },
        flashcards: [
          { term: 'Birim Kesir', definition: 'Payı daima 1 olan kesirlerdir (Örn: 1/4, 1/7, 1/12).' },
          { term: 'Denk Kesir', definition: 'Aynı miktarı temsil eden, genişletilerek veya sadeleştirilerek elde edilen kesirlerdir (2/4 = 1/2).' },
          { term: 'Bileşik Kesir', definition: 'Payı paydasına eşit veya paydasından büyük olan kesirlerdir (7/5, 4/4).' }
        ],
        aiStudyPrompts: [
          'Kesirlerde payda eşitlemeyi bana pasta dilimi benzetmesiyle anlat.',
          'Denk kesirler konusunda 5. sınıf seviyesinde 3 problem örneği ver.'
        ]
      },
      {
        id: 'mat-u3',
        unitNumber: 3,
        title: 'Ondalık Gösterim ve Yüzdeler',
        description: 'Paydası 10, 100, 1000 olan kesirlerin ondalık yazılışı, basamak adları, virgüllü toplama-çıkarma ve % yüzde sembolü.',
        semester: 1,
        topics: [
          {
            title: 'Ondalık Gösterim',
            subtopics: ['Onda birler, yüzde birler ve binde birler basamağı', 'Sayı doğrusunda gösterme ve sıralama']
          },
          {
            title: 'Ondalık Gösterimlerle Toplama ve Çıkarma',
            subtopics: ['Virgülleri alt alta getirme kuralı', 'Boş basamaklara 0 yazma ve günlük hayat para problemleri']
          },
          {
            title: 'Yüzdeler (%)',
            subtopics: ['Paydası 100 olan kesirleri % ile gösterme', 'Kesir, ondalık ve yüzde dönüşümleri', 'Bir çokluğun yüzdesini bulma']
          }
        ],
        kazanimlar: [
          'MAT.5.1.9. Paydası 10, 100 veya 1000 olan kesirleri ondalık gösterimle yazar ve okur.',
          'MAT.5.1.10. Ondalık gösterimde basamak değerlerini belirler ve sayı doğrusunda sıralar.',
          'MAT.5.1.11. Paydası 100 olan kesirleri yüzde sembolü (%) ile gösterir.',
          'MAT.5.1.12. Bir bütünün kesir, ondalık gösterim ve yüzde ile ifade edilişini birbiriyle ilişkilendirir.'
        ],
        video: {
          title: '5. Sınıf Ondalık Gösterim & Yüzdeler Konu Anlatımı',
          youtubeId: 'A6Fzr71tGKs',
          duration: '15:20',
          instructor: 'Buket Hoca (Maarif Modeli)',
          summary: 'Virgüllü sayılarda toplama çıkarma püf noktaları, yüzde hesaplama taktikleri.'
        },
        quiz: {
          title: 'Ondalık ve Yüzde Hızlı Tarama',
          questions: [
            {
              id: 1,
              question: '3/4 kesrinin yüzde (%) olarak gösterimi hangisidir?',
              options: ['%34', '%40', '%75', '%80'],
              correctAnswer: 2,
              explanation: '3/4 kesrini 25 ile genişletiriz: (3×25)/(4×25) = 75/100 = %75.',
              hint: 'Paydayı 100 yapmak için hem payı hem paydayı 25 ile çarp.'
            },
            {
              id: 2,
              question: '4,75 + 2,6 işleminin sonucu kaçtır?',
              options: ['7,35', '7,15', '6,35', '7,81'],
              correctAnswer: 0,
              explanation: 'Virgüller alt alta getirilir: 4,75 + 2,60 = 7,35.',
              hint: '2,6 sayısının sonuna 0 ekleyerek 2,60 yapıp topla.'
            }
          ]
        },
        flashcards: [
          { term: 'Onda Birler Basamağı', definition: 'Virgülden sonraki ilk basamaktır. Değeri 0,1 ile çarpılarak bulunur.' },
          { term: 'Yüzde (%)', definition: 'Bir bütünü 100 eş parçaya böldüğümüzde kaç parçasını aldığımızı gösteren sembol.' }
        ],
        aiStudyPrompts: [
          'Markette %20 indirim gördüğümde fiyatı kafadan nasıl hesaplarım?',
          'Kesir, ondalık ve yüzde üçlüsünü özetleyen renkli bir tablo oluştur.'
        ]
      },
      {
        id: 'mat-u4',
        unitNumber: 4,
        title: 'Temel Geometrik Kavramlar ve Çizimler',
        description: 'Nokta, doğru, doğru parçası, ışın, paralel ve dik doğrular, dar-dik-geniş-doğru açılar, çokgenler ve üçgen çeşitleri.',
        semester: 2,
        topics: [
          {
            title: 'Doğru, Işın ve Doğru Parçası',
            subtopics: ['Gösterim sembolleri [AB], [AB, AB', 'Doğruların birbirine göre durumları (paralel, kesişen, dik)']
          },
          {
            title: 'Açılar',
            subtopics: ['Dar açı (<90°), Dik açı (90°), Geniş açı (>90°), Doğru açı (180°)', 'Açı ölçme ve iletki (açıölçer) kullanımı']
          },
          {
            title: 'Çokgenler & Üçgenler',
            subtopics: ['Çokgenlerin kenar, köşe ve köşegen özellikleri', 'Açılarına göre üçgenler (dar, dik, geniş açılı)', 'Kenarlarına göre üçgenler (eşkenar, ikizkenar, çeşitkenar)', 'Üçgenin ve dörtgenin iç açıları toplamı']
          }
        ],
        kazanimlar: [
          'MAT.5.2.1. Doğru, doğru parçası ve ışını açıklar ve sembolle gösterir.',
          'MAT.5.2.2. Bir doğruya dışındaki veya üzerindeki bir noktadan dikme çizer ve paralel doğrular oluşturur.',
          'MAT.5.2.3. Açıları dik, dar, geniş ve doğru açı olarak sınıflandırır.',
          'MAT.5.2.4. Üçgen ve dörtgenlerin iç açılarının ölçüleri toplamını belirler ve verilmeyen açıyı bulur.'
        ],
        video: {
          title: '5. Sınıf Geometri - Temel Kavramlar, Açılar ve Üçgenler',
          youtubeId: 'WE0eWUSRuK8',
          duration: '17:50',
          instructor: 'Selim Hoca',
          summary: 'Açı çeşitleri, iletki kullanımı ve üçgende iç açılar toplamı (180°) soru çözümleri.'
        },
        quiz: {
          title: 'Geometri ve Açılar Testi',
          questions: [
            {
              id: 1,
              question: 'Bir üçgenin iki iç açısı 65° ve 45° olduğuna göre üçüncü iç açısı kaç derecedir?',
              options: ['60°', '70°', '80°', '90°'],
              correctAnswer: 1,
              explanation: 'Üçgenin iç açıları toplamı 180° dir. 65 + 45 = 110°. 180 - 110 = 70°.',
              hint: 'Herhangi bir üçgenin tüm iç açılarının toplamı daima 180° eder.'
            },
            {
              id: 2,
              question: 'Başlangıç noktası belli olup diğer ucu sonsuza giden geometrik şekle ne ad verilir?',
              options: ['Doğru parçası', 'Doğru', 'Işın', 'Açı'],
              correctAnswer: 2,
              explanation: 'Işın (örneğin fener ışığı veya Güneş ışını) tek yönde sonsuza uzar ve [AB şeklinde gösterilir.',
              hint: 'Güneş ışınlarını düşün: Güneş başlangıç noktasıdır, ışık uzaya sonsuz yayılır.'
            }
          ]
        },
        flashcards: [
          { term: 'Işın', definition: 'Başlangıç noktası sabit olup diğer yönde sonsuza uzayan düz çizgi (Örn: [AB).' },
          { term: 'Eşkenar Üçgen', definition: 'Tüm kenar uzunlukları eşit ve tüm iç açıları 60° olan üçgen.' },
          { term: 'İç Açı Toplamı', definition: 'Üçgende iç açılar toplamı 180°, dörtgende ise 360° dir.' }
        ],
        aiStudyPrompts: [
          'Üçgen çeşitlerini hem kenarlarına hem açılarına göre karşılaştırmalı anlat.',
          'Bana 5. sınıf üçgende verilmeyen açıyı bulma ile ilgili bir problem üret.'
        ]
      },
      {
        id: 'mat-u5',
        unitNumber: 5,
        title: 'Veri İşleme ve Analiz',
        description: 'Araştırma soruları üretme, veri toplama, sıklık tablosu, çetele tablosu ve sütun grafiği çizip yorumlama.',
        semester: 2,
        topics: [
          {
            title: 'Araştırma Soruları & Tablolar',
            subtopics: ['Uygun araştırma sorusu oluşturma', 'Verileri çetele ve sıklık tablosunda düzenleme']
          },
          {
            title: 'Sütun Grafiği',
            subtopics: ['Yatay ve dikey eksenleri adlandırma', 'Sütun grafiğini doğru ölçekle çizme ve verileri yorumlama']
          }
        ],
        kazanimlar: [
          'MAT.5.2.5. Bir veri grubuna yönelik araştırma soruları üretir ve veri toplar.',
          'MAT.5.2.6. Toplanan verileri sıklık tablosu ve sütun grafiği ile gösterir ve yorumlar.'
        ],
        video: {
          title: '5. Sınıf Veri Toplama, Sıklık Tablosu ve Sütun Grafiği',
          youtubeId: '7S8ZXeii_cU',
          duration: '13:40',
          instructor: 'Mehmet Hoca',
          summary: 'Grafik okuma, en çok ve en az değerleri analiz etme teknikleri.'
        },
        quiz: {
          title: 'Veri ve Grafik Okuma Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisi uygun bir araştırma sorusudur?',
              options: [
                'Ayşe en çok hangi rengi sever?',
                'Okulumuz 5. sınıf öğrencilerinin en sevdiği spor dalı hangisidir?',
                'Benim yaşım kaçtır?',
                'Ankara Türkiye\'nin başkenti midir?'
              ],
              correctAnswer: 1,
              explanation: 'Araştırma sorusu tek bir kişiye değil, bir gruba yönelik olmalı ve birden fazla farklı veri üretmelidir.',
              hint: 'Tek bir cevabı olan sorular değil, bir gruptan çeşitlilik toplayan soru araştırma sorusudur.'
            }
          ]
        },
        flashcards: [
          { term: 'Sıklık Tablosu', definition: 'Verilerin sayılarla gösterildiği tablodur.' },
          { term: 'Çetele Tablosu', definition: 'Verilerin beşli çizgi gruplarıyla tutulduğu tablodur.' }
        ],
        aiStudyPrompts: [
          'Okulumuzdaki geri dönüşüm bilincini ölçmek için 3 tane iyi araştırma sorusu öner.'
        ]
      },
      {
        id: 'mat-u6',
        unitNumber: 6,
        title: 'Uzunluk ve Zaman Ölçme & Alan',
        description: 'Metre, kilometre, santimetre ve milimetre dönüşümleri; çevre uzunluğu; saat, dakika, saniye hesaplamaları ve dikdörtgenin alanı.',
        semester: 2,
        topics: [
          {
            title: 'Uzunluk Ölçüleri',
            subtopics: ['km, m, dm, cm, mm basamak basamak dönüşümleri', 'Gerçek hayat çevre hesaplamaları']
          },
          {
            title: 'Zaman Ölçüleri',
            subtopics: ['Saat-dakika-saniye dönüşümleri', 'Yıl, ay, hafta, gün ilişkisi', 'Süre hesaplama problemleri']
          },
          {
            title: 'Alan Ölçme',
            subtopics: ['Birimkarelerle alan bulma', 'Dikdörtgen ve karenin alanı (kısa kenar × uzun kenar)']
          }
        ],
        kazanimlar: [
          'MAT.5.2.7. Uzunluk ölçme birimlerini birbirine dönüştürür ve çevre problemlerini çözer.',
          'MAT.5.2.8. Zaman ölçme birimlerini birbiriyle ilişkilendirir ve geçen süreyi hesaplar.',
          'MAT.5.2.9. Dikdörtgenin alanını bağıntı kullanarak hesaplar ve santimetrekare / metrekare ile ifade eder.'
        ],
        video: {
          title: '5. Sınıf Uzunluk ve Zaman Ölçme - Alan Hesaplama',
          youtubeId: 'E4NTUyDAoVg',
          duration: '16:00',
          instructor: 'Buket Hoca',
          summary: 'Birim dönüşümleri merdiveni ve dikdörtgenin alanı formülü.'
        },
        quiz: {
          title: 'Ölçme & Alan Tarama Testi',
          questions: [
            {
              id: 1,
              question: 'Kısa kenarı 6 cm, uzun kenarı 10 cm olan dikdörtgenin alanı kaç cm² dir?',
              options: ['32', '60', '16', '120'],
              correctAnswer: 1,
              explanation: 'Dikdörtgenin alanı = Kısa kenar × Uzun kenar = 6 × 10 = 60 cm².',
              hint: 'Çevre değil alan soruluyor: İki kenarı birbiriyle çarp.'
            }
          ]
        },
        flashcards: [
          { term: 'Dikdörtgenin Alanı', definition: 'Kısa kenar ile uzun kenarın çarpımıdır (A = a × b).' },
          { term: 'Çevre', definition: 'Bir geometrik şeklin tüm dış kenarlarının toplam uzunluğudur.' }
        ],
        aiStudyPrompts: [
          'Uzunluk ölçüleri basamaklarını aklımda tutmam için pratik bir yöntem anlat.'
        ]
      }
    ],
    termExams: [
      {
        id: 'mat-exam-1',
        title: '5. Sınıf Matematik 1. Dönem 1. Yazılı Sınavı',
        term: '1. Dönem 1. Yazılı',
        scenario: 'MEB 1. Senaryo (Açık Uçlu ve Çözüm Aşamalı Sorular)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: '"78 205 019" doğal sayısının okunuşunu yazınız ve binler bölüğündeki sayının basamak değerleri toplamını belirtiniz.',
            type: 'acik_uclu',
            correctAnswer: 'Yetmiş sekiz milyon iki yüz beş bin on dokuz. Binler bölüğü değeri: 205 000.',
            solution: 'Okunuşu: Yetmiş sekiz milyon iki yüz beş bin on dokuz. Binler bölüğündeki sayı 205 tir, basamak değeri 205.000 dir.',
            points: 20,
            kazanimKodu: 'MAT.5.1.1'
          },
          {
            id: 2,
            question: '5³ + 4² - 3³ işleminin sonucunu işlem adımlarını göstererek bulunuz.',
            type: 'acik_uclu',
            correctAnswer: '114',
            solution: '5³ = 125. 4² = 16. 3³ = 27. 125 + 16 = 141. 141 - 27 = 114.',
            points: 20,
            kazanimKodu: 'MAT.5.1.4'
          },
          {
            id: 3,
            question: 'Bir okul gezisine katılan 380 öğrenci için 24 kişilik servis araçları kiralanacaktır. Tüm öğrencilerin gidebilmesi için en az kaç servis aracı gerekir?',
            type: 'acik_uclu',
            correctAnswer: '16 servis aracı',
            solution: '380 ÷ 24 = 15 (kalan 20). 15 araç dolar, kalan 20 öğrenci için de 1 araç gerekir: 15 + 1 = 16 araç.',
            points: 20,
            kazanimKodu: 'MAT.5.1.3'
          },
          {
            id: 4,
            question: '23/4 bileşik kesrini tam sayılı kesre çevirip sayı doğrusunda hangi iki ardışık doğal sayı arasında olduğunu yazınız.',
            type: 'acik_uclu',
            correctAnswer: '5 tam 3/4. 5 ile 6 arasındadır.',
            solution: '23 ÷ 4 = 5 tam (kalan 3) -> 5 tam 3/4. Bu kesir 5 ile 6 doğal sayıları arasındadır.',
            points: 20,
            kazanimKodu: 'MAT.5.1.6'
          },
          {
            id: 5,
            question: '3/5 + 7/15 işlemini paydaları eşitleyerek çözünüz.',
            type: 'acik_uclu',
            correctAnswer: '16/15 (veya 1 tam 1/15)',
            solution: '3/5 kesri 3 ile genişletilir: 9/15. 9/15 + 7/15 = 16/15 = 1 tam 1/15.',
            points: 20,
            kazanimKodu: 'MAT.5.1.8'
          }
        ]
      },
      {
        id: 'mat-exam-2',
        title: '5. Sınıf Matematik 1. Dönem 2. Yazılı Sınavı',
        term: '1. Dönem 2. Yazılı',
        scenario: 'MEB 2. Senaryo (Ortak Sınav Formatı)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: 'Bir kırtasiyeci 120 TL olan bir kitabın %25 indirimli fiyatını kaç TL olarak satar?',
            type: 'acik_uclu',
            correctAnswer: '90 TL',
            solution: '%25 = 1/4 demektir. 120 ÷ 4 = 30 TL indirim. 120 - 30 = 90 TL.',
            points: 25,
            kazanimKodu: 'MAT.5.1.12'
          },
          {
            id: 2,
            question: '14,8 - 6,35 işlemini virgüle dikkat ederek çözünüz.',
            type: 'acik_uclu',
            correctAnswer: '8,45',
            solution: '14,80 - 6,35 = 8,45.',
            points: 25,
            kazanimKodu: 'MAT.5.1.10'
          },
          {
            id: 3,
            question: '3 tam 1/2 kesri ile 2 tam 1/4 kesrinin toplamı kaçtır?',
            type: 'acik_uclu',
            correctAnswer: '5 tam 3/4 (veya 23/4)',
            solution: 'Tam kısımlar: 3 + 2 = 5. Kesirler: 1/2 (2 ile genişletilir 2/4) + 1/4 = 3/4. Toplam: 5 tam 3/4.',
            points: 25,
            kazanimKodu: 'MAT.5.1.8'
          },
          {
            id: 4,
            question: '4/25 kesrinin ondalık gösterimini ve yüzde sembolüyle yazılışını gösteriniz.',
            type: 'acik_uclu',
            correctAnswer: 'Ondalık: 0,16. Yüzde: %16.',
            solution: '4/25 kesrini 4 ile genişletiriz: 16/100 -> 0,16 -> %16.',
            points: 25,
            kazanimKodu: 'MAT.5.1.11'
          }
        ]
      }
    ]
  },

  // 2. FEN BİLİMLERİ
  {
    id: 'fen-bilimleri',
    name: 'Fen Bilimleri',
    slug: 'fen-bilimleri-5',
    icon: '🔬',
    themeColor: {
      primary: 'from-emerald-600 to-teal-600',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-600 text-white',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    description: 'Güneş, Dünya ve Ay; Canlılar Dünyası; Kuvvetin Ölçülmesi; Madde ve Değişim; Işığın Yayılması; Elektrik Devreleri.',
    mebWeeklyHours: 4,
    totalUnitsCount: 7,
    units: [
      {
        id: 'fen-u1',
        unitNumber: 1,
        title: 'Güneş, Dünya ve Ay',
        description: 'Güneş’in yapısı ve özellikleri, Ay’ın yapısı ve evreleri (Yeniay, İlkdördün, Dolunay, Sondördün), Güneş-Dünya-Ay hareketleri.',
        semester: 1,
        topics: [
          {
            title: 'Güneş’in Yapısı ve Özellikleri',
            subtopics: ['Güneş’in gaz yapısı (Hidrojen & Helyum)', 'Güneş lekeleri ve kendi etrafında dönme hareketi (batıdan doğuya)']
          },
          {
            title: 'Ay’ın Yapısı ve Özellikleri',
            subtopics: ['Ay’ın atmosferi (yok denecek kadar ince)', 'Kraterler ve yüzey şekilleri', 'Gece-gündüz sıcaklık farkının aşırı yüksek olması']
          },
          {
            title: 'Ay’ın Evreleri & Hareketleri',
            subtopics: ['Ana evreler: Yeniay, İlk Dördün, Dolunay, Son Dördün', 'Ara evreler: Hilal, Şişkin Ay', 'Ay’ın kendi etrafında ve Dünya etrafında dönme süresinin eşit olması (~29.5 gün) ve hep aynı yüzünü görmemiz']
          }
        ],
        kazanimlar: [
          'FEN.5.1.1.1. Güneş’in yapısı ve dönme hareketini açıklar.',
          'FEN.5.1.2.1. Ay’ın özelliklerini, atmosfer durumunu ve yüzey şekillerini açıklar.',
          'FEN.5.1.3.1. Ay’ın ana ve ara evrelerini model üzerinde gösterir ve takvimle ilişkilendirir.',
          'FEN.5.1.4.1. Güneş, Dünya ve Ay’ın birbirine göre hareketlerini temsil eden bir model tasarlar.'
        ],
        video: {
          title: '5. Sınıf Fen Bilimleri - Güneş, Dünya ve Ay Evreleri',
          youtubeId: 'UIuqgb6YUjE',
          duration: '14:30',
          instructor: 'Elif Öğretmen (MEB Maarif)',
          summary: 'Ay’ın ana evreleri neden oluşur? Neden Ay’ın hep aynı yüzünü görürüz?'
        },
        quiz: {
          title: 'Güneş, Dünya ve Ay Testi',
          questions: [
            {
              id: 1,
              question: 'Dünya’dan bakıldığında Ay’ın daima aynı yüzünün görülmesinin temel sebebi nedir?',
              options: [
                'Ay’ın kendi ışığını üretmesi',
                'Ay’ın kendi etrafında dönme süresi ile Dünya etrafında dolanma süresinin birbirine eşit olması',
                'Güneş’in Ay’ı sürekli aydınlatması',
                'Ay’ın atmosferinin olmaması'
              ],
              correctAnswer: 1,
              explanation: 'Ay’ın kendi etrafında dönme süresi (~27.3 gün) Dünya etrafında dolanma süresine eşit olduğundan Dünya’dan hep aynı yüzü görünür.',
              hint: 'Dönme ve dolanma sürelerinin senkronize olduğunu hatırla.'
            },
            {
              id: 2,
              question: 'Ay’ın Güneş ile Dünya arasına girdiği ve Dünya’dan bakıldığında Ay’ın karanlık yüzünün görüldüğü evre hangisidir?',
              options: ['Dolunay', 'İlk Dördün', 'Yeniay', 'Son Dördün'],
              correctAnswer: 2,
              explanation: 'Yeniay evresinde Ay, Dünya ile Güneş arasındadır ve Dünya’ya bakan yüzü ışık almaz.',
              hint: 'Gökyüzünde Ay’ın hiç görünmediği başlangıç evresidir.'
            }
          ]
        },
        flashcards: [
          { term: 'Krater', definition: 'Ay’ın yüzeyine gök taşlarının çarpması sonucu oluşan dev çukurlardır.' },
          { term: 'Yeniay', definition: 'Ay’ın Dünya’ya bakan yüzünün karanlık olduğu, gökyüzünde görünmediği ana evredir.' },
          { term: 'Dolunay', definition: 'Ay’ın Dünya’ya bakan yüzünün tamamen aydınlık ve yuvarlak görüldüğü ana evredir.' }
        ],
        aiStudyPrompts: [
          'Neden Ay’da rüzgar, yağmur veya hava olayları görülmez? 5. sınıf diliyle açıkla.',
          'Ay’ın 4 ana evresini sırasıyla ve aralarındaki 1 haftalık süreyi gösteren bir özet yaz.'
        ]
      },
      {
        id: 'fen-u2',
        unitNumber: 2,
        title: 'Canlılar Dünyası',
        description: 'Mikroskobik canlılar, mantarlar, bitkiler (çiçekli ve çiçeksiz), hayvanlar (omurgalı ve omurgasızlar).',
        semester: 1,
        topics: [
          {
            title: 'Canlıların Sınıflandırılması',
            subtopics: ['Neden sınıflandırma yaparız?', 'Canlılar 4 ana grupta incelenir']
          },
          {
            title: 'Mikroskobik Canlılar & Mantarlar',
            subtopics: ['Bakteriler, amip, öglena, terliksi hayvan', 'Yararlı bakteriler (yoğurt, peynir, turşu yapımı) ve zararlı bakteriler', 'Mantarlar: Küf, maya, şapkalı ve parazit mantarlar (mantarlar bitki DEĞİLDİR)']
          },
          {
            title: 'Bitkiler & Hayvanlar',
            subtopics: ['Çiçeksiz bitkiler (eğrelti otu, kara yosunu) & Çiçekli bitkiler (kök, gövde, yaprak, çiçek)', 'Omurgasız hayvanlar (solucan, böcekler, denizanası)', 'Omurgalı hayvanlar: Balıklar, Kurbağalar, Sürüngenler, Kuşlar, Memeliler (doğurarak besleyenler, yavru bakımı)']
          }
        ],
        kazanimlar: [
          'FEN.5.2.1.1. Mikroskop yardımıyla mikroskobik canlıları gözlemler ve önemini kavrar.',
          'FEN.5.2.1.2. Mantarların bitki olmadığını, kendi besinini üretemediğini ve çeşitlerini açıklar.',
          'FEN.5.2.1.3. Bitkileri çiçekli ve çiçeksiz olarak sınıflandırır, kısımlarının görevlerini belirtir.',
          'FEN.5.2.1.4. Hayvanları omurgalı ve omurgasız olarak sınıflandırır, omurgalıların özelliklerini karşılaştırır.'
        ],
        video: {
          title: '5. Sınıf Fen - Canlılar Dünyası: Mantarlar, Bitkiler ve Hayvanlar',
          youtubeId: 'djBPNiW0zD8',
          duration: '18:10',
          instructor: 'Sinan Hoca',
          summary: 'Mantarlar neden bitki değildir? Memeli hayvanların ayırt edici özellikleri.'
        },
        quiz: {
          title: 'Canlılar Dünyası Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisi bir "memeli hayvan" özelliği gösterir ve yavrularını sütle besler?',
              options: ['Penguen', 'Yunus ve Balina', 'Timsah', 'Kartal'],
              correctAnswer: 1,
              explanation: 'Yunus ve balina suda yaşamalarına rağmen balık değil, memelidir; akciğer solunumu yapar ve yavrularını sütle beslerler.',
              hint: 'Suda yaşasalar da balık olmayan canlıları hatırla.'
            },
            {
              id: 2,
              question: 'Mantarlar hakkında verilen bilgilerden hangisi DOĞRUDUR?',
              options: [
                'Kendi besinini fotosentezle üretirler.',
                'Kök, gövde ve çiçekleri vardır.',
                'Bitki değillerdir, hazır besinlerle beslenirler.',
                'Tüm mantarlar zehirlidir ve yenmez.'
              ],
              correctAnswer: 2,
              explanation: 'Mantarlar klorofil içermez, fotosentez yapamazlar; bu yüzden bitki sınıfında değillerdir.',
              hint: 'Mantarların yeşil klorofili olmadığını düşün.'
            }
          ]
        },
        flashcards: [
          { term: 'Klorofil', definition: 'Bitkilerde yeşil rengi veren ve güneş ışığı ile fotosentez yapmayı sağlayan pigmenttir.' },
          { term: 'Maya Mantarı', definition: 'Hamurun kabarmasında ve fermantasyonda kullanılan yararlı mikroskobik mantar türüdür.' },
          { term: 'Omurgalı Hayvanlar', definition: 'Vücudunda kemik veya kıkırdaktan yapılmış bir iskelet sistemi bulunan canlılardır.' }
        ],
        aiStudyPrompts: [
          'Balina ve penguenin sınıflandırma farkını 5. sınıf seviyesinde açıkla.',
          'Çiçekli bir bitkinin 4 temel organının görevlerini maddeler halinde yaz.'
        ]
      },
      {
        id: 'fen-u3',
        unitNumber: 3,
        title: 'Kuvvetin Ölçülmesi ve Sürtünme',
        description: 'Kuvvet kavramı, dinamometre yapısı ve kullanımı, sürtünme kuvveti, hava ve su direnci.',
        semester: 1,
        topics: [
          {
            title: 'Kuvvet ve Dinamometre',
            subtopics: ['Kuvvetin birimi Newton (N)', 'Esnek cisimler (yaylar) ve yayın uzama miktarı ilişkisi']
          },
          {
            title: 'Sürtünme Kuvveti',
            subtopics: ['Hareketi engelleyici yönü', 'Pürüzlü ve kaygan yüzeyler', 'Sürtünmeyi artırma ve azaltma yolları (kış lastikleri, yağlama)']
          },
          {
            title: 'Hava ve Su Direnci',
            subtopics: ['Paraşüt tasarımı (hava direncini artırma)', 'Uçak ve gemilerin sivri burun tasarımları (direnci azaltma)']
          }
        ],
        kazanimlar: [
          'FEN.5.3.1.1. Kuvvetin büyüklüğünü dinamometre ile ölçer ve birimini belirtir.',
          'FEN.5.3.2.1. Sürtünme kuvvetinin çeşitli ortamlardaki etkilerini deneyerek açıklar.',
          'FEN.5.3.2.2. Günlük yaşamda sürtünmeyi artırma ve azaltmaya yönelik örnekler verir.'
        ],
        video: {
          title: '5. Sınıf Fen - Kuvvet, Dinamometre ve Sürtünme Kuvveti',
          youtubeId: '2qWjJVIUkjI',
          duration: '15:40',
          instructor: 'Elif Öğretmen',
          summary: 'Dinamometrede yay uzaması hesaplama, hava ve su direncinin taşıtlardaki önemi.'
        },
        quiz: {
          title: 'Kuvvet ve Sürtünme Testi',
          questions: [
            {
              id: 1,
              question: '10 bölmeli bir dinamometre en fazla 50 N kuvvet ölçebilmektedir. Yayın 3 bölme uzamasını sağlayan cismin ağırlığı kaç N’dur?',
              options: ['10 N', '15 N', '20 N', '30 N'],
              correctAnswer: 1,
              explanation: 'Her bir bölme: 50 ÷ 10 = 5 N değerindedir. 3 bölme uzama = 3 × 5 = 15 N.',
              hint: 'Önce tek bir bölmenin kaç Newton ölçtüğünü bul.'
            }
          ]
        },
        flashcards: [
          { term: 'Dinamometre', definition: 'İçindeki sarmal yayın esneklik özelliğinden yararlanılarak kuvveti ölçen alettir.' },
          { term: 'Newton (N)', definition: 'Kuvvetin uluslararası birimidir.' },
          { term: 'Sürtünme Kuvveti', definition: 'Temas halindeki yüzeyler arasında cismin hareketini zorlaştıran kuvvettir.' }
        ],
        aiStudyPrompts: [
          'Neden yağmurlu havada araba frenleri daha zor tutar? Sürtünme kuvvetiyle açıkla.'
        ]
      },
      {
        id: 'fen-u4',
        unitNumber: 4,
        title: 'Madde ve Değişim',
        description: 'Hal değişimleri (erime, donma, buharlaşma, yoğuşma, kaynama, süblimleşme, kırağılaşma); Ayırt edici özellikler; Isı ve sıcaklık; Genleşme ve büzülme.',
        semester: 2,
        topics: [
          {
            title: 'Maddenin Hal Değişimleri',
            subtopics: ['Isı alarak gerçekleşenler: Erime, Buharlaşma, Süblimleşme', 'Isı vererek gerçekleşenler: Donma, Yoğuşma, Kırağılaşma', 'Kaynama ve buharlaşma farkı']
          },
          {
            title: 'Ayırt Edici Özellikler',
            subtopics: ['Erime noktası, donma noktası, kaynama noktası', 'Saf maddelerde hal değişimi süresince sıcaklığın sabit kalması']
          },
          {
            title: 'Isı ve Sıcaklık',
            subtopics: ['Isı bir enerjidir (Joule/Kalori), Sıcaklık bir ölçümdür (Derece/°C)', 'Isı alışverişi sıcak maddeden soğuk maddeye doğrudur']
          },
          {
            title: 'Genleşme ve Büzülme',
            subtopics: ['Isınan maddelerin hacminin artması (genleşme)', 'Soğuyan maddelerin hacminin küçülmesi (büzülme)', 'Tren rayları ve elektrik tellerindeki genleşme payı']
          }
        ],
        kazanimlar: [
          'FEN.5.4.1.1. Maddelerin ısı etkisiyle hal değiştirebileceğini deneyle gösterir.',
          'FEN.5.4.2.1. Saf maddelerin ayırt edici özelliklerini (erime, donma ve kaynama noktaları) açıklar.',
          'FEN.5.4.3.1. Isı ve sıcaklık arasındaki temel farkları açıklar.',
          'FEN.5.4.4.1. Isı etkisiyle maddelerin genleşip büzüldüğünü günlük hayat örnekleriyle açıklar.'
        ],
        video: {
          title: '5. Sınıf Fen - Madde ve Hal Değişimi, Isı ve Sıcaklık',
          youtubeId: '7hVI_SD_Ciw',
          duration: '16:50',
          instructor: 'Sinan Hoca',
          summary: 'Buharlaşma ile kaynama arasındaki 4 fark, termometre ve kalorimetre ayrımı.'
        },
        quiz: {
          title: 'Madde ve Değişim Testi',
          questions: [
            {
              id: 1,
              question: 'Buharlaşma ve kaynama ile ilgili hangisi YANLIŞTIR?',
              options: [
                'Buharlaşma her sıcaklıkta olur, kaynama belirli bir sıcaklıkta gerçekleşir.',
                'Kaynama sıvının her yerinde olur, buharlaşma sadece yüzeyde gerçekleşir.',
                'Kaynama sırasında sıvının sıcaklığı sürekli artar.',
                'Kaynama hızlı ve kabarcıklı bir olaydır.'
              ],
              correctAnswer: 2,
              explanation: 'Saf maddeler kaynarken sıcaklıkları SABİT kalır, artmaz.',
              hint: 'Hal değişimi anında saf maddelerin sıcaklığı değişmez.'
            }
          ]
        },
        flashcards: [
          { term: 'Süblimleşme', definition: 'Katı bir maddenin ısı alarak sıvılaşmadan doğrudan gaz hale geçmesidir (Örn: Naftalin, kuru buz).' },
          { term: 'Kırağılaşma', definition: 'Gaz halindeki maddenin ısı vererek aniden katı hale geçmesidir (Örn: Soğuk kış sabahlarında çimlerin üzerindeki beyaz buz taneleri).' },
          { term: 'Genleşme', definition: 'Maddenin ısı alarak hacminin büyümesidir.' }
        ],
        aiStudyPrompts: [
          'Isı ile sıcaklık arasındaki 3 temel farkı bir tablo halinde açıkla.'
        ]
      },
      {
        id: 'fen-u5',
        unitNumber: 5,
        title: 'Işığın Yayılması',
        description: 'Işığın doğrusal yayılması, ışığın yansıması (düzgün ve dağınık), yansıma kanunları, maddelerin ışığı geçirmesi (saydam, yarı saydam, opak), tam gölge.',
        semester: 2,
        topics: [
          {
            title: 'Işığın Yayılması ve Yansıması',
            subtopics: ['Işık her yöne doğrusal yayılır', 'Gelen ışın, yansıyan ışın ve yüzey normali', 'Geliş açısı = Yansıma açısı kuralı']
          },
          {
            title: 'Maddelerin Işık Geçirgenliği',
            subtopics: ['Saydam (cam, hava)', 'Yarı saydam (buzlu cam, yağlı kağıt)', 'Opak (tahta, taş, metal)']
          },
          {
            title: 'Tam Gölge Oluşumu',
            subtopics: ['Işık kaynağının veya cismin yaklaşması/uzaklaşmasında gölgenin büyümesi ve küçülmesi']
          }
        ],
        kazanimlar: [
          'FEN.5.5.1.1. Işığın doğrusal yollarla yayıldığını açıklar.',
          'FEN.5.5.2.1. Işığın yansımasını açıklar ve yansıma kanunlarını uygular.',
          'FEN.5.5.3.1. Maddeleri ışığı geçirme durumlarına göre sınıflandırır.',
          'FEN.5.5.4.1. Tam gölgenin nasıl oluştuğunu ve gölge boyutunu etkileyen değişkenleri açıklar.'
        ],
        video: {
          title: '5. Sınıf Fen - Işığın Yansıması ve Tam Gölge',
          youtubeId: 'RQ4zyb0R-gk',
          duration: '15:10',
          instructor: 'Elif Öğretmen',
          summary: 'Düzgün ve dağınık yansıma, gölge deneyleri ve açı hesapları.'
        },
        quiz: {
          title: 'Işık ve Gölge Testi',
          questions: [
            {
              id: 1,
              question: 'Işık kaynağına yaklaştırılan opak bir cismin perdedeki tam gölgesi nasıl değişir?',
              options: ['Küçülür', 'Büyür', 'Değişmez', 'Kaybolur'],
              correctAnswer: 1,
              explanation: 'Cisim ışık kaynağına yaklaştıkça daha fazla ışık demetini engeller ve gölgesi büyür.',
              hint: 'Elini el fenerine yaklaştırdığında duvardaki gölgenin ne olduğuna dikkat et.'
            }
          ]
        },
        flashcards: [
          { term: 'Yüzey Normali (N)', definition: 'Yansıtıcı yüzeye dik (90°) çizilen hayali doğrudur.' },
          { term: 'Opak Madde', definition: 'Işığı hiç geçirmeyen ve arkasında tam gölge oluşturan maddedir.' }
        ],
        aiStudyPrompts: [
          'Güneş saatinin çalışma mantığını gölge boyuyla ilişkilendirerek anlat.'
        ]
      },
      {
        id: 'fen-u6',
        unitNumber: 6,
        title: 'İnsan ve Çevre',
        description: 'Biyoçeşitlilik, çevre kirliliği (hava, su, toprak), çevre koruma bilinci, yıkıcı doğa olayları (deprem, heyelan, sel, fırtına).',
        semester: 2,
        topics: [
          {
            title: 'Biyoçeşitlilik',
            subtopics: ['Ülkemizdeki zengin türler', 'Nesli tükenmiş ve tükenme tehlikesi altındaki canlılar (kelaynak, kardelen, Anadolu parsı)']
          },
          {
            title: 'Yıkıcı Doğa Olayları',
            subtopics: ['Deprem, heyelan, sel, volkanik patlamalar, kasırga', 'Deprem öncesi, anı ve sonrasında yapılması gerekenler (Çök-Kapan-Tutun)']
          }
        ],
        kazanimlar: [
          'FEN.5.6.1.1. Biyoçeşitliliğin doğal yaşam için önemini açıklar.',
          'FEN.5.6.2.1. İnsan faaliyetlerinin çevreye olumsuz etkilerini ve çözüm önerilerini tartışır.',
          'FEN.5.6.3.1. Yıkıcı doğa olaylarından korunma yollarını açıklar.'
        ],
        video: {
          title: '5. Sınıf Fen - Biyoçeşitlilik ve Doğal Afetlerden Korunma',
          youtubeId: 'zwVWzQwL5LA',
          duration: '14:20',
          instructor: 'Sinan Hoca',
          summary: 'Türkiye’nin endemik türleri ve deprem bilinci.'
        },
        quiz: {
          title: 'Çevre ve Doğa Olayları Testi',
          questions: [
            {
              id: 1,
              question: 'Eğimli arazilerde toprağın büyük kütleler halinde aşağıya kayması olayına ne ad verilir?',
              options: ['Erozyon', 'Heyelan (Toprak kayması)', 'Sel', 'Deprem'],
              correctAnswer: 1,
              explanation: 'Aşırı yağış ve eğim nedeniyle toprağın aniden kayması heyelandır.',
              hint: 'Karadeniz bölgesinde dik yamaçlarda sıkça görülür.'
            }
          ]
        },
        flashcards: [
          { term: 'Biyoçeşitlilik', definition: 'Bir bölgedeki tüm canlı türlerinin (bitki, hayvan, mantar, mikroskobik canlı) zenginliği ve çeşitliliğidir.' },
          { term: 'Endemik Tür', definition: 'Sadece dünyanın belirli bir bölgesinde yaşayan özel canlı türüdür.' }
        ],
        aiStudyPrompts: [
          'Deprem anında evde güvenli bir hayat üçgeni nasıl oluşturulur? 5. sınıf öğrencisine açıkla.'
        ]
      },
      {
        id: 'fen-u7',
        unitNumber: 7,
        title: 'Elektrik Devre Elemanları',
        description: 'Devre elemanları sembolleri (pil, ampul, anahtar, bağlantı kablosu), devre şeması çizimi, lamba parlaklığını etkileyen değişkenler (bağımlı, bağımsız, kontrol edilen değişken).',
        semester: 2,
        topics: [
          {
            title: 'Devre Elemanlarının Sembolleri',
            subtopics: ['Pil (+ ve - uçlar), ampul (daire içinde çarpı), anahtar (açık/kapalı), iletken kablo']
          },
          {
            title: 'Lamba Parlaklığı ve Değişkenler',
            subtopics: ['Pil sayısı artarsa parlaklık artar', 'Ampul sayısı artarsa parlaklık azalır', 'Bağımsız değişken, bağımlı değişken ve sabit tutulan kontrol değişkeni kavramı']
          }
        ],
        kazanimlar: [
          'FEN.5.7.1.1. Bir elektrik devresindeki elemanları sembolleriyle gösterir ve şemasını çizer.',
          'FEN.5.7.2.1. Basit bir elektrik devresinde lamba parlaklığını etkileyen değişkenleri deneyle belirler.'
        ],
        video: {
          title: '5. Sınıf Fen - Elektrik Devre Elemanları ve Lamba Parlaklığı',
          youtubeId: 'HGUv94J5dhw',
          duration: '15:50',
          instructor: 'Elif Öğretmen',
          summary: 'Bağımlı ve bağımsız değişkenleri ayırt etme rehberi.'
        },
        quiz: {
          title: 'Elektrik Devreleri Testi',
          questions: [
            {
              id: 1,
              question: 'Basit bir devrede ampul sayısı sabit tutulup pil sayısı artırılırsa lamba parlaklığı nasıl değişir?',
              options: ['Azalır', 'Artar', 'Değişmez', 'Ampul patlar ve söner'],
              correctAnswer: 1,
              explanation: 'Pil devreye enerji sağlar. Ampul sayısı sabitken pil sayısı artarsa ampulün parlaklığı artar.',
              hint: 'Daha çok pil daha çok enerji demektir.'
            }
          ]
        },
        flashcards: [
          { term: 'Bağımsız Değişken', definition: 'Deneyde bizim bilerek değiştirdiğimiz faktördür (Örn: Eklenen pil sayısı).' },
          { term: 'Bağımlı Değişken', definition: 'Bağımsız değişkene bağlı olarak değişen sonuçtur (Örn: Lamba parlaklığı).' }
        ],
        aiStudyPrompts: [
          'Bağımlı, bağımsız ve kontrol edilen değişkeni 5. sınıf öğrencisine eğlenceli bir deney hikayesiyle anlat.'
        ]
      }
    ],
    termExams: [
      {
        id: 'fen-exam-1',
        title: '5. Sınıf Fen Bilimleri 1. Dönem 1. Yazılı Sınavı',
        term: '1. Dönem 1. Yazılı',
        scenario: 'MEB 1. Senaryo (Açık Uçlu Maarif Soruları)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: 'Ay’ın ana evrelerini oluşum sırasına göre yazınız ve her evrede Ay’ın Dünya’dan nasıl göründüğünü kısaca açıklayınız.',
            type: 'acik_uclu',
            correctAnswer: '1. Yeniay, 2. İlk Dördün, 3. Dolunay, 4. Son Dördün.',
            solution: 'Sıralama: 1. Yeniay (karanlık), 2. İlk Dördün (D harfi şeklinde sağ yarısı aydınlık), 3. Dolunay (tamamen aydınlık), 4. Son Dördün (ters D şeklinde sol yarısı aydınlık).',
            points: 25,
            kazanimKodu: 'FEN.5.1.3.1'
          },
          {
            id: 2,
            question: 'Mantarların bitki OLMADIĞINI kanıtlayan en önemli 2 özelliği yazınız.',
            type: 'acik_uclu',
            correctAnswer: '1. Fotosentez yapamazlar (klorofilleri yoktur). 2. Kendi besinlerini üretemezler, hazır besin alırlar.',
            solution: 'Mantarlarda klorofil pigmenti bulunmaz, bu yüzden kendi besinini güneş ışığıyla üretemez ve hazır organik maddelerle beslenirler.',
            points: 25,
            kazanimKodu: 'FEN.5.2.1.2'
          },
          {
            id: 3,
            question: 'Kışın arabalara kar lastiği takılmasının ve ayakkabı tabanlarının tırtıklı yapılmasının sürtünme kuvvetiyle olan ilişkisini açıklayınız.',
            type: 'acik_uclu',
            correctAnswer: 'Sürtünme kuvvetini artırarak kaymayı önlemek ve güvenli hareket sağlamak içindir.',
            solution: 'Pürüzlü yüzeyler sürtünme kuvvetini artırır. Böylece araçların ve insanların buzlu/karlı yollarda kayması önlenir.',
            points: 25,
            kazanimKodu: 'FEN.5.3.2.2'
          },
          {
            id: 4,
            question: 'Kuşlar ve memeliler arasındaki 2 temel farkı yazınız.',
            type: 'acik_uclu',
            correctAnswer: 'Kuşlar yumurtayla çoğalır ve vücutları tüylerle kaplıdır. Memeliler doğurarak çoğalır, yavrularını sütle besler ve vücutları kıllarla kaplıdır.',
            solution: 'Üreme ve yavru bakımı açısından: Kuşlar yumurtlar; memeliler doğurur ve sütle besler.',
            points: 25,
            kazanimKodu: 'FEN.5.2.1.4'
          }
        ]
      }
    ]
  },

  // 3. TÜRKÇE
  {
    id: 'turkce',
    name: 'Türkçe',
    slug: 'turkce-5',
    icon: '📚',
    themeColor: {
      primary: 'from-rose-600 to-pink-600',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-800',
      badge: 'bg-rose-600 text-white',
      accent: 'text-rose-600 dark:text-rose-400',
    },
    description: 'Erdemler, Millî Kültür, Atatürk, Birey ve Toplum; Sözcükte ve Cümlede Anlam; Paragraf; Kök ve Ekler; Noktalama.',
    mebWeeklyHours: 6,
    totalUnitsCount: 6,
    units: [
      {
        id: 'turkce-u1',
        unitNumber: 1,
        title: 'Erdemler (Sözcükte Anlam & Kök-Ek)',
        description: 'Gerçek, mecaz ve terim anlam; eş ve zıt anlamlı kelimeler; isim kökü ve fiil kökü; yapım ve çekim ekleri.',
        semester: 1,
        topics: [
          {
            title: 'Sözcükte Anlam Özellikleri',
            subtopics: ['Gerçek anlam (ilk akla gelen)', 'Mecaz anlam (benzetmeyle kazanılan yeni anlam)', 'Terim anlam (bilim, sanat, spor dalına özgü)']
          },
          {
            title: 'Kök ve Ek Bilgisi',
            subtopics: ['İsim kökü (-mak/-mek almaz) ve Fiil kökü (-mak/-mek alır)', 'Yapım ekleri (yeni kelime türetenler: -lık, -cı, -siz, -gi)', 'Çekim ekleri (çoğul -lar, hal ekleri -i, -e, -de, -den)']
          }
        ],
        kazanimlar: [
          'T.5.1.1. Kelimelerin gerçek, mecaz ve terim anlamlarını ayırt eder.',
          'T.5.1.2. Kelimenin kökünü bulur, yapım ve çekim eklerini ayırt eder.',
          'T.5.1.3. Erdemler temasında dürüstlük ve sevgi konulu bilgilendirici metin yazar.'
        ],
        video: {
          title: '5. Sınıf Türkçe - Sözcükte Anlam ve Kök-Ek Bilgisi',
          youtubeId: '4MZzZ7cPZUo',
          duration: '16:00',
          instructor: 'Dilek Öğretmen',
          summary: 'Kök bulma formülü ve mecaz anlamı cümleden yakalama taktikleri.'
        },
        quiz: {
          title: 'Sözcükte Anlam ve Ekler Testi',
          questions: [
            {
              id: 1,
              question: '"Öğretmenimiz bizi çok sıcak karşıladı." cümlesindeki "sıcak" kelimesi hangi anlamda kullanılmıştır?',
              options: ['Gerçek anlam', 'Mecaz anlam', 'Terim anlam', 'Yan anlam'],
              correctAnswer: 1,
              explanation: 'Burada "sıcak" kelimesi ısı anlamında değil, "samimi ve içten" anlamında mecaz olarak kullanılmıştır.',
              hint: 'Fiziksel sıcaklık mı kastedilmiş, yoksa içten bir davranış mı?'
            },
            {
              id: 2,
              question: 'Hangisi bir "fiil kökü"dür?',
              options: ['Göz', 'Yol', 'Koş-', 'Su'],
              correctAnswer: 2,
              explanation: '"Koş-" köküne mastar eki (-mak/-mek) gelir: "Koşmak" bir eylem bildirir.',
              hint: '-mak / -mek eki alabiliyor mu dene.'
            }
          ]
        },
        flashcards: [
          { term: 'Yapım Eki', definition: 'Eklendiği sözcüğün anlamını değiştiren ve yeni bir sözcük türeten ektir (Örn: Göz -> Gözlük).' },
          { term: 'Terim Anlam', definition: 'Bir bilim, sanat, meslek veya spor dalıyla ilgili özel kavramları karşılayan sözcüklerdir (Örn: Açı, nota, hücre).' }
        ],
        aiStudyPrompts: [
          '5. sınıf öğrencisi için "kitaplık" kelimesinin kökünü ve ekini adım adım tahlil et.'
        ]
      },
      {
        id: 'turkce-u2',
        unitNumber: 2,
        title: 'Millî Kültürümüz (Cümlede Anlam & Atasözleri)',
        description: 'Neden-sonuç, amaç-sonuç ve koşul-sonuç cümleleri; öznel ve nesnel yargılar; atasözü ve deyimler.',
        semester: 1,
        topics: [
          {
            title: 'Cümlede Anlam İlişkileri',
            subtopics: ['Neden-Sonuç (Gerekçe) cümleleri', 'Amaç-Sonuç (Hedef) cümleleri', 'Koşul-Sonuç (-se/-sa) cümleleri']
          },
          {
            title: 'Öznel ve Nesnel Anlatım',
            subtopics: ['Kişisel görüş içeren öznel yargılar', 'Kanıtlanabilir bilimsel nesnel yargılar']
          }
        ],
        kazanimlar: [
          'T.5.2.1. Cümleler arasındaki neden-sonuç, amaç-sonuç ve koşul ilişkilerini belirler.',
          'T.5.2.2. Öznel ve nesnel yargıları birbirinden ayırt eder.',
          'T.5.2.3. Deyim ve atasözlerinin metnin anlamına katkısını kavrar.'
        ],
        video: {
          title: '5. Sınıf Türkçe - Neden-Sonuç, Amaç-Sonuç ve Öznel-Nesnel',
          youtubeId: '7BecTq1bsiE',
          duration: '15:30',
          instructor: 'Dilek Öğretmen',
          summary: '"Amacıyla" taktiği ile neden-sonuç ve amaç-sonuç ayrımı.'
        },
        quiz: {
          title: 'Cümlede Anlam Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisi bir "amaç-sonuç" cümlesidir?',
              options: [
                'Yağmur yağdığı için ıslandık.',
                'Sınavı kazanmak için gece gündüz çalıştı.',
                'Geç kaldığından derse giremedi.',
                'Hava soğuk olduğu için montunu giydi.'
              ],
              correctAnswer: 1,
              explanation: '"Sınavı kazanmak amacıyla gece gündüz çalıştı" şeklinde ifade edilebildiği için amaç-sonuçtur.',
              hint: '"... amacıyla" ifadesini yerine koyarak dene.'
            }
          ]
        },
        flashcards: [
          { term: 'Öznel Yargı', definition: 'Kişiden kişiye değişen, kanıtlanamayan beğeni ve düşüncelerdir (Örn: En güzel mevsim ilkbahardır).' },
          { term: 'Nesnel Yargı', definition: 'Herkes tarafından kabul edilen ve kanıtlanabilir doğrulardır (Örn: Türkiye’nin başkenti Ankara’dır).' }
        ],
        aiStudyPrompts: [
          'Neden-sonuç ve amaç-sonuç arasındaki farkı anlatan pratik bir ipucu ver.'
        ]
      },
      {
        id: 'turkce-u3',
        unitNumber: 3,
        title: 'Millî Mücadele ve Atatürk (Metin Türleri & Noktalama)',
        description: 'Metin türleri (hikaye, fabl, masal, şiir, anı, mektup); Noktalama işaretleri (nokta, virgül, noktalı virgül, iki nokta, tırnak, ünlem).',
        semester: 1,
        topics: [
          {
            title: 'Metin Türleri ve Unsurları',
            subtopics: ['Hikaye unsurları: Olay, yer, zaman, kişi', 'Fabl (hayvan masalları) ve Masal özellikleri']
          },
          {
            title: 'Noktalama İşaretleri & Yazım Kuralları',
            subtopics: ['Virgülün görevleri (sıralama, hitap)', 'Büyük harflerin kullanıldığı yerler', 'de/da ve ki bağlacının yazımı']
          }
        ],
        kazanimlar: [
          'T.5.3.1. Metnin ana fikrini, konusunu ve yardımcı fikirlerini belirler.',
          'T.5.3.2. Noktalama işaretlerini işlevlerine uygun şekilde kullanır.',
          'T.5.3.3. Yazım kurallarını (bağlaçlar, soru eki -mi, büyük harfler) doğru uygular.'
        ],
        video: {
          title: '5. Sınıf Türkçe - Noktalama İşaretleri ve Yazım Kuralları',
          youtubeId: 'dfE_ABwFhyM',
          duration: '17:00',
          instructor: 'Hakan Hoca',
          summary: 'de/da bağlacı nasıl ayrı yazılır? Virgülün en çok karıştırılan yerleri.'
        },
        quiz: {
          title: 'Noktalama ve Yazım Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisinde "de/da" yazımında bir YANLIŞLIK yapılmıştır?',
              options: [
                'Evde kimse yoktu.',
                'Sen de bizimle gel.',
                'Kitap ta masanın üzerindeydi.',
                'Bahçede oynadık.'
              ],
              correctAnswer: 2,
              explanation: 'Bağlaç olan "de/da" asla "te/ta" şeklinde yazılmaz ve ayrı yazılmalıdır: "Kitap da masanın üzerindeydi."',
              hint: 'Bağlaç olan de/da cümleden çıkarıldığında anlam bozulmaz.'
            }
          ]
        },
        flashcards: [
          { term: 'Bağlaç Olan de/da', definition: 'Cümleden çıkarıldığında cümlenin anlamı bozulmaz, daima ayrı yazılır ve asla te/ta olmaz.' },
          { term: 'Ana Fikir', definition: 'Yazarın okuyucuya vermek istediği asıl ders veya temel iletidir.' }
        ],
        aiStudyPrompts: [
          'Bana içinde hem virgül hem iki nokta hem de tırnak işareti geçen örnek bir diyalog paragrafı yaz.'
        ]
      },
      {
        id: 'turkce-u4',
        unitNumber: 4,
        title: 'Doğa ve Evren (Paragrafta Anlam & Ana Düşünce)',
        description: 'Paragrafın yapısı (giriş, gelişme, sonuç), ana düşünce ve yardımcı düşünceler, başlık belirleme, çevre ve doğa sevgisi.',
        semester: 2,
        topics: [
          {
            title: 'Paragrafta Anlam ve Yapı',
            subtopics: ['Giriş, gelişme ve sonuç bölümleri', 'Ana fikir (ana düşünce) ve yardımcı fikirler', 'Paragrafa en uygun başlığı bulma']
          },
          {
            title: 'Metin İnceleme ve Çıkarım Yapma',
            subtopics: ['Metne dayalı soruları yanıtlama', 'Örtülü anlam ve yazarın bakış açısı']
          }
        ],
        kazanimlar: [
          'T.5.4.1. Okuduğu metnin ana fikrini ve yardımcı fikirlerini belirler.',
          'T.5.4.2. Paragrafın bölümleri arasındaki mantıksal bağı kavrar.',
          'T.5.4.3. Çevre bilinci ve doğa sevgisini anlatan bir deneme yazar.'
        ],
        video: {
          title: '5. Sınıf Türkçe - Paragrafta Ana Düşünce ve Başlık Bulma Taktikleri',
          youtubeId: 'Zix3xIgWdzU',
          duration: '15:20',
          instructor: 'Dilek Öğretmen',
          summary: 'Paragraf sorularını hızlı ve hatasız çözme yöntemleri, ilk ve son cümle taktiği.'
        },
        quiz: {
          title: 'Paragrafta Anlam Testi',
          questions: [
            {
              id: 1,
              question: 'Bir paragrafta yazarın okuyucuya iletmek istediği en temel mesaj veya öğüt nedir?',
              options: ['Konu', 'Ana düşünce', 'Başlık', 'Örnekleme'],
              correctAnswer: 1,
              explanation: 'Yazarın okuyucuya aktarmak istediği temel düşünceye veya derse ana düşünce (ana fikir) denir.',
              hint: 'Yazarın asıl vermek istediği mesaj.'
            }
          ]
        },
        flashcards: [
          { term: 'Ana Düşünce', definition: 'Yazarın okuyucuya vermek istediği temel mesaj veya asıl iletidir.' },
          { term: 'Yardımcı Fikir', definition: 'Ana düşünceyi destekleyen, açıklayan ve örneklendiren ikincil fikirlerdir.' }
        ],
        aiStudyPrompts: [
          'Bana 5. sınıf seviyesinde doğa sevgisini anlatan 4 cümlelik bir metin yaz ve ana fikrini sor.'
        ]
      },
      {
        id: 'turkce-u5',
        unitNumber: 5,
        title: 'Bilim ve Teknoloji (Söz Sanatları & Deyimler)',
        description: 'Söz sanatları (benzetme - teşbih, kişileştirme - teşhis), deyimler ve atasözleri, bilgilendirici metin okuryazarlığı.',
        semester: 2,
        topics: [
          {
            title: 'Söz Sanatları',
            subtopics: ['Benzetme (Teşbih): gibi, sanki, andırıyor', 'Kişileştirme (Teşhis): İnsana ait özelliklerin cansız varlıklara verilmesi']
          },
          {
            title: 'Deyimler ve Atasözleri',
            subtopics: ['Deyimlerin kalıplaşmış yapısı', 'Atasözlerinin öğüt verici ve evrensel niteliği']
          }
        ],
        kazanimlar: [
          'T.5.5.1. Metinlerdeki benzetme ve kişileştirme sanatlarını tespit eder.',
          'T.5.5.2. Deyim ve atasözlerini anlamına uygun şekilde kendi cümlelerinde kullanır.'
        ],
        video: {
          title: '5. Sınıf Türkçe - Benzetme ve Kişileştirme Sanatları',
          youtubeId: 'GoIbFEFHiAc',
          duration: '14:40',
          instructor: 'Hakan Hoca',
          summary: 'Benzetmenin unsurları (benzeyen, benzetilen) ve şiirlerde kişileştirme.'
        },
        quiz: {
          title: 'Söz Sanatları Testi',
          questions: [
            {
              id: 1,
              question: '"Rüzgar neşeyle şarkı söylüyor, ağaçlar kollarını sallıyordu." cümlesinde hangi söz sanatı vardır?',
              options: ['Kişileştirme', 'Abartma', 'Karşıtlık', 'Konuşturma'],
              correctAnswer: 0,
              explanation: 'Rüzgara ve ağaçlara şarkı söyleme ve el sallama gibi insani özellikler verildiği için kişileştirme yapılmıştır.',
              hint: 'İnsana ait özellik cansız varlığa verilmiş.'
            }
          ]
        },
        flashcards: [
          { term: 'Benzetme (Teşbih)', definition: 'Aralarında ilgi bulunan iki şeyden zayıf olanın güçlü olana benzetilmesidir (Örn: Aslan gibi kuvvetli çocuk).' },
          { term: 'Kişileştirme (Teşhis)', definition: 'İnsan dışındaki varlıklara insani özelliklerin yüklenmesidir (Örn: Hüzünlü bulutlar ağlıyordu).' }
        ],
        aiStudyPrompts: [
          'Bana hem benzetme hem kişileştirme içeren 2 farklı örnek cümle kur.'
        ]
      },
      {
        id: 'turkce-u6',
        unitNumber: 6,
        title: 'Sağlık ve Spor (Metin Türleri & Yazım Kuralları)',
        description: 'Şiirde dize ve kıta, kafiye ve redif, bilgilendirici metin yazma, sayıların ve kısaltmaların yazımı.',
        semester: 2,
        topics: [
          {
            title: 'Şiir İnceleme',
            subtopics: ['Dize (mısra) ve Dörtlük (kıta)', 'Duygu ve tema belirleme, ses uyumları']
          },
          {
            title: 'Yazım Kuralları (Sayılar & Kısaltmalar)',
            subtopics: ['Sayıların yazılışı (üçer üçer, 15 Mayıs)', 'Büyük harfle yapılan kısaltmalara gelen ekler (TDK’nin, MEB’e)']
          }
        ],
        kazanimlar: [
          'T.5.6.1. Şiir okur, ana duygusunu (tema) belirler.',
          'T.5.6.2. Kısaltmaların ve sayıların yazım kurallarına uygun yazar.'
        ],
        video: {
          title: '5. Sınıf Türkçe - Sayıların ve Kısaltmaların Yazımı',
          youtubeId: 'DhU0BCl_v9Y',
          duration: '13:50',
          instructor: 'Dilek Öğretmen',
          summary: 'Kısaltmalara ek getirirken açılışına göre mi okunuşuna göre mi ek getirilir?'
        },
        quiz: {
          title: 'Yazım Kuralları Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisinin yazımı DOĞRUDUR?',
              options: ['THY’na', 'MEB’e', 'TDK’ya', 'TBMM’ne'],
              correctAnswer: 1,
              explanation: 'Büyük harfli kısaltmalarda ek kısaltmanın son harfinin okunuşuna göre gelir: MEB’e doğrudur.',
              hint: 'Kısaltmanın son harfinin Türkçe okunuşunu düşün.'
            }
          ]
        },
        flashcards: [
          { term: 'Kısaltmaların Yazımı', definition: 'Büyük harfle yapılan kısaltmalara getirilen eklerde kısaltmanın son harfinin okunuşu esas alınır (TDK’nin, MEB’e).' },
          { term: 'Şiirin Teması', definition: 'Şiirde hakim olan temel duygu veya histir (Örn: Yaşama sevinci, vatan sevgisi).' }
        ],
        aiStudyPrompts: [
          '5. sınıf öğrencisine sporun önemini anlatan iki kıtalık neşeli bir şiir yaz.'
        ]
      }
    ],
    termExams: [
      {
        id: 'turkce-exam-1',
        title: '5. Sınıf Türkçe 1. Dönem 1. Yazılı Sınavı',
        term: '1. Dönem 1. Yazılı',
        scenario: 'MEB 1. Senaryo (Metin Anlama ve Açık Uçlu Dil Bilgisi)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: 'Verilen metnin konusunu ve ana fikrini yazınız.',
            type: 'acik_uclu',
            correctAnswer: 'Konu: Arkadaşlık ve dürüstlük. Ana fikir: Gerçek dostluk zor zamanlarda dürüst kalabilmektir.',
            solution: 'Metnin üzerinde durduğu genel durum konu, verilmek istenen ders ise ana fikirdir.',
            points: 25,
            kazanimKodu: 'T.5.3.1'
          },
          {
            id: 2,
            question: '"Gözlükçü" sözcüğünün kökünü, aldığı ekleri ve bu eklerin türünü (yapım/çekim) belirtiniz.',
            type: 'acik_uclu',
            correctAnswer: 'Kök: Göz (İsim kökü). -lük (Yapım eki), -çü (Yapım eki).',
            solution: 'Göz (kök) -> Gözlük (yeni anlam: yapım eki) -> Gözlükçü (meslek yapan kişi: yapım eki).',
            points: 25,
            kazanimKodu: 'T.5.1.2'
          },
          {
            id: 3,
            question: '"Ağır" sözcüğünü biri gerçek, diğeri mecaz anlamda olacak şekilde iki farklı cümlede kullanınız.',
            type: 'acik_uclu',
            correctAnswer: 'Gerçek: Bu çanta çok ağırdı, taşımakta zorlandım. Mecaz: Arkadaşının ağır sözleri kalbini çok kırdı.',
            solution: 'Gerçek anlam fiziksel ağırlık; mecaz anlam ise kırıcı/dokunaklı laftır.',
            points: 25,
            kazanimKodu: 'T.5.1.1'
          },
          {
            id: 4,
            question: 'İçinde bir amaç-sonuç ilişkisi bulunan özgün bir cümle kurunuz.',
            type: 'acik_uclu',
            correctAnswer: 'Kardeşine doğum günü hediyesi almak için harçlıklarını biriktirdi.',
            solution: 'Hediyeyi almak amacıyla harçlık biriktirme hedefini bildirir.',
            points: 25,
            kazanimKodu: 'T.5.2.1'
          }
        ]
      }
    ]
  },

  // 4. SOSYAL BİLGİLER
  {
    id: 'sosyal-bilgiler',
    name: 'Sosyal Bilgiler',
    slug: 'sosyal-bilgiler-5',
    icon: '🌍',
    themeColor: {
      primary: 'from-amber-600 to-orange-600',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-600 text-white',
      accent: 'text-amber-600 dark:text-amber-400',
    },
    description: 'Birlikte Yaşamak; Anadolu ve Mezopotamya Medeniyetleri; Bölgelerimiz ve İklim; Üretim, Dağıtım ve Tüketim; Etkin Vatandaşlık.',
    mebWeeklyHours: 3,
    totalUnitsCount: 7,
    units: [
      {
        id: 'sos-u1',
        unitNumber: 1,
        title: 'Birlikte Yaşamak & Haklarımız',
        description: 'Sosyal rollerimiz, hak ve sorumluluklarımız, çocuk hakları sözleşmesi, sivil toplum kuruluşları ve gruplar.',
        semester: 1,
        topics: [
          {
            title: 'Rollerimiz ve Haklarımız',
            subtopics: ['Ailede evlat, okulda öğrenci, takımda kaleci rolü', 'Hak (sahip olduğumuz yetkiler) ve Sorumluluk (üzerimize düşen görevler)']
          },
          {
            title: 'Çocuk Hakları',
            subtopics: ['BM Çocuk Hakları Sözleşmesi', 'Yaşama, eğitim, sağlık ve oyun oynama hakkı']
          }
        ],
        kazanimlar: [
          'SB.5.1.1. İçinde bulunduğu gruplardaki rollerini ve bu rollere uygun hak ve sorumluluklarını açıklar.',
          'SB.5.1.2. Çocuk haklarının önemini ve ihlali durumunda yapılabilecekleri değerlendirir.'
        ],
        video: {
          title: '5. Sınıf Sosyal Bilgiler - Haklarımız, Sorumluluklarımız ve Çocuk Hakları',
          youtubeId: 'GcmB96gr4pc',
          duration: '14:45',
          instructor: 'Kemal Hoca',
          summary: 'Sosyal katılım, çocuk meclisleri ve rollerin değişimi.'
        },
        quiz: {
          title: 'Hak ve Sorumluluk Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisi bir "sorumluluk" örneğidir?',
              options: [
                'Hastalandığımızda doktora gitmek',
                'Okula gidip eğitim almak',
                'Odamızı toplu ve temiz tutmak',
                'Parkta güvenle oyun oynamak'
              ],
              correctAnswer: 2,
              explanation: 'Odamızı toplamak bizim üzerimize düşen bir ödev/sorumluluktur; diğerleri ise anayasal haklarımızdır.',
              hint: 'Görev olan seçeneği bul.'
            }
          ]
        },
        flashcards: [
          { term: 'Rol', definition: 'Bir kimsenin içinde bulunduğu grupta üzerine düşen görev ve konumdur.' },
          { term: 'Sorumluluk', definition: 'Kişinin kendi davranışlarının ve görevlerinin sonuçlarını üstlenmesidir.' }
        ],
        aiStudyPrompts: [
          'Bir 5. sınıf öğrencisinin gün içinde üstlendiği 4 farklı rolü ve sorumluluklarını yaz.'
        ]
      },
      {
        id: 'sos-u2',
        unitNumber: 2,
        title: 'Tarihe Yolculuk: Anadolu ve Mezopotamya Medeniyetleri',
        description: 'Anadolu Medeniyetleri (Hititler, Frigler, Lidyalılar, Urartular, İyonlar) ve Mezopotamya Medeniyetleri (Sümerler, Babiller, Asurlar); Tarihî mirasımız.',
        semester: 1,
        topics: [
          {
            title: 'Mezopotamya Medeniyetleri',
            subtopics: ['Sümerler: Yazının icadı (çivi yazısı), Ziggurat tapınakları, tekerlek', 'Babiller: Hammurabi Kanunları, Asma Bahçeleri', 'Asurlar: İlk kütüphane (Ninova), Anadolu’ya yazıyı getiren tüccarlar']
          },
          {
            title: 'Anadolu Medeniyetleri',
            subtopics: ['Hititler: Başkent Hattuşa, Pankuş meclisi, ilk yazılı antlaşma Kadeş', 'Frigler: Başkent Gordion, Tarım koruma yasaları, Fibula çengelli iğne', 'Lidyalılar: Parayı icat edenler, Kral Yolu', 'Urartular: Başkent Tuşpa (Van), Şamran su kanalları, taş işçiliği', 'İyonlar: Efes, Milet, özgür düşünce, bilim insanları (Tales, Pisagor)']
          }
        ],
        kazanimlar: [
          'SB.5.2.1. Anadolu ve Mezopotamya medeniyetlerinin insanlık tarihine katkılarını açıklar.',
          'SB.5.2.2. Çevresindeki doğal varlıklar ile tarihî mekân ve nesneleri tanır ve koruma bilinci geliştirir.'
        ],
        video: {
          title: '5. Sınıf Sosyal - Anadolu ve Mezopotamya Medeniyetleri Kodlama Tekniği',
          youtubeId: 'QZTi2mBcsmw',
          duration: '18:30',
          instructor: 'Kemal Hoca',
          summary: 'Hititler, Lidyalılar ve Sümerlerin en kritik buluşlarını hafıza çivileriyle ezberleme.'
        },
        quiz: {
          title: 'İlk Çağ Medeniyetleri Testi',
          questions: [
            {
              id: 1,
              question: 'Ticareti kolaylaştırmak amacıyla parayı icat eden ve Sardes’ten başlayan ünlü "Kral Yolu"nu yapan Anadolu uygarlığı hangisidir?',
              options: ['Hititler', 'Frigler', 'Lidyalılar', 'Urartular'],
              correctAnswer: 2,
              explanation: 'Lidyalılar takas usulüne son verip parayı icat etmiş ve zengin bir ticaret devleti olmuşlardır.',
              hint: 'Parayı kim buldu?'
            },
            {
              id: 2,
              question: 'Çivi yazısını icat ederek tarihi çağları başlatan ve Ziggurat adı verilen çok katlı tapınaklar inşa eden Mezopotamya uygarlığı hangisidir?',
              options: ['Babiller', 'Sümerler', 'Asurlar', 'İyonlar'],
              correctAnswer: 1,
              explanation: 'Sümerler M.Ö. 3200 civarında çivi yazısını bulmuş ve Zigguratların üst katını rasathane (gözlemevi) olarak kullanmışlardır.',
              hint: 'Yazıyı icat eden medeniyet.'
            }
          ]
        },
        flashcards: [
          { term: 'Ziggurat', definition: 'Sümerler tarafından yapılan; alt katı depo, orta katı okul ve ibadethane, en üst katı ise gözlemevi olarak kullanılan çok katlı tapınaktır.' },
          { term: 'Kadeş Antlaşması', definition: 'Hititler ile Mısırlılar arasında imzalanan tarihin bilinen ilk yazılı barış antlaşmasıdır.' },
          { term: 'Fibula', definition: 'Frigler tarafından yapılan ve günümüzdeki çengelli iğnenin atası sayılan madeni takıdır.' }
        ],
        aiStudyPrompts: [
          'Anadolu medeniyetlerini (Hitit, Frig, Lidya, Urartu, İyon) akılda tutmak için eğlenceli bir şifreleme hikayesi anlat.'
        ]
      },
      {
        id: 'sos-u3',
        unitNumber: 3,
        title: 'Evimiz Dünya: Doğal Varlıklarımız, Tarihî Eserler ve Harita',
        description: 'Doğal varlıklar (Peri Bacaları, Pamukkale), tarihî mekanlar ve yapıtlar, harita unsurları (ölçek, lejant), iklim türleri ve bitki örtüsü.',
        semester: 1,
        topics: [
          {
            title: 'Doğal Varlıklar ve Tarihî Zenginliklerimiz',
            subtopics: ['Doğal varlık (insan eli değmeden oluşan: şelale, göl, traverten)', 'Tarihî eser, nesne ve mekân farkı (saray, cami, kılıç, antik kent)']
          },
          {
            title: 'Harita Bilgisi ve İklimlerimiz',
            subtopics: ['Fiziki harita renkleri (Yeşil: alçak yerler, Kahverengi: yüksek dağlar)', 'Karadeniz, Akdeniz ve Karasal iklim özellikleri ve bitki örtüleri']
          }
        ],
        kazanimlar: [
          'SB.5.3.1. Ülkemizin çeşitli yerlerindeki doğal varlıklar ile tarihî mekânları ayırt eder.',
          'SB.5.3.2. Harita üzerindeki temel sembolleri ve renkleri doğru yorumlar.',
          'SB.5.3.3. Türkiye’de görülen iklim tiplerinin insan yaşamına etkilerini analiz eder.'
        ],
        video: {
          title: '5. Sınıf Sosyal - Doğal Varlıklar, Tarihî Mekanlar ve Harita Renkleri',
          youtubeId: 'sfiZkMB6qg8',
          duration: '16:15',
          instructor: 'Kemal Hoca',
          summary: 'Fiziki haritadaki renkler yükseltiyi gösterir; ormanları veya çölleri değil! Şifreler ve örnekler.'
        },
        quiz: {
          title: 'Doğal Varlıklar ve İklim Testi',
          questions: [
            {
              id: 1,
              question: 'Fiziki bir haritada "kahverengi" renk neyi gösterir?',
              options: ['Ormanlık alanları', 'Yüksek dağlık bölgeleri', 'Verimli tarım arazilerini', 'Kurak çölleri'],
              correctAnswer: 1,
              explanation: 'Fiziki haritada renkler bitki örtüsünü değil, sadece deniz seviyesine göre yükseltiyi gösterir. Kahverengi yüksek yerleri (dağları) temsil eder.',
              hint: 'Fiziki haritada renkler yükseltiyi belirtir.'
            }
          ]
        },
        flashcards: [
          { term: 'Fiziki Harita Renkleri', definition: 'Yalnızca yükselti basamaklarını gösterir: Yeşil (0-500m), Sarı (500-1000m), Kahverengi (1000m üzeri dağlar).' },
          { term: 'Doğal Varlık', definition: 'Doğada insan eli değmeden, kendiliğinden oluşmuş yeryüzü şekilleridir (Pamukkale travertenleri, Manavgat şelalesi).' }
        ],
        aiStudyPrompts: [
          'Fiziki haritada yeşil ve kahverengi renklerin neden orman ya da toprak demek olmadığını açıklayan kısa bir diyalog yaz.'
        ]
      },
      {
        id: 'sos-u4',
        unitNumber: 4,
        title: 'Yaşayan Demokrasimiz ve Vatandaşlık (Etkin Vatandaşlık)',
        description: 'Çocuk Haklarına Dair Sözleşme, sivil toplum kuruluşları (STK), merkezi ve yerel yönetim organları (Valilik, Kaymakamlık, Belediye, Muhtarlık).',
        semester: 2,
        topics: [
          {
            title: 'Çocuk Hakları ve Katılım',
            subtopics: ['Yaşama, eğitim, sağlık ve korunma hakları', 'Görüşlerini serbestçe ifade etme ve dinlenme hakkı']
          },
          {
            title: 'Yönetim Birimlerimiz & Sivil Toplum',
            subtopics: ['Merkezi yönetim: Bakanlıklar, Valilik (il), Kaymakamlık (ilçe)', 'Yerel yönetim: Belediye Başkanı, Muhtar', 'STK’lar: Kızılay, Yeşilay, TEMA']
          }
        ],
        kazanimlar: [
          'SB.5.4.1. Çocuk haklarının kullanımına ve ihlallerine yönelik örnekleri inceler.',
          'SB.5.4.2. Yaşadığı yerdeki merkezi ve yerel yönetim birimlerinin görevlerini açıklar.'
        ],
        video: {
          title: '5. Sınıf Sosyal - Çocuk Hakları ve Yerel Yönetimler',
          youtubeId: 'P9rYcaZJoxM',
          duration: '14:20',
          instructor: 'Kemal Hoca',
          summary: 'Vali ile Belediye Başkanı arasındaki farklar ve TEMA, Kızılay gibi STK’ların çalışma alanları.'
        },
        quiz: {
          title: 'Etkin Vatandaşlık Testi',
          questions: [
            {
              id: 1,
              question: 'İlçede devleti temsil eden ve ilçenin en yetkili mülki idare amiri kimdir?',
              options: ['Vali', 'Belediye Başkanı', 'Kaymakam', 'Muhtar'],
              correctAnswer: 2,
              explanation: 'İlde en yetkili yönetici Vali, ilçede ise Kaymakamdır.',
              hint: 'İlçe düzeyindeki mülki amir.'
            }
          ]
        },
        flashcards: [
          { term: 'Vali', definition: 'İçişleri Bakanlığı tarafından ilin başına atanan en yetkili mülki amirdir.' },
          { term: 'STK (Sivil Toplum Kuruluşu)', definition: 'Gönüllülük esasına dayalı, toplumsal sorunlara çözüm üretmek için çalışan resmi olmayan dernek ve vakıflardır (TEMA, Kızılay).' }
        ],
        aiStudyPrompts: [
          'Vali ve Belediye Başkanı arasındaki 3 temel farkı bir 5. sınıf öğrencisine özetle.'
        ]
      },
      {
        id: 'sos-u5',
        unitNumber: 5,
        title: 'Üretim, Dağıtım ve Tüketim (Ekonomik Faaliyetler)',
        description: 'Bölgelerimizin coğrafi özelliklerine göre ekonomik faaliyetler (tarım, hayvancılık, sanayi, turizm, ticaret), bilinçli tüketici ve bütçe.',
        semester: 2,
        topics: [
          {
            title: 'Bölgelerimiz ve Ekonomik Faaliyetler',
            subtopics: ['İç Anadolu’da tahıl tarımı ve küçükbaş hayvancılık', 'Doğu Anadolu’da büyükbaş hayvancılık', 'Akdeniz ve Ege’de seracılık ve turizm', 'Marmara’da sanayi, ticaret ve ulaşım']
          },
          {
            title: 'Bilinçli Tüketici ve Aile Bütçesi',
            subtopics: ['İhtiyaç ve istek ayrımı', 'Gelir-gider dengesi, TSE damgası, garanti belgesi ve fatura alma']
          }
        ],
        kazanimlar: [
          'SB.5.5.1. Yaşadığı çevredeki ekonomik faaliyetlerin coğrafi özelliklerle ilişkisini kurar.',
          'SB.5.5.2. Bilinçli bir tüketici olarak haklarını korur ve bütçe planlaması yapar.'
        ],
        video: {
          title: '5. Sınıf Sosyal - Ekonomik Faaliyetler ve Bilinçli Tüketici',
          youtubeId: 'Tzl_6CwF5gE',
          duration: '15:40',
          instructor: 'Kemal Hoca',
          summary: 'Bölgelere göre ekonomik harita ve alışverişte dikkat edilmesi gereken 5 kural.'
        },
        quiz: {
          title: 'Ekonomi ve Bütçe Testi',
          questions: [
            {
              id: 1,
              question: 'Satın alınan bir ürünün Türk standartlarına uygun ve kaliteli olduğunu gösteren resmi işaret hangisidir?',
              options: ['CE', 'TSE', 'Barkod', 'ISO'],
              correctAnswer: 1,
              explanation: 'TSE (Türk Standardları Enstitüsü) damgası ürünün belirlenen standartlara uygun üretildiğini belgeler.',
              hint: 'Türk Standardları Enstitüsü kısaltması.'
            }
          ]
        },
        flashcards: [
          { term: 'Bilinçli Tüketici', definition: 'Alışveriş yaparken öncelikle ihtiyaçlarını gözeten, son kullanma tarihine bakan, fiş/fatura alan ve haklarını bilen kişidir.' },
          { term: 'Bütçe', definition: 'Gelecekteki belirli bir dönem için gelir ve giderlerin tahmin edilerek dengelenmesi planıdır.' }
        ],
        aiStudyPrompts: [
          'Bir 5. sınıf öğrencisinin haftalık harçlığıyla yapabileceği örnek bir gelir-gider bütçesi tablosu hazırla.'
        ]
      },
      {
        id: 'sos-u6',
        unitNumber: 6,
        title: 'Bilim, Teknoloji ve Toplum',
        description: 'Teknolojinin hayatımıza olumlu ve olumsuz etkileri, internette doğru bilgiye ulaşma, telif hakkı ve patent, bilim insanlarının ortak özellikleri.',
        semester: 2,
        topics: [
          {
            title: 'Teknolojinin Sosyalleşmeye Etkisi & Medya Okuryazarlığı',
            subtopics: ['Yüz yüze iletişimin azalması, sanal bağımlılık riski', 'Güvenilir internet kaynakları (.edu, .gov uzantıları) ve bilgi teyidi']
          },
          {
            title: 'Bilimsel Etik, Telif ve Patent',
            subtopics: ['Kaynakça gösterme zorunluluğu', 'Buluş yapanın haklarını koruyan patent belgesi', 'Bilim insanlarının meraklı, sorgulayıcı ve kararlı yapısı']
          }
        ],
        kazanimlar: [
          'SB.5.6.1. Teknolojik ürünlerin toplumsal ilişkilere ve günlük yaşama etkilerini tartışır.',
          'SB.5.6.2. Bilimsel ve akademik çalışmalarda etik kurallara ve telif haklarına uyar.'
        ],
        video: {
          title: '5. Sınıf Sosyal - Bilim, Telif Hakkı ve İnternette Doğru Bilgi',
          youtubeId: 'GLXzZM7QJ8Y',
          duration: '14:50',
          instructor: 'Kemal Hoca',
          summary: 'Patent nedir? Ödev yaparken intihal (aşırma) yapmamak için kaynakça nasıl yazılır?'
        },
        quiz: {
          title: 'Bilim ve Teknoloji Testi',
          questions: [
            {
              id: 1,
              question: 'Bir buluşun sahibine, o buluşu üretme ve satma hakkını belirli bir süre için veren resmi belgeye ne ad verilir?',
              options: ['Ruhsat', 'Patent', 'Telif Sözleşmesi', 'Sertifika'],
              correctAnswer: 1,
              explanation: 'Buluş sahibinin haklarını tescilleyen resmi belgeye patent denir.',
              hint: 'İcatların korunması için alınan belge.'
            }
          ]
        },
        flashcards: [
          { term: 'Patent', definition: 'Bir buluşun veya icadın kullanım hakkının belirli bir süre sadece mucide ait olduğunu kanıtlayan resmi tescil belgesidir.' },
          { term: 'Telif Hakkı', definition: 'Bir fikir veya sanat eserini meydana getiren kişinin o eser üzerindeki yasal haklarıdır (© sembolü ile gösterilir).' }
        ],
        aiStudyPrompts: [
          'Bilim insanlarının sahip olduğu en belirgin 4 kişisel özelliği 5. sınıf öğrencisine açıkla.'
        ]
      },
      {
        id: 'sos-u7',
        unitNumber: 7,
        title: 'Küresel Bağlantılar: Komşularımız ve Dünya Kültürleri',
        description: 'Türkiye’nin sınır komşuları (Yunanistan, Bulgaristan, Gürcistan, Ermenistan, Nahçıvan/Azerbaycan, İran, Irak, Suriye), dış ticaret (ihracat-ithalat), Türk Cumhuriyetleri.',
        semester: 2,
        topics: [
          {
            title: 'Sınır Komşularımız ve Sınır Kapıları',
            subtopics: ['Batı komşularımız: Yunanistan (İpsala), Bulgaristan (Kapıkule)', 'Doğu ve Güney komşularımız: Gürcistan (Sarp), Nahçıvan (Dilucu), İran (Gürbulak), Suriye (Öncüpınar)']
          },
          {
            title: 'Dış Ticaret ve Türk Dünyası',
            subtopics: ['İhracat (dış satım) ve İthalat (dış alım) dengesi', 'Kardeş Türk Cumhuriyetleri (Azerbaycan, Kazakistan, Özbekistan, Türkmenistan, Kırgızistan)']
          }
        ],
        kazanimlar: [
          'SB.5.7.1. Türkiye’nin komşuları ile olan ekonomik ve kültürel ilişkilerini kavrar.',
          'SB.5.7.2. Türk Cumhuriyetleri ve akraba topluluklarla olan ortak kültürel bağları açıklar.'
        ],
        video: {
          title: '5. Sınıf Sosyal - Sınır Komşularımız ve İhracat-İthalat',
          youtubeId: 'ufA3AIAiaWs',
          duration: '16:00',
          instructor: 'Kemal Hoca',
          summary: 'Türkiye’nin sınır kapıları hafıza haritası ve dış ticaret kavramları.'
        },
        quiz: {
          title: 'Küresel Bağlantılar Testi',
          questions: [
            {
              id: 1,
              question: 'Bir ülkenin başka bir ülkeye kendi ürettiği malları satmasına ne ad verilir?',
              options: ['İthalat (Dış alım)', 'İhracat (Dış satım)', 'Gümrük', 'Enflasyon'],
              correctAnswer: 1,
              explanation: 'İçeriden dışarıya satmaya ihracat (dış satım), dışarıdan satın almaya ise ithalat denir.',
              hint: 'Dışa satmak (İhraç etmek).'
            }
          ]
        },
        flashcards: [
          { term: 'İhracat', definition: 'Bir ülkenin ürettiği ürünleri yabancı ülkelere satmasıdır (Dış satım).' },
          { term: 'İthalat', definition: 'Bir ülkenin kendi ülkesinde bulunmayan veya yetersiz olan malları başka ülkelerden satın almasıdır (Dış alım).' }
        ],
        aiStudyPrompts: [
          'Türkiye’nin en işlek sınır kapısı olan Kapıkule’nin hangi ülkeyle sınırımızda olduğunu ve önemini açıkla.'
        ]
      }
    ],
    termExams: [
      {
        id: 'sos-exam-1',
        title: '5. Sınıf Sosyal Bilgiler 1. Dönem 1. Yazılı Sınavı',
        term: '1. Dönem 1. Yazılı',
        scenario: 'MEB 1. Senaryo (Uygarlıklar ve Haklarımız)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: 'Sümerlerin insanlık uygarlığına kazandırdığı en önemli 2 icadı ve bunların önemini yazınız.',
            type: 'acik_uclu',
            correctAnswer: '1. Çivi yazısı (Tarihi çağları başlattı). 2. Tekerlek (Ulaşımı ve taşımacılığı geliştirdi).',
            solution: 'Yazı bilginin nesilden nesile aktarılmasını sağladı; tekerlek ise ticareti hızlandırdı.',
            points: 25,
            kazanimKodu: 'SB.5.2.1'
          },
          {
            id: 2,
            question: 'Friglerin tarım ve hayvancılığı korumak için çok sert kanunlar yapmasının temel sebebi nedir?',
            type: 'acik_uclu',
            correctAnswer: 'Çünkü Friglerin en temel geçim kaynağı tarım ve hayvancılıktır. Öküz öldüren veya saban kıran kişiye ölüm cezası verilirdi.',
            solution: 'Coğrafi koşulları gereği temel ekonomi tarıma dayalı olduğu için koruyucu sert yasalar yapmışlardır.',
            points: 25,
            kazanimKodu: 'SB.5.2.1'
          }
        ]
      }
    ]
  },

  // 5. İNGİLİZCE (TÜRKİYE YÜZYILI MAARİF MODELİ - THEMES)
  {
    id: 'ingilizce',
    name: 'İngilizce',
    slug: 'ingilizce-5',
    icon: '🇬🇧',
    themeColor: {
      primary: 'from-violet-600 to-purple-600',
      bg: 'bg-violet-50/50 dark:bg-violet-950/20',
      border: 'border-violet-200 dark:border-violet-800',
      badge: 'bg-violet-600 text-white',
      accent: 'text-violet-600 dark:text-violet-400',
    },
    description: 'Theme 1: Hello & School Life; Theme 2: My Town; Theme 3: Games & Hobbies; Theme 4: Daily Routine; Theme 5: Health; Theme 6: Movies; Theme 7: Party Time; Theme 8: Fitness; Theme 9: Animal Shelter; Theme 10: Festivals.',
    mebWeeklyHours: 3,
    totalUnitsCount: 10,
    units: [
      {
        id: 'ing-theme1',
        unitNumber: 1,
        title: 'Theme 1: Hello & School Life',
        description: 'Greetings, personal introductions, countries, nationalities, languages spoken, timetable and school subjects.',
        semester: 1,
        topics: [
          {
            title: 'Greetings & Personal Information',
            subtopics: ['Nice to meet you, My name is..., I am 10 years old', 'Where are you from? -> I am from Turkey']
          },
          {
            title: 'Countries & Nationalities',
            subtopics: ['Turkey - Turkish, England - English, Germany - German, Spain - Spanish, France - French, Italy - Italian']
          },
          {
            title: 'School Subjects & Favorite Classes',
            subtopics: ['Maths, Science, Social Studies, Art, Music, Physical Education (P.E.), English, Information Technology']
          }
        ],
        kazanimlar: [
          'E.5.1.1. Students will be able to introduce themselves and greet others politely.',
          'E.5.1.2. Students will be able to talk about countries, nationalities, and languages.',
          'E.5.1.3. Students will be able to express likes and dislikes regarding school subjects.'
        ],
        video: {
          title: '5. Sınıf İngilizce - Theme 1: Hello & School Life Konu Anlatımı',
          youtubeId: 'RijxD-K4MD8',
          duration: '14:20',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Country vs Nationality distinctions, favorite school subjects dialogue.'
        },
        quiz: {
          title: 'Theme 1: Hello & School Life Quiz',
          questions: [
            {
              id: 1,
              question: 'Complete the dialogue:\n— "Where is Hans from?"\n— "He is from Germany. He is ______."',
              options: ['Germany', 'German', 'Turkish', 'English'],
              correctAnswer: 1,
              explanation: 'Ülke "Germany" olduğunda milliyet "German" (Alman) olur.',
              hint: 'Country (ülke) mi Nationality (milliyet) mi?'
            },
            {
              id: 2,
              question: 'Which subject is related to doing experiments and studying nature?',
              options: ['Art', 'Maths', 'Science', 'Music'],
              correctAnswer: 2,
              explanation: 'Science (Fen Bilimleri) deney yapma ve doğayı inceleme dersidir.',
              hint: 'Laboratuvar ve deney dersi.'
            }
          ]
        },
        flashcards: [
          { term: 'Country vs Nationality', definition: 'Country ülke adıdır (Turkey, Italy). Nationality milliyettir (Turkish, Italian).' },
          { term: 'Timetable', definition: 'Haftalık ders programı ve ders saatleri tablosu.' },
          { term: 'Favorite Subject', definition: 'En çok sevilen okul dersi (My favorite subject is Maths).' }
        ],
        aiStudyPrompts: [
          'Write an engaging 4-line dialogue where two 5th-grade students meet on their first day of middle school.'
        ]
      },
      {
        id: 'ing-theme2',
        unitNumber: 2,
        title: 'Theme 2: My Town & Public Places',
        description: 'Places in a town (hospital, pharmacy, library, bakery, cinema, museum), asking and giving directions, prepositions of place.',
        semester: 1,
        topics: [
          {
            title: 'Buildings and Places in Town',
            subtopics: ['Post office, bookshop, chemist / pharmacy, supermarket, bakery, police station, toy shop']
          },
          {
            title: 'Prepositions of Place',
            subtopics: ['In front of, behind, between, next to, opposite, on the corner of']
          },
          {
            title: 'Giving & Asking for Directions',
            subtopics: ['Excuse me, where is the...?', 'Go straight ahead, turn left, turn right, take the second turning on the right']
          }
        ],
        kazanimlar: [
          'E.5.2.1. Students will be able to describe the locations of public buildings on a map.',
          'E.5.2.2. Students will be able to ask for and give simple directions to locations in town.'
        ],
        video: {
          title: '5th Grade English - Theme 2: My Town, Places & Giving Directions',
          youtubeId: 'EMBeSItnO08',
          duration: '15:10',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Turn left, go straight and prepositions of place with interactive town map.'
        },
        quiz: {
          title: 'Theme 2: My Town Quiz',
          questions: [
            {
              id: 1,
              question: 'Where do you go to buy bread and fresh cakes?',
              options: ['Pharmacy', 'Bakery', 'Library', 'Post Office'],
              correctAnswer: 1,
              explanation: 'Ekmek ve unlu mamuller için fırına (Bakery) gidilir.',
              hint: 'Fırın kelimesinin İngilizcesi.'
            },
            {
              id: 2,
              question: '"The hospital is ______ the bank and the pharmacy." (Hastane banka ile eczanenin ortasındadır)',
              options: ['behind', 'opposite', 'between', 'under'],
              correctAnswer: 2,
              explanation: 'İki nesne veya yerin arasında olduğunu belirtmek için "between" kullanılır.',
              hint: '"... arasında" anlamına gelen yer edatı.'
            }
          ]
        },
        flashcards: [
          { term: 'Opposite', definition: 'Karşısında (The school is opposite the municipal park).' },
          { term: 'Between', definition: 'İki yerin arasında (The library is between the cafe and the bookstore).' },
          { term: 'Go straight ahead', definition: 'Düz git / dosdoğru ilerle.' }
        ],
        aiStudyPrompts: [
          'Give me a step-by-step direction example from a train station to a museum using 5 key phrases.'
        ]
      },
      {
        id: 'ing-theme3',
        unitNumber: 3,
        title: 'Theme 3: Games and Hobbies & Free Time',
        description: 'Indoor and outdoor games (chess, hopscotch, hide and seek, blind man’s buff, dodgeball), expressing abilities with can/can’t and likes/dislikes.',
        semester: 1,
        topics: [
          {
            title: 'Popular Games and Activities',
            subtopics: ['Hopscotch (seksek), Hide and seek (saklambaç), Chess (satranç), Blind man’s buff (körebe), Origami']
          },
          {
            title: 'Expressing Ability (Can / Can’t)',
            subtopics: ['I can play chess well', 'She can’t ride a bicycle', 'Can you play guitar? Yes, I can']
          },
          {
            title: 'Likes & Dislikes (Like / Dislike / Love / Hate)',
            subtopics: ['I like playing board games', 'He hates playing computer games in daytime']
          }
        ],
        kazanimlar: [
          'E.5.3.1. Students will be able to talk about traditional and modern games.',
          'E.5.3.2. Students will be able to express abilities and inabilities with can/can’t.'
        ],
        video: {
          title: '5th Grade English - Theme 3: Games and Hobbies & Can/Can’t',
          youtubeId: 'laOK6rPzd0g',
          duration: '13:40',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Traditional games vocabulary and can/can’t usage.'
        },
        quiz: {
          title: 'Theme 3: Games and Hobbies Quiz',
          questions: [
            {
              id: 1,
              question: 'Which game is played by folding paper into different shapes without using scissors?',
              options: ['Hopscotch', 'Origami', 'Hide and Seek', 'Chess'],
              correctAnswer: 1,
              explanation: 'Kağıt katlama sanatı "Origami"dir.',
              hint: 'Japon kağıt katlama sanatı.'
            }
          ]
        },
        flashcards: [
          { term: 'Hopscotch', definition: 'Seksek oyunu.' },
          { term: 'Blind man’s buff', definition: 'Körebe oyunu.' },
          { term: 'Can / Can’t', definition: 'Yetenek ve yapabilme (Can) veya yapamama (Can’t) durumlarını bildirir.' }
        ],
        aiStudyPrompts: [
          'List 6 popular outdoor games with their Turkish equivalents and simple rule descriptions.'
        ]
      },
      {
        id: 'ing-theme4',
        unitNumber: 4,
        title: 'Theme 4: My Daily Routine & Time',
        description: 'Daily routines (wake up, brush teeth, have breakfast, catch the school bus, do homework, sleep), telling the time (o’clock, half past, quarter to/past), sequence words.',
        semester: 1,
        topics: [
          {
            title: 'Daily Activities & Routines',
            subtopics: ['Get up / Wake up, Wash face, Have breakfast, Go to school, Arrive home, Do homework, Go to bed']
          },
          {
            title: 'Telling the Time',
            subtopics: ['It is seven o’clock, It is half past eight (8:30), It is a quarter past nine (9:15), It is a quarter to ten (9:45)']
          },
          {
            title: 'Sequence Connectors',
            subtopics: ['First, Then, After that, Finally']
          }
        ],
        kazanimlar: [
          'E.5.4.1. Students will be able to describe their regular daily routines in simple present tense.',
          'E.5.4.2. Students will be able to tell the time correctly using o’clock, half past, quarter past/to.'
        ],
        video: {
          title: '5th Grade English - Theme 4: Daily Routine & Telling Time',
          youtubeId: 'xkWmyVFKLBw',
          duration: '16:00',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Daily routine schedule and analog clock reading practice.'
        },
        quiz: {
          title: 'Theme 4: Daily Routine Quiz',
          questions: [
            {
              id: 1,
              question: 'What is "08:30" in English?',
              options: ['It is eight o’clock', 'It is half past eight', 'It is a quarter past eight', 'It is a quarter to eight'],
              correctAnswer: 1,
              explanation: 'Buçuklu saatler "half past" ile söylenir (half past eight).',
              hint: 'Buçuk anlamına gelen ifade.'
            }
          ]
        },
        flashcards: [
          { term: 'Quarter past', definition: 'Çeyrek geçiyor (It is a quarter past seven -> 07:15).' },
          { term: 'Quarter to', definition: 'Çeyrek var (It is a quarter to eight -> 07:45).' },
          { term: 'Half past', definition: 'Buçuk (It is half past eight -> 08:30).' }
        ],
        aiStudyPrompts: [
          'Write a typical morning routine paragraph for a 5th grade middle school student with time expressions.'
        ]
      },
      {
        id: 'ing-theme5',
        unitNumber: 5,
        title: 'Theme 5: Health & Illnesses',
        description: 'Health problems (headache, toothache, stomachache, sore throat, cough, fever, runny nose), giving advice with should/shouldn’t, feelings.',
        semester: 2,
        topics: [
          {
            title: 'Illnesses and Symptoms',
            subtopics: ['I have a terrible headache, She has a cold, He has a fever and broken arm']
          },
          {
            title: 'Giving Advice with Should / Shouldn’t',
            subtopics: ['You should see a doctor, You shouldn’t drink cold water, You should stay in bed and rest']
          }
        ],
        kazanimlar: [
          'E.5.5.1. Expressing common illnesses and asking about someone’s health (What is the matter with you?).',
          'E.5.5.2. Giving advice for illnesses using should / shouldn’t.'
        ],
        video: {
          title: '5th Grade English - Theme 5: Health, Illnesses & Giving Advice',
          youtubeId: 'H6g_TGkfyhM',
          duration: '14:30',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Ache suffix, illnesses dialogue and should/shouldn’t recommendations.'
        },
        quiz: {
          title: 'Theme 5: Health Quiz',
          questions: [
            {
              id: 1,
              question: 'A: "I have a terrible toothache."\nB: "You ______."',
              options: ['should eat candies', 'should see a dentist', 'should go swimming', 'should run fast'],
              correctAnswer: 1,
              explanation: 'Diş ağrısı olan biri diş hekimine (dentist) gitmelidir.',
              hint: 'Diş doktoru kimdir?'
            }
          ]
        },
        flashcards: [
          { term: 'Toothache / Headache', definition: '-ache eki ağrı demektir (Toothache: diş ağrısı, Headache: baş ağrısı).' },
          { term: 'Should / Shouldn’t', definition: 'Tavsiye ve öğüt verirken kullanılır (You should drink warm tea).' }
        ],
        aiStudyPrompts: [
          'Create a dialogue between a doctor and a 5th-grade student with a sore throat.'
        ]
      },
      {
        id: 'ing-theme6',
        unitNumber: 6,
        title: 'Theme 6: Movies & Expressing Likes',
        description: 'Movie types (animation, comedy, action, horror, drama, sci-fi, documentary), movie characters, expressing opinions with interesting/boring/exciting.',
        semester: 2,
        topics: [
          {
            title: 'Movie Genres',
            subtopics: ['Animation, Cartoon, Action, Comedy, Science Fiction, Adventure, Documentary']
          },
          {
            title: 'Describing Characters & Opinions',
            subtopics: ['Brave, funny, frightening, clever, friendly, boring, exciting']
          }
        ],
        kazanimlar: [
          'E.5.6.1. Talking about favorite movie types and movie characters.',
          'E.5.6.2. Stating personal opinions about movies using adjectives.'
        ],
        video: {
          title: '5th Grade English - Theme 6: Movies & Movie Types',
          youtubeId: '66Q5MopruEo',
          duration: '12:45',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Movie genres, expressing likes/dislikes and cinema time.'
        },
        quiz: {
          title: 'Theme 6: Movies Quiz',
          questions: [
            {
              id: 1,
              question: 'Which movie type makes people laugh with funny scenes and jokes?',
              options: ['Horror', 'Comedy', 'Documentary', 'Drama'],
              correctAnswer: 1,
              explanation: 'İnsanları güldüren film türü "Comedy" (Komedi) dir.',
              hint: 'Komik film türü.'
            }
          ]
        },
        flashcards: [
          { term: 'Animation', definition: 'Animasyon / çizgi sinema filmi.' },
          { term: 'Exciting vs Boring', definition: 'Exciting heyecan verici, Boring ise sıkıcı demektir.' }
        ],
        aiStudyPrompts: [
          'Recommend 3 animated family movies in English with short 1-sentence descriptions.'
        ]
      },
      {
        id: 'ing-theme7',
        unitNumber: 7,
        title: 'Theme 7: Party Time',
        description: 'Months of the year, days of the week, ordinal numbers (1st, 2nd, 3rd...), asking and giving permission (Can I...?), ordering a birthday party checklist.',
        semester: 2,
        topics: [
          {
            title: 'Months, Days and Ordinal Numbers',
            subtopics: ['January to December', 'First, second, third, fourth, fifth...', 'When is your birthday? It is in May / on 12th of May']
          },
          {
            title: 'Party Needs and Asking Permission',
            subtopics: ['Candles, balloons, party hats, clown, presents, birthday cake', 'Can I invite my friends? Yes, you can / No, you can’t']
          }
        ],
        kazanimlar: [
          'E.5.7.1. Students will be able to say the months and ordinal numbers in context.',
          'E.5.7.2. Students will be able to ask for permission and make simple invitations for a party.'
        ],
        video: {
          title: '5th Grade English - Theme 7: Party Time & Months, Dates and Permission',
          youtubeId: 'jJJ4tmzRbG8',
          duration: '14:15',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Party invitations, months songs and ordinal number rules.'
        },
        quiz: {
          title: 'Theme 7: Party Time Quiz',
          questions: [
            {
              id: 1,
              question: 'Which month comes immediately after April?',
              options: ['March', 'May', 'June', 'August'],
              correctAnswer: 1,
              explanation: 'Nisan (April) ayından sonra Mayıs (May) gelir.',
              hint: 'Nisan’dan sonraki ay.'
            }
          ]
        },
        flashcards: [
          { term: 'Ordinal Numbers', definition: 'Sıra sayılarıdır: 1st (first), 2nd (second), 3rd (third), 4th (fourth)...' },
          { term: 'Can I...?', definition: 'İzin istemek için kullanılan kibar soru kalıbıdır (Can I have some cake, please?).' }
        ],
        aiStudyPrompts: [
          'Write a colorful birthday invitation card for a 5th-grade student with date, time, and address.'
        ]
      },
      {
        id: 'ing-theme8',
        unitNumber: 8,
        title: 'Theme 8: Fitness & Sports',
        description: 'Sports and fitness activities (swimming, cycling, running, ice-skating, karate, basketball), making suggestions with "Let’s...", expressing likes and dislikes.',
        semester: 2,
        topics: [
          {
            title: 'Sports and Exercises',
            subtopics: ['Play football/basketball, Go swimming/cycling/jogging, Do gymnastics/karate']
          },
          {
            title: 'Making Suggestions',
            subtopics: ['Let’s go roller-skating! Sounds great / Sorry, I can’t', 'How about playing chess?']
          }
        ],
        kazanimlar: [
          'E.5.8.1. Students will be able to name various sports with play/go/do collocations.',
          'E.5.8.2. Students will be able to make, accept, and refuse suggestions for sports.'
        ],
        video: {
          title: '5th Grade English - Theme 8: Fitness, Sports & Making Suggestions',
          youtubeId: 'K1a9yGUdMdk',
          duration: '13:45',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Play vs Go vs Do distinctions with sports, Let’s practice.'
        },
        quiz: {
          title: 'Theme 8: Fitness Quiz',
          questions: [
            {
              id: 1,
              question: 'Complete the sentence:\n"Let’s ______ swimming this afternoon!"',
              options: ['play', 'go', 'do', 'make'],
              correctAnswer: 1,
              explanation: '-ing ile biten spor aktivitelerinde "go" fiili kullanılır (go swimming, go cycling, go jogging).',
              hint: '-ing takısı alan açık hava sporlarında hangi fiil kullanılır?'
            }
          ]
        },
        flashcards: [
          { term: 'Play - Go - Do', definition: 'Toplu oyunlar: Play (football). -ing sporları: Go (swimming). Dövüş/bireysel sporlar: Do (karate).' },
          { term: 'Let’s...', definition: 'Hadi ... yapalım öneri ifadesidir (Let’s ride our bikes!).' }
        ],
        aiStudyPrompts: [
          'Give me 5 sport suggestion sentences with positive and negative replies in English.'
        ]
      },
      {
        id: 'ing-theme9',
        unitNumber: 9,
        title: 'Theme 9: The Animal Shelter',
        description: 'Domestic and wild animals at a shelter, present continuous tense (am/is/are + V-ing), describing actions happening right now, shelter rules.',
        semester: 2,
        topics: [
          {
            title: 'Animals and What They Are Doing',
            subtopics: ['Puppy, kitten, rabbit, parrot, duck, horse, turtle', 'The dog is barking, The cat is sleeping, Birds are flying']
          },
          {
            title: 'Present Continuous Tense & Asking What Someone Is Doing',
            subtopics: ['What is the vet doing? He is examining the injured dog', 'Are you feeding the birds? Yes, I am']
          }
        ],
        kazanimlar: [
          'E.5.9.1. Describing actions happening right now using present continuous tense.',
          'E.5.9.2. Naming shelter animals and discussing caring for animals responsibly.'
        ],
        video: {
          title: '5th Grade English - Theme 9: Animal Shelter & Present Continuous Tense',
          youtubeId: 'EzmMyJv40BY',
          duration: '15:10',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'am/is/are + ing yapısı ve hayvan barınağı diyalogları.'
        },
        quiz: {
          title: 'Theme 9: Animal Shelter Quiz',
          questions: [
            {
              id: 1,
              question: 'Look! The kittens ______ milk in the basket right now.',
              options: ['drink', 'is drinking', 'are drinking', 'drinking'],
              correctAnswer: 2,
              explanation: '"The kittens" çoğul özne olduğu için "are" gelir ve fiile -ing eklenir: "are drinking".',
              hint: 'Çoğul özne (kittens) için am/is/are arasından hangisi seçilir?'
            }
          ]
        },
        flashcards: [
          { term: 'Present Continuous', definition: 'Şu anda yapılmakta olan eylemleri anlatır: am / is / are + Fiil(-ing).' },
          { term: 'Animal Shelter', definition: 'Sahipsiz veya yaralı hayvanların korunduğu hayvan barınağıdır.' }
        ],
        aiStudyPrompts: [
          'Write 4 sentences describing what animals are doing at a busy animal shelter using present continuous tense.'
        ]
      },
      {
        id: 'ing-theme10',
        unitNumber: 10,
        title: 'Theme 10: Festivals & Celebrations',
        description: 'National and religious festivals in Turkey and around the world, numbers from 100 to 1000, festival traditions, singing songs, decorating classrooms.',
        semester: 2,
        topics: [
          {
            title: 'National & Religious Festivals',
            subtopics: ['Children’s Day (23 April), Republic Day (29 October), Victory Day, Ramadan Feast, Sacrifice Feast', 'Independence Day, Halloween, Chinese New Year']
          },
          {
            title: 'Big Numbers & Celebrations',
            subtopics: ['One hundred (100), Five hundred (500), One thousand (1000)', 'Wave flags, read poems, perform folk dances, wear traditional costumes']
          }
        ],
        kazanimlar: [
          'E.5.10.1. Expressing numbers from 100 up to 1000 correctly in speech and writing.',
          'E.5.10.2. Talking about national and international festivals and festival activities.'
        ],
        video: {
          title: '5th Grade English - Theme 10: Festivals, Numbers (100-1000) & Celebrations',
          youtubeId: 'i5XonshjCWo',
          duration: '16:00',
          instructor: 'Tonguç 5. Sınıf & Ms. Jasmin ELT',
          summary: 'Turkish national festivals in English, big numbers counting game.'
        },
        quiz: {
          title: 'Theme 10: Festivals Quiz',
          questions: [
            {
              id: 1,
              question: 'On 23rd of April, we celebrate ______ in Turkey.',
              options: ['Republic Day', 'Children’s Day', 'Victory Day', 'Democracy Day'],
              correctAnswer: 1,
              explanation: '23 Nisan "National Sovereignty and Children’s Day" (Ulusal Egemenlik ve Çocuk Bayramı) olarak kutlanır.',
              hint: 'Atatürk’ün çocuklara armağan ettiği bayram.'
            }
          ]
        },
        flashcards: [
          { term: 'Children’s Day', definition: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı.' },
          { term: 'Republic Day', definition: '29 Ekim Cumhuriyet Bayramı.' },
          { term: 'One Thousand', definition: '1000 sayısı.' }
        ],
        aiStudyPrompts: [
          'How do 5th-grade students celebrate 23rd April Children’s Day at their school? Write 3 festive sentences in English.'
        ]
      }
    ],
    termExams: [
      {
        id: 'ing-exam-1',
        title: '5th Grade English 1st Term 1st Written Exam (Theme 1 & Theme 2)',
        term: '1. Dönem 1. Yazılı',
        scenario: 'MEB Scenario 1 (Dialogue & Fill-in-the-blanks)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: 'Fill in the blanks with the correct form:\n"A: Where are you from?\nB: I am from Italy. I am ________ (Italian / Italy). My favorite subject is ________ (Science / English) because I love experiments."',
            type: 'acik_uclu',
            correctAnswer: 'Italian / Science',
            solution: 'Nationality: Italian. Experiments (deneyler) involve Science.',
            points: 25,
            kazanimKodu: 'E.5.1.1'
          },
          {
            id: 2,
            question: 'Write simple directions from the school to the pharmacy:\n"Go ________ ahead, turn ________ at the corner, it is next to the post office."',
            type: 'acik_uclu',
            correctAnswer: 'straight / left (or right)',
            solution: '"Go straight ahead" dosdoğru git demektir.',
            points: 25,
            kazanimKodu: 'E.5.2.2'
          }
        ]
      }
    ]
  },

  // 6. DİN KÜLTÜRÜ VE AHLAK BİLGİSİ
  {
    id: 'din-kulturu',
    name: 'Din Kültürü ve Ahlak Bilgisi',
    slug: 'din-kulturu-5',
    icon: '🕌',
    themeColor: {
      primary: 'from-emerald-700 to-green-700',
      bg: 'bg-green-50/50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-700 text-white',
      accent: 'text-green-700 dark:text-green-400',
    },
    description: 'Allah İnancı; Evrendeki Mükemmel Düzen; İhlas Suresi; Ramazan ve Oruç; Adap ve Nezaket; Hz. Muhammed ve Aile Hayatı.',
    mebWeeklyHours: 2,
    totalUnitsCount: 5,
    units: [
      {
        id: 'din-u1',
        unitNumber: 1,
        title: 'Allah İnancı',
        description: 'Evrendeki mükemmel düzen, Allah’ın varlığı ve birliği, Allah’ın güzel isimleri (Esma-i Hüsna: Rahman, Rahim, Alim, Semi, Basir), İhlas Suresi.',
        semester: 1,
        topics: [
          {
            title: 'Evrendeki Düzen ve Allah’ın Varlığı',
            subtopics: ['Gece ile gündüzün birbirini izlemesi, mevsimler, canlıların mükemmel yaratılışı']
          },
          {
            title: 'Allah’ın Sıfatları ve İsimleri',
            subtopics: ['Semi (Her şeyi işiten), Basir (Her şeyi gören), Alim (Her şeyi bilen), Kadir (Her şeye gücü yeten)']
          },
          {
            title: 'Bir Dua ve Sure: İhlas Suresi',
            subtopics: ['Tevhit inancı (Allah’ın bir ve tek olması) ve surenin Türkçe anlamı']
          }
        ],
        kazanimlar: [
          'DKAB.5.1.1. Evrendeki mükemmel düzen ile Allah’ın varlığı ve birliği arasında bağ kurar.',
          'DKAB.5.1.2. Allah’ın Rahman, Rahim, Alim, Semi ve Basir isimlerinin anlamlarını açıklar.',
          'DKAB.5.1.3. İhlas suresini okur ve anlamını ana hatlarıyla açıklar.'
        ],
        video: {
          title: '5. Sınıf Din Kültürü - Allah İnancı ve İhlas Suresi',
          youtubeId: 'Egpbz7dpbFs',
          duration: '13:50',
          instructor: 'Ahmet Hoca',
          summary: 'Evrendeki ölçü ve denge, Allah’ın sıfatlarının günlük hayatımıza yansıması.'
        },
        quiz: {
          title: 'Allah İnancı Testi',
          questions: [
            {
              id: 1,
              question: 'Allah’ın "her şeyi eksiksiz işitmesi" anlamına gelen güzel ismi hangisidir?',
              options: ['Basir', 'Semi', 'Alim', 'Kadir'],
              correctAnswer: 1,
              explanation: 'Semi: Her şeyi işitendir. Basir: Her şeyi görendir. Alim: Her şeyi bilendir.',
              hint: 'İşitme duyusuyla ilgili olan sıfattır.'
            }
          ]
        },
        flashcards: [
          { term: 'Tevhit', definition: 'Allah’ın bir ve tek olduğuna, eşi ve benzeri bulunmadığına inanmaktır.' },
          { term: 'Basir', definition: 'Allah’ın gizli veya açık her şeyi görmesidir.' }
        ],
        aiStudyPrompts: [
          'İhlas Suresi’nin bize öğrettiği en temel mesajı 5. sınıf seviyesinde açıkla.'
        ]
      },
      {
        id: 'din-u2',
        unitNumber: 2,
        title: 'Ramazan ve Oruç',
        description: 'Oruç ibadetinin anlamı, sahur, imsak ve iftar kavramları, teravih namazı, fitre (fıtır sadakası) ve mahya geleneği.',
        semester: 1,
        topics: [
          {
            title: 'Oruç İbadeti ve Temel Kavramlar',
            subtopics: ['İmsak (orucun başlama vakti), İftar (orucun açılma vakti), Sahur yemeği']
          },
          {
            title: 'Ramazan Ayı Geleneklerimiz',
            subtopics: ['Teravih namazı, Mukabele okuma, Mahya (camiler arasına asılan ışıklı yazılar), Fitre']
          }
        ],
        kazanimlar: [
          'DKAB.5.2.1. Ramazan ayı ve orucun bireysel ve toplumsal önemini fark eder.',
          'DKAB.5.2.2. Ramazan ve oruçla ilgili temel kavramları (sahur, imsak, iftar, fitre, teravih) açıklar.'
        ],
        video: {
          title: '5. Sınıf Din Kültürü - Ramazan ve Oruç, İftar, Sahur ve Teravih',
          youtubeId: 'zyxHu9UCdFw',
          duration: '14:20',
          instructor: 'Ahmet Hoca',
          summary: 'İmsak ile iftar vakti arasındaki farklar ve fitre vermenin toplumsal dayanışmaya katkısı.'
        },
        quiz: {
          title: 'Ramazan ve Oruç Testi',
          questions: [
            {
              id: 1,
              question: 'Oruç tutmak amacıyla tan yerinin ağarmasından önce gece yenilen yemeğe ne ad verilir?',
              options: ['İftar', 'Sahur', 'Mukabele', 'İmsak'],
              correctAnswer: 1,
              explanation: 'Oruç tutmak için gece imsak vaktinden önce kalkıp yenen yemeğe sahur denir.',
              hint: 'Gece vakti yenilen bereket yemeği.'
            }
          ]
        },
        flashcards: [
          { term: 'İmsak', definition: 'Tan yerinin ağarmasıyla sabah orucun başlama vaktidir.' },
          { term: 'İftar', definition: 'Akşam ezanının okunmasıyla orucun açıldığı andır.' },
          { term: 'Mahya', definition: 'Ramazan gecelerinde minarelerin arasına gerilen ışıklı güzel söz yazılarıdır.' }
        ],
        aiStudyPrompts: [
          'Ramazan ayında yapılan mahya geleneğini 5. sınıf öğrencisine eğlenceli bir hikaye ile anlat.'
        ]
      },
      {
        id: 'din-u3',
        unitNumber: 3,
        title: 'Adap ve Nezaket',
        description: 'Nezaket kuralları, selamlaşma adabı, sofra adabı, iletişim ve konuşma adabı, Hz. Lokman’ın oğluna öğütleri.',
        semester: 2,
        topics: [
          {
            title: 'Nezaket Kuralları ve Selamlaşma',
            subtopics: ['"Selamün Aleyküm"ün anlamı (Barış ve esenlik üzerinize olsun)', 'Güler yüzlü olmak, teşekkür etmek, özür dilemek']
          },
          {
            title: 'Sofra ve İletişim Adabı',
            subtopics: ['Besmele ile başlamak, sağ elle yemek, israftan kaçınmak', 'Başkalarının sözünü kesmemek, sır saklamak']
          }
        ],
        kazanimlar: [
          'DKAB.5.3.1. Toplumsal hayatta nezaket ve görgü kurallarının önemini açıklar.',
          'DKAB.5.3.2. Selamlaşma ve sofra adabına uygun davranışlar sergiler.'
        ],
        video: {
          title: '5. Sınıf Din Kültürü - Adap ve Nezaket, Selamlaşma Kuralları',
          youtubeId: 'NHS2hAd1AQc',
          duration: '13:30',
          instructor: 'Ahmet Hoca',
          summary: 'Hz. Lokman’ın öğütleri ve günlük hayatta nezaket dili.'
        },
        quiz: {
          title: 'Adap ve Nezaket Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisi iletişim ve konuşma adabına UYGUN bir davranıştır?',
              options: [
                'Başkası konuşurken sözünü kesmek',
                'İnsanlara lakap takarak hitap etmek',
                'Karşımızdaki kişiyi göz teması kurarak dinlemek',
                'Başkalarının gizli hallerini araştırmak'
              ],
              correctAnswer: 2,
              explanation: 'Karşıdaki kişiyi dikkatle ve saygıyla dinlemek en temel nezaket kuralıdır.',
              hint: 'Doğru ve saygılı olan davranışı seç.'
            }
          ]
        },
        flashcards: [
          { term: 'Adap', definition: 'Toplumda insanların birbirleriyle olan ilişkilerinde uymaları gereken görgü ve terbiye kurallarıdır.' },
          { term: 'Selamlaşma', definition: 'Karşılaşıldığında iyi dilek ve barış temennisinde bulunmaktır.' }
        ],
        aiStudyPrompts: [
          'Bir 5. sınıf öğrencisi için okulda ve evde uyulması gereken 5 nezaket kuralı maddesi yaz.'
        ]
      },
      {
        id: 'din-u4',
        unitNumber: 4,
        title: 'Hz. Muhammed ve Aile Hayatı',
        description: 'Peygamberimizin aile sevgisi, çocuklara ve torunlarına (Hz. Hasan ve Hz. Hüseyin) şefkati, aile içi istişare ve yardımlaşma.',
        semester: 2,
        topics: [
          {
            title: 'Hz. Muhammed’in Aile İçi Örnekliği',
            subtopics: ['Ev işlerinde ailesine yardım etmesi', 'Aile bireylerine değer vermesi ve fikirlerini sorması (İstişare)']
          },
          {
            title: 'Çocuklara ve Torunlarına Sevgisi',
            subtopics: ['Çocuklara selam vermesi, onlarla şakalaşması, öpüp koklaması']
          }
        ],
        kazanimlar: [
          'DKAB.5.4.1. Hz. Muhammed’in aile bireylerine yönelik sevgi ve saygılı tutumunu örnek alır.',
          'DKAB.5.4.2. Aile içi kararlarda istişare (danışma) kültürünün önemini kavrar.'
        ],
        video: {
          title: '5. Sınıf Din Kültürü - Hz. Muhammed’in Aile Hayatı ve Çocuk Sevgisi',
          youtubeId: 'AjbthikZyqU',
          duration: '15:10',
          instructor: 'Ahmet Hoca',
          summary: 'İstişare kavramı ve peygamberimizin torunları Hasan ve Hüseyin ile oyunları.'
        },
        quiz: {
          title: 'Hz. Muhammed ve Ailesi Testi',
          questions: [
            {
              id: 1,
              question: 'Bir konuda karar vermeden önce o konuyu bilenlerle konuşup fikir alışverişinde bulunmaya ne ad verilir?',
              options: ['İstişare', 'İhsan', 'İnfak', 'Tevhit'],
              correctAnswer: 0,
              explanation: 'Danışma ve fikir alışverişi yapmaya "istişare" denir.',
              hint: 'Fikir alışverişinde bulunmak, danışmak.'
            }
          ]
        },
        flashcards: [
          { term: 'İstişare', definition: 'Bir konu hakkında doğru karara varmak için başkalarının görüş ve düşüncelerine başvurmaktır.' },
          { term: 'Ehlibeyt', definition: 'Peygamber Efendimiz Hz. Muhammed’in ev halkı ve ailesidir.' }
        ],
        aiStudyPrompts: [
          'Peygamberimizin çocuklara gösterdiği şefkati anlatan bilinen bir hatırasını anlat.'
        ]
      },
      {
        id: 'din-u5',
        unitNumber: 5,
        title: 'Çevremizde Dinin İzleri: Mimari, Musiki ve Edebiyat',
        description: 'Mimarimizde caminin bölümleri (minare, kubbe, mihrap, minber, vaaz kürsüsü, şadırvan), dinî musiki (ezan, salâ, ilahi) ve edebiyattaki izler.',
        semester: 2,
        topics: [
          {
            title: 'Camimizin Bölümleri',
            subtopics: ['Dış bölümler: Minare, Kubbe, Şadırvan', 'İç bölümler: Mihrap (imamın namaz kıldırdığı yer), Minber (cuma hutbesi okunan merdivenli yer), Kürsü']
          },
          {
            title: 'Musiki ve Edebiyatımızda Dini Motifler',
            subtopics: ['Ezan makamları ve salâ', 'Yunus Emre ve Mevlana’nın sevgi dolu şiirleri']
          }
        ],
        kazanimlar: [
          'DKAB.5.5.1. Kültürümüzdeki mimari yapılarda dinin izlerini tanır ve caminin bölümlerini açıklar.',
          'DKAB.5.5.2. Musikimiz ve edebiyatımızdaki dinî unsurları ayırt eder.'
        ],
        video: {
          title: '5. Sınıf Din Kültürü - Caminin Bölümleri (Mihrap, Minber, Kubbe, Şadırvan)',
          youtubeId: 'p3z_ZrSHh-c',
          duration: '14:40',
          instructor: 'Ahmet Hoca',
          summary: 'Caminin iç ve dış mimari bölümleri ve görevleri.'
        },
        quiz: {
          title: 'Çevremizde Dinin İzleri Testi',
          questions: [
            {
              id: 1,
              question: 'Camilerde cuma ve bayram günleri imamın hutbe okumak için çıktığı yüksek merdivenli yere ne ad verilir?',
              options: ['Mihrap', 'Minber', 'Vaaz Kürsüsü', 'Şadırvan'],
              correctAnswer: 1,
              explanation: 'Merdivenli yüksek yere "Minber" denir. İmamın namaz kıldırdığı oyuk yer ise "Mihrap"tır.',
              hint: 'Merdivenle çıkılan hutbe yeri.'
            }
          ]
        },
        flashcards: [
          { term: 'Mihrap', definition: 'Caminin kıble yönündeki duvarında bulunan ve imamın namaz kıldırırken durduğu girintili kısımdır.' },
          { term: 'Minber', definition: 'Cuma ve bayram namazlarında hatibin hutbe okumak için çıktığı basamaklı yapıdır.' },
          { term: 'Şadırvan', definition: 'Cami avlusunda abdest almak için yapılan kubbeli ve musluklu su tesisidir.' }
        ],
        aiStudyPrompts: [
          'Mihrap ile minber arasındaki farkı 5. sınıf öğrencisine görsel hafıza ipucuyla açıkla.'
        ]
      }
    ],
    termExams: [
      {
        id: 'din-exam-1',
        title: '5. Sınıf Din Kültürü 1. Dönem 1. Yazılı Sınavı',
        term: '1. Dönem 1. Yazılı',
        scenario: 'MEB 1. Senaryo (Açık Uçlu Esma ve Kavram Soruları)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: 'Evrendeki düzen ve uyuma çevremizden 2 somut örnek veriniz.',
            type: 'acik_uclu',
            correctAnswer: '1. Gece ile gündüzün kusursuz bir sırayla ardı ardına gelmesi. 2. Soluduğumuz havadaki oksijen ve karbondioksit dengesinin bitkiler ve hayvanlar arasında korunması.',
            solution: 'Evrendeki hassas dengeler tesadüf eseri olamaz, yaratıcının iradesini gösterir.',
            points: 25,
            kazanimKodu: 'DKAB.5.1.1'
          }
        ]
      }
    ]
  },

  // 7. BİLİŞİM TEKNOLOJİLERİ VE YAZILIM
  {
    id: 'bilisim-teknolojileri',
    name: 'Bilişim Teknolojileri ve Yazılım',
    slug: 'bilisim-5',
    icon: '💻',
    themeColor: {
      primary: 'from-cyan-600 to-blue-600',
      bg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
      border: 'border-cyan-200 dark:border-cyan-800',
      badge: 'bg-cyan-600 text-white',
      accent: 'text-cyan-600 dark:text-cyan-400',
    },
    description: 'Bilişim Teknolojileri ve Dijital Vatandaşlık; Güvenli İnternet; Algoritma ve Problem Çözme; Blok Tabanlı Kodlama (Scratch).',
    mebWeeklyHours: 2,
    totalUnitsCount: 5,
    units: [
      {
        id: 'bilisim-u1',
        unitNumber: 1,
        title: 'Dijital Vatandaşlık ve Güvenli İnternet',
        description: 'Donanım ve yazılım, işletim sistemleri, güçlü parola oluşturma, dijital ayak izi, telif hakları ve siber zorbalık.',
        semester: 1,
        topics: [
          {
            title: 'Donanım ve Yazılım',
            subtopics: ['Giriş birimleri (klavye, fare, mikrofon) & Çıkış birimleri (ekran, yazıcı, hoparlör)', 'Dahili ve harici donanımlar']
          },
          {
            title: 'Güvenli İnternet & Dijital Ayak İzi',
            subtopics: ['Güçlü şifre kuralları (en az 8 karakter, büyük-küçük harf, sembol)', 'Siber zorbalığa karşı korunma yolları']
          }
        ],
        kazanimlar: [
          'BT.5.1.1. Donanım ve yazılım kavramlarını ayırt eder ve işlevlerini açıklar.',
          'BT.5.1.2. Dijital kimlik ve güçlü parola oluşturma kriterlerini uygular.',
          'BT.5.1.3. Siber zorbalık karşısında doğru tutum sergiler ve kişisel verilerini korur.'
        ],
        video: {
          title: '5. Sınıf Bilişim - Donanım, Yazılım ve Güvenli İnternet',
          youtubeId: 'QrnauE5qVX0',
          duration: '14:10',
          instructor: 'Zeynep Hoca',
          summary: 'Giriş-çıkış birimleri oyunu ve güvenli şifre oluşturma püf noktaları.'
        },
        quiz: {
          title: 'Bilişim ve Güvenlik Testi',
          questions: [
            {
              id: 1,
              question: 'Hangisi bilgisayara veri girmemizi sağlayan bir "Giriş Birimi"dir?',
              options: ['Hoparlör', 'Monitör (Ekran)', 'Klavye', 'Yazıcı'],
              correctAnswer: 2,
              explanation: 'Klavye ve fare giriş birimidir; monitör, hoparlör ve yazıcı ise bilgisayardan dışarıya sonuç veren çıkış birimleridir.',
              hint: 'Bilgisayara yazı yazmamızı sağlayan donanımı düşün.'
            }
          ]
        },
        flashcards: [
          { term: 'Donanım', definition: 'Bilgisayarın gözle görülebilen ve elle tutulabilen tüm fiziksel parçalarıdır (Kasa, fare, anakart).' },
          { term: 'Yazılım', definition: 'Donanımın çalışmasını sağlayan programlar ve komutlar dizisidir (Windows, oyunlar, Scratch).' }
        ],
        aiStudyPrompts: [
          '5. sınıf öğrencisi için kırılması imkansız ama akılda kolay tutulan güçlü bir şifre taktiği ver.'
        ]
      },
      {
        id: 'bilisim-u2',
        unitNumber: 2,
        title: 'Algoritma ve Blok Tabanlı Kodlama (Scratch)',
        description: 'Algoritma basamakları, akış şeması, Scratch arayüzü, kuklalar, sahneler, döngüler ve koşul (eğer-ise) blokları ile ilk oyun tasarımı.',
        semester: 2,
        topics: [
          {
            title: 'Algoritma Mantığı',
            subtopics: ['Başla ve Bitir adımları', 'Günlük hayat algoritması (Çay demleme, okula hazırlanma)', 'Hata ayıklama (Debugging)']
          },
          {
            title: 'Scratch ile Kodlama',
            subtopics: ['Olaylar blokları (Tıklandığında)', 'Hareket ve Görünüm blokları', 'Kontrol blokları: Sürekli tekrarla, Eğer ... ise']
          }
        ],
        kazanimlar: [
          'BT.5.2.1. Bir problemin çözümü için adım adım algoritma oluşturur.',
          'BT.5.2.2. Blok tabanlı kodlama ortamında (Scratch) kukla ve sahne oluşturarak etkileşimli hikaye veya oyun geliştirir.'
        ],
        video: {
          title: '5. Sınıf Bilişim - Algoritma Nedir ve Scratch ile İlk Oyun',
          youtubeId: 'Vk4wmiJuMYw',
          duration: '16:40',
          instructor: 'Zeynep Hoca',
          summary: 'Kukla hareket ettirme, puan değişkeni oluşturma ve labirent oyunu.'
        },
        quiz: {
          title: 'Algoritma ve Kodlama Testi',
          questions: [
            {
              id: 1,
              question: 'Bir problemi çözmek veya bir hedefe ulaşmak için adım adım tasarlanan mantıksal işlem sırasına ne ad verilir?',
              options: ['Donanım', 'Algoritma', 'İşletim Sistemi', 'Piksel'],
              correctAnswer: 1,
              explanation: 'Algoritma, kodlamanın temelini oluşturan adım adım çözüm planıdır.',
              hint: 'Adım adım işlem sırası.'
            }
          ]
        },
        flashcards: [
          { term: 'Algoritma', definition: 'Belirli bir problemi çözmek için başından sonuna kadar izlenen kurallar ve adımlar bütünüdür.' },
          { term: 'Döngü (Loop)', definition: 'Bir veya birden fazla komutun belirli bir sayıda ya da sürekli tekrarlanması işlemidir.' }
        ],
        aiStudyPrompts: [
          'Sabah uyanıp okula gitmenin 6 adımlık net bir algoritmasını yaz.'
        ]
      },
      {
        id: 'bilisim-u3',
        unitNumber: 3,
        title: 'İletişim, Araştırma ve İş Birliği Araçları',
        description: 'Arama motorları ve arama operatörleri, e-posta oluşturma ve gönderme kuralları, bulut depolama, dijital ortamda ortak çalışma.',
        semester: 1,
        topics: [
          {
            title: 'İnternette Bilgi Arama Stratejileri',
            subtopics: ['Anahtar kelime kullanımı ve tırnak işareti ("...") ile kesin arama', 'Arama motorlarının çalışma mantığı']
          },
          {
            title: 'E-Posta & Bulut Depolama',
            subtopics: ['Kime (To), Bilgi (CC), Gizli Bilgi (BCC) ve Konu satırı', 'Google Drive, OneDrive ile dosya paylaşımı']
          }
        ],
        kazanimlar: [
          'BT.5.3.1. İnternet üzerinde arama yaparken uygun filtre ve anahtar kelimeleri kullanır.',
          'BT.5.3.2. E-posta hizmetlerini ve bulut depolama araçlarını kurallara uygun biçimde kullanır.'
        ],
        video: {
          title: '5. Sınıf Bilişim - Arama Motoru İpuçları ve E-Posta Gönderme',
          youtubeId: 'M-wOuv1STj4',
          duration: '13:40',
          instructor: 'Zeynep Hoca',
          summary: 'Tırnak işaretiyle nokta atışı Google araması ve e-postada netiket kuralları.'
        },
        quiz: {
          title: 'İnternet ve İletişim Testi',
          questions: [
            {
              id: 1,
              question: 'İnternette tam bir kelime öbeğini eksiksiz aratmak için arama kutusunda hangi işaret içine alınır?',
              options: ['Parantez ( )', 'Tırnak işareti " "', 'Köşeli parantez [ ]', 'Yıldız *'],
              correctAnswer: 1,
              explanation: 'Arama motorlarında kelime grubunun başına ve sonuna tırnak işareti konursa o ifade birebir aranır.',
              hint: 'Tırnak işareti kuralı.'
            }
          ]
        },
        flashcards: [
          { term: 'Bulut Depolama', definition: 'Dosyaların internet üzerindeki güvenli sunucularda saklanması ve her cihazdan erişilebilmesidir (Drive vb.).' },
          { term: 'Netiket', definition: 'İnternet ortamında uyulması gereken nezaket ve saygı kuralları bütünüdür.' }
        ],
        aiStudyPrompts: [
          'Bir 5. sınıf öğrencisinin öğretmenine göndereceği örnek bir kibar e-posta metni yaz.'
        ]
      },
      {
        id: 'bilisim-u4',
        unitNumber: 4,
        title: 'Problem Çözme ve Akış Şemaları',
        description: 'Problemi anlama, parçalara ayırma (ayrıştırma), örüntü tanıma, akış şeması sembolleri (elips, paralelkenar, dikdörtgen, eşkenar dörtgen).',
        semester: 2,
        topics: [
          {
            title: 'Hesaplamalı Düşünme Becerileri',
            subtopics: ['Problemi küçük parçalara bölme (Ayrıştırma)', 'Benzerlikleri fark etme (Örüntü tanıma)']
          },
          {
            title: 'Akış Şeması Sembolleri',
            subtopics: ['Elips: Başla / Dur', 'Dikdörtgen: İşlem ve hesaplama', 'Eşkenar dörtgen: Karar ve koşul verme (Evet/Hayır)']
          }
        ],
        kazanimlar: [
          'BT.5.4.1. Karmaşık bir problemi hesaplamalı düşünme basamaklarıyla çözüme kavuşturur.',
          'BT.5.4.2. Standart akış şeması sembolleriyle bir algoritmayı görselleştirir.'
        ],
        video: {
          title: '5. Sınıf Bilişim - Akış Şeması Sembolleri ve Karar Yapıları',
          youtubeId: 'a1h0HNZ-tq0',
          duration: '15:15',
          instructor: 'Zeynep Hoca',
          summary: 'Elips, dikdörtgen ve baklava dilimi sembolleriyle örnek hava durumu algoritması.'
        },
        quiz: {
          title: 'Akış Şemaları Testi',
          questions: [
            {
              id: 1,
              question: 'Akış şemasında bir "Karar veya Koşul" (Örn: Yağmur yağıyor mu?) belirtmek için hangi geometrik şekil kullanılır?',
              options: ['Dikdörtgen', 'Eşkenar dörtgen (Baklava dilimi)', 'Elips', 'Daire'],
              correctAnswer: 1,
              explanation: 'Eşkenar dörtgen (baklava dilimi) karar ve karşılaştırma durumlarında iki farklı çıkış (Evet/Hayır) için kullanılır.',
              hint: 'Evet/Hayır dallanması yapan şekil.'
            }
          ]
        },
        flashcards: [
          { term: 'Ayrıştırma (Decomposition)', definition: 'Büyük ve karmaşık bir problemi daha kolay çözülebilir küçük alt parçalara ayırma yöntemidir.' },
          { term: 'Akış Şeması', definition: 'Algoritmaların geometrik şekiller ve oklar kullanılarak görselleştirilmiş halidir.' }
        ],
        aiStudyPrompts: [
          'Yağmurlu bir günde şemsiye alıp almama kararını akış şeması mantığıyla adım adım anlat.'
        ]
      },
      {
        id: 'bilisim-u5',
        unitNumber: 5,
        title: 'Dijital Ürün Oluşturma (Kelime İşlemci ve Sunum)',
        description: 'Kelime işlemcide metin biçimlendirme, tablo ekleme, sunum programında slayt düzeni, geçiş efektleri ve animasyonlar.',
        semester: 2,
        topics: [
          {
            title: 'Kelime İşlemci Programları (Word / Docs)',
            subtopics: ['Yazı tipi, boyutu ve rengi ayarlama', 'Hizalama (sola, sağa, ortala, iki yana yasla)', 'Resim ve tablo ekleme']
          },
          {
            title: 'Etkili Sunum Hazırlama (PowerPoint / Slides)',
            subtopics: ['Slayt tasarımı ve renk uyumu (az metin, çok görsel ilkesi)', 'Slayt geçişleri ve nesne animasyonları']
          }
        ],
        kazanimlar: [
          'BT.5.5.1. Amacına uygun bir kelime işlemci belgesi oluşturur ve biçimlendirir.',
          'BT.5.5.2. Görsel tasarım ilkelerine uygun etkili bir dijital sunu tasarlar.'
        ],
        video: {
          title: '5. Sınıf Bilişim - Etkili Sunum Hazırlama ve Kelime İşlemci İpuçları',
          youtubeId: 'fF8tPwgtDrs',
          duration: '14:50',
          instructor: 'Zeynep Hoca',
          summary: 'Bir sunumda yapılmaması gereken 3 büyük hata ve görsel seçimi.'
        },
        quiz: {
          title: 'Dijital Ürün Testi',
          questions: [
            {
              id: 1,
              question: 'Başarılı ve etkili bir sunum hazırlarken hangisi TAVSİYE EDİLMEZ?',
              options: [
                'Slaytları uzun ve küçük yazılı paragraflarla doldurmak',
                'Konuyla alakalı yüksek kaliteli görseller seçmek',
                'Yazı ile arka plan arasında zıt (kontrast) renkler kullanmak',
                'Her slaytta tek bir ana fikre odaklanmak'
              ],
              correctAnswer: 0,
              explanation: 'Slaytlar kitap değildir; uzun paragraflar yerine anahtar kelimeler ve görseller kullanılmalıdır.',
              hint: 'İzleyicinin sıkılacağı durumu düşün.'
            }
          ]
        },
        flashcards: [
          { term: 'Kontrast', definition: 'Arka plan ile metin rengi arasındaki belirgin zıtlıktır (Koyu zemin üzerine beyaz yazı gibi).' },
          { term: 'Animasyon', definition: 'Sunum içerisindeki metin veya resimlere hareketlilik kazandırma efektidir.' }
        ],
        aiStudyPrompts: [
          '5. sınıf fen projesi için 4 slaytlık örnek bir sunum taslağı ve slayt başlıkları öner.'
        ]
      }
    ],
    termExams: [
      {
        id: 'bilisim-exam-1',
        title: '5. Sınıf Bilişim Teknolojileri 1. Dönem 1. Yazılı Sınavı',
        term: '1. Dönem 1. Yazılı',
        scenario: 'MEB 1. Senaryo (Donanım ve Güvenlik Açık Uçlu Sorular)',
        durationMinutes: 40,
        totalPoints: 100,
        questions: [
          {
            id: 1,
            question: 'Bilgisayar donanımlarından 2 giriş birimi ve 2 çıkış birimi yazarak görevlerini kısaca belirtiniz.',
            type: 'acik_uclu',
            correctAnswer: 'Giriş: Klavye (metin girmek), Fare (işaretlemek). Çıkış: Monitör (görüntüyü göstermek), Hoparlör (sesi aktarmak).',
            solution: 'Klavye/fare veri gönderir; monitör/hoparlör veriyi işitilebilir/görülebilir kılar.',
            points: 25,
            kazanimKodu: 'BT.5.1.1'
          }
        ]
      }
    ]
  }
];
