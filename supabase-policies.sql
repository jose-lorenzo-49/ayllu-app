-- Deshabilitar RLS temporalmente para desarrollo
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- O crear políticas públicas (alternativa)
-- CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON posts FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON likes FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON comments FOR ALL USING (true);