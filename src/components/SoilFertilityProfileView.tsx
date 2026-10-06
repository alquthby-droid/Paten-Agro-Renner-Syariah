import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Printer,
  ChevronRight,
  Info,
  Droplets,
  Sprout,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { SoilTextureType, SoilFertilityProfile, CommodityId } from '../types';
import { SOIL_CONDITIONS, NUTRIENT_PH_TABLE } from '../data/soilKnowledge';
import { COMMODITIES, formatRupiah, formatNumber } from '../utils/calculatorEngine';
import { addSoilProfile, getSoilProfiles, addNotification } from '../utils/offlineStorage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SoilFertilityProfileViewProps {
  onApplyToCalculator?: (ph: number, commodityId: CommodityId) => void;
}

const TEXTURE_INFO: Record<SoilTextureType, { label: string; icon: string; desc: string; risk: string }> = {
  lempung_berat: {
    label: 'Tanah Liat / Lempung Berat (Clay)',
    icon: '🧱',
    desc: 'Tekstur liat padat, lengket saat basah dan retak saat kering. Akibat kimia granul bertahun-tahun, pori-pori tanah tertutup.',
    risk: 'Sirkulasi udara & air buruk, hara fosfat terikat kuat partikel liat.'
  },
  lempung_berpasir: {
    label: 'Tanah Lempung Berpasir (Sandy Loam)',
    icon: '🌱',
    desc: 'Struktur remah seimbang, aerasi perakaran baik dan mudah diolah.',
    risk: 'Responsif terhadap pupuk nano Paten, mudah mempertahankan kelembapan ideal.'
  },
  gambut: {
    label: 'Tanah Gambut / Rawa Masam (Peat)',
    icon: '🍂',
    desc: 'Bahan organik belum terurai sempurna, sangat masam (pH sering < 4.5), drainase lambat.',
    risk: 'Toksisitas asam organik tinggi, miskin kation Kalsium & Magnesium.'
  },
  pasir: {
    label: 'Tanah Pasir Porus (Sandy)',
    icon: '🏖️',
    desc: 'Partikel kasar berbutir, daya ikat air dan unsur hara sangat rendah.',
    risk: 'Pupuk kimia konvensional 80% hilang tercuci air hujan (leaching).'
  },
  aluvial: {
    label: 'Tanah Aluvial Lembah / Endapan Sungai',
    icon: '🌾',
    desc: 'Endapan lumpur mineral halus di dataran rendah persawahan, kesuburan alami cukup baik.',
    risk: 'Rentan pemadatan permukaan jika sering tergenang air masam.'
  },
  kapur: {
    label: 'Tanah Kapur / Alkalis (Calcareous)',
    icon: '⛰️',
    desc: 'Kadar kalsium karbonat tinggi dengan pH alkalis (> 7.5), sering ditemukan di perbukitan kapur.',
    risk: 'Fosfor (P) dan Seng (Zn) terikat kalsium sehingga tidak bisa diserap tanaman.'
  }
};

export const SoilFertilityProfileView: React.FC<SoilFertilityProfileViewProps> = ({
  onApplyToCalculator
}) => {
  const [phInput, setPhInput] = useState<number>(5.4);
  const [texture, setTexture] = useState<SoilTextureType>('lempung_berat');
  const [organicMatter, setOrganicMatter] = useState<'Rendah (<1%)' | 'Sedang (1-3%)' | 'Tinggi (>3%)'>('Rendah (<1%)');
  const [drainage, setDrainage] = useState<'Cepat / Porus' | 'Baik / Ideal' | 'Terhambat / Becek'>('Terhambat / Becek');
  const [commodityId, setCommodityId] = useState<CommodityId>('padi');
  const [farmerName, setFarmerName] = useState<string>('Petani Mitra Renner');
  const [locationName, setLocationName] = useState<string>('Lahan Blok Subur');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  const [savedProfiles, setSavedProfiles] = useState<SoilFertilityProfile[]>(() => getSoilProfiles());

  // Real-time Fertility Diagnosis Engine
  const diagnosis = useMemo(() => {
    let score = 50;

    // pH scoring (ideal is 6.5 - 7.0)
    if (phInput >= 6.5 && phInput <= 7.0) {
      score += 30;
    } else if (phInput >= 6.0 && phInput < 6.5) {
      score += 20;
    } else if (phInput >= 5.3 && phInput < 6.0) {
      score += 5;
    } else if (phInput >= 4.5 && phInput < 5.3) {
      score -= 15;
    } else {
      score -= 25;
    }

    // Texture scoring
    if (texture === 'lempung_berpasir' || texture === 'aluvial') {
      score += 15;
    } else if (texture === 'lempung_berat') {
      score -= 5;
    } else if (texture === 'gambut' || texture === 'pasir') {
      score -= 15;
    }

    // Organic matter scoring
    if (organicMatter === 'Tinggi (>3%)') score += 10;
    else if (organicMatter === 'Rendah (<1%)') score -= 10;

    // Drainage scoring
    if (drainage === 'Baik / Ideal') score += 10;
    else if (drainage === 'Terhambat / Becek') score -= 10;

    score = Math.max(15, Math.min(98, score));

    let healthCategory: SoilFertilityProfile['healthCategory'] = 'Cukup Baik';
    if (score < 40) healthCategory = 'Sangat Buruk (Kritis)';
    else if (score < 60) healthCategory = 'Kurang Subur';
    else if (score < 80) healthCategory = 'Cukup Baik';
    else healthCategory = 'Sangat Subur';

    // Limiting factors identification
    const limitingFactors: string[] = [];
    if (phInput < 5.3) {
      limitingFactors.push('Keasaman tanah ekstrem (pH < 5.3): Fosfat dan Kalium mengendap, toksisitas ion Al dan Fe tinggi.');
    } else if (phInput < 6.0) {
      limitingFactors.push('Tanah masam: Penyerapan pupuk kimia terbuang >48%, tanaman rentan kerdil.');
    } else if (phInput > 7.5) {
      limitingFactors.push('Tanah alkalis (pH > 7.5): Fosfor dan Seng terikat ion kalsium berlebih.');
    }

    if (texture === 'lempung_berat') {
      limitingFactors.push('Pemadatan partikel liat: Tanah membatu dan keras akibat garam pupuk kimia bertahun-tahun, porositas udara minim.');
    } else if (texture === 'gambut') {
      limitingFactors.push('Kandungan asam fenolat dan pirit berlebih: Akumulasi bahan masam mengganggu perakaran.');
    } else if (texture === 'pasir') {
      limitingFactors.push('Daya retensi air rendah: Unsur hara mudah lolos ke lapisan tanah dalam sebelum diserap akar.');
    }

    if (drainage === 'Terhambat / Becek') {
      limitingFactors.push('Drainase terhambat: Membuka peluang perkembangbiakan spora jamur tular tanah (Fusarium & Phytophthora).');
    }

    // Product recommendation mapping
    let primaryProduct = 'PATEN GOLD (Unsur Hara Nano + Pembenah Tanah)';
    let supportProduct = 'PATEN IMUN (Bio-Imunostimulan Antivirus & Antijamur)';
    let dosageGuide = '1 Sachet Paten Gold per tangki 16-20 Liter (atau 6-8 Box per Hektar)';
    let applicationMethod = 'Semprot kasar stomata daun pagi hari pukul 06.00-09.00 & kocor perakaran aktif.';

    if (phInput < 5.8) {
      primaryProduct = 'PATEN GOLD (Soil Treatment & Nano Nutrition)';
      dosageGuide = '1 Sachet Paten Gold + Urea/ZA 1 gelas per 20L air (HST 14 & 28 kocor akar).';
      applicationMethod = 'Semprot stomata daun pagi hari + kocor perakaran. Unsur pembenah tanah Paten Gold menaikkan pH menuju 6.5.';
    }

    if (commodityId === 'sapi' || commodityId === 'kerbau' || commodityId === 'kambing' || commodityId === 'ayam_itik') {
      primaryProduct = 'PATEN TAMBAK & TERNAK (Paten Hijau Nano)';
      supportProduct = 'PATEN IMUN (Antivirus PMK & Kesehatan Pencernaan)';
      dosageGuide = '1 sachet Paten Hijau + 1 sachet Paten Imun per 150-200 Liter air minum / pakan komboran.';
      applicationMethod = 'Campurkan pada air minum atau komboran pakan, serta semprotkan 1x seminggu ke alas kandang.';
    }

    return {
      score,
      healthCategory,
      limitingFactors,
      primaryProduct,
      supportProduct,
      dosageGuide,
      applicationMethod,
      recoverySchedule: [
        'Tahap 1 (Aplikasi Awal): Nutrisi nano Paten diserap instan melalui mulut daun tanpa menunggu tanah membaik.',
        'Tahap 2 (Pembenahan Fisik & Biologi Tanah): Unsur soil treatment dalam Paten Gold mengurai kerak kimia, memulihkan porositas dan mengaktifkan kembali cacing/mikroba tanah.',
        'Tahap 3 (Penstabilan pH): Keasaman tanah ternetralisir bertahap menuju rentang optimum 6.5 - 7.0 sehingga hasil panen stabil naik.'
      ]
    };
  }, [phInput, texture, organicMatter, drainage, commodityId]);

  const handleSaveProfile = () => {
    const profile = addSoilProfile({
      farmerName,
      locationName,
      phValue: phInput,
      texture,
      organicMatter,
      drainage,
      currentCrop: COMMODITIES[commodityId]?.name || 'Padi Sawah',
      fertilityScore: diagnosis.score,
      healthCategory: diagnosis.healthCategory,
      limitingFactors: diagnosis.limitingFactors,
      nutrientAvailability: {
        macro: {
          n: phInput >= 6.0 ? 'Optimal' : phInput >= 5.3 ? 'Terbatas' : 'Defisit',
          p: phInput >= 6.0 && phInput <= 7.2 ? 'Optimal' : 'Terikat / Defisit',
          k: phInput >= 5.5 ? 'Optimal' : 'Terbatas',
          mg: phInput >= 6.5 ? 'Optimal' : 'Sangat Terbatas',
          ca: phInput >= 6.5 ? 'Optimal' : 'Sangat Terbatas'
        },
        micro: {
          zn: phInput <= 7.0 ? 'Optimal' : 'Terikat Kalsium',
          fe: phInput <= 6.5 ? 'Optimal' : 'Terbatas',
          b: phInput >= 5.5 && phInput <= 7.0 ? 'Optimal' : 'Terbatas',
          cu: phInput >= 5.5 ? 'Optimal' : 'Terbatas'
        }
      },
      rennerProductRecommendation: {
        primaryProduct: diagnosis.primaryProduct,
        supportProduct: diagnosis.supportProduct,
        dosageGuide: diagnosis.dosageGuide,
        applicationMethod: diagnosis.applicationMethod,
        targetBenefits: [
          'Menghemat pupuk kimia granul hingga 70-100%',
          'Menggantikan fungisida kimia 100% dengan Paten Imun',
          'Menaikkan porositas dan menetralkan keasaman tanah',
          'Hasil panen melonjak rata-rata 35% - 60%'
        ],
        recoverySchedule: diagnosis.recoverySchedule
      }
    });

    setSavedProfiles(getSoilProfiles());
    setIsSaved(true);
    addNotification({
      title: '🌱 Profil Kesuburan Tanah Disimpan',
      message: `Profil lahan ${locationName} (pH ${phInput}) berhasil dicatat. Skor kesuburan: ${diagnosis.score}/100.`,
      type: 'jadwal',
      priority: 'normal'
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(10, 114, 59); // Renner Green #0A723B
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('PT. RENNER INTI INTERNASIONAL', 14, 11);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('RENNER SYARIAH • SISTEM DIAGNOSTIK & PROFIL KESUBURAN TANAH', 14, 18);
    doc.setFontSize(8);
    doc.text('Izin Kementan RI: 02.02.2022.763 • DSN-MUI: 012.161.01/DSN-MUI/1X/2023', 14, 23);

    // Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN HASIL ANALISIS KESUBURAN TANAH & REKOMENDASI PRODUK', 14, 38);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal Diagnostik: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 44);
    doc.text(`Nama Petani / Mitra: ${farmerName}`, 14, 49);
    doc.text(`Lokasi Lahan: ${locationName}`, 14, 54);
    doc.text(`Komoditi Target: ${COMMODITIES[commodityId]?.name || 'Padi Sawah'}`, pageWidth / 2, 44);
    doc.text(`Nilai pH Tanah: ${phInput.toFixed(1)} (${phInput < 5.3 ? 'Sangat Masam' : phInput < 6.0 ? 'Masam' : phInput <= 7.0 ? 'Ideal' : 'Alkalis'})`, pageWidth / 2, 49);
    doc.text(`Tekstur Tanah: ${TEXTURE_INFO[texture].label}`, pageWidth / 2, 54);

    // Score Summary Box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(14, 60, pageWidth - 28, 20, 2, 2, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`SKOR KESUBURAN TANAH: ${diagnosis.score} / 100  (${diagnosis.healthCategory.toUpperCase()})`, 20, 69);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Analisis berdasarkan ketersediaan 12 unsur hara, struktur granul tanah, dan interaksi pH terhadap perakaran.', 20, 75);

    // Table Rekomendasi
    autoTable(doc, {
      startY: 84,
      head: [['Parameter Analisis', 'Kondisi Aktual Lahan', 'Solusi Teknologi Nano Renner Syariah']],
      body: [
        ['Nilai pH Tanah', `${phInput.toFixed(1)} (${phInput < 6.0 ? 'Masam/Kurang Ideal' : 'Optimal'})`, 'Paten Gold dilengkapi unsur pembenah tanah menormalkan pH ke 6.5.'],
        ['Tekstur Lapisan Tanah', TEXTURE_INFO[texture].label, 'Partikel nutrisi nano langsung menembus stomata daun tanpa kendala tekstur liat/pasir.'],
        ['Produk Rekomendasi Utama', diagnosis.primaryProduct, 'Hasil riset >13 tahun ahli pertanian, pelopor nano organik sachet praktis.'],
        ['Produk Bio-Proteksi', diagnosis.supportProduct, 'Menggantikan fungisida kimia 100%, menangkal virus bule, kresek, dan jamur layu.'],
        ['Takaran & Dosis Aplikasi', diagnosis.dosageGuide, diagnosis.applicationMethod]
      ],
      headStyles: { fillColor: [10, 114, 59], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    // Limiting factors & tips
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Kendala Utama Lapangan & Langkah Pemulihan Lahan:', 14, finalY);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    let curY = finalY + 5;
    diagnosis.limitingFactors.forEach(factor => {
      doc.text(`• ${factor}`, 14, curY);
      curY += 4.5;
    });

    curY += 2;
    diagnosis.recoverySchedule.forEach(step => {
      doc.text(`✓ ${step}`, 14, curY);
      curY += 4.5;
    });

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Dokumen diagnostik resmi kesuburan tanah PT Renner Inti Internasional (Makassar, Sulawesi Selatan).', 14, 280);

    doc.save(`Profil-Kesuburan-Tanah-pH${phInput.toFixed(1)}-${new Date().getTime().toString().slice(-4)}.pdf`);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-800 text-white rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold mb-2">
            <Sprout className="w-3.5 h-3.5 text-amber-300" />
            <span>Diagnostik Spesifik Lahan Petani Nusantara</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
            Profil Kesuburan Tanah & Rekomendasi Produk
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Masukkan nilai pH dan tekstur tanah lahan Anda untuk memperoleh diagnosis ilmiah ketersediaan hara serta paket produk Renner Syariah yang paling presisi.
          </p>
        </div>
      </div>

      {/* Segment Navigation */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold gap-1">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2 rounded-lg transition-all text-center ${
            activeTab === 'form'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔬 Form Uji Kesuburan Lahan
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-lg transition-all text-center ${
            activeTab === 'history'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 Riwayat Profil Tersimpan ({savedProfiles.length})
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="space-y-5">
          {/* Form Input Section */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            {/* Identity & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Petani / Pemilik Lahan:
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Contoh: Pak Daeng Rahman"
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama / Lokasi Lahan:
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Contoh: Lahan Blok Bawah Subang / Bone"
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Input Nilai pH Tanah */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    1. Nilai Keasaman Tanah (pH)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Gunakan pH meter tanah atau kertas lakmus (skala 3.0 s/d 9.0)
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    phInput < 5.3
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : phInput < 6.0
                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                      : phInput <= 7.0
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    pH {phInput.toFixed(1)} • {phInput < 5.3 ? 'Sangat Masam' : phInput < 6.0 ? 'Masam' : phInput <= 7.0 ? 'Ideal / Subur' : 'Alkalis'}
                  </span>
                </div>
              </div>

              {/* Slider pH */}
              <input
                type="range"
                min={3.5}
                max={8.5}
                step={0.1}
                value={phInput}
                onChange={(e) => setPhInput(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
              />

              {/* Quick Presets matching screenshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5">
                {[
                  { ph: 4.8, label: 'pH 4.5 – 5.2 (Sangat Masam)', color: 'bg-rose-500' },
                  { ph: 5.5, label: 'pH 5.3 – 5.9 (Masam)', color: 'bg-orange-500' },
                  { ph: 6.2, label: 'pH 6.0 – 6.4 (Agak Masam)', color: 'bg-amber-400' },
                  { ph: 6.8, label: 'pH 6.5 – 7.0 (Subur Ideal)', color: 'bg-emerald-500' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhInput(item.ph)}
                    className={`p-2 rounded-xl border text-xs text-left transition-colors flex items-center justify-between ${
                      Math.abs(phInput - item.ph) < 0.4
                        ? 'border-emerald-600 bg-emerald-50/70 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Tekstur Tanah */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Tekstur & Struktur Fisik Tanah Lahan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(Object.keys(TEXTURE_INFO) as SoilTextureType[]).map((texKey) => {
                  const tex = TEXTURE_INFO[texKey];
                  const isSelected = texture === texKey;
                  return (
                    <button
                      key={texKey}
                      type="button"
                      onClick={() => setTexture(texKey)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{tex.icon}</span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{tex.label}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{tex.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameter Pendukung: Bahan Organik & Drainase */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bahan Organik (Humus):
                </label>
                <select
                  value={organicMatter}
                  onChange={(e) => setOrganicMatter(e.target.value as any)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                >
                  <option value="Rendah (<1%)">Rendah (&lt;1%) - Rusak kimia granul</option>
                  <option value="Sedang (1-3%)">Sedang (1 - 3%)</option>
                  <option value="Tinggi (>3%)">Tinggi (&gt;3%) - Kaya sisa organik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kondisi Drainase / Air Lahan:
                </label>
                <select
                  value={drainage}
                  onChange={(e) => setDrainage(e.target.value as any)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                >
                  <option value="Terhambat / Becek">Terhambat / Becek (Rawan jamur)</option>
                  <option value="Baik / Ideal">Baik / Ideal (Sirkulasi lancar)</option>
                  <option value="Cepat / Porus">Cepat / Porus (Pasir, air cepat hilang)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Komoditi Sasaran:
                </label>
                <select
                  value={commodityId}
                  onChange={(e) => setCommodityId(e.target.value as CommodityId)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                >
                  {Object.values(COMMODITIES).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Diagnostic Result & Renner Recommendations */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            {/* Fertility Score Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Hasil Diagnostik Lahan
                  </span>
                  <span className="text-xs text-slate-400">Status Kesehatan Tanah</span>
                </div>
                <h3 className="text-lg font-black text-white font-['Outfit'] mt-1">
                  Kategori: {diagnosis.healthCategory}
                </h3>
                <p className="text-xs text-slate-300 max-w-md">
                  Kombinasi pH {phInput.toFixed(1)} dan {TEXTURE_INFO[texture].label.split('(')[0].trim()}.
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-['Outfit']">
                  {diagnosis.score}
                </span>
                <span className="text-sm text-slate-400"> / 100</span>
                <p className="text-[11px] text-emerald-200 mt-0.5">Indeks Kesuburan</p>
              </div>
            </div>

            {/* Kendala Kritis Lahan */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Faktor Pembatas & Masalah Tanah yang Terdeteksi:
              </h4>
              <div className="space-y-1.5">
                {diagnosis.limitingFactors.map((factor, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rekomendasi Solusi Produk Renner Syariah */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    R
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Rekomendasi Paket Produk Renner Syariah:
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Solusi presisi untuk mengatasi kondisi spesifik lahan Anda
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-700 text-white">
                  Resep Ahli
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Produk Utama Pembenah & Nutrisi:
                  </span>
                  <p className="text-xs font-black text-emerald-900 mt-1">{diagnosis.primaryProduct}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Nutrisi molekul nano langsung diserap lewat mulut daun (stomata) tanpa hambatan tanah masam.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Produk Proteksi Imun Tanaman:
                  </span>
                  <p className="text-xs font-black text-blue-900 mt-1">{diagnosis.supportProduct}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Memproteksi jaringan akar dari jamur patogen tular tanah dan memicu kekebalan sel tanaman.
                  </p>
                </div>
              </div>

              {/* Takaran & Cara Aplikasi */}
              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-900 min-w-[120px]">Takaran Dosis:</span>
                  <span className="text-emerald-800 font-semibold">{diagnosis.dosageGuide}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-900 min-w-[120px]">Cara Aplikasi:</span>
                  <span className="text-slate-700">{diagnosis.applicationMethod}</span>
                </div>
              </div>

              {/* 3 Langkah Pemulihan */}
              <div>
                <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block mb-1.5">
                  Protokol Pemulihan Lahan Berkelanjutan:
                </span>
                <div className="space-y-1 text-xs text-emerald-900">
                  {diagnosis.recoverySchedule.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Simpan, Ekspor PDF, Terapkan ke Kalkulator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                    isSaved
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Profil Tersimpan!' : 'Simpan Profil Ini'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Ekspor PDF</span>
                </button>
              </div>

              {onApplyToCalculator && (
                <button
                  type="button"
                  onClick={() => onApplyToCalculator(phInput, commodityId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Buka di Kalkulator Biaya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Riwayat Profil Kesuburan Tanah ({savedProfiles.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Daftar diagnosa lahan petani yang tersimpan di perangkat offline
              </p>
            </div>
          </div>

          {savedProfiles.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Sprout className="w-10 h-10 mx-auto opacity-40 text-emerald-600" />
              <p className="text-xs">Belum ada profil kesuburan tanah yang disimpan.</p>
              <button
                onClick={() => setActiveTab('form')}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                Buat Diagnosa Baru Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProfiles.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{p.locationName}</h4>
                      <p className="text-[11px] text-slate-500">
                        Petani: {p.farmerName} • Komoditi: {p.currentCrop} • {p.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Skor: {p.fertilityScore}/100 ({p.healthCategory})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nilai pH:</span>
                      <span className="font-bold text-slate-800">pH {p.phValue.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tekstur:</span>
                      <span className="font-medium text-slate-800 truncate">{TEXTURE_INFO[p.texture]?.label.split('(')[0]}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 block">Solusi Renner:</span>
                      <span className="font-bold text-emerald-800 truncate block">{p.rennerProductRecommendation.primaryProduct}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
