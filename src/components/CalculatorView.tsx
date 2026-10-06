import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Save,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Flame,
  Scale,
  Sprout,
  FileDown,
  Play,
  Printer,
  User,
  MapPin
} from 'lucide-react';
import { CommodityId, SoilCondition } from '../types';
import { COMMODITIES, calculateFarmAnalysis, formatRupiah, formatNumber } from '../utils/calculatorEngine';
import { SOIL_CONDITIONS } from '../data/soilKnowledge';
import { addHarvestRecord, addNotification } from '../utils/offlineStorage';
import { exportCalculationToPDF } from '../utils/pdfExport';
import { VideoTutorialModal } from './VideoTutorialModal';
import { SeasonalInsightsModule } from './SeasonalInsightsModule';
import { PlantNutrientDemandCalculatorView } from './PlantNutrientDemandCalculatorView';
import { Zap } from 'lucide-react';

interface CalculatorViewProps {
  onGoToSchedule?: (commodityId: CommodityId) => void;
  onGoToSoilGuide?: () => void;
  onGoToFertilityProfiler?: () => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  onGoToSchedule,
  onGoToSoilGuide,
  onGoToFertilityProfiler
}) => {
  const [calcMode, setCalcMode] = useState<'dosis_lahan' | 'nutrisi_tanaman'>('dosis_lahan');
  const [areaInAre, setAreaInAre] = useState<number>(10); // default 10 are (1000 m2) / 10 ekor
  const [commodityId, setCommodityId] = useState<CommodityId>('padi');
  const [commodityCategoryFilter, setCommodityCategoryFilter] = useState<'all' | 'Pangan' | 'Perkebunan' | 'Peternakan'>('all');
  const [soilCondition, setSoilCondition] = useState<SoilCondition>('asam');
  const [customPrice, setCustomPrice] = useState<number | ''>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [farmerName, setFarmerName] = useState<string>('Pak Tani Binaan');
  const [farmLocation, setFarmLocation] = useState<string>('Lahan Blok Subur');
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const currentCommodity = COMMODITIES[commodityId] || COMMODITIES.padi;
  const isLivestock = currentCommodity.category === 'Peternakan';
  const activePrice = typeof customPrice === 'number' && customPrice > 0 ? customPrice : currentCommodity.defaultPricePerKg;

  const analysis = useMemo(() => {
    return calculateFarmAnalysis(areaInAre, commodityId, soilCondition, activePrice);
  }, [areaInAre, commodityId, soilCondition, activePrice]);

  const filteredCommodities = useMemo(() => {
    const all = Object.values(COMMODITIES);
    if (commodityCategoryFilter === 'all') return all;
    if (commodityCategoryFilter === 'Peternakan') return all.filter(c => c.category === 'Peternakan');
    if (commodityCategoryFilter === 'Pangan') return all.filter(c => c.category === 'Pangan');
    if (commodityCategoryFilter === 'Perkebunan') return all.filter(c => c.category === 'Perkebunan' || c.category === 'Komoditas Khusus');
    return all;
  }, [commodityCategoryFilter]);

  const handleAreaChange = (val: number) => {
    setAreaInAre(Math.min(100, Math.max(1, val)));
    setIsSaved(false);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSaveToFarmLog = () => {
    addHarvestRecord({
      date: new Date().toISOString().split('T')[0],
      seasonName: `Rencana Musim Tanam (${analysis.areaInAre} Are)`,
      commodityName: currentCommodity.name,
      areaInAre: analysis.areaInAre,
      method: 'Paten Nano',
      yieldKg: analysis.paten.yieldKg,
      costRp: analysis.paten.totalCost,
      revenueRp: analysis.paten.revenue,
      profitRp: analysis.paten.netProfit,
      notes: `Simulasi penghematan biaya: ${formatRupiah(analysis.savings.operationalSavingsRp)} (${analysis.savings.operationalSavingsPercent}%). Kondisi tanah: ${analysis.soil.label}`
    });

    addNotification({
      title: '📋 Simulasi Lahan Disimpan',
      message: `Simulasi ${analysis.areaInAre} are ${currentCommodity.name} berhasil disimpan ke Histori Panen.`,
      type: 'jadwal',
      priority: 'normal'
    });

    setIsSaved(true);
    triggerCelebration();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportPDF = () => {
    setIsExportingPdf(true);
    try {
      exportCalculationToPDF(analysis, farmerName, farmLocation);
      addNotification({
        title: '📄 Laporan PDF Berhasil Diunduh',
        message: `Laporan simulasi kalkulasi ${analysis.commodity.name} untuk lahan ${analysis.areaInAre} are telah diekspor.`,
        type: 'jadwal',
        priority: 'normal'
      });
    } catch (e: any) {
      console.error(e);
      alert('Gagal mengekspor PDF: ' + e.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const areaPresets = [1, 5, 10, 25, 50, 100];

  return (
    <div className="space-y-5 pb-24">
      {/* Top Banner Highlight */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kalkulator Efisiensi Lahan 1 s/d 100 Are (1 Ha)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
            Simulasi Penghematan & Prediksi Profit Petani
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Bandingkan biaya pupuk kimia konvensional dengan pupuk organik teknologi nano <strong>Paten Gold</strong> di berbagai kondisi pH tanah.
          </p>
        </div>
      </div>

      {/* Switcher Tab: Dosis Lahan vs Kebutuhan Nutrisi Fisiologis */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <button
          type="button"
          onClick={() => setCalcMode('dosis_lahan')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            calcMode === 'dosis_lahan'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kalkulator Dosis & Hemat Biaya Lahan</span>
        </button>
        <button
          type="button"
          onClick={() => setCalcMode('nutrisi_tanaman')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            calcMode === 'nutrisi_tanaman'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Kebutuhan Nutrisi Tanaman (N, P, K)</span>
        </button>
      </div>

      {calcMode === 'nutrisi_tanaman' ? (
        <PlantNutrientDemandCalculatorView onGoToSchedule={onGoToSchedule} />
      ) : (
        <>
          {/* Modul Wawasan Musiman Berbasis Kalender & Cuaca Real-Time */}
          <SeasonalInsightsModule
            onGoToSchedule={onGoToSchedule ? () => onGoToSchedule(commodityId) : undefined}
          />

      {/* Control Panel: Komoditi & Luas Lahan */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Pilih Komoditi */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Pilih Komoditi Unggulan ({filteredCommodities.length})
            </label>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {[
                { id: 'all' as const, label: 'Semua' },
                { id: 'Pangan' as const, label: '🌾 Pangan' },
                { id: 'Perkebunan' as const, label: '🌴 Perkebunan & Khusus' },
                { id: 'Peternakan' as const, label: '🐂 Peternakan Ternak' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCommodityCategoryFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border ${
                    commodityCategoryFilter === f.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredCommodities.map((c) => {
              const isSelected = commodityId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setCommodityId(c.id);
                    setIsSaved(false);
                  }}
                  className={`flex items-center p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span className="text-2xl mr-2.5">{c.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {c.name.split('(')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {c.category === 'Peternakan' ? `Rp ${formatNumber(c.defaultPricePerKg)}/kg hidup` : `Rp ${formatNumber(c.defaultPricePerKg)}/kg`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Luas Lahan / Populasi Ternak */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {isLivestock ? '2. Populasi Ternak (Ekor / Skala Kandang)' : '2. Luas Lahan Pertanian'}
            </label>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-['Outfit']">
                {analysis.areaInAre} {currentCommodity.unitName || 'Are'}
              </span>
              {!isLivestock && (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">
                  ({formatNumber(analysis.areaInM2)} m² / {analysis.areaInHa} Ha)
                </span>
              )}
            </div>
          </div>

          {/* Slider 1 to 100 are / ekor */}
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={areaInAre}
            onChange={(e) => handleAreaChange(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mr-1">Preset Cepat:</span>
            {areaPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleAreaChange(preset)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors border ${
                  areaInAre === preset
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset} {isLivestock ? 'Ekor' : preset === 100 ? 'Are (1 Ha)' : 'Are'}
              </button>
            ))}
          </div>
        </div>

        {/* Kondisi Tanah (pH & Serapan Hara Berdasarkan Gambar Screenshot) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. KONDISI & KEASAMAN TANAH (PH)
              </label>
              <button
                onClick={onGoToSoilGuide}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                title="Lihat panduan serapan hara di modul Produk & Tanah"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Panduan pH</span>
              </button>
              {onGoToFertilityProfiler && (
                <button
                  onClick={onGoToFertilityProfiler}
                  className="hidden sm:inline-flex text-[11px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full items-center gap-1 font-bold"
                  title="Buka Diagnostik Profil Kesuburan Tanah"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Profil Kesuburan</span>
                </button>
              )}
            </div>
            {/* Top Right Tag - exactly matching screenshot */}
            <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${
              soilCondition === 'sangat_asam'
                ? 'bg-rose-100 text-rose-700 border-rose-200'
                : soilCondition === 'asam'
                ? 'bg-orange-100 text-orange-800 border-orange-200'
                : soilCondition === 'agak_asam'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {analysis.soil.phRange}
            </span>
          </div>

          {/* 4 Cards Row matching Screenshot 2026-10-06 211430.png */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.keys(SOIL_CONDITIONS) as SoilCondition[]).map((condKey) => {
              const item = SOIL_CONDITIONS[condKey];
              const isSelected = soilCondition === condKey;
              
              // Color styles per pH condition based on screenshot
              const selectedStyles = {
                sangat_asam: 'border-2 border-rose-500 bg-rose-50/80 shadow-xs ring-2 ring-rose-400/20 text-rose-950',
                asam: 'border-2 border-orange-500 bg-orange-50/80 shadow-xs ring-2 ring-orange-400/20 text-orange-950',
                agak_asam: 'border-2 border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/20 text-amber-950',
                ideal: 'border-2 border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20 text-emerald-950'
              }[condKey];

              const badgeColorStyles = {
                sangat_asam: 'text-rose-700 bg-rose-100/80 border-rose-200',
                asam: 'text-orange-700 bg-orange-100/80 border-orange-200',
                agak_asam: 'text-amber-800 bg-amber-100/80 border-amber-200',
                ideal: 'text-emerald-800 bg-emerald-100/80 border-emerald-200'
              }[condKey];

              return (
                <button
                  key={condKey}
                  type="button"
                  onClick={() => {
                    setSoilCondition(condKey);
                    setIsSaved(false);
                  }}
                  className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? selectedStyles
                      : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  {/* Top accent indicator strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: item.color }}
                  />

                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`text-sm font-extrabold ${isSelected ? 'font-black' : 'text-slate-900'}`}>
                      {item.phRange}
                    </span>
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs ring-2 ring-white"
                      style={{ backgroundColor: item.color }}
                      title={`Warna indikator pH: ${item.phRange}`}
                    />
                  </div>

                  <p className={`text-[11px] mt-1.5 font-medium leading-tight ${
                    isSelected ? 'font-bold' : 'text-slate-500'
                  }`}>
                    {item.label}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeColorStyles}`}>
                      Serapan: {(item.nutrientAbsorptionRate * 100).toFixed(0)}%
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold text-emerald-700">✓ Aktif</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <p className="font-semibold text-slate-800">{analysis.soil.label}:</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">{analysis.soil.description}</p>
              <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                • Serapan Pupuk Kimia Konvensional: {(analysis.soil.nutrientAbsorptionRate * 100).toFixed(0)}% (sisanya mengendap & merusak tanah)
                <br />
                • Serapan Paten Organik Nano: {(analysis.soil.patenAbsorptionRate * 100).toFixed(0)}% (langsung via stomata mulut daun)
              </p>
            </div>
          </div>
        </div>

        {/* Custom Price Adjustment (Opsional) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">
            Penyesuaian Harga Jual Hasil Panen per kg:
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-500">Rp</span>
            <input
              type="number"
              placeholder={currentCommodity.defaultPricePerKg.toString()}
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="w-28 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Ringkasan Angka Penghematan Besar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Hemat Biaya Operasional */}
        <div className="bg-emerald-700 text-white rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-200">Hemat Biaya</span>
            <DollarSign className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="my-1.5">
            <p className="text-lg sm:text-xl font-extrabold font-['Outfit']">
              {formatRupiah(analysis.savings.operationalSavingsRp)}
            </p>
            <p className="text-[11px] text-emerald-100 font-medium">
              Turun {analysis.savings.operationalSavingsPercent}% lebih hemat!
            </p>
          </div>
          <div className="text-[10px] text-emerald-200 pt-1 border-t border-emerald-600/70">
            Pupuk + Obat Hama
          </div>
        </div>

        {/* Tambahan Laba Bersih */}
        <div className="bg-amber-600 text-white rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-100">Surplus Laba</span>
            <TrendingUp className="w-4 h-4 text-amber-200" />
          </div>
          <div className="my-1.5">
            <p className="text-lg sm:text-xl font-extrabold font-['Outfit']">
              +{formatRupiah(analysis.savings.additionalProfitRp)}
            </p>
            <p className="text-[11px] text-amber-100 font-medium">
              Naik {analysis.savings.profitIncreasePercent}% laba bersih
            </p>
          </div>
          <div className="text-[10px] text-amber-200 pt-1 border-t border-amber-500/70">
            Pendapatan - Biaya Total
          </div>
        </div>

        {/* Kenaikan Hasil Panen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Estimasi Panen</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-1.5">
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit']">
              {formatNumber(analysis.paten.yieldKg)} kg
            </p>
            <p className="text-[11px] text-emerald-700 font-bold">
              +{formatNumber(analysis.savings.yieldIncreaseKg)} kg (+{analysis.savings.yieldIncreasePercent}%)
            </p>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
            vs Kimia {formatNumber(analysis.conventional.yieldKg)} kg
          </div>
        </div>

        {/* Return on Investment (ROI) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">ROI Petani</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-1.5">
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit']">
              {analysis.savings.roiPercent}%
            </p>
            <p className="text-[11px] text-emerald-700 font-bold">
              Pengembalian Modal Sangat Tinggi
            </p>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
            Biaya Investasi: {formatRupiah(analysis.paten.totalCost)}
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Pupuk Kimia Konvensional */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-300 flex flex-col justify-between relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  Pupuk Kimia Konvensional
                </h3>
                <p className="text-[11px] text-slate-500">
                  Urea + NPK Granul + Fungisida & Pestisida Kimia
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                Pola Lama
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Biaya Pupuk Granul:</span>
                <span className="font-bold text-slate-800">{formatRupiah(analysis.conventional.fertilizerCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Biaya Pestisida & Fungisida:</span>
                <span className="font-bold text-slate-800">{formatRupiah(analysis.conventional.pesticideCost)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-rose-700 bg-rose-50 px-2 rounded-lg">
                <span>Total Biaya Operasional:</span>
                <span>{formatRupiah(analysis.conventional.totalCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Hasil Panen Tonase:</span>
                <span className="font-semibold text-slate-800">{analysis.conventional.yieldTon} Ton ({formatNumber(analysis.conventional.yieldKg)} kg)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Total Penjualan (Omzet):</span>
                <span className="font-semibold text-slate-800">{formatRupiah(analysis.conventional.revenue)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-slate-900 bg-slate-200/70 px-2 rounded-lg">
                <span>Laba Bersih Petani:</span>
                <span>{formatRupiah(analysis.conventional.netProfit)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600 inline" />
                Resiko Pola Kimia Granul:
              </p>
              <p>
                • Tanah semakin asam & mengeras, porositas hilang.
                <br />
                • Pupuk terbuang {(100 - analysis.soil.nutrientAbsorptionRate * 100).toFixed(0)}% karena terkunci pada pH {analysis.soil.phValue}.
                <br />
                • Dosis harus terus ditambah tiap musim tanam.
              </p>
            </div>
          </div>
        </div>

        {/* Card: Pupuk Organik Paten Gold Nano */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-500 shadow-sm flex flex-col justify-between relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            Rekomendasi Terbaik
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                  Pupuk Organik Paten Gold
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Teknologi Nano Sachet + Soil Treatment • Renner Syariah
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-700">Kebutuhan Paten Gold:</span>
                <span className="font-bold text-emerald-900">
                  {analysis.paten.patenBoxes} Box ({analysis.paten.sachetCount} sachet) - {formatRupiah(analysis.paten.patenCost)}
                </span>
              </div>
              {analysis.paten.patenImunBoxes > 0 && (
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="text-slate-700">Paten Imun (Proteksi Penyakit):</span>
                  <span className="font-bold text-emerald-900">
                    {analysis.paten.patenImunBoxes} Box - {formatRupiah(analysis.paten.patenImunCost)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-700">Pupuk Kimia Pelengkap (Hemat 70%):</span>
                <span className="font-medium text-slate-800">{formatRupiah(analysis.paten.complementaryChemicalCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-700">Pestisida (Hemat 80%):</span>
                <span className="font-medium text-slate-800">{formatRupiah(analysis.paten.reducedPesticideCost)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-emerald-900 bg-emerald-100/90 px-2 rounded-lg">
                <span>Total Biaya Operasional:</span>
                <span>{formatRupiah(analysis.paten.totalCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-700">Hasil Panen Tonase:</span>
                <span className="font-bold text-emerald-800">{analysis.paten.yieldTon} Ton ({formatNumber(analysis.paten.yieldKg)} kg)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-700">Total Penjualan (Omzet):</span>
                <span className="font-bold text-slate-900">{formatRupiah(analysis.paten.revenue)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-white bg-emerald-700 px-2 rounded-lg shadow-xs">
                <span>Laba Bersih Petani:</span>
                <span>{formatRupiah(analysis.paten.netProfit)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <p className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
                Keunggulan Nyata untuk Lahan {analysis.areaInAre} Are:
              </p>
              <p>
                • Kebutuhan semprot hanya ~{analysis.paten.tanksNeeded} tangki per musim (sangat ringan dibawa ke sawah).
                <br />
                • Nutrisi nano siap saji langsung menembus stomata daun tanpa fotosintesis dulu.
                <br />
                • Mengembalikan cacing & kegemburan tanah berkat pembenah tanah (soil treatment).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Bar Comparison Chart (Cost, Yield, Profit) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Grafik Prediksi Keuntungan & Perbandingan
            </h3>
            <p className="text-xs text-slate-500">
              Visualisasi rasio biaya input vs laba bersih petani pada lahan {analysis.areaInAre} are
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
            ROI {analysis.savings.roiPercent}%
          </span>
        </div>

        {/* Visual Bar: Biaya Operasional (Paten vs Kimia) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Perbandingan Biaya Input / Operasional (Lebih Rendah Lebih Baik):</span>
          </div>
          {/* Kimia Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-medium">Kimia Konvensional</span>
              <span className="font-bold text-slate-800">{formatRupiah(analysis.conventional.totalCost)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-white font-bold"
                style={{ width: '100%' }}
              >
                100%
              </div>
            </div>
          </div>
          {/* Paten Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-bold">Paten Organik Nano</span>
              <span className="font-bold text-emerald-700">{formatRupiah(analysis.paten.totalCost)} (Hemat {analysis.savings.operationalSavingsPercent}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-white font-bold"
                style={{ width: `${Math.max(15, (analysis.paten.totalCost / (analysis.conventional.totalCost || 1)) * 100)}%` }}
              >
                {( (analysis.paten.totalCost / (analysis.conventional.totalCost || 1)) * 100 ).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Visual Bar: Laba Bersih Petani */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Perbandingan Laba Bersih Petani (Lebih Tinggi Lebih Baik):</span>
          </div>
          {/* Kimia Profit Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-medium">Laba Pola Kimia</span>
              <span className="font-semibold text-slate-800">{formatRupiah(analysis.conventional.netProfit)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
              <div
                className="bg-slate-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, (analysis.conventional.netProfit / (analysis.paten.netProfit || 1)) * 100))}%` }}
              />
            </div>
          </div>
          {/* Paten Profit Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-bold">Laba Pola Paten Gold Nano</span>
              <span className="font-extrabold text-emerald-700">
                {formatRupiah(analysis.paten.netProfit)} (+{formatRupiah(analysis.savings.additionalProfitRp)})
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-green-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-white font-bold"
                style={{ width: '100%' }}
              >
                Maksimal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorial Banner for Selected Commodity */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
            <Play className="w-5 h-5 fill-emerald-400 translate-x-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Tutorial Aplikasi Pupuk
              </span>
              <span className="text-xs text-slate-400 font-mono">Resmi Petunjuk PDF</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Video Teknik Aplikasi & Takaran Sachet untuk {currentCommodity.name.split('(')[0]}
            </h4>
            <p className="text-[11px] text-emerald-200/80">
              Pelajari teknik semprot stomata, rasio pencampuran tangki, dan waktu terbaik pemupukan.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTutorialModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Tonton Video Tutorial</span>
        </button>
      </div>

      {/* PDF Export Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileDown className="w-4 h-4 text-emerald-700" />
              Ekspor Dokumen Laporan Hasil Kalkulasi (Format PDF)
            </h4>
            <p className="text-[11px] text-slate-500">
              Dokumen resmi berlogo PT Renner Inti Internasional & legalitas Kementan RI siap cetak / simpan.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>{isExportingPdf ? 'Menyiapkan PDF...' : 'Unduh Laporan PDF'}</span>
          </button>
        </div>

        {/* Farmer Name & Farm Location Customizer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nama Petani / Kelompok Tani (Untuk Dokumen PDF):
            </label>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Nama Petani / Mitra"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Lokasi Lahan Pertanian:
            </label>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Contoh: Subang / Wajo / Karawang"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none w-full text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar: Simpan ke Histori Panen & Lanjut ke Jadwal Pemupukan */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold text-slate-900">
            Siap Terapkan Pola Pupuk Paten pada Lahan Ini?
          </p>
          <p className="text-[11px] text-slate-500">
            Simpan perhitungan ini atau buka jadwal aplikasi pemupukan terintegrasi usia tanaman.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSaveToFarmLog}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border ${
              isSaved
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Simulasi'}</span>
          </button>

          {onGoToSchedule && (
            <button
              onClick={() => onGoToSchedule(commodityId)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Jadwal Pemupukan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
        </>
      )}

      {/* Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        initialCommodityId={commodityId}
      />
    </div>
  );
};
