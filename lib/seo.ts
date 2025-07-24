/**
 * SEO Utility Functions
 * Helper functions untuk mengoptimalkan SEO
 */

export function generatePageTitle(title: string): string {
  return `${title} | Bookmark Manager`;
}

export function generateCanonicalUrl(path: string): string {
  const baseUrl = 'https://bookmark-manager.vercel.app';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function generateMetaDescription(description: string): string {
  // Pastikan description tidak lebih dari 160 karakter
  if (description.length > 160) {
    return description.substring(0, 157) + '...';
  }
  return description;
}

export function generateKeywords(baseKeywords: string[], additionalKeywords: string[] = []): string[] {
  const defaultKeywords = [
    'bookmark manager',
    'simpan bookmark',
    'kelola bookmark',
    'bookmark organizer',
    'save links',
    'bookmark tool',
    'web bookmark',
    'bookmark app',
    'link manager',
    'bookmark indonesia'
  ];
  
  return [...defaultKeywords, ...baseKeywords, ...additionalKeywords];
}

export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
}

export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
