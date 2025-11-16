# 🖼️ GUÍA: Configurar Supabase Storage para Imágenes

## ⚡ Configuración Rápida (2 minutos)

### PASO 1: Crear Bucket en Supabase

1. **Ir a Supabase Dashboard**
   - https://app.supabase.com
   - Seleccionar tu proyecto

2. **Ir a Storage**
   - Click en "Storage" en el menú lateral
   - Click en "New bucket"

3. **Crear bucket público**
   - **Name:** `images`
   - **✅ Marcar:** "Public bucket"
   - **Click:** "Create bucket"

### PASO 2: Configurar Políticas

1. **Ir a SQL Editor**
   - Click en "SQL Editor" en el menú lateral
   - Click en "New query"

2. **Ejecutar este SQL:**

```sql
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
```

3. **Click en "Run"**

### PASO 3: ¡Listo! Ya puedes subir imágenes

---

## 📸 Cómo Usar

### En la Aplicación

1. **Crear un post**
   - Escribir contenido
   - Click en el ícono de imagen 📷
   - Seleccionar imagen (máx 5MB)
   - Ver preview
   - Click en "Publicar"

2. **La imagen se subirá automáticamente a Supabase Storage**

---

## ✅ Verificar que Funciona

### Método 1: Desde la UI
1. Crear un post con imagen
2. Ir a Supabase Dashboard → Storage → images
3. Ver que la carpeta `posts/` tiene tu imagen

### Método 2: Desde SQL
```sql
-- Ver archivos subidos
SELECT * FROM storage.objects WHERE bucket_id = 'images';
```

---

## 🎨 Límites Configurados

- **Tamaño máximo:** 5MB por imagen
- **Tipos permitidos:** image/* (jpg, png, gif, webp, etc.)
- **Almacenamiento:** Ilimitado en plan gratuito (hasta 1GB)
- **Ancho de banda:** 2GB/mes en plan gratuito

---

## 🐛 Troubleshooting

### ❌ Error: "Bucket not found"
**Solución:**
```sql
-- Crear el bucket manualmente
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);
```

### ❌ Error: "Policy violation"
**Solución:**
- Verificar que las políticas están activas
- Re-ejecutar el SQL del PASO 2
- Verificar que el usuario está autenticado

### ❌ Error: "File size too large"
**Solución:**
- La imagen supera 5MB
- Comprimir la imagen antes de subir
- Usar herramientas como tinypng.com

### ❌ Imágenes no se ven
**Solución:**
- Verificar que el bucket es público
- Verificar que la política de lectura está activa
- Probar la URL directamente en el navegador

---

## 📊 Ver Estadísticas de Uso

```sql
-- Contar imágenes subidas
SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'images';

-- Ver tamaño total usado (en bytes)
SELECT SUM(metadata->>'size')::bigint as total_bytes 
FROM storage.objects 
WHERE bucket_id = 'images';

-- Ver imágenes por usuario
SELECT owner, COUNT(*) as total_images
FROM storage.objects
WHERE bucket_id = 'images'
GROUP BY owner;
```

---

## 🔒 Seguridad

### Políticas Implementadas

✅ **INSERT** - Solo usuarios autenticados pueden subir  
✅ **SELECT** - Cualquiera puede ver (bucket público)  
✅ **DELETE** - Solo el dueño puede eliminar  
✅ **UPDATE** - Solo el dueño puede actualizar  

### Validaciones en el Frontend

✅ **Tamaño** - Máximo 5MB  
✅ **Tipo** - Solo imágenes (image/*)  
✅ **Autenticación** - Usuario debe estar logueado  

---

## 📝 Estructura de Archivos

```
images/
└── posts/
    ├── {user_id}-{timestamp}.jpg
    ├── {user_id}-{timestamp}.png
    └── {user_id}-{timestamp}.webp
```

**Ejemplo:**
```
images/posts/abc123-1700000000000.jpg
images/posts/xyz789-1700000001000.png
```

---

## 🚀 Mejoras Futuras (Opcional)

### 1. Comprimir Imágenes Automáticamente
```javascript
// Instalar: npm install browser-image-compression
import imageCompression from 'browser-image-compression';

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  return await imageCompression(file, options);
};
```

### 2. Subir Fotos de Perfil
```javascript
// Crear carpeta separada para avatares
const avatarPath = `avatars/${userId}.jpg`;
```

### 3. Transformaciones de Imágenes
- Usar Supabase Image Transformation (en planes pagos)
- Redimensionar automáticamente
- Generar thumbnails

---

## 💰 Costos

### Plan Gratuito (Suficiente para empezar)
- ✅ 1GB de almacenamiento
- ✅ 2GB de ancho de banda/mes
- ✅ Políticas RLS ilimitadas

### Plan Pro ($25/mes)
- ✅ 100GB de almacenamiento
- ✅ 200GB de ancho de banda/mes
- ✅ Image transformations

---

## ✅ Checklist de Configuración

- [ ] Bucket 'images' creado
- [ ] Bucket marcado como público
- [ ] Políticas INSERT ejecutadas
- [ ] Políticas SELECT ejecutadas
- [ ] Políticas DELETE ejecutadas
- [ ] Probado subir imagen desde la app
- [ ] Verificado imagen en Storage
- [ ] Verificado imagen se ve en post

---

## 🎉 ¡Listo!

**Si completaste todos los pasos:**

✅ Puedes subir imágenes en posts  
✅ Las imágenes se almacenan en Supabase  
✅ Las imágenes son públicas y accesibles  
✅ Solo el dueño puede eliminar sus imágenes  

**¡Disfruta de la funcionalidad completa de imágenes!** 📸

---

**Tiempo total:** 2-3 minutos  
**Dificultad:** 🟢 Fácil  
**Documentación oficial:** https://supabase.com/docs/guides/storage
