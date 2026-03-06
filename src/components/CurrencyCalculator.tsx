import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function CurrencyCalculator() {
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

  return (
    <section className="container mx-auto max-w-3xl px-6 py-12">
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-kr-mint/30 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-kr-text mb-2">Kalkulator Kurs 🧮</h2>
        <p className="text-kr-text-light mb-8">Cek estimasi gaji atau pengeluaranmu di sini.</p>
        
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <label className="text-xs font-bold text-kr-text-light mb-2 block text-left">Jumlah Uang</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full p-4 bg-kr-bg rounded-2xl border border-kr-mint/20 text-2xl font-mono font-bold text-kr-text focus:outline-none focus:border-kr-accent transition-colors text-center"
            />
          </div>

          <div className="flex gap-3 p-1.5 bg-kr-bg rounded-2xl">
            <button 
              onClick={() => setCurrency('NTD')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${currency === 'NTD' ? 'bg-white shadow-sm text-kr-accent' : 'text-kr-text-light hover:text-kr-text'}`}
            >
              NTD 🇹🇼
            </button>
            <button 
              onClick={() => setCurrency('IDR')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${currency === 'IDR' ? 'bg-white shadow-sm text-red-500' : 'text-kr-text-light hover:text-kr-text'}`}
            >
              IDR 🇮🇩
            </button>
          </div>

          <motion.div 
            key={currency}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-kr-mint/10 p-8 rounded-2xl border border-kr-mint/30"
          >
            <p className="text-xs text-kr-accent mb-2 uppercase tracking-wider font-bold">Hasil Konversi</p>
            <div className="text-3xl md:text-4xl font-bold text-kr-text break-words font-heading">
              {amount ? formatCurrency(convert(amount, currency), currency === 'NTD' ? 'IDR' : 'NTD') : '-'}
            </div>
            <p className="text-[10px] text-kr-text-light mt-3">
              *Estimasi kurs: 1 NTD = {RATE} IDR
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
