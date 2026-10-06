import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Droplets,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { CommodityId } from '../types';
import { VIDEO_TUTORIALS, VideoTutorialItem } from '../data/videoTutorials';
import { COMMODITIES } from '../utils/calculatorEngine';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommodityId?: CommodityId;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  isOpen,
  onClose,
  initialCommodityId = 'padi'
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<CommodityId>(initialCommodityId);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  useEffect(() => {
    setSelectedCommodityId(initialCommodityId);
    setProgress(0);
    setIsPlaying(false);
  }, [initialCommodityId]);

  // Video playback timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1.2;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const currentTutorial = VIDEO_TUTORIALS[selectedCommodityId] || VIDEO_TUTORIALS.padi;
  const currentCommodityInfo = COMMODITIES[selectedCommodityId];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Play className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base font-['Outfit']">
                  Video Tutorial Teknik Aplikasi Pupuk Paten
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Resmi Renner
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Panduan video visual & takaran sachet untuk semua komoditi nusantara
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commodity Selector Bar */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 shrink-0">
            Komoditi:
          </span>
          {Object.values(COMMODITIES).map((c) => {
            const isSelected = selectedCommodityId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCommodityId(c.id);
                  setProgress(0);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Main Body: Video Player & Step-by-Step Guide */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Simulated Video Player Container */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md relative group">
            {/* Visual Canvas Scene */}
            <div className="aspect-video w-full relative flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950">
              {/* Dynamic Animated Graphics */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="text-center p-4 relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Teknologi Nano Paten • Makanan Siap Saji Stomata</span>
                </div>

                <div className="text-4xl sm:text-5xl drop-shadow-lg animate-bounce">
                  {currentCommodityInfo.icon}
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-black text-white font-['Outfit']">
                    {currentTutorial.title}
                  </h4>
                  <p className="text-xs text-emerald-200 max-w-md mx-auto mt-0.5">
                    {currentTutorial.summary}
                  </p>
                </div>

                {/* Big Center Play/Pause button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl transition-transform hover:scale-110 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Timestamp badge */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 text-white text-[11px] font-mono backdrop-blur-xs">
                {currentTutorial.duration}
              </div>

              {/* Reference banner */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                {currentTutorial.pdfReference}
              </div>
            </div>

            {/* Video Control Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
              {/* Progress bar */}
              <div
                className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  setProgress((clickX / rect.width) * 100);
                }}
              >
                <div
                  className="bg-emerald-500 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:text-emerald-400"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setProgress(0)}
                    className="p-1 hover:text-emerald-400"
                    title="Ulangi dari awal"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-emerald-400"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {Math.floor((progress / 100) * 4)}:{(Math.floor(((progress / 100) * 275) % 60)).toString().padStart(2, '0')} / {currentTutorial.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">
                    Status: {isPlaying ? '▶ Memutar Tutorial' : '⏸ Dijeda'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Parameters Cards (Formula, Nozzle, Waktu) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Formula Dosis Sachet:</span>
              <p className="text-xs font-bold text-emerald-950 mt-1">{currentTutorial.dosageFormula}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Waktu Terbaik Stomata:</span>
              <p className="text-xs font-bold text-blue-950 mt-1">{currentTutorial.sprayTime}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Tipe Nosel & Cara Kerja:</span>
              <p className="text-xs font-bold text-amber-950 mt-1">{currentTutorial.nozzleType}</p>
            </div>
          </div>

          {/* Step-by-Step Procedure Guide */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Langkah Kerja Aplikasi Step-by-Step:
              </h4>
              <span className="text-xs font-semibold text-slate-500">
                Tingkat: <strong>{currentTutorial.difficulty}</strong>
              </span>
            </div>

            <div className="space-y-2">
              {currentTutorial.stepByStep.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900">{step.title}</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    {step.description}
                  </p>
                  {step.importantTip && (
                    <div className="ml-7 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                      💡 <strong>Tips Penting:</strong> {step.importantTip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mistakes to Avoid & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
              <h5 className="font-bold text-rose-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                Kesalahan Umum Petani yang Harus Dihindari:
              </h5>
              <ul className="list-disc list-inside text-rose-800 space-y-1 text-[11px]">
                {currentTutorial.mistakesToAvoid.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-600 shrink-0" />
                Peralatan Lahan yang Disiapkan:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {currentTutorial.equipmentNeeded.map((eq, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                  >
                    ✓ {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Sumber Materi: Dokumen Sosialisasi & Panduan Aplikasi Lapangan PT Renner Inti Internasional
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
          >
            Tutup Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
