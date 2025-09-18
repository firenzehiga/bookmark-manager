# 🚀 Setup Google Sign-In untuk Bookmark Manager

Dokumen ini menjelaskan langkah-langkah lengkap untuk mengatur Google Sign-In pada aplikasi Bookmark Manager menggunakan Supabase dan Google Cloud Console.

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:
- Akun Google Cloud Console
- Proyek Supabase yang sudah berjalan
- Aplikasi Bookmark Manager yang sudah dikonfigurasi

## ⚙️ Langkah 1: Konfigurasi Google Cloud Console

### 1.1 Membuat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik "Select a project" → "New Project"
3. Beri nama project (misal: "Bookmark Manager")
4. Klik "Create"

### 1.2 Mengaktifkan Google+ API

1. Di sidebar, pilih "APIs & Services" → "Library"
2. Cari "Google+ API"
3. Klik dan pilih "Enable"

### 1.3 Membuat OAuth 2.0 Client ID

1. Di sidebar, pilih "APIs & Services" → "Credentials"
2. Klik "Create Credentials" → "OAuth client ID"
3. Pilih "Web application" sebagai Application type
4. Beri nama (misal: "Bookmark Manager Client")

### 1.4 Konfigurasi Authorized Redirect URIs

Di bagian "Authorized redirect URIs", tambahkan:
```
https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
```

Ganti `[YOUR_PROJECT_REF]` dengan reference project Supabase Anda.

Contoh:
```
https://gaomatkwvjgggkyzyqfm.supabase.co/auth/v1/callback
```

### 1.5 Konfigurasi Authorized JavaScript Origins

Di bagian "Authorized JavaScript origins", tambahkan:
- Untuk development: `http://localhost:3000`
- Untuk production: `https://bookmark-manager-neon.vercel.app`

### 1.6 Menyimpan Client ID dan Secret

1. Setelah membuat OAuth client, catat:
   - **Client ID**
   - **Client Secret**
2. Simpan informasi ini untuk langkah selanjutnya

## ☁️ Langkah 2: Konfigurasi Google OAuth di Supabase

### 2.1 Mengaktifkan Google OAuth Provider

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Bookmark Manager Anda
3. Di sidebar kiri, klik "Authentication" → "Providers"
4. Temukan "Google" dalam daftar providers
5. Aktifkan toggle untuk Google

### 2.2 Memasukkan Credentials

1. Masukkan Client ID dari Google Cloud Console
2. Masukkan Client Secret dari Google Cloud Console
3. Klik "Save"

### 2.3 Konfigurasi Site URL dan Redirect URLs

1. Masuk ke "Authentication" → "Settings"
2. Di bagian "Site URL", atur ke:
   - Untuk development: `http://localhost:3000`
   - Untuk production: `https://bookmark-manager-neon.vercel.app`
3. Di bagian "Additional Redirect URLs", tambahkan:
   ```
   http://localhost:3000/**
   https://bookmark-manager-neon.vercel.app/**
   ```

## 💻 Langkah 3: Implementasi di Aplikasi

### 3.1 Memperbarui AuthContext

Fungsi `signInWithGoogle` harus sudah ditambahkan ke `AuthContext.tsx`:

```typescript
const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};
```

### 3.2 Menambahkan Tombol Google Sign-In

Di komponen `AuthModal.tsx`, tambahkan tombol Google Sign-In:

```tsx
<button
  type="button"
  onClick={async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast.error(`❌ Gagal masuk dengan Google: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
  className="w-full bg-white text-gray-900 py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
  <ChromeIcon className="w-5 h-5" />
  Masuk dengan Google
</button>
```

### 3.3 Memastikan Route Callback Tersedia

Pastikan route `/auth/callback` tersedia dengan komponen berikut:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Tunggu sejenak untuk memastikan session diproses oleh Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/?error=auth_failed');
          return;
        }

        if (session) {
          router.push('/bookmarks');
        } else {
          console.log('No session found');
          router.push('/?error=no_session');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/?error=auth_failed');
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Memproses Autentikasi
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-indigo-200 mb-6"
        >
          Mohon tunggu sebentar, kami sedang memverifikasi akun Anda...
        </motion.p>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-2 bg-indigo-600 rounded-full overflow-hidden"
        >
          <div className="h-full bg-white rounded-full"></div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-indigo-300"
        >
          Mengarahkan Anda ke dashboard...
        </motion.div>
      </motion.div>
    </div>
  );
}
```

## 🔄 Langkah 4: Memindahkan Data Bookmark ke Akun Google

Jika Anda sudah memiliki bookmark di akun email biasa dan ingin memindahkannya ke akun Google:

### 4.1 Mendapatkan User IDs

1. Login dengan akun email biasa
2. Buka developer tools browser (F12)
3. Periksa console untuk melihat user ID, atau jalankan query di SQL Editor:

```sql
-- Mendapatkan User ID akun email
SELECT id, email 
FROM auth.users 
WHERE email = 'email_anda@example.com';

-- Mendapatkan User ID akun Google
SELECT id, email 
FROM auth.users 
WHERE email = 'email_anda@gmail.com';
```

### 4.2 Memindahkan Bookmark

Jalankan query berikut di SQL Editor Supabase:

```sql
-- Memindahkan bookmark dari akun email lama ke akun Google
UPDATE bookmarks 
SET user_id = 'GOOGLE_USER_ID'  -- Ganti dengan User ID akun Google
WHERE user_id = 'EMAIL_USER_ID'; -- Ganti dengan User ID akun email lama
```

### 4.3 Memverifikasi Pemindahan

```sql
-- Memeriksa jumlah bookmark untuk akun Google
SELECT COUNT(*) as bookmark_count 
FROM bookmarks 
WHERE user_id = 'GOOGLE_USER_ID';

-- Memeriksa jumlah bookmark untuk akun email lama
SELECT COUNT(*) as bookmark_count 
FROM bookmarks 
WHERE user_id = 'EMAIL_USER_ID';
```

## 🧪 Langkah 5: Pengujian

1. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

2. Buka browser dan akses `http://localhost:3000`

3. Klik tombol "Mulai Sekarang" untuk membuka modal autentikasi

4. Klik tombol "Masuk dengan Google"

5. Pilih akun Google Anda

6. Verifikasi bahwa Anda berhasil login dan dapat mengakses bookmark Anda

## 🛠️ Troubleshooting

### Masalah Umum dan Solusi

#### 1. Error "redirect_uri_mismatch"

**Penyebab**: Redirect URI yang digunakan tidak terdaftar di Google Cloud Console

**Solusi**:
1. Pastikan Anda telah menambahkan redirect URI berikut di Google Cloud Console:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   ```
2. Klik "Save" setelah menambahkan

#### 2. Tidak Dapat Login dengan Google

**Penyebab**: Konfigurasi Site URL di Supabase tidak benar

**Solusi**:
1. Masuk ke "Authentication" → "Settings" di Supabase Dashboard
2. Periksa "Site URL" dan pastikan sesuai dengan environment:
   - Untuk development: `http://localhost:3000`
   - Untuk production: `https://bookmark-manager-neon.vercel.app`

#### 3. Pengguna Tidak Diarahkan ke Halaman yang Benar Setelah Login

**Penyebab**: Konfigurasi `redirectTo` di fungsi `signInWithOAuth` tidak benar

**Solusi**:
1. Pastikan `redirectTo` di fungsi `signInWithGoogle` mengarah ke `/auth/callback`

#### 4. Bookmark Tidak Muncul Setelah Login dengan Google

**Penyebab**: Bookmark belum dipindahkan ke akun Google

**Solusi**:
1. Jalankan query SQL untuk memindahkan bookmark dari akun email lama ke akun Google
2. Verifikasi pemindahan dengan query COUNT

## 🔐 Keamanan

### Best Practices

1. **Jangan menyimpan Client Secret di kode sumber**:
   - Simpan di environment variables
   - Jangan commit ke repository

2. **Gunakan HTTPS di production**:
   - Semua redirect URLs harus menggunakan HTTPS
   - Pastikan domain production menggunakan SSL certificate

3. **Batasi Redirect URLs**:
   - Hanya tambahkan URL yang diperlukan
   - Jangan gunakan wildcard (*) kecuali benar-benar diperlukan

4. **Gunakan Row Level Security (RLS)**:
   - Pastikan tabel bookmarks memiliki RLS yang benar
   - Setiap user hanya bisa mengakses bookmark miliknya sendiri

## 📝 Catatan Penting

### 1. Konfigurasi Environment

Pastikan file `.env.local` berisi:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Perbedaan Development dan Production

- **Development**: Gunakan `http://localhost:3000` untuk semua konfigurasi
- **Production**: Gunakan domain production Anda (misal: `https://bookmark-manager-neon.vercel.app`)

### 3. Limitasi Google OAuth

- Google OAuth memiliki quota penggunaan gratis yang cukup untuk aplikasi kecil
- Untuk aplikasi besar, mungkin perlu mempertimbangkan biaya Google Cloud

### 4. Backup Data

Sebelum melakukan migrasi data:
1. Backup database Supabase
2. Catat User IDs sebelum dan sesudah migrasi
3. Verifikasi hasil migrasi dengan query COUNT

## 🆘 Dukungan

Jika Anda mengalami masalah yang tidak tercakup dalam dokumen ini:

1. Periksa console browser untuk error messages
2. Periksa logs di Supabase Dashboard
3. Pastikan semua konfigurasi sesuai dengan petunjuk di atas
4. Jika masih bermasalah, buat issue di repository project Anda

---

📝 Dokumen ini terakhir diperbarui: September 2025