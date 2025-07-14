'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { Bookmark, BOOKMARK_CATEGORIES } from '@/types/bookmark';
import { BookmarkCard } from './BookmarkCard';
import { MagnifyingGlassIcon, FunnelIcon, BookmarkIcon } from '@heroicons/react/24/outline';

export function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBookmarks(data || []);
      setFilteredBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Gagal memuat bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    let filtered = bookmarks;

    // Filter berdasarkan search query
    if (searchQuery) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter berdasarkan kategori
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(bookmark =>
        bookmark.tags?.includes(selectedCategory)
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, selectedCategory]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
      toast.success('🗑️ Bookmark berhasil dihapus');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast.error('❌ Gagal menghapus bookmark');
    }
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    bookmarks.forEach(bookmark => {
      bookmark.tags?.forEach(tag => categories.add(tag));
    });
    return Array.from(categories);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Memuat bookmark...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-dark rounded-2xl p-6 border border-gray-700/50"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex-1 relative"
          >
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari bookmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative"
          >
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-48"
            >
              <option value="all">Semua Kategori</option>
              {getUniqueCategories().map(categoryId => {
                const category = BOOKMARK_CATEGORIES.find(c => c.id === categoryId);
                return (
                  <option key={categoryId} value={categoryId}>
                    {category ? `${category.icon} ${category.label}` : categoryId}
                  </option>
                );
              })}
            </select>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400"
        >
          <span className="flex items-center gap-1">
            <BookmarkIcon className="w-4 h-4" />
            {filteredBookmarks.length} dari {bookmarks.length} bookmark
          </span>
          {searchQuery && (
            <span className="truncate">• Hasil pencarian: &ldquo;{searchQuery}&rdquo;</span>
          )}
          {selectedCategory !== 'all' && (
            <span className="truncate">• Kategori: {BOOKMARK_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}</span>
          )}
        </motion.div>
      </motion.div>

      {/* Bookmarks Grid */}
      <AnimatePresence mode="wait">
        {filteredBookmarks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-6 opacity-20"
            >
              📚
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-300 mb-2"
            >
              {searchQuery || selectedCategory !== 'all' 
                ? 'Tidak ada bookmark yang ditemukan' 
                : 'Belum ada bookmark'
              }
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500"
            >
              {searchQuery || selectedCategory !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Klik tombol "Tambah Bookmark Baru" untuk memulai'
              }
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            key="bookmarks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          >
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <BookmarkCard
                  bookmark={bookmark}
                  onDelete={handleDelete}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
