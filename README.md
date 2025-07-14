# Bookmark Manager - Next.js, TypeScript & Supabase

Aplikasi web sederhana untuk menyimpan, mengelola, dan mencari link penting. Cocok untuk menyimpan video TikTok, artikel, meme, atau apapun yang ingin diingat.  
Dibangun dengan Next.js (App Router), TypeScript, dan Tailwind CSS.  
Data bookmark **disimpan di Supabase** agar bisa diakses dari mana saja, bukan hanya di browser.

## Fitur Utama
- Tambah bookmark (judul, URL, deskripsi, tag/kategori)
- Lihat daftar bookmark dari Supabase
- Edit dan hapus bookmark
- Filter berdasarkan kategori/tag (opsional)
- Cari bookmark (opsional)
- Data tetap tersimpan walau browser di-refresh dan bisa diakses dari device mana saja

## Contoh Data Bookmark (Supabase Table)
- id: bigint (auto-increment, primary key)
- title: text
- url: text
- description: text (optional)
- tags: text[] (optional)
- created_at: timestamp (ISO date)

## Teknologi
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (Postgres & API)

## Setup dan Instalasi

### 1. Clone dan Install Dependencies
```bash
git clone <repo-url>
cd bookmark-manager
npm install
```

### 2. Setup Supabase
1. Buat project baru di [Supabase](https://supabase.com)
2. Di SQL Editor, jalankan script dari file `supabase-setup.sql`
3. Dapatkan URL project dan anon key dari Settings > API

### 3. Environment Variables
1. Copy file `.env.example` menjadi `.env.local`
2. Isi dengan nilai dari Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Struktur Project
```
├── app/
│   ├── page.tsx              # Halaman utama
│   ├── bookmarks/
│   │   └── page.tsx          # Halaman daftar bookmarks
│   └── layout.tsx
├── components/
│   ├── AddBookmarkForm.tsx   # Form tambah bookmark
│   ├── BookmarksList.tsx     # Daftar bookmarks
│   └── BookmarkCard.tsx      # Card individual bookmark
├── types/
│   └── bookmark.ts           # TypeScript types
├── lib/
│   └── supabaseClient.ts     # Konfigurasi Supabase
└── supabase-setup.sql        # Script setup database

## Catatan
- Untuk tahap pengembangan, akses data di Supabase diatur agar semua user bisa CRUD (Row Level Security diaktifkan dengan policy permisif).
- Fitur filter dan pencarian bookmark bersifat opsional.
