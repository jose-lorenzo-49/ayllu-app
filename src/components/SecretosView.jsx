import React, { useState } from 'react';
import { Heart, MessageCircle, AlertTriangle, Send, Filter, RefreshCw, Sun, Moon, Sparkles, Lock, Shield, Edit2, X } from 'lucide-react';

const SecretosView = ({ posts, currentUser, onLike, onComment, onReport, addComment, onEditPost, onDeletePost }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${Math.floor(hours / 24)}d`;
  };

  const handleAddComment = (postId) => {
    if (!newComment[postId]?.trim()) return;
    addComment?.(postId, newComment[postId]);
    setNewComment(prev => ({ ...prev, [postId]: '' }));
  };

  const handleEditPost = (postId) => {
    if (!editPostContent.trim()) return;
    onEditPost?.(postId, editPostContent);
    setEditingPost(null);
    setEditPostContent('');
  };

  const handleDeletePost = (postId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación anónima?')) return;
    onDeletePost?.(postId);
  };

  const anonymousPosts = posts.filter(p => p.isAnonymous);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
      {/* Header Hero */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Lock className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Espacio Anónimo</h1>
              <p className="text-purple-200 text-sm">Ayllu UNMSM</p>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              🎭 Comparte sin filtros, con seguridad
            </h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Un espacio seguro para expresarte libremente. Tu identidad está protegida.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">{anonymousPosts.length}</div>
              <div className="text-xs text-purple-200">Publicaciones</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-purple-200">Anónimo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-purple-200">Disponible</div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path 
              fill={darkMode ? '#000' : '#f9fafb'} 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-40 backdrop-blur-xl bg-opacity-90`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-lg transition-all`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline text-sm font-medium">Filtros</span>
            </button>

            <button className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-lg transition-all`}>
              <RefreshCw size={18} />
              <span className="hidden sm:inline text-sm font-medium">Actualizar</span>
            </button>

            <button 
              onClick={() => setSortBy(sortBy === 'recent' ? 'popular' : 'recent')}
              className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-lg transition-all`}
            >
              <span className="text-sm font-medium">{sortBy === 'recent' ? 'Recientes' : '🔥 Populares'}</span>
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-indigo-600'} rounded-lg transition-all`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Guía de uso */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl p-6 mb-6 border`}>
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                💜 Espacio Seguro Sanmarquino
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Este es un espacio diseñado para que la comunidad UNMSM pueda expresarse libremente y de forma anónima.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={`${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-4`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className={`font-semibold text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  Bienvenido
                </span>
              </div>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Comparte experiencias personales</li>
                <li>• Pide consejos o apoyo</li>
                <li>• Desahógate con respeto</li>
                <li>• Reflexiones académicas</li>
              </ul>
            </div>

            <div className={`${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-4`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-500 text-xl">✗</span>
                <span className={`font-semibold text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                  No permitido
                </span>
              </div>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Amenazas o violencia</li>
                <li>• Contenido ilegal</li>
                <li>• Spam o publicidad</li>
                <li>• Acoso o discriminación</li>
              </ul>
            </div>
          </div>

          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              🔒 Tu privacidad es nuestra prioridad. Comparte con libertad y empatía.
            </p>
          </div>
        </div>

        {/* Posts Feed */}
        {anonymousPosts.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-12 text-center`}>
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Aún no hay publicaciones
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sé el primero en compartir algo de forma anónima
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {anonymousPosts.map((post) => (
              <div 
                key={post.id} 
                className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border hover:shadow-xl transition-all`}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">?</span>
                    </div>
                    <div>
                      <div className={`font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        Sanmarquino Anónimo
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        🎭 Incógnito • {formatTime(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.userId === currentUser?.id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingPost(post.id);
                            setEditPostContent(post.content);
                          }}
                          className={`${darkMode ? 'text-gray-600 hover:text-blue-500' : 'text-gray-400 hover:text-blue-500'} transition-colors p-1 rounded`}
                          title="Editar publicación"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className={`${darkMode ? 'text-gray-600 hover:text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors p-1 rounded`}
                          title="Eliminar publicación"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => onReport?.(post.id)}
                      className={`${darkMode ? 'text-gray-600 hover:text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                      title="Reportar contenido inapropiado"
                    >
                      <AlertTriangle size={18} />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                {editingPost === post.id ? (
                  <div className="mb-4 space-y-2">
                    <textarea
                      value={editPostContent}
                      onChange={(e) => setEditPostContent(e.target.value)}
                      className={`w-full ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} rounded-xl p-3 text-base outline-none border focus:ring-2 focus:ring-purple-500 resize-none`}
                      rows="4"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setEditingPost(null);
                          setEditPostContent('');
                        }}
                        className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-base leading-relaxed mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {post.content}
                  </p>
                )}

                {post.image && (
                  <img 
                    src={post.image} 
                    alt="Imagen anónima" 
                    className="w-full rounded-xl mb-4 max-h-96 object-cover"
                  />
                )}

                {/* Post Actions */}
                <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <button 
                      onClick={() => onLike?.(post.id)}
                      className={`flex items-center space-x-2 ${
                        post.likes?.includes(currentUser?.id) 
                          ? 'text-red-500' 
                          : darkMode ? 'text-gray-500 hover:text-red-500' : 'text-gray-400 hover:text-red-500'
                      } transition-colors`}
                    >
                      <Heart size={20} fill={post.likes?.includes(currentUser?.id) ? 'currentColor' : 'none'} />
                      <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                    </button>

                    <button 
                      onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className={`flex items-center space-x-2 ${darkMode ? 'text-gray-500 hover:text-blue-500' : 'text-gray-400 hover:text-blue-500'} transition-colors`}
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                    </button>

                    <button className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                      🔒 Protegido
                    </button>
                  </div>

                  {/* Comments Section */}
                  {showComments[post.id] && (
                    <div className={`mt-4 space-y-3 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                      {post.comments?.map((comment, idx) => (
                        <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-3`}>
                          <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">?</span>
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                Anónimo
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {comment.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Comment */}
                      <div className="flex items-center space-x-2 mt-3">
                        <input
                          type="text"
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          placeholder="Comenta de forma anónima..."
                          className={`flex-1 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} rounded-full px-4 py-2 text-sm outline-none border focus:ring-2 focus:ring-purple-500`}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComment[post.id]?.trim()}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretosView;
