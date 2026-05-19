CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

INSERT INTO categories (name, slug, visible, display_order) VALUES
('Ebike', 'ebike', true, 1),
('MTB', 'mtb', true, 2),
('Trekking', 'trekking', true, 3),
('Gravel', 'gravel', true, 4),
('Gyerek', 'gyerek', true, 5),
('Országúti', 'orszaguti', true, 6),
('Kemping', 'kemping', true, 7),
('Alkatrészek', 'alkatreszek', true, 8),
('Ruházat', 'ruhazat', true, 9)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admin write categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON categories FOR ALL USING (true);
