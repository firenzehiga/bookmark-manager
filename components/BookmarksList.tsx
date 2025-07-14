'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Bookmark } from '@/types/bookmark';
import { BookmarkCard } from './BookmarkCard';

export function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Gagal memuat bookmark. Silakan refresh halaman.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus bookmark ini?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update state untuk menghapus bookmark dari daftar
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Gagal menghapus bookmark. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Memuat bookmarks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchBookmarks}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-5xl mb-4">📚</div>
        <p className="text-lg">Belum ada bookmark tersimpan</p>
        <p className="text-sm">Tambahkan bookmark pertama Anda di form di atas!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Total: {bookmarks.length} bookmark{bookmarks.length > 1 ? 's' : ''}
      </div>
      
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
