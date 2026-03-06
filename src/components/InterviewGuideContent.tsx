import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  UserCheck, 
  Smile, 
  AlertTriangle,
  Briefcase,
  HeartHandshake,
  Mic2,
  FileText,
  Plane
} from 'lucide-react';

export default function InterviewGuideContent() {
  const [activeTab, setActiveTab] = useState('documents');

  const tabs = [
    { id: 'documents', label: 'Berkas & Prosedur', icon: <FileText className="w-4 h-4" /> },
    { id: 'preparation', label: 'Penampilan', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'questions', label: 'Tanya Jawab', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'intro', label: 'Perkenalan Diri', icon: <Mic2 className="w-4 h-4" /> },
    { id: 'tips', label: 'Do\'s & Don\'ts', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kr-peach/20 text-kr-accent mb-2">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-kr-text">
          Rahasia Lolos Interview Agency
        </h2>
        <p className="text-kr-text-light max-w-2xl mx-auto">
          Panduan lengkap menaklukkan hati agency dan majikan Taiwan. Bukan cuma soal skill, tapi soal 
          <span className="font-bold text-kr-accent"> attitude</span> dan <span className="font-bold text-kr-accent">kesiapan mental</span>.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 bg-kr-bg p-2 rounded-2xl border border-kr-mint/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-white text-kr-accent shadow-sm scale-105' 
                : 'text-kr-text-light hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-kr-mint/30 shadow-sm min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BERKAS & PROSEDUR (NEW) */}
          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-kr-bg p-6 rounded-2xl border border-kr-mint/30 mb-6">
                <h3 className="font-heading font-bold text-lg text-kr-text mb-2 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-kr-accent" />
                  Alur Perjalanan Menuju Taiwan
                </h3>
                <p className="text-kr-text-light text-sm leading-relaxed">
                  Sebelum mikirin interview, pastikan "senjata" administrasi kamu lengkap dulu. Jangan sampai gagal berangkat cuma gara-gara satu kertas hilang atau data nggak cocok!
                </p>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="relative pl-8 border-l-2 border-kr-mint/30 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-kr-mint border-2 border-white shadow-sm"></div>
                  <h4 className="font-heading font-bold text-lg text-kr-text mb-3">Langkah 1: Siapkan Dokumen Wajib</h4>
                  <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-600 mb-3">Siapkan <strong>ASLI</strong> dan <strong>FOTOKOPI</strong> rangkap banyak. Pastikan nama, tanggal lahir, dan nama orang tua SAMA PERSIS di semua dokumen.</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-kr-accent" /> E-KTP (KTP Elektronik)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-kr-accent" /> Kartu Keluarga (KK) Terbaru</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-kr-accent" /> Akta Kelahiran</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-kr-accent" /> Ijazah Terakhir (Min. SD/SMP)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-kr-accent" /> Surat Izin Keluarga (Bermaterai)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-kr-accent" /> Buku Nikah / Akta Cerai (Jika ada)</li>
                    </ul>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 border-l-2 border-kr-mint/30 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-kr-mint border-2 border-white shadow-sm"></div>
                  <h4 className="font-heading font-bold text-lg text-kr-text mb-3">Langkah 2: Daftar ke Agency (PT) Resmi</h4>
                  <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
                    <p className="text-sm text-gray-600">
                      Jangan tergiur calo! Daftar langsung ke PT yang punya izin <strong>SIP3MI</strong> (Surat Izin Perusahaan Penempatan Pekerja Migran Indonesia).
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                      <p className="font-bold text-blue-800">Cara Cek & Daftar Resmi:</p>
                      <ol className="list-decimal list-inside text-blue-900/80 space-y-1">
                        <li>Buka website resmi pemerintah: <a href="https://siskop2mi.bp2mi.go.id/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">SISKOP2MI (bp2mi.go.id)</a></li>
                        <li>Cari menu "Daftar P3MI" untuk melihat list PT yang legal.</li>
                        <li>Datang langsung ke kantor PT (jangan lewat perantara lapangan).</li>
                        <li>Bawa dokumen asli untuk verifikasi awal.</li>
                      </ol>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-100">
                      <strong>⚠️ Warning:</strong> Jangan pernah bayar uang muka (DP) besar di awal tanpa kuitansi resmi PT. Biaya penempatan resmi biasanya bisa potong gaji (Kredit Usaha Rakyat / KUR).
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 border-l-2 border-kr-mint/30 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-kr-mint border-2 border-white shadow-sm"></div>
                  <h4 className="font-heading font-bold text-lg text-kr-text mb-3">Langkah 3: Medical Check Up (Pra-Medical)</h4>
                  <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-600 mb-3">Sebelum proses lanjut, kamu harus dinyatakan <strong>FIT TO WORK</strong>. Ini tahap paling krusial!</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-bold text-gray-700 text-xs uppercase mb-2">Pemeriksaan Fisik</h5>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                          <li>Tinggi & Berat Badan (BMI ideal)</li>
                          <li>Mata (Buta warna & Minus)</li>
                          <li>Gigi (Tidak boleh ompong depan)</li>
                          <li>Bekas Operasi (Sesar/Patah Tulang)</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-bold text-gray-700 text-xs uppercase mb-2">Laboratorium</h5>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                          <li>Darah (Hepatitis B, HIV, VDRL)</li>
                          <li>Urin (Narkoba & Kehamilan)</li>
                          <li>Rontgen Paru (TBC/Flek)</li>
                          <li>Feses (Cacing/Bakteri)</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 italic">*Jika gagal di tahap ini (misal: ada flek paru atau hamil), proses biasanya langsung GUGUR.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 border-l-2 border-kr-mint/30 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-kr-mint border-2 border-white shadow-sm"></div>
                  <h4 className="font-heading font-bold text-lg text-kr-text mb-3">Langkah 4: Pembuatan Paspor & ID TKI</h4>
                  <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
                    <p className="text-sm text-gray-600">
                      Biasanya diurus kolektif oleh PT setelah lolos medical. Kamu akan diantar ke kantor Imigrasi untuk foto dan wawancara.
                    </p>
                    <div className="flex flex-col gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                      <span className="font-bold text-gray-700">Tips Wawancara Paspor:</span>
                      <span className="text-gray-600">Jawab jujur: "Mau kerja ke Taiwan lewat PT [Nama PT]". Jangan bohong bilang mau liburan, nanti malah ditolak!</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Setelah itu data kamu akan masuk ke SISKOP2MI untuk penerbitan ID TKI (sekarang E-PMI).
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative pl-8 border-l-2 border-kr-mint/30 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-kr-mint border-2 border-white shadow-sm"></div>
                  <h4 className="font-heading font-bold text-lg text-kr-text mb-3">Langkah 5: Turun Job, Visa & Terbang! ✈️</h4>
                  <div className="bg-white p-5 rounded-xl shadow-sm space-y-2">
                    <p className="text-sm text-gray-600">
                      1. <strong>Turun Job:</strong> Kamu dipilih oleh majikan (setelah interview).
                    </p>
                    <p className="text-sm text-gray-600">
                      2. <strong>Tanda Tangan Kontrak (PK):</strong> Baca isi kontrak baik-baik (gaji, potongan, libur).
                    </p>
                    <p className="text-sm text-gray-600">
                      3. <strong>Visa:</strong> PT mengurus visa kerjamu di TETO (Taipei Economic and Trade Office).
                    </p>
                    <p className="text-sm text-gray-600">
                      4. <strong>PAP & KTKLN:</strong> Ikut pembekalan akhir dan dapat kartu E-PMI.
                    </p>
                    <p className="text-sm font-bold text-kr-accent mt-2">
                      Siap berangkat ke Taiwan! 🇹🇼
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PENAMPILAN (Renamed from Preparation) */}
          {activeTab === 'preparation' && (
            <motion.div
              key="preparation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <h3 className="font-heading font-bold text-lg text-blue-800 mb-4 flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Penampilan (Grooming)
                  </h3>
                  <ul className="space-y-3 text-sm text-blue-900/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Rambut:</strong> Rapi, diikat satu (kuncir kuda) jika panjang. Jangan diwarnai mencolok. Poni jangan menutupi mata.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Wajah:</strong> Makeup natural (bedak tipis + lipstik pucat). Jangan menor! Majikan suka yang terlihat "bersih" dan "polos".</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Pakaian:</strong> Kemeja putih bersih (dikancing sampai atas), celana bahan hitam, sepatu pantofel/hitam tertutup.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Aksesoris:</strong> Lepas semua perhiasan (anting, kalung, gelang, cincin). Jam tangan boleh tapi yang simple.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-6 rounded-2xl">
                  <h3 className="font-heading font-bold text-lg text-orange-800 mb-4 flex items-center gap-2">
                    <Smile className="w-5 h-5" />
                    Bahasa Tubuh (Body Language)
                  </h3>
                  <ul className="space-y-3 text-sm text-orange-900/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Senyum:</strong> Wajib senyum ramah dari awal masuk sampai keluar ruangan. Jangan cemberut atau terlihat tegang.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Kontak Mata:</strong> Tatap mata pewawancara saat menjawab. Menunduk = tidak percaya diri / menyembunyikan sesuatu.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Posisi Duduk:</strong> Tegak, jangan bersandar malas. Tangan diletakkan rapi di atas paha. Kaki rapat, jangan disilang.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Suara:</strong> Lantang, jelas, dan tegas. Jangan bergumam. Suara kecil = dianggap sakit-sakitan atau pemalu.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-kr-bg p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-lg text-kr-text mb-2">💡 Mindset Juara</h3>
                <p className="text-kr-text-light text-sm leading-relaxed">
                  Agency mencari orang yang <strong>"Nurut, Kuat, dan Niat Kerja"</strong>. Mereka tidak mencari yang paling pintar, tapi yang paling bisa diatur dan tidak banyak menuntut. Tunjukkan bahwa kamu siap menderita demi masa depan (ini kunci lolos!).
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: TANYA JAWAB */}
          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {[
                  {
                    q: "Kenapa mau kerja ke Taiwan?",
                    a: "Ingin membantu ekonomi keluarga, membiayai sekolah anak/adik, dan menabung untuk modal usaha di masa depan.",
                    tip: "Jangan jawab 'ingin jalan-jalan' atau 'cari pengalaman'. Fokus ke UANG dan KELUARGA."
                  },
                  {
                    q: "Pekerjaan di Taiwan itu berat, bangun pagi tidur malam, sanggup?",
                    a: "Sanggup! Saya sudah biasa kerja keras. Di rumah/tempat kerja lama saya juga biasa bangun subuh dan tidur malam.",
                    tip: "Jawab dengan tegas dan cepat. Jangan ragu sedetikpun."
                  },
                  {
                    q: "Kalau majikan cerewet atau galak, kamu gimana?",
                    a: "Tidak apa-apa. Saya akan tetap bekerja dengan baik, sabar, dan mendengarkan arahan majikan. Saya anggap itu masukan biar saya lebih baik.",
                    tip: "Jangan jawab 'saya akan lapor agency' atau 'saya akan lawan'. Tunjukkan kamu penurut."
                  },
                  {
                    q: "Kalau tidak boleh libur, gimana?",
                    a: "Saya bersedia tidak libur. Saya ke Taiwan niatnya kerja cari uang, jadi lembur malah lebih bagus buat saya.",
                    tip: "Agency lebih suka kandidat yang mau lembur (tidak libur) karena dianggap fokus kerja."
                  },
                  {
                    q: "Suami/Orang tua mengizinkan?",
                    a: "Sangat mengizinkan dan mendukung penuh. Anak-anak sudah ada yang jaga (neneknya/suami).",
                    tip: "Pastikan tidak ada keraguan soal izin keluarga. Ini alasan utama TKI dipulangkan (homesick/keluarga tidak setuju)."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-kr-peach text-white flex items-center justify-center text-xs font-bold flex-shrink-0">Q</div>
                      <h4 className="font-bold text-gray-800">{item.q}</h4>
                    </div>
                    <div className="flex gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-kr-mint text-kr-text flex items-center justify-center text-xs font-bold flex-shrink-0">A</div>
                      <p className="text-gray-600 text-sm italic">"{item.a}"</p>
                    </div>
                    <div className="ml-9 bg-gray-50 p-3 rounded-lg text-xs text-gray-500 border-l-4 border-kr-accent">
                      <strong>💡 Tips:</strong> {item.tip}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PERKENALAN DIRI */}
          {activeTab === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-kr-bg to-white p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-xl text-center mb-6">Template Perkenalan Diri (Zìjiè Shào)</h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Pembukaan</p>
                    <p className="text-lg font-medium text-gray-800 mb-1">Dàjiā hǎo. Wǒ yào jièshào wǒ zìjǐ.</p>
                    <p className="text-sm text-gray-500 italic">Halo semuanya. Saya ingin memperkenalkan diri.</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Data Diri</p>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-800">Wǒ jiào [NAMA].</p>
                        <p className="text-sm text-gray-500 italic">Nama saya [Nama].</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Wǒ jīnnián [UMUR] suì.</p>
                        <p className="text-sm text-gray-500 italic">Umur saya [Umur] tahun.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Wǒ shēngāo [TINGGI] gōngfēn, tǐzhòng [BERAT] gōngjīn.</p>
                        <p className="text-sm text-gray-500 italic">Tinggi saya [...] cm, berat [...] kg.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Wǒ jiéhūn le / Wǒ hái méi jiéhūn.</p>
                        <p className="text-sm text-gray-500 italic">Saya sudah menikah / Saya belum menikah.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Pengalaman & Komitmen</p>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-800">Wǒ zài Yìnní zuò guò [PEKERJAAN].</p>
                        <p className="text-sm text-gray-500 italic">Saya di Indonesia pernah kerja sebagai [...].</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Wǒ huì zhàogù lǎorén / Wǒ huì zuò jiāwù.</p>
                        <p className="text-sm text-gray-500 italic">Saya bisa jaga orang tua / Saya bisa mengerjakan PRT.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Wǒ huì nǔlì gōngzuò. Xièxiè.</p>
                        <p className="text-sm text-gray-500 italic">Saya akan bekerja keras. Terima kasih.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-800 flex gap-3">
                  <Mic2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Tips Latihan:</strong> Hafalkan teks ini di luar kepala. Ucapkan dengan lantang di depan cermin setiap hari sampai lancar dan tidak terbata-bata.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DO'S & DON'TS */}
          {activeTab === 'tips' && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DO'S */}
                <div className="bg-green-50 p-6 rounded-2xl">
                  <h3 className="font-heading font-bold text-lg text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    WAJIB DILAKUKAN (DO'S)
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Datang tepat waktu (15 menit sebelum jadwal).",
                      "Matikan HP saat wawancara berlangsung.",
                      "Jabat tangan dengan tegas (jika diajak salaman).",
                      "Ucapkan salam (Zao An / Ni Hao) saat masuk.",
                      "Duduk tegak, kaki rapat, tangan di paha.",
                      "Tatap mata pewawancara.",
                      "Jawab dengan jujur tapi 'diplomatis'.",
                      "Ucapkan terima kasih (Xie Xie) saat selesai."
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-green-900/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DON'TS */}
                <div className="bg-red-50 p-6 rounded-2xl">
                  <h3 className="font-heading font-bold text-lg text-red-800 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    DILARANG KERAS (DON'TS)
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Datang terlambat dengan alasan macet.",
                      "Bau badan atau bau mulut (wajib sikat gigi!).",
                      "Mengunyah permen karet saat wawancara.",
                      "Memotong pembicaraan pewawancara.",
                      "Melihat jam tangan berulang kali.",
                      "Menjelek-jelekkan majikan/pekerjaan lama.",
                      "Bertanya soal 'libur' atau 'kenaikan gaji' di awal.",
                      "Terlihat lesu, mengantuk, atau tidak bersemangat."
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-red-900/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <HeartHandshake className="w-12 h-12 text-kr-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold text-lg text-kr-text mb-2">Kunci Terakhir: Doa & Restu Orang Tua</h3>
                <p className="text-kr-text-light text-sm max-w-lg mx-auto">
                  Semua persiapan teknis sudah kamu miliki di atas. Terakhir, jangan lupa minta doa restu orang tua sebelum berangkat interview. Aura positif dari doa orang tua itu nyata dan bisa dirasakan oleh pewawancara lho! Semangat! 💪
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
