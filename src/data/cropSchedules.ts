import { CommodityId, CropScheduleConfig } from '../types';

export const CROP_SCHEDULES: Record<CommodityId, CropScheduleConfig> = {
  padi: {
    commodityId: 'padi',
    name: 'Padi Sawah (Gogo / Irigasi)',
    tips: [
      'Penyemprotan dilakukan semprot kasar di pagi hari (pukul 06.00 - 09.00) saat stomata daun terbuka sempurna.',
      'Jika ingin mencampur ZA/Urea cukup 1 gelas per tangki, maka dosis Paten Gold cukup 1 sachet per tangki 16-20L.',
      'Untuk 1 Hektar sawah (100 are) 1x panen membutuhkan 6 box Paten Gold (total 72 sachet).',
      'Hindari menyemprot pada saat terik siang atau saat hendak turun hujan deras.'
    ],
    schedules: [
      {
        id: 'padi-1',
        dayAfterPlanting: 5,
        title: 'Pemupukan Awal (HST 5)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold'],
        dosage: '2 sachet Paten Gold per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Campurkan 2 sachet Paten Gold ke dalam air tangki. Semprotkan kasar ke daun dan permukaan tanah basah.',
        targetStomata: 'Stomata daun bibit dan perakaran muda'
      },
      {
        id: 'padi-2',
        dayAfterPlanting: 14,
        title: 'Fase Anakan Aktif (HST 12-15)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold', 'Insektisida Nabati/Ringan'],
        dosage: '3 sachet Paten Gold + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Campurkan 3 sachet Paten Gold + insektisida. Semprotkan merata ke seluruh anakan padi untuk mempercepat anakan produktif.',
        targetStomata: 'Daun anakan untuk memperbanyak rumpun produktif'
      },
      {
        id: 'padi-3',
        dayAfterPlanting: 28,
        title: 'Fase Vegetatif Maksimal (HST 28)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold', 'Insektisida'],
        dosage: '3 sachet Paten Gold + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Campurkan 3 sachet Paten Gold + insektisida. Semprot merata untuk memperkuat batang dan mencegah penggerek batang.',
        targetStomata: 'Batang & helai daun utama'
      },
      {
        id: 'padi-4',
        dayAfterPlanting: 50,
        title: 'Fase Primordia / Bunting (HST 50)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold'],
        dosage: '2 sachet Paten Gold per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan merata saat bulir mulai bunting bunting kecil agar serempak keluar malai.',
        targetStomata: 'Daun bendera padi'
      },
      {
        id: 'padi-5',
        dayAfterPlanting: 70,
        title: 'Fase Pengisian Bulir (HST 70)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold'],
        dosage: '2 sachet Paten Gold per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan halus/kasar pada daun bendera agar bulir padi bernas, kuning mengkilap, dan padat sampai pangkal.',
        targetStomata: 'Malai & daun bendera'
      }
    ]
  },
  jagung: {
    commodityId: 'jagung',
    name: 'Jagung Hibrida / Manis',
    tips: [
      'Penyemprotan H+5 sangat krusial untuk mencegah serangan Virus Bule (Peronosclerospora).',
      'Pengocoran H+12 dan H+26 menggunakan kombinasi Urea 2 gelas aqua per 20 liter untuk pacu vegetatif.',
      'H+35 kocor 2 sachet Paten Gold untuk membesarkan tongkol dan mencegah tongkol ompong.'
    ],
    schedules: [
      {
        id: 'jg-1',
        dayAfterPlanting: 5,
        title: 'Pencegahan Virus Bule (HST 5)',
        actionType: 'Semprot Halus',
        products: ['Paten Gold', 'Paten Imun'],
        dosage: '1 sachet Paten Gold per tangki 16-20L',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Campurkan 1 sachet Paten Gold per tangki. Semprot pada tanaman muda untuk proteksi dari virus bule.',
        targetStomata: 'Daun muda jagung'
      },
      {
        id: 'jg-2',
        dayAfterPlanting: 12,
        title: 'Pengocoran Akar I (HST 12)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'Urea'],
        dosage: '1 sachet Paten Gold + Urea 2 gelas aqua / 20 Liter',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Larutkan 1 sachet Paten Gold + Urea 2 gelas ke 20L air. Kocorkan 50 ml per pohon di pangkal batang.',
        targetStomata: 'Perakaran aktif'
      },
      {
        id: 'jg-3',
        dayAfterPlanting: 14,
        title: 'Proteksi Hama Ulat Grayak (HST 14)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold', 'Insektisida'],
        dosage: '1 sachet Paten Gold + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan ke pucuk daun tempat ulat grayak biasa bersembunyi.',
        targetStomata: 'Pusat lingkaran daun muda'
      },
      {
        id: 'jg-4',
        dayAfterPlanting: 21,
        title: 'Pacu Pertumbuhan Batang (HST 21)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold', 'Insektisida'],
        dosage: '1 sachet Paten Gold + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprot merata di pagi hari untuk memperbesar diameter batang jagung.',
        targetStomata: 'Seluruh permukaan daun'
      },
      {
        id: 'jg-5',
        dayAfterPlanting: 26,
        title: 'Pengocoran Akar II (HST 26)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'Urea'],
        dosage: '1 sachet Paten Gold + Urea 2 gelas aqua / 20 Liter',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Kocorkan 50 ml per pohon di lingkar pangkal.',
        targetStomata: 'Akar serabut sekunder'
      },
      {
        id: 'jg-6',
        dayAfterPlanting: 28,
        title: 'Semprot Vegetatif Akhir (HST 28)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold', 'Insektisida'],
        dosage: '1 sachet Paten Gold + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan merata di daun bagian bawah.',
        targetStomata: 'Stomata permukaan bawah daun'
      },
      {
        id: 'jg-7',
        dayAfterPlanting: 35,
        title: 'Pengocoran Pembentukan Tongkol (HST 35)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold'],
        dosage: '2 sachet Paten Gold / 20 Liter air',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Kocorkan 50 ml per pohon untuk mendorong calon 2 tongkol jagung besar dan padat.',
        targetStomata: 'Akar penyangga'
      }
    ]
  },
  kedelai: {
    commodityId: 'kedelai',
    name: 'Kacang Kedelai / Kacang Tanah / Gandum',
    tips: [
      'Langkah perendaman benih dengan Paten Hijau 10 menit sebelum tanam mempercepat daya kecambah hingga 98%.',
      'Penyemprotan rutin Paten Hijau + Paten Imun per 10 hari mencegah penyakit karat daun dan antraknosa.',
      'Sangat menghemat pestisida sampai 80% dan fungisida 100%.'
    ],
    schedules: [
      {
        id: 'kd-1',
        dayAfterPlanting: 0,
        title: 'Perendaman Benih (Pra Tanam)',
        actionType: 'Rendam Benih',
        products: ['Paten Hijau'],
        dosage: '1 sachet Paten Hijau / 10 Liter air',
        waterVolume: '10 Liter air',
        mixingInstruction: 'Rendam biji benih kedelai selama 10 menit, tiriskan sebentar lalu segera tanam.',
        targetStomata: 'Embrio biji benih'
      },
      {
        id: 'kd-2',
        dayAfterPlanting: 10,
        title: 'Semprot Daun I (HST 10)',
        actionType: 'Semprot Halus',
        products: ['Paten Hijau', 'Paten Imun', 'Insektisida'],
        dosage: '1 sachet Paten Hijau + 1 sachet Paten Imun + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Campurkan ke dalam tangki, semprot merata pada tanaman kedelai muda.',
        targetStomata: 'Daun trifoliat awal'
      },
      {
        id: 'kd-3',
        dayAfterPlanting: 20,
        title: 'Semprot Daun II (HST 20)',
        actionType: 'Semprot Halus',
        products: ['Paten Hijau', 'Paten Imun', 'Insektisida'],
        dosage: '1 sachet Paten Hijau + 1 sachet Paten Imun + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan merata di pagi hari untuk memacu cabang dan bintil akar rhizobium.',
        targetStomata: 'Cabang produktif'
      },
      {
        id: 'kd-4',
        dayAfterPlanting: 30,
        title: 'Fase Berbunga (HST 30)',
        actionType: 'Semprot Halus',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Paten Hijau + 1 sachet Paten Imun per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan kabut halus untuk mencegah kerontokan bunga dan merangsang polong.',
        targetStomata: 'Bunga dan helai daun'
      },
      {
        id: 'kd-5',
        dayAfterPlanting: 40,
        title: 'Pengisian Polong (HST 40)',
        actionType: 'Semprot Halus',
        products: ['Paten Hijau', 'Paten Imun', 'Insektisida'],
        dosage: '1 sachet Paten Hijau + 1 sachet Paten Imun + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan merata agar biji kedelai besar, padat berisi 3-4 biji per polong.',
        targetStomata: 'Kulit polong & daun fotosintesis'
      },
      {
        id: 'kd-6',
        dayAfterPlanting: 50,
        title: 'Pematangan Polong (HST 50)',
        actionType: 'Semprot Halus',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Paten Hijau + 1 sachet Paten Imun per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Aplikasi terakhir menjelang daun menguning untuk memaksimalkan bobot kering panen.',
        targetStomata: 'Seluruh polong'
      }
    ]
  },
  sawit: {
    commodityId: 'sawit',
    name: 'Kelapa Sawit (TM / TBM)',
    tips: [
      '1 Hektar = 120-130 pohon sawit. 1 pohon = 1 sachet Paten Gold diaplikasikan 4 bulan sekali (3x setahun).',
      'Daerah sulit air: Tuangkan langsung 1 sachet Paten Gold pada pangkal pohon / pelepah.',
      'Daerah cukup air: Campurkan 6 box Paten Gold + air 150 Liter, kocorkan 1 Liter per pohon.',
      'Tanaman umur < 2 tahun (TBM): Campurkan 6 box Paten Gold + air 150 Liter, kocorkan 500 ml/pohon 4 bulan sekali.'
    ],
    schedules: [
      {
        id: 'swt-1',
        dayAfterPlanting: 30,
        title: 'Aplikasi Periode 1 (Bulan ke-1)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold'],
        dosage: '1 sachet per pohon atau 1 Liter larutan/pohon',
        waterVolume: '150 Liter per 6 box untuk 120 pohon',
        mixingInstruction: 'Kocorkan di piringan sawit atau tuangkan 1 sachet di pelepah pangkal.',
        targetStomata: 'Piringan perakaran sawit'
      },
      {
        id: 'swt-2',
        dayAfterPlanting: 120,
        title: 'Aplikasi Periode 2 (Bulan ke-4)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold'],
        dosage: '1 sachet per pohon',
        waterVolume: 'Sesuai ketersediaan air lahan',
        mixingInstruction: 'Aplikasi berkala 4 bulan sekali untuk memacu TBS (Tandan Buah Segar) berbobot tebal.',
        targetStomata: 'Perakaran piringan pohon'
      },
      {
        id: 'swt-3',
        dayAfterPlanting: 240,
        title: 'Aplikasi Periode 3 (Bulan ke-8)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold'],
        dosage: '1 sachet per pohon',
        waterVolume: 'Sesuai ketersediaan air lahan',
        mixingInstruction: 'Menjaga pohon tidak trek (tetap berbuah lebat di luar musim) dan kadar rendemen CPO tinggi.',
        targetStomata: 'Pangkal batang & piringan'
      }
    ]
  },
  bawang_merah: {
    commodityId: 'bawang_merah',
    name: 'Bawang Merah & Putih',
    tips: [
      'Hari ke-5 setelah tanam kocorkan Paten Gold + Urea 1 gelas per 20 liter, kocorkan 50 ml per pohon.',
      'Ulangi pengocoran pada umur 15, 25, dan 35 hari setelah tanam.',
      'Hari ke-35 semprot 1 sachet Paten Gold + Insek per tangki 16-20 Liter tiap 5 hari sekali.'
    ],
    schedules: [
      {
        id: 'bw-1',
        dayAfterPlanting: 5,
        title: 'Pengocoran Awal (HST 5)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'Urea'],
        dosage: '1 sachet Paten Gold + Urea 1 gelas / 20L air',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Kocorkan 50 ml per tanaman.',
        targetStomata: 'Akar bibit umbi bawang'
      },
      {
        id: 'bw-2',
        dayAfterPlanting: 15,
        title: 'Pengocoran Fase Tunas (HST 15)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'Urea'],
        dosage: '1 sachet Paten Gold + Urea 1 gelas / 20L air',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Kocorkan 50 ml per tanaman di sekitar umbi.',
        targetStomata: 'Perakaran anakan'
      },
      {
        id: 'bw-3',
        dayAfterPlanting: 25,
        title: 'Pengocoran Pembesaran Umbi (HST 25)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'Urea'],
        dosage: '1 sachet Paten Gold + Urea 1 gelas / 20L air',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Kocorkan 50 ml per tanaman.',
        targetStomata: 'Umbi bawah tanah'
      },
      {
        id: 'bw-4',
        dayAfterPlanting: 35,
        title: 'Semprot Proteksi Hama Umbi (HST 35)',
        actionType: 'Semprot Kasar',
        products: ['Paten Gold', 'Insektisida'],
        dosage: '1 sachet Paten Gold + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprot merata di daun bawang setiap 5 hari sekali sampai menjelang panen.',
        targetStomata: 'Daun silindris bawang'
      }
    ]
  },
  cabai: {
    commodityId: 'cabai',
    name: 'Cabai Besar & Cabai Rawit / Tomat',
    tips: [
      'Sebelum tanam (H-2), semprot lahan/tanah dengan Paten Imun 3 sachet per tangki untuk sterilisasi jamur layu.',
      'HST 7 kocor 1 sachet Paten Hijau + 1 sachet Imun + air 16 Liter (50 ml per pohon) tiap 15-20 hari sekali.',
      'Semprotkan Paten Hijau 1 sachet + Imun 1 sachet + Insek per tangki setiap 7 hari sekali hingga panen selesai.'
    ],
    schedules: [
      {
        id: 'cb-0',
        dayAfterPlanting: -2,
        title: 'Sterilisasi Media Tanam (H-2 Pra Tanam)',
        actionType: 'Semprot Kasar',
        products: ['Paten Imun'],
        dosage: '3 sachet Paten Imun per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan merata ke bedengan dan lubang tanam 2 hari sebelum bibit ditanam untuk bunuh patogen jamur Fusarium.',
        targetStomata: 'Tanah bedengan & lubang mulsa'
      },
      {
        id: 'cb-1',
        dayAfterPlanting: 7,
        title: 'Kocor Pengakaran Awal (HST 7)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Paten Hijau + 1 sachet Imun / 16L',
        waterVolume: '16 Liter air',
        mixingInstruction: 'Kocorkan 50 ml per lubang tanaman. Lakukan tiap 15-20 hari sekali.',
        targetStomata: 'Pangkal batang & akar'
      },
      {
        id: 'cb-2',
        dayAfterPlanting: 14,
        title: 'Semprot Rutin Mingguan I (HST 14)',
        actionType: 'Semprot Halus',
        products: ['Paten Hijau', 'Paten Imun', 'Insektisida'],
        dosage: '1 sachet Paten Hijau + 1 sachet Imun + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprot halus di bawah daun untuk mencegah kutu kebul dan antraknosa.',
        targetStomata: 'Mulut daun (stomata) bawah'
      },
      {
        id: 'cb-3',
        dayAfterPlanting: 28,
        title: 'Semprot Fase Bunga & Cabang (HST 28)',
        actionType: 'Semprot Halus',
        products: ['Paten Hijau', 'Paten Imun', 'Insektisida'],
        dosage: '1 sachet Paten Hijau + 1 sachet Imun + Insek per tangki',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprot rutin tiap 7 hari sekali untuk memicu percabangan Y dan bunga lebat tidak rontok.',
        targetStomata: 'Seluruh tajuk tanaman'
      }
    ]
  },
  tembakau: {
    commodityId: 'tembakau',
    name: 'Tembakau (Rajangan Kering Super)',
    tips: [
      'Berdasarkan Slide 28 PDF Paten: Hari ke-14 kocor 1 sachet Paten Gold + ZA 1 gelas + air 20L (100ml/pohon).',
      'Hari ke-28 kocor 1 sachet Paten Gold + NPK 1 gelas + air 20L (100ml/pohon), ulangi lagi di HST 30.',
      'Penyemprotan daun: Campurkan 1 sachet Paten Gold + Insektisida + air 60 Liter, semprotkan tiap 7 hari sekali.',
      'Paten Gold menghasilkan helaian daun tembakau lebih tebal, elastis, beraroma harum, dan bernilai jual tinggi.'
    ],
    schedules: [
      {
        id: 'tb-1',
        dayAfterPlanting: 7,
        title: 'Semprot Proteksi Bibit Awal (HST 7)',
        actionType: 'Semprot Halus',
        products: ['Paten Gold', 'Insektisida'],
        dosage: '1 sachet Paten Gold + Insek / 60 Liter air',
        waterVolume: 'Tangki 16 - 20 Liter (dosis proporsional)',
        mixingInstruction: 'Semprotkan kabut halus ke daun muda untuk proteksi dari ulat daun dan kutu tembakau.',
        targetStomata: 'Stomata daun muda tembakau'
      },
      {
        id: 'tb-2',
        dayAfterPlanting: 14,
        title: 'Pengocoran Akar I (HST 14)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'ZA'],
        dosage: '1 sachet Paten Gold + ZA 1 gelas + air 20 Liter',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Larutkan merata, kocorkan 100 ml per pohon di pangkal batang.',
        targetStomata: 'Perakaran aktif tanaman tembakau'
      },
      {
        id: 'tb-3',
        dayAfterPlanting: 21,
        title: 'Semprot Rutin Daun (HST 21)',
        actionType: 'Semprot Halus',
        products: ['Paten Gold', 'Insektisida'],
        dosage: '1 sachet Paten Gold + Insek / 60 Liter air',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan merata di pagi hari untuk memperlebar helai daun.',
        targetStomata: 'Permukaan bawah daun tembakau'
      },
      {
        id: 'tb-4',
        dayAfterPlanting: 28,
        title: 'Pengocoran Akar II (HST 28)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'NPK'],
        dosage: '1 sachet Paten Gold + NPK 1 gelas + air 20 Liter',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Kocorkan 100 ml per pohon untuk memacu ketebalan dan mutu resin tembakau.',
        targetStomata: 'Perakaran serabut tembakau'
      },
      {
        id: 'tb-5',
        dayAfterPlanting: 30,
        title: 'Pengocoran Lanjutan (HST 30)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'NPK'],
        dosage: '1 sachet Paten Gold + NPK 1 gelas + air 20 Liter',
        waterVolume: '20 Liter air',
        mixingInstruction: 'Lakukan pengocoran ulang 100 ml per pohon sesuai petunjuk Slide 28 PDF.',
        targetStomata: 'Pangkal batang'
      },
      {
        id: 'tb-6',
        dayAfterPlanting: 42,
        title: 'Semprot Pembesaran Daun Menjelang Petik (HST 42)',
        actionType: 'Semprot Halus',
        products: ['Paten Gold'],
        dosage: '1 sachet Paten Gold / 60 Liter air',
        waterVolume: 'Tangki 16 - 20 Liter',
        mixingInstruction: 'Semprotkan kabut halus untuk memaksimalkan bobot kering rajangan tembakau.',
        targetStomata: 'Seluruh helai daun tembakau'
      }
    ]
  },
  gaharu: {
    commodityId: 'gaharu',
    name: 'Gaharu (Pohon Gubal Kayu Wangi)',
    tips: [
      'Berdasarkan Slide 20 PDF Paten: Campurkan 12 sachet Paten Gold + NPK 2 kg + air 200 Liter.',
      'Kocorkan 1 Liter per pohon gaharu secara melingkar di sekeliling tajuk perakaran.',
      'Lakukan pemupukan rutin setiap 3 bulan sekali (4 kali pemakaian dalam 1 tahun).',
      'Paten Gold memperkuat jaringan kayu, memacu translokasi hara dan mempercepat akumulasi gubal resin wangi pasca inokulasi jamur gubal.'
    ],
    schedules: [
      {
        id: 'gh-1',
        dayAfterPlanting: 30,
        title: 'Aplikasi Triwulan I (Bulan ke-1)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'NPK'],
        dosage: '12 sachet Paten Gold + NPK 2 kg / 200 Liter air (1L/pohon)',
        waterVolume: '200 Liter untuk 200 pohon',
        mixingInstruction: 'Campurkan 12 sachet Paten Gold + NPK 2kg dalam drum 200L air. Kocorkan 1 liter per pohon.',
        targetStomata: 'Piringan perakaran tajuk pohon gaharu'
      },
      {
        id: 'gh-2',
        dayAfterPlanting: 120,
        title: 'Aplikasi Triwulan II (Bulan ke-4)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'NPK'],
        dosage: '12 sachet Paten Gold + NPK 2 kg / 200 Liter air (1L/pohon)',
        waterVolume: '200 Liter untuk 200 pohon',
        mixingInstruction: 'Kocorkan 1 liter per pohon tiap 3 bulan sekali sesuai petunjuk Slide 20 PDF.',
        targetStomata: 'Akar pohon gaharu'
      },
      {
        id: 'gh-3',
        dayAfterPlanting: 210,
        title: 'Aplikasi Triwulan III (Bulan ke-7 / Pasca Inokulasi)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'Paten Imun', 'NPK'],
        dosage: '12 sachet Paten Gold + 4 sachet Paten Imun + NPK 2 kg / 200L',
        waterVolume: '200 Liter air',
        mixingInstruction: 'Mencegah pohon mati pasca injeksi jamur inokulan serta memicu pembentukan resin gubal hitam berkualitas.',
        targetStomata: 'Pangkal batang dan lingkar perakaran'
      },
      {
        id: 'gh-4',
        dayAfterPlanting: 300,
        title: 'Aplikasi Triwulan IV (Bulan ke-10)',
        actionType: 'Kocor Akar',
        products: ['Paten Gold', 'NPK'],
        dosage: '12 sachet Paten Gold + NPK 2 kg / 200 Liter air (1L/pohon)',
        waterVolume: '200 Liter untuk 200 pohon',
        mixingInstruction: 'Kocorkan 1 liter per pohon untuk memadatkan aroma wangi dan kerapatan resin kayu gubal.',
        targetStomata: 'Perakaran aktif pohon'
      }
    ]
  },
  sapi: {
    commodityId: 'sapi',
    name: 'Sapi (Penggemukan & Sapi Perah)',
    tips: [
      'Campurkan 1 sachet Paten Hijau + 1 sachet Paten Imun ke dalam 200 liter air minum / air komboran pakan.',
      'Diberikan rutin 2 kali sehari pagi dan sore.',
      'Semprotkan larutan Paten Imun ke dinding dan lantai kandang 1 minggu sekali untuk mensterilkan kuman dan membasmi bau amonia.'
    ],
    schedules: [
      {
        id: 'sp-1',
        dayAfterPlanting: 1,
        title: 'Fase Adaptasi & Pembersihan Pencernaan (Hari 1-7)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Hijau + 1 sachet Imun / 200 Liter air minum',
        waterVolume: '200 Liter air minum',
        mixingInstruction: 'Aduk homogen ke bak penampungan air minum sapi atau air komboran konsentrat.',
        targetStomata: 'Saluran pencernaan dan mikroflora lambung rumen'
      },
      {
        id: 'sp-2',
        dayAfterPlanting: 15,
        title: 'Fase Pacu Nafsu Makan & Bobot (Hari 15-30)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau'],
        dosage: '1 sachet Paten Hijau per 150 Liter air minum',
        waterVolume: '150 Liter air',
        mixingInstruction: 'Meningkatkan absorbsi protein pakan dan percepatan pertambahan bobot harian (ADG 1.2 kg/hari).',
        targetStomata: 'Metabolisme penyerapan nutrisi usus halus'
      },
      {
        id: 'sp-3',
        dayAfterPlanting: 35,
        title: 'Proteksi Virus PMK & Sanitasi Kandang (Hari 35)',
        actionType: 'Semprot Kasar',
        products: ['Paten Imun'],
        dosage: '2 sachet Paten Imun per tangki semprot 16L',
        waterVolume: 'Tangki 16 Liter air',
        mixingInstruction: 'Semprotkan ke udara kandang, sela-sela lantai, dan pakan hijauan untuk mencegah infeksi virus PMK & antraks.',
        targetStomata: 'Udara dan lingkungan kandang'
      },
      {
        id: 'sp-4',
        dayAfterPlanting: 60,
        title: 'Fase Pembentukan Daging & Pemadatan Karkas (Hari 60-90)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Hijau + 1 sachet Imun per 200 Liter',
        waterVolume: '200 Liter air minum',
        mixingInstruction: 'Menjaga sapi tetap tenang, daging padat berisi, rendemen karkas tinggi menjelang panen potong.',
        targetStomata: 'Sel jaringan otot daging'
      }
    ]
  },
  kerbau: {
    commodityId: 'kerbau',
    name: 'Kerbau (Lumpur & Pedaging)',
    tips: [
      'Kerbau menyerap nutrisi nano sangat cepat untuk pembentukan otot dada dan punggung.',
      'Gunakan kombinasi Paten Hijau + Imun setiap minggu untuk mencegah penyakit kembung dan parasit kubangan.'
    ],
    schedules: [
      {
        id: 'kb-1',
        dayAfterPlanting: 1,
        title: 'Inisiasi Pakan & Daya Tahan (Bulan 1)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Hijau + 1 sachet Imun per 200L air minum',
        waterVolume: '200 Liter',
        mixingInstruction: 'Campurkan ke air minum atau pakan ampas tahu/dedak komboran.',
        targetStomata: 'Pencernaan ruminansia kerbau'
      },
      {
        id: 'kb-2',
        dayAfterPlanting: 45,
        title: 'Fase Pertumbuhan Rangka & Daging (Bulan 2)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau'],
        dosage: '1 sachet per 150 Liter air minum',
        waterVolume: '150 Liter',
        mixingInstruction: 'Pemberian teratur setiap pagi.',
        targetStomata: 'Serapan serat kasar pakan hijauan'
      },
      {
        id: 'kb-3',
        dayAfterPlanting: 90,
        title: 'Sterilisasi Lingkungan Kubangan & Kandang (Bulan 3)',
        actionType: 'Semprot Kasar',
        products: ['Paten Imun'],
        dosage: '2 sachet per tangki semprot',
        waterVolume: '16 Liter',
        mixingInstruction: 'Semprotkan ke kulit ternak dan lantai kandang.',
        targetStomata: 'Permukaan kulit dan kuku kerbau'
      }
    ]
  },
  kambing: {
    commodityId: 'kambing',
    name: 'Kambing & Domba (Penggemukan/Kurban)',
    tips: [
      '1 sachet Paten Hijau cukup untuk memenuhi kebutuhan suplemen 25-30 ekor kambing per hari.',
      'Membantu cempe (anak kambing) tumbuh cepat tanpa resiko diare (mencret).',
      'Kotoran kambing menjadi tidak berbau dan urin tidak menyengat.'
    ],
    schedules: [
      {
        id: 'km-1',
        dayAfterPlanting: 1,
        title: 'Pencegahan Mencret & Nafsu Makan (Minggu 1)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Hijau + 1 sachet Imun per 100L air minum',
        waterVolume: '100 Liter untuk 30 ekor kambing',
        mixingInstruction: 'Larutkan dalam tong penampungan air minum kambing.',
        targetStomata: 'Rumen & peredaran darah'
      },
      {
        id: 'km-2',
        dayAfterPlanting: 20,
        title: 'Fase Kilap Bulu & Peningkatan Daging (Minggu 3-5)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau'],
        dosage: '1 sachet per 100 Liter air',
        waterVolume: '100 Liter air',
        mixingInstruction: 'Berikan secara rutin 3 hari sekali.',
        targetStomata: 'Pertumbuhan karkas paha & punggung'
      },
      {
        id: 'km-3',
        dayAfterPlanting: 50,
        title: 'Pemadatan Bobot Menjelang Panen/Kurban (Minggu 7)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Hijau + 1 sachet Imun per 80L air',
        waterVolume: '80 Liter air',
        mixingInstruction: 'Menjaga stamina prima dan bobot timbangan stabil saat diangkut.',
        targetStomata: 'Kepadatan daging kambing'
      }
    ]
  },
  ayam_itik: {
    commodityId: 'ayam_itik',
    name: 'Ayam & Itik (Pedaging / Petelur / Bebek)',
    tips: [
      '1 sachet Paten Hijau + 1 sachet Imun per 100-200 Liter air minum unggas.',
      'Kandang bebas bau amonia lalat, angka kematian (mortalitas) turun drastis di bawah 2%.',
      'Pada ayam/bebek petelur: Produksi telur stabil >85%, cangkang tebal tidak mudah retak, warna kuning telur oranye pekat.'
    ],
    schedules: [
      {
        id: 'ay-1',
        dayAfterPlanting: 1,
        title: 'Fase Starter / Brooding (Hari 1-7)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Hijau + 1 sachet Imun per 150 Liter air minum',
        waterVolume: '150 Liter air minum',
        mixingInstruction: 'Berikan pada air minum DOC ayam / DOD bebek untuk memperkuat daya tahan organ vital.',
        targetStomata: 'Pencernaan awal anak unggas'
      },
      {
        id: 'ay-2',
        dayAfterPlanting: 14,
        title: 'Fase Finisher / Pacu Bobot (Hari 14-28)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau'],
        dosage: '1 sachet per 100 Liter air minum',
        waterVolume: '100 Liter air',
        mixingInstruction: 'Menurunkan FCR pakan sehingga unggas lebih efisien mengubah pakan jadi daging.',
        targetStomata: 'Penyerapan asam amino usus unggas'
      },
      {
        id: 'ay-3',
        dayAfterPlanting: 25,
        title: 'Sanitasi Pengendalian Amonia Kandang (Hari 25)',
        actionType: 'Semprot Kasar',
        products: ['Paten Imun'],
        dosage: '2 sachet per tangki 16L',
        waterVolume: 'Tangki 16 Liter',
        mixingInstruction: 'Semprotkan kabut halus ke atas sekam kotoran dan udara kandang.',
        targetStomata: 'Lantai sekam kotoran kandang'
      },
      {
        id: 'ay-4',
        dayAfterPlanting: 35,
        title: 'Masa Panen Broiler / Puncak Produksi Petelur (Hari 35+)',
        actionType: 'Kocor Akar',
        products: ['Paten Hijau', 'Paten Imun'],
        dosage: '1 sachet Hijau + 1 sachet Imun per 150 Liter',
        waterVolume: '150 Liter air',
        mixingInstruction: 'Memaksimalkan bobot timbangan karkas dan kontinuitas produksi telur bermutu tinggi.',
        targetStomata: 'Ovarium petelur dan otot karkas'
      }
    ]
  }
};
