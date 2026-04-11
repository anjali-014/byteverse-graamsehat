-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ASHA workers
CREATE TABLE IF NOT EXISTS asha_workers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asha_id       TEXT UNIQUE,
  name          TEXT NOT NULL,
  phone         TEXT UNIQUE NOT NULL,
  village       TEXT NOT NULL,
  block         TEXT NOT NULL DEFAULT 'Bihta',
  district      TEXT NOT NULL DEFAULT 'Patna',
  state         TEXT NOT NULL DEFAULT 'Bihar',
  password_hash TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_asha_workers_asha_id ON asha_workers (asha_id);

-- Upgrade existing ASHA schema
ALTER TABLE asha_workers ADD COLUMN IF NOT EXISTS asha_id TEXT UNIQUE;
ALTER TABLE asha_workers ADD COLUMN IF NOT EXISTS password_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_asha_workers_asha_id ON asha_workers (asha_id);

-- Triage cases — core table
-- FIX: ON DELETE SET NULL so deleting an ASHA doesn't cascade-break case history
CREATE TABLE IF NOT EXISTS triage_cases (
  id                   UUID PRIMARY KEY,
  asha_id              UUID REFERENCES asha_workers(id) ON DELETE SET NULL,
  patient_age_group    TEXT CHECK (patient_age_group IN ('infant','child','adult','elderly')),
  patient_sex          TEXT CHECK (patient_sex IN ('M','F','unknown')),
  is_pregnant          BOOLEAN DEFAULT FALSE,
  symptoms             JSONB NOT NULL DEFAULT '[]',        -- FIX: JSONB, not TEXT
  triage_result        TEXT CHECK (triage_result IN ('RED','YELLOW','GREEN','UNCLEAR')) NOT NULL,
  confidence_score     FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
  contributing_factors JSONB DEFAULT '[]',                 -- FIX: JSONB, not TEXT
  input_method         TEXT CHECK (input_method IN ('voice','tap')) DEFAULT 'tap',
  village_tag          TEXT,
  lat                  FLOAT,
  lng                  FLOAT,
  clock_skew           BOOLEAN DEFAULT FALSE,
  client_timestamp     BIGINT NOT NULL,
  client_version       TEXT,
  synced_at            TIMESTAMPTZ DEFAULT NOW(),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_cases_asha      ON triage_cases(asha_id);
CREATE INDEX IF NOT EXISTS idx_cases_result    ON triage_cases(triage_result);
CREATE INDEX IF NOT EXISTS idx_cases_ts        ON triage_cases(client_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cases_synced    ON triage_cases(synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_village   ON triage_cases(village_tag);  -- FIX: was missing, used in GROUP BY
CREATE INDEX IF NOT EXISTS idx_cases_result_ts ON triage_cases(triage_result, synced_at DESC); -- compound for RED alert query

-- Facilities (PHC/CHC) — mostly static
-- FIX: unique constraint on (name, block) to prevent duplicate seeds
CREATE TABLE IF NOT EXISTS facilities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  type       TEXT CHECK (type IN ('PHC','CHC','DH','UCHC')) DEFAULT 'PHC',
  block      TEXT NOT NULL,
  district   TEXT NOT NULL DEFAULT 'Patna',
  lat        FLOAT NOT NULL,
  lng        FLOAT NOT NULL,
  phone      TEXT,
  is_active  BOOLEAN DEFAULT TRUE,
  UNIQUE (name, block)  -- FIX: prevents duplicate rows on re-seed
);

-- Sync audit log
-- FIX: index on asha_id for per-ASHA sync history queries
CREATE TABLE IF NOT EXISTS sync_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asha_id          UUID REFERENCES asha_workers(id) ON DELETE SET NULL,
  records_sent     INT DEFAULT 0,
  records_accepted INT DEFAULT 0,
  records_rejected INT DEFAULT 0,
  client_version   TEXT,
  synced_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_asha ON sync_logs(asha_id);  -- FIX: was missing