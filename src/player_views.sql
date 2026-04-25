-- ============================================================
-- player_views
-- Tracks one scout profile view per player per day.
-- Run this in your Supabase SQL editor.
-- ============================================================

-- NOTE: player_id type must match players.id in YOUR schema.
--   If players.id is BIGINT (default serial/identity) -> keep as-is.
--   If players.id is UUID -> change BIGINT to uuid below.

CREATE TABLE IF NOT EXISTS player_views (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id  BIGINT      NOT NULL REFERENCES players(id)  ON DELETE CASCADE,
  scout_id   uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  view_date  date        NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT player_views_unique_scout_player_day UNIQUE (scout_id, player_id, view_date)
);

ALTER TABLE player_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scouts_insert_own_player_views"
  ON player_views
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

CREATE POLICY "players_read_own_profile_views"
  ON player_views
  FOR SELECT
  TO authenticated
  USING (
    player_id IN (
      SELECT id FROM players
      WHERE players.user_id = auth.uid()
    )
  );

CREATE POLICY "scouts_read_own_player_views"
  ON player_views
  FOR SELECT
  TO authenticated
  USING (scout_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_player_views_player_id
  ON player_views (player_id);

CREATE INDEX IF NOT EXISTS idx_player_views_scout_recent
  ON player_views (scout_id, view_date DESC);
