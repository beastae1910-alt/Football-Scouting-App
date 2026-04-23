-- ============================================================
-- player_search_views
-- Tracks when a player appears in a scout's search results.
-- Run this in your Supabase SQL editor.
-- ============================================================

-- NOTE: player_id type must match players.id in YOUR schema.
--   If players.id is BIGINT (default serial/identity) → keep as-is.
--   If players.id is UUID → change BIGINT to uuid below.

CREATE TABLE IF NOT EXISTS player_search_views (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id  BIGINT      NOT NULL REFERENCES players(id)  ON DELETE CASCADE,
  scout_id   uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  query      text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE player_search_views ENABLE ROW LEVEL SECURITY;

-- INSERT: authenticated scouts only, must match their own scout_id
CREATE POLICY "scouts_insert_search_views"
  ON player_search_views
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

-- SELECT: players can read appearance counts for their own player profile
CREATE POLICY "players_read_own_search_appearances"
  ON player_search_views
  FOR SELECT
  TO authenticated
  USING (
    player_id IN (
      SELECT id FROM players
      WHERE players.user_id = auth.uid()
    )
  );

-- SELECT: scouts can read their own search history (optional, for future use)
CREATE POLICY "scouts_read_own_search_views"
  ON player_search_views
  FOR SELECT
  TO authenticated
  USING (scout_id = auth.uid());

-- ── Performance index ───────────────────────────────────────
-- Speeds up COUNT(*) WHERE player_id = ? queries
CREATE INDEX IF NOT EXISTS idx_psv_player_id
  ON player_search_views (player_id);
