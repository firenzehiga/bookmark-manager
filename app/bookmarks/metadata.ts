import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Bookmark',
  description: 'Lihat dan kelola semua bookmark yang telah Anda simpan. Pencarian cepat dan filter berdasarkan kategori.',
  openGraph: {
    title: 'Daftar Bookmark - Bookmark Manager',
    description: 'Lihat dan kelola semua bookmark yang telah Anda simpan.',
    images: ['/images/bookmarks-og.png'],
  },
  alternates: {
    canonical: 'https://bookmark-manager.vercel.app/bookmarks',
  },
}

// Komponen export default tetap sama seperti yang sudah ada
