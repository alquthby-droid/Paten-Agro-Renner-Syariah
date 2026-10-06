import { CommodityId, GrowthStage, NutrientDemandResult } from '../types';
import { COMMODITIES } from './calculatorEngine';

export const GROWTH_STAGE_CONFIGS: Record<GrowthStage, { name: string; hstRange: string; icon: string; focus: string }> = {
  olah_tanah: {
    name: 'Olah Tanah & Pra-Tanam',
    hstRange: 'H-7 s/d H-0',
    icon: '🚜',
    focus: 'Kondisi fisik & biologi tanah, netralisasi pH masam, dekomposisi bahan organik, sterilisasi jamur tular tanah.'
  },
  vegetatif_awal: {
    name: 'Vegetatif Awal (Perakaran & Tunas)',
    hstRange: 'HST 1 s/d 20',
    icon: '🌱',
    focus: 'Inisiasi perakaran halus, pembelahan sel meristem, daya serap fosfor (P) untuk energi ATP, dan imunitas bibit muda.'
  },
  vegetatif_aktif: {
    name: 'Vegetatif Aktif (Anakan & Biomassa)',
    hstRange: 'HST 21 s/d 40',
    icon: '🌿',
    focus: 'Sintesis protein & asam amino cepat, multiplikasi anakan produktif, luas kanopi daun hijau gelap (Nitrogen Organik).'
  },
  generatif_bunga: {
    name: 'Generatif & Pembungaan (Primordia)',
    hstRange: 'HST 41 s/d 60',
    icon: '🌸',
    focus: 'Inisiasi malai bunga, pencegahan gugur bunga/bakal buah, pasokan Boron (B) dan Fosfat organik untuk serbuk sari.'
  },
  pengisian_buah: {
    name: 'Pengisian Bulir, Buah & Umbi',
    hstRange: 'HST 61 s/d 85',
    icon: '🌾',
    focus: 'Translokasi pati & karbohidrat ke buah/bulir, pengisian bernas sampai pangkal, perangsangan rendemen Kalium (K).'
  },
  pematangan: {
    name: 'Pematangan & Menjelang Panen',
    hstRange: 'HST 86 s/d Panen',
    icon: '✨',
    focus: 'Pematangan serentak, pengeringan bulir kuning keemasan, penguatan tangkai agar tidak rebah saat panen.'
  }
};

export function calculatePlantNutrientDemand(
  commodityId: CommodityId,
  growthStage: GrowthStage,
  areaInAre: number
): NutrientDemandResult {
  const commodity = COMMODITIES[commodityId] || COMMODITIES.padi;
  const haFactor = areaInAre / 100; // 1 Ha = 100 Are

  // Base requirement per Hektar based on commodity
  let baseN = 120;
  let baseP = 45;
  let baseK = 90;
  let baseCa = 25;
  let baseMg = 18;

  if (commodity.category === 'Perkebunan') {
    baseN = 160;
    baseP = 60;
    baseK = 180;
    baseCa = 40;
    baseMg = 30;
  } else if (commodity.category === 'Hortikultura' || commodityId === 'bawang_merah' || commodityId === 'cabai') {
    baseN = 140;
    baseP = 80;
    baseK = 130;
    baseCa = 35;
    baseMg = 22;
  } else if (commodity.category === 'Peternakan') {
    // For livestock: translated to nutrition demand (protein, energy, minerals)
    baseN = 50;
    baseP = 30;
    baseK = 40;
    baseCa = 60;
    baseMg = 20;
  }

  // Multiplier by growth stage
  let stageMultiplier = {
    n: 0.2,
    p: 0.3,
    k: 0.15,
    ca: 0.2,
    mg: 0.2,
    zn: 15,
    fe: 25,
    b: 10,
    cu: 8
  };

  switch (growthStage) {
    case 'olah_tanah':
      stageMultiplier = { n: 0.1, p: 0.4, k: 0.2, ca: 0.5, mg: 0.3, zn: 10, fe: 20, b: 5, cu: 5 };
      break;
    case 'vegetatif_awal':
      stageMultiplier = { n: 0.3, p: 0.5, k: 0.2, ca: 0.3, mg: 0.25, zn: 25, fe: 30, b: 12, cu: 10 };
      break;
    case 'vegetatif_aktif':
      stageMultiplier = { n: 0.5, p: 0.35, k: 0.3, ca: 0.35, mg: 0.4, zn: 30, fe: 35, b: 15, cu: 12 };
      break;
    case 'generatif_bunga':
      stageMultiplier = { n: 0.25, p: 0.4, k: 0.45, ca: 0.4, mg: 0.3, zn: 20, fe: 20, b: 35, cu: 15 };
      break;
    case 'pengisian_buah':
      stageMultiplier = { n: 0.15, p: 0.25, k: 0.6, ca: 0.3, mg: 0.35, zn: 18, fe: 15, b: 25, cu: 10 };
      break;
    case 'pematangan':
      stageMultiplier = { n: 0.05, p: 0.1, k: 0.3, ca: 0.2, mg: 0.15, zn: 10, fe: 10, b: 10, cu: 5 };
      break;
  }

  const nKg = parseFloat((baseN * haFactor * stageMultiplier.n).toFixed(2));
  const pKg = parseFloat((baseP * haFactor * stageMultiplier.p).toFixed(2));
  const kKg = parseFloat((baseK * haFactor * stageMultiplier.k).toFixed(2));
  const caKg = parseFloat((baseCa * haFactor * stageMultiplier.ca).toFixed(2));
  const mgKg = parseFloat((baseMg * haFactor * stageMultiplier.mg).toFixed(2));

  // Determine Renner Syariah Product Recommendations
  const isLivestock = commodity.category === 'Peternakan';
  const stageConfig = GROWTH_STAGE_CONFIGS[growthStage];

  // Calculate needed sachets based on area and stage
  const sachetPerArePerSpray = isLivestock ? 0.2 : 0.4;
  const estimatedSachets = Math.max(1, Math.ceil(areaInAre * sachetPerArePerSpray));
  const mixingWaterLiters = Math.ceil(estimatedSachets * 17); // 1 sachet per 17L tangki

  const recommendations: NutrientDemandResult['recommendedRennerProducts'] = [];

  if (isLivestock) {
    recommendations.push({
      productName: 'Paten Hijau',
      role: 'Suplemen Asam Amino & Protein Nabati Ternak',
      sachetCount: estimatedSachets,
      mixingWaterLiters: Math.max(50, estimatedSachets * 100),
      applicationMethod: 'Campur Air Minum/Pakan',
      bestTime: 'Pagi hari saat jam makan pertama (07.00 - 08.00)',
      whyEffective: 'Kandungan 13 asam amino nano merangsang enzim pencernaan lambung rumen, memacu Average Daily Gain (ADG) hingga 1.3 kg/hari tanpa bau amonia feses.'
    });
    recommendations.push({
      productName: 'Paten Imun',
      role: 'Antibodi Alami & Imunisasi Penyakit Mulut/Kuku',
      sachetCount: Math.ceil(estimatedSachets * 0.5),
      mixingWaterLiters: Math.max(50, estimatedSachets * 100),
      applicationMethod: 'Campur Air Minum/Pakan',
      bestTime: 'Sore hari (16.00 - 17.00)',
      whyEffective: 'Meningkatkan antibodi ternak terhadap virus PMK, lumpy skin disease, dan stres iklim lembap.'
    });
  } else if (growthStage === 'olah_tanah') {
    recommendations.push({
      productName: 'Paten Gold',
      role: 'Pembenah Tanah & Netralisasi pH Masam',
      sachetCount: estimatedSachets,
      mixingWaterLiters,
      applicationMethod: 'Kocor Tanah',
      bestTime: 'Sore hari H-7 atau H-5 sebelum tanam',
      whyEffective: 'Mengurai residu kimia tanah yang mengeras, menaikkan pH dari masam ke netral (6.5), dan membangkitkan bakteri penambat nitrogen.'
    });
    recommendations.push({
      productName: 'Paten Imun',
      role: 'Sterilisasi Patogen Jamur Tular Tanah',
      sachetCount: Math.ceil(estimatedSachets * 0.5),
      mixingWaterLiters,
      applicationMethod: 'Kocor Tanah',
      bestTime: 'Pagi hari H-3 sebelum tanam bibit',
      whyEffective: 'Membasmi inokulum spora jamur fusarium dan bakteri ralstonia di perakaran.'
    });
  } else if (growthStage === 'vegetatif_awal' || growthStage === 'vegetatif_aktif') {
    recommendations.push({
      productName: 'Paten Hijau',
      role: 'Penyedia Nitrogen Organik & 13 Asam Amino Esensial',
      sachetCount: estimatedSachets,
      mixingWaterLiters,
      applicationMethod: 'Semprot Daun',
      bestTime: 'Pukul 06.30 - 08.45 (Stomata daun membuka optimal)',
      whyEffective: 'Molekul nano terserap langsung dalam 15 menit, memacu jumlah anakan produktif dan klorofil daun hijau tebal.'
    });
    recommendations.push({
      productName: 'Paten Imun',
      role: 'Vaksin Nabati Proteksi Daun Muda dari Hama & Virus',
      sachetCount: Math.ceil(estimatedSachets * 0.5),
      mixingWaterLiters,
      applicationMethod: 'Semprot Daun',
      bestTime: 'Pukul 06.30 - 08.45 (Bisa dicampur langsung satu tangki)',
      whyEffective: 'Membentuk enzim fitoaleksin yang menolak penularan virus bulai, kresek, dan tungro.'
    });
  } else {
    // Generatif / Pengisian Buah / Pematangan
    recommendations.push({
      productName: 'Paten Gold',
      role: 'Pemasok Kalium Nano & Pembobot Buah/Bulir Bernas',
      sachetCount: estimatedSachets,
      mixingWaterLiters,
      applicationMethod: 'Semprot Daun',
      bestTime: 'Pukul 06.30 - 09.00 saat embun pagi mulai kering',
      whyEffective: 'Unsur hara makro mikro nano merangsang translokasi glukosa ke buah. Bulir padi terisi kuning bernas sampai pangkal malai.'
    });
    recommendations.push({
      productName: 'Paten Imun',
      role: 'Benteng Pertahanan dari Jamur Patek & Busuk Buah',
      sachetCount: Math.ceil(estimatedSachets * 0.5),
      mixingWaterLiters,
      applicationMethod: 'Semprot Daun',
      bestTime: 'Pagi hari (Dapat dicampur bersama Paten Gold)',
      whyEffective: 'Melindungi tangkai malai dari jamur patah leher (Pyricularia oryzae) dan antraknosa buah.'
    });
  }

  // Cost comparison calculation for this specific stage
  const conventionalFertilizerNeededKg = Math.round((nKg * 2.2 + pKg * 2.8 + kKg * 1.7) * 1.2);
  const conventionalCostRp = conventionalFertilizerNeededKg * 6500; // rata-rata harga NPK kimia non-subsidi Rp 6.500/kg
  const patenTotalSachets = recommendations.reduce((acc, r) => acc + r.sachetCount, 0);
  const patenCostRp = patenTotalSachets * 8333; // ~Rp 200.000 / 24 sachet = Rp 8.333 per sachet
  const savingsRp = Math.max(0, conventionalCostRp - patenCostRp);
  const savingsPercent = conventionalCostRp > 0 ? Math.round((savingsRp / conventionalCostRp) * 100) : 55;

  return {
    commodityName: commodity.name,
    growthStage,
    stageName: stageConfig.name,
    areaInAre,
    macroNutrients: {
      nitrogenKg: nKg,
      phosphorusKg: pKg,
      potassiumKg: kKg,
      calciumKg: caKg,
      magnesiumKg: mgKg
    },
    microNutrients: {
      zincPpm: stageMultiplier.zn,
      ironPpm: stageMultiplier.fe,
      boronPpm: stageMultiplier.b,
      copperPpm: stageMultiplier.cu
    },
    nutrientFocus: stageConfig.focus,
    recommendedRennerProducts: recommendations,
    chemicalComparisonSavings: {
      conventionalFertilizerNeededKg,
      conventionalCostRp,
      patenCostRp,
      savingsRp,
      savingsPercent
    }
  };
}
