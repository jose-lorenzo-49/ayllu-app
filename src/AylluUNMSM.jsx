import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bell, Search, Home, User, LogOut, Plus, TrendingUp, Users, GraduationCap, Sparkles } from 'lucide-react';

// Datos simulados
const CARRERAS = [
  "Derecho", "Medicina", "Ingeniería de Sistemas", "Administración",
  "Psicología", "Economía", "Contabilidad", "Educación", "Letras", "Biología"
];

const POSTS_INICIALES = [
  {
    id: 1,
    autor: "María González",
    carrera: "Medicina",
    avatar: "MG",
    contenido: "¡Aprobé mi examen de Anatomía! 🎉 Gracias a todos los que me ayudaron en el grupo de estudio. San Marcos nos hace más fuertes cada día.",
    likes: 24,
    comentarios: 8,
    timestamp: "Hace 2 horas",
    liked: false
  },
  {
    id: 2,
    autor: "Carlos Ruiz",
    carrera: "Derecho",
    avatar: "CR",
    contenido: "Compartiendo mis apuntes de Constitucional II. Que les sirva para el parcial de la próxima semana. ¡Fuerza sanmarquinos! 📚",
    likes: 45,
    comentarios: 12,
    timestamp: "Hace 4 horas",
    liked: false
  },
  {
    id: 3,
    autor: "Ana Torres",
    carrera: "Ingeniería de Sistemas",
    avatar: "AT",
    contenido: "Busco compañeros para hackathon este fin de semana. Tema: IA aplicada a educación. ¿Quién se anima? 💻",
    likes: 18,
    comentarios: 15,
    timestamp: "Hace 6 horas",
    liked: false
  }
];

const SUGERENCIAS = [
  { nombre: "Luis Mendoza", carrera: "Economía", avatar: "LM", conexiones: 145 },
  { nombre: "Sofia Vargas", carrera: "Psicología", avatar: "SV", conexiones: 89 },
  { nombre: "Diego Castro", carrera: "Administración", avatar: "DC", conexiones: 234 }
];

const NOTIFICACIONES = [
  { id: 1, tipo: "like", usuario: "María González", accion: "le gustó tu publicación", tiempo: "Hace 5 min", nueva: true },
  { id: 2, tipo: "conexion", usuario: "Carlos Ruiz", accion: "quiere conectar contigo", tiempo: "Hace 1 hora", nueva: true },
  { id: 3, tipo: "comentario", usuario: "Ana Torres", accion: "comentó tu post", tiempo: "Hace 2 horas", nueva: false }
];

export default function AylluUNMSM() {
  const [pantalla, setPantalla] = useState('landing');
  const [modoAuth, setModoAuth] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState(POSTS_INICIALES);
  const [nuevoPost, setNuevoPost] = useState('');
  const [notificaciones, setNotificaciones] = useState(NOTIFICACIONES);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    carrera: '',
    password: '',
    confirmPassword: ''
  });

  // Handlers
  const handleLogin = () => {
    setUsuario({
      nombre: "Carlos Ruiz",
      carrera: "Derecho",
      avatar: "CR",
      conexiones: 245,
      posts: 89
    });
    setPantalla('feed');
  };

  const handleRegistro = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!formData.nombre || !formData.carrera || !formData.email) {
      alert('Por favor completa todos los campos');
      return;
    }
    setUsuario({
      nombre: formData.nombre,
      carrera: formData.carrera,
      avatar: formData.nombre.split(' ').map(n => n[0]).join(''),
      conexiones: 0,
      posts: 0
    });
    setPantalla('feed');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePublicar = () => {
    if (!nuevoPost.trim()) return;
    const nuevoPostObj = {
      id: posts.length + 1,
      autor: usuario.nombre,
      carrera: usuario.carrera,
      avatar: usuario.avatar,
      contenido: nuevoPost,
      likes: 0,
      comentarios: 0,
      timestamp: "Ahora",
      liked: false
    };
    setPosts([nuevoPostObj, ...posts]);
    setNuevoPost('');
  };

  const marcarNotificacionLeida = (id) => {
    setNotificaciones(notificaciones.map(n => 
      n.id === id ? { ...n, nueva: false } : n
    ));
  };

  // Componente Avatar
  const Avatar = ({ texto, size = "md" }) => {
    const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-32 h-32 text-4xl" };
    const gradientes = ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-green-500 to-teal-500"];
    const gradiente = gradientes[texto.charCodeAt(0) % gradientes.length];
    
    return (
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradiente} flex items-center justify-center text-white font-bold`}>
        {texto}
      </div>
    );
  };

  // LANDING PAGE
  if (pantalla === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
        {/* Estrellas animadas */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center">
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
            {/* Lado Izquierdo */}
            <div className="text-white space-y-6">
              {/* Logo y Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">Ayllu UNMSM</h1>
                    <p className="text-cyan-300 text-lg">Comunidad Sanmarquina</p>
                  </div>
                </div>
              </div>

              {/* Badge Contador */}
              <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-100 font-medium">47 estudiantes registrados</span>
              </div>

              {/* Cards Features */}
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Conecta con Sanmarquinos</h3>
                      <p className="text-cyan-200 text-sm">Encuentra estudiantes de tu carrera y forma grupos de estudio</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Comparte Conocimiento</h3>
                      <p className="text-cyan-200 text-sm">Publica apuntes, recursos y ayuda a tu comunidad académica</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <Avatar texto="MG" size="md" />
                  <div className="flex-1">
                    <p className="text-sm italic text-cyan-100 mb-2">
                      "Ayllu me ayudó a encontrar mi grupo de estudio y hacer grandes amigos en mi facultad. ¡Increíble plataforma!"
                    </p>
                    <p className="text-xs text-cyan-300">María González - Medicina</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Derecho - Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setModoAuth('login')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    modoAuth === 'login'
                      ? 'bg-white text-blue-900'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setModoAuth('registro')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    modoAuth === 'registro'
                      ? 'bg-white text-blue-900'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Crear cuenta
                </button>
              </div>

              {/* Formulario Login */}
              {modoAuth === 'login' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="tu@unmsm.edu.pe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Contraseña</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
                  >
                    Entrar
                  </button>
                  <div className="text-center">
                    <button className="text-sm text-cyan-300 hover:text-cyan-200">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
              )}

              {/* Formulario Registro */}
              {modoAuth === 'registro' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="tu@unmsm.edu.pe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Carrera</label>
                    <select
                      value={formData.carrera}
                      onChange={(e) => setFormData({...formData, carrera: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value="" className="text-gray-900">Selecciona tu carrera</option>
                      {CARRERAS.map(carrera => (
                        <option key={carrera} value={carrera} className="text-gray-900">{carrera}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Contraseña</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Repetir Contraseña</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    onClick={handleRegistro}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
                  >
                    Crear cuenta gratis
                  </button>
                  <p className="text-xs text-center text-cyan-200">
                    Al registrarte aceptas nuestros{' '}
                    <button className="underline">Términos de Servicio</button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FEED PRINCIPAL
  if (pantalla === 'feed') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Ayllu</span>
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <button className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
                    <Home className="w-5 h-5 inline mr-2" />
                    Inicio
                  </button>
                  <button 
                    onClick={() => setPantalla('notificaciones')}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
                  >
                    <Bell className="w-5 h-5" />
                    {notificaciones.filter(n => n.nueva).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar estudiantes, carreras..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setPantalla('perfil')}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2"
                >
                  <Avatar texto={usuario.avatar} size="sm" />
                  <span className="hidden md:block text-sm font-medium text-gray-700">{usuario.nombre}</span>
                </button>
                <button
                  onClick={() => {
                    setUsuario(null);
                    setPantalla('landing');
                  }}
                  className="text-gray-600 hover:text-red-600 p-2"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenido Principal */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Izquierdo */}
            <div className="hidden lg:block col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <div className="text-center mb-6">
                  <Avatar texto={usuario.avatar} size="xl" />
                  <h3 className="mt-4 font-semibold text-gray-900">{usuario.nombre}</h3>
                  <p className="text-sm text-gray-600">{usuario.carrera}</p>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conexiones</span>
                    <span className="font-semibold text-blue-600">{usuario.conexiones}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-semibold text-blue-600">{usuario.posts}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setPantalla('perfil')}
                  className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition"
                >
                  Ver Perfil
                </button>
              </div>
            </div>

            {/* Feed Central */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              {/* Crear Post */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex gap-3">
                  <Avatar texto={usuario.avatar} size="md" />
                  <div className="flex-1">
                    <textarea
                      value={nuevoPost}
                      onChange={(e) => setNuevoPost(e.target.value)}
                      placeholder="¿Qué quieres compartir con la comunidad?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handlePublicar}
                        disabled={!nuevoPost.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Publicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar texto={post.avatar} size="md" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{post.autor}</h4>
                      <p className="text-sm text-gray-600">{post.carrera} • {post.timestamp}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-4">{post.contenido}</p>
                  <div className="flex items-center gap-6 pt-3 border-t">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 hover:text-red-600 transition ${
                        post.liked ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comentarios}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Derecho */}
            <div className="hidden lg:block col-span-3 space-y-4">
              {/* Sugerencias */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Personas que quizá conozcas</h3>
                <div className="space-y-4">
                  {SUGERENCIAS.map((persona, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Avatar texto={persona.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{persona.nombre}</p>
                        <p className="text-xs text-gray-600">{persona.carrera}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Conectar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Tendencias
                </h3>
                <div className="space-y-3">
                  {['#ExamenParcial', '#GrupoEstudio', '#BibliotecaCentral', '#UNMSM2024'].map((tag, idx) => (
                    <button key={idx} className="block text-blue-600 hover:text-blue-700 font-medium text-sm">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PERFIL
  if (pantalla === 'perfil') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Ayllu</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setPantalla('feed')} className="text-gray-600 hover:text-blue-600">
                  <Home className="w-5 h-5" />
                </button>
                <button onClick={() => setPantalla('notificaciones')} className="text-gray-600 hover:text-blue-600 relative">
                  <Bell className="w-5 h-5" />
                  {notificaciones.filter(n => n.nueva).length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <button onClick={() => { setUsuario(null); setPantalla('landing'); }} className="text-gray-600 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Perfil */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header con gradiente */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500" />
            
            {/* Info Principal */}
            <div className="px-8 pb-8">
              <div className="flex flex-col items-center -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                  {usuario.avatar}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">{usuario.nombre}</h1>
                <p className="text-gray-600">{usuario.carrera} • 3er año</p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 py-6 border-y">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{usuario.conexiones}</div>
                  <div className="text-sm text-gray-600">Conexiones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{usuario.posts}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1.2k</div>
                  <div className="text-sm text-gray-600">Seguidores</div>
                </div>
              </div>

              {/* Botón Editar */}
              <div className="mt-6 text-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition">
                  Editar perfil
                </button>
              </div>

              {/* Bio */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-2">Acerca de</h3>
                <p className="text-gray-700">
                  Estudiante de {usuario.carrera} apasionado por el aprendizaje colaborativo. 
                  Siempre dispuesto a ayudar y compartir conocimiento con la comunidad sanmarquina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NOTIFICACIONES
  if (pantalla === 'notificaciones') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Ayllu</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setPantalla('feed')} className="text-gray-600 hover:text-blue-600">
                  <Home className="w-5 h-5" />
                </button>
                <button onClick={() => setPantalla('perfil')} className="text-gray-600 hover:text-blue-600">
                  <User className="w-5 h-5" />
                </button>
                <button onClick={() => { setUsuario(null); setPantalla('landing'); }} className="text-gray-600 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Notificaciones */}
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Notificaciones</h1>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {notificaciones.map(notif => (
              <div
                key={notif.id}
                onClick={() => marcarNotificacionLeida(notif.id)}
                className={`p-6 border-b last:border-b-0 cursor-pointer transition ${
                  notif.nueva ? 'bg-cyan-50 hover:bg-cyan-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.tipo === 'like' ? 'bg-red-100' :
                    notif.tipo === 'conexion' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {notif.tipo === 'like' && <Heart className="w-5 h-5 text-red-600" />}
                    {notif.tipo === 'conexion' && <Users className="w-5 h-5 text-blue-600" />}
                    {notif.tipo === 'comentario' && <MessageCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="font-semibold">{notif.usuario}</span> {notif.accion}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{notif.tiempo}</p>
                  </div>
                  {notif.nueva && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
