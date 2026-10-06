import { SoilCondition, SoilInfo } from '../types';

export interface NutrientAbsorptionData {
  nutrient: string;
  nameIndo: string;
  role: string;
  // Status per pH range: 'none' (merah/tidak terserap), 'partial' (putih/biru sedikit), 'optimal' (hitam/tersedia penuh)
  ph50: 'none' | 'partial' | 'optimal';
  ph55: 'none' | 'partial' | 'optimal';
  ph60: 'none' | 'partial' | 'optimal';
  ph65_70: 'optimal';
  ph75: 'none' | 'partial' | 'optimal';
}

export const NUTRIENT_PH_TABLE: NutrientAbsorptionData[] = [
  { nutrient: 'Nitrogen (N)', nameIndo: 'Nitrogen', role: 'Pertumbuhan daun, anakan, pembentukan klorofil', ph50: 'none', ph55: 'partial', ph60: 'optimal', ph65_70: 'optimal', ph75: 'optimal' },
  { nutrient: 'Phospor (P)', nameIndo: 'Fosfor', role: 'Perkembangan akar kuat, pembungaan, gabah berisi', ph50: 'none', ph55: 'none', ph60: 'optimal', ph65_70: 'optimal', ph75: 'partial' },
  { nutrient: 'Kalium (K)', nameIndo: 'Kalium', role: 'Ketahanan batang, bobot panen, imunitas tanaman', ph50: 'none', ph55: 'partial', ph60: 'optimal', ph65_70: 'optimal', ph75: 'optimal' },
  { nutrient: 'Magnesium (Mg)', nameIndo: 'Magnesium', role: 'Inti molekul klorofil, transportasi hara', ph50: 'none', ph55: 'none', ph60: 'none', ph65_70: 'optimal', ph75: 'optimal' },
  { nutrient: 'Calsium (Ca)', nameIndo: 'Kalsium', role: 'Dinding sel tanaman, pembelahan sel pucuk', ph50: 'none', ph55: 'none', ph60: 'none', ph65_70: 'optimal', ph75: 'optimal' },
  { nutrient: 'Zink (Zn)', nameIndo: 'Seng', role: 'Hormon auksin pertumbuhan tunas', ph50: 'partial', ph55: 'optimal', ph60: 'optimal', ph65_70: 'optimal', ph75: 'none' },
  { nutrient: 'Iron / Besi (Fe)', nameIndo: 'Besi', role: 'Sintesis enzim dan transfer energi sel', ph50: 'optimal', ph55: 'optimal', ph60: 'optimal', ph65_70: 'optimal', ph75: 'partial' },
  { nutrient: 'Sulfur (S)', nameIndo: 'Belerang', role: 'Pembentukan protein dan aroma/kualitas rasa', ph50: 'none', ph55: 'partial', ph60: 'optimal', ph65_70: 'optimal', ph75: 'optimal' },
  { nutrient: 'Manganese (Mn)', nameIndo: 'Mangan', role: 'Asimilasi nitrogen dan respirasi akar', ph50: 'optimal', ph55: 'optimal', ph60: 'optimal', ph65_70: 'optimal', ph75: 'partial' },
  { nutrient: 'Boron (B)', nameIndo: 'Boron', role: 'Polinasi, pembuahan, mencegah rontok bunga', ph50: 'none', ph55: 'optimal', ph60: 'optimal', ph65_70: 'optimal', ph75: 'partial' },
  { nutrient: 'Copper / Tembaga (Cu)', nameIndo: 'Tembaga', role: 'Metabolisme protein dan dinding sel', ph50: 'partial', ph55: 'optimal', ph60: 'optimal', ph65_70: 'optimal', ph75: 'optimal' },
  { nutrient: 'Molybdenum (Mo)', nameIndo: 'Molibdenum', role: 'Fiksasi nitrogen udara oleh bintil akar', ph50: 'none', ph55: 'none', ph60: 'none', ph65_70: 'optimal', ph75: 'optimal' }
];

export const SOIL_CONDITIONS: Record<SoilCondition, SoilInfo> = {
  sangat_asam: {
    condition: 'sangat_asam',
    phRange: 'pH 4.5 - 5.2',
    phValue: 5.0,
    label: 'Tanah Sangat Masam (Kritis)',
    description: 'Akibat pemakaian pupuk kimia granul menahun. Tanah mengeras pejal, kehilangan porositas. Nitrogen, Fosfor, dan Kalium mengendap dan TIDAK DAPAT diserap tanaman.',
    nutrientAbsorptionRate: 0.35, // Pupuk kimia terbuang 65% sia-sia!
    patenAbsorptionRate: 0.95,    // Paten nano langsung diserap via stomata daun!
    color: '#ef4444'
  },
  asam: {
    condition: 'asam',
    phRange: 'pH 5.3 - 5.9',
    phValue: 5.6,
    label: 'Tanah Masam (Kurang Ideal)',
    description: 'Sirkulasi udara dan air terbatas. Sebagian besar pupuk kimia granul mengikat pada partikel tanah sehingga efisiensi serapan sangat rendah.',
    nutrientAbsorptionRate: 0.52,
    patenAbsorptionRate: 0.97,
    color: '#f97316'
  },
  agak_asam: {
    condition: 'agak_asam',
    phRange: 'pH 6.0 - 6.4',
    phValue: 6.2,
    label: 'Tanah Agak Masam',
    description: 'Mulai responsif terhadap hara namun magnesium dan kalsium masih mengalami hambatan penyerapan.',
    nutrientAbsorptionRate: 0.75,
    patenAbsorptionRate: 0.98,
    color: '#eab308'
  },
  ideal: {
    condition: 'ideal',
    phRange: 'pH 6.5 - 7.0',
    phValue: 6.8,
    label: 'Tanah Ideal / Subur (Optimum)',
    description: 'Kondisi langka di Indonesia saat ini. Semua 12 unsur hara makro & mikro terserap 100% sempurna oleh perakaran tanaman.',
    nutrientAbsorptionRate: 0.90,
    patenAbsorptionRate: 1.0,
    color: '#22c55e'
  }
};

export const SOIL_LAYERS = [
  {
    name: 'Humus',
    depth: '0 - 5 cm',
    color: 'bg-amber-950',
    textColor: 'text-amber-200',
    desc: 'Lapisan paling atas sangat subur dari sisa tumbuhan & hewan yang terurai oleh mikroorganisme.'
  },
  {
    name: 'Topsoil',
    depth: 'Kedalaman s/d 30 cm',
    color: 'bg-amber-800',
    textColor: 'text-amber-100',
    desc: 'Lapisan paling subur tempat mikroba aktif dan bahan organik tinggi, sangat cocok untuk perakaran pendek padi, jagung, & sayuran.'
  },
  {
    name: 'Subsoil',
    depth: 'Di bawah 30 cm',
    color: 'bg-amber-600',
    textColor: 'text-white',
    desc: 'Warna lebih terang, kesuburan relatif rendah karena mikroorganisme sudah jarang ditemukan.'
  },
  {
    name: 'Air & Batuan Induk',
    depth: '> 100 cm',
    color: 'bg-stone-500',
    textColor: 'text-stone-100',
    desc: 'Lapisan bebatuan keras dan cadangan air tanah dalam.'
  }
];

export const CHEMICAL_FERTILIZER_DAMAGE = [
  {
    icon: 'AlertTriangle',
    title: 'Tanah Mengeras & Hilang Porositas',
    desc: 'Penggunaan pupuk kimia granul terus-menerus memadatkan struktur butir tanah sehingga pori-pori aerasi tertutup.'
  },
  {
    icon: 'Droplets',
    title: 'Sirkulasi Air & Udara Tersumbat',
    desc: 'Akar tanaman kesulitan bernapas, penyerapan air terganggu, memicu pembusukan akar dan kekerdilan.'
  },
  {
    icon: 'Skull',
    title: 'Mikroorganisme Tanah Musnah',
    desc: 'Residu asam dan garam anorganik membunuh bakteri dan cacing tanah yang seharusnya mendekomposisi bahan organik.'
  },
  {
    icon: 'TrendingDown',
    title: 'Biaya Membengkak, Hasil Menurun',
    desc: 'Petani terpaksa terus menaikkan dosis pupuk kimia karena tanah tidak lagi merespons, mengakibatkan biaya melonjak tinggi dan laba tergerus.'
  }
];

export const PATEN_NANO_BREAKTHROUGH = [
  {
    title: 'Makanan Siap Saji Tanpa Fotosintesis',
    desc: 'Unsur hara Paten telah dipecah hingga skala nanometer sehingga langsung diserap jaringan sel tanpa menunggu proses fotosintesis yang panjang.'
  },
  {
    title: 'Menembus Stomata Daun Secara Langsung',
    desc: 'Tanaman tetap menyerap nutrisi 100% optimal meskipun kondisi tanah masam (pH rendah) atau cuaca ekstrem.'
  },
  {
    title: 'Dilengkapi Pembenah Tanah (Soil Treatment)',
    desc: 'Satu sachet sudah merangkap pembenah tanah alami untuk mengembalikan kegemburan dan menaikkan kembali pH tanah secara perlahan.'
  },
  {
    title: 'Hemat Praktis Berlimpah',
    desc: 'Kemasan sachet ringan berbobot gram/ml menggantikan karungan pupuk kimia berat, menghemat ongkos angkut dan tenaga kerja hingga 90%.'
  }
];
