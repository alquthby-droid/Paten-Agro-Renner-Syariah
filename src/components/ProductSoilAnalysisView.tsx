import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileCheck2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
  Info,
  Image as ImageIcon,
  Link,
  Save,
  RotateCcw,
  Eye,
  Upload,
  Camera,
  Trash2
} from 'lucide-react';
import {
  RENNER_COMPANY_INFO,
  RENNER_PRODUCTS,
  USER_PRODUCT_IMAGE_LINKS,
  RennerProduct
} from '../data/rennerProducts';
import {
  SOIL_LAYERS,
  CHEMICAL_FERTILIZER_DAMAGE,
  PATEN_NANO_BREAKTHROUGH,
  NUTRIENT_PH_TABLE
} from '../data/soilKnowledge';
import { formatRupiah, formatNumber } from '../utils/calculatorEngine';
import { SoilFertilityProfileView } from './SoilFertilityProfileView';

const STORAGE_CUSTOM_IMAGES_KEY = 'paten_agro_custom_product_images_v1';

export const ProductSoilAnalysisView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'products' | 'soil_analysis' | 'fertility_profiler' | 'image_manager' | 'legalities' | 'partnership'>('products');
  const [interactivePh, setInteractivePh] = useState<number>(5.5); // Slider pH 5.0 - 8.0

  // State for product images with custom override capability
  const [productImages, setProductImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_IMAGES_KEY);
      if (saved) {
        return { ...USER_PRODUCT_IMAGE_LINKS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return { ...USER_PRODUCT_IMAGE_LINKS };
  });

  const [selectedProduct, setSelectedProduct] = useState<RennerProduct>(() => {
    const first = RENNER_PRODUCTS[0];
    return {
      ...first,
      imageUrl: USER_PRODUCT_IMAGE_LINKS[first.id] || first.imageUrl
    };
  });

  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'Pertanian' | 'Peternakan & Perikanan' | 'Kesehatan' | 'Kecantikan'>('all');
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [activeEditingProductId, setActiveEditingProductId] = useState<string>('paten-gold');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);

  const detailFileInputRef = useRef<HTMLInputElement>(null);
  const managerFileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = productCategoryFilter === 'all'
    ? RENNER_PRODUCTS
    : RENNER_PRODUCTS.filter(p => p.category === productCategoryFilter);

  // Function to process and compress uploaded image file
  const handleProcessFileUpload = (productId: string, file: File) => {
    if (!file) return;
    setIsProcessingUpload(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress using off-screen canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleSaveCustomImage(productId, compressedDataUrl);
        }
        setIsProcessingUpload(false);
      };
      img.onerror = () => {
        setIsProcessingUpload(false);
        alert('Gagal memuat file gambar.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Update selected product when images change
  useEffect(() => {
    setSelectedProduct(prev => ({
      ...prev,
      imageUrl: productImages[prev.id] || prev.imageUrl
    }));
  }, [productImages]);

  const handleSaveCustomImage = (productId: string, url: string) => {
    const updated = { ...productImages, [productId]: url };
    setProductImages(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_IMAGES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setSaveSuccessMsg(`Link gambar untuk ${productId.toUpperCase()} berhasil disimpan!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleResetToDefaultImages = () => {
    setProductImages({ ...USER_PRODUCT_IMAGE_LINKS });
    try {
      localStorage.removeItem(STORAGE_CUSTOM_IMAGES_KEY);
    } catch (err) {
      console.error(err);
    }
    setSaveSuccessMsg('Semua link gambar dikembalikan ke tautan default.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Filter or color determination based on interactive pH
  const getAbsorptionStatus = (nutrientData: typeof NUTRIENT_PH_TABLE[0]) => {
    if (interactivePh < 5.3) return nutrientData.ph50;
    if (interactivePh < 5.9) return nutrientData.ph55;
    if (interactivePh < 6.4) return nutrientData.ph60;
    if (interactivePh <= 7.2) return nutrientData.ph65_70;
    return nutrientData.ph75;
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Kajian Ilmiah Ahli Pertanian & Syariah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
            Mengenal Tanah, Solusi pH & Katalog Produk Renner
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Solusi revolusioner pupuk organik teknologi nano untuk menyelamatkan tanah rusak dan meningkatkan hasil panen padi, jagung, kedelai, sawit, tembakau, hingga gaharu.
          </p>
        </div>
      </div>

      {/* Segment Navigation */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSection('products')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg transition-all text-center ${
            activeSection === 'products'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📦 Produk Paten
        </button>
        <button
          onClick={() => setActiveSection('soil_analysis')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg transition-all text-center ${
            activeSection === 'soil_analysis'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🌱 Analisis Tanah & pH
        </button>
        <button
          onClick={() => setActiveSection('fertility_profiler')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg transition-all text-center ${
            activeSection === 'fertility_profiler'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔬 Profil Kesuburan
        </button>
        <button
          onClick={() => setActiveSection('image_manager')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg transition-all text-center ${
            activeSection === 'image_manager'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🖼️ Kelola Gambar
        </button>
        <button
          onClick={() => setActiveSection('legalities')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg transition-all text-center ${
            activeSection === 'legalities'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📜 Legalitas DSN-MUI
        </button>
        <button
          onClick={() => setActiveSection('partnership')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg transition-all text-center ${
            activeSection === 'partnership'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🤝 Bisnis PLBS
        </button>
      </div>

      {/* Save Toast notification */}
      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* SECTION 1: COMPLETE RENNER PRODUCTS CATALOG WITH REAL IMAGES */}
      {activeSection === 'products' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Kategori:
            </span>
            {[
              { id: 'all' as const, label: `Semua (${RENNER_PRODUCTS.length})` },
              { id: 'Pertanian' as const, label: '🌱 Pupuk Organik Paten (Pertanian)' },
              { id: 'Peternakan & Perikanan' as const, label: '🦐 Peternakan & Tambak' },
              { id: 'Kesehatan' as const, label: '💊 Kesehatan (Colpro, Revit, Fibra)' },
              { id: 'Kecantikan' as const, label: '✨ Kecantikan (Serum)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setProductCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors border ${
                  productCategoryFilter === cat.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Cards Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredProducts.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              const currentImg = productImages[prod.id] || prod.imageUrl;
              return (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduct({ ...prod, imageUrl: currentImg })}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${prod.colorScheme.badge}`}>
                      {prod.category}
                    </span>
                    {currentImg && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Foto resmi tersedia" />
                    )}
                  </div>

                  {currentImg && (
                    <div className="h-20 w-full mb-1.5 rounded-lg overflow-hidden bg-white flex items-center justify-center border border-slate-100 p-1">
                      <img
                        src={currentImg}
                        alt={prod.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">{prod.name}</h4>
                    <p className="text-[11px] font-bold text-emerald-700 mt-0.5">{formatRupiah(prod.pricePerBox)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Product Detail Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Product Image Preview */}
              <div className="md:col-span-1 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 relative group">
                {selectedProduct.imageUrl ? (
                  <div className="relative w-full aspect-square flex items-center justify-center">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="max-h-56 max-w-full object-contain rounded-xl drop-shadow-md cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setPreviewModalImg(selectedProduct.imageUrl || null)}
                    />
                    <button
                      onClick={() => setPreviewModalImg(selectedProduct.imageUrl || null)}
                      className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-lg opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-44 w-full flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10 mb-1 opacity-50" />
                    <span className="text-xs">Gambar belum dimuat</span>
                  </div>
                )}

                <div className="w-full mt-2.5 pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => detailFileInputRef.current?.click()}
                      disabled={isProcessingUpload}
                      className="flex-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isProcessingUpload ? 'Mengunggah...' : 'Unggah Foto'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveEditingProductId(selectedProduct.id);
                        setCustomInputUrl(selectedProduct.imageUrl || '');
                        setActiveSection('image_manager');
                      }}
                      className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      title="Kelola & Masukkan Link Gambar"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>Link URL</span>
                    </button>
                  </div>

                  <input
                    ref={detailFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProcessFileUpload(selectedProduct.id, file);
                    }}
                    className="hidden"
                  />

                  <p className="text-[10px] text-slate-500 text-center truncate">
                    Bisa unggah foto dari kamera / galeri HP
                  </p>
                </div>
              </div>

              {/* Product Specifications */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${selectedProduct.colorScheme.badge}`}>
                      {selectedProduct.category}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-1">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700">
                      {selectedProduct.highlight}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-black text-emerald-800 font-['Outfit']">
                      {formatRupiah(selectedProduct.pricePerBox)}
                    </span>
                    <p className="text-[11px] text-slate-500">{selectedProduct.packaging}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                  Izin Registrasi: <strong>{selectedProduct.bpomKementan}</strong>
                </div>

                {/* Benefits Checklist */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Manfaat & Keunggulan Teruji:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedProduct.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900">Sasaran Aplikasi Tanaman & Ternak:</span>
                  <p className="text-emerald-800 mt-0.5 font-medium">{selectedProduct.usageTarget}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: SOIL FERTILITY PROFILER */}
      {activeSection === 'fertility_profiler' && (
        <SoilFertilityProfileView />
      )}

      {/* SECTION 2: PRODUCT IMAGE LINKS INPUT & GALLERY MANAGER */}
      {activeSection === 'image_manager' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Link className="w-5 h-5 text-emerald-600" />
                Kelola & Masukkan Link Gambar Produk
              </h3>
              <p className="text-xs text-slate-500">
                Tautan gambar resmi kommodo.ai dan input kustom untuk katalog produk Renner Syariah
              </p>
            </div>

            <button
              onClick={handleResetToDefaultImages}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Link Default</span>
            </button>
          </div>

          {/* Form Upload & Input Custom Image */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Unggah Foto Produk Baru / Masukkan Tautan:
                </h4>
                <p className="text-[11px] text-slate-500">
                  Dukung upload langsung dari kamera / galeri HP atau tautan web kommodo.ai
                </p>
              </div>

              {/* Product selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600">Pilih Produk:</span>
                <select
                  value={activeEditingProductId}
                  onChange={(e) => {
                    setActiveEditingProductId(e.target.value);
                    setCustomInputUrl(productImages[e.target.value] || '');
                  }}
                  className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800"
                >
                  {RENNER_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upload File & URL Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              {/* Option 1: File Upload */}
              <div className="p-3 bg-white rounded-xl border border-dashed border-emerald-300 flex flex-col items-center justify-center text-center space-y-2 hover:border-emerald-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Unggah File Foto dari Perangkat / Kamera</p>
                  <p className="text-[10px] text-slate-500">Format JPG, PNG, WEBP (Otomatis Dioptimasi)</p>
                </div>
                <button
                  type="button"
                  onClick={() => managerFileInputRef.current?.click()}
                  disabled={isProcessingUpload}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isProcessingUpload ? 'Mengompres...' : 'Pilih Foto / Jepret Kamera'}</span>
                </button>
                <input
                  ref={managerFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProcessFileUpload(activeEditingProductId, file);
                  }}
                  className="hidden"
                />
              </div>

              {/* Option 2: Image URL Input */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 h-full">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-emerald-600" />
                    Atau Masukkan Tautan / URL Gambar:
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Gunakan link online (seperti kommodo.ai)
                  </p>
                </div>
                <div className="space-y-1.5">
                  <input
                    type="url"
                    placeholder="https://kommodo.ai/i/... atau https://..."
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    onClick={() => handleSaveCustomImage(activeEditingProductId, customInputUrl)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Tautan URL</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Active Image Preview for Selected Product */}
            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-lg bg-white border border-emerald-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                  <img
                    src={productImages[activeEditingProductId] || USER_PRODUCT_IMAGE_LINKS[activeEditingProductId]}
                    alt="Pratinjau"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-950">
                    Foto Aktif untuk: {activeEditingProductId.toUpperCase()}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-mono truncate max-w-[260px] sm:max-w-md">
                    {productImages[activeEditingProductId] || USER_PRODUCT_IMAGE_LINKS[activeEditingProductId]}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewModalImg(productImages[activeEditingProductId] || USER_PRODUCT_IMAGE_LINKS[activeEditingProductId])}
                className="px-2.5 py-1 text-xs font-bold bg-white text-emerald-800 border border-emerald-300 rounded-lg shrink-0 hover:bg-emerald-100"
              >
                Lihat
              </button>
            </div>
          </div>

          {/* 5 Preset Links from User Request */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Tautan Preset Gambar Terdaftar:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[
                { title: 'Paten Gold (Box Emas Kuning)', screenshot: 'Screenshot 175419', url: '/images/products/paten-gold.png', webLink: 'https://kommodo.ai/i/iD2dd8ooXKo05NZXPURW', targetId: 'paten-gold' },
                { title: 'Paten Imun (Box Biru Tua Antivirus)', screenshot: 'Screenshot 175434', url: '/images/products/paten-imun.png', webLink: 'https://kommodo.ai/i/3PmJSsZvIoMTHvYQ2mlv', targetId: 'paten-imun' },
                { title: 'Paten Hijau (Box Hijau Pertumbuhan)', screenshot: 'Screenshot 175454', url: '/images/products/paten-hijau.png', webLink: 'https://kommodo.ai/i/syGU3FIRAfph7CQVVDox', targetId: 'paten-hijau' },
                { title: 'Colpro Colostrum Pro (Susu Karamel)', screenshot: 'Screenshot 175901', url: '/images/products/colpro.png', webLink: 'https://kommodo.ai/i/5kzUcVS4Cw1GpAEnoWuJ', targetId: 'renner-colpro' },
                { title: 'Revit Minuman Serbuk Apel Ginseng', screenshot: 'Screenshot 175930', url: '/images/products/revit.png', webLink: 'https://kommodo.ai/i/y1WISL76sqknjutcttm9', targetId: 'renner-revit' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">{item.url}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setPreviewModalImg(item.url)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      title="Lihat Pratinjau Gambar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        handleSaveCustomImage(item.targetId, item.url);
                        setActiveEditingProductId(item.targetId);
                        setCustomInputUrl(item.url);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100"
                    >
                      Gunakan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Gallery Preview Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Galeri Visual Gambar Produk:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {Object.entries(productImages).slice(0, 5).map(([key, url], idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 p-2 bg-slate-50 flex flex-col items-center justify-between text-center hover:shadow-xs transition-shadow cursor-pointer"
                  onClick={() => setPreviewModalImg(url)}
                >
                  <div className="w-full h-24 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-1 mb-1.5">
                    <img
                      src={url}
                      alt={key}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 uppercase truncate w-full">{key}</span>
                  <span className="text-[9px] text-emerald-700 font-medium">Klik perbesar</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SOIL ANALYSIS & INTERACTIVE PH MATRIX */}
      {activeSection === 'soil_analysis' && (
        <div className="space-y-5">
          {/* Lapisan Tanah: Humus, Topsoil, Subsoil */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  Mengenal Struktur Lapisan Tanah
                </h3>
                <p className="text-xs text-slate-500">
                  Kondisi ideal sebelum masuknya pupuk kimia buatan pada era 1970-an
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {SOIL_LAYERS.map((layer, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                  <div className={`${layer.color} ${layer.textColor} px-3 py-2 text-xs font-bold flex justify-between items-center`}>
                    <span>{layer.name}</span>
                    <span className="text-[10px] opacity-80">{layer.depth}</span>
                  </div>
                  <div className="p-2.5 text-xs text-slate-600 leading-relaxed">
                    {layer.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <span className="font-bold">Fakta Ilmiah Topsoil (30 cm):</span> Pada kedalaman 30 cm inilah jutaan mikroba pengurai dan unsur hara organik berada, sangat krusial bagi tanaman akar pendek (padi, jagung, kedelai, tembakau, cabai, sayuran).
            </div>
          </div>

          {/* Kerusakan Tanah Akibat Pupuk Kimia Granul */}
          <div className="bg-rose-50/40 rounded-2xl p-4 sm:p-5 border border-rose-200 shadow-xs space-y-3">
            <div>
              <h3 className="font-extrabold text-rose-950 text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Kerusakan Tanah Akibat Pemakaian Pupuk Kimia Granul
              </h3>
              <p className="text-xs text-rose-800">
                Penyuluhan era 70-an semula meningkatkan produksi, namun penggunaan berlebih jangka panjang merusak kesuburan tanah alami.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHEMICAL_FERTILIZER_DAMAGE.map((dmg, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3 border border-rose-200/80 shadow-xs">
                  <h4 className="font-bold text-xs text-slate-800 mb-1">{dmg.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{dmg.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive pH Nutrient Availability Matrix */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  Simulasi Interaktif Serapan Unsur Hara Berdasarkan pH Tanah
                </h3>
                <p className="text-xs text-slate-500">
                  Data resmi efisiensi penyerapan 12 nutrisi esensial tanaman (Slide 9 & 10 PDF)
                </p>
              </div>

              {/* Slider Controller */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-semibold text-slate-600">Geser pH:</span>
                <input
                  type="range"
                  min={5.0}
                  max={8.0}
                  step={0.1}
                  value={interactivePh}
                  onChange={(e) => setInteractivePh(parseFloat(e.target.value))}
                  className="w-28 sm:w-36 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-700 text-white font-mono">
                  {interactivePh.toFixed(1)}
                </span>
              </div>
            </div>

            {/* pH Indicator Alert */}
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              interactivePh < 5.5
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : interactivePh >= 6.5 && interactivePh <= 7.0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  Status Tanah pada pH {interactivePh.toFixed(1)}:{' '}
                  {interactivePh < 5.5 ? 'Sangat Asam (Kritis)' : interactivePh < 6.5 ? 'Asam' : interactivePh <= 7.0 ? 'Kondisi Optimum (Ideal)' : 'Basa'}
                </p>
                <p className="text-[11px] mt-0.5">
                  {interactivePh < 5.5 && 'Nitrogen, Fosfor, Kalium, dan Magnesium TIDAK BISA DISERAP tanaman jika menggunakan pupuk kimia konvensional. Petani hanya buang-buang uang!'}
                  {interactivePh >= 5.5 && interactivePh < 6.5 && 'Unsur hara makro hanya terserap sebagian. Banyak terjadi klorosis dan malai tidak terisi penuh.'}
                  {interactivePh >= 6.5 && interactivePh <= 7.0 && 'Kondisi optimum (Blok Hitam). Namun di Indonesia saat ini, tanah sangat sulit mencapai pH ideal ini akibat residu kimia menahun.'}
                  {interactivePh > 7.0 && 'Seng, Besi, dan Tembaga mengalami hambatan ketersediaan.'}
                </p>
              </div>
            </div>

            {/* Interactive Grid Table of 12 Nutrients */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 rounded-l-lg">Unsur Nutrisi</th>
                    <th className="p-2.5">Peran Utama Tanaman</th>
                    <th className="p-2.5 text-center">Serapan di pH {interactivePh.toFixed(1)}</th>
                    <th className="p-2.5 text-right rounded-r-lg">Solusi Paten Nano</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {NUTRIENT_PH_TABLE.map((row, idx) => {
                    const status = getAbsorptionStatus(row);
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-800">{row.nutrient}</td>
                        <td className="p-2.5 text-slate-600 text-[11px]">{row.role}</td>
                        <td className="p-2.5 text-center">
                          {status === 'none' && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              Merah: Tidak Terserap (Terkunci)
                            </span>
                          )}
                          {status === 'partial' && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              Putih/Biru: Terserap Sedikit
                            </span>
                          )}
                          {status === 'optimal' && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Hitam: Terserap Sempurna
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right text-[11px] font-semibold text-emerald-700">
                          Diserap 100% via Stomata
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend & Why Paten is the Solution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-medium"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Merah = Tidak Terserap</span>
                <span className="flex items-center gap-1 font-medium"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Putih/Biru = Terserap Sedikit</span>
                <span className="flex items-center gap-1 font-medium"><span className="w-3 h-3 rounded-full bg-slate-900 inline-block" /> Hitam = Optimum</span>
              </div>
              <div className="text-right text-[11px] text-emerald-800 font-bold">
                ✓ Paten mengandung Soil Treatment dalam 1 sachet untuk memulihkan pH ke 6.5-7.0
              </div>
            </div>
          </div>

          {/* Terobosan Teknologi Nano Paten */}
          <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-amber-300">
              <Zap className="w-4 h-4 text-amber-400" />
              Mengapa Pupuk Paten Menjadi Terobosan Penyelamat?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PATEN_NANO_BREAKTHROUGH.map((item, idx) => (
                <div key={idx} className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                  <h4 className="font-bold text-xs text-amber-200 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-emerald-100 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: PROFIL KESUBURAN TANAH */}
      {activeSection === 'fertility_profiler' && (
        <SoilFertilityProfileView />
      )}

      {/* SECTION 4: LEGALITIES & SYARIAH ACCREDITATION */}
      {activeSection === 'legalities' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Pilar I Legalitas PT. Renner Inti Internasional
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kantor Pusat: {RENNER_COMPANY_INFO.address}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RENNER_COMPANY_INFO.legalities.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[11px] font-mono text-emerald-700 mt-0.5">{item.regNumber}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Resmi Terverifikasi
                </span>
              </div>
            ))}
          </div>

          {/* 4 Pilar Renner Syariah */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              4 Pilar Utama Renner Syariah
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {RENNER_COMPANY_INFO.fourPillars.map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <h5 className="text-xs font-bold text-emerald-950">{p.title}</h5>
                  <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: PARTNERSHIP TIERS & NATIONAL MARKET POTENTIAL */}
      {activeSection === 'partnership' && (
        <div className="space-y-4">
          {/* Potensi Pasar Nasional 115 Triliun */}
          <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">Riset Potensi Nasional</span>
                <h3 className="text-xl font-black font-['Outfit']">Potensi Pasar 115 Triliun Rupiah</h3>
              </div>
              <TrendingUp className="w-6 h-6 text-amber-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <p className="text-[11px] text-amber-100 font-medium">Lahan Sawit (14,85 Juta Ha):</p>
                <p className="text-base font-extrabold font-['Outfit']">Rp 89,1 Triliun</p>
                <p className="text-[10px] opacity-80">1 Ha = 10 box x 3 kali / tahun</p>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <p className="text-[11px] text-amber-100 font-medium">Lahan Sawah (8 Juta Ha):</p>
                <p className="text-base font-extrabold font-['Outfit']">Rp 19,4 Triliun</p>
                <p className="text-[10px] opacity-80">1 Ha = 6 box per panen (2x panen)</p>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <p className="text-[11px] text-amber-100 font-medium">Lahan Tambak (674 Ribu Ha):</p>
                <p className="text-base font-extrabold font-['Outfit']">Rp 6,5 Triliun</p>
                <p className="text-[10px] opacity-80">4 box/bulan x 12 bulan</p>
              </div>
            </div>
          </div>

          {/* Paket Kemitraan */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Paket Kemitraan Bisnis PLBS Renner Syariah (Slide 34)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {RENNER_COMPANY_INFO.partnershipTiers.map((tier) => (
                <div key={tier.name} className="p-3 rounded-xl border border-slate-200 text-center bg-slate-50/70 hover:border-emerald-500 transition-colors">
                  <span className="text-xs font-black text-slate-800 uppercase block">{tier.name}</span>
                  <p className="text-sm font-extrabold text-emerald-700 font-['Outfit'] mt-1">{formatRupiah(tier.modalRp)}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tier.poin} Poin Hak Usaha</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600">
                    Produk senilai: <strong>{formatRupiah(tier.productValueRp)}</strong>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 text-center pt-1 font-medium">
              *Hak bisnis dapat diwariskan, didukung sekolah bisnis Renner Academy dengan 5 macam bonus & reward berulang.
            </p>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Image Preview */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">Pratinjau Gambar Produk</span>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded-lg bg-slate-100"
              >
                Tutup
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-slate-50">
              <img
                src={previewModalImg}
                alt="Pratinjau"
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
            <p className="text-[11px] font-mono text-slate-500 truncate text-center">
              {previewModalImg}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
