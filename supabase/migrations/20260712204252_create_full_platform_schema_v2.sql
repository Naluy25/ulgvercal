/*
# Full platform schema v2 — with proper date casts

1. New Tables: applications, sectors, sector_reports, projects, gangs, gang_messages, admin_logs, role_changes
2. RLS enabled, anon+authenticated full CRUD (single-tenant dashboard)
3. Seed data for sectors, projects, gangs
*/

-- ── Applications ──
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('whitelist','police','ambulance','creator')),
  discord_id text NOT NULL,
  discord_username text NOT NULL,
  discord_avatar text,
  real_name text NOT NULL,
  birth_date text NOT NULL,
  age integer NOT NULL,
  character_name text,
  character_story text,
  experience text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewing','accepted','rejected')),
  reviewer_id text,
  review_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_applications" ON applications;
CREATE POLICY "anon_crud_applications" ON applications FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Sectors ──
CREATE TABLE IF NOT EXISTS sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('police','ambulance','government','gang_admin')),
  description text,
  icon text,
  color text DEFAULT '#E07B20',
  discord_role_id text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_sectors" ON sectors;
CREATE POLICY "anon_crud_sectors" ON sectors FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Sector Reports ──
CREATE TABLE IF NOT EXISTS sector_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id uuid REFERENCES sectors(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  author_name text NOT NULL,
  author_discord_id text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','investigating','resolved','closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE sector_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_sector_reports" ON sector_reports;
CREATE POLICY "anon_crud_sector_reports" ON sector_reports FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Projects ──
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','active','paused','completed','cancelled')),
  progress integer DEFAULT 0,
  lead text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_projects" ON projects;
CREATE POLICY "anon_crud_projects" ON projects FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Gangs ──
CREATE TABLE IF NOT EXISTS gangs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  leader text NOT NULL,
  leader_discord_id text,
  member_count integer DEFAULT 1,
  territory text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','dissolved','warned','banned')),
  color text DEFAULT '#EF4444',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gangs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_gangs" ON gangs;
CREATE POLICY "anon_crud_gangs" ON gangs FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Gang Messages ──
CREATE TABLE IF NOT EXISTS gang_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gang_id uuid REFERENCES gangs(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_role text DEFAULT 'leader' CHECK (sender_role IN ('leader','admin')),
  recipient text,
  subject text,
  body text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gang_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_gang_messages" ON gang_messages;
CREATE POLICY "anon_crud_gang_messages" ON gang_messages FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Admin Logs ──
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_name text NOT NULL,
  action text NOT NULL,
  target text,
  details text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_admin_logs" ON admin_logs;
CREATE POLICY "anon_crud_admin_logs" ON admin_logs FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Role Changes ──
CREATE TABLE IF NOT EXISTS role_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text NOT NULL,
  discord_username text,
  role_id text NOT NULL,
  role_name text,
  action text NOT NULL CHECK (action IN ('grant','revoke')),
  reason text NOT NULL,
  admin_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE role_changes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_role_changes" ON role_changes;
CREATE POLICY "anon_crud_role_changes" ON role_changes FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Seed sectors ──
INSERT INTO sectors (name, type, description, icon, color, discord_role_id)
SELECT * FROM (VALUES
  ('شرطة ULG', 'police', 'قطاع الشرطة والأمن', 'shield', '#3B82F6', '1200000000000000001'),
  ('الإسعاف', 'ambulance', 'قطاع الطوارئ الطبية', 'heart', '#EF4444', '1200000000000000002'),
  ('الإدارة العامة', 'government', 'الإدارة المركزية للمدينة', 'crown', '#E07B20', '1200000000000000003'),
  ('منسوبي العصابات', 'gang_admin', 'إدارة شؤون العصابات', 'users', '#9333EA', '1200000000000000004')
) AS t(name, type, description, icon, color, discord_role_id)
WHERE NOT EXISTS (SELECT 1 FROM sectors);

-- ── Seed projects ──
INSERT INTO projects (title, description, status, progress, lead, start_date)
SELECT * FROM (VALUES
  ('نظام الهوية الرقمي', 'تطوير نظام هوية رقمية لكل لاعب', 'active', 65, 'Dev_Alpha', '2025-06-01'::date),
  ('تحديث خريطة المدينة', 'إضافة مناطق جديدة وتحسين الإضاءة', 'planning', 15, 'Dev_Script', '2025-07-15'::date),
  ('نظام البنوك', 'بنوك تفاعلية بنظام سحب وإيداع', 'active', 40, 'Dev_Alpha', '2025-06-20'::date)
) AS t(title, description, status, progress, lead, start_date)
WHERE NOT EXISTS (SELECT 1 FROM projects);

-- ── Seed gangs ──
INSERT INTO gangs (name, leader, member_count, territory, status, color)
SELECT * FROM (VALUES
  ('BlackEagle', 'Khalid_Almighty', 12, 'الوسط', 'active', '#EF4444'),
  ('Desert Wolves', 'Heist_Master', 9, 'الصحراء', 'active', '#F97316'),
  ('Shadow Crew', 'DarkRob', 7, 'الميناء', 'warned', '#9333EA')
) AS t(name, leader, member_count, territory, status, color)
WHERE NOT EXISTS (SELECT 1 FROM gangs);
