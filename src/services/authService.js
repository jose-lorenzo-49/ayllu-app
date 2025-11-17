import { supabase } from '../lib/supabase';

/**
 * Servicio de Autenticación para Ayllu UNMSM
 * 
 * Flujos implementados:
 * - Login: Sin verificación de email (autoconfirm)
 * - Registro: Con verificación de email
 * - Recuperar contraseña: Con verificación de email
 */

export const authService = {
  /**
   * Registro de nuevo usuario - Auto confirmación
   * El usuario puede iniciar sesión inmediatamente
   */
  async signUp({ email, password, name, faculty, year = '1er año' }) {
    try {
      // Validar email institucional
      if (!email.endsWith('@unmsm.edu.pe')) {
        throw new Error('Debes usar tu email institucional @unmsm.edu.pe');
      }

      // Validar contraseña
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear cuenta en Supabase Auth con auto-confirmación
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            faculty,
            year
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Error al crear usuario');
      }

      // El trigger automático crea el perfil en la tabla users
      // Esperar un momento para que el trigger se ejecute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Iniciar sesión automáticamente
      const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (sessionError) throw sessionError;

      // Obtener perfil completo con reintentos
      let userData = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (!userData && attempts < maxAttempts) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (data) {
          userData = data;
          break;
        }

        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (!userData) {
        console.warn('Perfil no encontrado, creando manualmente...');
        // Si el trigger falló, crear manualmente
        const username = email.split('@')[0].toLowerCase().replace(/\./g, '_').replace(/ /g, '_');
        
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email,
            name,
            username,
            faculty,
            year,
            bio: 'Estudiante de San Marcos 🎓',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`,
            connections: []
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error insertando perfil:', insertError);
        } else {
          userData = newProfile;
        }
      }

      return {
        success: true,
        data: {
          session: sessionData,
          profile: userData
        },
        message: '¡Cuenta creada exitosamente! Bienvenido a Ayllu UNMSM.'
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.message || 'Error al crear cuenta'
      };
    }
  },

  /**
   * Login con credenciales - Sin verificación de email
   * El usuario puede iniciar sesión inmediatamente
   */
  async signIn({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Cargar datos del perfil del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.error('Error cargando perfil:', userError);
      }

      return {
        success: true,
        data: {
          ...data,
          profile: userData
        },
        message: 'Sesión iniciada exitosamente'
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : error.message || 'Error al iniciar sesión'
      };
    }
  },

  /**
   * Recuperar contraseña - Con verificación de email
   * El usuario recibirá un email para restablecer su contraseña
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Se ha enviado un email con instrucciones para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.'
      };
    } catch (error) {
      console.error('Error solicitando reset:', error);
      
      // Traducir errores comunes de Supabase al español
      let errorMessage = error.message || 'Error al solicitar restablecimiento de contraseña';
      
      if (errorMessage.includes('Email rate limit exceeded')) {
        errorMessage = 'Has excedido el límite de correos. Por favor espera 1 minuto antes de intentar nuevamente.';
      } else if (errorMessage.includes('security purposes') || errorMessage.includes('only request this after')) {
        errorMessage = 'Por seguridad, debes esperar 1 minuto antes de solicitar otro correo de recuperación.';
      } else if (errorMessage.includes('User not found')) {
        errorMessage = 'No existe una cuenta con este correo electrónico.';
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = 'El correo electrónico ingresado no es válido.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Actualizar contraseña (después de recibir el link de reset)
   */
  async updatePassword(newPassword) {
    try {
      if (newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar contraseña'
      };
    }
  },

  /**
   * Cerrar sesión
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      return {
        success: false,
        error: error.message || 'Error al cerrar sesión'
      };
    }
  },

  /**
   * Obtener sesión actual
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        // Cargar perfil del usuario
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error cargando perfil:', userError);
        }

        return {
          success: true,
          session,
          profile: userData
        };
      }

      return {
        success: false,
        session: null,
        profile: null
      };
    } catch (error) {
      console.error('Error obteniendo sesión:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Verificar si el email ya está registrado
   */
  async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      return !error && data;
    } catch (error) {
      return false;
    }
  },

  /**
   * Reenviar email de verificación
   */
  async resendVerificationEmail(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Email de verificación enviado nuevamente'
      };
    } catch (error) {
      console.error('Error reenviando email:', error);
      return {
        success: false,
        error: error.message || 'Error al reenviar email de verificación'
      };
    }
  }
};

export default authService;
