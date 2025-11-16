# 🧪 Script de Prueba Rápida - Ayllu UNMSM

## Prueba Completa en 5 Minutos

### ✅ PASO 1: Verificar Base de Datos (1 min)

1. Ir a Supabase Dashboard → SQL Editor
2. Ejecutar esta query para verificar tablas:

```sql
SELECT 
  table_name 
FROM 
  information_schema.tables 
WHERE 
  table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY 
  table_name;
```

**Resultado esperado:** Debe mostrar estas 8 tablas:
- comments
- connections
- conversations
- likes
- messages
- notifications
- posts
- users

3. Verificar que RLS está habilitado:

```sql
SELECT 
  tablename, 
  rowsecurity 
FROM 
  pg_tables 
WHERE 
  schemaname = 'public';
```

**Resultado esperado:** Todas las tablas deben tener `rowsecurity = true`

---

### ✅ PASO 2: Iniciar la Aplicación (30 seg)

```powershell
# En la terminal de VS Code
npm run dev
```

**Resultado esperado:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### ✅ PASO 3: Registrar Usuario de Prueba (1 min)

1. Abrir http://localhost:5173/
2. Click en **"Registrarse"**
3. Llenar formulario:
   - **Email:** prueba@unmsm.edu.pe
   - **Nombre:** Usuario Prueba
   - **Carrera:** Ingeniería de Sistemas
   - **Contraseña:** 123456
   - **Confirmar:** 123456
4. Click en **"Crear Cuenta"**

**✅ Resultado esperado:**
- Auto-login exitoso
- Redirige a feed principal
- Se ve el nombre del usuario en el header
- Carga posts de demostración

**❌ Si falla:**
- Abrir consola del navegador (F12 → Console)
- Verificar errores
- Ver sección Troubleshooting en SISTEMA_COMPLETO_FUNCIONANDO.md

---

### ✅ PASO 4: Crear Post (30 seg)

1. En el cuadro de texto escribir:
   ```
   🚀 ¡Primera publicación de prueba! Ayllu UNMSM está funcionando perfectamente.
   ```

2. Click en **"Publicar"**

**✅ Resultado esperado:**
- El post aparece inmediatamente en el feed
- Muestra tu nombre y avatar
- Timestamp "Hace unos segundos"

**Verificar en Supabase:**
1. Dashboard → Table Editor → posts
2. Debe aparecer tu nuevo post

---

### ✅ PASO 5: Dar Like y Comentar (30 seg)

**Like:**
1. Click en ❤️ de cualquier post
2. El número debe incrementar (+1)
3. El corazón se llena de color

**Comentario:**
1. Click en 💬 del mismo post
2. Escribir: "Excelente publicación!"
3. Presionar Enter
4. El comentario aparece con tu nombre y avatar

**Verificar en Supabase:**
1. Table Editor → likes (debe tener tu like)
2. Table Editor → comments (debe tener tu comentario)
3. Table Editor → notifications (debe tener 2 notificaciones creadas)

---

### ✅ PASO 6: Conectar con Usuario (30 seg)

1. Click en icono **"Conexiones"** (👥)
2. Buscar "María Castro" o cualquier usuario
3. Click en **"Conectar"**

**✅ Resultado esperado:**
- Botón cambia a "Pendiente" o "Conectado"
- Aparece en tu lista de conexiones

**Verificar en Supabase:**
- Table Editor → connections (debe aparecer la conexión)

---

### ✅ PASO 7: Enviar Mensaje (30 seg)

1. Click en icono **"Mensajes"** (✉️)
2. Click en **"Mensaje"** de algún usuario conectado
3. Escribir: "Hola! ¿Cómo estás?"
4. Click en enviar (→)

**✅ Resultado esperado:**
- El mensaje aparece en la conversación
- Se ve tu nombre del lado derecho

**Verificar en Supabase:**
1. Table Editor → conversations (debe tener 1 conversación)
2. Table Editor → messages (debe tener tu mensaje)

---

### ✅ PASO 8: Ver Notificaciones (30 seg)

1. Click en icono **"Notificaciones"** (🔔)
2. Ver lista de notificaciones
3. Click en una notificación

**✅ Resultado esperado:**
- Lista de notificaciones (likes, comentarios, conexiones)
- Al hacer click, cambia de color (marca como leída)

**Verificar en Supabase:**
- Table Editor → notifications
- Campo `read` debe cambiar a `true`

---

### ✅ PASO 9: Editar Perfil (30 seg)

1. Click en icono **"Perfil"** (👤)
2. Click en **"Editar Perfil"**
3. Modificar:
   - Bio: "Estudiante de prueba de Ayllu UNMSM 🚀"
   - Ubicación: "Lima, Perú"
   - Año: "5to año"
4. Click en **"Guardar Cambios"**

**✅ Resultado esperado:**
- Mensaje de éxito
- Los cambios se reflejan inmediatamente
- Vuelve a vista de perfil

**Verificar en Supabase:**
- Table Editor → users
- Campos bio, location, year deben estar actualizados

---

### ✅ PASO 10: Recuperar Contraseña (1 min)

1. Click en **"Cerrar Sesión"**
2. En login, click **"¿Olvidaste tu contraseña?"**
3. Ingresar: prueba@unmsm.edu.pe
4. Click en **"Enviar Instrucciones"**
5. **Revisar email** (puede tardar 1 minuto)
6. Click en el link del email
7. Debe abrir página de cambio de contraseña
8. Ingresar nueva contraseña: 654321
9. Confirmar: 654321
10. Click en **"Actualizar Contraseña"**

**✅ Resultado esperado:**
- Mensaje de éxito
- Redirige a login
- Puedes iniciar sesión con la nueva contraseña

---

## 📊 Checklist de Verificación Final

Marcar cada item después de probarlo:

- [ ] ✅ Registro de usuario
- [ ] ✅ Login automático después de registro
- [ ] ✅ Crear post
- [ ] ✅ Dar like
- [ ] ✅ Comentar post
- [ ] ✅ Conectar con usuario
- [ ] ✅ Enviar mensaje
- [ ] ✅ Ver notificaciones
- [ ] ✅ Marcar notificación como leída
- [ ] ✅ Editar perfil
- [ ] ✅ Cerrar sesión
- [ ] ✅ Login con credenciales existentes
- [ ] ✅ Recuperar contraseña
- [ ] ✅ Cambiar contraseña desde email

---

## 🚨 Problemas Comunes y Soluciones Rápidas

### Problema: "Invalid login credentials"
```bash
# Solución 1: Verificar que el usuario existe
# En Supabase: Authentication → Users
# Debe aparecer prueba@unmsm.edu.pe

# Solución 2: Re-registrar
# Usar otro email: prueba2@unmsm.edu.pe
```

### Problema: Posts no cargan
```sql
-- Solución: Verificar políticas RLS
-- En Supabase SQL Editor:
SELECT * FROM posts;

-- Si no muestra nada, ejecutar:
INSERT INTO posts (user_id, content) VALUES 
  ((SELECT id FROM users LIMIT 1), 'Post de prueba');
```

### Problema: Notificaciones no aparecen
```sql
-- Verificar en Supabase:
SELECT * FROM notifications WHERE user_id = (SELECT id FROM users WHERE email = 'prueba@unmsm.edu.pe');

-- Si está vacío, dar like a un post para generar notificación
```

### Problema: Email de recuperación no llega
```
1. Verificar spam
2. Esperar hasta 5 minutos
3. Verificar Supabase → Auth → Email Templates está configurado
4. Intentar con otro email
```

---

## 🎯 Resultado Esperado al Final

**Si TODOS los pasos funcionaron correctamente:**

✅ Base de datos configurada  
✅ Aplicación corriendo  
✅ Usuario registrado y con sesión activa  
✅ Posts creados y cargados desde BD  
✅ Likes funcionando y persistiendo  
✅ Comentarios funcionando y persistiendo  
✅ Conexiones funcionando y persistiendo  
✅ Mensajes funcionando y persistiendo  
✅ Notificaciones generándose correctamente  
✅ Perfil editable y persistiendo  
✅ Recuperación de contraseña funcionando  

**¡LA APLICACIÓN ESTÁ 100% FUNCIONAL! 🎉**

---

## 📸 Capturas Esperadas

### Landing Page
```
┌─────────────────────────────────┐
│  🎓 AYLLU UNMSM                │
│  Conecta con sanmarquinos      │
│  [Registrarse] [Login]         │
└─────────────────────────────────┘
```

### Feed Principal
```
┌─────────────────────────────────┐
│  Usuario Prueba              🔔│
│  ─────────────────────────────  │
│  📝 ¿Qué estás pensando?        │
│  [Publicar]                     │
│  ─────────────────────────────  │
│  💬 Post 1                      │
│  ❤️ 5  💬 3                    │
│  ─────────────────────────────  │
│  💬 Post 2                      │
│  ❤️ 2  💬 1                    │
└─────────────────────────────────┘
```

### Mensajes
```
┌─────────────────────────────────┐
│  ✉️ Mensajes                    │
│  ─────────────────────────────  │
│  María Castro                   │
│  Hola! ¿Cómo estás?             │
│  ─────────────────────────────  │
│  Carlos Mendoza                 │
│  Nos vemos mañana               │
└─────────────────────────────────┘
```

---

**Tiempo total de prueba:** ⏱️ 5-7 minutos  
**Nivel de dificultad:** 🟢 Fácil  
**Prerequisitos:** Node.js, Supabase configurado  

**¿Todo funcionó?** ✅  
**¿Algún problema?** → Ver SISTEMA_COMPLETO_FUNCIONANDO.md → Troubleshooting
