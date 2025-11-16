# 🚀 Guía de Inicio Rápido - Ayllu UNMSM

## ✅ Pulido Final Completado

### 🎨 Mejoras UX Implementadas:

#### 1. **Registro de Usuario**
- ✨ Mensaje de bienvenida: "¡Bienvenido a Ayllu! 🎉"
- ✨ Auto-login inmediato después del registro
- ✨ Transición suave de 1.5 segundos
- ✨ Si el email ya existe → cambia automáticamente a login

#### 2. **Inicio de Sesión**
- ✅ Errores en español profesional
- ✅ "❌ Email o contraseña incorrectos. Por favor verifica tus credenciales."
- ✅ "✉️ Tu email aún no está confirmado. Revisa tu bandeja de entrada."

#### 3. **Recuperación de Contraseña**
- 📧 Mensaje: "¡Listo! Revisa tu bandeja de entrada. Te hemos enviado un link..."
- ⏱️ Límite de 10 minutos entre solicitudes
- 🇪🇸 Todos los mensajes en español

#### 4. **Cambio de Contraseña (Después del Email)**
- ✅ Mensaje: "Contraseña actualizada exitosamente. Redirigiendo..."
- 🔄 Auto-redirect al login después de 2 segundos
- 📧 Email precargado en el formulario de login
- 🔒 Cierra sesión automáticamente para mayor seguridad

#### 5. **Notificaciones**
- 🔔 Estructura consistente (type, userId, timestamp, read)
- 💬 Tipos: 'like', 'comment', 'follow', 'message'
- 🇪🇸 Acciones en español: "le gustó tu publicación", "comenzó a seguirte"

#### 6. **Mensajes**
- 💌 Campo `senderId` unificado
- ✅ Compatible con Supabase y datos locales
- 📱 Último mensaje visible en lista de conversaciones

#### 7. **Seguir en vez de Conectar**
- 👥 "Seguir" en página de descubrir
- ✅ "Siguiendo" cuando ya estás conectado
- 🎯 UX típica de red social

---

## 🔧 Configuración Rápida

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Copia el archivo de ejemplo
copy .env.example .env

# Edita .env y agrega tus credenciales de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-key-aqui
```

### 3. Configurar Supabase

#### Base de Datos:
1. Abre Supabase Dashboard → SQL Editor
2. Ejecuta `supabase-schema.sql` (crea tablas)
3. Ejecuta `supabase-policies.sql` (configura seguridad)

#### Autenticación:
1. Ve a Authentication → Settings
2. Site URL: `http://localhost:5173`
3. Redirect URLs: 
   - `http://localhost:5173`
   - `http://localhost:5173/reset-password`

#### Storage (para imágenes):
1. Ve a Storage → Create bucket
2. Nombre: `images`
3. Public bucket: ✅ true
4. Allowed MIME types: `image/*`
5. Max file size: `5MB`

### 4. Ejecutar la App
```bash
npm run dev
```

La app estará en: `http://localhost:5173`

---

## 📊 Datos de Prueba Incluidos

La app incluye 5 usuarios de prueba con contenido realista:

### Usuarios Demo:
1. **María González** (Derecho) - maria@unmsm.edu.pe
2. **Carlos Ramírez** (Ing. Sistemas) - carlos@unmsm.edu.pe
3. **Ana Flores** (Medicina) - ana@unmsm.edu.pe
4. **Luis Torres** (Administración) - luis@unmsm.edu.pe
5. **Sofía Mendoza** (Psicología) - sofia@unmsm.edu.pe

### Contenido incluido:
- ✅ 7 publicaciones variadas
- ✅ Likes y comentarios
- ✅ 3 conversaciones activas
- ✅ 5 notificaciones

---

## ✅ Checklist de Endpoints Funcionales

### Authentication (Supabase Auth)
- ✅ `POST /auth/v1/signup` - Registro
- ✅ `POST /auth/v1/token` - Login
- ✅ `POST /auth/v1/recover` - Recuperar contraseña
- ✅ `POST /auth/v1/user` - Actualizar contraseña
- ✅ `POST /auth/v1/logout` - Cerrar sesión

### Database (Supabase REST API)
- ✅ `/rest/v1/users` - Perfiles de usuarios
- ✅ `/rest/v1/posts` - Publicaciones
- ✅ `/rest/v1/comments` - Comentarios
- ✅ `/rest/v1/likes` - Likes
- ✅ `/rest/v1/connections` - Seguimientos
- ✅ `/rest/v1/notifications` - Notificaciones
- ✅ `/rest/v1/conversations` - Conversaciones
- ✅ `/rest/v1/messages` - Mensajes directos

### Storage (Supabase Storage)
- ✅ `/storage/v1/object/images/*` - Subir/obtener imágenes

---

## 🎯 Flujos Completos Implementados

### Flujo de Registro ✅
1. Usuario ingresa datos → Validación en frontend
2. Crea cuenta en Supabase Auth
3. Trigger automático crea perfil en tabla `users`
4. Auto-login inmediato
5. Mensaje: "¡Bienvenido a Ayllu! 🎉"
6. Redirect a app después de 1.5s

### Flujo de Login ✅
1. Usuario ingresa email/password
2. Supabase valida credenciales
3. Carga perfil completo desde tabla `users`
4. Carga datos (posts, notificaciones, mensajes)
5. Redirect a feed principal

### Flujo de Reset Password ✅
1. Usuario solicita reset → Email a Supabase
2. Supabase envía email con link mágico
3. Usuario hace click → Abre app con token en URL
4. Ingresa nueva contraseña
5. Actualiza en Supabase Auth
6. Cierra sesión automática
7. Redirect a login con email precargado
8. Usuario hace login con nueva contraseña

### Flujo de Publicación ✅
1. Usuario escribe post (opcional: sube imagen)
2. Valida tamaño (5MB) y tipo de archivo
3. Sube imagen a Supabase Storage
4. Crea post en tabla `posts` con URL de imagen
5. Actualiza feed en tiempo real
6. Crea notificaciones para seguidores

---

## 🐛 Bugs Corregidos en Pulido Final

1. ✅ **Notificaciones** - Estructura de datos unificada
2. ✅ **Mensajes** - Campo `senderId` consistente
3. ✅ **"Conectar" → "Seguir"** - UX de red social
4. ✅ **Errores en español** - Traducciones profesionales
5. ✅ **Reset password** - Auto-redirect con email precargado
6. ✅ **Email duplicado** - Cambio automático a login

---

## 🚀 Listo para Producción

### Antes de deployar:
1. ✅ Todos los endpoints funcionando
2. ✅ Mensajes en español
3. ✅ UX pulida y profesional
4. ✅ Datos de prueba incluidos
5. ✅ Validaciones frontend/backend
6. ✅ Rate limiting (10 min reset password)
7. ✅ Error handling completo

### Para deploy en Vercel:
```bash
# Agrega las variables de entorno en Vercel Dashboard:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-key-aqui

# Deploy
vercel deploy --prod
```

### Actualizar URLs en Supabase (Producción):
1. Authentication → Settings → Site URL: `https://tu-app.vercel.app`
2. Redirect URLs: Agregar `https://tu-app.vercel.app/reset-password`

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que `.env` tenga las credenciales correctas
2. Revisa que las tablas estén creadas en Supabase
3. Verifica que el bucket `images` exista y sea público
4. Checa la consola del navegador para errores

---

## 🎉 ¡Todo Listo!

La aplicación está completamente pulida y lista para usar. Todos los endpoints están funcionando, los mensajes están en español, y la UX es profesional y típica de una red social moderna.

**¡A disfrutar de Ayllu UNMSM! 🎓💙❤️**
