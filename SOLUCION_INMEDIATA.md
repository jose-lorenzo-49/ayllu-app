# ⚡ SOLUCIÓN INMEDIATA - EJECUTA ESTO AHORA

## 🎯 EL PROBLEMA
El trigger de Supabase no está creando el perfil automáticamente porque:
1. El SQL anterior tenía un error en SECURITY DEFINER
2. La política RLS bloqueaba la inserción

## ✅ LA SOLUCIÓN (2 PASOS)

### PASO 1: Ejecutar este SQL en Supabase

1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto: **iwgnztlphuodjazeguup**
3. Click en **SQL Editor** (icono </> en sidebar)
4. Click en **New query**
5. **COPIA Y PEGA EXACTAMENTE ESTO**:

```sql
-- BORRAR TRIGGER ANTIGUO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- CREAR FUNCIÓN CORREGIDA (SECURITY DEFINER bypasea RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, username, faculty, year, bio, avatar, connections)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    LOWER(REPLACE(REPLACE(split_part(NEW.email, '@', 1), '.', '_'), ' ', '_')),
    COALESCE(NEW.raw_user_meta_data->>'faculty', 'Sin especificar'),
    COALESCE(NEW.raw_user_meta_data->>'year', '1er año'),
    'Estudiante de San Marcos 🎓',
    'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) || '&background=random&size=200',
    '{}'::UUID[]
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- CREAR TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- VERIFICAR QUE ESTÉ CREADO
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
```

6. Click **Run** (o Ctrl+Enter)
7. Deberías ver: **"Success. 1 row(s) returned"** ✅

### PASO 2: Configurar Authentication

1. Ve a **Authentication** → **Settings**
2. Busca **"Email Auth"**
3. Asegúrate que:
   - ✅ **Confirm email: OFF** ← MUY IMPORTANTE
   - ✅ **Enable Email provider: ON**
4. Scroll abajo hasta **"Site URL"**:
   ```
   http://localhost:5173
   ```
5. Click **Save**

---

## 🧪 PROBAR AHORA

1. En tu navegador, ve a: http://localhost:5173
2. Click **"Crear cuenta"**
3. Llena:
   - Email: `test@unmsm.edu.pe`
   - Nombre: `Test Usuario`
   - Carrera: Cualquiera
   - Contraseña: `123456`
   - Confirmar: `123456`
4. Click **"Crear cuenta gratis"**

### ✅ DEBERÍA PASAR:
```
Loading... 
→ Cuenta creada
→ Entraste automáticamente a la app
→ Ves el feed vacío (normal, no hay posts aún)
```

### ❌ SI FALLA:
1. Abre consola del navegador (F12)
2. Copia el error
3. Verifica en Supabase:
   - **Authentication** → **Users** (debería aparecer el usuario)
   - **Table Editor** → **users** (debería aparecer el perfil)

---

## 🔍 VERIFICAR QUE TODO ESTÉ BIEN

### En Supabase Dashboard:

1. **SQL Editor** → ejecuta:
```sql
-- Ver triggers
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```
Deberías ver 1 fila ✅

2. **SQL Editor** → ejecuta:
```sql
-- Ver función
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
```
Deberías ver la función con SECURITY DEFINER ✅

3. **Authentication** → **Settings**:
   - Confirm email: **OFF** ✅

---

## 📝 ¿QUÉ CAMBIÓ?

### ANTES (Con error):
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
-- RLS bloqueaba la inserción
```

### AHORA (Corregido):
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER  ← ESTO BYPASEA RLS
SET search_path = public  ← SEGURIDAD ADICIONAL
```

---

## 🎉 DESPUÉS DE EJECUTAR EL SQL

La app debería funcionar así:

1. **Registro**:
   - Usuario llena formulario
   - Supabase Auth crea usuario
   - **Trigger automático** crea perfil (sin bloqueo RLS)
   - Auto-login
   - Redirige a app ✅

2. **Login**:
   - Email + contraseña
   - Carga perfil
   - Entra a app ✅

---

## ⏰ TIEMPO ESTIMADO
- Copiar y pegar SQL: **30 segundos**
- Configurar Auth Settings: **30 segundos**
- Probar registro: **30 segundos**
- **TOTAL: 90 segundos** ⚡

---

**¡EJECUTA EL SQL AHORA Y PRUEBA!** 🚀
