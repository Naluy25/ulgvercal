/*
# Create whitelist_applications table

1. New Tables
  - `whitelist_applications`
    - `id` (uuid, primary key)
    - `discord_id` (text, not null) - The Discord user ID
    - `discord_username` (text, not null) - Discord username
    - `discord_avatar` (text) - Discord avatar hash
    - `real_name` (text, not null) - Real name of applicant
    - `birth_date` (text, not null) - Birth date
    - `age` (integer, not null) - Calculated age
    - `character_story` (text, not null) - Character backstory
    - `status` (text, default 'pending') - Application status
    - `created_at` (timestamptz) - Submission time

2. Security
  - Enable RLS
  - Allow anon + authenticated to insert and select (no auth system, public submissions)
*/

CREATE TABLE IF NOT EXISTS whitelist_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text NOT NULL,
  discord_username text NOT NULL,
  discord_avatar text,
  real_name text NOT NULL,
  birth_date text NOT NULL,
  age integer NOT NULL,
  character_story text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE whitelist_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_applications" ON whitelist_applications;
CREATE POLICY "anon_select_applications" ON whitelist_applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_applications" ON whitelist_applications;
CREATE POLICY "anon_insert_applications" ON whitelist_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_applications" ON whitelist_applications;
CREATE POLICY "anon_update_applications" ON whitelist_applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
