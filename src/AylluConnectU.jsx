import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, UserPlus, Search, Home, Users, Mail, User, X, Check, ArrowLeft, Edit2, MapPin, Calendar, Book } from 'lucide-react';

export default function AylluConnectU() {
  // Current user (the one using the app)
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Tu Nombre',
    username: 'tu_usuario',
    faculty: 'Tu Facultad',
    year: '3er año',
    bio: 'Estudiante de San Marcos 🎓',
    avatar: '😊',
    connections: [2, 3, 4],
    location: 'Lima, Perú'
  });

  // All users in the platform
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Tu Nombre',
      username: 'tu_usuario',
      faculty: 'Tu Facultad',
      year: '3er año',
      bio: 'Estudiante de San Marcos 🎓',
      avatar: '😊',
      connections: [2, 3, 4],
      location: 'Lima, Perú'
    },
    {
      id: 2,
      name: 'María Castro',
      username: 'maria_unmsm',
      faculty: 'Medicina',
      year: '5to año',
      bio: 'Futuro médico cirujano. Amante del café y las guardias hospitalarias ☕',
      avatar: '👩‍⚕️',
      connections: [1, 3, 5],
      location: 'Lima, Perú'
    },
    {
      id: 3,
      name: 'Carlos Mendoza',
      username: 'carlos_dev',
      faculty: 'Ingeniería de Sistemas',
      year: '4to año',
      bio: 'Full-stack developer | Hackathons | Emprendedor',
      avatar: '👨‍💻',
      connections: [1, 2, 4],
      location: 'Lima, Perú'
    },
    {
      id: 4,
      name: 'Ana Flores',
      username: 'ana_letras',
      faculty: 'Letras',
      year: '2do año',
      bio: 'Amo la literatura latinoamericana 📚',
      avatar: '📚',
      connections: [1, 5, 6],
      location: 'Lima, Perú'
    },
    {
      id: 5,
      name: 'Diego Ramos',
      username: 'diego_derecho',
      faculty: 'Derecho',
      year: '5to año',
      bio: 'Debate | Derechos Humanos | Campeón nacional',
      avatar: '⚖️',
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
      avatar: '📊',
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
      avatar: '🔬',
      connections: [],
      location: 'Lima, Perú'
    },
    {
      id: 8,
      name: 'Sofía Vargas',
      username: 'sofia_arte',
      faculty: 'Arte',
      year: '1er año',
      bio: 'Pintora | Explorando el arte contemporáneo',
      avatar: '🎨',
      connections: [],
      location: 'Lima, Perú'
    }
  ]);

  // Posts from all users
  const [allPosts, setAllPosts] = useState([
    {
      id: 1,
      userId: 2,
      content: '¡Acabo de terminar mi práctica en el Hospital Dos de Mayo! La experiencia fue increíble. San Marcos nos prepara para la realidad 💪',
      likes: [1, 3, 5],
      comments: [
        { userId: 1, text: '¡Felicidades María! 🎉' },
        { userId: 3, text: 'Eres una crack!' }
      ],
      timestamp: Date.now() - 7200000
    },
    {
      id: 2,
      userId: 3,
      content: '¿Alguien para el hackathon del viernes? Necesito un equipo para desarrollar una app de delivery para la ciudad universitaria 🚀',
      likes: [1, 2],
      comments: [
        { userId: 1, text: 'Yo me anoto! Me encanta programar' }
      ],
      timestamp: Date.now() - 14400000
    },
    {
      id: 3,
      userId: 4,
      content: 'Nueva cafetería en el pabellón de Letras ☕ Los precios son accesibles y el café es buenísimo. Recomendado para estudiar',
      likes: [1, 5],
      comments: [],
      timestamp: Date.now() - 21600000
    },
    {
      id: 4,
      userId: 5,
      content: '¡San Marcos campeón de debate jurídico! 🏆 Representamos a UNMSM en el torneo nacional. Orgulloso de mi equipo',
      likes: [2, 4, 6],
      comments: [
        { userId: 2, text: 'Felicitaciones! Un orgullo' }
      ],
      timestamp: Date.now() - 28800000
    }
  ]);

  // Messages (conversations)
  const [conversations, setConversations] = useState([
    {
      id: 1,
      withUserId: 2,
      messages: [
        { from: 2, text: 'Hola! Vi que estamos en la misma universidad', timestamp: Date.now() - 3600000 },
        { from: 1, text: 'Hola María! Sí, somos compañeros sanmarquinos 😊', timestamp: Date.now() - 3000000 }
      ]
    },
    {
      id: 2,
      withUserId: 3,
      messages: [
        { from: 1, text: 'Carlos, me interesa el hackathon!', timestamp: Date.now() - 7200000 },
        { from: 3, text: 'Genial! Nos juntamos el jueves para planear?', timestamp: Date.now() - 6600000 },
        { from: 1, text: 'Perfecto, dónde nos vemos?', timestamp: Date.now() - 6000000 }
      ]
    }
  ]);

  // UI State
  const [activeView, setActiveView] = useState('feed'); // feed, connections, messages, profile, search, editProfile
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(null);

  // Get user by ID
  const getUserById = (id) => users.find(u => u.id === id);

  // Check if users are connected
  const isConnected = (userId) => currentUser.connections.includes(userId);

  // Get posts from connections only (like original ConnectU/Facebook)
  const getFeedPosts = () => {
    return allPosts
      .filter(post => currentUser.connections.includes(post.userId))
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  // Get connection suggestions (users not yet connected)
  const getSuggestions = () => {
    return users.filter(u => 
      u.id !== currentUser.id && 
      !currentUser.connections.includes(u.id)
    );
  };

  // Add connection
  const addConnection = (userId) => {
    setCurrentUser(prev => ({
      ...prev,
      connections: [...prev.connections, userId]
    }));
    setUsers(users.map(u => 
      u.id === userId 
        ? {...u, connections: [...u.connections, currentUser.id]}
        : u.id === currentUser.id
        ? {...u, connections: [...u.connections, userId]}
        : u
    ));
  };

  // Create post
  const createPost = () => {
    if (newPost.trim()) {
      const post = {
        id: allPosts.length + 1,
        userId: currentUser.id,
        content: newPost,
        likes: [],
        comments: [],
        timestamp: Date.now()
      };
      setAllPosts([post, ...allPosts]);
      setNewPost('');
    }
  };

  // Like post
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

  // Send message
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

  // Start new conversation
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

  // Update profile
  const updateProfile = () => {
    if (editingProfile) {
      setCurrentUser(editingProfile);
      setUsers(users.map(u => u.id === currentUser.id ? editingProfile : u));
      setEditingProfile(null);
      setActiveView('profile');
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Hace unos minutos';
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  // Render views
  const renderFeed = () => {
    const feedPosts = getFeedPosts();
    return (
      <div>
        {/* Create post */}
        <div className="bg-gray-900 p-4 rounded-2xl mb-4">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="¿Qué quieres compartir con tus conexiones?"
                className="w-full bg-gray-800 rounded-xl p-3 outline-none resize-none text-gray-100"
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button 
                  onClick={createPost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-orange-700 transition-all"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
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
                  <div 
                    onClick={() => {
                      setSelectedProfile(author);
                      setActiveView('viewProfile');
                    }}
                    className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {author.avatar}
                  </div>
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
                    
                    <div className="flex items-center space-x-6 mt-4">
                      <button 
                        onClick={() => likePost(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.likes.includes(currentUser.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} fill={post.likes.includes(currentUser.id) ? 'currentColor' : 'none'} />
                        <span>{post.likes.length}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-3xl">
                  {user.avatar}
                </div>
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

  const renderSearch = () => {
    const suggestions = getSuggestions();
    const filtered = searchQuery.trim()
      ? suggestions.filter(u => 
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  {user.avatar}
                </div>
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
                    <button 
                      onClick={() => {
                        setSelectedProfile(user);
                        setActiveView('viewProfile');
                      }}
                      className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-full font-bold transition-colors"
                    >
                      Ver Perfil
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
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-xl">
              {otherUser.avatar}
            </div>
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
                    isMe 
                      ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                      : 'bg-gray-800'
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
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-2xl">
                    {otherUser.avatar}
                  </div>
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

  const renderProfile = () => {
    const myConnections = users.filter(u => currentUser.connections.includes(u.id));
    return (
      <div>
        <div className="bg-gray-900 p-6 rounded-2xl mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-5xl">
                {currentUser.avatar}
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
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-5xl">
                {selectedProfile.avatar}
              </div>
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
                onClick={() => {
                  addConnection(selectedProfile.id);
                }}
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
            <label className="block text-sm font-medium mb-2">Avatar (Emoji)</label>
            <input 
              type="text"
              value={editingProfile.avatar}
              onChange={(e) => setEditingProfile({...editingProfile, avatar: e.target.value})}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 outline-none"
              placeholder="😊"
            />
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

          <div>
            <label className="block text-sm font-medium mb-2">Ubicación</label>
            <input 
              type="text"
              value={editingProfile.location}
              onChange={(e) => setEditingProfile({...editingProfile, location: e.target.value})}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 outline-none"
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Ayllu
              </div>
              <div className="text-xs text-gray-500 font-medium">San Marcos</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden md:block text-sm text-gray-400">
                {currentUser.name}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xl">
                {currentUser.avatar}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <nav className="sticky top-20 space-y-2">
              {[
                { icon: Home, label: 'Inicio', view: 'feed' },
                { icon: Search, label: 'Buscar', view: 'search' },
                { icon: Users, label: 'Conexiones', view: 'connections' },
                { icon: Mail, label: 'Mensajes', view: 'messages' },
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

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {activeView === 'feed' && renderFeed()}
            {activeView === 'connections' && renderConnections()}
            {activeView === 'search' && renderSearch()}
            {activeView === 'messages' && renderMessages()}
            {activeView === 'profile' && renderProfile()}
            {activeView === 'viewProfile' && renderViewProfile()}
            {activeView === 'editProfile' && renderEditProfile()}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
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
