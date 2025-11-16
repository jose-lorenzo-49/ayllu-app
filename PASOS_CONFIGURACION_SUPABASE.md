# 🚀 PASOS PARA CONFIGURAR SUPABASE - AYLLU UNMSM

## ⚡ CONFIGURACIÓN RÁPIDA (5 minutos)

### Paso 1: Ejecutar SQL
1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Click en **SQL Editor** (icono de consola en la barra lateral)
3. Click en **New Query**
4. Copia TODO el contenido de `supabase-setup-complete.sql`
5. Pega en el editor y click **Run** o presiona `Ctrl+Enter`
6. Espera a que termine (verás "Success. No rows returned")

### Paso 2: Configurar Authentication (MUY IMPORTANTE)
1. Ve a **Authentication** → **Settings** (en la barra lateral)
2. Busca la sección **Email Auth**
3. Configura así:

```
✅ Enable Email Signup: ON
✅ Confirm Email: OFF   ← IMPORTANTE: Debe estar APAGADO
✅ Secure Email Change: OFF
✅ Minimum Password Length: 6
```

4. Scroll hasta **Site URL** y configura:
```
Site URL: http://localhost:5173
```

5. En **Redirect URLs** agrega:
```
http://localhost:5173/*
```

6. Click **Save** en la parte inferior

### Paso 3: Verificar Configuración
1. Ve a **Authentication** → **Users**
2. Debería estar vacío (está bien, crearás usuarios desde la app)

### Paso 4: Verificar Tablas
1. Ve a **Table Editor**
2. Deberías ver estas tablas:
   - users
   - posts
   - likes
   - comments
   - connections
   - conversations
   - messages
   - notifications

3. Click en cada tabla y verifica que **RLS is enabled** aparezca en la parte superior

### Paso 5: Probar la Aplicación
1. En tu terminal, ejecuta:
```bash
npm run dev
```

2. Abre http://localhost:5173

3. **REGISTRA UN NUEVO USUARIO**:
   - Click en "Crear cuenta"
   - Email: tunombre@unmsm.edu.pe
   - Nombre: Tu Nombre
   - Carrera: Selecciona una
   - Contraseña: mínimo 6 caracteres
   - Click "Crear cuenta gratis"

4. **Deberías entrar automáticamente a la app** 🎉

5. **Verifica en Supabase**:
   - Ve a **Authentication** → **Users**
   - Deberías ver tu usuario creado
   - Ve a **Table Editor** → **users**
   - Deberías ver tu perfil

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### ❌ "Invalid login credentials"
- El usuario no existe
- La contraseña es incorrecta
- **Solución**: Registra un nuevo usuario primero

### ❌ "Email confirmations: ON"
- La verificación de email está activada
- **Solución**: 
  1. Ve a Authentication → Settings
  2. Desactiva "Confirm Email"
  3. Guarda cambios
  4. Intenta registrarte de nuevo

### ❌ "Error creando perfil"
- RLS policies no están bien configuradas
- **Solución**:
  1. Ve a SQL Editor
  2. Ejecuta: `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`
  3. Vuelve a ejecutar el script completo

### ❌ "currentUser is null"
- No has iniciado sesión
- **Solución**: Primero regístrate, luego inicia sesión

### ❌ Posts no se cargan
- Tabla vacía (normal en inicio)
- **Solución**: Crea tu primer post desde la app

---

## ✅ CHECKLIST DE CONFIGURACIÓN

Marca cada paso cuando esté completo:

- [ ] 1. Script SQL ejecutado exitosamente
- [ ] 2. Authentication Settings configurado (Confirm Email: OFF)
- [ ] 3. Site URL configurada
- [ ] 4. Redirect URLs configuradas
- [ ] 5. Tablas creadas (8 tablas visibles)
- [ ] 6. RLS habilitado en todas las tablas
- [ ] 7. Trigger handle_new_user creado
- [ ] 8. `npm run dev` ejecutado
- [ ] 9. Usuario de prueba registrado exitosamente
- [ ] 10. Login funciona correctamente

---

## 🎯 FLUJO ESPERADO

### REGISTRO:
```
1. Usuario llena formulario
2. Click "Crear cuenta"
3. Supabase crea usuario en auth.users
4. Trigger automático crea perfil en users
5. Auto-login (sesión iniciada)
6. Redirige a la app principal
```

### LOGIN:
```
1. Usuario ingresa email y contraseña
2. Click "Iniciar sesión"
3. Supabase valida credenciales
4. Carga perfil desde tabla users
5. Redirige a la app principal
```

### RECUPERAR CONTRASEÑA:
```
1. Click "¿Olvidaste tu contraseña?"
2. Ingresa email
3. Supabase envía email (ve a Inbucket en desarrollo)
4. Click en link del email
5. Ingresa nueva contraseña
6. Confirmación
```

---

## 📧 VER EMAILS EN DESARROLLO

Supabase incluye **Inbucket** para ver emails de prueba:

1. Ve a **Project Settings** → **Email**
2. Scroll hasta **Inbucket**
3. Click en el link que dice "View Inbucket"
4. Ahí verás todos los emails enviados por tu app

---

## 🚀 DEPLOY A PRODUCCIÓN

Cuando estés listo para producción:

1. **Actualizar variables de entorno en Vercel**:
```
VITE_SUPABASE_URL=tu-url-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

2. **Actualizar Site URL en Supabase**:
```
Site URL: https://tu-app.vercel.app
Redirect URLs: https://tu-app.vercel.app/*
```

3. **Configurar SMTP real** (no usar Inbucket):
   - Ve a Project Settings → Email
   - Configura tu proveedor SMTP (Gmail, SendGrid, etc.)

4. **Activar Email Confirmations** (opcional):
   - Si quieres que los usuarios confirmen su email
   - Ve a Authentication → Settings
   - Activa "Confirm Email"

---

¡Listo! Tu app Ayllu UNMSM está configurada y lista para usar. 🎉
