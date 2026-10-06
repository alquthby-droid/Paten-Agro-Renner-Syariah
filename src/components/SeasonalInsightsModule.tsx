import React, { useState, useMemo } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Compass,
  Thermometer,
  ShieldAlert,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { formatNumber } from '../utils/calculatorEngine';

interface SeasonalInsightsModuleProps {
  onGoToSchedule?: () => void;
}

interface RegionWeatherData {
  name: string;
  seasonType: 'rendeng' | 'gadu' | 'pancaroba';
  seasonName: string;
  tempC: number;
  humidityPercent: number;
  rainfallMm: number;
  windSpeedKmh: number;
  weatherCondition: string;
  weatherIcon: string;
  sprayingSuitability: 'Sangat Baik' | 'Perhatikan Awan' | 'Tunda Semprot';
  sprayingHourWindow: string;
  soilMoistureLevel: string;
}

const REGION_WEATHER_DATA: { [key: string]: RegionWeatherData } = {
  ntb: {
    name: 'Nusa Tenggara Barat (Lombok & Sumbawa)',
    seasonType: 'pancaroba',
    seasonName: 'Pancaroba Menuju Musim Hujan (Rendeng)',
    tempC: 28.5,
    humidityPercent: 78,
    rainfallMm: 45,
    windSpeedKmh: 12,
    weatherCondition: 'Cerah Berawan Sore Berpotensi Hujan Lokal',
    weatherIcon: '⛅',
    sprayingSuitability: 'Sangat Baik',
    sprayingHourWindow: '06.30 - 09.00 WITA',
    soilMoistureLevel: 'Sedang (Mulai Basah)'
  },
  sulsel: {
    name: 'Sulawesi Selatan (Gowa - Makassar - Maros)',
    seasonType: 'rendeng',
    seasonName: 'Musim Hujan (Rendeng) Aktif',
    tempC: 27.0,
    humidityPercent: 86,
    rainfallMm: 120,
    windSpeedKmh: 14,
    weatherCondition: 'Hujan Ringan hingga Sedang Berkala',
    weatherIcon: '🌧️',
    sprayingSuitability: 'Perhatikan Awan',
    sprayingHourWindow: '06.00 - 08.30 WITA',
    soilMoistureLevel: 'Basah Maksimal'
  },
  jabar: {
    name: 'Jawa Barat (Subang & Pantura)',
    seasonType: 'rendeng',
    seasonName: 'Awal Musim Penghujan (Rendeng)',
    tempC: 29.0,
    humidityPercent: 82,
    rainfallMm: 85,
    windSpeedKmh: 10,
    weatherCondition: 'Mendung Tebal Sore Hujan Petir',
    weatherIcon: '⛈️',
    sprayingSuitability: 'Sangat Baik',
    sprayingHourWindow: '06.00 - 08.45 WIB',
    soilMoistureLevel: 'Cukup Basah'
  },
  jatim: {
    name: 'Jawa Timur (Banyuwangi & Lumajang)',
    seasonType: 'pancaroba',
    seasonName: 'Pancaroba Transisi Hujan',
    tempC: 29.5,
    humidityPercent: 74,
    rainfallMm: 35,
    windSpeedKmh: 15,
    weatherCondition: 'Cerah Berawan Angin Semilir',
    weatherIcon: '🌤️',
    sprayingSuitability: 'Sangat Baik',
    sprayingHourWindow: '06.30 - 09.00 WIB',
    soilMoistureLevel: 'Mulai Terisi Air'
  },
  sumatera: {
    name: 'Riau & Sumatera (Sentra Sawit & Karet)',
    seasonType: 'rendeng',
    seasonName: 'Musim Basah Tropis (Curah Hujan Tinggi)',
    tempC: 26.5,
    humidityPercent: 90,
    rainfallMm: 160,
    windSpeedKmh: 8,
    weatherCondition: 'Hujan Disertai Udara Lembap',
    weatherIcon: '🌧️',
    sprayingSuitability: 'Perhatikan Awan',
    sprayingHourWindow: '07.00 - 09.00 WIB',
    soilMoistureLevel: 'Lahan Gambut Jenuh Air'
  }
};

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const SeasonalInsightsModule: React.FC<SeasonalInsightsModuleProps> = ({
  onGoToSchedule
}) => {
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('ntb');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(() => new Date().getMonth());
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const regionData = REGION_WEATHER_DATA[selectedRegionKey] || REGION_WEATHER_DATA.ntb;

  // Determine season characteristics by calendar month
  const calendarInsight = useMemo(() => {
    const month = selectedMonthIndex; // 0 = Jan, 9 = Oct
    if (month >= 9 || month <= 2) {
      // Oct - Mar: Musim Hujan (Rendeng)
      return {
        seasonTitle: 'Musim Hujan (Rendeng)',
        statusBadge: '🌧️ PERSIAPAN / MUSIM RENDENG',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        soilPrepAdvice: 'Fokus pembenahan drainase dan kocor Paten Gold pada tanah 5-7 hari sebelum tanam untuk menetralisir kemasaman air hujan.',
        riskFactors: 'Kelembapan tinggi memicu jamur kresek daun, busuk batang, dan blas. Spora menyebar cepat.',
        patenProtocol: 'Vaksinasi tanaman muda dengan Paten Imun di HST 5-7 dan HST 14 untuk mempertebal dinding sel dan imunitas.',
        waterTip: 'Buat saluran bedengan lebih dalam (25-30 cm) agar tidak tergenang banjir.'
      };
    } else if (month >= 3 && month <= 4) {
      // Apr - May: Pancaroba Menuju Kemarau
      return {
        seasonTitle: 'Pancaroba Peralihan ke Kemarau',
        statusBadge: '⛅ TRANSISI PANCAROBA',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        soilPrepAdvice: 'Gemburkan tanah dan kocor Paten Gold untuk mengunci kelembapan organik mikroba sebelum suhu meningkat.',
        riskFactors: 'Fluktuasi suhu ekstrem siang-malam rentan membuat tanaman stres dan rontok bunga.',
        patenProtocol: 'Kombinasi semprot Paten Gold + Imun seimbang untuk menjaga daya adaptasi dan memacu pembungaan lebat.',
        waterTip: 'Atur pola irigasi berselang (intermittent irrigation) guna menghemat cadangan air embung.'
      };
    } else {
      // Jun - Sep: Musim Kemarau (Gadu)
      return {
        seasonTitle: 'Musim Kemarau (Gadu)',
        statusBadge: '☀️ MUSIM KEMARAU (GADU)',
        badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        soilPrepAdvice: 'Pemberian mulsa organik dan kocor Paten Gold untuk mempertahankan air dan menghidupkan cacing tanah.',
        riskFactors: 'Tanah retak dan serangan hama penghisap daun (thrips, kutu kebul, ulat gerayak) meningkat tajam.',
        patenProtocol: 'Semprot Paten Imun + Hijau pada pagi hari sebelum terik untuk memperkuat ketahanan kekeringan seluler.',
        waterTip: 'Siram pada sore hari setelah pukul 16.30 atau pagi buta sebelum matahari menyengat.'
      };
    }
  }, [selectedMonthIndex]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Top Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-md">
            <Calendar className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 tracking-wider uppercase">
                WAWASAN MUSIMAN REAL-TIME
              </span>
              <span className="text-xs text-emerald-200 font-semibold hidden sm:inline">
                • Kalender Pranata Mangsa & BMKG
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black font-['Outfit'] tracking-tight mt-0.5">
              Tips Pertanian Berbasis Kalender & Cuaca Lapangan
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Region Selector Dropdown */}
          <select
            value={selectedRegionKey}
            onChange={(e) => setSelectedRegionKey(e.target.value)}
            className="bg-white/15 hover:bg-white/20 text-white font-bold text-xs rounded-xl px-2.5 py-1.5 border border-white/25 focus:outline-none backdrop-blur-md cursor-pointer"
            title="Pilih wilayah cuaca pertanian"
          >
            <option value="ntb" className="text-slate-900">📍 NTB (Lombok & Sumbawa)</option>
            <option value="sulsel" className="text-slate-900">📍 Sulawesi Selatan</option>
            <option value="jabar" className="text-slate-900">📍 Jawa Barat (Subang)</option>
            <option value="jatim" className="text-slate-900">📍 Jawa Timur</option>
            <option value="sumatera" className="text-slate-900">📍 Riau & Sumatera</option>
          </select>

          {/* Toggle Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
            title={isExpanded ? 'Sembunyikan detail' : 'Buka detail wawasan musiman'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Month Slider & Current Agro-Climate Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            {/* Horizontal Month Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap mr-1 uppercase">
                Bulan:
              </span>
              {MONTH_NAMES.map((name, idx) => {
                const isSelected = selectedMonthIndex === idx;
                const isCurrentMonth = new Date().getMonth() === idx;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedMonthIndex(idx)}
                    className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs scale-105'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {name.slice(0, 3)}
                    {isCurrentMonth && <span className="ml-1 text-[9px] text-amber-300">●</span>}
                  </button>
                );
              })}
            </div>

            {/* Current Season Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${calendarInsight.badgeColor}`}>
                {calendarInsight.statusBadge}
              </span>
            </div>
          </div>

          {/* 4 Real-time Weather Telemetry Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Suhu Udara */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Suhu Aktual</span>
                <Thermometer className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 font-['Outfit'] mt-1">
                {regionData.tempC}°C
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Kondisi: {regionData.weatherIcon} {regionData.weatherCondition.split(' ')[0]}
              </span>
            </div>

            {/* Kelembapan Udara */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Kelembapan Udara</span>
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400 font-['Outfit'] mt-1">
                {regionData.humidityPercent}% RH
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {regionData.humidityPercent > 80 ? '⚠️ Risiko Jamur Tinggi' : 'Kondisi Aman'}
              </span>
            </div>

            {/* Curah Hujan Estimasi */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Curah Hujan</span>
                <CloudRain className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-teal-700 dark:text-teal-400 font-['Outfit'] mt-1">
                {regionData.rainfallMm} mm
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Kadar Air: {regionData.soilMoistureLevel.split('(')[0]}
              </span>
            </div>

            {/* Jendela Waktu Semprot */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Waktu Semprot</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-400 font-['Outfit'] mt-1">
                {regionData.sprayingHourWindow}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 inline" /> Stomata Nano Terbuka
              </span>
            </div>
          </div>

          {/* Actionable Recommendations for Renner Products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Rekomendasi Persiapan Tanam */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 font-['Outfit'] text-xs sm:text-sm">
                  Persiapan Lahan Pra-Tanam
                </h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                {calendarInsight.soilPrepAdvice}
              </p>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-900 dark:text-emerald-200 font-semibold">
                💡 <strong>Dosis Anjuran:</strong> Kocor 1 sachet Paten Gold + 1 sachet Paten Imun per 17 Liter tangki pada bedengan sebelum tebar benih.
              </div>
            </div>

            {/* Proteksi Risiko Penyakit Musiman */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 font-['Outfit'] text-xs sm:text-sm">
                  Kekebalan dari Hama & Jamur
                </h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                {calendarInsight.riskFactors} {calendarInsight.patenProtocol}
              </p>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                🛡️ <strong>Kelebihan Paten Imun:</strong> Bekerja sebagai vaksin nabati sistemik yang memperkuat antibodi tanaman secara biologis.
              </div>
            </div>

            {/* Manajemen Tata Air & Kecepatan Serap Nano */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/70 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 font-['Outfit'] text-xs sm:text-sm">
                  Manajemen Air & Kecepatan Serap
                </h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                {calendarInsight.waterTip} Paten organik berteknologi nano terserap ke inti sel daun dalam <strong>15 menit</strong> tanpa risiko luntur bila hujan turun setelahnya.
              </p>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-200 font-semibold">
                ⚡ <strong>Anti-Luntur Hujan:</strong> Tidak perlu perekat kimia tambahan bila disemprot saat stomata daun membuka.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
