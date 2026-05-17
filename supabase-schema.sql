-- Futtasd ezt a Supabase SQL Editorban
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- Kerékpárok tábla
CREATE TABLE bikes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ebike', 'mtb', 'trekking', 'gravel', 'gyerek', 'orszaguti', 'kemping')),
  condition TEXT NOT NULL CHECK (condition IN ('outlet', 'hasznalt')),
  original_price INTEGER NOT NULL,
  sale_price INTEGER NOT NULL,
  description TEXT DEFAULT '',
  specs TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  size TEXT,
  year INTEGER,
  color TEXT
);

-- Mindenki olvashatja a kerékpárokat (publikus oldal)
ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publikus olvasás" ON bikes
  FOR SELECT USING (true);

CREATE POLICY "Admin írás" ON bikes
  FOR ALL USING (true);

-- Storage bucket képekhez
INSERT INTO storage.buckets (id, name, public)
VALUES ('bike-images', 'bike-images', true);

CREATE POLICY "Publikus képolvasás" ON storage.objects
  FOR SELECT USING (bucket_id = 'bike-images');

CREATE POLICY "Admin képfeltöltés" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'bike-images');

CREATE POLICY "Admin képtörlés" ON storage.objects
  FOR DELETE USING (bucket_id = 'bike-images');
