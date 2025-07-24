import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bookmark Manager - Kelola Bookmark Dengan Mudah',
    short_name: 'BookmarkManager',
    description: 'Platform terbaik untuk menyimpan, mengorganisir, dan mengelola bookmark Anda.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    categories: ['productivity', 'utilities', 'business'],
    lang: 'id',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
