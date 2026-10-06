import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PlusCircle,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Trash2,
  FileDown,
  Printer,
  Play,
  User,
  Building2,
  MapPin,
  CheckCircle2,
  FileText,
  Smartphone,
  Download,
  Award
} from 'lucide-react';
import { HarvestRecord } from '../types';
import { getHarvestRecords, addHarvestRecord, saveHarvestRecords, addNotification } from '../utils/offlineStorage';
import { formatRupiah, formatNumber } from '../utils/calculatorEngine';
import { exportHarvestHistoryToPDF, exportAnnualAnalyticsReportToPDF, AnnualReportOptions } from '../utils/pdfExport';
import { VideoTutorialModal } from './VideoTutorialModal';
import { DeployPublishInstallGuideModal } from './DeployPublishInstallGuideModal';

export const AnalyticsDashboardView: React.FC = () => {
  const [records, setRecords] = useState<HarvestRecord[]>(() => getHarvestRecords());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [showAnnualReportModal, setShowAnnualReportModal] = useState<boolean>(false);
  const [showDeployGuideModal, setShowDeployGuideModal] = useState<boolean>(false);
  
  const [farmerNameForPdf, setFarmerNameForPdf] = useState<string>('Petani Mitra Renner Syariah');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingAnnualPdf, setIsExportingAnnualPdf] = useState<boolean>(false);

  // Annual Report form state
  const [annualFarmerName, setAnnualFarmerName] = useState<string>('Lalu Mas\'ud (Mitra Renner Syariah)');
  const [annualCooperativeName, setAnnualCooperativeName] = useState<string>('Koperasi Tani Syariah Mandiri NTB / Gapoktan Sasak Sejahtera');
  const [annualFarmLocation, setAnnualFarmLocation] = useState<string>('Kec. Narmada & Praya Timur, NTB');
  const [annualReportingYear, setAnnualReportingYear] = useState<string>('2025/2026');
  const [annualPurpose, setAnnualPurpose] = useState<string>('Pengajuan Permodalan KUR Syariah / Bank & Evaluasi Tahunan Koperasi');
  const [annualNotes, setAnnualNotes] = useState<string>('Telah mengaplikasikan paket Paten Hijau, Paten Gold, dan Paten Imun secara berkala dengan pengurangan kimia 70%.');

  // Form states for new record
  const [seasonName, setSeasonName] = useState<string>('');
  const [commodityName, setCommodityName] = useState<string>('Padi Sawah');
  const [areaInAre, setAreaInAre] = useState<number>(20);
  const [method, setMethod] = useState<'Paten Nano' | 'Kimia Konvensional'>('Paten Nano');
  const [yieldKg, setYieldKg] = useState<number>(1600);
  const [costRp, setCostRp] = useState<number>(450000);
  const [revenueRp, setRevenueRp] = useState<number>(10880000);
  const [notes, setNotes] = useState<string>('');

  const patenRecords = records.filter(r => r.method === 'Paten Nano');
  const chemicalRecords = records.filter(r => r.method === 'Kimia Konvensional');

  // Compute averages
  const avgPatenYieldTonPerHa = patenRecords.length > 0
    ? (patenRecords.reduce((acc, r) => acc + (r.yieldKg / (r.areaInAre / 100)), 0) / patenRecords.length) / 1000
    : 8.2;

  const avgChemYieldTonPerHa = chemicalRecords.length > 0
    ? (chemicalRecords.reduce((acc, r) => acc + (r.yieldKg / (r.areaInAre / 100)), 0) / chemicalRecords.length) / 1000
    : 5.5;

  const yieldImprovementPercent = avgChemYieldTonPerHa > 0
    ? ((avgPatenYieldTonPerHa - avgChemYieldTonPerHa) / avgChemYieldTonPerHa) * 100
    : 49;

  const totalPatenProfit = patenRecords.reduce((acc, r) => acc + r.profitRp, 0);
  const totalAccumulatedYieldKg = records.reduce((acc, r) => acc + r.yieldKg, 0);
  const totalAccumulatedAreaAre = records.reduce((acc, r) => acc + r.areaInAre, 0);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seasonName) return;

    const profitRp = revenueRp - costRp;
    const newRecord = addHarvestRecord({
      date: new Date().toISOString().split('T')[0],
      seasonName,
      commodityName,
      areaInAre,
      method,
      yieldKg,
      costRp,
      revenueRp,
      profitRp,
      notes: notes || '-'
    });

    setRecords([newRecord, ...records]);
    setShowAddModal(false);
    setSeasonName('');

    addNotification({
      title: '📈 Catatan Panen Baru Ditambahkan',
      message: `${seasonName} (${yieldKg} kg) berhasil dimasukkan ke dasbor analitik.`,
      type: 'jadwal',
      priority: 'normal'
    });
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Hapus catatan panen ini?')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      saveHarvestRecords(updated);
    }
  };

  const handleExportPDF = () => {
    if (records.length === 0) {
      alert('Belum ada data catatan panen untuk diekspor ke PDF.');
      return;
    }
    setIsExportingPdf(true);
    try {
      exportHarvestHistoryToPDF(records, farmerNameForPdf);
      addNotification({
        title: '📄 Laporan Rekap Panen PDF Diunduh',
        message: `Rekapitulasi historis performa panen (${records.length} catatan) berhasil diekspor ke PDF.`,
        type: 'jadwal',
        priority: 'normal'
      });
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengekspor PDF: ' + err.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportAnnualReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (records.length === 0) {
      alert('Belum ada data catatan panen untuk mengompilasi laporan tahunan.');
      return;
    }

    setIsExportingAnnualPdf(true);
    try {
      const options: AnnualReportOptions = {
        farmerName: annualFarmerName || 'Petani Mitra Renner Syariah',
        cooperativeName: annualCooperativeName || 'Gapoktan Binaan Renner Syariah',
        farmLocation: annualFarmLocation || 'Wilayah NTB',
        purpose: annualPurpose || 'Pengajuan Permodalan KUR Syariah / Evaluasi Koperasi',
        reportingYear: annualReportingYear || '2026',
        notes: annualNotes
      };

      exportAnnualAnalyticsReportToPDF(records, options);
      setShowAnnualReportModal(false);

      addNotification({
        title: '📑 Laporan Analitik Tahunan PDF Resmi Berhasil Diunduh',
        message: `Laporan tahunan untuk ${options.farmerName} (${options.purpose}) siap dilampirkan ke pihak koperasi/bank.`,
        type: 'jadwal',
        priority: 'normal'
      });
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengekspor Laporan Analitik Tahunan: ' + err.message);
    } finally {
      setIsExportingAnnualPdf(false);
    }
  };

  return (
    <div className="space-y-5 pb-24 text-slate-800 dark:text-slate-100">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-800 text-white rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden border border-emerald-700/50">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span>Dasbor Evaluasi & Histori Performa Panen</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
            Analitik Komparasi Panen Historis
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
            Kompilasi data riil tonase panen, efisiensi biaya pupuk Paten Nano vs kimia konvensional, serta laporan resmi siap cetak untuk pengajuan permodalan atau koperasi.
          </p>
        </div>
      </div>

      {/* VIP CARD: Fitur Unduh Laporan Analitik Tahunan & Panduan Deploy */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <FileDown className="w-3.5 h-3.5" />
              <span>Standar Bank KUR & Koperasi Petani</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-['Outfit'] tracking-tight">
              Laporan Analitik Tahunan Resmi (PDF Profesional)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kompilasi otomatis data historis panen ({records.length} musim tanam, {totalAccumulatedAreaAre} Are), analisis pengurangan biaya pupuk hingga 70%, rasio B/C (Benefit-Cost Ratio), serta lembar pengesahan tanda tangan 3 pihak (Petani, Pengurus Koperasi/Gapoktan, dan Pengembang Husni, S. Kom. I.).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            <button
              onClick={() => setShowAnnualReportModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all active:scale-95 border border-emerald-400/40"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Unduh Laporan Tahunan (PDF)</span>
            </button>

            <button
              onClick={() => setShowDeployGuideModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-95 border border-white/20"
              title="Panduan Deploy Cloud, PWA Android & iOS Safari"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Panduan Instal & Deploy</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rata-rata Hasil Panen Paten */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between transition-colors">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Rata-rata Panen Paten
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-['Outfit']">
                {avgPatenYieldTonPerHa.toFixed(1)} Ton/Ha
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                (+{yieldImprovementPercent.toFixed(0)}%)
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            vs Pola Kimia rata-rata: {avgChemYieldTonPerHa.toFixed(1)} Ton/Ha
          </p>
        </div>

        {/* Total Akumulasi Laba Paten */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between transition-colors">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Laba Tercatat
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 font-['Outfit'] mt-1">
              {formatRupiah(totalPatenProfit)}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            Dari {patenRecords.length} musim panen berpola Paten Nano
          </p>
        </div>

        {/* Penghematan Biaya Pupuk Rata-rata */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between transition-colors">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Efisiensi Biaya Operasional
            </span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-['Outfit'] mt-1">
              60% - 75%
            </p>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            Fungisida hemat 100%, pestisida 80%
          </p>
        </div>
      </div>

      {/* Action Header & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
            Daftar Catatan Panen Lapangan ({records.length})
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tersimpan offline di memori HP Anda. Siap diekspor ke PDF rekap singkat atau laporan tahunan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTutorialModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Video Tutorial</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Mengekspor...' : 'Rekap Ringkas'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Catatan Panen</span>
          </button>
        </div>
      </div>

      {/* Record Cards */}
      <div className="space-y-3">
        {records.map((rec) => {
          const isPaten = rec.method === 'Paten Nano';
          return (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl border transition-all ${
                isPaten
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-2xs hover:border-emerald-500'
                  : 'bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{rec.seasonName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isPaten
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {rec.method}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {rec.commodityName} • Luas: {rec.areaInAre} Are ({rec.areaInAre * 100} m²) • Tanggal: {rec.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-800 dark:text-emerald-400 font-['Outfit'] block">
                      {formatNumber(rec.yieldKg)} kg
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({((rec.yieldKg / (rec.areaInAre / 100)) / 1000).toFixed(2)} Ton/Ha eq.)
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(rec.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    title="Hapus catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs py-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Biaya Operasional:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(rec.costRp)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Penjualan:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(rec.revenueRp)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Laba Bersih:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{formatRupiah(rec.profitRp)}</span>
                </div>
              </div>

              {rec.notes && (
                <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  <strong>Evaluasi Lahan:</strong> {rec.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: Unduh Laporan Analitik Tahunan Resmi */}
      {showAnnualReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 font-['Outfit']">
                    Unduh Laporan Analitik Tahunan (PDF)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Format resmi untuk pengajuan permodalan KUR / arsip koperasi tani
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAnnualReportModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Live Metrics Highlight Card */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-extrabold">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Kompilasi Data Lapangan Terverifikasi</span>
                </span>
                <span>{records.length} Musim Panen</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Panen:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-black">{((totalAccumulatedYieldKg) / 1000).toFixed(1)} Ton</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Hemat Pupuk:</span>
                  <strong className="text-amber-600 dark:text-amber-400 font-black">60 - 75%</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Surplus Laba:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-black">{formatRupiah(totalPatenProfit)}</strong>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleExportAnnualReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Petani / Mitra Binaan
                </label>
                <input
                  type="text"
                  required
                  value={annualFarmerName}
                  onChange={(e) => setAnnualFarmerName(e.target.value)}
                  placeholder="Nama lengkap petani pemohon"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelompok Tani / Koperasi / BUMDes
                  </label>
                  <input
                    type="text"
                    required
                    value={annualCooperativeName}
                    onChange={(e) => setAnnualCooperativeName(e.target.value)}
                    placeholder="Nama KUD atau Gapoktan"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Buku Pelaporan
                  </label>
                  <input
                    type="text"
                    required
                    value={annualReportingYear}
                    onChange={(e) => setAnnualReportingYear(e.target.value)}
                    placeholder="Contoh: 2025/2026 atau 2026"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Wilayah / Lokasi Lahan
                </label>
                <input
                  type="text"
                  required
                  value={annualFarmLocation}
                  onChange={(e) => setAnnualFarmLocation(e.target.value)}
                  placeholder="Kecamatan & Kabupaten lokasi lahan"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Keperluan Penerbitan Dokumen
                </label>
                <select
                  value={annualPurpose}
                  onChange={(e) => setAnnualPurpose(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Pengajuan Permodalan KUR Syariah / Bank & Evaluasi Tahunan Koperasi">
                    Pengajuan Permodalan KUR Syariah / Bank (BSI / BRI / Mandiri)
                  </option>
                  <option value="Laporan Pertanggungjawaban Tahunan Pengurus Koperasi Tani">
                    Laporan Pertanggungjawaban Tahunan Pengurus Koperasi Tani
                  </option>
                  <option value="Pengajuan Bantuan Sarpras & Pupuk Dinas Pertanian">
                    Pengajuan Bantuan Sarpras & Pupuk Dinas Pertanian
                  </option>
                  <option value="Dokumentasi Evaluasi Kemitraan Offtaker & Investor Tani">
                    Dokumentasi Evaluasi Kemitraan Offtaker & Investor Tani
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Agronomis Tambahan
                </label>
                <textarea
                  rows={2}
                  value={annualNotes}
                  onChange={(e) => setAnnualNotes(e.target.value)}
                  placeholder="Catatan keasaman pH tanah, efektivitas Paten Imun, dll"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-normal focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p>
                  <strong>Kop Surat & Legalitas:</strong> PT. Renner Inti Internasional • DSN-MUI No. 012.161.01/DSN-MUI/1X/2023 • Kementan RI No. 02.02.2022.763.
                </p>
                <p>
                  <strong>Tanda Tangan Pengesahan:</strong> Petani Pelaksana, Ketua Koperasi/Gapoktan, dan Pengembang Husni, S. Kom. I. (Member Renner Syariah).
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAnnualReportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isExportingAnnualPdf}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingAnnualPdf ? 'Menyiapkan PDF...' : 'Download Dokumen PDF Resmi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 font-['Outfit']">
              Tambah Catatan Hasil Panen Lahan
            </h3>

            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Musim Tanam</label>
                <input
                  type="text"
                  placeholder="Contoh: Musim Rendeng 2026 / MT-1"
                  required
                  value={seasonName}
                  onChange={(e) => setSeasonName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Komoditi</label>
                  <select
                    value={commodityName}
                    onChange={(e) => setCommodityName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Padi Sawah">Padi Sawah</option>
                    <option value="Jagung Hibrida">Jagung Hibrida</option>
                    <option value="Kacang Kedelai">Kacang Kedelai</option>
                    <option value="Kelapa Sawit">Kelapa Sawit</option>
                    <option value="Bawang Merah">Bawang Merah</option>
                    <option value="Cabai">Cabai</option>
                    <option value="Tembakau">Tembakau</option>
                    <option value="Gaharu">Gaharu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Metode Pupuk</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Paten Nano">Paten Organik Nano</option>
                    <option value="Kimia Konvensional">Kimia Konvensional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Luas Lahan (Are)</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={areaInAre}
                    onChange={(e) => setAreaInAre(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hasil Panen (kg)</label>
                  <input
                    type="number"
                    min={1}
                    value={yieldKg}
                    onChange={(e) => setYieldKg(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Biaya (Rp)</label>
                  <input
                    type="number"
                    value={costRp}
                    onChange={(e) => setCostRp(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Pendapatan (Rp)</label>
                  <input
                    type="number"
                    value={revenueRp}
                    onChange={(e) => setRevenueRp(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Evaluasi</label>
                <textarea
                  rows={2}
                  placeholder="Catatan keasaman tanah, cuaca, dll"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        initialCommodityId="padi"
      />

      {/* Deploy, Publish & Install Guide Modal */}
      <DeployPublishInstallGuideModal
        isOpen={showDeployGuideModal}
        onClose={() => setShowDeployGuideModal(false)}
        isOnline={navigator.onLine}
      />
    </div>
  );
};
