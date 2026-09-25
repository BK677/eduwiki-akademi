import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeLevel } from '../../types';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Flame,
  RotateCcw,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Brain,
  Award,
  ArrowRight,
  Play,
  Shuffle,
  Volume2,
  Check,
  X
} from 'lucide-react';

// Web Audio API Sound Synthesizer
const playSound = (type: 'correct' | 'wrong' | 'win' | 'click') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.2);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.2);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch {
    // AudioContext failed or blocked by autoplay
  }
};

export const EducationalGames: React.FC = () => {
  const { user, gradeLevel, addXP, showToast } = useApp();

  const [activeGame, setActiveGame] = useState<'math' | 'vocab' | 'memory' | 'anagram' | 'truefalse'>('math');

  // ==========================================
  // GAME 1: MATH SPEED RUN STATE
  // ==========================================
  const [mathScore, setMathScore] = useState(0);
  const [mathStreak, setMathStreak] = useState(0);
  const [mathTimeLeft, setMathTimeLeft] = useState(45);
  const [mathIsPlaying, setMathIsPlaying] = useState(false);
  const [mathQuestion, setMathQuestion] = useState<{ q: string; ans: number; options: number[] }>({
    q: '7 × 8',
    ans: 56,
    options: [54, 56, 48, 64],
  });
  const [mathFeedback, setMathFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Generate Math Problem based on grade
  const generateMathQuestion = () => {
    let qStr = '';
    let answer = 0;
    if (gradeLevel === 'ilkokul') {
      const a = Math.floor(Math.random() * 9) + 2;
      const b = Math.floor(Math.random() * 9) + 2;
      qStr = `${a} × ${b}`;
      answer = a * b;
    } else if (gradeLevel === 'ortaokul') {
      const ops = ['+', '-', '×', 'kare'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      if (op === 'kare') {
        const a = Math.floor(Math.random() * 12) + 2;
        qStr = `${a}² (Karesi)`;
        answer = a * a;
      } else if (op === '×') {
        const a = Math.floor(Math.random() * 12) + 3;
        const b = Math.floor(Math.random() * 9) + 3;
        qStr = `${a} × ${b}`;
        answer = a * b;
      } else {
        const a = Math.floor(Math.random() * 80) + 15;
        const b = Math.floor(Math.random() * 40) + 5;
        qStr = `${a} ${op} ${b}`;
        answer = op === '+' ? a + b : a - b;
      }
    } else {
      const types = ['fonksiyon', 'kare', 'carpim'];
      const t = types[Math.floor(Math.random() * types.length)];
      if (t === 'fonksiyon') {
        const m = Math.floor(Math.random() * 4) + 2;
        const c = Math.floor(Math.random() * 10) + 1;
        const x = Math.floor(Math.random() * 5) + 1;
        qStr = `f(x) = ${m}x + ${c}, f(${x}) = ?`;
        answer = m * x + c;
      } else {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 12) + 4;
        qStr = `${a} × ${b}`;
        answer = a * b;
      }
    }

    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 4) {
      const delta = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = answer + delta;
      if (fake > 0) optionsSet.add(fake);
    }
    const optionsArr = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    setMathQuestion({ q: qStr, ans: answer, options: optionsArr });
  };

  useEffect(() => {
    let timer: any = null;
    if (mathIsPlaying && mathTimeLeft > 0) {
      timer = setInterval(() => {
        setMathTimeLeft((t) => t - 1);
      }, 1000);
    } else if (mathTimeLeft === 0 && mathIsPlaying) {
      setMathIsPlaying(false);
      const earnedXP = Math.max(30, mathScore * 10);
      addXP(earnedXP, 'Matematik Hız Düellosu');
      playSound('win');
      showToast(`Oyun bitti! Skor: ${mathScore} | +${earnedXP} XP kazandınız!`, 'reward');
    }
    return () => clearInterval(timer);
  }, [mathIsPlaying, mathTimeLeft, mathScore]);

  const startMathGame = () => {
    setMathScore(0);
    setMathStreak(0);
    setMathTimeLeft(45);
    setMathFeedback(null);
    generateMathQuestion();
    setMathIsPlaying(true);
    playSound('click');
  };

  const handleMathAnswer = (chosen: number) => {
    if (!mathIsPlaying) return;

    if (chosen === mathQuestion.ans) {
      playSound('correct');
      setMathFeedback('correct');
      setMathScore((s) => s + 1);
      setMathStreak((st) => st + 1);
      setTimeout(() => {
        setMathFeedback(null);
        generateMathQuestion();
      }, 300);
    } else {
      playSound('wrong');
      setMathFeedback('wrong');
      setMathStreak(0);
      setTimeout(() => {
        setMathFeedback(null);
        generateMathQuestion();
      }, 450);
    }
  };

  // ==========================================
  // GAME 2: VOCABULARY & SCIENCE QUEST STATE
  // ==========================================
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabScore, setVocabScore] = useState(0);
  const [vocabFeedback, setVocabFeedback] = useState<number | null>(null);

  const VOCAB_QUESTIONS: Record<GradeLevel, { q: string; options: string[]; correct: number; explanation: string }[]> = {
    ilkokul: [
      { q: 'Gündüzleri gökyüzünde bize ışık ve ısı veren gök cismi hangisidir?', options: ['Ay', 'Güneş', 'Kutup Yıldızı', 'Mars'], correct: 1, explanation: 'Güneş, Dünya’mızın ana ısı ve ışık kaynağıdır.' },
      { q: 'Canlıların nefes almak için havadan aldığı temel gaz nedir?', options: ['Karbondioksit', 'Oksijen', 'Helyum', 'Azot'], correct: 1, explanation: 'Canlılar solunum yaparken oksijen tüketir.' },
      { q: 'Bir üçgenin kaç tane kenarı vardır?', options: ['2', '3', '4', '5'], correct: 1, explanation: 'Üçgen, üç kenarı ve üç köşesi olan geometrik şekildir.' },
      { q: 'Hangisi bir mevsim değildir?', options: ['İlkbahar', 'Sonbahar', 'Ağustos', 'Kış'], correct: 2, explanation: 'Ağustos bir aydır, mevsim değildir.' },
    ],
    ortaokul: [
      { q: 'Bitkilerin güneş ışığı ve klorofil yardımıyla besin üretmesi olayına ne ad verilir?', options: ['Solunum', 'Fotosentez', 'Fermantasyon', 'Terleme'], correct: 1, explanation: 'Fotosentez ile bitkiler su ve karbondioksiti besine çevirir.' },
      { q: 'Bir dik üçgende en uzun kenara (90° karşısındaki kenar) ne ad verilir?', options: ['Açıortay', 'Hipotenüs', 'Kenarortay', 'Yükseklik'], correct: 1, explanation: 'Pisagor teoreminde en uzun kenar hipotenüstür (c² = a² + b²).' },
      { q: 'Vücudumuzdaki genetik bilgiyi taşıyan çift sarmallı molekül nedir?', options: ['RNA', 'Protein', 'DNA', 'Enzim'], correct: 2, explanation: 'DNA (Deoksiribonükleik Asit) genetik şifremizi taşır.' },
      { q: 'Maddenin katı halden doğrudan gaz hale geçmesine ne ad verilir?', options: ['Erime', 'Süblimleşme', 'Buharlaşma', 'Yoğuşma'], correct: 1, explanation: 'Kuru buzun gaza dönüşmesi süblimleşme örneğidir.' },
    ],
    lise: [
      { q: 'Türev kavramı bir eğrinin teğetinin neyini ifade eder?', options: ['Alanını', 'Eğimini', 'Yay uzunluğunu', 'Hacmini'], correct: 1, explanation: 'Bir noktadaki birinci türev, teğet doğrusunun eğimini verir (m = f’(x)).' },
      { q: 'Hücrede hücresel solunum ve ATP (enerji) üretiminin yapıldığı organel hangisidir?', options: ['Ribozom', 'Mitokondri', 'Golgi', 'Koful'], correct: 1, explanation: 'Mitokondri hücrenin enerji santralidir.' },
      { q: 'Işığın boşluktaki hızı yaklaşık kaç km/s kabul edilir?', options: ['150.000', '300.000', '450.000', '3.000'], correct: 1, explanation: 'Işık hızı c ≈ 3 × 10⁸ m/s = 300.000 km/s olarak alınır.' },
      { q: 'Periyodik tabloda atom numarası 1 olan en hafif element hangisidir?', options: ['Helyum', 'Hidrojen', 'Lityum', 'Karbon'], correct: 1, explanation: 'Hidrojen (H) atom numarası 1 olan elementtir.' },
    ],
  };

  const handleVocabAnswer = (chosenIndex: number) => {
    if (vocabFeedback !== null) return;
    setVocabFeedback(chosenIndex);

    const currentQ = (VOCAB_QUESTIONS[gradeLevel] || VOCAB_QUESTIONS.ortaokul)[vocabIndex];
    if (chosenIndex === currentQ.correct) {
      playSound('correct');
      setVocabScore((s) => s + 1);
      addXP(15, 'Doğru kavram cevabı');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      setVocabFeedback(null);
      const totalQ = (VOCAB_QUESTIONS[gradeLevel] || VOCAB_QUESTIONS.ortaokul).length;
      if (vocabIndex + 1 < totalQ) {
        setVocabIndex((i) => i + 1);
      } else {
        playSound('win');
        showToast(`Tebrikler! Kavram testini tamamladınız: ${vocabScore + (chosenIndex === currentQ.correct ? 1 : 0)}/${totalQ} Doğru`, 'reward');
        setVocabIndex(0);
      }
    }, 1200);
  };

  // ==========================================
  // GAME 3: MEMORY MATCH STATE
  // ==========================================
  const MEMORY_PAIRS: Record<GradeLevel, { id: number; key: string; val: string }[]> = {
    ilkokul: [
      { id: 1, key: '2 × 5', val: '10' },
      { id: 2, key: '3 × 4', val: '12' },
      { id: 3, key: 'Dünya', val: 'Mavi Gezegen' },
      { id: 4, key: 'Güneş', val: 'Işık & Isı' },
    ],
    ortaokul: [
      { id: 1, key: 'H₂O', val: 'Su Molekülü' },
      { id: 2, key: 'c² = a² + b²', val: 'Pisagor Teoremi' },
      { id: 3, key: 'F = m · a', val: 'Newton 2. Yasa' },
      { id: 4, key: 'Mitoz', val: '2 Yeni Hücre' },
    ],
    lise: [
      { id: 1, key: 'E = m · c²', val: 'Kütle-Enerji Eşitliği' },
      { id: 2, key: 'sin²x + cos²x', val: '1' },
      { id: 3, key: 'd/dx (x²)', val: '2x' },
      { id: 4, key: 'PV = nRT', val: 'İdeal Gaz Yasası' },
    ],
  };

  interface CardItem {
    uid: string;
    pairId: number;
    text: string;
    isMatched: boolean;
  }

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const initMemoryGame = () => {
    const pairs = MEMORY_PAIRS[gradeLevel] || MEMORY_PAIRS.ortaokul;
    const flatCards: CardItem[] = [];
    pairs.forEach((p) => {
      flatCards.push({ uid: `${p.id}-key`, pairId: p.id, text: p.key, isMatched: false });
      flatCards.push({ uid: `${p.id}-val`, pairId: p.id, text: p.val, isMatched: false });
    });
    setCards(flatCards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMemoryMoves(0);
    setMemoryWon(false);
  };

  useEffect(() => {
    initMemoryGame();
  }, [gradeLevel]);

  const handleCardClick = (index: number) => {
    if (cards[index].isMatched || selectedCards.includes(index) || selectedCards.length === 2) return;
    playSound('click');

    const nextSelected = [...selectedCards, index];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextSelected;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        playSound('correct');
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) => (idx === firstIdx || idx === secondIdx ? { ...c, isMatched: true } : c))
          );
          setSelectedCards([]);
          addXP(20, 'Hafıza kartı eşleşmesi');

          // Check if won
          const remaining = cards.filter((c, idx) => !c.isMatched && idx !== firstIdx && idx !== secondIdx);
          if (remaining.length === 0) {
            setMemoryWon(true);
            playSound('win');
            addXP(50, 'Hafıza oyunu tamamlama');
            showToast('Tebrikler! Tüm kartları eşleştirdiniz! +50 XP kazandınız!', 'reward');
          }
        }, 500);
      } else {
        playSound('wrong');
        setTimeout(() => {
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // ==========================================
  // GAME 4: ANAGRAM & KELİME AVI (YENİ OYUN!)
  // ==========================================
  const ANAGRAM_WORDS: Record<GradeLevel, { term: string; hint: string }[]> = {
    ilkokul: [
      { term: 'GEZEGEN', hint: 'Güneşin etrafında dolanan gök cismi' },
      { term: 'OKSİJEN', hint: 'Yaşamak için içimize çektiğimiz gaz' },
      { term: 'ÜÇGEN', hint: 'Üç kenarı ve üç köşesi olan geometrik şekil' },
      { term: 'İSKELET', hint: 'Vücudumuza diklik veren kemik çatısı' },
    ],
    ortaokul: [
      { term: 'FOTOSENTEZ', hint: 'Bitkilerin ışıkla besin üretmesi' },
      { term: 'HİPOTENÜS', hint: 'Dik üçgende 90 derecenin karşısındaki en uzun kenar' },
      { term: 'SÜBLİMLEŞME', hint: 'Katıdan doğrudan gaza geçiş olayı' },
      { term: 'ALGORİTMA', hint: 'Bir problemi çözmek için adım adım izlenen yol' },
    ],
    lise: [
      { term: 'MİTOKONDRİ', hint: 'Hücrenin enerji (ATP) santrali organeli' },
      { term: 'İNTEGRAL', hint: 'Bir eğrinin altında kalan alanı hesaplama aracı' },
      { term: 'ORGANİK', hint: 'Karbon temelli kimyasal bileşikler sınıfı' },
      { term: 'EYLEMSİZLİK', hint: 'Cismin mevcut hareket durumunu koruma eğilimi' },
    ],
  };

  const [anagramIndex, setAnagramIndex] = useState(0);
  const [anagramScrambled, setAnagramScrambled] = useState<string[]>([]);
  const [anagramUserWord, setAnagramUserWord] = useState<string[]>([]);
  const [anagramSolved, setAnagramSolved] = useState(false);

  const initAnagram = (index: number) => {
    const list = ANAGRAM_WORDS[gradeLevel] || ANAGRAM_WORDS.ortaokul;
    const item = list[index % list.length];
    const letters = item.term.split('').sort(() => Math.random() - 0.5);
    setAnagramScrambled(letters);
    setAnagramUserWord([]);
    setAnagramSolved(false);
  };

  useEffect(() => {
    initAnagram(anagramIndex);
  }, [gradeLevel, anagramIndex]);

  const handleAnagramPickLetter = (letterIndex: number) => {
    if (anagramSolved) return;
    playSound('click');
    const letter = anagramScrambled[letterIndex];
    const nextUser = [...anagramUserWord, letter];
    const nextScrambled = anagramScrambled.filter((_, idx) => idx !== letterIndex);
    setAnagramUserWord(nextUser);
    setAnagramScrambled(nextScrambled);

    const list = ANAGRAM_WORDS[gradeLevel] || ANAGRAM_WORDS.ortaokul;
    const targetWord = list[anagramIndex % list.length].term;

    if (nextUser.join('') === targetWord) {
      playSound('win');
      setAnagramSolved(true);
      addXP(40, 'Kelime Anagramı Başarısı');
      showToast(`Harika! Doğru Kelime: "${targetWord}" (+40 XP)`, 'reward');
    } else if (nextScrambled.length === 0) {
      playSound('wrong');
    }
  };

  const handleAnagramUndo = () => {
    if (anagramUserWord.length === 0 || anagramSolved) return;
    playSound('click');
    const last = anagramUserWord[anagramUserWord.length - 1];
    setAnagramUserWord((prev) => prev.slice(0, -1));
    setAnagramScrambled((prev) => [...prev, last]);
  };

  // ==========================================
  // GAME 5: DOĞRU MU? YANLIŞ MI? (YENİ OYUN!)
  // ==========================================
  const TF_QUESTIONS: Record<GradeLevel, { q: string; isTrue: boolean; fact: string }[]> = {
    ilkokul: [
      { q: 'Güneş bir gezegen değil, dev bir yıldızdır.', isTrue: true, fact: 'Güneş, Samanyolu Galaksisi’ndeki orta büyüklükte bir yıldızdır.' },
      { q: 'Bir günde 48 saat vardır.', isTrue: false, fact: 'Bir gün 24 saattir.' },
      { q: 'Bitkiler de canlıdır ve nefes alırlar.', isTrue: true, fact: 'Bitkiler gündüz ve gece hücresel solunum yaparlar.' },
      { q: 'Kare ve dikdörtgenin her ikisinin de 4 köşesi vardır.', isTrue: true, fact: 'Her iki şekil de dörtgenler ailesindedir.' },
      { q: 'Ay kendi ışığını üretir.', isTrue: false, fact: 'Ay, Güneş’ten aldığı ışığı Dünya’ya yansıtır.' },
    ],
    ortaokul: [
      { q: 'Işık sesten çok daha hızlı yayılır.', isTrue: true, fact: 'Işık hızı ~300.000 km/s iken ses hızı havada ~340 m/s dir.' },
      { q: 'DNA sadece çekirdeği olmayan bakterilerde bulunur.', isTrue: false, fact: 'DNA tüm canlılarda genetik materyal olarak bulunur.' },
      { q: 'Katılarda basınç, yüzey alanı küçüldükçe artar.', isTrue: true, fact: 'Basınç = Kuvvet / Yüzey Alanı (P = F / S).' },
      { q: '0 sayısı pozitif bir tam sayıdır.', isTrue: false, fact: '0 ne pozitif ne de negatiftir, nötr bir tam sayıdır.' },
      { q: 'Su (H₂O) bir bileşiktir.', isTrue: true, fact: 'İki farklı elementin belirli oranda kimyasal bağlanmasıyla oluşur.' },
    ],
    lise: [
      { q: 'Sabit hızla düz bir yolda giden cismin ivmesi sıfırdır.', isTrue: true, fact: 'İvme hızdaki değişimdir; hız sabitse ivme sıfırdır.' },
      { q: 'f(x) = x³ fonksiyonunun türevi 3x² dir.', isTrue: true, fact: 'Kuvvet kuralına göre d/dx(xⁿ) = n·xⁿ⁻¹.' },
      { q: 'Helyum (He) periyodik tabloda 1A grubunda yer alır.', isTrue: false, fact: 'Helyum bir soygazdır ve 8A grubunda bulunur.' },
      { q: 'Kinetik enerji formülü 1/2 · m · v² şeklindedir.', isTrue: true, fact: 'Kütle ile hızın karesinin çarpımının yarısıdır.' },
      { q: 'Enzimler tepkimenin aktivasyon enerjisini artırır.', isTrue: false, fact: 'Enzimler aktivasyon enerjisini düşürerek tepkimeyi hızlandırır.' },
    ],
  };

  const [tfIndex, setTfIndex] = useState(0);
  const [tfScore, setTfScore] = useState(0);
  const [tfStreak, setTfStreak] = useState(0);
  const [tfFeedback, setTfFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleTfAnswer = (userChoice: boolean) => {
    if (tfFeedback !== null) return;

    const list = TF_QUESTIONS[gradeLevel] || TF_QUESTIONS.ortaokul;
    const currentQ = list[tfIndex % list.length];

    if (userChoice === currentQ.isTrue) {
      playSound('correct');
      setTfFeedback('correct');
      setTfScore((s) => s + 1);
      setTfStreak((st) => st + 1);
      addXP(15, 'Doğru-Yanlış Refleks Cevabı');
    } else {
      playSound('wrong');
      setTfFeedback('wrong');
      setTfStreak(0);
    }

    setTimeout(() => {
      setTfFeedback(null);
      if (tfIndex + 1 < list.length) {
        setTfIndex((i) => i + 1);
      } else {
        playSound('win');
        showToast(`Refleks etabını tamamladınız! Skorunuz: ${tfScore + (userChoice === currentQ.isTrue ? 1 : 0)}/${list.length}`, 'reward');
        setTfIndex(0);
      }
    }, 900);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-600 to-rose-500 text-white shadow-md">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              Eğitici Zeka Oyunları & Bilgi Arenası
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {gradeLevel === 'ilkokul' ? 'İlkokul' : gradeLevel === 'ortaokul' ? 'LGS / Ortaokul' : 'YKS / Lise'} seviyesine uygun 5 farklı eğitici oyun ile reflekslerini geliştir ve XP kazan!
            </p>
          </div>
        </div>

        {/* User Level & XP Badge */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
            {user?.xp || 150} XP
          </span>
          <span className="text-[10px] text-slate-400">• {user?.level || 1}. Seviye</span>
        </div>
      </div>

      {/* Game Selection Tab Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveGame('math')}
          className={`flex items-center justify-center gap-1.5 rounded-2xl p-2.5 text-xs font-bold border transition ${
            activeGame === 'math'
              ? 'border-blue-500 bg-blue-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>1. Matematik Düellosu</span>
        </button>

        <button
          onClick={() => setActiveGame('vocab')}
          className={`flex items-center justify-center gap-1.5 rounded-2xl p-2.5 text-xs font-bold border transition ${
            activeGame === 'vocab'
              ? 'border-emerald-500 bg-emerald-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
          }`}
        >
          <Brain className="h-4 w-4" />
          <span>2. Bilim & Kavram</span>
        </button>

        <button
          onClick={() => setActiveGame('memory')}
          className={`flex items-center justify-center gap-1.5 rounded-2xl p-2.5 text-xs font-bold border transition ${
            activeGame === 'memory'
              ? 'border-purple-500 bg-purple-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>3. Zihin Kartları</span>
        </button>

        <button
          onClick={() => setActiveGame('anagram')}
          className={`flex items-center justify-center gap-1.5 rounded-2xl p-2.5 text-xs font-bold border transition ${
            activeGame === 'anagram'
              ? 'border-amber-500 bg-amber-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
          }`}
        >
          <Shuffle className="h-4 w-4" />
          <span>4. Kelime Anagramı</span>
        </button>

        <button
          onClick={() => setActiveGame('truefalse')}
          className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-2xl p-2.5 text-xs font-bold border transition ${
            activeGame === 'truefalse'
              ? 'border-rose-500 bg-rose-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>5. Doğru mu? Yanlış mı?</span>
        </button>
      </div>

      {/* GAME 1: MATH SPEED RUN */}
      {activeGame === 'math' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          {!mathIsPlaying ? (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mx-auto text-3xl">
                ⚡
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                45 Saniyelik Matematik Hız Düellosu
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Süre dolmadan önce olabildiğince çok soruya doğru cevap ver. Her doğru cevap puanını ve serini katlar!
              </p>
              <button
                onClick={startMathGame}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 py-3 text-sm font-extrabold text-white shadow-md mx-auto transition"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Oyunu Başlat</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Süre: {mathTimeLeft} sn</span>
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <Flame className="h-4 w-4 fill-orange-500" />
                  <span>Seri: {mathStreak}</span>
                </div>
                <div className="text-slate-900 dark:text-white font-black">
                  Skor: {mathScore}
                </div>
              </div>

              {/* Progress Bar for time */}
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${(mathTimeLeft / 45) * 100}%` }}
                />
              </div>

              {/* Big Math Question Box */}
              <div
                className={`rounded-3xl border-2 p-8 text-center transition-all ${
                  mathFeedback === 'correct'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : mathFeedback === 'wrong'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-850 text-slate-900 dark:text-white'
                }`}
              >
                <span className="text-3xl sm:text-4xl font-black tracking-wider">
                  {mathQuestion.q} = ?
                </span>
              </div>

              {/* 4 Answer Options */}
              <div className="grid grid-cols-2 gap-3">
                {mathQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleMathAnswer(opt)}
                    className="rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-blue-950/40 p-4 text-lg font-black text-slate-800 dark:text-slate-100 shadow-2xs transition active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: VOCABULARY & SCIENCE QUEST */}
      {activeGame === 'vocab' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 max-w-xl mx-auto">
          {(() => {
            const list = VOCAB_QUESTIONS[gradeLevel] || VOCAB_QUESTIONS.ortaokul;
            const currentQ = list[vocabIndex];
            return (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-emerald-600">Soru {vocabIndex + 1} / {list.length}</span>
                  <span className="text-slate-400">Skor: {vocabScore} Doğru</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.q}
                </h3>

                <div className="space-y-2.5">
                  {currentQ.options.map((option, i) => {
                    let btnClass = 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
                    if (vocabFeedback !== null) {
                      if (i === currentQ.correct) {
                        btnClass = 'border-emerald-500 bg-emerald-500 text-white font-black';
                      } else if (i === vocabFeedback) {
                        btnClass = 'border-red-500 bg-red-500 text-white';
                      }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleVocabAnswer(i)}
                        className={`w-full text-left rounded-2xl border p-3 text-xs font-bold transition flex items-center justify-between ${btnClass}`}
                      >
                        <span>{option}</span>
                        {vocabFeedback !== null && i === currentQ.correct && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {vocabFeedback !== null && (
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                    💡 <strong>Açıklama:</strong> {currentQ.explanation}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* GAME 3: MEMORY MATCH */}
      {activeGame === 'memory' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4 text-xs font-bold">
            <span className="text-purple-600">Hamle Sayısı: {memoryMoves}</span>
            <button
              onClick={initMemoryGame}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Yeniden Dağıt</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cards.map((card, i) => {
              const isSelected = selectedCards.includes(i);
              return (
                <button
                  key={card.uid}
                  onClick={() => handleCardClick(i)}
                  className={`h-24 rounded-2xl border p-2 flex items-center justify-center text-center text-xs font-black transition-all ${
                    card.isMatched
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 opacity-80'
                      : isSelected
                      ? 'border-purple-500 bg-purple-600 text-white shadow-md scale-105'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-transparent dark:border-slate-800 dark:bg-slate-800'
                  }`}
                >
                  <span className={isSelected || card.isMatched ? 'opacity-100' : 'opacity-0'}>
                    {card.text}
                  </span>
                </button>
              );
            })}
          </div>

          {memoryWon && (
            <div className="mt-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 p-4 text-center">
              <p className="text-sm font-black text-purple-700 dark:text-purple-300">
                🎉 Harika! {memoryMoves} hamlede tüm çiftleri eşleştirdin!
              </p>
              <button
                onClick={initMemoryGame}
                className="mt-2 rounded-xl bg-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs"
              >
                Yeni Tur Başlat
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 4: ANAGRAM & KELİME AVI */}
      {activeGame === 'anagram' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 max-w-xl mx-auto space-y-5">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-amber-600">Kelime {anagramIndex + 1}</span>
            <button
              onClick={() => {
                setAnagramIndex((prev) => prev + 1);
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-amber-600"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span>Sonraki Kelime</span>
            </button>
          </div>

          {/* Hint */}
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-3 text-center text-xs text-amber-800 dark:text-amber-300 font-medium">
            🎯 <strong>İpucu:</strong> {(ANAGRAM_WORDS[gradeLevel] || ANAGRAM_WORDS.ortaokul)[anagramIndex % 4].hint}
          </div>

          {/* Formed Word Slots */}
          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[52px] p-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 dark:border-amber-800 dark:bg-amber-950/20">
            {anagramUserWord.map((letter, idx) => (
              <span
                key={idx}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-lg shadow-xs"
              >
                {letter}
              </span>
            ))}
            {anagramUserWord.length === 0 && (
              <span className="text-xs text-slate-400">Harflere tıklayarak kelimeyi oluşturun</span>
            )}
          </div>

          {/* Scrambled Available Letters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {anagramScrambled.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleAnagramPickLetter(idx)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-amber-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-amber-950/60 font-black text-base text-slate-800 dark:text-slate-100 shadow-2xs transition transform active:scale-90"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleAnagramUndo}
              disabled={anagramUserWord.length === 0 || anagramSolved}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 disabled:opacity-40 transition"
            >
              Son Harfi Geri Al
            </button>
            <button
              onClick={() => initAnagram(anagramIndex)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 transition"
            >
              Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* GAME 5: DOĞRU MU? YANLIŞ MI? */}
      {activeGame === 'truefalse' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 max-w-lg mx-auto space-y-6">
          {(() => {
            const list = TF_QUESTIONS[gradeLevel] || TF_QUESTIONS.ortaokul;
            const currentQ = list[tfIndex % list.length];
            return (
              <>
                <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-rose-600">Soru {tfIndex + 1} / {list.length}</span>
                  <div className="flex items-center gap-1 text-orange-600">
                    <Flame className="h-4 w-4 fill-orange-500" />
                    <span>Seri: {tfStreak}</span>
                  </div>
                  <span className="text-slate-400">Skor: {tfScore}</span>
                </div>

                <div
                  className={`rounded-3xl border-2 p-6 text-center transition-all ${
                    tfFeedback === 'correct'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                      : tfFeedback === 'wrong'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/40'
                      : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-850'
                  }`}
                >
                  <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                    “{currentQ.q}”
                  </p>
                </div>

                {tfFeedback !== null && (
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300 text-center">
                    📌 <strong>Bilimsel Açıklama:</strong> {currentQ.fact}
                  </div>
                )}

                {/* Big TRUE / FALSE buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTfAnswer(true)}
                    disabled={tfFeedback !== null}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-4 text-white font-black shadow-md transition transform active:scale-95 disabled:opacity-50"
                  >
                    <Check className="h-6 w-6" />
                    <span>DOĞRU</span>
                  </button>
                  <button
                    onClick={() => handleTfAnswer(false)}
                    disabled={tfFeedback !== null}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-rose-600 hover:bg-rose-700 py-4 text-white font-black shadow-md transition transform active:scale-95 disabled:opacity-50"
                  >
                    <X className="h-6 w-6" />
                    <span>YANLIŞ</span>
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

    </div>
  );
};
