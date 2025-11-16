// Este archivo contiene las vistas de renderizado para AylluIntegrado
// Importar y usar estas funciones en el componente principal

export const renderLandingPage = ({
  showLogin,
  setShowLogin,
  formError,
  loginForm,
  setLoginForm,
  handleLogin,
  registerForm,
  setRegisterForm,
  handleRegister,
  showPassword,
  setShowPassword,
  facultades,
  usersCount
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
      {/* Animated stars */}
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding */}
            <div className="text-white space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <GraduationCap size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-black">Ayllu UNMSM</h1>
                  <p className="text-cyan-300 text-lg">Comunidad Sanmarquina</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-flex items-center space-x-2">
                <Sparkles size={20} className="text-yellow-300" />
                <span className="font-medium">{usersCount} estudiantes registrados</span>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users size={24} className="text-cyan-400" />
                    <h3 className="text-xl font-bold">Conecta con Sanmarquinos</h3>
                  </div>
                  <p className="text-blue-100">Encuentra estudiantes de tu carrera y forma grupos de estudio</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Sparkles size={24} className="text-cyan-400" />
                    <h3 className="text-xl font-bold">Comparte Conocimiento</h3>
                  </div>
                  <p className="text-blue-100">Publica apuntes, recursos y ayuda a tu comunidad académica</p>
                </div>
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setShowLogin(true)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    showLogin
                      ? 'bg-white text-blue-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    !showLogin
                      ? 'bg-white text-blue-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Crear cuenta
                </button>
              </div>

              {formError && (
                <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-xl mb-4">
                  {formError}
                </div>
              )}

              {showLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="tu@unmsm.edu.pe"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                  >
                    Entrar a Ayllu
                  </button>

                  <p className="text-center text-white/60 text-sm">
                    Usuario demo: cualquier @unmsm.edu.pe / Contraseña: demo123
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Nombre completo</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Email institucional</label>
                    <input
                      type="email"
                      placeholder="tu@unmsm.edu.pe"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Facultad</label>
                    <select
                      value={registerForm.faculty}
                      onChange={(e) => setRegisterForm({...registerForm, faculty: e.target.value})}
                      className="w-full bg-white/20 backdrop-blur-sm text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value="" className="bg-gray-800">Selecciona tu facultad</option>
                      {facultades.map(f => (
                        <option key={f} value={f} className="bg-gray-800">{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Año de estudios</label>
                    <select
                      value={registerForm.year}
                      onChange={(e) => setRegisterForm({...registerForm, year: e.target.value})}
                      className="w-full bg-white/20 backdrop-blur-sm text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      {['1er año', '2do año', '3er año', '4to año', '5to año', '6to año'].map(y => (
                        <option key={y} value={y} className="bg-gray-800">{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Confirmar contraseña</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                  >
                    Crear mi cuenta
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
