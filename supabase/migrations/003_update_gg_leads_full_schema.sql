-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/egplpluvbfsjrqzecnjf/sql/new
--
-- If gg_leads already exists from 001, this adds all missing columns.
-- If it doesn't exist yet, the CREATE TABLE below creates it fresh.

-- Option A: Fresh create (if tables don't exist yet) --
CREATE TABLE IF NOT EXISTS gg_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  designer TEXT,
  year_opened INTEGER,
  par INTEGER,
  yardage INTEGER,
  slope_rating NUMERIC,
  course_rating NUMERIC,
  holes INTEGER DEFAULT 18,
  address TEXT,
  city TEXT DEFAULT 'Graeagle',
  state TEXT DEFAULT 'CA',
  website_url TEXT,
  description TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  hero_image TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full gg_leads table matching the quote form schema
CREATE TABLE IF NOT EXISTS gg_leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name            TEXT,
  last_name             TEXT,
  email                 TEXT,
  phone                 TEXT,
  street_address        TEXT,
  city                  TEXT,
  postal_code           TEXT,
  country               TEXT DEFAULT 'United States',
  how_heard             TEXT,
  desired_region        TEXT DEFAULT 'graeagle',
  party_size            INTEGER,
  arrival_date          TEXT,
  departure_date        TEXT,
  num_nights            INTEGER,
  dates_flexible        TEXT DEFAULT 'no',
  lodging_type          TEXT,
  room_config           TEXT,
  total_rounds          INTEGER,
  ideal_tee_times       TEXT,
  play_on_arrival       TEXT DEFAULT 'no',
  play_on_departure     TEXT DEFAULT 'no',
  courses_interested    JSONB DEFAULT '[]'::jsonb,
  transportation_needed TEXT DEFAULT 'no',
  special_fb_event      TEXT DEFAULT 'no',
  fb_event_when         TEXT,
  special_requests      TEXT,
  status                TEXT DEFAULT 'new',
  source                TEXT DEFAULT 'golfgraeagle.com',
  submitted_at          TIMESTAMPTZ DEFAULT NOW(),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gg_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  category TEXT,
  tags TEXT[],
  featured_image TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Option B: If gg_leads already exists, add any missing columns --
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS street_address        TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS postal_code           TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS country               TEXT DEFAULT 'United States';
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS how_heard             TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS desired_region        TEXT DEFAULT 'graeagle';
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS arrival_date          TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS departure_date        TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS num_nights            INTEGER;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS dates_flexible        TEXT DEFAULT 'no';
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS lodging_type          TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS room_config           TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS total_rounds          INTEGER;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS ideal_tee_times       TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS play_on_arrival       TEXT DEFAULT 'no';
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS play_on_departure     TEXT DEFAULT 'no';
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS transportation_needed TEXT DEFAULT 'no';
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS special_fb_event      TEXT DEFAULT 'no';
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS fb_event_when         TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS special_requests      TEXT;
ALTER TABLE gg_leads ADD COLUMN IF NOT EXISTS submitted_at          TIMESTAMPTZ DEFAULT NOW();

-- RLS
ALTER TABLE gg_courses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE gg_leads      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gg_blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts on re-run
DROP POLICY IF EXISTS "Public read gg_courses"        ON gg_courses;
DROP POLICY IF EXISTS "Service full access gg_courses" ON gg_courses;
DROP POLICY IF EXISTS "Service full access gg_leads"   ON gg_leads;
DROP POLICY IF EXISTS "Service full access gg_blog_posts" ON gg_blog_posts;
DROP POLICY IF EXISTS "Public read gg_blog_posts"     ON gg_blog_posts;
DROP POLICY IF EXISTS "Insert gg_leads"               ON gg_leads;

-- Policies
CREATE POLICY "Public read gg_courses"
  ON gg_courses FOR SELECT USING (true);

CREATE POLICY "Service full access gg_courses"
  ON gg_courses USING (auth.role() = 'service_role');

-- Allow anyone to insert a lead (quote form submission)
CREATE POLICY "Public insert gg_leads"
  ON gg_leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Service full access gg_leads"
  ON gg_leads USING (auth.role() = 'service_role');

CREATE POLICY "Public read gg_blog_posts"
  ON gg_blog_posts FOR SELECT USING (status = 'published');

CREATE POLICY "Service full access gg_blog_posts"
  ON gg_blog_posts USING (auth.role() = 'service_role');

