# 🚀 Inicio Rápido - Ayllu UNMSM

## ✅ Sistema de Autenticación Implementado

Tu aplicación ahora tiene un sistema de autenticación profesional con Supabase:

- ✅ **Login**: Credenciales automáticas SIN verificación de email
- ✅ **Registro**: CON verificación de email
- ✅ **Recuperar contraseña**: CON verificación de email

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

---

## ⚙️ Configuración Rápida

### 1. Verificar Variables de Entorno

Tu archivo `.env` ya está configurado con:

```env
VITE_SUPABASE_URL=https://iwgnztlphuodjazeguup.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configurar Supabase (IMPORTANTE)

Ve a tu Dashboard de Supabase y sigue estos pasos críticos:

#### A. Desactivar verificación de email para login

1. Ve a **Authentication** → **Providers** → **Email**
2. **Desactiva**: "Confirm email" ❌
3. Guarda cambios

#### B. Ejecutar el Trigger de perfil automático

En **SQL Editor**, ejecuta:

```sql
-- Función para crear perfil automáticamente
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
```

#### C. Verificar que RLS esté deshabilitado

En **SQL Editor**:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```

---

## 🧪 Probar la Aplicación

### 1. Crear una cuenta de prueba

1. Inicia la app: `npm run dev`
2. Click en "Crear cuenta"
3. Llena el formulario con email @unmsm.edu.pe
4. Click en "Crear cuenta gratis"
5. Verás mensaje de éxito ✅
6. Recibirás email de confirmación (opcional confirmarlo)

### 2. Iniciar sesión

1. Usa el email y contraseña que acabas de crear
2. Click en "Iniciar Sesión"
3. **Entrarás inmediatamente** sin necesidad de verificar el email ✅

### 3. Recuperar contraseña

1. Click en "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. Recibirás un email con el link de recuperación
4. Click en el link y crea una nueva contraseña

---

## 📁 Estructura de Archivos Creados/Modificados

```
src/
├── services/
│   └── authService.js          # Servicio completo de autenticación
├── hooks/
│   └── useSupabase.js          # Hook actualizado con perfil
├── lib/
│   └── supabase.js             # Cliente de Supabase
└── AylluIntegrado.jsx          # Componente principal actualizado

docs/
└── SUPABASE_AUTH_CONFIG.md     # Guía detallada de configuración
```

---

## 🎯 Funcionalidades Implementadas

### authService.js

El servicio incluye:

- ✅ `signUp()` - Registro con verificación de email
- ✅ `signIn()` - Login sin verificación
- ✅ `resetPassword()` - Recuperar contraseña
- ✅ `updatePassword()` - Actualizar contraseña
- ✅ `signOut()` - Cerrar sesión
- ✅ `getCurrentSession()` - Obtener sesión actual
- ✅ `checkEmailExists()` - Verificar si email existe
- ✅ `resendVerificationEmail()` - Reenviar email de verificación

### Componente Principal

Incluye:

- ✅ Pantalla de loading mientras verifica sesión
- ✅ Formularios de login/registro con validación
- ✅ Mensajes de error/éxito
- ✅ Formulario de recuperación de contraseña
- ✅ Indicadores de carga (spinners)
- ✅ Logout funcional
- ✅ Persistencia de sesión

---

## 🔍 Ver Emails de Prueba

Durante desarrollo, los emails se pueden ver en:

**Inbucket de Supabase**: 
```
https://app.supabase.com/project/iwgnztlphuodjazeguup/auth/emails
```

O ve a: **Authentication** → **Logs** en tu Dashboard

---

## ❓ Troubleshooting

### "Invalid login credentials"
- Verifica que el email y contraseña sean correctos
- Asegúrate que el usuario existe en la tabla `users`

### "Email not confirmed" al hacer login
- **Solución**: Desactiva "Confirm email" en Authentication → Providers → Email

### No se crea perfil automáticamente
- Verifica que el trigger esté creado correctamente
- Revisa los logs en Database → Logs

### RLS bloquea operaciones
- Verifica que RLS esté deshabilitado para desarrollo
- Ejecuta los comandos `ALTER TABLE ... DISABLE ROW LEVEL SECURITY;`

---

## 📚 Documentación Completa

Para configuración detallada, revisa:
- **SUPABASE_AUTH_CONFIG.md** - Guía completa de configuración
- **supabase-schema.sql** - Esquema de la base de datos
- **supabase-policies.sql** - Políticas de seguridad

---

## 🚀 Próximos Pasos

1. **Personalizar emails**: Edita los templates en Authentication → Email Templates
2. **Agregar validaciones**: Implementa validaciones adicionales de email institucional
3. **Configurar producción**: Sigue la guía en SUPABASE_AUTH_CONFIG.md
4. **Habilitar RLS**: Cuando estés listo para producción
5. **Agregar 2FA**: Implementa autenticación de dos factores

---

## 🎉 ¡Listo!

Tu aplicación ahora tiene autenticación profesional funcionando. 

Para iniciar:
```bash
npm run dev
```

Luego ve a: http://localhost:5173

---

**Desarrollado con ❤️ para la comunidad Sanmarquina**
