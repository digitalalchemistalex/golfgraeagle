-- GolfGraeagle.com Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/egplpluvbfsjrqzecnjf/sql

-- gg_courses: All 5 Graeagle golf courses
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
  course_type TEXT,
  address TEXT,
  city TEXT DEFAULT 'Graeagle',
  state TEXT DEFAULT 'CA',
  phone TEXT,
  website_url TEXT,
  green_fee_min INTEGER,
  green_fee_max INTEGER,
  season TEXT,
  difficulty TEXT,
  elevation_ft INTEGER,
  distance_from_graeagle TEXT,
  description TEXT,
  signature_hole TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  faq_items JSONB DEFAULT '[]'::jsonb,
  speakable_summary TEXT,
  meta_title TEXT,
  meta_description TEXT,
  hero_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  content_status TEXT DEFAULT 'draft',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- gg_leads: Quote requests from the site
CREATE TABLE IF NOT EXISTS gg_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  group_size INTEGER,
  travel_dates TEXT,
  courses_interested JSONB DEFAULT '[]'::jsonb,
  lodging_interested TEXT,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  source TEXT DEFAULT 'website',
  source_page TEXT,
  hubspot_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- gg_blog_posts: SEO blog content
CREATE TABLE IF NOT EXISTS gg_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  category TEXT,
  tags TEXT[],
  author_name TEXT DEFAULT 'Golf Graeagle',
  featured_image TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  faq_items JSONB DEFAULT '[]'::jsonb,
  speakable_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- gg_build_tracker: Every deploy tracked
CREATE TABLE IF NOT EXISTS gg_build_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  deploy_id TEXT,
  vercel_url TEXT,
  github_sha TEXT,
  github_repo TEXT DEFAULT 'digitalalchemistalex/golfgraeagle',
  pages_built INTEGER DEFAULT 0,
  pages_list JSONB DEFAULT '[]'::jsonb,
  features_added JSONB DEFAULT '[]'::jsonb,
  features_pending JSONB DEFAULT '[]'::jsonb,
  content_status JSONB DEFAULT '{}'::jsonb,
  seo_status JSONB DEFAULT '{}'::jsonb,
  stack JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  deployed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (permissive for now, tighten later)
ALTER TABLE gg_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gg_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE gg_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gg_build_tracker ENABLE ROW LEVEL SECURITY;

-- Public read for courses and blog posts
CREATE POLICY "Public read gg_courses" ON gg_courses FOR SELECT USING (true);
CREATE POLICY "Public read gg_blog_posts" ON gg_blog_posts FOR SELECT USING (is_active = true OR status = 'published');
CREATE POLICY "Service full access gg_courses" ON gg_courses USING (auth.role() = 'service_role');
CREATE POLICY "Service full access gg_leads" ON gg_leads USING (auth.role() = 'service_role');
CREATE POLICY "Service full access gg_blog_posts" ON gg_blog_posts USING (auth.role() = 'service_role');
CREATE POLICY "Service full access gg_build_tracker" ON gg_build_tracker USING (auth.role() = 'service_role');
