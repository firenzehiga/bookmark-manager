import { BookmarksList } from '@/components/BookmarksList';
import { AddBookmarkForm } from '@/components/AddBookmarkForm';

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bookmark Manager
          </h1>
          <p className="mt-2 text-gray-600">
            Simpan dan kelola link penting Anda
          </p>
        </div>

        {/* Form untuk menambah bookmark */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tambah Bookmark Baru
          </h2>
          <AddBookmarkForm />
        </div>

        {/* Daftar bookmarks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Daftar Bookmarks
          </h2>
          <BookmarksList />
        </div>
      </div>
    </div>
  );
}
