'use client';

import { Bookmark } from '@/types/bookmark';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVisit = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title dan URL */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {bookmark.title}
            </h3>
            <button
              onClick={handleVisit}
              className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
              title="Buka link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>

          {/* URL */}
          <div className="mb-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 break-all"
            >
              {bookmark.url}
            </a>
          </div>

          {/* Description */}
          {bookmark.description && (
            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
              {bookmark.description}
            </p>
          )}

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {bookmark.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Tanggal dibuat */}
          <div className="text-xs text-gray-500">
            Ditambahkan: {formatDate(bookmark.created_at)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={() => onDelete(bookmark.id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1"
            title="Hapus bookmark"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
