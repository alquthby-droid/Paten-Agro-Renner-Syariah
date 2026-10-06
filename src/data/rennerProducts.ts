export interface RennerProduct {
  id: string;
  name: string;
  category: 'Pertanian' | 'Peternakan & Perikanan' | 'Kesehatan' | 'Kecantikan';
  packaging: string;
  pricePerBox: number;
  bpomKementan: string;
  highlight: string;
  description: string;
  benefits: string[];
  usageTarget: string;
  imageUrl?: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
}

export const USER_PRODUCT_IMAGE_LINKS: Record<string, string> = {
  'paten-gold': '/images/products/paten-gold.png',
  'paten-hijau': '/images/products/paten-hijau.png',
  'paten-imun': '/images/products/paten-imun.png',
  'paten-tambak-ternak': 'https://kommodo.ai/i/5kzUcVS4Cw1GpAEnoWuJ',
  'renner-fibra': 'https://kommodo.ai/i/y1WISL76sqknjutcttm9',
  'renner-colpro': '/images/products/colpro.png',
  'renner-revit': '/images/products/revit.png',
  'renner-serum': 'https://kommodo.ai/i/y1WISL76sqknjutcttm9'
};

export const EXTERNAL_PRODUCT_IMAGE_URLS: Record<string, string> = {
  'paten-gold': 'https://plain-apac-prod-public.komododecks.com/202610/06/iD2dd8ooXKo05NZXPURW/image.png',
  'paten-hijau': 'https://plain-apac-prod-public.komododecks.com/202610/06/syGU3FIRAfph7CQVVDox/image.png',
  'paten-imun': 'https://plain-apac-prod-public.komododecks.com/202610/06/3PmJSsZvIoMTHvYQ2mlv/image.png',
  'renner-colpro': 'https://plain-apac-prod-public.komododecks.com/202610/06/5kzUcVS4Cw1GpAEnoWuJ/image.png',
  'renner-revit': 'https://plain-apac-prod-public.komododecks.com/202610/06/y1WISL76sqknjutcttm9/image.png'
};

export const RENNER_COMPANY_INFO = {
  name: 'PT. RENNER INTI INTERNASIONAL',
  brand: 'RENNER SYARIAH',
  address: 'Jl. Topaz Raya No F67-68, Panakukang Mas, Makassar, Sulawesi Selatan',
  concept: 'PLBS (Penjualan Langsung Berjenjang Syariah)',
  legalities: [
    { title: 'Sertifikat Syariah DSN-MUI', regNumber: 'SK No: 012.161.01/DSN-MUI/1X/2023', verified: true },
    { title: 'Izin Usaha SIUPL', regNumber: 'IZIN: 91202001606480003', verified: true },
    { title: 'Anggota Resmi APLI', regNumber: 'APLI No: 0189/07/18', verified: true },
    { title: 'Kementerian Pertanian RI (Paten Gold)', regNumber: 'No Pendaftaran: 02.02.2022.763', verified: true },
    { title: 'Kementerian Pertanian RI (Paten Hijau & Imun)', regNumber: 'Terdaftar Resmi Kementan RI', verified: true },
    { title: 'Sertifikat Hak Merek HAKI', regNumber: 'Kemenkumham Ditjen HAKI Terdaftar', verified: true },
    { title: 'Sertifikasi Mutu', regNumber: 'ISO 22000, GMP Quality, HACCP Certified', verified: true }
  ],
  marketPotential: {
    sawit: { areaHa: 14850000, potentialRp: '89,1 Triliun', formula: '14.850.000 Ha x Rp 6.000.000' },
    sawah: { areaHa: 8000000, potentialRp: '19,4 Triliun', formula: '8.000.000 Ha x Rp 2.400.000 (2x panen)' },
    tambak: { areaHa: 674000, potentialRp: '6,5 Triliun', formula: '674.000 Ha x Rp 9.600.000' },
    totalPotential: '115 Triliun Rupiah'
  },
  fourPillars: [
    { title: 'Pilar I: Legalitas', desc: 'Perizinan lengkap DSN-MUI, SIUPL, APLI, dan Kementan RI menjamin keamanan & kepatuhan syariat.' },
    { title: 'Pilar II: Produk Unggulan', desc: 'Hasil riset ahli pertanian >13 tahun, pelopor pupuk organik nano sachet dan suplemen kesehatan berizin BPOM.' },
    { title: 'Pilar III: Marketing Plan Syariah', desc: 'Sistem bagi hasil adil tanpa riba, 5 macam bonus, reward berulang hingga Rp 1 Miliar dan hak bisnis dapat diwariskan.' },
    { title: 'Pilar IV: Sekolah Bisnis Renner Academy', desc: 'Dukungan mentoring langkah kerja, strategi bisnis, komunitas positif, dan alat bantu digital bagi mitra.' }
  ],
  partnershipTiers: [
    { name: 'Bronze', modalRp: 1500000, poin: 0.2, productValueRp: 1800000, maxBonusPairingDay: 1000000 },
    { name: 'Silver', modalRp: 3500000, poin: 0.6, productValueRp: 4200000, maxBonusPairingDay: 3000000 },
    { name: 'Gold', modalRp: 5500000, poin: 1.0, productValueRp: 6600000, maxBonusPairingDay: 5000000 },
    { name: 'Platinum', modalRp: 15500000, poin: 3.0, productValueRp: 18600000, maxBonusPairingDay: 10000000 },
    { name: 'Titanium', modalRp: 25500000, poin: 5.0, productValueRp: 30600000, maxBonusPairingDay: 20000000 }
  ]
};

export const RENNER_PRODUCTS: RennerProduct[] = [
  {
    id: 'paten-gold',
    name: 'PATEN GOLD',
    category: 'Pertanian',
    packaging: '1 Box = 12 Sachet @ 25 ml',
    pricePerBox: 200000,
    bpomKementan: 'Kementan RI No. 02.02.2022.763',
    highlight: 'Pelopor Pupuk Organik Teknologi Nano untuk Tanaman Keras & Serat Lurus',
    description: 'Pupuk organik teknologi nano hasil penelitian ahli pertanian lebih dari 13 tahun. Mengandung unsur hara lengkap makro & mikro siap saji serta unsur pembenah tanah (soil treatment) dalam 1 sachet.',
    benefits: [
      'Meningkatkan hasil & kualitas produksi pertanian',
      'Mempercepat masa panen secara optimal',
      'Merangsang pembuahan di luar musim (off-season)',
      'Meringankan biaya produksi & operasional pupuk',
      'Memperbaiki kualitas dan porositas tanah yang mengeras',
      'Memperkuat daya tahan tanaman terhadap cuaca ekstrem',
      'Menghemat fungisida sampai 100%',
      'Menghemat pestisida sampai 80%',
      'Menghemat pupuk kimia sampai 100%'
    ],
    usageTarget: 'Padi, Jagung, Kelapa Sawit, Durian, Kelapa, Kurma, Karet, Pinang, Cengkeh, Jeruk, Buah Naga, Pisang, Tembakau, Tebu, Gaharu',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['paten-gold'],
    colorScheme: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700',
      border: 'border-amber-400',
      badge: 'bg-amber-500 text-white'
    }
  },
  {
    id: 'paten-hijau',
    name: 'PATEN HIJAU',
    category: 'Pertanian',
    packaging: '1 Box = 24 Sachet @ 3 gram',
    pricePerBox: 200000,
    bpomKementan: 'Terdaftar Resmi Kementan RI',
    highlight: 'Pupuk Organik Nano untuk Tanaman Jangka Pendek & Hortikultura',
    description: 'Diformulasikan khusus untuk fase vegetatif (pertumbuhan) dan generatif (pembuahan) tanaman semusim. Nutrisi berukuran partikel nano langsung diserap lewat mulut daun (stomata) tanpa harus menunggu proses fotosintesis.',
    benefits: [
      'Sebagai katalisator penyerapan unsur hara instan',
      'Menyimpan cadangan hara aktif dalam jaringan sel tanaman',
      'Merangsang perakaran baru dan tunas anakan produktif',
      'Menstabilkan pH media tanam dan memulihkan mikroorganisme',
      'Kemasan sachet sangat praktis dan mudah diaplikasikan',
      'Ramah lingkungan & mendukung pertanian organik berkelanjutan'
    ],
    usageTarget: 'Padi, Jagung, Kedelai, Cabai, Tomat, Bawang Merah, Sayuran Daun (Sawi/Kol/Brokoli), Kentang, Wortel, Semangka, Melon',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['paten-hijau'],
    colorScheme: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700',
      border: 'border-emerald-400',
      badge: 'bg-emerald-600 text-white'
    }
  },
  {
    id: 'paten-imun',
    name: 'PATEN IMUN',
    category: 'Pertanian',
    packaging: '1 Box = 24 Sachet',
    pricePerBox: 200000,
    bpomKementan: 'Terdaftar Resmi Kementan RI',
    highlight: 'Bio-Imunostimulan Nano: Penangkal Virus, Jamur & Bakteri',
    description: 'Imunostimulan tanaman berteknologi nano yang meningkatkan sistem pertahanan alami tanaman secara sistemik. Terbukti ampuh mencegah virus bule pada jagung, kresek/blas pada padi, dan layu fusarium.',
    benefits: [
      'Meningkatkan imunitas sel tanaman terhadap infeksi bakteri, virus, dan spora jamur',
      'Mencegah dan menghentikan penularan virus bule jagung sejak fase H+5',
      'Mengurangi ketergantungan pestisida kimia hingga 80%',
      'Menggantikan fungisida kimia hingga 100%',
      'Bekerja sinergis bila dipadukan dengan Paten Hijau atau Paten Gold'
    ],
    usageTarget: 'Semua jenis tanaman pangan, hortikultura, perkebunan, serta perikanan tambak & kandang ternak',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['paten-imun'],
    colorScheme: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-700',
      border: 'border-blue-400',
      badge: 'bg-blue-600 text-white'
    }
  },
  {
    id: 'paten-tambak-ternak',
    name: 'PATEN TAMBAK & TERNAK',
    category: 'Peternakan & Perikanan',
    packaging: 'Paket Paten Hijau & Paten Imun Box',
    pricePerBox: 200000,
    bpomKementan: 'Aplikasi Khusus Tambak & Pakan Ternak',
    highlight: 'Penumbuh Plankton Alami, Penambah Bobot & Antivirus Udang/Ikan/Unggas',
    description: 'Aplikasi sinergi Paten Hijau dan Imun pada perikanan air tawar & payau serta peternakan. Menyuburkan pakan alami fitoplankton dan menekan angka mortalitas.',
    benefits: [
      'Menambah populasi plankton & fitoplankton air sebagai pakan alami ikan & udang',
      'Menggemukkan dan mengobati serangan virus pada udang vaname & bandeng',
      'Menambah bobot daging unggas, sapi, kambing, dan produksi telur',
      'Meningkatkan daya tahan ternak dari stres dan perubahan cuaca',
      'Dapat disemprotkan sebagai sterilisasi kandang dari kuman patogen'
    ],
    usageTarget: 'Udang, Nila, Bandeng, Lele, Kolam Terpal/Beton, Ayam, Bebek, Sapi, Kambing, Kuda',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['paten-tambak-ternak'],
    colorScheme: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-800',
      border: 'border-cyan-400',
      badge: 'bg-cyan-700 text-white'
    }
  },
  {
    id: 'renner-fibra',
    name: 'RENNER FIBRA',
    category: 'Kesehatan',
    packaging: '1 Box Serbuk Rasa Apel',
    pricePerBox: 200000,
    bpomKementan: 'BPOM RI MD 867031157367',
    highlight: 'Minuman Serbuk Serat Apel: Solusi Detoksifikasi Usus & Karsinogen',
    description: 'Berdasarkan riset Dr. John Harvey Kellogg bahwa 90% penyakit berawal dari usus yang kotor penuh toksin. Fibra membersihkan kerak saluran cerna secara alami.',
    benefits: [
      'Detoksifikasi zat berbahaya dan karsinogen dalam usus besar',
      'Melancarkan buang air besar (laksatif alami)',
      'Membantu menyeimbangkan berat badan ideal',
      'Memperbaiki keseimbangan asam basa tubuh',
      'Sebagai prebiotik untuk meningkatkan populasi probiotik (bakteri baik)'
    ],
    usageTarget: 'Kesehatan saluran cerna, penderita sembelit, detoks harian seluruh anggota keluarga',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['renner-fibra'],
    colorScheme: {
      bg: 'bg-lime-500/10',
      text: 'text-lime-800',
      border: 'border-lime-400',
      badge: 'bg-lime-600 text-white'
    }
  },
  {
    id: 'renner-colpro',
    name: 'COLPRO (COLOSTRUM PRO)',
    category: 'Kesehatan',
    packaging: '1 Box Serbuk Kolostrum Murni',
    pricePerBox: 200000,
    bpomKementan: 'BPOM RI MD 805028152052',
    highlight: 'Kolostrum Murni: Makanan Terlengkap untuk Regenerasi Sel & Imunitas',
    description: 'Mengandung immunoglobulin IgG tinggi dari susu awal sapi murni. Memperbaiki jaringan rusak dan meremajakan sel tubuh.',
    benefits: [
      'Mengandung kolostrum murni sebagai nutrisi terlengkap',
      'Sumber protein biologis dan kalsium tinggi bagi balita hingga lansia',
      'Memperbaiki sel yang rusak dan mempercepat peremajaan sel baru',
      'Meningkatkan imunitas dan antibodi melawan radikal bebas'
    ],
    usageTarget: 'Daya tahan tubuh, pemulihan pasca sakit, pertumbuhan anak & kesehatan sendi lansia',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['renner-colpro'],
    colorScheme: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-800',
      border: 'border-indigo-400',
      badge: 'bg-indigo-600 text-white'
    }
  },
  {
    id: 'renner-revit',
    name: 'REVIT GINSENG',
    category: 'Kesehatan',
    packaging: '1 Box Minuman Serbuk Apel + Ginseng',
    pricePerBox: 200000,
    bpomKementan: 'BPOM RI MD 867028027695',
    highlight: 'Stamina, Vitalitas & Kejantanan Pria Dewasa',
    description: 'Formulasi ginseng premium plus ekstrak apel untuk melancarkan sirkulasi darah kapiler dan mengembalikan kebugaran fisik pria.',
    benefits: [
      'Menambah stamina & energi pria pekerja keras / petani di lapangan',
      'Melancarkan peredaran darah perifer',
      'Meningkatkan vitalitas dan mengatasi kelelahan kronis',
      'Meningkatkan kesuburan dan daya tahan tubuh pria'
    ],
    usageTarget: 'Pria dewasa yang membutuhkan stamina tinggi dan kebugaran prima',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['renner-revit'],
    colorScheme: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-800',
      border: 'border-rose-400',
      badge: 'bg-rose-600 text-white'
    }
  },
  {
    id: 'renner-serum',
    name: 'FACE & BODY SERUM',
    category: 'Kecantikan',
    packaging: '1 Botol 120 ml',
    pricePerBox: 200000,
    bpomKementan: 'BPOM NA 18220106292',
    highlight: 'Brightening Niacinamide B3 Serum Wajah & Tubuh',
    description: 'Serum pencerah kulit berformula ringan diperkaya Niacinamide Vitamin B3 untuk melindungi kulit dari paparan terik sinar UV matahari di lahan.',
    benefits: [
      'Mencerahkan kulit seluruh tubuh secara merata',
      'Melindungi kulit dari paparan sinar UV dan polusi',
      'Melembapkan dan mengencangkan elastisitas kulit',
      'Menyamarkan noda hitam, flek, dan bekas jerawat'
    ],
    usageTarget: 'Perawatan kulit wajah dan tubuh pria & wanita',
    imageUrl: USER_PRODUCT_IMAGE_LINKS['renner-serum'],
    colorScheme: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-800',
      border: 'border-purple-400',
      badge: 'bg-purple-600 text-white'
    }
  }
];
