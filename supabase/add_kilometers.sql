ALTER TABLE bikes ADD COLUMN IF NOT EXISTS kilometers INTEGER DEFAULT 0;
ALTER TABLE bikes ADD COLUMN IF NOT EXISTS condition_detail TEXT CHECK (condition_detail IN ('uj', 'kivalo', 'jo', 'megfelelo')) DEFAULT 'uj';
