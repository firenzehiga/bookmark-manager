// JSON-LD Structured Data
export function generateJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bookmark Manager',
    description: 'Platform terbaik untuk menyimpan, mengorganisir, dan mengelola bookmark Anda. Fitur pencarian cerdas, kategorisasi otomatis, dan sinkronisasi cloud.',
    url: 'https://bookmark-manager.vercel.app',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Person',
      name: 'Firenze Higa'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bookmark Manager'
    },
    dateCreated: '2025-07-10',
    dateModified: new Date().toISOString(),
    inLanguage: 'id-ID',
    keywords: 'bookmark manager, simpan bookmark, kelola bookmark, bookmark organizer, save links',
    screenshot: 'https://bookmark-manager.vercel.app/images/og-image.png',
    featureList: [
      'Simpan bookmark dengan mudah',
      'Kategorisasi otomatis',
      'Interface yang responsif',
      'Responsive dan mobile-friendly',

    ]
  }
}

export function generateOrganizationJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bookmark Manager',
    url: 'https://bookmark-manager.vercel.app',
    logo: 'https://bookmark-manager.vercel.app/icon-512.png',
    sameAs: [
      'https://github.com/firenzehiga/bookmark-manager'
    ],
    foundingDate: '2025-07-10',
    founder: {
      '@type': 'Person',
      name: 'Firenze Higa'
    },
    description: 'Platform terbaik untuk menyimpan, mengorganisir, dan mengelola bookmark Anda.'
  }
}
