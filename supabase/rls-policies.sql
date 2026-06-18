-- Enable RLS for all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- CUSTOMERS
-- --------------------------------------------------------
CREATE POLICY "customers_select_own_company" ON customers
  FOR SELECT USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "customers_insert_own_company" ON customers
  FOR INSERT WITH CHECK (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "customers_update_own_company" ON customers
  FOR UPDATE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "customers_delete_own_company" ON customers
  FOR DELETE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

-- --------------------------------------------------------
-- DEALS
-- --------------------------------------------------------
CREATE POLICY "deals_select_own_company" ON deals
  FOR SELECT USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "deals_insert_own_company" ON deals
  FOR INSERT WITH CHECK (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "deals_update_own_company" ON deals
  FOR UPDATE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "deals_delete_own_company" ON deals
  FOR DELETE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

-- --------------------------------------------------------
-- ACTIVITIES
-- --------------------------------------------------------
CREATE POLICY "activities_select_own_company" ON activities
  FOR SELECT USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "activities_insert_own_company" ON activities
  FOR INSERT WITH CHECK (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "activities_update_own_company" ON activities
  FOR UPDATE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "activities_delete_own_company" ON activities
  FOR DELETE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

-- --------------------------------------------------------
-- TASKS
-- --------------------------------------------------------
CREATE POLICY "tasks_select_own_company" ON tasks
  FOR SELECT USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "tasks_insert_own_company" ON tasks
  FOR INSERT WITH CHECK (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "tasks_update_own_company" ON tasks
  FOR UPDATE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "tasks_delete_own_company" ON tasks
  FOR DELETE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

-- --------------------------------------------------------
-- DOCUMENTS
-- --------------------------------------------------------
CREATE POLICY "documents_select_own_company" ON documents
  FOR SELECT USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "documents_insert_own_company" ON documents
  FOR INSERT WITH CHECK (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "documents_update_own_company" ON documents
  FOR UPDATE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "documents_delete_own_company" ON documents
  FOR DELETE USING (company_id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

-- --------------------------------------------------------
-- COMPANIES
-- --------------------------------------------------------
CREATE POLICY "companies_select_own" ON companies
  FOR SELECT USING (id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

CREATE POLICY "companies_update_own" ON companies
  FOR UPDATE USING (id = (auth.jwt() -> 'user_metadata' ->> 'company_id')::uuid);

-- --------------------------------------------------------
-- Enable Realtime for specific tables (Required for Realtime to work with RLS)
-- --------------------------------------------------------
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE customers, deals, activities;
