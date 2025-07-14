import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bookmark Manager
          </h1>
          <p className="text-gray-600">
            Simpan dan kelola link penting Anda dengan mudah
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/bookmarks"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Kelola Bookmarks
          </Link>
          
          <div className="text-sm text-gray-500">
            Fitur yang tersedia:
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ Tambah bookmark baru</li>
            <li>✅ Lihat daftar bookmark</li>
            <li>✅ Hapus bookmark</li>
            <li>✅ Tersimpan di Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
