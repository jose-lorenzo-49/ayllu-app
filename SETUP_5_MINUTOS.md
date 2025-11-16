# 🎯 CONFIGURACIÓN RÁPIDA - 5 MINUTOS

## ⚡ Setup Express de Supabase para Ayllu UNMSM

Sigue estos pasos en **orden** para tener la app funcionando en 5 minutos.

---

## 📍 PASO 1: Ejecutar SQL Script (2 min)

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Click en **SQL Editor** (icono de código SQL en el menú izquierdo)
3. Click en **"New query"**
4. Copia y pega TODO el contenido de `setup-auth-supabase.sql`
5. Click en **"Run"** (▶️)
6. Verifica que veas: ✅ Success

**Qué hace este script:**
- ✅ Crea trigger para perfil automático
- ✅ Deshabilita RLS para desarrollo
- ✅ Crea índices para performance
- ✅ Crea funciones helper

---

## 📍 PASO 2: Configurar Email Provider (1 min)

1. Ve a **Authentication** → **Providers** (en el menú izquierdo)
2. Click en **Email**
3. **CRÍTICO**: Asegúrate que estén así:
   ```
   ✅ Enable Email provider: ON (activado)
   ❌ Confirm email: OFF (desactivado) ← IMPORTANTE
   ❌ Secure email change: OFF (desactivado)
   ```
4. Click en **Save**

**Por qué:** Esto permite login inmediato sin verificar email.

---

## 📍 PASO 3: Configurar URLs (1 min)

1. Ve a **Authentication** → **URL Configuration**
2. Configura:

```
Site URL:
http://localhost:5173

Additional Redirect URLs:
http://localhost:5173/**
http://localhost:5173/verify-email
http://localhost:5173/reset-password
```

3. Click en **Save**

**Para producción**, agrega también:
```
https://tu-dominio.vercel.app/**
https://tu-dominio.vercel.app/verify-email
https://tu-dominio.vercel.app/reset-password
```

---

## 📍 PASO 4: Personalizar Email Templates (1 min - Opcional)

1. Ve a **Authentication** → **Email Templates**
2. Click en **"Confirm signup"**
3. Pega este HTML:

```html
<h2>¡Bienvenido a Ayllu UNMSM! 🎓</h2>
<p>Hola,</p>
<p>Gracias por unirte a nuestra comunidad sanmarquina.</p>
<p>Haz clic en el botón para confirmar tu email:</p>
<a href="{{ .ConfirmationURL }}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Confirmar Email</a>
<p style="color: #666; font-size: 14px;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
<p style="color: #999; font-size: 12px; margin-top: 30px;">Ayllu UNMSM - Red Social Estudiantil</p>
```

4. Click en **Save**

5. Click en **"Reset password"**
6. Pega este HTML:

```html
<h2>Restablecer Contraseña - Ayllu UNMSM</h2>
<p>Has solicitado restablecer tu contraseña.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<a href="{{ .ConfirmationURL }}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Restablecer Contraseña</a>
<p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora.</p>
<p style="color: #666; font-size: 14px;">Si no solicitaste esto, ignora este email.</p>
<p style="color: #999; font-size: 12px; margin-top: 30px;">Ayllu UNMSM - Red Social Estudiantil</p>
```

7. Click en **Save**

---

## 📍 PASO 5: Verificar Configuración (30 seg)

1. Ve a **SQL Editor**
2. Ejecuta este query:

```sql
-- Verificar trigger
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Debería retornar: on_auth_user_created
```

Si ves el trigger, ¡todo está listo! ✅

---

## 🚀 INICIAR LA APP

```bash
# En tu terminal
npm run dev
```

Abre: http://localhost:5173

---

## 🧪 PROBAR REGISTRO

1. Click en **"Crear cuenta"**
2. Llena el formulario:
   - Email: `test@unmsm.edu.pe`
   - Nombre: `Usuario Test`
   - Carrera: Ingeniería de Sistemas
   - Contraseña: `password123`
   - Repetir: `password123`
3. Click en **"Crear cuenta gratis"**
4. Deberías ver: ✅ "Cuenta creada exitosamente"

---

## 🧪 PROBAR LOGIN

1. En el formulario de login:
   - Email: `test@unmsm.edu.pe`
   - Contraseña: `password123`
2. Click en **"Iniciar Sesión"**
3. Deberías entrar **inmediatamente** a la app ✅

---

## 🔍 VER EMAILS DE PRUEBA

Para ver los emails enviados:

1. Ve a tu proyecto Supabase
2. Click en **Authentication** → **Logs**
3. O ve directamente a:
   ```
   https://app.supabase.com/project/[TU-PROJECT-ID]/auth/emails
   ```

Ahí verás todos los emails de confirmación y reset.

---

## ✅ CHECKLIST FINAL

Marca cada item cuando lo completes:

- [ ] Script SQL ejecutado (Paso 1)
- [ ] "Confirm email" DESACTIVADO (Paso 2)
- [ ] Site URL configurada (Paso 3)
- [ ] Redirect URLs configuradas (Paso 3)
- [ ] Email templates personalizados (Paso 4 - opcional)
- [ ] Trigger verificado (Paso 5)
- [ ] App corriendo con `npm run dev`
- [ ] Registro probado exitosamente
- [ ] Login probado exitosamente

---

## 🐛 PROBLEMAS COMUNES

### "Invalid login credentials"
**Solución**: Asegúrate que el usuario existe. Intenta registrarte de nuevo.

### "Email not confirmed"
**Solución**: Ve a Authentication → Providers → Email y **DESACTIVA** "Confirm email"

### No recibo emails
**Solución**: En desarrollo, los emails se ven en Inbucket (Authentication → Logs)

### RLS bloquea operaciones
**Solución**: Verifica que ejecutaste el script SQL que desactiva RLS

---

## 📊 RESUMEN DE CONFIGURACIÓN

```
✅ Trigger de perfil: Creado
✅ RLS: Deshabilitado (desarrollo)
✅ Email confirmations: OFF
✅ Site URL: Configurada
✅ Redirect URLs: Configuradas
✅ Email templates: Personalizados
```

---

## 🎉 ¡LISTO!

Tu app ahora funciona como una red social profesional:

- ✅ Login sin verificación de email
- ✅ Registro con email de confirmación
- ✅ Recuperación de contraseña
- ✅ Perfiles automáticos
- ✅ Sesiones persistentes

**Tiempo total: ~5 minutos**

---

## 📚 MÁS INFORMACIÓN

Para configuración avanzada, revisa:
- `SUPABASE_AUTH_CONFIG.md` - Guía completa
- `QUICKSTART_AUTH.md` - Inicio rápido
- `IMPLEMENTACION_AUTH_COMPLETA.md` - Resumen técnico

---

**¿Problemas?** Revisa la consola del navegador y los logs de Supabase.

**¡Disfruta tu app!** 🚀
