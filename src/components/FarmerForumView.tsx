import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Share2,
  PlusCircle,
  Filter,
  Search,
  CheckCircle2,
  Send,
  Sparkles,
  MapPin,
  Tag,
  Award,
  Image as ImageIcon,
  Camera,
  X,
  User,
  Heart
} from 'lucide-react';
import { ForumPost, ForumComment } from '../types';
import { getForumPosts, addForumPost, likeForumPost, addForumComment, addNotification } from '../utils/offlineStorage';

export const FarmerForumView: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(() => getForumPosts());
  const [activeCategory, setActiveCategory] = useState<string>('Semua Topik');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for New Post
  const [formAuthor, setFormAuthor] = useState<string>('Petani Mitra Renner');
  const [formLocation, setFormLocation] = useState<string>('Lombok, NTB');
  const [formRole, setFormRole] = useState<'Petani Mitra' | 'Agronomis Renner' | 'Ketua Gapoktan' | 'Peternak'>('Petani Mitra');
  const [formCategory, setFormCategory] = useState<'Tips & Teknik' | 'Testimoni & Panen' | 'Tanya Hama & Solusi' | 'Peternakan'>('Testimoni & Panen');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formCommodity, setFormCommodity] = useState<string>('Tembakau');
  const [formSelectedProducts, setFormSelectedProducts] = useState<string[]>(['Paten Gold']);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

  const categories = [
    'Semua Topik',
    'Tips & Teknik',
    'Testimoni & Panen',
    'Tanya Hama & Solusi',
    'Peternakan'
  ];

  const availableProducts = [
    'Paten Gold',
    'Paten Hijau',
    'Paten Imun',
    'Colpro Colostrum',
    'Revit Apel Ginseng'
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchCat = activeCategory === 'Semua Topik' || post.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.commodityTag && post.commodityTag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const handleLike = (postId: string) => {
    const updated = likeForumPost(postId);
    setPosts(updated);
  };

  const handleAddCommentSubmit = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    const updated = addForumComment(postId, {
      authorName: formAuthor || 'Petani Renner',
      authorLocation: formLocation || 'Nusantara',
      content: text
    });

    setPosts(updated);
    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
    triggerToast('Komentar berhasil dikirim!');
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;

    const newPost = addForumPost({
      authorName: formAuthor,
      authorLocation: formLocation,
      authorRole: formRole,
      avatarEmoji: formCategory === 'Peternakan' ? '🐂' : '🌾',
      title: formTitle,
      content: formContent,
      category: formCategory,
      commodityTag: formCommodity,
      productsUsed: formSelectedProducts,
      imageUrl: formImagePreview || undefined,
      isVerified: true
    });

    const updated = getForumPosts();
    setPosts(updated);
    setShowCreateModal(false);

    // Reset Form
    setFormTitle('');
    setFormContent('');
    setFormImagePreview(null);

    addNotification({
      title: '💬 Postingan Forum Berhasil Dimuat',
      message: `Topik "${newPost.title}" telah dipublikasikan ke Komunitas Petani Renner.`,
      type: 'jadwal',
      priority: 'normal'
    });

    triggerToast('Postingan Anda berhasil dipublikasikan!');
  };

  const toggleProductSelection = (prod: string) => {
    if (formSelectedProducts.includes(prod)) {
      setFormSelectedProducts(formSelectedProducts.filter(p => p !== prod));
    } else {
      setFormSelectedProducts([...formSelectedProducts, prod]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormImagePreview(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-emerald-950/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-in fade-in duration-200 border border-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-md mb-2.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Komunitas Petani & Peternak Renner Syariah</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-['Outfit'] tracking-tight">
            Forum Petani Nusantara
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 leading-relaxed">
            Wadah interaksi antar petani di Lombok, Sumbawa, Bima, Sulawesi, Jawa, dan seluruh pelosok Indonesia. Bagikan hasil timbangan panen, tips takaran tangki, dan solusi hama dengan pupuk organik nano <strong>Paten</strong>.
          </p>
        </div>
      </div>

      {/* Action Bar: Search, Category Filters, Create Button */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pengalaman, komoditi, daerah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Pengalaman / Pertanyaan</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada diskusi untuk kategori ini</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Jadilah yang pertama membagikan pengalaman bertani Anda!</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = expandedCommentsPostId === post.id;
            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 transition-all hover:border-emerald-300 dark:hover:border-emerald-800"
              >
                {/* Author Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-lg font-bold shadow-2xs border border-emerald-200 dark:border-emerald-900">
                      {post.avatarEmoji || '👨‍🌾'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                          {post.authorName}
                        </h4>
                        {post.isVerified && (
                          <span title="Terverifikasi Mitra Renner">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          </span>
                        )}
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{post.authorLocation}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 font-['Outfit']">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Attached Photo Preview if any */}
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden max-h-72 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="max-h-72 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Commodity Tag & Products Used */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {post.commodityTag && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.commodityTag}
                    </span>
                  )}
                  {post.productsUsed.map((prod, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                    >
                      ✓ {prod}
                    </span>
                  ))}
                </div>

                {/* Action Footer: Like, Comment, Share */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${
                        post.isLiked
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likesCount} Suka</span>
                    </button>

                    {/* Comment Toggle Button */}
                    <button
                      onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                      className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount} Komentar</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      triggerToast('Tautan postingan disalin ke papan klip!');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Bagikan postingan"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Comments Section */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Diskusi Komentar ({post.comments.length})
                    </h5>

                    {/* Comment List */}
                    <div className="space-y-2">
                      {post.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">
                              {comm.authorName} <span className="text-[10px] font-normal text-slate-500">({comm.authorLocation})</span>
                            </span>
                            <span className="text-[10px] text-slate-400">{comm.createdAt}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {comm.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* New Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tulis balasan atau tanggapan..."
                        value={newCommentText[post.id] || ''}
                        onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddCommentSubmit(post.id);
                        }}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        onClick={() => handleAddCommentSubmit(post.id)}
                        className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center shrink-0 transition-colors"
                        title="Kirim Komentar"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Tulis Postingan Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-['Outfit']">
                  Bagikan Pengalaman / Tanya Solusi
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Postingan Anda akan dilihat oleh seluruh mitra petani se-Indonesia
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Petani / Mitra</label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Daerah / Kabupaten</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lombok Tengah / Bima"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Peran di Komunitas</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Petani Mitra">Petani Mitra</option>
                    <option value="Ketua Gapoktan">Ketua Gapoktan</option>
                    <option value="Peternak">Peternak</option>
                    <option value="Agronomis Renner">Agronomis Renner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Topik</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Testimoni & Panen">🏆 Testimoni & Panen</option>
                    <option value="Tips & Teknik">🌾 Tips & Teknik Aplikasi</option>
                    <option value="Tanya Hama & Solusi">🩺 Tanya Hama & Solusi</option>
                    <option value="Peternakan">🐂 Peternakan Ternak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Postingan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Panen Tembakau Praya Hasil Rajangan Super dengan Paten Gold"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Komoditi</label>
                <input
                  type="text"
                  placeholder="Contoh: Padi / Tembakau / Jagung / Bawang Merah / Sapi"
                  value={formCommodity}
                  onChange={(e) => setFormCommodity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Produk Paten yang Digunakan</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableProducts.map((p) => {
                    const isSelected = formSelectedProducts.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => toggleProductSelection(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Isi Pengalaman & Tips</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ceritakan detail cara aplikasi, takaran sachet per tangki, waktu semprot, kondisi tanah sebelum dan sesudah aplikasi Paten..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lampirkan Foto Hasil / Dokumentasi (Opsional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Pilih Foto dari Galeri / Kamera</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formImagePreview && (
                    <button
                      type="button"
                      onClick={() => setFormImagePreview(null)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
                {formImagePreview && (
                  <div className="mt-2 rounded-xl overflow-hidden max-h-36 w-full border border-slate-200 dark:border-slate-700">
                    <img src={formImagePreview} alt="Preview" className="h-36 w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm transition-colors"
                >
                  Publikasikan Postingan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
