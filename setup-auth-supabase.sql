-- ============================================
-- CONFIGURACIÓN COMPLETA DE AUTENTICACIÓN
-- Ayllu UNMSM - Supabase Setup
-- ============================================
-- Ejecuta este script en SQL Editor de Supabase
-- para configurar todo el sistema de autenticación

-- ============================================
-- 1. CREAR TRIGGER PARA PERFIL AUTOMÁTICO
-- ============================================

-- Función que crea el perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, username, faculty, year, bio, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    LOWER(REPLACE(split_part(NEW.email, '@', 1), '.', '_')),
    COALESCE(NEW.raw_user_meta_data->>'faculty', 'Sin especificar'),
    COALESCE(NEW.raw_user_meta_data->>'year', '1er año'),
    'Estudiante de San Marcos 🎓',
    'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) || '&background=random&size=200'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. DESHABILITAR RLS PARA DESARROLLO
-- ============================================

-- Desactivar Row Level Security para desarrollo rápido
-- IMPORTANTE: En producción, habilita RLS y crea políticas apropiadas

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREAR ÍNDICES PARA MEJOR PERFORMANCE
-- ============================================

-- Índices en tabla users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Índices en tabla posts
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Índices en tabla likes
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Índices en tabla comments
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Índices en tabla connections
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user_id ON connections(connected_user_id);

-- Índices en tabla messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- ============================================
-- 4. CREAR FUNCIONES HELPER (OPCIONAL)
-- ============================================

-- Función para obtener perfil de usuario por ID
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  name VARCHAR,
  username VARCHAR,
  faculty VARCHAR,
  year VARCHAR,
  bio TEXT,
  avatar TEXT,
  location VARCHAR,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.name, u.username, u.faculty, u.year, u.bio, u.avatar, u.location, u.created_at
  FROM users u
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Función para contar posts de un usuario
CREATE OR REPLACE FUNCTION count_user_posts(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  post_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO post_count
  FROM posts
  WHERE posts.user_id = user_id;
  
  RETURN post_count;
END;
$$ LANGUAGE plpgsql;

-- Función para contar conexiones de un usuario
CREATE OR REPLACE FUNCTION count_user_connections(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  connection_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO connection_count
  FROM connections
  WHERE connections.user_id = user_id;
  
  RETURN connection_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. INSERTAR DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Descomentar para crear usuarios de prueba
/*
-- Usuario de prueba 1
INSERT INTO auth.users (
  id,
  email,
  raw_user_meta_data,
  created_at,
  updated_at,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  gen_random_uuid(),
  'demo1@unmsm.edu.pe',
  '{"name": "María Castro", "faculty": "Medicina", "year": "3er año"}'::jsonb,
  NOW(),
  NOW(),
  crypt('password123', gen_salt('bf')),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Usuario de prueba 2
INSERT INTO auth.users (
  id,
  email,
  raw_user_meta_data,
  created_at,
  updated_at,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  gen_random_uuid(),
  'demo2@unmsm.edu.pe',
  '{"name": "Carlos Mendoza", "faculty": "Ingeniería de Sistemas", "year": "4to año"}'::jsonb,
  NOW(),
  NOW(),
  crypt('password123', gen_salt('bf')),
  NOW(),
  '',
  '',
  '',
  ''
);
*/

-- ============================================
-- 6. VERIFICACIÓN DE CONFIGURACIÓN
-- ============================================

-- Verificar que el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verificar que RLS está deshabilitado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'posts', 'likes', 'comments', 'connections', 'messages', 'conversations', 'notifications');

-- Contar usuarios existentes
SELECT COUNT(*) as total_users FROM users;

-- Contar posts existentes
SELECT COUNT(*) as total_posts FROM posts;

-- ============================================
-- CONFIGURACIÓN COMPLETADA
-- ============================================

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Configuración de autenticación completada exitosamente!';
  RAISE NOTICE '📋 Próximos pasos:';
  RAISE NOTICE '1. Ve a Authentication → Providers → Email';
  RAISE NOTICE '2. Desactiva "Confirm email" (CRÍTICO)';
  RAISE NOTICE '3. Configura Site URL y Redirect URLs';
  RAISE NOTICE '4. Personaliza Email Templates';
  RAISE NOTICE '5. Prueba registrando un usuario nuevo';
END $$;
