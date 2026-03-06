import { useState, useEffect, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import StarterPackContent from './components/StarterPackContent';
import InterviewGuideContent from './components/InterviewGuideContent';
import CurrencyCalculator from './components/CurrencyCalculator';
import { 
  ArrowRight, 
  Coffee, 
  MessageCircle, 
  Briefcase, 
  Sparkles, 
  Search, 
  Instagram, 
  ChevronUp,
  ArrowLeftRight,
  ChevronDown,
  Quote,
  Lock,
  Key,
  Phone,
  CheckCircle2,
  X,
  Sun,
  Moon,
  Download,
  Bookmark,
  Volume2,
  AtSign,
  Send,
  Copy,
  Check
} from 'lucide-react';

interface Product {
  id: number;
  icon: ReactNode;
  color: 'mint' | 'blue' | 'lilac' | 'yellow';
  badge: string;
  title: string;
  description: string;
  benefits: string[];
  price: string;
  originalPrice?: string;
  isComingSoon?: boolean;
  buyUrl: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    icon: <MessageCircle className="w-8 h-8" />,
    color: 'mint',
    badge: "webbook digital",
    title: "Kamus Gaul Mandarin",
    description: "Biar ngobrol sama Akong & Ama makin luwes~ Isinya frasa sehari-hari yang real dipakai majikan. Nggak kaku kayak buku pelajaran, lengkap dengan cara bacanya! 🗣️",
    benefits: ["500+ Frasa Gaul", "Audio Cara Baca", "Fitur Chatbot Frasa", "Update Selamanya"],
    price: "Rp 45.000",
    originalPrice: "Rp 99.000",
    buyUrl: "http://lynk.id/cianna/kv6v8r78d7dr/checkout"
  },
  {
    id: 2,
    icon: <Briefcase className="w-8 h-8" />,
    color: 'blue',
    badge: "tutorial digital",
    title: "Starter Pack ke Taiwan",
    description: "Bawa barang apa aja ya dari Indo? Yuk siapkan koper dan mentalmu dengan tenang. Ada bocoran budaya kerja di Taiwan biar kamu nggak culture shock! 🧳",
    benefits: ["Checklist Koper", "Mental Health", "Budaya Taiwan", "Tools & Kalkulator", "Larangan & Denda", "Life Hacks", "Fitur Chatbot"],
    price: "Rp 35.000",
    originalPrice: "Rp 65.000",
    buyUrl: "http://lynk.id/cianna/w9v9o6zn9n2e/checkout"
  },
  {
    id: 3,
    icon: <Sparkles className="w-8 h-8" />,
    color: 'lilac',
    badge: "webbook digital",
    title: "Rahasia Lolos Interview Agency",
    description: "Tips elegan jawab pertanyaan menjebak dari agency dan calon majikan. Aku ajarin cara bikin kesan pertama yang manis biar kamu cepet dapet job idaman. ✨",
    benefits: ["Simulasi Interview", "Body Language Tips", "Q&A Terpopuler", "Template Perkenalan"],
    price: "Rp 45.000",
    originalPrice: "Rp 65.000",
    buyUrl: "http://lynk.id/cianna/kn6n5e7nde90/checkout"
  },
  {
    id: 4,
    icon: <Search className="w-8 h-8" />,
    color: 'yellow',
    badge: "Premium List 🌟",
    title: "Katalog Loker Taiwan Terpercaya",
    description: "Info lowongan kerja yang aman, nyaman, potongan jelas, and transparan sesuai aturan BP2MI/Pemerintah RI. Nggak perlu pusing cari sana-sini atau takut tipu-tipu! 💖",
    benefits: ["Update Loker Mingguan", "Kontak Agency Resmi", "Review Gaji & Mess", "Konsultasi Gratis"],
    price: "Rp 75.000",
    isComingSoon: true,
    buyUrl: "https://lynkid.com/cianna/katalog-loker"
  }
];

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'dictionary' | 'content'>('home');
  const [unlockedContent, setUnlockedContent] = useState<{ product: Product, content: any } | null>(null);

  // Dictionary State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [dictionary, setDictionary] = useState<any[]>([]);
  const [dictionaryLoading, setDictionaryLoading] = useState(true);
  const [isGeneratingDictionary, setIsGeneratingDictionary] = useState(false);

  // Load unlocked content from localStorage on mount
  useEffect(() => {
    const savedUnlocked = localStorage.getItem('cianna_unlocked_content');
    if (savedUnlocked) {
      try {
        const parsed = JSON.parse(savedUnlocked);
        if (parsed && parsed.product && parsed.content) {
          setUnlockedContent(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved unlocked content", e);
      }
    }
  }, []);

  // Save unlocked content when it changes
  useEffect(() => {
    if (unlockedContent) {
      localStorage.setItem('cianna_unlocked_content', JSON.stringify(unlockedContent));
    }
  }, [unlockedContent]);

  // Fetch dictionary on mount (once)
  useEffect(() => {
    fetchDictionary();
  }, []);

  const fetchDictionary = async () => {
    try {
      if (!supabase) {
        // Fallback to local API if supabase not configured (for dev)
        const res = await fetch('/api/dictionary');
        const data = await res.json();
        setDictionary(data);
        return;
      }

      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .order('category', { ascending: true })
        .order('indo', { ascending: true });

      if (error) throw error;
      setDictionary(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDictionaryLoading(false);
    }
  };

  const handleGeminiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsGeneratingDictionary(true);
    try {
      const prompt = `Translate this Indonesian phrase to Traditional Chinese (Taiwan usage) and provide Pinyin.
      Phrase: "${searchTerm}"
      
      Return ONLY a valid JSON object with this structure:
      {
        "indo": "${searchTerm}",
        "mandarin": "Traditional Chinese translation",
        "pronunciation": "Pinyin with tone marks",
        "category": "General"
      }
      Do not include markdown formatting, code blocks, or explanations. Just the raw JSON string.`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash", // Switched to stable model
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      
      let text = result.text || '';
      console.log("Gemini Raw Response:", text); // Debug log

      // Cleanup: Remove markdown code blocks if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Try to find JSON object in the text
      const match = text.match(/\{[\s\S]*\}/);
      
      if (match) {
        try {
          const newPhrase = JSON.parse(match[0]);
          
          // Validate fields
          if (!newPhrase.indo || !newPhrase.mandarin) {
            throw new Error("Incomplete data from AI");
          }

          // Prevent duplicates: Check if already exists in local state
          const isDuplicate = dictionary.some(item => 
            item.indo.toLowerCase() === newPhrase.indo.toLowerCase() || 
            item.mandarin === newPhrase.mandarin
          );

          if (isDuplicate) {
            setSearchTerm('');
            setIsGeneratingDictionary(false);
            alert("Frasa ini sudah ada di kamus kamu! ✨");
            return;
          }

          // Save to Supabase or Local API
          if (supabase) {
            const { error: saveError } = await supabase
              .from('dictionary')
              .insert([{ 
                category: newPhrase.category || "General", 
                indo: newPhrase.indo, 
                mandarin: newPhrase.mandarin, 
                pronunciation: newPhrase.pronunciation || "",
                is_custom: true 
              }]);
            if (saveError) throw saveError;
          } else {
            const saveRes = await fetch('/api/dictionary', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newPhrase)
            });
            if (!saveRes.ok) throw new Error("Failed to save to dictionary");
          }

          // Refresh
          await fetchDictionary();
          // Don't clear search term so user can see the result
          // setSearchTerm(''); 
          setIsGeneratingDictionary(false);
          // alert("Frasa berhasil ditambahkan ke kamus!");
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError, "Text:", text);
          alert("Maaf, AI memberikan format yang salah. Coba kata lain.");
        }
      } else {
        console.error("No JSON found in response:", text);
        alert("Maaf, AI tidak memberikan jawaban yang valid.");
      }
    } catch (err) {
      console.error('Gemini error:', err);
      alert('Maaf, ada kendala koneksi atau AI sedang sibuk.');
    } finally {
      setIsGeneratingDictionary(false);
    }
  };

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check if we are on the generate page (from Lynkid redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const pid = params.get('pid');
    
    if (token === 'CIANNA_SECRET_2023' && pid) {
      const product = PRODUCTS.find(p => p.id === parseInt(pid));
      if (product) {
        setSelectedProduct(product);
        setIsGenerating(true);
        setShowAccessModal(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setSelectedProduct(e.detail.product);
      setIsGenerating(false);
      setShowAccessModal(true);
    };
    window.addEventListener('open-access-modal' as any, handleOpenModal);
    return () => window.removeEventListener('open-access-modal' as any, handleOpenModal);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-kr-bg transition-colors duration-300">
      {/* Background Ambient Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-kr-peach/30 mix-blend-multiply filter blur-3xl opacity-70 animate-float-slow -z-10 pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-kr-mint/30 mix-blend-multiply filter blur-3xl opacity-70 animate-float-medium -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-kr-lilac/30 mix-blend-multiply filter blur-3xl opacity-70 animate-float-fast -z-10 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="container mx-auto max-w-3xl glass rounded-full px-6 py-3 flex justify-between items-center shadow-soft">
          <div className="font-heading font-bold text-xl flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-8 h-8 rounded-full bg-kr-peach flex items-center justify-center text-kr-text">🌸</div>
            Ci Anna
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-full bg-kr-bg flex items-center justify-center text-kr-text-light hover:bg-kr-peach hover:text-kr-text transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a 
              href="https://www.threads.com/@cianna12_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-kr-bg flex items-center justify-center text-kr-text-light hover:bg-kr-peach hover:text-kr-text transition-colors"
            >
              <AtSign className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {currentPage === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="container mx-auto max-w-3xl px-6 pt-24 pb-8 flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2 text-center md:text-left"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-soft mb-6 border border-kr-peach/30">
                <div className="flex items-center gap-1">
                  <span className="text-xl">🇮🇩</span>
                  <ArrowLeftRight className="w-4 h-4 text-kr-text-light/50" />
                  <span className="text-xl">🇹🇼</span>
                </div>
                <div className="font-heading text-xs sm:text-sm md:text-base text-kr-text font-bold uppercase tracking-wide">
                  Indonesian Expat in Taiwan <span className="text-kr-accent opacity-70 ml-1">sejak 2023</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-8 justify-center md:justify-start">
                <span className="text-[10px] font-heading font-bold text-kr-text-light uppercase tracking-widest w-full md:w-auto mb-1 md:mb-0">Akses cepat:</span>
                <a href="#product-1" className="text-[11px] font-heading font-bold px-4 py-1.5 bg-kr-mint/50 text-kr-text rounded-full hover:bg-kr-mint transition-all hover:scale-105 shadow-sm border border-kr-mint/30">Kamus Mandarin</a>
                <a href="#product-2" className="text-[11px] font-heading font-bold px-4 py-1.5 bg-kr-blue/50 text-kr-text rounded-full hover:bg-kr-blue transition-all hover:scale-105 shadow-sm border border-kr-blue/30">Starterpack Taiwan</a>
                <a href="#product-3" className="text-[11px] font-heading font-bold px-4 py-1.5 bg-kr-lilac/50 text-kr-text rounded-full hover:bg-kr-lilac transition-all hover:scale-105 shadow-sm border border-kr-lilac/30">Interview Agency</a>
                <a href="#product-4" className="text-[11px] font-heading font-bold px-4 py-1.5 bg-kr-yellow/50 text-kr-text rounded-full hover:bg-kr-yellow transition-all hover:scale-105 shadow-sm border border-kr-yellow/30">Loker Taiwan</a>
              </div>
              
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.2] mb-6 text-kr-text">
                Kerja di Taiwan <br/>
                <span className="text-kr-accent relative inline-block">
                  Makin Tenang & Nyaman
                </span>
              </h1>
              
              <p className="text-lg mb-8 text-kr-text-light leading-relaxed max-w-lg mx-auto md:mx-0">
                Dajia hao! 👋 Aku Ci Anna. Buat kamu yang mau jadi Caregiver, Pekerja Pabrik, Panti Jompo, Konstruksi, atau Nelayan di Taiwan lewat jalur resmi PMI, nggak perlu takut bingung. Yuk, persiapkan semuanya bareng aku! ✨
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="#produk" className="text-center font-heading font-semibold text-white bg-kr-accent px-8 py-3.5 rounded-full shadow-soft btn-soft flex items-center justify-center gap-2">
                  Cari tau sekarang 👇
                </a>
              </div>
            </motion.div>

            {/* Image Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2 relative flex justify-center mt-10 md:mt-0"
            >
              {/* Main Image Wrapper */}
              <div className="relative w-56 h-72 md:w-72 md:h-88">
                <div className="w-full h-full bg-white rounded-[80px_80px_30px_30px] p-2 shadow-soft relative overflow-hidden flex flex-col items-center justify-center text-center">
                  {/* Real Photo */}
                  <div className="w-full h-full bg-kr-bg rounded-[70px_70px_22px_22px] overflow-hidden p-1">
                    <img 
                      src="https://storage.googleapis.com/ai-studio-bucket-353083286262-us-west1/Pribadi/Foto-cianna" 
                      alt="Ci Anna" 
                      className="w-full h-full object-cover rounded-[64px_64px_18px_18px]" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Ci+Anna';
                      }}
                    />
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-3 shadow-float flex items-center gap-2 animate-float-medium z-20">
                  <div className="w-8 h-8 rounded-full bg-kr-mint flex items-center justify-center">💼</div>
                  <span className="font-heading font-semibold text-sm">Karir Taiwan</span>
                </div>
                <div className="absolute top-10 -left-6 bg-white rounded-full p-3 shadow-float animate-float-slow delay-1000 z-20">
                  <span className="text-xl">✨</span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* About Section / Trust Builder */}
          <section id="cerita" className="container mx-auto max-w-3xl px-6 py-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-soft relative overflow-hidden"
            >
              {/* Subtle pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-kr-yellow/40 rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-kr-mint/30 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src="https://storage.googleapis.com/ai-studio-bucket-353083286262-us-west1/Pribadi/Foto-cianna1" 
                      alt="Ci Anna" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 text-center md:text-left">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-kr-text">Kenapa Bareng Ci Anna?</h2>
                  <p className="text-kr-text-light mb-6 leading-relaxed">
                    Dulu waktu pertama kali ke Taiwan sebagai Pekerja Migran Indonesia (PMI), aku sempet homesick and bingung ngadepin budaya baru. Susah ngobrol sama atasan/majikan dan pusing urusan dokumen kerja.
                  </p>

                  <div className="bg-kr-yellow/20 border-2 border-kr-yellow rounded-2xl p-5 mb-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300 shadow-sm relative">
                    <div className="absolute -top-3 -right-3 text-2xl animate-bounce">💸</div>
                    <p className="font-heading font-bold text-kr-text text-lg leading-tight mb-2">
                      Tau nggak? Gaji rata-rata PMI itu <span className="text-white bg-kr-accent px-2 py-1 rounded-lg shadow-sm inline-block transform -skew-x-12">24.000 - 35.000 NTD</span>
                    </p>
                    <p className="text-sm text-kr-text-light leading-relaxed">
                      Itu setara <strong>Rp 12 - 17 Juta per bulan</strong> lho! Tergantung skill & pengalamanmu. Sayang banget kan kalau kesempatan cuan segede ini lewat cuma karena kamu kurang persiapan? 😱
                    </p>
                  </div>

                  <p className="text-kr-text-light leading-relaxed">
                    Nah, semua modul dan info di bawah ini aku susun pakai <strong>bahasa yang santai, mudah dipahami, dan dari pengalaman asli</strong>. Biar kamu nggak perlu ngulangin kesulitanku dulu, dan bisa langsung fokus cari cuan dengan aman, sesuai standar pemerintah! 🌸
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Digital Products Section */}
          <section id="produk" className="container mx-auto max-w-3xl px-6 py-8">
            <div className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-kr-text inline-flex items-center gap-3 justify-center">
                ✨ Bekal Suksesmu di Taiwan ✨
              </h2>
              <p className="mt-4 text-kr-text-light max-w-lg mx-auto">Pilih panduan yang paling kamu butuhkan sekarang. Semua disusun khusus buat pemula yang mau berangkat kerja!</p>
            </div>

            {/* 2 Grid System for Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PRODUCTS.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </section>

          {/* Testimonial Slider */}
          <TestimonialSlider />

          {/* FAQ Section */}
          <FAQSection />

          {/* Currency Calculator */}
          <CurrencyCalculator />
        </>
      ) : currentPage === 'dictionary' ? (
        <KamusGaul 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          dictionary={dictionary}
          loading={dictionaryLoading}
          isGenerating={isGeneratingDictionary}
          onGeminiSearch={handleGeminiSearch}
        />
      ) : (
        <div className="container mx-auto max-w-3xl px-3 md:px-6 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-5 md:p-12 shadow-soft border border-kr-mint/30"
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className="w-10 h-10 rounded-full bg-kr-bg flex items-center justify-center text-kr-text-light hover:text-kr-accent transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kr-mint flex items-center justify-center text-kr-text text-xl flex-shrink-0">🔓</div>
                <h1 className="font-heading font-bold text-xl md:text-3xl text-kr-text">Materi Terbuka!</h1>
              </div>
            </div>

            {unlockedContent?.product.id === 1 ? (
              <div className="bg-kr-bg rounded-2xl p-3 md:p-8 border border-kr-mint/30">
                <KamusGaul 
                  isModal={true}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  dictionary={dictionary}
                  loading={dictionaryLoading}
                  isGenerating={isGeneratingDictionary}
                  onGeminiSearch={handleGeminiSearch}
                />
              </div>
            ) : unlockedContent?.product.id === 2 ? (
              <div className="bg-white rounded-2xl p-3 md:p-10 border border-kr-mint/30">
                <StarterPackContent />
              </div>
            ) : unlockedContent?.product.id === 3 ? (
              <div className="bg-white rounded-2xl p-3 md:p-10 border border-kr-mint/30">
                <InterviewGuideContent />
              </div>
            ) : (
              <div className="bg-kr-bg rounded-2xl p-6 md:p-12 border border-kr-mint/30">
                <h2 className="font-heading font-bold text-2xl mb-6 text-kr-text">{unlockedContent?.content.title}</h2>
                <div className="prose prose-stone max-w-none">
                  <p className="text-kr-text-light text-lg leading-relaxed mb-8">
                    {unlockedContent?.content.body}
                  </p>
                  <div className="p-6 bg-white rounded-2xl border border-kr-peach/30 text-base italic text-kr-text-light shadow-inner-soft">
                    "Materi lengkap sedang dalam proses upload. Kode kamu sudah tersimpan secara permanen! Silakan cek kembali secara berkala untuk update materi terbaru dari Ci Anna."
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-kr-mint/30 pt-10 pb-6 mt-6">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 text-center md:text-left">
            <div>
              <div className="font-heading font-bold text-2xl text-kr-text mb-2">
                Ci Anna ✨
              </div>
              <p className="text-kr-text-light text-sm max-w-sm">
                Membantu calon pekerja Indonesia meraih mimpi di Taiwan dengan persiapan yang tenang dan menyenangkan.
              </p>
            </div>
          </div>
          
          <div className="text-center text-kr-text-light/60 font-medium text-xs pt-6 border-t border-kr-bg">
            &copy; {new Date().getFullYear()} Ci Anna. Dibuat dengan cinta dan secangkir teh boba. 🧋
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-kr-accent text-white w-12 h-12 rounded-full flex items-center justify-center shadow-float hover:scale-110 transition-all duration-300"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Access Modal */}
      <AnimatePresence>
        {showAccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccessModal(false)}
              className="absolute inset-0 bg-kr-text/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-float overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowAccessModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-kr-bg flex items-center justify-center text-kr-text-light hover:text-kr-accent transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <WebbookAccess 
                isGenerating={isGenerating} 
                product={selectedProduct} 
                onUnlock={(data) => {
                  setUnlockedContent(data);
                  setCurrentPage('content');
                  setShowAccessModal(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global AI Chatbox - Only on unlocked content pages */}
      {currentPage === 'content' && (
        <AIChatbox mode={unlockedContent?.product.id === 1 ? 'dictionary' : 'general'} />
      )}
      
      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}

import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

// Supabase Client Initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

function AIChatbox({ mode = 'general' }: { mode?: 'general' | 'dictionary' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const systemPrompt = mode === 'dictionary' 
        ? `Kamu adalah asisten Kamus Ci Anna. Jawablah pertanyaan seputar arti kata atau frasa Mandarin secara LANGSUNG dan SINGKAT. 
           JANGAN gunakan salam pembuka (seperti Halo, Hai, Saya asisten, dll). 
           JANGAN memperkenalkan diri lagi. 
           Langsung berikan arti, cara baca (pinyin), dan contoh penggunaan jika perlu.`
        : `Kamu adalah asisten Ci Anna. Jawablah pertanyaan seputar frasa Mandarin atau budaya Taiwan dengan ramah.`;

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}
        
        ATURAN PENTING:
        1. JANGAN gunakan format markdown bold (tanda bintang **). 
        2. JANGAN gunakan format markdown apapun.
        3. Gunakan baris baru (Enter) untuk memisahkan poin-poin penting atau penekanan kata.
        4. Berikan jawaban yang bersih dan mudah dibaca.
        
        Pertanyaan: ${userMsg}` }] }],
      });
      const aiResponse = result.text || 'Maaf, saya tidak mengerti.';
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Maaf, ada kendala koneksi.' }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text: string) => {
    // Remove ** and ensure proper line breaks
    let formatted = text.replace(/\*\*/g, '');
    return formatted.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-3xl shadow-float border border-kr-mint/30 flex flex-col overflow-hidden"
          >
            <div className="bg-kr-accent p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✨</div>
                <span className="font-heading font-bold">Tanya Ci Anna AI</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-kr-bg/30">
              {messages.length === 0 && (
                <div className="text-center text-kr-text-light text-sm mt-10">
                  {mode === 'dictionary' 
                    ? "Tanya arti kata atau frasa Mandarin apa saja di sini! ✨" 
                    : "Halo! Aku asisten AI Ci Anna. Tanya apa saja seputar frasa Mandarin ya!"}
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-kr-accent text-white rounded-tr-none' : 'bg-white text-kr-text border border-kr-mint/20 rounded-tl-none shadow-sm'}`}>
                    {formatMessage(msg.text)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-kr-mint/20 animate-pulse text-xs text-kr-text-light">
                    Sedang berpikir...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-kr-mint/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanya sesuatu..."
                className="flex-grow px-4 py-2 bg-kr-bg rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-kr-accent"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 bg-kr-accent text-white rounded-xl flex items-center justify-center shadow-soft"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-kr-accent text-white rounded-full shadow-float flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}

interface KamusGaulProps {
  isModal?: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  dictionary: any[];
  loading: boolean;
  isGenerating: boolean;
  onGeminiSearch: () => void;
}

function KamusGaul({ 
  isModal = false,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  dictionary,
  loading,
  isGenerating,
  onGeminiSearch
}: KamusGaulProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const bookmarked = localStorage.getItem('cianna_dictionary_bookmarked');
    if (bookmarked === 'true') setIsBookmarked(true);
  }, []);

  const toggleBookmark = () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    localStorage.setItem('cianna_dictionary_bookmarked', String(newState));
  };

  const categories = useMemo(() => {
    const rawCategories = [...new Set(dictionary.map(item => item.category))];
    const priority = ['Harian', 'Medis/Darurat', 'Urgensi', 'Majikan/ART'];
    
    const sorted = rawCategories.sort((a, b) => {
      const indexA = priority.indexOf(a);
      const indexB = priority.indexOf(b);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    return ['Semua', ...sorted];
  }, [dictionary]);

  const filteredData = useMemo(() => {
    const filtered = dictionary.filter(item => {
      const matchesSearch = item.indo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.mandarin.includes(searchTerm) || 
                            item.pronunciation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort filtered data by priority category if "Semua" is selected
    if (selectedCategory === 'Semua') {
      const priority = ['Harian', 'Medis/Darurat', 'Urgensi', 'Majikan/ART'];
      return [...filtered].sort((a, b) => {
        const indexA = priority.indexOf(a.category);
        const indexB = priority.indexOf(b.category);
        
        if (indexA !== -1 && indexB !== -1) {
          if (indexA !== indexB) return indexA - indexB;
          return a.indo.localeCompare(b.indo);
        }
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.indo.localeCompare(b.indo);
      });
    }

    return filtered;
  }, [searchTerm, selectedCategory, dictionary]);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const content = (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        {!isModal && (
          <>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-kr-text mb-4">Kamus Gaul Mandarin</h1>
            <p className="text-kr-text-light max-w-2xl mx-auto mb-8">
              Belajar frasa sehari-hari yang beneran dipakai di Taiwan. Klik frasa untuk melihat detail dan mendengarkan audio! 🗣️
            </p>
          </>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={toggleBookmark}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-heading font-bold transition-all shadow-soft ${isBookmarked ? 'bg-kr-accent text-white' : 'bg-white text-kr-text border border-kr-peach'}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Tersimpan' : 'Simpan Halaman'}
          </button>
          {!isModal && (
            <button 
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-kr-text text-white font-heading font-bold transition-all shadow-soft hover:opacity-90"
            >
              <Download className="w-4 h-4" />
              Unduh Aplikasi
            </button>
          )}
        </div>

        <AnimatePresence>
          {showDownloadModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDownloadModal(false)}
                className="absolute inset-0 bg-kr-text/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-float p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-kr-mint/30 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-kr-text" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-kr-text mb-4">Cara Unduh Aplikasi</h2>
                <div className="text-left space-y-4 text-kr-text-light mb-8">
                  <p className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-kr-peach flex-shrink-0 flex items-center justify-center text-xs font-bold text-kr-text">1</span>
                    Buka halaman ini di browser Chrome atau Safari di HP kamu.
                  </p>
                  <p className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-kr-peach flex-shrink-0 flex items-center justify-center text-xs font-bold text-kr-text">2</span>
                    Klik menu (titik tiga di Chrome atau tombol Share di Safari).
                  </p>
                  <p className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-kr-peach flex-shrink-0 flex items-center justify-center text-xs font-bold text-kr-text">3</span>
                    Pilih <strong>"Add to Home Screen"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDownloadModal(false)}
                  className="w-full py-4 bg-kr-accent text-white rounded-xl font-heading font-bold shadow-soft"
                >
                  Siap, Ci Anna! ✨
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kr-text-light/50" />
          <input 
            type="text" 
            placeholder="Cari frasa (Indo, Mandarin, atau Cara Baca)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-kr-peach/30 focus:outline-none focus:border-kr-accent transition-colors shadow-soft"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${selectedCategory === cat ? 'bg-kr-mint text-kr-text shadow-inner-soft' : 'bg-white text-kr-text-light hover:bg-kr-bg'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-3 max-w-3xl mx-auto">
        {loading ? (
          <div className="text-center py-10 text-kr-text-light animate-pulse">Memuat kamus...</div>
        ) : filteredData.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            className="bg-white rounded-2xl border border-kr-mint/10 overflow-hidden shadow-sm hover:border-kr-accent transition-all"
          >
            <button 
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full px-6 py-4 flex justify-between items-center text-left"
            >
              <div>
                <span className="text-[10px] font-bold text-kr-accent uppercase tracking-widest block mb-1">{item.category}</span>
                <span className="font-heading font-bold text-kr-text">{item.indo}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-kr-text-light transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 pt-2 border-t border-kr-bg bg-kr-bg/20"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-3xl font-bold text-kr-text mb-1">{item.mandarin}</div>
                      <div className="text-sm font-mono text-kr-accent italic">{item.pronunciation}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCopy(`${item.mandarin} (${item.pronunciation}) - ${item.indo}`, item.id)}
                        className="w-12 h-12 rounded-full bg-white border border-kr-mint/30 flex items-center justify-center text-kr-text hover:bg-kr-bg transition-colors shadow-soft"
                        title="Salin ke Clipboard"
                      >
                        {copiedId === item.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => playAudio(item.mandarin)}
                        className="w-12 h-12 rounded-full bg-kr-mint flex items-center justify-center text-kr-text hover:bg-kr-mint/80 transition-colors shadow-soft"
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-heading font-bold text-xl text-kr-text">Frasa tidak ditemukan</h3>
          <p className="text-kr-text-light mb-6">Mau Ci Anna bantu carikan dengan AI?</p>
          
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2 text-kr-accent animate-pulse">
              <div className="w-2 h-2 rounded-full bg-current" />
              <div className="w-2 h-2 rounded-full bg-current" />
              <div className="w-2 h-2 rounded-full bg-current" />
              <span className="text-sm font-bold">Ci Anna sedang mencari...</span>
            </div>
          ) : (
            <button 
              onClick={onGeminiSearch}
              className="px-8 py-3 bg-kr-accent text-white rounded-full font-heading font-bold shadow-float hover:scale-105 transition-transform mb-6"
            >
              Cari dengan AI ✨
            </button>
          )}

          <div className="mt-8 px-6 py-4 bg-kr-mint/20 rounded-2xl border border-kr-mint text-kr-text text-sm max-w-sm mx-auto">
            <strong>Tips:</strong> Frasa yang dicari dengan AI akan otomatis tersimpan ke dalam kamus Ci Anna untuk dipelajari nanti! 🔓✨
          </div>
        </div>
      )}
    </>
  );

  if (isModal) return <div className="p-4">{content}</div>;

  return (
    <div className="container mx-auto max-w-3xl px-6 pt-28 pb-20">
      {content}
    </div>
  );
}

const ProductCard = ({ product }: { product: Product, key?: any }) => {
  const { icon, color, badge, title, description, price, originalPrice, isComingSoon } = product;
  const colorClasses = {
    mint: { bg: 'bg-kr-mint dark:bg-kr-mint/20', badge: 'bg-kr-mint/30 dark:bg-kr-mint/10' },
    blue: { bg: 'bg-kr-blue dark:bg-kr-blue/20', badge: 'bg-kr-blue/30 dark:bg-kr-blue/10' },
    lilac: { bg: 'bg-kr-lilac dark:bg-kr-lilac/20', badge: 'bg-kr-lilac/30 dark:bg-kr-lilac/10' },
    yellow: { bg: 'bg-kr-yellow dark:bg-kr-yellow/40', badge: 'bg-kr-yellow/40 dark:bg-kr-yellow/10' },
  };

  // Calculate discount percentage
  const discount = originalPrice ? Math.round((1 - parseInt(price.replace(/\D/g, '')) / parseInt(originalPrice.replace(/\D/g, ''))) * 100) : 0;

  return (
    <motion.div 
      id={`product-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-8 card-soft shadow-soft border border-kr-mint/50 relative flex flex-col h-full group scroll-mt-24"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl ${colorClasses[color as keyof typeof colorClasses].bg} flex items-center justify-center text-kr-text shadow-inner-soft group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="text-right">
          <div className={`${colorClasses[color as keyof typeof colorClasses].badge} text-kr-text-light px-3 py-1 rounded-full text-xs font-bold w-max ml-auto mb-2`}>{badge}</div>
          {originalPrice && (
            <div className="text-xs text-kr-text-light line-through decoration-red-500/50 decoration-2">{originalPrice}</div>
          )}
          <div className="flex items-center justify-end gap-2">
            {discount > 0 && (
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                -{discount}%
              </span>
            )}
            <div className="font-heading font-bold text-kr-accent text-lg">{price}</div>
          </div>
        </div>
      </div>
      
      <h3 className="font-heading font-bold text-xl md:text-2xl mb-3 text-kr-text">{title}</h3>
      <p className="text-kr-text-light text-sm leading-relaxed mb-8 flex-grow">
        {description}
      </p>
      
      <div className="flex flex-col gap-3">
        <button 
          disabled={isComingSoon}
          onClick={() => {
            if (!isComingSoon) {
              const event = new CustomEvent('open-access-modal', { detail: { product } });
              window.dispatchEvent(event);
            }
          }}
          className={`w-full py-3.5 rounded-xl font-heading font-bold transition-all flex items-center justify-center gap-2 shadow-soft ${
            isComingSoon 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-kr-accent text-white hover:opacity-90'
          }`}
        >
          {isComingSoon ? 'Coming Soon' : 'Beli Sekarang'} {!isComingSoon && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}

const WebbookAccess = ({ isGenerating, product, onUnlock }: { isGenerating: boolean, product: Product | null, onUnlock: (data: { product: Product, content: any }) => void, key?: any }) => {
  const [step, setStep] = useState(isGenerating ? 'generate' : 'details');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1x generate per browser logic
  useEffect(() => {
    const savedPhone = localStorage.getItem('cianna_phone');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  // Auto-login if license exists
  useEffect(() => {
    if (product && !isGenerating) {
      const savedKey = localStorage.getItem(`cianna_license_${product.id}`);
      const savedPhone = localStorage.getItem('cianna_phone');
      if (savedKey && savedPhone) {
        setLicenseKey(savedKey);
        setPhoneNumber(savedPhone);
        validateLicense(savedPhone, savedKey, product.id);
      }
    }
  }, [product, isGenerating]);

  const validateLicense = async (phone: string, key: string, pid: number) => {
    setLoading(true);
    setError('');
    try {
      let isValid = false;

      if (supabase) {
        const { data, error: supabaseError } = await supabase
          .from('licenses')
          .select('*')
          .eq('phone_number', phone)
          .eq('license_key', key)
          .eq('product_id', pid)
          .single();
        
        if (data) isValid = true;
      } else {
        const res = await fetch('/api/validate-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone, licenseKey: key, productId: pid })
        });
        const data = await res.json();
        if (data.valid) isValid = true;
      }

      if (isValid) {
        localStorage.setItem(`cianna_license_${pid}`, key);
        onUnlock({ 
          product: product!, 
          content: { title: product!.title, body: `Selamat datang di materi eksklusif ${product!.title} Ci Anna...` } 
        });
      } else {
        setError('Kode atau No WA salah untuk produk ini');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi atau database');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    const savedPhone = localStorage.getItem('cianna_phone');
    if (savedPhone && savedPhone !== phoneNumber) {
      setError(`Kamu hanya bisa generate untuk nomor ${savedPhone}. Jika lupa kode, silakan hubungi admin.`);
      setLoading(false);
      return;
    }

    try {
      let generatedKey = '';

      if (supabase) {
        // Check if exists
        const { data: existing } = await supabase
          .from('licenses')
          .select('license_key')
          .eq('phone_number', phoneNumber)
          .eq('product_id', product.id)
          .single();
        
        if (existing) {
          generatedKey = existing.license_key;
        } else {
          // Generate new
          const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
          generatedKey = `ANNA${product.id}-${randomPart}`;
          
          const { error: insertError } = await supabase
            .from('licenses')
            .insert([{ phone_number: phoneNumber, product_id: product.id, license_key: generatedKey }]);
          
          if (insertError) throw insertError;
        }
      } else {
        const res = await fetch('/api/generate-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, productId: product.id, secretToken: 'CIANNA_SECRET_2023' })
        });
        const data = await res.json();
        if (data.licenseKey) generatedKey = data.licenseKey;
        else throw new Error(data.error || 'Gagal generate');
      }

      if (generatedKey) {
        setLicenseKey(generatedKey);
        localStorage.setItem('cianna_phone', phoneNumber);
        setStep('success');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi. Pastikan database sudah terhubung.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (product) {
      validateLicense(phoneNumber, licenseKey, product.id);
    }
  };

  if (!product) return null;

  if (step === 'details') {
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-kr-mint flex items-center justify-center text-kr-text">
            {product.icon}
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-kr-text">{product.title}</h2>
            <div className="text-kr-accent font-bold">{product.price}</div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-sm text-kr-text-light leading-relaxed">{product.description}</p>
          <div className="pt-4 border-t border-kr-bg">
            <h4 className="text-xs font-bold uppercase tracking-wider text-kr-text-light mb-3">Apa yang kamu dapat:</h4>
            <div className="grid grid-cols-1 gap-2">
              {product.benefits.map((benefit: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-kr-text">
                  <CheckCircle2 className="w-4 h-4 text-kr-mint" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setStep('login')}
            className="w-full py-4 rounded-xl bg-kr-bg text-kr-text font-heading font-bold hover:bg-kr-mint/50 transition-all flex items-center justify-center gap-2"
          >
            Sudah Punya Lisensi? <Lock className="w-4 h-4" />
          </button>
          <a 
            href={product.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-xl bg-kr-accent text-white font-heading font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-soft"
          >
            Beli Lisensi Sekarang <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-kr-peach/30 flex items-center justify-center mx-auto mb-4">
          {step === 'generate' ? <Key className="w-8 h-8 text-kr-accent" /> : <Lock className="w-8 h-8 text-kr-accent" />}
        </div>
        <h2 className="font-heading font-bold text-2xl text-kr-text">
          {step === 'generate' ? 'Generate Kode Lisensi' : 
           step === 'success' ? 'Kode Berhasil Dibuat!' : 'Akses Webbook'}
        </h2>
        <p className="text-sm text-kr-text-light mt-2">
          {step === 'generate' ? `Untuk: ${product.title}` : 
           step === 'success' ? 'Simpan kode ini baik-baik ya!' : `Masukkan No WA dan Kode untuk ${product.title}`}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-500 text-xs rounded-xl border border-red-100 flex items-center gap-2">
          <X className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-4">
        {step !== 'success' && (
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-kr-text-light/50" />
            <input 
              type="text" 
              placeholder="No WhatsApp (Contoh: 08123...)" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-kr-bg rounded-xl border border-kr-mint/30 focus:outline-none focus:border-kr-accent transition-colors text-sm"
            />
          </div>
        )}

        {step === 'login' && (
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-kr-text-light/50" />
            <input 
              type="text" 
              placeholder="Kode Lisensi (ANNA1-XXXX)" 
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-kr-bg rounded-xl border border-kr-mint/30 focus:outline-none focus:border-kr-accent transition-colors text-sm"
            />
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 bg-kr-mint/20 rounded-2xl border-2 border-dashed border-kr-mint flex flex-col items-center text-center">
            <CheckCircle2 className="w-10 h-10 text-kr-text mb-3" />
            <div className="font-mono font-bold text-xl tracking-wider text-kr-text mb-2">{licenseKey}</div>
            <p className="text-xs text-kr-text-light">Gunakan kode ini untuk login di perangkat manapun.</p>
          </div>
        )}

        {step === 'generate' && (
          <button 
            onClick={handleGenerate}
            disabled={loading || !phoneNumber}
            className="w-full py-4 bg-kr-accent text-white rounded-xl font-heading font-bold shadow-soft hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Generate Kode Sekarang'}
          </button>
        )}

        {step === 'login' && (
          <button 
            onClick={handleLogin}
            disabled={loading || !phoneNumber || !licenseKey}
            className="w-full py-4 bg-kr-accent text-white rounded-xl font-heading font-bold shadow-soft hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Memvalidasi...' : 'Masuk ke Webbook'}
          </button>
        )}

        {step === 'success' && (
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setStep('login')}
              className="w-full py-4 bg-kr-accent text-white rounded-xl font-heading font-bold shadow-soft hover:opacity-90 transition-all"
            >
              Lanjut ke Halaman Login
            </button>
            <a 
              href="https://cianna-tau.vercel.app"
              className="w-full py-4 bg-kr-bg text-kr-text rounded-xl font-heading font-bold shadow-soft hover:bg-kr-mint/30 transition-all flex items-center justify-center gap-2"
            >
              Kembali ke Beranda Utama <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        <button 
          onClick={() => setStep('details')}
          className="w-full py-2 text-xs text-kr-text-light hover:text-kr-accent transition-colors"
        >
          Kembali ke Detail Produk
        </button>
      </div>
    </div>
  );
}

function TestimonialSlider() {
  const testimonials = [
    { name: "Dharmayang", text: "Panduannya sangat membantu buat pemula seperti saya. Bahasanya enak banget dibaca!" },
    { name: "Amanda", text: "Kamus gaulnya beneran kepake pas ngobrol sama majikan. Jadi lebih akrab sekarang." },
    { name: "Sofia", text: "Interview agency jadi lebih tenang berkat tips dari Ci Anna. Akhirnya dapet job idaman!" },
    { name: "Lusiana", text: "Info lokernya transparan banget, nggak ada yang ditutup-tutupi. Sangat terpercaya." },
    { name: "Hardiawan", text: "Packing checklist-nya bikin koper saya rapi dan nggak ada yang ketinggalan. Top banget!" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container mx-auto max-w-3xl px-6 py-6">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl text-kr-text">Apa Kata Teman PMI?</h2>
        <div className="w-20 h-1 bg-kr-peach mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-soft overflow-hidden">
        <Quote className="absolute top-6 left-6 w-12 h-12 text-kr-peach opacity-20" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-xl md:text-2xl text-kr-text italic leading-relaxed mb-8">
              "{testimonials[currentIndex].text}"
            </p>
            <div className="font-heading font-bold text-lg text-kr-accent">
              — {testimonials[currentIndex].name}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-kr-accent w-8' : 'bg-kr-peach'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "Berapa biaya proses ke Taiwan?",
      a: "Biaya proses bervariasi tergantung sektor (Caregiver/Pabrik). Namun, saat ini pemerintah sudah mengatur skema biaya yang transparan agar tidak memberatkan PMI. Ci Anna bahas detailnya di modul Katalog Loker!"
    },
    {
      q: "Apa saja syarat dokumen yang harus disiapkan?",
      a: "Syarat utama adalah Paspor (minimal masa berlaku 1 tahun) dan Visa Kerja. Selain itu, siapkan KTP, KK, Akta Lahir, Ijazah asli, Surat Izin Keluarga bermaterai, dan SKCK. Pastikan semua data di dokumen tersebut sinkron dan tidak ada perbedaan nama atau tanggal lahir ya!"
    },
    {
      q: "Berapa lama waktu tunggu sampai terbang?",
      a: "Biasanya memakan waktu 3-6 bulan tergantung kelengkapan dokumen, proses medical, dan turunnya visa. Kesabaran adalah kunci!"
    },
    {
      q: "Apakah ada potongan gaji di Taiwan?",
      a: "Potongan gaji diatur secara resmi oleh pemerintah Taiwan dan Indonesia untuk biaya penempatan. Pastikan kamu paham rinciannya sebelum tanda tangan kontrak."
    },
    {
      q: "Bagaimana cara memilih agency yang terpercaya?",
      a: "Pilihlah agency yang memiliki izin resmi (SIP3MI) dan track record yang baik. Ci Anna selalu berbagi daftar agency yang transparan dan amanah."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container mx-auto max-w-3xl px-6 py-6">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl text-kr-text">Sering Ditanyakan (FAQ)</h2>
        <p className="text-kr-text-light mt-2">Masih bingung? Mungkin jawabanmu ada di sini.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-soft border border-kr-mint/30 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-kr-bg transition-colors"
            >
              <span className="font-heading font-bold text-kr-text">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-kr-accent transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-kr-text-light leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
