'use client';

import { useState, useEffect } from 'react';
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
      <div className="flex flex-col items-center justify-center py-16">
        <div
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4 animate-spin"
        />
        <p className="text-gray-400 text-lg">Memuat bookmark...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="glass-dark rounded-2xl p-4 md:p-6 border border-gray-700/50">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari bookmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-9 md:pl-10 pr-8 py-2.5 md:py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[180px] md:min-w-48 text-sm md:text-base"
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
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <BookmarkIcon className="w-3 h-3 md:w-4 md:h-4" />
            {filteredBookmarks.length} dari {bookmarks.length} bookmark
          </span>
          {searchQuery && (
            <span className="truncate">• Pencarian: &ldquo;{searchQuery}&rdquo;</span>
          )}
          {selectedCategory !== 'all' && (
            <span className="truncate">• {BOOKMARK_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}</span>
          )}
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="space-y-4">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6 opacity-20">📚</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Tidak ada bookmark yang ditemukan' 
                : 'Belum ada bookmark'
              }
            </h3>
            <p className="text-sm md:text-base text-gray-500">
              {searchQuery || selectedCategory !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Klik tombol "Tambah Bookmark Baru" untuk memulai'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="opacity-0 animate-fadeIn"
                style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
              >
                <BookmarkCard
                  bookmark={bookmark}
                  onDelete={handleDelete}
                  index={0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
