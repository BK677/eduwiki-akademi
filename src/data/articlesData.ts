import { Article } from '../types';

export const CURATED_ARTICLES: Article[] = [
  {
    id: 'art-1-turlama-teknigi',
    title: 'LGS ve YKS\'de Süre Yönetimi: Turlama Tekniği ve Soru Çözme Disiplini',
    subtitle: 'Zor sorulara takılıp vakit kaybetmeyi önleyen, net sayısını 10-15 net artıran bilimsel strateji.',
    category: 'Sınav Stratejileri',
    readTime: '5 dk',
    publishedDate: '22 Eylül 2026',
    author: {
      name: 'Psk. Dan. Zeynep Kaya',
      role: 'LGS & YKS Rehberlik Uzmanı',
      avatar: '👩‍🏫',
    },
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    summary: 'Sınav başarısı yalnızca bilgiye değil, dakikaları nasıl yönettiğinize bağlıdır. Turlama tekniğiyle panik yapmadan tüm soruları tarayabilir, en yüksek net potansiyelinize ulaşabilirsiniz.',
    content: `## Sınavda Neden Zaman Yetmez?

Pek çok öğrenci sınavdan çıktığında şu cümleyi kurar: *"Aslında bildiğim sorular vardı ama son 5 soruya bakmaya vaktim yetmedi..."* 

Bu durum bilginin eksikliğinden değil, **duygusal inatlaşmadan** kaynaklanır. Karşınıza çıkan ilk zor soruyla inatlaşıp 4-5 dakika harcadığınızda, aslında testin sonundaki çok daha kolay ve çantada keklik olan 3 sorunun zamanını çalmış olursunuz.

---

## 3 Turlu Strateji Nasıl Uygulanır?

Turlama tekniği sınav kitapçığını tek seferde çözüp bitirmek yerine, 3 bilinçli aşamada tamamlamayı hedefler:

### 1. Tur: "Kesin Bildiklerim ve Hızlı Çözülenler"
- Soruyu okuduğunuz an çözüm yolu kafanızda canlanıyorsa hemen çözün ve kodlayın.
- Çözümü 1 dakikadan uzun sürecek veya işlem kalabalığı olan soruların yanına **[?]** işareti koyun ve hemen geçin.
- Hiç fikriniz olmayan veya çok yabancı gelen soruların yanına **[-]** işareti koyun.

### 2. Tur: "İşlem Gerektiren ve Düşündüren Sorular"
- İlk tur bittiğinde sınavın %60-%70'i tamamlanmış ve cepte garanti netleriniz oluşmuştur.
- Şimdi yanına **[?]** koyduğunuz sorulara dönün. Zihniniz arka planda bu soruları işlemeye devam ettiği için, bu turda soruların %80'ini çok daha rahat çözebildiğinizi fark edeceksiniz.

### 3. Tur: "Zorlayıcı ve Yeni Nesil Analiz Soruları"
- Kalan tüm sürenizi sadece yanına **[-]** koyduğunuz veya ilk iki turda sonuçlandıramadığınız derin analiz sorularına ayırın.
- Bu aşamada asla panik yapmayın; çünkü zaten sınavın büyük çoğunluğunu başarıyla tamamladınız!

---

## Turlama Tekniğinde En Sık Yapılan 3 Hata

1. **Kitapçıkla İnatlaşmak:** Bir soruya 2 dakikadan fazla harcadığınızda zihniniz yorulur ve moraliniz bozulur.
2. **Soruyu Yarım Bırakıp Kodlamayı Unutmak:** Kodlamayı sayfa sayfa veya bölüm bitimlerinde yapın, asla en sona topluca bırakmayın.
3. **Seçenekleri Elememek:** Yanlış olduğu kesinleşen seçeneklerin üzerini mutlaka çizin; ikinci turda gözünüz yalnızca kalan seçeneklere odaklansın.`,
    keyTakeaways: [
      'Bir soruyla 1.5 dakikadan fazla inatlaşmayın, işaret koyup hemen ilerleyin.',
      'Sınavın en kolay sorusu ile en zor sorusu aynı puan değerine sahiptir.',
      'Turlama tekniğini mutlaka evdeki deneme sınavlarında en az 5 kez prova edin.'
    ],
    proTip: 'Soru yanına koyduğunuz sembolleri standartlaştırın: ? (zaman alıcı), ! (dikkat gerektiren), - (boş bırakılan).',
    tags: ['LGS', 'YKS', 'Zaman Yönetimi', 'Turlama', 'Rehberlik'],
    likesCount: 142,
    featured: true,
  },
  {
    id: 'art-2-pomodoro-aktif-hatirlama',
    title: 'Pomodoro & Aktif Hatırlama: Ezber Değil, Kalıcı Uzun Süreli Hafıza',
    subtitle: 'Saatlerce masa başında oturup unutmaktan kurtaran nörobilim temelli çalışma metodolojisi.',
    category: 'Verimli Çalışma',
    readTime: '4 dk',
    publishedDate: '20 Eylül 2026',
    author: {
      name: 'Doç. Dr. Emre Çelik',
      role: 'Bilişsel Öğrenme Araştırmacısı',
      avatar: '👨‍🔬',
    },
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    summary: 'Kitabın altını renkli kalemlerle çizmek beyni kandırır. Kalıcı öğrenmenin sırrı, bilgiyi pasif okumak yerine hafızadan geri çağırma (Active Recall) antrenmanları yapmaktır.',
    content: `## Beynimiz Nasıl Öğrenir ve Nasıl Unutur?

Alman psikolog Hermann Ebbinghaus'un meşhur **"Unutma Eğrisi"**ne göre, öğrendiğimiz bir bilginin yaklaşık **%70'ini ilk 24 saat içinde** unuturuz. Eğer düzenli aralıklarla tekrar etmezsek, 1 hafta sonra geriye yalnızca kırıntılar kalır.

Peki hem odaklanmayı koruyup hem de bilginin kalıcılığını nasıl %90 seviyesine çıkarabiliriz?

---

## 1. 25/5 Pomodoro Döngüsü ile Dopamin Yönetimi

İnsan beyni aralıksız 2-3 saat boyunca aynı odaklanma seviyesini koruyamaz. 25 dakika tam odaklanma ve 5 dakika mutlak dinlenme (ekrandan uzak) prensibi, beynin ön korteksini dinç tutar:

- **1 Pomodoro:** 25 Dakika tek bir konuya mutlak odak (telefon kapalı).
- **Mola:** 5 Dakika su içme, hafif esneme, derin nefes alma.
- **Büyük Mola:** 4 Pomodoro sonrası 20-30 dakikalık dinlenme.

---

## 2. Aktif Hatırlama (Active Recall) Mucizesi

Çoğu öğrenci konuyu 3 kez baştan sona okur. Bu pasif bir eylemdir ve beyinde *"Ben bunu zaten biliyorum"* yanılsaması (aşinalık tuzağı) yaratır.

### Aktif Hatırlama Nasıl Yapılır?
1. Bir sayfayı okuduktan sonra kitabı hemen kapatın.
2. Boş bir kağıt alın ve aklınızda kalan her şeyi kendi cümlelerinizle yazın veya sesli olarak anlatın.
3. Takıldığınız yerleri açıp kitaptan kontrol edin.
4. Kendi kendinize flashcard (soru-cevap kartları) hazırlayın.

EduWiki Çalışma Araçları sekmesindeki **Pomodoro Sayacı ve Flashcard Sistemi**, tam olarak bu bilimsel döngüyü otomatikleştirmek için tasarlanmıştır.`,
    keyTakeaways: [
      'Pasif okuma yerine kitabı kapatıp bilginizi test edin.',
      '25 dakikalık çalışma blokları yorgunluğu önler, dikkat seviyesini taze tutar.',
      'Öğrendiğiniz günün akşamında 10 dakikalık hızlı tekrar, unutma eğrisini sıfırlar.'
    ],
    proTip: 'Mola anında asla sosyal medyaya girmeyin; sosyal medya beyni dinlendirmez, tam tersine aşırı bilgi bombardımanıyla yorar.',
    tags: ['Pomodoro', 'Hafıza', 'Verimli Çalışma', 'Nörobilim', 'Odaklanma'],
    likesCount: 189,
    featured: true,
  },
  {
    id: 'art-3-gemini-ile-kisisel-ogrenme',
    title: 'Gemini ve Yapay Zekayı Kişisel Özel Ders Hocası Olarak Kullanma Rehberi',
    subtitle: 'Yapay zekaya ödev yaptırmak yerine, sizi Sokratik yöntemle düşündüren akıllı prompt sırları.',
    category: 'Yapay Zeka & Teknoloji',
    readTime: '6 dk',
    publishedDate: '18 Eylül 2026',
    author: {
      name: 'Yazılım & AI Departmanı',
      role: 'EduWiki Teknoloji Ekibi',
      avatar: '🤖',
    },
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    summary: 'Yapay zekadan sadece cevap istemek tembellik yaratır. Doğru komutlarla Gemini’yi size soru soran, hatalarınızı gösteren ve sizi bir üst lige taşıyan sabırlı bir mentora dönüştürebilirsiniz.',
    content: `## Yapay Zeka Öğrenmede Bir Engel mi, Yoksa Süper Güç mü?

Gelişen büyük dil modelleri (Gemini 3.8 Flash ve Gemini 3.1 Pro), eğitim dünyasında yüzyılın en büyük devrimini temsil ediyor. Ancak kritik soru şu: **Öğrenciler bu gücü nasıl kullanmalı?**

Eğer *"Bana bu problemi çöz ve cevabı ver"* derseniz, sınav günü yanınızda yapay zeka olmayacağı için hiçbir şey öğrenemezsiniz. 

Ama *"Bana bu problemin çözüm adımlarını doğrudan söyleme; bana adım adım ipucu vererek cevabı benim bulmamı sağla"* derseniz, dünyanın en sabırlı ve nitelikli özel ders öğretmenine sahip olursunuz!

---

## 4 Altın Prompt Tekniği

### 1. Sokratik Sorgulama Promptu
> *"Bana cebirsel ifadeler konusunda 5. sınıf seviyesinde bir problem sor. Cevabımı kontrol et, yanlışsa doğrudan doğruyu söyleme; nerede mantık hatası yaptığımı soru sorarak bana buldur."*

### 2. Feynman Analoji Tekniği
> *"Fen Bilimleri dersindeki 'fotosentez' konusunu, hiç bilmeyen 10 yaşındaki bir çocuğun hayal edebileceği sevimli bir mutfak veya fabrika analojisiyle açıkla."*

### 3. Çeldirici Analiz Promptu
> *"Bu test sorusundaki B ve D şıklarının neden güçlü birer çeldirici olduğunu ve öğrencilerin hangi tuzaklara düşebileceğini detaylandır."*

### 4. Kodlama Hata Ayıklama (Debug) Promptu
> *"Yazdığım bu Python kodundaki 'IndentationError' hatasının mantığını bana anlat ve bir daha bu hataya düşmemem için pratik bir yöntem göster."*

---

## EduWiki ve Gemini Entegrasyonu

EduWiki platformunda sol menüdeki **"Sesli Etkileşim"** ve **"Canlı Ders Simülasyonu"**, tam olarak bu pedagojik modelleme üzerine inşa edilmiştir. Gemini, sınıf seviyenize göre kelime dağarcığını ve anlatım hızını dinamik olarak ayarlar.`,
    keyTakeaways: [
      'Doğrudan cevabı değil, düşünme sürecini ve ipucunu talep edin.',
      'Gemini\'den kavramları hikayeleştirmesini ve günlük hayat örnekleri vermesini isteyin.',
      'Hatalarınızı yapay zekaya analiz ettirerek zayıf noktalarınızı keşfedin.'
    ],
    proTip: 'Gemini ile çalışırken tahta özetlerini ([TAHTA] bloklarını) not defterinize el yazısıyla geçirmek el-göz-beyin koordinasyonunu ikiye katlar.',
    tags: ['Gemini', 'Yapay Zeka', 'Prompt Mühendisliği', 'Geleceğin Eğitimi', 'EdTech'],
    likesCount: 231,
    featured: true,
  },
  {
    id: 'art-4-maarif-modeli-kazanimlari',
    title: 'Türkiye Yüzyılı Maarif Modeli: Ezberden Becerilere Geçiş ve Yeni Soru Tarzı',
    subtitle: '5. Sınıf ve yeni müfredatla birlikte değişen sınav dili: Kavramsal anlama, analiz ve sentez.',
    category: 'Maarif Modeli',
    readTime: '5 dk',
    publishedDate: '15 Eylül 2026',
    author: {
      name: 'Öğr. Gör. Murat Demir',
      role: 'MEB Maarif Modeli Danışmanı',
      avatar: '📐',
    },
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    summary: 'Yeni Maarif Modeli artık formül ezberleyen öğrencileri değil; veriyi okuyabilen, günlük hayatla ilişki kuran ve eleştirel düşünebilen öğrencileri ödüllendiriyor.',
    content: `## Türkiye Yüzyılı Maarif Modeli Neleri Değiştirdi?

Milli Eğitim Bakanlığı tarafından uygulamaya konulan **Türkiye Yüzyılı Maarif Modeli**, Türk eğitim sisteminde bilgi yüklemesinden **"beceri temelli öğrenmeye"** doğru tarihi bir dönüşümü simgeliyor.

Eski sistemde bir konunun formülünü bilip standart soru kalıbını ezberleyen öğrenci sınavda başarılı olabiliyordu. Ancak yeni modelde soru kalıpları tamamen değişti.

---

## Yeni Nesil Maarif Sorularının 3 Temel Özelliği

### 1. Günlük Yaşam Bağlamı (Gerçek Hayat Senaryoları)
Sorular artık soyut sayılardan ibaret değil. Bir akıllı evin elektrik tüketim grafiği, çevre temizliği için geliştirilen bir robot simülasyonu ya da uzay araştırmaları metinleri soru kökünü oluşturuyor.

### 2. Çoklu Disiplinlerarası Geçiş
Bir Matematik sorusunun içinde Fen Bilimleri deney verileri veya Türkçe paragraf anlama becerisi yer alabiliyor. Öğrencinin okuduğunu hızlı ve doğru anlaması şart.

### 3. Değerler Eğitimi ve Eleştirel Sorgulama
Öğrenciden sadece hesap yapması değil, adalet, tasarruf, çevre duyarlılığı ve bilimsel etik çerçevesinde mantıksal çıkarım yapması bekleniyor.

---

## Öğrenciler Maarif Modeline Nasıl Hazırlanmalı?

1. **Kitap Okuma Alışkanlığı:** Her gün en az 25-30 sayfa kitap okuyan öğrenciler, yeni nesil uzun soruları %40 daha hızlı analiz eder.
2. **Deney ve Simülasyon Takibi:** Formülü doğrudan kabul etmek yerine, *"Bu kural neden böyle?"* sorusunu sormalı ve sanal derslikte simülasyonları incelemelisiniz.
3. **Kavram Haritaları Çıkarmak:** Ünitelerin başındaki temel kavramların birbiriyle ilişkisini şemalarla görselleştirin.`,
    keyTakeaways: [
      'Ezberci yaklaşımlar yeni Maarif Modeli sınavlarında geçerliliğini yitirdi.',
      'Beceri temelli soruları çözmek için okuma hızı ve mantıksal çıkarım şarttır.',
      'EduWiki ünite haritaları MEB maarif kazanımlarına %100 uyumlu olarak kurgulanmıştır.'
    ],
    proTip: 'Yeni nesil sorularda önce soru kökünü (en alttaki koyu yazıyı), ardından grafiği/şekli, en son üstteki metni okuyun.',
    tags: ['Maarif Modeli', 'MEB', 'Yeni Nesil Sorular', '5. Sınıf', 'Eğitim Reformu'],
    likesCount: 164,
    featured: false,
  },
  {
    id: 'art-5-algoritmik-dusunme-kodlama',
    title: 'Bilişim Çağında Algoritmik Zihin: Neden Her Öğrenci Kodlama Mantığı Bilmeli?',
    subtitle: 'Kod yazmak yalnızca bilgisayarcı olmak için değil; karmaşık problemleri parçalara ayırma sanatıdır.',
    category: 'Bilim & Kodlama',
    readTime: '4 dk',
    publishedDate: '12 Eylül 2026',
    author: {
      name: 'Müh. Canan Eren',
      role: 'Robotik & Kodlama Eğitmeni',
      avatar: '💻',
    },
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    summary: 'Steve Jobs’un dediği gibi: "Bu ülkedeki herkes bilgisayar programlamayı öğrenmeli, çünkü insana nasıl düşüneceğini öğretir." Algoritmik düşünme, okul derslerinde de en büyük yardımcınızdır.',
    content: `## Kodlama Aslında Nedir?

Pek çok insan kodlamayı karmaşık yeşil yazılar ve anlamsız İngilizce kelimelerden ibaret zanneder. Oysa kodlama, **günlük hayatta yaptığımız planlamaların en mantıklı ve disiplinli halidir.**

Bir sabah uyanıp okula gitme sürecinizi düşünün:
1. Uyan -> Yatağını düzelt.
2. Elini yüzünü yıka -> Dişlerini fırçala.
3. Kahvaltı yap.
4. Çantanı kontrol et: **Eğer** perşembe günüyse beden eğitimi eşofmanını çantaya koy, **değilse** normal ders kitaplarını al.
5. Evden çık.

İşte bu basit akış tam anlamıyla bir **algoritmadır!**

---

## Kodlamanın Matematik ve Fen Başarısına Katkıları

1. **Problemi Parçalara Ayırma (Decomposition):** 5 satırlık karmaşık bir matematik problemi gördüğünüzde gözünüz korkmaz; problemi küçük ve yönetilebilir parçalara ayırırsınız.
2. **Hata ile Yüzleşme ve Hata Ayıklama (Debugging):** Kod yazarken hata yapmak dünyanın sonu değildir; sadece bir eksikliktir. Kodlama öğrenen çocuk sınavda hata yapmaktan korkmaz, hatasını sakince arar ve düzeltir.
3. **Soyut Düşünme Becerisi:** Değişkenler (variables) ve döngüler (loops), cebirsel denklemlerin temel mantığıyla birebir örtüşür.

EduWiki platformundaki **Kodlama Laboratuvarı**, öğrencilerin Python ve JavaScript dillerini tarayıcı üzerinden anında deneyimlemesini sağlar.`,
    keyTakeaways: [
      'Kodlama zihne sistematik düşünme ve problem çözme disiplini kazandırır.',
      'Hata ayıklama (debug) refleksi, sınavlardaki işlem hatalarını minimize eder.',
      'Blok tabanlı kodlamadan metin tabanlı Python\'a geçiş ortaokul seviyesinde en ideal dönemdir.'
    ],
    proTip: 'Bir algoritma yazarken önce kağıt kalemle akış şeması (flowchart) çizin, sonra bilgisayarda kodlayın.',
    tags: ['Python', 'Algoritma', 'Bilişim', 'Robotik', 'Problem Çözme'],
    likesCount: 118,
    featured: false,
  },
  {
    id: 'art-6-sinav-kaygisi-ve-nefes',
    title: 'Sınav Kaygısıyla Başa Çıkma: 4-7-8 Nefes Egzersizi ve Zihin Ritüelleri',
    subtitle: 'Kalp çarpıntısı ve \'hiçbir şey bilmiyorum\' hissini 90 saniyede sakinleştiren bilimsel yöntemler.',
    category: 'Sınav Stratejileri',
    readTime: '3 dk',
    publishedDate: '10 Eylül 2026',
    author: {
      name: 'Uzm. Klinik Psk. Derya Güneş',
      role: 'Çocuk & Genç Ruh Sağlığı',
      avatar: '🌱',
    },
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    summary: 'Hafif düzeyde kaygı dikkati artırır ve faydalıdır; ancak panik düzeyine çıkan kaygı beynin mantık merkezini kilitler. İşte saniyeler içinde zihni sakinleştiren taktikler.',
    content: `## Sınav Sabahı Neden Midemiz Bulanır veya Kalbimiz Hızla Çarpar?

Sınav öncesinde veya optik form dağıtılırken hissettiğiniz heyecan tamamen doğaldır. Vücudumuz algıladığı tehdide karşı **"Savaş ya da Kaç" (Fight or Flight)** moduna geçer ve adrenalin salgılar.

Ancak nabız çok yükseldiğinde prefrontal korteks (mantıklı düşünen beyin) devre dışı kalır. Bu durumu fizyolojik olarak tersine çevirmek bizim elimizdedir.

---

## Dr. Andrew Weil'in 4-7-8 Nefes Tekniği

Bu teknik parasempatik sinir sistemini doğrudan uyararak kalp atış hızını düşürür:

1. **4 Saniye:** Burnunuzdan sessizce derin nefes alın.
2. **7 Saniye:** Nefesinizi göğsünüzde tutun.
3. **8 Saniye:** Ağzınızdan ıslık çalar gibi yavaşça ve tamamen nefesi verin.
4. Bu döngüyü **4 kez** tekrarlayın (toplam 1.5 dakika sürer).

Bu egzersiz sonrasında ellerinizdeki titremenin durduğunu ve zihninizin berraklaştığını hissedeceksiniz.

---

## 3 Pozitif Zihin Ritüeli

- **İç Diyalog Değişimi:** *"Ya yapamazsam, mahvolurum"* yerine -> *"Ben aylardır emek verdim, bildiklerimi sakin bir şekilde uygulayacağım."*
- **Sadece Önündeki Soruya Odaklan:** Sınavın sonucunu veya akşama ne olacağını düşünme. Tek görevin o an önündeki 1 soruyu anlamak.
- **Kas Gevşetme:** Omuzlarınızı kulaklarınıza doğru 5 saniye sıkın, sonra aniden serbest bırakın.`,
    keyTakeaways: [
      'Kaygı düşmanınız değildir; kontrol edildiğinde odaklanmayı artıran bir yakıttır.',
      '4-7-8 nefes döngüsü sınav esnasında panik anında hayat kurtarır.',
      'Sınav salonuna girmeden önce dikkati geçmişe ya da geleceğe değil, şu ana odaklayın.'
    ],
    proTip: 'Sınav anında takıldığınızda kalemi masaya bırakın, gözlerinizi 10 saniye kapatıp 2 derin nefes alın. Kaybettiğiniz 10 saniye, size 3 doğru soru kazandırır.',
    tags: ['Sınav Kaygısı', 'Nefes Egzersizi', 'Motivasyon', 'Psikoloji', 'Odaklanma'],
    likesCount: 198,
    featured: false,
  },
  {
    id: 'art-7-matematik-yeni-nesil-cozum',
    title: 'Matematikte \'Yeni Nesil\' Soruları Çözmenin 4 Altın Adımı',
    subtitle: 'Uzun paragraflı ve şekilli soruları korkutucu olmaktan çıkaran modelleme yöntemleri.',
    category: 'Sınav Stratejileri',
    readTime: '4 dk',
    publishedDate: '05 Eylül 2026',
    author: {
      name: 'Matematik Eğitmeni Selim Kurt',
      role: 'Olimpiyat & Sınav Koçu',
      avatar: '📊',
    },
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    summary: 'Yeni nesil matematik soruları aslında zor matematik değil, Türkçe okuduğunu anlama ve görseli matematik diline tercüme etme oyunudur.',
    content: `## Öğrenciler Yeni Nesil Sorularda Neden Zorlanıyor?

Geleneksel sorularda formül bellidir: "3x + 5 = 20 ise x kaçtır?" 

Ancak yeni nesil sorularda bir marangozun kestiği tahtalar, bir bahçenin etrafına çekilen çitler veya bir bisikletin tekerlek tur sayısı anlatılır. Öğrenci metni okurken kaybolur.

---

## 4 Aşamalı Çözüm Protokolü

### 1. Adım: Soru Kökünden Başla
Metni okumadan önce en alttaki soru cümlesini okuyun. Böylece metni okurken zihniniz neyi aradığını bilir (örneğin: *"En az kaç metre tel gerekir?"*).

### 2. Adım: Verilenleri ve İstenenleri Listele
Gereksiz süslemeleri kafanızdan atın. Metindeki hikayeyi kenara matematiksel değişken olarak yazın:
- Tahta uzunluğu: 120 cm
- Parça sayısı: 4 eşit parça
- Artan kısım: ?

### 3. Adım: Görseli ve Grafiği Tercüme Et
Sorudaki şekil sadece resim değildir; verinin yarısı o şeklin üzerindedir. Birimlere (metre mi, santimetre mi?) çok dikkat edin.

### 4. Adım: Mantık Kontrolü ve Sağlama
Bulduğunuz sonuç mantıklı mı? Örneğin bir insanın boyunu 4.5 metre veya bir arabanın hızını -80 km bulduysanız kesinlikle işlem hatası yapmışsınızdır.`,
    keyTakeaways: [
      'Uzun soru zor soru demek değildir; aksine içinde çok fazla ipucu barındırır.',
      'Soru kökünü okumadan üstteki hikayeye dalmayın.',
      'Sadeleştirme ve modelleme yeni nesil matematiğin anahtarıdır.'
    ],
    proTip: 'Soru metnindeki sayıların altını değil, yalnızca sayıların yanındaki birimleri (örn: "kg", "dakika", "katı") daire içine alın.',
    tags: ['Matematik', 'Yeni Nesil', 'LGS Matematik', 'Problem Çözme', 'Geometri'],
    likesCount: 175,
    featured: false,
  },
  {
    id: 'art-8-feynman-teknigi-ogrenme',
    title: 'Feynman Tekniği: Bir Konuyu 10 Yaşındaki Birine Anlatır Gibi Öğrenmek',
    subtitle: 'Nobel ödüllü fizikçi Richard Feynman\'ın en karmaşık konuları kalıcı kavramak için geliştirdiği 4 adım.',
    category: 'Verimli Çalışma',
    readTime: '4 dk',
    publishedDate: '01 Eylül 2026',
    author: {
      name: 'Prof. Dr. Deniz Arslan',
      role: 'Fizik & Eğitim Bilimci',
      avatar: '👨‍🏫',
    },
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    summary: '"Bir şeyi basitçe anlatamıyorsanız, onu yeterince iyi anlamamışsınız demektir." Karmaşık terimlerin arkasına saklanmadan gerçek öğrenmeye ulaşın.',
    content: `## Richard Feynman Kimdir ve Bu Yöntem Nereden Çıktı?

Nobel Fizik Ödülü sahibi Richard Feynman, sadece dahi bir bilim insanı değil, aynı zamanda öğrencilerine kuantum fiziğini bile sıradan bir hikaye gibi anlatan muazzam bir öğretmendi. Ona **"Büyük Açıklayıcı"** denirdi.

Feynman, insanların bilmedikleri şeyleri karmaşık mesleki jargonların arkasına saklayarak bildiklerini zannettiklerini savunurdu.

---

## 4 Adımda Feynman Tekniği

### 1. Adım: Konuyu Seçin ve Boş Bir Kağıdın Başına Yazın
Öğrenmek istediğiniz konuyu belirleyin (örneğin: Newton'un Hareket Yasaları, Hücre Bölünmesi, Kesirlerle Bölme).

### 2. Adım: Konuyu 10 Yaşındaki Bir Çocuğa Anlatır Gibi Yazın
Kağıda, sanki karşınızda ilkokul 4. sınıfa giden bir çocuk varmış gibi anlatın. Hiçbir süslü veya ağır terim kullanmayın. Yalın, sade ve günlük hayat örnekleriyle açıklayın.

### 3. Adım: Takıldığınız ve Açıklayamadığınız Noktaları Belirleyin
Yazarken nerede tıkandınız? Hangi kavrama gelince *"Şey... Aslında öyle işte"* dediniz? İşte o tıkandığınız yer, sizin o konudaki **gerçek bilgi eksiğinizdir.**

### 4. Adım: Kaynağa Geri Dönün, Sadeleştirin ve Analojiler Kurun
Tıkandığınız yeri kitaptan veya EduWiki video dersinden tekrar inceleyin. Artık o açığı kapattınız! Şimdi anlatımınızı bir analojiyle taçlandırın.`,
    keyTakeaways: [
      'Ağır terimler kullanmak bilginin değil, ezberin göstergesidir.',
      'Kendi kendine sesli anlatım en etkili aktif öğrenme metodudur.',
      'Bir konuyu ilkokul kardeşinize anlatabiliyorsanız, sınavda o konudan asla soru kaçırmazsınız.'
    ],
    proTip: 'Ayna karşısına geçip veya ses kaydı açıp konuyu 3 dakikada özetlemeyi deneyin. Kendi sesinizi dinlediğinizde nerede bocaladığınızı hemen anlarsınız.',
    tags: ['Feynman Tekniği', 'Hızlı Öğrenme', 'Fizik', 'Kavramsal Anlama', 'Metodoloji'],
    likesCount: 215,
    featured: false,
  },
];
