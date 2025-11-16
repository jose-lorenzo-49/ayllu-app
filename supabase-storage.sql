-- ===================================================
-- SUPABASE STORAGE CONFIGURATION
-- Configuración de almacenamiento para imágenes
-- ===================================================

-- 1. CREAR BUCKET PÚBLICO PARA IMÁGENES
-- Ejecutar en Supabase Dashboard → Storage → Policies

-- Crear bucket 'images' (hacer esto en la UI de Supabase Storage)
-- O usar la función SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. POLÍTICAS DE SEGURIDAD PARA EL BUCKET

-- Permitir a usuarios autenticados SUBIR imágenes
CREATE POLICY "Usuarios pueden subir imágenes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Permitir LECTURA PÚBLICA de imágenes
CREATE POLICY "Imágenes públicas para lectura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Permitir a usuarios ELIMINAR sus propias imágenes
CREATE POLICY "Usuarios pueden eliminar sus imágenes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND owner = auth.uid());

-- Permitir a usuarios ACTUALIZAR sus propias imágenes
CREATE POLICY "Usuarios pueden actualizar sus imágenes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images' AND owner = auth.uid());

-- 3. CONFIGURACIÓN ADICIONAL (OPCIONAL)

-- Límite de tamaño de archivo: 5MB (configurar en Supabase Dashboard)
-- Tipos de archivo permitidos: image/* (configurar en Supabase Dashboard)

-- ===================================================
-- INSTRUCCIONES DE USO
-- ===================================================

/*
MÉTODO 1: Crear bucket desde la UI (RECOMENDADO)
1. Ir a Supabase Dashboard
2. Click en "Storage" en el menú lateral
3. Click en "New bucket"
4. Nombre: images
5. Marcar "Public bucket"
6. Click "Create bucket"
7. Ejecutar las políticas de este archivo en SQL Editor

MÉTODO 2: Crear bucket desde SQL
1. Ejecutar todo este archivo en SQL Editor
2. Verificar que el bucket aparece en Storage

VERIFICAR:
- Bucket 'images' existe
- Bucket es público
- Políticas están activas
- Puedes subir una imagen de prueba
*/

-- ===================================================
-- VERIFICACIÓN
-- ===================================================

-- Ver buckets existentes
SELECT * FROM storage.buckets;

-- Ver políticas del bucket
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- ===================================================
-- TROUBLESHOOTING
-- ===================================================

/*
Si las imágenes no se suben:
1. Verificar que el bucket 'images' existe
2. Verificar que el bucket es público
3. Verificar que las políticas están activas
4. Verificar en consola del navegador el error específico
5. Verificar que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY están correctos

Si las imágenes no se ven:
1. Verificar que el bucket es público
2. Verificar la política de lectura pública
3. Verificar que la URL es correcta
4. Probar la URL directamente en el navegador
*/
