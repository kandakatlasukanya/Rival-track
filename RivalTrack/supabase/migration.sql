-- ============================================================================
-- RivalTrack — Safe Additive Schema Migration
-- Run this ONCE in the Supabase SQL Editor (Project → SQL Editor → New Query).
-- This migration is non-destructive: it only ADDs columns/indexes that do not
-- already exist. It does NOT drop tables, truncate data, or alter existing columns.
-- ============================================================================

-- 1. Add fetch_duration_ms to collection_jobs (safe, idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND   table_name   = 'collection_jobs'
    AND   column_name  = 'fetch_duration_ms'
  ) THEN
    ALTER TABLE public.collection_jobs ADD COLUMN fetch_duration_ms INTEGER;
  END IF;
END $$;

-- 2. Add cors_blocked to collection_jobs (safe, idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND   table_name   = 'collection_jobs'
    AND   column_name  = 'cors_blocked'
  ) THEN
    ALTER TABLE public.collection_jobs ADD COLUMN cors_blocked BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 3. Ensure the per-hour deduplication index exists on price_observations.
--    The index prevents multiple rows for the same product within the same DB clock hour.
--    The client uses obsId = obs-{prodId}-{ISO-hour} as the primary-key dedup guard;
--    this index is the second, authoritative line of defence.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'price_observations'
    AND   indexname = 'uix_obs_product_hour'
  ) THEN
    CREATE UNIQUE INDEX uix_obs_product_hour
      ON public.price_observations (product_id, date_trunc('hour', observed_at::timestamp));
  END IF;
END $$;

-- 4. Index on price_observations(product_id, observed_at DESC) for fast
--    "fetch last observation for product" queries used by change detection.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'price_observations'
    AND   indexname = 'idx_obs_product_observed_at'
  ) THEN
    CREATE INDEX idx_obs_product_observed_at
      ON public.price_observations (product_id, observed_at DESC);
  END IF;
END $$;

-- 5. Index on change_events(competitor_id, detected_at DESC) for dashboard queries.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'change_events'
    AND   indexname = 'idx_change_events_competitor_detected'
  ) THEN
    CREATE INDEX idx_change_events_competitor_detected
      ON public.change_events (competitor_id, detected_at DESC);
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERY — Run after migration to confirm columns and indexes exist
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'collection_jobs'
-- ORDER BY ordinal_position;
--
-- SELECT indexname, indexdef FROM pg_indexes
-- WHERE tablename IN ('price_observations', 'change_events')
-- ORDER BY tablename, indexname;
