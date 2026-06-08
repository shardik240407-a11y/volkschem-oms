-- ============================================================================
-- VOLKSCHEM OMS — Complete PostgreSQL Schema
-- Company: Volkschem Crop Science Pvt. Ltd.
-- GST: 24AAFCV2675N1ZU
-- CIN: U24100GJ2015PTC084879
-- Generated: 2026-06-06
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to start clean
DROP TABLE IF EXISTS login_logs CASCADE;
DROP TABLE IF EXISTS lr_attachments CASCADE;
DROP TABLE IF EXISTS order_progress CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS label_transactions CASCADE;
DROP TABLE IF EXISTS label_inventory CASCADE;
DROP TABLE IF EXISTS quotation_components CASCADE;
DROP TABLE IF EXISTS quotation_rows CASCADE;
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS cost_sheet_rates CASCADE;
DROP TABLE IF EXISTS bulk_prices CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 1. USERS
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee', 'factory_admin')),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    joining_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================================
-- 2. PRODUCTS
-- ============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(20) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    technical_combination TEXT,
    bulk_rate_per_ltr_kg DECIMAL(10,2) NOT NULL,
    rate_unit VARCHAR(10) NOT NULL CHECK (rate_unit IN ('ltr', 'kg')),
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('gujarat_brand', 'third_party')),
    gst_rate DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    available_packing_types TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_product_code ON products(product_code);
CREATE INDEX idx_products_order_type ON products(order_type);
CREATE INDEX idx_products_is_active ON products(is_active);

-- ============================================================================
-- 3. BULK PRICES
-- ============================================================================
CREATE TABLE bulk_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_name VARCHAR(100) NOT NULL,
    rate_per_unit DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) NOT NULL,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bulk_prices_material ON bulk_prices(material_name);

-- ============================================================================
-- 4. COST SHEET RATES
-- ============================================================================
CREATE TABLE cost_sheet_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    size VARCHAR(20) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cost_sheet_category ON cost_sheet_rates(category);
CREATE INDEX idx_cost_sheet_item ON cost_sheet_rates(item_name);

-- ============================================================================
-- 5. QUOTATIONS
-- ============================================================================
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(20) UNIQUE NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('product', 'bulk')),
    product_order_type VARCHAR(20) CHECK (product_order_type IN ('gujarat_brand', 'third_party')),
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    created_by UUID REFERENCES users(id) NOT NULL,
    product_id UUID REFERENCES products(id),
    employee_name VARCHAR(100),
    customer_name VARCHAR(100) NOT NULL,
    customer_contact VARCHAR(15),
    gst_pan VARCHAR(20),
    billing_address TEXT,
    billing_name VARCHAR(100),
    transport_name VARCHAR(100),
    destination TEXT,
    label_company_name VARCHAR(100),
    name_on_label VARCHAR(100),
    quotation_date DATE,
    admin_note TEXT,
    rejection_comment TEXT,
    confirmed_by UUID REFERENCES users(id),
    confirmed_at TIMESTAMP,
    notes TEXT,
    subtotal DECIMAL(12,2),
    total_gst DECIMAL(12,2),
    grand_total DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quotations_number ON quotations(quotation_number);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_created_by ON quotations(created_by);
CREATE INDEX idx_quotations_product_id ON quotations(product_id);
CREATE INDEX idx_quotations_order_type ON quotations(order_type);

-- ============================================================================
-- 6. QUOTATION ROWS
-- ============================================================================
CREATE TABLE quotation_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE NOT NULL,
    row_number INTEGER NOT NULL,
    packing_type VARCHAR(20) NOT NULL,
    container_variant VARCHAR(100),
    pack_size_value DECIMAL(10,3) NOT NULL,
    pack_size_unit VARCHAR(5) NOT NULL CHECK (pack_size_unit IN ('ml', 'ltr', 'gm', 'kg')),
    bulk_rate_per_ltr_kg DECIMAL(10,2) NOT NULL,
    bulk_material_cost_per_pcs DECIMAL(10,4) NOT NULL,
    total_quantity_ltr_kg DECIMAL(10,3) NOT NULL,
    total_pcs INTEGER NOT NULL,
    nos_per_carton INTEGER,
    total_cases INTEGER,
    mrp DECIMAL(10,2),
    gst_rate DECIMAL(5,2) NOT NULL,
    cost_per_pcs DECIMAL(10,4) NOT NULL,
    row_amount DECIMAL(12,2) NOT NULL,
    gst_amount DECIMAL(12,2) NOT NULL,
    row_total_with_gst DECIMAL(12,2) NOT NULL,
    pack_wise_ltr_kg DECIMAL(10,3),
    total_ltr_kg DECIMAL(10,3),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quotation_rows_quotation ON quotation_rows(quotation_id);

-- ============================================================================
-- 7. QUOTATION COMPONENTS
-- ============================================================================
CREATE TABLE quotation_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row_id UUID REFERENCES quotation_rows(id) ON DELETE CASCADE NOT NULL,
    component_name VARCHAR(100) NOT NULL,
    is_checked BOOLEAN NOT NULL DEFAULT true,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    default_rate DECIMAL(10,4),
    applied_rate DECIMAL(10,4) NOT NULL,
    cost_per_pcs DECIMAL(10,4) NOT NULL,
    sort_order INTEGER
);

CREATE INDEX idx_quotation_components_row ON quotation_components(row_id);

-- ============================================================================
-- 8. LABEL INVENTORY
-- ============================================================================
CREATE TABLE label_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) NOT NULL,
    pack_type VARCHAR(50) NOT NULL,
    pack_size VARCHAR(20) NOT NULL,
    open_stock INTEGER NOT NULL DEFAULT 0,
    total_printed INTEGER NOT NULL DEFAULT 0,
    used_to_date INTEGER NOT NULL DEFAULT 0,
    closing_stock INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE (product_id, pack_type, pack_size)
);

CREATE INDEX idx_label_inventory_product ON label_inventory(product_id);

-- ============================================================================
-- 9. LABEL TRANSACTIONS
-- ============================================================================
CREATE TABLE label_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) NOT NULL,
    quotation_id UUID REFERENCES quotations(id),
    order_id UUID,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('batch_added', 'order_deducted')),
    quantity INTEGER NOT NULL,
    batch_rate DECIMAL(10,2),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_label_transactions_product ON label_transactions(product_id);
CREATE INDEX idx_label_transactions_quotation ON label_transactions(quotation_id);
CREATE INDEX idx_label_transactions_type ON label_transactions(transaction_type);

-- ============================================================================
-- 10. ORDERS
-- ============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES quotations(id) NOT NULL UNIQUE,
    confirmed_by UUID REFERENCES users(id),
    confirmed_at TIMESTAMP,
    current_status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
    factory_note TEXT,
    dispatch_note TEXT,
    dispatched_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_quotation ON orders(quotation_id);
CREATE INDEX idx_orders_status ON orders(current_status);

-- ============================================================================
-- 11. ORDER PROGRESS
-- ============================================================================
CREATE TABLE order_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(30) NOT NULL,
    updated_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_progress_order ON order_progress(order_id);

-- ============================================================================
-- 12. LR ATTACHMENTS
-- ============================================================================
CREATE TABLE lr_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lr_attachments_order ON lr_attachments(order_id);

-- ============================================================================
-- 13. LOGIN LOGS
-- ============================================================================
CREATE TABLE login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username_attempted VARCHAR(50),
    user_id UUID REFERENCES users(id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_login_logs_user ON login_logs(user_id);
CREATE INDEX idx_login_logs_username ON login_logs(username_attempted);
CREATE INDEX idx_login_logs_created ON login_logs(created_at);

-- ============================================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_quotations_updated_at
    BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cost_sheet_rates_updated_at
    BEFORE UPDATE ON cost_sheet_rates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_bulk_prices_updated_at
    BEFORE UPDATE ON bulk_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — Enable on all tables
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_sheet_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE label_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE label_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lr_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES — Allow authenticated service role full access
-- (Application-level auth via JWT; RLS policies will be refined per role later)
-- ============================================================================
CREATE POLICY "Service role full access on users"
    ON users FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on products"
    ON products FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on bulk_prices"
    ON bulk_prices FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on cost_sheet_rates"
    ON cost_sheet_rates FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on quotations"
    ON quotations FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on quotation_rows"
    ON quotation_rows FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on quotation_components"
    ON quotation_components FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on label_inventory"
    ON label_inventory FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on label_transactions"
    ON label_transactions FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on orders"
    ON orders FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on order_progress"
    ON order_progress FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on lr_attachments"
    ON lr_attachments FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on login_logs"
    ON login_logs FOR ALL
    USING (true) WITH CHECK (true);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
