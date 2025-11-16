import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, UserPlus, Search, Home, Users, Mail, User, X, Check, ArrowLeft, Edit2, MapPin, Bell, LogOut, GraduationCap, Sparkles, TrendingUp, Share2, Image as ImageIcon } from 'lucide-react';
import { supabase } from './lib/supabase';

const CARRERAS = [
  "Derecho", "Medicina", "Ingeniería de Sistemas", "Administración",
  "Psicología", "Economía", "Contabilidad", "Educación", "Letras", "Biología"
];

export default function AylluIntegrado() {
  const [pantalla, setPantalla] = useState('landing');
  const [modoAuth, setModoAuth] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar datos de Supabase al iniciar
  useEffect(() => {
    loadSupabaseData();
  }, []);

  const loadSupabaseData = async () => {
    try {
      // Cargar posts de Supabase
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          users(id, name, username, faculty, avatar),
          likes(user_id),
          comments(*, users(name, avatar))
        `)
        .order('created_at', { ascending: false });
      
      if (postsData && postsData.length > 0) {
        const formattedPosts = postsData.map(post => ({
          id: post.id,
          userId: post.user_id,
          content: post.content,
          image: post.image,
          likes: post.likes?.map(like => like.user_id) || [],
          comments: post.comments?.map(comment => ({
            userId: comment.user_id,
            text: comment.text,
            timestamp: new Date(comment.created_at).getTime()
          })) || [],
          timestamp: new Date(post.created_at).getTime()
        }));
        setAllPosts(formattedPosts);
      }

      // Cargar usuarios de Supabase
      const { data: usersData } = await supabase
        .from('users')
        .select('*');
      
      if (usersData && usersData.length > 0) {
        setUsers(usersData);
      }
    } catch (error) {
      console.log('Usando datos locales:', error);
      // Mantener datos locales si Supabase falla
    }
  };
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    carrera: '',
    password: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState([
    {
      id: 2,
      name: 'María Castro',
      username: 'maria_unmsm',
      faculty: 'Medicina',
      year: '5to año',
      bio: 'Futuro médico cirujano. Amante del café y las guardias hospitalarias ☕',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      connections: [3, 5],
      location: 'Lima, Perú'
    },
    {
      id: 3,
      name: 'Carlos Mendoza',
      username: 'carlos_dev',
      faculty: 'Ingeniería de Sistemas',
      year: '4to año',
      bio: 'Full-stack developer | Hackathons | Emprendedor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      connections: [2, 4],
      location: 'Lima, Perú'
    },
    {
      id: 4,
      name: 'Ana Flores',
      username: 'ana_letras',
      faculty: 'Letras',
      year: '2do año',
      bio: 'Amo la literatura latinoamericana 📚',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      connections: [5, 6],
      location: 'Lima, Perú'
    },
    {
      id: 5,
      name: 'Diego Ramos',
      username: 'diego_derecho',
      faculty: 'Derecho',
      year: '5to año',
      bio: 'Debate | Derechos Humanos | Campeón nacional',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      connections: [2, 4, 6],
      location: 'Lima, Perú'
    },
    {
      id: 6,
      name: 'Lucía Torres',
      username: 'lucia_economia',
      faculty: 'Economía',
      year: '3er año',
      bio: 'Apasionada por las finanzas y el emprendimiento',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      connections: [4, 5],
      location: 'Lima, Perú'
    },
    {
      id: 7,
      name: 'Pedro Sánchez',
      username: 'pedro_bio',
      faculty: 'Biología',
      year: '2do año',
      bio: 'Conservacionista | Amante de la naturaleza 🌿',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      connections: [],
      location: 'Lima, Perú'
    }
  ]);

  const [allPosts, setAllPosts] = useState([
    {
      id: 1,
      userId: 2,
      content: '¡Acabo de terminar mi práctica en el Hospital Dos de Mayo! La experiencia fue increíble. San Marcos nos prepara para la realidad 💪',
      likes: [3, 5],
      comments: [{ userId: 3, text: 'Eres una crack!' }],
      timestamp: Date.now() - 7200000
    },
    {
      id: 2,
      userId: 3,
      content: '¿Alguien para el hackathon del viernes? Necesito un equipo para desarrollar una app de delivery para la ciudad universitaria 🚀',
      likes: [2],
      comments: [],
      timestamp: Date.now() - 14400000
    },
    {
      id: 3,
      userId: 4,
      content: 'Nueva cafetería en el pabellón de Letras ☕ Los precios son accesibles y el café es buenísimo. Recomendado para estudiar',
      likes: [5],
      comments: [],
      timestamp: Date.now() - 21600000
    }
  ]);

  const [conversations, setConversations] = useState([]);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, tipo: 'like', usuario: 'María Castro', accion: 'le gustó tu publicación', tiempo: 'Hace 5 min', nueva: true },
    { id: 2, tipo: 'conexion', usuario: 'Carlos Mendoza', accion: 'quiere conectar contigo', tiempo: 'Hace 1 hora', nueva: true }
  ]);

  const [activeView, setActiveView] = useState('feed');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleLogin = async () => {
    if (!formData.email?.trim() || !formData.password?.trim()) {
      alert('Por favor ingresa email y contraseña');
      return;
    }

    try {
      // Buscar usuario en Supabase
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email.trim())
        .single();

      if (userData) {
        setCurrentUser(userData);
        // Limpiar formulario
        setFormData({
          email: '',
          nombre: '',
          carrera: '',
          password: '',
          confirmPassword: ''
        });
        setPantalla('app');
      } else {
        alert('Usuario no encontrado. Verifica tu email.');
      }
    } catch (error) {
      console.error('Error login:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleRegistro = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!formData.nombre || !formData.carrera || !formData.email) {
      alert('Por favor completa todos los campos');
      return;
    }
    if (!formData.email.includes('@unmsm.edu.pe')) {
      alert('Debes usar tu email institucional @unmsm.edu.pe');
      return;
    }
    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const newUser = {
      id: Date.now(), // ID temporal
      name: formData.nombre,
      username: formData.nombre.toLowerCase().replace(/ /g, '_'),
      faculty: formData.carrera,
      year: '1er año',
      bio: 'Estudiante de San Marcos 🎓',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      connections: [],
      location: 'Lima, Perú'
    };

    try {
      // Intentar guardar en Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: formData.email,
          name: formData.nombre,
          username: formData.nombre.toLowerCase().replace(/ /g, '_'),
          faculty: formData.carrera,
          year: '1er año',
          bio: 'Estudiante de San Marcos 🎓',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
        }])
        .select()
        .single();

      if (data) {
        newUser.id = data.id;
      }
    } catch (error) {
      console.log('Usando registro local:', error);
    }

    setCurrentUser(newUser);
    setUsers([...users, newUser]);
    setPantalla('app');
  };

  const getUserById = (id) => users.find(u => u.id === id) || currentUser;
  const isConnected = (userId) => currentUser?.connections.includes(userId);
  const getFeedPosts = () => allPosts.filter(post => currentUser?.connections.includes(post.userId)).sort((a, b) => b.timestamp - a.timestamp);
  const getSuggestions = () => users.filter(u => u.id !== currentUser?.id && !currentUser?.connections.includes(u.id));

  const addConnection = (userId) => {
    setCurrentUser(prev => ({ ...prev, connections: [...prev.connections, userId] }));
    setUsers(users.map(u => u.id === userId ? {...u, connections: [...u.connections, currentUser.id]} : u));
  };

  const createPost = async () => {
    if (!newPost.trim() && !imagePreview) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          user_id: currentUser.id,
          content: newPost,
          image: imagePreview
        }])
        .select()
        .single();

      if (error) {
        // Fallback a localStorage si falla Supabase
        setAllPosts([{
          id: allPosts.length + 1,
          userId: currentUser.id,
          content: newPost,
          image: imagePreview,
          likes: [],
          comments: [],
          timestamp: Date.now()
        }, ...allPosts]);
      } else {
        const newPostFormatted = {
          id: data.id,
          userId: currentUser.id,
          content: data.content,
          image: data.image,
          likes: [],
          comments: [],
          timestamp: new Date(data.created_at).getTime()
        };
        setAllPosts([newPostFormatted, ...allPosts]);
      }
      
      setNewPost('');
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating post:', error);
      // Fallback a localStorage
      setAllPosts([{
        id: allPosts.length + 1,
        userId: currentUser.id,
        content: newPost,
        image: imagePreview,
        likes: [],
        comments: [],
        timestamp: Date.now()
      }, ...allPosts]);
      setNewPost('');
      setImagePreview(null);
    }
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    setAllPosts(allPosts.map(post => {
      if (post.id === postId) {
        return {...post, comments: [...post.comments, { userId: currentUser.id, text: text.trim(), timestamp: Date.now() }]};
      }
      return post;
    }));
    setNewComment({...newComment, [postId]: ''});
  };

  const sharePost = (postId) => {
    const post = allPosts.find(p => p.id === postId);
    if (post) {
      const shareText = `${post.content}\n\n- Compartido desde Ayllu UNMSM`;
      navigator.clipboard.writeText(shareText);
      alert('¡Link copiado al portapapeles!');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const likePost = (postId) => {
    setAllPosts(allPosts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(currentUser.id)
          ? post.likes.filter(id => id !== currentUser.id)
          : [...post.likes, currentUser.id];
        return {...post, likes};
      }
      return post;
    }));
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation !== null) {
      const convIndex = conversations.findIndex(c => c.id === selectedConversation);
      if (convIndex !== -1) {
        const updated = [...conversations];
        updated[convIndex].messages.push({
          from: currentUser.id,
          text: newMessage,
          timestamp: Date.now()
        });
        setConversations(updated);
        setNewMessage('');
      }
    }
  };

  const startConversation = (userId) => {
    const existing = conversations.find(c => c.withUserId === userId);
    if (existing) {
      setSelectedConversation(existing.id);
    } else {
      const newConv = {
        id: conversations.length + 1,
        withUserId: userId,
        messages: []
      };
      setConversations([...conversations, newConv]);
      setSelectedConversation(newConv.id);
    }
    setActiveView('messages');
  };

  const updateProfile = () => {
    if (editingProfile) {
      setCurrentUser(editingProfile);
      setUsers(users.map(u => u.id === currentUser.id ? editingProfile : u));
      setEditingProfile(null);
      setActiveView('profile');
    }
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Hace unos minutos';
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  const marcarNotificacionLeida = (id) => {
    setNotificaciones(notificaciones.map(n => n.id === id ? { ...n, nueva: false } : n));
  };

  // LANDING PAGE
  if (pantalla === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
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
            <div className="text-white space-y-6">
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

              <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-100 font-medium">{users.length + 1} estudiantes registrados</span>
              </div>

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
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => {
                    setModoAuth('login');
                    setFormData({ email: '', nombre: '', carrera: '', password: '', confirmPassword: '' });
                  }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    modoAuth === 'login' ? 'bg-white text-blue-900' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    setModoAuth('registro');
                    setFormData({ email: '', nombre: '', carrera: '', password: '', confirmPassword: '' });
                  }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    modoAuth === 'registro' ? 'bg-white text-blue-900' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Crear cuenta
                </button>
              </div>

              {modoAuth === 'login' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email Institucional</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="tu@unmsm.edu.pe"
                    />
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
                  <div className="flex items-center justify-between text-sm mb-4">
                    <label className="flex items-center text-white">
                      <input type="checkbox" className="mr-2 rounded" />
                      Recordarme
                    </label>
                    <button 
                      type="button"
                      onClick={() => alert('Funcionalidad próximamente. Contacta al administrador del sistema.')}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  
                  <button
                    onClick={handleLogin}
                    disabled={!formData.email || !formData.password}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Iniciar Sesión
                  </button>
                  
                  <div className="text-center text-sm text-cyan-200 mt-4">
                    ¿Primera vez en Ayllu? 
                    <button 
                      onClick={() => {
                        setModoAuth('registro');
                        setFormData({ email: '', nombre: '', carrera: '', password: '', confirmPassword: '' });
                      }}
                      className="text-white font-semibold hover:underline ml-1"
                    >
                      Crear cuenta
                    </button>
                  </div>
                </div>
              )}

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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER FUNCTIONS
  const renderFeed = () => {
    const feedPosts = getFeedPosts();
    return (
      <div>
        <div className="bg-gray-900 p-4 rounded-2xl mb-4">
          <div className="flex space-x-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="¿Qué quieres compartir con tus conexiones?"
                className="w-full bg-gray-800 rounded-xl p-3 outline-none resize-none text-gray-100"
                rows="3"
              />
              {imagePreview && (
                <div className="relative mt-2">
                  <img src={imagePreview} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black p-2 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center mt-2">
                <label className="cursor-pointer text-gray-400 hover:text-orange-500 transition-colors p-2 hover:bg-gray-800 rounded-full">
                  <ImageIcon size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                <button 
                  onClick={createPost}
                  disabled={!newPost.trim() && !imagePreview}
                  className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-orange-700 transition-all"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {feedPosts.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <Users size={48} className="mx-auto text-gray-600 mb-3" />
            <h3 className="text-xl font-bold mb-2">Conecta con más personas</h3>
            <p className="text-gray-400 mb-4">Agrega conexiones para ver sus publicaciones en tu feed</p>
            <button 
              onClick={() => setActiveView('search')}
              className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 rounded-full font-bold hover:from-red-700 hover:to-orange-700 transition-all"
            >
              Buscar estudiantes
            </button>
          </div>
        ) : (
          feedPosts.map(post => {
            const author = getUserById(post.userId);
            return (
              <div key={post.id} className="bg-gray-900 p-4 rounded-2xl mb-4">
                <div className="flex space-x-3">
                  <img 
                    src={author.avatar} 
                    alt={author.name}
                    onClick={() => {
                      setSelectedProfile(author);
                      setActiveView('viewProfile');
                    }}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div 
                          onClick={() => {
                            setSelectedProfile(author);
                            setActiveView('viewProfile');
                          }}
                          className="font-bold hover:underline cursor-pointer"
                        >
                          {author.name}
                        </div>
                        <div className="text-sm text-orange-500">{author.faculty}</div>
                      </div>
                      <div className="text-sm text-gray-500">{formatTime(post.timestamp)}</div>
                    </div>
                    <p className="mt-3 text-gray-100 leading-relaxed">{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="Post" className="mt-3 rounded-lg w-full max-h-96 object-cover" />
                    )}
                    
                    <div className="flex items-center space-x-6 mt-4">
                      <button 
                        onClick={() => likePost(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.likes.includes(currentUser.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} fill={post.likes.includes(currentUser.id) ? 'currentColor' : 'none'} />
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (post.likes.length > 0) setShowLikesModal(post.id);
                          }}
                          className={post.likes.length > 0 ? 'cursor-pointer hover:underline' : ''}
                        >
                          {post.likes.length}
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => setShowComments({...showComments, [post.id]: !showComments[post.id]})}
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle size={20} />
                        <span>{post.comments.length}</span>
                      </button>

                      <button 
                        onClick={() => sharePost(post.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>

                    {showComments[post.id] && (
                      <div className="mt-4 space-y-3">
                        <div className="border-t border-gray-800 pt-3">
                          {post.comments.map((comment, idx) => {
                            const commentAuthor = getUserById(comment.userId);
                            return (
                              <div key={idx} className="flex space-x-2 mb-3">
                                <img src={commentAuthor.avatar} alt={commentAuthor.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                <div className="flex-1 bg-gray-800 rounded-lg p-2">
                                  <div className="font-semibold text-sm">{commentAuthor.name}</div>
                                  <div className="text-sm text-gray-300">{comment.text}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newComment[post.id]?.trim()) {
                                addComment(post.id, newComment[post.id]);
                              }
                            }}
                            placeholder="Escribe un comentario..."
                            className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm outline-none"
                          />
                          <button
                            onClick={() => addComment(post.id, newComment[post.id])}
                            disabled={!newComment[post.id]?.trim()}
                            className="bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-orange-700 transition-all"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderSearch = () => {
    const suggestions = getSuggestions();
    const filtered = searchQuery.trim()
      ? suggestions.filter(u => 
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.faculty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : suggestions;

    return (
      <div>
        <div className="mb-4">
          <div className="flex items-center bg-gray-900 rounded-full px-4 py-3">
            <Search size={20} className="text-gray-500 mr-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estudiantes de San Marcos"
              className="bg-transparent outline-none text-gray-100 w-full"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">
          {searchQuery ? `Resultados (${filtered.length})` : 'Estudiantes que podrías conocer'}
        </h2>
        
        <div className="space-y-4">
          {filtered.map(user => (
            <div key={user.id} className="bg-gray-900 p-4 rounded-2xl">
              <div className="flex items-start space-x-3">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div 
                    onClick={() => {
                      setSelectedProfile(user);
                      setActiveView('viewProfile');
                    }}
                    className="font-bold text-lg hover:underline cursor-pointer"
                  >
                    {user.name}
                  </div>
                  <div className="text-sm text-orange-500 font-medium">{user.faculty}</div>
                  <div className="text-sm text-gray-500">{user.year}</div>
                  <p className="text-sm text-gray-400 mt-2">{user.bio}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <button 
                      onClick={() => addConnection(user.id)}
                      className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 rounded-full font-bold hover:from-red-700 hover:to-orange-700 transition-all flex items-center space-x-2"
                    >
                      <UserPlus size={18} />
                      <span>Conectar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConnections = () => {
    const myConnections = users.filter(u => currentUser.connections.includes(u.id));
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Mis Conexiones ({myConnections.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myConnections.map(user => (
            <div key={user.id} className="bg-gray-900 p-4 rounded-2xl">
              <div className="flex items-center space-x-3">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div 
                    onClick={() => {
                      setSelectedProfile(user);
                      setActiveView('viewProfile');
                    }}
                    className="font-bold hover:underline cursor-pointer"
                  >
                    {user.name}
                  </div>
                  <div className="text-sm text-orange-500">{user.faculty}</div>
                  <div className="text-sm text-gray-500">{user.year}</div>
                </div>
              </div>
              <button 
                onClick={() => startConversation(user.id)}
                className="w-full mt-3 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>Mensaje</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (selectedConversation !== null) {
      const conv = conversations.find(c => c.id === selectedConversation);
      const otherUser = getUserById(conv.withUserId);
      
      return (
        <div className="flex flex-col h-[calc(100vh-200px)]">
          <div className="bg-gray-900 p-4 rounded-t-2xl flex items-center space-x-3">
            <button 
              onClick={() => setSelectedConversation(null)}
              className="hover:bg-gray-800 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-bold">{otherUser.name}</div>
              <div className="text-sm text-orange-500">{otherUser.faculty}</div>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-900 p-4 overflow-y-auto">
            {conv.messages.map((msg, idx) => {
              const isMe = msg.from === currentUser.id;
              return (
                <div key={idx} className={`mb-3 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isMe ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gray-900 p-4 rounded-b-2xl flex items-center space-x-3">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-gray-800 rounded-full px-4 py-2 outline-none"
            />
            <button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-orange-700 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Mensajes</h2>
        <div className="space-y-2">
          {conversations.map(conv => {
            const otherUser = getUserById(conv.withUserId);
            const lastMessage = conv.messages[conv.messages.length - 1];
            return (
              <div 
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className="bg-gray-900 p-4 rounded-2xl hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img src={otherUser.avatar} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-bold">{otherUser.name}</div>
                    {lastMessage && (
                      <div className="text-sm text-gray-400 truncate">
                        {lastMessage.from === currentUser.id ? 'Tú: ' : ''}{lastMessage.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {conversations.length === 0 && (
            <div className="bg-gray-900 p-8 rounded-2xl text-center">
              <Mail size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">No tienes mensajes aún</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNotificaciones = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          {notificaciones.map(notif => (
            <div
              key={notif.id}
              onClick={() => marcarNotificacionLeida(notif.id)}
              className={`p-4 border-b border-gray-800 last:border-b-0 cursor-pointer transition ${
                notif.nueva ? 'bg-cyan-900/20 hover:bg-cyan-900/30' : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.tipo === 'like' ? 'bg-red-100/10' :
                  notif.tipo === 'conexion' ? 'bg-blue-100/10' : 'bg-green-100/10'
                }`}>
                  {notif.tipo === 'like' && <Heart className="w-5 h-5 text-red-500" />}
                  {notif.tipo === 'conexion' && <Users className="w-5 h-5 text-blue-500" />}
                  {notif.tipo === 'comentario' && <MessageCircle className="w-5 h-5 text-green-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-100">
                    <span className="font-semibold">{notif.usuario}</span> {notif.accion}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{notif.tiempo}</p>
                </div>
                {notif.nueva && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const myConnections = users.filter(u => currentUser.connections.includes(u.id));
    return (
      <div>
        <div className="bg-gray-900 p-6 rounded-2xl mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full object-cover" />
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <ImageIcon size={24} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCurrentUser({...currentUser, avatar: reader.result});
                          setUsers(users.map(u => u.id === currentUser.id ? {...u, avatar: reader.result} : u));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <p className="text-orange-500 font-medium">{currentUser.faculty}</p>
                <p className="text-gray-400">{currentUser.year}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingProfile({...currentUser});
                setActiveView('editProfile');
              }}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Edit2 size={16} />
              <span>Editar</span>
            </button>
          </div>
          
          <p className="text-gray-300 mb-4">{currentUser.bio}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span>{currentUser.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{myConnections.length} conexiones</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Mis Publicaciones</h3>
          {allPosts.filter(p => p.userId === currentUser.id).map(post => (
            <div key={post.id} className="border-t border-gray-800 pt-4 mt-4 first:border-0 first:mt-0 first:pt-0">
              <p className="text-gray-100 mb-3">{post.content}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{post.likes.length} me gusta</span>
                <span>{post.comments.length} comentarios</span>
                <span>{formatTime(post.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderViewProfile = () => {
    if (!selectedProfile) return null;
    const isConnectedUser = isConnected(selectedProfile.id);
    const userConnections = users.filter(u => selectedProfile.connections.includes(u.id));
    
    return (
      <div>
        <button 
          onClick={() => setActiveView('feed')}
          className="mb-4 hover:bg-gray-900 p-2 rounded-full transition-colors inline-flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        <div className="bg-gray-900 p-6 rounded-2xl mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img src={selectedProfile.avatar} alt={selectedProfile.name} className="w-24 h-24 rounded-full object-cover" />
              <div>
                <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                <p className="text-orange-500 font-medium">{selectedProfile.faculty}</p>
                <p className="text-gray-400">{selectedProfile.year}</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{selectedProfile.bio}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span>{selectedProfile.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{userConnections.length} conexiones</span>
            </div>
          </div>

          <div className="flex space-x-3">
            {!isConnectedUser && (
              <button 
                onClick={() => addConnection(selectedProfile.id)}
                className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 rounded-full font-bold hover:from-red-700 hover:to-orange-700 transition-all flex items-center space-x-2"
              >
                <UserPlus size={18} />
                <span>Conectar</span>
              </button>
            )}
            {isConnectedUser && (
              <>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-full font-bold transition-colors flex items-center space-x-2">
                  <Check size={18} />
                  <span>Conectados</span>
                </button>
                <button 
                  onClick={() => startConversation(selectedProfile.id)}
                  className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-full font-bold transition-colors flex items-center space-x-2"
                >
                  <MessageCircle size={18} />
                  <span>Mensaje</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEditProfile = () => {
    if (!editingProfile) return null;
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <button 
            onClick={() => {
              setEditingProfile(null);
              setActiveView('profile');
            }}
            className="hover:bg-gray-900 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Foto de Perfil</label>
            <div className="flex items-center space-x-4">
              <img src={editingProfile.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
              <label className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center space-x-2">
                <ImageIcon size={18} />
                <span>Cambiar foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingProfile({...editingProfile, avatar: reader.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input 
              type="text"
              value={editingProfile.name}
              onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Facultad</label>
            <input 
              type="text"
              value={editingProfile.faculty}
              onChange={(e) => setEditingProfile({...editingProfile, faculty: e.target.value})}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Año de Estudios</label>
            <select 
              value={editingProfile.year}
              onChange={(e) => setEditingProfile({...editingProfile, year: e.target.value})}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 outline-none"
            >
              <option>1er año</option>
              <option>2do año</option>
              <option>3er año</option>
              <option>4to año</option>
              <option>5to año</option>
              <option>6to año</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Biografía</label>
            <textarea 
              value={editingProfile.bio}
              onChange={(e) => setEditingProfile({...editingProfile, bio: e.target.value})}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 outline-none resize-none"
              rows="3"
            />
          </div>

          <button 
            onClick={updateProfile}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 py-3 rounded-lg font-bold hover:from-red-700 hover:to-orange-700 transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    );
  };

  // APP PRINCIPAL
  return (
    <div className="min-h-screen bg-black text-white">
      {showLikesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLikesModal(null)}>
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Me gusta</h3>
              <button onClick={() => setShowLikesModal(null)} className="hover:bg-gray-800 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allPosts.find(p => p.id === showLikesModal)?.likes.map(userId => {
                const user = getUserById(userId);
                return (
                  <div key={userId} className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => {
                    setSelectedProfile(user);
                    setShowLikesModal(null);
                    setActiveView('viewProfile');
                  }}>
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-orange-500">{user.faculty}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Ayllu
              </div>
              <div className="text-xs text-gray-500 font-medium">San Marcos</div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveView('notificaciones')}
                className="relative p-2 hover:bg-gray-900 rounded-full transition-colors"
              >
                <Bell size={20} />
                {notificaciones.filter(n => n.nueva).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <div className="hidden md:block text-sm text-gray-400">
                {currentUser.name}
              </div>
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setPantalla('landing');
                }}
                className="text-gray-400 hover:text-red-500 p-2"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="hidden md:block">
            <nav className="sticky top-20 space-y-2">
              {[
                { icon: Home, label: 'Inicio', view: 'feed' },
                { icon: Search, label: 'Buscar', view: 'search' },
                { icon: Users, label: 'Conexiones', view: 'connections' },
                { icon: Mail, label: 'Mensajes', view: 'messages' },
                { icon: Bell, label: 'Notificaciones', view: 'notificaciones' },
                { icon: User, label: 'Perfil', view: 'profile' }
              ].map((item) => (
                <button
                  key={item.view}
                  onClick={() => setActiveView(item.view)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
                    activeView === item.view || (activeView === 'viewProfile' && item.view === 'search') || (activeView === 'editProfile' && item.view === 'profile')
                      ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 text-orange-500 font-bold' 
                      : 'hover:bg-gray-900 text-gray-400'
                  }`}
                >
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            {activeView === 'feed' && renderFeed()}
            {activeView === 'connections' && renderConnections()}
            {activeView === 'search' && renderSearch()}
            {activeView === 'messages' && renderMessages()}
            {activeView === 'notificaciones' && renderNotificaciones()}
            {activeView === 'profile' && renderProfile()}
            {activeView === 'viewProfile' && renderViewProfile()}
            {activeView === 'editProfile' && renderEditProfile()}
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-gray-800">
        <div className="flex items-center justify-around h-16">
          {[
            { icon: Home, view: 'feed' },
            { icon: Search, view: 'search' },
            { icon: Users, view: 'connections' },
            { icon: Mail, view: 'messages' },
            { icon: User, view: 'profile' }
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`p-3 ${
                activeView === item.view || (activeView === 'viewProfile' && item.view === 'search') || (activeView === 'editProfile' && item.view === 'profile')
                  ? 'text-orange-500' 
                  : 'text-gray-500'
              }`}
            >
              <item.icon size={24} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
