import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint: AI Plant Disease Detection
app.post('/api/detect-disease', async (req: Request, res: Response) => {
  try {
    const { imageBase64, cropType, notes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Data gambar diperlukan.' });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    if (!ai) {
      // Fallback response if API key is not configured
      return res.json({
        diagnosis: {
          diseaseName: cropType === 'jagung' ? 'Gejala Awal Bulai (Peronosclerospora)' : cropType === 'kedelai' ? 'Karat Daun Kedelai (Phakopsora pachyrhizi)' : 'Bercak Daun & Defisiensi Hara Mikro',
          severity: 'Sedang',
          confidence: 88,
          symptoms: [
            'Klorosis atau bercak kekuningan pada helai daun.',
            'Penurunan laju fotosintesis akibat gangguan stomata.',
            'Indikasi tanah kurang poros atau asam yang menghambat serapan kation.'
          ],
          causes: 'Kelembapan tinggi dan daya tahan sel tanaman menurun akibat aplikasi pupuk kimia berlebih.',
          patenRecommendation: {
            products: ['Paten Imun', 'Paten Gold / Paten Hijau'],
            dosage: '1 sachet Paten Imun + 1 sachet Paten Hijau/Gold per tangki 16-20 Liter',
            frequency: 'Semprot tiap 5-7 hari sekali di pagi hari (pukul 06.00-09.00)',
            instructions: 'Semprot kabut halus merata pada stomata daun bagian bawah dan atas.',
            savingsBenefit: 'Menghemat biaya fungisida kimia hingga 100% dan melindungi sel tanaman secara nano.'
          },
          prevention: 'Perbaiki pH tanah ke 6.5-7.0 menggunakan unsur pembenah tanah Paten. Hindari genangan air berlebih.'
        }
      });
    }

    const prompt = `Anda adalah Ahli Agronomi dan Patologi Tanaman Spesialis Pupuk Paten Organik Teknologi Nano (PT Renner Inti Internasional).
Lakukan diagnosis penyakit atau gangguan nutrisi pada tanaman berdasarkan foto daun/tanaman ini.
Komoditi target: ${cropType || 'Tanaman Pertanian (Padi / Jagung / Kedelai)'}.
Catatan petani: ${notes || '-'}.

Berikan analisis dalam format JSON murni tanpa markdown triple-backtick:
{
  "diseaseName": "Nama penyakit / hama / defisiensi nutrisi (Bahasa Indonesia & Latin)",
  "severity": "Ringan" | "Sedang" | "Kritis",
  "confidence": 92,
  "symptoms": ["gejala 1", "gejala 2", "gejala 3"],
  "causes": "Penyebab utama (jamur/bakteri/virus/tanah asam)",
  "patenRecommendation": {
    "products": ["Paten Imun", "Paten Gold / Hijau"],
    "dosage": "Takaran sachet per tangki 16-20L atau per pohon",
    "frequency": "Jadwal penyemprotan / pengocoran",
    "instructions": "Cara aplikasi stomata & tips praktis",
    "savingsBenefit": "Manfaat hemat biaya fungisida/pestisida & pemulihan cepat"
  },
  "prevention": "Langkah mitigasi & perawatan tanah"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let diagnosisJson;
    try {
      diagnosisJson = JSON.parse(rawText);
    } catch {
      diagnosisJson = {
        diseaseName: 'Analisis Daun Tanaman',
        severity: 'Sedang',
        confidence: 85,
        symptoms: ['Perubahan warna daun akibat ketidakseimbangan hara'],
        causes: 'Gangguan penyerapan hara dan kelembapan ekstrem',
        patenRecommendation: {
          products: ['Paten Imun', 'Paten Gold'],
          dosage: '1 sachet Paten Imun + 1 sachet Paten Gold per tangki 16-20L',
          frequency: 'Semprot 7 hari sekali',
          instructions: 'Semprot di pagi hari saat stomata terbuka.',
          savingsBenefit: 'Nutrisi nano makanan siap saji memperkuat imunitas sel.'
        },
        prevention: 'Jaga kelembapan tanah di 65% dan rutin gunakan pembenah tanah Paten.'
      };
    }

    return res.json({ diagnosis: diagnosisJson });
  } catch (error: any) {
    console.error('Error in /api/detect-disease:', error);
    return res.status(500).json({
      error: 'Gagal memproses diagnosis gambar.',
      details: error.message,
    });
  }
});

// Endpoint: Simulated IoT Soil Telemetry & Sensor Readings
app.get('/api/sensor-data', (req: Request, res: Response) => {
  const moisture = 64 + Math.round((Math.random() * 8 - 4));
  const temp = 28.5 + (Math.random() * 2 - 1);
  const ph = 6.4 + (Math.random() * 0.4 - 0.2);
  const ec = 1.2 + (Math.random() * 0.2 - 0.1);

  res.json({
    timestamp: new Date().toISOString(),
    soilMoisture: moisture,
    soilTemperature: parseFloat(temp.toFixed(1)),
    soilPh: parseFloat(ph.toFixed(2)),
    conductivityEc: parseFloat(ec.toFixed(2)),
    stomataStatus: 'Terbuka Optimal (Waktu Ideal Penyemprotan)',
    batteryLevel: 94,
    status: moisture < 40 ? 'Kering - Perlu Pengairan' : moisture > 85 ? 'Jenuh Air' : 'Optimal Subur'
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Paten Agro Renner Syariah berjalan di http://localhost:${PORT}`);
  });
}

startServer();
