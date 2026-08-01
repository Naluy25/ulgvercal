/*
# Role-based dashboard schema additions
- creator_profiles: points, broadcast history, live link submission
- admin_notes: notes and penalty records for admins
- gang_points: points per gang
- activity_log: unified activity log for all dashboard actions
*/

-- ── Creator Profiles ──
CREATE TABLE IF NOT EXISTS creator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text NOT NULL,
  discord_username text NOT NULL,
  discord_avatar text,
  display_name text,
  points integer DEFAULT 0,
  total_streams integer DEFAULT 0,
  total_viewers integer DEFAULT 0,
  live_url text,
  is_live boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_creator_profiles" ON creator_profiles;
CREATE POLICY "anon_crud_creator_profiles" ON creator_profiles FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Creator Broadcasts ──
CREATE TABLE IF NOT EXISTS creator_broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  platform text,
  viewer_count integer DEFAULT 0,
  duration text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE creator_broadcasts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_creator_broadcasts" ON creator_broadcasts;
CREATE POLICY "anon_crud_creator_broadcasts" ON creator_broadcasts FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Admin Notes ──
CREATE TABLE IF NOT EXISTS admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_discord_id text NOT NULL,
  admin_username text,
  note_type text DEFAULT 'note' CHECK (note_type IN ('note','warning','penalty','praise')),
  content text NOT NULL,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_admin_notes" ON admin_notes;
CREATE POLICY "anon_crud_admin_notes" ON admin_notes FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Gang Points ──
CREATE TABLE IF NOT EXISTS gang_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gang_id uuid REFERENCES gangs(id) ON DELETE CASCADE,
  points integer DEFAULT 0,
  reason text,
  awarded_by text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gang_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_gang_points" ON gang_points;
CREATE POLICY "anon_crud_gang_points" ON gang_points FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Seed creator profiles ──
INSERT INTO creator_profiles (discord_id, discord_username, display_name, points, total_streams, total_viewers)
SELECT * FROM (VALUES
  ('101010101010101010', 'alpha_rp', 'Alpha_RP', 850, 42, 52300),
  ('202020202020202020', 'king_rp', 'King_Roleplay', 720, 35, 38100),
  ('303030303030303030', 'desert_storm', 'Desert_Storm', 450, 28, 21500),
  ('404040404040404040', 'shadow_rp', 'Shadow_RP', 320, 19, 14200),
  ('505050505050505050', 'luna_games', 'Luna_Games', 180, 12, 8700)
) AS t(discord_id, discord_username, display_name, points, total_streams, total_viewers)
WHERE NOT EXISTS (SELECT 1 FROM creator_profiles);

-- ── Seed admin notes ──
INSERT INTO admin_notes (admin_discord_id, admin_username, note_type, content, points)
SELECT * FROM (VALUES
  ('606060606060606060', 'Faisal_MNG', 'warning', 'تأخر في الاستجابة لتذكرة دعم', -10),
  ('707070707070707070', 'Omar_HA', 'praise', 'أداء مميز في إدارة حدث الجمعة', 20),
  ('606060606060606060', 'Faisal_MNG', 'note', 'مراجعة دورة الأنظمة المحدثة', 0),
  ('808080808080808080', 'Rayan_MNG', 'penalty', ' misuse of admin commands', -30)
) AS t(admin_discord_id, admin_username, note_type, content, points)
WHERE NOT EXISTS (SELECT 1 FROM admin_notes);

-- ── Seed gang points ──
INSERT INTO gang_points (gang_id, points, reason, awarded_by)
SELECT g.id, 50, 'نشاط مميز هذا الأسبوع', 'Godfather'
FROM gangs g
WHERE g.name = 'BlackEagle' AND NOT EXISTS (SELECT 1 FROM gang_points);

INSERT INTO gang_points (gang_id, points, reason, awarded_by)
SELECT g.id, 30, 'تحكم في territorio', 'Godfather'
FROM gangs g
WHERE g.name = 'Desert Wolves' AND NOT EXISTS (SELECT 1 FROM gang_points gp WHERE gp.gang_id = g.id);
