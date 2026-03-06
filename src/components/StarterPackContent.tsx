import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Heart, Coffee, Users, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StarterPackContent() {
  const [activeTab, setActiveTab] = useState<'packing' | 'mental' | 'culture' | 'tools' | 'rules' | 'lifehacks'>('packing');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'NTD' | 'IDR'>('NTD');
  const RATE = 500; // 1 NTD = 500 IDR (Approx)

  const convert = (val: string, type: 'NTD' | 'IDR') => {
    const num = parseFloat(val.replace(/,/g, ''));
    if (isNaN(num)) return 0;
    return type === 'NTD' ? num * RATE : num / RATE;
  };

  const formatCurrency = (num: number, type: 'NTD' | 'IDR') => {
    return new Intl.NumberFormat(type === 'IDR' ? 'id-ID' : 'zh-TW', {
      style: 'currency',
      currency: type,
      maximumFractionDigits: 0
    }).format(num);
  };

  const packingList = {
    dokumen: [
      "Paspor (Asli & Fotokopi 5 lembar)",
      "Visa Kerja (Asli & Fotokopi)",
      "Kontrak Kerja (PK)",
      "KTP & KK (Fotokopi)",
      "Foto ukuran 4x6 (Background putih, 10 lembar)",
      "Buku Saku PMI (Dari PT/BP2MI)"
    ],
    pakaian: [
      "Jaket Tebal (Musim dingin di Taiwan bisa sampai 10°C)",
      "Baju Lengan Panjang (3-4 potong)",
      "Celana Bahan/Jeans yang sopan",
      "Sepatu kets yang nyaman untuk jalan jauh",
      "Kaos kaki tebal",
      "Pakaian dalam secukupnya"
    ],
    obat: [
      "Tolak Angin / Minyak Kayu Putih (Wajib!)",
      "Obat Maag / Lambung",
      "Paracetamol / Obat Pusing",
      "Vitamin C / Multivitamin",
      "Obat alergi (jika punya riwayat)"
    ],
    lainnya: [
      "Universal Travel Adapter (Colokan Taiwan beda, tipe pipih II)",
      "Powerbank",
      "Botol minum (Tumbler)",
      "Mie Instan / Sambal sachet (Penyelamat lidah di minggu pertama)",
      "Alat sholat (bagi yang muslim)"
    ]
  };

  const cultureTips = [
    {
      title: "Disiplin Waktu",
      desc: "Di Taiwan, 'on time' itu artinya datang 5-10 menit sebelum jam janjian. Telat 1 menit pun dianggap tidak sopan.",
      icon: "⏰"
    },
    {
      title: "Sampah Harus Dipilah",
      desc: "Jangan buang sampah sembarangan! Ada kategori sampah umum, daur ulang, dan sisa makanan. Salah buang bisa didenda.",
      icon: "♻️"
    },
    {
      title: "Budaya Antri",
      desc: "Mau naik MRT, bus, atau bayar di kasir, wajib antri dengan tertib. Jangan menyerobot ya!",
      icon: "🚶"
    },
    {
      title: "Sopan Santun",
      desc: "Sering-sering bilang 'Xie Xie' (Terima kasih) dan 'Bu Hao Yi Si' (Maaf/Permisi). Ini kata ajaib di sana.",
      icon: "🙏"
    }
  ];

  const rules = {
    legal: [
      { 
        title: "Kaburan (Runaway)", 
        desc: "Meninggalkan majikan resmi tanpa izin untuk bekerja di tempat lain secara ilegal.", 
        detail: "Jika tertangkap, kamu akan ditahan di detensi imigrasi, didenda berat, dideportasi, dan di-blacklist masuk Taiwan selamanya. Hak asuransi dan gaji sisa juga bisa hangus.",
        fine: "Blacklist Permanen + Tiket Pulang Sendiri" 
      },
      { 
        title: "Overstay", 
        desc: "Melebihi batas izin tinggal yang tertera di ARC.", 
        detail: "Segera lapor ke imigrasi jika tidak sengaja overstay kurang dari 10 hari untuk denda ringan. Jika lebih, prosesnya akan lebih rumit dan bisa dilarang masuk Taiwan lagi dalam jangka waktu tertentu.",
        fine: "Denda 2.000 - 10.000 NTD" 
      },
      { 
        title: "Bekerja Ilegal (Sampingan)", 
        desc: "Bekerja di luar majikan resmi yang tertera di kontrak (PK).", 
        detail: "Meskipun hanya 'bantu-bantu' teman atau jualan online dalam skala besar tanpa izin, ini dianggap pelanggaran hukum ketenagakerjaan. Majikan resmi bisa memutus kontrak sepihak.",
        fine: "Denda 30.000 - 150.000 NTD" 
      },
      {
        title: "Dokumen Palsu",
        desc: "Memalsukan identitas, ARC, atau dokumen kesehatan.",
        detail: "Menggunakan dokumen palsu untuk melamar kerja atau urusan imigrasi adalah tindak pidana serius. Kamu akan langsung dideportasi dan di-blacklist.",
        fine: "Pidana Penjara & Deportasi"
      }
    ],
    criminal: [
      { 
        title: "Narkoba", 
        desc: "Memiliki, menggunakan, atau mengedarkan narkotika.", 
        detail: "Hukum narkoba di Taiwan SANGAT BERAT. Jangan pernah mau dititipi barang oleh orang tidak dikenal, atau menerima paket mencurigakan.",
        fine: "Hukuman Mati / Penjara Seumur Hidup" 
      },
      { 
        title: "Berkelahi / Tawuran", 
        desc: "Kekerasan fisik, baik individu maupun antar kelompok perguruan.", 
        detail: "Polisi Taiwan sangat tegas menindak kerusuhan. Selain dipenjara, visa kerjamu akan langsung dicabut dan dideportasi setelah masa tahanan selesai.",
        fine: "Deportasi & Pidana Penjara" 
      },
      { 
        title: "Jual Beli Rekening", 
        desc: "Meminjamkan atau menjual buku tabungan/ATM ke orang lain.", 
        detail: "Rekeningmu bisa dipakai untuk pencucian uang atau penipuan online. Kamu akan dianggap sebagai komplotan penipu (antek) dan bisa dipidana.",
        fine: "Pidana Penipuan & Ganti Rugi Korban" 
      },
      {
        title: "Pencurian / Mengutil",
        desc: "Mengambil barang milik orang lain atau toko tanpa membayar.",
        detail: "CCTV di Taiwan sangat canggih dan ada di mana-mana. Mengutil barang sekecil apapun di Sevel/toko akan tertangkap dan diproses hukum.",
        fine: "Pidana Penjara & Denda"
      }
    ],
    general: [
      { 
        title: "Buang Sampah Sembarangan", 
        desc: "Membuang sampah tidak pada tempatnya atau salah jadwal truk sampah.", 
        detail: "CCTV ada di mana-mana. Sampah harus dipilah (plastik, kertas, sisa makanan). Jangan buang sampah rumah tangga di tong sampah umum (sevel/taman).",
        fine: "1.200 - 6.000 NTD" 
      },
      { 
        title: "Merokok Sembarangan", 
        desc: "Merokok di area dilarang seperti taman, stasiun, halte, dan trotoar tertentu.", 
        detail: "Cari area khusus merokok (smoking area). Puntung rokok juga tidak boleh dibuang sembarangan di selokan.",
        fine: "2.000 - 10.000 NTD" 
      },
      { 
        title: "Makan/Minum di MRT", 
        desc: "Makan, minum (termasuk air putih), atau mengunyah permen karet di dalam stasiun dan gerbong MRT.", 
        detail: "Larangan berlaku setelah melewati garis kuning gate masuk (tap kartu). Tahan haus sebentar sampai keluar stasiun ya!",
        fine: "1.500 - 7.500 NTD" 
      },
      {
        title: "Berisik di Malam Hari",
        desc: "Membuat kegaduhan (musik keras, teriak-teriak) di atas jam 10 malam.",
        detail: "Warga Taiwan sangat menghargai ketenangan. Tetangga bisa lapor polisi jika kamu berisik. Jaga volume suara saat di mess atau kontrakan.",
        fine: "1.000 - 6.000 NTD"
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
        <h2 className="font-heading font-bold text-2xl text-blue-900 mb-4">Siap Terbang ke Taiwan? ✈️</h2>
        <p className="text-blue-700 leading-relaxed">
          Selamat! Langkahmu sudah semakin dekat. Modul ini dirancang khusus biar kamu nggak cuma siap secara fisik (koper), tapi juga siap secara mental menghadapi dunia baru. Yuk, kita cek satu-satu!
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
        {[
          { id: 'packing', label: 'Checklist Koper 🧳' },
          { id: 'mental', label: 'Mental Health ❤️' },
          { id: 'culture', label: 'Budaya Taiwan 🇹🇼' },
          { id: 'tools', label: 'Tools 🧮' },
          { id: 'rules', label: 'Larangan 🚫' },
          { id: 'lifehacks', label: 'Life Hacks 💡' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full py-3 px-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'packing' && (
            <motion.div
              key="packing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(packingList).map(([category, items]) => (
                  <div key={category} className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-heading font-bold text-lg capitalize mb-4 text-gray-800 border-b pb-2 border-gray-100">
                      {category}
                    </h3>
                    <ul className="space-y-3">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl flex gap-3 text-sm text-yellow-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>
                  <strong>PENTING:</strong> Jangan bawa daging-dagingan (sosis, rendang basah, abon daging) atau buah segar. Dendanya bisa sampai 200.000 NTD (100 Juta Rupiah)! 😱
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'mental' && (
            <motion.div
              key="mental"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pink-50 p-6 rounded-2xl">
                  <Heart className="w-8 h-8 text-pink-500 mb-3" />
                  <h3 className="font-bold text-pink-900 mb-2">Homesick itu Wajar</h3>
                  <p className="text-sm text-pink-800">Nangis di minggu pertama itu normal banget. Jangan dipendam, telpon keluarga, curhat sama teman sesama PMI.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl">
                  <Users className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-bold text-purple-900 mb-2">Cari Komunitas</h3>
                  <p className="text-sm text-purple-800">Gabung grup WA/FB PMI Taiwan. Punya teman senasib sepenanggungan itu obat paling ampuh.</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl">
                  <Coffee className="w-8 h-8 text-orange-500 mb-3" />
                  <h3 className="font-bold text-orange-900 mb-2">Me Time</h3>
                  <p className="text-sm text-orange-800">Luangkan waktu libur buat jalan-jalan. Taiwan itu indah dan transportasinya gampang!</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-lg mb-4">Mantra Penguat Mental 💪</h3>
                <blockquote className="italic text-gray-600 border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
                  "Aku ke sini punya tujuan mulia. Lelahku hari ini adalah tabungan masa depanku dan kebahagiaan keluargaku. Aku kuat, aku bisa!"
                </blockquote>
              </div>
            </motion.div>
          )}

          {activeTab === 'culture' && (
            <motion.div
              key="culture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {cultureTips.map((tip, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.desc}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-auto">
                <h3 className="font-heading font-bold text-xl text-center mb-6 text-gray-800">Kalkulator Kurs 🧮</h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Jumlah Uang</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-lg font-mono focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                    <button 
                      onClick={() => setCurrency('NTD')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${currency === 'NTD' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                      NTD 🇹🇼
                    </button>
                    <button 
                      onClick={() => setCurrency('IDR')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${currency === 'IDR' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}
                    >
                      IDR 🇮🇩
                    </button>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl text-center overflow-hidden">
                    <p className="text-xs text-blue-600 mb-1 uppercase tracking-wider font-bold">Hasil Konversi</p>
                    <div className="text-2xl md:text-3xl font-bold text-blue-900 break-words">
                      {amount ? formatCurrency(convert(amount, currency), currency === 'NTD' ? 'IDR' : 'NTD') : '-'}
                    </div>
                    <p className="text-[10px] text-blue-400 mt-2">
                      *Estimasi kurs: 1 NTD = {RATE} IDR
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rules' && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {Object.entries(rules).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <h3 className="font-heading font-bold text-lg capitalize text-gray-800 flex items-center gap-2">
                    {category === 'legal' ? '⚖️ Legalitas & Imigrasi' : 
                     category === 'criminal' ? '🚔 Tindak Kriminal' : '🚯 Aturan Umum'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
                        <div className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{item.title}</div>
                        <p className="text-xs text-gray-500 mb-2 font-semibold">{item.desc}</p>
                        <p className="text-xs text-gray-400 mb-4 flex-grow leading-relaxed">{item.detail}</p>
                        <div className="inline-block bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg text-center w-full mt-auto">
                          Sanksi: {item.fine}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'lifehacks' && (
            <motion.div
              key="lifehacks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    🛍️ Tips Belanja Hemat
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-blue-600 min-w-[140px]">PX Mart (Quan Lian):</span>
                      <span>Supermarket paling merakyat, harga mirip Indo.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-orange-600 min-w-[140px]">Pasar Pagi/Malam:</span>
                      <span>Tempat beli sayur & baju murah. Jangan lupa nawar!</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-green-600 min-w-[140px]">7-Eleven/FamilyMart:</span>
                      <span>Praktis buat bayar tagihan, kirim paket, & beli tiket, tapi harga barang sedikit lebih mahal.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    🏠 Cari Tempat Tinggal
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-purple-600 min-w-[140px]">591.com.tw:</span>
                      <span>Website sewa rumah paling populer (bisa pakai Google Translate).</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-blue-600 min-w-[140px]">Grup Facebook:</span>
                      <span>Cari "Kontrakan Taiwan" atau "Info Kost PMI". Hati-hati scam!</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-gray-800 min-w-[140px]">Mess Pabrik:</span>
                      <span>Biasanya paling murah & aman, tapi aturan jam malam ketat.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    📱 Komunikasi & Internet
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-blue-600 min-w-[140px]">Kartu As (Telkomsel):</span>
                      <span>Bisa beli di toko Indo. Murah buat nelpon ke Indonesia.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-green-600 min-w-[140px]">Internet Unlimited:</span>
                      <span>Cari kartu provider Taiwan (Chunghwa/FarEasTone) kalau butuh internet kencang buat video call.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-purple-600 min-w-[140px]">Free WiFi:</span>
                      <span>Di stasiun MRT, Sevel, dan tempat umum banyak WiFi gratis (iTaiwan).</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    💸 Kirim Uang Aman
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-blue-600 min-w-[140px]">Aplikasi Resmi:</span>
                      <span>Gunakan aplikasi remitansi resmi (seperti Index, QPay, EMQ) yang berizin OJK/Taiwan.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-red-600 min-w-[140px]">HINDARI Titip Teman:</span>
                      <span>Jangan titip uang cash ke teman atau lewat jalur bawah tanah (ilegal). Resiko hilang tidak diganti!</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    🚆 Transportasi Hemat
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-blue-600 min-w-[140px]">EasyCard (Yoyo Ka):</span>
                      <span>Kartu sakti buat naik bus, MRT, kereta, bahkan belanja di Sevel. Wajib punya!</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-orange-600 min-w-[140px]">TPASS (Bulanan):</span>
                      <span>Kalau sering jalan-jalan, beli paket TPASS bulanan (1200 NTD) buat naik semua transportasi sepuasnya.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    🏥 Kesehatan & Obat
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-green-600 min-w-[140px]">Kartu NHI (Jian Bao):</span>
                      <span>Jangan sampai hilang! Berobat di Taiwan sangat murah pakai kartu ini (cuma bayar pendaftaran ~150 NTD).</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-red-600 min-w-[140px]">Apotek (Yao Ju):</span>
                      <span>Cari logo hijau silang. Apoteker di Taiwan sangat membantu, bisa konsultasi ringan kalau sakit flu/batuk.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-lg mb-2 flex items-center gap-2 text-yellow-800">
                  💼 Mencari Freelance (Side Job)
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  <strong>PERINGATAN KERAS:</strong> Secara hukum, PMI sektor formal (pabrik/panti) <u>DILARANG</u> bekerja di luar majikan yang tertera di kontrak.
                </p>
                <div className="bg-white/50 p-4 rounded-xl text-sm text-yellow-900 space-y-2">
                  <p>✅ <strong>Boleh jika:</strong> Ada izin tertulis resmi dari Depnaker Taiwan (sangat jarang).</p>
                  <p>❌ <strong>Resiko jika ketahuan:</strong> Denda 30.000 - 150.000 NTD dan deportasi.</p>
                  <p>💡 <strong>Saran:</strong> Fokus pada pekerjaan utama. Jika butuh tambahan, bicarakan baik-baik dengan majikan untuk lembur (jiaban) yang legal.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Action */}
      <div className="mt-8 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 mb-4">Masih ada yang bingung? Tanya Ci Anna AI yuk!</p>
        <div className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full text-sm font-bold">
          <span>👇</span> Chatbot ada di pojok kanan bawah
        </div>
      </div>
    </div>
  );
}
