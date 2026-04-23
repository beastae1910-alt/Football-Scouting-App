-- ============================================================
-- scout_interests
-- Stores scout shortlists for player profiles.
-- Run this in your Supabase SQL editor.
-- ============================================================

-- NOTE: player_id type must match players.id in YOUR schema.
--   If players.id is BIGINT (default serial/identity) -> keep as-is.
--   If players.id is UUID -> change BIGINT to uuid below.

CREATE TABLE IF NOT EXISTS scout_interests (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id   uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  player_id  BIGINT      NOT NULL REFERENCES players(id)  ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scout_interests_unique_scout_player UNIQUE (scout_id, player_id)
);

ALTER TABLE scout_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scouts_insert_own_interests"
  ON scout_interests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = scout_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'scout'
    )
  );

CREATE POLICY "scouts_read_own_interests"
  ON scout_interests
  FOR SELECT
  TO authenticated
  USING (scout_id = auth.uid());

CREATE POLICY "players_read_own_interest_counts"
  ON scout_interests
  FOR SELECT
  TO authenticated
  USING (
    player_id IN (
      SELECT id FROM players
      WHERE players.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_scout_interests_player_id
  ON scout_interests (player_id);

