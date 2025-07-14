-- SQL untuk membuat tabel bookmarks di Supabase
-- Jalankan query ini di SQL Editor di dashboard Supabase

CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menambahkan Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy untuk development - mengizinkan semua operasi CRUD
-- PERHATIAN: Untuk production, gunakan policy yang lebih ketat
CREATE POLICY "Enable all operations for all users" ON bookmarks
  FOR ALL USING (true) WITH CHECK (true);

-- Index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON bookmarks USING GIN(tags);
