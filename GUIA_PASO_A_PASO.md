# 🎯 INSTRUCCIONES EXACTAS - CONFIGURAR SUPABASE

## ⚡ SIGUE ESTOS PASOS UNO POR UNO

### PASO 1: Ir a Supabase Dashboard
1. Abre tu navegador
2. Ve a: https://supabase.com/dashboard
3. Click en tu proyecto: **iwgnztlphuodjazeguup**

---

### PASO 2: Ejecutar el Script SQL ✅

1. En la barra lateral izquierda, busca el icono **</> SQL Editor**
2. Click en **SQL Editor**
3. Click en el botón verde **"New query"** (arriba a la derecha)
4. Abre el archivo: `supabase-setup-complete.sql` de tu proyecto
5. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)
6. **Pega** en el editor SQL de Supabase (Ctrl+V)
7. Click en el botón **"Run"** (esquina inferior derecha) o presiona **Ctrl+Enter**
8. Espera 5-10 segundos
9. Deberías ver: **"Success. No rows returned"** ✅

---

### PASO 3: Configurar Authentication Settings ⚙️

1. En la barra lateral izquierda, busca el icono **🔒 Authentication**
2. Click en **Authentication**
3. Luego click en **Settings** (en el submenú)
4. Scroll hacia abajo hasta la sección **"Email Auth"**

#### CONFIGURACIÓN EXACTA:

```
✅ Enable Email provider: ON
✅ Confirm email: OFF    ← MUY IMPORTANTE! DEBE ESTAR OFF
✅ Secure email change: OFF
✅ Secure password change: OFF (opcional)
```

5. Más abajo, en **"Auth Settings"**:

```
Site URL: http://localhost:5173
```

6. En **"Redirect URLs"** agrega:

```
http://localhost:5173/*
http://localhost:5173
```

7. Scroll hasta abajo y click **"Save"** (botón verde)

---

### PASO 4: Verificar que Todo Esté Bien ✅

#### 4.1 Verificar Tablas

1. En la barra lateral, click en el icono **📊 Table Editor**
2. Deberías ver estas 8 tablas:
   - ✅ users
   - ✅ posts
   - ✅ likes
   - ✅ comments
   - ✅ connections
   - ✅ conversations
   - ✅ messages
   - ✅ notifications

3. Click en cada tabla y verifica que diga: **"RLS is enabled"** (arriba)

#### 4.2 Verificar Authentication

1. Click en **🔒 Authentication**
2. Click en **Users**
3. Debería estar vacío (está bien, crearás usuarios desde la app)

#### 4.3 Verificar Configuración

1. Click en **🔒 Authentication** → **Settings**
2. Verifica que:
   - ✅ "Confirm email" esté **OFF**
   - ✅ "Site URL" sea `http://localhost:5173`

---

### PASO 5: Probar la Aplicación 🚀

#### 5.1 Iniciar el Servidor

En tu terminal (VS Code):
```bash
npm run dev
```

Deberías ver:
```
VITE v4.5.14  ready in 298 ms

➜  Local:   http://localhost:5173/
```

#### 5.2 Abrir la App

1. Abre tu navegador
2. Ve a: http://localhost:5173
3. Deberías ver la página de bienvenida de Ayllu UNMSM

#### 5.3 Registrar un Usuario

1. Click en **"Crear cuenta"**
2. Llena el formulario:
   - **Email**: `tunombre@unmsm.edu.pe` (DEBE terminar en @unmsm.edu.pe)
   - **Nombre**: Tu nombre completo
   - **Carrera**: Selecciona una de la lista
   - **Contraseña**: Mínimo 6 caracteres
   - **Repetir Contraseña**: La misma contraseña
3. Click **"Crear cuenta gratis"**
4. **Deberías entrar automáticamente a la app** 🎉

#### 5.4 Verificar en Supabase

1. Vuelve a Supabase Dashboard
2. Click en **🔒 Authentication** → **Users**
3. Deberías ver tu usuario recién creado ✅
4. Click en **📊 Table Editor** → **users**
5. Deberías ver tu perfil con tu información ✅

---

## ✅ CHECKLIST FINAL

Marca cada ítem cuando esté completo:

- [ ] SQL Script ejecutado exitosamente
- [ ] 8 tablas creadas visibles en Table Editor
- [ ] RLS habilitado en todas las tablas
- [ ] Authentication Settings configurado
- [ ] "Confirm email" está OFF
- [ ] Site URL configurada
- [ ] Servidor `npm run dev` corriendo
- [ ] Página abre en http://localhost:5173
- [ ] Usuario registrado exitosamente
- [ ] Entraste automáticamente a la app
- [ ] Usuario visible en Authentication → Users
- [ ] Perfil visible en Table Editor → users

---

## 🎯 ¿QUÉ DEBERÍA PASAR?

### AL REGISTRARTE:
```
1. Llenas el formulario
2. Click "Crear cuenta"
3. ⏳ Loading...
4. ✅ Entras automáticamente a la app
5. Ves el feed (vacío porque no hay posts aún)
```

### AL HACER LOGIN:
```
1. Ingresas email y contraseña
2. Click "Iniciar sesión"  
3. ⏳ Loading...
4. ✅ Entras a la app
5. Ves el feed con tus conexiones
```

---

## ❌ PROBLEMAS COMUNES

### "Invalid login credentials"
**Causa**: El usuario no existe  
**Solución**: Primero regístrate, luego inicia sesión

### "Email confirmations: ON"
**Causa**: No desactivaste "Confirm email"  
**Solución**:
1. Ve a Authentication → Settings
2. Busca "Confirm email"
3. Asegúrate que esté **OFF**
4. Click "Save"
5. Intenta registrarte de nuevo

### "Error creating profile"
**Causa**: No ejecutaste el SQL script  
**Solución**:
1. Ve a SQL Editor
2. Ejecuta `supabase-setup-complete.sql` completo
3. Intenta registrarte de nuevo

### La app no carga / Pantalla blanca
**Causa**: Servidor no está corriendo  
**Solución**:
1. Abre terminal
2. `npm run dev`
3. Espera a que diga "ready"
4. Recarga http://localhost:5173

---

## 🎉 ¡LISTO!

Si todo salió bien:
- ✅ Tienes un usuario registrado
- ✅ Puedes hacer login/logout
- ✅ Puedes crear posts
- ✅ Puedes buscar otros usuarios
- ✅ Puedes editar tu perfil

**Siguiente paso**: Registra 2-3 usuarios más para probar:
- Conexiones entre usuarios
- Sistema de mensajería
- Feed con posts de conexiones

---

## 📧 VER EMAILS (DESARROLLO)

Para ver emails de recuperación de contraseña:

1. Ve a Supabase Dashboard
2. Click en **⚙️ Project Settings** (icono de engranaje, abajo)
3. Click en **Email**
4. Scroll hasta **"Inbucket"**
5. Click en el link azul "View Inbucket"
6. Ahí verás todos los emails que envía tu app

---

**¿Necesitas ayuda?**
- Revisa la consola del navegador (F12)
- Revisa los logs en Supabase Dashboard
- Asegúrate que "Confirm email" esté OFF
