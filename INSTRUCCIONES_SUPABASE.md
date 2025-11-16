# 🎯 PASOS EXACTOS EN SUPABASE - Checklist Visual

## ⚠️ IMPORTANTE: Sigue estos pasos EXACTAMENTE en este orden

---

## ✅ PASO 1: Ejecutar Script SQL

### Acceder al SQL Editor
```
1. Abre: https://supabase.com/dashboard
2. Click en tu proyecto: "iwgnztlphuodjazeguup"
3. En el menú izquierdo, busca el icono 📊 "SQL Editor"
4. Click en "SQL Editor"
```

### Ejecutar el Script
```
1. Click en botón "+ New query" (esquina superior derecha)
2. Abre el archivo: setup-auth-supabase.sql
3. Copia TODO el contenido (Ctrl+A, Ctrl+C)
4. Pega en el editor SQL de Supabase (Ctrl+V)
5. Click en botón "Run" (▶️) en esquina superior derecha
6. Espera a ver: "Success. No rows returned"
```

### Verificar que funcionó
```
En el mismo SQL Editor, ejecuta este query:

SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

Deberías ver:
┌─────────────────────────┐
│ on_auth_user_created    │
└─────────────────────────┘
```

**✅ Si ves esto, el trigger está creado correctamente**

---

## ✅ PASO 2: Desactivar Verificación de Email

### Navegar a Authentication
```
1. En el menú izquierdo, busca el icono 🔐 "Authentication"
2. Click en "Authentication"
3. Click en "Providers" (en el submenú)
4. Busca "Email" en la lista y click en él
```

### Configurar Email Provider
```
Asegúrate que esté EXACTAMENTE así:

╔═══════════════════════════════════════╗
║ Email Provider Settings               ║
╠═══════════════════════════════════════╣
║                                       ║
║ ✅ Enable Email provider              ║
║    [X] (checkbox MARCADO)             ║
║                                       ║
║ ❌ Confirm email                      ║
║    [ ] (checkbox SIN MARCAR) ← CLAVE ║
║                                       ║
║ ❌ Secure email change                ║
║    [ ] (checkbox SIN MARCAR)          ║
║                                       ║
║ Minimum password length: 6            ║
║                                       ║
╚═══════════════════════════════════════╝

CLICK EN "SAVE" (botón verde abajo a la derecha)
```

**⚠️ MUY IMPORTANTE:** 
- "Confirm email" debe estar **SIN MARCAR** (OFF)
- Si está marcado, los usuarios NO podrán hacer login

---

## ✅ PASO 3: Configurar URLs

### Navegar a URL Configuration
```
1. Sigue en "Authentication" (mismo lugar)
2. Click en "URL Configuration" (en el submenú)
```

### Configurar Site URL
```
Encuentra el campo "Site URL" y pon EXACTAMENTE:

Site URL:
┌────────────────────────────┐
│ http://localhost:5173      │
└────────────────────────────┘
```

### Configurar Redirect URLs
```
Encuentra "Additional Redirect URLs" y agrega LÍNEA POR LÍNEA:

Additional Redirect URLs:
┌────────────────────────────────────┐
│ http://localhost:5173/**           │
│ http://localhost:5173/verify-email │
│ http://localhost:5173/reset-password│
└────────────────────────────────────┘

(Click "+ Add URL" después de poner cada una)
```

**CLICK EN "SAVE"**

---

## ✅ PASO 4: Personalizar Email Templates (OPCIONAL)

### Template de Confirmación
```
1. Sigue en "Authentication"
2. Click en "Email Templates" (en el submenú)
3. Click en "Confirm signup"
4. REEMPLAZA TODO con esto:
```

```html
<h2>¡Bienvenido a Ayllu UNMSM! 🎓</h2>
<p>Hola,</p>
<p>Gracias por unirte a nuestra comunidad sanmarquina.</p>
<p>Haz clic en el botón para confirmar tu email:</p>
<a href="{{ .ConfirmationURL }}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Confirmar Email</a>
<p style="color: #666; font-size: 14px;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
```

**CLICK EN "SAVE"**

### Template de Reset Password
```
1. En el mismo lugar, click en "Reset password"
2. REEMPLAZA TODO con esto:
```

```html
<h2>Restablecer Contraseña - Ayllu UNMSM</h2>
<p>Has solicitado restablecer tu contraseña.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<a href="{{ .ConfirmationURL }}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Restablecer Contraseña</a>
<p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora.</p>
```

**CLICK EN "SAVE"**

---

## ✅ PASO 5: Verificar Configuración Final

### Verificar Trigger
```
1. Ve a SQL Editor nuevamente
2. Ejecuta:

SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

Deberías ver:
┌──────────────────────┬─────────────────────┬──────────────────┐
│ on_auth_user_created │ INSERT              │ users            │
└──────────────────────┴─────────────────────┴──────────────────┘
```

### Verificar RLS
```
Ejecuta:

SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'posts', 'likes', 'comments');

Deberías ver rowsecurity = false (f) para todas:
┌───────────┬─────────────┐
│ users     │ f           │
│ posts     │ f           │
│ likes     │ f           │
│ comments  │ f           │
└───────────┴─────────────┘
```

---

## 📋 CHECKLIST FINAL

Marca cada uno cuando lo completes:

```
[ ] PASO 1: Script SQL ejecutado exitosamente
    └─ Verificado: Trigger existe

[ ] PASO 2: Email provider configurado
    └─ "Confirm email" está OFF (sin marcar)
    └─ Cambios guardados (Save)

[ ] PASO 3: URLs configuradas
    └─ Site URL: http://localhost:5173
    └─ Redirect URLs agregadas (3 URLs)
    └─ Cambios guardados (Save)

[ ] PASO 4: Email templates personalizados (opcional)
    └─ Confirm signup actualizado
    └─ Reset password actualizado
    └─ Cambios guardados (Save)

[ ] PASO 5: Verificación final
    └─ Trigger existe en base de datos
    └─ RLS deshabilitado (rowsecurity = f)
```

---

## 🧪 PROBAR LA CONFIGURACIÓN

### En la Terminal
```bash
npm run dev
```

### En el Navegador
```
1. Abre: http://localhost:5173
2. Deberías ver la pantalla de Ayllu UNMSM
```

### Crear Cuenta de Prueba
```
1. Click en "Crear cuenta"
2. Llena:
   Email:     test@unmsm.edu.pe
   Nombre:    Test User
   Carrera:   Ingeniería de Sistemas
   Password:  password123
   Repetir:   password123
3. Click "Crear cuenta gratis"
4. Deberías ver: ✅ Cuenta creada exitosamente
```

### Iniciar Sesión
```
1. Espera 3 segundos (redirección automática a login)
   O haz click en "Iniciar sesión" manualmente
2. Ingresa:
   Email:     test@unmsm.edu.pe
   Password:  password123
3. Click "Iniciar Sesión"
4. Deberías ENTRAR INMEDIATAMENTE a la app ✅
```

### Ver Emails (Opcional)
```
1. Ve a Supabase Dashboard
2. Click en "Authentication" → "Logs"
3. O directamente:
   https://app.supabase.com/project/iwgnztlphuodjazeguup/auth/emails
4. Verás el email de confirmación enviado
```

---

## ❌ PROBLEMAS COMUNES

### "Email not confirmed" al hacer login
```
CAUSA: "Confirm email" está ON en Email Provider
SOLUCIÓN: Ve a Authentication → Providers → Email
          Desmarca "Confirm email"
          Click Save
```

### "Invalid login credentials"
```
CAUSA: Usuario no existe o contraseña incorrecta
SOLUCIÓN: Verifica que creaste la cuenta primero
          O intenta registrarte de nuevo
```

### No se crea el perfil
```
CAUSA: Trigger no está creado
SOLUCIÓN: Ejecuta el script SQL nuevamente (PASO 1)
          Verifica con el query de verificación
```

### RLS bloquea operaciones
```
CAUSA: RLS no está deshabilitado
SOLUCIÓN: Ejecuta en SQL Editor:
          ALTER TABLE users DISABLE ROW LEVEL SECURITY;
          ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
          ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
          ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```

---

## 🎉 ÉXITO

Si completaste todos los pasos y pudiste iniciar sesión, 

**¡FELICIDADES! Tu sistema de autenticación está funcionando correctamente.**

```
╔══════════════════════════════════════╗
║     ✅ CONFIGURACIÓN COMPLETA        ║
║                                      ║
║  Tu app ahora funciona con:          ║
║  • Login sin verificación de email   ║
║  • Registro con email confirmación   ║
║  • Recuperación de contraseña        ║
║  • Perfiles automáticos              ║
║                                      ║
║       ¡Disfruta tu aplicación!       ║
╚══════════════════════════════════════╝
```

---

**Tiempo estimado:** 5-10 minutos  
**Dificultad:** Fácil (solo seguir pasos)  
**Resultado:** Sistema de autenticación profesional
