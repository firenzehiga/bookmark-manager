'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { BookmarkFormData } from '@/types/bookmark';
import { CategorySelector } from './CategorySelector';
import { PlusIcon, LinkIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';

export function AddBookmarkForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState<BookmarkFormData>({
    title: '',
    url: '',
    description: '',
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      toast.error('Judul dan URL wajib diisi!');
      return;
    }

    setIsLoading(true);

    try {
      // Validasi URL
      let validUrl = formData.url;
      if (!validUrl.startsWith('http')) {
        validUrl = `https://${validUrl}`;
      }

      const { error } = await supabase
        .from('bookmarks')
        .insert([
          {
            title: formData.title,
            url: validUrl,
            description: formData.description || null,
            tags: formData.tags.length > 0 ? formData.tags : null,
          }
        ]);

      if (error) {
        throw error;
      }

      toast.success('🎉 Bookmark berhasil ditambahkan!');
      setFormData({ title: '', url: '', description: '', tags: [] });
      
      // Trigger success callback dan refresh
      setTimeout(() => {
        onSuccess?.();
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error('❌ Gagal menambahkan bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <DocumentTextIcon className="w-4 h-4" />
          Judul Bookmark <span className="text-red-400">*</span>
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Contoh: Tutorial React Terbaru"
        />
      </motion.div>

      {/* URL Input with Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label htmlFor="url" className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <LinkIcon className="w-4 h-4" />
          URL <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="https://example.com"
          />
          {formData.url && isValidUrl(formData.url) && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-xl hover:bg-indigo-600/30 transition-all"
            >
              <EyeIcon className="w-5 h-5" />
            </motion.button>
          )}
        </div>
        
        {/* Preview */}
        {showPreview && formData.url && isValidUrl(formData.url) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden"
          >
            <p className="text-xs text-gray-400 mb-2">Preview:</p>
            <iframe
              src={formData.url.startsWith('http') ? formData.url : `https://${formData.url}`}
              className="w-full h-32 rounded border border-gray-600"
              title="Website Preview"
              onError={() => setShowPreview(false)}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Description Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Deskripsi (Opsional)
        </label>
        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          placeholder="Ceritakan tentang bookmark ini..."
        />
      </motion.div>

      {/* Category Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CategorySelector
          selectedTags={formData.tags}
          onTagToggle={handleTagToggle}
        />
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 btn-hover"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Menyimpan...
          </>
        ) : (
          <>
            <PlusIcon className="w-5 h-5" />
            Tambah Bookmark
          </>
        )}
      </motion.button>
    </form>
  );
}
