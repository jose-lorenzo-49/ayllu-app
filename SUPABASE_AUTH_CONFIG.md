# 🔐 Guía Completa de Autenticación Supabase - Ayllu UNMSM

## 🎯 Configuración Profesional (Como App Social Real)

Esta guía configura la autenticación con los siguientes flujos:

- ✅ **Login**: Credenciales automáticas **SIN** verificación de email
- ✅ **Registro**: **CON** verificación de email
- ✅ **Recuperar contraseña**: **CON** verificación de email

---

## 📋 Configuración Paso a Paso

### 1. Configuración de Authentication en Supabase Dashboard

1. Ve a tu proyecto: https://supabase.com/dashboard
2. Navega a **Authentication** → **Providers** → **Email**

#### Configurar Email Provider:

```
✅ Enable Email provider: ON
✅ Confirm email: OFF  (CRÍTICO - permite login sin verificar)
✅ Secure email change: OFF
```

**IMPORTANTE**: Al desactivar "Confirm email", los usuarios pueden iniciar sesión inmediatamente después de registrarse, aunque aún reciban el email de confirmación.

### 2. Site URL y Redirect URLs

En **Authentication** → **URL Configuration**:

```
Site URL: http://localhost:5173

Redirect URLs:
  - http://localhost:5173/**
  - http://localhost:5173/verify-email
  - http://localhost:5173/reset-password
```

Para producción, agrega también:
```
  - https://tu-dominio.vercel.app/**
  - https://tu-dominio.vercel.app/verify-email
  - https://tu-dominio.vercel.app/reset-password
```

### 3. Configuración de Email Templates

Ve a **Authentication** → **Email Templates** y personaliza:

#### Template: Confirm Signup
```html
<h2>¡Bienvenido a Ayllu UNMSM! 🎓</h2>
<p>Hola,</p>
<p>Gracias por unirte a nuestra comunidad sanmarquina.</p>
<p>Haz clic en el botón para confirmar tu email:</p>
<a href="{{ .ConfirmationURL }}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Confirmar Email</a>
<p style="margin-top: 20px; color: #666; font-size: 14px;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
```

#### Template: Reset Password
```html
<h2>Restablecer Contraseña - Ayllu UNMSM</h2>
<p>Has solicitado restablecer tu contraseña.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<a href="{{ .ConfirmationURL }}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Restablecer Contraseña</a>
<p style="margin-top: 20px; color: #666; font-size: 14px;">Este enlace expira en 1 hora.</p>
<p style="color: #666; font-size: 14px;">Si no solicitaste esto, ignora este email.</p>
```

### 4. Trigger para Crear Perfil Automático

Ejecuta en **SQL Editor**:

```sql
-- Función para crear perfil automáticamente al registrarse
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

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
```

### 5. Políticas de Seguridad RLS

**IMPORTANTE**: Mantén RLS deshabilitado para desarrollo rápido:

```sql
-- Deshabilitar RLS temporalmente para desarrollo
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

**Para producción**, habilita RLS y crea políticas:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- ... resto de tablas

-- Políticas básicas
CREATE POLICY "Public profiles viewable by everyone"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Posts viewable by everyone"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ... más políticas según necesidad
```

---

## 🔍 Ver Emails en Desarrollo

Supabase incluye **Inbucket** para ver emails de prueba:

1. Ve a tu proyecto en Supabase
2. Navega a **Authentication** → **Logs**
3. O directamente: `https://app.supabase.com/project/[PROJECT-ID]/auth/emails`

Aquí verás todos los emails enviados durante el desarrollo.

---

## ✅ Checklist de Configuración

- [ ] Email provider habilitado
- [ ] "Confirm email" DESACTIVADO (permite login inmediato)
- [ ] Site URL configurada
- [ ] Redirect URLs configuradas
- [ ] Email templates personalizados
- [ ] Trigger de perfil automático creado
- [ ] RLS configurado según entorno
- [ ] Variables de entorno en `.env` correctas

---

## 🧪 Probar la Configuración

### Test 1: Registro
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'test@unmsm.edu.pe',
  password: 'password123',
  options: {
    data: {
      name: 'Usuario Test',
      faculty: 'Ingeniería',
      year: '1er año'
    }
  }
})
```

**Resultado esperado**: 
- ✅ Usuario creado
- ✅ Email de confirmación enviado
- ✅ Usuario puede iniciar sesión inmediatamente
- ✅ Perfil creado en tabla `users`

### Test 2: Login
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@unmsm.edu.pe',
  password: 'password123'
})
```

**Resultado esperado**:
- ✅ Login exitoso sin verificar email
- ✅ Sesión iniciada

### Test 3: Reset Password
```javascript
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'test@unmsm.edu.pe'
)
```

**Resultado esperado**:
- ✅ Email de reset enviado
- ✅ Link funcional en email

---

## 🚀 Flujos Completos

### Flujo de Registro
```
1. Usuario completa formulario
2. authService.signUp() crea cuenta en Supabase Auth
3. Trigger automático crea perfil en tabla users
4. Email de confirmación enviado
5. Usuario puede iniciar sesión inmediatamente (no espera confirmación)
6. Usuario opcionalmente confirma email desde el link
```

### Flujo de Login
```
1. Usuario ingresa email + contraseña
2. authService.signIn() valida credenciales
3. Supabase devuelve sesión (no verifica si email está confirmado)
4. App carga perfil del usuario
5. Usuario accede a la app
```

### Flujo de Recuperar Contraseña
```
1. Usuario ingresa email
2. authService.resetPassword() envía email
3. Usuario recibe email con link
4. Click en link → formulario de nueva contraseña
5. authService.updatePassword() actualiza contraseña
6. Usuario puede iniciar sesión con nueva contraseña
```

---

## 🔒 Seguridad en Producción

Antes de lanzar:

1. **Habilitar RLS** y crear políticas apropiadas
2. **Configurar SMTP** personalizado (no usar Inbucket)
3. **Validar dominios** de email (@unmsm.edu.pe)
4. **Rate limiting** en endpoints sensibles
5. **2FA** opcional para usuarios
6. **Logging y monitoreo** de actividad sospechosa

---

## 🐛 Troubleshooting

### "Email not confirmed" error
- **Solución**: Verifica que "Confirm email" esté OFF en Email provider

### Emails no llegan
- **Desarrollo**: Revisa Inbucket en Supabase Dashboard
- **Producción**: Verifica configuración SMTP

### Trigger no crea perfil
- **Solución**: Ejecuta el SQL del trigger nuevamente
- Verifica logs en **Database** → **Logs**

### RLS bloquea operaciones
- **Desarrollo**: Deshabilita RLS temporalmente
- **Producción**: Revisa y ajusta políticas

---

## 📞 Referencias

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**¡Tu sistema de autenticación está configurado profesionalmente!** 🎉