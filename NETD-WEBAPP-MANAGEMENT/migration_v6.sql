-- ============================================================================
-- NETD IT MANAGEMENT SYSTEM - MIGRATION SCRIPT (VERSION 6)
-- For Supabase: Run in Supabase SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Ensure project_categories has description column
ALTER TABLE IF EXISTS public.project_categories ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Enable Row Level Security (RLS) on project_categories
ALTER TABLE IF EXISTS public.project_categories ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policy if any and recreate full public access policy
DROP POLICY IF EXISTS "Public full access for app" ON public.project_categories;
CREATE POLICY "Public full access for app" ON public.project_categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Enable Supabase Realtime publication for project_categories
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.project_categories;
    EXCEPTION WHEN others THEN
        -- Safely ignore if already added
    END;
END $$;

-- 5. Insert default project categories if table is empty
INSERT INTO public.project_categories (id, name, code, color, description) VALUES 
('pcat_cctv', 'ກ້ອງວົງຈອນປິດ', 'CCTV', 'emerald', 'ງານຕິດຕັ້ງລະບົບກ້ອງວົງຈອນປິດ'),
('pcat_net', 'ລະບົບເຄືອຂ່າຍ (Network)', 'NET', 'sky', 'ງານຕິດຕັ້ງລະບົບ Wi-Fi, LAN ແລະ Network Infrastructure'),
('pcat_srv', 'ລະບົບ Server & Cloud', 'SRV', 'indigo', 'Server, Storage NAS ແລະ ລະບົບສຳຮອງຂໍ້ມູນ'),
('pcat_soft', 'ພັດທະນາເວັບໄຊ & ໂປຣແກຣມ', 'SOFT', 'purple', 'Custom Web Application, Mobile App ແລະ ERP')
ON CONFLICT (id) DO NOTHING;
