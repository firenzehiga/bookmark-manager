'use client';

import { motion } from 'framer-motion';
import { Bookmark, BOOKMARK_CATEGORIES } from '@/types/bookmark';
import { ArrowTopRightOnSquareIcon, TrashIcon, ClockIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
  index: number;
}

export function BookmarkCard({ bookmark, onDelete, index }: BookmarkCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleVisit = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = () => {
    // Check if user owns this bookmark
    if (!user || bookmark.user_id !== user.id) {
      toast.error('❌ Anda tidak memiliki akses untuk menghapus bookmark ini');
      return;
    }

    const confirmDelete = window.confirm('Yakin ingin menghapus bookmark ini?');
    if (confirmDelete) {
      onDelete(bookmark.id);
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getCategoryInfo = (tagId: string) => {
    return BOOKMARK_CATEGORIES.find(cat => cat.id === tagId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group glass-dark rounded-2xl p-6 border border-gray-700/50 hover:border-indigo-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <motion.h3 
            className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            {bookmark.title}
          </motion.h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <span className="flex items-center gap-1 flex-shrink-0">
              <ClockIcon className="w-4 h-4" />
              {formatDate(bookmark.created_at)}
            </span>
            <span className="flex-shrink-0">•</span>
            <span className="truncate min-w-0">{getDomainFromUrl(bookmark.url)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-gray-800/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-lg sm:rounded-none p-1 sm:p-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 sm:p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-500 bg-red-500/20' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <HeartIcon className={`w-5 h-5 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPreview(true)}
            className="p-2 sm:p-2 rounded-full text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/20 transition-colors"
            title="Preview"
          >
            <EyeIcon className="w-5 h-5 sm:w-4 sm:h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVisit}
            className="p-2 sm:p-2 rounded-full text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/20 transition-colors"
          >
            <ArrowTopRightOnSquareIcon className="w-5 h-5 sm:w-4 sm:h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-2 sm:p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-400/20 transition-colors"
          >
            <TrashIcon className="w-5 h-5 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </div>

      {/* Description */}
      {bookmark.description && (
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {bookmark.description}
        </p>
      )}

      {/* URL */}
      <motion.a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.01 }}
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-4 transition-colors group/link w-full"
      >
        <span className="truncate flex-1 min-w-0">{bookmark.url}</span>
        <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
      </motion.a>

      {/* Tags */}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {bookmark.tags.slice(0, 3).map((tagId, tagIndex) => {
            const categoryInfo = getCategoryInfo(tagId);
            return categoryInfo ? (
              <motion.span
                key={tagId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (index * 0.1) + (tagIndex * 0.05) }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 rounded-full text-xs border border-indigo-400/30 backdrop-blur-sm flex-shrink-0"
              >
                <span className="text-xs">{categoryInfo.icon}</span>
                <span className="font-medium text-xs truncate max-w-20">{categoryInfo.label}</span>
              </motion.span>
            ) : (
              <span
                key={tagId}
                className="inline-flex items-center px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs border border-gray-600 flex-shrink-0"
              >
                <span className="truncate max-w-16">#{tagId}</span>
              </span>
            );
          })}
          {bookmark.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-700/30 text-gray-500 rounded-full text-xs border border-gray-600 flex-shrink-0">
              +{bookmark.tags.length - 3} lagi
            </span>
          )}
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{bookmark.title}</h3>
                <p className="text-sm text-gray-400 truncate">{bookmark.url}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all flex-shrink-0 ml-4"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2 justify-between">
                <span className="text-sm text-gray-400 truncate flex-1">Preview: {bookmark.url}</span>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 flex-shrink-0"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  Buka di tab baru
                </a>
              </div>
              <iframe
                src={bookmark.url}
                className="w-full h-96 rounded-lg border border-gray-600"
                title={`Preview: ${bookmark.title}`}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
