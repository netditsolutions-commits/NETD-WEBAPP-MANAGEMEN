-- ============================================================================
-- NETD IT MANAGEMENT SYSTEM - D1 MIGRATION SCRIPT (VERSION 5)
-- Run these blocks in Cloudflare Dashboard -> Storage & Databases -> D1 -> netd_it_management -> Console
-- ============================================================================

-- ----------------------------------------------------------------------------
-- BLOCK 1: Settings table (bank accounts & cloud config)
-- ----------------------------------------------------------------------------
ALTER TABLE settings ADD COLUMN bank_name TEXT DEFAULT 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)';
ALTER TABLE settings ADD COLUMN bank_account_no TEXT DEFAULT '010-12-00-01234567-001';
ALTER TABLE settings ADD COLUMN bank_account_name TEXT DEFAULT 'NETD IT SOLUTIONS & SERVICES';
ALTER TABLE settings ADD COLUMN bank_qr_url TEXT;
ALTER TABLE settings ADD COLUMN d1_worker_url TEXT;
ALTER TABLE settings ADD COLUMN supabase_url TEXT;
ALTER TABLE settings ADD COLUMN supabase_anon_key TEXT;
ALTER TABLE settings ADD COLUMN theme TEXT DEFAULT 'dark';

-- ----------------------------------------------------------------------------
-- BLOCK 2: Products table
-- ----------------------------------------------------------------------------
ALTER TABLE products ADD COLUMN profit_margin REAL DEFAULT 0;
ALTER TABLE products ADD COLUMN selling_price REAL DEFAULT 0;
ALTER TABLE products ADD COLUMN stock_qty INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN min_stock_alert INTEGER DEFAULT 3;
ALTER TABLE products ADD COLUMN has_sn INTEGER DEFAULT 1;

-- ----------------------------------------------------------------------------
-- BLOCK 3: Documents & Purchase Orders
-- ----------------------------------------------------------------------------
ALTER TABLE documents ADD COLUMN items_json TEXT;
ALTER TABLE documents ADD COLUMN terms_conditions TEXT;
ALTER TABLE documents ADD COLUMN ref_quotation_no TEXT;
ALTER TABLE documents ADD COLUMN grand_total REAL DEFAULT 0;
ALTER TABLE documents ADD COLUMN discount_amount REAL DEFAULT 0;
ALTER TABLE purchase_orders ADD COLUMN items_json TEXT;

-- ----------------------------------------------------------------------------
-- BLOCK 4: Brands & Projects
-- ----------------------------------------------------------------------------
ALTER TABLE brands ADD COLUMN category TEXT;
ALTER TABLE brands ADD COLUMN contact TEXT;
ALTER TABLE brands ADD COLUMN contact_info TEXT;
ALTER TABLE brands ADD COLUMN warranty TEXT;
ALTER TABLE brands ADD COLUMN warranty_policy TEXT;
ALTER TABLE projects ADD COLUMN milestones_json TEXT;
ALTER TABLE projects ADD COLUMN project_code TEXT;

-- ----------------------------------------------------------------------------
-- BLOCK 5: Schema version & Clean legacy mock demo data
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS _schema_meta (version INTEGER PRIMARY KEY);
INSERT OR REPLACE INTO _schema_meta (version) VALUES (5);

DELETE FROM documents WHERE id IN ('doc_qt_01', 'doc_inv_01', 'doc_pos_01');
DELETE FROM purchase_orders WHERE id IN ('po_01', 'po_02');
DELETE FROM products WHERE id IN ('prod_01', 'prod_02', 'prod_03', 'prod_04', 'prod_05', 'prod_06', 'prod_07', 'prod_08');
DELETE FROM product_serials WHERE id IN ('sn_01', 'sn_02', 'sn_03', 'sn_04', 'sn_05', 'sn_06', 'sn_07', 'sn_08');
DELETE FROM projects WHERE id IN ('proj_01', 'proj_02', 'proj_03');
DELETE FROM it_jobs WHERE id IN ('job_01', 'job_02', 'job_03', 'job_04');
