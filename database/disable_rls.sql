-- ============================================================================
-- VOLKSCHEM OMS — Disable RLS on all tables
-- Run this in Supabase SQL Editor to allow anon key access
-- ============================================================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE cost_sheet_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_rows DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_components DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE label_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE label_batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_material_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs DISABLE ROW LEVEL SECURITY;
