import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Droplets,
  CloudSun,
  Thermometer,
  Wind,
  CheckCircle2,
  Circle,
  Bell,
  Cpu,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Sun,
  CloudRain
} from 'lucide-react';
import { CommodityId, ScheduleItem, SensorData, WeatherDay } from '../types';
import { CROP_SCHEDULES } from '../data/cropSchedules';
import { addNotification } from '../utils/offlineStorage';
import { FarmerDailyTasksModule } from './FarmerDailyTasksModule';
import { CheckSquare } from 'lucide-react';

interface ScheduleWeatherViewProps {
  initialCommodityId?: CommodityId;
}

export const ScheduleWeatherView: React.FC<ScheduleWeatherViewProps> = ({
  initialCommodityId = 'padi'
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks'>('schedule');
  const [commodityId, setCommodityId] = useState<CommodityId>(initialCommodityId);
  const [plantingDate, setPlantingDate] = useState<string>(() => {
    // Default 10 hari yang lalu agar tanaman sedang di fase HST 10
    const d = new Date();
    d.setDate(d.getDate() - 10);
    return d.toISOString().split('T')[0];
  });
  const [completedScheduleIds, setCompletedScheduleIds] = useState<Record<string, boolean>>({});
  const [sensorData, setSensorData] = useState<SensorData>({
    timestamp: new Date().toLocaleTimeString('id-ID'),
    soilMoisture: 68,
    soilTemperature: 28.4,
    soilPh: 6.5,
    conductivityEc: 1.25,
    stomataStatus: 'Terbuka Optimal (Waktu Ideal Penyemprotan)',
    batteryLevel: 94,
    status: 'Optimal Subur'
  });
  const [isFetchingSensor, setIsFetchingSensor] = useState<boolean>(false);
  const [notifScheduled, setNotifScheduled] = useState<boolean>(false);

  // 7-day weather forecast data
  const weatherForecast: WeatherDay[] = [
    { dayName: 'Hari Ini', date: '6 Okt', tempMin: 24, tempMax: 32, condition: 'Cerah Berawan', humidity: 72, rainProbability: 20, sprayingRecommendation: 'Sangat Baik' },
    { dayName: 'Besok', date: '7 Okt', tempMin: 25, tempMax: 33, condition: 'Cerah', humidity: 68, rainProbability: 10, sprayingRecommendation: 'Sangat Baik' },
    { dayName: 'Rabu', date: '8 Okt', tempMin: 24, tempMax: 31, condition: 'Berawan', humidity: 75, rainProbability: 35, sprayingRecommendation: 'Baik' },
    { dayName: 'Kamis', date: '9 Okt', tempMin: 23, tempMax: 29, condition: 'Hujan Ringan', humidity: 85, rainProbability: 65, sprayingRecommendation: 'Hati-hati' },
    { dayName: 'Jumat', date: '10 Okt', tempMin: 23, tempMax: 28, condition: 'Hujan Lebat', humidity: 90, rainProbability: 80, sprayingRecommendation: 'Hindari (Potensi Hujan)' },
    { dayName: 'Sabtu', date: '11 Okt', tempMin: 24, tempMax: 30, condition: 'Cerah Berawan', humidity: 74, rainProbability: 25, sprayingRecommendation: 'Sangat Baik' },
    { dayName: 'Minggu', date: '12 Okt', tempMin: 25, tempMax: 32, condition: 'Cerah', humidity: 70, rainProbability: 15, sprayingRecommendation: 'Sangat Baik' }
  ];

  // Calculate current Day After Planting (HST)
  const currentHST = Math.max(0, Math.floor((new Date().getTime() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24)));

  const currentCropSchedule = CROP_SCHEDULES[commodityId] || CROP_SCHEDULES.padi;

  const fetchSensorTelemetry = async () => {
    setIsFetchingSensor(true);
    try {
      const res = await fetch('/api/sensor-data');
      if (res.ok) {
        const data = await res.json();
        setSensorData(data);
      } else {
        throw new Error('Fallback simulated sensor');
      }
    } catch {
      // Offline / fallback telemetry jitter
      setSensorData(prev => ({
        ...prev,
        timestamp: new Date().toLocaleTimeString('id-ID'),
        soilMoisture: Math.min(85, Math.max(45, prev.soilMoisture + Math.round((Math.random() * 6 - 3)))),
        soilTemperature: parseFloat((28.0 + Math.random() * 1.5).toFixed(1)),
        soilPh: parseFloat((6.4 + Math.random() * 0.3).toFixed(2))
      }));
    } finally {
      setIsFetchingSensor(false);
    }
  };

  useEffect(() => {
    fetchSensorTelemetry();
  }, []);

  const toggleScheduleComplete = (id: string, title: string) => {
    setCompletedScheduleIds(prev => {
      const nextState = !prev[id];
      if (nextState) {
        addNotification({
          title: '✅ Pemupukan Selesai',
          message: `${title} untuk tanaman ${currentCropSchedule.name} berhasil dicatat.`,
          type: 'jadwal',
          priority: 'normal'
        });
      }
      return { ...prev, [id]: nextState };
    });
  };

  const handleRequestPushNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('🌾 Paten Agro: Pengingat Pemupukan Aktif', {
          body: `Jadwal pemupukan ${currentCropSchedule.name} akan dikirim sesuai usia tanaman (HST).`,
          icon: '/favicon.ico'
        });
      }
    }

    addNotification({
      title: '🔔 Notifikasi Pemupukan Aktif',
      message: `Alarm & pengingat jadwal aplikasi Paten untuk ${currentCropSchedule.name} telah diatur otomatis sesuai HST tanaman.`,
      type: 'jadwal',
      priority: 'normal'
    });

    setNotifScheduled(true);
    setTimeout(() => setNotifScheduled(false), 4000);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Switcher Tab: Jadwal Tanam vs Tugas Harian */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Pemupukan & Cuaca</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-amber-300" />
          <span>Tugas Harian Petani (Agenda)</span>
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <FarmerDailyTasksModule initialCommodityId={commodityId} />
      ) : (
        <>
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-amber-300" />
            <span>Telemetri Lahan & Kalender Aplikasi Paten Sesuai Usia</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
            Jadwal Pemupukan & Sensor Tanah Terhubung
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Pantau kondisi kelembapan tanah lahan secara langsung, cek rekomendasi jendela semprot cuaca, dan ikuti panduan dosis usia tanaman dari panduan resmi.
          </p>
        </div>
      </div>

      {/* SENSOR TELEMETRY LIVE MONITOR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                Sensor Kelembapan & Tanah Lahan (IoT Telemetri)
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-500">
                Probe Sensor Blok A • Update Terakhir: {sensorData.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={fetchSensorTelemetry}
            disabled={isFetchingSensor}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingSensor ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Segarkan Sensor</span>
          </button>
        </div>

        {/* 4 Sensor Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Kelembapan Tanah */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
              <span>Kelembapan Tanah</span>
              <Droplets className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-blue-950 font-['Outfit'] mt-1">
              {sensorData.soilMoisture}%
            </p>
            <p className="text-[10px] text-blue-800 font-medium mt-0.5">
              Status: {sensorData.status}
            </p>
          </div>

          {/* Suhu Tanah */}
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
              <span>Suhu Tanah</span>
              <Thermometer className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-amber-950 font-['Outfit'] mt-1">
              {sensorData.soilTemperature}°C
            </p>
            <p className="text-[10px] text-amber-800 font-medium mt-0.5">
              Ideal perakaran
            </p>
          </div>

          {/* pH Tanah Aktual */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
              <span>pH Tanah Aktual</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-emerald-950 font-['Outfit'] mt-1">
              {sensorData.soilPh}
            </p>
            <p className="text-[10px] text-emerald-800 font-medium mt-0.5">
              Mendekati zona optimum
            </p>
          </div>

          {/* Konduktivitas Hara (EC) */}
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200">
            <div className="flex items-center justify-between text-purple-700 text-xs font-bold">
              <span>Kadar Hara (EC)</span>
              <Cpu className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-purple-950 font-['Outfit'] mt-1">
              {sensorData.conductivityEc} <span className="text-xs font-normal">mS/cm</span>
            </p>
            <p className="text-[10px] text-purple-800 font-medium mt-0.5">
              Ketersediaan nutrisi baik
            </p>
          </div>
        </div>

        {/* Rekomendasi Jendela Semprot Berdasarkan Stomata */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Clock className="w-4 h-4" />
              <span>JENDELA WAKTU TERBAIK PENYEMPROTAN HARI INI</span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Stomata Daun Terbuka Maksimal: <strong>Pukul 06.00 - 09.00 Pagi</strong>. Hindari semprot saat terik matahari siang (11.00-14.00) karena stomata menutup.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-extrabold shrink-0 self-start sm:self-auto">
            Waktu Semprot Aman
          </span>
        </div>
      </div>

      {/* 7-DAY WEATHER FORECAST */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-emerald-700" />
            Laporan Cuaca Mingguan & Panduan Semprot
          </h3>
          <span className="text-[11px] text-slate-500">Prakiraan 7 Hari</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {weatherForecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-center flex flex-col justify-between ${
                idx === 0
                  ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-slate-800">{day.dayName}</p>
                <p className="text-[10px] text-slate-400">{day.date}</p>
              </div>

              <div className="my-2">
                {day.condition.includes('Hujan') ? (
                  <CloudRain className="w-6 h-6 text-blue-500 mx-auto" />
                ) : (
                  <Sun className="w-6 h-6 text-amber-500 mx-auto" />
                )}
                <p className="text-xs font-black text-slate-800 font-['Outfit'] mt-1">
                  {day.tempMax}°C
                </p>
                <p className="text-[10px] text-slate-500">Hujan: {day.rainProbability}%</p>
              </div>

              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md truncate ${
                day.sprayingRecommendation === 'Sangat Baik'
                  ? 'bg-emerald-100 text-emerald-800'
                  : day.sprayingRecommendation === 'Baik'
                  ? 'bg-blue-100 text-blue-800'
                  : day.sprayingRecommendation === 'Hati-hati'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {day.sprayingRecommendation}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PLANTING DATE & TIMELINE PEMUPUKAN */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              Jadwal Pemupukan Sesuai Usia Tanaman ({currentCropSchedule.name})
            </h3>
            <p className="text-xs text-slate-500">
              Disusun langsung berdasarkan petunjuk aplikasi brosur Paten Resmi
            </p>
          </div>

          {/* Commodity & Planting Date Pickers */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={commodityId}
              onChange={(e) => setCommodityId(e.target.value as CommodityId)}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800"
            >
              <option value="padi">Padi Sawah</option>
              <option value="jagung">Jagung Hibrida</option>
              <option value="kedelai">Kacang Kedelai</option>
              <option value="sawit">Kelapa Sawit</option>
              <option value="bawang_merah">Bawang Merah</option>
              <option value="cabai">Cabai</option>
              <option value="tembakau">Tembakau (Slide 28)</option>
              <option value="gaharu">Gaharu (Slide 20)</option>
            </select>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2 py-1">
              <span className="text-[11px] text-slate-500 font-medium">Tgl Tanam:</span>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Current Age Banner */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-emerald-800 font-['Outfit']">
              HST {currentHST}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              (Hari Setelah Tanam saat ini)
            </span>
          </div>

          <button
            onClick={handleRequestPushNotification}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{notifScheduled ? 'Alarm Diaktifkan!' : 'Aktifkan Notifikasi Push'}</span>
          </button>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
          {currentCropSchedule.schedules.map((item) => {
            const isCompleted = !!completedScheduleIds[item.id];
            const isDueOrPast = currentHST >= item.dayAfterPlanting;
            const isToday = currentHST === item.dayAfterPlanting;

            return (
              <div
                key={item.id}
                className={`relative pl-12 pr-4 py-3 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : isToday
                    ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : isDueOrPast
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Checkbox indicator */}
                <button
                  onClick={() => toggleScheduleComplete(item.id, item.title)}
                  className="absolute left-3 top-3.5 p-1 text-slate-400 hover:text-emerald-700"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-900 font-['Outfit']">
                        {item.title}
                      </span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white animate-pulse">
                          Jatuh Tempo Hari Ini!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      Tindakan: <span className="text-emerald-700">{item.actionType}</span> • Produk: {item.products.join(', ')}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg self-start sm:self-auto">
                    {item.waterVolume}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <p><strong>Takaran Dosis:</strong> {item.dosage}</p>
                  <p><strong>Cara Campur:</strong> {item.mixingInstruction}</p>
                  <p className="text-[11px] text-emerald-700"><strong>Sasaran:</strong> {item.targetStomata}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips agronomi praktis */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100">Tips Penting Pemupukan Berkelanjutan:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            {currentCropSchedule.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
