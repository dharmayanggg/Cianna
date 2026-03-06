import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("database.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS dictionary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    indo TEXT,
    mandarin TEXT,
    pronunciation TEXT,
    is_custom INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const initialData = JSON.parse(fs.readFileSync("./src/dictionaryData.json", "utf-8"));

const extraData = [
  { category: "Greeting & Daily Life", indo: "Senang bertemu denganmu", mandarin: "很高興見到你", pronunciation: "Hěn gāoxìng jiàn dào nǐ" },
  { category: "Greeting & Daily Life", indo: "Siapa namamu?", mandarin: "你叫什麼名字？", pronunciation: "Nǐ jiào shénme míngzì?" },
  { category: "Greeting & Daily Life", indo: "Nama saya...", mandarin: "我的名字是...", pronunciation: "Wǒ de míngzì shì..." },
  { category: "Greeting & Daily Life", indo: "Berapa umurmu?", mandarin: "你幾歲？", pronunciation: "Nǐ jǐ suì?" },
  { category: "Greeting & Daily Life", indo: "Saya dari Indonesia", mandarin: "我來自印尼", pronunciation: "Wǒ láizì yìnní" },
  { category: "Greeting & Daily Life", indo: "Apa kabar hari ini?", mandarin: "今天你好嗎？", pronunciation: "Jīntiān nǐ hǎo ma?" },
  { category: "Greeting & Daily Life", indo: "Sampai jumpa besok", mandarin: "明天見", pronunciation: "Míngtiān jiàn" },
  { category: "Greeting & Daily Life", indo: "Semoga harimu menyenangkan", mandarin: "祝你有美好的一天", pronunciation: "Zhù nǐ yǒu měihǎo de yītiān" },
  { category: "Greeting & Daily Life", indo: "Maaf, saya tidak mengerti", mandarin: "對不起，我不明白", pronunciation: "Duìbùqǐ, wǒ bù míngbái" },
  { category: "Greeting & Daily Life", indo: "Bisa tolong bicara pelan-pelan?", mandarin: "可以請你說慢一點嗎？", pronunciation: "Kěyǐ qǐng nǐ shuō màn yīdiǎn ma?" },
  
  { category: "Working with Elderly", indo: "Kakek, mau minum air?", mandarin: "阿公，要喝水嗎？", pronunciation: "Āgōng, yào hē shuǐ ma?" },
  { category: "Working with Elderly", indo: "Nenek, mari kita jalan-jalan", mandarin: "阿嬤，我們去散步吧", pronunciation: "Āmā, wǒmen qù sànbù ba" },
  { category: "Working with Elderly", indo: "Apakah Anda merasa kedinginan?", mandarin: "你覺得冷嗎？", pronunciation: "Nǐ juédé lěng ma?" },
  { category: "Working with Elderly", indo: "Biarkan saya membantu Anda", mandarin: "讓我來幫你", pronunciation: "Ràng wǒ lái bāng nǐ" },
  { category: "Working with Elderly", indo: "Anda harus istirahat", mandarin: "你應該休息一下", pronunciation: "Nǐ yīnggāi xiūxí yīxià" },
  { category: "Working with Elderly", indo: "Apakah Anda sudah mandi?", mandarin: "你洗澡了嗎？", pronunciation: "Nǐ xǐzǎole ma?" },
  { category: "Working with Elderly", indo: "Mari kita ganti baju", mandarin: "我們換衣服吧", pronunciation: "Wǒmen huàn yīfú ba" },
  { category: "Working with Elderly", indo: "Jangan khawatir, saya di sini", mandarin: "別擔心，我在這裡", pronunciation: "Bié dānxīn, wǒ zài zhèlǐ" },
  { category: "Working with Elderly", indo: "Apakah Anda lapar?", mandarin: "你餓了嗎？", pronunciation: "Nǐ èle ma?" },
  { category: "Working with Elderly", indo: "Mari kita duduk", mandarin: "我們坐下來吧", pronunciation: "Wǒmen zuò xiàlái ba" },

  { category: "Food & Shopping", indo: "Saya mau beli ini", mandarin: "我要買這個", pronunciation: "Wǒ yāomǎi zhège" },
  { category: "Food & Shopping", indo: "Apakah ada diskon?", mandarin: "有打折嗎？", pronunciation: "Yǒu dǎzhé ma?" },
  { category: "Food & Shopping", indo: "Bisa kurang sedikit harganya?", mandarin: "可以便宜一點嗎？", pronunciation: "Kěyǐ piányí yīdiǎn ma?" },
  { category: "Food & Shopping", indo: "Di mana kasirnya?", mandarin: "收銀台在哪裡？", pronunciation: "Shōuyíntái zài nǎlǐ?" },
  { category: "Food & Shopping", indo: "Saya mau pesan ini", mandarin: "我要點這個", pronunciation: "Wǒ yàodiǎn zhège" },
  { category: "Food & Shopping", indo: "Tidak pakai pedas", mandarin: "不要辣", pronunciation: "Bùyào là" },
  { category: "Food & Shopping", indo: "Minta bilnya", mandarin: "買單", pronunciation: "Mǎidān" },
  { category: "Food & Shopping", indo: "Terima kasih, makanannya enak", mandarin: "謝謝，很好吃", pronunciation: "Xièxiè, hěn hào chī" },
  { category: "Food & Shopping", indo: "Di mana pasar terdekat?", mandarin: "最近的市場在哪裡？", pronunciation: "Zuìjìn de shìchǎng zài nǎlǐ?" },
  { category: "Food & Shopping", indo: "Saya mau air mineral", mandarin: "我要礦泉水", pronunciation: "Wǒ yào kuàngquán shuǐ" },

  { category: "Slang & Emotions", indo: "Sangat senang", mandarin: "超開心", pronunciation: "Chāo kāixīn" },
  { category: "Slang & Emotions", indo: "Jangan sedih", mandarin: "別難過", pronunciation: "Bié nánguò" },
  { category: "Slang & Emotions", indo: "Kamu hebat banget!", mandarin: "你太棒了！", pronunciation: "Nǐ tài bàngle!" },
  { category: "Slang & Emotions", indo: "Apa yang terjadi?", mandarin: "發生了什麼事？", pronunciation: "Fāshēngle shénme shì?" },
  { category: "Slang & Emotions", indo: "Lucu sekali", mandarin: "太好笑了", pronunciation: "Tài hǎoxiàole" },
  { category: "Slang & Emotions", indo: "Saya sangat marah", mandarin: "我很生氣", pronunciation: "Wǒ hěn shēngqì" },
  { category: "Slang & Emotions", indo: "Bosan sekali", mandarin: "好無聊", pronunciation: "Hǎo wúliáo" },
  { category: "Slang & Emotions", indo: "Semangat!", mandarin: "加油！", pronunciation: "Jiāyóu!" },
  { category: "Slang & Emotions", indo: "Benarkah?", mandarin: "真的嗎？", pronunciation: "Zhēn de ma?" },
  { category: "Slang & Emotions", indo: "Tentu saja", mandarin: "當然", pronunciation: "Dāngrán" },

  { category: "Emergency & Health", indo: "Saya butuh dokter", mandarin: "我需要醫生", pronunciation: "Wǒ xūyào yīshēng" },
  { category: "Emergency & Health", indo: "Di mana rumah sakit?", mandarin: "醫院在哪裡？", pronunciation: "Yīyuàn zài nǎlǐ?" },
  { category: "Emergency & Health", indo: "Saya sakit perut", mandarin: "我胃痛", pronunciation: "Wǒ wèitòng" },
  { category: "Emergency & Health", indo: "Saya demam", mandarin: "我發燒了", pronunciation: "Wǒ fāshāole" },
  { category: "Emergency & Health", indo: "Tolong panggil ambulans", mandarin: "請叫救護車", pronunciation: "Qǐng jiào jiùhù chē" },
  { category: "Emergency & Health", indo: "Saya alergi kacang", mandarin: "我對花生過敏", pronunciation: "Wǒ duì huāshēng guòmǐn" },
  { category: "Emergency & Health", indo: "Obat ini diminum kapan?", mandarin: "這個藥什麼時候吃？", pronunciation: "Zhège yào shénme shíhòu chī?" },
  { category: "Emergency & Health", indo: "Saya merasa lebih baik", mandarin: "我感覺好多了", pronunciation: "Wǒ gǎnjué hǎoduōle" },
  { category: "Emergency & Health", indo: "Kepala saya sakit", mandarin: "我頭痛", pronunciation: "Wǒ tóutòng" },
  { category: "Emergency & Health", indo: "Hati-hati!", mandarin: "小心！", pronunciation: "Xiǎoxīn!" },
  
  { category: "Transportation", indo: "Di mana stasiun kereta?", mandarin: "火車站在哪裡？", pronunciation: "Huǒchē zhàn zài nǎlǐ?" },
  { category: "Transportation", indo: "Saya mau ke bandara", mandarin: "我要去機場", pronunciation: "Wǒ yào qù jīchǎng" },
  { category: "Transportation", indo: "Berapa harga tiketnya?", mandarin: "票價是多少？", pronunciation: "Piàojià shì duōshǎo?" },
  { category: "Transportation", indo: "Apakah bus ini ke Taipei?", mandarin: "這班公車去台北嗎？", pronunciation: "Zhè bān gōngchē qù táiběi ma?" },
  { category: "Transportation", indo: "Berhenti di sini", mandarin: "在這裡停車", pronunciation: "Zài zhèlǐ tíngchē" },
  { category: "Transportation", indo: "Belok kanan", mandarin: "右轉", pronunciation: "Yòuzhuǎn" },
  { category: "Transportation", indo: "Belok kiri", mandarin: "左轉", pronunciation: "Zuǒzhuǎn" },
  { category: "Transportation", indo: "Jalan lurus saja", mandarin: "一直走", pronunciation: "Yīzhí zǒu" },
  { category: "Transportation", indo: "Di mana halte bus?", mandarin: "公車站在哪裡？", pronunciation: "Gōngchē zhàn zài nǎlǐ?" },
  { category: "Transportation", indo: "Saya tersesat", mandarin: "我迷路了", pronunciation: "Wǒ mílùle" },

  { category: "Family & Relationships", indo: "Ini ibu saya", mandarin: "這是我媽媽", pronunciation: "Zhè shì wǒ māmā" },
  { category: "Family & Relationships", indo: "Ini ayah saya", mandarin: "這是我爸爸", pronunciation: "Zhè shì wǒ bàba" },
  { category: "Family & Relationships", indo: "Saya punya dua saudara", mandarin: "我有兩個兄弟姐妹", pronunciation: "Wǒ yǒu liǎng gè xiōngdì jiěmèi" },
  { category: "Family & Relationships", indo: "Apakah kamu sudah menikah?", mandarin: "你結婚了嗎？", pronunciation: "Nǐ jiéhūnle ma?" },
  { category: "Family & Relationships", indo: "Saya sangat menyayangi keluarga saya", mandarin: "我很愛我的家人", pronunciation: "Wǒ hěn ài wǒ de jiārén" },
  { category: "Family & Relationships", indo: "Ini anak saya", mandarin: "這是我的孩子", pronunciation: "Zhè shì wǒ de háizi" },
  { category: "Family & Relationships", indo: "Kapan kamu pulang?", mandarin: "你什麼時候回家？", pronunciation: "Nǐ shénme shíhòu huí jiā?" },
  { category: "Family & Relationships", indo: "Selamat ulang tahun", mandarin: "生日快樂", pronunciation: "Shēngrì kuàilè" },
  { category: "Family & Relationships", indo: "Selamat atas pernikahannya", mandarin: "新婚快樂", pronunciation: "Xīnhūn kuàilè" },
  { category: "Family & Relationships", indo: "Kamu sangat cantik", mandarin: "你很漂亮", pronunciation: "Nǐ hěn piàoliang" },

  { category: "Work & Office", indo: "Saya sedang bekerja", mandarin: "我正在工作", pronunciation: "Wǒ zhèngzài gōngzuò" },
  { category: "Work & Office", indo: "Kapan rapatnya dimulai?", mandarin: "會議什麼時候開始？", pronunciation: "Huìyì shénme shíhòu kāishǐ?" },
  { category: "Work & Office", indo: "Bisa tolong kirim email ini?", mandarin: "可以請你發這封郵件嗎？", pronunciation: "Kěyǐ qǐng nǐ fā zhè fēng yóujiàn ma?" },
  { category: "Work & Office", indo: "Saya butuh bantuanmu", mandarin: "我需要你的幫助", pronunciation: "Wǒ xūyào nǐ de bāngzhù" },
  { category: "Work & Office", indo: "Kerja bagus!", mandarin: "做得好！", pronunciation: "Zuò dé hǎo!" },
  { category: "Work & Office", indo: "Di mana kantornya?", mandarin: "辦公室在哪裡？", pronunciation: "Bàngōngshì zài nǎlǐ?" },
  { category: "Work & Office", indo: "Saya punya ide bagus", mandarin: "我有一個好主意", pronunciation: "Wǒ yǒu yīgè hǎo zhǔyì" },
  { category: "Work & Office", indo: "Mari kita diskusikan", mandarin: "我們討論一下吧", pronunciation: "Wǒmen tǎolùn yīxià ba" },
  { category: "Work & Office", indo: "Saya akan terlambat", mandarin: "我會遲到", pronunciation: "Wǒ huì chídào" },
  { category: "Work & Office", indo: "Terima kasih atas kerja kerasnya", mandarin: "辛苦了", pronunciation: "Xīnkǔle" },

  { category: "Hobbies & Leisure", indo: "Apa hobimu?", mandarin: "你的愛好是什麼？", pronunciation: "Nǐ de àihào shì shénme?" },
  { category: "Hobbies & Leisure", indo: "Saya suka mendengarkan musik", mandarin: "我喜歡聽音樂", pronunciation: "Wǒ xǐhuān tīng yīnyuè" },
  { category: "Hobbies & Leisure", indo: "Mari kita pergi nonton film", mandarin: "我們去看電影吧", pronunciation: "Wǒmen qù kàn diànyǐng ba" },
  { category: "Hobbies & Leisure", indo: "Saya suka membaca buku", mandarin: "我喜歡看書", pronunciation: "Wǒ xǐhuān kànshū" },
  { category: "Hobbies & Leisure", indo: "Apakah kamu suka olahraga?", mandarin: "你喜歡運動嗎？", pronunciation: "Nǐ xǐhuān yùndòng ma?" },
  { category: "Hobbies & Leisure", indo: "Saya suka berenang", mandarin: "我喜歡游泳", pronunciation: "Wǒ xǐhuān yóuyǒng" },
  { category: "Hobbies & Leisure", indo: "Mari kita pergi belanja", mandarin: "我們去購物吧", pronunciation: "Wǒmen qù gòuwù ba" },
  { category: "Hobbies & Leisure", indo: "Saya suka traveling", mandarin: "我喜歡旅行", pronunciation: "Wǒ xǐhuān lǚxíng" },
  { category: "Hobbies & Leisure", indo: "Ini sangat menyenangkan", mandarin: "這很有趣", pronunciation: "Zhè hěn yǒuqù" },
  { category: "Hobbies & Leisure", indo: "Saya mau belajar hal baru", mandarin: "我想學習新事物", pronunciation: "Wǒ xiǎng xuéxí xīn shìwù" },

  { category: "Weather & Time", indo: "Hari ini cuacanya bagus", mandarin: "今天天氣很好", pronunciation: "Jīntiān tiānqì hěn hǎo" },
  { category: "Weather & Time", indo: "Apakah hari ini akan hujan?", mandarin: "今天會下雨嗎？", pronunciation: "Jīntiān huì xià yǔ ma?" },
  { category: "Weather & Time", indo: "Sangat panas hari ini", mandarin: "今天很熱", pronunciation: "Jīntiān hěn rè" },
  { category: "Weather & Time", indo: "Jam berapa sekarang?", mandarin: "現在幾點？", pronunciation: "Xiànzài jǐ diǎn?" },
  { category: "Weather & Time", indo: "Besok adalah hari Senin", mandarin: "明天是星期一", pronunciation: "Míngtiān shì xīngqí yī" },
  { category: "Weather & Time", indo: "Saya akan datang jam 5", mandarin: "我五點會來", pronunciation: "Wǒ wǔ diǎn huì lái" },
  { category: "Weather & Time", indo: "Musim dingin sangat dingin", mandarin: "冬天很冷", pronunciation: "Dōngtiān hěn lěng" },
  { category: "Weather & Time", indo: "Kapan musim semi tiba?", mandarin: "春天什麼時候來？", pronunciation: "Chūntiān shénme shíhòu lái?" },
  { category: "Weather & Time", indo: "Hari ini hari apa?", mandarin: "今天星期幾？", pronunciation: "Jīntiān xīngqí jǐ?" },
  { category: "Weather & Time", indo: "Sudah malam, waktunya tidur", mandarin: "很晚了，該睡覺了", pronunciation: "Hěn wǎnle, gāi shuìjiàole" },
  { category: "Daily Activities", indo: "Saya mau mandi", mandarin: "我要洗澡", pronunciation: "Wǒ yào xǐzǎo" },
  { category: "Daily Activities", indo: "Bantu saya bangun", mandarin: "幫我起床", pronunciation: "Bāng wǒ qǐchuáng" },
  { category: "Daily Activities", indo: "Saya mau gosok gigi", mandarin: "我要刷牙", pronunciation: "Wǒ yào shuāyá" },
  { category: "Daily Activities", indo: "Tolong ambilkan handuk", mandarin: "請給我毛巾", pronunciation: "Qǐng gěi wǒ máojīn" },
  { category: "Daily Activities", indo: "Saya mau ganti popok", mandarin: "我要換尿布", pronunciation: "Wǒ yào huàn niàobù" },
  { category: "Daily Activities", indo: "Sudah waktunya makan siang", mandarin: "該吃午飯了", pronunciation: "Gāi chī wǔfàn le" },
  { category: "Daily Activities", indo: "Saya mau tidur siang", mandarin: "我要睡午覺", pronunciation: "Wǒ yào shuì wǔjiào" },
  { category: "Daily Activities", indo: "Tolong matikan lampu", mandarin: "請關燈", pronunciation: "Qǐng guān dēng" },
  { category: "Daily Activities", indo: "Tolong nyalakan TV", mandarin: "請開電視", pronunciation: "Qǐng kāi diànshì" },
  { category: "Shopping", indo: "Berapa harganya satu kilo?", mandarin: "一公斤多少錢？", pronunciation: "Yī gōngjīn duōshǎo qián?" },
  { category: "Shopping", indo: "Saya mau yang segar", mandarin: "我要新鮮的", pronunciation: "Wǒ yào xīnxiān de" },
  { category: "Shopping", indo: "Apakah ini manis?", mandarin: "這個甜嗎？", pronunciation: "Zhège tián ma?" },
  { category: "Shopping", indo: "Saya mau beli buah", mandarin: "我要買水果", pronunciation: "Wǒ yào mǎi shuǐguǒ" },
  { category: "Shopping", indo: "Tolong bungkus ini", mandarin: "請把這個包起來", pronunciation: "Qǐng bǎ zhège bāo qǐlái" },
  { category: "Shopping", indo: "Saya mau bayar pakai kartu", mandarin: "我要刷卡", pronunciation: "Wǒ yào shuākǎ" },
  { category: "Shopping", indo: "Di mana toko roti?", mandarin: "麵包店在哪裡？", pronunciation: "Miànbāo diàn zài nǎlǐ?" },
  { category: "Shopping", indo: "Saya cari susu", mandarin: "我在找牛奶", pronunciation: "Wǒ zài zhǎo niúnǎi" },
  { category: "Shopping", indo: "Apakah ada stok lagi?", mandarin: "還有貨嗎？", pronunciation: "Hái yǒu huò ma?" },
  { category: "Shopping", indo: "Ini terlalu kecil", mandarin: " ini太小了", pronunciation: "Zhège tài xiǎole" },
  { category: "Emotions", indo: "Saya merasa kesepian", mandarin: "我感到寂寞", pronunciation: "Wǒ gǎndào jìmò" },
  { category: "Emotions", indo: "Jangan takut", mandarin: "不要害怕", pronunciation: "Bùyào hàipà" },
  { category: "Emotions", indo: "Saya sangat bangga padamu", mandarin: "我為你感到驕傲", pronunciation: "Wǒ wèi nǐ gǎndào jiāo'ào" },
  { category: "Emotions", indo: "Ini sangat mengejutkan", mandarin: "這太令人驚訝了", pronunciation: "Zhè tài lìng rén jīngyàle" },
  { category: "Emotions", indo: "Saya merasa gugup", mandarin: "我感到緊張", pronunciation: "Wǒ gǎndào jǐnzhāng" },
  { category: "Emotions", indo: "Tenang saja", pronunciation: "Fàngxīn ba", mandarin: "放心吧" },
  { category: "Emotions", indo: "Saya sangat lelah", mandarin: "我很累", pronunciation: "Wǒ hěn lèi" },
  { category: "Emotions", indo: "Kamu membuatku tertawa", mandarin: "你逗我笑", pronunciation: "Nǐ dòu wǒ xiào" },
  { category: "Emotions", indo: "Saya sangat bersyukur", mandarin: "我很感激", pronunciation: "Wǒ hěn gǎnjī" },
  { category: "Emotions", indo: "Ini hari yang buruk", mandarin: "這是糟糕的一天", pronunciation: "Zhè shì zāogāo de yītiān" },
  { category: "Health", indo: "Saya batuk", mandarin: "我咳嗽", pronunciation: "Wǒ késòu" },
  { category: "Health", indo: "Tenggorokan saya sakit", mandarin: "我喉嚨痛", pronunciation: "Wǒ hóulóng tòng" },
  { category: "Health", indo: "Saya pilek", mandarin: "我感冒了", pronunciation: "Wǒ gǎnmàole" },
  { category: "Health", indo: "Saya butuh istirahat", mandarin: "我需要休息", pronunciation: "Wǒ xūyào xiūxí" },
  { category: "Health", indo: "Kaki saya bengkak", mandarin: "我的腳腫了", pronunciation: "Wǒ de jiǎo zhǒngle" },
  { category: "Health", indo: "Saya tidak bisa tidur", mandarin: "我睡不著", pronunciation: "Wǒ shuì bù zháo" },
  { category: "Health", indo: "Saya merasa mual", mandarin: "我感到噁心", pronunciation: "Wǒ gǎndào ěxīn" },
  { category: "Health", indo: "Tolong ambilkan obat merah", mandarin: "請拿紅藥水", pronunciation: "Qǐng ná hóng yàoshuǐ" },
  { category: "Health", indo: "Saya butuh perban", mandarin: "我需要繃帶", pronunciation: "Wǒ xūyào bēngdài" },
  { category: "Health", indo: "Tekanan darah saya tinggi", mandarin: "我的血壓很高", pronunciation: "Wǒ de xiěyā hěn gāo" }
];

db.transaction(() => {
  // Clear existing to avoid duplicates if re-running
  db.prepare("DELETE FROM dictionary WHERE is_custom = 0").run();
  
  const insert = db.prepare("INSERT INTO dictionary (category, indo, mandarin, pronunciation, is_custom) VALUES (?, ?, ?, ?, 0)");
  
  for (const item of initialData) {
    // Transform pronunciation to remove Hokkien part
    const mandarinPron = item.pronunciation.split("|")[0].replace("(M)", "").trim();
    insert.run(item.category, item.indo, item.mandarin, mandarinPron);
  }

  for (const item of extraData) {
    insert.run(item.category, item.indo, item.mandarin, item.pronunciation);
  }
})();

console.log("Seeded initial dictionary data.");
