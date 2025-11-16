import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, UserPlus, Search, Home, Users, Mail, User, X, Check, ArrowLeft, Edit2, MapPin, Bell, LogOut, GraduationCap, Sparkles, TrendingUp, Share2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import authService from './services/authService';

const CARRERAS = [
  "Derecho", "Medicina", "Ingeniería de Sistemas", "Administración",
  "Psicología", "Economía", "Contabilidad", "Educación", "Letras", "Biología"
];

export default function AylluIntegrado() {
  const [pantalla, setPantalla] = useState('loading');
  const [modoAuth, setModoAuth] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false); // true cuando viene del email
  const [newPasswordData, setNewPasswordData] = useState({ password: '', confirmPassword: '' });
  const [lastResetRequest, setLastResetRequest] = useState(null);

  // Cargar datos de Supabase al iniciar
  useEffect(() => {
    checkAuthState();
    checkResetPasswordToken();
  }, []);

  const checkResetPasswordToken = () => {
    // Verificar si hay un token de reset en la URL (viene del email)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      // Usuario viene del link de reset password
      setResetPasswordMode(true);
      setPantalla('reset-password');
    }
  };

  const checkAuthState = async () => {
    try {
      const { success, session, profile } = await authService.getCurrentSession();
      
      if (success && session && profile) {
        setCurrentUser(profile);
        await loadSupabaseData();
        setPantalla('app');
      } else {
        setPantalla('landing');
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      setPantalla('landing');
    }
  };

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

      // Cargar notificaciones y conversaciones si el usuario está autenticado
      if (currentUser) {
        await loadNotifications();
        await loadConversations();
      }
    } catch (error) {
      console.log('Error cargando datos:', error);
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
      id: 'demo-1',
      name: 'María González',
      username: 'maria.gonzalez',
      email: 'maria@unmsm.edu.pe',
      faculty: 'Derecho',
      carrera: 'Derecho',
      bio: 'Estudiante de Derecho apasionada por la justicia social 📚⚖️',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      location: 'Lima, Perú',
      website: 'mariagonzalez.pe',
      followers: ['demo-2', 'demo-3', 'demo-5'],
      following: ['demo-2', 'demo-4'],
      connections: ['demo-2', 'demo-3', 'demo-5'],
      created_at: new Date('2024-01-15').toISOString()
    },
    {
      id: 'demo-2',
      name: 'Carlos Ramírez',
      username: 'carlos.ramirez',
      email: 'carlos@unmsm.edu.pe',
      faculty: 'Ingeniería de Sistemas',
      carrera: 'Ingeniería de Sistemas',
      bio: '💻 Desarrollador Full Stack | Tech enthusiast | UNMSM 🎓',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      location: 'San Miguel, Lima',
      website: 'github.com/carlosdev',
      followers: ['demo-1', 'demo-3', 'demo-4'],
      following: ['demo-1', 'demo-3', 'demo-5'],
      connections: ['demo-1', 'demo-3', 'demo-4'],
      created_at: new Date('2024-02-20').toISOString()
    },
    {
      id: 'demo-3',
      name: 'Ana Flores',
      username: 'ana.flores',
      email: 'ana@unmsm.edu.pe',
      faculty: 'Medicina',
      carrera: 'Medicina',
      bio: 'Futura médica cirujana 🩺 | Voluntaria en hospitales | Amante de la ciencia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      location: 'Pueblo Libre, Lima',
      website: '',
      followers: ['demo-1', 'demo-2', 'demo-4', 'demo-5'],
      following: ['demo-2', 'demo-4'],
      connections: ['demo-1', 'demo-2', 'demo-4'],
      created_at: new Date('2024-03-10').toISOString()
    },
    {
      id: 'demo-4',
      name: 'Luis Torres',
      username: 'luis.torres',
      email: 'luis@unmsm.edu.pe',
      faculty: 'Administración',
      carrera: 'Administración',
      bio: 'Emprendedor | Business Student | Marketing Digital 📊',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis',
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      location: 'Miraflores, Lima',
      website: 'luistorres.com',
      followers: ['demo-2', 'demo-3', 'demo-5'],
      following: ['demo-1', 'demo-3', 'demo-5'],
      connections: ['demo-2', 'demo-3', 'demo-5'],
      created_at: new Date('2024-04-05').toISOString()
    },
    {
      id: 'demo-5',
      name: 'Sofia Mendoza',
      username: 'sofia.mendoza',
      email: 'sofia@unmsm.edu.pe',
      faculty: 'Psicología',
      carrera: 'Psicología',
      bio: '🧠 Psicóloga en formación | Salud mental matters | UNMSM Pride 💚❤️',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      location: 'Jesús María, Lima',
      website: '',
      followers: ['demo-1', 'demo-4'],
      following: ['demo-1', 'demo-2', 'demo-3', 'demo-4'],
      connections: ['demo-1', 'demo-4'],
      created_at: new Date('2024-05-12').toISOString()
    }
  ]);

  const [allPosts, setAllPosts] = useState([
    {
      id: 'post-1',
      userId: 'demo-1',
      content: '¡Qué emoción! Acabo de terminar mi primer caso práctico en Derecho Civil. La carrera está cada vez más interesante 📚⚖️ #DerechoUNMSM #EstudianteMotivada',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      likes: ['demo-2', 'demo-3', 'demo-5'],
      comments: [
        { userId: 'demo-2', text: '¡Felicidades María! Se ve que le pones muchas ganas 👏', timestamp: Date.now() - 3600000 },
        { userId: 'demo-3', text: 'Inspiras mucho! Sigue así 💪', timestamp: Date.now() - 1800000 }
      ],
      timestamp: Date.now() - 7200000
    },
    {
      id: 'post-2',
      userId: 'demo-2',
      content: '🚀 Nuevo proyecto: Desarrollando una app web con React y Supabase. La tecnología nunca deja de sorprenderme. ¿Alguien más trabajando con estas tecnologías? #WebDev #ReactJS #Supabase',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
      likes: ['demo-1', 'demo-4', 'demo-5'],
      comments: [
        { userId: 'demo-4', text: 'Suena increíble! Me encantaría aprender React', timestamp: Date.now() - 5400000 },
        { userId: 'demo-1', text: 'Wow Carlos, eres un crack! 🔥', timestamp: Date.now() - 3600000 }
      ],
      timestamp: Date.now() - 14400000
    },
    {
      id: 'post-3',
      userId: 'demo-3',
      content: 'Hoy tuvimos práctica de anatomía en el laboratorio. Cada día me convenzo más de que elegí la carrera correcta 🩺❤️ La medicina es vocación #MedicinaUNMSM #FuturaDoctora',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
      likes: ['demo-1', 'demo-2', 'demo-4', 'demo-5'],
      comments: [
        { userId: 'demo-5', text: 'Qué admirable Ana! Serás una excelente doctora 💚', timestamp: Date.now() - 7200000 },
        { userId: 'demo-2', text: 'Mucha suerte en tus prácticas!', timestamp: Date.now() - 5400000 },
        { userId: 'demo-1', text: 'Orgullo sanmarquino! 💪', timestamp: Date.now() - 3600000 }
      ],
      timestamp: Date.now() - 21600000
    },
    {
      id: 'post-4',
      userId: 'demo-4',
      content: '📊 Workshop de Marketing Digital este sábado en la Facultad de Administración. Aprenderemos sobre redes sociales, SEO y estrategias digitales. ¿Quién se anima? Inscripciones abiertas! 🚀',
      likes: ['demo-2', 'demo-3'],
      comments: [
        { userId: 'demo-3', text: 'Me interesa! Cómo me inscribo?', timestamp: Date.now() - 10800000 },
        { userId: 'demo-2', text: 'Suena genial, ahí estaré! 👍', timestamp: Date.now() - 9000000 }
      ],
      timestamp: Date.now() - 28800000
    },
    {
      id: 'post-5',
      userId: 'demo-5',
      content: 'La salud mental es tan importante como la física 🧠💚 Recuerden tomarse pausas, hablar de sus emociones y pedir ayuda cuando lo necesiten. Estamos aquí para apoyarnos #SaludMental #PsicologíaUNMSM',
      likes: ['demo-1', 'demo-2', 'demo-3', 'demo-4'],
      comments: [
        { userId: 'demo-1', text: 'Gracias Sofia por este recordatorio ❤️', timestamp: Date.now() - 14400000 },
        { userId: 'demo-4', text: 'Muy necesario este mensaje 🙏', timestamp: Date.now() - 12600000 },
        { userId: 'demo-3', text: 'Totalmente de acuerdo! 💪', timestamp: Date.now() - 10800000 }
      ],
      timestamp: Date.now() - 36000000
    },
    {
      id: 'post-6',
      userId: 'demo-1',
      content: 'Tarde de estudio en la Biblioteca Central 📖☕ Hay algo mágico en estudiar rodeada de libros antiguos. UNMSM tiene una historia increíble 💚❤️',
      likes: ['demo-3', 'demo-5'],
      comments: [],
      timestamp: Date.now() - 43200000
    },
    {
      id: 'post-7',
      userId: 'demo-2',
      content: '💡 Tip para estudiantes de sistemas: No memoricen código, entiendan la lógica. La programación es resolver problemas, no copiar y pegar. #CodingTips #SistemasUNMSM',
      likes: ['demo-4'],
      comments: [
        { userId: 'demo-4', text: 'Excelente consejo! Lo aplicaré', timestamp: Date.now() - 18000000 }
      ],
      timestamp: Date.now() - 50400000
    }
  ]);

  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      withUserId: 'demo-2',
      participants: ['demo-1', 'demo-2'],
      messages: [
        { senderId: 'demo-2', text: 'Hola María! Vi tu post sobre Derecho Civil, muy interesante', timestamp: Date.now() - 86400000 },
        { senderId: 'demo-1', text: 'Gracias Carlos! Me encanta esta materia', timestamp: Date.now() - 82800000 },
        { senderId: 'demo-2', text: 'Se nota tu pasión por lo que estudias 👏', timestamp: Date.now() - 79200000 },
        { senderId: 'demo-1', text: 'Y tú cómo vas con tus proyectos de programación?', timestamp: Date.now() - 75600000 },
        { senderId: 'demo-2', text: 'Bastante bien! Ahora estoy con React, es genial', timestamp: Date.now() - 72000000 }
      ],
      lastMessage: Date.now() - 72000000
    },
    {
      id: 'conv-2',
      withUserId: 'demo-3',
      participants: ['demo-1', 'demo-3'],
      messages: [
        { senderId: 'demo-3', text: 'María! Cómo estás? Tiempo sin hablar', timestamp: Date.now() - 172800000 },
        { senderId: 'demo-1', text: 'Ana! Todo bien, full con los estudios jaja', timestamp: Date.now() - 169200000 },
        { senderId: 'demo-3', text: 'Te entiendo perfectamente! La medicina me tiene absorbida', timestamp: Date.now() - 165600000 },
        { senderId: 'demo-1', text: 'Pero vale la pena, vas a ser una excelente doctora 🩺', timestamp: Date.now() - 162000000 },
        { senderId: 'demo-3', text: 'Aww gracias! Tú también serás una gran abogada', timestamp: Date.now() - 158400000 },
        { senderId: 'demo-1', text: 'Gracias amiga! 💚', timestamp: Date.now() - 154800000 }
      ],
      lastMessage: Date.now() - 154800000
    },
    {
      id: 'conv-3',
      withUserId: 'demo-4',
      participants: ['demo-2', 'demo-4'],
      messages: [
        { senderId: 'demo-4', text: 'Carlos, me ayudas con un tema de programación?', timestamp: Date.now() - 43200000 },
        { senderId: 'demo-2', text: 'Claro Luis! Dime en qué te puedo ayudar', timestamp: Date.now() - 39600000 },
        { senderId: 'demo-4', text: 'Necesito hacer una página web para mi proyecto de marketing', timestamp: Date.now() - 36000000 },
        { senderId: 'demo-2', text: 'Perfecto! Podemos usar HTML, CSS y JS básico', timestamp: Date.now() - 32400000 },
        { senderId: 'demo-4', text: 'Genial! Cuándo podemos juntarnos?', timestamp: Date.now() - 28800000 },
        { senderId: 'demo-2', text: 'Este viernes estoy libre, te parece?', timestamp: Date.now() - 25200000 },
        { senderId: 'demo-4', text: 'Perfecto! Nos vemos el viernes entonces 👍', timestamp: Date.now() - 21600000 }
      ],
      lastMessage: Date.now() - 21600000
    }
  ]);
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 'notif-1',
      type: 'like',
      userId: 'demo-2',
      postId: 'post-1',
      timestamp: Date.now() - 3600000,
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'notif-2',
      type: 'comment',
      userId: 'demo-3',
      postId: 'post-1',
      timestamp: Date.now() - 1800000,
      read: false,
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'notif-3',
      type: 'follow',
      userId: 'demo-5',
      timestamp: Date.now() - 7200000,
      read: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'notif-4',
      type: 'like',
      userId: 'demo-4',
      postId: 'post-6',
      timestamp: Date.now() - 14400000,
      read: true,
      created_at: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: 'notif-5',
      type: 'message',
      userId: 'demo-2',
      timestamp: Date.now() - 21600000,
      read: true,
      created_at: new Date(Date.now() - 21600000).toISOString()
    }
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
  const [isPosting, setIsPosting] = useState(false);

  const handleLogin = async () => {
    if (!formData.email?.trim() || !formData.password?.trim()) {
      setAuthError('Por favor ingresa email y contraseña');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const result = await authService.signIn({
        email: formData.email.trim(),
        password: formData.password
      });

      if (result.success) {
        setCurrentUser(result.data.profile);
        await loadSupabaseData();
        setFormData({
          email: '',
          nombre: '',
          carrera: '',
          password: '',
          confirmPassword: ''
        });
        setPantalla('app');
      } else {
        // Traducir errores al español
        let errorMsg = result.error;
        if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('incorrectos')) {
          errorMsg = '❌ Email o contraseña incorrectos. Por favor verifica tus credenciales.';
        } else if (errorMsg.includes('Email not confirmed')) {
          errorMsg = '✉️ Tu email aún no está confirmado. Revisa tu bandeja de entrada.';
        }
        setAuthError(errorMsg);
      }
    } catch (error) {
      console.error('Error login:', error);
      setAuthError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegistro = async () => {
    if (formData.password !== formData.confirmPassword) {
      setAuthError('Las contraseñas no coinciden');
      return;
    }
    if (!formData.nombre || !formData.carrera || !formData.email) {
      setAuthError('Por favor completa todos los campos');
      return;
    }
    if (!formData.email.includes('@unmsm.edu.pe')) {
      setAuthError('Debes usar tu email institucional @unmsm.edu.pe');
      return;
    }
    if (formData.password.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const result = await authService.signUp({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.nombre.trim(),
        faculty: formData.carrera
      });

      if (result.success) {
        // Sesión iniciada automáticamente
        setCurrentUser(result.data.profile);
        await loadSupabaseData();
        setFormData({
          email: '',
          nombre: '',
          carrera: '',
          password: '',
          confirmPassword: ''
        });
        setAuthSuccess('¡Bienvenido a Ayllu! 🎉 Tu cuenta ha sido creada exitosamente');
        setTimeout(() => {
          setPantalla('app');
        }, 1500);
      } else {
        // Traducir errores comunes al español
        let errorMsg = result.error;
        if (errorMsg.includes('Email not confirmed')) {
          errorMsg = '✉️ Por favor verifica tu email. Hemos enviado un link de confirmación a tu correo institucional.';
        } else if (errorMsg.includes('User already registered') || errorMsg.includes('already been registered')) {
          setAuthError('Este email ya está registrado.');
          // Cambiar automáticamente a login después de 2 segundos
          setTimeout(() => {
            setModoAuth('login');
            setAuthError('');
            setAuthSuccess('💡 Ya tienes una cuenta. Inicia sesión aquí');
            setTimeout(() => setAuthSuccess(''), 3000);
          }, 2000);
          return;
        } else if (errorMsg.includes('email_address_invalid')) {
          errorMsg = 'El correo electrónico no es válido';
        }
        setAuthError(errorMsg);
      }
    } catch (error) {
      console.error('Error registro:', error);
      setAuthError('Error al crear cuenta. Intenta nuevamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email?.trim()) {
      setAuthError('Por favor ingresa tu email');
      return;
    }

    // Validar tiempo mínimo entre solicitudes (10 minutos)
    const now = Date.now();
    const minWaitTime = 10 * 60 * 1000; // 10 minutos en milisegundos
    
    if (lastResetRequest && (now - lastResetRequest) < minWaitTime) {
      const remainingSeconds = Math.ceil((minWaitTime - (now - lastResetRequest)) / 1000);
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      const remainingSecondsInMinute = remainingSeconds % 60;
      
      setAuthError(
        `Por seguridad, debes esperar ${remainingMinutes} minutos y ${remainingSecondsInMinute} segundos antes de solicitar otro correo de recuperación.`
      );
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const result = await authService.resetPassword(formData.email.trim());

      if (result.success) {
        setLastResetRequest(Date.now());
        setAuthSuccess('📧 ¡Listo! Revisa tu bandeja de entrada. Te hemos enviado un link para restablecer tu contraseña.');
        setTimeout(() => {
          setShowResetPassword(false);
          setAuthSuccess('');
        }, 4000);
      } else {
        // Traducir mensajes de error de Supabase al español
        let errorMsg = result.error;
        if (errorMsg.includes('security purposes') || errorMsg.includes('only request this after')) {
          errorMsg = 'Por seguridad, debes esperar 10 minutos antes de solicitar otro correo de recuperación.';
        } else if (errorMsg.includes('Email rate limit exceeded')) {
          errorMsg = 'Has excedido el límite de correos. Por favor espera 10 minutos antes de intentar nuevamente.';
        }
        setAuthError(errorMsg);
      }
    } catch (error) {
      console.error('Error reset password:', error);
      setAuthError('Error al solicitar restablecimiento. Intenta nuevamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setPantalla('landing');
    } catch (error) {
      console.error('Error logout:', error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPasswordData.password || !newPasswordData.confirmPassword) {
      setAuthError('Por favor completa ambos campos');
      return;
    }

    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      setAuthError('Las contraseñas no coinciden');
      return;
    }

    if (newPasswordData.password.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const result = await authService.updatePassword(newPasswordData.password);

      if (result.success) {
        setAuthSuccess('✅ Contraseña actualizada exitosamente. Redirigiendo al inicio de sesión...');
        setNewPasswordData({ password: '', confirmPassword: '' });
        
        // Obtener el email del usuario actual de la sesión
        const { data: { user } } = await supabase.auth.getUser();
        const userEmail = user?.email;
        
        // Cerrar sesión actual
        await authService.signOut();
        
        // Redirigir a login después de 2 segundos con el email precargado
        setTimeout(() => {
          setResetPasswordMode(false);
          setPantalla('landing');
          setModoAuth('login');
          if (userEmail) {
            setFormData(prev => ({ ...prev, email: userEmail }));
          }
          window.location.hash = ''; // Limpiar hash de la URL
          setAuthSuccess('');
        }, 2000);
      } else {
        setAuthError(result.error);
      }
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      setAuthError('Error al actualizar contraseña. Intenta nuevamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  const getUserById = (id) => {
    const user = users.find(u => u.id === id);
    if (!user && id === currentUser?.id) return currentUser;
    if (!user) {
      // Usuario por defecto si no se encuentra
      return {
        id,
        name: 'Usuario',
        username: 'usuario',
        faculty: 'UNMSM',
        avatar: `https://ui-avatars.com/api/?name=Usuario&background=random`,
        bio: '',
        connections: [],
        location: 'Lima, Perú'
      };
    }
    return user;
  };

  const isConnected = (userId) => currentUser?.connections.includes(userId);
  const getFeedPosts = () => allPosts.filter(post => currentUser?.connections.includes(post.userId)).sort((a, b) => b.timestamp - a.timestamp);
  const getSuggestions = () => users.filter(u => u.id !== currentUser?.id && !currentUser?.connections.includes(u.id));

  const addConnection = async (userId) => {
    try {
      // Crear conexión en Supabase
      const { error } = await supabase
        .from('connections')
        .insert([{
          user_id: currentUser.id,
          connected_user_id: userId
        }]);

      if (error) {
        console.error('Error creando conexión:', error);
        return;
      }

      // Actualizar el array de connections en la tabla users (ambos usuarios)
      const updatedConnections = [...(currentUser.connections || []), userId];
      
      await supabase
        .from('users')
        .update({ connections: updatedConnections })
        .eq('id', currentUser.id);

      // Obtener conexiones del otro usuario y agregarle este usuario
      const { data: otherUser } = await supabase
        .from('users')
        .select('connections')
        .eq('id', userId)
        .single();

      if (otherUser) {
        const otherUserConnections = [...(otherUser.connections || []), currentUser.id];
        await supabase
          .from('users')
          .update({ connections: otherUserConnections })
          .eq('id', userId);
      }

      // Actualizar estado local
      setCurrentUser(prev => ({ ...prev, connections: updatedConnections }));
      setUsers(users.map(u => 
        u.id === userId 
          ? {...u, connections: [...(u.connections || []), currentUser.id]} 
          : u.id === currentUser.id
          ? {...u, connections: updatedConnections}
          : u
      ));

      // Crear notificación
      await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          type: 'follow',
          from_user_id: currentUser.id
        }]);

    } catch (error) {
      console.error('Error al conectar:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.trim() && !imagePreview) return;

    setIsPosting(true);
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
        console.error('Error creando post:', error);
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
    } finally {
      setIsPosting(false);
    }
  };

  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      // Insertar comentario en Supabase
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: currentUser.id,
          text: text.trim()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error agregando comentario:', error);
        return;
      }

      // Actualizar estado local
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
      setNewComment({...newComment, [postId]: ''});

      // Crear notificación para el autor del post
      const post = allPosts.find(p => p.id === postId);
      if (post && post.userId !== currentUser.id) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: post.userId,
            type: 'comment',
            from_user_id: currentUser.id,
            post_id: postId
          }]);
      }
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const sharePost = (postId) => {
    const post = allPosts.find(p => p.id === postId);
    if (post) {
      const shareText = `${post.content}\n\n- Compartido desde Ayllu UNMSM`;
      navigator.clipboard.writeText(shareText);
      alert('¡Link copiado al portapapeles!');
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    try {
      // Mostrar preview local inmediatamente
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir a Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error subiendo imagen:', error);
        // Si falla la subida, usar el preview local
        return;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Actualizar preview con URL pública
      setImagePreview(publicUrl);
    } catch (error) {
      console.error('Error procesando imagen:', error);
      alert('Error al procesar la imagen');
    }
  };

  const likePost = async (postId) => {
    try {
      const post = allPosts.find(p => p.id === postId);
      const isLiked = post.likes.includes(currentUser.id);

      if (isLiked) {
        // Quitar like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id);

        if (error) {
          console.error('Error quitando like:', error);
          return;
        }
      } else {
        // Dar like
        const { error } = await supabase
          .from('likes')
          .insert([{
            post_id: postId,
            user_id: currentUser.id
          }]);

        if (error) {
          console.error('Error dando like:', error);
          return;
        }

        // Crear notificación para el autor del post
        if (post.userId !== currentUser.id) {
          await supabase
            .from('notifications')
            .insert([{
              user_id: post.userId,
              type: 'like',
              from_user_id: currentUser.id,
              post_id: postId
            }]);
        }
      }

      // Actualizar estado local
      setAllPosts(allPosts.map(p => {
        if (p.id === postId) {
          const likes = isLiked
            ? p.likes.filter(id => id !== currentUser.id)
            : [...p.likes, currentUser.id];
          return {...p, likes};
        }
        return p;
      }));
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || selectedConversation === null) return;

    try {
      // Insertar mensaje en Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: selectedConversation,
          sender_id: currentUser.id,
          text: newMessage.trim()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error enviando mensaje:', error);
        return;
      }

      // Actualizar estado local
      const convIndex = conversations.findIndex(c => c.id === selectedConversation);
      if (convIndex !== -1) {
        const updated = [...conversations];
        updated[convIndex].messages.push({
          from: currentUser.id,
          text: newMessage.trim(),
          timestamp: new Date(data.created_at).getTime()
        });
        setConversations(updated);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const startConversation = async (userId) => {
    try {
      // Verificar si ya existe una conversación
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${currentUser.id})`)
        .maybeSingle();

      if (existingConv) {
        // Cargar mensajes de la conversación existente
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', existingConv.id)
          .order('created_at', { ascending: true });

        const formattedMessages = messages?.map(m => ({
          from: m.sender_id,
          text: m.text,
          timestamp: new Date(m.created_at).getTime()
        })) || [];

        const existing = conversations.find(c => c.id === existingConv.id);
        if (!existing) {
          setConversations([...conversations, {
            id: existingConv.id,
            withUserId: userId,
            messages: formattedMessages
          }]);
        }
        setSelectedConversation(existingConv.id);
      } else {
        // Crear nueva conversación
        const { data: newConv, error } = await supabase
          .from('conversations')
          .insert([{
            user1_id: currentUser.id,
            user2_id: userId
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creando conversación:', error);
          return;
        }

        setConversations([...conversations, {
          id: newConv.id,
          withUserId: userId,
          messages: []
        }]);
        setSelectedConversation(newConv.id);
      }
      setActiveView('messages');
    } catch (error) {
      console.error('Error al iniciar conversación:', error);
    }
  };

  const updateProfile = async () => {
    if (!editingProfile) return;

    try {
      // Actualizar perfil en Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: editingProfile.name,
          faculty: editingProfile.faculty,
          year: editingProfile.year,
          bio: editingProfile.bio,
          avatar: editingProfile.avatar
        })
        .eq('id', currentUser.id);

      if (error) {
        console.error('Error actualizando perfil:', error);
        alert('Error al actualizar perfil');
        return;
      }

      // Actualizar estado local
      setCurrentUser(editingProfile);
      setUsers(users.map(u => u.id === currentUser.id ? editingProfile : u));
      setEditingProfile(null);
      setActiveView('profile');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
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

  const marcarNotificacionLeida = async (id) => {
    try {
      // Marcar como leída en Supabase
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      // Actualizar estado local - marcar ambos campos
      setNotificaciones(notificaciones.map(n => 
        n.id === id ? { ...n, read: true, nueva: false } : n
      ));
    } catch (error) {
      console.error('Error marcando notificación:', error);
    }
  };

  // Cargar notificaciones desde Supabase
  const loadNotifications = async () => {
    if (!currentUser) return;

    try {
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

      if (data && data.length > 0) {
        const formattedNotifs = data.map(n => ({
          id: n.id,
          type: n.type,
          userId: n.from_user_id,
          postId: n.post_id,
          timestamp: new Date(n.created_at).getTime(),
          read: n.read,
          created_at: n.created_at
        }));
        setNotificaciones(formattedNotifs);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const loadConversations = async () => {
    if (!currentUser) return;

    try {
      const { data } = await supabase
        .from('conversations')
        .select(`
          *,
          messages(*)
        `)
        .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
        .order('updated_at', { ascending: false });

      if (data && data.length > 0) {
        const formattedConvs = data.map(conv => {
          const withUserId = conv.user1_id === currentUser.id ? conv.user2_id : conv.user1_id;
          
          // Convertir mensajes al formato esperado por la UI
          const messages = (conv.messages || [])
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map(msg => ({
              from: msg.sender_id,
              text: msg.content,
              timestamp: new Date(msg.created_at).getTime()
            }));
          
          return {
            id: conv.id,
            withUserId,
            messages
          };
        });
        setConversations(formattedConvs);
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    }
  };

  // LANDING PAGE
  if (pantalla === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-cyan-300 mt-4">Cargando Ayllu UNMSM...</p>
        </div>
      </div>
    );
  }

  // PANTALLA DE RESET DE CONTRASEÑA
  if (pantalla === 'reset-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nueva Contraseña</h2>
            <p className="text-cyan-300 text-sm">Ingresa tu nueva contraseña para tu cuenta de Ayllu UNMSM</p>
          </div>

          {authError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-4">
              {authError}
            </div>
          )}
          
          {authSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <span>{authSuccess}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Nueva Contraseña</label>
              <input
                type="password"
                value={newPasswordData.password}
                onChange={(e) => setNewPasswordData({...newPasswordData, password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="••••••••"
                disabled={authLoading}
              />
              <p className="text-xs text-cyan-300 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={newPasswordData.confirmPassword}
                onChange={(e) => setNewPasswordData({...newPasswordData, confirmPassword: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && !authLoading && handleUpdatePassword()}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="••••••••"
                disabled={authLoading}
              />
            </div>

            <button
              onClick={handleUpdatePassword}
              disabled={authLoading || !newPasswordData.password || !newPasswordData.confirmPassword}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <span>Actualizar Contraseña</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  {authError && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                      {authError}
                    </div>
                  )}
                  
                  {authSuccess && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm">
                      {authSuccess}
                    </div>
                  )}

                  {showResetPassword ? (
                    <>
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">Recuperar Contraseña</h3>
                        <p className="text-sm text-cyan-300">
                          Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Email Institucional</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="tu@unmsm.edu.pe"
                          disabled={authLoading}
                        />
                      </div>
                      
                      <button
                        onClick={handleResetPassword}
                        disabled={!formData.email || authLoading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {authLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <span>Enviar Instrucciones</span>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowResetPassword(false);
                          setAuthError('');
                          setAuthSuccess('');
                        }}
                        className="w-full text-cyan-300 hover:text-cyan-200 transition-colors text-sm"
                      >
                        Volver a iniciar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Email Institucional</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="tu@unmsm.edu.pe"
                          disabled={authLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Contraseña</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          onKeyPress={(e) => e.key === 'Enter' && !authLoading && handleLogin()}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="••••••••"
                          disabled={authLoading}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <label className="flex items-center text-white">
                          <input type="checkbox" className="mr-2 rounded" />
                          Recordarme
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            setShowResetPassword(true);
                            setAuthError('');
                            setAuthSuccess('');
                          }}
                          disabled={authLoading}
                          className="text-cyan-300 hover:text-cyan-200 transition-colors disabled:opacity-50"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                      
                      <button
                        onClick={handleLogin}
                        disabled={!formData.email || !formData.password || authLoading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {authLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Iniciando sesión...</span>
                          </>
                        ) : (
                          <span>Iniciar Sesión</span>
                        )}
                      </button>
                      
                      <div className="text-center text-sm text-cyan-200 mt-4">
                        ¿Primera vez en Ayllu? 
                        <button 
                          onClick={() => {
                            setModoAuth('registro');
                            setFormData({ email: '', nombre: '', carrera: '', password: '', confirmPassword: '' });
                            setAuthError('');
                            setAuthSuccess('');
                          }}
                          disabled={authLoading}
                          className="text-white font-semibold hover:underline ml-1 disabled:opacity-50"
                        >
                          Crear cuenta
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {modoAuth === 'registro' && (
                <div className="space-y-4">
                  {authError && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                      {authError}
                    </div>
                  )}
                  
                  {authSuccess && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm">
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">¡Cuenta creada exitosamente!</p>
                          <p className="text-xs">{authSuccess}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email Institucional</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="tu@unmsm.edu.pe"
                      disabled={authLoading}
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
                      disabled={authLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Carrera</label>
                    <select
                      value={formData.carrera}
                      onChange={(e) => setFormData({...formData, carrera: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      disabled={authLoading}
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
                      disabled={authLoading}
                    />
                    <p className="text-xs text-cyan-300 mt-1">Mínimo 6 caracteres</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Repetir Contraseña</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && !authLoading && handleRegistro()}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="••••••••"
                      disabled={authLoading}
                    />
                  </div>
                  <button
                    onClick={handleRegistro}
                    disabled={authLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creando cuenta...</span>
                      </>
                    ) : (
                      <span>Crear cuenta gratis</span>
                    )}
                  </button>
                  
                  <div className="text-center text-sm text-cyan-200 mt-4">
                    ¿Ya tienes cuenta? 
                    <button 
                      onClick={() => {
                        setModoAuth('login');
                        setFormData({ email: '', nombre: '', carrera: '', password: '', confirmPassword: '' });
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      disabled={authLoading}
                      className="text-white font-semibold hover:underline ml-1 disabled:opacity-50"
                    >
                      Iniciar sesión
                    </button>
                  </div>
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
                  disabled={(!newPost.trim() && !imagePreview) || isPosting}
                  className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-orange-700 transition-all flex items-center space-x-2"
                >
                  {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isPosting ? 'Publicando...' : 'Publicar'}</span>
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
                      <span>Seguir</span>
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
              const senderId = msg.senderId || msg.from || msg.sender_id;
              const isMe = senderId === currentUser.id;
              return (
                <div key={idx} className={`mb-3 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isMe ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gray-800'
                  }`}>
                    {msg.text || msg.content}
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
                        {(lastMessage.senderId || lastMessage.from || lastMessage.sender_id) === currentUser.id ? 'Tú: ' : ''}{lastMessage.text || lastMessage.content}
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
          {notificaciones.map(notif => {
            const notifUser = getUserById(notif.userId);
            const notifType = notif.type || notif.tipo;
            const isNew = notif.read === false || notif.nueva === true;
            
            let accion = '';
            if (notifType === 'like') accion = 'le gustó tu publicación';
            else if (notifType === 'comment' || notifType === 'comentario') accion = 'comentó tu publicación';
            else if (notifType === 'follow' || notifType === 'conexion') accion = 'comenzó a seguirte';
            else if (notifType === 'message') accion = 'te envió un mensaje';
            else accion = 'interactuó contigo';
            
            return (
              <div
                key={notif.id}
                onClick={() => marcarNotificacionLeida(notif.id)}
                className={`p-4 border-b border-gray-800 last:border-b-0 cursor-pointer transition ${
                  isNew ? 'bg-cyan-900/20 hover:bg-cyan-900/30' : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notifType === 'like' ? 'bg-red-100/10' :
                    (notifType === 'follow' || notifType === 'conexion') ? 'bg-blue-100/10' : 'bg-green-100/10'
                  }`}>
                    {notifType === 'like' && <Heart className="w-5 h-5 text-red-500" />}
                    {(notifType === 'follow' || notifType === 'conexion') && <Users className="w-5 h-5 text-blue-500" />}
                    {(notifType === 'comment' || notifType === 'comentario') && <MessageCircle className="w-5 h-5 text-green-500" />}
                    {notifType === 'message' && <Mail className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-100">
                      <span className="font-semibold">{notifUser.name}</span> {accion}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{formatTime(notif.timestamp || new Date(notif.created_at).getTime())}</p>
                  </div>
                  {isNew && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </div>
              </div>
            );
          })}
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
                <span>Seguir</span>
              </button>
            )}
            {isConnectedUser && (
              <>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-full font-bold transition-colors flex items-center space-x-2">
                  <Check size={18} />
                  <span>Siguiendo</span>
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
  // Validar que currentUser exista antes de renderizar la app
  if (pantalla === 'app' && !currentUser) {
    setPantalla('landing');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {showLikesModal && currentUser && (
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
                {currentUser?.name || 'Usuario'}
              </div>
              <img src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} alt={currentUser?.name || 'User'} className="w-10 h-10 rounded-full object-cover" />
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
