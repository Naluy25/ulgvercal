/*
# Gang management + creator leaderboard schema
- gang_members: individual members within each gang
- gang_leaves: leave/vacation requests
- gang_name_changes: name change requests with approval
- creator_leaderboard: cached leaderboard view
*/

-- ── Gang Members ──
CREATE TABLE IF NOT EXISTS gang_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gang_id uuid REFERENCES gangs(id) ON DELETE CASCADE,
  discord_id text NOT NULL,
  username text NOT NULL,
  role text DEFAULT 'عضو' CHECK (role IN ('عضو','نائب','قائد','منسق')),
  status text DEFAULT 'active' CHECK (status IN ('active','on_leave','removed')),
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gang_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_gang_members" ON gang_members;
CREATE POLICY "anon_crud_gang_members" ON gang_members FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Gang Leaves ──
CREATE TABLE IF NOT EXISTS gang_leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gang_id uuid REFERENCES gangs(id) ON DELETE CASCADE,
  member_discord_id text NOT NULL,
  member_username text NOT NULL,
  leave_type text DEFAULT 'vacation' CHECK (leave_type IN ('vacation','sick','emergency','personal')),
  start_date date NOT NULL,
  end_date date,
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  reviewed_by text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gang_leaves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_gang_leaves" ON gang_leaves;
CREATE POLICY "anon_crud_gang_leaves" ON gang_leaves FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Gang Name Changes ──
CREATE TABLE IF NOT EXISTS gang_name_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gang_id uuid REFERENCES gangs(id) ON DELETE CASCADE,
  old_name text NOT NULL,
  new_name text NOT NULL,
  requested_by text NOT NULL,
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gang_name_changes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_gang_name_changes" ON gang_name_changes;
CREATE POLICY "anon_crud_gang_name_changes" ON gang_name_changes FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Seed gang members ──
INSERT INTO gang_members (gang_id, discord_id, username, role)
SELECT g.id, '111111111111111111', 'Khalid_Almighty', 'قائد'
FROM gangs g WHERE g.name = 'BlackEagle'
AND NOT EXISTS (SELECT 1 FROM gang_members WHERE gang_id = g.id);

INSERT INTO gang_members (gang_id, discord_id, username, role)
SELECT g.id, '222222222222222222', 'Heist_Master', 'قائد'
FROM gangs g WHERE g.name = 'Desert Wolves'
AND NOT EXISTS (SELECT 1 FROM gang_members WHERE gang_id = g.id);

INSERT INTO gang_members (gang_id, discord_id, username, role)
SELECT g.id, '333333333333333333', 'DarkRob', 'قائد'
FROM gangs g WHERE g.name = 'Shadow Crew'
AND NOT EXISTS (SELECT 1 FROM gang_members WHERE gang_id = g.id);

-- Add some regular members
INSERT INTO gang_members (gang_id, discord_id, username, role)
SELECT g.id, v.discord_id, v.username, v.role
FROM gangs g, (VALUES
  ('444444444444444444', 'ShadowFox', 'نائب'),
  ('555555555555555555', 'NightOwl', 'عضو'),
  ('666666666666666666', 'BlazeKing', 'عضو'),
  ('777777777777777777', 'ViperX', 'منسق')
) AS v(discord_id, username, role)
WHERE g.name = 'BlackEagle'
AND NOT EXISTS (SELECT 1 FROM gang_members WHERE gang_id = g.id AND discord_id = v.discord_id);

INSERT INTO gang_members (gang_id, discord_id, username, role)
SELECT g.id, v.discord_id, v.username, v.role
FROM gangs g, (VALUES
  ('888888888888888888', 'StormRider', 'نائب'),
  ('999999999999999999', 'WolfHunter', 'عضو'),
  ('101010101010101010', 'DesertFox', 'عضو')
) AS v(discord_id, username, role)
WHERE g.name = 'Desert Wolves'
AND NOT EXISTS (SELECT 1 FROM gang_members WHERE gang_id = g.id AND discord_id = v.discord_id);

-- ── Seed some leave requests ──
INSERT INTO gang_leaves (gang_id, member_discord_id, member_username, leave_type, start_date, end_date, reason, status)
SELECT g.id, '555555555555555555', 'NightOwl', 'vacation', '2025-07-20'::date, '2025-07-27'::date, 'إجازة عائلية', 'pending'
FROM gangs g WHERE g.name = 'BlackEagle'
AND NOT EXISTS (SELECT 1 FROM gang_leaves WHERE member_discord_id = '555555555555555555');

INSERT INTO gang_leaves (gang_id, member_discord_id, member_username, leave_type, start_date, end_date, reason, status)
SELECT g.id, '666666666666666666', 'BlazeKing', 'sick', '2025-07-15'::date, '2025-07-18'::date, 'وعكة صحية', 'approved'
FROM gangs g WHERE g.name = 'BlackEagle'
AND NOT EXISTS (SELECT 1 FROM gang_leaves WHERE member_discord_id = '666666666666666666');
