import { CommodityId } from '../types';

export interface VideoTutorialItem {
  id: string;
  commodityId: CommodityId;
  commodityName: string;
  title: string;
  duration: string;
  difficulty: 'Mudah' | 'Menengah' | 'Khusus';
  summary: string;
  keyTechnique: string;
  sprayTime: string;
  nozzleType: string;
  dosageFormula: string;
  stepByStep: {
    stepNumber: number;
    title: string;
    description: string;
    importantTip?: string;
  }[];
  mistakesToAvoid: string[];
  equipmentNeeded: string[];
  pdfReference: string;
}

export const VIDEO_TUTORIALS: Record<CommodityId, VideoTutorialItem> = {
  padi: {
    id: 'vid-padi',
    commodityId: 'padi',
    commodityName: 'Padi Sawah (GKG / Irigasi)',
    title: 'Teknik Aplikasi Semprot Kasar Paten Gold pada Tanaman Padi',
    duration: '04:35',
    difficulty: 'Mudah',
    summary: 'Panduan lengkap penyemprotan Paten Gold untuk memacu anakan produktif, memperkuat batang, dan membuat bulir gabah kuning bernas padat sampai pangkal malai.',
    keyTechnique: 'Semprot Kasar menghadap stomata daun di pagi hari',
    sprayTime: 'Pukul 06.00 - 09.00 Pagi (saat stomata terbuka maksimal)',
    nozzleType: 'Nosel Kabut Kasar (Coarse Droplets)',
    dosageFormula: '2 - 3 sachet Paten Gold per tangki 16 - 20 Liter air',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Pelarutan Homogen Awal',
        description: 'Buka 2 sachet Paten Gold (atau 3 sachet di HST 14 & 28), tuangkan ke dalam ember berisi 1-2 liter air bersih, aduk hingga larut sempurna.',
        importantTip: 'Nutrisi nano larut instan dalam air tanpa endapan.'
      },
      {
        stepNumber: 2,
        title: 'Pengisian Tangki Semprot',
        description: 'Tuang larutan ke dalam tangki sprayer 16-20 Liter, lalu tambahkan air bersih hingga batas volume penuh.',
        importantTip: 'Bisa dicampur insektisida nabati atau ZA/Urea 1 gelas per tangki (bila pakai Urea, dosis Paten cukup 1 sachet).'
      },
      {
        stepNumber: 3,
        title: 'Penyemprotan Stomata Daun',
        description: 'Arahkan stik sprayer sedikit miring agar kabut semprot mengenai permukaan bawah dan atas daun padi serta pangkal anakan.',
        importantTip: 'Lakukan penyemprotan searah hembusan angin sepoi-sepoi.'
      },
      {
        stepNumber: 4,
        title: 'Aplikasi Bertahap Usia Tanaman',
        description: 'Terapkan pada fase HST 5 (2 sachet), HST 14 (3 sachet + insek), HST 28 (3 sachet + insek), HST 50 (bunting 2 sachet), dan HST 70 (pengisian bulir 2 sachet).'
      }
    ],
    mistakesToAvoid: [
      'Menyemprot saat siang terik (pukul 11.00 - 14.00) karena stomata daun menutup.',
      'Menyemprot saat awan mendung gelap hendak hujan lebat.',
      'Mencampur dengan fungisida kimia dosis tinggi (Paten Imun sudah menggantikan fungisida hingga 100%).'
    ],
    equipmentNeeded: ['Tangki Sprayer 16-20L', 'Ember Pengaduk', 'Paten Gold', 'Air Bersih'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 32'
  },
  jagung: {
    id: 'vid-jagung',
    commodityId: 'jagung',
    commodityName: 'Jagung Hibrida / Manis',
    title: 'Teknik Pencegahan Virus Bule & Pengocoran Akar Jagung',
    duration: '05:10',
    difficulty: 'Mudah',
    summary: 'Cara aplikasi Paten Gold untuk memproteksi tanaman jagung dari virus bulai sejak umur 5 hari serta teknik pengocoran akar untuk menghasilkan 2 tongkol besar per pohon.',
    keyTechnique: 'Semprot halus pucuk daun muda & kocor pangkal batang',
    sprayTime: 'Pagi 06.00 - 08.30 atau Sore 16.00 - 17.30',
    nozzleType: 'Nosel Kabut Halus (Fine Mist)',
    dosageFormula: 'Semprot: 1 sachet/tangki 16-20L • Kocor: 1 sachet + Urea 2 gelas aqua / 20L',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Proteksi Virus Bule (HST 5)',
        description: 'Semprotkan 1 sachet Paten Gold per tangki 16-20 Liter ke bibit jagung muda yang baru tumbuh 3-4 daun.',
        importantTip: 'Fase ini adalah kunci agar tanaman kebal terhadap cendawan Peronosclerospora.'
      },
      {
        stepNumber: 2,
        title: 'Pengocoran Akar I (HST 12)',
        description: 'Larutkan 1 sachet Paten Gold + Urea 2 gelas aqua ke dalam 20 liter air. Kocorkan 50 ml per pohon di pangkal batang.',
        importantTip: 'Memacu pertumbuhan perakaran dan lingkar batang kokoh.'
      },
      {
        stepNumber: 3,
        title: 'Semprot Hama Ulat Grayak (HST 14, 21, 28)',
        description: 'Semprotkan 1 sachet Paten Gold + Insektisida per tangki ke pusat lingkaran daun tempat ulat biasa bersembunyi.'
      },
      {
        stepNumber: 4,
        title: 'Pengocoran Pembesaran Tongkol (HST 35)',
        description: 'Kocorkan 2 sachet Paten Gold per 20 liter air (50 ml/pohon) agar tongkol jagung terisi penuh tanpa ujung ompong.'
      }
    ],
    mistakesToAvoid: [
      'Melewatkan semprot HST 5 (keterlambatan dapat memicu infeksi bulai sistemik).',
      'Mengocorkan larutan terlalu dekat menyentuh helai daun muda.'
    ],
    equipmentNeeded: ['Tangki Semprot', 'Gelas Takar 50ml', 'Gembor / Kocor', 'Paten Gold'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 31'
  },
  kedelai: {
    id: 'vid-kedelai',
    commodityId: 'kedelai',
    commodityName: 'Kacang Kedelai / Kacang Tanah',
    title: 'Teknik Perendaman Benih & Semprot Rutin 10 Harian',
    duration: '03:50',
    difficulty: 'Mudah',
    summary: 'Metode perendaman biji benih sebelum tanam untuk mendongkrak daya kecambah hingga 98% dan penyemprotan rutin Paten Hijau + Imun.',
    keyTechnique: 'Perendaman benih 10 menit + semprot kabut kanopi',
    sprayTime: 'Pagi hari sebelum terik matahari',
    nozzleType: 'Nosel Kabut Halus Merata',
    dosageFormula: 'Rendam: 1 sachet Paten Hijau / 10L • Semprot: 1 sachet Hijau + 1 sachet Imun per tangki',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Perendaman Benih (Pra Tanam)',
        description: 'Larutkan 1 sachet Paten Hijau ke dalam 10 liter air. Rendam biji kedelai selama 10 menit, lalu tiriskan dan segera tanam.',
        importantTip: 'Memecah dormansi biji dan mempercepat munculnya bintil akar rhizobium.'
      },
      {
        stepNumber: 2,
        title: 'Penyemprotan Vegetatif (HST 10 & 20)',
        description: 'Campurkan 1 sachet Paten Hijau + 1 sachet Paten Imun + insek ke tangki 16-20L. Semprotkan merata ke daun muda.'
      },
      {
        stepNumber: 3,
        title: 'Fase Berbunga & Polong (HST 30, 40, 50)',
        description: 'Semprotkan kabut halus untuk mencegah kerontokan bunga dan merangsang polong terisi padat 3-4 biji per polong.'
      }
    ],
    mistakesToAvoid: [
      'Merendam benih lebih dari 20 menit (cukup 10 menit saja).',
      'Menyemprot dengan tekanan pompa terlalu kencang saat bunga mekar.'
    ],
    equipmentNeeded: ['Baskom Perendaman', 'Tangki Semprot', 'Paten Hijau', 'Paten Imun'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 44'
  },
  sawit: {
    id: 'vid-sawit',
    commodityId: 'sawit',
    commodityName: 'Kelapa Sawit (TM / TBM)',
    title: 'Teknik Aplikasi Paten Gold pada Pelepah & Piringan Sawit',
    duration: '06:15',
    difficulty: 'Menengah',
    summary: 'Metode praktis pemupukan sawit 4 bulan sekali untuk daerah sulit air maupun cukup air guna mendongkrak bobot Tandan Buah Segar (TBS) dan mencegah pohon trek.',
    keyTechnique: 'Tuang sachet di pelepah pangkal atau kocor 1 liter per pohon',
    sprayTime: 'Fleksibel (pagi atau sore hari)',
    nozzleType: 'Aplikasi Kocor / Tuang Langsung',
    dosageFormula: '1 sachet per pohon (10 box untuk 120 pohon per hektar)',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Metode Daerah Sulit Air',
        description: 'Gunting ujung sachet Paten Gold, tuangkan langsung 1 sachet pada pangkal pelepah pohon sawit yang paling dekat dengan batang.',
        importantTip: 'Nutrisi nano akan diserap oleh pelepah dan dialirkan melalui pembuluh vaskular.'
      },
      {
        stepNumber: 2,
        title: 'Metode Daerah Cukup Air',
        description: 'Campurkan 6 box Paten Gold ke dalam drum berisi 150 liter air (untuk 120 pohon). Kocorkan 1 liter per pohon melingkar di piringan akar.',
        importantTip: 'Tanaman umur < 2 tahun (TBM): kocorkan 500 ml per pohon.'
      },
      {
        stepNumber: 3,
        title: 'Siklus Berkala 4 Bulan Sekali',
        description: 'Ulangi pemupukan setiap 4 bulan sekali (3 kali dalam 1 tahun) untuk menjaga pembentukan bunga betina terus-menerus.'
      }
    ],
    mistakesToAvoid: [
      'Menumpahkan pupuk di piringan sawit yang tertutup gulma tebal tanpa disiangi terlebih dahulu.',
      'Mengurangi dosis sachet di bawah 1 sachet per pohon untuk tanaman menghasilkan.'
    ],
    equipmentNeeded: ['Gunting Sachet', 'Ember / Drum 150L', 'Gayung Takar 1 Liter', 'Paten Gold'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 18'
  },
  bawang_merah: {
    id: 'vid-bawang_merah',
    commodityId: 'bawang_merah',
    commodityName: 'Bawang Merah & Putih',
    title: 'Teknik Kocor 10 Harian & Semprot Daun Bawang Merah',
    duration: '04:20',
    difficulty: 'Menengah',
    summary: 'Langkah pengocoran umur 5, 15, 25, 35 HST untuk menghasilkan umbi bawang merah padat mengkilap berdiameter besar dan bebas bercak ungu trotol.',
    keyTechnique: 'Kocor 50ml per rumpun & semprot kabut 5 hari sekali',
    sprayTime: 'Pukul 06.00 - 08.00 Pagi',
    nozzleType: 'Nosel Kabut Halus (Fine Mist)',
    dosageFormula: 'Kocor: 1 sachet Gold + Urea 1 gelas / 20L • Semprot: 1 sachet Gold + Insek / 16-20L',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Pengocoran Awal (HST 5)',
        description: 'Campurkan 1 sachet Paten Gold + Urea 1 gelas + 20 liter air. Kocorkan 50 ml per rumpun bibit bawang.',
        importantTip: 'Mempercepat pertumbuhan tunas awal serempak.'
      },
      {
        stepNumber: 2,
        title: 'Pengocoran Rutin (HST 15, 25, 35)',
        description: 'Lakukan pengocoran dengan formula yang sama setiap 10 hari untuk memperbanyak anakan umbi.'
      },
      {
        stepNumber: 3,
        title: 'Penyemprotan Rutin Daun (Mulai HST 35)',
        description: 'Campurkan 1 sachet Paten Gold + Insektisida per tangki 16-20 Liter. Semprotkan merata setiap 5 hari sekali hingga panen.'
      }
    ],
    mistakesToAvoid: [
      'Menyemprot daun saat terik menyengat yang dapat mengakibatkan ujung daun mengering.',
      'Kadar air bedengan terlalu tergenang becek.'
    ],
    equipmentNeeded: ['Tangki Kocor', 'Gelas Takar 50ml', 'Paten Gold', 'Urea'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 27'
  },
  cabai: {
    id: 'vid-cabai',
    commodityId: 'cabai',
    commodityName: 'Cabai Besar & Cabai Rawit / Tomat',
    title: 'Sterilisasi Tanah Pra-Tanam & Proteksi Antraknosa Cabai',
    duration: '05:00',
    difficulty: 'Menengah',
    summary: 'Kunci sukses panen cabai petikan lebih dari 20 kali: sterilisasi bedengan H-2 dengan Paten Imun untuk membasmi jamur layu dan semprot mingguan Paten Hijau.',
    keyTechnique: 'Sterilisasi media tanam H-2 & semprot kabut stomata bawah daun',
    sprayTime: 'Pagi hari pukul 06.00 - 08.30',
    nozzleType: 'Nosel Kabut Halus Terarah',
    dosageFormula: 'Sterilisasi: 3 sachet Imun/tangki • Rutin: 1 sachet Hijau + 1 sachet Imun/tangki',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Sterilisasi Media Tanam (H-2 Pra Tanam)',
        description: 'Semprotkan 3 sachet Paten Imun per tangki 16 Liter ke tanah bedengan dan lubang mulsa 2 hari sebelum tanam.',
        importantTip: 'Membasmi spora Fusarium dan Phytophthora penyebab layu mematikan.'
      },
      {
        stepNumber: 2,
        title: 'Kocor Pengakaran Awal (HST 7)',
        description: 'Campur 1 sachet Paten Hijau + 1 sachet Paten Imun ke 16 liter air. Kocorkan 50 ml per tanaman.'
      },
      {
        stepNumber: 3,
        title: 'Semprot Rutin Mingguan (Tiap 7 Hari Sekali)',
        description: 'Semprotkan Paten Hijau 1 sachet + Paten Imun 1 sachet + insektisida per tangki setiap 7 hari sekali hingga masa panen selesai.'
      }
    ],
    mistakesToAvoid: [
      'Tidak melakukan sterilisasi media tanam sebelum bibit dipindah.',
      'Menggunakan fungisida kimia sintetis keras yang dapat merusak kutikula daun.'
    ],
    equipmentNeeded: ['Tangki Sprayer 16L', 'Gelas Ukur', 'Paten Hijau', 'Paten Imun'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 34'
  },
  tembakau: {
    id: 'vid-tembakau',
    commodityId: 'tembakau',
    commodityName: 'Tembakau (Rajangan Kering Super)',
    title: 'Teknik Aplikasi Tembakau Slide 28: Daun Tebal Berbobot',
    duration: '04:45',
    difficulty: 'Khusus',
    summary: 'Aplikasi terarah untuk menghasilkan helai daun tembakau lebar, tebal elastis, beraroma harum, serta meningkatkan bobot rajangan kering hingga 60%.',
    keyTechnique: 'Kocor bertahap HST 14, 28, 30 & semprot 7 harian',
    sprayTime: 'Pukul 06.00 - 08.30 Pagi',
    nozzleType: 'Nosel Kabut Halus Merata',
    dosageFormula: 'Kocor: 1 sachet Gold + ZA/NPK 1 gelas / 20L (100ml/pohon) • Semprot: 1 sachet / 60L',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Semprot Bibit Awal (HST 7)',
        description: 'Larutkan 1 sachet Paten Gold + Insektisida ke dalam 60 liter air. Semprotkan kabut halus ke daun muda untuk proteksi ulat grayak.',
        importantTip: 'Gunakan dosis proporsional untuk 3 tangki semprot.'
      },
      {
        stepNumber: 2,
        title: 'Pengocoran Akar I (HST 14)',
        description: 'Campurkan 1 sachet Paten Gold + ZA 1 gelas + air 20 liter. Kocorkan 100 ml per pohon di pangkal batang.',
        importantTip: 'Memacu serapan nitrogen siap saji untuk pelebaran helai daun.'
      },
      {
        stepNumber: 3,
        title: 'Pengocoran Akar II & III (HST 28 & HST 30)',
        description: 'Campurkan 1 sachet Paten Gold + NPK 1 gelas + air 20 liter. Kocorkan 100 ml per pohon pada HST 28 dan ulangi lagi pada HST 30.'
      },
      {
        stepNumber: 4,
        title: 'Penyemprotan Berkala (Tiap 7 Hari Sekali)',
        description: 'Semprotkan 1 sachet Paten Gold + insektisida per 60 liter air secara rutin setiap 7 hari sekali.'
      }
    ],
    mistakesToAvoid: [
      'Menyiram air berlebih saat mendekati panen tebang.',
      'Melewatkan pengocoran ulang di HST 30.'
    ],
    equipmentNeeded: ['Tangki Semprot', 'Gelas Takar 100ml', 'Paten Gold', 'Pupuk ZA & NPK'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 28'
  },
  gaharu: {
    id: 'vid-gaharu',
    commodityId: 'gaharu',
    commodityName: 'Gaharu (Pohon Gubal Kayu Wangi)',
    title: 'Teknik Pemupukan Triwulanan Gaharu: Pacu Resin Gubal Hitam',
    duration: '06:40',
    difficulty: 'Khusus',
    summary: 'Aplikasi drum 200 Liter untuk 200 pohon gaharu setiap 3 bulan sekali guna mempercepat translokasi resin gubal wangi bernilai tinggi dan melindungi pohon dari kematian pasca inokulasi.',
    keyTechnique: 'Kocor melingkar 1 liter per pohon tiap 3 bulan sekali',
    sprayTime: 'Pagi atau sore hari',
    nozzleType: 'Aplikasi Kocor Piringan Akar',
    dosageFormula: '12 sachet Paten Gold + NPK 2 kg + air 200 Liter (1 Liter per pohon)',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Persiapan Drum 200 Liter Air',
        description: 'Siapkan drum kapasitas 200 liter air. Buka 12 sachet Paten Gold dan masukkan bersama 2 kg pupuk NPK.',
        importantTip: 'Aduk dengan tongkat hingga seluruh sachet dan butiran NPK larut homogen.'
      },
      {
        stepNumber: 2,
        title: 'Pengocoran Tajuk Perakaran Pohon',
        description: 'Ambil larutan dengan gayung takar 1 Liter, kocorkan secara melingkar di sekeliling tajuk perakaran pohon gaharu.',
        importantTip: 'Kapasitas 1 drum 200L cukup untuk memupuk 200 pohon gaharu.'
      },
      {
        stepNumber: 3,
        title: 'Aplikasi Khusus Pasca Inokulasi Jamur',
        description: 'Pada fase setelah pohon disuntik jamur pembentuk gubal, tambahkan 4 sachet Paten Imun ke dalam drum untuk menjaga antibodi pohon agar tidak mati layu.'
      },
      {
        stepNumber: 4,
        title: 'Jadwal Berkala Tiap 3 Bulan',
        description: 'Lakukan secara konsisten setiap 3 bulan sekali (4 kali pemupukan dalam 1 tahun).'
      }
    ],
    mistakesToAvoid: [
      'Mengocorkan larutan hanya pada satu titik batang (harus melingkar di lingkar perakaran).',
      'Mengabaikan proteksi Paten Imun saat inokulasi jamur gubal dilakukan.'
    ],
    equipmentNeeded: ['Drum 200 Liter', 'Gayung Takar 1L', 'Paten Gold', 'NPK 2kg'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 20'
  },
  sapi: {
    id: 'vid-sapi',
    commodityId: 'sapi',
    commodityName: 'Sapi (Penggemukan & Sapi Perah)',
    title: 'Teknik Aplikasi Paten Ternak pada Air Minum & Pakan Sapi',
    duration: '05:30',
    difficulty: 'Mudah',
    summary: 'Cara melarutkan Paten Hijau & Imun pada bak air minum / pakan komboran sapi guna mendongkrak ADG (1.2 kg/hari), menaikkan produksi susu, dan mensterilkan kandang dari PMK.',
    keyTechnique: 'Larutan homogen air minum pagi/sore & semprot kabut dinding kandang',
    sprayTime: 'Pemberian minum: Pagi & Sore • Semprot kandang: Pukul 10.00 Pagi',
    nozzleType: 'Aplikasi Air Minum / Semprot Kabut Sanitasi',
    dosageFormula: '1 sachet Paten Hijau + 1 sachet Paten Imun per 200 Liter air minum (10 ekor sapi)',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Pelarutan Sachet pada Ember Awal',
        description: 'Buka 1 sachet Paten Hijau dan 1 sachet Paten Imun, masukkan ke ember berisi 5 liter air bersih, aduk selama 30 detik hingga larut sempurna.',
        importantTip: 'Formula nano langsung menyatu dengan molekul air tanpa meninggalkan ampas.'
      },
      {
        stepNumber: 2,
        title: 'Pencampuran ke Bak Penampungan Air Minum',
        description: 'Tuang larutan pekat ke dalam toren/bak air minum ternak berkapasitas 150-200 Liter air.',
        importantTip: 'Dapat juga dicampurkan langsung ke dalam ember pakan komboran ampas tahu / dedak.'
      },
      {
        stepNumber: 3,
        title: 'Sanitasi Pencegahan PMK Kandang',
        description: 'Larutkan 2 sachet Paten Imun ke tangki semprot 16L. Semprotkan secara merata ke udara kandang, lantai kotoran, dan dinding seminggu sekali.'
      }
    ],
    mistakesToAvoid: [
      'Mencampur Paten ke air minum yang mengandung kaporit dosis tinggi (gunakan air sumur/mata air bersih).',
      'Memberikan larutan yang sudah dibiarkan terbuka lebih dari 48 jam.'
    ],
    equipmentNeeded: ['Bak Air Minum 200L', 'Ember Pengaduk', 'Sprayer 16L', 'Paten Hijau', 'Paten Imun'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 23'
  },
  kerbau: {
    id: 'vid-kerbau',
    commodityId: 'kerbau',
    commodityName: 'Kerbau (Lumpur & Pedaging)',
    title: 'Teknik Aplikasi Paten Ternak untuk Kerbau Kerja & Pedaging',
    duration: '04:15',
    difficulty: 'Mudah',
    summary: 'Aplikasi pakan komboran untuk mempertebal massa otot daging, mempercepat pemulihan tenaga kerbau, dan memperkuat daya tahan dari parasit kubangan.',
    keyTechnique: 'Campuran komboran hijauan & semprot kuku ternak',
    sprayTime: 'Pagi hari sebelum ternak dilepas atau sore hari di kandang',
    nozzleType: 'Pemberian Minum & Semprot Eksternal',
    dosageFormula: '1 sachet Hijau + 1 sachet Imun per 200 Liter air minum',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Pencampuran Pakan Penguat',
        description: 'Campurkan larutan Paten Hijau ke dalam adonan dedak, bekatul, dan sedikit garam untuk memancing nafsu makan kerbau.',
        importantTip: 'Merangsang mikroba rumen agar mencerna serat kasar rumput gajah lebih efisien.'
      },
      {
        stepNumber: 2,
        title: 'Proteksi Kuku dan Kulit',
        description: 'Semprotkan larutan Paten Imun ke sela-sela kuku dan punggung kerbau untuk mencegah infeksi jamur dan kutu air.'
      }
    ],
    mistakesToAvoid: [
      'Memberikan pakan terlalu basah tanpa imbangan hijauan segar yang cukup.'
    ],
    equipmentNeeded: ['Ember Komboran', 'Paten Hijau', 'Paten Imun'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 23'
  },
  kambing: {
    id: 'vid-kambing',
    commodityId: 'kambing',
    commodityName: 'Kambing & Domba (Penggemukan/Kurban)',
    title: 'Teknik Suplemen Paten Ternak: Bobot Naik & Bebas Bau Kandang',
    duration: '04:40',
    difficulty: 'Mudah',
    summary: 'Metode pemberian Paten Ternak untuk 30 ekor kambing/domba: mempercepat kenaikan berat karkas, bulu halus mengkilap, dan kotoran kering tidak berbau menyengat.',
    keyTechnique: 'Aplikasi bak minum otomatis & semprot alas kotoran',
    sprayTime: 'Pagi pukul 07.00 - 08.30 WIB',
    nozzleType: 'Air Minum & Semprot Kabut Sanitasi',
    dosageFormula: '1 sachet Paten Hijau per 100 Liter air minum (untuk 25-30 ekor)',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Pemberian Rutin Air Minum',
        description: 'Larutkan 1 sachet Paten Hijau ke dalam tandon air minum 100 Liter. Alirkan ke nipple atau palung minum kambing.',
        importantTip: 'Nafsu makan rumput & konsentrat meningkat nyata dalam 3 hari pertama.'
      },
      {
        stepNumber: 2,
        title: 'Perlindungan Cempe (Anak Kambing)',
        description: 'Tambahkan 1 sachet Paten Imun pada susu/air minum cempe untuk mencegah kematian akibat diare (mencret putih).'
      },
      {
        stepNumber: 3,
        title: 'Pengendalian Bau Urin & Amonia',
        description: 'Semprotkan sisa larutan Paten Imun ke kolong panggung kandang untuk mengeringkan kotoran dan menetralkan bau amonia.'
      }
    ],
    mistakesToAvoid: [
      'Membiarkan palung minum berlumut kotor (bersihkan sebelum mengisi air baru).'
    ],
    equipmentNeeded: ['Tandon Air 100L', 'Sprayer', 'Paten Hijau', 'Paten Imun'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 23'
  },
  ayam_itik: {
    id: 'vid-ayam_itik',
    commodityId: 'ayam_itik',
    commodityName: 'Ayam & Itik (Pedaging / Petelur / Bebek)',
    title: 'Teknik Aplikasi Paten Unggas: FCR Rendah & Telur Melimpah',
    duration: '05:00',
    difficulty: 'Mudah',
    summary: 'Panduan peternak ayam broiler, layer, dan bebek: menekan angka kematian ke <2%, kandang bebas lalat & amonia, serta meningkatkan ketebalan cangkang telur.',
    keyTechnique: 'Injeksi tandon air minum otomatis & semprot kabut sekam',
    sprayTime: 'Pagi hari secara berkala',
    nozzleType: 'Nosel Kabut Sangat Halus (Mist)',
    dosageFormula: '1 sachet Hijau + 1 sachet Imun per 150-200 Liter air minum',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Aplikasi DOC / DOD Starter',
        description: 'Larutkan Paten Hijau + Imun ke dalam air gula / air minum hari pertama kedatangan bibit untuk memulihkan stres perjalanan.',
        importantTip: 'Menutup pori-pori kuning telur dan mempercepat penyerapan antibodi induk.'
      },
      {
        stepNumber: 2,
        title: 'Aplikasi Fase Pembesaran & Bertelur',
        description: 'Berikan secara berkala 2 hari sekali pada tandon air minum unggas.',
        importantTip: 'Pada ayam petelur: warna kuning telur menjadi jingga tua bernutrisi tinggi.'
      },
      {
        stepNumber: 3,
        title: 'Semprot Kabut Penekan Amonia & Lalat',
        description: 'Semprotkan Paten Imun ke hamparan sekam kandang 3 hari sekali. Kotoran cepat kering dan populasi lalat berkurang drastis.'
      }
    ],
    mistakesToAvoid: [
      'Menyemprot unggas dengan tekanan air terlalu deras hingga bulu basah kuyup.',
      'Mencampur dengan antibiotik kimia dosis tinggi yang merusak probiotik usus.'
    ],
    equipmentNeeded: ['Toren Air Minum', 'Sprayer Elektrik Kabut', 'Paten Hijau', 'Paten Imun'],
    pdfReference: 'Brosur Sosialisasi Paten Slide 23'
  }
};
