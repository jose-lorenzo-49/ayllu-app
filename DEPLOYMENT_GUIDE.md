# 🚀 GUÍA DE DESPLIEGUE A PRODUCCIÓN

## 📋 PASOS PARA MIGRAR A SUPABASE + DIGITALOCEAN

### **PASO 1: CONFIGURAR SUPABASE**

1. **Crear cuenta en Supabase:**
   - Ve a https://supabase.com
   - Crea cuenta gratuita
   - Crea nuevo proyecto "ayllu-unmsm"

2. **Ejecutar schema SQL:**
   - Ve a SQL Editor en Supabase
   - Copia y pega el contenido de `supabase-schema.sql`
   - Ejecuta el script

3. **Obtener credenciales:**
   - Ve a Settings > API
   - Copia `Project URL` y `anon public key`
   - Actualiza `.env` con tus valores reales

### **PASO 2: INSTALAR DEPENDENCIAS**

```bash
npm install @supabase/supabase-js
```

### **PASO 3: CONFIGURAR DIGITALOCEAN**

1. **Crear cuenta DigitalOcean:**
   - Ve a https://digitalocean.com
   - Crea cuenta (crédito gratis $200)

2. **Crear App Platform:**
   - Ve a Apps > Create App
   - Conecta tu repositorio GitHub
   - Selecciona "Static Site"
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Variables de entorno:**
   - Agrega `VITE_SUPABASE_URL`
   - Agrega `VITE_SUPABASE_ANON_KEY`

### **PASO 4: SETUP GITHUB**

1. **Crear repositorio:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/ayllu-unmsm.git
git push -u origin main
```

2. **Configurar secrets:**
   - Ve a Settings > Secrets and variables > Actions
   - Agrega `VITE_SUPABASE_URL`
   - Agrega `VITE_SUPABASE_ANON_KEY`
   - Agrega `DIGITALOCEAN_ACCESS_TOKEN`

### **PASO 5: MIGRAR DATOS LOCALES**

Ejecuta este script en la consola de Supabase:

```sql
-- Insertar usuarios demo
INSERT INTO users (name, username, faculty, year, bio, avatar, location) VALUES
('María Castro', 'maria_unmsm', 'Medicina', '5to año', 'Futuro médico cirujano. Amante del café ☕', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', 'Lima, Perú'),
('Carlos Mendoza', 'carlos_dev', 'Ingeniería de Sistemas', '4to año', 'Full-stack developer | Hackathons', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', 'Lima, Perú');

-- Insertar posts demo
INSERT INTO posts (user_id, content) VALUES
((SELECT id FROM users WHERE username = 'maria_unmsm'), '¡Acabo de terminar mi práctica en el Hospital Dos de Mayo! 💪'),
((SELECT id FROM users WHERE username = 'carlos_dev'), '¿Alguien para el hackathon del viernes? 🚀');
```

### **PASO 6: DEPLOY AUTOMÁTICO**

1. **Push a main:**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. **DigitalOcean detecta automáticamente:**
   - Build se ejecuta automáticamente
   - Deploy en ~3 minutos
   - URL pública disponible

### **RESULTADO FINAL:**

✅ **Backend:** Supabase (PostgreSQL + Auth + Storage)
✅ **Frontend:** DigitalOcean App Platform
✅ **CI/CD:** GitHub Actions automático
✅ **SSL:** Certificado automático
✅ **CDN:** Global por defecto

**URL final:** `https://ayllu-unmsm-xxxxx.ondigitalocean.app`

### **COSTOS:**

- **Supabase:** Gratis hasta 500MB DB
- **DigitalOcean:** $5/mes (Static Site)
- **Total:** ~$5/mes para producción completa

### **PRÓXIMOS PASOS:**

1. Dominio personalizado: `ayllu.unmsm.edu.pe`
2. Analytics con Google Analytics
3. Monitoring con Sentry
4. Backup automático de DB