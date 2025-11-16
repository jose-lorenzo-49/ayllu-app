# 🚀 DEPLOY VERCEL - 2 MINUTOS

## 📋 PASOS SÚPER SIMPLES:

### **OPCIÓN 1: WEB (Más fácil)**

1. **Ve a https://vercel.com**
2. **Login con GitHub**
3. **Import Project** → Selecciona tu repo
4. **Configure:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables:**
   - `VITE_SUPABASE_URL` = tu_url_supabase
   - `VITE_SUPABASE_ANON_KEY` = tu_key_supabase
6. **Deploy** → ¡Listo en 1 minuto!

### **OPCIÓN 2: CLI (Más rápido)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir prompts:
# - Link to existing project? N
# - Project name: ayllu-unmsm
# - Directory: ./
# - Want to override settings? N

# Deploy a producción
vercel --prod
```

### **CONFIGURAR VARIABLES DE ENTORNO:**

```bash
# Agregar variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeploy con variables
vercel --prod
```

### **RESULTADO:**

✅ **URL:** `https://ayllu-unmsm-xxx.vercel.app`
✅ **SSL:** Automático
✅ **CDN:** Global
✅ **Deploy:** Automático en cada push
✅ **Costo:** GRATIS

### **VENTAJAS VERCEL vs DigitalOcean:**

- ✅ Deploy en 30 segundos vs 5 minutos
- ✅ Mejor manejo de SPAs
- ✅ Gratis vs $5/mes
- ✅ Más confiable
- ✅ Mejor DX (developer experience)

### **DOMINIO PERSONALIZADO (OPCIONAL):**

1. En Vercel dashboard → Settings → Domains
2. Agregar: `ayllu.unmsm.edu.pe`
3. Configurar DNS automáticamente

¡Vercel es la mejor opción para React apps! 🔥