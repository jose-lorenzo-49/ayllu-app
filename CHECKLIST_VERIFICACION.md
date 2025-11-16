# ✅ CHECKLIST DE VERIFICACIÓN - Ayllu UNMSM

## 🎯 Usa este checklist para verificar que todo funciona

### 📋 PARTE 1: PREPARACIÓN (5 min)

#### Base de Datos
- [ ] Supabase proyecto creado
- [ ] SQL ejecutado (supabase-schema.sql)
- [ ] SQL ejecutado (supabase-policies.sql)
- [ ] Trigger verificado (tiene SECURITY DEFINER)
- [ ] 8 tablas visibles en Table Editor
- [ ] RLS habilitado en todas las tablas

#### Configuración Local
- [ ] Node.js instalado (v18+)
- [ ] npm install ejecutado exitosamente
- [ ] Archivo .env creado
- [ ] VITE_SUPABASE_URL configurado
- [ ] VITE_SUPABASE_ANON_KEY configurado
- [ ] npm run dev funciona
- [ ] http://localhost:5173 abre

---

### 🔐 PARTE 2: AUTENTICACIÓN (3 min)

#### Registro
- [ ] Página de registro visible
- [ ] Puedo escribir email @unmsm.edu.pe
- [ ] Puedo escribir nombre
- [ ] Puedo seleccionar carrera
- [ ] Puedo escribir contraseña
- [ ] Validación de contraseñas coinciden
- [ ] Click en "Crear Cuenta" funciona
- [ ] **Auto-login exitoso** ✨
- [ ] Redirige a feed principal
- [ ] Mi nombre aparece en header

#### Verificar en Supabase
- [ ] Auth → Users → Nuevo usuario existe
- [ ] Table Editor → users → Perfil creado
- [ ] Email coincide
- [ ] Nombre coincide
- [ ] Facultad coincide

#### Login
- [ ] Cerrar sesión funciona
- [ ] Vuelve a landing page
- [ ] Puedo ingresar email
- [ ] Puedo ingresar contraseña
- [ ] Click en "Iniciar Sesión" funciona
- [ ] Redirige a feed
- [ ] Mis datos aparecen

#### Recuperar Contraseña
- [ ] Click en "¿Olvidaste tu contraseña?"
- [ ] Puedo ingresar email
- [ ] Click en "Enviar Instrucciones"
- [ ] Mensaje de éxito aparece
- [ ] **Email recibido** (revisar spam, esperar hasta 5 min)
- [ ] Link en email funciona
- [ ] Abre página de cambio de contraseña
- [ ] Puedo ingresar nueva contraseña
- [ ] Puedo confirmar contraseña
- [ ] Click en "Actualizar Contraseña"
- [ ] Mensaje de éxito
- [ ] Redirige a login
- [ ] Puedo iniciar sesión con nueva contraseña

---

### 📝 PARTE 3: POSTS (2 min)

#### Crear Post
- [ ] Cuadro de texto visible
- [ ] Puedo escribir contenido
- [ ] Click en "Publicar" funciona
- [ ] Post aparece en feed
- [ ] Mi nombre aparece en post
- [ ] Avatar aparece
- [ ] Timestamp "Hace unos segundos"

#### Verificar en Supabase
- [ ] Table Editor → posts
- [ ] Mi post está ahí
- [ ] user_id coincide con mi ID
- [ ] content tiene mi texto
- [ ] created_at es reciente

---

### ❤️ PARTE 4: LIKES (1 min)

#### Dar Like
- [ ] Veo icono de corazón en posts
- [ ] Click en corazón funciona
- [ ] Número incrementa (+1)
- [ ] Corazón se llena de color
- [ ] Click de nuevo quita like
- [ ] Número decrementa (-1)
- [ ] Corazón vuelve a outline

#### Verificar en Supabase
- [ ] Table Editor → likes
- [ ] Mi like está registrado
- [ ] post_id es correcto
- [ ] user_id es mi ID
- [ ] Table Editor → notifications
- [ ] Notificación de like creada
- [ ] type = 'like'
- [ ] from_user_id es mi ID

---

### 💬 PARTE 5: COMENTARIOS (1 min)

#### Comentar
- [ ] Click en icono de comentarios
- [ ] Puedo escribir comentario
- [ ] Presiono Enter o click enviar
- [ ] Comentario aparece
- [ ] Mi nombre en comentario
- [ ] Mi avatar en comentario
- [ ] Timestamp reciente

#### Verificar en Supabase
- [ ] Table Editor → comments
- [ ] Mi comentario está ahí
- [ ] post_id es correcto
- [ ] user_id es mi ID
- [ ] text tiene mi comentario
- [ ] Table Editor → notifications
- [ ] Notificación de comentario creada
- [ ] type = 'comentario'

---

### 👥 PARTE 6: CONEXIONES (1 min)

#### Conectar
- [ ] Click en icono "Conexiones"
- [ ] Veo lista de usuarios sugeridos
- [ ] Puedo buscar usuarios
- [ ] Click en "Conectar" funciona
- [ ] Botón cambia a estado conectado
- [ ] Usuario aparece en mis conexiones

#### Verificar en Supabase
- [ ] Table Editor → connections
- [ ] Conexión registrada
- [ ] user1_id es mi ID
- [ ] user2_id es correcto
- [ ] status = 'accepted'
- [ ] Table Editor → notifications
- [ ] Notificación de conexión creada
- [ ] type = 'conexion'

---

### ✉️ PARTE 7: MENSAJES (2 min)

#### Enviar Mensaje
- [ ] Click en icono "Mensajes"
- [ ] Veo vista de conversaciones
- [ ] Click en "Mensaje" de usuario conectado
- [ ] Se abre ventana de chat
- [ ] Puedo escribir mensaje
- [ ] Presiono Enter o click enviar
- [ ] Mensaje aparece en chat
- [ ] Mensaje del lado derecho (yo)
- [ ] Color diferente para mis mensajes

#### Verificar en Supabase
- [ ] Table Editor → conversations
- [ ] Conversación creada
- [ ] user1_id es mi ID o del otro usuario
- [ ] user2_id es el complemento
- [ ] Table Editor → messages
- [ ] Mensaje registrado
- [ ] conversation_id es correcto
- [ ] sender_id es mi ID
- [ ] text tiene mi mensaje

---

### 🔔 PARTE 8: NOTIFICACIONES (1 min)

#### Ver Notificaciones
- [ ] Click en icono "Notificaciones"
- [ ] Veo lista de notificaciones
- [ ] Notificaciones de likes visibles
- [ ] Notificaciones de comentarios visibles
- [ ] Notificaciones de conexiones visibles
- [ ] Notificaciones nuevas marcadas
- [ ] Click en notificación funciona
- [ ] Notificación cambia de color
- [ ] Ya no aparece como "nueva"

#### Verificar en Supabase
- [ ] Table Editor → notifications
- [ ] user_id es mi ID
- [ ] Varias notificaciones presentes
- [ ] Después de click: read = true
- [ ] Tipos: like, comentario, conexion

---

### 👤 PARTE 9: PERFIL (1 min)

#### Ver y Editar Perfil
- [ ] Click en icono "Perfil"
- [ ] Veo mi información
- [ ] Nombre visible
- [ ] Email visible
- [ ] Facultad visible
- [ ] Click en "Editar Perfil"
- [ ] Formulario de edición aparece
- [ ] Puedo editar bio
- [ ] Puedo editar ubicación
- [ ] Puedo editar año
- [ ] Click en "Guardar Cambios"
- [ ] Mensaje de éxito
- [ ] Cambios se reflejan inmediatamente

#### Verificar en Supabase
- [ ] Table Editor → users
- [ ] Mi usuario con ID correcto
- [ ] bio actualizada
- [ ] location actualizada
- [ ] year actualizado

---

### 🔄 PARTE 10: PERSISTENCIA (1 min)

#### Verificar Sesión Persistente
- [ ] Cerrar pestaña del navegador
- [ ] Abrir nueva pestaña
- [ ] Ir a http://localhost:5173
- [ ] **Sesión sigue activa** ✨
- [ ] No pide login
- [ ] Mis datos cargados
- [ ] Posts cargados
- [ ] Notificaciones cargadas
- [ ] Conversaciones cargadas

#### Recargar Página
- [ ] F5 para recargar
- [ ] Sesión se mantiene
- [ ] Datos cargan correctamente
- [ ] No se pierde información

---

## 📊 RESUMEN FINAL

### ✅ Checklist Completo (Contar items marcados)

**Autenticación:** ___/28 ✅
- Registro: ___/10
- Login: ___/7
- Reset Password: ___/11

**Features:** ___/67 ✅
- Posts: ___/10
- Likes: ___/14
- Comentarios: ___/14
- Conexiones: ___/12
- Mensajes: ___/17
- Notificaciones: ___/15
- Perfil: ___/14
- Persistencia: ___/8

**TOTAL:** ___/95 ✅

### 🎯 Criterios de Éxito

- ✅ **95/95 items:** PERFECTO - Todo funciona al 100%
- ⚠️ **85-94 items:** MUY BIEN - Algunas features opcionales pendientes
- ❌ **< 85 items:** REVISAR - Ver troubleshooting

---

## 🚨 SI ALGO FALLA

### 1. Error en Registro
**Síntoma:** "new row violates row-level security"  
**Solución:**
```sql
-- Verificar trigger en Supabase SQL Editor:
SELECT proname, prosecdef FROM pg_proc WHERE proname = 'handle_new_user';
-- prosecdef debe ser TRUE (SECURITY DEFINER)

-- Si es FALSE, re-ejecutar:
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
-- Luego ejecutar todo supabase-schema.sql
```

### 2. Email no llega
**Síntoma:** Email de recuperación no llega  
**Solución:**
1. Esperar hasta 5 minutos
2. Revisar spam/promociones
3. Verificar Supabase → Settings → Auth → SMTP está configurado
4. Usar "Copy Link" en lugar de esperar email

### 3. Datos no cargan
**Síntoma:** Feed vacío, sin posts/usuarios  
**Solución:**
```sql
-- Verificar políticas RLS:
SELECT * FROM posts; -- Debe mostrar datos
SELECT * FROM users; -- Debe mostrar datos

-- Si no muestra, ejecutar:
-- supabase-policies.sql completo
```

### 4. Notificaciones no se generan
**Síntoma:** Al dar like/comentar no aparece notificación  
**Solución:**
- Verificar consola del navegador (F12)
- Verificar que RLS de notifications permite INSERT
- Re-ejecutar política de notifications

---

## 📝 NOTAS ADICIONALES

### Datos de Prueba
Al iniciar, la app tiene usuarios demo:
- María Castro (Medicina)
- Carlos Mendoza (Ing. Sistemas)
- Ana Flores (Letras)
- Diego Ramos (Derecho)
- Lucía Torres (Economía)
- Pedro Sánchez (Biología)

### Funcionalidades Opcionales (No requeridas)
- [ ] Subir imágenes en posts (Storage preparado)
- [ ] Subir foto de perfil (Storage preparado)
- [ ] Real-time updates (estructura lista)
- [ ] Notificaciones push (preparado)

---

## 🎉 RESULTADO ESPERADO

**Si completaste 90+ items:**

✅ REGISTRO funciona  
✅ LOGIN funciona  
✅ RESET PASSWORD funciona  
✅ POSTS funciona  
✅ LIKES funciona  
✅ COMENTARIOS funciona  
✅ CONEXIONES funciona  
✅ MENSAJES funciona  
✅ NOTIFICACIONES funciona  
✅ PERFIL funciona  
✅ PERSISTENCIA funciona  

# 🎊 ¡APLICACIÓN 100% FUNCIONAL! 🎊

---

**Tiempo estimado:** 15-20 minutos para checklist completo  
**Dificultad:** 🟢 Fácil  
**Prerequisitos:** Supabase configurado, Node.js instalado

**¿Completaste el checklist?** → ¡Disfruta de Ayllu UNMSM! 🎉
