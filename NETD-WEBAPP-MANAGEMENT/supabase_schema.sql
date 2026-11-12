-- ============================================================================
-- NETD IT MANAGEMENT SYSTEM - SUPABASE POSTGRESQL SCHEMA (v1.0)
-- 100% Turnkey Schema for Supabase with Realtime WebSockets & Row Level Security
-- ============================================================================

-- 1. SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'setting_01',
    shop_name TEXT NOT NULL DEFAULT 'NETD IT Solutions & Services',
    shop_name_lao TEXT DEFAULT 'ເນັດດີ ໄອທີ ໂຊລູຊັ່ນ',
    shop_subtitle TEXT DEFAULT 'ສູນບໍລິການຕິດຕັ້ງ ແລະ ຈັດຈຳໜ່າຍອຸປະກອນໄອທີຄົບວົງຈອນ',
    website TEXT DEFAULT 'www.netditsolutions.com',
    phone TEXT DEFAULT '+856 20 5555 8888 / 021 456 789',
    email TEXT DEFAULT 'info@netd-it.la',
    address TEXT DEFAULT 'ຖະໜົນ ໄກສອນ ພົມວິຫານ, ບ້ານ ໂພນສະອາດ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ',
    tax_id TEXT DEFAULT 'TAX-0102030405-LA',
    currency TEXT DEFAULT 'LAK',
    currency_symbol TEXT DEFAULT '₭',
    tax_rate REAL DEFAULT 7.0,
    logo_url TEXT DEFAULT 'Logo.png',
    bank_name TEXT DEFAULT 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)',
    bank_account_no TEXT DEFAULT '010-12-00-01234567-001',
    bank_account_name TEXT DEFAULT 'NETD IT SOLUTIONS & SERVICES',
    bank_qr_url TEXT,
    d1_worker_url TEXT,
    supabase_url TEXT,
    supabase_anon_key TEXT,
    theme TEXT DEFAULT 'dark',
    last_sync TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. EMPLOYEES
CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'technician',
    role_name TEXT,
    position TEXT,
    phone TEXT,
    email TEXT,
    avatar TEXT,
    address TEXT,
    joined_date DATE,
    salary REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'individual',
    name TEXT NOT NULL,
    company TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    tax_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    category_id TEXT,
    category TEXT,
    contact TEXT,
    contact_info TEXT,
    warranty TEXT,
    warranty_policy TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUPPLIERS
CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    payment_terms TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    model TEXT,
    sn_or_mac TEXT,
    category_id TEXT NOT NULL,
    brand_id TEXT,
    supplier_id TEXT,
    supplier_name TEXT,
    cost_price REAL NOT NULL DEFAULT 0,
    profit_margin REAL DEFAULT 0,
    sale_price REAL NOT NULL DEFAULT 0,
    selling_price REAL NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 2,
    min_stock_alert INTEGER DEFAULT 2,
    stock INTEGER DEFAULT 0,
    stock_qty INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'ໜ່ວຍ',
    has_sn INTEGER DEFAULT 1,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. PRODUCT SERIALS
CREATE TABLE IF NOT EXISTS public.product_serials (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    mac_address TEXT,
    status TEXT DEFAULT 'in_stock',
    purchase_order_id TEXT,
    invoice_id TEXT,
    warranty_months INTEGER DEFAULT 12,
    location TEXT DEFAULT 'ສາງໃຫຍ່',
    received_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sold_date TIMESTAMPTZ,
    customer_id TEXT,
    customer_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. INVENTORY LOGS
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    product_name TEXT,
    type TEXT NOT NULL,
    qty INTEGER NOT NULL,
    prev_qty INTEGER NOT NULL,
    new_qty INTEGER NOT NULL,
    ref_doc_id TEXT,
    notes TEXT,
    performed_by TEXT,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. PURCHASE ORDERS
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id TEXT PRIMARY KEY,
    po_number TEXT UNIQUE NOT NULL,
    supplier_id TEXT NOT NULL,
    supplier_name TEXT,
    order_date DATE NOT NULL,
    expected_date DATE,
    status TEXT DEFAULT 'ordered',
    subtotal REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    shipping_cost REAL DEFAULT 0,
    items_json TEXT NOT NULL DEFAULT '[]',
    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. DOCUMENTS (Quotation, Invoice, Delivery, POS)
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY,
    doc_number TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'pos',
    doc_type TEXT NOT NULL DEFAULT 'pos',
    ref_doc_id TEXT,
    ref_quotation_no TEXT,
    customer_id TEXT DEFAULT 'cust_walk_in',
    customer_name TEXT DEFAULT 'ລູກຄ້າທົ່ວໄປ',
    customer_phone TEXT,
    phone TEXT,
    customer_address TEXT,
    delivery_address TEXT,
    driver TEXT,
    vehicle TEXT,
    date DATE DEFAULT CURRENT_DATE,
    doc_date DATE,
    due_date DATE,
    status TEXT DEFAULT 'paid',
    subtotal REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total_amount REAL NOT NULL DEFAULT 0,
    grand_total REAL NOT NULL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    balance_amount REAL DEFAULT 0,
    cash_received REAL DEFAULT 0,
    change REAL DEFAULT 0,
    payment_method TEXT DEFAULT 'transfer',
    items_json TEXT DEFAULT '[]',
    notes TEXT,
    terms_conditions TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. DOCUMENT ITEMS
CREATE TABLE IF NOT EXISTS public.document_items (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    product_id TEXT,
    item_code TEXT,
    item_name TEXT NOT NULL,
    item_model TEXT,
    item_sn TEXT,
    qty INTEGER NOT NULL DEFAULT 1,
    unit TEXT DEFAULT 'ເຄື່ອງ',
    unit_price REAL NOT NULL DEFAULT 0,
    discount REAL DEFAULT 0,
    total_price REAL NOT NULL DEFAULT 0,
    warranty TEXT DEFAULT '1 ປີ',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. PROJECT CATEGORIES
CREATE TABLE IF NOT EXISTS public.project_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    color TEXT DEFAULT 'sky',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    project_code TEXT,
    code TEXT NOT NULL,
    name TEXT,
    title TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT,
    category TEXT DEFAULT 'Network & Security',
    category_id TEXT,
    category_name TEXT,
    service_type TEXT DEFAULT 'cctv',
    leader_id TEXT,
    lead_technician_id TEXT,
    lead_technician_name TEXT,
    assigned_team TEXT,
    quotation_doc_number TEXT,
    invoice_doc_number TEXT,
    start_date DATE,
    target_date DATE,
    deadline DATE,
    completion_date DATE,
    budget REAL DEFAULT 0,
    cost_actual REAL DEFAULT 0,
    profit REAL DEFAULT 0,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress',
    scope_of_work TEXT,
    location TEXT,
    milestones_json TEXT DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. PROJECT TASKS
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    assigned_to TEXT,
    status TEXT DEFAULT 'todo',
    deadline DATE,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. IT JOB CATEGORIES
CREATE TABLE IF NOT EXISTS public.it_job_categories (
    id TEXT PRIMARY KEY,
    "key" TEXT UNIQUE NOT NULL,
    category_key TEXT,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'sky',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. IT JOBS
CREATE TABLE IF NOT EXISTS public.it_jobs (
    id TEXT PRIMARY KEY,
    job_code TEXT UNIQUE NOT NULL,
    code TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    job_type TEXT NOT NULL DEFAULT 'onsite',
    device_model TEXT,
    serial_or_mac TEXT,
    issue_description TEXT NOT NULL,
    description TEXT,
    technician_id TEXT,
    technician_name TEXT,
    service_fee REAL DEFAULT 0,
    parts_replaced TEXT,
    status TEXT DEFAULT 'pending',
    received_date DATE DEFAULT CURRENT_DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    profit REAL DEFAULT 0,
    date DATE NOT NULL,
    ref_doc TEXT,
    ref_doc_id TEXT,
    description TEXT NOT NULL,
    payment_method TEXT DEFAULT 'transfer',
    recorded_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 19. CLIENT SYSTEMS
CREATE TABLE IF NOT EXISTS public.client_systems (
    id TEXT PRIMARY KEY,
    system_name TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT,
    domain_url TEXT,
    hosting_provider TEXT,
    launch_date DATE,
    expiry_date DATE,
    sla_type TEXT DEFAULT 'SLA Gold 24/7',
    status TEXT DEFAULT 'active',
    price REAL DEFAULT 0,
    tech_stack TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 20. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    user_name TEXT,
    action TEXT,
    module TEXT,
    details TEXT,
    time TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

INSERT INTO public.settings (id, shop_name, shop_subtitle, phone, email, address, tax_id, bank_name, bank_account_no, bank_account_name, theme) 
VALUES ('setting_01', 'NETD IT Solutions & Services', 'ສູນບໍລິການຕິດຕັ້ງ ແລະ ຈັດຈຳໜ່າຍອຸປະກອນໄອທີຄົບວົງຈອນ', '+856 20 5555 8888 / 021 456 789', 'info@netd-it.la', 'ຖະໜົນ ໄກສອນ ພົມວິຫານ, ບ້ານ ໂພນສະອາດ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ', 'TAX-0102030405-LA', 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)', '010-12-00-01234567-001', 'NETD IT SOLUTIONS & SERVICES', 'dark')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.employees (id, name, username, password, role, role_name, position, phone, email, status) VALUES 
('emp_00', 'Mr. Chanh Xeng', 'chanh', 'p@ss4admin', 'admin', 'Admin (ເຈົ້າຂອງຮ້ານ)', 'ເຈົ້າຂອງຮ້ານ', '02029204248', 'chanhtsheej93@gmail.com', 'active'),
('emp_01', 'ສົມສັກ ແກ້ວມະນີ', 'admin', 'p@ss4admin', 'admin', 'Admin (ສິດສູງສຸດ)', 'ຜູ້ຈັດການທົ່ວໄປ (General Manager)', '020 5555 8888', 'somsack@netd-it.la', 'active'),
('emp_02', 'ສົມໄຊ ໄຊຍະວົງ', 'somxay', 'tech123', 'technician', 'Technician (ຊ່າງໄອທີ)', 'ຫົວໜ້າທີມຊ່າງໄອທີ (Lead IT Tech)', '020 7788 9911', 'somxay.tech@netd-it.la', 'active'),
('emp_03', 'ຈຳປາ ວົງວິໄລ', 'champa', 'acc123', 'officer', 'Officer (ພະນັກງານທົ່ວໄປ)', 'ຫົວໜ້າຝ່າຍບັນຊີ ແລະ ເອກະສານ', '020 2233 4455', 'champa.acc@netd-it.la', 'active'),
('emp_04', 'ຄຳຫຼ້າ ສຸລິຍະ', 'khamla', 'sales123', 'officer', 'Officer (ພະນັກງານທົ່ວໄປ)', 'ພະນັກງານຂາຍ ແລະ ປະສານງານ (Sales)', '020 9988 7766', 'khamla.sales@netd-it.la', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name, code, description, icon) VALUES 
('cat_cctv', 'ກ້ອງວົງຈອນປິດ (CCTV)', 'CCTV', 'ກ້ອງ IP, ColorVu, DVR/NVR', 'fa-video'),
('cat_net', 'ອຸປະກອນເຄືອຂ່າຍ (Network)', 'NET', 'Router, Switch, Access Point, Firewall', 'fa-network-wired'),
('cat_server', 'ເຊີບເວີ & ຕູ້ຣັກ (Server & Rack)', 'SRV', 'Tower/Rack Server, UPS, Rack Cabinet', 'fa-server'),
('cat_cable', 'ສາຍສັນຍານ & ອຸປະກອນຕໍ່ພ່ວງ', 'CAB', 'ສາຍ LAN CAT6, Fiber Optic, RJ45, Patch Panel', 'fa-plug'),
('cat_pos', 'ລະບົບຂາຍໜ້າຮ້ານ (POS)', 'POS', 'ເຄື່ອງ POS Touchscreen, ເຄື່ອງພິມໃບບິນ 80mm', 'fa-cash-register'),
('cat_pc', 'ຄອມພິວເຕີ & ໂນ໊ດບຸກ (PC & Laptop)', 'PC', 'Desktop PC, Laptop, All-in-One, Monitor', 'fa-computer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.it_job_categories (id, "key", category_key, name, description, color) VALUES 
('cat_onsite', 'onsite', 'onsite', 'Onsite Support', 'ລົງກວດເຊັກໜ້າວຽກຕົວຈິງ', 'cyan'),
('cat_repair_pc', 'repair_pc', 'repair_pc', 'ວຽກແປງຄອມ', 'ສ້ອມແປງ PC / Desktop / Laptop', 'amber'),
('cat_printer', 'printer', 'printer', 'ແປງປຣິນເຕີ', 'ສ້ອມແປງ Printer / Scanner / POS', 'purple'),
('cat_network', 'network', 'network', 'ວາງສາຍ Network', 'ຕິດຕັ້ງ Wi-Fi / LAN / CCTV', 'emerald'),
('cat_software', 'software', 'software', 'Software / Windows', 'ລົງ Windows / License / ແກ້ໄວຣັສ', 'rose')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.project_categories (id, name, code, color) VALUES 
('pcat_net', 'Network & Security', 'NET', 'sky'),
('pcat_srv', 'Server & Cloud Infrastructure', 'SRV', 'indigo'),
('pcat_cctv', 'CCTV & Surveillance System', 'CCTV', 'emerald'),
('pcat_soft', 'Custom Web Application & ERP', 'SOFT', 'purple')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.brands (id, name, logo_url, category, contact, warranty) VALUES 
('brand_hik', 'Hikvision', 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Hikvision_logo.svg', 'ກ້ອງວົງຈອນປິດ (CCTV)', '020 5555 8888', '2 ປີ'),
('brand_dahua', 'Dahua', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Dahua_Technology_logo.svg', 'ກ້ອງວົງຈອນປິດ (CCTV)', '020 5555 8888', '2 ປີ'),
('brand_ubi', 'Ubiquiti UniFi', 'https://upload.wikimedia.org/wikipedia/commons/8/87/Ubiquiti_Networks_Logo.svg', 'ອຸປະກອນເຄືອຂ່າຍ (Network)', '020 5555 8888', '1 ປີ'),
('brand_cisco', 'Cisco', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg', 'ອຸປະກອນເຄືອຂ່າຍ (Network)', '020 5555 8888', '1 ປີ'),
('brand_mikrotik', 'MikroTik', 'https://upload.wikimedia.org/wikipedia/commons/8/82/MikroTik_logo.svg', 'ອຸປະກອນເຄືອຂ່າຍ (Network)', '020 5555 8888', '1 ປີ'),
('brand_dell', 'Dell Technologies', 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg', 'ເຊີບເວີ & ຕູ້ຣັກ (Server & Rack)', '020 5555 8888', '3 ປີ Onsite'),
('brand_sunmi', 'Sunmi POS', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Sunmi_logo.png', 'ລະບົບຂາຍໜ້າຮ້ານ (POS)', '020 5555 8888', '1 ປີ')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables Row Level Security and grants full read/write access to anon & authenticated
-- ============================================================================

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'settings', 'employees', 'customers', 'categories', 'brands', 'suppliers',
        'products', 'product_serials', 'inventory_logs', 'purchase_orders',
        'documents', 'document_items', 'projects', 'project_tasks',
        'it_job_categories', 'it_jobs', 'transactions', 'client_systems', 'activity_logs'
    ];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Public full access for app" ON public.%I;', t);
        EXECUTE format('CREATE POLICY "Public full access for app" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', t);
    END LOOP;
END $$;

-- ============================================================================
-- REALTIME REPLICATION (SUPABASE REALTIME WEBSOCKETS)
-- Broadcasts INSERT, UPDATE, DELETE to all connected client browsers instantly
-- ============================================================================

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'settings', 'employees', 'customers', 'categories', 'brands', 'suppliers',
        'products', 'product_serials', 'inventory_logs', 'purchase_orders',
        'documents', 'document_items', 'projects', 'project_tasks',
        'it_job_categories', 'it_jobs', 'transactions', 'client_systems', 'activity_logs'
    ];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        BEGIN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', t);
        EXCEPTION WHEN others THEN
            -- Table might already be in publication, safely ignore
        END;
    END LOOP;
END $$;
