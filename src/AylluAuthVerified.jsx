import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, UserPlus, Search, Home, Users, Mail, User, X, Check, ArrowLeft, Edit2, MapPin, Bell, LogOut, GraduationCap, Sparkles, Share2, Image as ImageIcon } from 'lucide-react';
import { supabase } from './lib/supabase';

const CARRERAS = [
  "Derecho", "Medicina", "Ingeniería de Sistemas", "Administración",
  "Psicología", "Economía", "Contabilidad", "Educación", "Letras", "Biología"
];

export default function AylluAuthVerified() {
  const [pantalla, setPantalla] = useState('landing');
  const [modoAuth, setModoAuth] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    carrera: '',
    password: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [activeView, setActiveView] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [showLikesModal, setShowLikesModal] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await handleAuthUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setAuthUser(null);
        setCurrentUser(null);
        setPantalla('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await handleAuthUser(session.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthUser = async (user) => {
    setAuthUser(user);
    
    // Buscar perfil del usuario en nuestra tabla
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (profile) {
      setCurrentUser(profile);
      setPantalla('app');
      loadInitialData();
    } else {
      // Usuario autenticado pero sin perfil - crear perfil
      setPantalla('completeProfile');
    }
  };

  const loadInitialData = async () => {
    try {
      // Cargar usuarios
      const { data: usersData } = await supabase
        .from('users')
        .select('*');
      
      if (usersData) setUsers(usersData);

      // Cargar posts
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          users(id, name, username, faculty, avatar),
          likes(user_id),
          comments(*, users(name, avatar))
        `)
        .order('created_at', { ascending: false });
      
      if (postsData) {
        const formattedPosts = postsData.map(post => ({
          id: post.id,
          userId: post.user_id,
          content: post.content,
          image: post.image,
          likes: post.likes.map(like => like.user_id),
          comments: post.comments.map(comment => ({
            userId: comment.user_id,
            text: comment.text,
            timestamp: new Date(comment.created_at).getTime()
          })),
          timestamp: new Date(post.created_at).getTime()
        }));
        setAllPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          alert('Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
        } else {
          alert('Error: ' + error.message);
        }
        return;
      }

      // El handleAuthUser se ejecutará automáticamente por el listener
    } catch (error) {
      console.error('Error login:', error);
      alert('Error al iniciar sesión');
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

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.nombre,
            faculty: formData.carrera
          }
        }
      });

      if (error) {
        alert('Error: ' + error.message);
        return;
      }

      alert('¡Registro exitoso! Revisa tu email para verificar tu cuenta antes de iniciar sesión.');
      setModoAuth('login');
    } catch (error) {
      console.error('Error registro:', error);
      alert('Error al registrar usuario');
    }
  };

  const completeProfile = async () => {
    if (!authUser) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: authUser.email,
          name: authUser.user_metadata.name || formData.nombre,
          username: (authUser.user_metadata.name || formData.nombre).toLowerCase().replace(/ /g, '_'),
          faculty: authUser.user_metadata.faculty || formData.carrera,
          year: '1er año',
          bio: 'Estudiante de San Marcos 🎓',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
        }])
        .select()
        .single();

      if (error) throw error;

      setCurrentUser(data);
      setUsers([...users, data]);
      setPantalla('app');
      loadInitialData();
    } catch (error) {
      console.error('Error completing profile:', error);
      alert('Error al completar perfil');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Resto de funciones (createPost, likePost, etc.) - iguales que antes
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

      if (error) throw error;

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
      setNewPost('');
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error al crear publicación');
    }
  };

  const likePost = async (postId) => {
    try {
      const post = allPosts.find(p => p.id === postId);
      const hasLiked = post.likes.includes(currentUser.id);

      if (hasLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id);
      } else {
        await supabase
          .from('likes')
          .insert([{
            post_id: postId,
            user_id: currentUser.id
          }]);
      }

      setAllPosts(allPosts.map(p => {
        if (p.id === postId) {
          const likes = hasLiked
            ? p.likes.filter(id => id !== currentUser.id)
            : [...p.likes, currentUser.id];
          return { ...p, likes };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: currentUser.id,
          text: text.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      setAllPosts(allPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              userId: currentUser.id,
              text: text.trim(),
              timestamp: new Date(data.created_at).getTime()
            }]
          };
        }
        return post;
      }));

      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Helper functions
  const getUserById = (id) => users.find(u => u.id === id) || currentUser;
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Pantalla completar perfil
  if (pantalla === 'completeProfile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido a Ayllu!</h2>
            <p className="text-cyan-200">Completa tu perfil para continuar</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Nombre Completo</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Tu nombre completo"
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
            <button
              onClick={completeProfile}
              disabled={!formData.nombre || !formData.carrera}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50"
            >
              Completar Perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LANDING PAGE (igual que antes pero con validación @unmsm.edu.pe)
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
                    <p className="text-cyan-300 text-lg">Comunidad Sanmarquina Verificada</p>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-100 font-medium">Solo estudiantes verificados @unmsm.edu.pe</span>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Comunidad Verificada</h3>
                      <p className="text-cyan-200 text-sm">Solo estudiantes con email @unmsm.edu.pe pueden unirse</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Seguridad Garantizada</h3>
                      <p className="text-cyan-200 text-sm">Verificación por email institucional obligatoria</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setModoAuth('login')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    modoAuth === 'login' ? 'bg-white text-blue-900' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setModoAuth('registro')}
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
                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
                  >
                    Entrar
                  </button>
                </div>
              )}

              {modoAuth === 'registro' && (
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
                    <p className="text-xs text-cyan-300 mt-1">Solo emails @unmsm.edu.pe son válidos</p>
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
                    Crear cuenta verificada
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // APP PRINCIPAL - Feed simplificado (igual que antes)
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Ayllu
              </div>
              <div className="text-xs text-gray-500 font-medium">Verificado</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-400">
                {currentUser?.name}
              </div>
              <img src={currentUser?.avatar} alt={currentUser?.name} className="w-10 h-10 rounded-full object-cover" />
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 p-2"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        {/* Crear Post */}
        <div className="bg-gray-900 p-4 rounded-2xl mb-4">
          <div className="flex space-x-3">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="¿Qué quieres compartir con la comunidad sanmarquina verificada?"
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

        {/* Feed de Posts */}
        {allPosts.map(post => {
          const author = getUserById(post.userId);
          return (
            <div key={post.id} className="bg-gray-900 p-4 rounded-2xl mb-4">
              <div className="flex space-x-3">
                <img src={author?.avatar} alt={author?.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {author?.name}
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      </div>
                      <div className="text-sm text-orange-500">{author?.faculty}</div>
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
                        post.likes.includes(currentUser?.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart size={20} fill={post.likes.includes(currentUser?.id) ? 'currentColor' : 'none'} />
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
                              <img src={commentAuthor?.avatar} alt={commentAuthor?.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                              <div className="flex-1 bg-gray-800 rounded-lg p-2">
                                <div className="font-semibold text-sm flex items-center gap-1">
                                  {commentAuthor?.name}
                                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check size={8} className="text-white" />
                                  </div>
                                </div>
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
        })}

        {allPosts.length === 0 && (
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <Users size={48} className="mx-auto text-gray-600 mb-3" />
            <h3 className="text-xl font-bold mb-2">¡Bienvenido a la comunidad verificada!</h3>
            <p className="text-gray-400 mb-4">Sé el primero en compartir algo con estudiantes verificados de San Marcos</p>
          </div>
        )}
      </div>

      {/* Modal de Likes */}
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
                  <div key={userId} className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-lg transition-colors">
                    <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        {user?.name}
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check size={8} className="text-white" />
                        </div>
                      </div>
                      <div className="text-sm text-orange-500">{user?.faculty}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}