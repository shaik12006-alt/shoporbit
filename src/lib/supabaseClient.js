import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * SQL Schema for Supabase Table Setup:
 * 
 * Run this in your Supabase SQL Editor to create tables:
 * 
 * -- 1. Products Table
 * CREATE TABLE IF NOT EXISTS products (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   brand TEXT NOT NULL,
 *   platform TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   mrp NUMERIC NOT NULL,
 *   deal_price NUMERIC NOT NULL,
 *   discount_percentage NUMERIC NOT NULL,
 *   rating NUMERIC DEFAULT 4.5,
 *   review_count NUMERIC DEFAULT 0,
 *   image TEXT NOT NULL,
 *   additional_images TEXT[] DEFAULT '{}',
 *   affiliate_url TEXT NOT NULL,
 *   badge TEXT,
 *   is_demo BOOLEAN DEFAULT false,
 *   demo_label TEXT,
 *   featured BOOLEAN DEFAULT false,
 *   trending BOOLEAN DEFAULT false,
 *   clicks NUMERIC DEFAULT 0,
 *   in_stock BOOLEAN DEFAULT true,
 *   description TEXT,
 *   features TEXT[] DEFAULT '{}',
 *   specifications JSONB DEFAULT '{}',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- 2. Clicks & Analytics Table
 * CREATE TABLE IF NOT EXISTS product_clicks (
 *   id BIGSERIAL PRIMARY KEY,
 *   product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
 *   platform TEXT NOT NULL,
 *   referrer TEXT,
 *   clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- 3. Row Level Security Policies
 * ALTER TABLE products ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE product_clicks ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
 * CREATE POLICY "Public insert product_clicks" ON product_clicks FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Public update clicks" ON products FOR UPDATE USING (true);
 */
