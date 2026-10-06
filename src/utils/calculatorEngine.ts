import { CommodityConfig, CommodityId, CalculationResult, SoilCondition } from '../types';
import { SOIL_CONDITIONS } from '../data/soilKnowledge';

export const COMMODITIES: Record<CommodityId, CommodityConfig> = {
  padi: {
    id: 'padi',
    name: 'Padi Sawah (GKG / Gabah Kering Panen)',
    category: 'Pangan',
    icon: '🌾',
    defaultPricePerKg: 6800,
    conventionalYieldPerHaTon: 5.5,
    patenYieldPerHaTon: 8.2, // Peningkatan signifikan berdasarkan slide 17 & 32
    conventionalFertilizerCostPerHa: 3500000,
    conventionalPesticideCostPerHa: 1500000,
    patenBoxesPerHa: 6, // 6 box Paten Gold per Ha
    patenImunBoxesPerHa: 2, // Opsional Paten Imun
    complementaryChemicalCostPerHa: 500000, // ZA/Urea 1 gelas per tangki
    harvestDurationDays: 110,
    description: '1 Ha = 6 box Paten Gold (72 sachet). Semprot kasar H+5, H+14, H+28, H+50, H+70.'
  },
  jagung: {
    id: 'jagung',
    name: 'Jagung Hibrida / Pipil Kering',
    category: 'Pangan',
    icon: '🌽',
    defaultPricePerKg: 5200,
    conventionalYieldPerHaTon: 6.2,
    patenYieldPerHaTon: 9.1,
    conventionalFertilizerCostPerHa: 3800000,
    conventionalPesticideCostPerHa: 1400000,
    patenBoxesPerHa: 5,
    patenImunBoxesPerHa: 2,
    complementaryChemicalCostPerHa: 600000,
    harvestDurationDays: 105,
    description: 'Paten Gold mencegah virus bule sejak H+5 dan tongkol terisi padat 2 buah per batang.'
  },
  kedelai: {
    id: 'kedelai',
    name: 'Kacang Kedelai (Biji Kering)',
    category: 'Pangan',
    icon: '🌱',
    defaultPricePerKg: 11500,
    conventionalYieldPerHaTon: 1.8,
    patenYieldPerHaTon: 2.8,
    conventionalFertilizerCostPerHa: 2800000,
    conventionalPesticideCostPerHa: 1200000,
    patenBoxesPerHa: 4,
    patenImunBoxesPerHa: 3,
    complementaryChemicalCostPerHa: 350000,
    harvestDurationDays: 85,
    description: 'Rendam benih Paten Hijau 10 menit, semprot berkala tiap 10 hari Paten Hijau + Imun.'
  },
  sawit: {
    id: 'sawit',
    name: 'Kelapa Sawit (Tandan Buah Segar / TBS)',
    category: 'Perkebunan',
    icon: '🌴',
    defaultPricePerKg: 2600,
    conventionalYieldPerHaTon: 18.0, // per tahun
    patenYieldPerHaTon: 26.5,
    conventionalFertilizerCostPerHa: 13500000,
    conventionalPesticideCostPerHa: 2000000,
    patenBoxesPerHa: 30, // 10 box x 3 kali pemakaian setahun (120 pohon)
    patenImunBoxesPerHa: 0,
    complementaryChemicalCostPerHa: 0,
    harvestDurationDays: 365,
    description: '120 pohon/Ha. 1 sachet per pohon tiap 4 bulan sekali. Potensi nasional 89,1 Triliun.'
  },
  bawang_merah: {
    id: 'bawang_merah',
    name: 'Bawang Merah (Umbi Basah Panen)',
    category: 'Hortikultura',
    icon: '🧅',
    defaultPricePerKg: 24000,
    conventionalYieldPerHaTon: 9.0,
    patenYieldPerHaTon: 13.8,
    conventionalFertilizerCostPerHa: 9500000,
    conventionalPesticideCostPerHa: 8500000, // Biaya fungisida/pestisida bawang sangat tinggi konvensional
    patenBoxesPerHa: 8,
    patenImunBoxesPerHa: 4,
    complementaryChemicalCostPerHa: 1800000,
    harvestDurationDays: 65,
    description: 'Kocor umur 5, 15, 25, 35 HST. Hemat fungisida 100% dan pestisida hingga 80%.'
  },
  cabai: {
    id: 'cabai',
    name: 'Cabai Merah / Cabai Rawit',
    category: 'Hortikultura',
    icon: '🌶️',
    defaultPricePerKg: 28000,
    conventionalYieldPerHaTon: 8.5,
    patenYieldPerHaTon: 12.5,
    conventionalFertilizerCostPerHa: 10500000,
    conventionalPesticideCostPerHa: 11000000,
    patenBoxesPerHa: 8,
    patenImunBoxesPerHa: 6,
    complementaryChemicalCostPerHa: 2000000,
    harvestDurationDays: 120,
    description: 'Sterilisasi Paten Imun H-2. Bebas patek antraknosa, bunga tidak rontok, petikan lebih lama.'
  },
  tembakau: {
    id: 'tembakau',
    name: 'Tembakau (Rajangan Kering Super)',
    category: 'Komoditas Khusus',
    icon: '🍂',
    defaultPricePerKg: 65000,
    conventionalYieldPerHaTon: 1.5,
    patenYieldPerHaTon: 2.4,
    conventionalFertilizerCostPerHa: 7500000,
    conventionalPesticideCostPerHa: 4500000,
    patenBoxesPerHa: 8,
    patenImunBoxesPerHa: 4,
    complementaryChemicalCostPerHa: 1200000,
    harvestDurationDays: 90,
    description: 'Hari 14 kocor Paten Gold + ZA 1 gelas/20L (100ml/pohon), Hari 28 kocor + NPK 1 gelas. Semprot 7 hari sekali.'
  },
  gaharu: {
    id: 'gaharu',
    name: 'Gaharu (Pohon Gubal Resin Wangi)',
    category: 'Komoditas Khusus',
    icon: '🌳',
    defaultPricePerKg: 250000,
    conventionalYieldPerHaTon: 0.8,
    patenYieldPerHaTon: 1.4,
    conventionalFertilizerCostPerHa: 9000000,
    conventionalPesticideCostPerHa: 3000000,
    patenBoxesPerHa: 16,
    patenImunBoxesPerHa: 6,
    complementaryChemicalCostPerHa: 1500000,
    harvestDurationDays: 365,
    description: '12 sachet Paten Gold + NPK 2kg + air 200L, kocorkan 1 liter per pohon tiap 3 bulan. Merangsang pembentukan resin gubal.'
  },
  sapi: {
    id: 'sapi',
    name: 'Sapi (Penggemukan & Sapi Perah)',
    category: 'Peternakan',
    unitName: 'Ekor',
    icon: '🐂',
    defaultPricePerKg: 52000,
    conventionalYieldPerHaTon: 4.5, // Total bobot karkas ekuivalen per skala kandang
    patenYieldPerHaTon: 6.8, // ADG naik pesat (1.0 - 1.5 kg/hari)
    conventionalFertilizerCostPerHa: 4500000, // Biaya suplemen/vitamin kimia konvensional
    conventionalPesticideCostPerHa: 2000000, // Biaya obat-obatan & disinfektan kimia
    patenBoxesPerHa: 6, // Paket Paten Tambak & Ternak (Paten Hijau)
    patenImunBoxesPerHa: 4, // Paten Imun (Antivirus PMK & Imunitas Pencernaan)
    complementaryChemicalCostPerHa: 600000,
    harvestDurationDays: 90,
    description: 'Campurkan 1 sachet Paten Hijau + 1 sachet Paten Imun ke 200L air minum / pakan komboran. Memacu nafsu makan, kotoran tidak berbau, dan mencegah virus PMK.'
  },
  kerbau: {
    id: 'kerbau',
    name: 'Kerbau (Lumpur & Pedaging)',
    category: 'Peternakan',
    unitName: 'Ekor',
    icon: '🐃',
    defaultPricePerKg: 48000,
    conventionalYieldPerHaTon: 4.2,
    patenYieldPerHaTon: 6.4,
    conventionalFertilizerCostPerHa: 4200000,
    conventionalPesticideCostPerHa: 1800000,
    patenBoxesPerHa: 6,
    patenImunBoxesPerHa: 4,
    complementaryChemicalCostPerHa: 500000,
    harvestDurationDays: 120,
    description: 'Paten Hijau & Imun pada komboran air pakan mempercepat pembentukan otot karkas, ketahanan terhadap cuaca ekstrem, dan stamina fisik prima.'
  },
  kambing: {
    id: 'kambing',
    name: 'Kambing & Domba (Penggemukan / Kurban)',
    category: 'Peternakan',
    unitName: 'Ekor',
    icon: '🐐',
    defaultPricePerKg: 75000,
    conventionalYieldPerHaTon: 2.2,
    patenYieldPerHaTon: 3.5,
    conventionalFertilizerCostPerHa: 3200000,
    conventionalPesticideCostPerHa: 1500000,
    patenBoxesPerHa: 5,
    patenImunBoxesPerHa: 3,
    complementaryChemicalCostPerHa: 400000,
    harvestDurationDays: 75,
    description: '1 sachet Paten untuk 30 ekor kambing via air minum. Bobot karkas naik 35%, bulu klimis mengkilap, bebas cacingan, dan bau kotoran kandang berkurang drastis.'
  },
  ayam_itik: {
    id: 'ayam_itik',
    name: 'Ayam & Itik (Pedaging / Petelur / Bebek)',
    category: 'Peternakan',
    unitName: 'Ekor',
    icon: '🐔',
    defaultPricePerKg: 26000,
    conventionalYieldPerHaTon: 3.0,
    patenYieldPerHaTon: 4.6,
    conventionalFertilizerCostPerHa: 3600000,
    conventionalPesticideCostPerHa: 2200000,
    patenBoxesPerHa: 5,
    patenImunBoxesPerHa: 5,
    complementaryChemicalCostPerHa: 600000,
    harvestDurationDays: 45,
    description: 'Campurkan ke air minum atau semprotkan ke kandang. Menekan gas amonia, mortalitas turun ke <2%, FCR turun, dan produksi telur melonjak dengan cangkang tebal.'
  }
};

export function calculateFarmAnalysis(
  areaInAre: number,
  commodityId: CommodityId,
  soilCondition: SoilCondition,
  customPricePerKg?: number
): CalculationResult {
  const commodity = COMMODITIES[commodityId] || COMMODITIES.padi;
  const soil = SOIL_CONDITIONS[soilCondition] || SOIL_CONDITIONS.asam;

  // 1 are = 100 m2
  // 1 Ha = 100 are = 10,000 m2
  const areaInHa = areaInAre / 100;
  const areaInM2 = areaInAre * 100;

  const pricePerKg = customPricePerKg !== undefined && customPricePerKg > 0 ? customPricePerKg : commodity.defaultPricePerKg;

  // Faktor degradasi hasil panen konvensional jika tanah masam/rusak
  // Pada tanah masam (pH 5.0), pupuk kimia terbuang dan tanaman kerdil, hasil panen kimia anjlok
  const conventionalSoilFactor = soil.condition === 'sangat_asam' ? 0.70 : soil.condition === 'asam' ? 0.85 : soil.condition === 'agak_asam' ? 0.95 : 1.0;

  // Pupuk Paten berteknologi nano langsung diserap via stomata daun + memperbaiki tanah, sehingga dampaknya stabil
  const patenSoilFactor = soil.condition === 'sangat_asam' ? 0.93 : soil.condition === 'asam' ? 0.97 : 1.0;

  // Biaya Konvensional (Kimia)
  const conventionalFertilizerCost = commodity.conventionalFertilizerCostPerHa * areaInHa;
  const conventionalPesticideCost = commodity.conventionalPesticideCostPerHa * areaInHa;
  const conventionalTotalCost = conventionalFertilizerCost + conventionalPesticideCost;

  const conventionalYieldTon = commodity.conventionalYieldPerHaTon * areaInHa * conventionalSoilFactor;
  const conventionalYieldKg = conventionalYieldTon * 1000;
  const conventionalRevenue = conventionalYieldKg * pricePerKg;
  const conventionalNetProfit = conventionalRevenue - conventionalTotalCost;

  // Biaya Paten Gold / Hijau / Imun
  const pricePerBoxPaten = 200000; // Harga resmi per box Paten Gold / Hijau / Imun
  const rawPatenBoxes = commodity.patenBoxesPerHa * areaInHa;
  const patenBoxes = Math.max(0.2, parseFloat(rawPatenBoxes.toFixed(2)));
  const patenCost = rawPatenBoxes * pricePerBoxPaten;

  const rawImunBoxes = commodity.patenImunBoxesPerHa * areaInHa;
  const patenImunBoxes = parseFloat(rawImunBoxes.toFixed(2));
  const patenImunCost = rawImunBoxes * pricePerBoxPaten;

  const complementaryChemicalCost = commodity.complementaryChemicalCostPerHa * areaInHa;
  // Penghematan pestisida & fungisida 80% - 100%
  const reducedPesticideCost = (commodity.conventionalPesticideCostPerHa * 0.20) * areaInHa;

  const patenTotalCost = patenCost + patenImunCost + complementaryChemicalCost + reducedPesticideCost;

  const patenYieldTon = commodity.patenYieldPerHaTon * areaInHa * patenSoilFactor;
  const patenYieldKg = patenYieldTon * 1000;
  const patenRevenue = patenYieldKg * pricePerKg;
  const patenNetProfit = patenRevenue - patenTotalCost;

  // Kalkulasi sachet & tangki
  // Paten Gold 1 box = 12 sachet, Paten Hijau/Imun = 24 sachet
  const sachetCount = Math.ceil(rawPatenBoxes * 12 + rawImunBoxes * 24);
  const tanksNeeded = Math.ceil((areaInAre / 10) * 3); // rata-rata tangki per musim

  // Penghematan & Peningkatan
  const operationalSavingsRp = conventionalTotalCost - patenTotalCost;
  const operationalSavingsPercent = conventionalTotalCost > 0 ? (operationalSavingsRp / conventionalTotalCost) * 100 : 0;
  const yieldIncreaseKg = patenYieldKg - conventionalYieldKg;
  const yieldIncreasePercent = conventionalYieldKg > 0 ? (yieldIncreaseKg / conventionalYieldKg) * 100 : 0;
  const additionalProfitRp = patenNetProfit - conventionalNetProfit;
  const profitIncreasePercent = conventionalNetProfit > 0 ? (additionalProfitRp / Math.abs(conventionalNetProfit)) * 100 : 100;
  const roiPercent = patenTotalCost > 0 ? (patenNetProfit / patenTotalCost) * 100 : 0;

  return {
    areaInAre,
    areaInM2,
    areaInHa,
    commodity,
    soil,
    conventional: {
      fertilizerCost: Math.round(conventionalFertilizerCost),
      pesticideCost: Math.round(conventionalPesticideCost),
      totalCost: Math.round(conventionalTotalCost),
      yieldTon: parseFloat(conventionalYieldTon.toFixed(2)),
      yieldKg: Math.round(conventionalYieldKg),
      revenue: Math.round(conventionalRevenue),
      netProfit: Math.round(conventionalNetProfit),
      effectiveAbsorptionKg: Math.round(conventionalYieldKg * soil.nutrientAbsorptionRate)
    },
    paten: {
      patenBoxes,
      patenCost: Math.round(patenCost),
      patenImunBoxes,
      patenImunCost: Math.round(patenImunCost),
      complementaryChemicalCost: Math.round(complementaryChemicalCost),
      reducedPesticideCost: Math.round(reducedPesticideCost),
      totalCost: Math.round(patenTotalCost),
      yieldTon: parseFloat(patenYieldTon.toFixed(2)),
      yieldKg: Math.round(patenYieldKg),
      revenue: Math.round(patenRevenue),
      netProfit: Math.round(patenNetProfit),
      sachetCount: Math.max(1, sachetCount),
      tanksNeeded: Math.max(1, tanksNeeded)
    },
    savings: {
      operationalSavingsRp: Math.round(operationalSavingsRp),
      operationalSavingsPercent: parseFloat(operationalSavingsPercent.toFixed(1)),
      pesticideSavingsPercent: 80,
      yieldIncreaseKg: Math.round(yieldIncreaseKg),
      yieldIncreasePercent: parseFloat(yieldIncreasePercent.toFixed(1)),
      additionalProfitRp: Math.round(additionalProfitRp),
      profitIncreasePercent: parseFloat(profitIncreasePercent.toFixed(1)),
      roiPercent: parseFloat(roiPercent.toFixed(1))
    }
  };
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}
