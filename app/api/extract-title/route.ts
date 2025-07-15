import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Validate URL
    new URL(url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Try to extract title from various sources
    let title = $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text().trim() ||
                $('h1').first().text().trim();

    // Fallback to URL-based title
    if (!title) {
      const urlObj = new URL(url);
      title = urlObj.hostname.replace('www.', '') + urlObj.pathname;
    }

    // Clean up title
    title = title.replace(/\s+/g, ' ').trim();
    if (title.length > 100) {
      title = title.substring(0, 100) + '...';
    }

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Error extracting title:', error);
    
    // Fallback to URL-based title
    try {
      const urlObj = new URL(url);
      const fallbackTitle = urlObj.hostname.replace('www.', '') + urlObj.pathname;
      return NextResponse.json({ title: fallbackTitle });
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
  }
}
