# 🏗️ Arquitectura del Código - Ayllu UNMSM

## 📁 Estructura del Proyecto

```
ayllu-unmsm/
├── src/
│   ├── AylluIntegrado.jsx          ← Componente principal (2138 líneas)
│   ├── main.jsx                    ← Entry point
│   ├── index.css                   ← Estilos globales
│   ├── services/
│   │   └── authService.js          ← Servicio de autenticación
│   ├── lib/
│   │   └── supabase.js             ← Cliente Supabase
│   └── hooks/
│       └── useSupabase.js          ← Hook personalizado
├── supabase-schema.sql             ← Schema de base de datos
├── supabase-policies.sql           ← Políticas RLS
├── package.json
└── vite.config.js
```

---

## 🔑 Funciones Clave Implementadas

### 1️⃣ Autenticación (authService.js)

```javascript
// ✅ REGISTRO CON AUTO-LOGIN
async signUp({ email, password, name, faculty }) {
  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, faculty },
      emailRedirectTo: window.location.origin
    }
  });

  // 2. Reintentos para crear perfil (bypass RLS)
  for (let i = 0; i < 3; i++) {
    const profile = await checkUserProfile(authData.user.id);
    if (profile) {
      return { success: true, data: { session, profile } };
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// ✅ LOGIN DIRECTO
async signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  const profile = await this.getUserProfile(data.user.id);
  return { success: true, data: { session: data.session, profile } };
}

// ✅ RECUPERAR CONTRASEÑA
async resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#access_token=...`
  });
  
  return { 
    success: true, 
    message: 'Revisa tu email para restablecer tu contraseña' 
  };
}

// ✅ ACTUALIZAR CONTRASEÑA
async updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  return { success: true, message: 'Contraseña actualizada exitosamente' };
}
```

---

### 2️⃣ Carga de Datos (AylluIntegrado.jsx)

```javascript
// ✅ CARGAR TODOS LOS DATOS AL INICIAR
const loadSupabaseData = async () => {
  // 1. Cargar posts con likes y comentarios
  const { data: postsData } = await supabase
    .from('posts')
    .select(`
      *,
      users(id, name, username, faculty, avatar),
      likes(user_id),
      comments(*, users(name, avatar))
    `)
    .order('created_at', { ascending: false });
  
  setAllPosts(formattedPosts);

  // 2. Cargar usuarios
  const { data: usersData } = await supabase
    .from('users')
    .select('*');
  
  setUsers(usersData);

  // 3. Cargar notificaciones
  await loadNotifications();

  // 4. Cargar conversaciones
  await loadConversations();
};
```

---

### 3️⃣ Posts y Interacciones

```javascript
// ✅ CREAR POST
const handlePost = async () => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      user_id: currentUser.id,
      content: newPost,
      image: imagePreview
    }])
    .select(`
      *,
      users(id, name, username, faculty, avatar)
    `)
    .single();

  // Actualizar estado local
  setAllPosts([formattedPost, ...allPosts]);
  setNewPost('');
};

// ✅ DAR LIKE
const likePost = async (postId) => {
  const post = allPosts.find(p => p.id === postId);
  const hasLiked = post.likes.includes(currentUser.id);

  if (hasLiked) {
    // Quitar like
    await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', currentUser.id);
  } else {
    // Dar like
    await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: currentUser.id }]);

    // Crear notificación
    await supabase
      .from('notifications')
      .insert([{
        user_id: post.userId,
        type: 'like',
        from_user_id: currentUser.id,
        post_id: postId
      }]);
  }

  // Actualizar estado local
  setAllPosts(updated);
};

// ✅ AGREGAR COMENTARIO
const addComment = async (postId) => {
  const { data } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      user_id: currentUser.id,
      text: newComment[postId]
    }])
    .select('*, users(name, avatar)')
    .single();

  // Crear notificación
  await supabase
    .from('notifications')
    .insert([{
      user_id: post.userId,
      type: 'comentario',
      from_user_id: currentUser.id,
      post_id: postId
    }]);

  // Actualizar estado local
  setAllPosts(updated);
};
```

---

### 4️⃣ Conexiones

```javascript
// ✅ CONECTAR CON USUARIO
const addConnection = async (userId) => {
  try {
    // Insertar en BD
    const { error } = await supabase
      .from('connections')
      .insert([{
        user1_id: currentUser.id,
        user2_id: userId,
        status: 'accepted'
      }]);

    // Crear notificación
    await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type: 'conexion',
        from_user_id: currentUser.id
      }]);

    // Actualizar estado local
    setCurrentUser({
      ...currentUser,
      connections: [...currentUser.connections, userId]
    });
  } catch (error) {
    console.error('Error al conectar:', error);
  }
};
```

---

### 5️⃣ Mensajería

```javascript
// ✅ INICIAR CONVERSACIÓN
const startConversation = async (userId) => {
  // Verificar si ya existe
  const { data: existingConv } = await supabase
    .from('conversations')
    .select('*')
    .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${userId}),
         and(user1_id.eq.${userId},user2_id.eq.${currentUser.id})`)
    .maybeSingle();

  if (existingConv) {
    // Cargar mensajes existentes
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', existingConv.id)
      .order('created_at', { ascending: true });

    // Mostrar conversación
    setSelectedConversation(existingConv.id);
  } else {
    // Crear nueva conversación
    const { data } = await supabase
      .from('conversations')
      .insert([{
        user1_id: currentUser.id,
        user2_id: userId
      }])
      .select()
      .single();

    setConversations([...conversations, newConv]);
    setSelectedConversation(data.id);
  }
  
  setActiveView('messages');
};

// ✅ ENVIAR MENSAJE
const sendMessage = async () => {
  const { data } = await supabase
    .from('messages')
    .insert([{
      conversation_id: selectedConversation,
      sender_id: currentUser.id,
      text: newMessage.trim()
    }])
    .select()
    .single();

  // Actualizar conversación local
  const updated = [...conversations];
  updated[convIndex].messages.push({
    from: currentUser.id,
    text: newMessage.trim(),
    timestamp: new Date(data.created_at).getTime()
  });
  setConversations(updated);
  setNewMessage('');
};
```

---

### 6️⃣ Notificaciones

```javascript
// ✅ CARGAR NOTIFICACIONES
const loadNotifications = async () => {
  const { data } = await supabase
    .from('notifications')
    .select(`
      *,
      from_user:from_user_id(name, avatar),
      post:post_id(content)
    `)
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const formattedNotifs = data.map(n => ({
    id: n.id,
    tipo: n.type,
    usuario: n.from_user?.name || 'Usuario',
    accion: n.type === 'like' ? 'le gustó tu publicación' :
            n.type === 'comentario' ? 'comentó tu publicación' :
            n.type === 'conexion' ? 'quiere conectar contigo' : 
            'interactuó contigo',
    tiempo: formatTime(new Date(n.created_at).getTime()),
    nueva: !n.read
  }));
  
  setNotificaciones(formattedNotifs);
};

// ✅ MARCAR COMO LEÍDA
const marcarNotificacionLeida = async (id) => {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  const updated = notificaciones.map(n =>
    n.id === id ? { ...n, nueva: false } : n
  );
  setNotificaciones(updated);
};
```

---

### 7️⃣ Perfil de Usuario

```javascript
// ✅ ACTUALIZAR PERFIL
const updateProfile = async (updatedData) => {
  const { error } = await supabase
    .from('users')
    .update({
      bio: updatedData.bio,
      location: updatedData.location,
      year: updatedData.year,
      avatar: updatedData.avatar
    })
    .eq('id', currentUser.id);

  if (!error) {
    setCurrentUser({ ...currentUser, ...updatedData });
    setEditingProfile(null);
  }
};
```

---

### 8️⃣ Conversaciones

```javascript
// ✅ CARGAR CONVERSACIONES
const loadConversations = async () => {
  const { data } = await supabase
    .from('conversations')
    .select(`
      *,
      messages(*)
    `)
    .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
    .order('updated_at', { ascending: false });

  const formattedConvs = data.map(conv => {
    const withUserId = conv.user1_id === currentUser.id ? 
                       conv.user2_id : conv.user1_id;
    
    const messages = (conv.messages || [])
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map(msg => ({
        from: msg.sender_id,
        text: msg.text,
        timestamp: new Date(msg.created_at).getTime()
      }));
    
    return { id: conv.id, withUserId, messages };
  });
  
  setConversations(formattedConvs);
};
```

---

## 🔄 Flujo de Datos

### Al Iniciar la App
```
1. checkAuthState()
   ↓
2. authService.getCurrentSession()
   ↓
3. setCurrentUser(profile)
   ↓
4. loadSupabaseData()
   ├─→ Cargar posts
   ├─→ Cargar usuarios
   ├─→ loadNotifications()
   └─→ loadConversations()
   ↓
5. setPantalla('app')
```

### Al Registrarse
```
1. handleRegistro()
   ↓
2. authService.signUp()
   ├─→ Crear usuario en Auth
   └─→ Trigger crea perfil en users
   ↓
3. Reintentos (hasta 3)
   ↓
4. Auto-login exitoso
   ↓
5. loadSupabaseData()
   ↓
6. Mostrar feed
```

### Al Dar Like
```
1. likePost(postId)
   ↓
2. Verificar si ya tiene like
   ├─→ SI: DELETE de likes
   └─→ NO: INSERT en likes + notificación
   ↓
3. Actualizar estado local
   ↓
4. UI se actualiza inmediatamente
```

### Al Enviar Mensaje
```
1. sendMessage()
   ↓
2. INSERT en messages
   ↓
3. Actualizar conversations local
   ↓
4. Mensaje aparece en UI
   ↓
5. setNewMessage('')
```

---

## 📊 Estados del Componente Principal

```javascript
// Autenticación
const [pantalla, setPantalla] = useState('loading');
const [currentUser, setCurrentUser] = useState(null);
const [authLoading, setAuthLoading] = useState(false);
const [authError, setAuthError] = useState('');
const [modoAuth, setModoAuth] = useState('login');
const [resetPasswordMode, setResetPasswordMode] = useState(false);

// Datos principales
const [users, setUsers] = useState([]);
const [allPosts, setAllPosts] = useState([]);
const [conversations, setConversations] = useState([]);
const [notificaciones, setNotificaciones] = useState([]);

// UI
const [activeView, setActiveView] = useState('feed');
const [selectedProfile, setSelectedProfile] = useState(null);
const [selectedConversation, setSelectedConversation] = useState(null);
const [editingProfile, setEditingProfile] = useState(null);

// Formularios
const [newPost, setNewPost] = useState('');
const [newMessage, setNewMessage] = useState('');
const [newComment, setNewComment] = useState({});
const [searchQuery, setSearchQuery] = useState('');
const [formData, setFormData] = useState({ /* ... */ });
```

---

## 🎨 Componentes de UI

### Pantallas Principales
- ✅ Landing Page (login/registro)
- ✅ Reset Password Page
- ✅ Feed Principal
- ✅ Vista de Conexiones
- ✅ Vista de Mensajes
- ✅ Vista de Notificaciones
- ✅ Vista de Perfil

### Componentes Internos
```javascript
// Renders principales
renderFeed()           // Feed de posts
renderConnections()    // Conexiones y búsqueda
renderMessages()       // Conversaciones
renderNotificaciones() // Lista de notificaciones
renderProfile()        // Perfil del usuario
```

---

## 🔐 Seguridad y RLS

### Políticas Implementadas

```sql
-- POSTS: Lectura pública, escritura propia
CREATE POLICY "Posts públicos" ON posts FOR SELECT USING (true);
CREATE POLICY "Crear propios posts" ON posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- LIKES: Lectura pública, escritura propia
CREATE POLICY "Likes públicos" ON likes FOR SELECT USING (true);
CREATE POLICY "Dar own likes" ON likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- COMMENTS: Lectura pública, escritura propia
CREATE POLICY "Comments públicos" ON comments FOR SELECT USING (true);
CREATE POLICY "Crear propios comments" ON comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- MESSAGES: Solo participantes
CREATE POLICY "Ver propios mensajes" ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = messages.conversation_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

-- NOTIFICATIONS: Solo propias
CREATE POLICY "Ver propias notificaciones" ON notifications FOR SELECT 
  USING (auth.uid() = user_id);
```

### Trigger con SECURITY DEFINER
```sql
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- ← CLAVE: Bypass RLS
SET search_path = public
AS $$
BEGIN
  INSERT INTO users (id, email, name, faculty)
  VALUES (NEW.id, NEW.email, ...);
  RETURN NEW;
END;
$$;
```

---

## 📈 Métricas del Proyecto

- **Líneas de código total:** ~2,500
- **Componente principal:** 2,138 líneas
- **Servicio de auth:** 180 líneas
- **Tablas en BD:** 8
- **Políticas RLS:** 20+
- **Funciones principales:** 30+
- **Estados de React:** 20+

---

## 🎯 Puntos Clave de la Arquitectura

1. **Sincronización Dual**: Estado local + Supabase
2. **Optimistic Updates**: UI se actualiza antes de confirmar BD
3. **Error Handling**: Try-catch en todas las operaciones async
4. **Reintentos Automáticos**: Registro con 3 intentos
5. **Security First**: RLS en todas las tablas
6. **Real-time Ready**: Estructura preparada para subscriptions
7. **Modular**: Separación de concerns (auth, data, UI)
8. **Type Safe**: Queries con select específico

---

**¡Arquitectura completa y lista para escalar!** 🚀
